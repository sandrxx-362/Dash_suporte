/**
 * data.js — Fonte de dados central do dashboard
 * Período: 01/05 a 31/05
 * Gerado a partir da planilha RELATORIO_MENSAL_DO_SUPORTE.xlsx
 */

const DEFAULT_DATA = {
  periodo: "01/05 a 31/05",
  atendentes: [
    {
      nome: "SANDRO",
      registrados: 335, os_abertas: 108, concluidas: 101, abortados: 5, pendentes: 3, sol_remota: 227,
      detalhes: [
        { fluxo: "SEM INTERNET", registrados: 82, os_abertas: 52, concluidas: 50, abortados: 2, pendentes: 0, sol_remota: 30 },
        { fluxo: "SEM INTERNET FILIAIS", registrados: 30, os_abertas: 25, concluidas: 24, abortados: 1, pendentes: 0, sol_remota: 5 },
        { fluxo: "LENTIDÃO", registrados: 131, os_abertas: 17, concluidas: 16, abortados: 0, pendentes: 2, sol_remota: 114 },
        { fluxo: "LENTIDÃO FILIAIS", registrados: 47, os_abertas: 8, concluidas: 8, abortados: 0, pendentes: 0, sol_remota: 39 },
        { fluxo: "TROCA DE SENHA", registrados: 40, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 39 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE", registrados: 4, os_abertas: 4, concluidas: 1, abortados: 2, pendentes: 1, sol_remota: 0 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 }
      ]
    },
    {
      nome: "JULIANE",
      registrados: 177, os_abertas: 77, concluidas: 73, abortados: 2, pendentes: 1, sol_remota: 100,
      detalhes: [
        { fluxo: "SEM INTERNET", registrados: 37, os_abertas: 26, concluidas: 25, abortados: 1, pendentes: 0, sol_remota: 11 },
        { fluxo: "SEM INTERNET FILIAIS", registrados: 33, os_abertas: 24, concluidas: 22, abortados: 1, pendentes: 0, sol_remota: 9 },
        { fluxo: "LENTIDÃO", registrados: 31, os_abertas: 13, concluidas: 13, abortados: 0, pendentes: 0, sol_remota: 18 },
        { fluxo: "LENTIDÃO FILIAIS", registrados: 32, os_abertas: 9, concluidas: 8, abortados: 0, pendentes: 1, sol_remota: 23 },
        { fluxo: "TROCA DE SENHA", registrados: 40, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 39 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE", registrados: 3, os_abertas: 3, concluidas: 3, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 }
      ]
    },
    {
      nome: "TIAGO",
      registrados: 175, os_abertas: 89, concluidas: 84, abortados: 2, pendentes: 3, sol_remota: 86,
      detalhes: [
        { fluxo: "SEM INTERNET", registrados: 54, os_abertas: 48, concluidas: 46, abortados: 2, pendentes: 0, sol_remota: 6 },
        { fluxo: "SEM INTERNET FILIAIS", registrados: 20, os_abertas: 18, concluidas: 18, abortados: 0, pendentes: 0, sol_remota: 2 },
        { fluxo: "LENTIDÃO", registrados: 31, os_abertas: 9, concluidas: 9, abortados: 0, pendentes: 0, sol_remota: 22 },
        { fluxo: "LENTIDÃO FILIAIS", registrados: 11, os_abertas: 2, concluidas: 2, abortados: 0, pendentes: 0, sol_remota: 9 },
        { fluxo: "TROCA DE SENHA", registrados: 47, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 46 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE FILIAIS", registrados: 2, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 1 },
        { fluxo: "TROCA DE EQUIPAMENTO", registrados: 6, os_abertas: 6, concluidas: 4, abortados: 0, pendentes: 2, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO", registrados: 1, os_abertas: 1, concluidas: 0, abortados: 0, pendentes: 1, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 }
      ]
    },
    {
      nome: "HYDELFRIDES",
      registrados: 207, os_abertas: 116, concluidas: 105, abortados: 3, pendentes: 8, sol_remota: 91,
      detalhes: [
        { fluxo: "SEM INTERNET", registrados: 65, os_abertas: 55, concluidas: 55, abortados: 0, pendentes: 0, sol_remota: 10 },
        { fluxo: "SEM INTERNET FILIAIS", registrados: 26, os_abertas: 22, concluidas: 22, abortados: 0, pendentes: 0, sol_remota: 4 },
        { fluxo: "LENTIDÃO", registrados: 31, os_abertas: 15, concluidas: 9, abortados: 2, pendentes: 4, sol_remota: 16 },
        { fluxo: "LENTIDÃO FILIAIS", registrados: 22, os_abertas: 12, concluidas: 9, abortados: 0, pendentes: 3, sol_remota: 10 },
        { fluxo: "TROCA DE SENHA", registrados: 54, os_abertas: 3, concluidas: 2, abortados: 1, pendentes: 0, sol_remota: 51 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE", registrados: 2, os_abertas: 2, concluidas: 2, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE FILIAIS", registrados: 4, os_abertas: 4, concluidas: 3, abortados: 0, pendentes: 1, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 }
      ]
    },
    {
      nome: "MARIO",
      registrados: 55, os_abertas: 32, concluidas: 29, abortados: 2, pendentes: 1, sol_remota: 23,
      detalhes: [
        { fluxo: "SEM INTERNET", registrados: 26, os_abertas: 18, concluidas: 16, abortados: 2, pendentes: 0, sol_remota: 8 },
        { fluxo: "SEM INTERNET FILIAIS", registrados: 8, os_abertas: 7, concluidas: 7, abortados: 0, pendentes: 0, sol_remota: 1 },
        { fluxo: "LENTIDÃO", registrados: 10, os_abertas: 4, concluidas: 4, abortados: 0, pendentes: 0, sol_remota: 6 },
        { fluxo: "LENTIDÃO FILIAIS", registrados: 2, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 2 },
        { fluxo: "TROCA DE SENHA", registrados: 5, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 5 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE", registrados: 3, os_abertas: 2, concluidas: 1, abortados: 0, pendentes: 1, sol_remota: 1 },
        { fluxo: "SERVIÇO SOLICITADO PELO CLIENTE FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "TROCA DE EQUIPAMENTO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 },
        { fluxo: "MUDANÇA DE CÔMODO FILIAIS", registrados: 0, os_abertas: 0, concluidas: 0, abortados: 0, pendentes: 0, sol_remota: 0 }
      ]
    }
  ],
  relatorio_geral: [
    { fluxo: "LENTIDÃO — MATRIZ", registrados: 234, os_abertas: 58, concluidas: 51, abortados: 2, pendentes: 5, sol_remota: 176 },
    { fluxo: "LENTIDÃO — FILIAIS", registrados: 114, os_abertas: 31, concluidas: 27, abortados: 0, pendentes: 4, sol_remota: 83 },
    { fluxo: "SEM INTERNET — MATRIZ", registrados: 267, os_abertas: 202, concluidas: 195, abortados: 7, pendentes: 0, sol_remota: 65 },
    { fluxo: "SEM INTERNET — FILIAIS", registrados: 118, os_abertas: 97, concluidas: 94, abortados: 3, pendentes: 1, sol_remota: 21 },
    { fluxo: "TROCA DE SENHA", registrados: 186, os_abertas: 6, concluidas: 5, abortados: 1, pendentes: 0, sol_remota: 180 },
    { fluxo: "SERVIÇO SOLICITADO — MATRIZ", registrados: 13, os_abertas: 12, concluidas: 8, abortados: 2, pendentes: 2, sol_remota: 1 },
    { fluxo: "SERVIÇO SOLICITADO — FILIAIS", registrados: 8, os_abertas: 7, concluidas: 6, abortados: 0, pendentes: 1, sol_remota: 1 },
    { fluxo: "TROCA DE EQUIPAMENTO — MATRIZ", registrados: 9, os_abertas: 9, concluidas: 7, abortados: 0, pendentes: 2, sol_remota: 0 },
    { fluxo: "TROCA DE EQUIPAMENTO — FILIAIS", registrados: 2, os_abertas: 2, concluidas: 2, abortados: 0, pendentes: 0, sol_remota: 0 },
    { fluxo: "MUDANÇA DE CÔMODO — MATRIZ", registrados: 2, os_abertas: 2, concluidas: 1, abortados: 0, pendentes: 1, sol_remota: 0 },
    { fluxo: "MUDANÇA DE CÔMODO — FILIAIS", registrados: 1, os_abertas: 1, concluidas: 1, abortados: 0, pendentes: 0, sol_remota: 0 }
  ]
};

// ─── Persistência com LocalStorage ─────────────────────────────────────────
const STORAGE_KEY = 'suporte_dashboard_data';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// ─── Cálculos Derivados ─────────────────────────────────────────────────────
function calcKPIs(data) {
  const total_reg = data.atendentes.reduce((s, a) => s + a.registrados, 0);
  const total_os  = data.atendentes.reduce((s, a) => s + a.os_abertas, 0);
  const total_con = data.atendentes.reduce((s, a) => s + a.concluidas, 0);
  const total_abo = data.atendentes.reduce((s, a) => s + a.abortados, 0);
  const total_pen = data.atendentes.reduce((s, a) => s + a.pendentes, 0);
  const total_rem = data.atendentes.reduce((s, a) => s + a.sol_remota, 0);
  const taxa_res  = total_reg > 0 ? ((total_con / total_reg) * 100).toFixed(1) : 0;
  const taxa_rem  = total_reg > 0 ? ((total_rem / total_reg) * 100).toFixed(1) : 0;

  // Rankings
  const mais_reg = data.atendentes.reduce((a, b) => a.registrados > b.registrados ? a : b);
  const menos_reg = data.atendentes.reduce((a, b) => a.registrados < b.registrados ? a : b);
  const melhor_taxa = data.atendentes.reduce((a, b) => {
    const ta = a.registrados > 0 ? a.concluidas / a.registrados : 0;
    const tb = b.registrados > 0 ? b.concluidas / b.registrados : 0;
    return ta > tb ? a : b;
  });
  const maior_remota = data.atendentes.reduce((a, b) => a.sol_remota > b.sol_remota ? a : b);

  return {
    total_registrados: total_reg,
    total_os, total_concluidas: total_con,
    total_abortados: total_abo, total_pendentes: total_pen,
    total_remotas: total_rem,
    taxa_resolucao: taxa_res,
    taxa_remota: taxa_rem,
    ranking_mais: mais_reg,
    ranking_menos: menos_reg,
    ranking_melhor_taxa: melhor_taxa,
    ranking_maior_remota: maior_remota
  };
}
