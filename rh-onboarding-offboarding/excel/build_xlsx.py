#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o workbook IOM — Onboarding & Offboarding (RH + ICT + Administração)."""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter
from datetime import date

OUT = "/home/user/appollinno/rh-onboarding-offboarding/excel/IOM_Onboarding_Offboarding.xlsx"

# ---- Paleta ---------------------------------------------------------------
IOM_BLUE   = "0033A0"
RH_BLUE    = "1F4E96"
ICT_BLUE   = "2E6DA4"
ADM_BLUE   = "3C7D5A"   # verde-azulado p/ distinguir a secção Admin
HDR_LIGHT  = "DCE6F1"
EX_FILL    = "FFF9E6"   # fundo do exemplo
GREY       = "808080"

WHITE = "FFFFFF"
FONT  = "Arial"

thin = Side(style="thin", color="BFBFBF")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

def fill(c): return PatternFill("solid", fgColor=c)

DATA_FIRST = 3        # primeira linha de dados (também a linha-exemplo)
DATA_LAST  = 202      # 200 linhas de dados

# ---- Definição das colunas ------------------------------------------------
# (cabeçalho, largura, secção, tipo)   tipo: text|date|email|note
COLS = [
    ("Nº",                              6,  "GERAL", "num"),
    ("Tipo de Processo",                18, "GERAL", "proc"),
    # RH
    ("Nome",                            16, "RH", "text"),
    ("Apelido",                         16, "RH", "text"),
    ("Sexo",                            14, "RH", "sexo"),
    ("Data de Nascimento",              18, "RH", "date"),
    ("Email Pessoal",                   26, "RH", "email"),
    ("Data Início do Contrato",         20, "RH", "date"),
    ("Data Término do Contrato",        20, "RH", "date"),
    ("ID do Contrato",                  16, "RH", "text"),
    ("Manager",                         18, "RH", "text"),
    ("Departamento",                    28, "RH", "dept"),
    ("Remarks",                         30, "RH", "text"),
    # ICT
    ("Necessita Laptop?",               16, "ICT", "simnao"),
    ("Tipo / Especificações Laptop",    26, "ICT", "text"),
    ("Justificação do Pedido",          28, "ICT", "text"),
    ("ICT · Estado",                    16, "ICT", "estado"),
    ("ICT · Aprovador (IOM)",           22, "ICT", "text"),
    ("ICT · Data da Decisão",           18, "ICT", "date"),
    ("ICT · Comentário",                26, "ICT", "text"),
    # ADMIN
    ("Necessita Celular?",              16, "ADM", "simnao"),
    ("Necessita SIM Card?",             16, "ADM", "simnao"),
    ("Plano / Observações",             26, "ADM", "text"),
    ("ADM · Estado",                    16, "ADM", "estado"),
    ("ADM · Aprovador",                 22, "ADM", "text"),
    ("ADM · Data da Decisão",           18, "ADM", "date"),
    ("ADM · Comentário",                26, "ADM", "text"),
]

SECTIONS = [
    ("GERAL", IOM_BLUE,  "GERAL"),
    ("RECURSOS HUMANOS (RH)", RH_BLUE, "RH"),
    ("ICT — ALOCAÇÃO DE LAPTOP  (Aprovação pelo IOM)", ICT_BLUE, "ICT"),
    ("ADMINISTRAÇÃO — CELULAR + SIM CARD  (Aprovação)", ADM_BLUE, "ADM"),
]

EXAMPLE = {
    "Nº": 1,
    "Tipo de Processo": "Onboarding",
    "Nome": "Ana", "Apelido": "Matavele", "Sexo": "Feminino",
    "Data de Nascimento": date(1994, 3, 12),
    "Email Pessoal": "ana.matavele@email.com",
    "Data Início do Contrato": date(2026, 1, 6),
    "Data Término do Contrato": date(2026, 12, 31),
    "ID do Contrato": "IOM-MZ-2026-0137",
    "Manager": "João Cossa", "Departamento": "Programmes / Projects",
    "Remarks": "Substituição de colaborador.",
    "Necessita Laptop?": "Sim",
    "Tipo / Especificações Laptop": "Laptop standard (i5/16GB)",
    "Justificação do Pedido": "Função administrativa com acesso a sistemas internos.",
    "ICT · Estado": "Pendente", "ICT · Aprovador (IOM)": "",
    "ICT · Data da Decisão": "", "ICT · Comentário": "",
    "Necessita Celular?": "Sim", "Necessita SIM Card?": "Sim",
    "Plano / Observações": "Plano corporativo de voz + dados.",
    "ADM · Estado": "Pendente", "ADM · Aprovador": "",
    "ADM · Data da Decisão": "", "ADM · Comentário": "",
}

