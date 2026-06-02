/**
 * dashboard.js — Lógica principal do dashboard
 * Renderiza KPIs, gráficos e tabelas a partir de data.js
 */

// ─── Paleta de cores por atendente ─────────────────────────────────────────
const COLORS = {
  SANDRO:     '#00c8d4',
  JULIANE:    '#a78bfa',
  TIAGO:      '#00e5cc',
  HYDELFRIDES:'#ffb547',
  MARIO:      '#ff4d6d'
};

// Config padrão do Chart.js
Chart.defaults.color = '#8fa3c8';
Chart.defaults.borderColor = '#1e2e50';
Chart.defaults.font.family = "'DM Sans', sans-serif";

const charts = {};
let currentFilter = 'TODOS';
let currentData = null;

// ─── Init ───────────────────────────────────────────────────────────────────
function init() {
  currentData = loadData();
  renderAll();

  // Navegação
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.dataset.section;
      navigateTo(sec);
    });
  });

  // Hamburger
  const ham = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (ham) {
    ham.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Filtro de atendente
  document.querySelectorAll('.filter-btn[data-atendente]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.atendente;
      document.querySelectorAll('.filter-btn[data-atendente]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFluxoSection();
    });
  });
}

function navigateTo(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + sec)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll(`.nav-item[data-section="${sec}"]`).forEach(n => n.classList.add('active'));

  const titles = {
    overview: 'Visão Geral',
    atendentes: 'Por Atendente',
    fluxos: 'Por Fluxo / Tópico',
    insights: 'Insights & Rankings'
  };
  document.getElementById('topbarTitle').textContent = titles[sec] || 'Dashboard';
}

// ─── Render All ─────────────────────────────────────────────────────────────
function renderAll() {
  renderKPIs();
  renderOverviewCharts();
  renderAtendentesSection();
  renderFluxoSection();
  renderInsights();
}

// ─── KPIs ────────────────────────────────────────────────────────────────────
function renderKPIs() {
  const kpis = calcKPIs(currentData);
  const taxa = parseFloat(kpis.taxa_resolucao);
  const taxa_rem = parseFloat(kpis.taxa_remota);

  setKPI('kpi-registrados', kpis.total_registrados, `${kpis.atendentes?.length || currentData.atendentes.length} atendentes`);
  setKPI('kpi-os', kpis.total_os, `${((kpis.total_os/kpis.total_registrados)*100).toFixed(1)}% geraram OS`);
  setKPI('kpi-concluidas', kpis.total_concluidas, `Taxa: ${taxa}%`);
  setKPI('kpi-abortados', kpis.total_abortados, `${((kpis.total_abortados/kpis.total_registrados)*100).toFixed(1)}% do total`);
  setKPI('kpi-pendentes', kpis.total_pendentes, `Requer atenção`);
  setKPI('kpi-remotas', kpis.total_remotas, `${taxa_rem}% do total`);
}

function setKPI(id, value, sub) {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = el.querySelector('.kpi-value');
  const subEl = el.querySelector('.kpi-sub');
  if (valEl) animateNumber(valEl, parseInt(value) || 0);
  if (subEl) subEl.textContent = sub;
}

