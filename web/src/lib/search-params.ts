export function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Same-origin path only. Rejects protocol-relative URLs like //evil.com. */
export function safeReturnPath(value: string | string[] | undefined): string {
  const raw = firstParam(value).trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("://")) {
    return "/";
  }
  return raw;
}
