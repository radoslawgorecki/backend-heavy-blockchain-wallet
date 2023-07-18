export const calcFiatAmount = (coins: string, fiat: string, ratio?: string) => {
  if (!ratio) return;
  const result = +coins * parseFloat(ratio);
  return `${result.toFixed(4)} ${fiat}`;
};
