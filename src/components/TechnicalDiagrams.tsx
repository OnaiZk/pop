import React from 'react';

interface DiagramProps {
  type: 'kit-route' | 'sidewalk-cones' | 'fs-three-photos' | 'post-paint-isolation';
  popId?: string;
  compact?: boolean;
  dark?: boolean;
}

export const TechnicalDiagram: React.FC<DiagramProps> = ({
  type,
  popId = 'preventiva-totens',
  dark = false,
}) => {
  const bg = dark ? '#16191E' : '#FBF9F5';
  const gridStroke = dark ? '#262B33' : '#E5E0D5';
  const ink = dark ? '#F3F1EC' : '#141619';
  const muted = dark ? '#9BA3B0' : '#5A606A';
  const orange = '#FF4F00';
  const amber = '#D97706';
  const green = '#15803D';

  const isFundacao = popId === 'fundacao-totem-abrigo';
  const isLavagem = popId === 'lavagem-abrigo-totem';

  if (type === 'kit-route') {
    if (isFundacao) {
      const fundacaoKits = [
        {
          x: 14,
          w: 184,
          code: 'KIT-01',
          title: 'CORTE, CAVA & INFRA',
          count: '07 ITENS',
          line1: 'Serra Mármore · Martelete',
          line2: 'Gerador · Enxada/Pá · Nível',
          line3: 'Saco de Ráfia · Tela Tapume',
        },
        {
          x: 206,
          w: 184,
          code: 'KIT-02',
          title: 'CONCRETAGEM & BASE',
          count: '06 ITENS',
          line1: 'Cimento · Areia e Brita',
          line2: 'Água · Masseira (Bater massa)',
          line3: 'Piso Podotátil · Vassoura',
        },
      ];

      return (
        <svg
          viewBox="0 0 520 230"
          className="tech-plate-svg"
          role="img"
          aria-label="Diagrama técnico de conferência de kits de fundação civil, gerador, martelete, masseira e rota no Sistema FS"
        >
          <defs>
            <pattern id="grid-kit-fund" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="520" height="230" fill={bg} />
          <rect width="520" height="230" fill="url(#grid-kit-fund)" />

          {/* Header Strip */}
          <rect x="12" y="12" width="496" height="26" fill={dark ? '#1F242C' : '#EDE9DF'} stroke={gridStroke} />
          <text x="22" y="29" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
            PLACA TÉCNICA 01 // PRÉ-SAÍDA: 2 KITS DE FUNDAÇÃO CIVIL + ROTA FS
          </text>
          <text x="498" y="29" textAnchor="end" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="10">
            POP-OPE-003
          </text>

          {/* 2 Civil Kits Modules */}
          {fundacaoKits.map((kit) => (
            <g key={kit.code} transform={`translate(${kit.x}, 50)`}>
              <rect width={kit.w} height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
              <rect width={kit.w} height="22" fill={orange} />
              <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
                {kit.code}
              </text>
              <text x={kit.w - 8} y="15" textAnchor="end" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9">
                {kit.count}
              </text>
              <text x="10" y="42" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="14.5" fontWeight="700">
                {kit.title}
              </text>
              <line x1="10" y1="49" x2={kit.w - 10} y2="49" stroke={gridStroke} />
              <text x="10" y="64" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line1}
              </text>
              <text x="10" y="77" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line2}
              </text>
              <text x="10" y="90" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line3}
              </text>
              <rect x="10" y="98" width={kit.w - 20} height="17" fill={dark ? '#14261C' : '#ECFDF3'} stroke={green} strokeWidth="1" />
              <text x={kit.w / 2} y="110" textAnchor="middle" fill={green} fontFamily="JetBrains Mono, monospace" fontSize="8.8" fontWeight="700">
                [OK] CONFERIDO NA BASE
              </text>
            </g>
          ))}

          {/* Route Validation Module */}
          <g transform="translate(398, 50)">
            <rect width="108" height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
            <rect width="108" height="22" fill={ink} />
            <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
              ROTA FS
            </text>
            <circle cx="28" cy="56" r="5" fill={orange} />
            <circle cx="80" cy="84" r="5" fill={green} />
            <path d="M 28 56 C 52 56, 52 84, 80 84" fill="none" stroke={orange} strokeWidth="2" strokeDasharray="3 2" />
            <text x="10" y="40" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="8.8" fontWeight="700">
              BASE -&gt; OBRA
            </text>
            <text x="10" y="106" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="8.2">
              6 EPIs CAs OK
            </text>
          </g>

          {/* Bottom Spec Strip */}
          <rect x="14" y="184" width="492" height="32" fill={dark ? '#1B1F26' : '#F3EFE6'} stroke={gridStroke} />
          <text x="22" y="204" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
            REGRA CRÍTICA: Testar Gerador e Martelete + conferir Masseira, Insumos e Ordem no Sistema FS.
          </text>
        </svg>
      );
    }

    if (isLavagem) {
      const lavagemKits = [
        {
          x: 14,
          w: 184,
          code: 'KIT-01',
          title: 'LAVAGEM & HIDROJATO',
          count: '05 ITENS',
          line1: 'Reservatório de Água Limpa',
          line2: 'Detergente Neutro · Esfregão',
          line3: 'Rodo Borracha · Vassoura',
        },
        {
          x: 206,
          w: 184,
          code: 'KIT-02',
          title: 'REMOÇÃO DE PICHAÇÃO',
          count: '03 ITENS',
          line1: 'Removedor Homologado SST',
          line2: 'Espátula Plástica Não-Abrasiva',
          line3: 'Saco de Ráfia · Microfibra',
        },
      ];

      return (
        <svg
          viewBox="0 0 520 230"
          className="tech-plate-svg"
          role="img"
          aria-label="Diagrama técnico de conferência de kits de lavagem e rota no Sistema FS"
        >
          <defs>
            <pattern id="grid-kit-lav" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="520" height="230" fill={bg} />
          <rect width="520" height="230" fill="url(#grid-kit-lav)" />

          <rect x="12" y="12" width="496" height="26" fill={dark ? '#1F242C' : '#EDE9DF'} stroke={gridStroke} />
          <text x="22" y="29" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
            PLACA TÉCNICA 01 // PRÉ-SAÍDA: KITS DE HIGIENIZAÇÃO + ROTA FS
          </text>
          <text x="498" y="29" textAnchor="end" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="10">
            POP-OPE-002
          </text>

          {lavagemKits.map((kit) => (
            <g key={kit.code} transform={`translate(${kit.x}, 50)`}>
              <rect width={kit.w} height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
              <rect width={kit.w} height="22" fill={orange} />
              <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
                {kit.code}
              </text>
              <text x={kit.w - 8} y="15" textAnchor="end" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9">
                {kit.count}
              </text>
              <text x="10" y="42" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="14.5" fontWeight="700">
                {kit.title}
              </text>
              <line x1="10" y1="49" x2={kit.w - 10} y2="49" stroke={gridStroke} />
              <text x="10" y="64" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line1}
              </text>
              <text x="10" y="77" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line2}
              </text>
              <text x="10" y="90" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
                {kit.line3}
              </text>
              <rect x="10" y="98" width={kit.w - 20} height="17" fill={dark ? '#14261C' : '#ECFDF3'} stroke={green} strokeWidth="1" />
              <text x={kit.w / 2} y="110" textAnchor="middle" fill={green} fontFamily="JetBrains Mono, monospace" fontSize="8.8" fontWeight="700">
                [OK] CONFERIDO
              </text>
            </g>
          ))}

          <g transform="translate(398, 50)">
            <rect width="108" height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
            <rect width="108" height="22" fill={ink} />
            <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
              ROTA FS
            </text>
            <circle cx="28" cy="56" r="5" fill={orange} />
            <circle cx="80" cy="84" r="5" fill={green} />
            <path d="M 28 56 C 52 56, 52 84, 80 84" fill="none" stroke={orange} strokeWidth="2" strokeDasharray="3 2" />
            <text x="10" y="40" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="8.5" fontWeight="700">
              BASE -&gt; ABRIGO
            </text>
            <text x="10" y="106" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="8.2">
              6 EPIs CAs OK
            </text>
          </g>

          <rect x="14" y="184" width="492" height="32" fill={dark ? '#1B1F26' : '#F3EFE6'} stroke={gridStroke} />
          <text x="22" y="204" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
            REGRA CRÍTICA: Conferir reservatório de água, químicos homologados SST e rota no Sistema FS.
          </text>
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 520 230"
        className="tech-plate-svg"
        role="img"
        aria-label="Diagrama técnico de conferência de kits e rota no Sistema FS"
      >
        <defs>
          <pattern id="grid-kit" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="520" height="230" fill={bg} />
        <rect width="520" height="230" fill="url(#grid-kit)" />

        {/* Header Strip */}
        <rect x="12" y="12" width="496" height="26" fill={dark ? '#1F242C' : '#EDE9DF'} stroke={gridStroke} />
        <text x="22" y="29" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
          PLACA TÉCNICA 01 // PRÉ-SAÍDA: 3 KITS SEPARADOS + ROTA FS
        </text>
        <text x="498" y="29" textAnchor="end" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="10">
          ESC 1:25
        </text>

        {/* 3 Kits Modules */}
        {[
          { x: 14, code: 'KIT-01', title: 'CIVIL & BASE', count: '11 ITENS', detail: 'Areia, Brita, Cimento, Podotátil' },
          { x: 142, code: 'KIT-02', title: 'PINTURA', count: '04 ITENS', detail: 'Lixadeira, Rolo, Pincel, Tinta' },
          { x: 270, code: 'KIT-03', title: 'LIMPEZA & SELOS', count: '04 ITENS', detail: 'Vassoura, Esfregão, Adesivos' },
        ].map((kit) => (
          <g key={kit.code} transform={`translate(${kit.x}, 50)`}>
            <rect width="118" height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
            <rect width="118" height="22" fill={orange} />
            <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
              {kit.code}
            </text>
            <text x="110" y="15" textAnchor="end" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9">
              {kit.count}
            </text>
            <text x="10" y="44" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="15" fontWeight="700">
              {kit.title}
            </text>
            <line x1="10" y1="52" x2="108" y2="52" stroke={gridStroke} />
            <text x="10" y="70" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.5">
              {kit.detail.split(', ').slice(0, 2).join(' · ')}
            </text>
            <text x="10" y="84" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.5">
              {kit.detail.split(', ').slice(2).join(' · ')}
            </text>
            <rect x="10" y="96" width="98" height="18" fill={dark ? '#14261C' : '#ECFDF3'} stroke={green} strokeWidth="1" />
            <text x="59" y="108" textAnchor="middle" fill={green} fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
              [OK] CONFERIDO
            </text>
          </g>
        ))}

        {/* Route Validation Module */}
        <g transform="translate(398, 50)">
          <rect width="108" height="122" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
          <rect width="108" height="22" fill={ink} />
          <text x="8" y="15" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
            ROTA FS
          </text>
          <circle cx="32" cy="54" r="5" fill={orange} />
          <circle cx="78" cy="84" r="5" fill={green} />
          <path d="M 32 54 C 55 54, 52 84, 78 84" fill="none" stroke={orange} strokeWidth="2" strokeDasharray="3 2" />
          <text x="12" y="40" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
            BASE -&gt; TOTEM
          </text>
          <text x="12" y="108" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="8.5">
            12 EPIs CAs OK
          </text>
        </g>

        {/* Bottom Spec Strip */}
        <rect x="14" y="184" width="492" height="32" fill={dark ? '#1B1F26' : '#F3EFE6'} stroke={gridStroke} />
        <text x="24" y="204" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
          REGRA CRÍTICA: Validar 12 EPIs (CA 50290, CA 29637, CA 39158...) + ordem de serviço no Sistema FS.
        </text>
      </svg>
    );
  }

  if (type === 'sidewalk-cones') {
    const sidewalkBannerText = isFundacao
      ? 'CALÇADA LIVRE >>> ORIENTAR PEDESTRES E MONTAR TELA TAPUME NA CAVA >>>'
      : isLavagem
      ? 'CALÇADA LIVRE >>> ORIENTAR PASSAGEIROS + PLACA DE PISO MOLHADO >>>'
      : 'CALÇADA LIVRE >>> PASSAGEIRO AVISA PEDESTRES SOBRE A MANUTENÇÃO >>>';

    const sidewalkTargetText = isFundacao
      ? 'CAVA / FUNDAÇÃO'
      : isLavagem
      ? 'ABRIGO / TOTEM'
      : 'TOTEM';

    const carTargetLine2 = isFundacao
      ? 'FRENTE DA OBRA'
      : isLavagem
      ? 'FRENTE DO ABRIGO'
      : 'FRENTE DO TOTEM';

    return (
      <svg
        viewBox="0 0 520 230"
        className="tech-plate-svg"
        role="img"
        aria-label="Planta baixa mostrando a calçada e o perímetro de cones ao redor do carro parado na frente do local"
      >
        <defs>
          <pattern id="grid-cones" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
          </pattern>
          <pattern id="zebra-hazard" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <rect width="6" height="12" fill={orange} fillOpacity="0.2" />
          </pattern>
        </defs>
        <rect width="520" height="230" fill={bg} />
        <rect width="520" height="230" fill="url(#grid-cones)" />

        {/* TOP: Sidewalk (Calçada) with Pedestrian Path & Target */}
        <rect
          x="14"
          y="12"
          width="492"
          height="84"
          fill={dark ? '#1F242D' : '#F1EFEA'}
          stroke={ink}
          strokeWidth="1.2"
        />

        {/* Pedestrian Corridor inside Sidewalk */}
        <rect
          x="22"
          y="18"
          width="476"
          height="26"
          fill={dark ? '#16241B' : '#ECFDF3'}
          stroke={green}
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="260"
          y="35"
          textAnchor="middle"
          fill={green}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.2"
          fontWeight="700"
        >
          {sidewalkBannerText}
        </text>

        {/* Target on the Sidewalk */}
        <rect
          x="198"
          y="50"
          width="124"
          height="36"
          rx="3"
          fill={isFundacao ? (dark ? '#2B1B12' : '#FFF4ED') : ink}
          stroke={isFundacao ? orange : '#FFFFFF'}
          strokeWidth="1.8"
          strokeDasharray={isFundacao ? '5 2' : undefined}
        />
        <text
          x="260"
          y="72"
          textAnchor="middle"
          fill={isFundacao ? orange : '#FFFFFF'}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          fontWeight="700"
        >
          {sidewalkTargetText}
        </text>
        <text
          x="98"
          y="72"
          textAnchor="middle"
          fill={muted}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          fontWeight="700"
        >
          CALÇADA / PASSEIO
        </text>
        {isFundacao && (
          <text
            x="418"
            y="72"
            textAnchor="middle"
            fill={orange}
            fontFamily="JetBrains Mono, monospace"
            fontSize="8.5"
            fontWeight="700"
          >
            TELA TAPUME + RÁFIA
          </text>
        )}

        {/* Curb / Meio-Fio */}
        <line x1="14" y1="98" x2="506" y2="98" stroke={ink} strokeWidth="3.5" />

        {/* BOTTOM: Street (Via Pública) with Car parked in front + Cones Perimeter AROUND THE CAR */}
        <rect x="14" y="100" width="492" height="118" fill={dark ? '#111317' : '#DCD9D0'} />
        <text
          x="26"
          y="122"
          fill={muted}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          fontWeight="700"
        >
          VIA PÚBLICA / MEIO-FIO
        </text>

        {/* Cones Safety Perimeter AROUND THE PARKED CAR */}
        <rect
          x="136"
          y="108"
          width="248"
          height="98"
          rx="4"
          fill="url(#zebra-hazard)"
          stroke={orange}
          strokeWidth="2.2"
          strokeDasharray="6 3"
        />

        {/* Eletromidia Service Car parked inside the Cone Perimeter */}
        <rect
          x="166"
          y="126"
          width="188"
          height="46"
          rx="6"
          fill={dark ? '#262C36' : '#FFFFFF'}
          stroke={ink}
          strokeWidth="1.6"
        />
        {/* Orange Front Cab */}
        <rect x="166" y="126" width="48" height="46" rx="5" fill={orange} />
        <text
          x="190"
          y="153"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fontWeight="700"
        >
          FROTA
        </text>
        {/* Vehicle Body Label */}
        <text
          x="284"
          y="147"
          textAnchor="middle"
          fill={ink}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          fontWeight="700"
        >
          CARRO PARADO NA
        </text>
        <text
          x="284"
          y="160"
          textAnchor="middle"
          fill={ink}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          fontWeight="700"
        >
          {carTargetLine2}
        </text>

        {/* Perimeter Caption inside/below Car */}
        <rect
          x="148"
          y="180"
          width="224"
          height="18"
          rx="3"
          fill={dark ? '#181C22' : '#FFF4ED'}
          stroke={orange}
          strokeWidth="1"
        />
        <text
          x="260"
          y="192"
          textAnchor="middle"
          fill={orange}
          fontFamily="JetBrains Mono, monospace"
          fontSize="8.8"
          fontWeight="700"
        >
          PERÍMETRO DE CONES AO REDOR DO CARRO
        </text>

        {/* 6 Safety Cones Positioned Around the Car */}
        {[
          [136, 112],
          [260, 108],
          [384, 112],
          [136, 202],
          [260, 206],
          [384, 202],
        ].map(([cx, cy], idx) => (
          <g key={idx} transform={`translate(${cx}, ${cy})`}>
            <polygon points="0,-9 9,8 -9,8" fill={orange} stroke="#FFFFFF" strokeWidth="1.2" />
            <circle cx="0" cy="2" r="2.3" fill="#FFFFFF" />
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'fs-three-photos') {
    const targetTitle = isFundacao
      ? 'LOCAL DA CAVA / FUNDAÇÃO'
      : isLavagem
      ? 'ABRIGO / TOTEM'
      : 'EQUIPAMENTO (TOTEM)';

    const headerTitle = isFundacao
      ? 'PLACA TÉCNICA 03 // 3 FOTOS INICIAIS FS + CORTE (SERRA) & ABERTURA (MARTELETE)'
      : 'PLACA TÉCNICA 03 // SISTEMA FS: 3 FOTOS PADRÕES (ANTES E DEPOIS) — SEM LOGO';

    const centralNote = isFundacao
      ? 'Frente cava + gabarito'
      : 'Frontal + podotátil';

    return (
      <svg
        viewBox="0 0 520 230"
        className="tech-plate-svg"
        role="img"
        aria-label="Geometria das 3 fotos padrões no Sistema FS: Esquerda, Central e Direita"
      >
        <defs>
          <pattern id="grid-photos" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
          </pattern>
          <marker id="arrow-orange" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill={orange} />
          </marker>
        </defs>
        <rect width="520" height="230" fill={bg} />
        <rect width="520" height="230" fill="url(#grid-photos)" />

        {/* Header */}
        <rect x="12" y="12" width="496" height="26" fill={dark ? '#1F242C' : '#EDE9DF'} stroke={gridStroke} />
        <text x="20" y="29" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="9.3" fontWeight="700">
          {headerTitle}
        </text>

        {/* Target Top-Down */}
        <rect x="180" y="50" width="160" height="36" fill={ink} stroke={orange} strokeWidth="2" />
        <text x="260" y="73" textAnchor="middle" fill="#FFFFFF" fontFamily="Barlow Condensed, sans-serif" fontSize="14.5" fontWeight="700">
          {targetTitle}
        </text>

        {isFundacao && (
          <g>
            <rect x="16" y="52" width="148" height="32" fill={dark ? '#1D2229' : '#FFF4ED'} stroke={orange} strokeWidth="1" />
            <text x="90" y="65" textAnchor="middle" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="8.2" fontWeight="700">
              GERADOR + SERRA MÁRMORE
            </text>
            <text x="90" y="77" textAnchor="middle" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="8">
              MARTELETE: ABRIR INFRA
            </text>

            <rect x="356" y="52" width="148" height="32" fill={dark ? '#1D2229' : '#FFF4ED'} stroke={orange} strokeWidth="1" />
            <text x="430" y="65" textAnchor="middle" fill={orange} fontFamily="JetBrains Mono, monospace" fontSize="8.2" fontWeight="700">
              ENXADA / PÁ + NÍVEL
            </text>
            <text x="430" y="77" textAnchor="middle" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="8">
              TERRA -&gt; SACO DE RÁFIA
            </text>
          </g>
        )}

        {/* Camera Sightlines */}
        <line x1="96" y1="162" x2="215" y2="92" stroke={orange} strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#arrow-orange)" />
        <line x1="260" y1="168" x2="260" y2="94" stroke={orange} strokeWidth="2.2" markerEnd="url(#arrow-orange)" />
        <line x1="424" y1="162" x2="305" y2="92" stroke={orange} strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#arrow-orange)" />

        {/* 3 Camera Stations */}
        {[
          { x: 32, num: 'FOTO 03', label: 'ESQUERDA (45°)', note: 'Ângulo lateral esq.' },
          { x: 196, num: 'FOTO 01', label: 'CENTRAL (0°)', note: centralNote },
          { x: 360, num: 'FOTO 02', label: 'DIREITA (45°)', note: 'Ângulo lateral dir.' },
        ].map((cam) => (
          <g key={cam.num} transform={`translate(${cam.x}, 158)`}>
            <rect width="128" height="56" fill={dark ? '#1E232B' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
            <rect width="48" height="18" fill={orange} />
            <text x="24" y="13" textAnchor="middle" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fontWeight="700">
              {cam.num}
            </text>
            <text x="120" y="13" textAnchor="end" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="8.5">
              SEM LOGO
            </text>
            <text x="10" y="34" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="14" fontWeight="700">
              {cam.label}
            </text>
            <text x="10" y="48" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.5">
              {cam.note}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // Step 4 Diagram: post-paint-isolation (adapted per POP!)
  if (isFundacao) {
    return (
      <svg
        viewBox="0 0 520 230"
        className="tech-plate-svg"
        role="img"
        aria-label="Diagrama de fechamento da fundação com concretagem na masseira, piso podotátil, 3 fotos finais no FS e isolamento de cura do concreto"
      >
        <defs>
          <pattern id="grid-fund-end" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
          </pattern>
          <pattern id="hatch-amber-fund" width="14" height="14" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <rect width="7" height="14" fill={amber} fillOpacity="0.28" />
          </pattern>
        </defs>
        <rect width="520" height="230" fill={bg} />
        <rect width="520" height="230" fill="url(#grid-fund-end)" />

        {/* Left Column: Concrete + Podotátil + 3 Final Photos FS */}
        <g transform="translate(14, 14)">
          <rect width="234" height="202" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
          <rect width="234" height="26" fill={ink} />
          <text x="10" y="17" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.2" fontWeight="700">
            01 // CONCRETAGEM &amp; SISTEMA FS
          </text>
          <text x="12" y="48" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="15.5" fontWeight="700">
            MASSEIRA, PODOTÁTIL + 3 FOTOS FINAIS
          </text>
          {[
            '1. Massa batida na Masseira + Cava',
            '2. Nível validado + Piso Podotátil',
            '3. 3 Fotos Finais (Central/Dir/Esq)',
            '4. Calçada varrida + Ráfia recolhida',
          ].map((item, i) => (
            <g key={item} transform={`translate(12, ${60 + i * 28})`}>
              <rect width="210" height="22" fill={dark ? '#14261C' : '#F0FDF4'} stroke={green} strokeWidth="0.9" />
              <text x="8" y="15" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="600">
                [OK] {item}
              </text>
            </g>
          ))}
          <text x="12" y="190" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="9">
            STATUS: FUNDAÇÃO ENTREGUE NO FS
          </text>
        </g>

        {/* Right Column: Mandatory Concrete Curing Isolation (Tela Tapume + Cones) */}
        <g transform="translate(260, 14)">
          <rect width="246" height="202" fill="url(#hatch-amber-fund)" stroke={amber} strokeWidth="2" />
          <rect x="8" y="8" width="230" height="186" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
          <rect x="8" y="8" width="230" height="26" fill={orange} />
          <text x="16" y="25" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.2" fontWeight="700">
            02 // ISOLAMENTO DE CURA DA BASE
          </text>

          {/* Concreted Foundation Block + Anchor Bolts + Orange Tapume Mesh */}
          <rect x="58" y="96" width="130" height="44" fill={dark ? '#2B313B' : '#D6D3CD'} stroke={ink} strokeWidth="1.5" />
          <text x="123" y="122" textAnchor="middle" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="8.8" fontWeight="700">
            BASE CONCRETADA
          </text>
          {/* Anchor bolts / Gabarito */}
          <circle cx="84" cy="105" r="3" fill={orange} />
          <circle cx="162" cy="105" r="3" fill={orange} />

          {/* Warning Plaque above base */}
          <rect x="76" y="48" width="94" height="36" fill="#FACC15" stroke={ink} strokeWidth="1.5" />
          <text x="123" y="63" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="11" fontWeight="700">
            ATENÇÃO: OBRA CIVIL
          </text>
          <text x="123" y="77" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="11" fontWeight="700">
            CONCRETO EM CURA
          </text>

          {/* Cones + Tela Tapume Laranja around Base */}
          <polygon points="36,140 46,114 56,140" fill={orange} />
          <polygon points="190,140 200,114 210,140" fill={orange} />
          <line x1="46" y1="122" x2="200" y2="122" stroke={orange} strokeWidth="3" strokeDasharray="6 3" />

          <text x="123" y="160" textAnchor="middle" fill={orange} fontFamily="Barlow Condensed, sans-serif" fontSize="14.5" fontWeight="700">
            ISOLAR COM TELA TAPUME + CONES
          </text>
          <text x="123" y="177" textAnchor="middle" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.2">
            Manter cercado até a secagem e cura da fundação
          </text>
        </g>
      </svg>
    );
  }

  if (isLavagem) {
    return (
      <svg
        viewBox="0 0 520 230"
        className="tech-plate-svg"
        role="img"
        aria-label="Diagrama de fechamento de lavagem com secagem do piso e 3 fotos finais no Sistema FS"
      >
        <defs>
          <pattern id="grid-lav-end" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
          </pattern>
          <pattern id="hatch-amber-lav" width="14" height="14" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <rect width="7" height="14" fill={amber} fillOpacity="0.28" />
          </pattern>
        </defs>
        <rect width="520" height="230" fill={bg} />
        <rect width="520" height="230" fill="url(#grid-lav-end)" />

        <g transform="translate(14, 14)">
          <rect width="234" height="202" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
          <rect width="234" height="26" fill={ink} />
          <text x="10" y="17" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
            01 // FECHAMENTO NO SISTEMA FS
          </text>
          <text x="12" y="48" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="16" fontWeight="700">
            3 FOTOS FINAIS + HIGIENIZAÇÃO
          </text>
          {[
            '1. Foto Final CENTRAL (0°)',
            '2. Foto Final DIREITA (45°)',
            '3. Foto Final ESQUERDA (45°)',
            '4. Vidros, Banco e Piso Secos',
          ].map((item, i) => (
            <g key={item} transform={`translate(12, ${62 + i * 28})`}>
              <rect width="210" height="22" fill={dark ? '#14261C' : '#F0FDF4'} stroke={green} strokeWidth="0.9" />
              <text x="10" y="15" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600">
                [OK] {item}
              </text>
            </g>
          ))}
          <text x="12" y="190" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="9">
            STATUS: CHECKLIST FINALIZADO
          </text>
        </g>

        <g transform="translate(260, 14)">
          <rect width="246" height="202" fill="url(#hatch-amber-lav)" stroke={amber} strokeWidth="2" />
          <rect x="8" y="8" width="230" height="186" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
          <rect x="8" y="8" width="230" height="26" fill={orange} />
          <text x="18" y="25" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
            02 // SEGURANÇA DE PISO MOLHADO
          </text>

          <rect x="78" y="54" width="90" height="44" fill="#FACC15" stroke={ink} strokeWidth="1.5" />
          <text x="123" y="73" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="12" fontWeight="700">
            ATENÇÃO
          </text>
          <text x="123" y="89" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="12" fontWeight="700">
            PISO MOLHADO
          </text>

          <polygon points="56,140 66,118 76,140" fill={orange} />
          <polygon points="170,140 180,118 190,140" fill={orange} />
          <line x1="66" y1="126" x2="180" y2="126" stroke={orange} strokeWidth="3" strokeDasharray="6 4" />

          <text x="123" y="160" textAnchor="middle" fill={orange} fontFamily="Barlow Condensed, sans-serif" fontSize="15" fontWeight="700">
            ESaguar PISO + SECAR ASSENTOS
          </text>
          <text x="123" y="177" textAnchor="middle" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.5">
            Recolher placa somente após secagem completa
          </text>
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 520 230"
      className="tech-plate-svg"
      role="img"
      aria-label="Diagrama de fechamento com 3 fotos finais e isolamento obrigatório de Tinta Fresca"
    >
      <defs>
        <pattern id="grid-paint" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridStroke} strokeWidth="0.75" />
        </pattern>
        <pattern id="hatch-amber" width="14" height="14" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="7" height="14" fill={amber} fillOpacity="0.28" />
        </pattern>
      </defs>
      <rect width="520" height="230" fill={bg} />
      <rect width="520" height="230" fill="url(#grid-paint)" />

      {/* Left Column: Final Checklist & 3 Photos */}
      <g transform="translate(14, 14)">
        <rect width="234" height="202" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
        <rect width="234" height="26" fill={ink} />
        <text x="10" y="17" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
          01 // FECHAMENTO NO SISTEMA FS
        </text>
        <text x="12" y="48" fill={ink} fontFamily="Barlow Condensed, sans-serif" fontSize="16" fontWeight="700">
          3 FOTOS FINAIS + STATUS AVARIAS
        </text>
        {['1. Foto Final CENTRAL (0°)', '2. Foto Final DIREITA (45°)', '3. Foto Final ESQUERDA (45°)', '4. Fotos Avarias (Resolvido / Não)'].map(
          (item, i) => (
            <g key={item} transform={`translate(12, ${62 + i * 28})`}>
              <rect width="210" height="22" fill={dark ? '#14261C' : '#F0FDF4'} stroke={green} strokeWidth="0.9" />
              <text x="10" y="15" fill={ink} fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600">
                [OK] {item}
              </text>
            </g>
          )
        )}
        <text x="12" y="190" fill={muted} fontFamily="JetBrains Mono, monospace" fontSize="9">
          STATUS: CHECKLIST FINALIZADO
        </text>
      </g>

      {/* Right Column: Mandatory TINTA FRESCA Isolation */}
      <g transform="translate(260, 14)">
        <rect width="246" height="202" fill="url(#hatch-amber)" stroke={amber} strokeWidth="2" />
        <rect x="8" y="8" width="230" height="186" fill={dark ? '#1D2229' : '#FFFFFF'} stroke={ink} strokeWidth="1.2" />
        <rect x="8" y="8" width="230" height="26" fill={orange} />
        <text x="18" y="25" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700">
          02 // CONDICIONAL DE PINTURA
        </text>

        {/* Totem elevation with TINTA FRESCA sign */}
        <rect x="88" y="46" width="70" height="94" fill={ink} />
        <rect x="96" y="68" width="54" height="32" fill="#FACC15" stroke={ink} strokeWidth="1.5" />
        <text x="123" y="82" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="11" fontWeight="700">
          ATENÇÃO
        </text>
        <text x="123" y="94" textAnchor="middle" fill="#111315" fontFamily="Barlow Condensed, sans-serif" fontSize="11" fontWeight="700">
          TINTA FRESCA
        </text>

        {/* Cones + Tape around Totem */}
        <polygon points="56,140 66,118 76,140" fill={orange} />
        <polygon points="170,140 180,118 190,140" fill={orange} />
        <line x1="66" y1="126" x2="180" y2="126" stroke={orange} strokeWidth="3" strokeDasharray="6 4" />

        <text x="123" y="160" textAnchor="middle" fill={orange} fontFamily="Barlow Condensed, sans-serif" fontSize="15" fontWeight="700">
          ISOLAR EQUIPAMENTO + COLAR AVISO
        </text>
        <text x="123" y="177" textAnchor="middle" fill={muted} fontFamily="Archivo, sans-serif" fontSize="9.5">
          Obrigatório sempre que houver pintura
        </text>
      </g>
    </svg>
  );
};