function animateNumber(el, target) {
  const start = 0;
  const duration = 800;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── Overview Charts ────────────────────────────────────────────────────────
function renderOverviewCharts() {
  const data = currentData;
  const names = data.atendentes.map(a => a.nome);
  const colors = names.map(n => COLORS[n] || '#00c8d4');

  // 1. Registros por Atendente (bar)
  destroyChart('chartAtendentes');
  charts['chartAtendentes'] = new Chart(ctx('chartAtendentes'), {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        {
          label: 'Registrados',
          data: data.atendentes.map(a => a.registrados),
          backgroundColor: colors.map(c => c + '33'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Concluídas',
          data: data.atendentes.map(a => a.concluidas),
          backgroundColor: colors.map(c => c + '88'),
          borderColor: colors,
          borderWidth: 0,
          borderRadius: 6,
        }
      ]
    },
    options: chartOpts({
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 16 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#1e2e5066' }, beginAtZero: true }
      }
    })
  });

  // 2. Distribuição por tipo de fluxo (doughnut)
  const rg = data.relatorio_geral;
  const fluxosMap = {};
  rg.forEach(r => {
    const base = r.fluxo.split('—')[0].trim();
    fluxosMap[base] = (fluxosMap[base] || 0) + r.registrados;
  });
  const fluxLabels = Object.keys(fluxosMap);
  const fluxVals = fluxLabels.map(k => fluxosMap[k]);
  const dColors = ['#00c8d4','#a78bfa','#00e5cc','#ffb547','#ff4d6d','#00d97e'];

  destroyChart('chartFluxos');
  charts['chartFluxos'] = new Chart(ctx('chartFluxos'), {
    type: 'doughnut',
    data: {
      labels: fluxLabels.map(f => f.length > 22 ? f.slice(0,22)+'…' : f),
      datasets: [{
        data: fluxVals,
        backgroundColor: dColors,
        borderColor: '#0d1526',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } },
        tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw} (${((c.raw/fluxVals.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)` } }
      }
    }
  });

  // 3. Status geral stacked bar
  const kpis = calcKPIs(data);
  destroyChart('chartStatus');
  charts['chartStatus'] = new Chart(ctx('chartStatus'), {
    type: 'bar',
    data: {
      labels: ['Total Geral'],
      datasets: [
        { label: 'Concluídas', data: [kpis.total_concluidas], backgroundColor: '#00d97e', borderRadius: 4 },
        { label: 'Remotas (sem OS)', data: [kpis.total_remotas], backgroundColor: '#00c8d4', borderRadius: 4 },
        { label: 'Pendentes', data: [kpis.total_pendentes], backgroundColor: '#ffb547', borderRadius: 4 },
        { label: 'Abortados', data: [kpis.total_abortados], backgroundColor: '#ff4d6d', borderRadius: 4 }
      ]
    },
    options: chartOpts({
      indexAxis: 'y',
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 14 } } },
      scales: {
        x: { stacked: true, grid: { color: '#1e2e5066' }, beginAtZero: true },
        y: { stacked: true, grid: { display: false } }
      }
    })
  });

  // 4. Matriz vs Filiais
  const matrizFluxos = ['LENTIDÃO — MATRIZ','SEM INTERNET — MATRIZ','SERVIÇO SOLICITADO — MATRIZ','TROCA DE EQUIPAMENTO — MATRIZ','MUDANÇA DE CÔMODO — MATRIZ'];
  const filiaisFluxos = ['LENTIDÃO — FILIAIS','SEM INTERNET — FILIAIS','SERVIÇO SOLICITADO — FILIAIS','TROCA DE EQUIPAMENTO — FILIAIS','MUDANÇA DE CÔMODO — FILIAIS'];

  const totMatriz = rg.filter(r => matrizFluxos.includes(r.fluxo)).reduce((s,r) => s + r.registrados, 0);
  const totFiliais = rg.filter(r => filiaisFluxos.includes(r.fluxo)).reduce((s,r) => s + r.registrados, 0);
  const totSenha = rg.find(r => r.fluxo === 'TROCA DE SENHA')?.registrados || 0;

  destroyChart('chartMatriz');
  charts['chartMatriz'] = new Chart(ctx('chartMatriz'), {
    type: 'pie',
    data: {
      labels: ['Matriz', 'Filiais', 'Troca de Senha'],
      datasets: [{
        data: [totMatriz, totFiliais, totSenha],
        backgroundColor: ['#00c8d4','#a78bfa','#ffb547'],
        borderColor: '#0d1526', borderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 14 } },
        tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw}` } }
      }
    }
  });

  // Tabela resumo
  renderResumoTable();
}

function renderResumoTable() {
  const tbody = document.getElementById('resumoTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  currentData.relatorio_geral.forEach(r => {
    const taxa = r.registrados > 0 ? ((r.concluidas / r.registrados) * 100).toFixed(0) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.fluxo}</td>
      <td class="num-col">${r.registrados}</td>
      <td class="num-col">${r.os_abertas}</td>
      <td class="num-col">${r.concluidas}</td>
      <td class="num-col"><span class="badge-pill badge-red">${r.abortados}</span></td>
      <td class="num-col"><span class="badge-pill badge-amber">${r.pendentes}</span></td>
      <td class="num-col">${r.sol_remota}</td>
      <td>
        <div class="bar-wrap">
          <div class="bar-track"><div class="bar-fill" style="width:${taxa}%;background:${taxa>=80?'var(--green)':taxa>=50?'var(--amber)':'var(--red)'}"></div></div>
          <span style="font-size:11px;color:var(--txt-2);min-width:32px">${taxa}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Total
  const kpis = calcKPIs(currentData);
  const tr = document.createElement('tr');
  tr.style.fontWeight = '600';
  tr.innerHTML = `
    <td style="color:var(--txt-1)">TOTAL GERAL</td>
    <td class="num-col" style="color:var(--cyan)">${kpis.total_registrados}</td>
    <td class="num-col">${kpis.total_os}</td>
    <td class="num-col">${kpis.total_concluidas}</td>
    <td class="num-col"><span class="badge-pill badge-red">${kpis.total_abortados}</span></td>
    <td class="num-col"><span class="badge-pill badge-amber">${kpis.total_pendentes}</span></td>
    <td class="num-col">${kpis.total_remotas}</td>
    <td><span style="color:var(--cyan)">${kpis.taxa_resolucao}%</span></td>
  `;
  tbody.appendChild(tr);
}

