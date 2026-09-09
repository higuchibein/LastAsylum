/**
 * Last Asylum - Individual Hero Details & Editable Notes Script (js/hero_detail.js)
 * Manages full hero specifications, initial vs max stat comparison, skill formulas (Lv.1 vs Lv.30/Max),
 * exclusive weapons, and Administrator Password Protected Wiki Notes.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Target 20 Heroes Tier Map Reference
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

  // Get Target Hero Slug from URL query params ?id=marlena or ?hero=marlena
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = (urlParams.get('id') || urlParams.get('hero') || urlParams.get('name') || 'marlena').toLowerCase().trim();

  // Containers
  const profileContainer = document.getElementById('hero-profile-container');
  const statsContainer = document.getElementById('hero-stats-content');
  const weaponContainer = document.getElementById('hero-weapon-content');
  const skillsContainer = document.getElementById('hero-skills-content');

  // Editable Notes Elements
  const notesDisplayArea = document.getElementById('notes-display-area');
  const notesEditorArea = document.getElementById('notes-editor-area');
  const notesStatusMsg = document.getElementById('notes-status-msg');

  // Comment Elements
  const commentNameInput = document.getElementById('comment-user-name');
  const commentRatingSelect = document.getElementById('comment-rating-star');
  const commentTextInput = document.getElementById('comment-text-body');
  const btnSubmitComment = document.getElementById('btn-submit-comment');
  const commentsListContainer = document.getElementById('comments-list-container');

  let currentHeroData = null;

  // Load Full Hero Data
  fetch('data/satorimeta_heroes_full.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      if (data && data.heroes) {
        // Find hero matching slug or English name or Japanese name
        currentHeroData = data.heroes.find(h => 
          h.slug.toLowerCase() === targetId ||
          h.name.toLowerCase() === targetId ||
          (h.nameJapanese && h.nameJapanese.toLowerCase() === targetId)
        );

        // Fallback to first hero if not found
        if (!currentHeroData) {
          currentHeroData = data.heroes[0];
        }
      }
      renderHeroDetailPage(currentHeroData);
    })
    .catch(err => {
      console.error('Failed to load hero details:', err);
      if (profileContainer) {
        profileContainer.innerHTML = '<div style="color:red; text-align:center; padding:2rem;">英雄データの読み込みに失敗しました。</div>';
      }
    });

  function renderHeroDetailPage(hero) {
    if (!hero) return;

    const tierInfo = HERO_TIER_MAP[hero.name] || { ja: hero.nameJapanese || hero.name, overall: 'UR' };
    const jaName = hero.nameJapanese || tierInfo.ja || hero.name;
    const portraitUrl = `https://satorimeta.com/assets/last-asylum/heroes/portraits/${hero.slug}.webp`;

    // Document Title Update
    document.title = `${jaName} (${hero.name}) 初期・Maxステータス＆全スキル個別図鑑 | Last Asylum Wiki`;

    // Faction Badge
    let facLabel = hero.faction || 'Ranger';
    const fLower = facLabel.toLowerCase();
    if (fLower.includes('warrior') || fLower.includes('ウォーリア')) facLabel = '⚔️ ウォーリア';
    else if (fLower.includes('ranger') || fLower.includes('レンジャー')) facLabel = '🏹 レンジャー';
    else if (fLower.includes('warlock') || fLower.includes('ソーサラー') || fLower.includes('ウォーロック')) facLabel = '🔮 ソーサラー';

    // Tier badge style
    let tierBadgeStyle = 'background: linear-gradient(135deg, #444, #222); border: 1px solid #666; color: #fff;';
    if (tierInfo.overall === 'S') tierBadgeStyle = 'background: linear-gradient(135deg, #ffd700, #ff8c00); border: 1px solid #ffe066; color: #000; box-shadow: 0 0 15px rgba(255,215,0,0.4);';
    else if (tierInfo.overall === 'A') tierBadgeStyle = 'background: linear-gradient(135deg, #e0e0e0, #888888); border: 1px solid #ffffff; color: #000;';
    else if (tierInfo.overall === 'B') tierBadgeStyle = 'background: linear-gradient(135deg, #cd7f32, #8b4513); border: 1px solid #d2b48c; color: #fff;';

    // Roles Badges
    const roleBadges = [];
    if (tierInfo.dps) roleBadges.push(`<span class="role-badge">🗡️ DPSアタッカー: <strong style="color:var(--accent-gold);">${tierInfo.dps}</strong></span>`);
    if (tierInfo.pvp) roleBadges.push(`<span class="role-badge">💥 PvP対人評価: <strong style="color:#ff6b6b;">${tierInfo.pvp}</strong></span>`);
    if (tierInfo.tank) roleBadges.push(`<span class="role-badge">🛡️ 耐久タンク: <strong style="color:var(--accent-blue);">${tierInfo.tank}</strong></span>`);
    if (tierInfo.buffer) roleBadges.push(`<span class="role-badge">🪄 支援バッファー: <strong style="color:#10ac84;">${tierInfo.buffer}</strong></span>`);

    // 1. Render Header Card
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="hero-detail-header-card">
          <div class="hero-profile-flex">
            <img src="${portraitUrl}" alt="${jaName}" class="hero-profile-avatar" onerror="this.src='https://via.placeholder.com/110?text=Hero'">
            
            <div class="hero-profile-info">
              <div class="hero-profile-name-row">
                <span class="badge" style="background:var(--accent-gold); color:#000; font-size:0.85rem; font-weight:900;">${hero.rarity || 'UR'}</span>
                <span class="badge" style="background:rgba(255,255,255,0.1); color:var(--accent-blue); font-size:0.85rem; border:1px solid var(--accent-blue);">${facLabel}</span>
                <span style="font-size:0.82rem; color:var(--text-muted);">${escapeHtml(hero.class || '主力ユニット')}・${escapeHtml(hero.defaultPlacement || '前衛/後衛')}</span>
              </div>

              <h1 class="hero-ja-title">${escapeHtml(jaName)} <span class="hero-en-title">(${escapeHtml(hero.name)})</span></h1>
              
              <div class="hero-tags-row" style="margin-top: 0.75rem;">
                ${roleBadges.join('')}
              </div>
            </div>

            <!-- Tier Rating Box -->
            <div class="tier-large-badge" style="${tierBadgeStyle}">
              <div class="lbl">総合評価Tier</div>
              <div class="val">${tierInfo.overall || 'S'}</div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="margin-top: 1.25rem; pt: 1rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
            <a href="hero_calculator.html?hero=${encodeURIComponent(jaName)}" class="btn btn-primary" style="background: linear-gradient(135deg, #ffd700, #ff9f43); color: #000; font-weight: 800; font-size: 0.85rem; padding: 0.5rem 1.2rem; border: none;">
              ⚡ シミュレーターで ${jaName} のステータス試算 ➔
            </a>
          </div>
        </div>
      `;
    }

    // 2. Calculate & Render Initial (Lv.1) vs Max (Lv.150, 10★ 覚醒) Stats
    const baseAtk = hero.levelProgressionData?.defaultAttackBase || 15971;
    const baseHp = baseAtk * 140;
    const baseDef = Math.round(baseAtk * 1.0);
    const baseCmd = 350;

    // Max multiplier: Lv.150 mult (8.152) * 10★ star mult (1.80) = 14.6736
    const statMultMax = 8.152 * 1.80;
    const maxAtk = Math.round(baseAtk * statMultMax);
    const maxHp = Math.round(baseHp * statMultMax);
    const maxDef = Math.round(baseDef * statMultMax);
    const maxCmd = 350 + (150 * 2); // 650

    if (statsContainer) {
      statsContainer.innerHTML = `
        <table class="stats-table">
          <thead>
            <tr>
              <th>ステータス項目</th>
              <th>🟢 初期 (Lv.1 / 0★)</th>
              <th>👑 Max (Lv.150 / 10★覚醒)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>⚔️ 攻撃力 (ATK)</strong></td>
              <td><span style="color:var(--accent-gold); font-weight:700;">${baseAtk.toLocaleString()}</span></td>
              <td><span style="color:var(--accent-gold); font-weight:900; font-size:0.95rem;">${maxAtk.toLocaleString()}</span></td>
            </tr>
            <tr>
              <td><strong>❤️ 体力 (HP)</strong></td>
              <td><span style="color:var(--accent-blue); font-weight:700;">${baseHp.toLocaleString()}</span></td>
              <td><span style="color:var(--accent-blue); font-weight:900; font-size:0.95rem;">${maxHp.toLocaleString()}</span></td>
            </tr>
            <tr>
              <td><strong>🛡️ 防御力 (DEF)</strong></td>
              <td><span style="color:#10ac84; font-weight:700;">${baseDef.toLocaleString()}</span></td>
              <td><span style="color:#10ac84; font-weight:900; font-size:0.95rem;">${maxDef.toLocaleString()}</span></td>
            </tr>
            <tr>
              <td><strong>🪖 指揮力 (兵員数)</strong></td>
              <td><span style="color:#fff; font-weight:700;">${baseCmd.toLocaleString()}</span></td>
              <td><span style="color:#fff; font-weight:900; font-size:0.95rem;">${maxCmd.toLocaleString()}</span></td>
            </tr>
          </tbody>
        </table>

        <ul style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; padding-left: 1.2rem; margin-top: 0.75rem; margin-bottom: 0;">
          <li><strong>最大成長補正:</strong> 初期ステータスの <strong style="color:var(--accent-gold);">約14.67倍</strong> (Lv.150 補正 8.15倍 × 10★覚醒 1.80倍)</li>
          <li><strong>ダメージタイプ:</strong> ${escapeHtml(hero.damageType || '物理ダメージ')}</li>
          <li><strong>推奨配置:</strong> ${escapeHtml(hero.defaultPlacement || '前衛')}</li>
          ${hero.hallOfHonor ? `<li><strong>殿堂バフ (Hall of Honor):</strong> <span style="color:var(--accent-gold);">${escapeHtml(hero.hallOfHonor)}</span></li>` : ''}
        </ul>
      `;
    }

    // 3. Render Exclusive Weapon or Awakening Skills (if present)
    if (weaponContainer) {
      const eq = hero.exclusiveWeapon;
      const awkSkills = hero.awakeningSkills || [];

      if (eq) {
        weaponContainer.innerHTML = `
          <div style="background: linear-gradient(180deg, rgba(255,215,0,0.1), rgba(0,0,0,0.4)); border: 1px solid var(--accent-gold); border-radius: 10px; padding: 1.1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <strong style="color:var(--accent-gold); font-size:1.05rem;">🗡️ ${escapeHtml(eq.weaponTitle)}</strong>
              <span class="badge" style="background:var(--accent-gold); color:#000; font-weight:900;">専用装備</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem; line-height:1.5;">${escapeHtml(eq.description || '')}</p>
            ${eq.stats ? `<div style="font-size:0.82rem; color:#fff; margin-bottom:0.3rem;">📊 <strong>ステータス補正:</strong> ${escapeHtml(eq.stats)}</div>` : ''}
            ${eq.effect ? `<div style="font-size:0.82rem; color:var(--accent-gold); font-weight:700;">⚡ <strong>特殊パッシブ効果:</strong> ${escapeHtml(eq.effect)}</div>` : ''}
          </div>
        `;
      } else if (awkSkills.length > 0) {
        const awkListHtml = awkSkills.map(item => {
          let desc = escapeHtml(item.awakenedDescription || item.description || '');
          // Format placeholders if formulas exist
          if (item.formulas && item.formulas.length > 0) {
            item.formulas.forEach((f, fIdx) => {
              if (f.value) {
                let fVal = f.value;
                if (fVal.includes('n1')) {
                  try {
                    const parsed = Function('"use strict"; return (' + fVal.replace(/n1/g, '29') + ')')();
                    if (typeof parsed === 'number' && !isNaN(parsed)) {
                      fVal = parsed.toFixed(1) + (f.unit || '%');
                    }
                  } catch(e) {}
                }
                desc = desc.replace(new RegExp('\\{' + fIdx + '\\}', 'g'), `<strong style="color:var(--accent-gold);">${fVal}</strong>`);
              }
            });
          }
          return `
            <div style="background: rgba(16,172,132,0.12); border: 1px solid rgba(16,172,132,0.35); border-radius: 8px; padding: 0.85rem; margin-bottom: 0.75rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <strong style="color:#10ac84; font-size:0.92rem;">🔮 覚醒強化: ${escapeHtml(item.skillNameJapanese || item.skillName)}</strong>
                <span class="badge" style="background:#10ac84; color:#000; font-size:0.7rem; font-weight:800;">${escapeHtml(item.awakenMark || '10★覚醒')}</span>
              </div>
              <p style="font-size:0.83rem; color:var(--text-color); margin-bottom:0.35rem; line-height:1.5;">${desc}</p>
              ${item.unlockCondition ? `<div style="font-size:0.75rem; color:var(--accent-gold);">🔓 <strong>解放条件:</strong> ${escapeHtml(item.unlockCondition)}</div>` : ''}
            </div>
          `;
        }).join('');

        weaponContainer.innerHTML = `
          <div style="background: linear-gradient(180deg, rgba(16,172,132,0.08), rgba(0,0,0,0.4)); border: 1px solid #10ac84; border-radius: 10px; padding: 1.1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <strong style="color:#10ac84; font-size:1.05rem;">🔮 覚醒スキル・段階強化一覧</strong>
              <span class="badge" style="background:#10ac84; color:#000; font-weight:900;">全${awkSkills.length}段階 覚醒適用</span>
            </div>
            ${awkListHtml}
          </div>
        `;
      } else {
        weaponContainer.innerHTML = `
          <div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center; background: var(--bg-primary); border-radius: 8px;">
            現在、${escapeHtml(jaName)} の専用装備および覚醒スキルデータは未開放または未実装です。
          </div>
        `;
      }
    }

    // 4. Render Skills with Initial vs Max Multipliers
    if (skillsContainer) {
      const skills = hero.skills || [];
      if (skills.length === 0) {
        skillsContainer.innerHTML = '<div style="color:var(--text-muted); padding:1rem; text-align:center;">スキルデータが存在しません。</div>';
      } else {
        skillsContainer.innerHTML = skills.map((s, idx) => {
          const { initMult, maxMult, maxStarLabel } = extractSkillMultipliers(s);

          const initDmgStr = (initMult && baseAtk) ? Math.round(baseAtk * (initMult / 100)).toLocaleString() : '―';
          const maxDmgStr = (maxMult && maxAtk) ? Math.round(maxAtk * (maxMult / 100)).toLocaleString() : '―';

          const initMultStr = initMult ? `${initMult.toFixed(1)}%` : 'Lv.1 基本効果';
          const maxMultStr = maxMult ? `${maxMult.toFixed(1)}%` : 'Max強化適用';

          return `
            <div class="skill-detail-card">
              <div class="skill-detail-header">
                <span class="skill-name-txt">${idx + 1}. ⚡ ${escapeHtml(s.skillName)}</span>
                <span class="skill-badge-kind">${escapeHtml(s.kindLabelJapanese || s.kindLabel || 'スキル')}</span>
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.6rem; line-height:1.5;">
                ${escapeHtml(s.description || '')}
              </p>

              <!-- 初期 vs Max 効果比較ボックス -->
              <div class="skill-comparison-grid">
                <div class="skill-level-box init-box">
                  <div class="box-title">🟢 初期効果 (Skill Lv.1 / 未強化)</div>
                  <div style="font-size:0.85rem; font-weight:700; color:#fff;">ダメージ倍率: <strong style="color:#10ac84;">${initMultStr}</strong></div>
                  <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Lv.1 初期予想傷害: <strong style="color:#fff;">${initDmgStr}</strong></div>
                </div>

                <div class="skill-level-box max-box">
                  <div class="box-title">👑 ${escapeHtml(maxStarLabel)}</div>
                  <div style="font-size:0.85rem; font-weight:700; color:#fff;">最大倍率: <strong style="color:var(--accent-gold);">${maxMultStr}</strong></div>
                  <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Max 予想傷害: <strong style="color:#ff6b6b; font-weight:800;">${maxDmgStr}</strong></div>
                </div>
              </div>

              ${s.unlockRequirement ? `<div style="font-size:0.75rem; color:var(--accent-gold); margin-top:0.4rem;">🔓 <strong>解放条件:</strong> ${escapeHtml(s.unlockRequirement)}</div>` : ''}
            </div>
          `;
        }).join('');
      }
    }

    // Initialize Admin Password Protected Notes and Comments
    initHeroNotes(hero);
    initHeroComments(hero);
  }

  // ==========================================
  // Helper: Extract Initial & Max Multipliers
  // ==========================================
  function extractSkillMultipliers(s) {
    let initMult = null;
    let maxMult = null;
    let maxStarLabel = 'Max効果 (Skill Lv.30)';

    const parseVal = (formulaStr, n1Val) => {
      if (!formulaStr) return null;
      try {
        const expr = formulaStr.replace(/n1/g, String(n1Val));
        const res = Function('"use strict"; return (' + expr + ')')();
        return typeof res === 'number' && !isNaN(res) ? res : null;
      } catch (e) {
        return null;
      }
    };

    // Base formula (n1 = 0 for Lv.1, n1 = 29 for Lv.30)
    if (s.formulas) {
      for (const f of s.formulas) {
        if (f.value && f.value.includes('n1')) {
          initMult = parseVal(f.value, 0);
          maxMult = parseVal(f.value, 29);
          break;
        }
      }
    }

    // Check star level up progression
    if (s.skillLevelUpProgression && s.skillLevelUpProgression.length > 0) {
      for (const prog of s.skillLevelUpProgression) {
        if (prog.formulas) {
          for (const f of prog.formulas) {
            if (f.value && f.value.includes('n1')) {
              const starMaxVal = parseVal(f.value, 29);
              if (starMaxVal && starMaxVal > (maxMult || 0)) {
                maxMult = starMaxVal;
                maxStarLabel = `Max効果 (Skill Lv.30 / ${prog.mark || '10★覚醒'})`;
              }
            }
          }
        }
      }
    }

    return { initMult, maxMult, maxStarLabel };
  }

  // ==========================================
  // Admin Password Protected Wiki Notes System (Cloud Synced Across Devices)
  // ==========================================
  const cloudDbMapping = {
    "red-lady": "ff808181a067127101a08698bd7b5900",
    "cynthia": "ff808181a067127101a08698bf275902",
    "bell": "ff808181a067127101a08698c0695903",
    "louis": "ff808181a067127101a08698c1865904",
    "shadow": "ff808181a067127101a08698c34d5905",
    "joker": "ff808181a067127101a08698c4785906",
    "annie": "ff808181a067127101a08698c5b65907",
    "nicole": "ff808181a067127101a08698c6f25908",
    "billy": "ff808181a067127101a08698c89a5909",
    "ulfrid": "ff808181a067127101a08698cb78590a",
    "marlena": "ff808181a067127101a08698ccf2590b",
    "zoya": "ff808181a067127101a08698ce1d590c",
    "harper": "ff808181a067127101a08698cf80590d",
    "arthur": "ff808181a067127101a08698d0b4590e",
    "daskal": "ff808181a067127101a08698d1f1590f",
    "ash": "ff808181a067127101a08698d3355910",
    "bestar": "ff808181a067127101a08698d4605911",
    "griffith": "ff808181a067127101a08698d5f35912",
    "grenwald": "ff808181a067127101a08698d7c15913",
    "stellar": "ff808181a067127101a08698d9005914",
    "hastar": "ff808181a067127101a08698da705915",
    "claire": "ff808181a067127101a08698dba15916",
    "kesso": "ff808181a067127101a08698dcea5917",
    "sivir": "ff808181a067127101a08698dfd85918",
    "celia": "ff808181a067127101a08698e2e55919",
    "bella": "ff808181a067127101a08698e42d591a",
    "lucius": "ff808181a067127101a08698e57b591b",
    "robin": "ff808181a067127101a08698e6bd591c",
    "kafa": "ff808181a067127101a08698eca5591d",
    "william": "ff808181a067127101a08698eebb591e",
    "durant": "ff808181a067127101a08698f039591f"
  };

  function initHeroNotes(hero) {
    const storageKey = `last_asylum_hero_notes_${hero.slug}`;
    const authSessionKey = `last_asylum_admin_auth`;

    const cloudRecordId = cloudDbMapping[hero.slug];
    const cloudEndpoint = cloudRecordId ? `https://api.restful-api.dev/objects/${cloudRecordId}` : null;

    const defaultNote = `【立ち回り・編成考察】\n・${hero.nameJapanese || hero.name}の強みを生かしたおすすめ前衛・後衛構成。\n・特定コンテンツ（PvP/PVE/同盟戦）での評価メモ。\n\n【おすすめ装備・ギア構成】\n・優先ステータス: 攻撃力％ / 会心補正\n・専用装備との相性メモ。`;

    // UI Elements
    const adminAuthStatus = document.getElementById('admin-auth-status');
    const btnAdminAuth = document.getElementById('btn-admin-auth');
    const btnEditNote = document.getElementById('btn-edit-note');
    const btnSaveNote = document.getElementById('btn-save-note');
    const btnAdminLogout = document.getElementById('btn-admin-logout');

    // Modal elements
    const adminPassModal = document.getElementById('admin-pass-modal');
    const adminPassInput = document.getElementById('admin-pass-input');
    const adminPassError = document.getElementById('admin-pass-error');
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    const btnModalSubmit = document.getElementById('btn-modal-submit');

    // Helper: Fixed Admin Password ('kickoff')
    const getAdminPassword = () => 'kickoff';
    const isAuth = () => sessionStorage.getItem(authSessionKey) === 'true';

    // 1. Initial Render from localStorage or defaultNote
    let localSaved = localStorage.getItem(storageKey);
    let currentNoteText = localSaved || defaultNote;
    renderNoteDisplay(currentNoteText);

    // Helper to upload note text to Cloud DB
    function uploadNoteToCloud(text) {
      if (!cloudEndpoint) return Promise.resolve(false);
      const payload = {
        name: `last_asylum_note_${hero.slug}`,
        data: {
          slug: hero.slug,
          note: text,
          updatedAt: Date.now()
        }
      };
      return fetch(cloudEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.ok)
      .catch(err => {
        console.warn('Cloud sync upload error:', err);
        return false;
      });
    }

    // 2. Fetch latest Note from Cloud DB (Multi-device shared sync)
    if (cloudEndpoint) {
      fetch(cloudEndpoint)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.data && data.data.note) {
            const cloudNote = data.data.note;
            // If local storage has a customized note that hasn't been synced to cloud, upload it first
            if (localSaved && localSaved !== cloudNote && localSaved !== defaultNote) {
              uploadNoteToCloud(localSaved);
            } else if (cloudNote && cloudNote !== defaultNote) {
              currentNoteText = cloudNote;
              localStorage.setItem(storageKey, cloudNote);
              renderNoteDisplay(cloudNote);
            }
          }
        })
        .catch(err => console.log('Cloud note fetch fallback to local:', err));
    }

    // Update UI according to Auth State
    function updateAuthUI() {
      const authenticated = isAuth();
      if (authenticated) {
        if (adminAuthStatus) {
          adminAuthStatus.textContent = '🔓 管理者ログイン中 (全端末共通編集)';
          adminAuthStatus.style.background = 'rgba(255,215,0,0.15)';
          adminAuthStatus.style.color = 'var(--accent-gold)';
          adminAuthStatus.style.borderColor = 'var(--accent-gold)';
        }
        if (btnAdminAuth) btnAdminAuth.style.display = 'none';
        if (btnEditNote) btnEditNote.style.display = 'inline-block';
        if (btnAdminLogout) btnAdminLogout.style.display = 'inline-block';
      } else {
        if (adminAuthStatus) {
          adminAuthStatus.textContent = '🔒 閲覧モード (全端末共通同期中)';
          adminAuthStatus.style.background = 'rgba(255,255,255,0.1)';
          adminAuthStatus.style.color = 'var(--text-muted)';
          adminAuthStatus.style.borderColor = 'rgba(255,255,255,0.15)';
        }
        if (btnAdminAuth) btnAdminAuth.style.display = 'inline-block';
        if (btnEditNote) btnEditNote.style.display = 'none';
        if (btnSaveNote) btnSaveNote.style.display = 'none';
        if (btnAdminLogout) btnAdminLogout.style.display = 'none';

        // Ensure display mode
        if (notesDisplayArea) notesDisplayArea.style.display = 'block';
        if (notesEditorArea) notesEditorArea.style.display = 'none';
      }
    }

    updateAuthUI();

    // Open Auth Modal
    if (btnAdminAuth) {
      btnAdminAuth.onclick = () => {
        if (adminPassModal) {
          adminPassModal.style.display = 'flex';
          if (adminPassInput) {
            adminPassInput.value = '';
            adminPassInput.focus();
          }
          if (adminPassError) adminPassError.textContent = '';
        }
      };
    }

    // Cancel Modal
    if (btnModalCancel) {
      btnModalCancel.onclick = () => {
        if (adminPassModal) adminPassModal.style.display = 'none';
      };
    }

    // Submit Auth Modal
    const handleAuthSubmit = () => {
      const inputPass = adminPassInput ? adminPassInput.value.trim() : '';
      const correctPass = getAdminPassword();

      if (inputPass === correctPass) {
        sessionStorage.setItem(authSessionKey, 'true');
        if (adminPassModal) adminPassModal.style.display = 'none';
        updateAuthUI();
        startEditing();
      } else {
        if (adminPassError) adminPassError.textContent = '❌ パスワードが正しくありません。';
      }
    };

    if (btnModalSubmit) btnModalSubmit.onclick = handleAuthSubmit;
    if (adminPassInput) {
      adminPassInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleAuthSubmit();
      };
    }

    // Start Editing Note
    function startEditing() {
      if (!isAuth()) return;
      if (notesDisplayArea) notesDisplayArea.style.display = 'none';
      if (notesEditorArea) {
        notesEditorArea.style.display = 'block';
        notesEditorArea.value = currentNoteText;
        notesEditorArea.focus();
      }
      if (btnEditNote) btnEditNote.style.display = 'none';
      if (btnSaveNote) btnSaveNote.style.display = 'inline-block';
      if (notesStatusMsg) notesStatusMsg.textContent = '';
    }

    if (btnEditNote) {
      btnEditNote.onclick = startEditing;
    }

    // Save Note to both local and Cloud DB
    if (btnSaveNote) {
      btnSaveNote.onclick = () => {
        if (!isAuth()) return;
        currentNoteText = notesEditorArea.value.trim();
        localStorage.setItem(storageKey, currentNoteText);
        renderNoteDisplay(currentNoteText);

        notesEditorArea.style.display = 'none';
        notesDisplayArea.style.display = 'block';
        btnSaveNote.style.display = 'none';
        btnEditNote.style.display = 'inline-block';

        if (notesStatusMsg) {
          notesStatusMsg.textContent = '⏳ 全端末へ同期保存中...';
        }

        uploadNoteToCloud(currentNoteText).then(success => {
          if (notesStatusMsg) {
            if (success) {
              notesStatusMsg.textContent = '✓ 管理者権限でWikiノートを更新し、全端末へ同期保存しました！';
            } else {
              notesStatusMsg.textContent = '✓ ローカル保存完了（ネットワーク状況をご確認ください）';
            }
            setTimeout(() => notesStatusMsg.textContent = '', 4000);
          }
        });
      };
    }

    // Logout Admin
    if (btnAdminLogout) {
      btnAdminLogout.onclick = () => {
        sessionStorage.removeItem(authSessionKey);
        updateAuthUI();
        if (notesStatusMsg) {
          notesStatusMsg.textContent = 'ログアウトしました。';
          setTimeout(() => notesStatusMsg.textContent = '', 2000);
        }
      };
    }
  }

  function renderNoteDisplay(text) {
    if (notesDisplayArea) {
      notesDisplayArea.textContent = text;
    }
  }

  // ==========================================
  // LocalStorage Community Comments Management
  // ==========================================
  function initHeroComments(hero) {
    const commentsStorageKey = `last_asylum_hero_comments_${hero.slug}`;

    let commentsList = [];
    const saved = localStorage.getItem(commentsStorageKey);
    if (saved) {
      try {
        commentsList = JSON.parse(saved);
      } catch(e) {
        commentsList = [];
      }
    } else {
      commentsList = [];
    }

    renderCommentsList(commentsList);

    // Submit handler
    if (btnSubmitComment) {
      btnSubmitComment.onclick = () => {
        const userName = (commentNameInput ? commentNameInput.value.trim() : '') || '名無しの指揮官';
        const star = parseInt(commentRatingSelect ? commentRatingSelect.value : '5', 10);
        const text = commentTextInput ? commentTextInput.value.trim() : '';

        if (!text) {
          alert('コメント本文を入力してください。');
          return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

        const newComment = {
          user: userName,
          star: star,
          date: dateStr,
          text: text
        };

        commentsList.unshift(newComment); // Add to top
        localStorage.setItem(commentsStorageKey, JSON.stringify(commentsList));
        renderCommentsList(commentsList);

        // Reset input form
        if (commentTextInput) commentTextInput.value = '';
        alert('評価コメントを投稿しました！');
      };
    }
  }

  function renderCommentsList(list) {
    if (!commentsListContainer) return;

    if (!list || list.length === 0) {
      commentsListContainer.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; padding:1rem; text-align:center;">まだコメントはありません。最初の口コミを投稿してみましょう！</div>';
      return;
    }

    commentsListContainer.innerHTML = list.map(c => {
      const starsHtml = '★'.repeat(c.star) + '☆'.repeat(5 - c.star);
      return `
        <div class="comment-item">
          <div class="comment-meta">
            <span><strong>👤 ${escapeHtml(c.user)}</strong> <span style="color:var(--accent-gold); margin-left:0.4rem;">${starsHtml}</span></span>
            <span>🕒 ${escapeHtml(c.date)}</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-color); margin:0; line-height:1.5;">${escapeHtml(c.text)}</p>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
