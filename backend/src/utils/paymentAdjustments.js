export const distributeCents = (totalCents, targetCount) => {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new RangeError("El importe a distribuir debe expresarse en centavos positivos");
  }
  if (!Number.isInteger(targetCount) || targetCount < 1) {
    throw new RangeError("La distribucion requiere al menos una cuota");
  }

  const regularCents = Math.floor(totalCents / targetCount);
  let remainingCents = totalCents;

  return Array.from({ length: targetCount }, (_, index) => {
    const amountCents = index === targetCount - 1 ? remainingCents : regularCents;
    remainingCents -= amountCents;
    return amountCents;
  });
};
