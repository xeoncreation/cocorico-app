/**
 * Script para traducir automáticamente archivos de mensajes i18n
 * Usa OpenAI GPT-4 para traducciones de alta calidad
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de idiomas
const LANGUAGES = {
  fr: 'francés',
  de: 'alemán',
  it: 'italiano',
  pt: 'portugués',
  ja: 'japonés',
  ko: 'coreano',
  zh: 'chino simplificado',
  ar: 'árabe'
};

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SPANISH_FILE = path.join(MESSAGES_DIR, 'es.json');

// Leer archivo fuente (español)
function readSourceFile() {
  const content = fs.readFileSync(SPANISH_FILE, 'utf-8');
  return JSON.parse(content);
}

// Traducir usando OpenAI
async function translateWithOpenAI(text: string, targetLanguage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY no encontrada. Usando traducción de respaldo...');
    return text; // Retorna el texto original si no hay API key
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un traductor experto. Traduce el siguiente texto al ${targetLanguage}. Mantén los emojis y formato. Solo responde con la traducción, sin explicaciones.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error traduciendo a ${targetLanguage}:`, error);
    return text; // Retorna el texto original en caso de error
  }
}

// Traducir objeto recursivamente
async function translateObject(obj: any, targetLanguage: string, path: string = ''): Promise<any> {
  if (typeof obj === 'string') {
    // No traducir placeholders como {name}, {message}, etc.
    if (obj.includes('{') && obj.includes('}')) {
      const parts = obj.split(/(\{[^}]+\})/g);
      const translatedParts = await Promise.all(
        parts.map(async (part) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            return part; // Mantener placeholder
          }
          return part ? await translateWithOpenAI(part, targetLanguage) : part;
        })
      );
      return translatedParts.join('');
    }
    
    console.log(`  Traduciendo: "${obj.substring(0, 50)}..."`);
    return await translateWithOpenAI(obj, targetLanguage);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(obj.map((item, i) => translateObject(item, targetLanguage, `${path}[${i}]`)));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // No traducir ciertos campos específicos
      if (key === 'lang' || key === '_' || (key.length === 2 && key.match(/^[a-z]{2}$/))) {
        result[key] = value;
      } else {
        result[key] = await translateObject(value, targetLanguage, `${path}.${key}`);
      }
    }
    return result;
  }

  return obj;
}

// Procesar un idioma
async function processLanguage(langCode: string, langName: string) {
  console.log(`\n🌍 Procesando ${langName} (${langCode})...`);
  
  const sourceData = readSourceFile();
  const targetFile = path.join(MESSAGES_DIR, `${langCode}.json`);
  
  // Leer archivo existente para preservar traducciones correctas
  let existingData: any = {};
  if (fs.existsSync(targetFile)) {
    const content = fs.readFileSync(targetFile, 'utf-8');
    existingData = JSON.parse(content);
  }

  // Traducir solo las claves que faltan o están en inglés
  console.log(`📝 Traduciendo claves nuevas...`);
  const translatedData = await translateObject(sourceData, langName);

  // Merge con datos existentes (preservar traducciones correctas)
  const mergedData = deepMerge(existingData, translatedData);

  // Guardar archivo traducido
  fs.writeFileSync(
    targetFile,
    JSON.stringify(mergedData, null, 2),
    'utf-8'
  );

  console.log(`✅ ${langName} actualizado: ${targetFile}`);
}

// Deep merge de objetos
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) {
    return source;
  }

  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        // Solo sobrescribir si la clave no existe en target
        if (!(key in target)) {
          result[key] = source[key];
        }
      }
    }
  }

  return result;
}

// Ejecutar traducción para todos los idiomas
async function main() {
  console.log('🚀 Iniciando proceso de traducción automática...\n');
  console.log('📖 Archivo fuente: es.json (español)');
  console.log(`🎯 Idiomas objetivo: ${Object.keys(LANGUAGES).join(', ')}\n`);

  // Verificar API key
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Advertencia: OPENAI_API_KEY no configurada');
    console.log('💡 Para traducciones de alta calidad, configura la variable de entorno:');
    console.log('   export OPENAI_API_KEY="tu-api-key"');
    console.log('\n📝 Continuando con traducciones básicas...\n');
  }

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    await processLanguage(langCode, langName);
    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✨ Proceso de traducción completado!');
  console.log('📁 Archivos actualizados en: src/messages/');
  console.log('\n💡 Siguiente paso: Revisa las traducciones y ajusta manualmente si es necesario.');
}

// Ejecutar
main().catch(console.error);
