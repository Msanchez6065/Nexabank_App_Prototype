// ===========================
//   USERS DATABASE
// ===========================
const USERS_DB = {
  marco: {
    password: '1234',
    email: 'marco@nexabank.com',
    twoFactorCode: '123456',
    user: { name: 'Marco', initials: 'M', hasSavings: true },
    balances: { checking: 4250.00, savings: 12800.00 },
    monthSpent: 1240.00,
    transactions: [
      { id:1, desc:'Amazon Purchase',    type:'out',  amount:89.99,  date:'Mar 29, 2026', icon:'🛒', acct:'checking' },
      { id:2, desc:'Salary Deposit',     type:'in',   amount:3200.00,date:'Mar 28, 2026', icon:'💰', acct:'checking' },
      { id:3, desc:'Netflix',            type:'bill', amount:15.99,  date:'Mar 27, 2026', icon:'📺', acct:'checking' },
      { id:4, desc:'Electric Bill',      type:'bill', amount:112.40, date:'Mar 25, 2026', icon:'⚡', acct:'checking' },
      { id:5, desc:'Transfer → Savings', type:'out',  amount:500.00, date:'Mar 22, 2026', icon:'🏦', acct:'checking' },
      { id:6, desc:'Freelance Payment',  type:'in',   amount:450.00, date:'Mar 20, 2026', icon:'💼', acct:'checking' },
    ],
    cards: [
      { id:'visa', brand:'Visa',       num:'•••• •••• •••• 4521', holder:'Marco', exp:'05/29', frozen:false },
      { id:'mc',   brand:'Mastercard', num:'•••• •••• •••• 8834', holder:'Marco', exp:'11/27', frozen:false },
    ],
    bills: [
      { id:'electric', name:'Electric Bill',  icon:'⚡', amount:112.40, due:'Apr 3'  },
      { id:'internet', name:'Internet',        icon:'📶', amount:59.99,  due:'Apr 5'  },
      { id:'netflix',  name:'Netflix',         icon:'📺', amount:15.99,  due:'Apr 7'  },
      { id:'water',    name:'Water Bill',      icon:'💧', amount:44.50,  due:'Apr 10' },
      { id:'gym',      name:'Gym Membership',  icon:'🏋️', amount:29.00,  due:'Apr 12' },
    ],
    nexaUsers: {
      sarah: { name:'Sarah Johnson',  acct:'••4892' },
      alex:  { name:'Alex Thompson',  acct:'••7731' },
      maria: { name:'Maria Garcia',   acct:'••2245' },
      james: { name:'James Wilson',   acct:'••6618' },
      linda: { name:'Linda Chen',     acct:'••9903' },
      jacob: { name:'Jacob Schmidt',  acct:'••3317' },
    },
    loans: [
      { id:'cc',       name:'Credit Card',   icon:'💳', balance:2340.00,  limit:5000.00,   minPayment:45.00,  apr:22.99, dueDate:'Apr 10', type:'credit',      colorClass:'credit'      },
      { id:'auto',     name:'Auto Loan',     icon:'🚗', balance:14850.00, original:22000.00,minPayment:312.00, apr:6.90,  dueDate:'Apr 5',  type:'installment', colorClass:'installment' },
      { id:'personal', name:'Personal Loan', icon:'🏦', balance:4200.00,  original:8000.00, minPayment:178.00, apr:11.50, dueDate:'Apr 15', type:'installment', colorClass:'installment' },
    ],
    notifications: [
      { id: 1, icon:'🔐', title:'Security Alert', text:'2FA is enabled for your account.', time:'Today', read:false },
      { id: 2, icon:'💳', title:'Payment Reminder', text:'Your credit card minimum payment is due soon.', time:'Today', read:false },
    ],
  },
  jacob: {
    password: '5678',
    email: 'jacob@nexabank.com',
    twoFactorCode: '654321',
    user: { name: 'Jacob Schmidt', initials: 'JS', hasSavings: false },
    balances: { checking: 3180.00 },
    monthSpent: 620.00,
    transactions: [
      { id:1, desc:'Gas Station',      type:'out',  amount:45.00,  date:'Mar 29, 2026', icon:'⛽', acct:'checking' },
      { id:2, desc:'Auto Insurance',   type:'bill', amount:127.50, date:'Mar 28, 2026', icon:'🚗', acct:'checking' },
      { id:3, desc:'Paycheck',         type:'in',   amount:2850.00,date:'Mar 27, 2026', icon:'💰', acct:'checking' },
      { id:4, desc:'Grocery Store',    type:'out',  amount:89.30,  date:'Mar 25, 2026', icon:'🛒', acct:'checking' },
      { id:5, desc:'Coffee Shop',      type:'out',  amount:12.50,  date:'Mar 24, 2026', icon:'☕', acct:'checking' },
      { id:6, desc:'Credit Card Pmt',  type:'bill', amount:29.00,  date:'Mar 20, 2026', icon:'💳', acct:'checking' },
    ],
    cards: [
      { id:'visa-j', brand:'Visa', num:'•••• •••• •••• 7743', holder:'Jacob Schmidt', exp:'09/28', frozen:false },
    ],
    bills: [],
    nexaUsers: {
      marco: { name:'Marco',          acct:'••4521' },
      sarah: { name:'Sarah Johnson',  acct:'••4892' },
      alex:  { name:'Alex Thompson',  acct:'••7731' },
      maria: { name:'Maria Garcia',   acct:'••2245' },
      james: { name:'James Wilson',   acct:'••6618' },
      linda: { name:'Linda Chen',     acct:'••9903' },
    },
    loans: [
      { id:'cc',   name:'Credit Card', icon:'💳', balance:1450.00, limit:3000.00,   minPayment:29.00,  apr:24.99, dueDate:'Apr 8', type:'credit',      colorClass:'loan' },
      { id:'auto', name:'Auto Loan',   icon:'🚗', balance:18500.00,original:25000.00,minPayment:298.00, apr:5.90,  dueDate:'Apr 3', type:'installment', colorClass:'loan' },
    ],
    notifications: [
      { id: 1, icon:'🔐', title:'Security Alert', text:'2FA is enabled for your account.', time:'Today', read:false },
    ],
  },
};

// ===========================
//   STATE (mutable, loaded on login)
// ===========================
let STATE = {};
let CURRENT_USER_KEY = null;
let PENDING_LOGIN_USER = null;
let SESSION_TIMEOUT_MS = 10 * 60 * 1000;
let sessionTimer = null;

// chat conversation context for multi-step flows
let chatCtx = null;

function loadUserState(userKey) {
  const data = USERS_DB[userKey];
  if (!data) return;
  CURRENT_USER_KEY = userKey;
  Object.assign(STATE, JSON.parse(JSON.stringify({
    user: data.user, balances: data.balances, monthSpent: data.monthSpent,
    transactions: data.transactions, cards: data.cards, bills: data.bills,
    nexaUsers: data.nexaUsers, loans: data.loans, notifications: data.notifications || [],
  })));
}

