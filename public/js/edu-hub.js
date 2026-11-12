(() => {
  'use strict';

  const text = {
    ca: {
      title: 'Placeta Junior Education',
      description: 'Gestiona Placeta Junior al teu centre: activitats, dispositius i recursos per a docents.',
      registerNav: 'Alta de centre', centersNav: 'Els meus centres', adminNav: 'Administració', studioNav: 'Obrir Studio',
      titleIntro: 'Tot el que el teu centre necessita per', titleFocus: 'aprendre jugant.',
      lead: 'Crea activitats per a l’aula, gestiona els teus centres i configura Placeta Junior IO des d’un espai senzill i segur.',
      createActivity: 'Crear una activitat', registerCenter: 'Donar d’alta un centre',
      alreadyAccount: 'Ja tens un compte?', goCenters: 'Entra als teus centres',
      sectionEyebrow: 'UN ESPAI PER A CADA TASCA', sectionTitle: 'Comença pel que necessites',
      sectionLead: 'Accessos directes i clars per a docents i centres educatius.',
      studioKicker: 'CREA PER A LA TEUA AULA', studioTitle: 'Placeta Junior Studio',
      studioText: 'Dissenya activitats educatives amb plantilles guiades i vista prèvia.', studioLink: 'Obrir Studio',
      registerKicker: 'COMENÇA ACÍ', registerTitle: 'Alta de centre o docent',
      registerText: 'Sol·licita l’accés per al teu centre o registra’t com a docent individual.', registerLink: 'Veure opcions',
      centersKicker: 'GESTIONA ELS TEUS EQUIPS', centersTitle: 'Els meus centres',
      centersText: 'Consulta els teus centres, dispositius i configuració d’aula.', centersLink: 'Entra amb Google',
      adminKicker: 'PERSONAL AUTORITZAT', adminTitle: 'Administració',
      adminText: 'Gestiona organitzacions i documents de Placeta Junior Education.',
      adminLink: 'Accés d’administració', footerBrand: 'Education · Grup de La Placeta',
      privacy: 'Privadesa', legal: 'Avís legal'
    },
    en: {
      title: 'Placeta Junior Education',
      description: 'Manage Placeta Junior at your school: activities, devices and resources for teachers.',
      registerNav: 'School sign-up', centersNav: 'My schools', adminNav: 'Administration', studioNav: 'Open Studio',
      titleIntro: 'Everything your school needs to', titleFocus: 'learn through play.',
      lead: 'Create classroom activities, manage your schools and configure Placeta Junior IO in one simple, secure space.',
      createActivity: 'Create an activity', registerCenter: 'Register a school',
      alreadyAccount: 'Already have an account?', goCenters: 'Go to my schools',
      sectionEyebrow: 'A SPACE FOR EVERY TASK', sectionTitle: 'Start with what you need',
      sectionLead: 'Clear, direct access for teachers and schools.',
      studioKicker: 'CREATE FOR YOUR CLASS', studioTitle: 'Placeta Junior Studio',
      studioText: 'Design learning activities with guided templates and a live preview.', studioLink: 'Open Studio',
      registerKicker: 'GET STARTED', registerTitle: 'School or teacher sign-up',
      registerText: 'Request access for your school or register as an individual teacher.', registerLink: 'See options',
      centersKicker: 'MANAGE YOUR DEVICES', centersTitle: 'My schools',
      centersText: 'View your schools, devices and classroom settings.', centersLink: 'Sign in with Google',
      adminKicker: 'AUTHORISED STAFF', adminTitle: 'Administration',
      adminText: 'Manage Placeta Junior Education organisations and documents.',
      adminLink: 'Administration access', footerBrand: 'Education · Grupo de La Placeta',
      privacy: 'Privacy', legal: 'Legal notice'
    }
  };

  let language = 'es';
  try {
    const app = JSON.parse(localStorage.getItem('pj2') || '{}');
    const accessibility = JSON.parse(localStorage.getItem('junior_acc_web') || '{}');
    const preferred = app.l || accessibility.idioma;
    if (preferred === 'ca' || preferred === 'en') language = preferred;
  } catch (error) {
    console.warn('No se pudo leer el idioma guardado para Education.', error);
  }
  if (language === 'es') return;

  const translations = text[language];
  document.documentElement.lang = language;
  document.title = translations.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = translations.description;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const translation = translations[element.dataset.i18n];
    if (translation) element.textContent = translation;
  });
})();
