export function resolveProtocolDayNumber(startDateIso: string, today: Date): number {
  const start = new Date(startDateIso);
  const ms = today.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(days, 1);
}
