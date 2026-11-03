import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { PopDocument } from '../data/pops';
import { TechnicalDiagram } from '../components/TechnicalDiagrams';
import { EletromidiaLogo } from '../components/QrCodeSvg';

export type PopVideoProps = {
  pop: PopDocument;
  aspect: '16:9' | '9:16';
};

export const POP_VIDEO_FPS = 30;
export const POP_VIDEO_DURATION_FRAMES = 1260; // 42 seconds at 30fps

export const SCENE_CHAPTERS = [
  { id: 'intro', label: '01 · Abertura & Objetivo', startFrame: 0, durationFrames: 150 },
  { id: 'epis', label: '02 · EPIs Obrigatórios (CAs)', startFrame: 150, durationFrames: 210 },
  { id: 'kits', label: '03 · Kits de Ferramentas', startFrame: 360, durationFrames: 210 },
  { id: 'step12', label: '04 · Saída & Sinalização Cones', startFrame: 570, durationFrames: 240 },
  { id: 'step3', label: '05 · Sistema FS & 3 Fotos', startFrame: 810, durationFrames: 240 },
  { id: 'step4', label: '06 · Pós-Atividade & Isolamento', startFrame: 1050, durationFrames: 210 },
];

export function getSceneChapters(pop?: PopDocument) {
  const epiCount = pop?.epis?.length ?? 12;
  const isFundacao = pop?.id === 'fundacao-totem-abrigo';
  const isLavagem = pop?.id === 'lavagem-abrigo-totem';

  return [
    { id: 'intro', label: '01 · Abertura & Objetivo', startFrame: 0, durationFrames: 150 },
    {
      id: 'epis',
      label: `02 · ${epiCount} EPIs Obrigatórios (CAs)`,
      startFrame: 150,
      durationFrames: 210,
    },
    { id: 'kits', label: '03 · Kits de Ferramentas', startFrame: 360, durationFrames: 210 },
    { id: 'step12', label: '04 · Saída & Sinalização Cones', startFrame: 570, durationFrames: 240 },
    {
      id: 'step3',
      label: isFundacao
        ? '05 · 3 Fotos FS, Escavação & Concreto'
        : isLavagem
        ? '05 · 3 Fotos FS & Lavagem'
        : '05 · Sistema FS & 3 Fotos',
      startFrame: 810,
      durationFrames: 240,
    },
    {
      id: 'step4',
      label: isFundacao
        ? '06 · Podotátil & Isolamento de Cura'
        : isLavagem
        ? '06 · Pós-Lavagem & Piso Seco'
        : '06 · Pós-Atividade & Tinta Fresca',
      startFrame: 1050,
      durationFrames: 210,
    },
  ];
}

