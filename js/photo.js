// ============================================================
// KKU Follow - photo.js
// ============================================================

var PhotoCapture = (function() {
  'use strict';

  function capture() {
    return new Promise(function(resolve, reject) {
      // TODO: STEP 11
      reject(new Error('Photo capture not yet implemented'));
    });
  }

  function createPreview(dataUrl, fileName) {
    var c=document.createElement('div'); c.className='photo-item';
    var img=document.createElement('img'); img.src=dataUrl; img.alt=fileName; c.appendChild(img);
    var btn=document.createElement('button'); btn.className='delete-photo'; btn.innerHTML='&times;';
    btn.onclick=function(){if(c.parentNode)c.parentNode.removeChild(c);}; c.appendChild(btn);
    return c;
  }

  function dataUrlToBlob(dataUrl) {
    var p=dataUrl.split(','); var m=p[0].match(/:(.*?);/)[1]; var b=atob(p[1]); var a=[]; for(var i=0;i<b.length;i++)a.push(b.charCodeAt(i));
    return new Blob([new Uint8Array(a)],{type:m});
  }

  return { capture:capture, createPreview:createPreview, dataUrlToBlob:dataUrlToBlob };
})();