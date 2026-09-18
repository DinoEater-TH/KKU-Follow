// ============================================================
// KKU Follow - ui.js
// ============================================================

KKU.UI = (function() {
  'use strict';

  function showToast(msg, type, dur) {
    type=type||'success'; dur=dur||3000;
    var t=document.createElement('div'); t.className='toast toast-'+type; t.textContent=msg; document.body.appendChild(t);
    setTimeout(function(){t.style.opacity='0';t.style.transition='opacity 0.3s ease';setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},300);},dur);
  }

  function showLoading(msg) { hideLoading(); var o=document.createElement('div'); o.className='loading-overlay'; o.id='loadingOverlay'; o.innerHTML='<div class="loading-spinner"></div>'; document.body.appendChild(o); }
  function hideLoading() { var o=document.getElementById('loadingOverlay'); if(o) o.parentNode.removeChild(o); }

  function formatDate(dateStr) {
    if(!dateStr)return''; var p=dateStr.split('-'); if(p.length!==3)return dateStr;
    var m=['\u0E21.\u0E04.','\u0E01.\u0E1E.','\u0E21\u0E35.\u0E04.','\u0E40\u0E21.\u0E22.','\u0E1E.\u0E04.','\u0E21\u0E34.\u0E22.','\u0E01.\u0E04.','\u0E2A.\u0E04.','\u0E01.\u0E22.','\u0E15.\u0E04.','\u0E1E.\u0E22.','\u0E18.\u0E04.'];
    return parseInt(p[2])+' '+m[parseInt(p[1])-1]+' '+(parseInt(p[0])+543);
  }

  function getToday() { var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }

  return { showToast:showToast, showLoading:showLoading, hideLoading:hideLoading, formatDate:formatDate, getToday:getToday };
})();