/* T-Home FinTech AI Assistant - Web Widget */
(function() {
  function initWidget() {
    if (document.getElementById('launcherBtn')) return;
    
    var div = document.createElement('div');
    div.id = 'thome-chatbot-root';
    div.innerHTML = "<button class=\"launcher\" id=\"launcherBtn\" aria-label=\"Open T-Home Assistant chat\" aria-expanded=\"false\">\n  <span class=\"dot-badge\"></span>\n  <img class=\"icon-chat-img\" id=\"launcherIcon\" src=\"/home/chatbot_icon.jpg\" alt=\"\">\n  <svg class=\"icon-close\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M18 6 6 18M6 6l12 12\"/>\n  </svg>\n</button>\n\n<section class=\"chat-window hidden\" id=\"chatWindow\" role=\"dialog\" aria-label=\"T-Home Assistant chat window\">\n  <header class=\"chat-header\">\n    <div class=\"header-stars\"></div>\n    <svg class=\"header-graph\" viewBox=\"0 0 160 70\" preserveAspectRatio=\"none\">\n      <defs>\n        <linearGradient id=\"graphGradient\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n          <stop offset=\"0%\" stop-color=\"#679EFF\"/>\n          <stop offset=\"100%\" stop-color=\"#FFD84F\"/>\n        </linearGradient>\n      </defs>\n      <path d=\"M0 55 L22 40 L44 48 L66 22 L90 30 L112 10 L136 18 L160 4\"/>\n    </svg>\n    <div class=\"header-top\">\n      <div class=\"brand\">\n        <div class=\"brand-avatar\">\n          <img src=\"/home/chatbot_icon.jpg\" alt=\"T-Home Assistant\">\n        </div>\n        <div>\n          <div class=\"brand-name\">T-Home Assistant</div>\n          <div class=\"brand-status\"><span class=\"status-dot\"></span>Online now</div>\n        </div>\n      </div>\n      <div class=\"header-actions\">\n        <button class=\"icon-btn\" id=\"servicesBtn\" aria-label=\"Change service\" title=\"Change service\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/></svg>\n        </button>\n        <button class=\"icon-btn\" id=\"logoutBtn\" aria-label=\"End session / Logout\" title=\"End session / Logout\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><path d=\"M16 17l5-5-5-5\"/><path d=\"M21 12H9\"/></svg>\n        </button>\n        <button class=\"icon-btn\" id=\"minimizeBtn\" aria-label=\"Minimize chat\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M6 12h12\"/></svg>\n        </button>\n        <button class=\"icon-btn\" id=\"closeBtn\" aria-label=\"Close chat\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>\n        </button>\n      </div>\n    </div>\n  </header>\n\n  <div class=\"focus-bar\" id=\"focusBar\">\n    <div class=\"focus-text\">\n      <span class=\"focus-label\">\ud83c\udfaf Focused Context</span>\n      <span class=\"focus-value\" id=\"focusValue\">All Services / General Assistance</span>\n    </div>\n    <button class=\"focus-change\" id=\"focusChangeBtn\" type=\"button\">Change</button>\n  </div>\n\n  <div class=\"quick-chips\" id=\"quickChips\">\n    <button class=\"chip\" data-msg=\"What home loan options do you offer?\">Loan options</button>\n    <button class=\"chip\" data-msg=\"How do I check my application status?\">Application status</button>\n    <button class=\"chip\" data-msg=\"Can you help me estimate a monthly EMI?\">Estimate EMI</button>\n    <button class=\"chip\" data-msg=\"I'd like to speak to a human agent.\">Talk to agent</button>\n  </div>\n\n  <div class=\"messages\" id=\"messages\" role=\"log\" aria-live=\"polite\"></div>\n\n  <div class=\"typing-row hidden\" id=\"typingRow\">\n    <div class=\"msg-avatar\"><img src=\"/home/chatbot_icon.jpg\" alt=\"\"></div>\n    <div class=\"typing-bubble\"><span></span><span></span><span></span></div>\n  </div>\n\n  <div class=\"input-area\">\n    <div class=\"input-row\">\n      <input id=\"chatInput\" type=\"text\" placeholder=\"Complete verification to start chatting\" autocomplete=\"off\" disabled />\n      <button class=\"send-btn\" id=\"sendBtn\" aria-label=\"Send message\" disabled>\n        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 2 11 13\"/><path d=\"M22 2 15 22l-4-9-9-4 20-7Z\"/></svg>\n      </button>\n    </div>\n    <div class=\"disclaimer\">T-Home Assistant may make mistakes. Verify important details.</div>\n  </div>\n</section>";
    document.body.appendChild(div);
  }

  const AUTH_ROUTES = [
    '/login',
    '/get-started',
    '/register',
    '/forgot-password',
    '/verify-reset-otp',
    '/reset-password'
  ];

  function isAuthPage() {
    var path = (window.location.pathname || '').toLowerCase();
    if (path.startsWith('/super-admin')) return true;
    return AUTH_ROUTES.some(function(r) {
      return path === r || path.startsWith(r + '/') || path.startsWith(r + '?');
    });
  }

  function syncWidgetVisibility() {
    var root = document.getElementById('thome-chatbot-root');
    if (!root) return;
    if (isAuthPage()) {
      root.style.setProperty('display', 'none', 'important');
      var win = document.getElementById('chatWindow');
      if (win && !win.classList.contains('hidden')) {
        win.classList.add('hidden');
      }
      var launcher = document.getElementById('launcherBtn');
      if (launcher) launcher.classList.remove('is-open');
    } else {
      root.style.removeProperty('display');
    }
  }

  function setupRouteWatcher() {
    syncWidgetVisibility();
    window.addEventListener('popstate', syncWidgetVisibility);
    
    var origPush = history.pushState;
    if (origPush) {
      history.pushState = function() {
        var ret = origPush.apply(this, arguments);
        syncWidgetVisibility();
        return ret;
      };
    }
    
    var origReplace = history.replaceState;
    if (origReplace) {
      history.replaceState = function() {
        var ret = origReplace.apply(this, arguments);
        syncWidgetVisibility();
        return ret;
      };
    }
    
    setInterval(syncWidgetVisibility, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initWidget();
      startController();
      setupRouteWatcher();
    });
  } else {
    initWidget();
    startController();
    setupRouteWatcher();
  }

  function startController() {
    (function(){
  const LOGO_URL = "/home/chatbot_icon.jpg";
  const API_BASE_URL = "http://localhost:8000";   // <-- change this to your deployed backend URL on your real site
  const CHAT_ENDPOINT = API_BASE_URL + "/api/chat";
  // (auto-open removed — the widget opens only when the launcher is clicked)

  // Same contact details the backend's own Streamlit UI shows on escalation.
  const HELPLINE = "+91 7032183836";
  const SUPPORT_EMAIL = "support@thomefintech.com";

  const PLACEHOLDER_LOCKED = "Complete verification to start chatting";
  const PLACEHOLDER_CHAT   = "Ask about loans, EMIs, applications…";

  const launcherBtn = document.getElementById('launcherBtn');
  const chatWindow  = document.getElementById('chatWindow');
  const closeBtn    = document.getElementById('closeBtn');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const servicesBtn = document.getElementById('servicesBtn');
  const logoutBtn   = document.getElementById('logoutBtn');
  const focusValue  = document.getElementById('focusValue');
  const focusChange = document.getElementById('focusChangeBtn');
  const messagesEl  = document.getElementById('messages');
  const typingRow   = document.getElementById('typingRow');
  const chatInput   = document.getElementById('chatInput');
  const sendBtn     = document.getElementById('sendBtn');
  const quickChips  = document.getElementById('quickChips');

  let isOpen = false;
  let hasGreeted = false;
  let history = [];
  let selecting = false;

  // Client-side twin of the backend's session_state:
  //   stage: 'form' (details) -> 'otp' (verify email) -> 'chat' (verified)
  const state = {
    stage: 'form',
    pending: { name:'', mobile:'', email:'', dob:'' },   // kept so "Back" doesn't wipe the form
    otpSessionId: null,
    expiryMinutes: 5,
    token: null,          // session_token issued by the server after OTP success
    user: null,
    services: null,       // loaded once from /api/services
    selectedServiceId: null
  };

  /* ------------------------------------------------------------------ helpers */
  function timeNow(){
    return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function escapeHtml(str){
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // Turns bare http(s) URLs into links. Runs on already-escaped text, and the
  // URL pattern excludes quotes/angle brackets so it can't break out of the attribute.
  function linkify(html){
    return html.replace(/https?:\/\/[^\s<>"']+/g, function(m){
      const trail = m.match(/[.,;:!?)]+$/);
      const url = trail ? m.slice(0, -trail[0].length) : m;
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>' + (trail ? trail[0] : '');
    });
  }
  function inlineFormat(text){
    return linkify(text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
  }
  function renderMarkdownLite(raw){
    if(!raw) return '';
    const escaped = escapeHtml(raw);
    // Normalize inline bullets ("* ") onto their own line, same as before.
    let normalized = escaped.replace(/\s\*\s(?=\*\*|[A-Za-z0-9])/g, '\n* ');
    // Also split inline numbered items ("1. Something 2. Something else")
    // onto their own lines when they weren't already given real newlines.
    normalized = normalized.replace(/\s(?=\d+\.\s)/g, '\n');

    const lines = normalized.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let html = '';
    let listType = null; // 'ul' | 'ol' | null

    function closeList(){
      if(listType){ html += listType === 'ul' ? '</ul>' : '</ol>'; listType = null; }
    }

    for(const line of lines){
      const bulletMatch = line.match(/^\*\s+(.*)$/);
      const numberedMatch = line.match(/^\d+\.\s+(.*)$/);

      if(bulletMatch){
        if(listType !== 'ul'){ closeList(); html += '<ul>'; listType = 'ul'; }
        html += '<li>' + inlineFormat(bulletMatch[1]) + '</li>';
      } else if(numberedMatch){
        if(listType !== 'ol'){ closeList(); html += '<ol>'; listType = 'ol'; }
        html += '<li>' + inlineFormat(numberedMatch[1]) + '</li>';
      } else {
        closeList();
        html += '<p>' + inlineFormat(line) + '</p>';
      }
    }
    closeList();
    return html || ('<p>' + escaped + '</p>');
  }

  // Tiny DOM builder: text always goes in as text nodes (never parsed as HTML).
  function h(tag, props){
    const n = document.createElement(tag);
    if(props){
      for(const k of Object.keys(props)){
        const v = props[k];
        if(v === false || v == null) continue;
        if(k === 'class') n.className = v;
        else if(k === 'text') n.textContent = v;
        else if(v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      }
    }
    for(let i = 2; i < arguments.length; i++){
      const c = arguments[i];
      if(c == null || c === false) continue;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return n;
  }

  function safeUrl(u){ return (typeof u === 'string' && /^https?:\/\//i.test(u)) ? u : '#'; }
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  function scrollToBottom(){ messagesEl.scrollTop = messagesEl.scrollHeight; }
  function scrollToTopOf(node){
    const delta = node.getBoundingClientRect().top - messagesEl.getBoundingClientRect().top;
    messagesEl.scrollTop = Math.max(0, messagesEl.scrollTop + delta - 8);
  }

  async function postJSON(path, body){
    const res = await fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    let data = null;
    try{ data = await res.json(); }catch(_){ data = null; }
    return { status: res.status, data: data || {} };
  }

  /* ------------------------------------------------------------------ messages */
  function buildRow(role, contentNode, sources){
    const row = document.createElement('div');
    row.className = 'msg-row ' + (role === 'user' ? 'user' : 'bot');

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = role === 'user'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="#EAF1FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>'
      : '<img src="' + LOGO_URL + '" alt="">';

    const wrap = document.createElement('div');
    wrap.appendChild(contentNode);

    // Source tags intentionally not rendered — the backend's internal
    // document/service identifiers (e.g. "company_general_knowledge_base")
    // aren't meaningful to an end user, so `sources` is accepted from the
    // API but not displayed in the UI.

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = timeNow();
    wrap.appendChild(time);

    row.appendChild(avatar);
    row.appendChild(wrap);
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function addMessage(role, text, sources){
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if(role === 'user'){ bubble.textContent = text; }
    else { bubble.innerHTML = renderMarkdownLite(text); }
    return buildRow(role, bubble, sources);
  }

  // Full-width block (form / OTP / service picker) with a stable id so it can be replaced.
  function addBlock(id, node){
    removeBlock(id);
    const row = h('div', { class: 'block-row', id: id }, node);
    messagesEl.appendChild(row);
    scrollToTopOf(row);
    return row;
  }
  function removeBlock(id){
    const old = document.getElementById(id);
    if(old && old.parentNode) old.parentNode.removeChild(old);
  }

  function setTyping(on){
    typingRow.classList.toggle('hidden', !on);
    if(on){ scrollToBottom(); }
  }

  function notice(kind, content){
    const n = h('div', { class: 'notice ' + kind, role: kind === 'error' ? 'alert' : 'status' });
    if(Array.isArray(content)) content.forEach(c => n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    else n.textContent = content;
    return n;
  }
  // A slot that holds at most one notice at a time.
  function makeNoticeSlot(){
    const slot = h('div', { class: 'notice-slot' });
    return {
      el: slot,
      show(kind, content){ slot.innerHTML = ''; slot.appendChild(notice(kind, content)); },
      clear(){ slot.innerHTML = ''; }
    };
  }

  /* ------------------------------------------------------------------ chat gating */
  function setChatEnabled(on){
    chatInput.disabled = !on;
    sendBtn.disabled = !on;
    chatInput.placeholder = on ? PLACEHOLDER_CHAT : PLACEHOLDER_LOCKED;
  }

  /* ------------------------------------------------------------------ STEP 1: details form */
  function showWelcome(){
    addMessage('bot',
      "Welcome to **T-HOME FinTech Assistant** 🏠\n" +
      "To get started, please provide a few details to personalize your experience. Your data is protected under the DPDP Act (2023).");
    renderForm();
  }

  function field(label, input){
    return h('div', { class: 'field' }, h('label', { text: label }), input);
  }

  function renderForm(){
    state.stage = 'form';
    const p = state.pending;
    const slot = makeNoticeSlot();

    const nameI  = h('input', { type:'text', placeholder:'Rajesh Kumar', autocomplete:'name', value:p.name, 'aria-label':'Full Name' });
    const mobI   = h('input', { type:'tel', inputmode:'numeric', placeholder:'10 digits (6-9)', autocomplete:'tel-national', value:p.mobile, 'aria-label':'Mobile Number' });
    const emailI = h('input', { type:'email', placeholder:'rajesh@example.com', autocomplete:'email', value:p.email, 'aria-label':'Email Address' });
    const dobI   = h('input', { type:'text', inputmode:'numeric', placeholder:'DD/MM/YYYY', autocomplete:'bday', value:p.dob, 'aria-label':'Date of Birth' });
    const consentI = h('input', { type:'checkbox' });
    const submit = h('button', { type:'submit', class:'btn btn-primary', text:'Send Verification Code' });

    const form = h('form', { novalidate: true },
      h('div', { class:'card-title', text:'📋 Client Verification' }),
      h('div', { class:'card-sub', text:'DPDP Act (2023) Protected Onboarding' }),
      slot.el,
      field('Full Name', nameI),
      field('Mobile Number', mobI),
      field('Email Address', emailI),
      field('Date of Birth', dobI),
      h('label', { class:'consent' }, consentI,
        h('span', { text:'I consent to T-HOME collecting and processing my data per DPDP Act (2023) for service delivery.' })),
      submit
    );

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      slot.clear();
      state.pending = { name:nameI.value, mobile:mobI.value, email:emailI.value, dob:dobI.value };
      submit.disabled = true;
      submit.textContent = 'Sending…';
      let moved = false;
      try{
        const r = await postJSON('/api/onboarding/start', {
          name: nameI.value, mobile: mobI.value, email: emailI.value, dob: dobI.value,
          consent: consentI.checked
        });
        if(r.data.ok){
          state.otpSessionId = r.data.otp_session_id;
          state.expiryMinutes = r.data.expiry_minutes || 5;
          state.pending.email = r.data.email || emailI.value.trim();
          moved = true;
          renderOtp();
        } else {
          slot.show('error', '⚠️ ' + (r.data.message || 'Something went wrong. Please try again.'));
        }
      }catch(err){
        console.error('T-Home Assistant error:', err);
        slot.show('error', '⚠️ Could not reach the server. Please try again shortly.');
      }finally{
        if(!moved){ submit.disabled = false; submit.textContent = 'Send Verification Code'; }
      }
    });

    addBlock('onboardBlock', h('div', { class:'card' }, form));
    setTimeout(() => nameI.focus(), 60);
  }

  /* ------------------------------------------------------------------ STEP 2: OTP */
  function renderOtp(){
    state.stage = 'otp';
    const slot = makeNoticeSlot();

    const codeI = h('input', {
      type:'text', inputmode:'numeric', autocomplete:'one-time-code', class:'otp-input',
      placeholder:'6-digit code', maxlength:'12', 'aria-label':'Verification code'
    });
    codeI.addEventListener('input', () => { codeI.value = codeI.value.replace(/\D/g, '').slice(0, 6); });

    const verifyBtn = h('button', { type:'submit', class:'btn btn-primary', text:'✅ Verify' });
    const resendBtn = h('button', { type:'button', class:'btn btn-secondary', text:'🔄 Resend' });
    const backBtn   = h('button', { type:'button', class:'link-btn', text:'← Back' });

    const info = notice('info', [
      '📧 A 6-digit code was sent to ',
      h('strong', { text: state.pending.email }),
      '. It expires in ' + state.expiryMinutes + ' minutes.'
    ]);

    const form = h('form', { novalidate: true },
      h('div', { class:'card-title', text:'📋 Client Verification' }),
      h('div', { class:'card-sub', text:'DPDP Act (2023) Protected Onboarding' }),
      info,
      slot.el,
      field('Enter Verification Code', codeI),
      h('div', { class:'btn-row' }, verifyBtn, resendBtn),
      backBtn
    );

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      slot.clear();
      verifyBtn.disabled = true; resendBtn.disabled = true;
      let done = false;
      try{
        const r = await postJSON('/api/onboarding/verify', {
          otp_session_id: state.otpSessionId, code: codeI.value.trim()
        });
        if(r.data.ok){
          done = true;
          slot.show('success', '✔ Email verified! Starting your session...');
          await sleep(700);
          await onVerified(r.data);
        } else if(r.data.status === 'locked_out' || r.data.status === 'expired'){
          slot.show('error', '🔒 ' + (r.data.message || 'This code can no longer be used.') + ' Please go back and try again.');
        } else {
          slot.show('error', '❌ ' + (r.data.message || 'Something went wrong. Please try again.'));
        }
      }catch(err){
        console.error('T-Home Assistant error:', err);
        slot.show('error', '⚠️ Could not reach the server. Please try again shortly.');
      }finally{
        if(!done){ verifyBtn.disabled = false; resendBtn.disabled = false; }
      }
    });

    resendBtn.addEventListener('click', async function(){
      slot.clear();
      verifyBtn.disabled = true; resendBtn.disabled = true;
      try{
        const r = await postJSON('/api/onboarding/resend', { otp_session_id: state.otpSessionId });
        if(r.data.ok) slot.show('success', '📧 New code sent! Check your inbox.');
        else slot.show('warn', '⏳ ' + (r.data.message || 'Please try again in a moment.'));
      }catch(err){
        console.error('T-Home Assistant error:', err);
        slot.show('error', '⚠️ Could not reach the server. Please try again shortly.');
      }finally{
        verifyBtn.disabled = false; resendBtn.disabled = false;
      }
    });

    backBtn.addEventListener('click', renderForm);

    addBlock('onboardBlock', h('div', { class:'card' }, form));
    setTimeout(() => codeI.focus(), 60);
  }

  /* ------------------------------------------------------------------ STEP 3: verified -> profile + service menu */
  async function onVerified(data){
    state.token = data.session_token;
    state.user = data.user || {};
    state.stage = 'chat';
    state.selectedServiceId = null;   // new chats start in "All Services"
    history = [];

    removeBlock('onboardBlock');
    chatWindow.classList.add('verified');
    setChatEnabled(true);
    updateFocusBar();

    // 👤 Client Profile (same three lines as the Streamlit sidebar)
    const profile = h('div', { class:'card' },
      h('div', { class:'card-title', text:'👤 Client Profile' }),
      h('div', { class:'profile-lines' },
        h('div', null, h('strong', { text:'Name: ' }), state.user.display_name || ''),
        h('div', null, h('strong', { text:'Session ID: ' }), h('code', { text: (state.user.id_short || '') + '...' }))
      ),
      h('div', { class:'profile-consent', text:'🛡️ DPDP Act (2023) Consent Recorded' })
    );
    messagesEl.appendChild(h('div', { class:'block-row' }, profile));

    await ensureServices();
    showServicePicker();
  }

  async function ensureServices(){
    if(state.services && state.services.length) return;
    try{
      const res = await fetch(API_BASE_URL + '/api/services');
      const data = await res.json();
      state.services = Array.isArray(data.services) ? data.services : [];
    }catch(err){
      console.error('T-Home Assistant error:', err);
      state.services = [];
    }
  }

  function findService(id){
    return (state.services || []).find(s => s.id === id) || null;
  }

  function updateFocusBar(){
    const s = state.selectedServiceId ? findService(state.selectedServiceId) : null;
    focusValue.textContent = s ? (s.icon + ' ' + s.name) : 'All Services / General Assistance';
  }

  function svcCard(service, number){
    const isAll = !service;
    const active = isAll ? !state.selectedServiceId : state.selectedServiceId === service.id;
    const btn = h('button', {
        type:'button',
        class:'svc-card' + (isAll ? ' wide' : '') + (active ? ' active' : ''),
        'aria-pressed': active ? 'true' : 'false'
      },
      h('span', { class:'svc-icon', text: isAll ? '🗂️' : (service.icon || '•') }),
      h('span', null,
        h('span', { class:'svc-num', text: number + '.' }),
        ' ' + (isAll ? 'All Services / General Assistance' : service.name))
    );
    btn.addEventListener('click', () => chooseService(isAll ? null : service.id));
    return btn;
  }

  async function showServicePicker(){
    if(state.stage !== 'chat') return;
    await ensureServices();
    const first = (state.user && state.user.first_name) || 'there';
    const grid = h('div', { class:'svc-grid' });
    grid.appendChild(svcCard(null, 0));
    (state.services || []).forEach((s, i) => grid.appendChild(svcCard(s, i + 1)));

    const card = h('div', { class:'card' },
      h('div', { class:'card-title', text:'🗂️ Hi ' + first + '! Please select a service:' }),
      h('div', { class:'card-sub', text:'Or just type your question — All Services is the default.' }),
      grid
    );
    if(!state.services || !state.services.length){
      card.appendChild(notice('warn', '⚠️ Could not load the service list right now. You can still ask your question below.'));
    }
    addBlock('pickerBlock', card);
  }

  function serviceDetailCard(s){
    const children = [
      h('div', { class:'svc-detail-tag', text:'🎯 Focused Context' }),
      h('div', { class:'svc-detail-head' },
        h('span', { class:'svc-icon', text: s.icon || '•' }),
        h('span', { text: s.name })),
    ];
    if(s.description) children.push(h('p', { text: s.description }));
    if(s.url) children.push(h('a', {
      class:'cta-btn', href: safeUrl(s.url), target:'_blank', rel:'noopener noreferrer',
      text:'Open ' + s.name + ' →'
    }));
    return h.apply(null, ['div', { class:'svc-detail' }].concat(children));
  }

  async function chooseService(id){
    if(selecting || state.stage !== 'chat') return;
    selecting = true;
    try{
      const r = await postJSON('/api/service/select', { session_id: state.token, service_id: id });
      if(r.status === 401){ sessionExpired(); return; }
      if(!r.data.ok) throw new Error('select failed');

      state.selectedServiceId = r.data.selected_service || null;
      updateFocusBar();
      removeBlock('pickerBlock');

      if(r.data.service){
        buildRow('bot', serviceDetailCard(r.data.service));
      } else {
        addMessage('bot', "✔ Mode: **All Services**\nExpert guidance on Loans, Tax Filing, MSME Registration, and Compliance.");
      }
      chatInput.focus();
    }catch(err){
      console.error('T-Home Assistant error:', err);
      addMessage('bot', "⚠️ I couldn't switch the service just now. Please try again.");
    }finally{
      selecting = false;
    }
  }

  /* ------------------------------------------------------------------ chat */
  function textBlock(text){
    const d = document.createElement('div');
    d.className = 'card-text';
    d.innerHTML = renderMarkdownLite(text);
    return d;
  }

  // Renders a reply the same way the backend's own UI does, by status.
  function renderBotResponse(data){
    const reply = data.reply || "Sorry, I couldn't put together a response just now.";

    if(data.status === 'redirect'){
      const svc = data.service_name || 'Service Portal';
      const icon = data.service_icon || '🔗';
      const card = h('div', { class:'action-card' },
        h('div', { class:'action-card-header', text: icon + ' ' + svc + ' Online Portal' }),
        textBlock(reply),
        h('a', { class:'cta-btn', href: safeUrl(data.redirect_url), target:'_blank', rel:'noopener noreferrer',
                 text:'Proceed to ' + svc + ' →' })
      );
      buildRow('bot', card);
    } else if(data.status === 'escalation'){
      const banner = h('div', { class:'escalation-banner' },
        h('div', { class:'escalation-title', text:'🔴 Relationship Manager Support' }),
        textBlock(reply),
        h('div', { class:'escalation-contact' },
          h('strong', { text:'Direct Helpline: ' }),
          h('a', { href:'tel:' + HELPLINE.replace(/\s/g, ''), text: HELPLINE }),
          ' | ',
          h('strong', { text:'Email: ' }),
          h('a', { href:'mailto:' + SUPPORT_EMAIL, text: SUPPORT_EMAIL })
        )
      );
      buildRow('bot', banner);
    } else {
      addMessage('bot', reply, data.sources || []);
    }
    return reply;
  }

  async function callAssistant(userText){
    const historyPayload = history.slice();
    history.push({role:'user', content: userText});
    setTyping(true);
    sendBtn.disabled = true;

    try{
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, session_id: state.token, history: historyPayload })
      });
      if(response.status === 401){ setTyping(false); sessionExpired(); return; }
      if(!response.ok){ throw new Error('HTTP ' + response.status); }
      const data = await response.json();
      const reply = renderBotResponse(data);
      history.push({role:'assistant', content: reply});
      setTyping(false);
    }catch(err){
      console.error('T-Home Assistant error:', err);
      setTyping(false);
      addMessage('bot', "I can't reach the backend right now. Please try again shortly.");
    }finally{
      sendBtn.disabled = (state.stage !== 'chat');
    }
  }

  function sendCurrentInput(){
    if(state.stage !== 'chat' || sendBtn.disabled) return;
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage('user', text);
    chatInput.value = '';
    quickChips.style.display = 'none';
    callAssistant(text);
  }

  /* ------------------------------------------------------------------ session end */
  function resetToOnboarding(noticeText){
    state.stage = 'form';
    state.pending = { name:'', mobile:'', email:'', dob:'' };
    state.otpSessionId = null;
    state.token = null;
    state.user = null;
    state.selectedServiceId = null;
    history = [];
    chatWindow.classList.remove('verified');
    setChatEnabled(false);
    chatInput.value = '';
    quickChips.style.display = '';
    messagesEl.innerHTML = '';
    if(noticeText) addMessage('bot', noticeText);
    showWelcome();
  }

  function sessionExpired(){
    resetToOnboarding("Your session has expired. Please verify again to continue.");
  }

  async function doLogout(){
    const token = state.token;
    try{ if(token) await postJSON('/api/logout', { session_id: token }); }
    catch(err){ console.error('T-Home Assistant error:', err); }
    resetToOnboarding();
  }

  /* ------------------------------------------------------------------ open / close */
  function openChat(){
    isOpen = true;
    chatWindow.classList.remove('hidden');
    launcherBtn.classList.add('is-open');
    launcherBtn.setAttribute('aria-expanded', 'true');
    if(!hasGreeted){
      hasGreeted = true;
      setTimeout(showWelcome, 300);
    } else if(state.stage === 'chat'){
      setTimeout(() => chatInput.focus(), 260);
    }
  }

  function closeChat(){
    isOpen = false;
    chatWindow.classList.add('hidden');
    launcherBtn.classList.remove('is-open');
    launcherBtn.setAttribute('aria-expanded', 'false');
  }

  launcherBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);
  minimizeBtn.addEventListener('click', closeChat);
  servicesBtn.addEventListener('click', showServicePicker);
  focusChange.addEventListener('click', showServicePicker);
  logoutBtn.addEventListener('click', doLogout);
  sendBtn.addEventListener('click', sendCurrentInput);
  chatInput.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); sendCurrentInput(); } });
  quickChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if(!chip || state.stage !== 'chat') return;
    chatInput.value = chip.dataset.msg;
    sendCurrentInput();
  });

  // Auto-open disabled — the widget now only opens when the launcher
  // button is clicked, never automatically on a timer.
})();
  }
})();
