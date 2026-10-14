import { FOTOS } from './media'

/**
 * Publicações do blog. Para criar uma nova, adicione um item com o próximo `numero`
 * (a lista é exibida do nº 1 em diante).
 * `imagem` é a peça original; `secoes` traz o texto dela (acessível e
 * encontrável por busca).
 */
export const POSTS = [
  {
    numero: 3,
    slug: 'informativo-chico-mendes-3',
    titulo: 'Informativo Chico Mendes nº 3',
    subtitulo: 'Descobrir o passado é planejar o futuro!',
    edicao: 'Novembro de 2019',
    resumo: 'As olarias do Cabuçu, o tijolo que leva o nome do bairro e por que proteger os gambás.',
    data: '2020-06-08',
    imagem: FOTOS.informativo3,
    secoes: [
      {
        titulo: 'Descobrir o passado é planejar o futuro',
        itens: [
          'Você sabia que o Cabuçu já teve 17 olarias, sendo um grande polo produtor de tijolos?',
          'Olaria era o local onde se produziam tijolos utilizando o barro (argila) e água. Depois de moldados, eles eram colocados em fornos para queimar utilizando lenha.',
          'As olarias do Cabuçu tiveram início em 1910 e chegaram a produzir 30 mil tijolos por semana, que eram vendidos principalmente para bairros de São Paulo.',
          'O tijolo Cabuçu ainda pode ser encontrado no nosso bairro. Ele foi utilizado na construção do muro da Escola Maria Helena.'
        ]
      },
      {
        titulo: 'Vamos falar de meio ambiente',
        itens: [
          'Estamos na primavera, época de reprodução dos gambás, também conhecidos como saruês. Eles são grandes aliados dos humanos, pois também se alimentam de escorpiões.',
          'Por isso, não maltrate nem cace os gambás: eles não fazem mal, não são agressivos e são muito importantes para a nossa fauna local.',
          'Com essas e outras atitudes ajudaremos o nosso planeta. Preservar o nosso meio ambiente é um dever de todos nós!'
        ]
      }
    ]
  },
  {
    numero: 2,
    slug: 'informativo-chico-mendes-2',
    titulo: 'Informativo Chico Mendes nº 2',
    subtitulo: 'Descobrir o passado é planejar o futuro!',
    edicao: 'Setembro de 2019',
    resumo: 'A Barragem do Cabuçu, primeira grande obra de concreto armado do Brasil, e os pássaros do bairro.',
    data: '2020-06-08',
    imagem: FOTOS.informativo2,
    secoes: [
      {
        titulo: 'Descobrir o passado é planejar o futuro',
        itens: [
          'Você sabia que a primeira grande obra de concreto armado do Brasil é a Barragem do Cabuçu?',
          'Sua construção teve início em 1904, feita pelo engenheiro Luís Paes Leme, e todo o material para construir a barragem veio da Inglaterra.',
          'A barragem foi construída para fornecer água a bairros da cidade de São Paulo; por isso foi construído o aqueduto, que margeia a nossa estrada.',
          'Quase 100 anos depois, em 2004, o SAAE revitalizou a barragem, construiu a ETA e nós, moradores, começamos a ser abastecidos pelas águas da Represa do Cabuçu.'
        ]
      },
      {
        titulo: 'Vamos falar de meio ambiente',
        itens: [
          'Nosso bairro tem uma grande diversidade de pássaros. Isso demonstra como a nossa região é rica, e a presença deles soltos na natureza garante o equilíbrio ambiental.',
          'Manter pássaros em gaiolas é crime ambiental segundo a Lei 9.605/98. Então não pratique esse crime: não cace nem prenda os nossos lindos pássaros. Todos temos direito à liberdade.',
          'Com essas e outras atitudes ajudaremos o nosso planeta. Preservar o nosso meio ambiente é um dever de todos nós!'
        ]
      }
    ]
  },
  {
    numero: 1,
    slug: 'informativo-chico-mendes-1',
    titulo: 'Informativo Chico Mendes nº 1',
    subtitulo: 'Descobrir o passado é planejar o futuro!',
    edicao: 'Agosto de 2019',
    resumo: 'O significado do nome Cabuçu, a antiga fazenda de chá, a Capela Bom Jesus da Cabeça e o pulmão de Guarulhos.',
    data: '2020-06-08',
    imagem: FOTOS.informativo1,
    secoes: [
      {
        titulo: 'Descobrir o passado é planejar o futuro',
        itens: [
          'A palavra Cabuçu significa “vespa grande”. De origem indígena, “cabo” significa vespa e “açu”, grande.',
          'Antigamente, o Cabuçu era uma grande fazenda de chá, que pertencia à Sra. Joaquina Fortes de Redon e Toledo.',
          'O marco zero do nosso bairro, ou seja, a primeira construção de que se tem registro, é a Igreja Bom Jesus da Cabeça, de 1850, construída pelo escravo Raimundo Fortes.',
          'A Igreja Bom Jesus da Cabeça é considerada a 3ª igreja mais antiga de Guarulhos, tombada como Patrimônio Histórico pelo Decreto Municipal nº 21.143, de 28/12/2000.'
        ]
      },
      {
        titulo: 'Vamos falar de meio ambiente',
        itens: [
          'A Organização Mundial da Saúde recomenda que, para termos um ar de qualidade, precisamos de 3 árvores de grande porte por habitante.',
          'O Cabuçu é o pulmão de Guarulhos, devido à sua extensa área verde, que é a Serra da Cantareira. Sempre que possível, plante uma árvore: isso ajudará a manter a qualidade do ar sempre boa.',
          'Com essas e outras atitudes ajudaremos o nosso planeta. Preservar o nosso meio ambiente é um dever de todos nós!'
        ]
      }
    ]
  }
]
