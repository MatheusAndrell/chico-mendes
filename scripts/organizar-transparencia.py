#!/usr/bin/env python3
"""
Organiza os PDFs do Portal da Transparência.

Renomeia os arquivos baixados do site antigo (nomes com acentos quebrados,
"(1)", "-girado" etc.) para nomes limpos derivados do título que aparece no
site (ex.: "BALANÇO 2019" -> balanco-2019.pdf) e gera o arquivo de dados
src/infrastructure/data/transparencia.json usado pela página /transparencia.

A lista abaixo segue exatamente a ordem e os títulos de
https://www.chicomendes.org.br/transparencia.

Uso:  python scripts/organizar-transparencia.py
"""
import json, os, re, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RAIZ, 'public', 'docs')
SAIDA = os.path.join(RAIZ, 'src', 'infrastructure', 'data', 'transparencia.json')

# (título no site, nome do arquivo baixado do site antigo)
SITE = [
("CONTRATO WLW ASSESSORIA CONTÁBIL","Contrato_WLW_Assessoria_ContÃ¡bil.pdf"),
("CONTRATO FAVA ADVOGADOS","Contrato FAVA Advogados.pdf"),
("CONTRATO GUARUPASS","Contrato Guarupass.pdf"),
("CRCE","CRCE-girado.pdf"),
("PLANO DE TRABALHO 2021","Plano de Trabalho 07 a 12 de 2021.pdf"),
("QUADRO DE FUNCIONÁRIOS 2021","Quadro Funcionárias 2021.pdf"),
("PARECER CONCLUSIVO Nº 229/2021","PARECER CONCLUSIVO N°229 2020.pdf"),
("RELATÓRIO QUADRIMESTRAL JAN A ABR 2021","Relatório 1 quadrimestre 2021 (2).pdf"),
("TERMO DE ABERTURA 2020","84825_31_Termo_Abertura.pdf"),
("LIVRO DIÁRIO 2020","84825_31_Livro_Diario_2020_12.pdf"),
("RAZÃO ANALÍTICO 2020","84825_31_Razao_1_2020_12_160415.pdf"),
("BALANÇO 2020","84825_31_Balanco_2020_12.pdf"),
("BALANCETE 2020","84825_31_Balancete_Anual_2020.pdf"),
("RELATÓRIO FÍSICO FINANCEIRO 2020","1ª 2ª 3ª Parcela e Bens 2020.pdf"),
("QUADRO DE FUNCIONÁRIOS 2020","Quadro_de_FuncionÃ¡rias_2020_-_Creche_Chico_Mendes-girado.pdf"),
("RELATÓRIO QUADRIMESTRAL JAN A ABR 2020","RelatÃ³rio_Quadrimestral__Janeiro_a_Abril_2020_(2).pdf"),
("RELATÓRIO QUADRIMESTRAL MAIO A AGO 2020","Maio a Agosto de 2020.pdf"),
("RELATÓRIO QUADRIMESTRAL SET A DEZ 2020","relatorio Setembro a Dezembro.pdf"),
("PARECER CONCLUSIVO N° 177/2020","Parecer_Concluisvo_NÂ°_177_-_2020_rotated.pdf"),
("RELATÓRIO TRIMESTRAL JAN A MAR 2019","RelatÃ³rio_Trimestral_Janeiro_a_MarÃ§o_2019_(2).pdf"),
("RELATÓRIO TRIMESTRAL ABR A JUN 2019","RelatÃ³rio_Trimestral_Abril_a_Junho_2019_(2).pdf"),
("RELATÓRIO TRIMESTRAL OUT A DEZ 2019","RelatÃ³rio_Trimestral_Outubro_a_Dezembro_2019_(2).pdf"),
("APOSTILAMENTO 2019 AO TERMO Nº 005624/2017","Termo de Apostilamento 5624 - 2017.pdf"),
("PLANO DE TRABALHO 2019","PLANO DE TRABALHO-girado.pdf"),
("Parecer Conclusivo N° 51/2019","Parecer Conclusivo 2019 - Creche.pdf"),
("RELATÓRIO FÍSICO FINANCEIRO 2019","1ª 2ª 3ª Parcela e Bens 2019.pdf"),
("TERMO DE ABERTURA LIVRO 2019","84825_31_Termo_Abertura (1).pdf"),
("BALANÇO 2019","Balanco_2018_12.pdf"),
("BALANCETE 2019","84825_31_Balancete_Anual_2019.pdf"),
("DEMONSTRAÇÃO 2019","84825_31_Demonstracao_2019_12.pdf"),
("RAZÃO ANALÍTICO 2019","84825_31_Razao_1_2019_12_102412.pdf"),
("LIVRO DIÁRIO 2019","Livro_Diario_2018_12.pdf"),
("RELATÓRIO TRIMESTRAL ABR A JUN 2018","RelatÃ³rio_Trimestral_Abril_a_Junho_2018v.pdf"),
("RELATÓRIO TRIMESTRAL JUL A SET 2018","RelatÃ³rio_Trimestral_Julho_a_Setembro_2018_(2).pdf"),
("RELATÓRIO TRIMESTRAL OUT A DEZ 2018","RelatÃ³rio_Trimestral_Outubro_a_Dezembro_2018_(2).pdf"),
("Parecer Conclusivo N° 260/2018","Parecer Conclusivo 2018 - Creche.pdf"),
("RELATÓRIO FÍSICO FINANCEIRO 2018","1ª 2ª 3ª 4ª  Parcela e bens 2018.pdf"),
("BALANCETE 2018","Balancete_Anual_2018.pdf"),
("BALANÇO 2018","Balanco_2018_12 (1).pdf"),
("DEMONSTRAÇÃO 2018","ilovepdf_merged.pdf"),
("RAZÃO ANALÍTICO 2018","Razao_1_2018_12_165325.pdf"),
("LIVRO DIÁRIO 2018","Livro_Diario_2018_12 (1).pdf"),
("RELATÓRIO FÍSICO FINANCEIRO 2017","1ªe 2ª Parcela e Bens 2017.pdf"),
("BALANCETE 2017","Balancete_012017_a_122017.pdf"),
("BALANÇO 2017","Balanco_2017_12.pdf"),
("DEMONSTRAÇÃO 2017","Demonstracao_2017_12.pdf"),
("RAZÃO ANALITICO 2017","Razao Analitico 2017.pdf"),
("LIVRO DIÁRIO 2017","Livro_Diario_2017_12.pdf"),
("TERMO DE COLABORAÇÃO 2017","TERMO_DE_COLABORAÃ_Ã_O_2017-girado.pdf"),
("PLANO DE TRABALHO 2017","Plano de Trabalho 01.pdf"),
("ADITAMENTO 01 2017","ADITAMENTO 01-girado.pdf"),
("ADITAMENTO 02 2017","ADITAMENTO 02-girado.pdf"),
("ADITAMENTO 03 2017","Termo Aditamento 03.pdf"),
("ADITAMENTO 04 2017","Termo Aditamento 04.pdf"),
("ADITAMENTO 05 2017","Termo Aditamento 05.pdf"),
("CONTRATO DE ALUGUEL 2017-2019","Contrato Aluguel 2017-2019.pdf"),
("CONTRATO DE ALUGUEL 2019-2021","Contrato Aluguel 2019-2021.pdf"),
("ESTATUTO","Estatuto_AssociaÃ§Ã£o_Cultural_e_Ambiental_Chico_Mendes_2019.2023.pdf"),
("ATA","Ata_AssociaÃ§Ã£o_Cultural_e_Ambiental_Chico_Mendes_2019.2023.pdf"),
("PRESTADORES DE SERVIÇOS","RelaÃ§Ã£o_de_Prestadores.pdf"),
("RELAÇÃO NOMINAL DOS DIRIGENTES","RelaÃ§Ã£o_Nominal_de_Dirigentes-girado.pdf"),
("CERTIFICADO DE CREDENCIAMENTO","Certificado de Credenciamento Educacional.pdf"),
("REGULAMENTO DE COMPRAS E CONTRATAÇÃO DE PESSOAL","regulamento e manual.pdf"),
]


