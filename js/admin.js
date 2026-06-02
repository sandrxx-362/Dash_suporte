/**
 * admin.js — Área Administrativa
 * CRUD completo para atendentes, detalhes e relatório geral
 */

let adminData = null;
let editingAtendente = null;
let editingFluxoAtendIdx = null;
let editingFluxoIdx = null;
let editingGeralIdx = null;

function adminInit() {
  adminData = loadData();

  // Navegação
  document.querySelectorAll('.admin-nav-item[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      showPanel(panel);
      document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  renderAtendentesTable();
  renderFluxoDetalheTable();
  renderGeralTable();
  renderPeriodo();
}

function showPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id)?.classList.add('active');
}

// ═══ PERÍODO ══════════════════════════════════════════════════════════════
function renderPeriodo() {
  document.getElementById('inputPeriodo').value = adminData.periodo || '';
}

function savePeriodo() {
  const val = document.getElementById('inputPeriodo').value.trim();
  if (!val) { showToast('Preencha o período', 'error'); return; }
  adminData.periodo = val;
  saveData(adminData);
  showToast('Período atualizado!', 'success');
}

// ═══ ATENDENTES ══════════════════════════════════════════════════════════
function renderAtendentesTable() {
  const tbody = document.getElementById('atendenteAdminBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  adminData.atendentes.forEach((a, i) => {
    const taxa = a.registrados > 0 ? ((a.concluidas / a.registrados) * 100).toFixed(1) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color:var(--txt-1)">${a.nome}</strong></td>
      <td>${a.registrados}</td>
      <td>${a.os_abertas}</td>
      <td>${a.concluidas}</td>
      <td>${a.abortados}</td>
      <td>${a.pendentes}</td>
      <td>${a.sol_remota}</td>
      <td>${taxa}%</td>
      <td>
        <div class="actions-col">
          <button class="btn btn-outline btn-sm" onclick="openEditAtendente(${i})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteAtendente(${i})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewAtendente() {
  editingAtendente = null;
  document.getElementById('modalAtendTitle').textContent = '➕ Novo Atendente';
  clearAtendForm();
  openModal('modalAtendente');
}

function openEditAtendente(idx) {
  editingAtendente = idx;
  const a = adminData.atendentes[idx];
  document.getElementById('modalAtendTitle').textContent = `✏️ Editar — ${a.nome}`;
  document.getElementById('atend-nome').value = a.nome;
  document.getElementById('atend-reg').value = a.registrados;
  document.getElementById('atend-os').value = a.os_abertas;
  document.getElementById('atend-con').value = a.concluidas;
  document.getElementById('atend-abo').value = a.abortados;
  document.getElementById('atend-pen').value = a.pendentes;
  document.getElementById('atend-rem').value = a.sol_remota;
  openModal('modalAtendente');
}

function saveAtendente() {
  const nome = document.getElementById('atend-nome').value.trim().toUpperCase();
  const reg  = parseInt(document.getElementById('atend-reg').value) || 0;
  const os   = parseInt(document.getElementById('atend-os').value) || 0;
  const con  = parseInt(document.getElementById('atend-con').value) || 0;
  const abo  = parseInt(document.getElementById('atend-abo').value) || 0;
  const pen  = parseInt(document.getElementById('atend-pen').value) || 0;
  const rem  = parseInt(document.getElementById('atend-rem').value) || 0;

  if (!nome) { showToast('Nome obrigatório', 'error'); return; }

  const obj = { nome, registrados: reg, os_abertas: os, concluidas: con, abortados: abo, pendentes: pen, sol_remota: rem };

  if (editingAtendente !== null) {
    obj.detalhes = adminData.atendentes[editingAtendente].detalhes;
    adminData.atendentes[editingAtendente] = obj;
    showToast(`${nome} atualizado!`, 'success');
  } else {
    obj.detalhes = buildEmptyDetalhes();
    adminData.atendentes.push(obj);
    showToast(`${nome} adicionado!`, 'success');
  }

  saveData(adminData);
  closeModal('modalAtendente');
  renderAtendentesTable();
  renderFluxoDetalheTable();
}

function confirmDeleteAtendente(idx) {
  const a = adminData.atendentes[idx];
  if (confirm(`Excluir atendente "${a.nome}"? Esta ação não pode ser desfeita.`)) {
    adminData.atendentes.splice(idx, 1);
    saveData(adminData);
    renderAtendentesTable();
    renderFluxoDetalheTable();
    showToast('Atendente excluído', 'success');
  }
}

function clearAtendForm() {
  ['atend-nome','atend-reg','atend-os','atend-con','atend-abo','atend-pen','atend-rem'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function buildEmptyDetalhes() {
  const fluxos = [
    'SEM INTERNET','SEM INTERNET FILIAIS','LENTIDÃO','LENTIDÃO FILIAIS','TROCA DE SENHA',
    'SERVIÇO SOLICITADO PELO CLIENTE','SERVIÇO SOLICITADO PELO CLIENTE FILIAIS',
    'TROCA DE EQUIPAMENTO','TROCA DE EQUIPAMENTO FILIAIS','MUDANÇA DE CÔMODO','MUDANÇA DE CÔMODO FILIAIS'
  ];
  return fluxos.map(f => ({ fluxo: f, registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 }));
}

// ═══ DETALHES DE FLUXO POR ATENDENTE ═════════════════════════════════════
function renderFluxoDetalheTable() {
  const sel = document.getElementById('selectAtendFluxo');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '';
  adminData.atendentes.forEach((a, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = a.nome;
    if (String(i) === cur) opt.selected = true;
    sel.appendChild(opt);
  });
  renderFluxoDetalheRows();
}

function renderFluxoDetalheRows() {
  const sel = document.getElementById('selectAtendFluxo');
  const idx = parseInt(sel?.value || 0);
  const a = adminData.atendentes[idx];
  if (!a) return;

  document.getElementById('fluxoDetalheTitle').textContent = `Fluxos — ${a.nome}`;
  const tbody = document.getElementById('fluxoDetalheBody');
  tbody.innerHTML = '';

  a.detalhes.forEach((d, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:12px">${d.fluxo}</td>
      <td>${d.registrados}</td>
      <td>${d.os_abertas}</td>
      <td>${d.concluidas}</td>
      <td>${d.abortados}</td>
      <td>${d.pendentes}</td>
      <td>${d.sol_remota}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEditFluxoDetalhe(${idx},${i})">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openEditFluxoDetalhe(atendIdx, fluxIdx) {
  editingFluxoAtendIdx = atendIdx;
  editingFluxoIdx = fluxIdx;
  const d = adminData.atendentes[atendIdx].detalhes[fluxIdx];
  document.getElementById('modalFluxoTitle').textContent = `✏️ Editar — ${d.fluxo}`;
  document.getElementById('fluxo-nome').value = d.fluxo;
  document.getElementById('fluxo-reg').value = d.registrados;
  document.getElementById('fluxo-os').value = d.os_abertas;
  document.getElementById('fluxo-con').value = d.concluidas;
  document.getElementById('fluxo-abo').value = d.abortados;
  document.getElementById('fluxo-pen').value = d.pendentes;
  document.getElementById('fluxo-rem').value = d.sol_remota;
  openModal('modalFluxoDetalhe');
}

function saveFluxoDetalhe() {
  const nome = document.getElementById('fluxo-nome').value.trim();
  const reg  = parseInt(document.getElementById('fluxo-reg').value) || 0;
  const os   = parseInt(document.getElementById('fluxo-os').value) || 0;
  const con  = parseInt(document.getElementById('fluxo-con').value) || 0;
  const abo  = parseInt(document.getElementById('fluxo-abo').value) || 0;
  const pen  = parseInt(document.getElementById('fluxo-pen').value) || 0;
  const rem  = parseInt(document.getElementById('fluxo-rem').value) || 0;

  if (!nome) { showToast('Nome obrigatório', 'error'); return; }

  adminData.atendentes[editingFluxoAtendIdx].detalhes[editingFluxoIdx] = { fluxo: nome, registrados: reg, os_abertas: os, concluidas: con, abortados: abo, pendentes: pen, sol_remota: rem };

  // Recalculate atendente totals
  recalcAtendente(editingFluxoAtendIdx);

  saveData(adminData);
  closeModal('modalFluxoDetalhe');
  renderFluxoDetalheRows();
  renderAtendentesTable();
  showToast('Fluxo atualizado!', 'success');
}

function recalcAtendente(idx) {
  const a = adminData.atendentes[idx];
  a.registrados = a.detalhes.reduce((s, d) => s + d.registrados, 0);
  a.os_abertas  = a.detalhes.reduce((s, d) => s + d.os_abertas, 0);
  a.concluidas  = a.detalhes.reduce((s, d) => s + d.concluidas, 0);
  a.abortados   = a.detalhes.reduce((s, d) => s + d.abortados, 0);
  a.pendentes   = a.detalhes.reduce((s, d) => s + d.pendentes, 0);
  a.sol_remota  = a.detalhes.reduce((s, d) => s + d.sol_remota, 0);
}

// ═══ RELATÓRIO GERAL ══════════════════════════════════════════════════════
function renderGeralTable() {
  const tbody = document.getElementById('geralAdminBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  adminData.relatorio_geral.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:12px">${r.fluxo}</td>
      <td>${r.registrados}</td>
      <td>${r.os_abertas}</td>
      <td>${r.concluidas}</td>
      <td>${r.abortados}</td>
      <td>${r.pendentes}</td>
      <td>${r.sol_remota}</td>
      <td>
        <div class="actions-col">
          <button class="btn btn-outline btn-sm" onclick="openEditGeral(${i})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteGeral(${i})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewGeral() {
  editingGeralIdx = null;
  document.getElementById('modalGeralTitle').textContent = '➕ Novo Fluxo';
  clearGeralForm();
  openModal('modalGeral');
}

function openEditGeral(idx) {
  editingGeralIdx = idx;
  const r = adminData.relatorio_geral[idx];
  document.getElementById('modalGeralTitle').textContent = `✏️ Editar — ${r.fluxo}`;
  document.getElementById('geral-fluxo').value = r.fluxo;
  document.getElementById('geral-reg').value = r.registrados;
  document.getElementById('geral-os').value = r.os_abertas;
  document.getElementById('geral-con').value = r.concluidas;
  document.getElementById('geral-abo').value = r.abortados;
  document.getElementById('geral-pen').value = r.pendentes;
  document.getElementById('geral-rem').value = r.sol_remota;
  openModal('modalGeral');
}

function saveGeral() {
  const fluxo = document.getElementById('geral-fluxo').value.trim();
  const reg   = parseInt(document.getElementById('geral-reg').value) || 0;
  const os    = parseInt(document.getElementById('geral-os').value) || 0;
  const con   = parseInt(document.getElementById('geral-con').value) || 0;
  const abo   = parseInt(document.getElementById('geral-abo').value) || 0;
  const pen   = parseInt(document.getElementById('geral-pen').value) || 0;
  const rem   = parseInt(document.getElementById('geral-rem').value) || 0;

  if (!fluxo) { showToast('Nome do fluxo obrigatório', 'error'); return; }

  const obj = { fluxo, registrados: reg, os_abertas: os, concluidas: con, abortados: abo, pendentes: pen, sol_remota: rem };

  if (editingGeralIdx !== null) {
    adminData.relatorio_geral[editingGeralIdx] = obj;
    showToast('Fluxo atualizado!', 'success');
  } else {
    adminData.relatorio_geral.push(obj);
    showToast('Fluxo adicionado!', 'success');
  }

  saveData(adminData);
  closeModal('modalGeral');
  renderGeralTable();
}

function confirmDeleteGeral(idx) {
  const r = adminData.relatorio_geral[idx];
  if (confirm(`Excluir "${r.fluxo}"?`)) {
    adminData.relatorio_geral.splice(idx, 1);
    saveData(adminData);
    renderGeralTable();
    showToast('Fluxo excluído', 'success');
  }
}

function clearGeralForm() {
  ['geral-fluxo','geral-reg','geral-os','geral-con','geral-abo','geral-pen','geral-rem'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ═══ RESET ════════════════════════════════════════════════════════════════
function confirmReset() {
  if (confirm('⚠️ Restaurar todos os dados para os valores originais da planilha?\n\nEsta ação apagará todas as alterações salvas.')) {
    adminData = resetData();
    saveData(adminData);
    renderAtendentesTable();
    renderFluxoDetalheTable();
    renderGeralTable();
    renderPeriodo();
    showToast('✅ Dados restaurados com sucesso!', 'success');
  }
}

// ═══ MODAL ════════════════════════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Close modal clicking overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ═══ TOAST ════════════════════════════════════════════════════════════════
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className = `show ${type}`;
  setTimeout(() => t.className = '', 3000);
}

document.addEventListener('DOMContentLoaded', adminInit);
