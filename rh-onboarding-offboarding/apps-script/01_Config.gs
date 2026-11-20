/**
 * IOM — Sistema de Onboarding & Offboarding (RH + ICT + Administração)
 * ------------------------------------------------------------------
 * Ficheiro de configuração.
 *
 * ⚠️  ANTES de correr setup():
 *   1. Altere os emails dos aprovadores (ICT_APPROVER_EMAIL, ADMIN_APPROVER_EMAIL, HR_NOTIFY_EMAIL).
 *   2. Reveja a lista de departamentos (DEPARTMENTS).
 *
 * Nada mais precisa de ser mudado nos outros ficheiros.
 */

const CONFIG = {
  ORG_NAME: 'IOM',

  FORM_TITLE: 'IOM — Formulário de Onboarding & Offboarding de Colaboradores',
  SHEET_TITLE: 'IOM — Onboarding & Offboarding (Respostas)',

  // --- Aprovadores (ALTERE ESTES VALORES) ---------------------------------
  ICT_APPROVER_EMAIL: 'ict.approver@iom.int',      // Aprova pedidos de Laptop
  ADMIN_APPROVER_EMAIL: 'admin.approver@iom.int',  // Aprova pedidos de Celular + SIM Card
  HR_NOTIFY_EMAIL: 'hr@iom.int',                    // Recebe cópia de cada submissão e decisão

  // --- Departamentos (dropdown no formulário) -----------------------------
  DEPARTMENTS: [
    'Resources Management',
    'Information & Communications Technology (ICT)',
    'Programmes / Projects',
    'Operations',
    'Procurement & Logistics',
    'Human Resources',
    'Finance',
    'Administration',
    'Migration Health',
    'Outro',
  ],

  // Cor usada nos cabeçalhos do email/página de confirmação
  BRAND_COLOR: '#0033A0', // azul IOM
};

/**
 * Títulos das perguntas do formulário.
 * São usados tanto para CRIAR o formulário como para LER as respostas,
 * por isso têm de ser idênticos nos dois sítios — mude-os só aqui.
 */
const Q = {
  PROCESS_TYPE:          'Tipo de Processo',
  // ---- Recursos Humanos (RH) ----
  FIRST_NAME:            'Nome',
  LAST_NAME:             'Apelido',
  GENDER:                'Sexo',
  DOB:                   'Data de Nascimento',
  PERSONAL_EMAIL:        'Email Pessoal',
  CONTRACT_START:        'Data de Início do Contrato',
  CONTRACT_END:          'Data de Término do Contrato',
  CONTRACT_ID:           'ID do Contrato',
  MANAGER:               'Manager',
  DEPARTMENT:            'Departamento',
  REMARKS:               'Remarks',
  // ---- ICT ----
  LAPTOP_NEEDED:         'Necessita de alocação / devolução de Laptop?',
  LAPTOP_TYPE:           'Tipo / Especificações do Laptop',
  LAPTOP_JUSTIFICATION:  'Justificação do pedido',
  // ---- Administração ----
  PHONE_NEEDED:          'Necessita de alocação / devolução de Celular?',
  SIM_NEEDED:            'Necessita de SIM Card?',
  PHONE_NOTES:           'Observações (Celular / SIM Card)',
};

/** Cabeçalhos das colunas de aprovação acrescentadas ao Sheet. */
const COLS = {
  ICT_STATUS:        'ICT · Estado',
  ICT_APPROVER:      'ICT · Decisor',
  ICT_DECISION_DATE: 'ICT · Data da Decisão',
  ICT_COMMENT:       'ICT · Comentário',
  ADM_STATUS:        'ADM · Estado',
  ADM_APPROVER:      'ADM · Decisor',
  ADM_DECISION_DATE: 'ADM · Data da Decisão',
  ADM_COMMENT:       'ADM · Comentário',
};

/** Estados possíveis de aprovação. */
const STATUS = {
  PENDING:  'PENDENTE',
  APPROVED: 'APROVADO',
  REJECTED: 'REJEITADO',
  NA:       'N/A',
};

/** Chaves usadas em PropertiesService (não mexer). */
const PROP = {
  FORM_ID:   'FORM_ID',
  SHEET_ID:  'SHEET_ID',
  SECRET:    'HMAC_SECRET',
};
