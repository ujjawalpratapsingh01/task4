// --- Authentication Guard ---
if (localStorage.getItem('nexora_auth') !== 'true') {
  window.location.href = 'index.html';
}

// --- CRM DATA MANAGEMENT LAYER (LocalStorage) ---
const STORAGE_KEY = 'stackcrm_data_v1';

const defaultData = {
  leads: [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah@acme.com', phone: '+1 555-0192', company: 'Acme Corp', source: 'Google Ads', status: 'qualified', value: 14500 },
    { id: 2, name: 'Marcus Sterling', email: 'marcus@stark.io', phone: '+1 555-0144', company: 'Stark Industries', source: 'Referral', status: 'new', value: 28000 },
    { id: 3, name: 'Elena Rostova', email: 'elena@globex.org', phone: '+1 555-0183', company: 'Globex Corp', source: 'LinkedIn', status: 'contacted', value: 9200 },
    { id: 4, name: 'David Kim', email: 'david@apextech.com', phone: '+1 555-0171', company: 'Apex Tech', source: 'Direct', status: 'qualified', value: 45000 }
  ],
  contacts: [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah@acme.com', phone: '+1 555-0192', company: 'Acme Corp', role: 'CTO' },
    { id: 2, name: 'Elena Rostova', email: 'elena@globex.org', phone: '+1 555-0183', company: 'Globex Corp', role: 'Procurement Lead' },
    { id: 3, name: 'David Kim', email: 'david@apextech.com', phone: '+1 555-0171', company: 'Apex Tech', role: 'Director of IT' }
  ],
  companies: [
    { id: 1, name: 'Acme Corp', industry: 'Manufacturing', website: 'acme.com', deals: 1 },
    { id: 2, name: 'Stark Industries', industry: 'Defense / Tech', website: 'stark.io', deals: 1 },
    { id: 3, name: 'Globex Corp', industry: 'Energy', website: 'globex.org', deals: 1 },
    { id: 4, name: 'Apex Tech', industry: 'Software', website: 'apextech.com', deals: 1 }
  ],
  deals: [
    { id: 1, title: 'Enterprise Cloud Migration', company: 'Acme Corp', value: 14500, stage: 'Qualified', closing: '2026-06-15' },
    { id: 2, title: 'AI Infrastructure Upgrade', company: 'Stark Industries', value: 28000, stage: 'Proposal', closing: '2026-06-30' },
    { id: 3, title: 'Global Security License', company: 'Globex Corp', value: 9200, stage: 'Negotiation', closing: '2026-07-10' },
    { id: 4, title: 'SaaS Platform Rollout', company: 'Apex Tech', value: 45000, stage: 'Won', closing: '2026-05-20' }
  ],
  tasks: [
    { id: 1, title: 'Follow up with Sarah on cloud architecture', due: '2026-06-08', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Send revised contract to Stark Industries', due: '2026-06-10', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Quarterly review meeting with Apex Tech', due: '2026-06-12', priority: 'High', status: 'Completed' }
  ]
};

function getAppData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderAll();
}

function resetDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  showToast('Demo data reset successfully!', 'success');
  renderAll();
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'notification ' + type;
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 3000);
}

// --- UI RENDERING & LOGIC ---
let revenueChartInstance = null;
let pipelineChartInstance = null;
let activeModalType = 'lead';

function renderAll() {
  const db = getAppData();
  
  // Update KPIs
  document.getElementById('kpi-leads').textContent = db.leads.length;
  document.getElementById('kpi-contacts').textContent = db.contacts.length;
  document.getElementById('kpi-deals').textContent = db.deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
  
  const totalRev = db.deals.filter(d => d.stage === 'Won').reduce((sum, d) => sum + d.value, 94820);
  document.getElementById('kpi-revenue').textContent = '$' + totalRev.toLocaleString();
  
  const convRate = db.leads.length ? ((db.leads.filter(l => l.status === 'qualified').length / db.leads.length) * 100).toFixed(1) : 0;
  document.getElementById('kpi-conversion').textContent = convRate + '%';
  
  const pendingTasks = db.tasks.filter(t => t.status === 'Pending').length;
  document.getElementById('kpi-tasks').textContent = pendingTasks;

  // Render Tables
  renderLeadsTables(db.leads);
  renderContactsTable(db.contacts);
  renderCompaniesTable(db.companies);
  renderDealsTable(db.deals);
  renderTasksTable(db.tasks);

  // Render Charts
  renderCharts(db);
}

