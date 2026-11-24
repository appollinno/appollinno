/** Seis sectores, com a realidade de aprovisionamento de cada um. */
export const industries = [
  {
    id: 'energy', name: 'Energia', image: 'ind-energy', icon: 'zap',
    summary: 'Activos de produção e transporte de energia, em que uma paragem tem um custo por hora e o equipamento eléctrico tem de corresponder ao sistema instalado, e não apenas assemelhar-se a ele.',
    capabilities: [
      'Fornecimento de aparelhagem de manobra, transformadores e cabos de alta tensão',
      'Motores, quadros de comando e dispositivos de monitorização de processo',
      'Sobressalentes críticos mantidos contra datas de paragem programada',
      'Aquisição acelerada para paragens não programadas',
    ],
  },
  {
    id: 'oil-gas', name: 'Petróleo e Gás', image: 'ind-oil-gas', icon: 'flame',
    summary: 'Trabalhos a montante, intermédios e a jusante, em que os artigos sob pressão são regidos por código e a documentação faz parte do produto.',
    capabilities: [
      'Tubo de linha, revestimento, tubagem, flanges e acessórios',
      'Válvulas e equipamento de cabeça de poço segundo especificações API',
      'Equipamento eléctrico para zonas classificadas',
      'Documentação de material e de ensaio recolhida com a mercadoria',
    ],
  },
  {
    id: 'mining', name: 'Mineração', image: 'ind-mining', icon: 'mountain',
    summary: 'Operações remotas, em que o difícil não é encontrar a peça mas colocá-la em obra, através de um porto e de uma fronteira, antes de a instalação estar à espera dela.',
    capabilities: [
      'Equipamento de amarração, elevação e movimentação de materiais',
      'Materiais estruturais a granel e consumíveis de desgaste',
      'Transporte interno até obras remotas após o desembaraço',
      'Stock em consignação próximo da operação',
    ],
  },
  {
    id: 'processing', name: 'Processamento', image: 'ind-processing', icon: 'factory',
    summary: 'Instalações de processo contínuo, em que a metalurgia tem de servir o meio e uma escolha errada de material é uma falha por corrosão alguns meses depois.',
    capabilities: [
      'Fornecimento em aço carbono, aço inoxidável e ligas exóticas',
      'Bombas, válvulas e equipamento de controlo de caudal',
      'Juntas, vedantes, rolamentos e peças originais',
      'Clarificação da especificação antes da colocação da encomenda',
    ],
  },
  {
    id: 'industrial', name: 'Operações Industriais', image: 'ind-industrial', icon: 'cog',
    summary: 'Indústria transformadora e pesada, em que a manutenção assenta em consumíveis recorrentes e o custo de uma ruptura de stock é uma linha parada.',
    capabilities: [
      'Ferramenta eléctrica, pneumática, hidráulica e de binário',
      'Máquinas de soldar, compressores e geradores',
      'Planos de fornecimento para linhas de consumíveis recorrentes',
      'Gestão de stocks contra pontos de encomenda',
    ],
  },
  {
    id: 'construction', name: 'Construção', image: 'ind-construction', icon: 'hard-hat',
    summary: 'Empreitadas em que o material tem de chegar na sequência certa e na quantidade certa, faseado segundo o programa e não entregue tudo de uma vez.',
    capabilities: [
      'Aço estrutural, varão, cimento e agregados',
      'Betume, adjuvantes para betão e perfis pré-fabricados',
      'Parafusos, porcas, anilhas e sistemas de ancoragem',
      'Entrega faseada segundo a sequência construtiva',
    ],
  },
];
