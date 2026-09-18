// ============================================================
// KKU Follow - api.js
// API Call wrapper for Google Apps Script Backend
// ============================================================

KKU.API = (function() {
  'use strict';

  function call(action, payload) {
    payload = payload || {};
    var token = KKU.State.token || sessionStorage.getItem('kku_token');
    if (token) payload.token = token;

    var url = KKU.Config.API_URL + '?action=' + encodeURIComponent(action);

    return new Promise(function(resolve) {
      // ใช้ XMLHttpRequest เพราะรองรับ GAS redirect ได้ดีกว่า fetch
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = false;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          try {
            if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);
              if (!data.success && data.message && data.message.indexOf('Session') !== -1) {
                Auth.logout();
              }
              resolve(data);
            } else {
              resolve({
                success: false,
                data: null,
                message: 'HTTP ' + xhr.status
              });
            }
          } catch (e) {
            resolve({
              success: false,
              data: null,
              message: 'Parse error: ' + e.message
            });
          }
        }
      };

      xhr.onerror = function() {
        resolve({
          success: false,
          data: null,
          message: 'Network error: ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
        });
      };

      xhr.ontimeout = function() {
        resolve({
          success: false,
          data: null,
          message: 'Request timeout'
        });
      };

      xhr.timeout = 30000;
      xhr.send(JSON.stringify(payload));
    });
  }

  return {
    call: call,
    login: function(t) { return call('login', { idToken: t }); },
    aiParse: function(t) { return call('aiParse', { transcript: t }); },
    saveWorkRecord: function(d) { return call('createWorkRecord', d); },
    getWorkRecord: function(id) { return call('getWorkRecord', { recordId: id }); },
    updateWorkRecord: function(d) { return call('updateWorkRecord', d); },
    deleteWorkRecord: function(id) { return call('deleteWorkRecord', { recordId: id }); },
    getWorkRecords: function(p) { return call('listWorkRecords', p || {}); },
    uploadPhoto: function(rid, fn, b64) { return call('uploadPhoto', { recordId: rid, fileName: fn, base64Data: b64 }); },
    deletePhoto: function(id) { return call('deletePhoto', { photoId: id }); },
    listPhotos: function(rid) { return call('listPhotos', { recordId: rid }); },
    createLink: function(rid, t, u, lt) { return call('createLink', { recordId: rid, title: t, url: u, linkType: lt || 'other' }); },
    deleteLink: function(id) { return call('deleteLink', { linkId: id }); },
    listLinks: function(rid) { return call('listLinks', { recordId: rid }); },
    generateReport: function(t, sd, ed) { return call('generateReport', { type: t, startDate: sd, endDate: ed }); },
    getProfile: function() { return call('getProfile'); }
  };
})();
