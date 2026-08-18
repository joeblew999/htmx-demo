const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Single pass so `&` is escaped before the entities we introduce.
 * Escaping sequentially would double-encode.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);
}

/**
 * Fills `%name%` placeholders in a raw template. Every value is escaped —
 * these templates are plain strings, so nothing else stops markup injection.
 */
export function render(
  template: string,
  values: Record<string, string>,
): string {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.replaceAll(`%${key}%`, escapeHtml(value));
  }
  return out;
}
