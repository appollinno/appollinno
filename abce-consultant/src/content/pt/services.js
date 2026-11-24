/** Dez serviços e o fluxo de aprovisionamento em seis passos, em português. */
export const services = [
  {
    id: 'end-to-end-procurement', ref: '01', name: 'Aprovisionamento Integral', icon: 'clipboard-list',
    summary: 'Levamos uma requisição da especificação até à mercadoria entregue: clarificamos a exigência técnica, adquirimo-la, controlamos a sua qualidade e movimentamo-la até à obra, como um único âmbito pelo qual respondemos.',
    points: [
      'Clarificação técnica e comercial da requisição',
      'Identificação de fornecedores, consulta e comparação de propostas',
      'Colocação da encomenda e acompanhamento de prazos',
      'Um único responsável até à entrega',
    ],
  },
  {
    id: 'certified-product-sourcing', ref: '02', name: 'Fornecimento de Produtos Certificados', icon: 'badge-check',
    summary: 'Equipamento e materiais adquiridos segundo a norma que a sua aplicação exige, com a documentação de material e de conformidade que torna o artigo utilizável num sistema regulado.',
    points: [
      'Aquisição segundo especificações API, ASME, ISO, ASTM e EN',
      'Certificados de material e documentação de ensaio recolhidos com a mercadoria',
      'Rastreabilidade do fornecedor até ao artigo entregue',
      'Clarificação de grau, classe e condições de serviço antes da encomenda',
    ],
  },
  {
    id: 'quality-inspection', ref: '03', name: 'Inspecção de Qualidade', icon: 'search-check',
    summary: 'A mercadoria é verificada contra a encomenda e a especificação antes de ser aceite — e não depois de ter chegado a uma obra remota e parado o seu trabalho.',
    points: [
      'Verificação contra a nota de encomenda e a folha de especificação',
      'Controlo dimensional, de marcação e de documentação',
      'Não conformidades levantadas e resolvidas com o fornecedor',
      'Registos de inspecção emitidos com a remessa',
    ],
  },
  {
    id: 'global-freight-forwarding', ref: '04', name: 'Transporte Internacional', icon: 'ship',
    summary: 'Movimentos marítimos, aéreos e rodoviários organizados para a carga que tem de facto, incluindo artigos fora de medida e cargas pesadas que não viajam num contentor normal.',
    points: [
      'Organização de transporte marítimo, aéreo e rodoviário',
      'Carga fraccionada, fora de gabarito, sobredimensionada e pesada',
      'Entregas urgentes quando o prazo é crítico',
      'Consolidação de encomendas de vários fornecedores numa só expedição',
      'Via e modo escolhidos em função da data necessária em obra',
      'Acesso fiável a destinos remotos e de segurança reforçada',
    ],
  },
  {
    id: 'customs-clearance', ref: '05', name: 'Desembaraço Aduaneiro', icon: 'stamp',
    summary: 'O desembaraço é tratado como parte da entrega, para que uma remessa não fique parada na fronteira enquanto uma questão de classificação é resolvida por alguém que nunca viu a mercadoria.',
    points: [
      'Classificação pautal e apuramento de direitos',
      'Submissão e acompanhamento das declarações de desembaraço',
      'Coordenação com porto, terminal e inspecção',
      'Libertação e transporte subsequente até à obra',
    ],
  },
  {
    id: 'documentation', ref: '06', name: 'Documentação de Importação e Exportação', icon: 'file-text',
    summary: 'O conjunto documental que acompanha a carga, preparado e verificado quanto à coerência — porque uma divergência entre a factura e a lista de embalagem é um atraso, não um pormenor administrativo.',
    points: [
      'Facturas comerciais, listas de embalagem e certificados de origem',
      'Conhecimentos de embarque e guias aéreas',
      'Verificação da coerência documental antes da expedição',
      'Conjunto documental completo entregue ao destinatário',
    ],
  },
  {
    id: 'warehousing', ref: '07', name: 'Armazenagem', icon: 'warehouse',
    summary: 'Armazenagem e movimentação entre a chegada e o momento em que o material é necessário, com mercadoria recebida, registada e protegida de acordo com aquilo que é.',
    points: [
      'Recepção, inspecção e arrumação',
      'Armazenagem e preservação adequadas à natureza do material',
      'Preparação e aviamento de encomendas para expedição',
      'Registos de stock reconciliados com as existências físicas',
    ],
  },
  {
    id: 'inventory-management', ref: '08', name: 'Gestão de Stocks', icon: 'boxes',
    summary: 'Visibilidade e controlo sobre o que mantém em stock, para que os sobressalentes críticos estejam disponíveis quando uma máquina pára e não haja capital imobilizado em material que ninguém vai requisitar.',
    points: [
      'Stock mantido contra níveis mínimos e pontos de encomenda acordados',
      'Planos de fornecimento para consumíveis recorrentes',
      'Relatórios de existências, movimentos e consumos',
      'Sobressalentes críticos identificados e mantidos antes da necessidade',
    ],
  },
  {
    id: 'critical-delivery', ref: '09', name: 'Coordenação de Entregas Críticas', icon: 'route',
    summary: 'Quando uma data não pode mudar, o movimento é planeado a partir dela, para trás, e conduzido activamente — prontidão do fornecedor, transporte, desembaraço e o último troço até à obra, geridos em conjunto.',
    points: [
      'Entrega planeada a partir da data necessária em obra, para trás',
      'Acompanhamento da prontidão e da expedição do fornecedor',
      'Seguimento activo com escalonamento de excepções',
      'Coordenação do último troço até obras remotas e de acesso condicionado',
    ],
  },
  {
    id: 'emergency-support', ref: '10', name: 'Apoio de Emergência 24/7', icon: 'phone-call',
    summary: 'As avarias não esperam pelo horário de expediente. As necessidades urgentes são recebidas, resolvidas e movimentadas fora do horário normal quando a produção ou a segurança dependem disso.',
    points: [
      'Gestor de conta dedicado disponível a qualquer hora',
      'Contacto fora de horas para necessidades urgentes',
      'Aquisição de emergência e expedição acelerada para avarias e paragens',
      'A via mais rápida viável até à obra',
      'Caminho de escalonamento até à resolução',
    ],
  },
];

