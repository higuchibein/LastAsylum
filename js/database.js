/**
 * Last Asylum Strategy Wiki - Real Data Database Script (database.js)
 * Cache-Buster Enabled
 */

document.addEventListener('DOMContentLoaded', () => {
  let allItems = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';

  const itemsContainer = document.getElementById('items-container');
  const resultCount = document.getElementById('result-count');
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.tab-btn');

  // キャッシュバスター付きでフェッチ
  fetch('data/items.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      allItems = data;
      render();
    })
    .catch(err => {
      console.error(err);
      if (itemsContainer) itemsContainer.innerHTML = '<div style="color:var(--accent-red);">データ読込エラーが発生しました</div>';
    });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
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
});
