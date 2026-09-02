/**
 * Last Asylum - Hero & Skill Calculator Script (js/hero_calculator.js)
 * Data Sources:
 * 1. data/satorimeta_heroes_full.json
 * 2. data/skill_levels.json
 */

document.addEventListener('DOMContentLoaded', () => {
  let satorimetaHeroes = [];
  let skillLevelsData = [];
  let currentHero = null;

  // DOM Elements
  const heroSelect = document.getElementById('hero-select');
  const heroLvSlider = document.getElementById('hero-lv-slider');
  const heroLvVal = document.getElementById('hero-lv-val');
  const starSlider = document.getElementById('star-slider');
  const starVal = document.getElementById('star-val');
  const skillLvSlider = document.getElementById('skill-lv-slider');
  const skillLvVal = document.getElementById('skill-lv-val');

  // Preset Buttons
  const btnInit = document.getElementById('preset-init');
  const btnMid = document.getElementById('preset-mid');
  const btnMax = document.getElementById('preset-max');

  // Result Elements
  const resRarityBadge = document.getElementById('res-rarity-badge');
  const resFactionBadge = document.getElementById('res-faction-badge');
  const resHeroName = document.getElementById('res-hero-name');
  const resHeroRole = document.getElementById('res-hero-role');
  const resHonorBonus = document.getElementById('res-honor-bonus');

  const statAtk = document.getElementById('stat-atk');
  const statHp = document.getElementById('stat-hp');
  const statDef = document.getElementById('stat-def');
  const statCmd = document.getElementById('stat-cmd');

  const skillsListContainer = document.getElementById('skills-list-container');
  const awakeningSection = document.getElementById('awakening-section');
  const awakeningListContainer = document.getElementById('awakening-list-container');

  // Fetch Data Sources
  Promise.all([
    fetch('data/satorimeta_heroes_full.json?v=' + Date.now()).then(r => r.json()).catch(() => null),
    fetch('data/skill_levels.json?v=' + Date.now()).then(r => r.json()).catch(() => null)
  ]).then(([satoriRes, skillRes]) => {
    if (satoriRes && satoriRes.heroes) {
      satorimetaHeroes = satoriRes.heroes;
    }
    if (skillRes && skillRes.data) {
      skillLevelsData = skillRes.data;
    }

    populateHeroSelect();
    calculateAndRender();
  });

  function populateHeroSelect() {
    if (!heroSelect || satorimetaHeroes.length === 0) return;
    heroSelect.innerHTML = '';

    satorimetaHeroes.forEach((h, idx) => {
      const opt = document.createElement('option');
      opt.value = h.slug;
      opt.textContent = `[${h.rarity}] ${h.nameJapanese || h.name} (${h.faction} / ${h.class})`;
      if (idx === 0) opt.selected = true;
      heroSelect.appendChild(opt);
    });

    currentHero = satorimetaHeroes[0];
  }

  function calculateAndRender() {
    if (!heroSelect) return;
    const selectedSlug = heroSelect.value;
    currentHero = satorimetaHeroes.find(h => h.slug === selectedSlug) || satorimetaHeroes[0];
    if (!currentHero) return;

    const level = parseInt(heroLvSlider.value, 10);
    const star = parseInt(starSlider.value, 10);
    const skillLv = parseInt(skillLvSlider.value, 10);

    // Update Slider Labels
    heroLvVal.textContent = `Lv. ${level}`;
    starVal.textContent = star === 0 ? '0★ (未解放)' : `${star}★ ${star >= 10 ? '(覚醒解放)' : ''}`;
    skillLvVal.textContent = `Lv. ${skillLv}`;

    // 1. Calculate Predicted Base Stats
    // Formula: Stat_Lv = BaseStat * (1 + (Level - 1) * 0.045) * StarMultiplier
    const baseAtk = currentHero.levelProgressionData?.defaultAttackBase || 15971;
    const baseHp = baseAtk * 140; // HP is approx 140x Attack
    const baseDef = baseAtk * 1.0;
    const baseCmd = 350 + (level * 2);

    const levelMult = 1 + ((level - 1) * 0.048);
    const starMult = 1 + (star * 0.08);

    const predictedAtk = Math.round(baseAtk * levelMult * starMult);
    const predictedHp = Math.round(baseHp * levelMult * starMult);
    const predictedDef = Math.round(baseDef * levelMult * starMult);
    const predictedCmd = Math.round(baseCmd);

    // Update Header
    if (resHeroName) resHeroName.textContent = currentHero.nameJapanese || currentHero.name;
    if (resRarityBadge) resRarityBadge.textContent = currentHero.rarity || 'UR';
    if (resFactionBadge) resFactionBadge.textContent = currentHero.faction || 'Ranger';
    if (resHeroRole) resHeroRole.textContent = `${currentHero.class || ''} (${currentHero.damageType || 'DMG'})`;
    if (resHonorBonus) resHonorBonus.textContent = currentHero.hallOfHonor || '—';

    // Update Stats UI
    if (statAtk) statAtk.textContent = predictedAtk.toLocaleString();
    if (statHp) statHp.textContent = predictedHp.toLocaleString();
    if (statDef) statDef.textContent = predictedDef.toLocaleString();
    if (statCmd) statCmd.textContent = predictedCmd.toLocaleString();

    // 2. Render Skills & Formulas
    renderSkills(predictedAtk, skillLv, star);
  }

  function renderSkills(atkValue, skillLv, starLevel) {
    if (!skillsListContainer) return;
    const skills = currentHero.skills || [];

    if (skills.length === 0) {
      skillsListContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:1.5rem;">スキルデータが登録されていません</div>';
      return;
    }

    skillsListContainer.innerHTML = skills.map((s, idx) => {
      const formulas = s.formulas || [];
      let calculatedMultiplier = 100;

      // Evaluate Skill Formula if present (e.g. 0.83*(1+0.05*n1)*100)
      if (formulas.length > 0 && formulas[0].value) {
        try {
          let expr = formulas[0].value.replace(/n1/g, (skillLv - 1));
          calculatedMultiplier = Math.round(eval(expr) * 10) / 10;
        } catch (e) {
          calculatedMultiplier = (100 + (skillLv - 1) * 5);
        }
      } else {
        calculatedMultiplier = (100 + (skillLv - 1) * 5);
      }

      // Calculated DMG value
      const estimatedDamage = Math.round((atkValue * calculatedMultiplier) / 100);

      // Star Progression info
      const starUnlocks = (s.skillLevelUpProgression || []).map(st => {
        const isUnlocked = starLevel >= parseInt(st.mark || '0', 10);
        return `<span style="font-size:0.75rem; padding:0.15rem 0.5rem; border-radius:4px; margin-right:0.3rem; margin-top:0.3rem; display:inline-block; background:${isUnlocked ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.05)'}; color:${isUnlocked ? 'var(--accent-blue)' : 'var(--text-muted)'}; font-weight:${isUnlocked ? '700' : 'normal'}; border:1px solid ${isUnlocked ? 'var(--accent-blue)' : 'transparent'};">
          ${st.mark}: ${escapeHtml(st.upgrade || st.sentence || '')}
        </span>`;
      }).join('');

      return `
        <div class="skill-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
            <div>
              <span class="skill-type-badge">${escapeHtml(s.kindLabel || 'Skill')}</span>
              <h4 style="font-size:1.1rem; font-weight:800; color:#fff; margin:0;">${escapeHtml(s.skillName)}</h4>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:var(--text-muted);">スキル Lv.${skillLv} 傷害倍率</span>
              <div style="font-size:1.15rem; font-weight:800; color:var(--accent-gold);">${calculatedMultiplier}% ATK</div>
            </div>
          </div>

          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem; line-height:1.4;">
            ${escapeHtml(s.description || '')}
          </p>

          <!-- Real-time DMG Estimate -->
          <div style="background:rgba(0,0,0,0.3); padding:0.6rem 0.8rem; border-radius:6px; margin-bottom:0.6rem; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.8rem; color:#fff; font-weight:600;">⚡ 予想発生ダメージ (対防御力0換算):</span>
            <span style="font-size:1.1rem; font-weight:900; color:var(--accent-gold);">${estimatedDamage.toLocaleString()} DMG</span>
          </div>

          <!-- Star Unlocks -->
          ${starUnlocks ? `<div style="margin-top:0.4rem;">${starUnlocks}</div>` : ''}
        </div>
      `;
    }).join('');

    // Render Awakening Skills
    const awakenSkills = currentHero.awakeningSkills || [];
    if (awakenSkills.length > 0) {
      if (awakeningSection) awakeningSection.style.display = 'block';
      if (awakeningListContainer) {
        awakeningListContainer.innerHTML = awakenSkills.map(awk => `
          <div class="skill-card" style="border-left:4px solid #ff6b6b; background:rgba(255, 107, 107, 0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
              <strong style="color:#ff6b6b; font-size:0.9rem;">${escapeHtml(awk.awakenMark || 'Awaken')}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(awk.unlockCondition || '')}</span>
            </div>
            <div style="font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:0.3rem;">${escapeHtml(awk.skillName)}</div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">${escapeHtml(awk.awakenedDescription || '')}</p>
          </div>
        `).join('');
      }
    } else {
      if (awakeningSection) awakeningSection.style.display = 'none';
    }
  }

  // Event Listeners
  if (heroSelect) heroSelect.addEventListener('change', calculateAndRender);
  if (heroLvSlider) heroLvSlider.addEventListener('input', calculateAndRender);
  if (starSlider) starSlider.addEventListener('input', calculateAndRender);
  if (skillLvSlider) skillLvSlider.addEventListener('input', calculateAndRender);

  // Preset Handlers
  if (btnInit) {
    btnInit.addEventListener('click', () => {
      heroLvSlider.value = 1;
      starSlider.value = 0;
      skillLvSlider.value = 1;
      calculateAndRender();
    });
  }
  if (btnMid) {
    btnMid.addEventListener('click', () => {
      heroLvSlider.value = 60;
      starSlider.value = 5;
      skillLvSlider.value = 15;
      calculateAndRender();
    });
  }
  if (btnMax) {
    btnMax.addEventListener('click', () => {
      heroLvSlider.value = 150;
      starSlider.value = 10;
      skillLvSlider.value = 30;
      calculateAndRender();
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
