export interface EpiItem {
  id: string;
  name: string;
  ca: string;
  category: 'Cabeca & Rosto' | 'Maos & Pele' | 'Corpo & Pes';
  criticalNote: string;
}

export interface ToolItem {
  name: string;
  qty: string;
  usage: string;
}

export interface ToolKit {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  items: ToolItem[];
}

export interface ProcessStep {
  itemNumber: number;
  code: string;
  title: string;
  phase: 'BASE' | 'CAMPO / SEGURANÇA' | 'SISTEMA FS & EXECUÇÃO' | 'FECHAMENTO & ISOLAMENTO';
  durationSec: number;
  description: string;
  bullets: string[];
  criticalInstruction: string;
  diagramType: 'kit-route' | 'sidewalk-cones' | 'fs-three-photos' | 'post-paint-isolation';
  visualStandardCaption: string;
  customImageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PopDocument {
  id: string;
  code: string;
  legacyCode: string;
  title: string;
  shortTitle: string;
  categoryBadge: string;
  status: 'ATIVO — OFICIAL' | 'MODELO PRONTO';
  author: string;
  issueDate: string;
  revision: string;
  reviewDate: string;
  area: string;
  responsible: string;
  approver: string;
  controlRef: string;
  systemUrl: string;
  orientationNote?: string;
  objective: string;
  scope: string;
  definitions: { term: string; meaning: string }[];
  responsibilities: string;
  criticalBanner: {
    title: string;
    description: string;
    badgeText: string;
  };
  epis: EpiItem[];
  toolKits: ToolKit[];
  steps: ProcessStep[];
  quiz: QuizQuestion[];
  revisionHistory: {
    rev: string;
    description: string;
    date: string;
    author: string;
    approver: string;
  }[];
}

export const POPS_DATA: PopDocument[] = [
  {
    id: 'preventiva-totens',
    code: 'POP-OPE-001',
    legacyCode: 'POP-AREA-000',
    title: 'Preventiva de Totens',
    shortTitle: '01 · Preventiva de Totens',
    categoryBadge: 'MANUTENÇÃO PREVENTIVA E CORRETIVA',
    status: 'ATIVO — OFICIAL',
    author: 'Cassiano Moura Silva',
    issueDate: '08/10/2026',
    revision: '00',
    reviewDate: '',
    area: 'Operações',
    responsible: 'Operações | Concessão SP',
    approver: '',
    controlRef: 'Sistema de Gestão da Qualidade - NBR ISO 9001:2015',
    systemUrl: 'https://operacoes.eletromidia.com.br/login',
    objective:
      'Padronizar a manutenção dos totens (Preventiva e Corretiva), garantindo segurança viária/pedonal, conservação estrutural e estética do mobiliário urbano e rastreabilidade fotográfica no Sistema FS.',
    scope:
      'Esse processo abrange a área do Poder Concedente com as demandas das atividades; o Planejamento entrega o cronograma de manutenção, a área de Compras cuida da requisição e fornecimento dos insumos e a equipe técnica operacional realiza a execução e a entrega da manutenção.',
    definitions: [
      { term: 'POP', meaning: 'Procedimento Operacional Padrão' },
      { term: 'SST', meaning: 'Saúde e Segurança do Trabalho' },
      { term: 'EPI', meaning: 'Equipamento de Proteção Individual' },
      { term: 'FS', meaning: 'Sistema Field Service de Operações Eletromidia' },
    ],
    responsibilities:
      'É de responsabilidade do Planejamento criar a roteirização e entregar o cronograma para a operação; a área de Operação é responsável pela execução técnica em campo, registro no Sistema FS e cumprimento dos prazos passados.',
    criticalBanner: {
      title: 'AÇÕES NECESSÁRIAS — ISOLAMENTO PÓS-PINTURA',
      description:
        'Se foi feito um serviço de pintura no equipamento, é obrigatório isolar o perímetro do equipamento com fita zebrada/cones e colar uma sinalização visível de "TINTA FRESCA".',
      badgeText: 'SINALIZAÇÃO OBRIGATÓRIA: TINTA FRESCA',
    },
    epis: [
      {
        id: 'epi-calcado',
        name: 'Calçado de Segurança',
        ca: 'CA 50290',
        category: 'Corpo & Pes',
        criticalNote: 'Biqueira de proteção para obra civil e calçada',
      },
      {
        id: 'epi-capacete',
        name: 'Capacete 3M com Jugular',
        ca: 'CA 29637',
        category: 'Cabeca & Rosto',
        criticalNote: 'Jugular ajustada durante toda a atividade',
      },
      {
        id: 'epi-oculos-incolor',
        name: 'Óculos de Segurança',
        ca: 'CA 14990',
        category: 'Cabeca & Rosto',
        criticalNote: 'Proteção contra projeção de partículas',
      },
      {
        id: 'epi-oculos-carbo',
        name: 'Óculos de Segurança Carbografite',
        ca: 'CA 18246',
        category: 'Cabeca & Rosto',
        criticalNote: 'Uso externo solar e corte/lixamento',
      },
      {
        id: 'epi-protetor-auricular',
        name: 'Protetor Auricular',
        ca: 'CA 18189',
        category: 'Cabeca & Rosto',
        criticalNote: 'Obrigatório ao operar lixadeira e serra mármore',
      },
      {
        id: 'epi-mascara-pff2',
        name: 'Máscara Respiratória PFF2',
        ca: 'CA 39158',
        category: 'Cabeca & Rosto',
        criticalNote: 'Obrigatória em lixamento, cimento e pintura',
      },
      {
        id: 'epi-luva-malha',
        name: 'Luva Malha Pigmentada',
        ca: 'CA 37931',
        category: 'Maos & Pele',
        criticalNote: 'Carga, descarga, enxada, pá e piso podotátil',
      },
      {
        id: 'epi-luva-nitrilica',
        name: 'Luva de Borracha Nitrílica',
        ca: 'CA 25313',
        category: 'Maos & Pele',
        criticalNote: 'Manuseio de tinta, solventes, água e argamassa',
      },
      {
        id: 'epi-luva-multitato',
        name: 'Luva Multitato',
        ca: 'CA 29014',
        category: 'Maos & Pele',
        criticalNote: 'Montagem fina, nível de mão e adesivação',
      },
      {
        id: 'epi-creme',
        name: 'Creme de Proteção Dérmica',
        ca: 'CA 10931',
        category: 'Maos & Pele',
        criticalNote: 'Aplicar antes de manusear tinta e cimento',
      },
      {
        id: 'epi-jaqueta',
        name: 'Jaqueta Eletromidia (Uniforme)',
        ca: 'UNIFORME',
        category: 'Corpo & Pes',
        criticalNote: 'Identificação visual da equipe em via pública',
      },
      {
        id: 'epi-blusa-calca',
        name: 'Blusa & Calça Operacional Preta',
        ca: 'VALIDAR SST',
        category: 'Corpo & Pes',
        criticalNote: 'Uniforme padrão validado junto ao SST',
      },
    ],
    toolKits: [
      {
        id: 'kit-civil',
        code: 'KIT-01',
        title: 'Civil, Base & Piso Podotátil',
        subtitle: 'Reparo de calçada, nivelamento e estrutura metálica (11 itens)',
        items: [
          { name: 'Areia', qty: 'Insumo', usage: 'Preparo de argamassa da base' },
          { name: 'Água', qty: 'Galão', usage: 'Hidratação de massa e limpeza' },
          { name: 'Brita', qty: 'Insumo', usage: 'Regularização de lastro/base' },
          { name: 'Cimento', qty: 'Insumo', usage: 'Assentamento e chumbamento' },
          { name: 'Enxada', qty: '01 un', usage: 'Mistura de massa e limpeza de cava' },
          { name: 'Pá', qty: '01 un', usage: 'Remoção de entulho e dosagem' },
          { name: 'Nível de mão', qty: '01 un', usage: 'Prumo do totem e nivelamento do piso' },
          { name: 'Serra mármore', qty: '01 un', usage: 'Recorte técnico de calçada e piso' },
          { name: 'Piso podotátil', qty: 'Peças', usage: 'Recomposição de acessibilidade no entorno' },
          { name: 'Saco de ráfia', qty: 'Lote', usage: 'Ensacamento e descarte limpo de resíduos' },
          { name: 'Totem metálico', qty: 'Estrutura', usage: 'Elemento/componentes estruturais do ativo' },
        ],
      },
      {
        id: 'kit-pintura',
        code: 'KIT-02',
        title: 'Pintura & Tratamento de Superfície',
        subtitle: 'Preparação, remoção de oxidação e acabamento (04 itens)',
        items: [
          { name: 'Lixadeira', qty: '01 un', usage: 'Desbaste de ferrugem e preparação de base' },
          { name: 'Rolo de Pintura', qty: '01 un', usage: 'Aplicação uniforme nas faces planas do totem' },
          { name: 'Pincel de Pintura', qty: '01 un', usage: 'Recortes, frestas e base junto ao solo' },
          { name: 'Tinta', qty: 'Galão', usage: 'Acabamento padrão Eletromidia / Concessão SP' },
        ],
      },
      {
        id: 'kit-limpeza-adesivos',
        code: 'KIT-03',
        title: 'Limpeza & Sinalização Visual',
        subtitle: 'Higienização final e comunicação de acessibilidade (04 itens)',
        items: [
          { name: 'Vassoura', qty: '01 un', usage: 'Varrição de pó de lixamento e calçada' },
          { name: 'Esfregão', qty: '01 un', usage: 'Lavagem e remoção de manchas do entorno' },
          { name: 'Cadeirante (adesivo)', qty: 'Selo', usage: 'Sinalização obrigatória de acessibilidade' },
          { name: 'Pictograma (adesivo)', qty: 'Selo', usage: 'Identificação técnica regulamentar do totem' },
        ],
      },
    ],
    steps: [
      {
        itemNumber: 1,
        code: 'ETAPA 01',
        title: 'Preparação para Saída (Base Operacional)',
        phase: 'BASE',
        durationSec: 8,
        description:
          'Verificar e conferir todo o kit de ferramentas, materiais e EPIs obrigatórios no veículo e validar a rota no sistema antes de sair para o local.',
        bullets: [
          'Conferir os 3 kits físicos (Civil/Podotátil, Pintura e Limpeza/Adesivos).',
          'Inspecionar integridade e validade dos CAs dos 12 EPIs obrigatórios.',
          'Validar roteirização do Planejamento e ordens abertas no Sistema FS.',
        ],
        criticalInstruction:
          'Nunca sair da base com kit incompleto ou sem conferir a rota do dia no Sistema FS.',
        diagramType: 'kit-route',
        visualStandardCaption:
          'Conferência de Kits (Civil, Pintura, Limpeza) + Rota validada no Sistema FS antes da partida.',
      },
      {
        itemNumber: 2,
        code: 'ETAPA 02',
        title: 'Chegada no Local & Sinalização da Área',
        phase: 'CAMPO / SEGURANÇA',
        durationSec: 10,
        description:
          'Parar o veículo de forma segura na frente do totem. O passageiro desembarca com EPIs, monta o perímetro de sinalização com cones ao redor do carro parado na frente do totem e avisa aos pedestres na calçada sobre a manutenção.',
        bullets: [
          'Estacionar o veículo na frente do totem junto ao meio-fio.',
          'Posicionar os cones formando o perímetro de segurança ao redor do carro parado.',
          'O passageiro orienta os pedestres na calçada informando que haverá manutenção no totem.',
        ],
        criticalInstruction:
          'Obrigatório uso integral de EPIs e sinalização com cones ao redor do veículo antes de retirar as ferramentas.',
        diagramType: 'sidewalk-cones',
        visualStandardCaption:
          'Perímetro de cones posicionado ao redor do carro parado na frente do totem + orientação aos pedestres na calçada.',
      },
      {
        itemNumber: 3,
        code: 'ETAPA 03',
        title: 'Iniciar Atividade no Sistema FS & 3 Fotos Iniciais',
        phase: 'SISTEMA FS & EXECUÇÃO',
        durationSec: 12,
        description:
          'Iniciar a atividade no Sistema FS, registrar as 3 fotos padrões antes da execução (Central, Direita, Esquerda) e preencher o checklist enquanto executa a manutenção.',
        bullets: [
          'Foto 01 — CENTRAL (0°): Visão frontal completa do totem e base no piso podotátil.',
          'Foto 02 — DIREITA (45°): Perfil lateral direito mostrando estrutura e calçada.',
          'Foto 03 — ESQUERDA (45°): Perfil lateral esquerdo nítido, sem logo sobre a imagem.',
          'Preencher o checklist em tempo real durante lixamento, pintura, reparo civil e colagem de adesivos.',
        ],
        criticalInstruction:
          'Insira fotos nítidas e SEM logotipo ou carimbo aplicado sobre a imagem no Sistema FS.',
        diagramType: 'fs-three-photos',
        visualStandardCaption:
          'Geometria obrigatória das 3 fotos (Esquerda 45°, Central 0°, Direita 45°) no Sistema FS.',
      },
      {
        itemNumber: 4,
        code: 'ETAPA 04',
        title: 'Pós-Atividade, 3 Fotos Finais & Isolamento de Pintura',
        phase: 'FECHAMENTO & ISOLAMENTO',
        durationSec: 10,
        description:
          'Registrar as 3 fotos finais (Central, Direita, Esquerda), anexar fotos das avarias informando se foram resolvidas ou não, finalizar o checklist e isolar com placa de "TINTA FRESCA" caso haja pintura.',
        bullets: [
          'Repetir os 3 ângulos padrões finais: Central, Direita e Esquerda após limpeza da área.',
          'Anexar fotos de detalhe das avarias classificando status (Resolvido / Pendente).',
          'Se houve serviço de pintura: manter equipamento isolado e afixar aviso "TINTA FRESCA".',
        ],
        criticalInstruction:
          'AÇÃO NECESSÁRIA: Serviço de pintura exige isolamento físico e fixação da placa "TINTA FRESCA".',
        diagramType: 'post-paint-isolation',
        visualStandardCaption:
          'Registro comparativo Antes/Depois no FS + Isolamento obrigatório com placa "TINTA FRESCA".',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Ao chegar no local de manutenção do totem, quem realiza a sinalização imediata e como deve ser feita?',
        options: [
          'O motorista descarrega as ferramentas primeiro e sinaliza apenas se houver pintura.',
          'O passageiro sinaliza o local com cones, fitas e placas e avisa aos pedestres sobre a manutenção.',
          'A sinalização só é necessária após tirar as 3 fotos iniciais no Sistema FS.',
        ],
        correctIndex: 1,
        explanation:
          'Conforme o Item 2 do POP, após parar o carro na frente do equipamento, o passageiro sinaliza imediatamente o local com cones, fitas e placas e orienta os pedestres.',
      },
      {
        id: 'q2',
        question: 'Quais são os 3 ângulos obrigatórios de fotos no Sistema FS (antes e depois da atividade) e qual a regra de imagem?',
        options: [
          'Central, Direita e Esquerda — fotos nítidas e sem logotipo aplicado sobre a imagem.',
          'Frente, Verso e Topo — com logotipo da Eletromidia colado no canto da foto.',
          'Apenas 1 foto frontal antes e 1 foto da avaria depois.',
        ],
        correctIndex: 0,
        explanation:
          'O padrão exige 3 fotos iniciais e 3 fotos finais (Central, Direita e Esquerda), além das fotos de avarias, todas nítidas e sem logo sobreposto.',
      },
      {
        id: 'q3',
        question: 'Se foi realizado serviço de pintura no totem durante a preventiva, qual ação é obrigatória antes de liberar a equipe?',
        options: [
          'Recolher toda a fita zebrada imediatamente para liberar o toque no totem.',
          'Jogar água sobre a tinta para acelerar a secagem.',
          'Isolar o equipamento e colar uma sinalização visível de "TINTA FRESCA".',
        ],
        correctIndex: 2,
        explanation:
          'Regra crítica de fechamento: sempre que houver pintura, é obrigatório isolar o equipamento e fixar a sinalização de "TINTA FRESCA".',
      },
    ],
    revisionHistory: [
      {
        rev: '',
        description: '',
        date: '',
        author: '',
        approver: '',
      },
    ],
  },
  {
    id: 'lavagem-abrigo-totem',
    code: 'POP-OPE-002',
    legacyCode: 'POP-AREA-002',
    title: 'Lavagem de Abrigo e Totem',
    shortTitle: '02 · Lavagem de Abrigo e Totem',
    categoryBadge: 'HIGIENIZAÇÃO & CONSERVAÇÃO',
    status: 'MODELO PRONTO',
    author: 'Cassiano Moura Silva',
    issueDate: '22/10/2026',
    revision: '00',
    reviewDate: '',
    area: 'Operações',
    responsible: 'Operações | Concessão SP',
    approver: '',
    controlRef: 'Sistema de Gestão da Qualidade - NBR ISO 9001:2015',
    systemUrl: 'https://operacoes.eletromidia.com.br/login',
    objective:
      'Padronizar o procedimento de lavagem técnica, remoção de pichações/adesivos clandestinos e higienização de abrigos de ônibus e totens, garantindo visibilidade dos painéis e segurança dos usuários.',
    scope:
      'Aplica-se às equipes de higienização e conservação da Concessão SP em rotas diurnas e noturnas definidas pelo Planejamento.',
    definitions: [
      { term: 'POP', meaning: 'Procedimento Operacional Padrão' },
      { term: 'SST', meaning: 'Saúde e Segurança do Trabalho' },
      { term: 'EPI', meaning: 'Equipamento de Proteção Individual' },
      { term: 'FS', meaning: 'Sistema Field Service de Operações Eletromidia' },
    ],
    responsibilities:
      'O Planejamento define o cronograma de lavagem por corredor; a equipe técnica executa a higienização sem interromper o embarque seguro de passageiros e registra o Antes/Depois no Sistema FS.',
    criticalBanner: {
      title: 'AÇÕES NECESSÁRIAS — PISO MOLHADO & ENERGIA ELÉTRICA',
      description:
        'Durante a lavagem de abrigos e totens energizados, manter placa de "PISO MOLHADO", nunca direcionar jato de pressão nas frestas de conectores elétricos e secar os vidros/assentos antes da liberação.',
      badgeText: 'SINALIZAÇÃO OBRIGATÓRIA: PISO MOLHADO',
    },
    epis: [
      {
        id: 'epi-bota-pvc',
        name: 'Calçado Impermeável / Segurança',
        ca: 'CA 50290',
        category: 'Corpo & Pes',
        criticalNote: 'Solado antiderrapante para piso molhado',
      },
      {
        id: 'epi-capacete-2',
        name: 'Capacete 3M com Jugular',
        ca: 'CA 29637',
        category: 'Cabeca & Rosto',
        criticalNote: 'Proteção ao limpar cobertura e estrutura superior',
      },
      {
        id: 'epi-oculos-2',
        name: 'Óculos de Segurança Incolor',
        ca: 'CA 14990',
        category: 'Cabeca & Rosto',
        criticalNote: 'Proteção contra respingos de detergente neutro',
      },
      {
        id: 'epi-luva-nitrilica-2',
        name: 'Luva de Borracha Nitrílica Cano Longo',
        ca: 'CA 25313',
        category: 'Maos & Pele',
        criticalNote: 'Proteção química em lavagem e removedor de pichação',
      },
      {
        id: 'epi-protetor-2',
        name: 'Protetor Auricular',
        ca: 'CA 18189',
        category: 'Cabeca & Rosto',
        criticalNote: 'Uso contínuo ao acionar motobomba/lavadora',
      },
      {
        id: 'epi-avental',
        name: 'Uniforme & Capa Impermeável',
        ca: 'VALIDAR SST',
        category: 'Corpo & Pes',
        criticalNote: 'Faixas refletivas para operação em corredores de ônibus',
      },
    ],
    toolKits: [
      {
        id: 'kit-hidro',
        code: 'KIT-01',
        title: 'Lavagem & Hidrojateamento Controlado',
        subtitle: 'Abastecimento de água e esfregação técnica (05 itens)',
        items: [
          { name: 'Reservatório de Água', qty: 'Tanque', usage: 'Enxágue controlado do abrigo e totem' },
          { name: 'Detergente Neutro Biodegradável', qty: '5L', usage: 'Remoção de fuligem urbana e gordura' },
          { name: 'Esfregão e Haste Telescópica', qty: '02 un', usage: 'Lavagem de teto, colunas e face superior' },
          { name: 'Rodo de Borracha + Pano Microfibra', qty: '02 un', usage: 'Secagem sem manchas nos vidros do painel' },
          { name: 'Vassoura de Cerdas Firmes', qty: '01 un', usage: 'Varrição prévia e escoamento de água na sarjeta' },
        ],
      },
      {
        id: 'kit-antipichacao',
        code: 'KIT-02',
        title: 'Remoção de Pichação & Adesivos',
        subtitle: 'Limpeza fina sem agredir pintura ou policarbonato (03 itens)',
        items: [
          { name: 'Removedor Homologado SST', qty: 'Frasco', usage: 'Remoção de tinta spray e marcadores' },
          { name: 'Espátula Plástica Não-Abrasiva', qty: '02 un', usage: 'Remoção de lambe-lambe sem riscar o totem' },
          { name: 'Saco de Ráfia', qty: 'Lote', usage: 'Recolhimento de resíduos sólidos do entorno' },
        ],
      },
    ],
    steps: [
      {
        itemNumber: 1,
        code: 'ETAPA 01',
        title: 'Conferência de Tanque, Químicos e Rota FS',
        phase: 'BASE',
        durationSec: 8,
        description:
          'Conferir nível do reservatório de água, diluição de detergente biodegradável, EPIs impermeáveis e rota de abrigos/totens no Sistema FS.',
        bullets: [
          'Verificar nível de água limpa e funcionamento de mangueiras e engates.',
          'Conferir EPIs impermeáveis (Luva Nitrílica CA 25313 e Óculos CA 14990).',
          'Sincronizar lista de ativos da rota no aplicativo Sistema FS.',
        ],
        criticalInstruction:
          'Proibido utilizar produtos abrasivos ou solventes não homologados que manchem o vidro ou a pintura.',
        diagramType: 'kit-route',
        visualStandardCaption:
          'Checklist de hidrojato, químicos homologados e rota ativa no Sistema FS.',
      },
      {
        itemNumber: 2,
        code: 'ETAPA 02',
        title: 'Sinalização de Calçada & Placa de Piso Molhado',
        phase: 'CAMPO / SEGURANÇA',
        durationSec: 10,
        description:
          'Estacionar sem bloquear a baia de ônibus, posicionar cones e placas de "PISO MOLHADO" e orientar passageiros que aguardam no abrigo.',
        bullets: [
          'Posicionar cones delimitando a área de mangueira para evitar tropeços.',
          'Instalar placa amarela de "PISO MOLHADO" visível em ambos os sentidos da calçada.',
          'Solicitar licença aos usuários presentes antes de iniciar a esfregação úmida.',
        ],
        criticalInstruction:
          'Nunca cruzar mangueiras soltas pela faixa de embarque sem sinalização por cones.',
        diagramType: 'sidewalk-cones',
        visualStandardCaption:
          'Cerco preventivo no abrigo/totem com passagem segura de pedestres.',
      },
      {
        itemNumber: 3,
        code: 'ETAPA 03',
        title: '3 Fotos Iniciais no FS & Lavagem Técnica',
        phase: 'SISTEMA FS & EXECUÇÃO',
        durationSec: 12,
        description:
          'Registrar as 3 fotos iniciais (Central, Direita, Esquerda) no Sistema FS, remover colagens/pichações, lavar de cima para baixo e secar os painéis.',
        bullets: [
          'Tirar as 3 fotos padrões antes da lavagem (Central, Direita e Esquerda).',
          'Executar lavagem no sentido Topo -> Base (cobertura, colunas, vidros, banco e piso).',
          'Passar rodo e microfibra nos vidros do painel publicitário e secar o assento.',
        ],
        criticalInstruction:
          'Não direcionar jato pressurizado sobre caixas de passagem elétrica, sensores ou câmeras do totem.',
        diagramType: 'fs-three-photos',
        visualStandardCaption:
          'Padrão das 3 fotos no Sistema FS + sequência de lavagem Topo -> Base.',
      },
      {
        itemNumber: 4,
        code: 'ETAPA 04',
        title: 'Secagem do Piso, 3 Fotos Finais & Liberação',
        phase: 'FECHAMENTO & ISOLAMENTO',
        durationSec: 10,
        description:
          'Puxar o excesso de água do piso podotátil para a sarjeta, tirar as 3 fotos finais (Central, Direita, Esquerda) e encerrar o checklist no Sistema FS.',
        bullets: [
          'Escoar toda água acumulada no piso podotátil evitando poças escorregadias.',
          'Registrar as 3 fotos finais (Central, Direita e Esquerda) demonstrando transparência e limpeza.',
          'Reportar qualquer avaria estrutural ou vidro trincado identificado durante a lavagem.',
        ],
        criticalInstruction:
          'Retirar cones somente após o piso e os bancos estarem secos e seguros para o público.',
        diagramType: 'post-paint-isolation',
        visualStandardCaption:
          'Comparativo Antes/Depois de higienização e liberação segura do abrigo/totem.',
      },
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'Qual o sentido correto da lavagem técnica e qual o cuidado elétrico crítico no totem/abrigo?',
        options: [
          'De baixo para cima, aplicando jato direto nas frestas do painel digital.',
          'De cima para baixo (Topo -> Base), sem direcionar jato pressurizado em conexões elétricas ou câmeras.',
          'Apenas jogar água sem esfregar e deixar secar naturalmente.',
        ],
        correctIndex: 1,
        explanation:
          'A lavagem deve ser sempre de cima para baixo para não respingar sujeira em áreas já limpas, preservando componentes elétricos.',
      },
    ],
    revisionHistory: [
      {
        rev: '',
        description: '',
        date: '',
        author: '',
        approver: '',
      },
    ],
  },
  {
    id: 'fundacao-totem-abrigo',
    code: 'POP-OPE-003',
    legacyCode: 'POP-AREA-003',
    title: 'Fundação de Totem e Abrigo',
    shortTitle: '03 · Fundação de Totem e Abrigo',
    categoryBadge: 'IMPLANTAÇÃO CIVIL & ESTRUTURA',
    status: 'MODELO PRONTO',
    author: 'Cassiano Moura Silva',
    issueDate: '22/10/2026',
    revision: '00',
    reviewDate: '',
    area: 'Operações',
    responsible: 'Operações | Concessão SP',
    approver: '',
    controlRef: 'Sistema de Gestão da Qualidade - NBR ISO 9001:2015',
    systemUrl: 'https://operacoes.eletromidia.com.br/login',
    objective:
      'Padronizar a execução civil de abertura de cava, posicionamento de gabarito/chumbadores, concretagem de fundação e recomposição de calçada e piso podotátil para Totens e Abrigos.',
    scope:
      'Abrange as equipes de implantação civil e manutenção pesada de infraestrutura na Concessão SP.',
    definitions: [
      { term: 'POP', meaning: 'Procedimento Operacional Padrão' },
      { term: 'SST', meaning: 'Saúde e Segurança do Trabalho' },
      { term: 'EPI', meaning: 'Equipamento de Proteção Individual' },
      { term: 'FS', meaning: 'Sistema Field Service de Operações Eletromidia' },
    ],
    responsibilities:
      'Engenharia/Planejamento fornece projeto de locação e interferências; equipe operacional executa corte, escavação, concretagem e recomposição com registro integral no Sistema FS.',
    criticalBanner: {
      title: 'AÇÕES NECESSÁRIAS — ISOLAMENTO DE CAVA E CURA DE CONCRETO',
      description: '',
      badgeText: 'ISOLAMENTO OBRIGATÓRIO: OBRA CIVIL / CURA',
    },
    epis: [
      {
        id: 'epi-calcado-3',
        name: 'Calçado de Segurança com Biqueira',
        ca: 'CA 50290',
        category: 'Corpo & Pes',
        criticalNote: 'Proteção contra queda de ferramentas, brita e blocos',
      },
      {
        id: 'epi-capacete-3',
        name: 'Capacete 3M com Jugular',
        ca: 'CA 29637',
        category: 'Cabeca & Rosto',
        criticalNote: 'Uso obrigatório em todo o perímetro de obra civil',
      },
      {
        id: 'epi-protetor-3',
        name: 'Protetor Auricular',
        ca: 'CA 18189',
        category: 'Cabeca & Rosto',
        criticalNote: 'Uso durante corte com serra mármore e martelete',
      },
      {
        id: 'epi-mascara-3',
        name: 'Máscara PFF2',
        ca: 'CA 39158',
        category: 'Cabeca & Rosto',
        criticalNote: 'Corte de concreto e manuseio de cimento/areia',
      },
      {
        id: 'epi-oculos-3',
        name: 'Óculos Carbografite / Incolor',
        ca: 'CA 18246',
        category: 'Cabeca & Rosto',
        criticalNote: 'Proteção contra estilhaços de corte de piso',
      },
      {
        id: 'epi-luva-3',
        name: 'Luva Malha Pigmentada & Nitrílica',
        ca: 'CA 37931',
        category: 'Maos & Pele',
        criticalNote: 'Escavação com enxada/pá e manuseio de concreto',
      },
    ],
    toolKits: [
      {
        id: 'kit-fundacao-corte',
        code: 'KIT-01',
        title: 'Corte, Escavação & Gabarito',
        subtitle: 'Abertura técnica de calçada e nivelamento de chumbadores (07 itens)',
        items: [
          { name: 'Serra mármore', qty: '01 un', usage: 'Corte ortogonal limpo do passeio existente' },
          { name: 'Enxada e Pá', qty: '02 un', usage: 'Escavação da cava na cota de projeto' },
          { name: 'Nível de mão e Trena', qty: '02 un', usage: 'Nivelamento do gabarito metálico e cotas' },
          { name: 'Martelete', qty: '01 un', usage: 'Abrir Fundação/Infra' },
          { name: 'Saco de ráfia', qty: 'Lote', usage: 'Ensacamento imediato da terra/entulho escavado' },
          { name: 'Tela Tapume + Cones', qty: 'Kit', usage: 'Fechamento de segurança do perímetro da cava' },
          { name: 'Gerador', qty: '01 un', usage: 'Alimentar Ferramentas elt' },
        ],
      },
      {
        id: 'kit-concretagem',
        code: 'KIT-02',
        title: 'Concretagem & Recomposição Podotátil',
        subtitle: 'Insumos de fundação e acabamento de calçada (06 itens)',
        items: [
          { name: 'Cimento', qty: 'Sacos', usage: 'Traço estrutural da base do totem/abrigo' },
          { name: 'Areia e Brita', qty: 'Insumo', usage: 'Agregados para concreto e contrapiso' },
          { name: 'Água', qty: 'Galão', usage: 'Amassamento no traço especificado' },
          { name: 'Piso podotátil', qty: 'Peças', usage: 'Recomposição de alerta e direcional no entorno' },
          { name: 'Vassoura', qty: '01 un', usage: 'Limpeza final da calçada após acabamento' },
          { name: 'Masseira', qty: '01 un', usage: 'Bater massa' },
        ],
      },
    ],
    steps: [
      {
        itemNumber: 1,
        code: 'ETAPA 01',
        title: 'Conferência de Ferramentas, Gerador, Insumos e Rota FS',
        phase: 'BASE',
        durationSec: 8,
        description:
          'Conferir na base o KIT-01 (Serra mármore, Martelete, Gerador, Enxada/Pá, Nível/Trena, Sacos de ráfia e Tela Tapume + Cones), o KIT-02 (Cimento, Areia, Brita, Água, Masseira, Piso podotátil e Vassoura), os EPIs e a ordem de serviço no Sistema FS.',
        bullets: [
          'Validar funcionamento do Gerador, Serra mármore e Martelete antes de carregar o veículo.',
          'Conferir quantitativo de Cimento, Areia, Brita, Água, Masseira e peças de Piso podotátil.',
          'Checar EPIs obrigatórios (PFF2, Protetor Auricular, Óculos, Luvas, Capacete e Botina) e croqui no Sistema FS.',
        ],
        criticalInstruction:
          'Nunca sair da base sem testar o Gerador e Martelete ou sem conferir o croqui de locação no Sistema FS.',
        diagramType: 'kit-route',
        visualStandardCaption:
          'Conferência do KIT-01 (Serra mármore, Martelete, Gerador) + KIT-02 (Concretagem e Masseira) + Rota no Sistema FS.',
      },
      {
        itemNumber: 2,
        code: 'ETAPA 02',
        title: 'Chegada no Local, Cones no Veículo & Cerco de Obra na Calçada',
        phase: 'CAMPO / SEGURANÇA',
        durationSec: 10,
        description:
          'Estacionar o veículo de apoio na frente do ponto de fundação, montar o perímetro de cones ao redor do carro parado, fechar a área de escavação na calçada com Tela Tapume e Cones e orientar os pedestres.',
        bullets: [
          'Posicionar os cones formando o perímetro de segurança ao redor do veículo estacionado junto ao meio-fio.',
          'Montar cerco fechado com Tela Tapume + Cones ao redor da futura cava, preservando corredor seguro para pedestres.',
          'Posicionar o Gerador e os Sacos de ráfia dentro da área isolada e equipar Protetor Auricular, PFF2 e Óculos.',
        ],
        criticalInstruction:
          'Proibido iniciar o corte de calçada sem o cerco completo de cones ao redor do veículo e Tela Tapume na área da cava.',
        diagramType: 'sidewalk-cones',
        visualStandardCaption:
          'Perímetro de cones ao redor do carro parado na frente da obra + isolamento da cava na calçada com Tela Tapume.',
      },
      {
        itemNumber: 3,
        code: 'ETAPA 03',
        title: '3 Fotos Iniciais FS, Corte com Serra Mármore, Martelete e Escavação',
        phase: 'SISTEMA FS & EXECUÇÃO',
        durationSec: 12,
        description:
          'Iniciar a atividade no Sistema FS, tirar as 3 fotos iniciais (Central, Direita, Esquerda), ligar o Gerador para cortar o passeio com Serra mármore e abrir a fundação/infra com Martelete, escavando com Enxada e Pá.',
        bullets: [
          'Registrar as 3 fotos padrões no Sistema FS (Central 0°, Direita 45° e Esquerda 45°) antes de abrir o piso, sem logo sobre a imagem.',
          'Acionar o Gerador, realizar o corte ortogonal da calçada com Serra mármore e quebrar o piso/infra com o Martelete.',
          'Escavar a cava na cota de projeto com Enxada e Pá, ensacando imediatamente toda a terra e entulho em Sacos de ráfia.',
          'Conferir profundidade, alinhamento e nivelamento da base/gabarito com Trena e Nível de mão.',
        ],
        criticalInstruction:
          'Proibido deixar entulho ou terra soltos na calçada: todo material escavado deve ser ensacado imediatamente em Sacos de ráfia.',
        diagramType: 'fs-three-photos',
        visualStandardCaption:
          '3 fotos iniciais no Sistema FS + abertura de fundação/infra com Gerador, Serra mármore, Martelete, Enxada/Pá e Nível.',
      },
      {
        itemNumber: 4,
        code: 'ETAPA 04',
        title: 'Preparo na Masseira, Concretagem, Piso Podotátil, 3 Fotos Finais & Cura',
        phase: 'FECHAMENTO & ISOLAMENTO',
        durationSec: 10,
        description:
          'Bater a massa/concreto na Masseira (Cimento, Areia, Brita e Água), concretar a fundação conferindo o Nível de mão, recompor a calçada e o Piso podotátil, varrer o local, registrar as 3 fotos finais no Sistema FS e isolar para cura.',
        bullets: [
          'Bater o concreto na Masseira com Cimento, Areia, Brita e Água, lançar na cava e validar o prumo/nível com Nível de mão.',
          'Assentar e alinhar o Piso podotátil e o acabamento do passeio no entorno da fundação.',
          'Varrer toda a calçada com Vassoura, recolher os Sacos de ráfia e registrar as 3 fotos finais no Sistema FS (Central, Direita e Esquerda).',
          'Manter a base recém-concretada isolada com Tela Tapume e Cones até atingir a cura segura do concreto.',
        ],
        criticalInstruction:
          'AÇÃO NECESSÁRIA: Manter o perímetro da fundação recém-concretada isolado com Tela Tapume e Cones durante o período de cura.',
        diagramType: 'post-paint-isolation',
        visualStandardCaption:
          'Concretagem preparada na Masseira, recomposição de Piso podotátil, 3 fotos finais no FS e isolamento de cura da base.',
      },
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'Quais equipamentos são utilizados na Etapa 3 para abrir a fundação/infra e como deve ser tratado o entulho gerado?',
        options: [
          'Apenas ferramentas manuais, deixando a terra empilhada solta no meio-fio até o dia seguinte.',
          'Gerador alimentando a Serra mármore e o Martelete, com escavação por Enxada/Pá e ensacamento imediato em Sacos de ráfia.',
          'Lixadeira e rolo de pintura, descartando resíduos no canteiro próximo.',
        ],
        correctIndex: 1,
        explanation:
          'A abertura técnica utiliza Gerador, Serra mármore e Martelete para abrir a fundação/infra, e todo o material escavado com Enxada e Pá vai direto para Sacos de ráfia.',
      },
      {
        id: 'q3-2',
        question: 'Na Etapa 4 da Fundação de Totem e Abrigo, onde deve ser preparado o concreto e o que deve ser feito após a recomposição do piso podotátil?',
        options: [
          'Misturar direto no chão da calçada sem limpar e liberar o trânsito sobre o concreto mole.',
          'Bater a massa na Masseira (Cimento, Areia, Brita e Água), concretar nivelado, recompor o Piso podotátil, varrer, tirar as 3 fotos finais no FS e isolar a base para cura.',
          'Colar placa de Tinta Fresca no totem sem tirar fotos finais no Sistema FS.',
        ],
        correctIndex: 1,
        explanation:
          'O concreto é batido na Masseira, lançado e nivelado, seguido da recomposição do Piso podotátil, limpeza com Vassoura, 3 fotos finais no FS e isolamento com Tela Tapume + Cones para cura.',
      },
      {
        id: 'q3-3',
        question: 'Quais são os 3 ângulos fotográficos obrigatórios no Sistema FS antes da abertura da cava (Etapa 3) e após a concretagem/acabamento (Etapa 4)?',
        options: [
          'Central (0°), Direita (45°) e Esquerda (45°), nítidas e sem logotipo sobreposto.',
          'Apenas 1 foto de cima da cava com logotipo aplicado.',
          'Não é necessário tirar fotos no Sistema FS em obras civis de fundação.',
        ],
        correctIndex: 0,
        explanation:
          'O padrão operacional exige sempre 3 fotos iniciais e 3 fotos finais (Central, Direita e Esquerda) nítidas e sem marca d’água.',
      },
    ],
    revisionHistory: [
      {
        rev: '',
        description: '',
        date: '',
        author: '',
        approver: '',
      },
    ],
  },
];
