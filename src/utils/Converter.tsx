export function hexToRGB(hex: string) {
  const aRgbHex: string[] = hex.replace('#', '').match(/.{1,2}/g) || [];

  const aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16),
  ];

  return aRgb;
}
