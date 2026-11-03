import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Download,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { EpiItem, PopDocument, ProcessStep, ToolItem, ToolKit } from '../data/pops';
import { TechnicalDiagram } from './TechnicalDiagrams';
import { EletromidiaLogo } from './QrCodeSvg';

interface IsoDocumentViewProps {
  pop: PopDocument;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdatePop: (updated: PopDocument) => void;
  onResetPop: () => void;
  onDeletePop?: () => void;
  isModified: boolean;
  isCustomCreated?: boolean;
  onOpenStudioEditor?: () => void;
}

const DEFAULT_ORIENTATION_NOTE =
  'Orientacao de uso do modelo: substitua os campos entre colchetes, duplique linhas da tabela de etapas conforme necessario e insira fotos nitidas nos 3 ângulos padrão (central, direita e esquerda) sem logo aplicado sobre a imagem. Mantenha o rodape e a identidade visual da Eletromidia.';

const AutoTextarea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, className = '', placeholder }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`pdf-inline-textarea ${className}`}
    />
  );
};

const IsoHeaderTable: React.FC<{
  pop: PopDocument;
  page: number;
  totalPages: number;
  isEditing: boolean;
  onChangeField: <K extends keyof PopDocument>(field: K, value: PopDocument[K]) => void;
}> = ({ pop, page, totalPages, isEditing, onChangeField }) => (
  <table className="pdf-header-table" aria-label={`Cabeçalho página ${page}`}>
    <colgroup>
      <col style={{ width: '28%' }} />
      <col style={{ width: '45%' }} />
      <col style={{ width: '27%' }} />
    </colgroup>
    <tbody>
      <tr className="pdf-header-row-top">
        <td className="pdf-logo-cell">
          <EletromidiaLogo height={30} />
        </td>
        <td>
          <div className="pdf-field-label">Nome do procedimento</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value pdf-field-title"
              value={pop.title}
              onChange={(e) => onChangeField('title', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value pdf-field-title">{pop.title}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Numero do documento</div>
          {isEditing ? (
            <div className="pdf-bracket-input-wrap">
              <span>[</span>
              <input
                type="text"
                className="pdf-inline-input pdf-field-value"
                value={pop.code}
                onChange={(e) => onChangeField('code', e.target.value)}
              />
              <span>]</span>
            </div>
          ) : (
            <div className="pdf-field-value">[{pop.code}]</div>
          )}
        </td>
      </tr>
      <tr>
        <td>
          <div className="pdf-field-label">Elaboracao</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.author}
              onChange={(e) => onChangeField('author', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.author}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Data de emissao</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.issueDate}
              onChange={(e) => onChangeField('issueDate', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.issueDate}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Revisao</div>
          {isEditing ? (
            <div className="pdf-bracket-input-wrap">
              <span>[</span>
              <input
                type="text"
                className="pdf-inline-input pdf-field-value"
                value={pop.revision}
                onChange={(e) => onChangeField('revision', e.target.value)}
              />
              <span>]</span>
            </div>
          ) : (
            <div className="pdf-field-value">[{pop.revision}]</div>
          )}
        </td>
      </tr>
      <tr>
        <td>
          <div className="pdf-field-label">Area</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.area}
              onChange={(e) => onChangeField('area', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.area}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Responsável</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.responsible}
              onChange={(e) => onChangeField('responsible', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.responsible}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Data de revisao</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.reviewDate}
              onChange={(e) => onChangeField('reviewDate', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.reviewDate}</div>
          )}
        </td>
      </tr>
      <tr>
        <td>
          <div className="pdf-field-label">Aprovacao</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.approver}
              onChange={(e) => onChangeField('approver', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.approver}</div>
          )}
        </td>
        <td>
          <div className="pdf-field-label">Referencia de controle</div>
          {isEditing ? (
            <input
              type="text"
              className="pdf-inline-input pdf-field-value"
              value={pop.controlRef}
              onChange={(e) => onChangeField('controlRef', e.target.value)}
            />
          ) : (
            <div className="pdf-field-value">{pop.controlRef}</div>
          )}
        </td>
        <td className="pdf-page-count-cell">
          <div className="pdf-field-label">
            Página {page} de {totalPages}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
);

