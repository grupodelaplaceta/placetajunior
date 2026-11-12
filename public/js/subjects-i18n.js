(function () {
  const TEXTS = {
    maths: ['Matemáticas', 'Matemàtiques', 'Mathematics'],
    geographyHistory: ['Geografía e historia', 'Geografia i història', 'Geography & history'],
    science: ['Ciencias', 'Ciències', 'Science'],
    language: ['Lengua', 'Llengua', 'Language'],
    geography: ['Geografía', 'Geografia', 'Geography'],
    history: ['Historia', 'Història', 'History'],
    social: ['Ciencias sociales', 'Ciències socials', 'Social studies'],
    technology: ['Tecnología', 'Tecnologia', 'Technology'],
    computing: ['Pensamiento computacional', 'BOTXIFRA', 'STEM'],
    logic: ['Lógica', 'Lògica', 'Logic'],
    art: ['Arte', 'Art', 'Art'],
    music: ['Música', 'Música', 'Music'],
    culture: ['Cultura', 'Cultura', 'Culture'],
    general: ['General', 'General', 'General']
  };
  const RULES = [
    ['computing', /pensamiento computacional|pensament computacional|botxifra|stem|computational thinking/],
    ['geographyHistory', /geografia e historia|geografia i historia|geography and history/],
    ['maths', /matemat|mathematics|\bmath\b|aritm/],
    ['social', /ciencias sociales|ciencies socials|social studies/],
    ['science', /cienci|science|natural|biology|biologia|physics|fisica|chemistry|quimica/],
    ['language', /lengua|llengua|language|lectura|reading|idiom|literat|castell|valenc|catala|angles|english/],
    ['geography', /geografia|geography/],
    ['history', /historia|history/],
    ['technology', /tecnologia|technology|informatica|programacion|robotica/],
    ['logic', /logica|logic|reasoning/],
    ['music', /musica|music/],
    ['art', /\barte\b|\bart\b|plastica|visual arts/],
    ['culture', /cultura|culture/],
    ['general', /^general$/]
  ];

  window.PJTranslateSubject = function (subject, locale) {
    const language = String(locale || (() => {
      try {
        return JSON.parse(localStorage.getItem('junior_acc_web') || '{}').idioma || 'es';
      } catch (error) {
        return 'es';
      }
    })()).toLowerCase().split(/[-_]/)[0];
    const index = language === 'ca' || language === 'val' || language === 'va' ? 1 : language === 'en' ? 2 : 0;
    const normalized = String(subject || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const match = RULES.find(([, pattern]) => pattern.test(normalized));
    return match ? TEXTS[match[0]][index] : String(subject || '');
  };
})();