# ---- Listas de validação --------------------------------------------------
LISTAS = {
    "A": ("Tipo de Processo", ["Onboarding", "Offboarding"]),
    "B": ("Sexo", ["Masculino", "Feminino", "Outro", "Prefiro não indicar"]),
    "C": ("Sim/Não", ["Sim", "Não"]),
    "D": ("Estado de Aprovação", ["Pendente", "Aprovado", "Rejeitado", "N/A"]),
    "E": ("Departamento", [
        "Resources Management", "Information & Communications Technology (ICT)",
        "Programmes / Projects", "Operations", "Procurement & Logistics",
        "Human Resources", "Finance", "Administration", "Migration Health", "Outro",
    ]),
}

wb = Workbook()

# ===========================================================================
# Folha: Listas
# ===========================================================================
wl = wb.active
wl.title = "Listas"
wl.sheet_properties.tabColor = GREY
for col, (titulo, valores) in LISTAS.items():
    c = wl[f"{col}1"]; c.value = titulo
    c.font = Font(name=FONT, bold=True, color=WHITE); c.fill = fill(IOM_BLUE)
    c.alignment = Alignment(horizontal="center")
    for i, v in enumerate(valores, start=2):
        wl[f"{col}{i}"].value = v
        wl[f"{col}{i}"].font = Font(name=FONT)
    wl.column_dimensions[col].width = 34
wl.sheet_view.showGridLines = False

def listref(col, n):
    return f"'Listas'!${col}$2:${col}${1+n}"

REF = {
    "proc":   listref("A", 2),
    "sexo":   listref("B", 4),
    "simnao": listref("C", 2),
    "estado": listref("D", 4),
    "dept":   listref("E", 10),
}

# ===========================================================================
# Folha: Registos
# ===========================================================================
ws = wb.create_sheet("Registos")
ws.sheet_properties.tabColor = IOM_BLUE
ws.sheet_view.showGridLines = False

header_by_name = {name: i + 1 for i, (name, *_ ) in enumerate(COLS)}

# Linha 1 — cabeçalhos de secção (merge)
col_idx = 1
for name, _w, _s, _t in COLS:
    pass
# construir intervalos por secção
sec_ranges = {}
start = None
prev = None
for i, (_n, _w, sec, _t) in enumerate(COLS, start=1):
    if sec != prev:
        if prev is not None:
            sec_ranges.setdefault(prev, []).append((start, i - 1))
        start = i; prev = sec
sec_ranges.setdefault(prev, []).append((start, len(COLS)))

sec_color = {s[2]: s[1] for s in SECTIONS}
sec_title = {s[2]: s[0] for s in SECTIONS}
for sec, spans in sec_ranges.items():
    for (a, b) in spans:
        ws.merge_cells(start_row=1, start_column=a, end_row=1, end_column=b)
        c = ws.cell(row=1, column=a, value=sec_title[sec])
        c.font = Font(name=FONT, bold=True, color=WHITE, size=11)
        c.fill = fill(sec_color[sec])
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = BORDER
ws.row_dimensions[1].height = 24

# Linha 2 — cabeçalhos de coluna
for i, (name, width, sec, _t) in enumerate(COLS, start=1):
    c = ws.cell(row=2, column=i, value=name)
    c.font = Font(name=FONT, bold=True, color="1F3864", size=10)
    c.fill = fill(HDR_LIGHT)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = BORDER
    ws.column_dimensions[get_column_letter(i)].width = width
ws.row_dimensions[2].height = 34

# Linha-exemplo (linha 3)
for i, (name, width, sec, t) in enumerate(COLS, start=1):
    v = EXAMPLE.get(name, "")
    c = ws.cell(row=DATA_FIRST, column=i, value=v if v != "" else None)
    c.font = Font(name=FONT, size=10, italic=True, color="7F6000")
    c.fill = fill(EX_FILL)
    c.border = BORDER
    c.alignment = Alignment(vertical="center",
                            horizontal="center" if t in ("num","date","sexo","simnao","estado","proc") else "left",
                            wrap_text=(t == "text"))

# Restantes linhas de dados — bordas + formato
for r in range(DATA_FIRST, DATA_LAST + 1):
    for i, (name, width, sec, t) in enumerate(COLS, start=1):
        c = ws.cell(row=r, column=i)
        if r != DATA_FIRST:
            c.font = Font(name=FONT, size=10)
            c.border = BORDER
            c.alignment = Alignment(vertical="center",
                                    horizontal="center" if t in ("num","date","sexo","simnao","estado","proc") else "left",
                                    wrap_text=(t == "text"))
        if t == "date":
            c.number_format = "DD/MM/YYYY"

