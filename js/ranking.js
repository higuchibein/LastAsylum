/**
 * Last Asylum - Hero Tier Ranking & Team Compositions Script (js/ranking.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabBtns = document.querySelectorAll('.ranking-tab-btn');
  const tabContents = document.querySelectorAll('.ranking-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Hero Data Mapping for Avatars & Slugs
  const HERO_SLUGS = {
    'マレーナ': 'marlena',
    'ルイス': 'louis',
    'ウルフレッド': 'ulfrid',
    'アーサー': 'arthur',
    'ハーパー': 'harper',
    'シャドウ': 'shadow',
    'シンシア': 'cynthia',
    'ベル': 'bell',
    'レッドレディ': 'red-lady',
    'ピエロ': 'joker',
    'アニー': 'annie',
    'ニコル': 'nicole',
    'ダスカール': 'daskal',
    'クレア': 'claire',
    'シリア': 'celia',
    'アッシュ': 'ash',
    'グリンウォルド': 'grenwald',
    'ゾーヤ': 'zoya',
    'ビリー': 'billy',
    'ベラ': 'bella'
  };

  // Enhance Hero Chips with Avatar Images
  const heroChips = document.querySelectorAll('.hero-chip[data-hero]');
  heroChips.forEach(chip => {
    const heroName = chip.getAttribute('data-hero');
    const slug = HERO_SLUGS[heroName];
    if (slug) {
      const img = document.createElement('img');
      img.src = `https://satorimeta.com/assets/last-asylum/heroes/portraits/${slug}.webp`;
      img.alt = heroName;
      img.className = 'hero-chip-avatar';
      img.onerror = () => { img.style.display = 'none'; };
      chip.prepend(img);
    }
  });
});
