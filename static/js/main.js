document.addEventListener('DOMContentLoaded', () => {
    // --- ГИГАНТСКИЙ СЛОВАРЬ ПЕРЕВОДОВ (10 ЯЗЫКОВ) ---
    const i18n = {
        ru: {
            theme_dark: "🌙 Темная тема", theme_light: "☀️ Светлая тема",
            welcome: "Добро пожаловать в DiaLog", login_title: "Вход", user_label: "Логин:", pass_label: "Пароль:",
            btn_login: "Войти", no_account: "Нет аккаунта? ", btn_show_reg: "Зарегистрироваться",
            reg_title: "Регистрация", reg_user: "Придумайте логин:", reg_pass: "Придумайте пароль:",
            btn_reg: "Создать аккаунт", has_account: "Уже есть аккаунт? ", btn_show_login: "Войти",
            app_title: "Дневник Диабетика", btn_logout: "Выйти", new_record: "Новая запись", sugar_label: "Сахар (ммоль/л):",
            xe_label: "ХЕ:", xe_tooltip: "Хлебная единица (ХЕ) — мера углеводов. 1 ХЕ ≈ 10-12 г углеводов.",
            xe_ph: "Напр: 2.5", grams_label: "Граммы:", grams_ph: "Напр: 150", food_label: "Что ты ел:",
            food_none: "(Не указываю)", food_kasha: "Каша / Крупы", food_soup: "Суп", food_meat: "Мясо / Рыба с гарниром",
            food_veg: "Овощи / Салат", food_fruit: "Фрукты / Ягоды", food_sweet: "Сладкое / Десерт", food_fast: "Фастфуд / Снеки",
            food_other: "Другое (напишу сам)...", food_custom_ph: "Напиши свою еду...", time_label: "Время замера:",
            time_fast: "Натощак", time_before: "Перед едой", time_after: "После еды", time_sleep: "Перед сном",
            notes_label: "Заметки (самочувствие):", btn_save: "Сохранить", btn_cancel: "Отменить редактирование",
            filter_title: "Период отчета", btn_apply: "Применить фильтр", btn_reset: "Сбросить",
            stats_title: "Статистика (по фильтру)", stats_avg: "Средний сахар: ", mmol: "ммоль/л", stats_total: " | Всего замеров: ",
            hist_title: "История замеров", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Дата", th_sugar: "Сахар",
            th_xe: "ХЕ / Граммы", th_food: "Еда / Контекст", th_actions: "Действия", btn_prev: "◀ Назад", btn_next: "Вперед ▶",
            chart_label: "Сахар (ммоль/л)", btn_update: "Обновить запись", edit_title: "Редактирование записи",
            page_text: "Страница {0} из {1}", welcome_user: "Привет, {0}!", confirm_del: "Точно удалить запись?", unit_xe: "ХЕ", unit_g: "г"
        },
        en: {
            theme_dark: "🌙 Dark Mode", theme_light: "☀️ Light Mode",
            welcome: "Welcome to DiaLog", login_title: "Login", user_label: "Username:", pass_label: "Password:",
            btn_login: "Sign In", no_account: "No account? ", btn_show_reg: "Register",
            reg_title: "Registration", reg_user: "Create username:", reg_pass: "Create password:",
            btn_reg: "Create account", has_account: "Already have an account? ", btn_show_login: "Sign in",
            app_title: "Diabetic Diary", btn_logout: "Logout", new_record: "New Record", sugar_label: "Sugar (mmol/L):",
            xe_label: "BU:", xe_tooltip: "Bread Unit (BU) is a measure of carbs. 1 BU ≈ 10-12g of carbs.",
            xe_ph: "e.g., 2.5", grams_label: "Grams:", grams_ph: "e.g., 150", food_label: "What did you eat:",
            food_none: "(Not specified)", food_kasha: "Porridge / Grains", food_soup: "Soup", food_meat: "Meat / Fish with side",
            food_veg: "Vegetables / Salad", food_fruit: "Fruits / Berries", food_sweet: "Sweets / Dessert", food_fast: "Fast food / Snacks",
            food_other: "Other (custom)...", food_custom_ph: "Type your food...", time_label: "Measurement time:",
            time_fast: "Fasting", time_before: "Before meal", time_after: "After meal", time_sleep: "Before sleep",
            notes_label: "Notes (well-being):", btn_save: "Save", btn_cancel: "Cancel edit",
            filter_title: "Report Period", btn_apply: "Apply Filter", btn_reset: "Reset",
            stats_title: "Statistics (Filtered)", stats_avg: "Average sugar: ", mmol: "mmol/L", stats_total: " | Total records: ",
            hist_title: "Measurement History", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Date", th_sugar: "Sugar",
            th_xe: "BU / Grams", th_food: "Food / Context", th_actions: "Actions", btn_prev: "◀ Prev", btn_next: "Next ▶",
            chart_label: "Sugar (mmol/L)", btn_update: "Update record", edit_title: "Edit Record",
            page_text: "Page {0} of {1}", welcome_user: "Welcome, {0}!", confirm_del: "Delete this record?", unit_xe: "BU", unit_g: "g"
        },
        zh: {
            theme_dark: "🌙 暗黑模式", theme_light: "☀️ 明亮模式",
            welcome: "欢迎来到 DiaLog", login_title: "登录", user_label: "用户名:", pass_label: "密码:",
            btn_login: "登录", no_account: "没有账号？ ", btn_show_reg: "注册",
            reg_title: "注册", reg_user: "创建用户名:", reg_pass: "创建密码:",
            btn_reg: "创建账号", has_account: "已有账号？ ", btn_show_login: "登录",
            app_title: "糖尿病日记", btn_logout: "退出", new_record: "新记录", sugar_label: "血糖 (mmol/L):",
            xe_label: "碳水单位:", xe_tooltip: "碳水化合物交换份(BU)。 1 BU ≈ 10-12克碳水。",
            xe_ph: "例: 2.5", grams_label: "克:", grams_ph: "例: 150", food_label: "你吃了什么:",
            food_none: "(未指定)", food_kasha: "粥 / 谷物", food_soup: "汤", food_meat: "肉 / 鱼配菜",
            food_veg: "蔬菜 / 沙拉", food_fruit: "水果 / 浆果", food_sweet: "甜点", food_fast: "快餐 / 零食",
            food_other: "其他 (自定义)...", food_custom_ph: "输入食物...", time_label: "测量时间:",
            time_fast: "空腹", time_before: "餐前", time_after: "餐后", time_sleep: "睡前",
            notes_label: "备注 (身体状况):", btn_save: "保存", btn_cancel: "取消编辑",
            filter_title: "报告周期", btn_apply: "应用筛选", btn_reset: "重置",
            stats_title: "统计 (已筛选)", stats_avg: "平均血糖: ", mmol: "mmol/L", stats_total: " | 总记录: ",
            hist_title: "测量历史", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "日期", th_sugar: "血糖",
            th_xe: "碳水单位/克", th_food: "食物/时间", th_actions: "操作", btn_prev: "◀ 上一页", btn_next: "下一页 ▶",
            chart_label: "血糖 (mmol/L)", btn_update: "更新记录", edit_title: "编辑记录",
            page_text: "第 {0} 页，共 {1} 页", welcome_user: "欢迎，{0}！", confirm_del: "确认删除此记录？", unit_xe: "BU", unit_g: "g"
        },
        fr: {
            theme_dark: "🌙 Mode Sombre", theme_light: "☀️ Mode Clair",
            welcome: "Bienvenue sur DiaLog", login_title: "Connexion", user_label: "Nom d'utilisateur:", pass_label: "Mot de passe:",
            btn_login: "Se connecter", no_account: "Pas de compte ? ", btn_show_reg: "S'inscrire",
            reg_title: "Inscription", reg_user: "Créer un pseudo:", reg_pass: "Créer un mot de passe:",
            btn_reg: "Créer le compte", has_account: "Déjà un compte ? ", btn_show_login: "Se connecter",
            app_title: "Journal Diabétique", btn_logout: "Déconnexion", new_record: "Nouvel Enregistrement", sugar_label: "Sucre (mmol/L):",
            xe_label: "Unité:", xe_tooltip: "Unité de pain (BU) mesure les glucides. 1 BU ≈ 10-12g.",
            xe_ph: "ex: 2.5", grams_label: "Grammes:", grams_ph: "ex: 150", food_label: "Qu'avez-vous mangé:",
            food_none: "(Non spécifié)", food_kasha: "Bouillie / Céréales", food_soup: "Soupe", food_meat: "Viande / Poisson",
            food_veg: "Légumes / Salade", food_fruit: "Fruits / Baies", food_sweet: "Dessert / Sucreries", food_fast: "Fast-food / Snacks",
            food_other: "Autre (préciser)...", food_custom_ph: "Votre repas...", time_label: "Moment:",
            time_fast: "À jeun", time_before: "Avant repas", time_after: "Après repas", time_sleep: "Avant coucher",
            notes_label: "Notes (état):", btn_save: "Enregistrer", btn_cancel: "Annuler l'édition",
            filter_title: "Période", btn_apply: "Filtrer", btn_reset: "Réinitialiser",
            stats_title: "Statistiques", stats_avg: "Sucre moyen: ", mmol: "mmol/L", stats_total: " | Total: ",
            hist_title: "Historique", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Date", th_sugar: "Sucre",
            th_xe: "BU / Grammes", th_food: "Repas / Contexte", th_actions: "Actions", btn_prev: "◀ Préc", btn_next: "Suiv ▶",
            chart_label: "Sucre (mmol/L)", btn_update: "Mettre à jour", edit_title: "Édition",
            page_text: "Page {0} sur {1}", welcome_user: "Bienvenue, {0} !", confirm_del: "Supprimer cet enregistrement ?", unit_xe: "BU", unit_g: "g"
        },
        es: {
            theme_dark: "🌙 Modo Oscuro", theme_light: "☀️ Modo Claro",
            welcome: "Bienvenido a DiaLog", login_title: "Iniciar sesión", user_label: "Usuario:", pass_label: "Contraseña:",
            btn_login: "Entrar", no_account: "¿No tienes cuenta? ", btn_show_reg: "Regístrate",
            reg_title: "Registro", reg_user: "Crear usuario:", reg_pass: "Crear contraseña:",
            btn_reg: "Crear cuenta", has_account: "¿Ya tienes cuenta? ", btn_show_login: "Entrar",
            app_title: "Diario Diabético", btn_logout: "Salir", new_record: "Nuevo Registro", sugar_label: "Azúcar (mmol/L):",
            xe_label: "Unidad:", xe_tooltip: "Unidad de Pan (BU). 1 BU ≈ 10-12g de carbohidratos.",
            xe_ph: "ej: 2.5", grams_label: "Gramos:", grams_ph: "ej: 150", food_label: "Qué comiste:",
            food_none: "(No especificado)", food_kasha: "Gachas / Cereales", food_soup: "Sopa", food_meat: "Carne / Pescado",
            food_veg: "Verduras / Ensalada", food_fruit: "Frutas / Bayas", food_sweet: "Dulces / Postre", food_fast: "Comida rápida",
            food_other: "Otro (escribir)...", food_custom_ph: "Tu comida...", time_label: "Momento:",
            time_fast: "En ayunas", time_before: "Antes de comer", time_after: "Después de comer", time_sleep: "Antes de dormir",
            notes_label: "Notas (bienestar):", btn_save: "Guardar", btn_cancel: "Cancelar",
            filter_title: "Período", btn_apply: "Aplicar filtro", btn_reset: "Resetear",
            stats_title: "Estadísticas", stats_avg: "Azúcar medio: ", mmol: "mmol/L", stats_total: " | Registros: ",
            hist_title: "Historial", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Fecha", th_sugar: "Azúcar",
            th_xe: "BU / Gramos", th_food: "Comida / Contexto", th_actions: "Acciones", btn_prev: "◀ Ant", btn_next: "Sig ▶",
            chart_label: "Azúcar (mmol/L)", btn_update: "Actualizar", edit_title: "Editar Registro",
            page_text: "Página {0} de {1}", welcome_user: "¡Hola, {0}!", confirm_del: "¿Borrar este registro?", unit_xe: "BU", unit_g: "g"
        },
        de: {
            theme_dark: "🌙 Dunkler Modus", theme_light: "☀️ Heller Modus",
            welcome: "Willkommen bei DiaLog", login_title: "Anmeldung", user_label: "Benutzername:", pass_label: "Passwort:",
            btn_login: "Einloggen", no_account: "Kein Konto? ", btn_show_reg: "Registrieren",
            reg_title: "Registrierung", reg_user: "Benutzername erstellen:", reg_pass: "Passwort erstellen:",
            btn_reg: "Konto erstellen", has_account: "Bereits ein Konto? ", btn_show_login: "Einloggen",
            app_title: "Diabetiker-Tagebuch", btn_logout: "Abmelden", new_record: "Neuer Eintrag", sugar_label: "Zucker (mmol/L):",
            xe_label: "BE:", xe_tooltip: "Broteinheit (BE) misst Kohlenhydrate. 1 BE ≈ 10-12g.",
            xe_ph: "z.B. 2.5", grams_label: "Gramm:", grams_ph: "z.B. 150", food_label: "Was hast du gegessen:",
            food_none: "(Nicht angegeben)", food_kasha: "Brei / Getreide", food_soup: "Suppe", food_meat: "Fleisch / Fisch",
            food_veg: "Gemüse / Salat", food_fruit: "Obst / Beeren", food_sweet: "Süßigkeiten / Dessert", food_fast: "Fastfood / Snacks",
            food_other: "Anderes...", food_custom_ph: "Dein Essen...", time_label: "Messzeitpunkt:",
            time_fast: "Nüchtern", time_before: "Vor dem Essen", time_after: "Nach dem Essen", time_sleep: "Vor dem Schlafen",
            notes_label: "Notizen (Befinden):", btn_save: "Speichern", btn_cancel: "Abbrechen",
            filter_title: "Zeitraum", btn_apply: "Filter anwenden", btn_reset: "Zurücksetzen",
            stats_title: "Statistiken", stats_avg: "Durchschnitt: ", mmol: "mmol/L", stats_total: " | Einträge: ",
            hist_title: "Verlauf", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Datum", th_sugar: "Zucker",
            th_xe: "BE / Gramm", th_food: "Essen / Kontext", th_actions: "Aktionen", btn_prev: "◀ Zurück", btn_next: "Weiter ▶",
            chart_label: "Zucker (mmol/L)", btn_update: "Aktualisieren", edit_title: "Eintrag bearbeiten",
            page_text: "Seite {0} von {1}", welcome_user: "Willkommen, {0}!", confirm_del: "Eintrag löschen?", unit_xe: "BE", unit_g: "g"
        },
        uk: {
            theme_dark: "🌙 Темна тема", theme_light: "☀️ Світла тема",
            welcome: "Ласкаво просимо до DiaLog", login_title: "Вхід", user_label: "Логін:", pass_label: "Пароль:",
            btn_login: "Увійти", no_account: "Немає акаунту? ", btn_show_reg: "Зареєструватися",
            reg_title: "Реєстрація", reg_user: "Придумайте логін:", reg_pass: "Придумайте пароль:",
            btn_reg: "Створити акаунт", has_account: "Вже є акаунт? ", btn_show_login: "Увійти",
            app_title: "Щоденник Діабетика", btn_logout: "Вийти", new_record: "Новий запис", sugar_label: "Цукор (ммоль/л):",
            xe_label: "ХО:", xe_tooltip: "Хлібна одиниця (ХО) — міра вуглеводів. 1 ХО ≈ 10-12 г.",
            xe_ph: "Напр: 2.5", grams_label: "Грами:", grams_ph: "Напр: 150", food_label: "Що ви їли:",
            food_none: "(Не вказую)", food_kasha: "Каша / Крупы", food_soup: "Суп", food_meat: "М'ясо / Риба з гарніром",
            food_veg: "Овочі / Салат", food_fruit: "Фрукти / Ягоди", food_sweet: "Солодке / Десерт", food_fast: "Фастфуд / Снеки",
            food_other: "Інше (напишу сам)...", food_custom_ph: "Напишіть свою їжу...", time_label: "Час виміру:",
            time_fast: "Натщесерце", time_before: "Перед їжею", time_after: "Після їжі", time_sleep: "Перед сном",
            notes_label: "Нотатки (самопочуття):", btn_save: "Зберегти", btn_cancel: "Скасувати",
            filter_title: "Період звіту", btn_apply: "Застосувати", btn_reset: "Скинути",
            stats_title: "Статистика", stats_avg: "Середній цукор: ", mmol: "ммоль/л", stats_total: " | Всього записів: ",
            hist_title: "Історія вимірів", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Дата", th_sugar: "Цукор",
            th_xe: "ХО / Грами", th_food: "Їжа / Контекст", th_actions: "Дії", btn_prev: "◀ Назад", btn_next: "Вперед ▶",
            chart_label: "Цукор (ммоль/л)", btn_update: "Оновити запис", edit_title: "Редагування",
            page_text: "Сторінка {0} з {1}", welcome_user: "Привіт, {0}!", confirm_del: "Точно видалити?", unit_xe: "ХО", unit_g: "г"
        },
        be: {
            theme_dark: "🌙 Цёмная тэма", theme_light: "☀️ Светлая тэма",
            welcome: "Сардэчна запрашаем у DiaLog", login_title: "Уваход", user_label: "Лагін:", pass_label: "Пароль:",
            btn_login: "Увайсці", no_account: "Няма акаўнта? ", btn_show_reg: "Зарэгістравацца",
            reg_title: "Рэгістрацыя", reg_user: "Прыдумайце лагін:", reg_pass: "Прыдумайце пароль:",
            btn_reg: "Стварыць акаўнт", has_account: "Ужо ёсць акаўнт? ", btn_show_login: "Увайсці",
            app_title: "Дзённік Дыябетыка", btn_logout: "Выйсці", new_record: "Новы запіс", sugar_label: "Цукор (ммоль/л):",
            xe_label: "ХА:", xe_tooltip: "Хлебная адзінка (ХА) — мера вугляводаў. 1 ХА ≈ 10-12 г.",
            xe_ph: "Напр: 2.5", grams_label: "Грамы:", grams_ph: "Напр: 150", food_label: "Што вы елі:",
            food_none: "(Не пазначаю)", food_kasha: "Каша / Крупы", food_soup: "Суп", food_meat: "Мяса / Рыба",
            food_veg: "Гародніна / Салата", food_fruit: "Садавіна / Ягады", food_sweet: "Салодкае / Дэсерт", food_fast: "Фастфуд / Снэкі",
            food_other: "Іншае (напішу сам)...", food_custom_ph: "Напішыце сваю ежу...", time_label: "Час вымеру:",
            time_fast: "Нашча", time_before: "Перад ежай", time_after: "Пасля ежы", time_sleep: "Перад сном",
            notes_label: "Нататкі (самаадчуванне):", btn_save: "Захаваць", btn_cancel: "Скасаваць",
            filter_title: "Перыяд справаздачы", btn_apply: "Ужыць", btn_reset: "Скінуць",
            stats_title: "Статыстыка", stats_avg: "Сярэдні цукар: ", mmol: "ммоль/л", stats_total: " | Усяго запісаў: ",
            hist_title: "Гісторыя вымераў", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Дата", th_sugar: "Цукор",
            th_xe: "ХА / Грамы", th_food: "Ежа / Кантэкст", th_actions: "Дзеянні", btn_prev: "◀ Назад", btn_next: "Наперад ▶",
            chart_label: "Цукор (ммоль/л)", btn_update: "Абнавіць запіс", edit_title: "Рэдагаванне",
            page_text: "Старонка {0} з {1}", welcome_user: "Прывітанне, {0}!", confirm_del: "Дакладна выдаліць?", unit_xe: "ХА", unit_g: "г"
        },
        kk: {
            theme_dark: "🌙 Қараңғы тақырып", theme_light: "☀️ Жарық тақырып",
            welcome: "DiaLog-қа қош келдіңіз", login_title: "Кіру", user_label: "Логин:", pass_label: "Құпия сөз:",
            btn_login: "Кіру", no_account: "Аккаунт жоқ па? ", btn_show_reg: "Тіркелу",
            reg_title: "Тіркелу", reg_user: "Логин ойлап табыңыз:", reg_pass: "Құпия сөз ойлап табыңыз:",
            btn_reg: "Аккаунт құру", has_account: "Аккаунт бар ма? ", btn_show_login: "Кіру",
            app_title: "Диабетик күнделігі", btn_logout: "Шығу", new_record: "Жаңа жазба", sugar_label: "Қант (ммоль/л):",
            xe_label: "НБ:", xe_tooltip: "Нан бірлігі (НБ) — көмірсулар өлшемі. 1 НБ ≈ 10-12 г.",
            xe_ph: "Мыс: 2.5", grams_label: "Грамм:", grams_ph: "Мыс: 150", food_label: "Не жедіңіз:",
            food_none: "(Көрсетпеймін)", food_kasha: "Ботқа / Жарма", food_soup: "Сорпа", food_meat: "Ет / Балық",
            food_veg: "Көкөніс / Салат", food_fruit: "Жеміс / Жидек", food_sweet: "Тәтті / Десерт", food_fast: "Фастфуд / Снек",
            food_other: "Басқа (өзім жазамын)...", food_custom_ph: "Тамағыңызды жазыңыз...", time_label: "Өлшеу уақыты:",
            time_fast: "Аш қарынға", time_before: "Тамақ алдында", time_after: "Тамақтан кейін", time_sleep: "Ұйқы алдында",
            notes_label: "Ескертпе (жағдай):", btn_save: "Сақтау", btn_cancel: "Бас тарту",
            filter_title: "Есеп кезеңі", btn_apply: "Сүзгіні қолдану", btn_reset: "Қалпына келтіру",
            stats_title: "Статистика", stats_avg: "Орташа қант: ", mmol: "ммоль/л", stats_total: " | Барлық жазба: ",
            hist_title: "Өлшеу тарихы", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Күні", th_sugar: "Қант",
            th_xe: "НБ / Грамм", th_food: "Тамақ / Контекст", th_actions: "Әрекеттер", btn_prev: "◀ Артқа", btn_next: "Алға ▶",
            chart_label: "Қант (ммоль/л)", btn_update: "Жазбаны жаңарту", edit_title: "Өңдеу",
            page_text: "Бет {0} / {1}", welcome_user: "Сәлем, {0}!", confirm_del: "Жазбаны жою керек пе?", unit_xe: "НБ", unit_g: "г"
        },
        uz: {
            theme_dark: "🌙 Tungi rejim", theme_light: "☀️ Kunduzgi rejim",
            welcome: "DiaLog-ga xush kelibsiz", login_title: "Kirish", user_label: "Login:", pass_label: "Parol:",
            btn_login: "Kirish", no_account: "Akkaunt yo'qmi? ", btn_show_reg: "Ro'yxatdan o'tish",
            reg_title: "Ro'yxatdan o'tish", reg_user: "Login o'ylab toping:", reg_pass: "Parol o'ylab toping:",
            btn_reg: "Akkaunt yaratish", has_account: "Akkaunt bormi? ", btn_show_login: "Kirish",
            app_title: "Diabetik kundaligi", btn_logout: "Chiqish", new_record: "Yangi yozuv", sugar_label: "Shakar (mmol/l):",
            xe_label: "NB:", xe_tooltip: "Non birligi (NB) — uglevodlar o'lchovi. 1 NB ≈ 10-12 g.",
            xe_ph: "Mas: 2.5", grams_label: "Gramm:", grams_ph: "Mas: 150", food_label: "Nima yedingiz:",
            food_none: "(Ko'rsatilmagan)", food_kasha: "Bo'tqa / Yorma", food_soup: "Sho'rva", food_meat: "Go'sht / Baliq",
            food_veg: "Sabzavot / Salat", food_fruit: "Meva / Rezavorlar", food_sweet: "Shirinlik / Desert", food_fast: "Fastfud / Snek",
            food_other: "Boshqa (o'zim yozaman)...", food_custom_ph: "Ovqatingizni yozing...", time_label: "O'lchov vaqti:",
            time_fast: "Och qoringa", time_before: "Ovqatdan oldin", time_after: "Ovqatdan keyin", time_sleep: "Uxlashdan oldin",
            notes_label: "Qaydlar (ahvolingiz):", btn_save: "Saqlash", btn_cancel: "Bekor qilish",
            filter_title: "Hisobot davri", btn_apply: "Filtrni qo'llash", btn_reset: "Tiklash",
            stats_title: "Statistika", stats_avg: "O'rtacha shakar: ", mmol: "mmol/l", stats_total: " | Jami yozuvlar: ",
            hist_title: "O'lchovlar tarixi", btn_export: "⬇ CSV", btn_pdf: "📄 PDF", th_date: "Sana", th_sugar: "Shakar",
            th_xe: "NB / Gramm", th_food: "Ovqat / Kontekst", th_actions: "Harakatlar", btn_prev: "◀ Orqaga", btn_next: "Oldinga ▶",
            chart_label: "Shakar (mmol/l)", btn_update: "Yozuvni yangilash", edit_title: "Tahrirlash",
            page_text: "Sahifa {0} / {1}", welcome_user: "Salom, {0}!", confirm_del: "Yozuv o'chirilsinmi?", unit_xe: "NB", unit_g: "g"
        }
    };

    const contextMap = {'Натощак': 'time_fast', 'Перед едой': 'time_before', 'После еды': 'time_after', 'Перед сном': 'time_sleep'};
    const foodMap = {'Каша / Крупы': 'food_kasha', 'Суп': 'food_soup', 'Мясо / Рыба с гарниром': 'food_meat', 'Овощи / Салат': 'food_veg', 'Фрукты / Ягоды': 'food_fruit', 'Сладкое / Десерт': 'food_sweet', 'Фастфуд / Снеки': 'food_fast', 'Другое': 'food_other'};
    
    const backendMsgs = {
        'Запись сохранена!': {ru: 'Запись сохранена!', en: 'Record saved!', zh: '记录已保存！', fr: 'Enregistrement sauvegardé!', es: '¡Registro guardado!', de: 'Eintrag gespeichert!', uk: 'Запис збережено!', be: 'Запіс захаваны!', kk: 'Жазба сақталды!', uz: 'Yozuv saqlandi!'},
        'Запись обновлена!': {ru: 'Запись обновлена!', en: 'Record updated!', zh: '记录已更新！', fr: 'Enregistrement mis à jour!', es: '¡Registro actualizado!', de: 'Eintrag aktualisiert!', uk: 'Запис оновлено!', be: 'Запіс абноўлены!', kk: 'Жазба жаңартылды!', uz: 'Yozuv yangilandi!'},
        'Удалено!': {ru: 'Удалено!', en: 'Deleted!', zh: '已删除！', fr: 'Supprimé!', es: '¡Eliminado!', de: 'Gelöscht!', uk: 'Видалено!', be: 'Выдалена!', kk: 'Жойылды!', uz: 'Oʻchirildi!'},
        'Логин занят.': {ru: 'Логин занят.', en: 'Username taken.', zh: '用户名已被使用。', fr: 'Nom d\'utilisateur pris.', es: 'Nombre de usuario en uso.', de: 'Benutzername vergeben.', uk: 'Логін зайнятий.', be: 'Лагін заняты.', kk: 'Логин бос емес.', uz: 'Login band.'},
        'Неверный логин или пароль.': {ru: 'Неверный логин или пароль.', en: 'Invalid username or password.', zh: '用户名或密码无效。', fr: 'Identifiant ou mot de passe invalide.', es: 'Usuario o contraseña inválidos.', de: 'Falscher Benutzername oder Passwort.', uk: 'Невірний логін або пароль.', be: 'Няправільны лагін або пароль.', kk: 'Логин немесе құпия сөз қате.', uz: 'Notoʻgʻri login yoki parol.'},
        'Заполните все поля': {ru: 'Заполните все поля', en: 'Fill all fields', zh: '填写所有字段', fr: 'Remplissez tous les champs', es: 'Rellena todos los campos', de: 'Alle Felder ausfüllen', uk: 'Заповніть усі поля', be: 'Запоўніце ўсе палі', kk: 'Барлық өрістерді толтырыңыз', uz: 'Barcha maydonlarni toʻldiring'},
        'Ошибка: Невозможный сахар.': {ru: 'Ошибка: Невозможный сахар.', en: 'Error: Impossible sugar level.', zh: '错误：不可能的血糖值。', fr: 'Erreur : Niveau de sucre impossible.', es: 'Error: Nivel de azúcar imposible.', de: 'Fehler: Unmöglicher Zuckerwert.', uk: 'Помилка: Неможливий цукор.', be: 'Памылка: Немагчымы цукар.', kk: 'Қате: Мүмкін емес қант.', uz: 'Xato: Mumkin boʻlmagan shakar.'},
        'Регистрация успешна! Теперь вы можете войти.': {ru: 'Регистрация успешна! Теперь вы можете войти.', en: 'Registration successful! You can log in.', zh: '注册成功！您现在可以登录。', fr: 'Inscription réussie ! Vous pouvez vous connecter.', es: '¡Registro exitoso! Puedes iniciar sesión.', de: 'Registrierung erfolgreich! Sie können sich einloggen.', uk: 'Реєстрація успішна! Тепер ви можете увійти.', be: 'Рэгістрацыя паспяховая! Цяпер вы можаце ўвайсці.', kk: 'Тіркелу сәтті аяқталды! Енді кіре аласыз.', uz: 'Muvaffaqiyatli roʻyxatdan oʻtdingiz! Endi kirishingiz mumkin.'}
    };

    let currentLang = localStorage.getItem('lang') || 'ru';
    let currentUsername = "";

    const langSelect = document.getElementById('langSelect');
    langSelect.value = currentLang;

    function tMsg(msg) {
        if (backendMsgs[msg] && backendMsgs[msg][currentLang]) return backendMsgs[msg][currentLang];
        return msg;
    }

    function applyLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
        });
        
        const isDark = document.body.classList.contains('dark-theme');
        document.getElementById('themeToggle').textContent = i18n[currentLang][isDark ? 'theme_light' : 'theme_dark'];
        
        if (currentUsername) document.getElementById('welcomeUser').textContent = i18n[currentLang]['welcome_user'].replace('{0}', currentUsername);
        
        if (currentEditId) {
            document.getElementById('formTitle').textContent = i18n[currentLang]['edit_title'];
            document.getElementById('submitBtn').textContent = i18n[currentLang]['btn_update'];
        }

        if (sugarChart) {
            sugarChart.data.datasets[0].label = i18n[currentLang]['chart_label'];
            sugarChart.update();
        }
        
        if (allFilteredLogs.length > 0) renderTablePage();
    }

    langSelect.addEventListener('change', () => {
        currentLang = langSelect.value;
        localStorage.setItem('lang', currentLang);
        applyLanguage();
    });

    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = i18n[currentLang][isDark ? 'theme_light' : 'theme_dark'];
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const authSection = document.getElementById('auth-section'), appSection = document.getElementById('app-section');
    const loginBox = document.getElementById('loginBox'), registerBox = document.getElementById('registerBox');
    const authMessage = document.getElementById('authMessage'), welcomeUser = document.getElementById('welcomeUser');
    const form = document.getElementById('sugarForm'), historyBody = document.getElementById('historyBody');
    const messageDiv = document.getElementById('message'), avgSugarEl = document.getElementById('avgSugar'), totalLogsEl = document.getElementById('totalLogs');
    const submitBtn = document.getElementById('submitBtn'), cancelEditBtn = document.getElementById('cancelEditBtn'), formTitle = document.getElementById('formTitle');
    
    const prevPageBtn = document.getElementById('prevPageBtn'), nextPageBtn = document.getElementById('nextPageBtn'), pageIndicator = document.getElementById('pageIndicator');
    const filterStart = document.getElementById('filterStart'), filterEnd = document.getElementById('filterEnd');
    
    const foodSelect = document.getElementById('foodSelect');
    const foodCustom = document.getElementById('foodCustom');

    let currentEditId = null;
    let sugarChart = null;
    let allFilteredLogs = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentQueryString = "";

    foodSelect.addEventListener('change', () => {
        if (foodSelect.value === 'Другое') {
            foodCustom.classList.remove('hidden'); foodCustom.required = true;
        } else {
            foodCustom.classList.add('hidden'); foodCustom.required = false; foodCustom.value = '';
        }
    });

    function checkSession() {
        fetch('/api/check_session').then(r => r.json()).then(data => {
            if (data.logged_in) { 
                currentUsername = data.username; 
                showApp(); 
                
                // --- НОВАЯ ЛОГИКА ДЛЯ АДМИНА ---
                if (currentUsername === 'admin') {
                    document.getElementById('adminBtn').classList.remove('hidden');
                } else {
                    document.getElementById('adminBtn').classList.add('hidden');
                }
                
            } else { showAuth(); }
        });
    }

    function showApp() {
        authSection.classList.add('hidden'); appSection.classList.remove('hidden');
        applyLanguage();
        loadLogsAndStats();
    }

    function showAuth() {
        appSection.classList.add('hidden'); authSection.classList.remove('hidden');
        loginBox.classList.remove('hidden'); registerBox.classList.add('hidden');
        applyLanguage();
    }

    function showAuthMessage(text, color) {
        authMessage.textContent = tMsg(text); authMessage.style.color = color;
        setTimeout(() => authMessage.textContent = '', 4000);
    }

    document.getElementById('showRegister').addEventListener('click', (e) => { e.preventDefault(); loginBox.classList.add('hidden'); registerBox.classList.remove('hidden'); });
    document.getElementById('showLogin').addEventListener('click', (e) => { e.preventDefault(); registerBox.classList.add('hidden'); loginBox.classList.remove('hidden'); });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        fetch('/api/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: document.getElementById('regUsername').value, password: document.getElementById('regPassword').value }) })
        .then(r => r.json()).then(data => {
            if (data.status === 'success') { showAuthMessage(data.message, 'green'); document.getElementById('registerForm').reset(); document.getElementById('showLogin').click(); } 
            else showAuthMessage(data.message, 'red');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: document.getElementById('loginUsername').value, password: document.getElementById('loginPassword').value }) })
        .then(r => r.json()).then(data => { if (data.status === 'success') { document.getElementById('loginForm').reset(); checkSession(); } else showAuthMessage(data.message, 'red'); });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        fetch('/api/logout', { method: 'POST' }).then(() => { if (sugarChart) { sugarChart.destroy(); sugarChart = null; } historyBody.innerHTML = ''; resetFormState(); currentUsername = ""; checkSession(); });
    });

    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        const start = filterStart.value, end = filterEnd.value;
        const params = new URLSearchParams();
        if(start) params.append('start', start);
        if(end) params.append('end', end);
        currentQueryString = params.toString() ? `?${params.toString()}` : "";
        currentPage = 1; loadLogsAndStats();
    });

    document.getElementById('resetFilterBtn').addEventListener('click', () => {
        filterStart.value = ''; filterEnd.value = ''; currentQueryString = ""; currentPage = 1; loadLogsAndStats();
    });

    document.getElementById('exportFilteredBtn').addEventListener('click', () => {
        window.location.href = `/api/export${currentQueryString}`;
    });

    document.getElementById('exportPdfBtn').addEventListener('click', () => {
        window.open(`/report${currentQueryString}`, '_blank');
    });

    function getSugarColor(sugarValue) {
        const sugar = parseFloat(sugarValue);
        if (sugar < 4.0) return '#f39c12';
        if (sugar > 7.0) return '#e74c3c';
        return '#27ae60';
    }

    function loadLogsAndStats() {
        fetch(`/api/stats${currentQueryString}`).then(res => res.json()).then(data => {
            avgSugarEl.textContent = data.avg_sugar; totalLogsEl.textContent = data.total_logs;
        });

        fetch(`/api/logs${currentQueryString}`).then(res => res.json()).then(data => {
            allFilteredLogs = data;
            const chartLabels = [], chartData = [];
            [...allFilteredLogs].reverse().forEach(log => {
                chartLabels.push(log.date.split(' ')[1]);
                chartData.push(log.sugar);
            });
            initOrUpdateChart(chartLabels, chartData);
            renderTablePage();
        });
    }

    function renderTablePage() {
        historyBody.innerHTML = '';
        const totalPages = Math.ceil(allFilteredLogs.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        
        pageIndicator.textContent = i18n[currentLang]['page_text'].replace('{0}', currentPage).replace('{1}', totalPages);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageLogs = allFilteredLogs.slice(startIndex, startIndex + itemsPerPage);

        pageLogs.forEach(log => {
            const row = document.createElement('tr');
            
            const displayContext = contextMap[log.context] ? i18n[currentLang][contextMap[log.context]] : log.context;
            const displayFood = foodMap[log.food_name] ? i18n[currentLang][foodMap[log.food_name]] : log.food_name;
            
            let foodDisplay = displayFood ? `<strong>${displayFood}</strong><br>` : '';
            let amountDisplay = [];
            if(log.bread_units > 0) amountDisplay.push(`${log.bread_units} ${i18n[currentLang]['unit_xe']}`);
            if(log.portion_grams > 0) amountDisplay.push(`${log.portion_grams} ${i18n[currentLang]['unit_g']}`);
            let finalAmount = amountDisplay.length > 0 ? amountDisplay.join(' / ') : '-';

            row.innerHTML = `
                <td>${log.date}</td>
                <td style="color: ${getSugarColor(log.sugar)}; font-size: 1.1em;"><strong>${log.sugar}</strong></td>
                <td>${finalAmount}</td>
                <td>
                    ${foodDisplay}
                    ${displayContext}
                    ${log.notes ? `<br><small style="color:gray">${log.notes}</small>` : ''}
                </td>
                <td>
                    <button class="edit-btn" data-id="${log.id}" data-sugar="${log.sugar}" data-xe="${log.bread_units}" data-grams="${log.portion_grams}" data-food="${log.food_name}" data-context="${log.context}" data-notes="${log.notes}">✎</button>
                    <button class="delete-btn" data-id="${log.id}">✕</button>
                </td>
            `;
            historyBody.appendChild(row);
        });
    }

    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTablePage(); } });
    nextPageBtn.addEventListener('click', () => { if (currentPage < Math.ceil(allFilteredLogs.length / itemsPerPage)) { currentPage++; renderTablePage(); } });

    function initOrUpdateChart(labels, dataPoints) {
        const ctx = document.getElementById('sugarChart').getContext('2d');
        if (sugarChart) { sugarChart.data.labels = labels; sugarChart.data.datasets[0].data = dataPoints; sugarChart.update(); } 
        else {
            sugarChart = new Chart(ctx, {
                type: 'line',
                data: { labels: labels, datasets: [{ label: i18n[currentLang]['chart_label'], data: dataPoints, borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.2)', borderWidth: 2, tension: 0.3, fill: true, pointRadius: 3, pointBackgroundColor: '#e74c3c' }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { suggestedMin: 3.0, suggestedMax: 10.0 } } }
            });
        }
    }

    historyBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm(i18n[currentLang]['confirm_del'])) {
                fetch(`/api/delete/${id}`, { method: 'DELETE' }).then(() => { loadLogsAndStats(); if(currentEditId === id) resetFormState(); });
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            currentEditId = e.target.getAttribute('data-id');
            document.getElementById('sugar').value = e.target.getAttribute('data-sugar');
            document.getElementById('breadUnits').value = e.target.getAttribute('data-xe');
            document.getElementById('portion').value = e.target.getAttribute('data-grams');
            document.getElementById('context').value = e.target.getAttribute('data-context');
            document.getElementById('notes').value = e.target.getAttribute('data-notes');
            
            const foodData = e.target.getAttribute('data-food');
            const options = Array.from(foodSelect.options).map(opt => opt.value);
            
            if (foodData && options.includes(foodData)) {
                foodSelect.value = foodData; foodCustom.classList.add('hidden'); foodCustom.required = false;
            } else if (foodData) {
                foodSelect.value = 'Другое'; foodCustom.value = foodData; foodCustom.classList.remove('hidden'); foodCustom.required = true;
            } else {
                foodSelect.value = ''; foodCustom.classList.add('hidden'); foodCustom.required = false;
            }

            formTitle.textContent = i18n[currentLang]['edit_title']; submitBtn.textContent = i18n[currentLang]['btn_update']; cancelEditBtn.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    function resetFormState() { 
        form.reset(); 
        currentEditId = null; 
        formTitle.textContent = i18n[currentLang]['new_record']; 
        submitBtn.textContent = i18n[currentLang]['btn_save']; 
        cancelEditBtn.classList.add('hidden');
        foodCustom.classList.add('hidden');
        foodCustom.required = false;
    }
    
    cancelEditBtn.addEventListener('click', resetFormState);

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const sugar = document.getElementById('sugar').value;
        const context = document.getElementById('context').value;
        const notes = document.getElementById('notes').value;
        const bread_units = document.getElementById('breadUnits').value;
        const portion_grams = document.getElementById('portion').value;
        
        let food_name = foodSelect.value;
        if (food_name === 'Другое') food_name = foodCustom.value;

        const url = currentEditId ? `/api/edit/${currentEditId}` : '/api/add';
        const method = currentEditId ? 'PUT' : 'POST';

        fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sugar, bread_units, portion_grams, food_name, context, notes }) })
        .then(res => res.json()).then(data => {
            if(data.status === 'success') { messageDiv.textContent = tMsg(data.message); messageDiv.style.color = 'green'; resetFormState(); loadLogsAndStats(); } 
            else { messageDiv.textContent = tMsg(data.message); messageDiv.style.color = 'red'; }
            setTimeout(() => messageDiv.textContent = '', 3000); 
        });
    });

    checkSession();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(error => { console.log('SW Error:', error); });
        });
    }
});