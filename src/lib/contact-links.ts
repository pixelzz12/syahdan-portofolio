import type { Contact, ContactKind } from "../data/portfolio";

export function contactLink(kind: ContactKind, value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const input = value.trim();
  if (kind === "email") {
    const email = input.replace(/^mailto:/i, "");
    const [local, domain] = email.split("@");
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(email) || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
    if (!domain.split(".").every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) return null;
    return `mailto:${email}`;
  }
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== (kind === "github" ? "github.com" : "instagram.com")) return null;
    const path = url.pathname.replace(/\/$/, "");
    const pattern = kind === "github" ? /^\/[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i : /^\/[a-z0-9._]{1,30}$/i;
    if (!pattern.test(path)) return null;
    return `https://${host}${path}`;
  } catch { return null; }
}

export function contactEntries(config: Record<ContactKind, string | null>, legacy: Contact[] = []) {
  return (["email", "github", "instagram"] as const).map(kind => {
    const old = legacy.find(item => item.label.toLowerCase() === kind);
    const raw = config[kind] ?? old?.url ?? null;
    return { kind, label: kind === "email" ? "Email" : kind === "github" ? "GitHub" : "Instagram", url: contactLink(kind, raw), configured: Boolean(raw?.trim()) };
  });
}
