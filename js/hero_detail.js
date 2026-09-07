/**
 * Last Asylum - Individual Hero Details & Editable Notes Script (js/hero_detail.js)
 * Manages full hero specifications, skill trees, exclusive weapons, and LocalStorage-based wiki note editing.
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
  const btnEditNote = document.getElementById('btn-edit-note');
  const btnSaveNote = document.getElementById('btn-save-note');
  const btnResetNote = document.getElementById('btn-reset-note');
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
    document.title = `${jaName} (${hero.name}) 評価・スキル・ステータス個別図鑑 | Last Asylum Wiki`;

    // Faction Badge
    let facLabel = hero.faction || 'Ranger';
    const fLower = facLabel.toLowerCase();
    if (fLower.includes('warrior') || fLower.includes('ウォーリア')) facLabel = '⚔️ ウォーリア';
    else if (fLower.includes('ranger') || fLower.includes('レンジャー')) facLabel = '🏹 レンジャー';
    else if (fLower.includes('warlock') || fLower.includes('ソーサラー') || fLower.includes('ウォーロック')) facLabel = '🔮 ソーサラー';

    // Tier badge class
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

    // 2. Render Base Stats
    if (statsContainer) {
      const baseAtk = hero.levelProgressionData?.defaultAttackBase || 15971;
      const baseHp = baseAtk * 140;
      const baseDef = Math.round(baseAtk * 1.0);

      statsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); text-align:center;">
            <div style="font-size:0.72rem; color:var(--text-muted);">初期 ATK</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--accent-gold);">${baseAtk.toLocaleString()}</div>
          </div>
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); text-align:center;">
            <div style="font-size:0.72rem; color:var(--text-muted);">初期 HP</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--accent-blue);">${baseHp.toLocaleString()}</div>
          </div>
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); text-align:center;">
            <div style="font-size:0.72rem; color:var(--text-muted);">初期 DEF</div>
            <div style="font-size:1.2rem; font-weight:800; color:#10ac84;">${baseDef.toLocaleString()}</div>
          </div>
        </div>

        <ul style="font-size: 0.85rem; color: var(--text-color); line-height: 1.7; padding-left: 1.2rem; margin: 0;">
          <li><strong>最大到達レベル:</strong> Lv.150 (UR英雄補正適用)</li>
          <li><strong>ダメージタイプ:</strong> ${escapeHtml(hero.damageType || '物理ダメージ')}</li>
          <li><strong>推奨配置:</strong> ${escapeHtml(hero.defaultPlacement || '前衛')}</li>
          ${hero.hallOfHonor ? `<li><strong>殿堂バフ (Hall of Honor):</strong> <span style="color:var(--accent-gold);">${escapeHtml(hero.hallOfHonor)}</span></li>` : ''}
        </ul>
      `;
    }

    // 3. Render Exclusive Weapon (if present)
    if (weaponContainer) {
      const eq = hero.exclusiveWeapon;
      if (eq) {
        weaponContainer.innerHTML = `
          <div style="background: linear-gradient(180deg, rgba(255,215,0,0.1), rgba(0,0,0,0.4)); border: 1px solid var(--accent-gold); border-radius: 10px; padding: 1.1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <strong style="color:var(--accent-gold); font-size:1.05rem;">🗡️ ${escapeHtml(eq.weaponTitle)}</strong>
              <span class="badge" style="background:var(--accent-gold); color:#000; font-weight:900;">専用アーティファクト</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem; line-height:1.5;">${escapeHtml(eq.description || '')}</p>
            ${eq.stats ? `<div style="font-size:0.82rem; color:#fff; margin-bottom:0.3rem;">📊 <strong>ステータス補正:</strong> ${escapeHtml(eq.stats)}</div>` : ''}
            ${eq.effect ? `<div style="font-size:0.82rem; color:var(--accent-gold); font-weight:700;">⚡ <strong>特殊パッシブ効果:</strong> ${escapeHtml(eq.effect)}</div>` : ''}
          </div>
        `;
      } else {
        weaponContainer.innerHTML = `
          <div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center; background: var(--bg-primary); border-radius: 8px;">
            現在、${escapeHtml(jaName)} の専用装備データは未開放または未実装です。
          </div>
        `;
      }
    }

    // 4. Render Skills
    if (skillsContainer) {
      const skills = hero.skills || [];
      if (skills.length === 0) {
        skillsContainer.innerHTML = '<div style="color:var(--text-muted); padding:1rem; text-align:center;">スキルデータが存在しません。</div>';
      } else {
        skillsContainer.innerHTML = skills.map((s, idx) => `
          <div class="skill-detail-card">
            <div class="skill-detail-header">
              <span class="skill-name-txt">${idx + 1}. ⚡ ${escapeHtml(s.skillName)}</span>
              <span class="skill-badge-kind">${escapeHtml(s.kindLabelJapanese || s.kindLabel || 'スキル')}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem; line-height:1.5;">
              ${escapeHtml(s.description || '')}
            </p>
            ${s.unlockRequirement ? `<div style="font-size:0.75rem; color:var(--accent-gold);">🔓 <strong>解放条件:</strong> ${escapeHtml(s.unlockRequirement)}</div>` : ''}
          </div>
        `).join('');
      }
    }

    // Initialize Notes and Comments for this hero
    initHeroNotes(hero);
    initHeroComments(hero);
  }

  // ==========================================
  // LocalStorage Hero Wiki Notes Management
  // ==========================================
  function initHeroNotes(hero) {
    const storageKey = `last_asylum_hero_notes_${hero.slug}`;
    const defaultNote = `【立ち回り・編成考察】\n・${hero.nameJapanese || hero.name}の強みを生かしたおすすめ前衛・後衛構成。\n・特定コンテンツ（PvP/PVE/同盟戦）での評価メモ。\n\n【おすすめ装備・ギア構成】\n・優先ステータス: 攻撃力％ / 会心補正\n・専用装備との相性メモ。`;

    // Load saved note or default
    let currentNoteText = localStorage.getItem(storageKey);
    if (!currentNoteText) {
      currentNoteText = defaultNote;
    }

    renderNoteDisplay(currentNoteText);

    // Event handlers for Notes
    if (btnEditNote) {
      btnEditNote.addEventListener('click', () => {
        notesDisplayArea.style.display = 'none';
        notesEditorArea.style.display = 'block';
        notesEditorArea.value = currentNoteText;
        btnEditNote.style.display = 'none';
        btnSaveNote.style.display = 'inline-block';
        btnResetNote.style.display = 'inline-block';
        if (notesStatusMsg) notesStatusMsg.textContent = '';
      });
    }

    if (btnSaveNote) {
      btnSaveNote.addEventListener('click', () => {
        currentNoteText = notesEditorArea.value.trim();
        localStorage.setItem(storageKey, currentNoteText);
        renderNoteDisplay(currentNoteText);
        
        notesEditorArea.style.display = 'none';
        notesDisplayArea.style.display = 'block';
        btnSaveNote.style.display = 'none';
        btnResetNote.style.display = 'none';
        btnEditNote.style.display = 'inline-block';
        
        if (notesStatusMsg) {
          notesStatusMsg.textContent = '✓ メモをローカルストレージに保存しました！';
          setTimeout(() => notesStatusMsg.textContent = '', 3000);
        }
      });
    }

    if (btnResetNote) {
      btnResetNote.addEventListener('click', () => {
        if (confirm('保存されたメモをデフォルトにリセットしますか？')) {
          localStorage.removeItem(storageKey);
          currentNoteText = defaultNote;
          renderNoteDisplay(currentNoteText);
          
          notesEditorArea.style.display = 'none';
          notesDisplayArea.style.display = 'block';
          btnSaveNote.style.display = 'none';
          btnResetNote.style.display = 'none';
          btnEditNote.style.display = 'inline-block';

          if (notesStatusMsg) {
            notesStatusMsg.textContent = '✓ デフォルトメモにリセットしました。';
            setTimeout(() => notesStatusMsg.textContent = '', 3000);
          }
        }
      });
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
    
    // Default initial reviews for popular heroes
    const defaultComments = [
      {
        user: '指揮官α',
        star: 5,
        date: '2026/09/01 14:20',
        text: `${hero.nameJapanese || hero.name}は前衛タンクとして抜群の安定感。育成優先度SSクラスです！`
      },
      {
        user: '避難所ランカー',
        star: 4,
        date: '2026/09/03 09:15',
        text: `スキル2の範囲デバフが強い。PvP防衛編成に必須の一人。`
      }
    ];

    let commentsList = [];
    const saved = localStorage.getItem(commentsStorageKey);
    if (saved) {
      try {
        commentsList = JSON.parse(saved);
      } catch(e) {
        commentsList = defaultComments;
      }
    } else {
      commentsList = defaultComments;
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
