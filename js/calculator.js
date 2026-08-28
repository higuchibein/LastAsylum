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

      // 初期選択
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
      resourceCostsEl.innerHTML = `<div style="color:var(--accent-red); padding:1rem;">データの読み込みエラーが発生しました。</div>`;
    });

  // セレクトボックスの初期化
  function initFacilitySelect() {
    facilitySelect.innerHTML = facilityData.map(fac => `
      <option value="${fac.id}">${fac.icon} ${fac.name} (Max Lv.${fac.maxLevel})</option>
    `).join('');
  }

  // 施設変更時
  function onFacilityChange() {
    const selectedId = facilitySelect.value;
    currentFacility = facilityData.find(f => f.id === selectedId);

    if (!currentFacility) return;

    // スライダーの範囲設定
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

  // イベントリスナー
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

  // 計算ロジック
  function calculate() {
    if (!currentFacility) return;

    const fromLv = parseInt(levelFromInput.value, 10);
    const toLv = parseInt(levelToInput.value, 10);
    const buffPercent = parseInt(speedBuffInput.value, 10);

    let totalRawSec = 0;
    const resourceTotals = {};

    // Lv.(fromLv+1) から Lv.toLv までのコストと時間を累計
    for (let lv = fromLv + 1; lv <= toLv; lv++) {
      const lvData = currentFacility.levels.find(l => l.level === lv);
      if (lvData) {
        totalRawSec += lvData.timeSec || 0;
        if (lvData.costs) {
          for (const [resName, amount] of Object.entries(lvData.costs)) {
            resourceTotals[resName] = (resourceTotals[resName] || 0) + amount;
          }
        }
      }
    }

    // 建設短縮バフの計算: 実効時間 = 基礎時間 / (1 + バフ率/100)
    const effectiveSec = Math.round(totalRawSec / (1 + buffPercent / 100));
    const savedSec = Math.max(0, totalRawSec - effectiveSec);

    // 時間表示の更新
    totalTimeEl.textContent = formatDuration(effectiveSec);
    rawTimeEl.textContent = `基礎時間: ${formatDuration(totalRawSec)}`;
    savedTimeEl.textContent = `短縮量: ${formatDuration(savedSec)}`;

    // 必要資材リストの更新
    const resEntries = Object.entries(resourceTotals);
    if (resEntries.length === 0) {
      resourceCostsEl.innerHTML = '<span class="material-chip">必要資材なし</span>';
    } else {
      resourceCostsEl.innerHTML = resEntries.map(([name, amount]) => `
        <div class="result-stat-card" style="text-align:left;">
          <div class="result-stat-label">🧪 ${escapeHtml(name)}</div>
          <div class="result-stat-value" style="font-size:1.2rem; color:var(--text-main);">${amount.toLocaleString()}</div>
        </div>
      `).join('');
    }

    // URL共有パラメータ更新
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

  // 共有ボタンイベント
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
                   `強化範囲: Lv.${levelFromInput.value} ➔ Lv.${levelToInput.value}\n` +
                   `建設バフ: ${speedBuffInput.value}%\n` +
                   `所要時間: ${totalTimeEl.textContent} (${rawTimeEl.textContent})\n` +
                   `URL: ${window.location.href}`;
      window.copyToClipboard(text, '計算結果テキストをコピーしました！');
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
