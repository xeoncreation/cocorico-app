// Script para actualizar traducciones automáticamente
const fs = require('fs');
const path = require('path');

const translations = {
  de: {
    "nav": {
      "home": "Startseite",
      "search": "Suchen",
      "learn": "Lernen",
      "dashboard": "Mein Dashboard",
      "favorites": "Favoriten",
      "versions": "Versionen",
      "import": "Importieren",
      "chat": "Chat",
      "voiceChat": "Sprach-Chat",
      "scanner": "Scanner",
      "recipes": "Rezepte",
      "community": "Community",
      "challenges": "Herausforderungen",
      "pricing": "Premium",
      "achievements": "Erfolge",
      "feedback": "Feedback",
      "settings": "Einstellungen",
      "login": "Anmelden",
      "logout": "Abmelden",
      "account": "Mein Konto",
      "shoppingList": "Einkaufsliste",
      "lang": { "_": "Sprache", "en": "EN", "es": "ES" },
      "stats": "Statistiken"
    },
    "footer": { "privacy": "Datenschutz", "terms": "Bedingungen" },
    "home": {
      "title": "Hallo! Ich bin Cocorico 🐓",
      "description": "Ihr Küchenassistent mit künstlicher Intelligenz. Finden Sie Rezepte, speichern Sie Ihre Favoriten und lernen Sie kochen ohne Verschwendung.",
      "chatButton": "Mit Cocorico chatten",
      "recipesButton": "Meine Rezepte ansehen"
    },
    "favorites": { "title": "Meine Favoriten", "empty": "Sie haben noch keine Favoriten gespeichert.", "private": "privat" },
    "versions": { "title": "Meine KI-Versionen", "empty": "Sie haben noch keine Versionen gespeichert.", "type": "Typ", "baseDeleted": "Basisrezept gelöscht" },
    "public": { "ingredients": "Zutaten", "steps": "Schritte", "unknown": "Unbekannt", "sharedBy": "Geteilt mit ❤️ von Cocorico 🐓", "minutes": "Min", "related": "Andere Rezepte, die Ihnen gefallen könnten 🍽️" },
    "chat": { "title": "Chat mit Cocorico", "subtitle": "Fragen Sie mich nach Rezepten, Zutaten, Ernährung oder jeder Kochfrage" },
    "shopping": { "title": "Einkaufsliste", "description": "Organisieren Sie Ihre Zutaten und machen Sie den Einkauf effizienter" },
    "nutrition": { "title": "Nährwertinformationen", "description": "Analysieren Sie den Nährwertgehalt Ihrer Rezepte" },
    "community": { "title": "Community-Video", "description": "Teilen und entdecken Sie Rezeptvideos der Community" },
    "scanner": { "title": "Lebensmittel-Scanner", "description": "Scannen Sie Produkte und erfahren Sie sofort ihre Nährwertinformationen" },
    "stats": { "title": "Statistiken", "description": "Visualisieren Sie Ihren Fortschritt und Kochstatistiken" },
    "auth": { "login": "Anmelden", "logout": "Ausloggen", "emailPlaceholder": "Ihre E-Mail", "sendLink": "Link senden", "magiclink": { "sent": "Wir haben Ihnen eine E-Mail mit dem Zugangslink gesendet. Überprüfen Sie sie und kommen Sie hierher zurück 👌", "error": "Link konnte nicht gesendet werden: {message}" }, "welcome": { "title": "Willkommen bei Cocorico!", "body": "Danke für Ihre Registrierung. Sie können jetzt Rezepte erstellen, mit der KI chatten und der Community beitreten." } },
    "emails": { "welcome": { "subject": "Willkommen bei Cocorico!", "body": "Hallo {name},\\n\\nVielen Dank, dass Sie Cocorico 🐓 beigetreten sind. Hier sind einige Schritte für den Einstieg:\\n1) Erstellen Sie Ihr erstes Rezept\\n2) Erkunden Sie die Community\\n3) Schließen Sie eine tägliche Herausforderung ab\\n\\nViel Spaß beim Kochen!" }, "verify": { "subject": "Bestätigen Sie Ihre E-Mail", "body": "Hallo, klicken Sie auf den Link, um Ihre E-Mail zu bestätigen und auf Cocorico zuzugreifen." }, "reset": { "subject": "Passwort zurücksetzen", "body": "Hallo, klicken Sie auf den Link, um Ihr Passwort zurückzusetzen." } },
    "common": { "cancel": "Abbrechen", "sending": "Wird gesendet..." }
  },
  it: {
    "nav": { "home": "Home", "search": "Cerca", "learn": "Impara", "dashboard": "Il mio pannello", "favorites": "Preferiti", "versions": "Versioni", "import": "Importa", "chat": "Chat", "voiceChat": "Chat vocale", "scanner": "Scanner", "recipes": "Ricette", "community": "Community", "challenges": "Sfide", "pricing": "Premium", "achievements": "Obiettivi", "feedback": "Feedback", "settings": "Impostazioni", "login": "Accedi", "logout": "Esci", "account": "Il mio account", "shoppingList": "Lista della spesa", "lang": { "_": "Lingua", "en": "EN", "es": "ES" }, "stats": "Statistiche" },
    "footer": { "privacy": "Privacy", "terms": "Termini" },
    "home": { "title": "Ciao! Sono Cocorico 🐓", "description": "Il tuo assistente di cucina con intelligenza artificiale. Trova ricette, salva i tuoi preferiti e impara a cucinare senza sprechi.", "chatButton": "Chatta con Cocorico", "recipesButton": "Vedi le mie ricette" },
    "favorites": { "title": "I miei preferiti", "empty": "Non hai ancora salvato preferiti.", "private": "privata" },
    "versions": { "title": "Le mie versioni IA", "empty": "Non hai ancora salvato versioni.", "type": "Tipo", "baseDeleted": "Ricetta base eliminata" },
    "public": { "ingredients": "Ingredienti", "steps": "Passaggi", "unknown": "Sconosciuta", "sharedBy": "Condiviso con ❤️ da Cocorico 🐓", "minutes": "min", "related": "Altre ricette che potrebbero piacerti 🍽️" },
    "chat": { "title": "Chat con Cocorico", "subtitle": "Chiedimi ricette, ingredienti, nutrizione o qualsiasi domanda culinaria" },
    "shopping": { "title": "Lista della spesa", "description": "Organizza i tuoi ingredienti e fai la spesa in modo più efficiente" },
    "nutrition": { "title": "Informazioni nutrizionali", "description": "Analizza il contenuto nutrizionale delle tue ricette" },
    "community": { "title": "Video community", "description": "Condividi e scopri video di ricette della community" },
    "scanner": { "title": "Scanner alimentare", "description": "Scansiona i prodotti e conosci le loro informazioni nutrizionali all'istante" },
    "stats": { "title": "Statistiche", "description": "Visualizza i tuoi progressi e statistiche culinarie" },
    "auth": { "login": "Accedi", "logout": "Esci", "emailPlaceholder": "La tua email", "sendLink": "Invia link", "magiclink": { "sent": "Ti abbiamo inviato un'email con il link di accesso. Controlla e torna qui 👌", "error": "Impossibile inviare il link: {message}" }, "welcome": { "title": "Benvenuto su Cocorico!", "body": "Grazie per esserti registrato. Ora puoi iniziare a creare ricette, chattare con l'IA e unirti alla community." } },
    "emails": { "welcome": { "subject": "Benvenuto su Cocorico!", "body": "Ciao {name},\\n\\nGrazie per esserti unito a Cocorico 🐓. Ecco alcuni passi per iniziare:\\n1) Crea la tua prima ricetta\\n2) Esplora la community\\n3) Completa una sfida giornaliera\\n\\nBuona cucina!" }, "verify": { "subject": "Verifica la tua email", "body": "Ciao, clicca sul link per verificare la tua email e accedere a Cocorico." }, "reset": { "subject": "Reimposta la password", "body": "Ciao, clicca sul link per reimpostare la tua password." } },
    "common": { "cancel": "Annulla", "sending": "Invio in corso..." }
  },
  pt: {
    "nav": { "home": "Início", "search": "Buscar", "learn": "Aprender", "dashboard": "Meu painel", "favorites": "Favoritos", "versions": "Versões", "import": "Importar", "chat": "Chat", "voiceChat": "Chat de voz", "scanner": "Scanner", "recipes": "Receitas", "community": "Comunidade", "challenges": "Desafios", "pricing": "Premium", "achievements": "Conquistas", "feedback": "Feedback", "settings": "Configurações", "login": "Entrar", "logout": "Sair", "account": "Minha conta", "shoppingList": "Lista de compras", "lang": { "_": "Idioma", "en": "EN", "es": "ES" }, "stats": "Estatísticas" },
    "footer": { "privacy": "Privacidade", "terms": "Termos" },
    "home": { "title": "Olá! Sou Cocorico 🐓", "description": "Seu assistente de cozinha com inteligência artificial. Encontre receitas, salve seus favoritos e aprenda a cozinhar sem desperdício.", "chatButton": "Conversar com Cocorico", "recipesButton": "Ver minhas receitas" },
    "favorites": { "title": "Meus favoritos", "empty": "Você ainda não salvou favoritos.", "private": "privada" },
    "versions": { "title": "Minhas versões IA", "empty": "Você ainda não salvou versões.", "type": "Tipo", "baseDeleted": "Receita base excluída" },
    "public": { "ingredients": "Ingredientes", "steps": "Passos", "unknown": "Desconhecida", "sharedBy": "Compartilhado com ❤️ por Cocorico 🐓", "minutes": "min", "related": "Outras receitas que podem te interessar 🍽️" },
    "chat": { "title": "Chat com Cocorico", "subtitle": "Pergunte-me sobre receitas, ingredientes, nutrição ou qualquer dúvida culinária" },
    "shopping": { "title": "Lista de compras", "description": "Organize seus ingredientes e faça as compras com mais eficiência" },
    "nutrition": { "title": "Informações nutricionais", "description": "Analise o conteúdo nutricional das suas receitas" },
    "community": { "title": "Vídeo comunidade", "description": "Compartilhe e descubra vídeos de receitas da comunidade" },
    "scanner": { "title": "Scanner de alimentos", "description": "Escaneie produtos e conheça suas informações nutricionais instantaneamente" },
    "stats": { "title": "Estatísticas", "description": "Visualize seu progresso e estatísticas culinárias" },
    "auth": { "login": "Entrar", "logout": "Sair", "emailPlaceholder": "Seu email", "sendLink": "Enviar link", "magiclink": { "sent": "Enviamos um email com o link de acesso. Verifique e volte aqui 👌", "error": "Não foi possível enviar o link: {message}" }, "welcome": { "title": "Bem-vindo ao Cocorico!", "body": "Obrigado por se registrar. Agora você pode começar a criar receitas, conversar com a IA e se juntar à comunidade." } },
    "emails": { "welcome": { "subject": "Bem-vindo ao Cocorico!", "body": "Olá {name},\\n\\nObrigado por se juntar ao Cocorico 🐓. Aqui estão alguns passos para começar:\\n1) Crie sua primeira receita\\n2) Explore a comunidade\\n3) Complete um desafio diário\\n\\nBora cozinhar!" }, "verify": { "subject": "Verifique seu email", "body": "Olá, clique no link para verificar seu email e acessar o Cocorico." }, "reset": { "subject": "Redefina sua senha", "body": "Olá, clique no link para redefinir sua senha." } },
    "common": { "cancel": "Cancelar", "sending": "Enviando..." }
  }
};

// Crear/actualizar archivos
Object.entries(translations).forEach(([lang, content]) => {
  const filePath = path.join(__dirname, '../src/messages', `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✅ ${lang}.json actualizado`);
});

console.log('\\n✨ Traducciones actualizadas correctamente!');
