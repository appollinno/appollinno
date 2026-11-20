# IOM — Sistema de Onboarding & Offboarding (RH + ICT + Administração)

Sistema de **Onboarding e Offboarding** de colaboradores construído sobre **Google Forms + Google Sheets**, com **fluxo de aprovação** (ICT para Laptop e Administração para Celular + SIM Card), implementado como **Infrastructure-as-Code** em **Google Apps Script**.

Um único script cria o formulário, a folha de cálculo ligada, as colunas de aprovação e todo o workflow de notificações por email. Reproduzível, versionável e sem servidores a gerir.

---

## Porquê Apps Script (e não só um Form + Sheet)?

Um Google Form sozinho **não faz aprovações**. Precisamos de lógica no lado do servidor para:

- marcar cada pedido como `PENDENTE / APROVADO / REJEITADO`;
- enviar emails de aprovação ao **ICT** (Laptop) e à **Administração** (Celular + SIM);
- registar quem decidiu, quando e com que comentário;
- notificar o requisitante e o RH da decisão.

Google Apps Script faz tudo isto de forma nativa, gratuita e integrada no Google Workspace.

---

## Arquitetura

```
  Colaborador / RH
        │ preenche
        ▼
  ┌───────────────┐   onFormSubmit    ┌────────────────────┐
  │  Google Form  │ ────────────────► │  Apps Script        │
  │  (3 secções)  │                   │  (FormHandler)      │
  └───────┬───────┘                   └─────────┬──────────┘
          │ respostas                           │ decide aprovações
          ▼                                      ▼
  ┌───────────────┐                   ┌────────────────────┐
  │ Google Sheet  │ ◄──── estados ────│  Email (MailApp)    │
  │ + colunas de  │                   │  → ICT  (Laptop)    │
  │   aprovação   │                   │  → ADM  (Cel+SIM)   │
  └───────────────┘                   └─────────┬──────────┘
          ▲                                      │ clica Aprovar/Rejeitar
          │  grava decisão                       ▼
          └──────────────────────────  Web App (doGet/doPost)
                                        (token HMAC + confirmação)
```

Ficheiros (`apps-script/`):

| Ficheiro | Papel |
|----------|-------|
| `01_Config.gs` | **Único ficheiro a editar**: emails dos aprovadores, departamentos, títulos dos campos |
| `02_Setup.gs` | `setup()` cria Form + Sheet + colunas + triggers; `reset()`, `printUrls()` |
| `03_FormHandler.gs` | `onFormSubmit` — decide que aprovações enviar |
| `04_Approval.gs` | Web App `doGet`/`doPost` + token HMAC |
| `05_Email.gs` | Emails de pedido e de decisão |
| `06_SheetUtils.gs` | Utilitários da folha + formatação condicional |
| `07_Menu.gs` | Menu de apoio dentro do Sheet |
| `appsscript.json` | Manifesto (scopes, timezone, Web App) |

Campos completos: ver [`docs/fields.md`](docs/fields.md).

---

## Instalação

### Passo 1 — Editar a configuração
Em `apps-script/01_Config.gs`, altere pelo menos:
```js
ICT_APPROVER_EMAIL:   'ict.approver@iom.int',
ADMIN_APPROVER_EMAIL: 'admin.approver@iom.int',
HR_NOTIFY_EMAIL:      'hr@iom.int',
```

### Passo 2 — Carregar o código

**Opção A — Manual (mais rápido)**
1. Vá a <https://script.google.com> → **Novo projeto**.
2. Crie um ficheiro por cada `.gs` desta pasta e copie o conteúdo.
3. Em **Definições do projeto ⚙️**, ative *"Mostrar ficheiro de manifesto `appsscript.json`"* e cole o manifesto.

**Opção B — CLI com `clasp` (estilo DevOps)**
```bash
npm install -g @google/clasp
clasp login
clasp create --title "IOM Onboarding Offboarding" --type standalone
# copie o scriptId gerado para .clasp.json (ver .clasp.json.example)
clasp push
```

### Passo 3 — Provisionar
No editor do Apps Script, selecione a função **`setup`** e clique **Executar**.
Autorize os âmbitos quando pedido. No fim, abra **Ver → Registos** para obter os URLs do Form e do Sheet.

### Passo 4 — Publicar o Web App (ativa os botões Aprovar/Rejeitar)
**Implementar → Nova implementação → tipo "Aplicação Web"**
- *Executar como:* **Eu**
- *Quem tem acesso:* **Qualquer pessoa** (os links são protegidos por token HMAC)
  — se os aprovadores forem todos do domínio Workspace, pode restringir a *"Qualquer pessoa na organização"*.

Clique **Implementar** e copie o URL. Depois corra `printUrls()` para confirmar que o Web App está ligado.

> Sempre que alterar o código, faça **Gerir implementações → Editar → Nova versão** para que o Web App use a versão nova.

---

## Como funciona o fluxo de aprovação

1. Alguém submete o formulário.
2. `onFormSubmit` marca `ICT · Estado` e/ou `ADM · Estado` como `PENDENTE` (ou `N/A`).
3. São enviados emails só às secções pedidas (ex.: se não pediu celular, a Administração não é incomodada).
4. O aprovador clica **Aprovar/Rejeitar** → abre uma **página de confirmação** (com caixa de comentário).
5. Ao confirmar, a decisão é gravada no Sheet (cor verde/vermelha) e o requisitante + RH são notificados.

### Segurança
- Cada link é assinado com **HMAC-SHA256** (segredo aleatório guardado em *Script Properties*). Links não podem ser forjados nem reaproveitados entre pedidos/ações.
- A ação só é aplicada no **POST** (após clique no botão), evitando aprovações acidentais por pré-carregamento de links em clientes de email.
- `LockService` evita decisões em duplicado.
- Cada pedido só pode ser decidido **uma vez** (ignora cliques posteriores).

---

## Personalização rápida
- **Departamentos:** `CONFIG.DEPARTMENTS`.
- **Textos dos campos:** objeto `Q` em `01_Config.gs` (mude só aqui — vale para criação e leitura).
- **Recriar tudo do zero:** correr `reset()` e depois `setup()`.
- **Reenviar aprovações pendentes:** menu *"IOM RH"* dentro da folha de cálculo.

---

## Limitações conhecidas
- Quotas gratuitas do Apps Script: ~100 emails/dia (conta normal) ou ~1.500/dia (Workspace). Ver [quotas](https://developers.google.com/apps-script/guides/services/quotas).
- Os campos de detalhe de Laptop/Celular são opcionais (o Forms não torna campos obrigatórios condicionalmente sem lógica de secções). A obrigatoriedade efetiva é garantida pela pergunta "Necessita…? (Sim/Não)".