def slug(t):
    t = unicodedata.normalize('NFD', t)
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')

def categoria(t):
    u = t.upper()
    if u.startswith('CONTRATO'):
        return 'contratos'
    if u.startswith(('TERMO DE ABERTURA', 'LIVRO', 'RAZÃO', 'BALAN', 'DEMONSTRA')):
        return 'contabil'
    if u.startswith('RELATÓRIO'):
        return 'relatorios'
    if u.startswith(('CRCE', 'PLANO', 'PARECER', 'APOSTILAMENTO', 'TERMO DE COLABORA', 'ADITAMENTO')):
        return 'parcerias'
    return 'institucional'

def ano(t):
    anos = re.findall(r'(20\d\d)', t)
    if not anos:
        return None
    if t.startswith('APOSTILAMENTO') or 'ALUGUEL' in t:
        return int(anos[0])
    return int(anos[-1])

def esqueleto(nome):
    # compara só letras/números ASCII: resiste a acentos quebrados no nome
    return re.sub(r'[^a-z0-9]', '', nome.lower())

def localizar(original, existentes):
    if original in existentes:
        return original
    alvo = esqueleto(original)
    achados = [n for n in existentes if esqueleto(n) == alvo]
    return achados[0] if len(achados) == 1 else None

def main():
    if len(SITE) != 63:
        sys.exit('lista do site incompleta')
    docs, renomeados = [], 0
    for i, (titulo, original) in enumerate(SITE):
        final = slug(titulo) + '.pdf'
        achado = localizar(original, os.listdir(DOCS))
        p_orig = os.path.join(DOCS, achado) if achado else None
        p_final = os.path.join(DOCS, final)
        if p_orig and not os.path.exists(p_final):
            os.rename(p_orig, p_final)
            renomeados += 1
        if not os.path.exists(p_final):
            print('FALTANDO:', titulo, '->', original)
            continue
        docs.append({
            'ordem': i + 1,
            'titulo': titulo,
            'arquivo': final,
            'categoria': categoria(titulo),
            'ano': ano(titulo),
            'tamanho': os.path.getsize(p_final),
        })
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump(docs, f, ensure_ascii=False, indent=2)
    sobras = sorted(set(os.listdir(DOCS)) - {d['arquivo'] for d in docs})
    print(f'{renomeados} renomeados, {len(docs)} documentos no índice.')
    if sobras:
        print('Arquivos em public/docs fora da lista do site:', sobras)

if __name__ == '__main__':
    main()
