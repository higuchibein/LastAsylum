/**
 * ラストアサイラム攻略Webサイト - 共通UI & トースト通知スクリプト (main.js)
 */

// グローバル関数: クリップボードコピー & サイバートースト表示
window.showToast = function(message, icon = '✨') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);

  // アニメーション完了後に削除
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

window.copyToClipboard = function(text, successMsg = 'クリップボードにコピーしました！') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(successMsg, '📋');
    }).catch(err => {
      console.error('Clipboard error:', err);
      fallbackCopyTextToClipboard(text, successMsg);
    });
  } else {
    fallbackCopyTextToClipboard(text, successMsg);
  }
};

function fallbackCopyTextToClipboard(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    window.showToast(successMsg, '📋');
  } catch (err) {
    console.error('Fallback copy error:', err);
    window.showToast('コピーに失敗しました', '⚠️');
  }
  document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニューの切替処理
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // 画面外またはリンククリック時にメニューを閉じる
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 現在のページに応じたアクティブナビリンクのハイライト
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // スクロール時のヘッダー演出
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
});