export const PopVideoComposition: React.FC<PopVideoProps> = ({ pop, aspect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isVertical = aspect === '9:16';
  const chapters = getSceneChapters(pop);

  const currentChapter =
    chapters.find(
      (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
    ) || chapters[chapters.length - 1];

  const localFrame = frame - currentChapter.startFrame;
  const entrance = spring({
    fps,
    frame: localFrame,
    config: { damping: 18, stiffness: 130, mass: 0.8 },
  });

  const progressPct = Math.min(100, (frame / POP_VIDEO_DURATION_FRAMES) * 100);
  const timeSec = Math.floor(frame / fps);
  const totalSec = Math.floor(POP_VIDEO_DURATION_FRAMES / fps);
  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#121417',
        color: '#F5F3EE',
        fontFamily: 'Archivo, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '2px solid #2A2F37',
      }}
    >
      {/* Top Swiss Grid Telemetry Masthead */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isVertical ? '1fr auto' : 'auto 1fr auto auto',
          alignItems: 'center',
          borderBottom: '1px solid #2A2F37',
          backgroundColor: '#171A1F',
          padding: isVertical ? '24px 28px' : '16px 32px',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <EletromidiaLogo height={isVertical ? 32 : 28} />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: isVertical ? 15 : 13,
              padding: '4px 10px',
              backgroundColor: '#FF4F00',
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            {pop.code} · REV {pop.revision}
          </span>
        </div>

        {!isVertical && (
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#F5F3EE',
              textTransform: 'uppercase',
            }}
          >
            {pop.title} — {currentChapter.label}
          </div>
        )}

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isVertical ? 15 : 13,
            color: '#9BA3B0',
            textAlign: 'right',
          }}
        >
          ISO 9001:2015 // {fmtTime(timeSec)} / {fmtTime(totalSec)}
        </div>
      </div>

      {/* Main Dynamic Scene Canvas */}
      <div
        style={{
          flex: 1,
          padding: isVertical ? '32px 28px' : '28px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: `translateY(${interpolate(entrance, [0, 1], [18, 0])}px)`,
          opacity: interpolate(entrance, [0, 1], [0.25, 1]),
        }}
      >
        {currentChapter.id === 'intro' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isVertical ? '1fr' : '1.25fr 1fr',
              gap: '28px',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                border: '1px solid #2E343E',
                backgroundColor: '#181C22',
                padding: isVertical ? '32px' : '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FF4F00',
                    color: '#FFFFFF',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: isVertical ? 16 : 13,
                    fontWeight: 700,
                    padding: '6px 12px',
                    marginBottom: '18px',
                  }}
                >
                  TREINAMENTO OPERACIONAL DE CAMPO // {pop.responsible}
                </div>
                <div
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: isVertical ? 64 : 58,
                    fontWeight: 700,
                    lineHeight: 0.96,
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    marginBottom: '18px',
                  }}
                >
                  {pop.title}
                </div>
                <p
                  style={{
                    fontSize: isVertical ? 22 : 18,
                    lineHeight: 1.45,
                    color: '#D5D9E0',
                    margin: 0,
                  }}
                >
                  {pop.objective}
                </p>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '18px',
                  borderTop: '1px solid #2E343E',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: isVertical ? 14 : 12,
                }}
              >
                <div>
                  <div style={{ color: '#9BA3B0' }}>ELABORAÇÃO</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, marginTop: 4 }}>{pop.author}</div>
                </div>
                <div>
                  <div style={{ color: '#9BA3B0' }}>EMISSÃO</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, marginTop: 4 }}>{pop.issueDate}</div>
                </div>
                <div>
                  <div style={{ color: '#9BA3B0' }}>SISTEMA</div>
                  <div style={{ color: '#FF4F00', fontWeight: 700, marginTop: 4 }}>SISTEMA FS</div>
                </div>
              </div>
            </div>

            <div
              style={{
                border: '1px solid #2E343E',
                backgroundColor: '#181C22',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: isVertical ? 28 : 24,
                  fontWeight: 700,
                  color: '#FF4F00',
                  textTransform: 'uppercase',
                }}
              >
                FLUXO MACRO DO PROCEDIMENTO ({pop.steps.length} ETAPAS)
              </div>
              {pop.steps.map((s, idx) => {
                const itemProgress = spring({
                  fps,
                  frame: localFrame - idx * 8,
                  config: { damping: 18, stiffness: 140 },
                });
                return (
                  <div
                    key={s.code}
                    style={{
                      border: '1px solid #2E343E',
                      backgroundColor: '#13161B',
                      padding: isVertical ? '16px 18px' : '12px 16px',
                      display: 'grid',
                      gridTemplateColumns: '68px 1fr',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(itemProgress, [0, 1], [24, 0])}px)`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#FF4F00',
                      }}
                    >
                      0{s.itemNumber} //
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: isVertical ? 19 : 15,
                        color: '#F5F3EE',
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentChapter.id === 'epis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid #2E343E',
                paddingBottom: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: isVertical ? 44 : 38,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                5. EPIs E UNIFORMES OBRIGATÓRIOS ({pop.epis.length} ITENS COM CA)
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                  color: '#FF4F00',
                  fontWeight: 700,
                }}
              >
                VALIDAÇÃO SST OBRIGATÓRIA
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isVertical ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '12px',
              }}
            >
              {pop.epis.map((epi, idx) => {
                const cardIn = spring({
                  fps,
                  frame: localFrame - idx * 4,
                  config: { damping: 16, stiffness: 150 },
                });
                return (
                  <div
                    key={epi.id}
                    style={{
                      border: '1px solid #2E343E',
                      backgroundColor: '#181C22',
                      padding: isVertical ? '16px' : '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                      opacity: interpolate(cardIn, [0, 1], [0, 1]),
                      transform: `scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 8px',
                          backgroundColor: '#FF4F00',
                          color: '#FFFFFF',
                        }}
                      >
                        {epi.ca}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                          color: '#22C55E',
                          fontWeight: 700,
                        }}
                      >
                        [OK]
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: isVertical ? 24 : 20,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.1,
                      }}
                    >
                      {epi.name}
                    </div>
                    <div style={{ fontSize: isVertical ? 14 : 12, color: '#9BA3B0', lineHeight: 1.3 }}>
                      {epi.criticalNote}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentChapter.id === 'kits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid #2E343E',
                paddingBottom: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: isVertical ? 44 : 38,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                6. FERRAMENTAS E MATERIAIS SEPARADOS POR KIT FUNCIONAL
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                  color: '#FF4F00',
                  fontWeight: 700,
                }}
              >
                CONFERIR ANTES DE SAIR DA BASE
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isVertical ? '1fr' : `repeat(${pop.toolKits.length}, 1fr)`,
                gap: '16px',
              }}
            >
              {pop.toolKits.map((kit, kIdx) => {
                const kitIn = spring({
                  fps,
                  frame: localFrame - kIdx * 10,
                  config: { damping: 17, stiffness: 130 },
                });
                return (
                  <div
                    key={kit.id}
                    style={{
                      border: '1px solid #2E343E',
                      backgroundColor: '#181C22',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: interpolate(kitIn, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(kitIn, [0, 1], [24, 0])}px)`,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FF4F00',
                        padding: '10px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontSize: isVertical ? 26 : 22,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        {kit.code} // {kit.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          color: '#FFFFFF',
                          fontWeight: 700,
                        }}
                      >
                        {kit.items.length} ITENS
                      </span>
                    </div>
                    <div
                      style={{
                        padding: '14px 16px',
                        display: 'grid',
                        gridTemplateColumns: isVertical ? 'repeat(2, 1fr)' : '1fr',
                        gap: '8px',
                      }}
                    >
                      {kit.items.map((item) => (
                        <div
                          key={item.name}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #252A33',
                            paddingBottom: '5px',
                            fontSize: isVertical ? 16 : 13.5,
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#F5F3EE' }}>{item.name}</span>
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 11.5,
                              color: '#9BA3B0',
                            }}
                          >
                            {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(currentChapter.id === 'step12' ||
          currentChapter.id === 'step3' ||
          currentChapter.id === 'step4') && (() => {
          const stepIndex =
            currentChapter.id === 'step12'
              ? localFrame < 115
                ? 0
                : 1
              : currentChapter.id === 'step3'
              ? 2
              : 3;
          const activeStep = pop.steps[stepIndex] || pop.steps[0];

          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isVertical ? '1fr' : '1.05fr 1.15fr',
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              <div
                style={{
                  border: '1px solid #2E343E',
                  backgroundColor: '#181C22',
                  padding: isVertical ? '28px' : '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <span
                      style={{
                        backgroundColor: '#FF4F00',
                        color: '#FFFFFF',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 14,
                        fontWeight: 700,
                        padding: '5px 12px',
                      }}
                    >
                      ITEM {String(activeStep.itemNumber).padStart(2, '0')} DE{' '}
                      {String(pop.steps.length).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 13,
                        color: '#9BA3B0',
                      }}
                    >
                      FASE: {activeStep.phase}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: isVertical ? 48 : 42,
                      fontWeight: 700,
                      lineHeight: 1.02,
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      marginBottom: '14px',
                    }}
                  >
                    {activeStep.title}
                  </div>

                  <p
                    style={{
                      fontSize: isVertical ? 20 : 16.5,
                      lineHeight: 1.45,
                      color: '#D5D9E0',
                      marginBottom: '18px',
                    }}
                  >
                    {activeStep.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeStep.bullets.map((b, i) => (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #2A303A',
                          backgroundColor: '#13161B',
                          padding: '10px 14px',
                          fontSize: isVertical ? 17 : 14.5,
                          color: '#F5F3EE',
                          display: 'flex',
                          gap: '10px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#FF4F00',
                            fontWeight: 700,
                          }}
                        >
                          0{i + 1}.
                        </span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Alert Box */}
                <div
                  style={{
                    marginTop: '18px',
                    border: '1px solid #D97706',
                    backgroundColor: '#241A10',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#FBBF24',
                      marginBottom: '4px',
                    }}
                  >
                    INSTRUÇÃO CRÍTICA DE SEGURANÇA & QUALIDADE
                  </div>
                  <div style={{ fontSize: isVertical ? 17 : 14.5, fontWeight: 600, color: '#FFFFFF' }}>
                    {activeStep.criticalInstruction}
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid #2E343E',
                  backgroundColor: '#181C22',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    color: '#FF4F00',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  REGISTRO VISUAL DO PADRÃO // DIAGRAMA DE CAMPO
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeStep.customImageUrl ? (
                    <img
                      src={activeStep.customImageUrl}
                      alt={activeStep.visualStandardCaption}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '280px',
                        objectFit: 'contain',
                        border: '1px solid #2E343E',
                      }}
                    />
                  ) : (
                    <TechnicalDiagram type={activeStep.diagramType} popId={pop.id} dark />
                  )}
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    color: '#9BA3B0',
                  }}
                >
                  {activeStep.visualStandardCaption}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom Progress & Chapter Bar */}
      <div
        style={{
          backgroundColor: '#171A1F',
          borderTop: '1px solid #2A2F37',
          padding: isVertical ? '18px 28px' : '12px 32px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${chapters.length}, 1fr)`,
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          {chapters.map((chap) => {
            const active = chap.id === currentChapter.id;
            return (
              <div
                key={chap.id}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: isVertical ? 11 : 11,
                  color: active ? '#FF4F00' : '#7B8494',
                  fontWeight: active ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {chap.label}
              </div>
            );
          })}
        </div>
        <div style={{ height: '6px', backgroundColor: '#262B33', width: '100%' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              backgroundColor: '#FF4F00',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
