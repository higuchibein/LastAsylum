/**
 * ラストアサイラム攻略Webサイト - データベース処理スクリプト (database.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  let allItems = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let currentViewMode = 'grid'; // 'grid' or 'table'

  const itemsContainer = document.getElementById('items-container');
  const resultCount = document.getElementById('result-count');
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const viewButtons = document.querySelectorAll('.view-btn');
  
  // モーダル要素
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalIcon = document.getElementById('modal-icon');
  const modalRarity = document.getElementById('modal-rarity');
  const modalType = document.getElementById('modal-type');
  const modalLevel = document.getElementById('modal-level');
  const modalDesc = document.getElementById('modal-desc');
  const modalEffects = document.getElementById('modal-effects');
  const modalMaterials = document.getElementById('modal-materials');

  // URLクエリパラメータの解析 (?category=rune など)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  if (initialCategory) {
    currentCategory = initialCategory;
    tabButtons.forEach(btn => {
      if (btn.dataset.category === initialCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // JSONデータのロード
  fetch('data/items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('データの読み込みに失敗しました: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      allItems = data;
      renderData();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      itemsContainer.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--accent-red);">データの読み込み中にエラーが発生しました。</div>`;
    });

  // イベントリスナー: リアルタイム検索
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderData();
    });
  }

  // イベントリスナー: カテゴリタブ
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderData();
    });
  });

  // イベントリスナー: ビュー切替 (Grid / Table)
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.dataset.view;
      renderData();
    });
  });

  // フィルタリングと描画処理
  function renderData() {
    const filtered = allItems.filter(item => {
      // カテゴリ絞り込み
      const matchCategory = (currentCategory === 'all' || item.category === currentCategory);
      
      // テキスト検索絞り込み (名称, タイプ, 説明文, 効果)
      const matchSearch = !currentSearchQuery || 
        item.name.toLowerCase().includes(currentSearchQuery) ||
        item.type.toLowerCase().includes(currentSearchQuery) ||
        item.description.toLowerCase().includes(currentSearchQuery) ||
        (item.effects && item.effects.some(eff => eff.toLowerCase().includes(currentSearchQuery)));

      return matchCategory && matchSearch;
    });

    if (resultCount) {
      resultCount.textContent = `該当件数: ${filtered.length}件`;
    }

    if (filtered.length === 0) {
      itemsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>条件に一致するデータが見つかりませんでした</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">検索キーワードやカテゴリ設定を変更してお試しください。</p>
        </div>
      `;
      return;
    }

    if (currentViewMode === 'grid') {
      renderGridView(filtered);
    } else {
      renderTableView(filtered);
    }
  }

  // カードグリッド描画
  function renderGridView(items) {
    itemsContainer.className = 'items-grid';
    itemsContainer.innerHTML = items.map(item => `
      <div class="item-card" data-id="${item.id}">
        <div class="item-card-header">
          <div class="item-icon">${item.icon || '📦'}</div>
          <div class="item-meta">
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-badges">
              <span class="badge-rarity ${item.rarity.toLowerCase()}">${escapeHtml(item.rarity)}</span>
              <span class="badge-type">${escapeHtml(item.type)}</span>
            </div>
          </div>
        </div>
        <ul class="item-effects">
          ${item.effects ? item.effects.slice(0, 2).map(eff => `<li>${escapeHtml(eff)}</li>`).join('') : ''}
          ${item.effects && item.effects.length > 2 ? `<li style="color:var(--text-muted); list-style:none;">...他${item.effects.length - 2}件</li>` : ''}
        </ul>
        <div class="item-card-footer">
          <span>${escapeHtml(item.level || '')}</span>
          <button class="btn btn-secondary btn-sm">詳細を見る</button>
        </div>
      </div>
    `).join('');

    // カードのクリックイベント
    document.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const item = allItems.find(i => i.id === id);
        if (item) openModal(item);
      });
    });
  }

  // テーブル一覧描画
  function renderTableView(items) {
    itemsContainer.className = 'table-wrapper';
    itemsContainer.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>アイコン</th>
            <th>名称</th>
            <th>レアリティ</th>
            <th>タイプ</th>
            <th>レベル / 段階</th>
            <th>主な効果</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr data-id="${item.id}">
              <td style="font-size:1.5rem; text-align:center;">${item.icon || '📦'}</td>
              <td style="font-weight:700;">${escapeHtml(item.name)}</td>
              <td><span class="badge-rarity ${item.rarity.toLowerCase()}">${escapeHtml(item.rarity)}</span></td>
              <td>${escapeHtml(item.type)}</td>
              <td>${escapeHtml(item.level || '-')}</td>
              <td style="font-size:0.85rem;">${item.effects ? escapeHtml(item.effects[0]) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // 行クリックイベント
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const item = allItems.find(i => i.id === id);
        if (item) openModal(item);
      });
    });
  }

  // モーダル開く処理
  function openModal(item) {
    modalIcon.textContent = item.icon || '📦';
    modalTitle.textContent = item.name;
    modalRarity.textContent = item.rarity;
    modalRarity.className = `badge-rarity ${item.rarity.toLowerCase()}`;
    modalType.textContent = item.type;
    modalLevel.textContent = item.level ? `(${item.level})` : '';
    modalDesc.textContent = item.description || '詳細説明はありません。';

    // 効果一覧
    if (item.effects && item.effects.length > 0) {
      modalEffects.innerHTML = item.effects.map(eff => `<li>${escapeHtml(eff)}</li>`).join('');
    } else {
      modalEffects.innerHTML = '<li>効果情報なし</li>';
    }

    // 必要素材一覧
    if (item.materials && item.materials.length > 0) {
      modalMaterials.innerHTML = item.materials.map(mat => `
        <span class="material-chip">🧪 ${escapeHtml(mat.name)} x${mat.amount.toLocaleString()}</span>
      `).join('');
    } else {
      modalMaterials.innerHTML = '<span class="material-chip" style="color:var(--text-muted);">必要素材なし</span>';
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 背景スクロール禁止
  }

  // モーダル閉じる処理
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // HTMLエスケープヘルパー
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
