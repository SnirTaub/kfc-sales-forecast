export function parseCorsOrigins(rawValue: string): string[] {
  const trimmed = rawValue.trim();

  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [trimmed];
  }

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

