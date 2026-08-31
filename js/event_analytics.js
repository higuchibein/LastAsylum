/**
 * Last Asylum Strategy Wiki - Event Power Analytics Script (event_analytics.js)
 * Robust rendering & member list guarantee
 */

document.addEventListener('DOMContentLoaded', () => {
  let eventData = null;
  let allMembers = [];

  // DOM Elements
  const statTotalCount = document.getElementById('stat-total-count');
  const statTotalPower = document.getElementById('stat-total-power');
  const statAvgPower = document.getElementById('stat-avg-power');
  const statMaxPower = document.getElementById('stat-max-power');

  const searchInput = document.getElementById('event-search-input');
  const catFilter = document.getElementById('event-cat-filter');
  const sortSelect = document.getElementById('event-sort-select');
  const resultCount = document.getElementById('event-result-count');
  const gridContainer = document.getElementById('event-members-grid');

  const exportTextBtn = document.getElementById('export-text-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  // Load event_power.json with Cache Buster
  fetch('data/event_power.json?v=' + Date.now())
    .then(res => res.json())
    .then(data => {
      eventData = data;
      allMembers = (data && data.members) ? data.members : [];
      
      console.log('Loaded members count:', allMembers.length);

      // Always execute KPIs and Member List Rendering safely
      try { initKPIs(); } catch (e) { console.error('KPI Error:', e); }
      try { initCharts(); } catch (e) { console.error('Charts Error:', e); }
      
      // Guaranteed Member List Render
      renderMembers();
    })
    .catch(err => {
      console.error('Fetch event_power.json error:', err);
      if (gridContainer) gridContainer.innerHTML = '<div style="color:var(--accent-red); padding:2rem; text-align:center;">イベント戦力データの読み込みに失敗しました</div>';
    });

  // --- 1. KPI Summary Calculation ---
  function initKPIs() {
    if (!allMembers || !allMembers.length) return;

    const totalCount = allMembers.length;
    const validPowerMembers = allMembers.filter(m => m.firstFleetPower > 0);
    const sumPower = validPowerMembers.reduce((acc, m) => acc + m.firstFleetPower, 0);
    const avgPower = validPowerMembers.length ? Math.round(sumPower / validPowerMembers.length) : 0;
    const maxPower = validPowerMembers.length ? Math.max(...validPowerMembers.map(m => m.firstFleetPower)) : 0;

    if (statTotalCount) statTotalCount.textContent = `${totalCount}名`;
    if (statTotalPower) statTotalPower.textContent = formatCompactPower(sumPower);
    if (statAvgPower) statAvgPower.textContent = formatCompactPower(avgPower);
    if (statMaxPower) statMaxPower.textContent = maxPower > 0 ? maxPower.toLocaleString() : '-';
  }

  function formatCompactPower(num) {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + '億';
    } else if (num >= 10000) {
      return (num / 10000).toFixed(0) + '万';
    }
    return num.toLocaleString();
  }

  // --- 2. Chart.js Graphs Rendering (Safely Scoped) ---
  function initCharts() {
    if (!allMembers || !allMembers.length || typeof Chart === 'undefined') {
      console.warn('Chart.js or members not ready');
      return;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Chart 1: Category Distribution
    const catCanvas = document.getElementById('categoryChart');
    if (catCanvas) {
      const catCounts = {
        '① 自力＋援軍': 0,
        '② 自力クリア': 0,
        '③ 援軍ありで挑戦': 0,
        'その他 / 未分類': 0
      };

      allMembers.forEach(m => {
        if (m.category && m.category.includes('①')) catCounts['① 自力＋援軍']++;
        else if (m.category && m.category.includes('②')) catCounts['② 自力クリア']++;
        else if (m.category && m.category.includes('③')) catCounts['③ 援軍ありで挑戦']++;
        else catCounts['その他 / 未分類']++;
      });

      new Chart(catCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{
            data: Object.values(catCounts),
            backgroundColor: ['#ffd700', '#00f0ff', '#ff9f43', '#546e7a'],
            borderColor: '#131722',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // Chart 2: Level Distribution
    const lvCanvas = document.getElementById('levelChart');
    if (lvCanvas) {
      const lvCounts = { 'Lv.30': 0, 'Lv.29': 0, 'Lv.28': 0, 'Lv.27以下': 0, '未確認': 0 };
      allMembers.forEach(m => {
        const lv = parseInt(m.level, 10);
        if (lv === 30) lvCounts['Lv.30']++;
        else if (lv === 29) lvCounts['Lv.29']++;
        else if (lv === 28) lvCounts['Lv.28']++;
        else if (lv > 0 && lv < 28) lvCounts['Lv.27以下']++;
        else lvCounts['未確認']++;
      });

      new Chart(lvCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(lvCounts),
          datasets: [{
            label: '人数 (名)',
            data: Object.values(lvCounts),
            backgroundColor: '#00f0ff',
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

    // Chart 3: Top 15 Power Ranking
    const topCanvas = document.getElementById('topPowerChart');
    if (topCanvas) {
      const sortedMembers = [...allMembers].sort((a, b) => b.firstFleetPower - a.firstFleetPower);
      const top15 = sortedMembers.slice(0, 15);

      new Chart(topCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: top15.map(m => m.name),
          datasets: [{
            label: '一軍戦力',
            data: top15.map(m => m.firstFleetPower),
            backgroundColor: (ctx) => {
              const idx = ctx.dataIndex;
              if (idx === 0) return '#ffd700';
              if (idx === 1) return '#e0e0e0';
              if (idx === 2) return '#cd7f32';
              return '#0099b8';
            },
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { grid: { display: false } }
          }
        }
      });
    }
  }

  // --- 3. Guaranteed Member List Rendering ---
  function renderMembers() {
    if (!gridContainer) return;

    if (!allMembers || !allMembers.length) {
      gridContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">メンバーデータが存在しません</div>';
      return;
    }

    let filtered = [...allMembers];

    // Filter by Category
    const catVal = catFilter ? catFilter.value : 'all';
    if (catVal === 'has-help') {
      filtered = filtered.filter(m => (m.secondHelp && m.secondHelp !== '-') || (m.thirdHelp && m.thirdHelp !== '-'));
    } else if (catVal !== 'all') {
      filtered = filtered.filter(m => m.category && m.category.includes(catVal));
    }

    // Filter by Search Query
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (q) {
      filtered = filtered.filter(m => {
        const text = [
          m.name,
          m.category || '',
          m.firstFleetPowerFormatted || '',
          m.secondHelp || '',
          m.thirdHelp || '',
          `lv.${m.level}`
        ].join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    // Sort Members
    const sortVal = sortSelect ? sortSelect.value : 'power-desc';
    if (sortVal === 'power-desc') {
      filtered.sort((a, b) => b.firstFleetPower - a.firstFleetPower);
    } else if (sortVal === 'power-asc') {
      filtered.sort((a, b) => a.firstFleetPower - b.firstFleetPower);
    } else if (sortVal === 'level-desc') {
      filtered.sort((a, b) => (parseInt(b.level, 10) || 0) - (parseInt(a.level, 10) || 0));
    } else if (sortVal === 'name-asc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'));
    }

    if (resultCount) resultCount.textContent = `表示人数: ${filtered.length}名 (全${allMembers.length}名中)`;

    if (filtered.length === 0) {
      gridContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">条件に一致するメンバーが見つかりませんでした</div>';
      return;
    }

    gridContainer.className = 'grid-cards';
    gridContainer.innerHTML = filtered.map((m, idx) => {
      let catBadgeColor = 'var(--text-muted)';
      if (m.category && m.category.includes('①')) catBadgeColor = 'var(--accent-gold)';
      else if (m.category && m.category.includes('②')) catBadgeColor = 'var(--accent-blue)';
      else if (m.category && m.category.includes('③')) catBadgeColor = '#ff9f43';

      return `
        <div class="card" style="border-left: 4px solid ${catBadgeColor};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="font-size:0.75rem; color:var(--text-muted);">Rank #${idx + 1}</span>
            <span class="badge-val" style="font-size:0.75rem; background:rgba(0,240,255,0.1); color:var(--accent-blue);">Lv.${m.level}</span>
          </div>
          
          <div style="font-size:1.15rem; font-weight:800; color:#fff; margin-bottom:0.4rem;">${escapeHtml(m.name)}</div>
          
          <div style="background:var(--bg-primary); padding:0.6rem; border-radius:6px; margin-bottom:0.6rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted);">一軍戦力</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--accent-gold);">${m.firstFleetPowerFormatted || m.firstFleetPower}</div>
          </div>

          <div style="font-size:0.8rem; margin-bottom:0.4rem;">
            <span style="color:var(--text-muted);">分類:</span>
            <span style="color:${catBadgeColor}; font-weight:700; margin-left:0.2rem;">${escapeHtml(m.category)}</span>
          </div>

          ${((m.secondHelp && m.secondHelp !== '-') || (m.thirdHelp && m.thirdHelp !== '-')) ? `
            <div style="font-size:0.75rem; background:rgba(255,255,255,0.03); padding:0.4rem; border-radius:4px; border-top:1px solid var(--border-color); margin-top:0.4rem;">
              ${(m.secondHelp && m.secondHelp !== '-') ? `<div style="color:var(--accent-blue);">2軍ヘルプ: ${escapeHtml(m.secondHelp)}</div>` : ''}
              ${(m.thirdHelp && m.thirdHelp !== '-') ? `<div style="color:var(--accent-gold);">3軍ヘルプ: ${escapeHtml(m.thirdHelp)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // Input Event Listeners
  if (searchInput) searchInput.addEventListener('input', renderMembers);
  if (catFilter) catFilter.addEventListener('change', renderMembers);
  if (sortSelect) sortSelect.addEventListener('change', renderMembers);

  // --- Export Functionality ---
  if (exportTextBtn) {
    exportTextBtn.addEventListener('click', () => {
      let text = `【Last Asylum 8/31 峡谷戦イベント戦力一覧】\n確認人数: ${allMembers.length}名\n\n`;
      allMembers.forEach((m, i) => {
        text += `${i+1}. ${m.name} | Lv.${m.level} | 戦力: ${m.firstFleetPowerFormatted} | ${m.category}\n`;
      });
      window.copyToClipboard(text, '戦力一覧テキストをクリップボードにコピーしました！');
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

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