function syncCurrentStateToDb() {
  if (!CURRENT_USER_KEY || !USERS_DB[CURRENT_USER_KEY]) return;
  USERS_DB[CURRENT_USER_KEY].user = JSON.parse(JSON.stringify(STATE.user));
  USERS_DB[CURRENT_USER_KEY].balances = JSON.parse(JSON.stringify(STATE.balances));
  USERS_DB[CURRENT_USER_KEY].monthSpent = STATE.monthSpent;
  USERS_DB[CURRENT_USER_KEY].transactions = JSON.parse(JSON.stringify(STATE.transactions));
  USERS_DB[CURRENT_USER_KEY].cards = JSON.parse(JSON.stringify(STATE.cards));
  USERS_DB[CURRENT_USER_KEY].bills = JSON.parse(JSON.stringify(STATE.bills));
  USERS_DB[CURRENT_USER_KEY].nexaUsers = JSON.parse(JSON.stringify(STATE.nexaUsers));
  USERS_DB[CURRENT_USER_KEY].loans = JSON.parse(JSON.stringify(STATE.loans));
  USERS_DB[CURRENT_USER_KEY].notifications = JSON.parse(JSON.stringify(STATE.notifications || []));
}

function resolveNexaUserKey(identifier) {
  if (!identifier) return null;
  const normalized = String(identifier).trim().toLowerCase();
  if (USERS_DB[normalized]) return normalized;
  const entry = Object.entries(STATE.nexaUsers || {}).find(([key, value]) => {
    return key.toLowerCase() === normalized || value.name.toLowerCase() === normalized;
  });
  if (entry) return entry[0];
  const fuzzy = Object.entries(STATE.nexaUsers || {}).find(([key, value]) => {
    return key.toLowerCase().includes(normalized) || value.name.toLowerCase().includes(normalized);
  });
  return fuzzy ? fuzzy[0] : null;
}

// ===========================
//   LOGIN
// ===========================
function findUserKeyByLogin(input) {
  const normalized = input.trim().toLowerCase();
  const entry = Object.entries(USERS_DB).find(([key, value]) => key === normalized || value.email === normalized);
  return entry ? entry[0] : null;
}

function doLogin() {
  const loginInput = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const key = findUserKeyByLogin(loginInput);
  const data = key ? USERS_DB[key] : null;
  if (data && data.password === p) {
    PENDING_LOGIN_USER = key;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('twoFactorScreen').classList.remove('hidden');
    document.getElementById('twoFactorDestination').textContent = data.email;
    document.getElementById('twoFactorHint').textContent = data.twoFactorCode;
    document.getElementById('twoFactorCode').value = '';
    document.getElementById('twoFactorError').textContent = '';
    document.getElementById('twoFactorCode').focus();
  } else {
    document.getElementById('loginError').textContent = 'Invalid email/username or password.';
  }
}

