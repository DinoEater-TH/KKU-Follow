// ============================================================
// KKU Follow - auth.js
// Google Sign-In via Identity Services (renderButton)
// ============================================================

var Auth = (function() {
  'use strict';

  var GOOGLE_CLIENT_ID = '672167885104-soe5fstmbrnr66tnc9n9236bdlr4n9jn.apps.googleusercontent.com';

  function init() {
    var container = document.getElementById('googleSignInBtn');
    if (!container) return;

    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
      loadGSI(function() {
        initGoogleButton(container);
      });
    } else {
      initGoogleButton(container);
    }
  }

  function loadGSI(callback) {
    var script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    script.onerror = function() {
      showErr('โหลด Google Sign-In ไม่สำเร็จ กรุณารีเฟรชหน้า');
    };
    document.head.appendChild(script);
  }

  function initGoogleButton(container) {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
      showErr('Google Sign-In ไม่พร้อมใช้งาน');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        // ลดปัญหา FedCM บนบางเบราว์เซอร์
        use_fedcm_for_prompt: false
      });

      // ใช้ปุ่มทางการของ Google แทน prompt() เพื่อหลีกเลี่ยง FedCM NetworkError
      container.innerHTML = '';
      google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 280
      });
    } catch (e) {
      console.error(e);
      showErr('ตั้งค่า Google Sign-In ไม่สำเร็จ: ' + (e.message || e));
    }
  }

  function handleCredential(response) {
    if (!response || !response.credential) {
      showErr('ไม่ได้รับข้อมูลจาก Google');
      return;
    }

    if (KKU.UI && KKU.UI.showLoading) {
      KKU.UI.showLoading();
    }

    KKU.API.call('login', { idToken: response.credential })
      .then(function(result) {
        if (KKU.UI && KKU.UI.hideLoading) {
          KKU.UI.hideLoading();
        }

        if (result.success && result.data) {
          KKU.State.token = result.data.token;
          KKU.State.user = result.data.user;
          sessionStorage.setItem('kku_token', result.data.token);
          sessionStorage.setItem('kku_user', JSON.stringify(result.data.user));

          if (KKU.UI && KKU.UI.showToast) {
            KKU.UI.showToast('เข้าสู่ระบบสำเร็จ', 'success');
          }

          setTimeout(function() {
            KKU.navigateTo('home');
          }, 400);
        } else {
          showErr(result.message || 'เข้าสู่ระบบไม่สำเร็จ');
        }
      })
      .catch(function() {
        if (KKU.UI && KKU.UI.hideLoading) {
          KKU.UI.hideLoading();
        }
        showErr('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
      });
  }

  function showErr(message) {
    var el = document.getElementById('loginError');
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    } else {
      alert(message);
    }
  }

  function logout() {
    if (KKU.State.token) {
      KKU.API.call('logout', { token: KKU.State.token }).catch(function() {});
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.disableAutoSelect();
      } catch (e) {}
    }

    KKU.State.token = null;
    KKU.State.user = null;
    sessionStorage.removeItem('kku_token');
    sessionStorage.removeItem('kku_user');
    KKU.navigateTo('login');
  }

  function isAuthenticated() {
    return !!(KKU.State.token || sessionStorage.getItem('kku_token'));
  }

  return {
    init: init,
    logout: logout,
    isAuthenticated: isAuthenticated
  };
})();
