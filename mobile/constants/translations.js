const baseCommon = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  cancel: "Cancel",
  ok: "OK",
  delete: "Delete",
  save: "Save",
  clear: "Clear",
  apply: "Apply",
};

export const TRANSLATIONS = {
  en: {
    common: {
      ...baseCommon,
    },
    home: {
      header: {
        welcomeBack: "Welcome back,",
        defaultName: "User",
      },
      stats: {
        errorGeneric: "Unable to fetch summary.",
        mainBalance: "Main Balance",
        income: "Income",
        expenses: "Expenses",
      },
      budget: {
        currentMonthTitle: "Current month budget",
        totalExpenses: "Total Expenses",
        budgetLimit: "Budget Limit",
        remainingPositive: {
          prefix: "You can spend ",
          suffix: " more this month.",
        },
        remainingNegative: "You have exceeded your budget this month.",
        emptyState: {
          message: "Set your monthly budget to see your progress here.",
          cta: "Set as previous month's budget",
        },
        alerts: {
          setPreviousSuccess: "Budget set as previous successfully",
          setPreviousError: "Failed to set budget as previous month.",
          confirmSetPrevious:
            "Are you sure you want to set the budget as previous month's budget?",
        },
      },
    },
    transactions: {
      add: {
        title: "New Transaction",
        form: {
          amountPlaceholder: "00.00",
          selectBank: "Select bank",
          selectCategory: "Select a category",
          addNoteLabel: "Add a note",
          addNotePlaceholder: "Add a note",
          selectBankPlaceholder: "Choose a bank",
        },
        validation: {
          type: "Please select a type",
          amount: "Please enter an amount",
          date: "Please select a date",
          category: "Please select a category",
          bank: "Please select a bank",
        },
        alerts: {
          createSuccess: "Transaction created successfully",
          createError: "Unable to create transaction.",
        },
        actions: {
          saving: "Saving...",
          save: "Save",
        },
      },
      common: {
        income: "Income",
        expense: "Expense",
        transaction: "Transaction",
      },
    },
    budget: {
      period: {
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly",
      },
      add: {
        title: "Create Budget",
        validation: {
          title: "Please enter a budget title",
          amount: "Please enter a valid amount",
          category: "Please select a category",
          startDate: "Please select start date",
          endDate: "Please select end date",
        },
        alerts: {
          createSuccess: "Budget created successfully!",
          createError: "Unable to create budget.",
        },
        form: {
          titleLabel: "Budget Title",
          titlePlaceholder: "Enter budget title",
          amountLabel: "Budget Amount",
          amountPlaceholder: "Enter amount",
          categoryLabel: "Category",
          periodLabel: "Budget Period",
          startDate: "Start Date",
          endDate: "End Date",
        },
        actions: {
          creating: "Creating...",
          submit: "Create Budget",
        },
      },
    },
    banks: {
      title: "Banks",
      validation: {
        bankAndIfsc: "Please select a bank and IFSC code",
      },
      alerts: {
        createSuccess: "Bank created successfully",
        createError: "Unable to create bank.",
        fetchError: "Unable to load banks.",
        deleteError: "Unable to delete bank.",
      },
      dialogs: {
        delete: {
          title: "Delete Bank",
          message: "Are you sure you want to delete this bank?",
        },
      },
      details: {
        status: {
          label: "Status",
          active: "Active",
          inactive: "Inactive",
        },
        created: "Created",
        updated: "Updated",
      },
      form: {
        selectBank: "Select Bank",
        selectBankPlaceholder: "Choose a bank",
        selectIfsc: "Select IFSC Code",
        selectIfscPlaceholder: "Choose an IFSC code",
      },
      actions: {
        saving: "Saving...",
      },
      empty: "No banks found",
      footer: "End of banks",
    },
    categories: {
      title: "Categories",
      validation: {
        nameRequired: "Category name is required",
        iconRequired: "Please select an icon",
      },
      alerts: {
        createSuccess: "Category created successfully",
        createError: "Unable to create category.",
        fetchError: "Unable to load categories.",
        updateError: "Unable to update category.",
        deleteError: "Unable to delete category.",
      },
      dialogs: {
        delete: {
          title: "Delete Category",
          message: "Are you sure you want to delete this category?",
        },
      },
      details: {
        status: {
          label: "Status",
          active: "Active",
          inactive: "Inactive",
        },
        created: "Created",
        updated: "Updated",
      },
      form: {
        categoryName: "Category Name",
        categoryNamePlaceholder: "Enter category name",
        selectIcon: "Select Icon",
        selectColor: "Select Color",
        searchIcons: "Search icons...",
      },
      actions: {
        saving: "Saving...",
        updating: "Updating...",
        addCategory: "Add Category",
        editCategory: "Edit Category",
      },
      empty: "No categories found",
      footer: "End of categories",
    },
    history: {
      alerts: {
        fetchTransactionsError: "Something went wrong",
        fetchBudgetsError: "Something went wrong",
        deleteTransactionError: "Something went wrong",
        deleteBudgetError: "Something went wrong",
      },
      transactions: {
        title: "Transactions",
        longPressInfo: "Long press a transaction to delete it.",
        empty: "No transactions found",
        footer: "End of transactions history",
      },
      budgets: {
        title: "Budgets",
        longPressInfo: "Long press a budget to delete it.",
        empty: "No budgets found",
        footer: "End of budgets history",
      },
      controls: {
        transactions: "Transactions",
        budgets: "Budgets",
      },
      filters: {
        title: "Filter by date",
        selectStartDate: "Select start date",
        selectEndDate: "Select end date",
      },
    },
    statistics: {
      title: "Statistics",
      tabs: {
        daily: "Daily",
        monthly: "Monthly",
        yearly: "Yearly",
        total: "Total",
      },
      filters: {
        day: "Day",
        month: "Month",
        year: "Year",
      },
      daily: {
        totalIncome: "Total income:",
        totalExpense: "Total expense:",
        empty: "No expenses for this day.",
      },
      monthly: {
        weekdays: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
        },
        expenseHeading: "All your expenses this month",
        totalIncome: "Total income:",
        totalExpense: "Total expense:",
        empty: "No expenses for this month.",
        budgetsHeading: "Your budgets this month",
      },
      yearly: {
        totalIncome: "This year's income:",
        totalExpense: "This year's expense:",
        monthBreakdown: "Month-wise breakdown ({year})",
        emptyMonths: "No data found for this year.",
        categoryBreakdown: "Category-wise breakdown ({year})",
        empty: "No expenses for this year.",
      },
      total: {
        overview: "Overview",
        totalIncome: "Total income (all time)",
        totalExpense: "Total expense (all time)",
        net: "Net",
        avgMonthly: "Average monthly spend",
        avgDaily: "Average daily spend",
        highlights: "Top year highlights",
        bestIncomeYear: "Best income year",
        highestExpenseYear: "Highest expense year",
        topCategories: "Top 5 categories",
        categoryShare: "{percent}% of expenses",
        mostUsedBank: "Most used bank account",
        uses: "Uses",
      },
    },
    notifications: {
      title: "Notifications ({count})",
      info: "Tap to mark as read and long press to delete.",
      deleteAll: "Delete all notifications",
      empty: "No notifications found.",
      footer: "End of notifications.",
      alerts: {
        deleteOneTitle: "Delete notification",
        deleteOneMessage: "Are you sure you want to delete this notification?",
        deleteAllTitle: "Delete all notifications",
        deleteAllMessage:
          "Are you sure you want to delete all notifications?",
      },
    },
    selectionModal: {
      title: "What would you like to add?",
      subtitle:
        "Choose between creating a new transaction or setting up a budget",
      transaction: "Transaction",
      budget: "Budget",
    },
    dangerZone: {
      title: "Danger zone",
      logout: "Logout",
      deleteAllTransactions: "Delete all transactions",
      alerts: {
        logoutTitle: "Logout",
        logoutMessage: "Are you sure you want to logout?",
        logoutError: "Failed to logout. Please try again.",
      },
    },
    notifications: {
      title: "Notifications ({count})",
      info: "Tap to mark as read and long press to delete.",
      deleteAll: "Delete all notifications",
      empty: "No notifications found.",
      footer: "End of notifications.",
      alerts: {
        deleteOneTitle: "Delete notification",
        deleteOneMessage:
          "Are you sure you want to delete this notification",
        deleteAllTitle: "Delete all notifications",
        deleteAllMessage:
          "Are you sure you want to delete all notifications?",
      },
    },
    selectionModal: {
      title: "What would you like to add?",
      subtitle:
        "Choose between creating a new transaction or setting up a budget",
      transaction: "Transaction",
      budget: "Budget",
    },
    calendar: {
      months: {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
      },
    },
    "more.title": "More",
    "more.subtitle": "Access additional preferences and helpful resources.",
    "more.section.preferences": "Preferences",
    "more.section.support": "Support",
    "more.option.settings.title": "Settings",
    "more.option.settings.description":
      "Profile details, notifications, danger zone",
    "more.option.languages.title": "Languages",
    "more.option.languages.description":
      "Choose how ExpenseMeter speaks to you",
    "more.option.themes.title": "Themes",
    "more.option.themes.description": "Switch up the look & feel",
    "more.option.categories.title": "Edit Categories",
    "more.option.categories.description": "Manage your expense categories",
    "more.option.support.title": "Help & Support",
    "more.option.support.description":
      "FAQs, contact, and issue reporting",

    "languages.title": "Languages",
    "languages.description":
      "Set your preferred language for menus and communication.",

    "themes.title": "Themes",
    "themes.section.current": "Current Theme",
    "themes.section.current.subtitle":
      "Tap a swatch below to instantly update your theme.",

    "support.title": "Support",
    "support.description":
      "Need a hand? Reach out or explore resources tailored to help you get the most out of ExpenseMeter.",
    "support.option.email.title": "Email Support",
    "support.option.email.description": "gajendran2908@gmail.com",
    "support.option.docs.title": "Documentation",
    "support.option.docs.description": "Guides, FAQs, and release notes",
    "support.option.phone.title": "Call our suppport team",
    "support.option.phone.description": "+919944919805",

    "settings.title": "Settings",
    "preferences.themeLabel": "Theme",
  },
  hi: {
    common: {
      success: "सफलता",
      error: "त्रुटि",
      warning: "चेतावनी",
      cancel: "रद्द करें",
      ok: "ठीक है",
      delete: "हटाएं",
      save: "सहेजें",
      clear: "साफ करें",
      apply: "लागू करें",
    },
    home: {
      header: {
        welcomeBack: "वापसी पर स्वागत है,",
        defaultName: "उपयोगकर्ता",
      },
      stats: {
        errorGeneric: "सारांश प्राप्त करने में असमर्थ।",
        mainBalance: "मुख्य शेष",
        income: "आय",
        expenses: "खर्चे",
      },
      budget: {
        currentMonthTitle: "वर्तमान महीने का बजट",
        totalExpenses: "कुल खर्च",
        budgetLimit: "बजट सीमा",
        remainingPositive: {
          prefix: "आप इस महीने ",
          suffix: " और खर्च कर सकते हैं।",
        },
        remainingNegative: "आपने इस महीने का बजट पार कर लिया है।",
        emptyState: {
          message: "अपनी प्रगति देखने के लिए अपना मासिक बजट सेट करें।",
          cta: "पिछले महीने का बजट सेट करें",
        },
        alerts: {
          setPreviousSuccess: "बजट सफलतापूर्वक पिछले जैसा सेट किया गया",
          setPreviousError:
            "पिछले महीने का बजट सेट करने में असफल।",
          confirmSetPrevious:
            "क्या आप निश्चित हैं कि आप बजट को पिछले महीने जैसा सेट करना चाहते हैं?",
        },
      },
    },
    transactions: {
      add: {
        title: "नई लेन-देन",
        form: {
          amountPlaceholder: "00.00",
          selectBank: "बैंक चुनें",
          selectCategory: "श्रेणी चुनें",
          addNoteLabel: "नोट जोड़ें",
          addNotePlaceholder: "नोट जोड़ें",
          selectBankPlaceholder: "एक बैंक चुनें",
        },
        validation: {
          type: "कृपया प्रकार चुनें",
          amount: "कृपया राशि दर्ज करें",
          date: "कृपया दिनांक चुनें",
          category: "कृपया श्रेणी चुनें",
          bank: "कृपया बैंक चुनें",
        },
        alerts: {
          createSuccess: "लेन-देन सफलतापूर्वक बनाई गई",
          createError: "लेन-देन बनाने में असमर्थ।",
        },
        actions: {
          saving: "सहेजा जा रहा है...",
          save: "सहेजें",
        },
      },
      common: {
        income: "आय",
        expense: "खर्च",
        transaction: "लेन-देन",
      },
    },
    budget: {
      period: {
        weekly: "साप्ताहिक",
        monthly: "मासिक",
        yearly: "वार्षिक",
      },
      add: {
        title: "बजट बनाएं",
        validation: {
          title: "कृपया बजट शीर्षक दर्ज करें",
          amount: "कृपया मान्य राशि दर्ज करें",
          category: "कृपया श्रेणी चुनें",
          startDate: "कृपया प्रारंभ दिनांक चुनें",
          endDate: "कृपया समाप्ति दिनांक चुनें",
        },
        alerts: {
          createSuccess: "बजट सफलतापूर्वक बनाया गया!",
          createError: "बजट बनाने में असमर्थ।",
        },
        form: {
          titleLabel: "बजट शीर्षक",
          titlePlaceholder: "बजट शीर्षक दर्ज करें",
          amountLabel: "बजट राशि",
          amountPlaceholder: "राशि दर्ज करें",
          categoryLabel: "श्रेणी",
          periodLabel: "बजट अवधि",
          startDate: "प्रारंभ दिनांक",
          endDate: "समाप्ति दिनांक",
        },
        actions: {
          creating: "बनाया जा रहा है...",
          submit: "बजट बनाएं",
        },
      },
    },
    banks: {
      title: "बैंक",
      validation: {
        bankAndIfsc: "कृपया बैंक और IFSC कोड चुनें",
      },
      alerts: {
        createSuccess: "बैंक सफलतापूर्वक बनाया गया",
        createError: "बैंक बनाने में असमर्थ।",
        fetchError: "बैंक लोड करने में असमर्थ।",
        deleteError: "बैंक हटाने में असमर्थ।",
      },
      dialogs: {
        delete: {
          title: "बैंक हटाएं",
          message: "क्या आप वाकई इस बैंक को हटाना चाहते हैं?",
        },
      },
      details: {
        status: {
          label: "स्थिति",
          active: "सक्रिय",
          inactive: "निष्क्रिय",
        },
        created: "निर्मित",
        updated: "अद्यतन",
      },
      form: {
        selectBank: "बैंक चुनें",
        selectBankPlaceholder: "एक बैंक चुनें",
        selectIfsc: "IFSC कोड चुनें",
        selectIfscPlaceholder: "एक IFSC कोड चुनें",
      },
      actions: {
        saving: "सहेजा जा रहा है...",
      },
      empty: "कोई बैंक नहीं मिला",
      footer: "बैंकों का अंत",
    },
    history: {
      alerts: {
        fetchTransactionsError: "कुछ गलत हो गया",
        fetchBudgetsError: "कुछ गलत हो गया",
        deleteTransactionError: "कुछ गलत हो गया",
        deleteBudgetError: "कुछ गलत हो गया",
      },
      transactions: {
        title: "लेन-देन",
        longPressInfo: "हटाने के लिए किसी लेन-देन को लंबे समय तक दबाएं।",
        empty: "कोई लेन-देन नहीं मिली",
        footer: "लेन-देन इतिहास का अंत",
      },
      budgets: {
        title: "बजट",
        longPressInfo: "हटाने के लिए किसी बजट को लंबे समय तक दबाएं।",
        empty: "कोई बजट नहीं मिला",
        footer: "बजट इतिहास का अंत",
      },
      controls: {
        transactions: "लेन-देन",
        budgets: "बजट",
      },
      filters: {
        title: "तिथि के अनुसार फ़िल्टर करें",
        selectStartDate: "प्रारंभ दिनांक चुनें",
        selectEndDate: "समाप्ति दिनांक चुनें",
      },
    },
    statistics: {
      title: "आंकड़े",
      tabs: {
        daily: "दैनिक",
        monthly: "मासिक",
        yearly: "वार्षिक",
        total: "कुल",
      },
      filters: {
        day: "दिन",
        month: "माह",
        year: "वर्ष",
      },
      daily: {
        totalIncome: "कुल आय:",
        totalExpense: "कुल खर्च:",
        empty: "इस दिन के लिए कोई खर्च नहीं है।",
      },
      monthly: {
        weekdays: {
          sun: "रवि",
          mon: "सोम",
          tue: "मंगल",
          wed: "बुध",
          thu: "गुरु",
          fri: "शुक्र",
          sat: "शनि",
        },
        expenseHeading: "इस महीने के आपके सभी खर्च",
        totalIncome: "कुल आय:",
        totalExpense: "कुल खर्च:",
        empty: "इस महीने के लिए कोई खर्च नहीं है।",
        budgetsHeading: "इस महीने के आपके बजट",
      },
      yearly: {
        totalIncome: "इस वर्ष की आय:",
        totalExpense: "इस वर्ष का खर्च:",
        monthBreakdown: "महीनेवार विवरण ({year})",
        emptyMonths: "इस वर्ष के लिए कोई डेटा नहीं मिला।",
        categoryBreakdown: "श्रेणीवार विवरण ({year})",
        empty: "इस वर्ष के लिए कोई खर्च नहीं है।",
      },
      total: {
        overview: "सारांश",
        totalIncome: "कुल आय (संपूर्ण समय)",
        totalExpense: "कुल खर्च (संपूर्ण समय)",
        net: "शुद्ध",
        avgMonthly: "औसत मासिक खर्च",
        avgDaily: "औसत दैनिक खर्च",
        highlights: "सर्वश्रेष्ठ वर्ष की मुख्य बातें",
        bestIncomeYear: "सबसे अधिक आय वाला वर्ष",
        highestExpenseYear: "सबसे अधिक खर्च वाला वर्ष",
        topCategories: "शीर्ष 5 श्रेणियाँ",
        categoryShare: "{percent}% खर्च",
        mostUsedBank: "सबसे अधिक उपयोग किया गया बैंक खाता",
        uses: "उपयोग",
      },
    },
    calendar: {
      months: {
        0: "जन",
        1: "फ़र",
        2: "मार्च",
        3: "अप्रै",
        4: "मई",
        5: "जून",
        6: "जुल",
        7: "अग",
        8: "सित",
        9: "अक्टू",
        10: "नव",
        11: "दिस",
      },
    },
    "more.title": "अधिक",
    "more.subtitle": "अतिरिक्त प्राथमिकताओं और सहायक संसाधनों तक पहुँचें।",
    "more.section.preferences": "प्राथमिकताएँ",
    "more.section.support": "सहायता",
    "more.option.settings.title": "सेटिंग्स",
    "more.option.settings.description":
      "प्रोफ़ाइल विवरण, सूचनाएँ, और ख़तरा क्षेत्र",
    "more.option.languages.title": "भाषाएँ",
    "more.option.languages.description":
      "ExpenseMeter आपसे किस भाषा में बोले, चुनें",
    "more.option.themes.title": "थीम",
    "more.option.themes.description": "रूप और अनुभव बदलें",
    "more.option.support.title": "मदद और सहायता",
    "more.option.support.description":
      "प्रश्नोत्तर, संपर्क, और समस्या रिपोर्टिंग",

    "languages.title": "भाषाएँ",
    "languages.description":
      "मेनू और संवाद के लिए अपनी पसंदीदा भाषा चुनें।",

    "themes.title": "थीम",
    "themes.section.current": "वर्तमान थीम",
    "themes.section.current.subtitle":
      "नीचे किसी स्वैच पर टैप करके तुरंत थीम बदलें।",

    "support.title": "सहायता",
    "support.description":
      "मदद चाहिए? ExpenseMeter से अधिक लाभ पाने के लिए संसाधनों का उपयोग करें या हमसे संपर्क करें।",
    "support.option.email.title": "ईमेल सहायता",
    "support.option.email.description": "support@expensemeter.app",
    "support.option.docs.title": "दस्तावेज़",
    "support.option.docs.description": "गाइड, प्रश्नोत्तर, और रिलीज नोट्स",

    "settings.title": "सेटिंग्स",
    "preferences.themeLabel": "थीम",
  },
  es: {
    common: {
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      cancel: "Cancelar",
      ok: "Aceptar",
      delete: "Eliminar",
      save: "Guardar",
      clear: "Limpiar",
      apply: "Aplicar",
    },
    home: {
      header: {
        welcomeBack: "Bienvenido de nuevo,",
        defaultName: "Usuario",
      },
      stats: {
        errorGeneric: "No se pudo obtener el resumen.",
        mainBalance: "Saldo principal",
        income: "Ingresos",
        expenses: "Gastos",
      },
      budget: {
        currentMonthTitle: "Presupuesto del mes actual",
        totalExpenses: "Gastos totales",
        budgetLimit: "Límite del presupuesto",
        remainingPositive: {
          prefix: "Puedes gastar ",
          suffix: " más este mes.",
        },
        remainingNegative: "Has superado tu presupuesto este mes.",
        emptyState: {
          message: "Configura tu presupuesto mensual para ver tu progreso aquí.",
          cta: "Usar el presupuesto del mes anterior",
        },
        alerts: {
          setPreviousSuccess: "Presupuesto establecido como el anterior correctamente",
          setPreviousError:
            "No se pudo establecer el presupuesto como el del mes pasado.",
          confirmSetPrevious:
            "¿Seguro que quieres usar el presupuesto del mes anterior?",
        },
      },
    },
    transactions: {
      add: {
        title: "Nueva transacción",
        form: {
          amountPlaceholder: "00.00",
          selectBank: "Selecciona un banco",
          selectCategory: "Selecciona una categoría",
          addNoteLabel: "Agregar una nota",
          addNotePlaceholder: "Agregar una nota",
          selectBankPlaceholder: "Elige un banco",
        },
        validation: {
          type: "Selecciona un tipo",
          amount: "Introduce un importe",
          date: "Selecciona una fecha",
          category: "Selecciona una categoría",
          bank: "Selecciona un banco",
        },
        alerts: {
          createSuccess: "Transacción creada correctamente",
          createError: "No se pudo crear la transacción.",
        },
        actions: {
          saving: "Guardando...",
          save: "Guardar",
        },
      },
      common: {
        income: "Ingreso",
        expense: "Gasto",
        transaction: "Transacción",
      },
    },
    budget: {
      period: {
        weekly: "Semanal",
        monthly: "Mensual",
        yearly: "Anual",
      },
      add: {
        title: "Crear presupuesto",
        validation: {
          title: "Introduce un título para el presupuesto",
          amount: "Introduce un importe válido",
          category: "Selecciona una categoría",
          startDate: "Selecciona la fecha de inicio",
          endDate: "Selecciona la fecha de fin",
        },
        alerts: {
          createSuccess: "¡Presupuesto creado correctamente!",
          createError: "No se pudo crear el presupuesto.",
        },
        form: {
          titleLabel: "Título del presupuesto",
          titlePlaceholder: "Introduce el título del presupuesto",
          amountLabel: "Importe del presupuesto",
          amountPlaceholder: "Introduce un importe",
          categoryLabel: "Categoría",
          periodLabel: "Periodo del presupuesto",
          startDate: "Fecha de inicio",
          endDate: "Fecha de fin",
        },
        actions: {
          creating: "Creando...",
          submit: "Crear presupuesto",
        },
      },
    },
    banks: {
      title: "Bancos",
      validation: {
        bankAndIfsc: "Selecciona un banco y un código IFSC",
      },
      alerts: {
        createSuccess: "Banco creado correctamente",
        createError: "No se pudo crear el banco.",
        fetchError: "No se pudieron cargar los bancos.",
        deleteError: "No se pudo eliminar el banco.",
      },
      dialogs: {
        delete: {
          title: "Eliminar banco",
          message: "¿Seguro que quieres eliminar este banco?",
        },
      },
      details: {
        status: {
          label: "Estado",
          active: "Activo",
          inactive: "Inactivo",
        },
        created: "Creado",
        updated: "Actualizado",
      },
      form: {
        selectBank: "Selecciona un banco",
        selectBankPlaceholder: "Elige un banco",
        selectIfsc: "Selecciona un código IFSC",
        selectIfscPlaceholder: "Elige un código IFSC",
      },
      actions: {
        saving: "Guardando...",
      },
      empty: "No se encontraron bancos",
      footer: "Fin de los bancos",
    },
    history: {
      alerts: {
        fetchTransactionsError: "Algo salió mal",
        fetchBudgetsError: "Algo salió mal",
        deleteTransactionError: "Algo salió mal",
        deleteBudgetError: "Algo salió mal",
      },
      transactions: {
        title: "Transacciones",
        longPressInfo:
          "Mantén presionado una transacción para eliminarla.",
        empty: "No se encontraron transacciones",
        footer: "Fin del historial de transacciones",
      },
      budgets: {
        title: "Presupuestos",
        longPressInfo: "Mantén presionado un presupuesto para eliminarlo.",
        empty: "No se encontraron presupuestos",
        footer: "Fin del historial de presupuestos",
      },
      controls: {
        transactions: "Transacciones",
        budgets: "Presupuestos",
      },
      filters: {
        title: "Filtrar por fecha",
        selectStartDate: "Selecciona la fecha de inicio",
        selectEndDate: "Selecciona la fecha de fin",
      },
    },
    statistics: {
      title: "Estadísticas",
      tabs: {
        daily: "Diario",
        monthly: "Mensual",
        yearly: "Anual",
        total: "Total",
      },
      filters: {
        day: "Día",
        month: "Mes",
        year: "Año",
      },
      daily: {
        totalIncome: "Ingresos totales:",
        totalExpense: "Gastos totales:",
        empty: "No hay gastos para este día.",
      },
      monthly: {
        weekdays: {
          sun: "Dom",
          mon: "Lun",
          tue: "Mar",
          wed: "Mié",
          thu: "Jue",
          fri: "Vie",
          sat: "Sáb",
        },
        expenseHeading: "Todos tus gastos de este mes",
        totalIncome: "Ingresos totales:",
        totalExpense: "Gastos totales:",
        empty: "No hay gastos este mes.",
        budgetsHeading: "Tus presupuestos de este mes",
      },
      yearly: {
        totalIncome: "Ingresos de este año:",
        totalExpense: "Gastos de este año:",
        monthBreakdown: "Resumen por mes ({year})",
        emptyMonths: "No se encontraron datos para este año.",
        categoryBreakdown: "Desglose por categoría ({year})",
        empty: "No hay gastos para este año.",
      },
      total: {
        overview: "Resumen",
        totalIncome: "Ingreso total (todos los tiempos)",
        totalExpense: "Gasto total (todos los tiempos)",
        net: "Neto",
        avgMonthly: "Gasto mensual promedio",
        avgDaily: "Gasto diario promedio",
        highlights: "Aspectos destacados del año",
        bestIncomeYear: "Mejor año de ingresos",
        highestExpenseYear: "Año con más gastos",
        topCategories: "5 categorías principales",
        categoryShare: "{percent}% de los gastos",
        mostUsedBank: "Cuenta bancaria más usada",
        uses: "Usos",
      },
    },
    notifications: {
      title: "Notificaciones ({count})",
      info: "Toca para marcar como leída y mantén presionado para eliminarla.",
      deleteAll: "Eliminar todas las notificaciones",
      empty: "No se encontraron notificaciones.",
      footer: "Fin de las notificaciones.",
      alerts: {
        deleteOneTitle: "Eliminar notificación",
        deleteOneMessage:
          "¿Seguro que quieres eliminar esta notificación?",
        deleteAllTitle: "Eliminar todas las notificaciones",
        deleteAllMessage:
          "¿Seguro que quieres eliminar todas las notificaciones?",
      },
    },
    selectionModal: {
      title: "¿Qué te gustaría agregar?",
      subtitle:
        "Elige entre crear una nueva transacción o configurar un presupuesto",
      transaction: "Transacción",
      budget: "Presupuesto",
    },
    dangerZone: {
      title: "Zona de riesgo",
      logout: "Cerrar sesión",
      deleteAllTransactions: "Eliminar todas las transacciones",
      alerts: {
        logoutTitle: "Cerrar sesión",
        logoutMessage: "¿Seguro que quieres cerrar sesión?",
        logoutError: "Error al cerrar sesión. Inténtalo nuevamente.",
      },
    },
    calendar: {
      months: {
        0: "Ene",
        1: "Feb",
        2: "Mar",
        3: "Abr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Ago",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dic",
      },
    },
    "more.title": "Más",
    "more.subtitle":
      "Accede a preferencias adicionales y recursos útiles.",
    "more.section.preferences": "Preferencias",
    "more.section.support": "Ayuda",
    "more.option.settings.title": "Configuración",
    "more.option.settings.description":
      "Perfil, notificaciones y zona de riesgo",
    "more.option.languages.title": "Idiomas",
    "more.option.languages.description":
      "Elige cómo te habla ExpenseMeter",
    "more.option.themes.title": "Temas",
    "more.option.themes.description": "Cambia el aspecto y la experiencia",
    "more.option.support.title": "Ayuda y soporte",
    "more.option.support.description":
      "Preguntas frecuentes, contacto y reporte de problemas",

    "languages.title": "Idiomas",
    "languages.description":
      "Configura tu idioma preferido para menús y comunicación.",

    "themes.title": "Temas",
    "themes.section.current": "Tema actual",
    "themes.section.current.subtitle":
      "Toca un color abajo para cambiar tu tema al instante.",

    "support.title": "Soporte",
    "support.description":
      "¿Necesitas ayuda? Contáctanos o explora recursos para aprovechar ExpenseMeter al máximo.",
    "support.option.email.title": "Soporte por correo",
    "support.option.email.description": "support@expensemeter.app",
    "support.option.docs.title": "Documentación",
    "support.option.docs.description":
      "Guías, preguntas frecuentes y notas de lanzamiento",

    "settings.title": "Configuración",
    "preferences.themeLabel": "Tema",
  },
  fr: {
    common: {
      success: "Succès",
      error: "Erreur",
      warning: "Avertissement",
      cancel: "Annuler",
      ok: "OK",
      delete: "Supprimer",
      save: "Enregistrer",
      clear: "Effacer",
      apply: "Appliquer",
    },
    home: {
      header: {
        welcomeBack: "Bon retour,",
        defaultName: "Utilisateur",
      },
      stats: {
        errorGeneric: "Impossible de récupérer le résumé.",
        mainBalance: "Solde principal",
        income: "Revenus",
        expenses: "Dépenses",
      },
      budget: {
        currentMonthTitle: "Budget du mois en cours",
        totalExpenses: "Dépenses totales",
        budgetLimit: "Limite du budget",
        remainingPositive: {
          prefix: "Vous pouvez dépenser ",
          suffix: " de plus ce mois-ci.",
        },
        remainingNegative: "Vous avez dépassé votre budget ce mois-ci.",
        emptyState: {
          message:
            "Configurez votre budget mensuel pour voir vos progrès ici.",
          cta: "Utiliser le budget du mois précédent",
        },
        alerts: {
          setPreviousSuccess:
            "Budget défini comme le mois précédent avec succès",
          setPreviousError:
            "Impossible d'utiliser le budget du mois précédent.",
          confirmSetPrevious:
            "Voulez-vous vraiment utiliser le budget du mois précédent ?",
        },
      },
    },
    transactions: {
      add: {
        title: "Nouvelle transaction",
        form: {
          amountPlaceholder: "00.00",
          selectBank: "Sélectionnez une banque",
          selectCategory: "Sélectionnez une catégorie",
          addNoteLabel: "Ajouter une note",
          addNotePlaceholder: "Ajouter une note",
          selectBankPlaceholder: "Choisissez une banque",
        },
        validation: {
          type: "Sélectionnez un type",
          amount: "Saisissez un montant",
          date: "Sélectionnez une date",
          category: "Sélectionnez une catégorie",
          bank: "Sélectionnez une banque",
        },
        alerts: {
          createSuccess: "Transaction créée avec succès",
          createError: "Impossible de créer la transaction.",
        },
        actions: {
          saving: "Enregistrement...",
          save: "Enregistrer",
        },
      },
      common: {
        income: "Revenu",
        expense: "Dépense",
        transaction: "Transaction",
      },
    },
    budget: {
      period: {
        weekly: "Hebdomadaire",
        monthly: "Mensuel",
        yearly: "Annuel",
      },
      add: {
        title: "Créer un budget",
        validation: {
          title: "Saisissez un titre de budget",
          amount: "Saisissez un montant valide",
          category: "Sélectionnez une catégorie",
          startDate: "Sélectionnez la date de début",
          endDate: "Sélectionnez la date de fin",
        },
        alerts: {
          createSuccess: "Budget créé avec succès !",
          createError: "Impossible de créer le budget.",
        },
        form: {
          titleLabel: "Titre du budget",
          titlePlaceholder: "Saisissez le titre du budget",
          amountLabel: "Montant du budget",
          amountPlaceholder: "Saisissez un montant",
          categoryLabel: "Catégorie",
          periodLabel: "Période du budget",
          startDate: "Date de début",
          endDate: "Date de fin",
        },
        actions: {
          creating: "Création...",
          submit: "Créer un budget",
        },
      },
    },
    banks: {
      title: "Banques",
      validation: {
        bankAndIfsc: "Sélectionnez une banque et un code IFSC",
      },
      alerts: {
        createSuccess: "Banque créée avec succès",
        createError: "Impossible de créer la banque.",
        fetchError: "Impossible de charger les banques.",
        deleteError: "Impossible de supprimer la banque.",
      },
      dialogs: {
        delete: {
          title: "Supprimer la banque",
          message: "Voulez-vous vraiment supprimer cette banque ?",
        },
      },
      details: {
        status: {
          label: "Statut",
          active: "Actif",
          inactive: "Inactif",
        },
        created: "Créée",
        updated: "Mise à jour",
      },
      form: {
        selectBank: "Sélectionnez une banque",
        selectBankPlaceholder: "Choisissez une banque",
        selectIfsc: "Sélectionnez un code IFSC",
        selectIfscPlaceholder: "Choisissez un code IFSC",
      },
      actions: {
        saving: "Enregistrement...",
      },
      empty: "Aucune banque trouvée",
      footer: "Fin des banques",
    },
    history: {
      alerts: {
        fetchTransactionsError: "Une erreur est survenue",
        fetchBudgetsError: "Une erreur est survenue",
        deleteTransactionError: "Une erreur est survenue",
        deleteBudgetError: "Une erreur est survenue",
      },
      transactions: {
        title: "Transactions",
        longPressInfo:
          "Maintenez une transaction pour la supprimer.",
        empty: "Aucune transaction trouvée",
        footer: "Fin de l'historique des transactions",
      },
      budgets: {
        title: "Budgets",
        longPressInfo:
          "Maintenez un budget pour le supprimer.",
        empty: "Aucun budget trouvé",
        footer: "Fin de l'historique des budgets",
      },
      controls: {
        transactions: "Transactions",
        budgets: "Budgets",
      },
      filters: {
        title: "Filtrer par date",
        selectStartDate: "Sélectionnez la date de début",
        selectEndDate: "Sélectionnez la date de fin",
      },
    },
    statistics: {
      title: "Statistiques",
      tabs: {
        daily: "Quotidien",
        monthly: "Mensuel",
        yearly: "Annuel",
        total: "Total",
      },
      filters: {
        day: "Jour",
        month: "Mois",
        year: "Année",
      },
      daily: {
        totalIncome: "Revenus totaux :",
        totalExpense: "Dépenses totales :",
        empty: "Aucune dépense pour cette journée.",
      },
      monthly: {
        weekdays: {
          sun: "Dim",
          mon: "Lun",
          tue: "Mar",
          wed: "Mer",
          thu: "Jeu",
          fri: "Ven",
          sat: "Sam",
        },
        expenseHeading: "Toutes vos dépenses de ce mois",
        totalIncome: "Revenus totaux :",
        totalExpense: "Dépenses totales :",
        empty: "Aucune dépense pour ce mois.",
        budgetsHeading: "Vos budgets pour ce mois",
      },
      yearly: {
        totalIncome: "Revenus de cette année :",
        totalExpense: "Dépenses de cette année :",
        monthBreakdown: "Répartition mensuelle ({year})",
        emptyMonths: "Aucune donnée trouvée pour cette année.",
        categoryBreakdown: "Répartition par catégorie ({year})",
        empty: "Aucune dépense pour cette année.",
      },
      total: {
        overview: "Aperçu",
        totalIncome: "Revenu total (toute période)",
        totalExpense: "Dépense totale (toute période)",
        net: "Net",
        avgMonthly: "Dépense mensuelle moyenne",
        avgDaily: "Dépense quotidienne moyenne",
        highlights: "Moments forts de l'année",
        bestIncomeYear: "Meilleure année de revenus",
        highestExpenseYear: "Année la plus coûteuse",
        topCategories: "5 catégories principales",
        categoryShare: "{percent}% des dépenses",
        mostUsedBank: "Compte bancaire le plus utilisé",
        uses: "Utilisations",
      },
    },
    notifications: {
      title: "Notifications ({count})",
      info:
        "Touchez pour marquer comme lue et maintenez pour supprimer.",
      deleteAll: "Supprimer toutes les notifications",
      empty: "Aucune notification trouvée.",
      footer: "Fin des notifications.",
      alerts: {
        deleteOneTitle: "Supprimer la notification",
        deleteOneMessage:
          "Voulez-vous vraiment supprimer cette notification ?",
        deleteAllTitle: "Supprimer toutes les notifications",
        deleteAllMessage:
          "Voulez-vous vraiment supprimer toutes les notifications ?",
      },
    },
    selectionModal: {
      title: "Que souhaitez-vous ajouter ?",
      subtitle:
        "Choisissez entre créer une nouvelle transaction ou définir un budget",
      transaction: "Transaction",
      budget: "Budget",
    },
    dangerZone: {
      title: "Zone dangereuse",
      logout: "Se déconnecter",
      deleteAllTransactions: "Supprimer toutes les transactions",
      alerts: {
        logoutTitle: "Déconnexion",
        logoutMessage:
          "Voulez-vous vraiment vous déconnecter ?",
        logoutError:
          "Échec de la déconnexion. Veuillez réessayer.",
      },
    },
    calendar: {
      months: {
        0: "Janv",
        1: "Févr",
        2: "Mars",
        3: "Avr",
        4: "Mai",
        5: "Juin",
        6: "Juil",
        7: "Août",
        8: "Sept",
        9: "Oct",
        10: "Nov",
        11: "Déc",
      },
    },
    "more.title": "Plus",
    "more.subtitle":
      "Accédez à des préférences supplémentaires et à des ressources utiles.",
    "more.section.preferences": "Préférences",
    "more.section.support": "Assistance",
    "more.option.settings.title": "Paramètres",
    "more.option.settings.description":
      "Profil, notifications et zone de danger",
    "more.option.languages.title": "Langues",
    "more.option.languages.description":
      "Choisissez comment ExpenseMeter vous parle",
    "more.option.themes.title": "Thèmes",
    "more.option.themes.description": "Changez l'apparence et l'ambiance",
    "more.option.support.title": "Aide et support",
    "more.option.support.description":
      "FAQ, contact et signalement de problèmes",

    "languages.title": "Langues",
    "languages.description":
      "Définissez votre langue préférée pour les menus et la communication.",

    "themes.title": "Thèmes",
    "themes.section.current": "Thème actuel",
    "themes.section.current.subtitle":
      "Touchez un échantillon ci-dessous pour mettre à jour votre thème instantanément.",

    "support.title": "Support",
    "support.description":
      "Besoin d'aide ? Contactez-nous ou explorez des ressources pour tirer le meilleur parti d'ExpenseMeter.",
    "support.option.email.title": "Support e-mail",
    "support.option.email.description": "support@expensemeter.app",
    "support.option.docs.title": "Documentation",
    "support.option.docs.description":
      "Guides, FAQ et notes de version",

    "settings.title": "Paramètres",
    "preferences.themeLabel": "Thème",
  },
};

export default TRANSLATIONS;

