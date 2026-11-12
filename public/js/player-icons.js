(function () {
  const iconFallbacks = {
    close: '×', emoji_events: '🏆', check_circle: '✓', cancel: '✕',
    chevron_left: '‹', chevron_right: '›', calculate: '∑', description: '▤',
    extension: '◆', view_timeline: '↔', draw: '✎', compare_arrows: '↔',
    drag_indicator: '⠿', search: '⌕', visibility: '◉', science: '⚗',
    construction: '⚒', shopping_cart: '🛒', explore: '◎', casino: '🎲',
    menu_book: '▤', quiz: '?', abc: 'ABC', arrow_forward: '→', home: '⌂',
    redeem: '🎁', save: '▣', link: '↔', edit_note: '✎',
    format_list_numbered: '≡', public: '◎', map: '▧', keyboard: '⌨', '123': '123'
  };
  let fallbackActive = false;
  const observer = new MutationObserver((records) => {
    if (!fallbackActive) return;
    records.forEach((record) => record.addedNodes.forEach(replaceIconLigatures));
  });

  function replaceIconLigatures(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const icons = [];
    if (root.matches('.material-symbols-rounded')) icons.push(root);
    icons.push(...root.querySelectorAll('.material-symbols-rounded'));
    icons.forEach((icon) => {
      if (icon.classList.contains('pj-icon-fallback')) return;
      icon.textContent = iconFallbacks[icon.textContent.trim()] || '•';
      icon.classList.add('pj-icon-fallback');
    });
  }

  function useIconFallbacks() {
    if (fallbackActive) return;
    fallbackActive = true;
    replaceIconLigatures(document.body);
    observer.observe(document.body, { childList: true, subtree: true });
    document.documentElement.classList.add('ic-ok');
  }

  const timeout = window.setTimeout(useIconFallbacks, 2200);
  if (!document.fonts || !document.fonts.load) {
    useIconFallbacks();
    return;
  }
  document.fonts.load('24px "Material Symbols Rounded"', 'home').then((fonts) => {
    if (!fonts.some((font) => font.family === 'Material Symbols Rounded' && font.status === 'loaded')) {
      useIconFallbacks();
      return;
    }
    window.clearTimeout(timeout);
    document.documentElement.classList.add('ic-ok');
  }, useIconFallbacks);
})();
