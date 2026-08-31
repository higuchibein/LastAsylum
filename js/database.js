/**
 * Last Asylum Strategy Wiki - Database Script (database.js)
 * Supports Facilities, Items, Events, and Real Hero Stats JSON (heroes.json)
 */

document.addEventListener('DOMContentLoaded', () => {
  let heroesData = [];
  let facilityData = [];
  let giftCodeData = [];
  let eventPowerData = [];

  let currentCategory = 'all';
  const container = document.getElementById('items-container');
  const searchInput = document.getElementById('search-input');
  const resultCount = document.getElementById('result-count');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const sortWrapper = document.getElementById('sort-control-wrapper');
  const sortSelect = document.getElementById('sort-select');
  const eventSummaryPanel = document.getElementById('event-summary-panel');

  // Check URL Query Parameters for category tab
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get('category');
  if (paramCategory) {
    currentCategory = paramCategory;
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === paramCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Load all JSON data
  Promise.all([
    fetch('data/heroes.json?v=' + Date.now()).then(r => r.json()).catch(() => null),
    fetch('data/items.json?v=' + Date.now()).then(r => r.json()).catch(() => []),
    fetch('data/event_power.json?v=' + Date.now()).then(r => r.json()).catch(() => null)
  ]).then(([heroesRes, itemsRes, eventRes]) => {
    if (heroesRes && heroesRes.heroes) {
      heroesData = heroesRes.heroes;
    }
    if (eventRes && eventRes.members) {
      eventPowerData = eventRes.members;
    }

    // Process facility & items data
    (itemsRes || []).forEach(item => {
      if (item.category === 'facility') facilityData.push(item);
      else if (item.category === 'gift_code') giftCodeData.push(item);
    });

    renderAll();
  });

  function renderAll() {
    if (!container) return;

    let itemsToRender = [];
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (eventSummaryPanel) {
      eventSummaryPanel.style.display = (currentCategory === 'event_power') ? 'block' : 'none';
    }
    if (sortWrapper) {
      sortWrapper.style.display = (currentCategory === 'event_power') ? 'flex' : 'none';
    }

    if (currentCategory === 'hero') {
      itemsToRender = heroesData.map(h => ({
        type: 'hero',
        id: h.id,
        name: h.nameJapanese || h.name,
        nameEn: h.name,
        rarity: h.rarity,
        role: h.role,
        faction: h.factionJapanese || h.faction,
        heroClass: h.heroClassJapanese || h.heroClass,
        stats: h.stats,
        skills: h.skills || [],
        imageUrl: h.imageUrl,
        rawObj: h
      }));
    } else if (currentCategory === 'facility') {
      itemsToRender = facilityData.map(f => ({ type: 'facility', ...f }));
    } else if (currentCategory === 'gift_code') {
      itemsToRender = giftCodeData.map(g => ({ type: 'gift_code', ...g }));
    } else if (currentCategory === 'event_power') {
      let list = [...eventPowerData];
      const sortVal = sortSelect ? sortSelect.value : 'power-desc';
      if (sortVal === 'power-desc') list.sort((a, b) => b.firstFleetPower - a.firstFleetPower);
      else if (sortVal === 'power-asc') list.sort((a, b) => a.firstFleetPower - b.firstFleetPower);
      else if (sortVal === 'level-desc') list.sort((a, b) => (b.level || 0) - (a.level || 0));

      itemsToRender = list.map(m => ({ type: 'event_power', ...m }));
    } else {
      // ALL category
      itemsToRender = [
        ...heroesData.map(h => ({ type: 'hero', ...h, name: h.nameJapanese || h.name })),
        ...facilityData.map(f => ({ type: 'facility', ...f })),
        ...giftCodeData.map(g => ({ type: 'gift_code', ...g })),
        ...eventPowerData.slice(0, 10).map(m => ({ type: 'event_power', ...m }))
      ];
    }

    // Filter by Query
    if (query) {
      itemsToRender = itemsToRender.filter(item => {
        const text = [
          item.name || '',
          item.nameEn || '',
          item.description || '',
          item.category || '',
          item.faction || '',
          item.role || '',
          item.code || ''
        ].join(' ').toLowerCase();
        return text.includes(query);
      });
    }

    if (resultCount) {
      resultCount.textContent = `表示件数: ${itemsToRender.length}件`;
    }

    if (itemsToRender.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">該当するデータが見つかりませんでした</div>';
      return;
    }

    container.innerHTML = itemsToRender.map(item => {
      if (item.type === 'hero') {
        const stats = item.stats || {};
        const skills = item.skills || [];
        return `
          <div class="card" style="border-top: 3px solid var(--accent-gold);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge" style="background:var(--accent-gold-dark); color:#fff; font-weight:800;">${item.rarity || 'UR'}</span>
              <span style="font-size:0.8rem; color:var(--accent-blue);">${escapeHtml(item.faction || '')}</span>
            </div>
            
            <h3 style="font-size:1.2rem; color:#fff; margin-bottom:0.3rem;">${escapeHtml(item.name)}</h3>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">役割: ${escapeHtml(item.role || '')} (${escapeHtml(item.heroClass || '')})</div>

            <!-- Stats Table -->
            <div style="background:var(--bg-primary); padding:0.6rem; border-radius:6px; margin-bottom:0.8rem; display:grid; grid-template-columns:repeat(4, 1fr); gap:0.3rem; text-align:center; font-size:0.75rem;">
              <div>
                <div style="color:var(--text-muted);">ATK</div>
                <div style="color:var(--accent-gold); font-weight:700;">${stats.ATK || '-'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted);">HP</div>
                <div style="color:var(--accent-blue); font-weight:700;">${stats.HP || '-'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted);">DEF</div>
                <div style="color:#10ac84; font-weight:700;">${stats.DEF || '-'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted);">CMD</div>
                <div style="color:#ff9f43; font-weight:700;">${stats.CMD || '-'}</div>
              </div>
            </div>

            <!-- Skill Overview -->
            <div style="font-size:0.8rem;">
              <div style="font-weight:700; color:var(--accent-gold); margin-bottom:0.3rem;">⚡ 所持スキル (${skills.length}種):</div>
              <ul style="padding-left:1rem; margin:0; color:var(--text-muted); font-size:0.75rem;">
                ${skills.slice(0, 3).map(s => `<li><strong style="color:#fff;">${escapeHtml(s.name)}</strong>: ${escapeHtml((s.description || '').slice(0, 45))}...</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else if (item.type === 'event_power') {
        let catColor = 'var(--text-muted)';
        if (item.category && item.category.includes('①')) catColor = 'var(--accent-gold)';
        else if (item.category && item.category.includes('②')) catColor = 'var(--accent-blue)';
        else if (item.category && item.category.includes('③')) catColor = '#ff9f43';

        return `
          <div class="card" style="border-left:4px solid ${catColor};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--text-muted);">峡谷戦メンバー</span>
              <span class="badge-val" style="font-size:0.75rem; background:rgba(0,240,255,0.1); color:var(--accent-blue);">Lv.${item.level}</span>
            </div>
            <div style="font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:0.4rem;">${escapeHtml(item.name)}</div>
            <div style="background:var(--bg-primary); padding:0.5rem; border-radius:6px; margin-bottom:0.5rem; text-align:center;">
              <div style="font-size:0.7rem; color:var(--text-muted);">一軍戦力</div>
              <div style="font-size:1.15rem; font-weight:800; color:var(--accent-gold);">${item.firstFleetPowerFormatted || item.firstFleetPower}</div>
            </div>
            <div style="font-size:0.8rem;"><span style="color:var(--text-muted);">分類:</span> <span style="color:${catColor}; font-weight:700;">${escapeHtml(item.category)}</span></div>
          </div>
        `;
      } else {
        return `
          <div class="card">
            <h3 style="font-size:1.1rem; color:var(--accent-gold); margin-bottom:0.4rem;">${escapeHtml(item.name)}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(item.description || '')}</p>
          </div>
        `;
      }
    }).join('');
  }

  // Tab button handlers
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      renderAll();
    });
  });

  if (searchInput) searchInput.addEventListener('input', renderAll);
  if (sortSelect) sortSelect.addEventListener('change', renderAll);

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
