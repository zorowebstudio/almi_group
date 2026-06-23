export type Locale = "bg" | "en";

export const translations = {
  bg: {
    meta: {
      title: "Алми Груп ООД | Компютърна поддръжка и IT услуги в София",
      description: "Вашият надежден IT партньор за офиса и дома. Професионална компютърна поддръжка, софтуерна помощ, мрежи и дистанционна техническа помощ за фирми и граждани в София.",
    },
    nav: {
      home: "Начало",
      services: "Услуги",
      forBusinesses: "За фирми",
      diagnostics: "Диагностика",
      helpCenter: "Помощен център",
      aboutUs: "За нас",
      contacts: "Контакти",
      login: "Вход",
      register: "Регистрация",
      logout: "Изход",
      portal: "Портал",
      requestHelp: "Заяви IT помощ",
      checkTicket: "Провери заявка",
      booking: "Резервация",
      phone: "088 800 2455",
    },
    services: {
      title: "Нашите IT услуги",
      subtitle: "Професионални технологични решения, адаптирани за Вашите нужди",
      suitableFor: "Подходящо за:",
      business: "Фирми / Офиси",
      private: "Частни клиенти",
      ctaDetails: "Научи повече",
      ctaOrder: "Заяви помощ",
      commonProblems: "Чести проблеми, които решаваме:",
      howItWorks: "Как протича процесът?",
      possibleActivities: "Възможните дейности могат да включват:",
      items: {
        "it-poddrazhka-za-firmi": {
          title: "IT поддръжка за фирми",
          desc: "Абонаментна и еднократна техническа поддръжка за фирмени компютри, сървъри, периферия и мрежи в София.",
          details: "Осигурява непрекъснатост на бизнес процесите, сигурност на данните и бърза техническа реакция при проблеми.",
        },
        "remont-na-kompyutri": {
          title: "Ремонт на компютри и лаптопи",
          desc: "Диагностика, почистване, хардуерни ремонти и ъпгрейд на настолни компютри и преносими устройства.",
          details: "Подмяна на дефектирали компоненти (дискове, памети, захранвания), оптимизиране на охлаждане и термопаста.",
        },
        "mrezhi-i-internet": {
          title: "Мрежи и интернет решения",
          desc: "Проектиране, изграждане, конфигуриране и защита на офис и домашни жични и безжични (Wi-Fi) мрежи.",
          details: "Настройка на рутери, суичове, премахване на зони без обхват, оптимизиране на скоростта и мрежова сигурност.",
        },
        "softuerna-pomosht": {
          title: "Софтуерна помощ и настройки",
          desc: "Инсталиране на операционни системи, офис пакети, премахване на вируси и конфигуриране на софтуер.",
          details: "Оптимизация на бавни операционни системи, разрешаване на конфликти между програми и драйвери.",
        },
        "distancionna-pomosht": {
          title: "Дистанционна поддръжка",
          desc: "Бърза онлайн техническа помощ през интернет за софтуерни настройки, пощи и отстраняване на грешки.",
          details: "Спестява време за посещение. Подходяща при работеща интернет връзка и нужда от спешни настройки.",
        },
        "arhivirane-i-zashtita": {
          title: "Архивиране и защита на данни",
          desc: "Настройка на автоматични архиви (cloud/локално) и базова защита срещу вируси и криптовируси.",
          details: "Конфигуриране на надеждни резервни копия на Вашите счетоводни и лични файлове с цел избягване на загуби.",
        }
      }
    },
    problemSelector: {
      title: "С какъв проблем можем да помогнем?",
      subtitle: "Изберете Вашата ситуация и получете бърза препоръка за следващи стъпки",
      ctaDiag: "Започни диагностика",
      ctaRequest: "Изпрати заявка",
      ctaCall: "Обади се сега",
      options: {
        pc_no_power: "Компютърът не се включва",
        laptop_slow: "Лаптопът е много бавен",
        internet_down: "Интернетът не работи",
        software_error: "Имам софтуерна грешка",
        printer_broken: "Принтерът не работи",
        new_device: "Искам настройка на ново устройство",
        business_network: "Имам проблем с фирмената мрежа",
        corporate_support: "Търся постоянна IT поддръжка",
        other: "Друг проблем"
      },
      responses: {
        pc_no_power: "Проверете захранващия кабел и разклонителя. Ако няма признаци на живот (светлини/вентилатори), проблемът вероятно е хардуерен (захранващ блок или дънна платка). Препоръчваме ремонт на компютри.",
        laptop_slow: "Това може да се дължи на прегряване, остарял твърд диск (HDD) или софтуерно претоварване. Препоръчваме почистване, софтуерна оптимизация или инсталиране на бърз SSD диск.",
        internet_down: "Рестартирайте рутера си за 30 секунди. Проверете дали кабелът е правилно поставен. Ако проблемът продължава, може да е повреда в рутера или при доставчика.",
        software_error: "При грешки в Windows, Outlook или офис програми, нашите техници могат да Ви помогнат бързо чрез дистанционна поддръжка.",
        printer_broken: "Уверете се, че принтерът е включен, има хартия и тонер и е свързан към компютъра/мрежата. Често проблемът е в забила опашка от задачи (print queue) или драйвери.",
        new_device: "Конфигурираме правилно нови компютри, принтери, мрежови устройства и трансферираме данните от стария Ви компютър безопасно.",
        business_network: "Фирмените мрежи изискват професионален преглед на рутери, суичове и кабелни връзки, за да се възстанови сигурността и достъпът.",
        corporate_support: "Свържете се с нас за анализ на Вашите компютри и изготвяне на индивидуална абонаментна оферта, съобразена с бизнеса Ви.",
        other: "Опишете проблема в нашата бърза форма и наш техник ще прегледа случая за подходящо решение."
      }
    },
    calculator: {
      title: "Калкулатор за препоръчителен фирмен план",
      subtitle: "Попълнете параметрите на Вашата офис инфраструктура за ориентировъчна конфигурация",
      employees: "Брой служители",
      computers: "Брой настолни компютри",
      laptops: "Брой лаптопи",
      offices: "Брой офиси/локации",
      remoteNeeded: "Нужда от дистанционна поддръжка",
      onsiteNeeded: "Нужда от посещения на място в София",
      networkNeeded: "Поддръжка на мрежа (рутери/Wi-Fi)",
      printerNeeded: "Поддръжка на принтери/периферия",
      backupNeeded: "Помощ при архивиране на данни",
      securityNeeded: "Консултации за киберсигурност",
      resultTitle: "Препоръчителен план:",
      resultText: "Въз основа на Вашите изисквания препоръчваме пакет:",
      cta: "Поискай индивидуална оферта",
      plans: {
        basic: "Базова IT поддръжка (Basic)",
        business: "Бизнес IT поддръжка (Business)",
        complete: "Пълна IT грижа (Complete Care)",
      },
      planDetails: {
        basic: "Подходящ за много малки офиси, споделени пространства и независими професионалисти (до 5 устройства). Включва дистанционна софтуерна помощ.",
        business: "Оптимален за развиващи се фирми с 5-15 устройства, мрежови компоненти и принтери. Включва дистанционна и реакция на място в София.",
        complete: "Максимална организация и защита за фирми с над 15 устройства, сървъри, сложна мрежова инфраструктура и критични изисквания за архивиране."
      }
    },
    diagnostics: {
      title: "Интерактивен диагностичен асистент",
      subtitle: "Прегледайте стъпките за отстраняване на чести проблеми. Тази предварителна проверка не замества професионалната техническа експертиза.",
      start: "Започни диагностика",
      restart: "Започни отначало",
      prev: "Предишен въпрос",
      next: "Следващ въпрос",
      selectDevice: "Изберете тип устройство или проблем:",
      diagnosticResult: "Предварителен резултат от проверката",
      recommendation: "Препоръчително действие:",
      disclaimer: "Внимание: Диагностиката е напълно автоматизирана и има предварителен характер. За сигурно решение изпратете заявка за техник.",
      convertToTicket: "Превърни диагностиката в заявка за ремонт",
      steps: {
        deviceType: {
          q: "За кое устройство или услуга става въпрос?",
          options: {
            pc: "Настолен компютър",
            laptop: "Лаптоп",
            internet: "Интернет и Wi-Fi мрежа",
            printer: "Принтер или копир",
            security: "Подозрителен инцидент със сигурността",
            other: "Друго"
          }
        },
        // Desktop PC flow
        pc_power: {
          q: "Включва ли се компютърът изобщо (светлини, шум от вентилатори)?",
          options: {
            yes: "Да, вентилаторите въртят и има светлини, но екранът е черен",
            no: "Не, никакви признаци на живот",
            blue_screen: "Да, но показва син екран (Blue Screen / BSOD) с код за грешка"
          }
        },
        pc_screen_black: {
          q: "Проверихте ли дали кабелът на монитора е добре свързан в двата края и мониторът е включен в контакта?",
          options: {
            yes: "Да, проверен е, но няма сигнал",
            no: "Ще проверя връзките сега"
          }
        },
        pc_no_power_check: {
          q: "Опитахте ли да включите захранващия кабел в друг контакт и проверихте ли копчето отзад на самото захранване (трябва да е на позиция I)?",
          options: {
            yes: "Да, контактът работи и ключът е на 'I', но пак не се включва",
            no: "Ще тествам с друг контакт и ще проверя ключа"
          }
        },
        // Laptop flow
        laptop_issues: {
          q: "Какъв е основният проблем с лаптопа?",
          options: {
            slow: "Работи изключително бавно и забива",
            hot: "Загрява силно и се изключва сам по време на работа",
            battery: "Батерията не се зарежда или държи много малко"
          }
        },
        // Internet flow
        internet_issues: {
          q: "Засегнати ли са други устройства в мрежата?",
          options: {
            all: "Да, интернет няма на нито едно устройство (компютри, телефони)",
            one: "Не, проблемът е само на едно конкретно устройство"
          }
        },
        internet_all_check: {
          q: "Опитахте ли да рестартирате рутера/модема (изключване от контакта за 30 секунди и повторно включване)?",
          options: {
            yes: "Да, рестартирах го, но интернетът не се възстанови",
            no: "Ще го рестартирам сега"
          }
        },
        // Printer flow
        printer_issues: {
          q: "Има ли съобщение за грешка на дисплея на принтера или на компютъра?",
          options: {
            error_msg: "Да, изписва грешка (няма тонер, заседнала хартия или др.)",
            no_error: "Няма грешка, но принтерът просто не реагира при печат"
          }
        },
        // Security flow
        security_issues: {
          q: "Какво се случи?",
          options: {
            phishing: "Кликнах на съмнителен линк в имейл или въведох парола",
            ransomware: "Файловете ми изглеждат преименувани или заключени със съобщение за откуп",
            popups: "Появяват се множество рекламни прозорци и нежелани съобщения"
          }
        }
      },
      results: {
        pc_hardware_fault: {
          title: "Вероятен хардуерен дефект",
          rec: "Необходимо е тестване в сервиз. Проблемът може да е в захранващия блок, дънната платка или RAM паметта. Моля, донесете устройството или заявете посещение.",
        },
        pc_monitor_issue: {
          title: "Проблем с видео сигнала или монитора",
          rec: "Проверете дали мониторът работи с друг компютър или сменете интерфейсния кабел (HDMI/DisplayPort). Ако кабелите са наред, видеокартата може да е повредена.",
        },
        laptop_upgrade: {
          title: "Нужда от оптимизация или ъпгрейд",
          rec: "Често бавната работа се дължи на остарял механичен диск (HDD). Замяната му с модерен SSD диск и преинсталиране на ОС ще ускори лаптопа до 10 пъти.",
        },
        laptop_dust: {
          title: "Прегряване поради прах или стара термопаста",
          rec: "ВАЖНО: Спрете да използвате лаптопа, за да не се повреди чипсетът. Той се нуждае от профилактично почистване и смяна на термопаста в сервиз.",
        },
        internet_isp: {
          title: "Проблем с рутера или доставчика",
          rec: "Свържете се с Вашия интернет доставчик, за да потвърди дали има активна авария в района. Ако сигналът до модема е изправен, може рутерът да се нуждае от преконфигуриране.",
        },
        internet_device_settings: {
          title: "Неправилни мрежови настройки на устройството",
          rec: "Изключете и включете отново Wi-Fi адаптера или рестартирайте компютъра. Ако няма ефект, нашият техник може дистанционно да провери IP настройките и DNS кеша.",
        },
        printer_driver: {
          title: "Проблем с драйверите или опашката за печат",
          rec: "Опитайте да изтриете и добавите принтера наново в настройките на Windows/macOS. Проверете опашката за печат (Print Queue) за блокирани задачи.",
        },
        security_disconnect: {
          title: "КРИТИЧНО: Потенциален компрометиран компютър",
          rec: "НЕЗАБАВНО ИЗКЛЮЧЕТЕ мрежовия кабел (LAN) и изключете Wi-Fi на устройството, за да спрете разпространението на вируси във Вашата мрежа. Не рестартирайте, ако има криптовирус, а изчакайте намеса на специалист.",
        },
        security_phishing: {
          title: "Съмнение за изтичане на пароли",
          rec: "Променете паролите си незабавно от ДРУГО (сигурно) устройство. Активирайте двуфакторна автентикация (2FA) навсякъде, където е възможно.",
        },
        check_connections: {
          title: "Проверка на кабелните връзки",
          rec: "Моля, проверете кабелите и опитайте отново диагностичния тест.",
        }
      }
    },
    booking: {
      title: "Резервация на час за IT консултация или поддръжка",
      subtitle: "Изберете удобен за Вас ден и час за посещение на място, remote сесия или консултация в нашия офис.",
      calendar: "Календар",
      timeSlots: "Свободни часове за",
      type: "Тип посещение / поддръжка",
      notes: "Допълнителни бележки (опишете накратко нуждите си)",
      successTitle: "Часът е резервиран успешно!",
      successText: "Благодарим Ви! Часът Ви е записан и е насочен за потвърждение от наш техник.",
      slots: {
        consultation: "Бизнес консултация за IT поддръжка (в наш офис)",
        remote: "Дистанционна софтуерна помощ (през интернет)",
        dropoff: "Оставяне на компютър за диагностика (в наш офис)",
        onsite: "Посещение от техник на адрес в София (офис/дом)"
      },
      duration: "Продължителност",
      location: "Място",
      notesPlaceholder: "Например: Настройка на нов принтер Brother, проблеми с Wi-Fi обхвата в офиса..."
    },
    forms: {
      submit: "Изпрати",
      submitting: "Изпращане...",
      fullName: "Три имена",
      companyName: "Име на фирма",
      email: "Имейл адрес",
      phone: "Телефонен номер",
      eik: "ЕИК / Булстат",
      subject: "Тема / Накратко",
      description: "Подробно описание на проблема",
      urgency: "Спешност",
      priority: "Приоритет",
      clientType: "Вие сте:",
      deviceType: "Тип устройство",
      os: "Операционна система",
      contactMethod: "Предпочитан начин за контакт",
      supportMethod: "Предпочитан начин на поддръжка",
      address: "Адрес (ако е необходимо посещение)",
      attachments: "Прикачени файлове",
      privacyConsent: "Съгласявам се с политиката за поверителност и обработката на лични данни.",
      errors: {
        required: "Това поле е задължително",
        email: "Невалиден имейл адрес",
        phone: "Невалиден телефонен номер",
        minLength: "Полето трябва да съдържа поне {count} символа",
        privacy: "Трябва да се съгласите с политиката за поверителност",
        fileSize: "Файлът надвишава лимита от 5MB",
        fileType: "Неподдържан файлов формат (разрешени са PNG, JPG, WEBP, PDF, TXT, DOCX)",
      },
      placeholders: {
        fullName: "Иван Иванов",
        companyName: "Фирма ООД",
        email: "ivan@example.com",
        phone: "0888123456",
        subject: "Компютърът блокира при стартиране на Outlook",
        description: "Моля, опишете какво се случва, кога е започнал проблемът и дали има съобщения за грешки...",
        address: "гр. София, ул. Примерна 12, ет. 3, ап. 5"
      }
    },
    ticket: {
      categories: {
        HARDWARE: "Хардуер",
        SOFTWARE: "Софтуер",
        NETWORK: "Мрежа",
        SECURITY: "Сигурност",
        OTHER: "Друго"
      },
      trackingTitle: "Проследяване на IT заявка",
      trackingSubtitle: "Въведете номера на Вашата заявка и имейла, с който сте я изпратили, за да проверите статуса.",
      ticketNumber: "Номер на заявка",
      checkBtn: "Провери статус",
      notFound: "Не е намерена заявка с тези данни. Моля, проверете номера и имейла.",
      maskedNotice: "С цел сигурност, част от личните данни са скрити.",
      detailsTitle: "Детайли за заявка",
      created: "Създадена на",
      statusLabel: "Текущ статус",
      urgencyLabel: "Спешност",
      timeline: "История на заявката",
      messages: "Комуникация",
      noMessages: "Няма изпратени съобщения по тази заявка.",
      sendMessage: "Изпрати съобщение до техник",
      messagePlaceholder: "Напишете Вашето съобщение тук...",
      addAttachment: "Прикачи файл",
      documents: "Документи по заявката",
      noDocuments: "Все още няма прикачени официални документи (протоколи/оферти).",
      statuses: {
        RECEIVED: "Получена",
        PENDING_REVIEW: "Очаква преглед",
        NEED_INFO: "Нужна е информация",
        SCHEDULED: "Насрочена",
        DIAGNOSING: "В диагностика",
        AWAITING_CONFIRMATION: "Изчаква потвърждение",
        IN_PROGRESS: "В процес на работа",
        READY: "Готова",
        COMPLETED: "Приключена",
        CANCELLED: "Отказана"
      },
      urgencies: {
        LOW: "Ниска",
        NORMAL: "Нормална",
        HIGH: "Висока",
        CRITICAL: "Спешна"
      },
      priorities: {
        LOW: "Нисък",
        NORMAL: "Нормален",
        HIGH: "Висок",
        EMERGENCY: "Спешен"
      },
      supportMethods: {
        REMOTE: "Дистанционна помощ",
        ON_SITE: "Посещение на място",
        OFFICE: "В наш сервиз"
      }
    },
    faq: {
      title: "Често задавани въпроси",
      subtitle: "Намерете бързи отговори за нашите процеси, поддръжка и резервации",
      searchPlaceholder: "Търсене на въпроси...",
      categories: {
        GENERAL: "Общи въпроси",
        TICKETS: "Заявки и проследяване",
        REPAIRS: "Ремонти и диагностика",
        REMOTE: "Дистанционна помощ",
        BUSINESS: "Фирмена поддръжка",
        BOOKINGS: "Резервации",
        QUOTES: "Плащане и оферти",
        SECURITY: "Сигурност и поверителност"
      },
      noResults: "Няма намерени въпроси, съвпадащи с търсенето.",
      items: [
        {
          cat: "GENERAL",
          q: "Къде се намира Вашият офис?",
          a: "Нашият офис се намира в гр. София, ул. „Цар Симеон“ 20. Тук можете да донесете компютър или лаптоп за диагностика и ремонт след предварително записване или уговорка."
        },
        {
          cat: "TICKETS",
          q: "Как мога да проследя статуса на ремонта?",
          a: "При подаване на заявка (през сайта или по телефона) автоматично се генерира уникален код във формат ALMI-2026-XXXX. Можете да проверите статуса по всяко време на страницата „Провери заявка“ с Вашата поща и номер на заявката, или като влезете в профила си."
        },
        {
          cat: "REPAIRS",
          q: "Колко време отнема диагностиката на компютър?",
          a: "Обикновено стандартната диагностика се извършва в рамките на 1-2 работни дни от приемането на устройството, в зависимост от натовареността на техниците. След приключване на диагностиката се свързваме с Вас с предложение за ремонт и ценови параметри."
        },
        {
          cat: "REMOTE",
          q: "Какво е необходимо за дистанционна поддръжка?",
          a: "За да можем да се свържем дистанционно към Вашето устройство, е необходимо то да се включва, да има работеща интернет връзка и да свалите препоръчания от нас софтуер за отдалечен достъп (например AnyDesk или TeamViewer). Преди връзката ще ни продиктувате Вашия уникален ID номер за достъп."
        },
        {
          cat: "BUSINESS",
          q: "Предлагате ли абонаментна поддръжка за фирми?",
          a: "Да, предлагаме абонаментни планове, адаптирани за малки и средни фирми, офиси и магазини в София. Услугата включва периодична профилактика, бърза реакция при инциденти, поддръжка на рутери, принтери и консултации по сигурността. Изпратете ни запитване за индивидуална оферта."
        },
        {
          cat: "BOOKINGS",
          q: "Мога ли да отменя или пренасроча запазен час?",
          a: "Да, можете да направите това през Вашия клиентски портал в секция „Резервации“ или като се свържете директно с нас на телефон +359 88 800 2455."
        }
      ]
    },
    help: {
      title: "Помощен център и база знания",
      subtitle: "Статии с инструкции и съвети, които ще Ви помогнат да се справите сами с базови настройки",
      searchPlaceholder: "Търсене на статии...",
      categories: {
        COMPUTERS: "Компютри и лаптопи",
        WINDOWS: "Windows системи",
        NETWORK: "Интернет и Wi-Fi",
        PRINTERS: "Принтери и копири",
        SOFTWARE: "Софтуер и пощи",
        BACKUP: "Архивиране на данни",
        SECURITY: "Киберсигурност",
        BUSINESS: "Фирмена IT среда"
      },
      readTime: "мин. четене",
      updated: "Последна промяна",
      wasHelpful: "Беше ли полезна статията?",
      yes: "Да",
      no: "Не",
      thanks: "Благодарим за Вашата оценка!",
      back: "Обратно към помощния център",
      noArticles: "Няма намерени статии.",
      needMoreHelp: "Не намерихте решение на проблема си?",
      createTicketCTA: "Опишете Вашия случай и наш техник ще се свърже с Вас за професионална помощ.",
      createTicketBtn: "Заяви IT помощ сега"
    },
    portal: {
      welcome: "Добре дошли,",
      privateDashboard: "Клиентски портал - Физическо лице",
      companyDashboard: "Фирмен IT портал",
      technicianDashboard: "Работен панел - Техник",
      adminDashboard: "Контролен панел - Администратор",
      tabs: {
        dashboard: "Табло",
        tickets: "Заявки",
        devices: "Устройства",
        bookings: "Резервации",
        quotes: "Оферти",
        documents: "Документи",
        chat: "Чат поддръжка",
        profile: "Профил",
        company: "Фирма",
        users: "Служители",
        settings: "Настройки",
        content: "Съдържание",
        logs: "Одит лог"
      },
      dashboard: {
        activeTickets: "Активни заявки",
        upcomingVisits: "Предстоящи посещения",
        pendingQuotes: "Оферти за одобрение",
        registeredDevices: "Регистрирани устройства",
        quickActions: "Бързи връзки",
        recentActivity: "Последна активност"
      },
      company: {
        title: "Фирмен профил",
        eik: "ЕИК",
        billingAddress: "Адрес за фактуриране",
        offices: "Офиси / Локации",
        addOffice: "Добави офис",
        team: "Служители с достъп",
        addUser: "Добави служител",
        plan: "Абонаментен план",
        currentPlan: "Текущ поддържащ план",
        noPlan: "Няма активен абонаментен договор",
        env: "Вашата IT среда",
      },
      devices: {
        title: "Моите устройства",
        add: "Регистрирай устройство",
        nickname: "Наименование (напр. Лаптоп счетоводство)",
        serial: "Сериен номер",
        brand: "Марка",
        model: "Модел",
        type: "Тип",
        os: "Операционна система",
        purchaseDate: "Дата на покупка",
        notes: "Бележки (напр. Специфичен софтуер)",
        noDevices: "Няма регистрирани устройства в профила Ви."
      },
      quotes: {
        title: "Оферти и предложения",
        quoteNo: "Оферта №",
        date: "Дата",
        expiry: "Валидна до",
        total: "Сума",
        status: "Статус",
        accept: "Одобрявам",
        decline: "Отказвам",
        accepted: "Одобрена",
        declined: "Отказана",
        expired: "Изтекла",
        viewDetails: "Преглед на оферта",
        sent: "Изпратена",
        draft: "Чернова"
      },
      documents: {
        title: "Официални документи",
        noDocs: "Все още няма качени документи (протоколи/фактури).",
        download: "Свали PDF",
        categories: {
          OFFER: "Търговско предложение",
          DIAGNOSTIC_REPORT: "Протокол от диагностика",
          SERVICE_PROTOCOL: "Приемо-предавателен протокол",
          INVOICE: "Фактура (копие)",
          ATTACHMENT: "Друг документ"
        }
      }
    },
    admin: {
      stats: {
        newTickets: "Нови заявки",
        activeTickets: "В процес",
        urgentTickets: "Спешни",
        needInfo: "Чакащи инфо",
        appointmentsToday: "Посещения днес",
        pendingQuotes: "Чакащи оферти",
        unreadChats: "Непрочетени чатове",
        totalUsers: "Всички клиенти"
      },
      ticketMgmt: {
        assign: "Разпредели на",
        changeStatus: "Промени статус",
        changePriority: "Промени приоритет",
        addNote: "Добави вътрешна бележка (скрита за клиента)",
        sendMsg: "Изпрати съобщение до клиента",
        createQuote: "Създай оферта",
        linkDevice: "Свържи устройство",
        markComplete: "Приключи заявка",
        auditTrail: "История на действията",
        internalNotesTitle: "Вътрешни бележки на техниците",
        noInternalNotes: "Няма записани вътрешни бележки за тази заявка."
      },
      settings: {
        businessEmail: "Конфигуриран бизнес имейл",
        workingHoursBg: "Работно време (Български)",
        workingHoursEn: "Working hours (English)",
        addressBg: "Адрес (Български)",
        addressEn: "Address (English)",
        enableEmails: "Изпращане на реални имейли (при налични ключове)",
        enableUploads: "Реално качване в облак",
        save: "Запази настройките",
        success: "Настройките са запазени успешно!"
      }
    },
    legal: {
      cookieTitle: "Политика за бисквитките (Cookie Policy)",
      privacyTitle: "Политика за поверителност (Privacy Policy)",
      termsTitle: "Общи условия (Terms & Conditions)",
      reviewNotice: "ВАЖНО: Този текст е примерен шаблон с демо характер. За легална употреба в производство, съдържанието трябва да бъде прегледано от юрист.",
      consent: {
        title: "Настройки за поверителност",
        text: "Ние използваме бисквитки, за да подобрим Вашето преживяване на нашия сайт. Моля, изберете кои категории бисквитки сте съгласни да използваме.",
        necessary: "Задължителни бисквитки (сигурност, сесии)",
        preferences: "Предпочитания (език, избор на тема)",
        analytics: "Статистически бисквитки (посещаемост)",
        marketing: "Маркетингови бисквитки",
        acceptAll: "Приеми всички",
        acceptSelected: "Запази избраните",
        declineAll: "Откажи незадължителните"
      }
    },
    enums: {
      bookingStatuses: {
        PENDING: "Очаква потвърждение",
        CONFIRMED: "Потвърдена",
        RESCHEDULED: "Пренасрочена",
        CANCELLED: "Отказана",
        COMPLETED: "Завършена"
      },
      serviceTypes: {
        CONSULTATION: "Бизнес консултация",
        REMOTE: "Дистанционна помощ",
        ON_SITE: "Посещение на адрес",
        DROP_OFF: "В наш сервиз"
      },
      quoteStatuses: {
        DRAFT: "Чернова",
        SENT: "Очаква решение",
        VIEWED: "Прегледана",
        ACCEPTED: "Одобрена",
        DECLINED: "Отказана",
        EXPIRED: "Изтекла"
      },
      userRoles: {
        CUSTOMER_PRIVATE: "Частен клиент",
        CUSTOMER_COMPANY: "Бизнес клиент",
        TECHNICIAN: "Техник",
        ADMIN: "Администратор"
      },
      notificationTypes: {
        TICKETS: "Заявки",
        MESSAGES: "Съобщения",
        APPOINTMENTS: "Резервации",
        DOCUMENTS: "Документи",
        SYSTEM: "Системни"
      }
    }
  },
  en: {
    meta: {
      title: "Almi Group LTD | Computer Support and IT Services Sofia",
      description: "Your reliable IT partner for office and home. Professional computer support, software aid, network setups, and remote technical assistance for businesses and private clients in Sofia.",
    },
    nav: {
      home: "Home",
      services: "Services",
      forBusinesses: "For Businesses",
      diagnostics: "Diagnostics",
      helpCenter: "Help Center",
      aboutUs: "About Us",
      contacts: "Contacts",
      login: "Login",
      register: "Register",
      logout: "Logout",
      portal: "Portal",
      requestHelp: "Request IT Help",
      checkTicket: "Track Ticket",
      booking: "Booking",
      phone: "+359 88 800 2455",
    },
    services: {
      title: "Our IT Services",
      subtitle: "Professional technology solutions tailored to your needs",
      suitableFor: "Suitable for:",
      business: "Businesses / Offices",
      private: "Private Clients",
      ctaDetails: "Learn more",
      ctaOrder: "Request Help",
      commonProblems: "Common problems we solve:",
      howItWorks: "How does the process work?",
      possibleActivities: "Possible activities may include:",
      items: {
        "it-poddrazhka-za-firmi": {
          title: "IT Support for Businesses",
          desc: "Subscription-based and one-off technical support for business computers, servers, devices, and networks in Sofia.",
          details: "Ensures continuity of business workflows, data security, and fast technical response times to incidents.",
        },
        "remont-na-kompyutri": {
          title: "Computer & Laptop Repair",
          desc: "Diagnostics, cleaning, hardware repairs, and upgrades of desktops and portable computer devices.",
          details: "Replacement of failed parts (drives, memory, power supplies), cooling system optimization, and thermal paste replacement.",
        },
        "mrezhi-i-internet": {
          title: "Network & Internet Solutions",
          desc: "Design, build, configuration, and protection of office and home wired and wireless (Wi-Fi) networks.",
          details: "Router and switch setup, wireless dead-zone removal, speed optimization, and network firewall protection.",
        },
        "softuerna-pomosht": {
          title: "Software Help & Configuration",
          desc: "Installation of operating systems, office packages, virus removal, and custom software setups.",
          details: "Optimizing slow OS environments, resolving application conflicts, and fixing driver issues.",
        },
        "distancionna-pomosht": {
          title: "Remote IT Support",
          desc: "Fast online technical assistance via the internet for software setups, email, and resolving error codes.",
          details: "Saves travel time. Ideal when your internet connection is active and you need urgent software configurations.",
        },
        "arhivirane-i-zashtita": {
          title: "Data Backup & Security",
          desc: "Setting up automatic backups (cloud/local) and baseline protection against viruses and ransomware.",
          details: "Configuring reliable backup copies of your accounting files and databases to prevent sudden data loss.",
        }
      }
    },
    problemSelector: {
      title: "What technical issue are you facing?",
      subtitle: "Select your situation below to get a quick recommendation for next steps",
      ctaDiag: "Start Diagnostics",
      ctaRequest: "Submit Request",
      ctaCall: "Call Now",
      options: {
        pc_no_power: "Computer doesn't turn on",
        laptop_slow: "Laptop is very slow",
        internet_down: "Internet is not working",
        software_error: "I have a software error",
        printer_broken: "Printer is not working",
        new_device: "Need help configuring a new device",
        business_network: "Problem with the business network",
        corporate_support: "Looking for ongoing IT support",
        other: "Other issue"
      },
      responses: {
        pc_no_power: "Check the power cable and the outlet strip. If there are no signs of life (no lights or fans), it is likely a hardware power supply or motherboard issue. We recommend physical computer repair.",
        laptop_slow: "This can be caused by overheating, an old mechanical hard drive (HDD), or software clutter. We recommend cleaning, optimization, or installing a high-speed SSD.",
        internet_down: "Restart your router/modem by unplugging it from power for 30 seconds. Verify all cable connections. If internet does not recover, it could be a hardware fault or ISP outage.",
        software_error: "For errors with Windows, Outlook, or Office packages, our technicians can assist you quickly via secure Remote IT Support.",
        printer_broken: "Verify the printer is powered on, has paper/toner, and is connected to the computer or Wi-Fi. Often the issue is a jammed task queue or driver failure.",
        new_device: "We configure new computers, printers, network switches, and safely migrate your files and folders from your old device.",
        business_network: "Corporate networks require a professional review of routers, switches, and patch cords to restore security policies and accessibility.",
        corporate_support: "Contact us to review your office environment and prepare a custom B2B IT support subscription suited for your business scale.",
        other: "Briefly describe your case in our support form and our technical team will review it for the best resolution."
      }
    },
    calculator: {
      title: "Business IT Support Calculator",
      subtitle: "Fill in your office infrastructure parameters for a recommended support plan configuration",
      employees: "Number of employees",
      computers: "Desktop computers",
      laptops: "Laptops",
      offices: "Office locations",
      remoteNeeded: "Need remote support",
      onsiteNeeded: "Need on-site visits in Sofia",
      networkNeeded: "Support for network routers/Wi-Fi",
      printerNeeded: "Support for printers/copiers",
      backupNeeded: "Help with data backups",
      securityNeeded: "Cybersecurity consulting",
      resultTitle: "Recommended Plan:",
      resultText: "Based on your inputs, we recommend the following plan:",
      cta: "Request a Custom Offer",
      plans: {
        basic: "Basic IT Support",
        business: "Business IT Support",
        complete: "Complete IT Care",
      },
      planDetails: {
        basic: "Designed for small offices, co-working desks, and independent professionals (up to 5 devices). Includes remote software help.",
        business: "Optimal for growing offices with 5-15 devices, local network hardware, and printers. Includes remote and Sofia on-site support.",
        complete: "Comprehensive IT package for offices with 15+ devices, server systems, complex network layouts, and critical data backup policies."
      }
    },
    diagnostics: {
      title: "Interactive Diagnostics Assistant",
      subtitle: "Troubleshoot common computer issues. This wizard is automated and does not replace a professional evaluation.",
      start: "Start Diagnostics",
      restart: "Start Over",
      prev: "Previous Question",
      next: "Next Question",
      selectDevice: "Select your device or issue type:",
      diagnosticResult: "Preliminary Diagnostic Result",
      recommendation: "Recommended Action:",
      disclaimer: "Disclaimer: This automated diagnosis is preliminary. For a guaranteed repair, submit a support request to assign a technician.",
      convertToTicket: "Convert Diagnostic Result to Support Ticket",
      steps: {
        deviceType: {
          q: "What device or service are you troubleshooting?",
          options: {
            pc: "Desktop Computer",
            laptop: "Laptop",
            internet: "Internet & Wi-Fi Network",
            printer: "Printer or Copier",
            security: "Suspicious Security Incident",
            other: "Other"
          }
        },
        pc_power: {
          q: "Does the computer turn on at all (lights, fans spinning)?",
          options: {
            yes: "Yes, fans spin and lights show, but screen remains black",
            no: "No, no signs of life at all",
            blue_screen: "Yes, but it crashes into a blue screen (BSOD) with error codes"
          }
        },
        pc_screen_black: {
          q: "Did you verify the monitor cable is plugged in firmly on both ends and the monitor is powered on?",
          options: {
            yes: "Yes, verified, but screen still displays no signal",
            no: "I will check the cables now"
          }
        },
        pc_no_power_check: {
          q: "Did you try another wall outlet, and did you check if the switch on the back of the power supply is flipped to 'I'?",
          options: {
            yes: "Yes, outlet is working, switch is on 'I', but still no power",
            no: "I will test another outlet and verify the power switch"
          }
        },
        laptop_issues: {
          q: "What is the primary laptop issue?",
          options: {
            slow: "Runs extremely slow and freezes",
            hot: "Gets very hot and shuts down automatically during use",
            battery: "Battery does not charge or drains rapidly"
          }
        },
        internet_issues: {
          q: "Are other devices in your network affected?",
          options: {
            all: "Yes, internet is down on all devices (computers, phones)",
            one: "No, the issue is on one specific computer only"
          }
        },
        internet_all_check: {
          q: "Have you tried power-cycling the router/modem (unplug from power for 30 seconds and plug back in)?",
          options: {
            yes: "Yes, router was restarted but internet did not recover",
            no: "I will restart the router now"
          }
        },
        printer_issues: {
          q: "Is there an error message shown on the printer display or your computer?",
          options: {
            error_msg: "Yes, it reports an error (out of toner, paper jam, etc.)",
            no_error: "No error, but printer simply does not react when printing"
          }
        },
        security_issues: {
          q: "What suspicious activity occurred?",
          options: {
            phishing: "Clicked an unknown link in an email or entered credentials",
            ransomware: "My files look renamed or encrypted with a ransom note",
            popups: "Constant ad popups and unexpected warning messages"
          }
        }
      },
      results: {
        pc_hardware_fault: {
          title: "Probable Hardware Failure",
          rec: "Physical inspection is required. The issue could be the PSU, motherboard, or RAM. Please bring the device to our shop or book a technician visit.",
        },
        pc_monitor_issue: {
          title: "Video Signal or Monitor Fault",
          rec: "Test the monitor with another device or try a different cable (HDMI/DisplayPort). If cables are fine, the graphics card might be faulty.",
        },
        laptop_upgrade: {
          title: "Optimization or Upgrade Recommended",
          rec: "Slow performance is often caused by an old mechanical drive (HDD). Upgrading to a modern Solid State Drive (SSD) and reinstalling the OS speeds up boot times significantly.",
        },
        laptop_dust: {
          title: "Overheating due to dust or dried thermal paste",
          rec: "IMPORTANT: Stop using the laptop to avoid permanent chipset damage. It requires technical cleaning and thermal paste replacement in a workshop.",
        },
        internet_isp: {
          title: "Router or ISP Outage",
          rec: "Contact your Internet Service Provider to check for network outages in Sofia. If their line is active, the router might need configuration.",
        },
        internet_device_settings: {
          title: "Invalid Device Network Configuration",
          rec: "Turn Wi-Fi off and back on or restart the device. If internet is still down, our support tech can check IP and DNS configurations remotely.",
        },
        printer_driver: {
          title: "Driver Issue or Print Queue Blocked",
          rec: "Try removing and adding the printer back in OS settings. Inspect the Print Queue folder to clear out stuck documents.",
        },
        security_disconnect: {
          title: "CRITICAL: Potential Network Compromise",
          rec: "UNPLUG the ethernet network cable (LAN) and turn off Wi-Fi on this computer immediately to prevent malware distribution on your LAN. Do not reboot if you suspect ransomware.",
        },
        security_phishing: {
          title: "Credential Leakage Warning",
          rec: "Change your passwords immediately from a DIFFERENT, secure device. Set up Multi-Factor Authentication (MFA) on all sensitive accounts.",
        },
        check_connections: {
          title: "Cables Check Required",
          rec: "Please check physical plugs and cables, then re-run the diagnostic wizard.",
        }
      }
    },
    booking: {
      title: "Book an Appointment for IT Support",
      subtitle: "Select a date and time slot for a technician visit in Sofia, a remote support session, or a meeting at our office.",
      calendar: "Calendar",
      timeSlots: "Available Slots for",
      type: "Appointment Type",
      notes: "Additional Details (briefly describe your requirement)",
      successTitle: "Appointment Booked Successfully!",
      successText: "Thank you! Your appointment is recorded and will be verified by a technician shortly.",
      slots: {
        consultation: "Business IT consultation (at our office)",
        remote: "Remote software assistance (via Internet)",
        dropoff: "Device drop-off for diagnostics (at our office)",
        onsite: "Technician visit in Sofia (office/home)"
      },
      duration: "Duration",
      location: "Location",
      notesPlaceholder: "Example: Configuration of a new Brother printer, unstable Wi-Fi in the office..."
    },
    forms: {
      submit: "Submit",
      submitting: "Submitting...",
      fullName: "Full Name",
      companyName: "Company Name",
      email: "Email Address",
      phone: "Phone Number",
      eik: "Company ID (EIK)",
      subject: "Subject / Brief Summary",
      description: "Detailed description of the issue",
      urgency: "Urgency",
      priority: "Priority",
      clientType: "Customer Type:",
      deviceType: "Device Type",
      os: "Operating System",
      contactMethod: "Preferred Contact Method",
      supportMethod: "Preferred Support Method",
      address: "Address (if on-site visit needed)",
      attachments: "Attachments",
      privacyConsent: "I agree to the privacy policy and consent to the processing of my personal details.",
      errors: {
        required: "This field is required",
        email: "Invalid email address",
        phone: "Invalid phone number",
        minLength: "Must contain at least {count} characters",
        privacy: "You must agree to the privacy policy",
        fileSize: "File size exceeds the 5MB limit",
        fileType: "Unsupported file type (allowed formats: PNG, JPG, WEBP, PDF, TXT, DOCX)",
      },
      placeholders: {
        fullName: "John Doe",
        companyName: "Company LLC",
        email: "john@example.com",
        phone: "+359888123456",
        subject: "Computer freezes when opening Outlook",
        description: "Please write what happens, when the problem started, and any error codes displayed...",
        address: "Sofia, Example St 12, fl. 3, ap. 5"
      }
    },
    ticket: {
      categories: {
        HARDWARE: "Hardware",
        SOFTWARE: "Software",
        NETWORK: "Network",
        SECURITY: "Security",
        OTHER: "Other"
      },
      trackingTitle: "Track Support Request",
      trackingSubtitle: "Enter the ticket number and email address used in the request to view the status.",
      ticketNumber: "Ticket Number",
      checkBtn: "Check Status",
      notFound: "No ticket matches the provided details. Please check the ticket number and email.",
      maskedNotice: "For security, some personal information has been masked.",
      detailsTitle: "Ticket Details",
      created: "Created on",
      statusLabel: "Current Status",
      urgencyLabel: "Urgency",
      timeline: "Ticket Timeline",
      messages: "Messages",
      noMessages: "No messages sent on this ticket yet.",
      sendMessage: "Send Message to Tech",
      messagePlaceholder: "Write your message here...",
      addAttachment: "Attach File",
      documents: "Documents for Ticket",
      noDocuments: "No formal documents (protocols or offers) uploaded yet.",
      statuses: {
        RECEIVED: "Received",
        PENDING_REVIEW: "Awaiting Review",
        NEED_INFO: "More Info Needed",
        SCHEDULED: "Scheduled",
        DIAGNOSING: "In Diagnostics",
        AWAITING_CONFIRMATION: "Awaiting Confirmation",
        IN_PROGRESS: "In Progress",
        READY: "Ready",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled"
      },
      urgencies: {
        LOW: "Low",
        NORMAL: "Normal",
        HIGH: "High",
        CRITICAL: "Urgent"
      },
      priorities: {
        LOW: "Low",
        NORMAL: "Normal",
        HIGH: "High",
        EMERGENCY: "Emergency"
      },
      supportMethods: {
        REMOTE: "Remote Support",
        ON_SITE: "On-Site Visit",
        OFFICE: "Drop-Off at Office"
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers regarding our service workflow, booking, and assistance",
      searchPlaceholder: "Search questions...",
      categories: {
        GENERAL: "General Questions",
        TICKETS: "Tickets & Tracking",
        REPAIRS: "Repairs & Diagnostics",
        REMOTE: "Remote Support",
        BUSINESS: "Business IT Plans",
        BOOKINGS: "Bookings",
        QUOTES: "Payments & Quotes",
        SECURITY: "Security & Privacy"
      },
      noResults: "No questions match your query.",
      items: [
        {
          cat: "GENERAL",
          q: "Where is your workshop located?",
          a: "Our office is located at Sofia, Tsar Simeon St. 20. You can drop off computers or laptops for diagnostics and hardware repair here by booking an appointment in advance."
        },
        {
          cat: "TICKETS",
          q: "How can I track my repair status?",
          a: "When a request is submitted, a ticket code like ALMI-2026-XXXX is generated. You can track its status under the 'Track Ticket' page using your email and code, or by logging into your portal."
        },
        {
          cat: "REPAIRS",
          q: "How long does computer diagnostics take?",
          a: "Standard diagnostics take 1-2 business days depending on queue load. Once complete, we contact you with a repair quote for your approval before proceeding."
        },
        {
          cat: "REMOTE",
          q: "What do I need for remote technical assistance?",
          a: "To connect, your device must boot, have an active internet connection, and run our remote support application (AnyDesk or TeamViewer). You will share your temporary ID code with us."
        },
        {
          cat: "BUSINESS",
          q: "Do you offer subscription plans for companies?",
          a: "Yes, we provide customizable subscription IT support plans for small and medium businesses in Sofia. Includes monitoring, priority response, network security, and backup setups. Contact us for a quote."
        },
        {
          cat: "BOOKINGS",
          q: "Can I cancel or reschedule my slot?",
          a: "Yes, you can manage your appointments inside the portal's 'Bookings' tab or contact us directly at +359 88 800 2455."
        }
      ]
    },
    help: {
      title: "Help Center & Knowledge Base",
      subtitle: "Instructional articles and troubleshooting guides to solve basic issues on your own",
      searchPlaceholder: "Search articles...",
      categories: {
        COMPUTERS: "Computers & Laptops",
        WINDOWS: "Windows OS",
        NETWORK: "Internet & Wi-Fi",
        PRINTERS: "Printers & Copiers",
        SOFTWARE: "Software & Mail",
        BACKUP: "Data Backups",
        SECURITY: "Cybersecurity",
        BUSINESS: "Business IT Setup"
      },
      readTime: "min read",
      updated: "Last updated",
      wasHelpful: "Was this article helpful?",
      yes: "Yes",
      no: "No",
      thanks: "Thank you for your feedback!",
      back: "Back to Help Center",
      noArticles: "No articles found.",
      needMoreHelp: "Still need technical assistance?",
      createTicketCTA: "Describe your issue in our intake form, and our technicians will resolve the case.",
      createTicketBtn: "Request IT Help Now"
    },
    portal: {
      welcome: "Welcome,",
      privateDashboard: "Client Portal - Private Client",
      companyDashboard: "Corporate IT Portal",
      technicianDashboard: "Technician Workspace",
      adminDashboard: "Admin Control Panel",
      tabs: {
        dashboard: "Dashboard",
        tickets: "Tickets",
        devices: "Devices",
        bookings: "Appointments",
        quotes: "Quotes",
        documents: "Documents",
        chat: "Support Chat",
        profile: "Profile",
        company: "Company",
        users: "Employees",
        settings: "Settings",
        content: "Content Mgmt",
        logs: "Audit Logs"
      },
      dashboard: {
        activeTickets: "Active Tickets",
        upcomingVisits: "Scheduled Visits",
        pendingQuotes: "Quotes for Review",
        registeredDevices: "Registered Devices",
        quickActions: "Quick Links",
        recentActivity: "Recent Activity"
      },
      company: {
        title: "Company Profile",
        eik: "Company ID (EIK)",
        billingAddress: "Billing Address",
        offices: "Office Locations",
        addOffice: "Add Location",
        team: "Authorized Personnel",
        addUser: "Add User",
        plan: "Support Contract",
        currentPlan: "Active Plan",
        noPlan: "No active support contract configured",
        env: "Your IT Assets",
      },
      devices: {
        title: "My Devices",
        add: "Register Device",
        nickname: "Device Label (e.g. Accounting Laptop)",
        serial: "Serial Number",
        brand: "Brand",
        model: "Model",
        type: "Type",
        os: "Operating System",
        purchaseDate: "Purchase Date",
        notes: "Technical Notes (e.g. Special Software)",
        noDevices: "No devices registered under your profile."
      },
      quotes: {
        title: "Quotes & Offers",
        quoteNo: "Quote No",
        date: "Date",
        expiry: "Valid Until",
        total: "Amount",
        status: "Status",
        accept: "Accept",
        decline: "Decline",
        accepted: "Accepted",
        declined: "Declined",
        expired: "Expired",
        viewDetails: "View Details",
        sent: "Sent",
        draft: "Draft"
      },
      documents: {
        title: "Official Documents",
        noDocs: "No documents (protocols or invoices) found.",
        download: "Download PDF",
        categories: {
          OFFER: "IT Proposal",
          DIAGNOSTIC_REPORT: "Diagnostic Report",
          SERVICE_PROTOCOL: "Service Protocol",
          INVOICE: "Invoice copy",
          ATTACHMENT: "Other document"
        }
      }
    },
    admin: {
      stats: {
        newTickets: "New Tickets",
        activeTickets: "In Progress",
        unreadChats: "Unread Chats",
        urgentTickets: "Urgent",
        needInfo: "Info Needed",
        appointmentsToday: "Visits Today",
        pendingQuotes: "Open Quotes",
        totalUsers: "Total Clients"
      },
      ticketMgmt: {
        assign: "Assign to",
        changeStatus: "Set Status",
        changePriority: "Set Priority",
        addNote: "Add internal technician note (hidden from customer)",
        sendMsg: "Send message to customer",
        createQuote: "Create Quote",
        linkDevice: "Link Device",
        markComplete: "Close Ticket",
        auditTrail: "Activity Log",
        internalNotesTitle: "Internal Staff Notes",
        noInternalNotes: "No internal notes recorded for this ticket."
      },
      settings: {
        businessEmail: "Configured business email",
        workingHoursBg: "Working hours (Bulgarian)",
        workingHoursEn: "Working hours (English)",
        addressBg: "Address (Bulgarian)",
        addressEn: "Address (English)",
        enableEmails: "Real email dispatch (if credentials valid)",
        enableUploads: "Real cloud uploads",
        save: "Save Settings",
        success: "Settings saved successfully!"
      }
    },
    legal: {
      cookieTitle: "Cookie Policy",
      privacyTitle: "Privacy Policy",
      termsTitle: "Terms & Conditions",
      reviewNotice: "IMPORTANT: This legal text is an example template for demo purposes. Consult with a lawyer before launching in production.",
      consent: {
        title: "Privacy Settings",
        text: "We use cookies to enhance your browsing experience. Please choose which categories of cookies you consent to.",
        necessary: "Necessary cookies (security, sessions)",
        preferences: "Preferences (language, theme choice)",
        analytics: "Analytical cookies (visits tracking)",
        marketing: "Marketing cookies",
        acceptAll: "Accept All",
        acceptSelected: "Save Selected",
        declineAll: "Decline Non-Essential"
      }
    },
    enums: {
      bookingStatuses: {
        PENDING: "Awaiting Confirmation",
        CONFIRMED: "Confirmed",
        RESCHEDULED: "Rescheduled",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed"
      },
      serviceTypes: {
        CONSULTATION: "Business Consultation",
        REMOTE: "Remote Assistance",
        ON_SITE: "On-site Visit",
        DROP_OFF: "Drop-off in Service"
      },
      quoteStatuses: {
        DRAFT: "Draft",
        SENT: "Awaiting Decision",
        VIEWED: "Viewed",
        ACCEPTED: "Approved",
        DECLINED: "Declined",
        EXPIRED: "Expired"
      },
      userRoles: {
        CUSTOMER_PRIVATE: "Private Client",
        CUSTOMER_COMPANY: "Business Client",
        TECHNICIAN: "Technician",
        ADMIN: "Administrator"
      },
      notificationTypes: {
        TICKETS: "Tickets",
        MESSAGES: "Messages",
        APPOINTMENTS: "Appointments",
        DOCUMENTS: "Documents",
        SYSTEM: "System"
      }
    }
  }
};
