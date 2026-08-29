/**
 * Last Asylum Strategy Wiki - Real Data Building Calculator (calculator.js)
 * Enhanced UX: Direct Number Input & Dynamic Level Floor Control (To >= From + 1)
 */

document.addEventListener('DOMContentLoaded', () => {
  let facilityData = [];
  let currentFacility = null;

  // Elements
  const facilitySelect = document.getElementById('facility-select');
  
  const levelFromInput = document.getElementById('level-from');
  const levelFromNum = document.getElementById('level-from-num');
  
  const levelToInput = document.getElementById('level-to');
  const levelToNum = document.getElementById('level-to-num');
  
  const speedBuffInput = document.getElementById('speed-buff');
  const speedBuffNum = document.getElementById('speed-buff-num');
  
  const resourceBuffInput = document.getElementById('resource-buff');
  const resourceBuffNum = document.getElementById('resource-buff-num');

  const totalTimeEl = document.getElementById('total-time');
  const rawTimeEl = document.getElementById('raw-time');
  const resourceCostsEl = document.getElementById('resource-costs');
  const prereqBoxEl = document.getElementById('prereq-box');
  const shareBtn = document.getElementById('share-btn');
  const copyResultBtn = document.getElementById('copy-result-btn');

  // URL Params
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

      if (!isNaN(paramFrom)) setLevelFrom(paramFrom);
      if (!isNaN(paramTo)) setLevelTo(paramTo);
      if (!isNaN(paramBuff)) setSpeedBuff(paramBuff);
      if (!isNaN(paramResBuff)) setResourceBuff(paramResBuff);

      validateAndCalculate();
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
    levelFromNum.max = maxLv - 1;
    
    levelToInput.max = maxLv;
    levelToNum.max = maxLv;

    let fromVal = parseInt(levelFromInput.value, 10);
    let toVal = parseInt(levelToInput.value, 10);

    if (fromVal >= maxLv) fromVal = 1;
    if (toVal > maxLv || toVal <= fromVal) toVal = Math.min(fromVal + 5, maxLv);

    setLevelFrom(fromVal);
    setLevelTo(toVal);

    validateAndCalculate();
  }

  // --- Input Sync & Validation Helpers ---
  function setLevelFrom(val) {
    if (!currentFacility) return;
    const maxLv = currentFacility.maxLevel;
    val = Math.max(1, Math.min(maxLv - 1, val));
    
    levelFromInput.value = val;
    levelFromNum.value = val;

    // Dynamically update Level To floor limit (levelTo >= levelFrom + 1)
    const minTo = val + 1;
    levelToInput.min = minTo;
    levelToNum.min = minTo;

    let currentTo = parseInt(levelToInput.value, 10);
    if (currentTo < minTo) {
      setLevelTo(minTo);
    }
  }

  function setLevelTo(val) {
    if (!currentFacility) return;
    const maxLv = currentFacility.maxLevel;
    const minTo = parseInt(levelFromInput.value, 10) + 1;
    val = Math.max(minTo, Math.min(maxLv, val));

    levelToInput.value = val;
    levelToNum.value = val;
  }

  function setSpeedBuff(val) {
    val = Math.max(0, Math.min(200, val));
    speedBuffInput.value = val;
    speedBuffNum.value = val;
  }

  function setResourceBuff(val) {
    val = Math.max(0, Math.min(20, val));
    resourceBuffInput.value = val;
    resourceBuffNum.value = val;
  }

  // --- Event Listeners ---
  facilitySelect.addEventListener('change', onFacilityChange);

  // Level From Sync
  levelFromInput.addEventListener('input', (e) => {
    setLevelFrom(parseInt(e.target.value, 10) || 1);
    validateAndCalculate();
  });
  levelFromNum.addEventListener('input', (e) => {
    setLevelFrom(parseInt(e.target.value, 10) || 1);
    validateAndCalculate();
  });

  // Level To Sync (Enforce >= Level From + 1)
  levelToInput.addEventListener('input', (e) => {
    setLevelTo(parseInt(e.target.value, 10) || (parseInt(levelFromInput.value, 10) + 1));
    validateAndCalculate();
  });
  levelToNum.addEventListener('input', (e) => {
    setLevelTo(parseInt(e.target.value, 10) || (parseInt(levelFromInput.value, 10) + 1));
    validateAndCalculate();
  });

  // Speed Buff Sync
  speedBuffInput.addEventListener('input', (e) => {
    setSpeedBuff(parseInt(e.target.value, 10) || 0);
    validateAndCalculate();
  });
  speedBuffNum.addEventListener('input', (e) => {
    setSpeedBuff(parseInt(e.target.value, 10) || 0);
    validateAndCalculate();
  });

  // Resource Buff Sync
  resourceBuffInput.addEventListener('input', (e) => {
    setResourceBuff(parseInt(e.target.value, 10) || 0);
    validateAndCalculate();
  });
  resourceBuffNum.addEventListener('input', (e) => {
    setResourceBuff(parseInt(e.target.value, 10) || 0);
    validateAndCalculate();
  });

  // --- Calculation Logic ---
  function validateAndCalculate() {
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
