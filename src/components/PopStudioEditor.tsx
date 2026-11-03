import React, { useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Check,
  FileText,
  ShieldCheck,
  Wrench,
  ListChecks,
  HelpCircle,
  History,
  ImagePlus,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Play,
  ClipboardCheck,
  Pencil,
  FolderPlus,
} from 'lucide-react';
import {
  EpiItem,
  POPS_DATA,
  PopDocument,
  ProcessStep,
  QuizQuestion,
  ToolItem,
  ToolKit,
} from '../data/pops';
import { TechnicalDiagram } from './TechnicalDiagrams';

interface PopStudioEditorProps {
  popsList: PopDocument[];
  currentPop: PopDocument;
  isCreatingNew: boolean;
  isModified: boolean;
  isCustomCreated: boolean;
  deletedDefaultsCount?: number;
  onRestoreDeletedDefaults?: () => void;
  onSelectPop: (popId: string) => void;
  onStartCreateNew: (templatePop?: PopDocument) => void;
  onSavePop: (pop: PopDocument, isNew: boolean) => void;
  onDeletePop: (popId: string) => void;
  onResetDefaultPop: (popId: string) => void;
  onOpenInlineA4Editor: () => void;
  onExitEditor: (targetFormat?: 'remotion' | 'playbook' | 'iso-pdf') => void;
}

type EditorSection =
  | 'identificacao'
  | 'normativo'
  | 'epis'
  | 'ferramentas'
  | 'etapas'
  | 'quiz-revisoes';

const EPI_PRESETS: Omit<EpiItem, 'id'>[] = [
  {
    name: 'Capacete 3M com Jugular',
    ca: 'CA 29637',
    category: 'Cabeca & Rosto',
    criticalNote: 'Jugular ajustada durante toda a atividade',
  },
  {
    name: 'Calçado de Segurança',
    ca: 'CA 50290',
    category: 'Corpo & Pes',
    criticalNote: 'Biqueira de proteção para obra civil e calçada',
  },
  {
    name: 'Óculos de Segurança Incolor',
    ca: 'CA 14990',
    category: 'Cabeca & Rosto',
    criticalNote: 'Proteção contra projeção de partículas e respingos',
  },
  {
    name: 'Luva de Borracha Nitrílica',
    ca: 'CA 25313',
    category: 'Maos & Pele',
    criticalNote: 'Manuseio de químicos, tintas, água e argamassa',
  },
  {
    name: 'Luva Malha Pigmentada',
    ca: 'CA 37931',
    category: 'Maos & Pele',
    criticalNote: 'Carga, descarga, ferramentas manuais e alvenaria',
  },
  {
    name: 'Protetor Auricular',
    ca: 'CA 18189',
    category: 'Cabeca & Rosto',
    criticalNote: 'Obrigatório ao operar equipamentos ruidosos',
  },
  {
    name: 'Máscara Respiratória PFF2',
    ca: 'CA 39158',
    category: 'Cabeca & Rosto',
    criticalNote: 'Proteção contra poeira, lixamento, cimento e vapores',
  },
];