function renderLeadsTables(leads) {
  const tbody1 = document.getElementById('leads-table-body');
  const tbody2 = document.getElementById('full-leads-tbody');
  
  const html = leads.map(l => `
    <tr>
      <td><strong>${l.name}</strong></td>
      <td>${l.email}</td>
      <td>${l.phone || 'N/A'}</td>
      <td>${l.company}</td>
      <td>${l.source}</td>
      <td><span class="badge ${l.status}">${l.status}</span></td>
      <td>
        <button class="link-btn" onclick="deleteRecord('leads', ${l.id})" style="color:var(--error);">Delete</button>
      </td>
    </tr>
  `).join('');
  
  if (tbody1) tbody1.innerHTML = html;
  if (tbody2) tbody2.innerHTML = html;
}

function renderContactsTable(contacts) {
  const tbody = document.getElementById('contacts-tbody');
  if (!tbody) return;
  tbody.innerHTML = contacts.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.company}</td>
      <td>${c.role}</td>
    </tr>
  `).join('');
}

function renderCompaniesTable(companies) {
  const tbody = document.getElementById('companies-tbody');
  if (!tbody) return;
  tbody.innerHTML = companies.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.industry}</td>
      <td><a href="https://${c.website}" target="_blank" style="color:var(--primary);">${c.website}</a></td>
      <td>${c.deals} Active Deal</td>
    </tr>
  `).join('');
}

