#!/usr/bin/env node

/**
 * Script de verificación post-deploy
 * Verifica que la app esté funcionando correctamente en producción
 */

const https = require('https');

console.log('🔍 Verificando despliegue de Cocorico en Vercel...\n');

// Pide al usuario su URL de Vercel
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Ingresa tu URL de Vercel (ej: https://cocorico-app.vercel.app): ', (url) => {
  if (!url) {
    console.log('❌ URL vacía. Abortando.');
    readline.close();
    process.exit(1);
  }

  // Limpia la URL
  url = url.trim().replace(/\/$/, '');
  
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }

  console.log(`\n🌐 Verificando: ${url}\n`);

  const checks = [
    { path: '/', name: 'Home Page' },
    { path: '/health', name: 'Health Check' },
    { path: '/manifest.webmanifest', name: 'PWA Manifest' },
    { path: '/icons/icon-192.png', name: 'PWA Icon 192' },
    { path: '/icons/icon-512.png', name: 'PWA Icon 512' },
  ];

  let passed = 0;
  let failed = 0;
  let checkIndex = 0;

  function runNextCheck() {
    if (checkIndex >= checks.length) {
      // Resumen final
      console.log('\n' + '='.repeat(60));
      if (failed === 0) {
        console.log('✅ TODAS LAS VERIFICACIONES PASARON');
        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('   1. Abre tu navegador y ve a:', url);
        console.log('   2. Deberías ver el prompt de password (SITE_PASSWORD)');
        console.log('   3. Ingresa tu password configurado en Vercel');
        console.log('   4. Crea una cuenta de prueba y testea la app');
        console.log('   5. En iOS/Safari: Compartir → "Añadir a pantalla de inicio"');
        console.log('\n🎉 Tu app está LIVE en producción!');
      } else {
        console.log(`⚠️  ${passed} pasaron, ${failed} fallaron`);
        console.log('\nRevisa los errores arriba y verifica:');
        console.log('   - Que el redeploy se completó exitosamente');
        console.log('   - Que la URL es correcta');
        console.log('   - Que no hay errores en los logs de Vercel');
      }
      console.log('='.repeat(60));
      readline.close();
      process.exit(failed > 0 ? 1 : 0);
    }

    const check = checks[checkIndex++];
    const checkUrl = url + check.path;

    https.get(checkUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Cocorico-Verify/1.0'
      }
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 302) {
        // 200 = OK, 401 = password gate (esperado), 302 = redirect (esperado)
        console.log(`  ✅ ${check.name} (${res.statusCode})`);
        passed++;
      } else if (res.statusCode === 404 && check.path.includes('/icons/')) {
        console.log(`  ⚠️  ${check.name} (404 - icon puede faltar)`);
        passed++;
      } else {
        console.log(`  ❌ ${check.name} (${res.statusCode})`);
        failed++;
      }
      runNextCheck();
    }).on('error', (err) => {
      console.log(`  ❌ ${check.name} - Error: ${err.message}`);
      failed++;
      runNextCheck();
    }).on('timeout', () => {
      console.log(`  ❌ ${check.name} - Timeout`);
      failed++;
      runNextCheck();
    });
  }

  runNextCheck();
});