document.getElementById('loginUser').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('loginPass').focus(); });
document.getElementById('loginPass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
document.getElementById('twoFactorCode').addEventListener('keydown', e => { if(e.key==='Enter') verifyTwoFactor(); });

function verifyTwoFactor() {
  if (!PENDING_LOGIN_USER) return;
  const code = document.getElementById('twoFactorCode').value.trim();
  const data = USERS_DB[PENDING_LOGIN_USER];
  if (code === data.twoFactorCode) {
    loadUserState(PENDING_LOGIN_USER);
    document.getElementById('twoFactorScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    addNotification('🔐', 'Login Verified', 'Successful 2FA sign-in completed.', 'Now', false);
    initApp();
  } else {
    document.getElementById('twoFactorError').textContent = 'Incorrect verification code.';
  }
}

function backToLogin() {
  PENDING_LOGIN_USER = null;
  document.getElementById('twoFactorScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}

function doLogout(showNotice = false) {
  syncCurrentStateToDb();
  CURRENT_USER_KEY = null;
  PENDING_LOGIN_USER = null;
  clearTimeout(sessionTimer);
  document.getElementById('app').classList.add('hidden');
  document.getElementById('twoFactorScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('twoFactorCode').value = '';
  document.getElementById('loginError').textContent = showNotice ? 'Session expired. Please sign in again.' : '';
}

function resetSessionTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => doLogout(true), SESSION_TIMEOUT_MS);
}

// ===========================
//   INIT
// ===========================
function initApp() {
  // Update sidebar / header identity
  document.getElementById('sidebarAvatar').textContent = STATE.user.initials;
  document.getElementById('sidebarName').textContent   = STATE.user.name;
  document.getElementById('headerName').textContent    = STATE.user.name.split(' ')[0];
  // Show/hide savings account card
  const savCard = document.getElementById('savingsCard');
  if (savCard) savCard.style.display = STATE.user.hasSavings ? '' : 'none';
  // Reset to dashboard tab
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-dashboard').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('.nav-item[data-page="dashboard"]').classList.add('active');
  renderDashboard();
  renderBillsGrid();
  renderCardsPage();
  renderLoansPage();
  refreshAllTxns();
  renderNotifications();
  initChat();
  updateBalanceSelects();
  resetSessionTimer();
}

// ===========================
//   PAGES
// ===========================
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  if (id === 'history') refreshAllTxns();
  if (id === 'loans') renderLoansPage();
  if (id === 'notifications') { markAllNotificationsRead(false); renderNotifications(); }
  resetSessionTimer();
}

// ===========================
//   RENDER HELPERS
// ===========================
function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function timeStr() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}
function today() {
  return new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function renderDashboard() {
  document.getElementById('balChecking').textContent = fmt(STATE.balances.checking);
  if (STATE.user.hasSavings && STATE.balances.savings !== undefined) {
    document.getElementById('balSavings').textContent = fmt(STATE.balances.savings);
  }
  const total = (STATE.balances.checking || 0) + (STATE.balances.savings || 0);
  document.getElementById('statTotal').textContent = fmt(total);
  document.getElementById('statSpent').textContent = fmt(STATE.monthSpent);
  renderTxnList('recentTxns', STATE.transactions.slice(0, 5));
}

function renderTxnList(elId, list) {
  const el = document.getElementById(elId);
  if (!list.length) { el.innerHTML = '<div class="muted small" style="padding:16px">No transactions yet.</div>'; return; }
  el.innerHTML = list.map(t => `
    <div class="txn-item">
      <div class="txn-icon ${t.type}">${t.icon}</div>
      <div class="txn-desc">
        <div class="txn-name">${t.desc}</div>
        <div class="txn-date">${t.date}</div>
      </div>
      <div class="txn-amount ${t.type}">${t.type === 'in' ? '+' : '-'}${fmt(t.amount)}</div>
    </div>`).join('');
}

function refreshAllTxns() { renderTxnList('allTxns', STATE.transactions); }

function addNotification(icon, title, text, time = 'Now', unread = true) {
  STATE.notifications = STATE.notifications || [];
  STATE.notifications.unshift({ id: Date.now(), icon, title, text, time, read: unread ? false : true });
  syncCurrentStateToDb();
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notificationsList');
  const badge = document.getElementById('navNotifBadge');
  if (!list || !badge) return;
  const unreadCount = (STATE.notifications || []).filter(n => !n.read).length;
  badge.textContent = unreadCount;
  badge.style.display = unreadCount ? 'inline-flex' : 'none';
  if (!STATE.notifications || !STATE.notifications.length) {
    list.innerHTML = '<div class="muted small" style="padding:8px 4px">No notifications yet.</div>';
    return;
  }
  list.innerHTML = STATE.notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function markAllNotificationsRead(showToastNotice = true) {
  (STATE.notifications || []).forEach(n => n.read = true);
  syncCurrentStateToDb();
  renderNotifications();
  if (showToastNotice) showToast('All notifications marked as read');
}

function renderBillsGrid() {
  document.getElementById('billsGrid').innerHTML = STATE.bills.map(b => `
    <div class="bill-card" id="bill-${b.id}" onclick="selectBill('${b.id}')">
      <div class="bill-icon">${b.icon}</div>
      <div class="bill-name">${b.name}</div>
      <div class="bill-due">Due ${b.due}</div>
      <div class="bill-amount">${fmt(b.amount)}</div>
    </div>`).join('');
}

function selectBill(id) {
  document.querySelectorAll('.bill-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('bill-' + id).classList.add('selected');
  const b = STATE.bills.find(x => x.id === id);
  document.getElementById('billName').value = b.name;
  document.getElementById('billAmount').value = b.amount;
}

function renderCardsPage() {
  document.getElementById('cardsGrid').innerHTML = STATE.cards.map(c => `
    <div>
      <div class="bank-card ${c.id} ${c.frozen ? 'frozen' : ''}">
        <div>
          <div class="bank-card-chip">💳</div>
          <div class="bank-card-num">${c.num}</div>
        </div>
        <div class="bank-card-footer">
          <div>
            <div class="bank-card-holder">${c.holder}</div>
            <div class="small muted">Exp ${c.exp}</div>
          </div>
          <div class="bank-card-brand">${c.brand === 'Visa' ? '💙' : '❤️'}</div>
        </div>
      </div>
      <div class="card-status-badge ${c.frozen ? 'frozen' : 'active'}">
        ${c.frozen ? '🔒 Frozen' : '✅ Active'}
      </div><br>
      <button class="btn-freeze ${c.frozen ? 'do-unfreeze' : 'do-freeze'}"
        onclick="toggleCard('${c.id}')">
        ${c.frozen ? '🔓 Unfreeze Card' : '❄️ Freeze Card'}
      </button>
    </div>`).join('');
}

function toggleCard(id) {
  const c = STATE.cards.find(x => x.id === id);
  c.frozen = !c.frozen;
  addNotification(c.frozen ? '❄️' : '🔓', c.frozen ? 'Card Frozen' : 'Card Unfrozen', `${c.brand} card ending ${c.num.slice(-4)} is now ${c.frozen ? 'frozen' : 'active'}.`, 'Now');
  syncCurrentStateToDb();
  renderCardsPage();
  showToast(c.frozen ? `❄️ ${c.brand} card frozen` : `🔓 ${c.brand} card unfrozen`, c.frozen ? 'error' : 'success');
}

// ===========================
//   TRANSFER
// ===========================
function updateBalanceSelects() {
  const from = document.getElementById('tfFrom');
  if (!from) return;
  from.innerHTML = `<option value="checking">Checking — ${fmt(STATE.balances.checking)}</option>`
    + (STATE.user.hasSavings ? `<option value="savings">Savings — ${fmt(STATE.balances.savings)}</option>` : '');
  const tfToUser = document.getElementById('tfToUser');
  if (tfToUser) {
    tfToUser.innerHTML = Object.entries(STATE.nexaUsers)
      .map(([k, u]) => `<option value="${k}">${u.name} — ${u.acct}</option>`).join('');
  }
  const wdFrom = document.getElementById('wdFrom');
  if (wdFrom) {
    wdFrom.innerHTML = `<option value="checking">Checking — ${fmt(STATE.balances.checking)}</option>`
      + (STATE.user.hasSavings ? `<option value="savings">Savings — ${fmt(STATE.balances.savings)}</option>` : '');
  }
}

function toggleTfType() {
  const t = document.getElementById('tfType').value;
  document.getElementById('tfToOwnWrap').classList.toggle('hidden', t !== 'own');
  document.getElementById('tfToUserWrap').classList.toggle('hidden', t !== 'user');
  document.getElementById('tfExternalNameWrap').classList.toggle('hidden', t !== 'external');
  document.getElementById('tfExternalDetailsRow').classList.toggle('hidden', t !== 'external');
}

function doTransfer(fromAcct, toTarget, amount, note, fromChat) {
  const f = fromAcct || document.getElementById('tfFrom').value;
  const type = fromChat ? 'user' : document.getElementById('tfType').value;
  const to = type === 'own'
    ? (document.getElementById('tfTo')?.value || 'savings')
    : type === 'user'
      ? (document.getElementById('tfToUser')?.value || toTarget)
      : 'external';
  const amt = amount !== undefined ? amount : parseFloat(document.getElementById('tfAmount').value);
  const n = note || document.getElementById('tfNote').value || '';

  if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return false; }
  if (STATE.balances[f] < amt) {
    showToast('Insufficient funds', 'error');
    addNotification('⚠️', 'Transfer Failed', 'A transfer was blocked because of insufficient funds.', 'Now');
    return false;
  }
  if (type === 'own' && f === to) { showToast('Choose different accounts', 'error'); return false; }

  STATE.balances[f] -= amt;

  let desc, icon;
  if (type === 'own') {
    STATE.balances[to] += amt;
    desc = `Transfer → ${to.charAt(0).toUpperCase()+to.slice(1)}`;
    icon = '🏦';
    addNotification('💸', 'Internal Transfer Sent', `${fmt(amt)} moved from ${f} to ${to}.`, 'Now');
  } else if (type === 'user') {
    const recipientKey = resolveNexaUserKey(toTarget || to);
    const uName = STATE.nexaUsers[recipientKey]?.name || toTarget || 'User';
    desc = `Sent to ${uName}${n ? ' · ' + n : ''}`;
    icon = '👤';
    if (recipientKey && USERS_DB[recipientKey]) {
      const recipientDb = USERS_DB[recipientKey];
      const recipientAcct = recipientDb.balances.checking !== undefined ? 'checking' : Object.keys(recipientDb.balances)[0];
      recipientDb.balances[recipientAcct] += amt;
      recipientDb.transactions.unshift({ id: Date.now() + 1, desc: `Received from ${STATE.user.name}${n ? ' · ' + n : ''}`, type:'in', amount: amt, date: today(), icon:'👤', acct: recipientAcct });
      recipientDb.notifications = recipientDb.notifications || [];
      recipientDb.notifications.unshift({ id: Date.now() + 2, icon:'💰', title:'Incoming Transfer', text:`${STATE.user.name} sent you ${fmt(amt)}.`, time:'Now', read:false });
    }
    addNotification('💸', 'Transfer Sent', `${fmt(amt)} sent to ${uName}.`, 'Now');
  } else {
    const externalName = document.getElementById('tfExternalName').value.trim();
    const routing = document.getElementById('tfRouting').value.trim();
    const acct = document.getElementById('tfExternalAcct').value.trim();
    if (!externalName || !/^\d{9}$/.test(routing) || acct.length < 6) {
      STATE.balances[f] += amt;
      showToast('Enter valid external transfer details', 'error');
      return false;
    }
    desc = `External Transfer → ${externalName}${n ? ' · ' + n : ''}`;
    icon = '🌐';
    addNotification('🌐', 'External Transfer Submitted', `${fmt(amt)} sent to ${externalName}.`, 'Now');
  }

  STATE.transactions.unshift({ id: Date.now(), desc, type:'out', amount: amt, date: today(), icon, acct: f });
  STATE.monthSpent += amt;
  syncCurrentStateToDb();
  renderDashboard();
  renderCardsPage();
  updateBalanceSelects();
  renderNotifications();

  if (!fromChat) {
    document.getElementById('tfAmount').value = '';
    document.getElementById('tfNote').value = '';
    const extName = document.getElementById('tfExternalName'); if (extName) extName.value = '';
    const routing = document.getElementById('tfRouting'); if (routing) routing.value = '';
    const extAcct = document.getElementById('tfExternalAcct'); if (extAcct) extAcct.value = '';
    showToast(`✅ ${fmt(amt)} transferred successfully`);
  }
  return true;
}

// ===========================
//   WITHDRAW
// ===========================
function doWithdraw(amountArg, fromArg, memoArg, fromChat) {
  const from = fromArg || document.getElementById('wdFrom').value || 'checking';
  const amt = amountArg !== undefined ? amountArg : parseFloat(document.getElementById('wdAmount').value);
  const memo = memoArg || document.getElementById('wdMemo').value.trim() || 'ATM Withdrawal';

  if (!amt || amt <= 0) { showToast('Enter a valid withdrawal amount', 'error'); return false; }
  if (STATE.balances[from] < amt) {
    showToast('Insufficient funds', 'error');
    addNotification('⚠️', 'Withdrawal Failed', `A ${fmt(amt)} withdrawal from ${from} was blocked.`, 'Now');
    return false;
  }

  STATE.balances[from] -= amt;
  STATE.monthSpent += amt;
  STATE.transactions.unshift({ id: Date.now(), desc: memo, type:'out', amount: amt, date: today(), icon:'🏧', acct: from });
  addNotification('🏧', 'Cash Withdrawal', `${fmt(amt)} withdrawn from your ${from} account.`, 'Now');
  syncCurrentStateToDb();
  renderDashboard();
  refreshAllTxns();
  updateBalanceSelects();
  renderNotifications();

  if (!fromChat) {
    document.getElementById('wdAmount').value = '';
    document.getElementById('wdMemo').value = '';
    showToast(`✅ ${fmt(amt)} withdrawn successfully`);
  }
  return true;
}

// ===========================
//   BILLS
// ===========================
function doPayBill(nameArg, amtArg, fromArg, fromChat) {
  const name = nameArg || document.getElementById('billName').value.trim();
  const amt  = amtArg  !== undefined ? amtArg : parseFloat(document.getElementById('billAmount').value);
  const from = fromArg || document.getElementById('billFrom').value || 'checking';

  if (!name) { showToast('Enter a bill name', 'error'); return false; }
  if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return false; }
  if (STATE.balances[from] < amt) { showToast('Insufficient funds', 'error'); return false; }

  STATE.balances[from] -= amt;
  STATE.transactions.unshift({ id: Date.now(), desc: name, type:'bill', amount: amt, date: today(), icon:'📄', acct: from });
  STATE.monthSpent += amt;

  // remove from bills list if found
  const idx = STATE.bills.findIndex(b => b.name.toLowerCase().includes(name.toLowerCase()));
  if (idx !== -1) STATE.bills.splice(idx, 1);

  addNotification('📄', 'Bill Paid', `${name} paid for ${fmt(amt)}.`, 'Now');
  syncCurrentStateToDb();
  renderDashboard();
  renderBillsGrid();
  updateBalanceSelects();
  renderNotifications();

  if (!fromChat) {
    document.getElementById('billName').value   = '';
    document.getElementById('billAmount').value = '';
    showToast(`✅ ${name} paid — ${fmt(amt)}`);
  }
  return true;
}

// ===========================
//   LOANS
// ===========================
function renderLoansPage() {
  const grid = document.getElementById('loansGrid');
  if (!grid) return;
  grid.innerHTML = STATE.loans.map(l => {
    let pct, pctLabel, fillClass;
    if (l.type === 'credit') {
      pct = ((l.balance / l.limit) * 100).toFixed(0);
      pctLabel = `${pct}% utilization (${fmt(l.balance)} of ${fmt(l.limit)})`;
      fillClass = 'credit';
    } else {
      const paid = l.original - l.balance;
      pct = ((paid / l.original) * 100).toFixed(0);
      pctLabel = `${pct}% paid off (${fmt(paid)} of ${fmt(l.original)})`;
      fillClass = 'installment';
    }
    return `
    <div class="loan-card">
      <div class="loan-header">
        <div class="loan-icon-wrap ${l.colorClass || l.type}">${l.icon}</div>
        <div class="loan-meta">
          <div class="loan-name">${l.name}</div>
          <div class="loan-apr">${l.apr}% APR · ${l.type === 'credit' ? 'Revolving Credit' : 'Installment Loan'}</div>
        </div>
        <div class="due-badge">📅 Due ${l.dueDate}</div>
      </div>
      <div class="loan-balance-row">
        <div>
          <div class="loan-bal-label">${l.type === 'credit' ? 'Current Balance' : 'Remaining Balance'}</div>
          <div class="loan-bal-value">${fmt(l.balance)}</div>
        </div>
      </div>
      <div class="loan-detail-row">
        <div class="loan-detail">
          <div class="loan-detail-label">Min. Payment</div>
          <div class="loan-detail-val">${fmt(l.minPayment)}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">APR</div>
          <div class="loan-detail-val">${l.apr}%</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">${l.type === 'credit' ? 'Credit Limit' : 'Original Amount'}</div>
          <div class="loan-detail-val">${fmt(l.type === 'credit' ? l.limit : l.original)}</div>
        </div>
      </div>
      <div class="loan-progress-wrap">
        <div class="loan-progress-label">
          <span>${pctLabel}</span>
        </div>
        <div class="loan-progress-bar">
          <div class="loan-progress-fill ${l.colorClass || fillClass}" style="width:${Math.min(pct,100)}%"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  // sync loan select dropdown
  const sel = document.getElementById('loanSelect');
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = STATE.loans.map(l => `<option value="${l.id}">${l.name} — ${fmt(l.balance)}</option>`).join('');
    if (STATE.loans.find(l => l.id === cur)) sel.value = cur;
  }
}

function doPayLoan(loanIdArg, amtArg, fromArg, fromChat) {
  const loanId = loanIdArg || document.getElementById('loanSelect').value;
  const amt    = amtArg !== undefined ? amtArg : parseFloat(document.getElementById('loanPayAmt').value);
  const from   = fromArg || document.getElementById('loanPayFrom').value || 'checking';
  const loan   = STATE.loans.find(l => l.id === loanId);

  if (!loan) { showToast('Loan not found', 'error'); return false; }
  if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return false; }
  if (STATE.balances[from] < amt) { showToast('Insufficient funds', 'error'); return false; }
  if (amt > loan.balance) { showToast(`Max payment is ${fmt(loan.balance)}`, 'error'); return false; }

  STATE.balances[from] -= amt;
  loan.balance = Math.max(0, loan.balance - amt);
  // recalculate min payment after payment
  if (loan.type === 'credit') {
    loan.minPayment = Math.max(25, loan.balance * 0.02);
  } else {
    loan.minPayment = loan.balance > 0 ? Math.min(loan.minPayment, loan.balance) : 0;
  }

  STATE.transactions.unshift({ id: Date.now(), desc: `${loan.name} Payment`, type:'bill', amount: amt, date: today(), icon: loan.icon, acct: from });
  STATE.monthSpent += amt;
  addNotification('🏛️', 'Loan Payment Posted', `${loan.name} payment of ${fmt(amt)} was successful.`, 'Now');
  syncCurrentStateToDb();
  renderDashboard();
  renderLoansPage();
  updateBalanceSelects();
  renderNotifications();

  if (!fromChat) {
    document.getElementById('loanPayAmt').value = '';
    showToast(`✅ ${fmt(amt)} payment applied to ${loan.name}`);
  }
  return true;
}

function doPayLoanMin() {
  const loanId = document.getElementById('loanSelect').value;
  const loan   = STATE.loans.find(l => l.id === loanId);
  if (!loan) return;
  document.getElementById('loanPayAmt').value = loan.minPayment.toFixed(2);
  doPayLoan();
}

// ===========================
//   TOAST
// ===========================
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===========================
//   CHAT ASSISTANT
// ===========================
function initChat() {
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = '';
  botMessage(`Hi ${STATE.user.name}! 👋 I'm <b>Nexi</b>, your NexaBank assistant. I can help you:`, [
    '💸 Transfer money', '📄 Pay a bill', '🏛️ Pay my loan', '💰 Check balance', '❄️ Freeze card'
  ]);
}

function botMessage(text, chips) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-mini-avatar">🤖</div>
    <div>
      <div class="msg-bubble">${text}</div>
      ${chips ? `<div class="chip-row">${chips.map(c=>`<span class="chip" onclick="fillChat('${c.replace(/[^\w\s]/g,'').trim()}')">${c}</span>`).join('')}</div>` : ''}
      <div class="msg-time">${timeStr()}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function botConfirm(text, onYes, onNo) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  const yesId = 'y' + Date.now(), noId = 'n' + Date.now();
  div.innerHTML = `
    <div class="msg-mini-avatar">🤖</div>
    <div>
      <div class="msg-bubble">${text}</div>
      <div class="confirm-btns">
        <button class="btn-yes" id="${yesId}">✅ Yes, confirm</button>
        <button class="btn-no"  id="${noId}">✕ Cancel</button>
      </div>
      <div class="msg-time">${timeStr()}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  document.getElementById(yesId).onclick = () => { disableConfirm(yesId, noId); onYes(); };
  document.getElementById(noId).onclick  = () => { disableConfirm(yesId, noId); onNo(); };
}

function disableConfirm(yId, nId) {
  [yId, nId].forEach(id => { const el = document.getElementById(id); if(el) el.disabled = true; });
}

function userMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="msg-mini-avatar" style="background:linear-gradient(135deg,#334155,#475569)">M</div>
    <div>
      <div class="msg-bubble">${text}</div>
      <div class="msg-time" style="text-align:right">${timeStr()}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typingDot';
  div.innerHTML = `<div class="msg-mini-avatar">🤖</div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { const el = document.getElementById('typingDot'); if(el) el.remove(); }

function fillChat(text) {
  document.getElementById('chatInput').value = text;
  document.getElementById('chatInput').focus();
}

function toggleChat() {
  const panel   = document.getElementById('chatPanel');
  const overlay = document.getElementById('chatOverlay');
  const fab     = document.getElementById('chatFab');
  const isOpen  = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  if (fab) fab.style.display = isOpen ? '' : 'none';
  if (!isOpen) {
    setTimeout(() => document.getElementById('chatInput')?.focus(), 320);
  }
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  const raw = inp.value.trim();
  if (!raw) return;
  inp.value = '';
  userMessage(raw);
  showTyping();
  setTimeout(() => { hideTyping(); processChat(raw); }, 700 + Math.random()*400);
}

// ===========================
//   NLP PARSER
// ===========================

function processChat(raw) {
  const text = raw.toLowerCase();

  // ── multi-step flow continuation ──
  if (chatCtx) {
    const ctx = chatCtx;
    chatCtx = null;

    if (ctx.step === 'transfer_amount') {
      const amt = parseAmount(text);
      if (!amt) { botMessage('Please give me a valid amount. How much would you like to transfer?'); chatCtx = ctx; return; }
      ctx.amount = amt;
      ctx.step = 'transfer_confirm';
      chatCtx = ctx;
      const toLabel = ctx.toType === 'own'
        ? ctx.toAcct.charAt(0).toUpperCase() + ctx.toAcct.slice(1) + ' Account'
        : ctx.toName;
      botConfirm(
        `Transfer ${fmt(amt)} from your <b>${ctx.fromAcct}</b> account to <b>${toLabel}</b>?`,
        () => { chatCtx = null; execTransferFromChat(ctx); },
        () => { chatCtx = null; botMessage('Transfer cancelled. Anything else I can help with? 😊'); }
      );
      return;
    }

    if (ctx.step === 'loan_select') {
      let loanId = null, loanName = '';
      if (/credit.?card/i.test(text) || /\bcc\b/i.test(text)) { loanId = 'cc'; loanName = 'Credit Card'; }
      else if (/auto|car/i.test(text))    { loanId = 'auto';     loanName = 'Auto Loan'; }
      else if (/personal/i.test(text))    { loanId = 'personal'; loanName = 'Personal Loan'; }
      if (!loanId) {
        botMessage('Please say "credit card", "auto loan", or "personal loan".');
        chatCtx = ctx; return;
      }
      const loan = STATE.loans.find(l => l.id === loanId);
      chatCtx = { step: 'loan_amount', loanId, loanName, fromAcct: 'checking' };
      botMessage(`How much would you like to pay on your <b>${loanName}</b>?<br><span class="muted small">Balance: ${fmt(loan.balance)} · Min: ${fmt(loan.minPayment)}</span>`,
        [`Pay minimum ${fmt(loan.minPayment)}`]);
      return;
    }

    if (ctx.step === 'loan_amount') {
      const amt = parseAmount(text) || (/minimum|min/i.test(text) ? STATE.loans.find(l=>l.id===ctx.loanId)?.minPayment : null);
      if (!amt) { botMessage('Please enter a valid dollar amount.'); chatCtx = ctx; return; }
      ctx.amount = amt;
      const lCtx = { ...ctx };
      botConfirm(`Pay ${fmt(amt)} on your <b>${ctx.loanName}</b> from checking?`,
        () => execLoanFromChat(lCtx),
        () => botMessage('Payment cancelled. 👍'));
      return;
    }

    if (ctx.step === 'bill_amount') {
      const amt = parseAmount(text);
      if (!amt) { botMessage('What amount should I pay for ' + ctx.billName + '?'); chatCtx = ctx; return; }
      ctx.amount = amt;
      ctx.step = 'bill_confirm';
      chatCtx = ctx;
      botConfirm(
        `Pay <b>${ctx.billName}</b> — ${fmt(amt)} from your <b>${ctx.fromAcct}</b> account?`,
        () => { chatCtx = null; execBillFromChat(ctx); },
        () => { chatCtx = null; botMessage('Payment cancelled. Anything else? 😊'); }
      );
      return;
    }
    return;
  }

  // Multi-intent execution: parse all supported commands in one prompt
  const actions = extractActionsFromText(text);

  if (actions.length > 1) {
    const summaryHtml = actions.map((action, idx) => `${idx + 1}. ${describeAction(action)}`).join('<br>');
    botConfirm(
      `I found <b>${actions.length}</b> actions in your message:<br><br>${summaryHtml}<br><br>Do you want me to do all of them in order?`,
      () => executeActionQueue(actions),
      () => botMessage('Okay — nothing was changed. 👍')
    );
    return;
  }

  if (actions.length === 1) {
    dispatchSingleParsedAction(actions[0], text);
    return;
  }

  // ── help / capabilities ──
  if (/help|what can you|what do you|capabilities|commands|options/.test(text)) {
    botMessage(`Here's what I can do for you 🤖<br><br>
      💸 <b>Transfer money</b> — "Transfer $200 to savings" or "Send $50 to Jacob"<br>
      📄 <b>Pay bills</b> — "Pay my electric bill" or "Pay Netflix $15.99"<br>
      🏛️ <b>Pay loans</b> — "Pay my credit card" or "Pay $200 on auto loan"<br>
      💰 <b>Check balance</b> — "What's my balance?" or "Show my loans"<br>
      🕒 <b>Transactions</b> — "Show my recent transactions"<br>
      ❄️ <b>Freeze card</b> — "Freeze my Visa card"<br>
      🔓 <b>Unfreeze card</b> — "Unfreeze my card"<br><br>
      You can also combine actions like:<br>
      • "Pay my auto loan and transfer $100 to savings"<br>
      • "Pay Netflix, freeze my card, and show my balance"`,
      ['💸 Transfer money', '📄 Pay a bill', '🏛️ Pay a loan', '💰 Check balance']);
    return;
  }

  // ── greetings ──
  if (/^(hi|hey|hello|good\s*(morning|afternoon|evening))/.test(text)) {
    botMessage(`Hey there! 👋 What can I help you with today?`, ['💸 Transfer', '📄 Pay bill', '💰 Balance']);
    return;
  }

  // ── default ──
  botMessage(`I didn't quite catch that. Try saying something like:<br>
    • "Transfer $100 to savings"<br>
    • "Pay my electric bill"<br>
    • "What's my balance?"<br>
    • "Freeze my card"<br>
    • "Pay my auto loan and transfer $100 to savings"`, ['💸 Transfer', '📄 Pay bill', '💰 Balance', 'Help']);
}


function parseAmount(text) {
  const m = text.match(/\$?([\d,]+(?:\.\d{1,2})?)/);
  return m ? parseFloat(m[1].replace(',','')) : null;
}

function detectUserTransfer(text) {
  for (const [key, u] of Object.entries(STATE.nexaUsers)) {
    const firstName = u.name.split(' ')[0].toLowerCase();
    if (text.includes(firstName) || text.includes(u.name.toLowerCase()) || text.includes(key)) {
      return u;
    }
  }
  return null;
}

function detectLoanMentions(text) {
  const matches = [];
  if (/credit.?card|\bcc\b/i.test(text)) matches.push({ id:'cc', name:'Credit Card' });
  if (/auto|car/i.test(text)) matches.push({ id:'auto', name:'Auto Loan' });
  if (/personal/i.test(text)) matches.push({ id:'personal', name:'Personal Loan' });
  return matches;
}

function splitIntentSegments(text) {
  return text
    .split(/\s*,\s*|\s+and then\s+|\s+then\s+|\s+\band\b\s+(?=(transfer|send|move|pay|freeze|unfreeze|unlock|block|show|check|what's|what is|balance|history|recent|statement|withdraw))/i)
    .filter(Boolean)
    .map(s => s.trim())
    .filter(s => s && !/^(transfer|send|move|pay|freeze|unfreeze|unlock|block|show|check|what's|what is|balance|history|recent|statement|withdraw)$/i.test(s));
}

function extractActionsFromText(text) {
  const actions = [];

  // Preserve the special "pay minimum for both/all of my loans" style request.
  const loanMentions = detectLoanMentions(text);
  if (loanMentions.length > 1 && /minimum|min\b/i.test(text) && /\b(both|all)\b|\band\b/i.test(text) && !/\btransfer|send|move|freeze|unfreeze|unlock|show|check|history|statement|withdraw\b/i.test(text)) {
    loanMentions.forEach(loan => {
      const loanData = STATE.loans.find(l => l.id === loan.id);
      if (loanData) {
        actions.push({ kind:'loan', loanId:loan.id, loanName:loan.name, amount:loanData.minPayment, fromAcct:'checking', inferredMinimum:true });
      }
    });
    return actions;
  }

  const segments = splitIntentSegments(text);
  for (const segment of segments) {
    const action = parseActionSegment(segment);
    if (Array.isArray(action)) actions.push(...action);
    else if (action) actions.push(action);
  }

  return actions;
}

function parseActionSegment(segment) {
  const text = segment.toLowerCase().trim();

  // balance / account overview
  if (/balance|how much|account|funds|money do i have/.test(text) && !/\btransfer\b|\bpay\b|\bwithdraw\b/.test(text)) {
    return { kind:'balance' };
  }

  // transaction history
  if (/history|transaction|recent|statement|spending/.test(text)) {
    return { kind:'history' };
  }

  // freeze / unfreeze
  if (/(unfreeze|unlock|reactivate).*(card|visa|mastercard)/i.test(text) || /unfreeze card/.test(text)) {
    return { kind:'unfreeze_card' };
  }
  if (/(freeze|lock|block).*(card|visa|mastercard)/i.test(text) || /freeze card/.test(text)) {
    return { kind:'freeze_card' };
  }

  // withdraw
  if (/\bwithdraw\b|cash out|take out/i.test(text)) {
    const amount = parseAmount(text);
    const fromAcct = /from savings/i.test(text) ? 'savings' : 'checking';
    if (!amount) return null;
    return { kind:'withdraw', amount, fromAcct, memo:'ATM Withdrawal' };
  }

  // transfer
  if (/transfer|send|move/i.test(text)) {
    const fromAcct = /from savings/i.test(text) ? 'savings' : 'checking';
    const amount = parseAmount(text);
    if (!amount) return null;

    const user = detectUserTransfer(text);
    if (user) {
      return { kind:'transfer', fromAcct, toType:'user', toName:user.name, amount };
    }

    let toAcct = 'savings';
    if (/to checking|into checking/i.test(text)) toAcct = 'checking';
    if (/to savings|into savings/i.test(text)) toAcct = 'savings';

    if (/external|outside bank|another bank/i.test(text)) {
      return { kind:'external_transfer', fromAcct, amount, toBank:'External Bank' };
    }

    return { kind:'transfer', fromAcct, toType:'own', toAcct, amount };
  }

  // loan payment
  if (/pay.*(loan|credit card|auto|car|personal)|loan payment|credit card payment/i.test(text)) {
    const mentions = detectLoanMentions(text);
    if (mentions.length > 1 && /minimum|min\b/i.test(text)) {
      return mentions.map(loan => {
        const loanData = STATE.loans.find(l => l.id === loan.id);
        return { kind:'loan', loanId:loan.id, loanName:loan.name, amount:loanData ? loanData.minPayment : 0, fromAcct:'checking', inferredMinimum:true };
      });
    }

    let loanId = null, loanName = '';
    if (/credit.?card/i.test(text))   { loanId = 'cc';       loanName = 'Credit Card'; }
    else if (/auto|car/i.test(text))  { loanId = 'auto';     loanName = 'Auto Loan'; }
    else if (/personal/i.test(text))  { loanId = 'personal'; loanName = 'Personal Loan'; }

    if (!loanId) return null;
    const loanData = STATE.loans.find(l => l.id === loanId);
    let amount = parseAmount(text);
    let inferredMinimum = false;
    if (!amount && loanData) {
      amount = loanData.minPayment;
      inferredMinimum = true;
    }
    return { kind:'loan', loanId, loanName, amount, fromAcct:'checking', inferredMinimum };
  }

  // bill payment
  if (/pay (my )?(bill|electric|water|internet|netflix|gym|subscription)/i.test(text)) {
    const m = text.match(/pay\s+([\w\s]+?)(?:\s+\$?([\d.,]+))?(?:\s+from\s+(checking|savings))?$/);
    let billName = '', amount = null, fromAcct = 'checking';
    if (m) {
      billName = m[1].trim();
      if (m[2]) amount = parseFloat(m[2].replace(',', ''));
      if (m[3]) fromAcct = m[3];
    } else {
      const knownMatch = text.match(/(electric|water|internet|netflix|gym|subscription)/i);
      if (knownMatch) billName = knownMatch[1];
    }
    const known = STATE.bills.find(b => b.name.toLowerCase().includes((billName || '').toLowerCase()));
    const finalName = known ? known.name : (billName || 'Bill');
    if (!amount && known) amount = known.amount;
    if (!amount) return null;
    return { kind:'bill', billName:finalName, amount, fromAcct };
  }

  return null;
}

function describeAction(action) {
  if (action.kind === 'loan') {
    return `Pay ${fmt(action.amount)} on <b>${action.loanName}</b>${action.inferredMinimum ? ' <span class="muted small">(minimum)</span>' : ''}`;
  }
  if (action.kind === 'transfer') {
    const target = action.toType === 'user'
      ? action.toName
      : `${action.toAcct.charAt(0).toUpperCase() + action.toAcct.slice(1)} Account`;
    return `Transfer ${fmt(action.amount)} to <b>${target}</b>`;
  }
  if (action.kind === 'external_transfer') {
    return `Transfer ${fmt(action.amount)} to <b>${action.toBank}</b>`;
  }
  if (action.kind === 'bill') return `Pay <b>${action.billName}</b> — ${fmt(action.amount)}`;
  if (action.kind === 'withdraw') return `Withdraw ${fmt(action.amount)} from <b>${action.fromAcct}</b>`;
  if (action.kind === 'freeze_card') return `Freeze your card`;
  if (action.kind === 'unfreeze_card') return `Unfreeze your card`;
  if (action.kind === 'balance') return `Show your balance`;
  if (action.kind === 'history') return `Show recent transactions`;
  return 'Run action';
}

function dispatchSingleParsedAction(action, text) {
  if (action.kind === 'balance') {
    botMessage(`Here's your current balance 💰<br><br>
      🏦 <b>Checking:</b> ${fmt(STATE.balances.checking)}<br>
      💜 <b>Savings:</b> ${fmt(STATE.balances.savings || 0)}<br>
      📊 <b>Total:</b> ${fmt((STATE.balances.checking || 0) + (STATE.balances.savings || 0))}`,
      ['💸 Make a transfer', '📄 Pay a bill']);
    return;
  }

  if (action.kind === 'history') {
    const last = STATE.transactions.slice(0, 4);
    if (!last.length) { botMessage('No transactions yet.'); return; }
    const rows = last.map(t => `• ${t.icon} ${t.desc} — <span class="${t.type}">${t.type==='in'?'+':'−'}${fmt(t.amount)}</span> <span class="muted small">(${t.date})</span>`).join('<br>');
    botMessage(`Your last ${last.length} transactions:<br><br>${rows}`, ['💰 Check balance']);
    return;
  }

  if (action.kind === 'freeze_card') {
    const c = STATE.cards.find(x => !x.frozen) || STATE.cards[0];
    botConfirm(`Freeze your <b>${c.brand}</b> card ending ${c.num.slice(-4)}?`,
      () => {
        c.frozen = true;
        addNotification('❄️', 'Card Frozen', `Your ${c.brand} card ending in ${c.num.slice(-4)} was frozen.`, 'Now');
        renderCardsPage();
        renderNotifications();
        botMessage(`❄️ Your ${c.brand} card has been frozen. You can unfreeze it anytime.`);
      },
      () => botMessage('No problem, card stays active. 👍'));
    return;
  }

  if (action.kind === 'unfreeze_card') {
    const c = STATE.cards.find(x => x.frozen);
    if (!c) { botMessage('None of your cards are currently frozen. ✅'); return; }
    botConfirm(`Unfreeze your <b>${c.brand}</b> card ending ${c.num.slice(-4)}?`,
      () => {
        c.frozen = false;
        addNotification('🔓', 'Card Unfrozen', `Your ${c.brand} card ending in ${c.num.slice(-4)} is active again.`, 'Now');
        renderCardsPage();
        renderNotifications();
        botMessage(`🔓 Your ${c.brand} card is now active and ready to use.`);
      },
      () => botMessage('Okay, your card stays frozen. 🔒'));
    return;
  }

  if (action.kind === 'loan') {
    const loan = STATE.loans.find(l => l.id === action.loanId);
    if (!loan) { botMessage('Loan not found.'); return; }
    botConfirm(`Pay ${fmt(action.amount)} on your <b>${action.loanName}</b> from checking?${action.inferredMinimum ? '<br><span class="muted small">I used the minimum payment because no amount was provided.</span>' : ''}`,
      () => execLoanFromChat(action),
      () => botMessage('Payment cancelled. 👍'));
    return;
  }

  if (action.kind === 'bill') {
    botConfirm(`Pay <b>${action.billName}</b> — ${fmt(action.amount)} from your <b>${action.fromAcct}</b> account?`,
      () => execBillFromChat(action),
      () => botMessage('Payment cancelled. 👍'));
    return;
  }

  if (action.kind === 'transfer') {
    const toLabel = action.toType === 'user'
      ? action.toName
      : `${action.toAcct.charAt(0).toUpperCase() + action.toAcct.slice(1)} Account`;
    botConfirm(`Transfer ${fmt(action.amount)} from your <b>${action.fromAcct}</b> account to <b>${toLabel}</b>?`,
      () => execTransferFromChat(action),
      () => botMessage('Transfer cancelled. 👍'));
    return;
  }

  if (action.kind === 'withdraw') {
    botConfirm(`Withdraw ${fmt(action.amount)} from your <b>${action.fromAcct}</b> account?`,
      () => execWithdrawFromChat(action),
      () => botMessage('Withdrawal cancelled. 👍'));
    return;
  }

  if (action.kind === 'external_transfer') {
    botMessage(`I found an external transfer request for ${fmt(action.amount)}. Right now chat can only fully execute internal transfers, but the external transfer form on the Transfer page is ready for that flow.`, ['💸 Transfer money']);
    return;
  }
}

function executeActionQueue(actions) {
  const results = [];

  actions.forEach(action => {
    try {
      if (action.kind === 'loan') {
        const ok = doPayLoan(action.loanId, action.amount, action.fromAcct || 'checking', true);
        results.push(ok
          ? `✅ Paid ${fmt(action.amount)} on <b>${action.loanName}</b>${action.inferredMinimum ? ' <span class="muted small">(minimum)</span>' : ''}`
          : `❌ Could not pay <b>${action.loanName}</b>`);
        return;
      }

      if (action.kind === 'bill') {
        const ok = doPayBill(action.billName, action.amount, action.fromAcct || 'checking', true);
        results.push(ok
          ? `✅ Paid <b>${action.billName}</b> — ${fmt(action.amount)}`
          : `❌ Could not pay <b>${action.billName}</b>`);
        return;
      }

      if (action.kind === 'transfer') {
        const ok = doTransfer(action.fromAcct || 'checking', action.toName || action.toAcct, action.amount, '', true);
        const target = action.toType === 'user'
          ? action.toName
          : `${action.toAcct.charAt(0).toUpperCase() + action.toAcct.slice(1)} Account`;
        results.push(ok
          ? `✅ Transferred ${fmt(action.amount)} to <b>${target}</b>`
          : `❌ Could not transfer ${fmt(action.amount)} to <b>${target}</b>`);
        return;
      }

      if (action.kind === 'withdraw') {
        const ok = doWithdraw(action.amount, action.fromAcct || 'checking', action.memo || 'ATM Withdrawal', true);
        results.push(ok
          ? `✅ Withdrew ${fmt(action.amount)} from <b>${action.fromAcct}</b>`
          : `❌ Could not withdraw ${fmt(action.amount)} from <b>${action.fromAcct}</b>`);
        return;
      }

      if (action.kind === 'freeze_card') {
        const c = STATE.cards.find(x => !x.frozen) || STATE.cards[0];
        if (c) {
          c.frozen = true;
          addNotification('❄️', 'Card Frozen', `Your ${c.brand} card ending in ${c.num.slice(-4)} was frozen.`, 'Now');
          renderCardsPage();
          renderNotifications();
          results.push(`✅ Froze your <b>${c.brand}</b> card`);
        } else {
          results.push(`❌ No card found to freeze`);
        }
        return;
      }

      if (action.kind === 'unfreeze_card') {
        const c = STATE.cards.find(x => x.frozen);
        if (c) {
          c.frozen = false;
          addNotification('🔓', 'Card Unfrozen', `Your ${c.brand} card ending in ${c.num.slice(-4)} is active again.`, 'Now');
          renderCardsPage();
          renderNotifications();
          results.push(`✅ Unfroze your <b>${c.brand}</b> card`);
        } else {
          results.push(`ℹ️ None of your cards were frozen`);
        }
        return;
      }

      if (action.kind === 'balance') {
        results.push(`💰 Checking: <b>${fmt(STATE.balances.checking || 0)}</b> · Savings: <b>${fmt(STATE.balances.savings || 0)}</b> · Total: <b>${fmt((STATE.balances.checking || 0) + (STATE.balances.savings || 0))}</b>`);
        return;
      }

      if (action.kind === 'history') {
        const last = STATE.transactions.slice(0, 3);
        if (!last.length) results.push(`ℹ️ No recent transactions`);
        else results.push(`🕒 Recent: ${last.map(t => `${t.desc} (${t.type==='in'?'+':'-'}${fmt(t.amount)})`).join(' · ')}`);
        return;
      }

      if (action.kind === 'external_transfer') {
        results.push(`ℹ️ External transfer detected for ${fmt(action.amount)} — use the Transfer page for that flow.`);
        return;
      }
    } catch (e) {
      results.push(`❌ Something went wrong while processing ${action.kind}`);
    }
  });

  renderDashboard();
  refreshAllTxns();
  renderLoansPage();
  renderBillsGrid();
  renderCardsPage();
  updateBalanceSelects();
  renderNotifications();

  botMessage(`Finished processing your request:<br><br>${results.join('<br>')}`, ['💰 Check balance', '🕒 History', 'Help']);
}

function execWithdrawFromChat(ctx) {
  const ok = doWithdraw(ctx.amount, ctx.fromAcct || 'checking', ctx.memo || 'ATM Withdrawal', true);
  if (ok) {
    botMessage(`✅ ${fmt(ctx.amount)} withdrawn from your <b>${ctx.fromAcct}</b> account.<br>
      Remaining balance: ${fmt(STATE.balances[ctx.fromAcct || 'checking'])}`,
      ['💰 Check balance', '🕒 History']);
    showToast(`✅ Withdrawal — ${fmt(ctx.amount)}`);
  } else {
    botMessage(`❌ Withdrawal failed — check your balance or amount.`);
  }
}


function execTransferFromChat(ctx) {
  const ok = doTransfer(ctx.fromAcct, ctx.toName || ctx.toAcct, ctx.amount, '', true);
  if (ok) {
    const toLabel = ctx.toType === 'own'
      ? ctx.toAcct.charAt(0).toUpperCase() + ctx.toAcct.slice(1) + ' Account'
      : ctx.toName;
    botMessage(`✅ Done! ${fmt(ctx.amount)} has been transferred to <b>${toLabel}</b>.<br><br>
      💳 Updated Checking: ${fmt(STATE.balances.checking)}<br>
      💜 Updated Savings: ${fmt(STATE.balances.savings)}`,
      ['💰 Check balance', '📄 Pay a bill']);
    showToast(`✅ ${fmt(ctx.amount)} transferred`);
  } else {
    botMessage(`❌ Transfer failed — you may not have sufficient funds.`);
  }
}

function execBillFromChat(ctx) {
  const ok = doPayBill(ctx.billName, ctx.amount, ctx.fromAcct, true);
  if (ok) {
    botMessage(`✅ <b>${ctx.billName}</b> has been paid — ${fmt(ctx.amount)}.<br>
      Remaining ${ctx.fromAcct} balance: ${fmt(STATE.balances[ctx.fromAcct])}`,
      ['💸 Transfer', '💰 Check balance']);
    showToast(`✅ ${ctx.billName} paid — ${fmt(ctx.amount)}`);
  } else {
    botMessage(`❌ Payment failed — insufficient funds or invalid amount.`);
  }
}

function execLoanFromChat(ctx) {
  const ok = doPayLoan(ctx.loanId, ctx.amount, ctx.fromAcct, true);
  if (ok) {
    const loan = STATE.loans.find(l => l.id === ctx.loanId);
    const remaining = loan ? fmt(loan.balance) : '—';
    botMessage(`✅ ${fmt(ctx.amount)} payment applied to your <b>${ctx.loanName}</b>.<br>
      Remaining balance: <span style="color:var(--red)">${remaining}</span><br>
      Checking balance: ${fmt(STATE.balances[ctx.fromAcct || 'checking'])}`,
      ['🏛️ Pay another loan', '💰 Check balance', '💸 Transfer']);
    showToast(`✅ ${ctx.loanName} payment — ${fmt(ctx.amount)}`);
  } else {
    botMessage(`❌ Payment failed — check your balance or amount.`);
  }
}
document.addEventListener('click', resetSessionTimer);
document.addEventListener('keydown', resetSessionTimer);