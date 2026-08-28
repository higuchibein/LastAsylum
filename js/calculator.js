/**
 * ラストアサイラム攻略Webサイト - 施設強化・資源計算機スクリプト (calculator.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  let facilityData = [];
  let currentFacility = null;

  // DOM要素
  const facilitySelect = document.getElementById('facility-select');
  const levelFromInput = document.getElementById('level-from');
  const levelToInput = document.getElementById('level-to');
  const levelFromVal = document.getElementById('level-from-val');
  const levelToVal = document.getElementById('level-to-val');
  const speedBuffInput = document.getElementById('speed-buff');
  const speedBuffVal = document.getElementById('speed-buff-val');
  
  const totalTimeEl = document.getElementById('total-time');
  const rawTimeEl = document.getElementById('raw-time');
  const savedTimeEl = document.getElementById('saved-time');
  const resourceCostsEl = document.getElementById('resource-costs');
  const prereqBoxEl = document.getElementById('prereq-box');
  const shareBtn = document.getElementById('share-btn');
  const copyResultBtn = document.getElementById('copy-result-btn');

  // URLパラメータの初期設定読み込み
  const urlParams = new URLSearchParams(window.location.search);
  const paramFac = urlParams.get('fac');
  const paramFrom = parseInt(urlParams.get('from'), 10);
  const paramTo = parseInt(urlParams.get('to'), 10);
  const paramBuff = parseInt(urlParams.get('buff'), 10);

  // データロード
  fetch('data/facility_costs.json')
    .then(res => {
      if (!res.ok) throw new Error('施設コストデータの取得に失敗しました');
      return res.json();
    })
    .then(data => {
      facilityData = data;
      initFacilitySelect();

      if (paramFac && facilityData.some(f => f.id === paramFac)) {
        facilitySelect.value = paramFac;
      }
      onFacilityChange();

      if (!isNaN(paramFrom)) {
        levelFromInput.value = paramFrom;
        levelFromVal.textContent = `Lv.${paramFrom}`;
      }
      if (!isNaN(paramTo)) {
        levelToInput.value = paramTo;
        levelToVal.textContent = `Lv.${paramTo}`;
      }
      if (!isNaN(paramBuff)) {
        speedBuffInput.value = paramBuff;
        speedBuffVal.textContent = `${paramBuff}%`;
      }

      calculate();
    })
    .catch(err => {
      console.error(err);
      if (resourceCostsEl) {
        resourceCostsEl.innerHTML = `<div style="color:var(--accent-red); padding:1rem;">データの読み込みエラーが発生しました。</div>`;
      }
    });

  function initFacilitySelect() {
    facilitySelect.innerHTML = facilityData.map(fac => `
      <option value="${fac.id}">${fac.icon} ${fac.name} (Max Lv.${fac.maxLevel})</option>
    `).join('');
  }

  function onFacilityChange() {
    const selectedId = facilitySelect.value;
    currentFacility = facilityData.find(f => f.id === selectedId);

    if (!currentFacility) return;

    const maxLv = currentFacility.maxLevel;
    levelFromInput.max = maxLv - 1;
    levelToInput.max = maxLv;

    let fromVal = parseInt(levelFromInput.value, 10);
    let toVal = parseInt(levelToInput.value, 10);

    if (fromVal >= maxLv) fromVal = 1;
    if (toVal > maxLv || toVal <= fromVal) toVal = Math.min(fromVal + 5, maxLv);

    levelFromInput.value = fromVal;
    levelToInput.value = toVal;

    updateBadgeLabels();
    calculate();
  }

  function updateBadgeLabels() {
    levelFromVal.textContent = `Lv.${levelFromInput.value}`;
    levelToVal.textContent = `Lv.${levelToInput.value}`;
    speedBuffVal.textContent = `${speedBuffInput.value}%`;
  }

  facilitySelect.addEventListener('change', onFacilityChange);

  levelFromInput.addEventListener('input', () => {
    let fromVal = parseInt(levelFromInput.value, 10);
    let toVal = parseInt(levelToInput.value, 10);
    if (fromVal >= toVal) {
      toVal = fromVal + 1;
      levelToInput.value = toVal;
    }
    updateBadgeLabels();
    calculate();
  });

  levelToInput.addEventListener('input', () => {
    let fromVal = parseInt(levelFromInput.value, 10);
    let toVal = parseInt(levelToInput.value, 10);
    if (toVal <= fromVal) {
      fromVal = Math.max(1, toVal - 1);
      levelFromInput.value = fromVal;
    }
    updateBadgeLabels();
    calculate();
  });

  speedBuffInput.addEventListener('input', () => {
    updateBadgeLabels();
    calculate();
  });

  // 新計算ロジック (wood, food, steel, oil, time_seconds, prerequisites)
  function calculate() {
    if (!currentFacility) return;

    const fromLv = parseInt(levelFromInput.value, 10);
    const toLv = parseInt(levelToInput.value, 10);
    const buffPercent = parseInt(speedBuffInput.value, 10);

    let totalRawSec = 0;
    const totals = { wood: 0, food: 0, steel: 0, oil: 0 };
    const mergedPrereqs = {};

    for (let lv = fromLv + 1; lv <= toLv; lv++) {
      const lvData = currentFacility.levels.find(l => l.level === lv);
      if (lvData) {
        totalRawSec += lvData.time_seconds || lvData.timeSec || 0;

        // 資源集計
        if (lvData.wood) totals.wood += lvData.wood;
        if (lvData.food) totals.food += lvData.food;
        if (lvData.steel) totals.steel += lvData.steel;
        if (lvData.oil) totals.oil += lvData.oil;

        // 旧プロパティとの後方互換
        if (lvData.costs) {
          if (lvData.costs["強化鋼鉄"]) totals.steel += lvData.costs["強化鋼鉄"];
          if (lvData.costs["プラズマコア"]) totals.oil += lvData.costs["プラズマコア"] * 100;
        }

        // 前提条件の集計
        if (lvData.prerequisites) {
          for (const [preFac, preReqLv] of Object.entries(lvData.prerequisites)) {
            mergedPrereqs[preFac] = Math.max(mergedPrereqs[preFac] || 0, preReqLv);
          }
        }
      }
    }

    // 建設短縮バフ計算
    const effectiveSec = Math.round(totalRawSec / (1 + buffPercent / 100));
    const savedSec = Math.max(0, totalRawSec - effectiveSec);

    totalTimeEl.textContent = formatDuration(effectiveSec);
    rawTimeEl.textContent = `基礎時間: ${formatDuration(totalRawSec)}`;
    savedTimeEl.textContent = `短縮量: ${formatDuration(savedSec)}`;

    // 必要資材表示
    const resMap = [
      { key: 'wood', name: '木材 (Wood)', icon: '🪵' },
      { key: 'food', name: '食料 (Food)', icon: '🌾' },
      { key: 'steel', name: '鋼鉄 (Steel)', icon: '⚙️' },
      { key: 'oil', name: 'オイル (Oil)', icon: '🛢️' }
    ];

    const activeRes = resMap.filter(r => totals[r.key] > 0);

    if (activeRes.length === 0) {
      resourceCostsEl.innerHTML = '<span class="material-chip">必要資材なし</span>';
    } else {
      resourceCostsEl.innerHTML = activeRes.map(r => `
        <div class="result-stat-card" style="text-align:left;">
          <div class="result-stat-label">${r.icon} ${r.name}</div>
          <div class="result-stat-value" style="font-size:1.2rem; color:var(--text-main);">${totals[r.key].toLocaleString()}</div>
        </div>
      `).join('');
    }

    // 前提条件表示
    if (prereqBoxEl) {
      const prereqEntries = Object.entries(mergedPrereqs);
      if (prereqEntries.length > 0) {
        prereqBoxEl.style.display = 'block';
        prereqBoxEl.innerHTML = `
          <div style="font-size:0.85rem; font-weight:700; color:var(--accent-gold); margin-bottom:0.4rem;">⚠️ 建設解放に必要な前提施設条件:</div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${prereqEntries.map(([fName, rLv]) => `<span class="material-chip" style="border-color:var(--accent-gold);">🏛️ ${escapeHtml(fName)} Lv.${rLv}</span>`).join('')}
          </div>
        `;
      } else {
        prereqBoxEl.style.display = 'none';
      }
    }

    updateShareUrl(currentFacility.id, fromLv, toLv, buffPercent);
  }

  function formatDuration(totalSeconds) {
    if (totalSeconds <= 0) return '即時';
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}日`);
    if (hours > 0) parts.push(`${hours}時間`);
    if (minutes > 0) parts.push(`${minutes}分`);
    if (seconds > 0 && days === 0) parts.push(`${seconds}秒`);
    return parts.join(' ') || '0秒';
  }

  function updateShareUrl(facId, fromLv, toLv, buff) {
    const url = new URL(window.location.href);
    url.searchParams.set('fac', facId);
    url.searchParams.set('from', fromLv);
    url.searchParams.set('to', toLv);
    url.searchParams.set('buff', buff);
    window.history.replaceState({}, '', url.toString());
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      window.copyToClipboard(window.location.href, '計算設定の共有リンクをコピーしました！');
    });
  }

  if (copyResultBtn) {
    copyResultBtn.addEventListener('click', () => {
      if (!currentFacility) return;
      const text = `【ラストアサイラム 施設強化計算】\n` +
                   `施設: ${currentFacility.name}\n` +
                   `強化: Lv.${levelFromInput.value} ➔ Lv.${levelToInput.value}\n` +
                   `短縮バフ: ${speedBuffInput.value}%\n` +
                   `実効所要時間: ${totalTimeEl.textContent}\n` +
                   `URL: ${window.location.href}`;
      window.copyToClipboard(text, '計算結果テキストをコピーしました！');
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
