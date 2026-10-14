// Conteúdo institucional da Associação (fonte: chicomendes.org.br).
import { FOTOS } from './media'

export const ORGANIZACAO = {
  nome: 'Associação Cultural e Ambiental Chico Mendes',
  curto: 'Chico Mendes',
  local: 'Cabuçu · Guarulhos/SP',
  fundacao: '26 de fevereiro de 2005',
  cnpj: '07.402.743/0001-37',
  telefone: '(11) 2407-9620',
  telefoneLink: '+551124079620',
  email: 'chicomendescabucu@gmail.com',
  instagram: 'https://www.instagram.com/cabucuchicomendes/',
  facebook: 'https://www.facebook.com/chicomendes.cabucu/',
  enderecos: [
    { titulo: 'Sede', linha1: 'Rua Hans Heitel Hohl, 58', linha2: 'Chácaras Cabuçu · 07144-287 · Guarulhos/SP' },
    { titulo: 'Unidade Estrada do Sabão', linha1: 'Estrada do Sabão, 13', linha2: 'Cabuçu · 07144-270 · Guarulhos/SP' }
  ]
}

export const FRASES = {
  romildo: { texto: 'A natureza não é só bela, é perfeita.', autor: 'Romildo Felix' },
  preserve: 'Se você gosta, preserve! Se não gosta, respeite! Pois vidas precisam dela, inclusive a sua!'
}

export const NUMEROS = [
  { valor: '20 mil', rotulo: 'mudas nativas por safra no viveiro' },
  { valor: '240', rotulo: 'crianças atendidas na creche' },
  { valor: '2.634 ha', rotulo: 'de Mata Atlântica no Núcleo Cabuçu' },
  { valor: '2005', rotulo: 'ano de fundação da Associação' }
]

export const PROJETOS = [
  {
    id: 'viveiro',
    area: 'Ambiental',
    nome: 'Viveiro Ecológico Cabuçu',
    sigla: 'VEC',
    desde: 2010,
    resumo:
      'Produz mudas de espécies nativas da Mata Atlântica para reflorestamento e enriquecimento da vegetação, em duas etapas: da semente à muda e da muda à floresta.',
    texto: [
      'O viveiro tem capacidade para produzir até 20 mil mudas por safra. Elas são usadas em reflorestamento e no enriquecimento da vegetação da região.',
      'Além das nativas, o viveiro cultiva plantas para paisagismo, plantas medicinais e hortaliças orgânicas, e produz adubo orgânico e húmus.'
    ],
    itens: ['Até 20 mil mudas por safra', 'Plantas medicinais e paisagismo', 'Hortaliças orgânicas', 'Adubo orgânico e húmus'],
    capa: FOTOS.mudas,
    galeria: [FOTOS.bandeja, FOTOS.horta, FOTOS.heliconia]
  },
  {
    id: 'cultura',
    area: 'Cultural',
    nome: 'Ponto de Cultura Chico Mendes',
    desde: 2006,
    resumo:
      'Oficinas culturais em várias linguagens, com destaque para a oficina de patrimônio histórico, que preserva a identidade do Cabuçu.',
    texto: [
      'Inaugurado em 2006 em parceria com órgãos municipais e federais de cultura, o Ponto de Cultura recebeu em 2009 o Prêmio Cultura Viva, do Ministério da Cultura.',
      'As oficinas passam por histórias em quadrinhos, artes, música, fotografia, teatro e vídeo. A oficina de patrimônio histórico ajuda o bairro a conhecer e guardar a própria memória.'
    ],
    itens: ['Histórias em quadrinhos e artes', 'Música e teatro', 'Fotografia e vídeo', 'Patrimônio histórico'],
    capa: FOTOS.percussao,
    galeria: [FOTOS.video, FOTOS.apresentacao, FOTOS.premiacao]
  },
  {
    id: 'creche',
    area: 'Educacional',
    nome: 'Creche Chico Mendes',
    desde: 2017,
    resumo:
      'Atende 240 crianças de 1 a 3 anos e 11 meses. A educação ambiental é um dos pilares da formação desde os primeiros passos.',
    texto: [
      'A creche foi inaugurada em 2017 para cuidar da primeira infância no bairro, com foco no desenvolvimento educacional das crianças.',
      'Desde cedo, as crianças aprendem a observar e cuidar da natureza: a educação ambiental faz parte da rotina.'
    ],
    itens: ['240 crianças atendidas', 'De 1 a 3 anos e 11 meses', 'Educação ambiental', 'Desenvolvimento integral'],
    capa: FOTOS.crecheSala,
    galeria: [FOTOS.crecheMesa, FOTOS.criancasMata, FOTOS.educadoras]
  }
]