export function createBlankPopTemplate(nextNumber: number, basePop?: PopDocument): PopDocument {
  const today = new Date().toLocaleDateString('pt-BR');
  const paddedNum = String(nextNumber).padStart(3, '0');
  const shortNum = String(nextNumber).padStart(2, '0');

  if (basePop) {
    const newId = `pop-custom-${Date.now()}`;
    return {
      ...JSON.parse(JSON.stringify(basePop)),
      id: newId,
      code: `POP-OPE-${paddedNum}`,
      legacyCode: `POP-AREA-${paddedNum}`,
      title: `${basePop.title} (Cópia)`,
      shortTitle: `${shortNum} · ${basePop.title} (Cópia)`,
      issueDate: today,
      reviewDate: today,
      revision: '00',
    };
  }

  return {
    id: `pop-custom-${Date.now()}`,
    code: `POP-OPE-${paddedNum}`,
    legacyCode: `POP-AREA-${paddedNum}`,
    title: 'Novo Procedimento Operacional',
    shortTitle: `${shortNum} · Novo Procedimento Operacional`,
    categoryBadge: 'OPERAÇÕES DE CAMPO · CONCESSÃO SP',
    status: 'ATIVO — OFICIAL',
    author: 'Cassiano Moura Silva',
    issueDate: today,
    revision: '00',
    reviewDate: today,
    area: 'Operações',
    responsible: 'Operações | Concessão SP',
    approver: 'Gestão Operacional & SST',
    controlRef: 'Sistema de Gestão da Qualidade - NBR ISO 9001:2015',
    systemUrl: 'https://operacoes.eletromidia.com.br/login',
    objective:
      'Padronizar a execução técnica da atividade em campo, assegurando proteção integral de SST, qualidade de entrega do mobiliário urbano e registro fotográfico nos 3 ângulos do Sistema FS.',
    scope:
      'Aplica-se às equipes técnicas e operacionais da Eletromidia (Concessão SP), integrando Planejamento, Suprimentos, SST e Operações de Campo.',
    definitions: [
      { term: 'POP', meaning: 'Procedimento Operacional Padrão' },
      { term: 'SST', meaning: 'Saúde e Segurança do Trabalho' },
      { term: 'EPI', meaning: 'Equipamento de Proteção Individual' },
      { term: 'FS', meaning: 'Sistema Field Service de Operações Eletromidia' },
    ],
    responsibilities:
      'Planejamento define o cronograma e roteirização; Operações executa a atividade seguindo as normas de segurança e registra todas as evidências no Sistema FS.',
    criticalBanner: {
      title: 'AÇÕES NECESSÁRIAS — ISOLAMENTO E SEGURANÇA DE FECHAMENTO',
      description:
        'Caso tenha sido realizado serviço de pintura ou intervenção civil no equipamento, é obrigatório manter o perímetro isolado e fixar sinalização visível ("TINTA FRESCA" / "EM MANUTENÇÃO").',
      badgeText: 'SINALIZAÇÃO OBRIGATÓRIA DE CAMPO',
    },
    epis: [
      {
        id: `epi-${Date.now()}-1`,
        name: 'Calçado de Segurança',
        ca: 'CA 50290',
        category: 'Corpo & Pes',
        criticalNote: 'Uso obrigatório durante todo o atendimento em via pública',
      },
      {
        id: `epi-${Date.now()}-2`,
        name: 'Capacete 3M com Jugular',
        ca: 'CA 29637',
        category: 'Cabeca & Rosto',
        criticalNote: 'Jugular ajustada durante toda a atividade operacional',
      },
      {
        id: `epi-${Date.now()}-3`,
        name: 'Óculos de Segurança',
        ca: 'CA 14990',
        category: 'Cabeca & Rosto',
        criticalNote: 'Proteção ocular contra partículas e poeira',
      },
      {
        id: `epi-${Date.now()}-4`,
        name: 'Luva Malha Pigmentada',
        ca: 'CA 37931',
        category: 'Maos & Pele',
        criticalNote: 'Proteção mecânica no manuseio de ferramentas e peças',
      },
      {
        id: `epi-${Date.now()}-5`,
        name: 'Uniforme Operacional Eletromidia',
        ca: 'UNIFORME',
        category: 'Corpo & Pes',
        criticalNote: 'Identificação visual da equipe em campo',
      },
    ],
    toolKits: [
      {
        id: `kit-${Date.now()}-1`,
        code: 'KIT-01',
        title: 'Ferramentas Principais & Sinalização',
        subtitle: 'Equipamentos obrigatórios para execução e cerco seguro',
        items: [
          { name: 'Cones e Fita Zebrada', qty: 'Kit', usage: 'Sinalização e isolamento do perímetro na calçada' },
          { name: 'Maleta de Ferramentas Padrão', qty: '01 un', usage: 'Intervenção técnica no ativo' },
          { name: 'Vassoura e Saco de Ráfia', qty: '01 kit', usage: 'Limpeza final do entorno e descarte' },
        ],
      },
      {
        id: `kit-${Date.now()}-2`,
        code: 'KIT-02',
        title: 'Insumos & Acabamento Visual',
        subtitle: 'Materiais de reposição, higiene e sinalização normativa',
        items: [
          { name: 'Placa de Sinalização ("Tinta Fresca" / "Piso Molhado")', qty: '02 un', usage: 'Aviso preventivo aos pedestres' },
          { name: 'Pano Microfibra e Limpador Homologado', qty: '01 kit', usage: 'Acabamento final sem manchas' },
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
          'Conferir todos os kits de ferramentas, materiais e EPIs obrigatórios no veículo e validar a rota no Sistema FS antes de sair da base.',
        bullets: [
          'Conferir integridade e disponibilidade de todos os kits de ferramentas e insumos.',
          'Inspecionar EPIs obrigatórios e validade dos CAs.',
          'Conferir a ordem de serviço e roteirização no Sistema FS.',
        ],
        criticalInstruction:
          'Nunca sair da base com kit incompleto ou sem validar a rota no Sistema FS.',
        diagramType: 'kit-route',
        visualStandardCaption:
          'Conferência de Kits e EPIs na base + rota validada no Sistema FS.',
      },
      {
        itemNumber: 2,
        code: 'ETAPA 02',
        title: 'Chegada no Local & Sinalização da Calçada',
        phase: 'CAMPO / SEGURANÇA',
        durationSec: 10,
        description:
          'Estacionar o veículo de forma segura em frente ao equipamento, posicionar os cones delimitando a área de trabalho e orientar os pedestres.',
        bullets: [
          'Estacionar o veículo em local seguro junto ao meio-fio.',
          'Posicionar cones e fita zebrada formando o perímetro de proteção.',
          'Orientar os pedestres na calçada garantindo passagem livre e segura.',
        ],
        criticalInstruction:
          'Obrigatório uso integral de EPIs e sinalização com cones antes de iniciar o serviço.',
        diagramType: 'sidewalk-cones',
        visualStandardCaption:
          'Perímetro de cones posicionado na calçada + orientação aos pedestres.',
      },
      {
        itemNumber: 3,
        code: 'ETAPA 03',
        title: 'Abertura no Sistema FS, 3 Fotos Iniciais & Execução',
        phase: 'SISTEMA FS & EXECUÇÃO',
        durationSec: 12,
        description:
          'Iniciar a atividade no Sistema FS, registrar as 3 fotos padrões iniciais (Central, Direita e Esquerda) e preencher o checklist durante a execução.',
        bullets: [
          'Foto 01 — CENTRAL (0°): Enquadramento frontal completo do equipamento e base.',
          'Foto 02 — DIREITA (45°): Perfil diagonal direito mostrando o ativo e a calçada.',
          'Foto 03 — ESQUERDA (45°): Perfil diagonal esquerdo nítido, sem logo sobre a imagem.',
          'Executar o procedimento técnico preenchendo o checklist no Sistema FS.',
        ],
        criticalInstruction:
          'Insira fotos nítidas nos 3 ângulos padrões e SEM logotipo aplicado sobre a imagem.',
        diagramType: 'fs-three-photos',
        visualStandardCaption:
          'Geometria obrigatória das 3 fotos (Esquerda 45°, Central 0°, Direita 45°) no Sistema FS.',
      },
      {
        itemNumber: 4,
        code: 'ETAPA 04',
        title: 'Pós-Atividade, 3 Fotos Finais & Isolamento de Segurança',
        phase: 'FECHAMENTO & ISOLAMENTO',
        durationSec: 10,
        description:
          'Limpar o local, registrar as 3 fotos finais (Central, Direita, Esquerda) no Sistema FS, anexar evidências de avarias e manter isolamento caso necessário.',
        bullets: [
          'Higienizar o entorno e repetir os 3 ângulos padrões finais: Central, Direita e Esquerda.',
          'Registrar fotos específicas de avarias informando se foram resolvidas ou não.',
          'Manter isolamento e sinalização de segurança caso haja pintura ou cura.',
        ],
        criticalInstruction:
          'AÇÃO NECESSÁRIA: Se houver pintura ou intervenção de secagem, manter isolado e sinalizado.',
        diagramType: 'post-paint-isolation',
        visualStandardCaption:
          'Comparativo Antes/Depois no Sistema FS + isolamento preventivo de fechamento.',
      },
    ],
    quiz: [
      {
        id: `quiz-${Date.now()}-1`,
        question: 'Quais são os 3 ângulos fotográficos obrigatórios no Sistema FS antes e depois da atividade?',
        options: [
          'Central (0°), Direita (45°) e Esquerda (45°), nítidas e sem logotipo sobreposto.',
          'Apenas uma foto frontal próxima do equipamento.',
          'Duas fotos aleatórias com marca d’água colada na imagem.',
        ],
        correctIndex: 0,
        explanation:
          'O padrão Eletromidia exige sempre as 3 fotos iniciais e 3 fotos finais nos ângulos Central, Direita e Esquerda, sem logo sobre a foto.',
      },
    ],
    revisionHistory: [
      {
        rev: '00',
        description: 'Emissão inicial do Procedimento Operacional Padrão no portal Eletromidia.',
        date: today,
        author: 'Cassiano Moura Silva',
        approver: 'Operações | Concessão SP',
      },
    ],
  };
}

export const PopStudioEditor: React.FC<PopStudioEditorProps> = ({
  popsList,
  currentPop,
  isCreatingNew,
  isModified,
  isCustomCreated,
  deletedDefaultsCount = 0,
  onRestoreDeletedDefaults,
  onSelectPop,
  onStartCreateNew,
  onSavePop,
  onDeletePop,
  onResetDefaultPop,
  onOpenInlineA4Editor,
  onExitEditor,
}) => {
  const [activeSection, setActiveSection] = useState<EditorSection>('identificacao');
  const [draft, setDraft] = useState<PopDocument>(currentPop);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const stepImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Sync draft when switching POP or entering create mode
  React.useEffect(() => {
    setDraft(currentPop);
    setConfirmDelete(false);
  }, [currentPop]);

  const commitChange = (updated: PopDocument) => {
    setDraft(updated);
    if (!isCreatingNew) {
      onSavePop(updated, false);
    }
  };

  const updateField = <K extends keyof PopDocument>(field: K, value: PopDocument[K]) => {
    const next: PopDocument = {
      ...draft,
      [field]: value,
    };
    if (field === 'title' || field === 'code') {
      const numMatch = (field === 'code' ? String(value) : draft.code).match(/(\d+)$/);
      const numPrefix = numMatch ? numMatch[1].slice(-2) : '01';
      next.shortTitle = `${numPrefix} · ${field === 'title' ? String(value) : draft.title}`;
    }
    commitChange(next);
  };

  const handleSaveExplicit = () => {
    onSavePop(draft, isCreatingNew);
    setSaveFeedback(
      isCreatingNew
        ? `Novo POP "${draft.code} — ${draft.title}" criado com sucesso!`
        : `Alterações em "${draft.code}" salvas com sucesso!`
    );
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleStepImageUpload = (stepIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const nextSteps = [...draft.steps];
        nextSteps[stepIndex] = { ...nextSteps[stepIndex], customImageUrl: reader.result };
        updateField('steps', nextSteps);
      }
    };
    reader.readAsDataURL(file);
  };

  const renumberSteps = (steps: ProcessStep[]): ProcessStep[] =>
    steps.map((s, idx) => ({
      ...s,
      itemNumber: idx + 1,
      code: `ETAPA ${String(idx + 1).padStart(2, '0')}`,
    }));

  const handleAddStep = () => {
    const newNumber = draft.steps.length + 1;
    const newStep: ProcessStep = {
      itemNumber: newNumber,
      code: `ETAPA ${String(newNumber).padStart(2, '0')}`,
      title: `Nova Etapa Operacional ${newNumber}`,
      phase: 'SISTEMA FS & EXECUÇÃO',
      durationSec: 10,
      description: 'Descreva de forma clara e objetiva o que o técnico deve executar nesta etapa.',
      bullets: [
        'Primeiro passo de verificação ou execução em campo.',
        'Segundo passo garantindo segurança e registro no Sistema FS.',
      ],
      criticalInstruction: 'Atenção crítica de segurança e qualidade para esta etapa.',
      diagramType: 'fs-three-photos',
      visualStandardCaption: ' Legenda do padrão visual ou evidência exigida no Sistema FS.',
    };
    updateField('steps', [...draft.steps, newStep]);
  };

  const handleRemoveStep = (idx: number) => {
    if (draft.steps.length <= 1) return;
    const filtered = draft.steps.filter((_, i) => i !== idx);
    updateField('steps', renumberSteps(filtered));
  };

  const handleMoveStep = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= draft.steps.length) return;
    const copy = [...draft.steps];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateField('steps', renumberSteps(copy));
  };

  const totalToolsCount = draft.toolKits.reduce((acc, k) => acc + k.items.length, 0);

  return (
    <section className="studio-editor-workspace no-print">
      {/* Top Studio Action & Mode Banner */}
      <div className="studio-top-card">
        <div className="studio-top-left">
          <div className="studio-mode-badges">
            <span className={`studio-mode-pill ${isCreatingNew ? 'create' : 'edit'}`}>
              {isCreatingNew ? (
                <>
                  <FolderPlus size={13} /> CRIANDO NOVO POP
                </>
              ) : (
                <>
                  <Pencil size={13} /> EDITANDO POP EXISTENTE
                </>
              )}
            </span>
            <span className="badge-code">{draft.code}</span>
            <span className="badge-rev">REV {draft.revision}</span>
            {!isCreatingNew && (
              <span className="studio-autosave-tag">
                <Check size={12} /> Salvo automaticamente nos 3 formatos
              </span>
            )}
          </div>
          <h2 className="studio-main-heading">
            {isCreatingNew
              ? `Novo POP: ${draft.title}`
              : `Editor Estruturado — ${draft.title}`}
          </h2>
          <p className="studio-sub-desc">
            Tudo o que você criar ou editar aqui atualiza automaticamente o{' '}
            <strong>Vídeo Animado (16:9 e 9:16)</strong>, o <strong>Playbook Interativo</strong> e a{' '}
            <strong>Folha Oficial A4 NBR ISO 9001:2015</strong>.
          </p>
        </div>

        <div className="studio-top-actions">
          {!isCreatingNew && (
            <>
              {!confirmDelete ? (
                <button
                  type="button"
                  className="btn-modern danger-outline"
                  onClick={() => setConfirmDelete(true)}
                  title={`Excluir o POP ${draft.code} — ${draft.title}`}
                >
                  <Trash2 size={15} />
                  <span>Excluir POP</span>
                </button>
              ) : (
                <div className="studio-top-delete-confirm">
                  <span>Excluir {draft.code}?</span>
                  <button
                    type="button"
                    className="btn-modern danger sm"
                    onClick={() => onDeletePop(draft.id)}
                  >
                    Sim, Excluir
                  </button>
                  <button
                    type="button"
                    className="btn-modern secondary sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </>
          )}

          <button
            type="button"
            className="btn-modern secondary"
            onClick={() => {
              if (isCreatingNew) {
                onSavePop(draft, true);
              }
              onOpenInlineA4Editor();
            }}
            title="Alternar para edição clicando direto dentro da folha A4"
          >
            <FileText size={15} />
            <span>Editar Direto na Folha A4</span>
          </button>

          <button
            type="button"
            className="btn-modern primary studio-save-btn"
            onClick={handleSaveExplicit}
          >
            <Check size={16} />
            <span>{isCreatingNew ? 'Salvar e Publicar Novo POP' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="studio-feedback-banner">
          <div className="studio-feedback-left">
            <Check size={17} />
            <strong>{saveFeedback}</strong>
          </div>
          <div className="studio-feedback-actions">
            <button
              type="button"
              className="btn-modern secondary sm"
              onClick={() => onExitEditor('remotion')}
            >
              <Play size={13} /> Ver no Vídeo
            </button>
            <button
              type="button"
              className="btn-modern secondary sm"
              onClick={() => onExitEditor('playbook')}
            >
              <ClipboardCheck size={13} /> Ver no Playbook
            </button>
            <button
              type="button"
              className="btn-modern primary sm"
              onClick={() => onExitEditor('iso-pdf')}
            >
              <FileText size={13} /> Ver Documento A4 / PDF
            </button>
          </div>
        </div>
      )}

      {/* Template Selector Bar when Creating a New POP */}
      {isCreatingNew && (
        <div className="studio-template-bar">
          <div className="studio-template-label">
            <Sparkles size={16} className="icon-orange" />
            <div>
              <strong>Escolha o ponto de partida para este novo POP:</strong>
              <span>
                Você pode começar do modelo padrão em branco ou copiar a estrutura de um POP já
                existente para editar apenas o que mudar.
              </span>
            </div>
          </div>
          <div className="studio-template-buttons">
            <button
              type="button"
              className="btn-modern secondary sm"
              onClick={() => onStartCreateNew(undefined)}
            >
              Modelo ISO 9001 em Branco
            </button>
            {POPS_DATA.map((basePop) => (
              <button
                key={basePop.id}
                type="button"
                className="btn-modern secondary sm"
                onClick={() => onStartCreateNew(basePop)}
              >
                <Copy size={13} /> Copiar base de {basePop.code} ({basePop.title})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Studio Grid */}
      <div className="studio-grid">
        {/* Left Column: POP Manager List + Section Navigation */}
        <aside className="studio-sidebar">
          {/* Card 1: Section Tabs */}
          <div className="studio-nav-card">
            <div className="studio-nav-header">
              <h3>Seções do POP</h3>
              <span>Clique para editar cada parte</span>
            </div>

            <div className="studio-section-list">
              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'identificacao' ? 'active' : ''}`}
                onClick={() => setActiveSection('identificacao')}
              >
                <FileText size={16} />
                <div className="studio-sec-copy">
                  <strong>1. Cabeçalho & Metadados</strong>
                  <span>Código, título, autor, datas, área</span>
                </div>
              </button>

              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'normativo' ? 'active' : ''}`}
                onClick={() => setActiveSection('normativo')}
              >
                <ClipboardCheck size={16} />
                <div className="studio-sec-copy">
                  <strong>2. Textos Normativos (1 a 4)</strong>
                  <span>Objetivo, abrangência, siglas e alerta</span>
                </div>
              </button>

              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'epis' ? 'active' : ''}`}
                onClick={() => setActiveSection('epis')}
              >
                <ShieldCheck size={16} />
                <div className="studio-sec-copy">
                  <strong>3. EPIs Obrigatórios (Item 5)</strong>
                  <span>{draft.epis.length} EPIs com CA cadastrado</span>
                </div>
              </button>

              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'ferramentas' ? 'active' : ''}`}
                onClick={() => setActiveSection('ferramentas')}
              >
                <Wrench size={16} />
                <div className="studio-sec-copy">
                  <strong>4. Ferramentas & Kits (Item 6)</strong>
                  <span>
                    {draft.toolKits.length} maletas · {totalToolsCount} materiais
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'etapas' ? 'active' : ''}`}
                onClick={() => setActiveSection('etapas')}
              >
                <ListChecks size={16} />
                <div className="studio-sec-copy">
                  <strong>5. Passo a Passo & Fotos (Item 7)</strong>
                  <span>{draft.steps.length} etapas, diagramas e fotos</span>
                </div>
              </button>

              <button
                type="button"
                className={`studio-sec-btn ${activeSection === 'quiz-revisoes' ? 'active' : ''}`}
                onClick={() => setActiveSection('quiz-revisoes')}
              >
                <History size={16} />
                <div className="studio-sec-copy">
                  <strong>6. Quiz & Revisões (Item 8)</strong>
                  <span>
                    {draft.quiz.length} perguntas · {draft.revisionHistory.length} revisões
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Card 2: All POPs Library Manager */}
          <div className="studio-nav-card">
            <div className="studio-nav-header">
              <div className="studio-nav-header-row">
                <h3>Todos os POPs ({popsList.length})</h3>
                <button
                  type="button"
                  className="btn-modern primary sm"
                  onClick={() => onStartCreateNew(undefined)}
                >
                  <Plus size={13} /> Novo POP
                </button>
              </div>
              <span>Selecione um POP para editar ou crie um novo</span>
            </div>

            <div className="studio-pops-list">
              {popsList.map((item) => {
                const isSelected = !isCreatingNew && item.id === draft.id;
                return (
                  <div
                    key={item.id}
                    className={`studio-pop-item-wrap ${isSelected ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className={`studio-pop-item ${isSelected ? 'active' : ''}`}
                      onClick={() => onSelectPop(item.id)}
                    >
                      <div className="studio-pop-item-top">
                        <span className="proc-pill-code">{item.code}</span>
                        <span className="studio-pop-rev">Rev {item.revision}</span>
                      </div>
                      <strong className="studio-pop-item-title">{item.title}</strong>
                    </button>
                    <button
                      type="button"
                      className="studio-pop-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePop(item.id);
                      }}
                      title={`Excluir ${item.code} — ${item.title}`}
                      aria-label={`Excluir ${item.code}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="studio-manage-footer">
              {!isCreatingNew && (
                <>
                  <button
                    type="button"
                    className="btn-modern secondary full-width"
                    onClick={() => onStartCreateNew(draft)}
                  >
                    <Copy size={14} />
                    <span>Duplicar este POP como Novo</span>
                  </button>

                  {isModified && !isCustomCreated && (
                    <button
                      type="button"
                      className="btn-modern secondary full-width"
                      onClick={() => onResetDefaultPop(draft.id)}
                    >
                      <RotateCcw size={14} />
                      <span>Restaurar Original de Fábrica</span>
                    </button>
                  )}

                  {!confirmDelete ? (
                    <button
                      type="button"
                      className="btn-modern danger-outline full-width"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 size={14} />
                      <span>Excluir este POP ({draft.code})</span>
                    </button>
                  ) : (
                    <div className="studio-delete-confirm">
                      <span>Confirmar exclusão de {draft.code}?</span>
                      <div className="studio-delete-confirm-btns">
                        <button
                          type="button"
                          className="btn-modern danger sm"
                          onClick={() => onDeletePop(draft.id)}
                        >
                          Sim, Excluir
                        </button>
                        <button
                          type="button"
                          className="btn-modern secondary sm"
                          onClick={() => setConfirmDelete(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {deletedDefaultsCount > 0 && onRestoreDeletedDefaults && (
                <button
                  type="button"
                  className="btn-modern secondary full-width"
                  onClick={onRestoreDeletedDefaults}
                >
                  <RotateCcw size={14} />
                  <span>Restaurar POPs Padrão Excluídos ({deletedDefaultsCount})</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Active Section Form Workbench */}
        <div className="studio-main-panel">
          {/* ==================== SECTION 1: IDENTIFICAÇÃO & CABEÇALHO ==================== */}
          {activeSection === 'identificacao' && (
            <div className="surface-card studio-form-card">
              <div className="card-section-header">
                <div>
                  <h2>1. Identificação & Cabeçalho NBR ISO 9001:2015</h2>
                  <p>
                    Estes dados preenchem o cabeçalho de todas as páginas A4, a abertura do vídeo
                    Remotion e a barra superior do portal.
                  </p>
                </div>
                <span className="badge-code">{draft.code}</span>
              </div>

              <div className="studio-form-grid cols-3">
                <label className="studio-field">
                  <span>Código do Documento (POP)</span>
                  <input
                    type="text"
                    value={draft.code}
                    placeholder="Ex: POP-OPE-004"
                    onChange={(e) => updateField('code', e.target.value)}
                  />
                </label>

                <label className="studio-field span-2">
                  <span>Nome do Procedimento (Título Principal)</span>
                  <input
                    type="text"
                    value={draft.title}
                    placeholder="Ex: Manutenção Elétrica de Totem e Abrigo"
                    onChange={(e) => updateField('title', e.target.value)}
                  />
                </label>

                <label className="studio-field span-2">
                  <span>Categoria Operacional (Selo Técnico)</span>
                  <input
                    type="text"
                    value={draft.categoryBadge}
                    placeholder="Ex: MANUTENÇÃO PREVENTIVA E CORRETIVA"
                    onChange={(e) => updateField('categoryBadge', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Status do Tutorial</span>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      updateField('status', e.target.value as PopDocument['status'])
                    }
                  >
                    <option value="ATIVO — OFICIAL">ATIVO — OFICIAL (Homologado)</option>
                    <option value="MODELO PRONTO">MODELO PRONTO (Próximo Tutorial)</option>
                  </select>
                </label>

                <label className="studio-field">
                  <span>Elaboração (Autor)</span>
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(e) => updateField('author', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Data de Emissão</span>
                  <input
                    type="text"
                    value={draft.issueDate}
                    placeholder="DD/MM/AAAA"
                    onChange={(e) => updateField('issueDate', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Revisão Atual</span>
                  <input
                    type="text"
                    value={draft.revision}
                    placeholder="00"
                    onChange={(e) => updateField('revision', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Área</span>
                  <input
                    type="text"
                    value={draft.area}
                    onChange={(e) => updateField('area', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Responsável</span>
                  <input
                    type="text"
                    value={draft.responsible}
                    onChange={(e) => updateField('responsible', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Data de Revisão</span>
                  <input
                    type="text"
                    value={draft.reviewDate}
                    placeholder="DD/MM/AAAA"
                    onChange={(e) => updateField('reviewDate', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>Aprovação</span>
                  <input
                    type="text"
                    value={draft.approver}
                    onChange={(e) => updateField('approver', e.target.value)}
                  />
                </label>

                <label className="studio-field span-2">
                  <span>Referência de Controle Normativo</span>
                  <input
                    type="text"
                    value={draft.controlRef}
                    onChange={(e) => updateField('controlRef', e.target.value)}
                  />
                </label>

                <label className="studio-field span-3">
                  <span>URL do Sistema Operacional (Item 9 — Referência / Sistema FS)</span>
                  <input
                    type="url"
                    value={draft.systemUrl}
                    onChange={(e) => updateField('systemUrl', e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ==================== SECTION 2: TEXTOS NORMATIVOS ==================== */}
          {activeSection === 'normativo' && (
            <div className="surface-card studio-form-card">
              <div className="card-section-header">
                <div>
                  <h2>2. Textos Normativos (Seções 1 a 4) & Alerta Crítico</h2>
                  <p>
                    Defina o Objetivo, Abrangência, Siglas, Responsabilidades e a caixa de Ações
                    Necessárias do rodapé.
                  </p>
                </div>
              </div>

              <div className="studio-form-stack">
                <label className="studio-field">
                  <span>1. OBJETIVO</span>
                  <textarea
                    rows={3}
                    value={draft.objective}
                    onChange={(e) => updateField('objective', e.target.value)}
                  />
                </label>

                <label className="studio-field">
                  <span>2. ABRANGÊNCIA</span>
                  <textarea
                    rows={3}
                    value={draft.scope}
                    onChange={(e) => updateField('scope', e.target.value)}
                  />
                </label>

                <div className="studio-sub-box">
                  <div className="studio-sub-box-header">
                    <div>
                      <strong>3. DEFINIÇÕES E SIGLAS</strong>
                      <span>Siglas exibidas no item 3 da folha oficial A4</span>
                    </div>
                    <button
                      type="button"
                      className="btn-modern secondary sm"
                      onClick={() =>
                        updateField('definitions', [
                          ...draft.definitions,
                          { term: 'NOVA', meaning: 'Significado da sigla operacional' },
                        ])
                      }
                    >
                      <Plus size={14} /> Adicionar Sigla
                    </button>
                  </div>

                  <div className="studio-list-rows">
                    {draft.definitions.map((def, idx) => (
                      <div key={idx} className="studio-inline-row def-row">
                        <input
                          type="text"
                          value={def.term}
                          placeholder="Sigla (ex: FS)"
                          className="input-short-code"
                          onChange={(e) => {
                            const next = [...draft.definitions];
                            next[idx] = { ...def, term: e.target.value };
                            updateField('definitions', next);
                          }}
                        />
                        <input
                          type="text"
                          value={def.meaning}
                          placeholder="Descrição completa do termo"
                          onChange={(e) => {
                            const next = [...draft.definitions];
                            next[idx] = { ...def, meaning: e.target.value };
                            updateField('definitions', next);
                          }}
                        />
                        <button
                          type="button"
                          className="btn-icon-danger"
                          onClick={() =>
                            updateField(
                              'definitions',
                              draft.definitions.filter((_, i) => i !== idx)
                            )
                          }
                          title="Remover definição"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="studio-field">
                  <span>4. RESPONSABILIDADES</span>
                  <textarea
                    rows={3}
                    value={draft.responsibilities}
                    onChange={(e) => updateField('responsibilities', e.target.value)}
                  />
                </label>

                <div className="studio-sub-box warn-tint">
                  <div className="studio-sub-box-header">
                    <div>
                      <strong>ALERTA CRÍTICO DE FECHAMENTO (RODAPÉ DA PÁGINA 2 & PLAYBOOK)</strong>
                      <span>
                        Destaque de segurança obrigatório (ex: isolamento de Tinta Fresca, Piso
                        Molhado ou Cava)
                      </span>
                    </div>
                  </div>
                  <div className="studio-form-grid cols-2">
                    <label className="studio-field">
                      <span>Título do Alerta Crítico</span>
                      <input
                        type="text"
                        value={draft.criticalBanner.title}
                        onChange={(e) =>
                          updateField('criticalBanner', {
                            ...draft.criticalBanner,
                            title: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="studio-field">
                      <span>Texto do Selo de Sinalização</span>
                      <input
                        type="text"
                        value={draft.criticalBanner.badgeText}
                        onChange={(e) =>
                          updateField('criticalBanner', {
                            ...draft.criticalBanner,
                            badgeText: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="studio-field span-2">
                      <span>Descrição da Ação Necessária Obrigatória</span>
                      <textarea
                        rows={2}
                        value={draft.criticalBanner.description}
                        onChange={(e) =>
                          updateField('criticalBanner', {
                            ...draft.criticalBanner,
                            description: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SECTION 3: EPIs OBRIGATÓRIOS ==================== */}
          {activeSection === 'epis' && (
            <div className="surface-card studio-form-card">
              <div className="card-section-header">
                <div>
                  <h2>5. Equipamentos de Proteção Individual e Coletiva (EPIs)</h2>
                  <p>
                    Gerencie a lista de EPIs, seus Certificados de Aprovação (CA) e observações de
                    uso obrigatório.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-modern primary"
                  onClick={() =>
                    updateField('epis', [
                      ...draft.epis,
                      {
                        id: `epi-${Date.now()}`,
                        name: 'Novo EPI Obrigatório',
                        ca: 'CA 00000',
                        category: 'Corpo & Pes',
                        criticalNote: 'Uso obrigatório durante a atividade em campo',
                      },
                    ])
                  }
                >
                  <Plus size={15} /> Adicionar EPI em Branco
                </button>
              </div>

              {/* Quick Add EPI Presets */}
              <div className="studio-presets-bar">
                <span className="studio-presets-label">Adicionar EPI rápido homologado SST:</span>
                <div className="studio-presets-pills">
                  {EPI_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="preset-chip"
                      onClick={() =>
                        updateField('epis', [
                          ...draft.epis,
                          { ...preset, id: `epi-${Date.now()}-${Math.random()}` },
                        ])
                      }
                    >
                      <Plus size={12} /> {preset.name} ({preset.ca})
                    </button>
                  ))}
                </div>
              </div>

              <div className="studio-list-rows">
                {draft.epis.map((epi, idx) => (
                  <div key={epi.id || idx} className="studio-item-card">
                    <div className="studio-form-grid cols-4">
                      <label className="studio-field span-2">
                        <span>Nome do EPI / Uniforme</span>
                        <input
                          type="text"
                          value={epi.name}
                          onChange={(e) => {
                            const next = [...draft.epis];
                            next[idx] = { ...epi, name: e.target.value };
                            updateField('epis', next);
                          }}
                        />
                      </label>

                      <label className="studio-field">
                        <span>Número do CA</span>
                        <input
                          type="text"
                          value={epi.ca}
                          placeholder="Ex: CA 50290"
                          onChange={(e) => {
                            const next = [...draft.epis];
                            next[idx] = { ...epi, ca: e.target.value };
                            updateField('epis', next);
                          }}
                        />
                      </label>

                      <label className="studio-field">
                        <span>Categoria</span>
                        <select
                          value={epi.category}
                          onChange={(e) => {
                            const next = [...draft.epis];
                            next[idx] = {
                              ...epi,
                              category: e.target.value as EpiItem['category'],
                            };
                            updateField('epis', next);
                          }}
                        >
                          <option value="Cabeca & Rosto">Cabeça & Rosto</option>
                          <option value="Maos & Pele">Mãos & Pele</option>
                          <option value="Corpo & Pes">Corpo & Pés</option>
                        </select>
                      </label>

                      <label className="studio-field span-3">
                        <span>Instrução Crítica de Uso</span>
                        <input
                          type="text"
                          value={epi.criticalNote}
                          onChange={(e) => {
                            const next = [...draft.epis];
                            next[idx] = { ...epi, criticalNote: e.target.value };
                            updateField('epis', next);
                          }}
                        />
                      </label>

                      <div className="studio-field-action-end">
                        <button
                          type="button"
                          className="btn-modern danger-outline sm"
                          onClick={() =>
                            updateField(
                              'epis',
                              draft.epis.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <Trash2 size={14} /> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SECTION 4: KITS DE FERRAMENTAS ==================== */}
          {activeSection === 'ferramentas' && (
            <div className="surface-card studio-form-card">
              <div className="card-section-header">
                <div>
                  <h2>6. Ferramentas, Insumos e Maletas Funcionais</h2>
                  <p>
                    Organize os materiais em Kits funcionais (`KIT-01`, `KIT-02`, etc.) para
                    facilitar a conferência antes da saída da base.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-modern primary"
                  onClick={() => {
                    const nextNum = draft.toolKits.length + 1;
                    const newKit: ToolKit = {
                      id: `kit-${Date.now()}`,
                      code: `KIT-${String(nextNum).padStart(2, '0')}`,
                      title: 'Novo Kit de Ferramentas',
                      subtitle: 'Materiais e insumos operacionais',
                      items: [
                        { name: 'Nova Ferramenta / Insumo', qty: '01 un', usage: 'Aplicação técnica em campo' },
                      ],
                    };
                    updateField('toolKits', [...draft.toolKits, newKit]);
                  }}
                >
                  <Plus size={15} /> Adicionar Nova Maleta (Kit)
                </button>
              </div>

              <div className="studio-form-stack">
                {draft.toolKits.map((kit, kitIdx) => (
                  <div key={kit.id || kitIdx} className="studio-sub-box">
                    <div className="studio-sub-box-header">
                      <div className="studio-form-grid cols-3" style={{ flex: 1 }}>
                        <label className="studio-field">
                          <span>Código do Kit</span>
                          <input
                            type="text"
                            value={kit.code}
                            onChange={(e) => {
                              const next = [...draft.toolKits];
                              next[kitIdx] = { ...kit, code: e.target.value };
                              updateField('toolKits', next);
                            }}
                          />
                        </label>
                        <label className="studio-field">
                          <span>Nome da Maleta / Kit</span>
                          <input
                            type="text"
                            value={kit.title}
                            onChange={(e) => {
                              const next = [...draft.toolKits];
                              next[kitIdx] = { ...kit, title: e.target.value };
                              updateField('toolKits', next);
                            }}
                          />
                        </label>
                        <label className="studio-field">
                          <span>Subtítulo / Resumo</span>
                          <input
                            type="text"
                            value={kit.subtitle}
                            onChange={(e) => {
                              const next = [...draft.toolKits];
                              next[kitIdx] = { ...kit, subtitle: e.target.value };
                              updateField('toolKits', next);
                            }}
                          />
                        </label>
                      </div>

                      {draft.toolKits.length > 1 && (
                        <button
                          type="button"
                          className="btn-modern danger-outline sm"
                          onClick={() =>
                            updateField(
                              'toolKits',
                              draft.toolKits.filter((_, i) => i !== kitIdx)
                            )
                          }
                        >
                          <Trash2 size={14} /> Excluir Kit
                        </button>
                      )}
                    </div>

                    <div className="studio-list-rows" style={{ marginTop: 12 }}>
                      {kit.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="studio-inline-row tool-row">
                          <input
                            type="text"
                            value={item.name}
                            placeholder="Nome da ferramenta ou material"
                            onChange={(e) => {
                              const nextKits = [...draft.toolKits];
                              const nextItems: ToolItem[] = [...kit.items];
                              nextItems[itemIdx] = { ...item, name: e.target.value };
                              nextKits[kitIdx] = { ...kit, items: nextItems };
                              updateField('toolKits', nextKits);
                            }}
                          />
                          <input
                            type="text"
                            value={item.qty}
                            placeholder="Qtd (ex: 01 un)"
                            className="input-short-code"
                            onChange={(e) => {
                              const nextKits = [...draft.toolKits];
                              const nextItems: ToolItem[] = [...kit.items];
                              nextItems[itemIdx] = { ...item, qty: e.target.value };
                              nextKits[kitIdx] = { ...kit, items: nextItems };
                              updateField('toolKits', nextKits);
                            }}
                          />
                          <input
                            type="text"
                            value={item.usage}
                            placeholder="Finalidade / Uso na atividade"
                            onChange={(e) => {
                              const nextKits = [...draft.toolKits];
                              const nextItems: ToolItem[] = [...kit.items];
                              nextItems[itemIdx] = { ...item, usage: e.target.value };
                              nextKits[kitIdx] = { ...kit, items: nextItems };
                              updateField('toolKits', nextKits);
                            }}
                          />
                          <button
                            type="button"
                            className="btn-icon-danger"
                            onClick={() => {
                              const nextKits = [...draft.toolKits];
                              nextKits[kitIdx] = {
                                ...kit,
                                items: kit.items.filter((_, i) => i !== itemIdx),
                              };
                              updateField('toolKits', nextKits);
                            }}
                            title="Remover item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn-modern secondary sm"
                        onClick={() => {
                          const nextKits = [...draft.toolKits];
                          nextKits[kitIdx] = {
                            ...kit,
                            items: [
                              ...kit.items,
                              { name: 'Novo Material', qty: '01 un', usage: 'Uso operacional' },
                            ],
                          };
                          updateField('toolKits', nextKits);
                        }}
                      >
                        <Plus size={14} /> Adicionar Item ao {kit.code}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SECTION 5: PASSO A PASSO & FOTOS ==================== */}
          {activeSection === 'etapas' && (
            <div className="surface-card studio-form-card">
              <div className="card-section-header">
                <div>
                  <h2>7. Passo a Passo do Processo, Diagramas & Fotos</h2>
                  <p>
                    Edite cada etapa operacional, adicione ou reordene etapas e escolha entre os
                    diagramas técnicos vetoriais ou envie fotos reais de campo.
                  </p>
                </div>
                <button type="button" className="btn-modern primary" onClick={handleAddStep}>
                  <Plus size={15} /> Adicionar Nova Etapa
                </button>
              </div>

              <div className="studio-form-stack">
                {draft.steps.map((step, sIdx) => (
                  <div key={step.itemNumber} className="studio-step-editor-card">
                    <div className="studio-step-editor-top">
                      <div className="studio-step-badge-group">
                        <span className="badge-code">{step.code}</span>
                        <strong>
                          Item {step.itemNumber} — {step.title}
                        </strong>
                      </div>
                      <div className="studio-step-order-btns">
                        <button
                          type="button"
                          className="btn-modern secondary sm"
                          disabled={sIdx === 0}
                          onClick={() => handleMoveStep(sIdx, -1)}
                          title="Mover etapa para cima"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-modern secondary sm"
                          disabled={sIdx === draft.steps.length - 1}
                          onClick={() => handleMoveStep(sIdx, 1)}
                          title="Mover etapa para baixo"
                        >
                          <ArrowDown size={13} />
                        </button>
                        {draft.steps.length > 1 && (
                          <button
                            type="button"
                            className="btn-modern danger-outline sm"
                            onClick={() => handleRemoveStep(sIdx)}
                          >
                            <Trash2 size={13} /> Excluir Etapa
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="studio-step-two-col">
                      <div className="studio-form-stack">
                        <div className="studio-form-grid cols-2">
                          <label className="studio-field">
                            <span>Título da Etapa</span>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const next = [...draft.steps];
                                next[sIdx] = { ...step, title: e.target.value };
                                updateField('steps', next);
                              }}
                            />
                          </label>

                          <label className="studio-field">
                            <span>Fase Operacional</span>
                            <select
                              value={step.phase}
                              onChange={(e) => {
                                const next = [...draft.steps];
                                next[sIdx] = {
                                  ...step,
                                  phase: e.target.value as ProcessStep['phase'],
                                };
                                updateField('steps', next);
                              }}
                            >
                              <option value="BASE">BASE</option>
                              <option value="CAMPO / SEGURANÇA">CAMPO / SEGURANÇA</option>
                              <option value="SISTEMA FS & EXECUÇÃO">SISTEMA FS & EXECUÇÃO</option>
                              <option value="FECHAMENTO & ISOLAMENTO">FECHAMENTO & ISOLAMENTO</option>
                            </select>
                          </label>
                        </div>

                        <label className="studio-field">
                          <span>Descrição Geral da Atividade</span>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const next = [...draft.steps];
                              next[sIdx] = { ...step, description: e.target.value };
                              updateField('steps', next);
                            }}
                          />
                        </label>

                        <div className="studio-field">
                          <div className="studio-sub-header-inline">
                            <span>Tópicos de Execução (Checklist da Etapa)</span>
                            <button
                              type="button"
                              className="btn-modern secondary sm"
                              onClick={() => {
                                const next = [...draft.steps];
                                next[sIdx] = {
                                  ...step,
                                  bullets: [...step.bullets, 'Nova instrução operacional da etapa.'],
                                };
                                updateField('steps', next);
                              }}
                            >
                              <Plus size={12} /> Adicionar Tópico
                            </button>
                          </div>

                          <div className="studio-list-rows">
                            {step.bullets.map((b, bIdx) => (
                              <div key={bIdx} className="studio-inline-row">
                                <span className="bullet-num-pill">{bIdx + 1}</span>
                                <input
                                  type="text"
                                  value={b}
                                  onChange={(e) => {
                                    const nextSteps = [...draft.steps];
                                    const nextBullets = [...step.bullets];
                                    nextBullets[bIdx] = e.target.value;
                                    nextSteps[sIdx] = { ...step, bullets: nextBullets };
                                    updateField('steps', nextSteps);
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn-icon-danger"
                                  onClick={() => {
                                    const nextSteps = [...draft.steps];
                                    nextSteps[sIdx] = {
                                      ...step,
                                      bullets: step.bullets.filter((_, i) => i !== bIdx),
                                    };
                                    updateField('steps', nextSteps);
                                  }}
                                  title="Remover tópico"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <label className="studio-field">
                          <span>Instrução Crítica de Segurança / Qualidade</span>
                          <input
                            type="text"
                            value={step.criticalInstruction}
                            onChange={(e) => {
                              const next = [...draft.steps];
                              next[sIdx] = { ...step, criticalInstruction: e.target.value };
                              updateField('steps', next);
                            }}
                          />
                        </label>
                      </div>

                      {/* Right side of Step: Visual Diagram or Custom Photo */}
                      <div className="studio-step-visual-box">
                        <label className="studio-field">
                          <span>Diagrama Técnico Padrão</span>
                          <select
                            value={step.diagramType}
                            onChange={(e) => {
                              const next = [...draft.steps];
                              next[sIdx] = {
                                ...step,
                                diagramType: e.target.value as ProcessStep['diagramType'],
                              };
                              updateField('steps', next);
                            }}
                          >
                            <option value="kit-route">
                              Diagrama 1 · Conferência de Kits & Rota FS
                            </option>
                            <option value="sidewalk-cones">
                              Diagrama 2 · Cerco de Cones na Calçada & Carro
                            </option>
                            <option value="fs-three-photos">
                              Diagrama 3 · Geometria das 3 Fotos (Central, Direita, Esquerda)
                            </option>
                            <option value="post-paint-isolation">
                              Diagrama 4 · Fechamento, 3 Fotos Finais & Isolamento (Cura / Pintura / Piso)
                            </option>
                          </select>
                        </label>

                        <div className="studio-diagram-preview">
                          {step.customImageUrl ? (
                            <img
                              src={step.customImageUrl}
                              alt={step.visualStandardCaption}
                              className="studio-custom-img-preview"
                            />
                          ) : (
                            <TechnicalDiagram type={step.diagramType} popId={draft.id} compact />
                          )}
                        </div>

                        <div className="studio-visual-upload-row">
                          <input
                            ref={(el) => {
                              stepImageInputRefs.current[sIdx] = el;
                            }}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleStepImageUpload(sIdx, e)}
                          />
                          <button
                            type="button"
                            className="btn-modern secondary sm"
                            onClick={() => stepImageInputRefs.current[sIdx]?.click()}
                          >
                            <ImagePlus size={14} />
                            <span>
                              {step.customImageUrl
                                ? 'Trocar Foto Real'
                                : 'Enviar Foto Real de Campo'}
                            </span>
                          </button>
                          {step.customImageUrl && (
                            <button
                              type="button"
                              className="btn-modern danger-outline sm"
                              onClick={() => {
                                const next = [...draft.steps];
                                next[sIdx] = { ...step, customImageUrl: undefined };
                                updateField('steps', next);
                              }}
                            >
                              Voltar ao Diagrama Vetorial
                            </button>
                          )}
                        </div>

                        <label className="studio-field">
                          <span>Legenda do Registro Visual</span>
                          <input
                            type="text"
                            value={step.visualStandardCaption}
                            onChange={(e) => {
                              const next = [...draft.steps];
                              next[sIdx] = { ...step, visualStandardCaption: e.target.value };
                              updateField('steps', next);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SECTION 6: QUIZ & HISTÓRICO DE REVISÕES ==================== */}
          {activeSection === 'quiz-revisoes' && (
            <div className="studio-form-stack">
              {/* Part A: Quiz Questions */}
              <div className="surface-card studio-form-card">
                <div className="card-section-header">
                  <div>
                    <h2>
                      <HelpCircle size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                      Quiz de Validação do Técnico (Playbook Interativo)
                    </h2>
                    <p>
                      Perguntas de múltipla escolha aplicadas ao final do treinamento para fixação
                      das regras críticas.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-modern primary"
                    onClick={() => {
                      const newQ: QuizQuestion = {
                        id: `q-${Date.now()}`,
                        question: 'Nova pergunta sobre segurança ou padrão operacional deste POP?',
                        options: [
                          'Alternativa A (Correta)',
                          'Alternativa B (Incorreta)',
                          'Alternativa C (Incorreta)',
                        ],
                        correctIndex: 0,
                        explanation:
                          'Explicação normativa do motivo pelo qual esta alternativa é a correta.',
                      };
                      updateField('quiz', [...draft.quiz, newQ]);
                    }}
                  >
                    <Plus size={15} /> Adicionar Pergunta ao Quiz
                  </button>
                </div>

                <div className="studio-form-stack">
                  {draft.quiz.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="studio-sub-box">
                      <div className="studio-sub-box-header">
                        <strong>Questão {qIdx + 1}</strong>
                        {draft.quiz.length > 1 && (
                          <button
                            type="button"
                            className="btn-modern danger-outline sm"
                            onClick={() =>
                              updateField(
                                'quiz',
                                draft.quiz.filter((_, i) => i !== qIdx)
                              )
                            }
                          >
                            <Trash2 size={13} /> Remover Questão
                          </button>
                        )}
                      </div>

                      <div className="studio-form-stack">
                        <label className="studio-field">
                          <span>Enunciado da Pergunta</span>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const next = [...draft.quiz];
                              next[qIdx] = { ...q, question: e.target.value };
                              updateField('quiz', next);
                            }}
                          />
                        </label>

                        <div className="studio-field">
                          <span>Alternativas (Marque o botão da resposta correta)</span>
                          <div className="studio-list-rows">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="studio-inline-row">
                                <button
                                  type="button"
                                  className={`quiz-correct-toggle ${
                                    q.correctIndex === oIdx ? 'active' : ''
                                  }`}
                                  onClick={() => {
                                    const next = [...draft.quiz];
                                    next[qIdx] = { ...q, correctIndex: oIdx };
                                    updateField('quiz', next);
                                  }}
                                  title="Marcar como alternativa correta"
                                >
                                  {String.fromCharCode(65 + oIdx)}{' '}
                                  {q.correctIndex === oIdx ? '✓ Correta' : ''}
                                </button>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const nextQuiz = [...draft.quiz];
                                    const nextOpts = [...q.options];
                                    nextOpts[oIdx] = e.target.value;
                                    nextQuiz[qIdx] = { ...q, options: nextOpts };
                                    updateField('quiz', nextQuiz);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <label className="studio-field">
                          <span>Explicação do Gabarito</span>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => {
                              const next = [...draft.quiz];
                              next[qIdx] = { ...q, explanation: e.target.value };
                              updateField('quiz', next);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Revision History */}
              <div className="surface-card studio-form-card">
                <div className="card-section-header">
                  <div>
                    <h2>8. Histórico de Revisões (Tabela Oficial ISO 9001)</h2>
                    <p>Controle de emissões e alterações exibido na página 3 do documento A4.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-modern primary"
                    onClick={() =>
                      updateField('revisionHistory', [
                        ...draft.revisionHistory,
                        {
                          rev: String(draft.revisionHistory.length).padStart(2, '0'),
                          description: 'Atualização técnica do Procedimento Operacional Padrão.',
                          date: new Date().toLocaleDateString('pt-BR'),
                          author: draft.author,
                          approver: draft.approver,
                        },
                      ])
                    }
                  >
                    <Plus size={15} /> Adicionar Linha de Revisão
                  </button>
                </div>

                <div className="studio-list-rows">
                  {draft.revisionHistory.map((rev, rIdx) => (
                    <div key={rIdx} className="studio-item-card">
                      <div className="studio-form-grid cols-4">
                        <label className="studio-field">
                          <span>Revisão</span>
                          <input
                            type="text"
                            value={rev.rev}
                            onChange={(e) => {
                              const next = [...draft.revisionHistory];
                              next[rIdx] = { ...rev, rev: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        </label>
                        <label className="studio-field">
                          <span>Data</span>
                          <input
                            type="text"
                            value={rev.date}
                            onChange={(e) => {
                              const next = [...draft.revisionHistory];
                              next[rIdx] = { ...rev, date: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        </label>
                        <label className="studio-field">
                          <span>Elaborado por</span>
                          <input
                            type="text"
                            value={rev.author}
                            onChange={(e) => {
                              const next = [...draft.revisionHistory];
                              next[rIdx] = { ...rev, author: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        </label>
                        <label className="studio-field">
                          <span>Aprovado por</span>
                          <input
                            type="text"
                            value={rev.approver}
                            onChange={(e) => {
                              const next = [...draft.revisionHistory];
                              next[rIdx] = { ...rev, approver: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        </label>
                        <label className="studio-field span-3">
                          <span>Descrição da Alteração</span>
                          <input
                            type="text"
                            value={rev.description}
                            onChange={(e) => {
                              const next = [...draft.revisionHistory];
                              next[rIdx] = { ...rev, description: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        </label>
                        <div className="studio-field-action-end">
                          {draft.revisionHistory.length > 1 && (
                            <button
                              type="button"
                              className="btn-modern danger-outline sm"
                              onClick={() =>
                                updateField(
                                  'revisionHistory',
                                  draft.revisionHistory.filter((_, i) => i !== rIdx)
                                )
                              }
                            >
                              <Trash2 size={14} /> Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
