export type SparkReadyMessage = {
  type: "spark:ready";
  slug?: string;
};

export type SparkCompleteMessage = {
  type: "spark:complete";
  slug?: string;
  payload?: unknown;
};

export type SparkTelemetryMessage = {
  type: "spark:telemetry";
  event: string;
  props?: Record<string, unknown>;
};

export type SparkEngineMessage =
  | SparkReadyMessage
  | SparkCompleteMessage
  | SparkTelemetryMessage;

export function isSparkEngineMessage(value: unknown): value is SparkEngineMessage {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const type = (value as { type: unknown }).type;
  return type === "spark:ready" || type === "spark:complete" || type === "spark:telemetry";
}
