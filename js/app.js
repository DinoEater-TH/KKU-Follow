// ============================================================
// KKU Follow - app.js
// ============================================================

var KKU = KKU || {};

(function() {
  'use strict';

  KKU.Config = { API_URL: 'https://script.google.com/macros/s/AKfycbx5tOWLVchUhP1mx7uUyOlCCGUhRDfo3yHxibBnUjW04qtNOT3G5daXUqWAJpbUm7E/exec', APP_NAME: 'KKU Follow', VERSION: '1.0.0' };
  KKU.State = { user: null, token: null, currentPage: null };

  function init() { registerServiceWorker(); bootstrap(); }

  function bootstrap() {
    var token = sessionStorage.getItem('kku_token');
    var userJson = sessionStorage.getItem('kku_user');
    if (token && userJson) { try { KKU.State.token = token; KKU.State.user = JSON.parse(userJson); } catch(e) { clearSession(); } }
    var currentPage = detectCurrentPage();
    KKU.State.currentPage = currentPage;
    if (currentPage === 'index' || currentPage === 'login') { if (KKU.State.token) { KKU.navigateTo('home'); } else if (currentPage === 'index') { KKU.navigateTo('login'); } return; }
    if (!KKU.State.token) { KKU.navigateTo('login'); return; }
  }

  function detectCurrentPage() {
    var path = window.location.pathname || '';
    // GitHub Pages: /KKU-Follow/ or /KKU-Follow serves index.html
    if (
      path === '/' ||
      path.endsWith('/') ||
      path.endsWith('index.html') ||
      /\/KKU-Follow\/?$/.test(path)
    ) {
      return 'index';
    }
    var map = {
      'login.html': 'login',
      'home.html': 'home',
      'record-work.html': 'record',
      'review-work.html': 'review',
      'history.html': 'history',
      'work-detail.html': 'detail'
    };
    for (var k in map) {
      if (path.indexOf(k) !== -1) return map[k];
    }
    return 'index';
  }

  function navigateTo(page, params) {
    var map = {'login':'login.html','home':'home.html','record':'record-work.html','review':'review-work.html','history':'history.html','detail':'work-detail.html'};
    var url = map[page] || 'home.html';
    if (params) { var q=[]; for(var k in params){if(params.hasOwnProperty(k))q.push(encodeURIComponent(k)+'='+encodeURIComponent(params[k]));} if(q.length) url+='?'+q.join('&'); }
    window.location.href = url;
  }

  function clearSession() { sessionStorage.removeItem('kku_token'); sessionStorage.removeItem('kku_user'); KKU.State.token = null; KKU.State.user = null; }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./service-worker.js').catch(function(){}) }
  }

  KKU.init = init; KKU.navigateTo = navigateTo; KKU.clearSession = clearSession;

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

})();
