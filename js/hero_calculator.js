/**
 * Last Asylum - Hero & Skill Calculator Script (js/hero_calculator.js)
 * Robust Multilingual Faction Filter & Simulation Engine
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

    populateHeroSelect('all');
    calculateAndRender();
  });

  function populateHeroSelect(filterFaction = 'all') {
    if (!heroSelect || satorimetaHeroes.length === 0) return;
    heroSelect.innerHTML = '';

    const warriorGroup = [];
    const rangerGroup = [];
    const warlockGroup = [];

    satorimetaHeroes.forEach(h => {
      const fac = (h.faction || '').toLowerCase();
      // Robust matching for both English and Japanese faction names
      if (fac.includes('warrior') || fac.includes('ウォーリア')) {
        warriorGroup.push(h);
      } else if (fac.includes('ranger') || fac.includes('レンジャー')) {
        rangerGroup.push(h);
      } else {
        warlockGroup.push(h);
      }
    });

    let selectedAlready = false;

    const appendGroup = (groupLabel, heroesList) => {
      if (heroesList.length === 0) return;
      const optGroup = document.createElement('optgroup');
      optGroup.label = groupLabel;

      heroesList.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.slug;
        opt.textContent = `[${h.rarity}] ${h.nameJapanese || h.name} (${h.class || ''})`;
        if (!selectedAlready) {
          opt.selected = true;
          selectedAlready = true;
          currentHero = h;
        }
        optGroup.appendChild(opt);
      });

      heroSelect.appendChild(optGroup);
    };

    if (filterFaction === 'all' || filterFaction === 'warrior') {
      appendGroup('⚔️ ウォーリア (Warrior)', warriorGroup);
    }
    if (filterFaction === 'all' || filterFaction === 'ranger') {
      appendGroup('🏹 レンジャー (Ranger)', rangerGroup);
    }
    if (filterFaction === 'all' || filterFaction === 'warlock') {
      appendGroup('🔮 ソーサラー / ウォーロック (Sorcerer / Warlock)', warlockGroup);
    }
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
    const baseAtk = currentHero.levelProgressionData?.defaultAttackBase || 15971;
    const baseHp = baseAtk * 140;
    const baseDef = baseAtk * 1.0;
    const baseCmd = 350 + (level * 2);

    const levelMult = 1 + ((level - 1) * 0.048);
    const starMult = 1 + (star * 0.08);

    const predictedAtk = Math.round(baseAtk * levelMult * starMult);
    const predictedHp = Math.round(baseHp * levelMult * starMult);
    const predictedDef = Math.round(baseDef * levelMult * starMult);
    const predictedCmd = Math.round(baseCmd);

    // Translate Faction Name for Display
    let displayFaction = currentHero.faction || 'Ranger';
    const facLower = displayFaction.toLowerCase();
    if (facLower.includes('warrior') || facLower.includes('ウォーリア')) displayFaction = '⚔️ ウォーリア (Warrior)';
    else if (facLower.includes('ranger') || facLower.includes('レンジャー')) displayFaction = '🏹 レンジャー (Ranger)';
    else if (facLower.includes('warlock') || facLower.includes('ソーサラー') || facLower.includes('ウォーロック')) displayFaction = '🔮 ソーサラー (Warlock)';

    // Update Header Text & Badges
    if (resHeroName) resHeroName.textContent = currentHero.nameJapanese || currentHero.name;
    if (resRarityBadge) resRarityBadge.textContent = currentHero.rarity || 'UR';
    if (resFactionBadge) resFactionBadge.textContent = `${displayFaction} (${currentHero.defaultPlacement || 'Line'})`;
    if (resHeroRole) resHeroRole.textContent = `役割: ${currentHero.class || ''} | 属性: ${currentHero.damageType || '物理ダメージ'}`;
    if (resHonorBonus) resHonorBonus.textContent = currentHero.hallOfHonor ? `殿堂: ${currentHero.hallOfHonor}` : '殿堂ボーナス: なし';

    // Update Hero Avatar Image
    const heroHeaderCard = document.getElementById('hero-header-card');
    let avatarImg = document.getElementById('hero-avatar-img');
    if (!avatarImg && heroHeaderCard) {
      avatarImg = document.createElement('img');
      avatarImg.id = 'hero-avatar-img';
      avatarImg.style.width = '64px';
      avatarImg.style.height = '64px';
      avatarImg.style.borderRadius = '50%';
      avatarImg.style.border = '2px solid var(--accent-gold)';
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.marginRight = '1rem';
      heroHeaderCard.prepend(avatarImg);
    }
    if (avatarImg) {
      const portraitPath = `https://satorimeta.com/assets/last-asylum/heroes/portraits/${currentHero.slug}.webp`;
      avatarImg.src = portraitPath;
      avatarImg.onerror = () => { avatarImg.style.display = 'none'; };
    }

    // Update Stats UI
    if (statAtk) statAtk.textContent = predictedAtk.toLocaleString();
    if (statHp) statHp.textContent = predictedHp.toLocaleString();
    if (statDef) statDef.textContent = predictedDef.toLocaleString();
    if (statCmd) statCmd.textContent = predictedCmd.toLocaleString();

    // 2. Render Japanese Skills & Formulas
    renderSkills(predictedAtk, skillLv, star);

    // 3. Render Exclusive Weapon with Beautiful Layout
    renderExclusiveWeapon();
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
      let calculatedValues = [];
      let mainMultiplierPercent = 100;

      formulas.forEach((formObj, fIdx) => {
        let valStr = formObj.value || '';
        let evalResult = 0;
        if (valStr) {
          try {
            let expr = valStr.replace(/n1/g, (skillLv - 1));
            evalResult = Math.round(eval(expr) * 10) / 10;
          } catch (e) {
            evalResult = (100 + (skillLv - 1) * 5);
          }
        }
        calculatedValues.push({
          num: evalResult,
          unit: formObj.unit || ''
        });

        if (fIdx === 0 && evalResult > 0) {
          mainMultiplierPercent = evalResult;
        }
      });

      let formattedDescription = s.description || '';
      calculatedValues.forEach((cVal, fIdx) => {
        const replacement = `<strong style="color:var(--accent-gold);">${cVal.num}${cVal.unit}</strong>`;
        formattedDescription = formattedDescription.replace(new RegExp(`\\{${fIdx}\\}`, 'g'), replacement);
      });

      const estimatedDamage = Math.round((atkValue * mainMultiplierPercent) / 100);

      const starUnlocks = (s.skillLevelUpProgression || []).map(st => {
        const unlockStarStr = st.mark || '0★';
        const unlockStarNum = parseInt(unlockStarStr.replace(/\D/g, '') || '0', 10);
        const isUnlocked = starLevel >= unlockStarNum;
        
        return `
          <div style="font-size:0.78rem; padding:0.3rem 0.6rem; border-radius:4px; margin-top:0.3rem; background:${isUnlocked ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.03)'}; color:${isUnlocked ? '#fff' : 'var(--text-muted)'}; border-left:3px solid ${isUnlocked ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'};">
            <span style="font-weight:800; color:${isUnlocked ? 'var(--accent-gold)' : 'inherit'};">${unlockStarStr}</span>: 
            ${escapeHtml(st.upgrade || st.sentence || '')}
            ${st.unlock ? `<span style="font-size:0.7rem; color:var(--text-muted); float:right;">(${escapeHtml(st.unlock)})</span>` : ''}
          </div>
        `;
      }).join('');

      const skillKindBadge = s.kindLabelJapanese || s.kindLabel || 'スキル';

      return `
        <div class="skill-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
            <div>
              <span class="skill-type-badge">${escapeHtml(skillKindBadge)}</span>
              <h4 style="font-size:1.15rem; font-weight:800; color:#fff; margin:0.2rem 0 0 0;">${escapeHtml(s.skillName)}</h4>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:var(--text-muted);">スキル Lv.${skillLv} 計算倍率</span>
              <div style="font-size:1.2rem; font-weight:800; color:var(--accent-gold);">${mainMultiplierPercent}% ATK</div>
            </div>
          </div>

          <div style="font-size:0.9rem; color:#e0e0e0; margin-bottom:0.75rem; line-height:1.5; background:rgba(0,0,0,0.2); padding:0.75rem; border-radius:6px;">
            ${formattedDescription}
          </div>

          <div style="background:var(--bg-card); padding:0.6rem 0.8rem; border-radius:6px; margin-bottom:0.6rem; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,215,0,0.2);">
            <span style="font-size:0.8rem; color:#fff; font-weight:600;">⚡ 予想単発傷害 (攻撃力 ${atkValue.toLocaleString()} 換算):</span>
            <span style="font-size:1.15rem; font-weight:900; color:var(--accent-gold);">${estimatedDamage.toLocaleString()} DMG</span>
          </div>

          ${starUnlocks ? `
            <div style="margin-top:0.6rem;">
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; margin-bottom:0.2rem;">⭐ 星ランク解放効果 (Star Unlocks):</div>
              ${starUnlocks}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    const awakenSkills = currentHero.awakeningSkills || [];
    if (awakenSkills.length > 0) {
      if (awakeningSection) awakeningSection.style.display = 'block';
      if (awakeningListContainer) {
        awakeningListContainer.innerHTML = awakenSkills.map(awk => {
          let awkDesc = awk.awakenedDescription || '';
          if (awk.formulas && awk.formulas.length > 0) {
            awk.formulas.forEach((fObj, fIdx) => {
              let valStr = fObj.value || '';
              let evalResult = 0;
              try {
                let expr = valStr.replace(/n1/g, (skillLv - 1));
                evalResult = Math.round(eval(expr) * 10) / 10;
              } catch (e) {
                evalResult = 100;
              }
              const replacement = `<strong style="color:var(--accent-gold);">${evalResult}${fObj.unit || ''}</strong>`;
              awkDesc = awkDesc.replace(new RegExp(`\\{${fIdx}\\}`, 'g'), replacement);
            });
          }

          return `
            <div class="skill-card" style="border-left:4px solid #ff6b6b; background:rgba(255, 107, 107, 0.05);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span class="badge" style="background:#ff6b6b; color:#fff; font-weight:800;">${escapeHtml(awk.awakenMark || 'Awaken')}</span>
                <span style="font-size:0.75rem; color:var(--accent-gold); font-weight:600;">${escapeHtml(awk.unlockCondition || '')}</span>
              </div>
              <div style="font-size:1.05rem; font-weight:800; color:#fff; margin-bottom:0.4rem;">${escapeHtml(awk.skillName)} (覚醒時強化)</div>
              <p style="font-size:0.88rem; color:#e0e0e0; margin:0; line-height:1.4;">${awkDesc}</p>
            </div>
          `;
        }).join('');
      }
    } else {
      if (awakeningSection) awakeningSection.style.display = 'none';
    }
  }

  function renderExclusiveWeapon() {
    let eqContainer = document.getElementById('exclusive-weapon-container');
    if (!eqContainer) {
      eqContainer = document.createElement('div');
      eqContainer.id = 'exclusive-weapon-container';
      eqContainer.style.marginTop = '1.5rem';
      const resultPanel = document.querySelector('.result-panel');
      if (resultPanel) resultPanel.appendChild(eqContainer);
    }

    if (currentHero && currentHero.exclusiveWeapon) {
      const eq = currentHero.exclusiveWeapon;
      
      eqContainer.innerHTML = `
        <h3 style="font-size: 1rem; color: var(--accent-gold); margin-bottom: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
          🗡️ 英雄専用武器 (Exclusive Signature Weapon)
        </h3>
        <div class="skill-card" style="border-left: 4px solid var(--accent-gold); background: rgba(255, 215, 0, 0.04); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px solid rgba(255,215,0,0.15); padding-bottom: 0.5rem;">
            <h4 style="font-size: 1.2rem; font-weight: 900; color: #fff; margin: 0;">${escapeHtml(eq.weaponTitle)}</h4>
            <span class="badge" style="background: var(--accent-gold); color: #000; font-weight: 800;">専用装備</span>
          </div>

          <p style="font-size: 0.88rem; color: #e0e0e0; margin-bottom: 0.85rem; line-height: 1.5;">
            ${escapeHtml(eq.description || '')}
          </p>

          ${eq.stats ? `
            <div style="background: rgba(0,0,0,0.3); padding: 0.6rem 0.8rem; border-radius: 6px; margin-bottom: 0.6rem; border: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem;">
              <strong style="color: var(--accent-blue);">📊 装備ステータス補正:</strong> 
              <span style="color: #fff; font-weight: 700; margin-left: 0.3rem;">${escapeHtml(eq.stats)}</span>
            </div>
          ` : ''}

          ${eq.effect ? `
            <div style="background: rgba(255, 215, 0, 0.08); padding: 0.65rem 0.85rem; border-radius: 6px; border-left: 3px solid var(--accent-gold); font-size: 0.85rem; color: #fff;">
              <strong style="color: var(--accent-gold);">⚡ 専用パッシブ効果:</strong> 
              <span style="margin-left: 0.3rem;">${escapeHtml(eq.effect)}</span>
            </div>
          ` : ''}
        </div>
      `;
      eqContainer.style.display = 'block';
    } else {
      eqContainer.style.display = 'none';
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faction-filter-btn');
    if (!btn) return;

    const allBtns = document.querySelectorAll('.faction-filter-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const factionKey = btn.getAttribute('data-faction') || 'all';
    populateHeroSelect(factionKey);
    calculateAndRender();
  });

  if (heroSelect) heroSelect.addEventListener('change', calculateAndRender);
  if (heroLvSlider) heroLvSlider.addEventListener('input', calculateAndRender);
  if (starSlider) starSlider.addEventListener('input', calculateAndRender);
  if (skillLvSlider) skillLvSlider.addEventListener('input', calculateAndRender);

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
