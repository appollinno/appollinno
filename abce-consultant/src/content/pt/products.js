/**
 * Cinco linhas de produto, em português (Moçambique).
 *
 * Mesma estrutura que src/content/products.js. A terminologia segue o uso
 * europeu/moçambicano: "betume" e não "asfalto", "varão" e não "vergalhão",
 * "lingas" para slings, "manilhas" para shackles, "aprovisionamento" para
 * procurement.
 */
export const categories = [
  {
    id: 'civil-structural',
    ref: '01',
    name: 'Materiais a Granel Civis e Estruturais',
    short: 'Civis e Estruturais',
    image: 'cat-civil-structural',
    summary:
      'Materiais de construção e estruturais para trabalhos de obra, fundações, estruturas metálicas e construção rodoviária — fornecidos nos volumes e no faseamento de entrega em que um programa de construção realmente assenta.',
    note:
      'Os materiais a granel são cotados contra a sua especificação, grau e mapa de quantidades, com entregas faseadas segundo a sequência construtiva.',
    details: [
      { img: 'sub-steel-beams', cap: 'Perfis de aço estrutural' },
      { img: 'sub-rebar', cap: 'Varão de aço' },
    ],
    groups: [
      {
        heading: 'Aço estrutural',
        items: [
          'Vigas de aço estrutural',
          'Perfis de aço pré-fabricados',
          'Estruturas de aço pré-concebidas',
          'Painéis sandwich',
          'Secções compostas fabricadas à medida',
        ],
      },
      {
        heading: 'Betão e armaduras',
        items: ['Varão de aço', 'Cimento', 'Agregados', 'Adjuvantes especiais para betão'],
      },
      { heading: 'Vias e pavimentos', items: ['Betume'] },
      {
        heading: 'Fixação e ancoragem',
        items: [
          'Parafusos, porcas, anilhas e chumbadouros',
          'Parafusos de alta resistência',
          'Varões roscados',
          'Fixadores industriais de alta resistência',
        ],
      },
    ],
  },
  {
    id: 'mechanical-piping',
    ref: '02',
    name: 'Mecânica, Tubagem e Controlo de Caudal',
    short: 'Mecânica e Tubagem',
    image: 'cat-mechanical-piping',
    summary:
      'Equipamento sob pressão e de controlo de caudal para sistemas de processo, condutas e utilidades, em aço carbono, aço inoxidável e ligas exóticas.',
    note:
      'Os artigos sob pressão são adquiridos segundo as especificações API e ASME aplicáveis ao serviço, com a documentação de material e de ensaio incluída.',
    details: [
      { img: 'sub-valves', cap: 'Válvulas industriais' },
      { img: 'sub-flanges-fittings', cap: 'Flanges e acessórios' },
      { img: 'sub-pumps', cap: 'Bombas centrífugas' },
    ],
    groups: [
      { heading: 'Tubos, revestimento e tubagem', items: ['Tubos de condutas', 'Revestimento e tubagem de poço'] },
      { heading: 'Flanges e acessórios', items: ['Flanges e acessórios'] },
      { heading: 'Materiais de construção', items: ['Aço carbono', 'Aço inoxidável', 'Ligas exóticas'] },
      { heading: 'Controlo de caudal', items: ['Válvulas industriais'] },
      { heading: 'Equipamento rotativo', items: ['Bombas centrífugas e volumétricas'] },
      { heading: 'Vedação e sobressalentes', items: ['Rolamentos, juntas, vedantes e peças originais (OEM)'] },
    ],
  },
  {
    id: 'rigging-lifting',
    ref: '03',
    name: 'Equipamento de Amarração e Elevação',
    short: 'Amarração e Elevação',
    image: 'cat-rigging-lifting',
    summary:
      'Acessórios de amarração e equipamento de elevação para cargas pesadas, paragens programadas e movimentação corrente — onde a carga máxima de utilização e a respectiva certificação são tudo.',
    note:
      'O equipamento de elevação é material com carga nominal. É adquirido com a certificação do fabricante aplicável ao artigo, e confirmamos consigo que documentação o acompanha antes da encomenda.',
    details: [
      { img: 'sub-wire-rope', cap: 'Cabo de aço' },
      { img: 'sub-chain-hoist', cap: 'Diferenciais de corrente e de alavanca' },
    ],
    groups: [
      { heading: 'Lingas', items: ['Lingas de cabo de aço', 'Lingas de cinta sintética', 'Lingas de corrente de liga'] },
      {
        heading: 'Acessórios de ligação',
        items: [
          'Manilhas de alta resistência',
          'Esticadores',
          'Ganchos de elevação',
          'Destorcedores',
          'Olhais',
          'Terminais',
          'Elos mestres',
        ],
      },
      { heading: 'Elevação', items: ['Diferenciais de corrente', 'Diferenciais de alavanca'] },
      { heading: 'Acessórios sob o gancho', items: ['Grampos de viga', 'Vigas espalhadoras', 'Cadernais'] },
    ],
  },
  {
    id: 'electrical',
    ref: '04',
    name: 'Sistemas e Componentes Eléctricos',
    short: 'Sistemas Eléctricos',
    image: 'sub-transformer',
    summary:
      'Equipamento de distribuição de energia, comando e instrumentação para sistemas eléctricos de instalação e de obra, incluindo invólucros para zonas classificadas.',
    note:
      'O equipamento para zonas classificadas é especificado segundo a sua classificação de área, grau de protecção e classe de temperatura. Confirme estes dados connosco antes de encomendar.',
    details: [
      { img: 'cat-electrical', cap: 'Instalação de distribuição' },
      { img: 'sub-hv-cable', cap: 'Transporte de alta tensão' },
    ],
    groups: [
      { heading: 'Distribuição de energia', items: ['Cabos de alta tensão', 'Aparelhagem de manobra', 'Transformadores'] },
      { heading: 'Motores e iluminação', items: ['Motores', 'Iluminação industrial'] },
      { heading: 'Zonas classificadas', items: ['Invólucros antideflagrantes'] },
      { heading: 'Comando e instrumentação', items: ['Quadros de comando', 'Dispositivos de monitorização de processo'] },
    ],
  },
  {
    id: 'tools-consumables',
    ref: '05',
    name: 'Ferramentas, Equipamento Operacional e Consumíveis',
    short: 'Ferramentas e Consumíveis',
    image: 'cat-tools-consumables',
    summary:
      'As ferramentas, o equipamento de obra e os consumíveis recorrentes que mantêm a manutenção, a fabricação e as paragens em andamento — incluindo material de segurança para as equipas que fazem o trabalho.',
    note:
      'Os consumíveis são os artigos mais frequentemente necessários com pouca antecedência. Mantemos em stock as linhas recorrentes contra um plano de fornecimento acordado, quando isso se adequa à sua operação.',
    details: [
      { img: 'sub-welding', cap: 'Equipamento de soldadura' },
      { img: 'sub-generator', cap: 'Grupos geradores' },
    ],
    groups: [
      {
        heading: 'Ferramenta manual e eléctrica',
        items: [
          'Ferramentas eléctricas',
          'Ferramentas pneumáticas',
          'Ferramentas hidráulicas',
          'Ferramentas de binário',
          'Ferramentas manuais de alta resistência',
        ],
      },
      { heading: 'Equipamento de obra', items: ['Máquinas de soldar', 'Compressores de ar', 'Geradores'] },
      { heading: 'Soldadura e abrasivos', items: ['Eléctrodos de soldadura', 'Abrasivos'] },
      { heading: 'Fluidos e químicos', items: ['Lubrificantes', 'Produtos químicos industriais', 'Adesivos'] },
      { heading: 'Segurança', items: ['Equipamento de protecção e segurança (HSE)'] },
    ],
  },
];

export const categoryOptions = categories.map((c) => c.name);