# Freeze + autofiltro
ws.freeze_panes = "E3"
ws.auto_filter.ref = f"A2:{get_column_letter(len(COLS))}2"

# ---- Validações de dados ----
def add_dv(col_name, ref):
    col = header_by_name[col_name]
    letter = get_column_letter(col)
    dv = DataValidation(type="list", formula1=ref, allow_blank=True, showErrorMessage=True)
    dv.error = "Escolha um valor da lista."
    dv.errorTitle = "Valor inválido"
    dv.prompt = "Selecione uma opção."
    ws.add_data_validation(dv)
    dv.add(f"{letter}{DATA_FIRST}:{letter}{DATA_LAST}")

add_dv("Tipo de Processo", REF["proc"])
add_dv("Sexo", REF["sexo"])
add_dv("Departamento", REF["dept"])
for nm in ("Necessita Laptop?", "Necessita Celular?", "Necessita SIM Card?"):
    add_dv(nm, REF["simnao"])
for nm in ("ICT · Estado", "ADM · Estado"):
    add_dv(nm, REF["estado"])

# ---- Formatação condicional nos estados ----
def status_cf(col_name):
    col = get_column_letter(header_by_name[col_name])
    rng = f"{col}{DATA_FIRST}:{col}{DATA_LAST}"
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Pendente"'],
        fill=fill("FFF3CD"), font=Font(name=FONT, size=10, color="856404", bold=True)))
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Aprovado"'],
        fill=fill("D4EDDA"), font=Font(name=FONT, size=10, color="155724", bold=True)))
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Rejeitado"'],
        fill=fill("F8D7DA"), font=Font(name=FONT, size=10, color="721C24", bold=True)))
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"N/A"'],
        fill=fill("E2E3E5"), font=Font(name=FONT, size=10, color="6C757D")))
status_cf("ICT · Estado")
status_cf("ADM · Estado")

# ===========================================================================
# Folha: Dashboard
# ===========================================================================
wd = wb.create_sheet("Dashboard")
wd.sheet_properties.tabColor = "1F4E96"
wd.sheet_view.showGridLines = False
wd.column_dimensions["A"].width = 4
wd.column_dimensions["B"].width = 42
wd.column_dimensions["C"].width = 16

wd.merge_cells("B2:C2")
t = wd["B2"]; t.value = "IOM — Painel de Onboarding & Offboarding"
t.font = Font(name=FONT, bold=True, color=WHITE, size=14); t.fill = fill(IOM_BLUE)
t.alignment = Alignment(horizontal="center", vertical="center")
wd.row_dimensions[2].height = 28
wd.merge_cells("B3:C3")

Rq = f"'Registos'!$B${DATA_FIRST}:$B${DATA_LAST}"       # Tipo de Processo
Rnome = f"'Registos'!$C${DATA_FIRST}:$C${DATA_LAST}"    # Nome
Rict = f"'Registos'!$Q${DATA_FIRST}:$Q${DATA_LAST}"     # ICT Estado
Radm = f"'Registos'!$X${DATA_FIRST}:$X${DATA_LAST}"     # ADM Estado

rows = [
    ("RESUMO GERAL", None, "sec"),
    ("Total de registos", f"=COUNTA({Rnome})", "n"),
    ("Onboarding", f'=COUNTIF({Rq},"Onboarding")', "n"),
    ("Offboarding", f'=COUNTIF({Rq},"Offboarding")', "n"),
    ("ICT — ALOCAÇÃO DE LAPTOP", None, "sec"),
    ("Pendentes de aprovação", f'=COUNTIF({Rict},"Pendente")', "pend"),
    ("Aprovados", f'=COUNTIF({Rict},"Aprovado")', "ok"),
    ("Rejeitados", f'=COUNTIF({Rict},"Rejeitado")', "no"),
    ("Não aplicável", f'=COUNTIF({Rict},"N/A")', "na"),
    ("ADMINISTRAÇÃO — CELULAR + SIM CARD", None, "sec"),
    ("Pendentes de aprovação", f'=COUNTIF({Radm},"Pendente")', "pend"),
    ("Aprovados", f'=COUNTIF({Radm},"Aprovado")', "ok"),
    ("Rejeitados", f'=COUNTIF({Radm},"Rejeitado")', "no"),
    ("Não aplicável", f'=COUNTIF({Radm},"N/A")', "na"),
]

