import React from 'react';

export const EletromidiaLogo: React.FC<{ height?: number; darkText?: boolean }> = ({
  height = 28,
  darkText = false,
}) => {
  const orange = '#FF4F00';
  const textFill = darkText ? '#141619' : '#FF4F00';

  return (
    <svg
      height={height}
      viewBox="0 0 210 44"
      fill="none"
      role="img"
      aria-label="Eletromidia"
      style={{ display: 'block' }}
    >
      {/* Stylized E + 3 pillars icon matching Eletromidia mark */}
      <g fill={orange}>
        <rect x="2" y="4" width="24" height="5" />
        <rect x="2" y="13" width="24" height="5" />
        <rect x="2" y="22" width="24" height="5" />
        <rect x="2" y="4" width="5" height="36" />
        <rect x="11.5" y="22" width="5" height="18" />
        <rect x="21" y="22" width="5" height="18" />
      </g>
      <text
        x="36"
        y="30"
        fill={textFill}
        fontFamily="Archivo, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="-0.03em"
      >
        eletromidia
      </text>
    </svg>
  );
};

export const QrCodeMatrixSvg: React.FC<{ size?: number }> = ({ size = 68 }) => {
  // Deterministic crisp QR representation for https://operacoes.eletromidia.com.br/login
  const matrix = [
    '111111101011011111111',
    '100000100100101000001',
    '101110101101001011101',
    '101110100011101011101',
    '101110101010001011101',
    '100000100101101000001',
    '111111101010101111111',
    '000000000110000000000',
    '110101111001110101101',
    '011010001100101100010',
    '101101101011011011011',
    '010011010010100101100',
    '111010101101011010111',
    '000000001010110100010',
    '111111100111001010101',
    '100000101000110111010',
    '101110101101111111101',
    '101110100010100010110',
    '101110101101101110001',
    '100000100110010001110',
    '111111101011101101011',
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      fill="none"
      role="img"
      aria-label="QR Code Sistema FS Operações Eletromidia"
      style={{ display: 'block', background: '#FFFFFF', border: '1px solid #141619' }}
    >
      <rect width="23" height="23" fill="#FFFFFF" />
      {matrix.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '1' ? (
            <rect key={`${x}-${y}`} x={x + 1} y={y + 1} width="1" height="1" fill="#141619" />
          ) : null
        )
      )}
    </svg>
  );
};
