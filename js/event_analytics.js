/**
 * Last Asylum Strategy Wiki - Event Power Analytics & Advanced Multi-Field Search (event_analytics.js)
 * Features 3 Independent Search Inputs (Name, Power, Level) & Kana Group Tabs
 */

const EVENT_DATA_MASTER = {
  "title": "ラストアサイラム｜イベント戦力整理",
  "updatedDate": "2026.08.31 (8/31峡谷戦最新)",
  "description": "8/31峡谷戦リストから最新戦力を更新。分類は17M／14.5M基準で判定。",
  "summary": { "confirmedCount": 85, "levelEnteredCount": 84, "classifiedCount": 66 }
};

document.addEventListener('DOMContentLoaded', () => {
  let allMembers = [];
  let currentKanaGroup = 'all';

  // 3 Independent Search Inputs
  const searchNameInput = document.getElementById('search-name-input');
  const searchPowerInput = document.getElementById('search-power-input');
  const searchLevelInput = document.getElementById('search-level-input');

  const searchBtn = document.getElementById('event-search-btn');
  const resetBtn = document.getElementById('event-reset-btn');
  const catFilter = document.getElementById('event-cat-filter');
  const sortSelect = document.getElementById('event-sort-select');
  const resultCount = document.getElementById('event-result-count');
  const gridContainer = document.getElementById('event-members-grid');

  const exportTextBtn = document.getElementById('export-text-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  // Load JSON asynchronously for Chart.js & Exports
  fetch('data/event_power.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      if (data && data.members) {
        allMembers = data.members;
        setTimeout(() => {
          try { initCharts(); } catch (e) { console.error('Chart init error:', e); }
        }, 50);
      }
    })
    .catch(err => console.log('Fetch error:', err));

  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/,/g, '')
      .trim();
  }

  function parsePowerInput(val) {
    if (!val) return 0;
    let s = normalizeText(val);
    if (s.includes('億')) {
      const num = parseFloat(s.replace('億', ''));
      return isNaN(num) ? 0 : Math.round(num * 100000000);
    }
    if (s.includes('万')) {
      const num = parseFloat(s.replace('万', ''));
      return isNaN(num) ? 0 : Math.round(num * 10000);
    }
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  }

  // --- Main Filtering Logic ---
  function filterAndSortCards() {
    if (!gridContainer) return;

    const nameQ = normalizeText(searchNameInput ? searchNameInput.value : '');
    const powerQ = parsePowerInput(searchPowerInput ? searchPowerInput.value : '');
    const levelQ = searchLevelInput ? searchLevelInput.value.trim() : '';

    const catVal = catFilter ? catFilter.value : 'all';
    const sortVal = sortSelect ? sortSelect.value : 'power-desc';

    const cards = Array.from(gridContainer.children);
    let visibleCount = 0;

    cards.forEach(card => {
      const name = normalizeText(card.getAttribute('data-name') || '');
      const cat = card.getAttribute('data-category') || '';
      const power = parseInt(card.getAttribute('data-power') || '0', 10);
      const level = card.getAttribute('data-level') || '';
      const group = card.getAttribute('data-group') || '';
      const cardText = normalizeText(card.textContent);

      // 1. Kana Tab Group Matching
      let matchKana = true;
      if (currentKanaGroup !== 'all') {
        if (currentKanaGroup === 'や') {
          matchKana = (group === 'や' || group === 'ら' || group === 'わ');
        } else {
          matchKana = (group === currentKanaGroup);
        }
      }

      // 2. Category Filter Matching
      let matchCat = true;
      if (catVal === 'has-help') {
        matchCat = cardText.includes('ヘルプ:');
      } else if (catVal !== 'all') {
        matchCat = cat.includes(catVal);
      }

      // 3. Name Search Input
      let matchName = !nameQ || name.includes(nameQ) || cardText.includes(nameQ);

      // 4. Power Search Input (Min power threshold)
      let matchPower = true;
      if (powerQ > 0) {
        matchPower = (power >= powerQ);
      }

      // 5. Level Search Input (Exact match or substring)
      let matchLevel = true;
      if (levelQ) {
        matchLevel = (level === levelQ);
      }

      if (matchKana && matchCat && matchName && matchPower && matchLevel) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultCount) {
      resultCount.textContent = `表示人数: ${visibleCount}名 (全${cards.length}名中)`;
    }

    // Re-sort Visible DOM Cards
    const visibleCards = cards.filter(c => c.style.display !== 'none');
    visibleCards.sort((a, b) => {
      const pA = parseInt(a.getAttribute('data-power') || '0', 10);
      const pB = parseInt(b.getAttribute('data-power') || '0', 10);
      const lA = parseInt(a.getAttribute('data-level') || '0', 10);
      const lB = parseInt(b.getAttribute('data-level') || '0', 10);
      const nA = a.getAttribute('data-name') || '';
      const nB = b.getAttribute('data-name') || '';

      if (sortVal === 'power-desc') return pB - pA;
      if (sortVal === 'power-asc') return pA - pB;
      if (sortVal === 'level-desc') return lB - lA;
      if (sortVal === 'name-asc') return nA.localeCompare(nB, 'ja');
      return 0;
    });

    visibleCards.forEach(card => gridContainer.appendChild(card));
  }

  // --- Kana Group Tab Clicks ---
  const kanaTabs = document.querySelectorAll('.kana-tab');
  kanaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      kanaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentKanaGroup = tab.getAttribute('data-group') || 'all';
      filterAndSortCards();
    });
  });

  // --- Input Event Listeners ---
  [searchNameInput, searchPowerInput, searchLevelInput].forEach(input => {
    if (input) {
      input.addEventListener('input', filterAndSortCards);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          filterAndSortCards();
        }
      });
    }
  });

  if (searchBtn) searchBtn.addEventListener('click', filterAndSortCards);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchNameInput) searchNameInput.value = '';
      if (searchPowerInput) searchPowerInput.value = '';
      if (searchLevelInput) searchLevelInput.value = '';
      if (catFilter) catFilter.value = 'all';
      if (sortSelect) sortSelect.value = 'power-desc';
      
      currentKanaGroup = 'all';
      kanaTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.kana-tab[data-group="all"]');
      if (allTab) allTab.classList.add('active');

      filterAndSortCards();
      if (window.showToast) window.showToast('検索・表示条件をすべてリセットしました');
    });
  }

  if (catFilter) catFilter.addEventListener('change', filterAndSortCards);
  if (sortSelect) sortSelect.addEventListener('change', filterAndSortCards);

  // --- Chart.js ---
  function initCharts() {
    if (!allMembers.length || typeof Chart === 'undefined') return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const catCanvas = document.getElementById('categoryChart');
    if (catCanvas) {
      const catCounts = {
        '① 自力＋援軍': 0,
        '② 自力クリア': 0,
        '③ 援軍ありで挑戦': 0,
        '④ 燃焼後に援軍': 0,
        '未判定 / 未分類': 0
      };

      allMembers.forEach(m => {
        if (m.category && m.category.includes('①')) catCounts['① 自力＋援軍']++;
        else if (m.category && m.category.includes('②')) catCounts['② 自力クリア']++;
        else if (m.category && m.category.includes('③')) catCounts['③ 援軍ありで挑戦']++;
        else if (m.category && m.category.includes('④')) catCounts['④ 燃焼後に援軍']++;
        else catCounts['未判定 / 未分類']++;
      });

      new Chart(catCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{
            data: Object.values(catCounts),
            backgroundColor: ['#ffd700', '#00f0ff', '#ff9f43', '#ee5253', '#546e7a'],
            borderColor: '#131722',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
        }
      });
    }

    const lvCanvas = document.getElementById('levelChart');
    if (lvCanvas) {
      const lvCounts = { 'Lv.30': 0, 'Lv.29': 0, 'Lv.28': 0, 'Lv.27': 0, 'Lv.26以下': 0, '未確認': 0 };
      allMembers.forEach(m => {
        const lv = parseInt(m.level, 10);
        if (lv === 30) lvCounts['Lv.30']++;
        else if (lv === 29) lvCounts['Lv.29']++;
        else if (lv === 28) lvCounts['Lv.28']++;
        else if (lv === 27) lvCounts['Lv.27']++;
        else if (lv > 0 && lv <= 26) lvCounts['Lv.26以下']++;
        else lvCounts['未確認']++;
      });

      new Chart(lvCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(lvCounts),
          datasets: [{
            label: '人数 (名)',
            data: Object.values(lvCounts),
            backgroundColor: ['#ffd700', '#00f0ff', '#10ac84', '#ff9f43', '#ee5253', '#546e7a'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  // Export Helpers
  if (exportTextBtn) {
    exportTextBtn.addEventListener('click', () => {
      let text = `【Last Asylum 8/31 峡谷戦イベント戦力一覧】\n確認人数: ${allMembers.length}名\n\n`;
      allMembers.forEach((m, i) => {
        text += `${i+1}. ${m.name} | Lv.${m.level} | 戦力: ${m.firstFleetPowerFormatted} | ${m.category}\n`;
      });
      window.copyToClipboard(text, '戦力一覧テキストをコピーしました！');
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      let csvStr = "\uFEFFメンバー名,レベル,一軍戦力,分類,2軍ヘルプ先,3軍ヘルプ先\n";
      allMembers.forEach(m => {
        csvStr += `"${m.name}","${m.level}","${m.firstFleetPower}","${m.category}","${m.secondHelp}","${m.thirdHelp}"\n`;
      });

      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LastAsylum_EventPower_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.showToast('CSVファイルをダウンロードしました！');
    });
  }
});
