// ============================================================
// KKU Follow - auth.js
// ============================================================

var Auth = (function() {
  'use strict';
  var GOOGLE_CLIENT_ID = '672167885104-soe5fstmbrnr66tnc9n9236bdlr4n9jn.apps.googleusercontent.com';

  function init() {
    var btn = document.getElementById('googleSignInBtn'); if (!btn) return;
    if (typeof google === 'undefined' || !google.accounts) { loadGSI(function(){ initBtn(btn); }); } else { initBtn(btn); }
  }

  function loadGSI(cb) { var s=document.createElement('script'); s.src='https://accounts.google.com/gsi/client'; s.onload=cb; s.async=true; s.defer=true; document.head.appendChild(s); }

  function initBtn(btn) {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) { btn.textContent='Google Sign-In \u0E44\u0E21\u0E48\u0E1E\u0E23\u0E49\u0E2D\u0E21'; btn.disabled=true; return; }
    google.accounts.id.initialize({ client_id:GOOGLE_CLIENT_ID, callback:handleCredential, auto_select:false, cancel_on_tap_outside:true });
    btn.addEventListener('click',function(){ google.accounts.id.prompt(); });
  }

  function handleCredential(response) {
    if (!response || !response.credential) { showErr('No se pudo obtener credencial'); return; }
    KKU.UI.showLoading();
    KKU.API.call('login',{idToken:response.credential}).then(function(r){ KKU.UI.hideLoading(); if(r.success){ KKU.State.token=r.data.token; KKU.State.user=r.data.user; sessionStorage.setItem('kku_token',r.data.token); sessionStorage.setItem('kku_user',JSON.stringify(r.data.user)); setTimeout(function(){KKU.navigateTo('home');},500); } else { showErr(r.message); } }).catch(function(){ KKU.UI.hideLoading(); showErr('\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E25\u0E49\u0E21\u0E40\u0E2B\u0E25\u0E27'); });
  }

  function showErr(msg) { var el=document.getElementById('loginError'); if(el){el.textContent=msg;el.classList.remove('hidden');} }

  function logout() {
    if (KKU.State.token) { KKU.API.call('logout',{token:KKU.State.token}).catch(function(){}); }
    if (typeof google!=='undefined' && google.accounts && google.accounts.id) { google.accounts.id.disableAutoSelect(); }
    KKU.State.token=null; KKU.State.user=null; sessionStorage.removeItem('kku_token'); sessionStorage.removeItem('kku_user'); KKU.navigateTo('login');
  }

  function isAuthenticated() { return !!KKU.State.token; }
  return { init:init, logout:logout, isAuthenticated:isAuthenticated };
})();