function renderDealsTable(deals) {
  const tbody = document.getElementById('deals-tbody');
  if (!tbody) return;
  tbody.innerHTML = deals.map(d => `
    <tr>
      <td><strong>${d.title}</strong></td>
      <td>${d.company}</td>
      <td>$${d.value.toLocaleString()}</td>
      <td><span class="badge qualified">${d.stage}</span></td>
      <td>${d.closing}</td>
      <td>
        <button class="link-btn" onclick="deleteRecord('deals', ${d.id})" style="color:var(--error);">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderTasksTable(tasks) {
  const tbody = document.getElementById('tasks-tbody');
  if (!tbody) return;
  tbody.innerHTML = tasks.map(t => `
    <tr>
      <td><strong>${t.title}</strong></td>
      <td>${t.due}</td>
      <td>${t.priority}</td>
      <td><span class="badge ${t.status === 'Completed' ? 'qualified' : 'contacted'}">${t.status}</span></td>
      <td>
        <button class="link-btn" onclick="toggleTask(${t.id})">Toggle Status</button>
      </td>
    </tr>
  `).join('');
}

function renderCharts(db) {
  const ctxRev = document.getElementById('revenueChart').getContext('2d');
  if (revenueChartInstance) revenueChartInstance.destroy();
  
  revenueChartInstance = new Chart(ctxRev, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue ($)',
        data: [12000, 19000, 15000, 28000, 34000, 42000, 52000, 48000, 61000, 75000, 89000, 104000],
        borderColor: '#0F8F6F',
        backgroundColor: 'rgba(15, 143, 111, 0.1)',
        fill: true,
        tension: 0.35
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const ctxPipe = document.getElementById('pipelineChart').getContext('2d');
  if (pipelineChartInstance) pipelineChartInstance.destroy();

  pipelineChartInstance = new Chart(ctxPipe, {
    type: 'doughnut',
    data: {
      labels: ['Qualified', 'Proposal', 'Negotiation', 'Won'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: ['#175CD3', '#0F8F6F', '#8a6855', '#067647']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

window.deleteRecord = function(collection, id) {
  const db = getAppData();
  db[collection] = db[collection].filter(item => item.id !== id);
  saveAppData(db);
  showToast('Record deleted successfully.', 'success');
};

window.toggleTask = function(id) {
  const db = getAppData();
  const task = db.tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    saveAppData(db);
    showToast('Task status updated!', 'success');
  }
};

// --- MODAL & FORM MANAGEMENT ---
window.openModal = function(type) {
  activeModalType = type;
  const modal = document.getElementById('app-modal');
  const title = document.getElementById('modal-title-text');
  const container = document.getElementById('modal-form-fields');
  
  modal.classList.add('open');
  
  if (type === 'lead') {
    title.textContent = 'Add New Lead';
    container.innerHTML = `
      <div class="field half"><label>Full Name</label><input type="text" id="m-name" required /></div>
      <div class="field half"><label>Email Address</label><input type="email" id="m-email" required /></div>
      <div class="field half"><label>Phone</label><input type="text" id="m-phone" /></div>
      <div class="field half"><label>Company</label><input type="text" id="m-company" required /></div>
      <div class="field half"><label>Source</label><input type="text" id="m-source" value="Direct" /></div>
      <div class="field half"><label>Status</label><select id="m-status"><option value="new">New</option><option value="qualified">Qualified</option><option value="contacted">Contacted</option></select></div>
    `;
  } else if (type === 'deal') {
    title.textContent = 'Create New Deal';
    container.innerHTML = `
      <div class="field"><label>Deal Title</label><input type="text" id="m-dtitle" required /></div>
      <div class="field half"><label>Company Name</label><input type="text" id="m-dcompany" required /></div>
      <div class="field half"><label>Value ($)</label><input type="number" id="m-dvalue" required /></div>
      <div class="field half"><label>Stage</label><select id="m-dstage"><option value="Qualified">Qualified</option><option value="Proposal">Proposal</option><option value="Negotiation">Negotiation</option><option value="Won">Won</option></select></div>
      <div class="field half"><label>Closing Date</label><input type="date" id="m-dclosing" required /></div>
    `;
  } else if (type === 'task') {
    title.textContent = 'Schedule Task';
    container.innerHTML = `
      <div class="field"><label>Task Title</label><input type="text" id="m-ttitle" required /></div>
      <div class="field half"><label>Due Date</label><input type="date" id="m-tdue" required /></div>
      <div class="field half"><label>Priority</label><select id="m-tpriority"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
    `;
  }
};

window.closeModal = function() {
  document.getElementById('app-modal').classList.remove('open');
};

document.getElementById('dynamic-modal-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const db = getAppData();

  if (activeModalType === 'lead') {
    db.leads.push({
      id: Date.now(),
      name: document.getElementById('m-name').value,
      email: document.getElementById('m-email').value,
      phone: document.getElementById('m-phone').value,
      company: document.getElementById('m-company').value,
      source: document.getElementById('m-source').value,
      status: document.getElementById('m-status').value,
      value: 10000
    });
    showToast('Lead created successfully!');
  } else if (activeModalType === 'deal') {
    db.deals.push({
      id: Date.now(),
      title: document.getElementById('m-dtitle').value,
      company: document.getElementById('m-dcompany').value,
      value: parseFloat(document.getElementById('m-dvalue').value),
      stage: document.getElementById('m-dstage').value,
      closing: document.getElementById('m-dclosing').value
    });
    showToast('Deal created successfully!');
  } else if (activeModalType === 'task') {
    db.tasks.push({
      id: Date.now(),
      title: document.getElementById('m-ttitle').value,
      due: document.getElementById('m-tdue').value,
      priority: document.getElementById('m-tpriority').value,
      status: 'Pending'
    });
    showToast('Task scheduled successfully!');
  }

  saveAppData(db);
  closeModal();
});

// --- NAVIGATION & UI INTERACTION ---
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    const targetId = item.getAttribute('data-target');
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    
    const label = item.querySelector('.nav-label').textContent;
    document.getElementById('current-breadcrumb-title').textContent = label;
  });
});

document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('nexora_auth');
  window.location.href = 'index.html';
});

document.getElementById('quick-add-btn').addEventListener('click', () => {
  openModal('lead');
});

document.getElementById('export-csv-btn').addEventListener('click', () => {
  const db = getAppData();
  let csv = 'Name,Email,Company,Status,Value\n';
  db.leads.forEach(l => {
    csv += `"${l.name}","${l.email}","${l.company}","${l.status}",${l.value}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'stackcrm_leads_export.csv');
  a.click();
  showToast('CSV export generated successfully!', 'success');
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderAll();
});