styles = {
    "sec":  (fill(RH_BLUE), Font(name=FONT, bold=True, color=WHITE, size=11)),
    "n":    (fill("FFFFFF"), Font(name=FONT, size=11)),
    "pend": (fill("FFF3CD"), Font(name=FONT, size=11, color="856404", bold=True)),
    "ok":   (fill("D4EDDA"), Font(name=FONT, size=11, color="155724", bold=True)),
    "no":   (fill("F8D7DA"), Font(name=FONT, size=11, color="721C24", bold=True)),
    "na":   (fill("E2E3E5"), Font(name=FONT, size=11, color="6C757D")),
}

r = 5
for label, formula, kind in rows:
    fl, fo = styles[kind]
    bc = wd.cell(row=r, column=2, value=label)
    bc.fill = fl; bc.font = fo; bc.border = BORDER
    bc.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    vc = wd.cell(row=r, column=3)
    vc.border = BORDER
    vc.alignment = Alignment(horizontal="center", vertical="center")
    if kind == "sec":
        wd.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
    else:
        vc.value = formula
        vc.fill = fl; vc.font = fo
    wd.row_dimensions[r].height = 20
    r += 1

note = wd.cell(row=r + 1, column=2,
    value="Atualiza automaticamente a partir da folha 'Registos'. Os emails dos aprovadores do IOM "
          "preenchem a coluna 'Estado' (Pendente → Aprovado/Rejeitado).")
note.font = Font(name=FONT, size=9, italic=True, color=GREY)
wd.merge_cells(start_row=r + 1, start_column=2, end_row=r + 2, end_column=3)
note.alignment = Alignment(wrap_text=True, vertical="top")

# ===========================================================================
# Folha: Instruções
# ===========================================================================
wi = wb.create_sheet("Instruções", 0)   # primeira aba
wi.sheet_properties.tabColor = "C00000"
wi.sheet_view.showGridLines = False
wi.column_dimensions["A"].width = 3
wi.column_dimensions["B"].width = 100

def line(r, text, bold=False, color="000000", size=11, fillc=None, indent=0):
    c = wi.cell(row=r, column=2, value=text)
    c.font = Font(name=FONT, bold=bold, color=color, size=size)
    c.alignment = Alignment(wrap_text=True, vertical="center", indent=indent)
    if fillc: c.fill = fill(fillc)
    return c

wi.merge_cells("B2:B2")
line(2, "IOM — Sistema de Onboarding & Offboarding (RH + ICT + Administração)", True, WHITE, 14, IOM_BLUE)
wi.row_dimensions[2].height = 30

content = [
    (4,  "Como usar", True, IOM_BLUE, 12, None),
    (5,  "1. Na folha «Registos», cada linha é um colaborador. Preencha os campos de RH, ICT e Administração.", False, "000000", 11, None),
    (6,  "2. Campos a cinzento-claro no topo (linha 3) são um EXEMPLO — substitua pelos dados reais.", False, "000000", 11, None),
    (7,  "3. Células com seta (▼) têm lista suspensa: Tipo de Processo, Sexo, Departamento, Sim/Não e Estado.", False, "000000", 11, None),
    (8,  "4. A folha «Dashboard» conta tudo automaticamente.", False, "000000", 11, None),
    (10, "Fluxo de aprovação (IOM)", True, IOM_BLUE, 12, None),
    (11, "• ICT (Laptop): se «Necessita Laptop?» = Sim → o responsável de ICT do IOM define «ICT · Estado».", False, "000000", 11, None),
    (12, "• Administração (Celular + SIM): se «Necessita Celular?» ou «Necessita SIM Card?» = Sim → a Administração define «ADM · Estado».", False, "000000", 11, None),
    (13, "• Se não precisar, marque o Estado como «N/A».", False, "000000", 11, None),
    (15, "Legenda de cores (coluna Estado)", True, IOM_BLUE, 12, None),
]
for row in content:
    line(*row)

legend = [(17, "Pendente — aguarda decisão", "FFF3CD", "856404"),
          (18, "Aprovado", "D4EDDA", "155724"),
          (19, "Rejeitado", "F8D7DA", "721C24"),
          (20, "N/A — não aplicável", "E2E3E5", "6C757D")]
for r, txt, fc, fco in legend:
    c = line(r, "   " + txt, True, fco, 11, fc)
    c.border = BORDER

line(22, "Nota: o Excel não envia emails automaticamente. Para notificações automáticas aos aprovadores do IOM, "
         "use a versão Google Forms deste repositório, ou peça a versão .xlsm com macro de envio.", False, GREY, 10, None)
line(23, f"Campos obrigatórios e detalhe completo: ver docs/fields.md", False, GREY, 10, None)

wb.save(OUT)
print("Workbook criado:", OUT)
print("Folhas:", wb.sheetnames)
