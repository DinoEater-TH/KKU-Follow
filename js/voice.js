// ============================================================
// KKU Follow - voice.js
// ============================================================

var VoiceService = (function() {
  'use strict';

  var STATE = { IDLE:'IDLE', REQUESTING_PERMISSION:'REQUESTING_PERMISSION', LISTENING:'LISTENING', PROCESSING:'PROCESSING', SUCCESS:'SUCCESS', ERROR:'ERROR', NOT_SUPPORTED:'NOT_SUPPORTED' };
  var currentState = STATE.IDLE;
  var transcript = '';
  var onStateChange = null;
  var recognition = null;

  function isSupported() { return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window); }
  function getState() { return currentState; }
  function getTranscript() { return transcript; }
  function setOnStateChange(cb) { onStateChange = cb; }

  function setState(s, d) { currentState = s; if (onStateChange) onStateChange(s, d); }

  function startListening() {
    // TODO: STEP 7 — implement Web Speech API
    setState(STATE.PROCESSING, null);
    setTimeout(function(){ transcript='\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21: \u0E27\u0E31\u0E19\u0E19\u0E35\u0E49\u0E21\u0E32\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E17\u0E35\u0E48\u0E15\u0E36\u0E01\u0E2D\u0E18\u0E34\u0E01\u0E32\u0E23\u0E0A\u0E48\u0E27\u0E07\u0E41\u0E1B\u0E14\u0E42\u0E21\u0E07\u0E04\u0E23\u0E36\u0E48\u0E07\u0E16\u0E36\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07'; setState(STATE.SUCCESS,{transcript:transcript}); },1500);
  }

  function stopListening() {}
  function reset() { transcript = ''; setState(STATE.IDLE, null); }

  return { STATE:STATE, isSupported:isSupported, getState:getState, getTranscript:getTranscript, setOnStateChange:setOnStateChange, startListening:startListening, stopListening:stopListening, reset:reset };

})();