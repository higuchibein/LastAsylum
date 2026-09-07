/**
 * Last Asylum - Hero Rating Database Script (js/database.js)
 * Comprehensive Ratings & Detailed Skill/Stat Database for the 20 Tier-Listed Heroes
 */

document.addEventListener('DOMContentLoaded', () => {
  let allHeroesData = [];

  // Target 20 Heroes with their Tier Ratings
  const HERO_TIER_MAP = {
    'Marlena':  { ja: 'マレーナ', overall: 'S', dps: 'S', pvp: 'S', tank: null, buffer: null },
    'Louis':    { ja: 'ルイス', overall: 'S', dps: null, pvp: null, tank: 'S', buffer: null },
    'Ulfrid':   { ja: 'ウルフレッド', overall: 'S', dps: null, pvp: null, tank: 'S', buffer: null },
    'Arthur':   { ja: 'アーサー', overall: 'A', dps: null, pvp: null, tank: 'A', buffer: null },
    'Harper':   { ja: 'ハーパー', overall: 'A', dps: null, pvp: null, tank: null, buffer: 'S' },
    'Shadow':   { ja: 'シャドウ', overall: 'A', dps: null, pvp: null, tank: 'A', buffer: null },
    'Cynthia':  { ja: 'シンシア', overall: 'A', dps: 'A', pvp: 'A', tank: null, buffer: null },
    'Bell':     { ja: 'ベル', overall: 'A', dps: null, pvp: null, tank: null, buffer: 'S' },
    'Red Lady': { ja: 'レッドレディ', overall: 'A', dps: 'A', pvp: 'A', tank: null, buffer: null },
    'Joker':    { ja: 'ピエロ', overall: 'A', dps: 'C', pvp: 'S', tank: null, buffer: null },
    'Annie':    { ja: 'アニー', overall: 'A', dps: 'B', pvp: 'S', tank: null, buffer: null },
    'Nicole':   { ja: 'ニコル', overall: 'A', dps: null, pvp: null, tank: null, buffer: 'A' },
    'Daskal':   { ja: 'ダスカール', overall: 'B', dps: null, pvp: null, tank: 'B', buffer: null },
    'Claire':   { ja: 'クレア', overall: 'B', dps: null, pvp: null, tank: null, buffer: null },
    'Celia':    { ja: 'シリア', overall: 'B', dps: null, pvp: null, tank: null, buffer: null },
    'Ash':      { ja: 'アッシュ', overall: 'B', dps: null, pvp: null, tank: null, buffer: null },
    'Grenwald': { ja: 'グリンウォルド', overall: 'B', dps: null, pvp: null, tank: null, buffer: null },
    'Zoya':     { ja: 'ゾーヤ', overall: 'C', dps: 'C', pvp: 'B', tank: null, buffer: null },
    'Billy':    { ja: 'ビリー', overall: 'C', dps: null, pvp: null, tank: 'C', buffer: null },
    'Bella':    { ja: 'ベラ', overall: 'C', dps: null, pvp: null, tank: null, buffer: null }
  };

  // DOM Elements
  const heroSearchInput = document.getElementById('hero-search-input');
  const factionFilterBtns = document.querySelectorAll('.faction-filter-btn');
  const tierFilterBtns = document.querySelectorAll('.tier-filter-btn');
  const heroesGridContainer = document.getElementById('heroes-db-grid');
  const totalCountEl = document.getElementById('heroes-total-count');

  let currentFaction = 'all';
  let currentTier = 'all';

  // Fetch Heroes Data
  fetch('data/satorimeta_heroes_full.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      if (data && data.heroes) {
        // Filter ONLY the 20 Tier-Listed Heroes
        allHeroesData = data.heroes.filter(h => HERO_TIER_MAP[h.name]);
      }
      renderHeroesGrid();
    })
    .catch(err => {
      console.error('Error loading heroes DB data:', err);
      if (heroesGridContainer) {
        heroesGridContainer.innerHTML = '<div style="color:red; text-align:center; padding:2rem;">データの読み込みに失敗しました。</div>';
      }
    });

  function renderHeroesGrid() {
    if (!heroesGridContainer) return;

    const searchTerm = (heroSearchInput ? heroSearchInput.value : '').toLowerCase().trim();

    const filtered = allHeroesData.filter(hero => {
      const tierInfo = HERO_TIER_MAP[hero.name] || {};
      const jaName = hero.nameJapanese || tierInfo.ja || '';
      const nameMatch = hero.name.toLowerCase().includes(searchTerm) || jaName.toLowerCase().includes(searchTerm);

      // Faction filter
      const facLower = (hero.faction || '').toLowerCase();
      let facMatch = true;
      if (currentFaction === 'warrior') facMatch = facLower.includes('warrior') || facLower.includes('ウォーリア');
      else if (currentFaction === 'ranger') facMatch = facLower.includes('ranger') || facLower.includes('レンジャー');
      else if (currentFaction === 'warlock') facMatch = facLower.includes('warlock') || facLower.includes('ソーサラー');

      // Tier filter
      let tierMatch = true;
      if (currentTier !== 'all') {
        tierMatch = tierInfo.overall === currentTier;
      }

      return nameMatch && facMatch && tierMatch;
    });

    if (totalCountEl) {
      totalCountEl.textContent = `${filtered.length} 名の英雄を表示中 (全20名評価対象)`;
    }

    if (filtered.length === 0) {
      heroesGridContainer.innerHTML = '<div style="grid-column: 1 / -1; color: var(--text-muted); text-align: center; padding: 3rem;">条件に一致する英雄が見つかりませんでした。</div>';
      return;
    }

    heroesGridContainer.innerHTML = filtered.map(hero => {
      const tierInfo = HERO_TIER_MAP[hero.name] || { overall: 'C' };
      const jaName = hero.nameJapanese || tierInfo.ja || hero.name;
      const portraitUrl = `https://satorimeta.com/assets/last-asylum/heroes/portraits/${hero.slug}.webp`;

      // Faction Label
      let facLabel = hero.faction || 'Ranger';
      const fLower = facLabel.toLowerCase();
      if (fLower.includes('warrior') || fLower.includes('ウォーリア')) facLabel = '⚔️ ウォーリア';
      else if (fLower.includes('ranger') || fLower.includes('レンジャー')) facLabel = '🏹 レンジャー';
      else if (fLower.includes('warlock') || fLower.includes('ソーサラー') || fLower.includes('ウォーロック')) facLabel = '🔮 ソーサラー';

      // Tier Badges Styles
      let tierBadgeClass = 'tier-badge-c';
      if (tierInfo.overall === 'S') tierBadgeClass = 'tier-badge-s';
      else if (tierInfo.overall === 'A') tierBadgeClass = 'tier-badge-a';
      else if (tierInfo.overall === 'B') tierBadgeClass = 'tier-badge-b';

      // Roles Badges HTML
      const roleBadges = [];
      if (tierInfo.dps) roleBadges.push(`<span class="role-badge">🗡️ DPS: <strong style="color:var(--accent-gold);">${tierInfo.dps}</strong></span>`);
      if (tierInfo.pvp) roleBadges.push(`<span class="role-badge">💥 PvP: <strong style="color:#ff6b6b;">${tierInfo.pvp}</strong></span>`);
      if (tierInfo.tank) roleBadges.push(`<span class="role-badge">🛡️ タンク: <strong style="color:var(--accent-blue);">${tierInfo.tank}</strong></span>`);
      if (tierInfo.buffer) roleBadges.push(`<span class="role-badge">🪄 バフ: <strong style="color:#10ac84;">${tierInfo.buffer}</strong></span>`);

      // Base Stats Calculation
      const baseAtk = hero.levelProgressionData?.defaultAttackBase || 15971;
      const baseHp = baseAtk * 140;
      const baseDef = Math.round(baseAtk * 1.0);

      // Skills HTML
      const skills = hero.skills || [];
      const skillsHtml = skills.map(s => `
        <div class="db-skill-item">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
            <span class="db-skill-name">⚡ ${escapeHtml(s.skillName)}</span>
            <span class="db-skill-kind">${escapeHtml(s.kindLabelJapanese || s.kindLabel || 'スキル')}</span>
          </div>
          <p class="db-skill-desc">${escapeHtml(s.description || '')}</p>
        </div>
      `).join('');

      // Exclusive Weapon HTML (Only for Daskal, Louis, Ulfrid)
      const eq = hero.exclusiveWeapon;
      const weaponHtml = eq ? `
        <div class="db-weapon-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
            <strong style="color:var(--accent-gold); font-size:0.85rem;">${escapeHtml(eq.weaponTitle)}</strong>
            <span class="badge" style="background:var(--accent-gold); color:#000; font-size:0.68rem; font-weight:800;">専用装備</span>
          </div>
          <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.4rem;">${escapeHtml(eq.description || '')}</p>
          ${eq.stats ? `<div style="font-size:0.75rem; color:#fff;">📊 ${escapeHtml(eq.stats)}</div>` : ''}
          ${eq.effect ? `<div style="font-size:0.75rem; color:var(--accent-gold); margin-top:0.2rem;">⚡ ${escapeHtml(eq.effect)}</div>` : ''}
        </div>
      ` : '';

      return `
        <div class="hero-db-card">
          <!-- Header Area -->
          <div class="hero-db-header">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <img src="${portraitUrl}" alt="${jaName}" class="hero-db-avatar" onerror="this.style.display='none'">
              <div>
                <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.2rem;">
                  <span class="badge" style="background:var(--accent-gold-dark); color:#fff; font-weight:800;">${hero.rarity || 'UR'}</span>
                  <span style="font-size:0.78rem; color:var(--accent-blue); font-weight:600;">${facLabel}</span>
                </div>
                <h3 class="hero-db-name">${escapeHtml(jaName)} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);">(${hero.name})</span></h3>
              </div>
            </div>
            <div class="hero-db-tier-box ${tierBadgeClass}">
              <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">総合評価</div>
              <div style="font-size:1.6rem; font-weight:900; line-height:1;">${tierInfo.overall}</div>
            </div>
          </div>

          <!-- Role Rankings Bar -->
          ${roleBadges.length > 0 ? `<div class="role-badges-row">${roleBadges.join('')}</div>` : ''}

          <!-- Base Stats Grid -->
          <div class="hero-db-stats-grid">
            <div class="hero-db-stat">
              <span class="lbl">初期 ATK</span>
              <span class="val" style="color:var(--accent-gold);">${baseAtk.toLocaleString()}</span>
            </div>
            <div class="hero-db-stat">
              <span class="lbl">初期 HP</span>
              <span class="val" style="color:var(--accent-blue);">${baseHp.toLocaleString()}</span>
            </div>
            <div class="hero-db-stat">
              <span class="lbl">初期 DEF</span>
              <span class="val" style="color:#10ac84;">${baseDef.toLocaleString()}</span>
            </div>
          </div>

          <!-- Skills Section -->
          <div style="margin-top:1rem;">
            <div style="font-size:0.82rem; font-weight:700; color:#fff; margin-bottom:0.5rem; display:flex; justify-content:space-between;">
              <span>⚡ 所持スキル (${skills.length})</span>
            </div>
            ${skillsHtml}
          </div>

          <!-- Exclusive Weapon (If available) -->
          ${weaponHtml}

          <!-- Footer Action Button -->
          <div style="margin-top:1.2rem; text-align:right;">
            <a href="hero_calculator.html" class="btn btn-secondary btn-sm" style="font-size:0.8rem; padding:0.4rem 0.85rem; border-color:var(--accent-gold); color:var(--accent-gold);">
              ⚡ シミュレーターで試算 ➔
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // Event Listeners for Filters
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', renderHeroesGrid);
  }

  factionFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      factionFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFaction = btn.getAttribute('data-faction') || 'all';
      renderHeroesGrid();
    });
  });

  tierFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTier = btn.getAttribute('data-tier') || 'all';
      renderHeroesGrid();
    });
  });

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
