/**
 * Last Asylum - Hero Gear Calculator Script (js/gear_calculator.js)
 * High-precision Gear Upgrade (Lv.0 - 60) Resource & Stats Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  let gearCostsData = [];
  let gearStatsData = [];

  // DOM Elements
  const gearTypeSelect = document.getElementById('gear-type-select');
  const gearCountSelect = document.getElementById('gear-count-select');
  const gearFromSlider = document.getElementById('gear-from-slider');
  const gearFromVal = document.getElementById('gear-from-val');
  const gearToSlider = document.getElementById('gear-to-slider');
  const gearToVal = document.getElementById('gear-to-val');

  // Preset Buttons
  const btnGear0To60 = document.getElementById('btn-gear-0-60');
  const btnGear40To60 = document.getElementById('btn-gear-40-60');
  const btnGear50To60 = document.getElementById('btn-gear-50-60');

  // Result Elements
  const resGearRangeStr = document.getElementById('res-gear-range-str');
  const resGearCountStr = document.getElementById('res-gear-count-str');
  const resGearStone = document.getElementById('res-gear-stone');
  const resGearGrass = document.getElementById('res-gear-grass');
  const resGearSteel = document.getElementById('res-gear-steel');
  const resGearStoneSub = document.getElementById('res-gear-stone-sub');
  const resGearGrassSub = document.getElementById('res-gear-grass-sub');
  const resGearSteelSub = document.getElementById('res-gear-steel-sub');

  const gearSwordStatsTbody = document.getElementById('gear-sword-stats-tbody');

  // Fetch Data Sources
  Promise.all([
    fetch('data/gear_upgrade_costs.json?v=' + Date.now()).then(r => r.json()).catch(() => null),
    fetch('data/gear_stats.json?v=' + Date.now()).then(r => r.json()).catch(() => null)
  ]).then(([costsRes, statsRes]) => {
    if (costsRes && costsRes.costs) {
      gearCostsData = costsRes.costs;
    }
    if (statsRes && statsRes.sword_stats) {
      gearStatsData = statsRes.sword_stats;
    }

    renderSwordStatsTable();
    calculateAndRenderGear();
  });

  function formatNum(num) {
    return (num || 0).toLocaleString('en-US');
  }

  function formatShortNum(num) {
    if (!num || num <= 0) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  function calculateAndRenderGear() {
    if (!gearFromSlider || !gearToSlider) return;

    let fromLv = parseInt(gearFromSlider.value, 10) || 0;
    let toLv = parseInt(gearToSlider.value, 10) || 0;

    // Automatic bounds check
    if (fromLv >= toLv) {
      if (toLv < 60) {
        toLv = fromLv + 1;
        gearToSlider.value = toLv;
      } else {
        fromLv = 59;
        gearFromSlider.value = 59;
      }
    }

    if (gearFromVal) gearFromVal.textContent = `Lv.${fromLv}`;
    if (gearToVal) gearToVal.textContent = `Lv.${toLv}`;
    if (resGearRangeStr) resGearRangeStr.textContent = `${fromLv} ➔ ${toLv}`;

    const countMult = parseInt(gearCountSelect ? gearCountSelect.value : '1', 10) || 1;
    if (resGearCountStr) {
      resGearCountStr.textContent = countMult === 4 ? '（4部位フルセット）' : '（1部位）';
    }

    let totalStone = 0;
    let totalGrassRaw = 0;
    let totalSteel = 0;

    if (gearCostsData && gearCostsData.length > 0) {
      gearCostsData.forEach(item => {
        if (item.from_level >= fromLv && item.to_level <= toLv) {
          totalStone += (item.stone || 0);
          totalGrassRaw += (item.grass_raw || 0);
          totalSteel += (item.steel || 0);
        }
      });
    }

    totalStone *= countMult;
    totalGrassRaw *= countMult;
    totalSteel *= countMult;

    if (resGearStone) resGearStone.textContent = formatNum(totalStone);
    if (resGearStoneSub) resGearStoneSub.textContent = `(${formatShortNum(totalStone)})`;

    if (resGearGrass) resGearGrass.textContent = formatNum(totalGrassRaw);
    if (resGearGrassSub) resGearGrassSub.textContent = `(${formatShortNum(totalGrassRaw)})`;

    if (resGearSteel) resGearSteel.textContent = formatNum(totalSteel);
    if (resGearSteelSub) resGearSteelSub.textContent = `(${formatShortNum(totalSteel)})`;
  }

  function renderSwordStatsTable() {
    if (!gearSwordStatsTbody || !gearStatsData || gearStatsData.length === 0) return;

    gearSwordStatsTbody.innerHTML = gearStatsData.map(item => {
      const isMax = item.level === 60;
      const rowStyle = isMax ? 'style="background: rgba(255,215,0,0.08);"' : '';
      const lvStr = isMax ? `LV${item.level} ★${item.star} (最大)` : `LV${item.level} ★${item.star}`;
      const lvColor = isMax ? 'style="color: var(--accent-gold); font-weight: 800;"' : 'style="color: #fff; font-weight: 700;"';

      return `
        <tr ${rowStyle}>
          <td><strong ${lvColor}>${lvStr}</strong></td>
          <td style="color: var(--accent-gold); font-weight: 700;">+${formatNum(item.hero_attack)}</td>
          <td style="color: var(--text-color);">+${formatNum(item.hero_defense)}</td>
          <td style="color: var(--accent-gold); font-weight: 700;">+${item.hero_attack_up_percent.toFixed(1)}%</td>
          <td style="color: var(--accent-blue); font-weight: 800;">+${item.crit_rate_up_percent.toFixed(1)}%</td>
        </tr>
      `;
    }).join('');
  }

  // Event Listeners
  if (gearFromSlider) {
    gearFromSlider.addEventListener('input', calculateAndRenderGear);
  }
  if (gearToSlider) {
    gearToSlider.addEventListener('input', calculateAndRenderGear);
  }
  if (gearTypeSelect) {
    gearTypeSelect.addEventListener('change', calculateAndRenderGear);
  }
  if (gearCountSelect) {
    gearCountSelect.addEventListener('change', calculateAndRenderGear);
  }

  // Preset Buttons Handlers
  if (btnGear0To60) {
    btnGear0To60.addEventListener('click', () => {
      if (gearFromSlider) gearFromSlider.value = 0;
      if (gearToSlider) gearToSlider.value = 60;
      calculateAndRenderGear();
    });
  }
  if (btnGear40To60) {
    btnGear40To60.addEventListener('click', () => {
      if (gearFromSlider) gearFromSlider.value = 40;
      if (gearToSlider) gearToSlider.value = 60;
      calculateAndRenderGear();
    });
  }
  if (btnGear50To60) {
    btnGear50To60.addEventListener('click', () => {
      if (gearFromSlider) gearFromSlider.value = 50;
      if (gearToSlider) gearToSlider.value = 60;
      calculateAndRenderGear();
    });
  }
});
