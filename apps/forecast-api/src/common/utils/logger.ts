type LogMetadata = Record<string, unknown>;

function write(level: "info" | "error", correlationId: string, message: string, metadata?: LogMetadata): void {
  const payload = {
    level,
    correlationId,
    message,
    metadata: normalizeMetadata(metadata),
    timestamp: new Date().toISOString(),
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
}

function normalizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (value instanceof Error) {
        return [
          key,
          {
            name: value.name,
            message: value.message,
            stack: value.stack,
          },
        ];
      }

      return [key, value];
    })
  );
}

export const logger = {
  info: (correlationId: string, message: string, metadata?: LogMetadata) => write("info", correlationId, message, metadata),
  error: (correlationId: string, message: string, metadata?: LogMetadata) => write("error", correlationId, message, metadata),
};
