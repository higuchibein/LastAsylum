/**
 * Last Asylum Strategy Wiki - Real Data Building Calculator (calculator.js)
 * Added Resource Discount Buff (Max 20%) & Speed Buff (Max 200%)
 */

document.addEventListener('DOMContentLoaded', () => {
  let facilityData = [];
  let currentFacility = null;

  const facilitySelect = document.getElementById('facility-select');
  const levelFromInput = document.getElementById('level-from');
  const levelToInput = document.getElementById('level-to');
  const levelFromVal = document.getElementById('level-from-val');
  const levelToVal = document.getElementById('level-to-val');
  const speedBuffInput = document.getElementById('speed-buff');
  const speedBuffVal = document.getElementById('speed-buff-val');
  const resourceBuffInput = document.getElementById('resource-buff');
  const resourceBuffVal = document.getElementById('resource-buff-val');

  const totalTimeEl = document.getElementById('total-time');
  const rawTimeEl = document.getElementById('raw-time');
  const resourceCostsEl = document.getElementById('resource-costs');
  const prereqBoxEl = document.getElementById('prereq-box');
  const shareBtn = document.getElementById('share-btn');
  const copyResultBtn = document.getElementById('copy-result-btn');

  // URLパラメータの読み込み
  const urlParams = new URLSearchParams(window.location.search);
  const paramFac = urlParams.get('fac');
  const paramFrom = parseInt(urlParams.get('from'), 10);
  const paramTo = parseInt(urlParams.get('to'), 10);
  const paramBuff = parseInt(urlParams.get('buff'), 10);
  const paramResBuff = parseInt(urlParams.get('resbuff'), 10);

  fetch('data/facility_costs.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      facilityData = data;
      initSelect();

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
        speedBuffInput.value = Math.min(200, Math.max(0, paramBuff));
      }
      if (!isNaN(paramResBuff)) {
        resourceBuffInput.value = Math.min(20, Math.max(0, paramResBuff));
      }

      updateLabels();
      calculate();
    })
    .catch(err => {
      console.error(err);
      if (resourceCostsEl) resourceCostsEl.innerHTML = '<div style="color:var(--accent-red);">データ読込エラーが発生しました</div>';
    });

  function initSelect() {
    facilitySelect.innerHTML = facilityData.map(f => `<option value="${f.id}">${f.icon || '🏛️'} ${f.name} (Max Lv.${f.maxLevel})</option>`).join('');
  }

  function onFacilityChange() {
    currentFacility = facilityData.find(f => f.id === facilitySelect.value);
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

    updateLabels();
    calculate();
  }

  function updateLabels() {
    levelFromVal.textContent = `Lv.${levelFromInput.value}`;
    levelToVal.textContent = `Lv.${levelToInput.value}`;
    speedBuffVal.textContent = `${speedBuffInput.value}%`;
    resourceBuffVal.textContent = `${resourceBuffInput.value}%`;
  }

  facilitySelect.addEventListener('change', onFacilityChange);
  levelFromInput.addEventListener('input', () => {
    if (parseInt(levelFromInput.value, 10) >= parseInt(levelToInput.value, 10)) {
      levelToInput.value = parseInt(levelFromInput.value, 10) + 1;
    }
    updateLabels();
    calculate();
  });
  levelToInput.addEventListener('input', () => {
    if (parseInt(levelToInput.value, 10) <= parseInt(levelFromInput.value, 10)) {
      levelFromInput.value = Math.max(1, parseInt(levelToInput.value, 10) - 1);
    }
    updateLabels();
    calculate();
  });
  speedBuffInput.addEventListener('input', () => {
    updateLabels();
    calculate();
  });
  resourceBuffInput.addEventListener('input', () => {
    updateLabels();
    calculate();
  });

  function calculate() {
    if (!currentFacility) return;

    const fromLv = parseInt(levelFromInput.value, 10);
    const toLv = parseInt(levelToInput.value, 10);
    const speedBuff = parseInt(speedBuffInput.value, 10);
    const resBuff = parseInt(resourceBuffInput.value, 10);

    let totalRawSec = 0;
    const totalsRaw = { wood: 0, grain: 0, herb: 0 };
    const prereqs = {};

    for (let lv = fromLv + 1; lv <= toLv; lv++) {
      const lvData = currentFacility.levels.find(l => l.level === lv);
      if (lvData) {
        totalRawSec += lvData.time_seconds || 0;
        totalsRaw.wood += lvData.wood || 0;
        totalsRaw.grain += lvData.grain || 0;
        totalsRaw.herb += lvData.herb || 0;

        if (lvData.prerequisites) {
          for (const [pName, pLv] of Object.entries(lvData.prerequisites)) {
            prereqs[pName] = Math.max(prereqs[pName] || 0, pLv);
          }
        }
      }
    }

    const effectiveSec = Math.round(totalRawSec / (1 + speedBuff / 100));

    totalTimeEl.textContent = formatTime(effectiveSec);
    rawTimeEl.textContent = `基礎時間: ${formatTime(totalRawSec)}`;

    // 資源削減バフ適用後の実効計算 (1 - resBuff/100)
    const discountMultiplier = Math.max(0, 1 - resBuff / 100);
    const totalsEffective = {
      wood: Math.round(totalsRaw.wood * discountMultiplier),
      grain: Math.round(totalsRaw.grain * discountMultiplier),
      herb: Math.round(totalsRaw.herb * discountMultiplier)
    };

    const resMap = [
      { name: '🪵 木材 (Wood)', raw: totalsRaw.wood, val: totalsEffective.wood },
      { name: '🌾 穀物・食料 (Grain)', raw: totalsRaw.grain, val: totalsEffective.grain },
      { name: '🌿 薬草・ハーブ (Herb)', raw: totalsRaw.herb, val: totalsEffective.herb }
    ];

    const activeRes = resMap.filter(r => r.raw > 0);
    if (activeRes.length === 0) {
      resourceCostsEl.innerHTML = '<div>必要資材なし</div>';
    } else {
      resourceCostsEl.innerHTML = activeRes.map(r => `
        <div class="res-stat">
          <div style="font-size:0.8rem; color:var(--text-muted);">${r.name}</div>
          <div class="res-val">${r.val.toLocaleString()}</div>
          ${resBuff > 0 ? `<div style="font-size:0.75rem; color:var(--accent-blue); margin-top:0.2rem;">(元: ${r.raw.toLocaleString()} / 削減 -${resBuff}%)</div>` : ''}
        </div>
      `).join('');
    }

    const prereqList = Object.entries(prereqs);
    if (prereqList.length > 0) {
      prereqBoxEl.style.display = 'block';
      prereqBoxEl.innerHTML = `
        <div style="font-size:0.85rem; color:var(--accent-gold); font-weight:700; margin-bottom:0.4rem;">⚠️ 建設解放に必要な前提施設:</div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${prereqList.map(([pName, pLv]) => `<span style="background:var(--bg-primary); padding:0.2rem 0.5rem; border-radius:4px; font-size:0.8rem;">🏛️ ${escapeHtml(pName)} Lv.${pLv}</span>`).join('')}
        </div>
      `;
    } else {
      prereqBoxEl.style.display = 'none';
    }
  }

  function formatTime(sec) {
    if (sec <= 0) return '即時';
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}日`);
    if (h > 0) parts.push(`${h}時間`);
    if (m > 0) parts.push(`${m}分`);
    if (s > 0 && d === 0) parts.push(`${s}秒`);
    return parts.join(' ');
  }

  if (shareBtn) shareBtn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('fac', facilitySelect.value);
    url.searchParams.set('from', levelFromInput.value);
    url.searchParams.set('to', levelToInput.value);
    url.searchParams.set('buff', speedBuffInput.value);
    url.searchParams.set('resbuff', resourceBuffInput.value);
    window.copyToClipboard(url.toString(), '共有URLをコピーしました');
  });

  if (copyResultBtn) copyResultBtn.addEventListener('click', () => {
    const text = `【Last Asylum 施設計算】\n施設: ${currentFacility.name}\nLv.${levelFromInput.value} ➔ Lv.${levelToInput.value}\n短縮バフ: ${speedBuffInput.value}%\n資源削減バフ: ${resourceBuffInput.value}%\n所要時間: ${totalTimeEl.textContent}`;
    window.copyToClipboard(text, '計算結果をコピーしました');
  });

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
