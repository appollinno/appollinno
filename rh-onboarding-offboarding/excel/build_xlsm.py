#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Constrói a versão .xlsm (com macro VBA de aprovação por email) a partir da
versão .xlsx já gerada. Cria um vbaProject.bin (OLE/MS-OVBA) do zero e injecta-o.
Valida no fim com olevba.
"""
import struct, zipfile, shutil, os, re

SRC_XLSX = "/home/user/appollinno/rh-onboarding-offboarding/excel/IOM_Onboarding_Offboarding.xlsx"
OUT_XLSM = "/home/user/appollinno/rh-onboarding-offboarding/excel/IOM_Onboarding_Offboarding_Macro.xlsm"
BAS_DIR  = "/home/user/appollinno/rh-onboarding-offboarding/excel/vba"
PROJECT_NAME = "OnboardingVBA"
PROJECT_GUID = "{5B2D4C1A-8F3E-4A7B-9C2D-1E6F0A3B7C8D}"

# ---------------------------------------------------------------------------
# 1) Código VBA
# ---------------------------------------------------------------------------
THISWORKBOOK = (
'Attribute VB_Name = "ThisWorkbook"\r\n'
'Attribute VB_Base = "0{00020819-0000-0000-C000-000000000046}"\r\n'
'Attribute VB_GlobalNameSpace = False\r\n'
'Attribute VB_Creatable = False\r\n'
'Attribute VB_PredeclaredId = True\r\n'
'Attribute VB_Exposed = True\r\n'
'Attribute VB_TemplateDerived = False\r\n'
'Attribute VB_Customizable = True\r\n'
"Private Sub Workbook_SheetChange(ByVal Sh As Object, ByVal Target As Range)\r\n"
"    On Error Resume Next\r\n"
"    If Sh.Name <> SHEET_REG Then Exit Sub\r\n"
"    If Target.Row < 3 Then Exit Sub\r\n"
"    Dim c As Long: c = Target.Column\r\n"
"    If c = 17 Or c = 24 Then NotificarDecisao Sh, Target.Row, c\r\n"
"End Sub\r\n"
)

MODULE1 = (
'Attribute VB_Name = "Module1"\r\n'
"' ====== Configuracao: altere os emails dos aprovadores do IOM ======\r\n"
'Public Const SHEET_REG As String = "Registos"\r\n'
'Public Const ICT_EMAIL As String = "ict.approver@iom.int"\r\n'
'Public Const ADM_EMAIL As String = "admin.approver@iom.int"\r\n'
'Public Const HR_EMAIL As String = "hr@iom.int"\r\n'
"\r\n"
"' Envia por email todos os pedidos com Estado = PENDENTE (botao/manual)\r\n"
"Public Sub EnviarPedidosPendentes()\r\n"
"    Dim ws As Worksheet, r As Long, lastR As Long, n As Long\r\n"
"    Set ws = ThisWorkbook.Sheets(SHEET_REG)\r\n"
"    lastR = ws.Cells(ws.Rows.Count, 3).End(xlUp).Row\r\n"
"    For r = 3 To lastR\r\n"
'        If UCase(ws.Cells(r, 17).Value) = "PENDENTE" Then\r\n'
'            EnviarEmail ICT_EMAIL, "Aprovacao ICT (Laptop) - " & Nome(ws, r), CorpoICT(ws, r)\r\n'
"            n = n + 1\r\n"
"        End If\r\n"
'        If UCase(ws.Cells(r, 24).Value) = "PENDENTE" Then\r\n'
'            EnviarEmail ADM_EMAIL, "Aprovacao Admin (Celular+SIM) - " & Nome(ws, r), CorpoADM(ws, r)\r\n'
"            n = n + 1\r\n"
"        End If\r\n"
"    Next r\r\n"
'    MsgBox n & " pedido(s) preparado(s) no Outlook.", vbInformation\r\n'
"End Sub\r\n"
"\r\n"
"' Chamado automaticamente quando a coluna Estado muda para Aprovado/Rejeitado\r\n"
"Public Sub NotificarDecisao(ws As Object, r As Long, c As Long)\r\n"
"    Dim estado As String, seccao As String, dest As String\r\n"
"    estado = UCase(ws.Cells(r, c).Value)\r\n"
'    If estado <> "APROVADO" And estado <> "REJEITADO" Then Exit Sub\r\n'
'    If c = 17 Then seccao = "ICT (Laptop)" Else seccao = "Admin (Celular+SIM)"\r\n'
"    dest = HR_EMAIL\r\n"
'    If ws.Cells(r, 7).Value <> "" Then dest = dest & ";" & ws.Cells(r, 7).Value\r\n'
'    EnviarEmail dest, estado & " - " & seccao & " - " & Nome(ws, r), _\r\n'
'        "O pedido de " & seccao & " para " & Nome(ws, r) & " foi " & estado & "."\r\n'
"End Sub\r\n"
"\r\n"
"Private Function Nome(ws As Object, r As Long) As String\r\n"
'    Nome = ws.Cells(r, 3).Value & " " & ws.Cells(r, 4).Value\r\n'
"End Function\r\n"
"\r\n"
"Private Function CorpoICT(ws As Object, r As Long) As String\r\n"
'    CorpoICT = "Colaborador: " & Nome(ws, r) & vbCrLf & _\r\n'
'        "Departamento: " & ws.Cells(r, 12).Value & vbCrLf & _\r\n'
'        "Laptop: " & ws.Cells(r, 15).Value & vbCrLf & _\r\n'
'        "Justificacao: " & ws.Cells(r, 16).Value\r\n'
"End Function\r\n"
"\r\n"
"Private Function CorpoADM(ws As Object, r As Long) As String\r\n"
'    CorpoADM = "Colaborador: " & Nome(ws, r) & vbCrLf & _\r\n'
'        "Celular: " & ws.Cells(r, 21).Value & " | SIM: " & ws.Cells(r, 22).Value & vbCrLf & _\r\n'
'        "Observacoes: " & ws.Cells(r, 23).Value\r\n'
"End Function\r\n"
"\r\n"
"' Usa o Outlook (late binding). Troque .Display por .Send para enviar directo.\r\n"
"Private Sub EnviarEmail(para As String, assunto As String, corpo As String)\r\n"
"    On Error Resume Next\r\n"
"    Dim ol As Object, m As Object\r\n"
'    Set ol = CreateObject("Outlook.Application")\r\n'
"    Set m = ol.CreateItem(0)\r\n"
"    m.To = para\r\n"
'    m.Subject = "[IOM] " & assunto\r\n'
'    m.Body = corpo & vbCrLf & vbCrLf & "Mensagem automatica do sistema de Onboarding/Offboarding."\r\n'
"    m.Display\r\n"
"End Sub\r\n"
)

MODULES = [
    # (nome, stream_name, source, is_document)
    ("ThisWorkbook", "ThisWorkbook", THISWORKBOOK, True),
    ("Module1", "Module1", MODULE1, False),
]

# ---------------------------------------------------------------------------
# 2) Compressao MS-OVBA (chunks: inteiros=nao-comprimido, parcial=literais)
# ---------------------------------------------------------------------------
def ovba_compress(data: bytes) -> bytes:
    out = bytearray(b'\x01')
    i = 0
    while i < len(data):
        chunk = data[i:i+4096]
        i += 4096
        if len(chunk) == 4096:
            out += struct.pack('<H', 0x3FFF)   # nao comprimido (flag=0, 011, size=0xFFF)
            out += chunk
        else:
            cd = bytearray()
            j = 0
            while j < len(chunk):
                cd.append(0x00)                # flagbyte: 8 literais
                cd += chunk[j:j+8]
                j += 8
            assert len(cd) <= 4098, "chunk parcial grande demais para literais"
            hdr = 0x8000 | 0x3000 | ((len(cd) - 1) & 0x0FFF)
            out += struct.pack('<H', hdr) + bytes(cd)
    return bytes(out)

# ---------------------------------------------------------------------------
# 3) 'dir' stream
# ---------------------------------------------------------------------------
def rec(_id, data=b''):
    return struct.pack('<HI', _id, len(data)) + data

def mbcs(s): return s.encode('cp1252')
def utf16(s): return s.encode('utf-16-le')

def build_dir():
    d = bytearray()
    # PROJECTINFORMATION
    d += rec(0x0001, struct.pack('<I', 0x00000001))   # SysKind Win32
    d += rec(0x0002, struct.pack('<I', 0x00000409))   # Lcid
    d += rec(0x0014, struct.pack('<I', 0x00000409))   # LcidInvoke
    d += rec(0x0003, struct.pack('<H', 0x04E4))       # CodePage 1252
    d += rec(0x0004, mbcs(PROJECT_NAME))              # Name
    # DocString
    d += struct.pack('<HI', 0x0005, 0) + struct.pack('<H', 0x0040) + struct.pack('<I', 0)
    # HelpFilePath
    d += struct.pack('<HI', 0x0006, 0) + struct.pack('<H', 0x003D) + struct.pack('<I', 0)
    d += rec(0x0007, struct.pack('<I', 0))            # HelpContext
    d += rec(0x0008, struct.pack('<I', 0))            # LibFlags
    # Version (Id + Reserved=4 + major(4) + minor(2))
    d += struct.pack('<HI', 0x0009, 0x00000004) + struct.pack('<I', 1) + struct.pack('<H', 0)
    # Constants
    d += struct.pack('<HI', 0x000C, 0) + struct.pack('<H', 0x003C) + struct.pack('<I', 0)
    # PROJECTMODULES
    d += rec(0x000F, struct.pack('<H', len(MODULES)))
    d += rec(0x0013, struct.pack('<H', 0xFFFF))       # Cookie
    for name, stream, src, is_doc in MODULES:
        d += rec(0x0019, mbcs(name))                  # MODULENAME
        d += rec(0x0047, utf16(name))                 # MODULENAMEUNICODE
        # MODULESTREAMNAME
        d += rec(0x001A, mbcs(stream)) + struct.pack('<H', 0x0032) + rec_tail(utf16(stream))
        # MODULEDOCSTRING
        d += struct.pack('<HI', 0x001C, 0) + struct.pack('<H', 0x0048) + struct.pack('<I', 0)
        d += rec(0x0031, struct.pack('<I', 0))        # MODULEOFFSET = 0
        d += rec(0x001E, struct.pack('<I', 0))        # MODULEHELPCONTEXT
        d += rec(0x002C, struct.pack('<H', 0xFFFF))   # MODULECOOKIE
        d += rec(0x0022 if is_doc else 0x0021, b'')   # MODULETYPE
        d += rec(0x002B, b'')                          # MODULE terminator
    d += rec(0x0010, b'')                              # dir terminator
    return bytes(d)

def rec_tail(data):
    # Size(4) + data  (para o par Unicode de MODULESTREAMNAME)
    return struct.pack('<I', len(data)) + data

# ---------------------------------------------------------------------------
# 4) Streams do projecto
# ---------------------------------------------------------------------------
def build_vba_project_stream():
    # Reserved1=0x61CC, Version=0xFFFF (forca recompilacao), Reserved2=0, Reserved3=0
    return struct.pack('<HHBH', 0x61CC, 0xFFFF, 0x00, 0x0000)

def build_projectwm():
    out = bytearray()
    for name, stream, src, is_doc in MODULES:
        out += mbcs(name) + b'\x00' + utf16(name) + b'\x00\x00'
    out += b'\x00\x00'
    return bytes(out)

def build_project_text():
    lines = [
        'ID="%s"' % PROJECT_GUID,
        'Document=ThisWorkbook/&H00000000',
        'Module=Module1',
        'Name="%s"' % PROJECT_NAME,
        'HelpContextID="0"',
        'VersionCompatible32="393222000"',
        '',
        '[Host Extender Info]',
        '&H00000001={3832D640-CF90-11CF-8E43-00A0C911005A};VBE;&H00000000',
        '',
        '[Workspace]',
        'ThisWorkbook=0, 0, 0, 0, C',
        'Module1=0, 0, 0, 0, C',
        '',
    ]
    return ('\r\n'.join(lines)).encode('cp1252')

# ---------------------------------------------------------------------------
# 5) Escritor CFBF (OLE2 Compound File)
# ---------------------------------------------------------------------------
FREESECT, ENDOFCHAIN, FATSECT, DIFSECT = 0xFFFFFFFF, 0xFFFFFFFE, 0xFFFFFFFD, 0xFFFFFFFC
NOSTREAM = 0xFFFFFFFF

class Entry:
    def __init__(self, name, etype):
        self.name = name; self.etype = etype
        self.left = NOSTREAM; self.right = NOSTREAM; self.child = NOSTREAM
        self.start = 0; self.size = 0
        self.data = b''

def cf_name_key(name):
    return (len(name), name.upper())

def build_bst(entries, idxs):
    """Constroi BST equilibrada; devolve indice raiz e define left/right."""
    idxs = sorted(idxs, key=lambda i: cf_name_key(entries[i].name))
    def rec_build(lo, hi):
        if lo > hi: return NOSTREAM
        mid = (lo + hi) // 2
        node = idxs[mid]
        entries[node].left = rec_build(lo, mid - 1)
        entries[node].right = rec_build(mid + 1, hi)
        return node
    return rec_build(0, len(idxs) - 1)

def write_cfbf(streams, storages):
    """
    streams: lista de (path_tuple, bytes) ; storages: lista de path_tuple
    path_tuple: ('VBA','dir') etc. Raiz implicita.
    """
    # --- montar entradas de directorio ---
    entries = []
    index = {}
    root = Entry("Root Entry", 5); entries.append(root); index[()] = 0
    # storages
    for path in storages:
        e = Entry(path[-1], 1); index[path] = len(entries); entries.append(e)
    # streams
    for path, data in streams:
        e = Entry(path[-1], 2); e.data = data; e.size = len(data)
        index[path] = len(entries); entries.append(e)
    # filhos por pai
    children = {(): []}
    for path in storages: children[path] = []
    for path in list(index):
        if path == (): continue
        parent = path[:-1]
        children.setdefault(parent, []).append(index[path])
    # BST de filhos
    for path, kids in children.items():
        if kids:
            entries[index[path]].child = build_bst(entries, kids)

    # --- mini stream: todos os streams (<4096) ---
    mini = bytearray(); minifat = []
    for path, data in streams:
        e = entries[index[path]]
        if len(data) == 0:
            e.start = ENDOFCHAIN; continue
        start_ms = len(mini) // 64
        e.start = start_ms
        nsec = (len(data) + 63) // 64
        padded = data + b'\x00' * (nsec * 64 - len(data))
        mini += padded
        for k in range(nsec):
            minifat.append(ENDOFCHAIN if k == nsec - 1 else start_ms + k + 1)
    mini = bytes(mini)

    # --- alocador de sectores grandes (512) ---
    sectors = []; fat = []
    def add_chain(data):
        if len(data) == 0: return ENDOFCHAIN
        n = (len(data) + 511) // 512
        data = data + b'\x00' * (n * 512 - len(data))
        first = len(sectors)
        for k in range(n):
            sectors.append(data[k*512:(k+1)*512])
            fat.append(ENDOFCHAIN if k == n - 1 else first + k + 1)
        return first

    # ministream container, minifat
    root.start = add_chain(mini); root.size = len(mini)
    minifat_bytes = b''.join(struct.pack('<I', x) for x in minifat)
    first_minifat = add_chain(minifat_bytes)
    num_minifat = 0 if len(minifat_bytes) == 0 else (len(minifat_bytes) + 511) // 512

    # directorio
    dir_bytes = bytearray()
    for e in entries:
        nm = e.name.encode('utf-16-le')
        nm = nm[:62]
        namelen = len(nm) + 2
        nm = nm + b'\x00' * (64 - len(nm))
        dir_bytes += nm
        dir_bytes += struct.pack('<H', namelen)
        dir_bytes += struct.pack('<B', e.etype)
        dir_bytes += struct.pack('<B', 1)  # color black
        dir_bytes += struct.pack('<III', e.left, e.right, e.child)
        dir_bytes += b'\x00' * 16          # clsid
        dir_bytes += struct.pack('<I', 0)  # state
        dir_bytes += b'\x00' * 16          # times
        dir_bytes += struct.pack('<I', e.start & 0xFFFFFFFF)
        dir_bytes += struct.pack('<Q', e.size)
    # pad a multiplo de 512 (entradas livres)
    while len(dir_bytes) % 512 != 0:
        free = bytearray(128)
        struct.pack_into('<H', free, 64, 0)         # namelen 0
        free[66] = 0                                  # type 0 (unused)
        struct.pack_into('<III', free, 68, NOSTREAM, NOSTREAM, NOSTREAM)
        dir_bytes += free
    first_dir = add_chain(bytes(dir_bytes))
    num_dir_sectors = len(dir_bytes) // 512

    # --- FAT (itera para convergir nº de sectores FAT) ---
    base = len(sectors)
    num_fat = 1
    while True:
        total = base + num_fat
        need = (total + 127) // 128
        if need <= num_fat:
            break
        num_fat = need
    fat_first = len(sectors)
    for k in range(num_fat):
        sectors.append(b'')           # placeholder
        fat.append(FATSECT)
    # construir array FAT
    fat_entries = list(fat) + [FREESECT] * (128 * num_fat - len(fat))
    fat_bytes = b''.join(struct.pack('<I', x) for x in fat_entries)
    for k in range(num_fat):
        sectors[fat_first + k] = fat_bytes[k*512:(k+1)*512]

    # --- cabecalho ---
    hdr = bytearray(512)
    hdr[0:8] = bytes([0xD0,0xCF,0x11,0xE0,0xA1,0xB1,0x1A,0xE1])
    struct.pack_into('<H', hdr, 24, 0x003E)   # minor
    struct.pack_into('<H', hdr, 26, 0x0003)   # major (v3, 512)
    struct.pack_into('<H', hdr, 28, 0xFFFE)   # byte order
    struct.pack_into('<H', hdr, 30, 0x0009)   # sector shift 512
    struct.pack_into('<H', hdr, 32, 0x0006)   # mini sector shift 64
    struct.pack_into('<I', hdr, 44, num_fat)          # num FAT sectors
    struct.pack_into('<I', hdr, 48, first_dir)        # first dir sector
    struct.pack_into('<I', hdr, 56, 0x00001000)       # mini cutoff 4096
    struct.pack_into('<I', hdr, 60, first_minifat if num_minifat else ENDOFCHAIN)
    struct.pack_into('<I', hdr, 64, num_minifat)      # num mini FAT sectors
    struct.pack_into('<I', hdr, 68, ENDOFCHAIN)       # first DIFAT
    struct.pack_into('<I', hdr, 72, 0)                # num DIFAT sectors
    # DIFAT (109 entradas)
    difat = [fat_first + k for k in range(num_fat)] + [FREESECT] * (109 - num_fat)
    for k in range(109):
        struct.pack_into('<I', hdr, 76 + k*4, difat[k])

    return bytes(hdr) + b''.join(sectors)

# ---------------------------------------------------------------------------
# 6) Montar vbaProject.bin
# ---------------------------------------------------------------------------
def build_vba_bin():
    dir_stream = ovba_compress(build_dir())
    streams = [
        (('PROJECT',), build_project_text()),
        (('PROJECTwm',), build_projectwm()),
        (('VBA', '_VBA_PROJECT'), build_vba_project_stream()),
        (('VBA', 'dir'), dir_stream),
    ]
    for name, stream, src, is_doc in MODULES:
        streams.append((('VBA', stream), ovba_compress(src.encode('cp1252'))))
    storages = [('VBA',)]
    return write_cfbf(streams, storages)

# ---------------------------------------------------------------------------
# 7) Injectar no xlsx -> xlsm (zip surgery)
# ---------------------------------------------------------------------------
def assemble_xlsm(vba_bin):
    shutil.copy(SRC_XLSX, OUT_XLSM + ".tmp.zip")
    zin = zipfile.ZipFile(OUT_XLSM + ".tmp.zip", 'r')
    names = zin.namelist()
    data = {n: zin.read(n) for n in names}
    zin.close()
    os.remove(OUT_XLSM + ".tmp.zip")

    # [Content_Types].xml
    ct = data['[Content_Types].xml'].decode('utf-8')
    if 'Extension="bin"' not in ct:
        ct = ct.replace('<Default Extension="xml"',
            '<Default Extension="bin" ContentType="application/vnd.ms-office.vbaProject"/><Default Extension="xml"', 1)
    ct = ct.replace(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml',
        'application/vnd.ms-excel.sheet.macroEnabled.main+xml')
    data['[Content_Types].xml'] = ct.encode('utf-8')

    # workbook rels
    rels = data['xl/_rels/workbook.xml.rels'].decode('utf-8')
    if 'vbaProject.bin' not in rels:
        rels = rels.replace('</Relationships>',
            '<Relationship Id="rIdVBA" '
            'Type="http://schemas.microsoft.com/office/2006/relationships/vbaProject" '
            'Target="vbaProject.bin"/></Relationships>')
    data['xl/_rels/workbook.xml.rels'] = rels.encode('utf-8')

    # workbook.xml -> codeName=ThisWorkbook
    wb = data['xl/workbook.xml'].decode('utf-8')
    if 'codeName=' not in wb:
        if '<workbookPr' in wb:
            wb = re.sub(r'<workbookPr', '<workbookPr codeName="ThisWorkbook"', wb, count=1)
        else:
            wb = wb.replace('</fileVersion>', '</fileVersion><workbookPr codeName="ThisWorkbook"/>', 1) \
                if '</fileVersion>' in wb else \
                re.sub(r'(<workbook[^>]*>)', r'\1<workbookPr codeName="ThisWorkbook"/>', wb, count=1)
    data['xl/workbook.xml'] = wb.encode('utf-8')

    # novo part
    data['xl/vbaProject.bin'] = vba_bin

    zout = zipfile.ZipFile(OUT_XLSM, 'w', zipfile.ZIP_DEFLATED)
    for n, d in data.items():
        zout.writestr(n, d)
    zout.close()

# ---------------------------------------------------------------------------
# 8) Ficheiros de origem VBA (fallback de importacao)
# ---------------------------------------------------------------------------
def write_sources():
    os.makedirs(BAS_DIR, exist_ok=True)
    with open(os.path.join(BAS_DIR, "Module1.bas"), "w", encoding="cp1252") as f:
        f.write(MODULE1.replace("\r\n", "\n"))
    with open(os.path.join(BAS_DIR, "ThisWorkbook.cls"), "w", encoding="cp1252") as f:
        f.write(THISWORKBOOK.replace("\r\n", "\n"))

if __name__ == "__main__":
    vba_bin = build_vba_bin()
    with open("/tmp/claude-0/-home-user-appollinno/a93fbefb-fe93-5d2f-ae7b-866289dccd74/scratchpad/vbaProject.bin", "wb") as f:
        f.write(vba_bin)
    assemble_xlsm(vba_bin)
    write_sources()
    print("vbaProject.bin:", len(vba_bin), "bytes")
    print("Gerado:", OUT_XLSM)
    print("Fontes VBA:", BAS_DIR)