// ─── Atendentes Section ──────────────────────────────────────────────────────
function renderAtendentesSection() {
  const container = document.getElementById('atendenteCards');
  if (!container) return;
  container.innerHTML = '';

  currentData.atendentes.forEach((a, i) => {
    const color = COLORS[a.nome] || '#00c8d4';
    const taxa = a.registrados > 0 ? ((a.concluidas / a.registrados) * 100).toFixed(1) : 0;
    const initial = a.nome[0];
    const div = document.createElement('div');
    div.className = 'atendente-card';
    div.style.setProperty('--color', color);
    div.dataset.idx = i;
    div.innerHTML = `
      <div class="atendente-avatar">${initial}</div>
      <div class="atendente-name">${a.nome}</div>
      <div class="atendente-stats">
        <div class="stat-row"><span class="stat-label">Registrados</span><span class="stat-val hi">${a.registrados}</span></div>
        <div class="stat-row"><span class="stat-label">OS Abertas</span><span class="stat-val">${a.os_abertas}</span></div>
        <div class="stat-row"><span class="stat-label">Concluídas</span><span class="stat-val">${a.concluidas}</span></div>
        <div class="stat-row"><span class="stat-label">Taxa</span><span class="stat-val">${taxa}%</span></div>
        <div class="stat-row"><span class="stat-label">Remotas</span><span class="stat-val">${a.sol_remota}</span></div>
      </div>
    `;
    div.addEventListener('click', () => selectAtendente(i));
    container.appendChild(div);
  });

  renderAtendenteChart();
  renderAtendenteTable(0);
  selectAtendente(0);
}

function selectAtendente(idx) {
  document.querySelectorAll('.atendente-card').forEach((c, i) => {
    c.classList.toggle('selected', i === idx);
  });
  renderAtendenteChart(idx);
  renderAtendenteTable(idx);
}

