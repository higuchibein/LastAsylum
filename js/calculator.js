/**
 * Last Asylum Strategy Wiki - Building Calculator Script (calculator.js)
 * Standard Japanese Name Alignment
 */

document.addEventListener('DOMContentLoaded', () => {
  let facilityData = [];
  let currentFacility = null;

  // 前提施設名の英語➔基準日本語名変換マップ
  const prereqNameMap = {
    "Sanctuary": "協会",
    "Research Lab": "研究室",
    "Builders Hut": "建築作業小屋",
    "Alliance Hall": "ギルド連絡所",
    "Training Grounds": "訓練場",
    "Antitoxin Workshop": "抗毒剤工房",
    "Farm": "農場",
    "Lumberyard": "伐採場",
    "Herb Garden": "薬草園",
    "Warrior Statue": "ウォーリア像",
    "Ranger Statue": "レンジャー像",
    "Warlock Statue": "ソーサラー像",
    "Infirmary": "病院",
    "Barracks": "兵営",
    "Tavern": "酒場",
    "Walls": "城壁",
    "Granary": "食料倉庫",
    "Lumber Depot": "木材倉庫",
    "Herb Storage": "薬材倉庫",
    "Scout Squad": "偵察隊",
    "Squad": "小隊",
    "Smelting Workshop": "製錬工房",
    "Weaving Workshop": "織物工房",
    "Gear Workshop": "装備工房",
    "Watchtower": "見張り塔",
    "Raven Workshop": "レイヴンの工房"
  };

  const facilitySelect = document.getElementById('facility-select');
  const levelFromInput = document.getElementById('level-from');
  const levelToInput = document.getElementById('level-to');
  const levelFromVal = document.getElementById('level-from-val');
  const levelToVal = document.getElementById('level-to-val');
  const speedBuffInput = document.getElementById('speed-buff');
  const speedBuffVal = document.getElementById('speed-buff-val');

  const totalTimeEl = document.getElementById('total-time');
  const rawTimeEl = document.getElementById('raw-time');
  const resourceCostsEl = document.getElementById('resource-costs');
  const prereqBoxEl = document.getElementById('prereq-box');
  const shareBtn = document.getElementById('share-btn');
  const copyResultBtn = document.getElementById('copy-result-btn');

  fetch('data/facility_costs.json')
    .then(res => res.json())
    .then(data => {
      facilityData = data;
      initSelect();
      calculate();
    })
    .catch(err => {
      console.error(err);
      if (resourceCostsEl) resourceCostsEl.innerHTML = '<div style="color:var(--accent-red);">データ読込エラー</div>';
    });

  function initSelect() {
    facilitySelect.innerHTML = facilityData.map(f => `<option value="${f.id}">${f.icon || '🏛️'} ${f.name} (Max Lv.${f.maxLevel})</option>`).join('');
    onFacilityChange();
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

  function calculate() {
    if (!currentFacility) return;

    const fromLv = parseInt(levelFromInput.value, 10);
    const toLv = parseInt(levelToInput.value, 10);
    const buff = parseInt(speedBuffInput.value, 10);

    let totalRawSec = 0;
    const totals = { wood: 0, grain: 0, herb: 0 };
    const prereqs = {};

    for (let lv = fromLv + 1; lv <= toLv; lv++) {
      const lvData = currentFacility.levels.find(l => l.level === lv);
      if (lvData) {
        totalRawSec += lvData.time_seconds || 0;
        totals.wood += lvData.wood || 0;
        totals.grain += lvData.grain || 0;
        totals.herb += lvData.herb || 0;

        if (lvData.prerequisites) {
          for (const [pName, pLv] of Object.entries(lvData.prerequisites)) {
            const jpName = prereqNameMap[pName] || pName;
            prereqs[jpName] = Math.max(prereqs[jpName] || 0, pLv);
          }
        }
      }
    }

    const effectiveSec = Math.round(totalRawSec / (1 + buff / 100));

    totalTimeEl.textContent = formatTime(effectiveSec);
    rawTimeEl.textContent = `基礎時間: ${formatTime(totalRawSec)}`;

    const resMap = [
      { name: '🪵 木材 (Wood)', val: totals.wood },
      { name: '🌾 穀物・食料 (Grain)', val: totals.grain },
      { name: '🌿 薬草・ハーブ (Herb)', val: totals.herb }
    ];

    const activeRes = resMap.filter(r => r.val > 0);
    if (activeRes.length === 0) {
      resourceCostsEl.innerHTML = '<div>必要資材なし</div>';
    } else {
      resourceCostsEl.innerHTML = activeRes.map(r => `
        <div class="res-stat">
          <div style="font-size:0.8rem; color:var(--text-muted);">${r.name}</div>
          <div class="res-val">${r.val.toLocaleString()}</div>
        </div>
      `).join('');
    }

    const prereqList = Object.entries(prereqs);
    if (prereqList.length > 0) {
      prereqBoxEl.style.display = 'block';
      prereqBoxEl.innerHTML = `
        <div style="font-size:0.85rem; color:var(--accent-gold); font-weight:700; margin-bottom:0.4rem;">⚠️ 建設解放に必要な前提施設:</div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${prereqList.map(([pName, pLv]) => `<span style="background:var(--bg-primary); padding:0.2rem 0.5rem; border-radius:4px; font-size:0.8rem;">🏛️ ${pName} Lv.${pLv}</span>`).join('')}
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

  if (shareBtn) shareBtn.addEventListener('click', () => window.copyToClipboard(window.location.href, '共有URLをコピーしました'));
  if (copyResultBtn) copyResultBtn.addEventListener('click', () => {
    const text = `【Last Asylum 施設計算】\n施設: ${currentFacility.name}\nLv.${levelFromInput.value} ➔ Lv.${levelToInput.value}\n所要時間: ${totalTimeEl.textContent}`;
    window.copyToClipboard(text, '計算結果をコピーしました');
  });
});
