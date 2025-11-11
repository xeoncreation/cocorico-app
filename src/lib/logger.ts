type Level = "debug" | "info" | "warn" | "error";

const levelOrder: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const envLevel = (process.env.LOG_LEVEL as Level) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function canLog(level: Level) {
  return levelOrder[level] >= levelOrder[envLevel];
}

function stamp() {
  try { return new Date().toISOString(); } catch { return ""; }
}

export const logger = {
  debug: (...args: any[]) => { if (canLog("debug")) console.debug("[DEBUG]", stamp(), ...args); },
  info:  (...args: any[]) => { if (canLog("info"))  console.info ("[INFO]",  stamp(), ...args); },
  warn:  (...args: any[]) => { if (canLog("warn"))  console.warn ("[WARN]",  stamp(), ...args); },
  error: (...args: any[]) => { if (canLog("error")) console.error("[ERROR]", stamp(), ...args); },
};
