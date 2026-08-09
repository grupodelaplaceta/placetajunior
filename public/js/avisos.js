/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Avisos internos (sin popups nativos del navegador)
   juniorAviso(mensaje, tipo)        → toast en la página
   juniorConfirmar(mensaje, onSi)    → diálogo de confirmación interno
   Accesible: aria-live, role=dialog, foco y teclado gestionados.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.juniorAviso) return;

  var css = '' +
    '.pj-toasts{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:10px;width:min(92vw,430px);pointer-events:none}' +
    '.pj-toast{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#fff;color:#111827;box-shadow:0 10px 30px rgba(0,0,0,.18);border:2px solid #eceef3;animation:pjToastIn .25s ease;pointer-events:auto;font-family:"Plus Jakarta Sans",sans-serif;font-weight:600;font-size:14px}' +
    '.pj-toast.out{animation:pjToastOut .25s ease forwards}' +
    '.pj-toast-ico{font-size:20px;flex:0 0 auto}' +
    '.pj-toast-ok .pj-toast-ico{color:#336E45}' +
    '.pj-toast-error .pj-toast-ico{color:#FF3333}' +
    '.pj-toast-info .pj-toast-ico{color:#3A00E1}' +
    '.pj-toast-txt{flex:1}' +
    '.pj-toast-x{border:none;background:transparent;cursor:pointer;color:#9CA3AF;display:flex;align-items:center;padding:2px}' +
    '.pj-toast-x .material-symbols-rounded{font-size:18px}' +
    '@keyframes pjToastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes pjToastOut{to{opacity:0;transform:translateY(12px)}}' +
    '.pj-confirm{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(17,24,39,.5)}' +
    '.pj-confirm-card{width:min(92vw,360px);background:#fff;border-radius:20px;padding:26px 22px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.3);animation:pjToastIn .2s ease}' +
    '.pj-confirm-ico{width:60px;height:60px;border-radius:50%;background:rgba(58,0,225,.1);color:#3A00E1;display:flex;align-items:center;justify-content:center;margin:0 auto 12px}' +
    '.pj-confirm-ico .material-symbols-rounded{font-size:32px}' +
    '.pj-confirm-msg{font-family:"Plus Jakarta Sans",sans-serif;font-weight:600;font-size:15px;color:#111827;margin:0 0 18px;line-height:1.5}' +
    '.pj-confirm-actions{display:flex;gap:10px}' +
    '.pj-confirm-actions button{flex:1;padding:12px;border-radius:999px;font-family:"Plus Jakarta Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;border:none}' +
    '.pj-confirm-no{background:#F3F4F6;color:#374151}' +
    '.pj-confirm-yes{background:#4E3B70;color:#fff}' +
    '.pj-confirm-yes:focus-visible,.pj-confirm-no:focus-visible,.pj-toast-x:focus-visible{outline:3px solid #3A00E1;outline-offset:2px}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var toastCont = null;
  function getToasts() {
    if (!toastCont) {
      toastCont = document.createElement('div');
      toastCont.className = 'pj-toasts';
      toastCont.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastCont);
    }
    return toastCont;
  }

  window.juniorAviso = function (msg, tipo) {
    var t = getToasts();
    var el = document.createElement('div');
    el.className = 'pj-toast pj-toast-' + (tipo || 'info');
    var icono = tipo === 'ok' ? 'check_circle' : (tipo === 'error' ? 'error' : 'info');
    el.innerHTML = '<span class="material-symbols-rounded pj-toast-ico">' + icono + '</span><span class="pj-toast-txt"></span><button type="button" class="pj-toast-x" aria-label="Cerrar aviso"><span class="material-symbols-rounded">close</span></button>';
    el.querySelector('.pj-toast-txt').textContent = String(msg || '');
    var cerrar = function () {
      el.classList.add('out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    };
    el.querySelector('.pj-toast-x').addEventListener('click', cerrar);
    t.appendChild(el);
    setTimeout(cerrar, 4200);
  };

  var confirmEl = null;
  function onKey(e) {
    if (!confirmEl) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'Escape') { e.preventDefault(); cerrarConfirmar(); }
    else if (e.key === 'Enter' && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('pj-confirm-yes')) {
      e.preventDefault(); cerrarConfirmar(true);
    }
  }
  function cerrarConfirmar(si) {
    if (!confirmEl) return;
    var cb = confirmEl.__onSi;
    var el = confirmEl;
    confirmEl = null;
    el.remove();
    if (si && cb) cb();
  }

  window.juniorConfirmar = function (msg, onSi) {
    if (confirmEl) cerrarConfirmar();
    confirmEl = document.createElement('div');
    confirmEl.className = 'pj-confirm';
    confirmEl.setAttribute('role', 'dialog');
    confirmEl.setAttribute('aria-modal', 'true');
    confirmEl.setAttribute('aria-label', 'Confirmación');
    confirmEl.__onSi = onSi;
    confirmEl.innerHTML =
      '<div class="pj-confirm-card">' +
      '<div class="pj-confirm-ico"><span class="material-symbols-rounded">help</span></div>' +
      '<p class="pj-confirm-msg"></p>' +
      '<div class="pj-confirm-actions">' +
      '<button type="button" class="pj-confirm-no">Cancelar</button>' +
      '<button type="button" class="pj-confirm-yes">Aceptar</button>' +
      '</div></div>';
    confirmEl.querySelector('.pj-confirm-msg').textContent = String(msg || '');
    confirmEl.querySelector('.pj-confirm-yes').addEventListener('click', function () { cerrarConfirmar(true); });
    confirmEl.querySelector('.pj-confirm-no').addEventListener('click', function () { cerrarConfirmar(); });
    confirmEl.addEventListener('click', function (e) { if (e.target === confirmEl) cerrarConfirmar(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(confirmEl);
    var si = confirmEl.querySelector('.pj-confirm-yes');
    if (si) si.focus();
  };
})();
