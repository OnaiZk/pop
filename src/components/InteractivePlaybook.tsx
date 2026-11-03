import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  Wrench,
  Camera,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ListChecks,
  HelpCircle,
} from 'lucide-react';
import { PopDocument } from '../data/pops';
import { TechnicalDiagram } from './TechnicalDiagrams';

interface InteractivePlaybookProps {
  pop: PopDocument;
}

type PlaybookTab = 'steps' | 'checklists' | 'simulator' | 'quiz';

export const InteractivePlaybook: React.FC<InteractivePlaybookProps> = ({ pop }) => {
  const [activeTab, setActiveTab] = useState<PlaybookTab>('steps');
  const [checkedEpis, setCheckedEpis] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(pop.epis.slice(0, 4).map((e) => [e.id, true]))
  );
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({
    'KIT-01-Areia': true,
    'KIT-01-Cimento': true,
    'KIT-02-Lixadeira': true,
    'KIT-02-Tinta': true,
  });
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [photoStage, setPhotoStage] = useState<'antes' | 'depois'>('antes');
  const [selectedAngle, setSelectedAngle] = useState<'central' | 'direita' | 'esquerda'>('central');
  const [paintApplied, setPaintApplied] = useState<boolean>(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    setActiveStepIdx(0);
  }, [pop.id]);

  const totalEpis = pop.epis.length;
  const doneEpis = pop.epis.filter((e) => checkedEpis[e.id]).length;

  const totalTools = pop.toolKits.reduce((acc, k) => acc + k.items.length, 0);
  const doneTools = pop.toolKits.reduce(
    (acc, k) =>
      acc + k.items.filter((it) => checkedTools[`${k.code}-${it.name}`]).length,
    0
  );

  const checkAllPreDeparture = () => {
    const allE: Record<string, boolean> = {};
    pop.epis.forEach((e) => {
      allE[e.id] = true;
    });
    const allT: Record<string, boolean> = {};
    pop.toolKits.forEach((k) =>
      k.items.forEach((it) => {
        allT[`${k.code}-${it.name}`] = true;
      })
    );
    setCheckedEpis(allE);
    setCheckedTools(allT);
  };

  const resetPreDeparture = () => {
    setCheckedEpis({});
    setCheckedTools({});
  };

  const currentStep = pop.steps[activeStepIdx] || pop.steps[0];
  const answeredQuizCount = Object.keys(quizAnswers).length;
  const correctQuizCount = pop.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="playbook-container">
      {/* Top Sub-Navigation & Status Cards */}
      <div className="playbook-header-card">
        <div className="playbook-nav-tabs" role="tablist" aria-label="Módulos do Playbook">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'steps'}
            className={`pb-tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            <ListChecks size={17} />
            <div className="pb-tab-copy">
              <strong>Passo a Passo de Campo</strong>
              <span>{pop.steps.length} etapas com diagramas</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'checklists'}
            className={`pb-tab-btn ${activeTab === 'checklists' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklists')}
          >
            <ShieldCheck size={17} />
            <div className="pb-tab-copy">
              <strong>Checklist EPIs & Maletas</strong>
              <span>
                {doneEpis}/{totalEpis} EPIs · {doneTools}/{totalTools} itens
              </span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'simulator'}
            className={`pb-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Camera size={17} />
            <div className="pb-tab-copy">
              <strong>Simulador 3 Fotos (FS)</strong>
              <span>Treinador de ângulos e pintura</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quiz'}
            className={`pb-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={17} />
            <div className="pb-tab-copy">
              <strong>Quiz de Integração</strong>
              <span>
                {answeredQuizCount > 0
                  ? `${correctQuizCount}/${pop.quiz.length} acertos`
                  : `${pop.quiz.length} perguntas rápidas`}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* MODULE 1: STEP-BY-STEP FIELD GUIDE */}
      {activeTab === 'steps' && (
        <div className="pb-module-section">
          {/* Clean Horizontal Stepper */}
          <div className="stepper-track" role="tablist" aria-label="Etapas da manutenção">
            {pop.steps.map((step, idx) => {
              const isCurrent = activeStepIdx === idx;
              return (
                <button
                  key={step.code}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className={`stepper-node ${isCurrent ? 'active' : ''}`}
                  onClick={() => setActiveStepIdx(idx)}
                >
                  <span className="stepper-circle">{step.itemNumber}</span>
                  <div className="stepper-text">
                    <span className="stepper-phase">{step.phase}</span>
                    <strong>{step.title}</strong>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Focused 2-Column Step Card */}
          <div className="step-detail-card">
            <div className="step-detail-left">
              <div className="step-meta-row">
                <span className="badge-code">{currentStep.code}</span>
                <span className="step-phase-pill">Fase: {currentStep.phase}</span>
              </div>

              <h2 className="step-detail-title">
                Etapa {currentStep.itemNumber}: {currentStep.title}
              </h2>
              <p className="step-detail-desc">{currentStep.description}</p>

              <div className="step-tasks-list">
                <h3>O que fazer nesta etapa:</h3>
                {currentStep.bullets.map((b, i) => (
                  <div key={i} className="step-task-item">
                    <span className="task-index">{i + 1}</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="step-alert-callout">
                <AlertTriangle size={20} className="alert-icon" />
                <div>
                  <strong>Atenção ao Padrão:</strong>
                  <p>{currentStep.criticalInstruction}</p>
                </div>
              </div>

              <div className="step-navigation-footer">
                <button
                  type="button"
                  className="btn-modern secondary"
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft size={16} />
                  <span>Etapa Anterior</span>
                </button>

                <span className="step-counter-label">
                  Etapa {activeStepIdx + 1} de {pop.steps.length}
                </span>

                <button
                  type="button"
                  className="btn-modern primary"
                  disabled={activeStepIdx === pop.steps.length - 1}
                  onClick={() =>
                    setActiveStepIdx((i) => Math.min(pop.steps.length - 1, i + 1))
                  }
                >
                  <span>Próxima Etapa</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="step-detail-right">
              <div className="diagram-showcase-card">
                <div className="diagram-showcase-header">
                  <span>Ilustração Técnica do Padrão</span>
                  <span className="badge-rev">{currentStep.code}</span>
                </div>
                <div className="diagram-svg-wrapper">
                  {currentStep.customImageUrl ? (
                    <img
                      src={currentStep.customImageUrl}
                      alt={currentStep.visualStandardCaption}
                      className="playbook-custom-step-img"
                    />
                  ) : (
                    <TechnicalDiagram type={currentStep.diagramType} popId={pop.id} />
                  )}
                </div>
                <p className="diagram-caption">{currentStep.visualStandardCaption}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: EPIs & TOOL KITS CHECKLIST */}
      {activeTab === 'checklists' && (
        <div className="pb-module-section">
          <div className="checklist-toolbar-card">
            <div className="checklist-progress-group">
              <div className="progress-stat-item">
                <span>EPIs Conferidos</span>
                <strong>
                  {doneEpis} de {totalEpis}
                </strong>
              </div>
              <div className="progress-divider" />
              <div className="progress-stat-item">
                <span>Materiais & Ferramentas</span>
                <strong>
                  {doneTools} de {totalTools}
                </strong>
              </div>
            </div>

            <div className="checklist-actions">
              <button type="button" className="btn-modern primary" onClick={checkAllPreDeparture}>
                <CheckCircle2 size={16} />
                <span>Marcar Tudo Conferido</span>
              </button>
              <button type="button" className="btn-modern secondary" onClick={resetPreDeparture}>
                <RotateCcw size={15} />
                <span>Limpar Seleção</span>
              </button>
            </div>
          </div>

          <div className="checklists-two-col">
            {/* Left: EPIs Card */}
            <div className="surface-card">
              <div className="card-section-header">
                <div>
                  <h2>EPIs de Uso Obrigatório</h2>
                  <p>Confira a validade e o Certificado de Aprovação (CA) antes de sair da base</p>
                </div>
                <span className="counter-pill">
                  {doneEpis}/{totalEpis}
                </span>
              </div>

              <div className="epi-modern-grid">
                {pop.epis.map((epi) => {
                  const isChecked = !!checkedEpis[epi.id];
                  return (
                    <button
                      key={epi.id}
                      type="button"
                      className={`epi-modern-card ${isChecked ? 'checked' : ''}`}
                      onClick={() =>
                        setCheckedEpis((prev) => ({ ...prev, [epi.id]: !prev[epi.id] }))
                      }
                    >
                      <div className="epi-card-top">
                        <span className="ca-badge">{epi.ca}</span>
                        {isChecked ? (
                          <CheckSquare size={18} className="check-icon active" />
                        ) : (
                          <Square size={18} className="check-icon" />
                        )}
                      </div>
                      <strong className="epi-card-title">{epi.name}</strong>
                      <span className="epi-card-note">{epi.criticalNote}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Tool Kits Card */}
            <div className="surface-card">
              <div className="card-section-header">
                <div>
                  <h2>Kits de Ferramentas e Insumos</h2>
                  <p>Organizados por maleta funcional para facilitar a conferência</p>
                </div>
                <span className="counter-pill">
                  {doneTools}/{totalTools}
                </span>
              </div>

              <div className="kits-modern-stack">
                {pop.toolKits.map((kit) => (
                  <div key={kit.id} className="kit-group-card">
                    <div className="kit-group-header">
                      <div className="kit-title-row">
                        <Wrench size={15} className="icon-orange" />
                        <strong>{kit.title}</strong>
                      </div>
                      <span className="kit-sub-badge">{kit.subtitle}</span>
                    </div>

                    <div className="kit-items-modern-grid">
                      {kit.items.map((item) => {
                        const key = `${kit.code}-${item.name}`;
                        const checked = !!checkedTools[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`tool-modern-row ${checked ? 'checked' : ''}`}
                            onClick={() =>
                              setCheckedTools((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                          >
                            <div className="tool-row-left">
                              {checked ? (
                                <CheckSquare size={16} className="check-icon active" />
                              ) : (
                                <Square size={16} className="check-icon" />
                              )}
                              <span>{item.name}</span>
                            </div>
                            <span className="tool-qty-pill">{item.qty}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: INTERACTIVE 3-PHOTO FS SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="pb-module-section">
          <div className="surface-card simulator-wrapper-card">
            <div className="card-section-header">
              <div>
                <h2>Treinador de Fotos Obrigatórias — Sistema Field Service (FS)</h2>
                <p>
                  Todo atendimento exige 3 fotos antes de iniciar e 3 fotos após concluir, nos
                  ângulos Central, Direita e Esquerda (sem cortes ou logos sobrepostos).
                </p>
              </div>
              <span className="badge-code">6 Fotos no Total</span>
            </div>

            <div className="simulator-controls-bar">
              <div className="sim-control-block">
                <span className="sim-label">1. Escolha o momento da foto:</span>
                <div className="segmented-pills">
                  <button
                    type="button"
                    className={`pill-choice ${photoStage === 'antes' ? 'active' : ''}`}
                    onClick={() => setPhotoStage('antes')}
                  >
                    <Camera size={15} />
                    <span>Antes da Atividade (Etapa 3)</span>
                  </button>
                  <button
                    type="button"
                    className={`pill-choice ${photoStage === 'depois' ? 'active' : ''}`}
                    onClick={() => setPhotoStage('depois')}
                  >
                    <Camera size={15} />
                    <span>Pós-Atividade Concluída (Etapa 4)</span>
                  </button>
                </div>
              </div>

              <div className="sim-control-block">
                <span className="sim-label">2. Teste os 3 ângulos obrigatórios:</span>
                <div className="segmented-pills">
                  {(['esquerda', 'central', 'direita'] as const).map((ang) => (
                    <button
                      key={ang}
                      type="button"
                      className={`pill-choice ${selectedAngle === ang ? 'active' : ''}`}
                      onClick={() => setSelectedAngle(ang)}
                    >
                      <span>
                        {ang === 'central'
                          ? 'Foto 1 · Central (0°)'
                          : ang === 'direita'
                          ? 'Foto 2 · Diagonal Direita (45°)'
                          : 'Foto 3 · Diagonal Esquerda (45°)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="simulator-stage-grid">
              <div className="camera-viewfinder-card">
                <div className="camera-hud-header">
                  <span className="hud-tag">
                    CÂMERA FS · {photoStage === 'antes' ? 'ANTES DO SERVIÇO' : 'APÓS O SERVIÇO'} ·
                    ÂNGULO {selectedAngle.toUpperCase()}
                  </span>
                  <span className="hud-ok-pill">Enquadramento Correto</span>
                </div>

                <div className="camera-preview-canvas">
                  <div
                    className={`totem-3d-mockup angle-${selectedAngle} stage-${photoStage}`}
                  >
                    <div className="totem-mockup-top">ELETROMIDIA</div>
                    <div className="totem-mockup-body">
                      {pop.id === 'fundacao-totem-abrigo'
                        ? photoStage === 'antes'
                          ? '3 Fotos Iniciais: Calçada existente e marcação da vala'
                          : '3 Fotos Finais: Fundação concretada, piso podotátil e isolamento de cura'
                        : pop.id === 'lavagem-abrigo-totem'
                        ? photoStage === 'antes'
                          ? '3 Fotos Iniciais: Estado de sujidade do abrigo/totem'
                          : '3 Fotos Finais: Vidros limpos, estrutura higienizada e calçada seca'
                        : photoStage === 'antes'
                        ? 'Registrar estado inicial do totem e possíveis avarias'
                        : 'Totem limpo, nivelado e manutenção finalizada'}
                    </div>
                    <div className="totem-mockup-base">
                      {pop.id === 'fundacao-totem-abrigo'
                        ? 'Bloco Nivelado + Piso Podotátil + Cerco de Cura'
                        : 'Base + Piso Podotátil Visíveis'}
                    </div>
                  </div>
                </div>

                <div className="camera-hud-footer">
                  <strong>Regra de enquadramento:</strong>{' '}
                  {selectedAngle === 'central'
                    ? 'Posicione-se de frente (0°) mostrando o ponto/equipamento inteiro até o piso podotátil.'
                    : selectedAngle === 'direita'
                    ? 'Posicione-se a 45° pela direita mostrando a lateral e a faixa livre de passagem da calçada.'
                    : 'Posicione-se a 45° pela esquerda mostrando a outra lateral e o entorno sinalizado.'}
                </div>
              </div>

              <div className="paint-rule-card">
                <h3>Condicional de Fechamento (Etapa 4)</h3>
                {pop.id === 'fundacao-totem-abrigo' ? (
                  <>
                    <p>
                      Simule abaixo o procedimento obrigatório de isolamento da fundação após a
                      concretagem e recomposição do piso podotátil:
                    </p>

                    <label className="modern-switch-row">
                      <input
                        type="checkbox"
                        checked={paintApplied}
                        onChange={(e) => setPaintApplied(e.target.checked)}
                      />
                      <span>Concreto da fundação ou argamassa em período de cura?</span>
                    </label>

                    {paintApplied ? (
                      <div className="paint-warning-box">
                        <div className="paint-sign-badge">ISOLAMENTO DE CURA OBRIGATÓRIO</div>
                        <p>
                          <strong>Procedimento Obrigatório:</strong> Recolha o entulho em sacos de
                          ráfia, varra a calçada e mantenha o bloco recém-concretado cercado com{' '}
                          <strong>Tela Tapume Laranja + Cones</strong> durante a cura antes de enviar
                          as 3 fotos finais no Sistema FS.
                        </p>
                      </div>
                    ) : (
                      <div className="paint-clear-box">
                        <strong>Cura concluída e piso liberado:</strong>
                        <p>
                          Com o concreto curado, piso podotátil nivelado e sem entulhos na calçada,
                          recolha o isolamento e finalize o chamado com as 3 fotos no Sistema FS.
                        </p>
                      </div>
                    )}
                  </>
                ) : pop.id === 'lavagem-abrigo-totem' ? (
                  <>
                    <p>
                      Simule abaixo a liberação da calçada após a lavagem e higienização do
                      mobiliário:
                    </p>

                    <label className="modern-switch-row">
                      <input
                        type="checkbox"
                        checked={paintApplied}
                        onChange={(e) => setPaintApplied(e.target.checked)}
                      />
                      <span>Ainda há água ou espuma acumulada no piso podotátil?</span>
                    </label>

                    {paintApplied ? (
                      <div className="paint-warning-box">
                        <div className="paint-sign-badge">ATENÇÃO: PISO MOLHADO</div>
                        <p>
                          <strong>Procedimento Obrigatório:</strong> Mantenha a placa{' '}
                          <strong>“PISO MOLHADO”</strong> e os cones posicionados enquanto puxa o
                          excesso de água com rodo/vassoura para evitar quedas de pedestres.
                        </p>
                      </div>
                    ) : (
                      <div className="paint-clear-box">
                        <strong>Calçada seca e desobstruída:</strong>
                        <p>
                          Com o piso seco e sem resíduos de sabão, recolha a placa e os cones e
                          registre as 3 fotos finais no Sistema FS.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      Simule abaixo o que deve ser feito na calçada caso o totem tenha recebido
                      pintura:
                    </p>

                    <label className="modern-switch-row">
                      <input
                        type="checkbox"
                        checked={paintApplied}
                        onChange={(e) => setPaintApplied(e.target.checked)}
                      />
                      <span>Houve aplicação de tinta neste atendimento?</span>
                    </label>

                    {paintApplied ? (
                      <div className="paint-warning-box">
                        <div className="paint-sign-badge">ATENÇÃO: TINTA FRESCA</div>
                        <p>
                          <strong>Procedimento Obrigatório:</strong> Mantenha o equipamento isolado
                          com cones/fita e fixe o aviso de <strong>“TINTA FRESCA”</strong> visível
                          aos pedestres antes de encerrar o chamado no Sistema FS.
                        </p>
                      </div>
                    ) : (
                      <div className="paint-clear-box">
                        <strong>Sem pintura realizada:</strong>
                        <p>
                          Limpe completamente os respingos ou detritos da calçada, recolha os cones
                          de sinalização e envie as 3 fotos finais no Sistema FS.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: ONBOARDING QUIZ */}
      {activeTab === 'quiz' && (
        <div className="pb-module-section">
          <div className="surface-card">
            <div className="card-section-header">
              <div>
                <h2>Avaliação Rápida do Técnico</h2>
                <p>Responda às 3 questões abaixo para validar os pontos críticos deste POP</p>
              </div>
              <span className="counter-pill">
                Acertos: {correctQuizCount} de {pop.quiz.length}
              </span>
            </div>

            <div className="quiz-modern-list">
              {pop.quiz.map((q, qIdx) => {
                const selected = quizAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="quiz-modern-item">
                    <div className="quiz-q-header">
                      <span className="quiz-q-num">Questão {qIdx + 1}</span>
                      <strong>{q.question}</strong>
                    </div>

                    <div className="quiz-options-grid">
                      {q.options.map((opt, oIdx) => {
                        let statusClass = '';
                        if (isAnswered) {
                          if (oIdx === q.correctIndex) statusClass = 'correct';
                          else if (oIdx === selected) statusClass = 'wrong';
                        }
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            className={`quiz-option-card ${statusClass}`}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                          >
                            <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`quiz-explanation-banner ${isCorrect ? 'ok' : 'warn'}`}>
                        <ShieldCheck size={18} />
                        <div>
                          <strong>{isCorrect ? 'Resposta Correta! ' : 'Atenção à regra: '}</strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
