(function () {
  const paths = {
    close: 'M6 6l12 12M18 6 6 18',
    arrow_back: 'M19 12H5m7 7-7-7 7-7',
    arrow_forward: 'M5 12h14m-7-7 7 7-7 7',
    play_arrow: 'M8 5v14l11-7z',
    person: 'M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    calendar_today: 'M4 5h16v16H4zM8 3v4m8-4v4M4 10h16',
    child_care: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-4-9a4 4 0 0 0 8 0m-6-4h.01m4 0h.01',
    credit_card: 'M2 5h20v14H2zM2 10h20m-16 5h4',
    flag: 'M5 21V4m0 1c6-4 8 4 14 0v10c-6 4-8-4-14 0',
    info: 'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    help: 'M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.1 1.1-1.9 1.4-1.9 3.4m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    print: 'M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-12-4h12v7H6z',
    school: 'm2 10 10-7 10 7-10 7zm4 3v5c4 3 8 3 12 0v-5m4-3v7',
    task_alt: 'M9 11l3 3L22 4m-2 8v7H3V5h13',
    trending_up: 'm3 17 6-6 4 4 8-8m-6 0h6v6',
    radio_button_unchecked: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
    text_fields: 'M3 7V4h18v3M12 4v16m-4 0h8M5 20h4m6 0h4',
    balance: 'M12 3v18m-8 0h16M5 7h14m-12 0-4 8h8zm10 0-4 8h8z',
    psychology: 'M9 4a3 3 0 0 0-5 2 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 5 2m6-14a3 3 0 0 1 5 2 3 3 0 0 1 1 5 3 3 0 0 1-1 5 3 3 0 0 1-5 2M12 4v16m-4-9h8',
    computer: 'M3 4h18v13H3zM8 21h8m-4-4v4',
    code: 'm8 8-4 4 4 4m8-8 4 4-4 4m-5-7-2 6',
    palm_tree: 'M12 21V9m0 1C8 8 6 6 5 3c3 0 6 2 7 5m0 2c1-3 4-5 7-5-1 3-3 5-7 7m0-4C9 5 7 4 4 5m8 4c3-4 5-5 8-4',
    landscape: 'm3 19 6-8 4 5 3-4 5 7zm5-13h.01M2 21h20',
    sailing: 'M3 17h18l-3 4H6zm9-13v13m0-13 7 13m-7-13L5 17',
    light: 'M9 21h6m-5-3h4m-2-2V5m-6 7a7 7 0 1 1 12 0l-2 2H9z',
    home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    check_circle: 'M22 11.1V12a10 10 0 1 1-5.9-9.2M22 4 12 14l-3-3',
    cancel: 'M18 6 6 18M6 6l12 12',
    chevron_left: 'm15 18-6-6 6-6',
    chevron_right: 'm9 18 6-6-6-6',
    calculate: 'M5 3h14v18H5zM8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2',
    description: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8m-8 4h8',
    extension: 'M19 13h-2v-2a2 2 0 1 0-4 0v2h-2V9H9V7a2 2 0 1 0-4 0v2H3v11h16z',
    view_timeline: 'M4 5h4m4 0h8M8 5v6m4 0h8m-8 0v7m-8 0h8',
    draw: 'm14 6 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16z',
    compare_arrows: 'M7 7h14m-4-4 4 4-4 4M17 17H3m4-4-4 4 4 4',
    drag_indicator: 'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
    search: 'm20 20-4.3-4.3M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
    visibility: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    science: 'M9 3h6m-5 0v6l-6.5 10a1.4 1.4 0 0 0 1.2 2h14.6a1.4 1.4 0 0 0 1.2-2L14 9V3m-7 12h12',
    construction: 'm14 7 3-3 4 4-3 3M4 20l9-9m-8-4 4-4 5 5-4 4z',
    shopping_cart: 'M3 4h2l2.5 11h11L21 8H6m3 12h.01M17 20h.01',
    explore: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-14-2.5 6.5L7 17l2.5-6.5z',
    casino: 'M4 4h16v16H4zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01',
    menu_book: 'M12 7v14m0-14C9 4 5 4 3 5v14c3-1 6-1 9 2m0-14c3-3 7-3 9-2v14c-3-1-6-1-9 2',
    quiz: 'M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.1 1.1-1.9 1.4-1.9 3.4m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    emoji_events: 'M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zm0 2H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4',
    redeem: 'M3 10h18v11H3zM2 6h20v4H2zm10 0v15m0-15c-5 0-6-5-3-5 2 0 3 5 3 5Zm0 0c5 0 6-5 3-5-2 0-3 5-3 5Z',
    save: 'M5 3h12l4 4v14H3V3zm2 0v6h10V3m-9 18v-8h10v8',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3',
    link: 'M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7m2.7 6.4a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7',
    edit_note: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4zM4 4h8M4 8h6',
    format_list_numbered: 'M10 6h11M10 12h11M10 18h11M4 5h1v4m-2 0h3m-3 4h2a1 1 0 0 1 0 2H3m0 3h3v3H3m0-2h3',
    public: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20m-10 10a15 15 0 0 0 0-20m0 20a15 15 0 0 1 0-20',
    map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zm6-3v15m6-12v15',
    keyboard: 'M3 5h18v14H3zM7 9h.01M11 9h.01M15 9h.01M19 9h.01M5 12h.01M9 12h.01M13 12h.01M17 12h.01M7 16h10',
    abc: 'M3 16l3-9 3 9m-5-3h4m4 3V7h4a2 2 0 0 1 0 4h-4m0 0h4a2.5 2.5 0 0 1 0 5h-4',
    '123': 'M5 8a2 2 0 1 1 4 0c0 2-4 2-4 5h4m4-7h4l-3 4h1a2 2 0 1 1-2 2m9-6a2 2 0 1 0-4 0c0 2 4 2 4 5h-4'
  };
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach(replaceIconLigatures));
  });

  function replaceIconLigatures(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const icons = [];
    if (root.matches('.material-symbols-rounded')) icons.push(root);
    icons.push(...root.querySelectorAll('.material-symbols-rounded'));
    icons.forEach((icon) => {
      if (icon.classList.contains('pj-icon-svg')) return;
      const name = icon.textContent.trim();
      const path = paths[name];
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('class', 'pj-svg-icon');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      if (path) {
        const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shape.setAttribute('d', path);
        svg.appendChild(shape);
      } else {
        const shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        shape.setAttribute('cx', '12');
        shape.setAttribute('cy', '12');
        shape.setAttribute('r', '8');
        svg.appendChild(shape);
      }
      icon.replaceChildren(svg);
      icon.classList.add('pj-icon-svg');
    });
  }

  replaceIconLigatures(document.body);
  observer.observe(document.body, { childList: true, subtree: true });
  document.documentElement.classList.add('ic-ok');
})();
