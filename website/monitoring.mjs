import { preference, setPreference } from "./preferences.mjs";
const names = new Set([
  "journey.started",
  "journey.stop",
  "cottage.opened",
  "enquiry.prepared",
  "admin.saved",
  "admin.published",
  "admin.access-changed",
]);
export function track(name, attributes = {}) {
  if (!names.has(name) || preference("aroha-monitoring") !== "allowed") return;
  const safe = {
    schemaVersion: 1,
    "event.authority": "client-observed",
    "event.provider": "aroha.website",
    ...Object.fromEntries(
      Object.entries(attributes).filter(
        ([k, v]) =>
          ["section", "outcome"].includes(k) &&
          typeof v === "string" &&
          v.length < 50,
      ),
    ),
  };
  try {
    window.dynatrace?.sendBizEvent?.(name, safe);
  } catch {
    /* Monitoring must never interrupt the guest. */
  }
}
export async function initializeMonitoring() {
  if (preference("aroha-monitoring") !== "allowed") return;
  try {
    const config = await fetch("/runtime-config.json").then((r) => r.json());
    if (!config.rumScriptUrl) return;
    const url = new URL(config.rumScriptUrl);
    if (
      url.protocol !== "https:" ||
      !["js-cdn.dynatrace.com"].includes(url.hostname)
    )
      return;
    const script = document.createElement("script");
    script.src = url.href;
    script.crossOrigin = "anonymous";
    document.head.append(script);
  } catch {
    /* Optional monitoring is independently configured. */
  }
}
export function reportError(code) {
  try {
    window.dtrum?.reportCustomError?.(code, "Aroha website operation failed");
  } catch {}
}
