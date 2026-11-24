/**
 * Normas referidas na apresentação institucional.
 *
 * RESTRIÇÃO DE RIGOR, igual à versão inglesa: são as normas segundo as quais
 * a ABCE trabalha e adquire produtos. Nada aqui afirma que a própria ABCE
 * detém certificação em qualquer uma delas. Essa distinção é declarada
 * explicitamente na página de Qualidade e não pode ser atenuada.
 */
export const families = [
  {
    id: 'api', body: 'API', name: 'American Petroleum Institute', image: 'qual-standards',
    coverage: 'Normas de equipamento petrolífero',
    outputs: 'Tubos de condutas, revestimento, tubagem, equipamento de perfuração',
    intro: 'Aplicadas a equipamento de campo petrolífero e de condutas, em que a especificação rege o fabrico, a classe de pressão e o ensaio do próprio artigo.',
    entries: [
      { code: 'API Spec 5L', scope: 'Tubo de linha para sistemas de transporte por conduta nas indústrias do petróleo e gás natural.' },
      { code: 'API Spec 6A', scope: 'Equipamento de cabeça de poço e árvore de natal para serviço de perfuração e produção.' },
      { code: 'API Spec 6D', scope: 'Válvulas para condutas e tubagem, incluindo concepção, fabrico e ensaio.' },
      { code: 'Equipamento de perfuração', scope: 'Equipamento de perfuração adquirido segundo as especificações API aplicáveis.' },
    ],
  },
  {
    id: 'asme', body: 'ASME', name: 'American Society of Mechanical Engineers', image: 'qual-inspection',
    coverage: 'Códigos de equipamento sob pressão e tubagem',
    outputs: 'Reservatórios sob pressão, caldeiras, componentes de tubagem, flanges',
    intro: 'Aplicadas a equipamento sob pressão e aos sistemas de tubagem em seu redor, em que concepção, materiais e inspecção são regidos por código.',
    entries: [
      { code: 'Equipamento sob pressão', scope: 'Reservatórios e equipamento sob pressão fornecidos segundo requisitos ASME.' },
      { code: 'Caldeiras', scope: 'Caldeiras e respectivos componentes sob pressão.' },
      { code: 'Componentes de tubagem', scope: 'Componentes de tubagem para sistemas de processo e de utilidades.' },
      { code: 'Flanges', scope: 'Flanges, normas dimensionais e classes de pressão.' },
    ],
  },
  {
    id: 'iso', body: 'ISO', name: 'International Organization for Standardization', image: 'about-facility',
    coverage: 'Sistemas de gestão',
    outputs: 'Alinhamento com ISO 9001, ISO 14001 e ISO 45001',
    intro: 'Normas de sistemas de gestão que moldam a forma como são conduzidas as vertentes de aprovisionamento, qualidade, ambiente e segurança da operação. A empresa descreve a sua posição aqui como alinhamento.',
    entries: [
      { code: 'ISO 9001', scope: 'Sistemas de gestão da qualidade.' },
      { code: 'ISO 14001', scope: 'Sistemas de gestão ambiental.' },
      { code: 'ISO 45001', scope: 'Sistemas de gestão da segurança e saúde no trabalho.' },
    ],
  },
  {
    id: 'astm-en', body: 'ASTM e EN', name: 'ASTM International e Normas Europeias', image: 'cat-civil-structural',
    coverage: 'Materiais civis e estruturais',
    outputs: 'Varão de aço, perfis de aço estrutural, fixadores',
    intro: 'Normas de material para o fornecimento civil, estrutural e de fixação, em que o grau e as propriedades mecânicas determinam se o material serve a estrutura.',
    entries: [
      { code: 'Materiais civis e estruturais', scope: 'Normas de material para fornecimento civil e estrutural.' },
      { code: 'Varão de aço', scope: 'Graus e propriedades mecânicas do varão de armadura.' },
      { code: 'Aço estrutural', scope: 'Graus e perfis correntes de aço estrutural.' },
      { code: 'Fixadores industriais', scope: 'Especificações de parafusos, porcas, anilhas e chumbadouros.' },
    ],
  },
];