function renderAtendenteChart(idx) {
  // Radar de todos os atendentes
  const data = currentData;
  const names = data.atendentes.map(a => a.nome);
  const colors = names.map(n => COLORS[n] || '#00c8d4');

  destroyChart('chartAtendenteRadar');
  charts['chartAtendenteRadar'] = new Chart(ctx('chartAtendenteRadar'), {
    type: 'radar',
    data: {
      labels: ['Registrados', 'OS Abertas', 'Concluídas', 'Remotas', 'Pendentes'],
      datasets: data.atendentes.map((a, i) => ({
        label: a.nome,
        data: [a.registrados, a.os_abertas, a.concluidas, a.sol_remota, a.pendentes],
        borderColor: colors[i],
        backgroundColor: colors[i] + '22',
        borderWidth: 2,
        pointBackgroundColor: colors[i],
        pointRadius: 3
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { boxWidth: 8, padding: 12, font: { size: 11 } } } },
      scales: {
        r: {
          grid: { color: '#1e2e50' },
          angleLines: { color: '#1e2e50' },
          ticks: { backdropColor: 'transparent', font: { size: 10 } },
          beginAtZero: true
        }
      }
    }
  });

  // Taxa de resolução por atendente
  destroyChart('chartAtendenteTaxa');
  charts['chartAtendenteTaxa'] = new Chart(ctx('chartAtendenteTaxa'), {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Taxa Resolução %',
        data: data.atendentes.map(a => a.registrados > 0 ? +((a.concluidas/a.registrados)*100).toFixed(1) : 0),
        backgroundColor: colors.map(c => c + 'aa'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: chartOpts({
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { max: 100, grid: { color: '#1e2e5066' }, ticks: { callback: v => v + '%' } }
      }
    })
  });
}

function renderAtendenteTable(idx) {
  const a = currentData.atendentes[idx];
  if (!a) return;
  const tbody = document.getElementById('atendenteTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  a.detalhes.forEach(d => {
    const taxa = d.registrados > 0 ? ((d.concluidas / d.registrados) * 100).toFixed(0) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.fluxo}</td>
      <td class="num-col">${d.registrados}</td>
      <td class="num-col">${d.os_abertas}</td>
      <td class="num-col">${d.concluidas}</td>
      <td class="num-col">${d.abortados}</td>
      <td class="num-col">${d.pendentes}</td>
      <td class="num-col">${d.sol_remota}</td>
      <td>
        <div class="bar-wrap">
          <div class="bar-track"><div class="bar-fill" style="width:${taxa}%"></div></div>
          <span style="font-size:11px;color:var(--txt-2)">${taxa}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('atendenteTableTitle').textContent = `Detalhamento — ${a.nome}`;
}

// ─── Fluxos Section ──────────────────────────────────────────────────────────
function renderFluxoSection() {
  const data = currentData;
  let source = data.relatorio_geral;

  if (currentFilter !== 'TODOS') {
    const atendente = data.atendentes.find(a => a.nome === currentFilter);
    if (atendente) {
      // Rebuild relatorio_geral style from atendente detalhes
      source = atendente.detalhes.map(d => ({
        fluxo: d.fluxo.replace(' FILIAIS', ' — FILIAIS').replace(/^(?!.*FILIAIS)(.*)$/, '$1 — MATRIZ'),
        ...d
      }));
    }
  }

  // Horizontal bar — registrados por fluxo
  const labels = data.relatorio_geral.map(r => r.fluxo.replace('—', '-'));
  let vals;
  if (currentFilter === 'TODOS') {
    vals = data.relatorio_geral.map(r => r.registrados);
  } else {
    const at = data.atendentes.find(a => a.nome === currentFilter);
    // sum by base fluxo
    vals = data.relatorio_geral.map(r => {
      if (!at) return 0;
      const base = r.fluxo.replace(' — MATRIZ','').replace(' — FILIAIS',' FILIAIS').replace('TROCA DE SENHA','TROCA DE SENHA');
      const found = at.detalhes.find(d => {
        if (r.fluxo.includes('FILIAIS')) return d.fluxo.includes('FILIAIS') && d.fluxo.includes(base.split(' FILIAIS')[0].trim());
        return !d.fluxo.includes('FILIAIS') && d.fluxo.replace('—','').trim() === base.trim();
      });
      return found ? found.registrados : 0;
    });
  }

  const barColors = vals.map(v => `rgba(0,200,212,${Math.max(0.3, v/Math.max(...vals))})`);

  destroyChart('chartFluxoHbar');
  charts['chartFluxoHbar'] = new Chart(ctx('chartFluxoHbar'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Registrados',
        data: vals,
        backgroundColor: barColors,
        borderColor: '#00c8d4',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: chartOpts({
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#1e2e5066' }, beginAtZero: true },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    })
  });

  // Stacked: concluidas vs remotas vs pendentes
  const rgData = data.relatorio_geral;
  destroyChart('chartFluxoStack');
  charts['chartFluxoStack'] = new Chart(ctx('chartFluxoStack'), {
    type: 'bar',
    data: {
      labels: rgData.map(r => r.fluxo.replace(' — ','—').replace('TROCA DE SENHA','SENHA').replace('MUDANÇA DE','MUD.')),
      datasets: [
        { label: 'Concluídas', data: rgData.map(r => r.concluidas), backgroundColor: '#00d97eaa', borderRadius: 4 },
        { label: 'Remotas', data: rgData.map(r => r.sol_remota), backgroundColor: '#00c8d4aa', borderRadius: 4 },
        { label: 'Pendentes', data: rgData.map(r => r.pendentes), backgroundColor: '#ffb547aa', borderRadius: 4 },
        { label: 'Abortados', data: rgData.map(r => r.abortados), backgroundColor: '#ff4d6daa', borderRadius: 4 }
      ]
    },
    options: chartOpts({
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 12 } } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { stacked: true, grid: { color: '#1e2e5066' } }
      }
    })
  });
}

