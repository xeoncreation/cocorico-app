// Script para actualizar traducciones de idiomas asiáticos
const fs = require('fs');
const path = require('path');

const translations = {
  ja: {
    "nav": { "home": "ホーム", "search": "検索", "learn": "学ぶ", "dashboard": "マイダッシュボード", "favorites": "お気に入り", "versions": "バージョン", "import": "インポート", "chat": "チャット", "voiceChat": "音声チャット", "scanner": "スキャナー", "recipes": "レシピ", "community": "コミュニティ", "challenges": "チャレンジ", "pricing": "プレミアム", "achievements": "実績", "feedback": "フィードバック", "settings": "設定", "login": "ログイン", "logout": "ログアウト", "account": "マイアカウント", "shoppingList": "買い物リスト", "lang": { "_": "言語", "en": "EN", "es": "ES" }, "stats": "統計" },
    "footer": { "privacy": "プライバシー", "terms": "利用規約" },
    "home": { "title": "こんにちは！私はCocorico 🐓", "description": "AIを搭載した料理アシスタントです。レシピを見つけ、お気に入りを保存し、無駄なく料理を学びましょう。", "chatButton": "Cocoricoとチャット", "recipesButton": "レシピを見る" },
    "favorites": { "title": "お気に入り", "empty": "まだお気に入りがありません。", "private": "プライベート" },
    "versions": { "title": "マイAIバージョン", "empty": "まだバージョンがありません。", "type": "タイプ", "baseDeleted": "ベースレシピ削除済み" },
    "public": { "ingredients": "材料", "steps": "手順", "unknown": "不明", "sharedBy": "Cocorico 🐓より❤️を込めてシェア", "minutes": "分", "related": "おすすめレシピ 🍽️" },
    "chat": { "title": "Cocoricoとチャット", "subtitle": "レシピ、材料、栄養、料理に関する質問をしてください" },
    "shopping": { "title": "買い物リスト", "description": "材料を整理して、効率的に買い物をしましょう" },
    "nutrition": { "title": "栄養情報", "description": "レシピの栄養成分を分析します" },
    "community": { "title": "コミュニティ動画", "description": "コミュニティのレシピ動画を共有・発見" },
    "scanner": { "title": "食品スキャナー", "description": "製品をスキャンして栄養情報を即座に確認" },
    "stats": { "title": "統計", "description": "進捗状況と料理の統計を表示" },
    "auth": { "login": "ログイン", "logout": "ログアウト", "emailPlaceholder": "メールアドレス", "sendLink": "リンクを送信", "magiclink": { "sent": "アクセスリンクをメールで送信しました。確認してここに戻ってください 👌", "error": "リンクを送信できませんでした: {message}" }, "welcome": { "title": "Cocoricoへようこそ！", "body": "ご登録ありがとうございます。レシピの作成、AIとのチャット、コミュニティへの参加ができます。" } },
    "emails": { "welcome": { "subject": "Cocoricoへようこそ！", "body": "こんにちは {name}さん、\\n\\nCocorico 🐓へようこそ。始め方：\\n1) 最初のレシピを作成\\n2) コミュニティを探索\\n3) 毎日のチャレンジを完了\\n\\n料理を楽しんでください！" }, "verify": { "subject": "メールアドレスを確認", "body": "こんにちは、リンクをクリックしてメールを確認し、Cocoricoにアクセスしてください。" }, "reset": { "subject": "パスワードをリセット", "body": "こんにちは、リンクをクリックしてパスワードをリセットしてください。" } },
    "common": { "cancel": "キャンセル", "sending": "送信中..." }
  },
  ko: {
    "nav": { "home": "홈", "search": "검색", "learn": "배우기", "dashboard": "내 대시보드", "favorites": "즐겨찾기", "versions": "버전", "import": "가져오기", "chat": "채팅", "voiceChat": "음성 채팅", "scanner": "스캐너", "recipes": "레시피", "community": "커뮤니티", "challenges": "챌린지", "pricing": "프리미엄", "achievements": "업적", "feedback": "피드백", "settings": "설정", "login": "로그인", "logout": "로그아웃", "account": "내 계정", "shoppingList": "장보기 목록", "lang": { "_": "언어", "en": "EN", "es": "ES" }, "stats": "통계" },
    "footer": { "privacy": "개인정보", "terms": "이용약관" },
    "home": { "title": "안녕하세요! 저는 Cocorico 🐓", "description": "AI 기반 요리 도우미입니다. 레시피를 찾고, 즐겨찾기를 저장하고, 낭비 없이 요리하는 법을 배우세요.", "chatButton": "Cocorico와 채팅", "recipesButton": "내 레시피 보기" },
    "favorites": { "title": "내 즐겨찾기", "empty": "아직 즐겨찾기가 없습니다.", "private": "비공개" },
    "versions": { "title": "내 AI 버전", "empty": "아직 저장된 버전이 없습니다.", "type": "유형", "baseDeleted": "기본 레시피 삭제됨" },
    "public": { "ingredients": "재료", "steps": "단계", "unknown": "알 수 없음", "sharedBy": "Cocorico 🐓가 ❤️로 공유", "minutes": "분", "related": "추천 레시피 🍽️" },
    "chat": { "title": "Cocorico와 채팅", "subtitle": "레시피, 재료, 영양 또는 요리 관련 질문을 하세요" },
    "shopping": { "title": "장보기 목록", "description": "재료를 정리하고 효율적으로 장보기" },
    "nutrition": { "title": "영양 정보", "description": "레시피의 영양 성분 분석" },
    "community": { "title": "커뮤니티 동영상", "description": "커뮤니티의 레시피 동영상 공유 및 발견" },
    "scanner": { "title": "식품 스캐너", "description": "제품을 스캔하여 영양 정보를 즉시 확인" },
    "stats": { "title": "통계", "description": "진행 상황 및 요리 통계 시각화" },
    "auth": { "login": "로그인", "logout": "로그아웃", "emailPlaceholder": "이메일 주소", "sendLink": "링크 보내기", "magiclink": { "sent": "액세스 링크가 포함된 이메일을 보냈습니다. 확인하고 여기로 돌아오세요 👌", "error": "링크를 보낼 수 없습니다: {message}" }, "welcome": { "title": "Cocorico에 오신 것을 환영합니다!", "body": "가입해 주셔서 감사합니다. 이제 레시피를 만들고, AI와 채팅하고, 커뮤니티에 참여할 수 있습니다." } },
    "emails": { "welcome": { "subject": "Cocorico에 오신 것을 환영합니다!", "body": "안녕하세요 {name}님,\\n\\nCocorico 🐓에 가입해 주셔서 감사합니다. 시작하는 방법:\\n1) 첫 번째 레시피 만들기\\n2) 커뮤니티 탐색\\n3) 일일 챌린지 완료\\n\\n즐거운 요리 되세요!" }, "verify": { "subject": "이메일 확인", "body": "안녕하세요, 링크를 클릭하여 이메일을 확인하고 Cocorico에 액세스하세요." }, "reset": { "subject": "비밀번호 재설정", "body": "안녕하세요, 링크를 클릭하여 비밀번호를 재설정하세요." } },
    "common": { "cancel": "취소", "sending": "전송 중..." }
  },
  zh: {
    "nav": { "home": "首页", "search": "搜索", "learn": "学习", "dashboard": "我的面板", "favorites": "收藏夹", "versions": "版本", "import": "导入", "chat": "聊天", "voiceChat": "语音聊天", "scanner": "扫描仪", "recipes": "食谱", "community": "社区", "challenges": "挑战", "pricing": "高级会员", "achievements": "成就", "feedback": "反馈", "settings": "设置", "login": "登录", "logout": "退出", "account": "我的账户", "shoppingList": "购物清单", "lang": { "_": "语言", "en": "EN", "es": "ES" }, "stats": "统计" },
    "footer": { "privacy": "隐私", "terms": "条款" },
    "home": { "title": "你好！我是Cocorico 🐓", "description": "您的AI厨房助手。查找食谱，保存收藏夹，学习无浪费烹饪。", "chatButton": "与Cocorico聊天", "recipesButton": "查看我的食谱" },
    "favorites": { "title": "我的收藏", "empty": "您还没有保存收藏夹。", "private": "私密" },
    "versions": { "title": "我的AI版本", "empty": "您还没有保存版本。", "type": "类型", "baseDeleted": "基础食谱已删除" },
    "public": { "ingredients": "配料", "steps": "步骤", "unknown": "未知", "sharedBy": "由Cocorico 🐓用❤️分享", "minutes": "分钟", "related": "其他推荐食谱 🍽️" },
    "chat": { "title": "与Cocorico聊天", "subtitle": "向我询问食谱、配料、营养或任何烹饪问题" },
    "shopping": { "title": "购物清单", "description": "整理您的配料，更高效地购物" },
    "nutrition": { "title": "营养信息", "description": "分析您食谱的营养成分" },
    "community": { "title": "社区视频", "description": "分享和发现社区的食谱视频" },
    "scanner": { "title": "食品扫描仪", "description": "扫描产品，立即了解其营养信息" },
    "stats": { "title": "统计", "description": "可视化您的进度和烹饪统计数据" },
    "auth": { "login": "登录", "logout": "退出", "emailPlaceholder": "您的邮箱", "sendLink": "发送链接", "magiclink": { "sent": "我们已向您发送了包含访问链接的电子邮件。请检查并返回此处 👌", "error": "无法发送链接：{message}" }, "welcome": { "title": "欢迎来到Cocorico！", "body": "感谢您注册。现在您可以开始创建食谱、与AI聊天并加入社区。" } },
    "emails": { "welcome": { "subject": "欢迎来到Cocorico！", "body": "您好 {name}，\\n\\n感谢您加入Cocorico 🐓。开始使用的步骤：\\n1) 创建您的第一个食谱\\n2) 探索社区\\n3) 完成每日挑战\\n\\n享受烹饪乐趣！" }, "verify": { "subject": "验证您的电子邮件", "body": "您好，请点击链接验证您的电子邮件并访问Cocorico。" }, "reset": { "subject": "重置密码", "body": "您好，请点击链接重置您的密码。" } },
    "common": { "cancel": "取消", "sending": "发送中..." }
  },
  ar: {
    "nav": { "home": "الرئيسية", "search": "بحث", "learn": "تعلم", "dashboard": "لوحة التحكم", "favorites": "المفضلة", "versions": "الإصدارات", "import": "استيراد", "chat": "محادثة", "voiceChat": "محادثة صوتية", "scanner": "ماسح", "recipes": "وصفات", "community": "المجتمع", "challenges": "التحديات", "pricing": "متميز", "achievements": "الإنجازات", "feedback": "ملاحظات", "settings": "الإعدادات", "login": "تسجيل الدخول", "logout": "تسجيل الخروج", "account": "حسابي", "shoppingList": "قائمة التسوق", "lang": { "_": "اللغة", "en": "EN", "es": "ES" }, "stats": "إحصائيات" },
    "footer": { "privacy": "الخصوصية", "terms": "الشروط" },
    "home": { "title": "مرحباً! أنا Cocorico 🐓", "description": "مساعدك في المطبخ بالذكاء الاصطناعي. ابحث عن الوصفات، احفظ المفضلة، وتعلم الطهي بدون هدر.", "chatButton": "دردش مع Cocorico", "recipesButton": "عرض وصفاتي" },
    "favorites": { "title": "مفضلاتي", "empty": "لم تحفظ أي مفضلات بعد.", "private": "خاصة" },
    "versions": { "title": "إصداراتي بالذكاء الاصطناعي", "empty": "لم تحفظ أي إصدارات بعد.", "type": "النوع", "baseDeleted": "الوصفة الأساسية محذوفة" },
    "public": { "ingredients": "المكونات", "steps": "الخطوات", "unknown": "غير معروف", "sharedBy": "مشارك بـ ❤️ من Cocorico 🐓", "minutes": "دقيقة", "related": "وصفات أخرى قد تعجبك 🍽️" },
    "chat": { "title": "دردش مع Cocorico", "subtitle": "اسألني عن الوصفات والمكونات والتغذية أو أي سؤال طهي" },
    "shopping": { "title": "قائمة التسوق", "description": "نظم مكوناتك وتسوق بكفاءة أكبر" },
    "nutrition": { "title": "معلومات غذائية", "description": "تحليل المحتوى الغذائي لوصفاتك" },
    "community": { "title": "فيديو المجتمع", "description": "شارك واكتشف مقاطع فيديو الوصفات من المجتمع" },
    "scanner": { "title": "ماسح الأغذية", "description": "امسح المنتجات واعرف معلوماتها الغذائية فوراً" },
    "stats": { "title": "إحصائيات", "description": "تصور تقدمك وإحصائيات الطهي" },
    "auth": { "login": "تسجيل الدخول", "logout": "تسجيل الخروج", "emailPlaceholder": "بريدك الإلكتروني", "sendLink": "إرسال الرابط", "magiclink": { "sent": "أرسلنا لك بريداً إلكترونياً برابط الوصول. تحقق منه وعد هنا 👌", "error": "لم نتمكن من إرسال الرابط: {message}" }, "welcome": { "title": "مرحباً بك في Cocorico!", "body": "شكراً للتسجيل. يمكنك الآن البدء في إنشاء الوصفات والدردشة مع الذكاء الاصطناعي والانضمام إلى المجتمع." } },
    "emails": { "welcome": { "subject": "مرحباً بك في Cocorico!", "body": "مرحباً {name}،\\n\\nشكراً لانضمامك إلى Cocorico 🐓. إليك بعض الخطوات للبدء:\\n1) أنشئ وصفتك الأولى\\n2) استكشف المجتمع\\n3) أكمل تحدياً يومياً\\n\\nاستمتع بالطهي!" }, "verify": { "subject": "تحقق من بريدك الإلكتروني", "body": "مرحباً، انقر على الرابط للتحقق من بريدك الإلكتروني والوصول إلى Cocorico." }, "reset": { "subject": "إعادة تعيين كلمة المرور", "body": "مرحباً، انقر على الرابط لإعادة تعيين كلمة المرور." } },
    "common": { "cancel": "إلغاء", "sending": "جاري الإرسال..." }
  }
};

// Crear/actualizar archivos
Object.entries(translations).forEach(([lang, content]) => {
  const filePath = path.join(__dirname, '../src/messages', `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✅ ${lang}.json actualizado`);
});

console.log('\\n✨ Traducciones asiáticas y árabe actualizadas correctamente!');