const PdfStepRow: React.FC<{
  step: ProcessStep;
  popId: string;
  areaResponsible: string;
  isEditing: boolean;
  onUpdateStep: (updatedStep: ProcessStep) => void;
}> = ({ step, popId, areaResponsible, isEditing, onUpdateStep }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBulletChange = (idx: number, val: string) => {
    const next = [...step.bullets];
    next[idx] = val;
    onUpdateStep({ ...step, bullets: next });
  };

  const handleAddBullet = () => {
    onUpdateStep({ ...step, bullets: [...step.bullets, 'Nova instrução operacional.'] });
  };

  const handleRemoveBullet = (idx: number) => {
    const next = step.bullets.filter((_, i) => i !== idx);
    onUpdateStep({ ...step, bullets: next });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateStep({ ...step, customImageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <tr>
      <td className="pdf-step-item-col">{step.itemNumber}</td>
      <td className="pdf-step-desc-col">
        {isEditing ? (
          <input
            type="text"
            className="pdf-inline-input pdf-step-heading"
            value={step.title}
            onChange={(e) => onUpdateStep({ ...step, title: e.target.value })}
          />
        ) : (
          <div className="pdf-step-heading">{step.title.toUpperCase()}:</div>
        )}

        {isEditing ? (
          <AutoTextarea
            className="pdf-step-paragraph"
            value={step.description}
            onChange={(val) => onUpdateStep({ ...step, description: val })}
          />
        ) : (
          <p className="pdf-step-paragraph">{step.description}</p>
        )}

        <ul className="pdf-step-bullet-list">
          {step.bullets.map((b, idx) => (
            <li key={idx}>
              {isEditing ? (
                <div className="pdf-edit-row-inline">
                  <AutoTextarea
                    className="pdf-step-bullet-input"
                    value={b}
                    onChange={(val) => handleBulletChange(idx, val)}
                  />
                  <button
                    type="button"
                    className="pdf-mini-icon-btn danger no-print"
                    onClick={() => handleRemoveBullet(idx)}
                    title="Remover tópico"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ) : (
                b
              )}
            </li>
          ))}
        </ul>

        {isEditing && (
          <button
            type="button"
            className="pdf-add-inline-btn no-print"
            onClick={handleAddBullet}
          >
            <Plus size={11} /> Adicionar tópico
          </button>
        )}

        <div className="pdf-step-critical-block">
          <div className="pdf-step-sublabel">Instruções críticas / qualidade:</div>
          {isEditing ? (
            <AutoTextarea
              className="pdf-step-paragraph"
              value={step.criticalInstruction}
              onChange={(val) => onUpdateStep({ ...step, criticalInstruction: val })}
            />
          ) : (
            <p className="pdf-step-paragraph">{step.criticalInstruction}</p>
          )}
        </div>

        <div className="pdf-step-resp-line">
          <strong>Responsabilidade:</strong> Técnicos ({areaResponsible})
        </div>
      </td>
      <td className="pdf-step-visual-col">
        {isEditing ? (
          <AutoTextarea
            className="pdf-visual-caption"
            value={step.visualStandardCaption}
            onChange={(val) => onUpdateStep({ ...step, visualStandardCaption: val })}
          />
        ) : (
          <div className="pdf-visual-caption">{step.visualStandardCaption}</div>
        )}

        <div className="pdf-visual-diagram-wrap">
          {step.customImageUrl ? (
            <img
              src={step.customImageUrl}
              alt={step.visualStandardCaption}
              className="pdf-custom-step-img"
            />
          ) : (
            <TechnicalDiagram type={step.diagramType} popId={popId} compact />
          )}
        </div>

        {isEditing && (
          <div className="pdf-visual-edit-controls no-print">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              className="pdf-add-inline-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={11} /> {step.customImageUrl ? 'Trocar Foto' : 'Enviar Foto'}
            </button>
            {step.customImageUrl && (
              <button
                type="button"
                className="pdf-add-inline-btn danger"
                onClick={() => onUpdateStep({ ...step, customImageUrl: undefined })}
              >
                Usar Diagrama
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

const PdfPageFooter: React.FC<{
  actionNote?: { title: string; description: string };
  isEditing?: boolean;
  onChangeActionNote?: (val: string) => void;
}> = ({ actionNote, isEditing, onChangeActionNote }) => (
  <footer className="pdf-sheet-footer">
    <div className="pdf-footer-left">
      <EletromidiaLogo height={24} />
    </div>
    <div className="pdf-footer-center">Pagina</div>
    {actionNote && (isEditing || Boolean(actionNote.description?.trim())) ? (
      <div className="pdf-footer-action-note">
        <strong>AÇÕES NECESSÁRIAS:</strong>{' '}
        {isEditing && onChangeActionNote ? (
          <AutoTextarea
            className="pdf-footer-note-input"
            value={actionNote.description}
            onChange={onChangeActionNote}
          />
        ) : (
          actionNote.description
        )}
      </div>
    ) : (
      <div className="pdf-footer-right-spacer" />
    )}
  </footer>
);

export const IsoDocumentView: React.FC<IsoDocumentViewProps> = ({
  pop,
  isEditing,
  onToggleEdit,
  onUpdatePop,
  onResetPop,
  onDeletePop,
  isModified,
  isCustomCreated = false,
  onOpenStudioEditor,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
  }, [pop.id]);

  const totalPages = 3;
  const firstPageSteps = pop.steps.slice(0, 2);
  const secondPageSteps = pop.steps.slice(2);

  const pdfFileName = `${pop.code} - ${pop.title}.pdf`;
  const pdfStaticUrl = `/pdfs/${pop.id}.pdf`;

  const updateField = <K extends keyof PopDocument>(field: K, value: PopDocument[K]) => {
    onUpdatePop({ ...pop, [field]: value });
  };

  const handleUpdateStep = (updatedStep: ProcessStep) => {
    const nextSteps = pop.steps.map((s) =>
      s.itemNumber === updatedStep.itemNumber ? updatedStep : s
    );
    updateField('steps', nextSteps);
  };

  const handlePrintCurrentPop = () => {
    const previousTitle = document.title;
    document.title = `${pop.code} - ${pop.title}`;
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 500);
  };

  const handleDownloadPdf = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the user has edited or created a new POP on the site, generate an updated vector PDF via the server endpoint
    if (!isModified && !isCustomCreated) {
      return; // Let the native <a href={pdfStaticUrl} download={pdfFileName}> download immediately
    }

    e.preventDefault();
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pop }),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback to native browser print-to-PDF if running without dev server
      handlePrintCurrentPop();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className={`iso-doc-wrapper ${isEditing ? 'is-editing-doc' : ''}`}>
      {/* Control Bar above A4 Sheets (Hidden on Print) */}
      <div className="iso-toolbar no-print">
        <div className="iso-toolbar-info">
          <span className="stamp-badge orange">{pop.code}</span>
          {isCustomCreated ? (
            <span className="stamp-badge edited">Criado no portal</span>
          ) : (
            isModified && <span className="stamp-badge edited">Editado no site</span>
          )}
          <span>
            Documento A4 individual de <strong>{pop.title}</strong> no padrão oficial Eletromidia.
          </span>
        </div>

        <div className="iso-toolbar-actions">
          {onOpenStudioEditor && (
            <button
              type="button"
              className="btn-swiss secondary"
              onClick={onOpenStudioEditor}
              title="Abrir o Editor Estruturado completo (com todos os campos, kits, etapas e quiz)"
            >
              <SlidersHorizontal size={15} />
              <span>Editor Completo</span>
            </button>
          )}

          <button
            type="button"
            className={`btn-swiss ${isEditing ? 'edit-active' : 'secondary'}`}
            onClick={onToggleEdit}
            title={
              isEditing
                ? 'Concluir edição e visualizar folha limpa'
                : 'Editar textos, tabelas, EPIs e etapas diretamente na folha A4'
            }
          >
            {isEditing ? <Check size={16} /> : <Pencil size={15} />}
            <span>{isEditing ? 'Concluir Edição A4' : 'Editar na Folha A4'}</span>
          </button>

          {isModified && !isCustomCreated && (
            <button
              type="button"
              className="btn-swiss secondary"
              onClick={onResetPop}
              title="Restaurar texto original de fábrica deste POP"
            >
              <RotateCcw size={15} />
              <span>Restaurar Padrão</span>
            </button>
          )}

          {onDeletePop && (
            <>
              {!confirmDelete ? (
                <button
                  type="button"
                  className="btn-swiss danger-outline"
                  onClick={() => setConfirmDelete(true)}
                  title={`Excluir o POP ${pop.code} — ${pop.title}`}
                >
                  <Trash2 size={15} />
                  <span>Excluir POP</span>
                </button>
              ) : (
                <div className="iso-delete-confirm-inline">
                  <button
                    type="button"
                    className="btn-swiss danger"
                    onClick={() => {
                      setConfirmDelete(false);
                      onDeletePop();
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Confirmar Exclusão</span>
                  </button>
                  <button
                    type="button"
                    className="btn-swiss secondary"
                    onClick={() => setConfirmDelete(false)}
                  >
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </>
          )}

          <a
            href={pdfStaticUrl}
            download={pdfFileName}
            onClick={handleDownloadPdf}
            className="btn-swiss primary"
            title={`Baixar apenas o PDF de ${pop.code} — ${pop.title}`}
          >
            {isExportingPdf ? <Loader2 size={16} className="spin-icon" /> : <Download size={16} />}
            <span>
              {isExportingPdf
                ? 'Gerando PDF Editado...'
                : `Baixar PDF (${pop.code} · ${pop.title})`}
            </span>
          </a>

          <button
            type="button"
            className="btn-swiss secondary"
            onClick={handlePrintCurrentPop}
            title={`Imprimir apenas ${pop.code} — ${pop.title}`}
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Helper Banner when Edit Mode is Active */}
      {isEditing && (
        <div className="iso-edit-banner no-print">
          <div className="iso-edit-banner-left">
            <Pencil size={15} />
            <span>
              <strong>Modo de Edição Direta Ativo:</strong> Clique em qualquer campo, título, EPI,
              ferramenta, etapa ou revisão diretamente nas folhas A4 abaixo para editar. Todas as
              alterações são salvas automaticamente e aplicadas ao PDF exportado.
            </span>
          </div>
          <button type="button" className="iso-edit-done-pill" onClick={onToggleEdit}>
            <Check size={14} /> Pronto
          </button>
        </div>
      )}

      {/* ==================== PÁGINA 1 DE 3 ==================== */}
      <article className="pdf-a4-page">
        <div className="pdf-orange-frame">
          <div className="pdf-page-body">
            <IsoHeaderTable
              pop={pop}
              page={1}
              totalPages={totalPages}
              isEditing={isEditing}
              onChangeField={updateField}
            />

            {/* 1. OBJETIVO */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">1. OBJETIVO</h3>
              {isEditing ? (
                <AutoTextarea
                  className="pdf-body-text"
                  value={pop.objective}
                  onChange={(val) => updateField('objective', val)}
                />
              ) : (
                <p className="pdf-body-text">{pop.objective}</p>
              )}
            </section>

            {/* 2. ABRANGENCIA */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">2. ABRANGENCIA</h3>
              {isEditing ? (
                <AutoTextarea
                  className="pdf-body-text"
                  value={pop.scope}
                  onChange={(val) => updateField('scope', val)}
                />
              ) : (
                <p className="pdf-body-text">{pop.scope}</p>
              )}
            </section>

            {/* 3. DEFINICOES */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">3. DEFINICOES</h3>
              <p className="pdf-body-text pdf-def-intro">
                Os termos utilizados dentro deste procedimento são:
              </p>
              <div className="pdf-definitions-lines">
                {pop.definitions.map((d, idx) => (
                  <div key={idx} className="pdf-body-text">
                    {isEditing ? (
                      <div className="pdf-edit-row-inline">
                        <input
                          type="text"
                          className="pdf-inline-input pdf-def-term-input"
                          value={d.term}
                          placeholder="Sigla"
                          onChange={(e) => {
                            const next = [...pop.definitions];
                            next[idx] = { ...d, term: e.target.value };
                            updateField('definitions', next);
                          }}
                        />
                        <span>-</span>
                        <input
                          type="text"
                          className="pdf-inline-input"
                          value={d.meaning}
                          placeholder="Significado"
                          onChange={(e) => {
                            const next = [...pop.definitions];
                            next[idx] = { ...d, meaning: e.target.value };
                            updateField('definitions', next);
                          }}
                        />
                        <button
                          type="button"
                          className="pdf-mini-icon-btn danger no-print"
                          onClick={() => {
                            const next = pop.definitions.filter((_, i) => i !== idx);
                            updateField('definitions', next);
                          }}
                          title="Remover definição"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ) : (
                      <>
                        {d.term} - {d.meaning}
                      </>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="pdf-add-inline-btn no-print"
                  onClick={() =>
                    updateField('definitions', [
                      ...pop.definitions,
                      { term: 'SIGLA', meaning: 'Descrição do termo' },
                    ])
                  }
                >
                  <Plus size={11} /> Adicionar definição
                </button>
              )}
            </section>

            {/* 4. RESPONSABILIDADES */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">4. RESPONSABILIDADES</h3>
              {isEditing ? (
                <AutoTextarea
                  className="pdf-body-text"
                  value={pop.responsibilities}
                  onChange={(val) => updateField('responsibilities', val)}
                />
              ) : (
                <p className="pdf-body-text">{pop.responsibilities}</p>
              )}
            </section>

            {/* 5. EQUIPAMENTOS DE PROTECAO INDIVIDUAL E COLETIVA OBRIGATORIOS */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">
                5. EQUIPAMENTOS DE PROTECAO INDIVIDUAL E COLETIVA OBRIGATORIOS
              </h3>
              <ul className="pdf-bullet-list pdf-epi-columns">
                {pop.epis.map((epi, idx) => (
                  <li key={epi.id || idx}>
                    {isEditing ? (
                      <div className="pdf-edit-epi-item">
                        <div className="pdf-edit-row-inline">
                          <input
                            type="text"
                            className="pdf-inline-input bold"
                            value={epi.name}
                            placeholder="Nome do EPI"
                            onChange={(e) => {
                              const next: EpiItem[] = [...pop.epis];
                              next[idx] = { ...epi, name: e.target.value };
                              updateField('epis', next);
                            }}
                          />
                          <input
                            type="text"
                            className="pdf-inline-input pdf-ca-input"
                            value={epi.ca}
                            placeholder="CA"
                            onChange={(e) => {
                              const next: EpiItem[] = [...pop.epis];
                              next[idx] = { ...epi, ca: e.target.value };
                              updateField('epis', next);
                            }}
                          />
                          <button
                            type="button"
                            className="pdf-mini-icon-btn danger no-print"
                            onClick={() => {
                              const next = pop.epis.filter((_, i) => i !== idx);
                              updateField('epis', next);
                            }}
                            title="Remover EPI"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                        <input
                          type="text"
                          className="pdf-inline-input"
                          value={epi.criticalNote}
                          placeholder="Instrução de uso"
                          onChange={(e) => {
                            const next: EpiItem[] = [...pop.epis];
                            next[idx] = { ...epi, criticalNote: e.target.value };
                            updateField('epis', next);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <strong>{epi.name}</strong> ({epi.ca}) — <span>{epi.criticalNote}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  type="button"
                  className="pdf-add-inline-btn no-print"
                  onClick={() =>
                    updateField('epis', [
                      ...pop.epis,
                      {
                        id: `epi-custom-${Date.now()}`,
                        name: 'Novo EPI Obrigatório',
                        ca: 'CA 00000',
                        category: 'Corpo & Pes',
                        criticalNote: 'Uso obrigatório durante a atividade',
                      },
                    ])
                  }
                >
                  <Plus size={11} /> Adicionar EPI
                </button>
              )}
            </section>

            {/* 6. FERRAMENTAS E MATERIAIS */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">6. FERRAMENTAS E MATERIAIS</h3>
              <div className="pdf-kits-container">
                {pop.toolKits.map((kit, kitIdx) => (
                  <div key={kit.id || kitIdx} className="pdf-kit-group">
                    {isEditing ? (
                      <div className="pdf-edit-row-inline pdf-kit-subtitle">
                        <input
                          type="text"
                          className="pdf-inline-input pdf-kit-code-input bold"
                          value={kit.code}
                          onChange={(e) => {
                            const next: ToolKit[] = [...pop.toolKits];
                            next[kitIdx] = { ...kit, code: e.target.value };
                            updateField('toolKits', next);
                          }}
                        />
                        <span>—</span>
                        <input
                          type="text"
                          className="pdf-inline-input bold"
                          value={kit.title}
                          onChange={(e) => {
                            const next: ToolKit[] = [...pop.toolKits];
                            next[kitIdx] = { ...kit, title: e.target.value };
                            updateField('toolKits', next);
                          }}
                        />
                        <input
                          type="text"
                          className="pdf-inline-input"
                          value={kit.subtitle}
                          onChange={(e) => {
                            const next: ToolKit[] = [...pop.toolKits];
                            next[kitIdx] = { ...kit, subtitle: e.target.value };
                            updateField('toolKits', next);
                          }}
                        />
                        {pop.toolKits.length > 1 && (
                          <button
                            type="button"
                            className="pdf-mini-icon-btn danger no-print"
                            onClick={() => {
                              const next = pop.toolKits.filter((_, i) => i !== kitIdx);
                              updateField('toolKits', next);
                            }}
                            title="Remover kit de ferramentas"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="pdf-kit-subtitle">
                        {kit.code} — {kit.title} ({kit.subtitle}):
                      </div>
                    )}
                    <ul className="pdf-bullet-list pdf-tools-columns">
                      {kit.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          {isEditing ? (
                            <div className="pdf-edit-row-inline">
                              <input
                                type="text"
                                className="pdf-inline-input bold"
                                value={item.name}
                                placeholder="Item"
                                onChange={(e) => {
                                  const nextKits = [...pop.toolKits];
                                  const nextItems: ToolItem[] = [...kit.items];
                                  nextItems[itemIdx] = { ...item, name: e.target.value };
                                  nextKits[kitIdx] = { ...kit, items: nextItems };
                                  updateField('toolKits', nextKits);
                                }}
                              />
                              <input
                                type="text"
                                className="pdf-inline-input pdf-qty-input"
                                value={item.qty}
                                placeholder="Qtd"
                                onChange={(e) => {
                                  const nextKits = [...pop.toolKits];
                                  const nextItems: ToolItem[] = [...kit.items];
                                  nextItems[itemIdx] = { ...item, qty: e.target.value };
                                  nextKits[kitIdx] = { ...kit, items: nextItems };
                                  updateField('toolKits', nextKits);
                                }}
                              />
                              <input
                                type="text"
                                className="pdf-inline-input"
                                value={item.usage}
                                placeholder="Aplicação"
                                onChange={(e) => {
                                  const nextKits = [...pop.toolKits];
                                  const nextItems: ToolItem[] = [...kit.items];
                                  nextItems[itemIdx] = { ...item, usage: e.target.value };
                                  nextKits[kitIdx] = { ...kit, items: nextItems };
                                  updateField('toolKits', nextKits);
                                }}
                              />
                              <button
                                type="button"
                                className="pdf-mini-icon-btn danger no-print"
                                onClick={() => {
                                  const nextKits = [...pop.toolKits];
                                  nextKits[kitIdx] = {
                                    ...kit,
                                    items: kit.items.filter((_, i) => i !== itemIdx),
                                  };
                                  updateField('toolKits', nextKits);
                                }}
                                title="Remover item"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <strong>{item.name}</strong> ({item.qty}) — {item.usage}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    {isEditing && (
                      <button
                        type="button"
                        className="pdf-add-inline-btn no-print"
                        onClick={() => {
                          const nextKits = [...pop.toolKits];
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
                        <Plus size={11} /> Adicionar item ao {kit.code}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="pdf-add-inline-btn no-print"
                  onClick={() => {
                    const nextNum = pop.toolKits.length + 1;
                    updateField('toolKits', [
                      ...pop.toolKits,
                      {
                        id: `kit-custom-${Date.now()}`,
                        code: `KIT-${String(nextNum).padStart(2, '0')}`,
                        title: 'Novo Kit de Ferramentas',
                        subtitle: 'Materiais complementares de campo',
                        items: [
                          { name: 'Ferramenta / Insumo', qty: '01 un', usage: 'Uso operacional' },
                        ],
                      },
                    ]);
                  }}
                >
                  <Plus size={11} /> Adicionar novo Kit / Maleta
                </button>
              )}
            </section>
          </div>

          <PdfPageFooter />
        </div>
      </article>

      {/* ==================== PÁGINA 2 DE 3 ==================== */}
      <article className="pdf-a4-page">
        <div className="pdf-orange-frame">
          <div className="pdf-page-body">
            <IsoHeaderTable
              pop={pop}
              page={2}
              totalPages={totalPages}
              isEditing={isEditing}
              onChangeField={updateField}
            />

            {/* 7. PASSO A PASSO DO PROCESSO */}
            <section className="pdf-text-section pdf-steps-section">
              <h3 className="pdf-section-heading">7. PASSO A PASSO DO PROCESSO</h3>

              <table className="pdf-steps-table">
                <colgroup>
                  <col style={{ width: '46px' }} />
                  <col style={{ width: '47%' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>DESCRICAO DA ATIVIDADE / INSTRUCOES CRITICAS</th>
                    <th>REGISTRO VISUAL DO PADRAO</th>
                  </tr>
                </thead>
                <tbody>
                  {firstPageSteps.map((step) => (
                    <PdfStepRow
                      key={step.itemNumber}
                      step={step}
                      popId={pop.id}
                      areaResponsible={pop.responsible}
                      isEditing={isEditing}
                      onUpdateStep={handleUpdateStep}
                    />
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <PdfPageFooter
            actionNote={pop.criticalBanner}
            isEditing={isEditing}
            onChangeActionNote={(val) =>
              updateField('criticalBanner', { ...pop.criticalBanner, description: val })
            }
          />
        </div>
      </article>

      {/* ==================== PÁGINA 3 DE 3 ==================== */}
      <article className="pdf-a4-page">
        <div className="pdf-orange-frame">
          <div className="pdf-page-body">
            <IsoHeaderTable
              pop={pop}
              page={3}
              totalPages={totalPages}
              isEditing={isEditing}
              onChangeField={updateField}
            />

            {/* Continuação da Tabela 7. PASSO A PASSO DO PROCESSO */}
            <section className="pdf-text-section pdf-steps-section">
              <table className="pdf-steps-table">
                <colgroup>
                  <col style={{ width: '46px' }} />
                  <col style={{ width: '47%' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>DESCRICAO DA ATIVIDADE / INSTRUCOES CRITICAS</th>
                    <th>REGISTRO VISUAL DO PADRAO</th>
                  </tr>
                </thead>
                <tbody>
                  {secondPageSteps.map((step) => (
                    <PdfStepRow
                      key={step.itemNumber}
                      step={step}
                      popId={pop.id}
                      areaResponsible={pop.responsible}
                      isEditing={isEditing}
                      onUpdateStep={handleUpdateStep}
                    />
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button
                  type="button"
                  className="pdf-add-inline-btn no-print"
                  onClick={() => {
                    const nextNum = pop.steps.length + 1;
                    updateField('steps', [
                      ...pop.steps,
                      {
                        itemNumber: nextNum,
                        code: `ETAPA ${String(nextNum).padStart(2, '0')}`,
                        title: 'Nova Etapa Operacional',
                        phase: 'SISTEMA FS & EXECUÇÃO',
                        durationSec: 10,
                        description: 'Descreva a atividade realizada nesta etapa.',
                        bullets: ['Instrução operacional da etapa.'],
                        criticalInstruction: 'Seguir padrão de qualidade e segurança Eletromidia.',
                        diagramType: 'fs-three-photos',
                        visualStandardCaption: 'Registro visual do padrão da etapa.',
                      },
                    ]);
                  }}
                >
                  <Plus size={11} /> Adicionar nova Etapa ao Passo a Passo
                </button>
              )}
            </section>

            {/* 9. REFERENCIA / SISTEMA */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">9. REFERENCIA / SISTEMA</h3>
              {isEditing ? (
                <input
                  type="text"
                  className="pdf-inline-input pdf-body-text"
                  value={pop.systemUrl}
                  onChange={(e) => updateField('systemUrl', e.target.value)}
                />
              ) : (
                <p className="pdf-body-text pdf-system-link">
                  <a href={pop.systemUrl} target="_blank" rel="noreferrer">
                    {pop.systemUrl}
                  </a>
                </p>
              )}
              <div className="pdf-orientation-box">
                {isEditing ? (
                  <AutoTextarea
                    value={pop.orientationNote ?? DEFAULT_ORIENTATION_NOTE}
                    onChange={(val) => updateField('orientationNote', val)}
                  />
                ) : (
                  pop.orientationNote ?? DEFAULT_ORIENTATION_NOTE
                )}
              </div>
            </section>

            {/* 8. HISTORICO DE REVISOES */}
            <section className="pdf-text-section">
              <h3 className="pdf-section-heading">8. HISTORICO DE REVISOES</h3>
              <table className="pdf-revision-table">
                <colgroup>
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>REVISAO</th>
                    <th>
                      DESCRICAO DA
                      <br />
                      ALTERACAO
                    </th>
                    <th>DATA</th>
                    <th>ELABORADO POR</th>
                    <th>APROVADO POR</th>
                  </tr>
                </thead>
                <tbody>
                  {pop.revisionHistory.map((rev, idx) => (
                    <tr key={idx}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            className="pdf-inline-input"
                            value={rev.rev}
                            onChange={(e) => {
                              const next = [...pop.revisionHistory];
                              next[idx] = { ...rev, rev: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        ) : (
                          rev.rev ? `[${rev.rev}]` : ''
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <AutoTextarea
                            value={rev.description}
                            onChange={(val) => {
                              const next = [...pop.revisionHistory];
                              next[idx] = { ...rev, description: val };
                              updateField('revisionHistory', next);
                            }}
                          />
                        ) : (
                          rev.description
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            className="pdf-inline-input"
                            value={rev.date}
                            onChange={(e) => {
                              const next = [...pop.revisionHistory];
                              next[idx] = { ...rev, date: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        ) : (
                          rev.date
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            className="pdf-inline-input"
                            value={rev.author}
                            onChange={(e) => {
                              const next = [...pop.revisionHistory];
                              next[idx] = { ...rev, author: e.target.value };
                              updateField('revisionHistory', next);
                            }}
                          />
                        ) : (
                          rev.author
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="pdf-edit-row-inline">
                            <input
                              type="text"
                              className="pdf-inline-input"
                              value={rev.approver}
                              onChange={(e) => {
                                const next = [...pop.revisionHistory];
                                next[idx] = { ...rev, approver: e.target.value };
                                updateField('revisionHistory', next);
                              }}
                            />
                            {pop.revisionHistory.length > 1 && (
                              <button
                                type="button"
                                className="pdf-mini-icon-btn danger no-print"
                                onClick={() => {
                                  const next = pop.revisionHistory.filter((_, i) => i !== idx);
                                  updateField('revisionHistory', next);
                                }}
                                title="Remover linha de revisão"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        ) : (
                          rev.approver
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button
                  type="button"
                  className="pdf-add-inline-btn no-print"
                  onClick={() =>
                    updateField('revisionHistory', [
                      ...pop.revisionHistory,
                      {
                        rev: String(pop.revisionHistory.length).padStart(2, '0'),
                        description: 'Atualização operacional do procedimento.',
                        date: new Date().toLocaleDateString('pt-BR'),
                        author: pop.author,
                        approver: pop.approver,
                      },
                    ])
                  }
                >
                  <Plus size={11} /> Adicionar linha de revisão
                </button>
              )}
            </section>
          </div>

          <PdfPageFooter />
        </div>
      </article>
    </div>
  );
};