export const HISTORIA = [
  { ano: '2005', texto: 'Moradoras do Cabuçu, lideradas por Ivone Christófero Felix Pires, fundam a Associação após reivindicações ambientais não atendidas.' },
  { ano: '2006', texto: 'Inauguração do Ponto de Cultura Chico Mendes, em parceria com órgãos municipais e federais de cultura.' },
  { ano: '2007', texto: 'Implantação de seis salas do MOVA Guarulhos, que atenderam 90 educandos na alfabetização de jovens e adultos.' },
  { ano: '2010', texto: 'Inauguração do Viveiro de Espécies Nativas da Mata Atlântica.' },
  { ano: '2017', texto: 'Inauguração da Creche Chico Mendes, com educação ambiental na primeira infância.' }
]

export const PREMIOS = [
  { ano: '2008 · 2009 · 2010 · 2012', nome: 'Selo Ambiental', por: 'Câmara Municipal de Guarulhos' },
  { ano: '2009', nome: 'Prêmio Cultura Viva', por: 'Ministério da Cultura, entre as 25 melhores iniciativas de Pontos de Cultura do Brasil' },
  { ano: '2019', nome: 'Prêmio Fazendo a Diferença', por: '2º lugar entre as 10 melhores ONGs de Guarulhos' }
]

export const CABUCU = {
  intro: [
    'O Cabuçu é o terceiro bairro mais antigo de Guarulhos, com cerca de 170 anos de história.',
    'Abriga 2.634,33 hectares de área verde do Núcleo Cabuçu do Parque Estadual da Cantareira, considerado uma das maiores florestas urbanas do mundo. Ao redor fica a Área de Proteção Ambiental Cabuçu–Tanque Grande, com cerca de 32,2 km².'
  ],
  nome: 'O nome vem do tupi e significa algo como “vespa grande”. É também o nome de uma árvore nativa, a Miconia cabussu, que pode ser vista em vários pontos da região.',
  marcos: [
    { ano: '1850', titulo: 'Capela Bom Jesus da Cabeça', texto: 'Erguida pelo escravizado Raimundo Fortes, com a técnica de taipa de pilão.', foto: FOTOS.capela },
    { ano: '1905', titulo: 'Barragem do Cabuçu', texto: 'Começa a construção da barragem, apontada como a primeira obra de concreto armado do país. Por cerca de 60 anos, o manancial abasteceu parte da Grande São Paulo.', foto: FOTOS.barragem },
    { ano: 'Século XX', titulo: 'Olarias e chuchu', texto: 'Cerca de 17 olarias funcionaram por mais de 30 anos, e o bairro chegou a ser o terceiro maior produtor de chuchu do estado.', foto: FOTOS.tijolo },
    { ano: 'Anos 80 e 90', titulo: 'Jornal Lata d’Água', texto: 'Os moradores se organizam, com o jornal Lata d’Água, para reivindicar abastecimento de água.', foto: FOTOS.jornal },
    { ano: '2004', titulo: 'A água chega às casas', texto: 'A população do Cabuçu passa a ser abastecida pelo manancial do próprio bairro.', foto: FOTOS.represaAerea }
  ]
}

export const DOACAO = {
  // Quando a ONG tiver chave PIX, preencha aqui: o QR Code é gerado sozinho.
  pixChave: '',
  pixNome: 'ASSOC CHICO MENDES',
  pixCidade: 'GUARULHOS',
  banco: 'Banco do Brasil',
  agencia: '0636-0',
  conta: '105.123-7',
  favorecido: 'Associação Cultural e Ambiental Chico Mendes'
}

export const NECESSIDADES = [
  { item: 'Brinquedos em bom estado', detalhe: 'para crianças de 1 a 4 anos, da creche' },
  { item: 'Roupas e calçados infantis', detalhe: 'para as crianças da creche' },
  { item: 'Material de limpeza', detalhe: 'usado no dia a dia dos projetos' },
  { item: 'Material de escritório', detalhe: 'usado no dia a dia dos projetos' }
]
