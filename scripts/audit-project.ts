import fs from "fs";
import path from "path";

const blocks = [
  { id: "01_setup", path: "src/app" },
  { id: "02_supabase", path: "src/lib/supabase-client.ts" },
  { id: "03_chat", path: "src/app/api/chat" },
  { id: "04_auth", path: "src/app/auth" },
  { id: "05_ui", path: "src/components" },
  { id: "37_admin", path: "src/app/admin" },
  { id: "38_profile", path: "src/app/u" },
  { id: "51_invites", path: "supabase/migrations/20251104_beta_invites.sql" },
  { id: "52_subscriptions", path: "src/app/api/stripe" },
  { id: "53_gamification", path: "supabase/migrations/20251104_gamification.sql" },
  { id: "54_community", path: "supabase/migrations/20251105_community_social.sql" },
];

console.log("🔍 Verificando módulos Cocorico...\n");

blocks.forEach((b) => {
  const fullPath = path.join(process.cwd(), b.path);
  const exists = fs.existsSync(fullPath);
  const status = exists ? "✅ OK" : "❌ Falta";
  console.log(`📦 ${b.id.padEnd(20)} → ${status} (${b.path})`);
});

console.log("\n✅ Auditoría completada.");