// ─── Insights ───────────────────────────────────────────────────────────────
function renderInsights() {
  const kpis = calcKPIs(currentData);
  const data = currentData;

  // Ranking cards
  setEl('rank-mais-reg', `🥇 ${kpis.ranking_mais.nome}`, `${kpis.ranking_mais.registrados} atendimentos`);
  setEl('rank-menos-reg', `📉 ${kpis.ranking_menos.nome}`, `${kpis.ranking_menos.registrados} atendimentos`);

  const mTaxa = kpis.ranking_melhor_taxa;
  const tx = mTaxa.registrados > 0 ? ((mTaxa.concluidas/mTaxa.registrados)*100).toFixed(1) : 0;
  setEl('rank-melhor-taxa', `⭐ ${mTaxa.nome}`, `${tx}% taxa resolução`);
  setEl('rank-remota', `📡 ${kpis.ranking_maior_remota.nome}`, `${kpis.ranking_maior_remota.sol_remota} remotas`);

  // Fluxo mais freq
  const topFluxo = data.relatorio_geral.reduce((a,b) => a.registrados > b.registrados ? a : b);
  setEl('rank-top-fluxo', `🔥 ${topFluxo.fluxo}`, `${topFluxo.registrados} atendimentos`);

  // Insights texts
  document.getElementById('insight-perfil').innerHTML = `<strong>${kpis.taxa_remota}%</strong> dos atendimentos foram resolvidos remotamente sem necessidade de OS. Total: ${kpis.total_remotas} soluções remotas.`;
  document.getElementById('insight-gargalo').innerHTML = `Lentidão representa <strong>348 registros</strong> com alta resolução remota (74%). Oportunidade de automação para reduzir OS.`;
  document.getElementById('insight-eficiencia').innerHTML = `Taxa de conclusão geral: <strong>${kpis.taxa_resolucao}%</strong>. Troca de Senha: 97% resolvida remotamente — fluxo mais eficiente.`;
  document.getElementById('insight-internet').innerHTML = `SEM INTERNET é o tópico mais crítico com <strong>385 atendimentos</strong> (Matriz + Filiais), representando ${((385/kpis.total_registrados)*100).toFixed(1)}% do volume total.`;
  document.getElementById('insight-volume').innerHTML = `Matriz: <strong>525</strong> atend. | Filiais: <strong>243</strong> atend. | Troca de Senha: <strong>186</strong> — Matriz concentra ${((525/kpis.total_registrados)*100).toFixed(1)}% do volume.`;
  document.getElementById('insight-top-atend').innerHTML = `SANDRO lidera com <strong>335 registros</strong> e 227 soluções remotas. HYDELFRIDES tem maior pendência: 8 casos em aberto.`;

  // Chart comparativo atendentes
  const names = data.atendentes.map(a => a.nome);
  const cols = names.map(n => COLORS[n] || '#00c8d4');

  destroyChart('chartInsightComp');
  charts['chartInsightComp'] = new Chart(ctx('chartInsightComp'), {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        { label: 'Registrados', data: data.atendentes.map(a => a.registrados), backgroundColor: '#ffffff15', borderColor: '#ffffff33', borderWidth: 1, borderRadius: 4 },
        { label: 'Concluídas', data: data.atendentes.map(a => a.concluidas), backgroundColor: cols.map(c => c + '99'), borderColor: cols, borderWidth: 0, borderRadius: 4 },
        { label: 'Sol. Remota', data: data.atendentes.map(a => a.sol_remota), backgroundColor: '#00c8d422', borderColor: '#00c8d4', borderWidth: 1, borderRadius: 4 }
      ]
    },
    options: chartOpts({
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 14 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#1e2e5066' }, beginAtZero: true }
      }
    })
  });

  // Pendentes vs abortados
  destroyChart('chartInsightProblemas');
  charts['chartInsightProblemas'] = new Chart(ctx('chartInsightProblemas'), {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        { label: 'Pendentes', data: data.atendentes.map(a => a.pendentes), backgroundColor: '#ffb54788', borderColor: '#ffb547', borderWidth: 2, borderRadius: 6 },
        { label: 'Abortados', data: data.atendentes.map(a => a.abortados), backgroundColor: '#ff4d6d44', borderColor: '#ff4d6d', borderWidth: 2, borderRadius: 6 }
      ]
    },
    options: chartOpts({
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 14 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#1e2e5066' }, beginAtZero: true }
      }
    })
  });
}

function setEl(id, title, sub) {
  const el = document.getElementById(id);
  if (!el) return;
  const h = el.querySelector('h4');
  const p = el.querySelector('p');
  if (h) h.textContent = title;
  if (p) p.textContent = sub;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ctx(id) { return document.getElementById(id)?.getContext('2d'); }

function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

function chartOpts(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0d1526', borderColor: '#1e2e50', borderWidth: 1, padding: 10 },
      ...extra.plugins
    },
    ...extra
  };
}

// ─── Reload quando dados mudam ────────────────────────────────────────────────
window.addEventListener('storage', (e) => {
  if (e.key === 'suporte_dashboard_data') {
    currentData = loadData();
    renderAll();
  }
});

document.addEventListener('DOMContentLoaded', init);
