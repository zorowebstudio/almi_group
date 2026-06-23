const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Simple hash implementation for the demo (matching our lib/auth verification)
function hashPassword(password) {
  // In production, use PBKDF2/bcrypt. For demo seed, a simple hex-encoding is used
  // to avoid build dependencies, but we'll use a standard salt-free SHA-256-like representation.
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database with Bulgarian IT support demo data...");

  // 1. Site Settings
  await prisma.siteSetting.deleteMany();
  const settings = [
    { key: "business_email", value: "office@almi.bg", description: "Business contact email" },
    { key: "working_hours_bg", value: "Понеделник - Петък: 09:00 - 18:00", description: "Работно време (БГ)" },
    { key: "working_hours_en", value: "Monday - Friday: 09:00 - 18:00", description: "Working Hours (EN)" },
    { key: "address_bg", value: "гр. София, ул. „Цар Симеон“ 20", description: "Адрес на фирмата (БГ)" },
    { key: "address_en", value: "Sofia, Tsar Simeon St. 20", description: "Company Address (EN)" },
    { key: "enable_emails", value: "false", description: "Enable real email sending" },
    { key: "enable_uploads", value: "false", description: "Enable real cloud uploads" }
  ];
  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  // 2. Users (Admin, Tech, Company Client, Private Client)
  await prisma.user.deleteMany();
  
  const adminPassword = hashPassword("admin123");
  const techPassword = hashPassword("tech123");
  const companyPassword = hashPassword("company123");
  const privatePassword = hashPassword("client123");

  const admin = await prisma.user.create({
    data: {
      email: "admin@almi.bg",
      passwordHash: adminPassword,
      name: "Администратор Алми",
      role: "ADMIN",
      phone: "+359 88 800 2455",
      languagePreference: "bg"
    }
  });

  const tech = await prisma.user.create({
    data: {
      email: "tech@almi.bg",
      passwordHash: techPassword,
      name: "Инж. Димитър Петров",
      role: "TECHNICIAN",
      phone: "+359 88 777 6666",
      languagePreference: "bg"
    }
  });

  const companyUser = await prisma.user.create({
    data: {
      email: "manager@agrocom.bg",
      passwordHash: companyPassword,
      name: "Георги Тодоров",
      role: "CUSTOMER_COMPANY",
      phone: "+359 88 555 4444",
      languagePreference: "bg"
    }
  });

  const privateUser = await prisma.user.create({
    data: {
      email: "ivan@mail.bg",
      passwordHash: privatePassword,
      name: "Иван Иванов",
      role: "CUSTOMER_PRIVATE",
      phone: "+359 88 111 2222",
      languagePreference: "bg"
    }
  });

  // 3. Company
  await prisma.company.deleteMany();
  const company = await prisma.company.create({
    data: {
      name: "Агро Комерс ЕООД",
      eik: "204156789",
      billingInfo: "гр. София, бул. България 45, МОЛ: Георги Тодоров"
    }
  });

  // 4. Company Membership
  await prisma.companyMember.deleteMany();
  await prisma.companyMember.create({
    data: {
      userId: companyUser.id,
      companyId: company.id,
      role: "OWNER"
    }
  });

  // 5. Addresses
  await prisma.address.deleteMany();
  await prisma.address.create({
    data: {
      userId: privateUser.id,
      title: "Дом",
      street: "ул. Оборище 15, ет. 2",
      city: "София",
      postalCode: "1000",
      isDefault: true
    }
  });

  await prisma.address.create({
    data: {
      companyId: company.id,
      title: "Основен офис",
      street: "бул. България 45, ет. 4",
      city: "София",
      postalCode: "1404",
      isDefault: true
    }
  });

  // 6. Devices
  await prisma.device.deleteMany();
  const device1 = await prisma.device.create({
    data: {
      userId: privateUser.id,
      nickname: "Личен лаптоп HP",
      type: "LAPTOP",
      brand: "HP",
      model: "ProBook 450 G8",
      serialNumber: "5CD1234XYZ",
      os: "Windows 11 Home",
      notes: "Ползва се за лични нужди и уеб сърфиране.",
      isNetworkAsset: false
    }
  });

  const device2 = await prisma.device.create({
    data: {
      companyId: company.id,
      nickname: "Офис Принтер Brother",
      type: "PRINTER",
      brand: "Brother",
      model: "HL-L2350DW",
      serialNumber: "E78901G2H",
      notes: "Свързан по Wi-Fi в офиса, често губи връзка.",
      isNetworkAsset: true
    }
  });

  const device3 = await prisma.device.create({
    data: {
      companyId: company.id,
      nickname: "Основен рутер MikroTik",
      type: "ROUTER",
      brand: "MikroTik",
      model: "hAP ac2",
      serialNumber: "MT990088A",
      notes: "Намира се в разпределителното табло на входа.",
      isNetworkAsset: true
    }
  });

  // 7. Tickets
  await prisma.ticket.deleteMany();
  const ticket1 = await prisma.ticket.create({
    data: {
      ticketNumber: "ALMI-2026-0001",
      customerId: privateUser.id,
      name: privateUser.name,
      email: privateUser.email,
      phone: privateUser.phone,
      clientType: "PRIVATE",
      category: "SOFTWARE",
      service: "softuerna-pomosht",
      deviceType: "LAPTOP",
      deviceRef: device1.id,
      os: device1.os,
      subject: "Outlook не се отваря - дава грешка в профила",
      description: "При опит за стартиране на Microsoft Outlook се появява грешка 'Cannot start Microsoft Outlook. Cannot open the Outlook window.' и програмата се затваря.",
      urgency: "NORMAL",
      priority: "NORMAL",
      contactMethod: "EMAIL",
      supportMethod: "REMOTE",
      status: "READY",
      assignedTechnicianId: tech.id
    }
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      ticketNumber: "ALMI-2026-0002",
      customerId: companyUser.id,
      companyId: company.id,
      name: companyUser.name,
      email: companyUser.email,
      phone: companyUser.phone,
      clientType: "COMPANY",
      category: "NETWORK",
      service: "mrezhi-i-internet",
      deviceType: "ROUTER",
      deviceRef: device3.id,
      subject: "Чести прекъсвания на интернет връзката в целия офис",
      description: "Интернет връзката прекъсва за по 2-3 минути по няколко пъти на ден на всички устройства. MikroTik рутерът изглежда се рестартира или губи сигнал от доставчика.",
      urgency: "HIGH",
      priority: "HIGH",
      contactMethod: "PHONE",
      supportMethod: "ON_SITE",
      preferredDate: "2026-06-25",
      preferredTime: "10:00 - 12:00",
      address: "гр. София, бул. България 45, ет. 4",
      status: "IN_PROGRESS",
      assignedTechnicianId: tech.id
    }
  });

  // 8. Ticket History
  await prisma.ticketStatusHistory.deleteMany();
  await prisma.ticketStatusHistory.create({
    data: {
      ticketId: ticket1.id,
      oldStatus: "RECEIVED",
      newStatus: "DIAGNOSING",
      changedById: tech.id,
      notes: "Започната е проверка на Outlook профила отдалечено."
    }
  });

  await prisma.ticketStatusHistory.create({
    data: {
      ticketId: ticket1.id,
      oldStatus: "DIAGNOSING",
      newStatus: "READY",
      changedById: tech.id,
      notes: "Outlook профилът е пресъздаден и пощата е синхронизирана."
    }
  });

  await prisma.ticketStatusHistory.create({
    data: {
      ticketId: ticket2.id,
      oldStatus: "RECEIVED",
      newStatus: "IN_PROGRESS",
      changedById: admin.id,
      notes: "Разпределена за посещение на място на техник Петров."
    }
  });

  // 9. Ticket Messages
  await prisma.ticketMessage.deleteMany();
  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket1.id,
      senderId: tech.id,
      senderName: tech.name,
      message: "Здравейте, г-н Иванов! Проблемът е отстранен чрез дистанционен достъп. Оказа се повреден .pst файл. Сега Outlook работи коректно.",
      isInternal: false
    }
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket1.id,
      senderId: privateUser.id,
      senderName: privateUser.name,
      message: "Страхотно, много благодаря за бързата реакция! Всичко работи перфектно сега.",
      isInternal: false
    }
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket2.id,
      senderId: tech.id,
      senderName: tech.name,
      message: "Посещението е планирано за четвъртък (25 юни) в 10:00 часа. Моля осигурете достъп до комуникационното табло в офиса.",
      isInternal: false
    }
  });

  // 10. Internal Notes
  await prisma.internalNote.deleteMany();
  await prisma.internalNote.create({
    data: {
      ticketId: ticket2.id,
      changedById: tech.id,
      notes: "Мрежовият доставчик твърди, че няма смущения по трасето. Вероятно MikroTik рутерът прегрява или захранващият му адаптер е пред изгаряне. Нося резервен рутер и захранване за проба."
    }
  });

  // 11. Appointments
  await prisma.appointment.deleteMany();
  await prisma.appointment.create({
    data: {
      ticketId: ticket2.id,
      customerId: companyUser.id,
      assignedTechnicianId: tech.id,
      serviceType: "ON_SITE",
      date: new Date("2026-06-25T07:00:00Z"), // 10:00 Sofia time
      timeSlot: "10:00-11:00",
      locationType: "ON_SITE",
      address: "гр. София, бул. България 45, ет. 4",
      status: "CONFIRMED",
      notes: "Проверка на MikroTik рутер и интернет стабилност в офиса."
    }
  });

  // 12. FAQ Items
  await prisma.fAQItem.deleteMany();
  const faqs = [
    {
      category: "GENERAL",
      questionBg: "Къде се намира Вашият офис?",
      questionEn: "Where is your office located?",
      answerBg: "Нашият физически офис се намира в град София на ул. „Цар Симеон“ 20. Тук приемаме устройства за ремонт след предварителна резервация или обаждане.",
      answerEn: "Our physical office is located in Sofia at Tsar Simeon St 20. We accept devices for repair here by appointment or after a phone call."
    },
    {
      category: "TICKETS",
      questionBg: "Как мога да проследя статуса на моя ремонт?",
      questionEn: "How can I track my repair status?",
      answerBg: "Всяка заявка получава уникален номер (напр. ALMI-2026-0001). Можете да проверите статуса на страницата 'Провери заявка' чрез номера и Вашия имейл, или като влезете в профила си.",
      answerEn: "Every request receives a unique number (e.g. ALMI-2026-0001). You can check its status on the 'Track Ticket' page using the number and your email, or by logging into your profile."
    },
    {
      category: "REPAIRS",
      questionBg: "Колко струва диагностиката на компютър?",
      questionEn: "How much does computer diagnostics cost?",
      answerBg: "Цената за диагностика се определя индивидуално. Ако изберете да извършим ремонта при нас, диагностиката обикновено е безплатна. Конкретните ценови оферти се предоставят след първоначален оглед.",
      answerEn: "The diagnostics fee is determined individually. If you choose to proceed with the repair at our shop, the diagnostics is usually free of charge. Specific quotes are provided after the initial check."
    },
    {
      category: "REMOTE",
      questionBg: "Какво представлява дистанционната помощ?",
      questionEn: "What is remote support?",
      answerBg: "Дистанционната помощ позволява на наш техник да се свърже сигурно през интернет към Вашия компютър чрез AnyDesk или TeamViewer, за да конфигурира софтуер, пощи или мрежови настройки, без да е необходимо посещение на място.",
      answerEn: "Remote support allows our technician to connect securely over the internet to your computer via AnyDesk or TeamViewer to configure software, mail, or network settings, without the need for an on-site visit."
    },
    {
      category: "BUSINESS",
      questionBg: "Какви са предимствата на абонаментната поддръжка за фирма?",
      questionEn: "What are the benefits of subscription support for a business?",
      answerBg: "Абонаментът осигурява една точка за контакт за всички служители, бърза реакция при инциденти, поддържане на история на техническите случаи, превантивно следене на сигурността и планиране на обновяването на компютрите.",
      answerEn: "A subscription provides a single point of contact for all employees, rapid incident response, ticket history logging, preventative security monitoring, and hardware lifecycle planning."
    }
  ];
  for (const f of faqs) {
    await prisma.fAQItem.create({ data: f });
  }

  // 13. Knowledge Articles
  await prisma.knowledgeArticle.deleteMany();
  const articles = [
    {
      slug: "kak-da-predpazim-kompyutara-ot-virusi",
      category: "SECURITY",
      titleBg: "Как да защитим устройствата си от вируси и фишинг?",
      titleEn: "How to protect our devices from viruses and phishing?",
      contentBg: "Фишинг имейлите са най-честата точка за пробив в сигурността на фирмата. За защита се придържайте към следните правила:\n1. Никога не отваряйте прикачени файлове от непознати податели.\n2. Винаги проверявайте реалния имейл на подателя, а не само изписаното име.\n3. Използвайте силни пароли и двуфакторна автентикация (MFA/2FA).\n4. Ако се съмнявате в дадено съобщение, изключете устройството от мрежата и се свържете с IT специалист.",
      contentEn: "Phishing emails are the most common entry point for business security breaches. To protect yourself, follow these baseline rules:\n1. Never open attachments from unknown senders.\n2. Always verify the sender's actual email address, not just the display name.\n3. Use strong passwords and multi-factor authentication (MFA/2FA).\n4. If you suspect a breach, disconnect the device from the network immediately and contact IT support.",
      readingTime: 4
    },
    {
      slug: "baven-kompyutar-optimizaciya-ssd",
      category: "COMPUTERS",
      titleBg: "Защо компютърът работи бавно и как да го ускорим?",
      titleEn: "Why is the computer running slow and how to speed it up?",
      contentBg: "Бавната работа на един компютър най-често се дължи на следните фактори:\n1. Механичен твърд диск (HDD) - замяната му с нов Solid State Drive (SSD) е най-ефективното хардуерно подобрение.\n2. Твърде много програми, които се стартират автоматично с Windows - прегледайте Task Manager -> Startup.\n3. Загряване - прахът вътре в кутията блокира охлаждането и процесорът намалява скоростта си, за да избегне прегряване. Необходима е профилактика в сервиз.",
      contentEn: "Slow computer performance is usually caused by several common factors:\n1. Mechanical hard drive (HDD) - replacing it with a Solid State Drive (SSD) is the single most effective hardware upgrade.\n2. Too many startup programs - review Task Manager -> Startup application lists.\n3. Overheating - dust inside the chassis blocks cooling airflow, causing the CPU to throttle speed to avoid overheating. Physical cleaning and thermal compound replacement are needed.",
      readingTime: 3
    },
    {
      slug: "kakvo-da-pravya-pri-prekasnal-internet",
      category: "NETWORK",
      titleBg: "Какво да проверя, когато интернетът не работи?",
      titleEn: "What to check when the internet is not working?",
      contentBg: "Преди да се свържете с поддръжката, направете тези бързи проверки:\n1. Проверете дали проблемът е на едно устройство или на всички. Ако е на едно, рестартирайте Wi-Fi адаптера или компютъра.\n2. Рестартирайте главния рутер/модем, като го изключите от контакта за 30 секунди.\n3. Вижте дали светодиодите на рутера светят в нормални цветове (обикновено зелено или синьо). Червена или липсваща светлина за 'Internet/WAN' сочи за проблем от доставчика.",
      contentEn: "Before calling technical support, perform these simple checks:\n1. Check if the outage affects one or all devices. If it is only one, restart its Wi-Fi adapter or reboot the machine.\n2. Power-cycle your router/modem by unplugging it from power for 30 seconds.\n3. Look at the router's LED lights. A red or missing 'Internet/WAN' light indicates an ISP connection issue.",
      readingTime: 3
    }
  ];
  for (const a of articles) {
    await prisma.knowledgeArticle.create({ data: a });
  }

  // 14. Quotes
  await prisma.quote.deleteMany();
  const quote = await prisma.quote.create({
    data: {
      quoteNumber: "ALMI-Q-2026-0001",
      companyId: company.id,
      ticketId: ticket2.id,
      status: "SENT",
      expiryDate: new Date("2026-07-23T00:00:00Z"),
      notes: "Индивидуална оферта за ремонт на MikroTik рутер и пренастройка на локалната мрежа в основния офис.",
      terms: "Офертата е валидна 30 дни. Дейностите се извършват на адрес на клиента.",
      totalAmount: 120.00,
      taxAmount: 24.00
    }
  });

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      description: "Диагностика и конфигуриране на MikroTik hAP ac2 мрежов рутер",
      quantity: 1,
      unit: "бр.",
      unitPrice: 60.00,
      lineTotal: 60.00
    }
  });

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      description: "Посещение на адрес в гр. София и подмяна на кабели/захранване",
      quantity: 1,
      unit: "бр.",
      unitPrice: 60.00,
      lineTotal: 60.00
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