export const workflow = [
  { title: 'Definir requisitos e exigências de conformidade',
    body: 'Estabelecemos exactamente o que o artigo tem de fazer e que norma o rege — grau, classe, condições de serviço, classificação de área e a documentação que o sistema receptor exige.' },
  { title: 'Adquirir junto de fornecedores avaliados',
    body: 'As consultas seguem para fornecedores avaliados para o produto em causa, e as propostas são comparadas pela conformidade com a especificação e pelo prazo, não apenas pelo preço.' },
  { title: 'Executar a garantia de qualidade',
    body: 'A documentação de material e de conformidade é recolhida e verificada contra a especificação antes de a mercadoria ser aceite, para que as não conformidades apareçam no fornecedor e não em obra.' },
  { title: 'Realizar a inspecção antes da expedição',
    body: 'A remessa é verificada contra a encomenda e a folha de especificação, com controlo dimensional, de marcação, de quantidade e de embalagem registado antes de sair.' },
  { title: 'Coordenar logística e desembaraço',
    body: 'Transporte, documentação e desembaraço são organizados como uma só cadeia, com a via escolhida em função da data necessária em obra e não dos tempos de trânsito por defeito.' },
  { title: 'Apoiar o abastecimento e a gestão de stocks',
    body: 'A mercadoria é recebida, registada e mantida ou entregue em obra, com os registos de stock reconciliados e as linhas recorrentes mantidas contra um plano de fornecimento acordado.' },
];
