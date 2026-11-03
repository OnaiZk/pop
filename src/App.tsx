import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import {
  Film,
  ClipboardCheck,
  FileText,
  Smartphone,
  Monitor,
  Columns,
  Play,
  Clock,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Plus,
  Copy,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { POPS_DATA, PopDocument } from './data/pops';
import {
  PopVideoComposition,
  POP_VIDEO_DURATION_FRAMES,
  POP_VIDEO_FPS,
  SCENE_CHAPTERS,
  getSceneChapters,
} from './remotion/PopVideoComposition';
import { InteractivePlaybook } from './components/InteractivePlaybook';
import { IsoDocumentView } from './components/IsoDocumentView';
import { PopStudioEditor, createBlankPopTemplate } from './components/PopStudioEditor';
import { EletromidiaLogo } from './components/QrCodeSvg';

type FormatMode = 'remotion' | 'playbook' | 'iso-pdf' | 'editor';
type VideoAspectMode = '16:9' | '9:16' | 'dual';

const CUSTOM_POPS_STORAGE_KEY = 'eletromidia_pops_custom_v2';
const LEGACY_POPS_STORAGE_KEY = 'eletromidia_pops_custom_v1';
const DELETED_POPS_STORAGE_KEY = 'eletromidia_pops_deleted_v1';

function loadCustomPopsFromStorage(): Record<string, PopDocument> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_POPS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Record<string, PopDocument>;
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_POPS_STORAGE_KEY);
    if (legacyRaw) {
      const legacyMap = JSON.parse(legacyRaw) as Record<string, PopDocument>;
      const defaultIds = new Set(POPS_DATA.map((p) => p.id));
      const migrated: Record<string, PopDocument> = {};
      for (const [key, val] of Object.entries(legacyMap)) {
        if (val && val.id && !defaultIds.has(val.id)) {
          migrated[key] = val;
        }
      }
      window.localStorage.setItem(CUSTOM_POPS_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return {};
  } catch {
    return {};
  }
}

function loadDeletedPopsFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DELETED_POPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function formatSeconds(frames: number): string {
  const totalSec = Math.floor(frames / POP_VIDEO_FPS);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function App() {
  const initialParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const paramPopId = initialParams?.get('pop');
  const paramView = initialParams?.get('view');

  const [customPopsMap, setCustomPopsMap] = useState<Record<string, PopDocument>>(() =>
    loadCustomPopsFromStorage()
  );
  const [deletedPopIds, setDeletedPopIds] = useState<string[]>(() =>
    loadDeletedPopsFromStorage()
  );
  const [confirmingDeletePopId, setConfirmingDeletePopId] = useState<string | null>(null);

  const defaultIdsSet = new Set(POPS_DATA.map((p) => p.id));

  const builtPopsList: PopDocument[] = [
    ...POPS_DATA.filter((defaultPop) => !deletedPopIds.includes(defaultPop.id)).map((defaultPop) =>
      customPopsMap[defaultPop.id] ? customPopsMap[defaultPop.id] : defaultPop
    ),
    ...Object.values(customPopsMap).filter(
      (p) => p && p.id && !defaultIdsSet.has(p.id) && !deletedPopIds.includes(p.id)
    ),
  ];

  const popsList: PopDocument[] =
    builtPopsList.length > 0 ? builtPopsList : [createBlankPopTemplate(1)];

  const [selectedPopId, setSelectedPopId] = useState<string>(() => {
    if (
      paramPopId &&
      !deletedPopIds.includes(paramPopId) &&
      (defaultIdsSet.has(paramPopId) || Boolean(customPopsMap[paramPopId]))
    ) {
      return paramPopId;
    }
    return popsList[0].id;
  });

  const [formatMode, setFormatMode] = useState<FormatMode>(
    paramView === 'pdf' ? 'iso-pdf' : 'remotion'
  );
  const [isEditingDoc, setIsEditingDoc] = useState<boolean>(false);
  const [creatingDraftPop, setCreatingDraftPop] = useState<PopDocument | null>(null);
  const [aspectMode, setAspectMode] = useState<VideoAspectMode>('16:9');
  const [activeChapterId, setActiveChapterId] = useState<string>(SCENE_CHAPTERS[0].id);

  const player16x9Ref = useRef<PlayerRef>(null);
  const player9x16Ref = useRef<PlayerRef>(null);

  const currentPop: PopDocument =
    popsList.find((p) => p.id === selectedPopId) || popsList[0];

  const isCurrentPopModified = Boolean(customPopsMap[currentPop.id]);
  const isCurrentPopCustomCreated = !defaultIdsSet.has(currentPop.id);

  useEffect(() => {
    document.title = `${currentPop.code} - ${currentPop.title}`;
  }, [currentPop.code, currentPop.title]);

  // Automatically sync browser localStorage edits to server backup
  useEffect(() => {
    fetch('/api/sync-custom-pops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customPopsMap, null, 2),
    }).catch(() => {});
  }, [customPopsMap]);

  const persistCustomPops = (next: Record<string, PopDocument>) => {
    try {
      window.localStorage.setItem(CUSTOM_POPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const persistDeletedPops = (next: string[]) => {
    try {
      window.localStorage.setItem(DELETED_POPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleUpdateCurrentPop = (updated: PopDocument) => {
    setCustomPopsMap((prev) => {
      const next = { ...prev, [updated.id]: updated };
      persistCustomPops(next);
      return next;
    });
  };

  const handleSaveStudioPop = (popToSave: PopDocument, isNew: boolean) => {
    setCustomPopsMap((prev) => {
      const next = { ...prev, [popToSave.id]: popToSave };
      persistCustomPops(next);
      return next;
    });
    if (deletedPopIds.includes(popToSave.id)) {
      const nextDeleted = deletedPopIds.filter((id) => id !== popToSave.id);
      setDeletedPopIds(nextDeleted);
      persistDeletedPops(nextDeleted);
    }
    if (isNew) {
      setCreatingDraftPop(null);
      setSelectedPopId(popToSave.id);
    }
  };

  const handleResetPopById = (popId: string) => {
    setCustomPopsMap((prev) => {
      const next = { ...prev };
      delete next[popId];
      persistCustomPops(next);
      return next;
    });
  };

  const handleDeletePop = (popId: string) => {
    const remainingPops = popsList.filter((p) => p.id !== popId);

    const nextCustomMap = { ...customPopsMap };
    delete nextCustomMap[popId];

    let nextDeleted = [...deletedPopIds];
    if (defaultIdsSet.has(popId) && !nextDeleted.includes(popId)) {
      nextDeleted.push(popId);
    }

    // If the user deleted the last remaining POP, create a fresh blank POP so the portal stays ready
    if (remainingPops.length === 0) {
      const freshPop = createBlankPopTemplate(1);
      nextCustomMap[freshPop.id] = freshPop;
      setCustomPopsMap(nextCustomMap);
      persistCustomPops(nextCustomMap);
      setDeletedPopIds(nextDeleted);
      persistDeletedPops(nextDeleted);
      setCreatingDraftPop(null);
      setConfirmingDeletePopId(null);
      setSelectedPopId(freshPop.id);
      return;
    }

    setCustomPopsMap(nextCustomMap);
    persistCustomPops(nextCustomMap);
    setDeletedPopIds(nextDeleted);
    persistDeletedPops(nextDeleted);
    setCreatingDraftPop(null);
    setConfirmingDeletePopId(null);

    if (selectedPopId === popId || currentPop.id === popId) {
      setSelectedPopId(remainingPops[0].id);
    }
  };

  const handleRestoreDeletedDefaults = () => {
    setDeletedPopIds([]);
    persistDeletedPops([]);
    setConfirmingDeletePopId(null);
  };

  const handleStartCreateNewPop = (templatePop?: PopDocument) => {
    const nextNum = popsList.length + 1;
    const blankOrCloned = createBlankPopTemplate(nextNum, templatePop);
    setCreatingDraftPop(blankOrCloned);
    setFormatMode('editor');
  };

  const handleOpenStudioEditor = (popId?: string) => {
    if (popId) {
      setSelectedPopId(popId);
    }
    setCreatingDraftPop(null);
    setFormatMode('editor');
  };

  const handleQuickEditClick = () => {
    setCreatingDraftPop(null);
    if (formatMode === 'iso-pdf') {
      setIsEditingDoc((prev) => !prev);
    } else {
      setFormatMode('editor');
    }
  };

  const seekToChapter = (chapterId: string, startFrame: number) => {
    setActiveChapterId(chapterId);
    if (player16x9Ref.current) {
      player16x9Ref.current.seekTo(startFrame);
    }
    if (player9x16Ref.current) {
      player9x16Ref.current.seekTo(startFrame);
    }
  };

  return (
    <div className="portal-shell">
      {/* Top Corporate Navigation Bar */}
      <header className="topbar no-print">
        <div className="topbar-inner">
          <div className="brand-group">
            <EletromidiaLogo height={26} />
            <div className="brand-divider" />
            <div className="brand-titles">
              <span className="brand-portal-name">Academia de Operações</span>
              <span className="brand-portal-sub">Concessão SP · Padrão ISO 9001</span>
            </div>
          </div>

          {/* Central Format Segmented Switcher */}
          <nav className="format-segmented" aria-label="Formato de visualização">
            <button
              type="button"
              className={`seg-btn ${formatMode === 'remotion' ? 'active' : ''}`}
              onClick={() => setFormatMode('remotion')}
            >
              <Film size={16} />
              <span>1. Vídeo (Remotion)</span>
            </button>
            <button
              type="button"
              className={`seg-btn ${formatMode === 'playbook' ? 'active' : ''}`}
              onClick={() => setFormatMode('playbook')}
            >
              <ClipboardCheck size={16} />
              <span>2. Playbook Interativo</span>
            </button>
            <button
              type="button"
              className={`seg-btn ${formatMode === 'iso-pdf' ? 'active' : ''}`}
              onClick={() => setFormatMode('iso-pdf')}
            >
              <FileText size={16} />
              <span>3. Documento A4 (PDF)</span>
            </button>
            <button
              type="button"
              className={`seg-btn ${formatMode === 'editor' ? 'active' : ''}`}
              onClick={() => handleOpenStudioEditor()}
            >
              <SlidersHorizontal size={16} />
              <span>4. Criar / Editar POPs</span>
            </button>
          </nav>

          {/* Right Quick Portal Actions */}
          <div className="topbar-actions">
            <button
              type="button"
              className="portal-create-pill"
              onClick={() => handleStartCreateNewPop()}
              title="Criar um novo Procedimento Operacional Padrão do zero ou a partir de modelo"
            >
              <Plus size={14} />
              <span>Criar POP</span>
            </button>

            <button
              type="button"
              className={`portal-edit-pill ${
                formatMode === 'editor' || (formatMode === 'iso-pdf' && isEditingDoc)
                  ? 'active'
                  : ''
              }`}
              onClick={handleQuickEditClick}
              title="Editar o POP atual no estúdio completo ou direto na folha A4"
            >
              <Pencil size={13} />
              <span>
                {formatMode === 'editor' && !creatingDraftPop
                  ? 'Editando POP...'
                  : formatMode === 'iso-pdf' && isEditingDoc
                  ? 'Editando A4...'
                  : 'Editar POP'}
              </span>
            </button>

            {confirmingDeletePopId === currentPop.id ? (
              <div className="portal-delete-confirm-inline">
                <span>Excluir {currentPop.code}?</span>
                <button
                  type="button"
                  className="portal-delete-yes-btn"
                  onClick={() => handleDeletePop(currentPop.id)}
                >
                  Sim, Excluir
                </button>
                <button
                  type="button"
                  className="portal-delete-cancel-btn"
                  onClick={() => setConfirmingDeletePopId(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="portal-delete-pill"
                onClick={() => setConfirmingDeletePopId(currentPop.id)}
                title={`Excluir o procedimento atual (${currentPop.code} — ${currentPop.title})`}
              >
                <Trash2 size={13} />
                <span>Excluir POP</span>
              </button>
            )}

            <a
              href={currentPop.systemUrl}
              target="_blank"
              rel="noreferrer"
              className="portal-link-pill"
            >
              <span>Sistema FS</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Secondary Bar: Procedure Selector + Context Header */}
      <div className="procedure-bar no-print">
        <div className="procedure-bar-inner">
          <div className="procedure-Active-info">
            <div className="procedure-badges">
              <span className="badge-code">{currentPop.code}</span>
              <span className="badge-rev">{currentPop.revision}</span>
              <span
                className={`badge-status ${
                  currentPop.status === 'ATIVO — OFICIAL' ? 'official' : 'draft'
                }`}
              >
                {currentPop.status === 'ATIVO — OFICIAL' ? 'Homologado' : 'Próximo Tutorial'}
              </span>
              {isCurrentPopCustomCreated ? (
                <span className="badge-status created">Criado no Portal</span>
              ) : (
                isCurrentPopModified && (
                  <span className="badge-status edited">Editado no Site</span>
                )
              )}

              <button
                type="button"
                className="proc-inline-action"
                onClick={() => handleOpenStudioEditor(currentPop.id)}
                title="Abrir editor completo deste POP"
              >
                <Pencil size={12} />
                <span>Editar</span>
              </button>
              <button
                type="button"
                className="proc-inline-action"
                onClick={() => handleStartCreateNewPop(currentPop)}
                title="Criar novo POP duplicando a estrutura deste"
              >
                <Copy size={12} />
                <span>Duplicar</span>
              </button>
              {confirmingDeletePopId === currentPop.id ? (
                <span className="proc-inline-confirm-group">
                  <button
                    type="button"
                    className="proc-inline-action danger-solid"
                    onClick={() => handleDeletePop(currentPop.id)}
                  >
                    <Trash2 size={12} />
                    <span>Confirmar Exclusão</span>
                  </button>
                  <button
                    type="button"
                    className="proc-inline-action"
                    onClick={() => setConfirmingDeletePopId(null)}
                  >
                    <span>Cancelar</span>
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="proc-inline-action danger"
                  onClick={() => setConfirmingDeletePopId(currentPop.id)}
                  title={`Excluir este POP (${currentPop.code})`}
                >
                  <Trash2 size={12} />
                  <span>Excluir</span>
                </button>
              )}
            </div>
            <h1 className="procedure-main-title">{currentPop.title}</h1>
            <p className="procedure-subtitle">{currentPop.objective}</p>
          </div>

          <div className="procedure-switcher-group">
            <div className="switcher-label-row">
              <span className="switcher-label">
                Selecionar, criar ou excluir POP ({popsList.length}):
              </span>
              {deletedPopIds.length > 0 && (
                <button
                  type="button"
                  className="proc-restore-defaults-btn"
                  onClick={handleRestoreDeletedDefaults}
                  title="Restaurar os POPs originais de fábrica que foram excluídos"
                >
                  <RotateCcw size={11} />
                  <span>Restaurar POPs Padrão ({deletedPopIds.length})</span>
                </button>
              )}
            </div>
            <div className="procedure-pills" role="navigation" aria-label="Selecionar POP">
              {popsList.map((popItem) => {
                const isSelected =
                  popItem.id === currentPop.id && !(formatMode === 'editor' && creatingDraftPop);
                const isCustom = !defaultIdsSet.has(popItem.id);
                return (
                  <div
                    key={popItem.id}
                    className={`proc-pill-wrap ${isSelected ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className={`proc-pill ${isSelected ? 'active' : ''} with-delete`}
                      onClick={() => {
                        setCreatingDraftPop(null);
                        setConfirmingDeletePopId(null);
                        setSelectedPopId(popItem.id);
                      }}
                    >
                      <span className="proc-pill-code">
                        {popItem.code}
                        {isCustom ? ' · NOVO' : ''}
                      </span>
                      <span className="proc-pill-title">{popItem.title}</span>
                    </button>
                    <button
                      type="button"
                      className="proc-pill-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePop(popItem.id);
                      }}
                      title={`Excluir ${popItem.code} — ${popItem.title}`}
                      aria-label={`Excluir ${popItem.code}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                className={`proc-pill create-new-pill ${
                  formatMode === 'editor' && creatingDraftPop ? 'active' : ''
                }`}
                onClick={() => handleStartCreateNewPop()}
                title="Criar um novo POP do zero ou baseado em modelo"
              >
                <span className="proc-pill-code">
                  <Plus size={12} /> NOVO POP
                </span>
                <span className="proc-pill-title">Criar Procedimento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="portal-main">
        {/* FORMAT 1: REMOTION VIDEO COURSE PLAYER */}
        {formatMode === 'remotion' && (
          <section className="video-workspace no-print">
            <div className="video-layout-grid">
              {/* Left Column: Video Theater Stage */}
              <div className="video-stage-card">
                <div className="video-stage-toolbar">
                  <div className="stage-title-group">
                    <span className="live-dot" />
                    <strong>Player de Treinamento Animado</strong>
                    <span className="stage-meta-pill">42s · 30 FPS · Full HD</span>
                  </div>

                  <div className="aspect-segmented" role="group" aria-label="Proporção do vídeo">
                    <button
                      type="button"
                      className={`aspect-btn ${aspectMode === '16:9' ? 'active' : ''}`}
                      onClick={() => setAspectMode('16:9')}
                    >
                      <Monitor size={14} />
                      <span>16:9 Sala / TV</span>
                    </button>
                    <button
                      type="button"
                      className={`aspect-btn ${aspectMode === '9:16' ? 'active' : ''}`}
                      onClick={() => setAspectMode('9:16')}
                    >
                      <Smartphone size={14} />
                      <span>9:16 Celular / Reels</span>
                    </button>
                    <button
                      type="button"
                      className={`aspect-btn ${aspectMode === 'dual' ? 'active' : ''}`}
                      onClick={() => setAspectMode('dual')}
                    >
                      <Columns size={14} />
                      <span>Comparar Ambos</span>
                    </button>
                  </div>
                </div>

                <div className={`video-canvas-area mode-${aspectMode}`}>
                  {(aspectMode === '16:9' || aspectMode === 'dual') && (
                    <div className="player-box-horizontal">
                      {aspectMode === 'dual' && (
                        <div className="player-mini-label">
                          <Monitor size={13} />
                          <span>Versão 16:9 — Integração em Sala / TV</span>
                        </div>
                      )}
                      <div className="player-frame-16x9">
                        <Player
                          ref={player16x9Ref}
                          component={PopVideoComposition}
                          inputProps={{ pop: currentPop, aspect: '16:9' as const }}
                          durationInFrames={POP_VIDEO_DURATION_FRAMES}
                          fps={POP_VIDEO_FPS}
                          compositionWidth={1280}
                          compositionHeight={720}
                          style={{ width: '100%', aspectRatio: '16 / 9' }}
                          controls
                          loop
                          autoPlay
                        />
                      </div>
                    </div>
                  )}

                  {(aspectMode === '9:16' || aspectMode === 'dual') && (
                    <div className="player-box-vertical">
                      {aspectMode === 'dual' && (
                        <div className="player-mini-label">
                          <Smartphone size={13} />
                          <span>Versão 9:16 — WhatsApp do Técnico</span>
                        </div>
                      )}
                      <div className="player-frame-9x16">
                        <Player
                          ref={player9x16Ref}
                          component={PopVideoComposition}
                          inputProps={{ pop: currentPop, aspect: '9:16' as const }}
                          durationInFrames={POP_VIDEO_DURATION_FRAMES}
                          fps={POP_VIDEO_FPS}
                          compositionWidth={720}
                          compositionHeight={1280}
                          style={{
                            width: aspectMode === '9:16' ? '340px' : '240px',
                            aspectRatio: '9 / 16',
                          }}
                          controls
                          loop
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="video-stage-footer">
                  <div className="summary-stat">
                    <ShieldCheck size={16} className="icon-orange" />
                    <span>
                      <strong>{currentPop.epis.length} EPIs</strong> com CA listado
                    </span>
                  </div>
                  <div className="summary-stat">
                    <Wrench size={16} className="icon-orange" />
                    <span>
                      <strong>{currentPop.toolKits.length} Kits</strong> de ferramentas organizados
                    </span>
                  </div>
                  <div className="summary-stat">
                    <CheckCircle2 size={16} className="icon-orange" />
                    <span>
                      <strong>{currentPop.steps.length} Etapas</strong> com padrão de 3 fotos FS
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Course Chapters Playlist */}
              <aside className="chapters-sidebar-card">
                <div className="sidebar-header">
                  <div>
                    <h2>Capítulos do Vídeo</h2>
                    <p>Clique em um tópico para pular direto na animação</p>
                  </div>
                  <span className="duration-badge">
                    <Clock size={12} /> 00:42
                  </span>
                </div>

                <div className="chapter-list">
                  {getSceneChapters(currentPop).map((chap, idx) => {
                    const isActive = activeChapterId === chap.id;
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        className={`chapter-item ${isActive ? 'active' : ''}`}
                        onClick={() => seekToChapter(chap.id, chap.startFrame)}
                      >
                        <div className="chapter-num">{String(idx + 1).padStart(2, '0')}</div>
                        <div className="chapter-info">
                          <strong>{chap.label.replace(/^\d+\s·\s/, '')}</strong>
                          <span>Início em {formatSeconds(chap.startFrame)}</span>
                        </div>
                        <div className="chapter-play-icon">
                          <Play size={13} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="sidebar-export-box">
                  <h3>Exportação em MP4</h3>
                  <p>
                    Gere os vídeos finais em alta definição para enviar no WhatsApp da equipe ou
                    passar na TV:
                  </p>
                  <div className="cmd-snippet">
                    <code>npm run remotion:render:9x16</code>
                  </div>
                  <div className="cmd-snippet">
                    <code>npm run remotion:render:16x9</code>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* FORMAT 2: INTERACTIVE FIELD PLAYBOOK */}
        {formatMode === 'playbook' && <InteractivePlaybook pop={currentPop} />}

        {/* FORMAT 3: REDESIGNED ISO 9001 A4 DOCUMENT */}
        {formatMode === 'iso-pdf' && (
          <IsoDocumentView
            pop={currentPop}
            isEditing={isEditingDoc}
            onToggleEdit={() => setIsEditingDoc((prev) => !prev)}
            onUpdatePop={handleUpdateCurrentPop}
            onResetPop={() => handleResetPopById(currentPop.id)}
            onDeletePop={() => handleDeletePop(currentPop.id)}
            isModified={isCurrentPopModified}
            isCustomCreated={isCurrentPopCustomCreated}
            onOpenStudioEditor={() => handleOpenStudioEditor(currentPop.id)}
          />
        )}

        {/* FORMAT 4: FULL POP CREATION & EDITING STUDIO */}
        {formatMode === 'editor' && (
          <PopStudioEditor
            popsList={popsList}
            currentPop={creatingDraftPop || currentPop}
            isCreatingNew={Boolean(creatingDraftPop)}
            isModified={isCurrentPopModified}
            isCustomCreated={isCurrentPopCustomCreated}
            deletedDefaultsCount={deletedPopIds.length}
            onRestoreDeletedDefaults={handleRestoreDeletedDefaults}
            onSelectPop={(popId) => {
              setCreatingDraftPop(null);
              setSelectedPopId(popId);
            }}
            onStartCreateNew={handleStartCreateNewPop}
            onSavePop={handleSaveStudioPop}
            onDeletePop={handleDeletePop}
            onResetDefaultPop={handleResetPopById}
            onOpenInlineA4Editor={() => {
              setCreatingDraftPop(null);
              setFormatMode('iso-pdf');
              setIsEditingDoc(true);
            }}
            onExitEditor={(target) => {
              setCreatingDraftPop(null);
              setFormatMode(target || 'iso-pdf');
            }}
          />
        )}
      </main>
    </div>
  );
}
