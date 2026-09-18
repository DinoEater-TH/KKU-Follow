// ============================================================
// KKU Follow - api.js
// ============================================================

KKU.API = (function() {
  'use strict';

  function call(action, payload) {
    payload = payload || {};
    var token = KKU.State.token || sessionStorage.getItem('kku_token');
    if (token) payload.token = token;
    return fetch(KKU.Config.API_URL+'?action='+encodeURIComponent(action), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(function(d){ if(!d.success&&d.message&&d.message.indexOf('Session')!==-1) Auth.logout(); return d; })
      .catch(function(e){ return {success:false,data:null,message:'Network error: '+e.message}; });
  }

  return {
    call:call,
    login:function(t){return call('login',{idToken:t});},
    aiParse:function(t){return call('aiParse',{transcript:t});},
    saveWorkRecord:function(d){return call('createWorkRecord',d);},
    getWorkRecord:function(id){return call('getWorkRecord',{recordId:id});},
    updateWorkRecord:function(d){return call('updateWorkRecord',d);},
    deleteWorkRecord:function(id){return call('deleteWorkRecord',{recordId:id});},
    getWorkRecords:function(p){return call('listWorkRecords',p||{});},
    uploadPhoto:function(rid,fn,b64){return call('uploadPhoto',{recordId:rid,fileName:fn,base64Data:b64});},
    deletePhoto:function(id){return call('deletePhoto',{photoId:id});},
    listPhotos:function(rid){return call('listPhotos',{recordId:rid});},
    createLink:function(rid,t,u,lt){return call('createLink',{recordId:rid,title:t,url:u,linkType:lt||'other'});},
    deleteLink:function(id){return call('deleteLink',{linkId:id});},
    listLinks:function(rid){return call('listLinks',{recordId:rid});},
    generateReport:function(t,sd,ed){return call('generateReport',{type:t,startDate:sd,endDate:ed});},
    getProfile:function(){return call('getProfile');}
  };
})();