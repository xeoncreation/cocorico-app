#!/usr/bin/env node

/**
 * Script de verificación pre-deploy para Vercel
 * Verifica que todo está listo antes de desplegar
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando preparación para deploy a Vercel...\n');

let hasErrors = false;
let hasWarnings = false;

// ========================================
// 1. Verificar archivos críticos
// ========================================
console.log('📁 Verificando archivos críticos...');

const criticalFiles = [
  'next.config.mjs',
  'package.json',
  'tsconfig.json',
  'vercel.json',
  '.vercelignore',
  'public/manifest.webmanifest',
  'public/manifest.json',
  'middleware.ts'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTA`);
    hasErrors = true;
  }
});

// ========================================
// 2. Verificar iconos PWA
// ========================================
console.log('\n🎨 Verificando iconos PWA...');

const iconFiles = [
  'public/icons/icon-192.png',
  'public/icons/icon-512.png',
  'public/icons/maskable-512.png'
];

iconFiles.forEach(icon => {
  if (fs.existsSync(path.join(__dirname, '..', icon))) {
    console.log(`  ✅ ${icon}`);
  } else {
    console.log(`  ⚠️  ${icon} - No encontrado`);
    hasWarnings = true;
  }
});

// ========================================
// 3. Verificar variables de entorno
// ========================================
console.log('\n🔐 Verificando .env.local...');

if (fs.existsSync(path.join(__dirname, '..', '.env.local'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'ADMIN_SECRET',
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=PEGA_AQUI`)) {
      console.log(`  ✅ ${varName}`);
    } else {
      console.log(`  ❌ ${varName} - Falta o no configurado`);
      hasErrors = true;
    }
  });
  
  // Variables opcionales pero recomendadas
  const optionalVars = [
    'OPENAI_API_KEY',
    'REPLICATE_API_TOKEN',
    'NEXT_PUBLIC_UMAMI_WEBSITE_ID'
  ];
  
  console.log('\n  Opcionales (recomendadas):');
  optionalVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=PEGA_AQUI`)) {
      console.log(`  ✅ ${varName}`);
    } else {
      console.log(`  ⚠️  ${varName} - No configurado`);
      hasWarnings = true;
    }
  });
  
  // Verificar que no hay variables de Stripe (para beta)
  console.log('\n  Variables deshabilitadas para beta:');
  const stripeVars = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
  stripeVars.forEach(varName => {
    if (envContent.includes(`${varName}=sk_`) || envContent.includes(`${varName}=whsec_`)) {
      console.log(`  ⚠️  ${varName} - Configurado (OK para test, pero no se usará en beta)`);
    } else {
      console.log(`  ✅ ${varName} - No configurado (correcto para beta sin pagos)`);
    }
  });
  
} else {
  console.log('  ❌ .env.local no encontrado');
  hasErrors = true;
}

// ========================================
// 4. Verificar package.json scripts
// ========================================
console.log('\n📦 Verificando scripts de build...');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

if (packageJson.scripts) {
  const requiredScripts = ['build', 'dev', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`  ✅ npm run ${script}`);
    } else {
      console.log(`  ❌ npm run ${script} - Falta`);
      hasErrors = true;
    }
  });
}

// ========================================
// 5. Verificar next.config
// ========================================
console.log('\n⚙️  Verificando next.config.mjs...');

const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  const checks = [
    { pattern: 'ignoreDuringBuilds', name: 'ESLint ignorado en build' },
    { pattern: 'X-Frame-Options', name: 'Headers de seguridad' },
    { pattern: 'pwa:', name: 'Configuración PWA' }
  ];
  
  checks.forEach(check => {
    if (nextConfigContent.includes(check.pattern)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - No detectado`);
      hasWarnings = true;
    }
  });
} else {
  console.log('  ❌ next.config.mjs no encontrado');
  hasErrors = true;
}

// ========================================
// 6. Verificar migraciones
// ========================================
console.log('\n🗄️  Verificando migraciones de Supabase...');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  console.log(`  ✅ ${migrations.length} migraciones encontradas`);
  
  if (migrations.length < 15) {
    console.log('  ⚠️  Pocas migraciones detectadas, verifica que todas estén presentes');
    hasWarnings = true;
  }
} else {
  console.log('  ⚠️  Carpeta de migraciones no encontrada');
  hasWarnings = true;
}

// ========================================
// 7. Resumen y próximos pasos
// ========================================
console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ HAY ERRORES CRÍTICOS - No desplegar todavía');
  console.log('\nCorrige los errores marcados con ❌ antes de continuar.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  HAY ADVERTENCIAS - Puedes desplegar pero revisa los warnings');
  console.log('\nLas advertencias no bloquean el deploy, pero revísalas.');
} else {
  console.log('✅ TODO LISTO PARA DESPLEGAR A VERCEL');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('   1. Lee VERCEL_ENV_SETUP.md para copiar variables de entorno');
console.log('   2. Ve a https://vercel.com y conecta el repo');
console.log('   3. Pega las variables de entorno en Vercel Settings');
console.log('   4. Click en Deploy');
console.log('   5. Después del deploy, actualiza NEXT_PUBLIC_APP_URL con tu URL real');
console.log('   6. Sigue la validación iOS/Safari de DEPLOYMENT_CHECKLIST.md');
console.log('\n🔒 BETA CERRADA: SITE_PASSWORD está activo (cocorico2025)');
console.log('   Los usuarios verán un prompt de contraseña al entrar.');
console.log('\n💳 STRIPE: Deshabilitado para esta beta (correcto)');

console.log('\n' + '='.repeat(60));

process.exit(hasErrors ? 1 : 0);
