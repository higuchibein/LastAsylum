/**
 * Last Asylum Strategy Wiki - Database & Event Power List Script (database.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  let allItems = [];
  let eventPowerData = null;
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let currentSort = 'power-desc';

  const itemsContainer = document.getElementById('items-container');
  const resultCount = document.getElementById('result-count');
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sortSelect = document.getElementById('sort-select');
  const sortWrapper = document.getElementById('sort-control-wrapper');
  const eventSummaryPanel = document.getElementById('event-summary-panel');

  // URLパラメータでカテゴリ指定
  const urlParams = new URLSearchParams(window.location.search);
  const paramCat = urlParams.get('category');

  // データ並行ロード
  Promise.all([
    fetch('data/items.json?v=' + Date.now()).then(r => r.json()),
    fetch('data/event_power.json?v=' + Date.now()).then(r => r.json()).catch(() => null)
  ]).then(([items, eventData]) => {
    allItems = items;
    eventPowerData = eventData;

    if (paramCat) {
      const matchBtn = Array.from(tabButtons).find(b => b.dataset.category === paramCat);
      if (matchBtn) {
        tabButtons.forEach(b => b.classList.remove('active'));
        matchBtn.classList.add('active');
        currentCategory = paramCat;
      }
    }

    render();
  }).catch(err => {
    console.error(err);
    if (itemsContainer) itemsContainer.innerHTML = '<div style="color:var(--accent-red);">データ読込エラーが発生しました</div>';
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      render();
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      render();
    });
  });

  function render() {
    if (currentCategory === 'event_power') {
      renderEventPowerList();
    } else {
      renderDefaultItems();
    }
  }

  function renderDefaultItems() {
    if (sortWrapper) sortWrapper.style.display = 'none';
    if (eventSummaryPanel) eventSummaryPanel.style.display = 'none';

    const filtered = allItems.filter(item => {
      const matchCat = (currentCategory === 'all' || item.category === currentCategory);
      const text = [
        item.name,
        item.type || '',
        item.description || '',
        item.rarity || '',
        ...(item.tags || [])
      ].join(' ').toLowerCase();

      const matchSearch = !currentSearchQuery || text.includes(currentSearchQuery);

      return matchCat && matchSearch;
    });

    if (resultCount) resultCount.textContent = `該当件数: ${filtered.length}件`;

    if (filtered.length === 0) {
      itemsContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted);">データが見つかりませんでした</div>';
      return;
    }

    itemsContainer.className = 'grid-cards';
    itemsContainer.innerHTML = filtered.map(item => `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <span style="font-size:1.8rem;">${item.icon || '📦'}</span>
          <span class="badge-val" style="font-size:0.75rem;">${item.rarity || 'SSR'}</span>
        </div>
        <div style="font-weight:700; font-size:1.05rem; color:#fff; margin-bottom:0.3rem;">${item.name}</div>
        <div style="font-size:0.8rem; color:var(--accent-blue); margin-bottom:0.5rem;">${item.type || item.category}</div>
        <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">${item.description || ''}</div>
      </div>
    `).join('');
  }

  function renderEventPowerList() {
    if (!eventPowerData || !eventPowerData.members) {
      itemsContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">イベント戦力データを読み込んでいます...</div>';
      return;
    }

    if (sortWrapper) sortWrapper.style.display = 'flex';
    if (eventSummaryPanel) {
      eventSummaryPanel.style.display = 'block';
      document.getElementById('event-title').textContent = `⚔️ ${eventPowerData.title || 'イベント戦力一覧'}`;
      document.getElementById('event-date').textContent = eventPowerData.updatedDate || '';
      document.getElementById('event-desc').textContent = eventPowerData.description || '';
      document.getElementById('event-stat-count').textContent = `${eventPowerData.summary.confirmedCount}名`;
      document.getElementById('event-stat-lv').textContent = `${eventPowerData.summary.levelEnteredCount}名`;
      document.getElementById('event-stat-cat').textContent = `${eventPowerData.summary.classifiedCount}名`;
    }

    let members = [...eventPowerData.members];

    // Filter by Search Query
    if (currentSearchQuery) {
      members = members.filter(m => {
        const text = [
          m.name,
          m.category,
          m.firstFleetPowerFormatted,
          m.secondHelp,
          m.thirdHelp,
          `lv.${m.level}`
        ].join(' ').toLowerCase();
        return text.includes(currentSearchQuery);
      });
    }

    // Sort Members
    if (currentSort === 'power-desc') {
      members.sort((a, b) => b.firstFleetPower - a.firstFleetPower);
    } else if (currentSort === 'power-asc') {
      members.sort((a, b) => a.firstFleetPower - b.firstFleetPower);
    } else if (currentSort === 'level-desc') {
      members.sort((a, b) => (parseInt(b.level, 10) || 0) - (parseInt(a.level, 10) || 0));
    }

    if (resultCount) resultCount.textContent = `該当メンバー: ${members.length}名 (全${eventPowerData.members.length}名中)`;

    if (members.length === 0) {
      itemsContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">該当するメンバーが見つかりませんでした</div>';
      return;
    }

    itemsContainer.className = 'grid-cards';
    itemsContainer.innerHTML = members.map((m, idx) => {
      let catBadgeColor = 'var(--text-muted)';
      if (m.category.includes('①')) catBadgeColor = 'var(--accent-gold)';
      else if (m.category.includes('②')) catBadgeColor = 'var(--accent-blue)';
      else if (m.category.includes('③')) catBadgeColor = '#ff9f43';

      return `
        <div class="card" style="border-left: 3px solid ${catBadgeColor};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="font-size:0.75rem; color:var(--text-muted);">Rank #${idx + 1}</span>
            <span class="badge-val" style="font-size:0.75rem; background:rgba(0,240,255,0.1); color:var(--accent-blue);">Lv.${m.level}</span>
          </div>
          
          <div style="font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:0.4rem;">${escapeHtml(m.name)}</div>
          
          <div style="background:var(--bg-primary); padding:0.5rem; border-radius:6px; margin-bottom:0.6rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted);">一軍戦力</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--accent-gold);">${m.firstFleetPowerFormatted}</div>
          </div>

          <div style="font-size:0.8rem; margin-bottom:0.3rem;">
            <span style="color:var(--text-muted);">分類:</span>
            <span style="color:${catBadgeColor}; font-weight:700;">${escapeHtml(m.category)}</span>
          </div>

          ${(m.secondHelp !== '-' || m.thirdHelp !== '-') ? `
            <div style="font-size:0.75rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:0.4rem; margin-top:0.4rem;">
              ${m.secondHelp !== '-' ? `<div>2軍ヘルプ: ${escapeHtml(m.secondHelp)}</div>` : ''}
              ${m.thirdHelp !== '-' ? `<div>3軍ヘルプ: ${escapeHtml(m.thirdHelp)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
