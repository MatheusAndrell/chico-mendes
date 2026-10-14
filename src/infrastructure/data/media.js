/**
 * Fotos da Associação, publicadas no site atual (Wix).
 * Para hospedar localmente: salve o arquivo em /public/fotos e troque o
 * `src` pelo caminho local (ex.: '/fotos/serra.jpg').
 */
const WIX = 'https://static.wixstatic.com/media/'

function wix(id, alt, { w = 1600, h = 1067 } = {}) {
  return {
    alt,
    src: (width = w, height = Math.round((width * h) / w)) =>
      `${WIX}${id}/v1/fill/w_${width},h_${height},al_c,q_80/${id.replace('~mv2', '')}`,
    ratio: w / h
  }
}

// Imagem hospedada no próprio projeto (pasta /public)
function local(path, alt, { w, h }) {
  return { alt, src: () => path, ratio: w / h, local: true }
}

export const FOTOS = {
  serra: wix('45c6c4_ed68954586844c63980246da76a9e94f~mv2.jpeg', 'Mata Atlântica da Serra da Cantareira vista do Cabuçu', { w: 1600, h: 900 }),
  represa: wix('45c6c4_a9f1b7b27535450a8201a8a81504ebedf000.jpg', 'Represa cercada pela mata no Cabuçu', { w: 1600, h: 900 }),
  represaAerea: wix('45c6c4_72dbb5fab6394b6e8fc865aaf2721d62~mv2.jpg', 'Vista aérea da represa do Cabuçu entre a floresta', { w: 1200, h: 1200 }),
  mudas: wix('45c6c4_67878032b0f34bd19991f3793376d325~mv2.jpg', 'Mudas nativas crescendo no viveiro'),
  heliconia: wix('45c6c4_f57b82a1609247459874cd77551d1f26~mv2.jpg', 'Helicônias cultivadas no viveiro'),
  horta: wix('45c6c4_2111948316364131995655b7b26d2fd8~mv2.jpg', 'Hortaliças orgânicas do viveiro'),
  bandeja: wix('45c6c4_91b864e51045405ebb20a7270f0a6c75~mv2.png', 'Bandeja de mudas recém-germinadas'),
  excursao: wix('45c6c4_c2b241de1e1b4be6b8df783801c633d0~mv2.jpg', 'Grupo da Associação em frente a um ônibus de excursão'),
  equipe: wix('45c6c4_8257ccf519d542f7b1e3022d61196183~mv2.jpg', 'Equipe da Associação reunida'),
  apresentacao: wix('45c6c4_95a896b583504874a12dcd7c0f7f25e2~mv2.jpg', 'Apresentação cultural no palco'),
  homenagem: wix('45c6c4_2bf8657d419249198206d8f3e8059e8c~mv2.jpg', 'Homenagem durante evento da Associação'),
  grupoMata: wix('45c6c4_b66faa4d26d84774afde525f303aa1ba~mv2.jpg', 'Participantes reunidos na mata'),
  encontro: wix('45c6c4_4cd34cd9e84b43ad88276df3dcb5c669~mv2.jpg', 'Encontro com moradores e voluntários'),
  trilha: wix('45c6c4_c6d955ddf87e4139b47e8e318da8ed78~mv2.jpg', 'Grupo no alto de um morro com a serra ao fundo'),
  educadoras: wix('45c6c4_d09e94cf0567482b8af7a4479d184acf~mv2.jpg', 'Educadoras da Associação'),
  percussao: wix('45c6c4_c815ddf05ca442ed97992ead680c0f7d~mv2.jpg', 'Oficina de percussão do Ponto de Cultura'),
  video: wix('45c6c4_a6cc76d763a44605a97630fc807ded6f~mv2.jpg', 'Jovem com câmera na oficina de vídeo'),
  criancasMata: wix('45c6c4_9cad890fef4a483b8ae7c830b10d206e~mv2.jpg', 'Crianças em atividade na mata'),
  crecheSala: wix('45c6c4_9bb2a254b4234443a830dd2858d708f5~mv2.jpg', 'Sala da creche com crianças brincando'),
  crecheMesa: wix('45c6c4_a8be836639db4df795de98d4f89dc36b~mv2.jpg', 'Crianças da creche em atividade à mesa'),
  capela: wix('45c6c4_70cc642deebb419ba3cf42a6123235f4~mv2.jpg', 'Capela Bom Jesus da Cabeça, de 1850'),
  barragem: wix('45c6c4_ad01dc96ba7c4833b888da9e43e2338c~mv2.png', 'Barragem do Cabuçu'),
  aereaAntiga: wix('45c6c4_4290517458a746928f6816aa4a3b7023~mv2.jpg', 'Foto aérea antiga do bairro'),
  jornal: wix('45c6c4_f71d437b29b848edb4f85deb048f2fbe~mv2.jpg', 'Páginas do jornal comunitário Lata d’Água'),
  tijolo: wix('45c6c4_97825191f43e4b37a2d96b4171d5911a~mv2.png', 'Tijolo antigo com a inscrição Cabuçu, das olarias do bairro'),
  arvore: wix('45c6c4_596385f83b984eee90224bae23538312~mv2.png', 'Copa de árvore vista de baixo'),
  placa: wix('45c6c4_b71262a079014496bbfd7b24e6e2047f~mv2.jpg', 'Grupo junto à placa da Associação Chico Mendes'),
  passeata: wix('45c6c4_04f1fe7b71a54f418a55d58c46e88c9b~mv2.png', 'Caminhada de educação ambiental pelo bairro'),
  festa: wix('45c6c4_9862e2d33c424fc99ed217366402472b~mv2.jpg', 'Festa com moradores e crianças da Associação'),
  vespa: wix('45c6c4_4af9c39eb9b440e5aa0c83d1352bae94~mv2.jpg', 'Material educativo com a vespa, símbolo do nome Cabuçu'),
  premiacao: wix('45c6c4_38d26c9801824fae943ab792a7b1597d~mv2.jpg', 'Entrega de certificados em evento'),
  salaAula: wix('45c6c4_ef461ee6815945acbf5905494a572688~mv2.png', 'Sala de aula de alfabetização de adultos'),
  informativo1: local('/blogs/informativo-1.avif', 'Informativo Chico Mendes nº 1, agosto de 2019', { w: 720, h: 960 }),
  informativo2: local('/blogs/informativo-2.avif', 'Informativo Chico Mendes nº 2, setembro de 2019', { w: 539, h: 718 }),
  informativo3: local('/blogs/informativo-3.avif', 'Informativo Chico Mendes nº 3, novembro de 2019', { w: 541, h: 709 }),
  informativo: wix('45c6c4_b37eb51701a8468e98df04f156210c0e~mv2.jpeg', 'Descobrir o passado é planejar o futuro', { w: 1200, h: 675 })
}
