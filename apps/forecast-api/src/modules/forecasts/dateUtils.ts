export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getTomorrowDateOnly(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toDateOnly(tomorrow);
}

export function millisecondsUntilNextLocalHour(hour: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
}

