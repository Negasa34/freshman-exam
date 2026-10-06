import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  GraduationCap,
  MapPin,
  Search,
  X,
} from "lucide-react";

const universities = ["Ambo", "AAU", "Jimma", "Hawassa", "ASTU"];

const copy = {
  en: {
    brand: "FRESHMAN EXAMS ET",
    eyebrow: "FRESHMAN PATHWAYS · ETHIOPIA",
    title: "Find a field that fits.",
    subtitle: "Compare study paths, local career directions, and practical preparation guidance across five Ethiopian universities.",
    search: "Search departments or interests...",
    university: "University",
    allUniversities: "All universities",
    streams: ["All streams", "Engineering & Tech", "Health Sciences", "Natural Sciences", "Business & Social"],
    results: "fields",
    availability: "PROGRAM AREAS",
    viewDetails: "Explore field",
    close: "Close details",
    overview: "ABOUT THE FIELD",
    demand: "WHY IT MATTERS IN ETHIOPIA",
    careers: "CAREER DIRECTIONS",
    salary: "INDICATIVE MONTHLY SALARY",
    entry: "Early career",
    experienced: "Experienced",
    month: "month",
    criteria: "FRESHMAN PLACEMENT GUIDANCE",
    salaryNote: "Broad planning estimates in ETB/month, not verified salary survey data. Actual pay varies by employer, region, inflation, qualification, and public/private scale. Confirm against current vacancies.",
    availabilityNote: "Program names and availability are indicative. Confirm current department, campus, and admission requirements in each university's latest prospectus.",
    gpaNote: "There is no single GPA cutoff shared across institutions or years. Placement depends on cohort competition, prerequisite grades, capacity, and current registrar rules. Aim above the minimum and confirm the current cutoff with the university.",
    remoteLabel: "Remote / freelance:",
    publicLabel: "Public sector:",
    privateLabel: "Private sector:",
    emptyTitle: "No matching fields",
    emptyText: "Try another keyword or broaden the filters.",
    clear: "Clear filters",
    guideNav: "Departments",
    examsNav: "Exam archive",
    notesNav: "Study notes",
    closeDialog: "Close department details",
    offeredAt: "Availability is indicative",
  },
  om: {
    brand: "FRESHMAN EXAMS ET",
    eyebrow: "KAROORA BARNOOTAA · ITOOPHIYAA",
    title: "Damee siif malu filadhu.",
    subtitle: "Damee barnootaa, carraa hojii biyya keessaa, fi qajeelfama qophii yunivarsiitii Itoophiyaa shan keessatti wal bira qabi.",
    search: "Damee ykn fedhii barbaadi...",
    university: "Yunivarsiitii",
    allUniversities: "Yunivarsiitii hunda",
    streams: ["Damee hunda", "Injinariingii fi Teeknooloojii", "Saayinsii Fayyaa", "Saayinsii Uumamaa", "Daldalaa fi Hawaasummaa"],
    results: "damee",
    availability: "DAMEEWWAN SAGANTAA",
    viewDetails: "Damee ilaali",
    close: "Odeeffannoo cufi",
    overview: "WAA'EE DAMEE KANAA",
    demand: "ITOOPHIYAA KEESSATTI MAALIIF BARBAACHISA",
    careers: "KAROORA CARAA HOJII",
    salary: "MINDaa JI'AAN KAN TILMAAMAME",
    entry: "Hojii jalqabaa",
    experienced: "Muuxannoo qabu",
    month: "ji'a",
    criteria: "QAJEEFLAMA RAMADAMA BARATTOOTA HAARAA",
    salaryNote: "Tilmaama waliigalaa qophii karooratiif, Birrii Itoophiyaatiin ji'atti; qorannoo mindaa mirkanaa'e miti. Mindaan hojii, naannoo, qaama qacaruu, qaala'iinsa jireenyaa fi sadarkaa barnootaatiin garaagarummaa qaba. Beeksisa hojii yeroo ammaa ilaali.",
    availabilityNote: "Maqaan sagantaa fi argamuun isaa tilmaama waliigalaati. Prospekitasii yunivarsiitii yeroo ammaa irraa damee, mooraa fi ulaagaalee galmee mirkaneessi.",
    gpaNote: "Waggaa fi yunivarsiitii hundaaf GPA murtaa'aa tokko hin jiru. Ramaddiin dorgommii garee, qabxii koorsii duraa, dandeettii fudhachuu fi qajeelfama galmee irratti hundaa'a. GPA gaarii irratti hojjedhu; qabxii yeroo ammaa yunivarsiitii gaafadhu.",
    remoteLabel: "Hojii fagoo / of danda'anii:",
    publicLabel: "Damee mootummaa:",
    privateLabel: "Damee dhuunfaa:",
    emptyTitle: "Damee walsimu hin argamne",
    emptyText: "Jechoota biraa yaali ykn calallii bal'isi.",
    clear: "Calallii qulqulleessi",
    guideNav: "Dameewwan",
    examsNav: "Kuusaa qormaataa",
    notesNav: "Yaadannoo barnootaa",
    closeDialog: "Odeeffannoo damee cufi",
    offeredAt: "Argamuun isaa tilmaama",
  },
  am: {
    brand: "FRESHMAN EXAMS ET",
    eyebrow: "የአንደኛ ዓመት የትምህርት መንገዶች · ኢትዮጵያ",
    title: "ለእርስዎ የሚስማማውን ዘርፍ ይምረጡ።",
    subtitle: "በአምስት የኢትዮጵያ ዩኒቨርሲቲዎች የትምህርት ዘርፎችን፣ የሥራ አቅጣጫዎችን እና የዝግጅት መመሪያን ያወዳድሩ።",
    search: "ዘርፍ ወይም ፍላጎት ይፈልጉ...",
    university: "ዩኒቨርሲቲ",
    allUniversities: "ሁሉም ዩኒቨርሲቲዎች",
    streams: ["ሁሉም ዘርፎች", "ኢንጂነሪንግ እና ቴክኖሎጂ", "የጤና ሳይንስ", "የተፈጥሮ ሳይንስ", "ንግድ እና ማህበራዊ"],
    results: "ዘርፎች",
    availability: "የፕሮግራም ዘርፎች",
    viewDetails: "ዘርፉን ይመልከቱ",
    close: "ዝርዝሩን ዝጋ",
    overview: "ስለ ዘርፉ",
    demand: "በኢትዮጵያ ለምን አስፈላጊ ነው",
    careers: "የሥራ አቅጣጫዎች",
    salary: "ግምታዊ ወርሃዊ ደመወዝ",
    entry: "የመጀመሪያ የሥራ ደረጃ",
    experienced: "ልምድ ያለው",
    month: "ወር",
    criteria: "የአንደኛ ዓመት የዘርፍ ምደባ መመሪያ",
    salaryNote: "በወር በኢትዮጵያ ብር የቀረበ ሰፊ የእቅድ ግምት ነው፤ በተረጋገጠ የደመወዝ ጥናት ላይ አልተመሠረተም። ደመወዝ በአሠሪ፣ በክልል፣ በዋጋ ንረት፣ በብቃት እና በሥራ መስክ ይለያያል። የአሁኑን የሥራ ማስታወቂያ ያረጋግጡ።",
    availabilityNote: "የፕሮግራም ስሞችና መገኘት ግምታዊ ናቸው። የአሁኑን ፕሮስፔክተስ በመመልከት ዘርፉን፣ ግቢውን እና የመግቢያ መስፈርቶችን ያረጋግጡ።",
    gpaNote: "ለሁሉም ዩኒቨርሲቲዎችና ዓመታት አንድ የGPA መቁረጫ የለም። ምደባ በተማሪዎች ውድድር፣ በቅድመ ትምህርት ውጤት፣ በቦታ እና በሬጅስትራር ደንብ ይወሰናል። ከዝቅተኛው በላይ ለማምጣት ይሞክሩ፤ የአሁኑን መስፈርት ከዩኒቨርሲቲው ያረጋግጡ።",
    remoteLabel: "የርቀት / ነፃ ሥራ:",
    publicLabel: "የመንግሥት ዘርፍ:",
    privateLabel: "የግል ዘርፍ:",
    emptyTitle: "የሚዛመድ ዘርፍ አልተገኘም",
    emptyText: "ሌላ ቃል ይሞክሩ ወይም ማጣሪያውን ያስፋፉ።",
    clear: "ማጣሪያዎችን አጽዳ",
    guideNav: "የትምህርት ዘርፎች",
    examsNav: "የፈተና ማህደር",
    notesNav: "የትምህርት ማስታወሻዎች",
    closeDialog: "የዘርፍ ዝርዝር ዝጋ",
    offeredAt: "ግምታዊ መገኘት",
  },
};

const departments = [
  {
    id: "software",
    stream: "engineering",
    universities,
    salary: { entry: "ETB 15,000–35,000", experienced: "ETB 40,000–120,000+" },
    name: { en: "Computer Science & Software Engineering", om: "Saayinsii Kompiitaraa fi Injinariingii Sooftiweerii", am: "ኮምፒውተር ሳይንስ እና ሶፍትዌር ኢንጂነሪንግ" },
    overview: {
      en: "Study programming, algorithms, data, networks, and how to design useful digital systems.",
      om: "Sagantaa kompiitaraa, algoritimii, deetaa fi neetworkii barachuun sirna dijitaalaa fayyadu dizaayinii gochuu.",
      am: "ፕሮግራሚንግ፣ አልጎሪዝም፣ ዳታ፣ ኔትወርክ እና ጠቃሚ ዲጂታል ሥርዓቶችን መንደፍ ያጠናል።",
    },
    demand: {
      en: "Digital public services, fintech, telecom, and local startups need people who can build and maintain reliable software.",
      om: "Tajaajilli mootummaa dijitaalaa, fintech, telekoomii fi dhaabbileen haaraa sooftiweerii amanamaa ijaaruu fi kunuunsuu danda'an barbaadu.",
      am: "ዲጂታል የመንግሥት አገልግሎት፣ ፊንቴክ፣ ቴሌኮም እና ጀማሪ ድርጅቶች አስተማማኝ ሶፍትዌር የሚገነቡ ባለሙያዎችን ይፈልጋሉ።",
    },
    careers: {
      en: "Roles: software developer, QA, data or network associate. Public: digital-service teams. Private: banks, telecom, startups. Remote/freelance work is possible with a strong portfolio, communication skills, and reliable connectivity.",
      om: "Hojii: developer, QA, deetaa ykn neetworkii. Mootummaa: garee tajaajila dijitaalaa. Dhuunfaa: baankii, telekoomii, dhaabbata haaraa. Hojii fagoo/of danda'anii portifoolii cimaa, dandeettii qunnamtii fi interneetii amanamaa barbaada.",
      am: "ሥራዎች፦ ሶፍትዌር ገንቢ፣ QA፣ ዳታ ወይም ኔትወርክ ባለሙያ። መንግሥት፦ ዲጂታል አገልግሎት ቡድኖች። የግል፦ ባንኮች፣ ቴሌኮም፣ ጀማሪ ድርጅቶች። የርቀት/ነፃ ሥራ ጠንካራ ፖርትፎሊዮ፣ የግንኙነት ችሎታ እና አስተማማኝ ኢንተርኔት ሲኖር ይቻላል።",
    },
    requirement: {
      en: "Build a strong foundation in mathematics and logic, then practice consistently. Department placement thresholds change by campus and cohort; check the current registrar notice.",
      om: "Bu'uura herrega fi loojikii cimaa ijaari; itti aansuun yeroo hunda shaakali. Daangaan ramaddii mooraa fi garee barattootaatiin jijjiirama; beeksisa galmee ammaa ilaali.",
      am: "በሂሳብና በሎጂክ ጠንካራ መሠረት ይገንቡ፣ በተከታታይም ይለማመዱ። የምደባ ውጤት መስፈርት በግቢና በተማሪ ቡድን ይለያያል፤ የሬጅስትራር ማስታወቂያን ያረጋግጡ።",
    },
  },
  {
    id: "health",
    stream: "health",
    universities: ["Ambo", "AAU", "Jimma", "Hawassa"],
    salary: { entry: "ETB 10,000–30,000", experienced: "ETB 30,000–100,000+" },
    name: { en: "Medicine & Health Sciences", om: "Qoricha fi Saayinsii Fayyaa", am: "ሕክምና እና የጤና ሳይንስ" },
    overview: {
      en: "Health programs prepare students for patient care, diagnosis, prevention, and community health practice.",
      om: "Sagantaaleen fayyaa kunuunsa dhukkubsataa, qorannoo, ittisa dhukkubaa fi fayyaa hawaasaatiif qopheessu.",
      am: "የጤና ፕሮግራሞች ለታካሚ እንክብካቤ፣ ምርመራ፣ መከላከል እና የማህበረሰብ ጤና ሥራ ያዘጋጃሉ።",
    },
    demand: {
      en: "Primary-care access, maternal and child health, and disease prevention remain essential across urban and rural communities.",
      om: "Tajaajilli fayyaa bu'uuraa, fayyaa haadholii fi daa'immanii, akkasumas ittisni dhukkubaa hawaasa magaalaa fi baadiyyaa keessatti murteessaadha.",
      am: "መሠረታዊ የጤና አገልግሎት፣ የእናቶችና ሕፃናት ጤና እና የበሽታ መከላከል በከተማና በገጠር ማህበረሰቦች ወሳኝ ናቸው።",
    },
    careers: {
      en: "Roles depend on the accredited program and license: clinician, nurse, laboratory or public-health professional. Public: hospitals and health offices. Private: clinics, hospitals, and laboratories. Remote work is limited and usually supports telehealth or research.",
      om: "Hojii fi hayyamni sagantaa ragga'e irratti hundaa'a: ogeessa yaalaa, narsii, laaboraatorii ykn fayyaa uummataa. Mootummaa: hospitaalaa fi waajjira fayyaa. Dhuunfaa: kilinika, hospitaalaa fi laaboraatorii. Hojii fagoo muraasa; yeroo baay'ee telehealth ykn qorannoo deeggera.",
      am: "የሥራ ድርሻና ፈቃድ በተረጋገጠው ፕሮግራም ይወሰናል፦ ሐኪም፣ ነርስ፣ የላቦራቶሪ ወይም የህዝብ ጤና ባለሙያ። መንግሥት፦ ሆስፒታሎችና የጤና ቢሮዎች። የግል፦ ክሊኒኮችና ላቦራቶሪዎች። የርቀት ሥራ ውስን ነው።",
    },
    requirement: {
      en: "Biology, chemistry, and disciplined study habits are useful preparation. Health programs can be highly competitive; confirm program-specific prerequisites, placement rules, and licensing paths.",
      om: "Baayoloojii, keemistirii fi barumsa sirnaan hordofuun gargaara. Sagantaaleen fayyaa dorgommii cimaa qabaachuu danda'u; ulaagaalee, seera ramaddii fi karaa hayyamaa mirkaneessi.",
      am: "ባዮሎጂ፣ ኬሚስትሪ እና በተግባር የሚደረግ ጥናት ጠቃሚ ዝግጅቶች ናቸው። የጤና ፕሮግራሞች ከፍተኛ ውድድር ሊኖራቸው ይችላል፤ የፕሮግራሙን ቅድመ ሁኔታና የፈቃድ መንገድ ያረጋግጡ።",
    },
  },
  {
    id: "engineering",
    stream: "engineering",
    universities,
    salary: { entry: "ETB 12,000–30,000", experienced: "ETB 35,000–90,000+" },
    name: { en: "Civil, Mechanical & Electrical Engineering", om: "Injinariingii Siivilii, Makaanikaa fi Elektirikii", am: "ሲቪል፣ ሜካኒካል እና ኤሌክትሪካል ኢንጂነሪንግ" },
    overview: {
      en: "Engineering applies mathematics and science to infrastructure, machines, energy, and practical systems.",
      om: "Injinariingiin herregaa fi saayinsii bu'uuraalee misoomaa, maashinoota, anniisaa fi sirna hojii irra oolu irratti fayyadama.",
      am: "ኢንጂነሪንግ ሂሳብና ሳይንስን በመጠቀም መሠረተ ልማት፣ ማሽኖች፣ ኃይል እና ተግባራዊ ሥርዓቶችን ይፈጥራል።",
    },
    demand: {
      en: "Roads, housing, water systems, manufacturing, and energy projects need engineers who can design, build, and maintain safely.",
      om: "Daandiin, mana jireenyaa, bishaan, oomisha warshaa fi pirojektiin anniisaa injinaroota nageenyaan dizaayinii, ijaarsa fi suphuu danda'an barbaadu.",
      am: "መንገዶች፣ መኖሪያ ቤቶች፣ የውሃ ሥርዓቶች፣ ማምረቻና የኃይል ፕሮጀክቶች በደህንነት የሚነድፉና የሚገነቡ ኢንጂነሮችን ይፈልጋሉ።",
    },
    careers: {
      en: "Roles: site, design, power, maintenance, and project engineers. Public: infrastructure agencies and utilities. Private: contractors, consultants, manufacturers, and energy firms. Remote drafting/design work exists but is portfolio- and software-dependent.",
      om: "Hojii: injinarii ijaarsaa, dizaayinii, humna elektirikii, suphaa fi pirojektii. Mootummaa: dhaabbilee bu'uuraalee misoomaa fi tajaajila uummataa. Dhuunfaa: kontiraaktaroota, gorsitoota, warshaalee fi dhaabbilee anniisaa. Dizaayiniin fagoo ni jira; portifoolii fi sooftiweerii irratti hundaa'a.",
      am: "ሥራዎች፦ የግንባታ ቦታ፣ ዲዛይን፣ ኃይል፣ ጥገና እና ፕሮጀክት ኢንጂነር። መንግሥት፦ የመሠረተ ልማት ተቋማትና ኃይል አቅራቢዎች። የግል፦ ኮንትራክተሮች፣ አማካሪዎች፣ ፋብሪካዎች። የርቀት ዲዛይን በፖርትፎሊዮና ሶፍትዌር ችሎታ ይወሰናል።",
    },
    requirement: {
      en: "Prioritize mathematics, physics, and technical drawing. Keep project work and safety practice in view. Placement often depends on cohort demand and grades in prerequisite courses.",
      om: "Herrega, fiiziksii fi fakkii teeknikaa irratti xiyyeeffadhu. Hojii pirojektii fi shaakala nageenyaa dagattee hin dhiisin. Ramaddiin fedhii garee fi qabxii koorsii duraa irratti hundaa'a.",
      am: "ሂሳብ፣ ፊዚክስ እና ቴክኒካል ስዕልን ቅድሚያ ይስጡ። የፕሮጀክትና የደህንነት ልምምድን ያጠናክሩ። ምደባ በፍላጎትና በቅድመ ኮርስ ውጤት ሊወሰን ይችላል።",
    },
  },
  {
    id: "natural-sciences",
    stream: "natural",
    universities,
    salary: { entry: "ETB 10,000–25,000", experienced: "ETB 25,000–65,000+" },
    name: { en: "Natural Sciences: Physics, Chemistry & Biology", om: "Saayinsii Uumamaa: Fiiziksii, Keemistirii fi Baayoloojii", am: "የተፈጥሮ ሳይንስ፦ ፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ" },
    overview: {
      en: "Explore matter, energy, living systems, laboratory methods, and evidence-based scientific reasoning.",
      om: "Wantoota, anniisaa, sirna lubbu-qabeeyyii, mala laaboraatorii fi yaada saayinsii ragaa irratti hundaa'e qoradhu.",
      am: "ቁስ፣ ኃይል፣ ሕያዋን ሥርዓቶች፣ የላቦራቶሪ ዘዴዎችና በማስረጃ የተመሠረተ ሳይንሳዊ አስተሳሰብን ያጠናል።",
    },
    demand: {
      en: "Laboratories, education, environmental monitoring, quality testing, and research rely on strong scientific foundations.",
      om: "Laaboraatoriin, barnootni, hordoffiin naannoo, qorannoon qulqullinaa fi qorannoon bu'uura saayinsii cimaa irratti hirkatu.",
      am: "ላቦራቶሪዎች፣ ትምህርት፣ የአካባቢ ክትትል፣ የጥራት ምርመራና ምርምር ጠንካራ ሳይንሳዊ መሠረት ይፈልጋሉ።",
    },
    careers: {
      en: "Roles: laboratory analyst, science teacher (with required credentials), research assistant, or quality/environment officer. Public: schools, labs, and research bodies. Private: manufacturing, food, and testing labs. Remote work is limited; data analysis and tutoring can be flexible paths.",
      om: "Hojii: xiinxalaa laaboraatorii, barsiisaa saayinsii (ragaa barbaachisuun), gargaaraa qorannoo ykn ogeessa qulqullinaa/naannoo. Mootummaa: manneen barnootaa, laaboraatorii fi qaamolee qorannoo. Dhuunfaa: warshaalee nyaataa fi laaboraatorii qorannoo. Hojii fagoo muraasa; xiinxala deetaa fi barsiisni carraa kenna.",
      am: "ሥራዎች፦ የላቦራቶሪ ተንታኝ፣ የሳይንስ መምህር (አስፈላጊው ማረጋገጫ ካለ)፣ የምርምር ረዳት ወይም የጥራት/አካባቢ ባለሙያ። መንግሥት፦ ትምህርት ቤቶችና ምርምር። የግል፦ ፋብሪካዎችና የምርመራ ላቦራቶሪዎች። የርቀት ሥራ ውስን ነው።",
    },
    requirement: {
      en: "Build strong foundations in mathematics and the relevant sciences. Practice careful measurement, lab safety, and clear reporting; check whether a target role requires postgraduate study or certification.",
      om: "Herrega fi saayinsii barbaachisaa irratti bu'uura cimaa ijaari. Safara sirrii, nageenya laaboraatorii fi gabaasa ifa ta'e shaakali; hojii barbaadde digirii olaanaa ykn ragaa dabalataa gaafachuu isaa mirkaneessi.",
      am: "በሂሳብና በተዛማጅ ሳይንሶች ጠንካራ መሠረት ይገንቡ። ትክክለኛ መለኪያ፣ የላቦራቶሪ ደህንነትና ግልጽ ሪፖርት ይለማመዱ፤ ለተመረጠው ሥራ የድህረ ምረቃ ወይም ማረጋገጫ ያስፈልግ እንደሆነ ያረጋግጡ።",
    },
  },
  {
    id: "agriculture",
    stream: "natural",
    universities: ["Ambo", "AAU", "Jimma", "Hawassa"],
    salary: { entry: "ETB 10,000–24,000", experienced: "ETB 25,000–65,000+" },
    name: { en: "Agriculture & Biotechnology", om: "Qonnaa fi Baayoo-teeknooloojii", am: "ግብርና እና ባዮቴክኖሎጂ" },
    overview: {
      en: "Connect crop and livestock science, soil and water management, genetics, and practical biotechnology.",
      om: "Saayinsii midhaanii fi horii, bulchiinsa biyyee fi bishaanii, jeneetiksii fi baayoo-teeknooloojii walitti hidhi.",
      am: "የሰብልና እንስሳት ሳይንስን፣ የአፈርና ውሃ አስተዳደርን፣ ጄኔቲክስን እና ባዮቴክኖሎጂን ያገናኛል።",
    },
    demand: {
      en: "Food security, climate resilience, productivity, and sustainable value chains are central development priorities.",
      om: "Nageenya nyaataa, jijjiirama qilleensaaf dandamachuu, oomishtummaa fi sansalata gatii itti fufaa ta'an dursa misoomaa dha.",
      am: "የምግብ ዋስትና፣ የአየር ንብረት መቋቋም፣ ምርታማነትና ዘላቂ የእሴት ሰንሰለቶች የልማት ቅድሚያዎች ናቸው።",
    },
    careers: {
      en: "Roles: agronomist, extension officer, lab technician, livestock specialist, or food-quality associate. Public: agricultural research and extension services. Private: farms, input suppliers, processors, and agritech. Remote work is uncommon, though GIS/data tasks may be hybrid.",
      om: "Hojii: ogeessa qonnaa, ogeessa tajaajila babal'inaa, teeknikaa laaboraatorii, ogeessa horii ykn qulqullina nyaataa. Mootummaa: qorannoo qonnaa fi tajaajila babal'inaa. Dhuunfaa: qonna, dhiyeessitoota galtee, warshaalee fi agritech. Hojii fagoo muraasa; GIS/deetaan walmakaa ta'uu danda'a.",
      am: "ሥራዎች፦ የእርሻ ባለሙያ፣ የማስፋፊያ ኦፊሰር፣ የላቦራቶሪ ቴክኒሽያን፣ የእንስሳት ባለሙያ ወይም የምግብ ጥራት ባለሙያ። መንግሥት፦ የግብርና ምርምርና ማስፋፊያ። የግል፦ እርሻዎች፣ አቅራቢዎች፣ አቀነባባሪዎች። የርቀት ሥራ ውስን ነው።",
    },
    requirement: {
      en: "Biology, chemistry, and field observation help. Build communication and data-recording skills alongside science; placement depends on campus offerings and cohort rules.",
      om: "Baayoloojii, keemistirii fi ilaallannoon dirree ni gargaara. Saayinsii wajjin dandeettii qunnamtii fi galmeessa deetaa ijaari; ramaddiin sagantaa mooraa fi seera garee irratti hundaa'a.",
      am: "ባዮሎጂ፣ ኬሚስትሪና የመስክ ምልከታ ይጠቅማሉ። ከሳይንስ ጋር የግንኙነትና የዳታ መዝገብ ችሎታን ያዳብሩ፤ ምደባ በግቢው ፕሮግራምና ደንብ ይወሰናል።",
    },
  },
  {
    id: "business",
    stream: "business",
    universities,
    salary: { entry: "ETB 12,000–28,000", experienced: "ETB 30,000–80,000+" },
    name: { en: "Economics & Business", om: "Dinagdee fi Daldala", am: "ኢኮኖሚክስ እና ቢዝነስ" },
    overview: {
      en: "Study how markets, organizations, finance, accounting, and public policy shape decisions and growth.",
      om: "Gabaan, dhaabbileen, faayinaansii, herregni fi imaammanni murtii fi guddina akkamitti akka bocan baradhu.",
      am: "ገበያዎች፣ ድርጅቶች፣ ፋይናንስ፣ ሂሳብ አያያዝና የሕዝብ ፖሊሲ ውሳኔንና እድገትን እንዴት እንደሚቀርጹ ያጠናል።",
    },
    demand: {
      en: "Organizations need people who can interpret financial information, understand customers, evaluate projects, and improve operations.",
      om: "Dhaabbileen namoota odeeffannoo faayinaansii hiikuu, maamiltoota hubachuu, pirojektii madaaluu fi hojii fooyyessuu danda'an barbaadu.",
      am: "ድርጅቶች የፋይናንስ መረጃን የሚተረጉሙ፣ ደንበኛን የሚረዱ፣ ፕሮጀክትን የሚገመግሙና ሥራን የሚያሻሽሉ ሰዎችን ይፈልጋሉ።",
    },
    careers: {
      en: "Roles: accountant, analyst, auditor, banker, market researcher, or business operator. Public: planning, revenue, and finance offices. Private: banks, insurers, NGOs, and companies. Remote work is possible in bookkeeping, analysis, and consulting with relevant tools.",
      om: "Hojii: herregaa, xiinxalaa, auditorii, baankii, qorataa gabaa ykn bulchaa daldalaa. Mootummaa: waajjira karooraa, galii fi faayinaansii. Dhuunfaa: baankii, inshuraansii, NGO fi dhaabbilee. Hojii fagoo herrega, xiinxala fi gorsa keessatti meeshaalee barbaachisoo waliin ni danda'ama.",
      am: "ሥራዎች፦ የሂሳብ ባለሙያ፣ ተንታኝ፣ ኦዲተር፣ የባንክ ባለሙያ፣ የገበያ ተመራማሪ ወይም ኦፕሬሽን አስተዳዳሪ። መንግሥት፦ የዕቅድ፣ ገቢና ፋይናንስ ቢሮዎች። የግል፦ ባንኮች፣ ኢንሹራንስ፣ NGOዎችና ኩባንያዎች። በተገቢ መሣሪያ የርቀት የሂሳብና የትንተና ሥራ ይቻላል።",
    },
    requirement: {
      en: "Strengthen mathematics, writing, spreadsheets, and clear presentation. Compare program titles carefully: economics, accounting, management, and business administration have different course mixes.",
      om: "Herrega, barreessuu, spreadsheet fi dhiyeessa ifa ta'e cimsadhu. Maqaa sagantaa sirriitti wal bira qabi: dinagdee, herrega, bulchiinsa fi bulchiinsa daldalaa koorsii adda addaa qabu.",
      am: "ሂሳብ፣ ጽሑፍ፣ ስፕሬድሺትና ግልጽ ማቅረብን ያጠናክሩ። የፕሮግራም ስሞችን በጥንቃቄ ያወዳድሩ፤ ኢኮኖሚክስ፣ አካውንቲንግ፣ ማኔጅመንትና ቢዝነስ አድሚኒስትሬሽን የተለያዩ ኮርሶች አሏቸው።",
    },
  },
  {
    id: "law",
    stream: "business",
    universities: ["Ambo", "AAU", "Jimma", "Hawassa"],
    salary: { entry: "ETB 10,000–28,000", experienced: "ETB 25,000–80,000+" },
    name: { en: "Law", om: "Seeraa", am: "ሕግ" },
    overview: {
      en: "Law examines legal systems, rights, institutions, dispute resolution, and the careful interpretation of rules.",
      om: "Seerri sirna seeraa, mirga, dhaabbata, hiika falmii fi dambii of-eeggannoodhaan hubachuu qorata.",
      am: "ሕግ የሕግ ሥርዓቶችን፣ መብቶችን፣ ተቋማትን፣ የክርክር መፍትሔንና ደንቦችን በጥንቃቄ መተርጎምን ያጠናል።",
    },
    demand: {
      en: "Courts, public institutions, businesses, and communities need accessible legal information and fair, accountable processes.",
      om: "Mana murtii, dhaabbileen mootummaa, daldalli fi hawaasni odeeffannoo seeraa salphaa fi adeemsa haqaa itti gaafatamummaa qabu barbaadu.",
      am: "ፍርድ ቤቶች፣ የመንግሥት ተቋማት፣ ንግዶችና ማህበረሰቦች ተደራሽ የሕግ መረጃና ፍትሃዊ ሂደቶችን ይፈልጋሉ።",
    },
    careers: {
      en: "Roles may include legal researcher, court or public-service officer, compliance associate, or advocate after meeting licensing rules. Public: justice institutions. Private: firms, companies, NGOs. Remote work suits research, document review, and compliance; legal practice is jurisdiction-bound.",
      om: "Hojii: qorataa seeraa, ogeessa mana murtii/tajaajila uummataa, compliance ykn abukaatoo erga ulaagaalee hayyamaa guuteen. Mootummaa: dhaabbilee haqaa. Dhuunfaa: waajjiraalee, dhaabbilee fi NGO. Qorannoo fi sakatta'iinsi galmee fagoodhaan ni danda'ama; hojii abukaatummaa seera biyyaatiin daangeffama.",
      am: "ሥራዎች፦ የሕግ ተመራማሪ፣ የፍርድ ቤት/የሕዝብ አገልግሎት ኦፊሰር፣ የተገዢነት ረዳት ወይም የፈቃድ መስፈርትን ካሟሉ ጠበቃ። መንግሥት፦ የፍትህ ተቋማት። የግል፦ የሕግ ቢሮዎች፣ ኩባንያዎች፣ NGOዎች። ምርምርና ሰነድ ግምገማ በርቀት ይቻላል፤ የሕግ ሥራ በአገር ሕግ ይገደባል።",
    },
    requirement: {
      en: "Practice close reading, structured writing, debate, and evidence-based argument. Admission and professional licensing are separate stages; check each institution's current rules.",
      om: "Dubbisa gadi-fagoo, barreessuu sirna qabu, falmii fi ragaa irratti hundaa'uu shaakali. Seensi yunivarsiitii fi hayyamni hojii sadarkaa adda addaati; dambii yeroo ammaa mirkaneessi.",
      am: "በጥልቀት ማንበብ፣ በሥርዓት መጻፍ፣ መከራከርና በማስረጃ መደገፍን ይለማመዱ። የዩኒቨርሲቲ መግቢያና የሙያ ፈቃድ የተለያዩ ደረጃዎች ናቸው፤ የአሁኑን ደንብ ያረጋግጡ።",
    },
  },
  {
    id: "psychology",
    stream: "business",
    universities: ["Ambo", "AAU", "Jimma", "Hawassa"],
    salary: { entry: "ETB 10,000–25,000", experienced: "ETB 25,000–65,000+" },
    name: { en: "Psychology", om: "Xiinsammuu", am: "ሳይኮሎጂ" },
    overview: {
      en: "Psychology studies behavior, learning, development, mental processes, and how people respond to their environments.",
      om: "Xiinsammi amala, barumsa, guddina, adeemsa sammuu fi namoonni naannoo isaanii irratti akkamitti akka deebisan qorata.",
      am: "ሳይኮሎጂ ባህሪን፣ ትምህርትን፣ እድገትን፣ የአእምሮ ሂደቶችንና ሰዎች ለአካባቢያቸው የሚሰጡትን ምላሽ ያጠናል።",
    },
    demand: {
      en: "Schools, workplaces, health programs, and social services benefit from evidence-informed support for learning and well-being.",
      om: "Manneen barnootaa, iddoowwan hojii, sagantaaleen fayyaa fi tajaajilli hawaasaa deeggarsa barumsaa fi fayyaa sammuu ragaa irratti hundaa'e irraa fayyadamu.",
      am: "ትምህርት ቤቶች፣ የሥራ ቦታዎች፣ የጤና ፕሮግራሞችና ማህበራዊ አገልግሎቶች በማስረጃ የተደገፈ የትምህርትና የደህንነት ድጋፍ ይፈልጋሉ።",
    },
    careers: {
      en: "Roles: research assistant, school or organizational support, HR, or community-program associate. Public: education and social-service programs. Private: NGOs, HR teams, and research groups. Independent counseling requires the appropriate advanced qualification and professional authorization.",
      om: "Hojii: gargaaraa qorannoo, deeggarsa mana barumsaa/dhaabbataa, HR ykn sagantaa hawaasaa. Mootummaa: barnoota fi tajaajila hawaasaa. Dhuunfaa: NGO, garee HR fi qorannoo. Gorsa dhuunfaa kennuun barnoota olaanaa fi hayyama ogummaa barbaada.",
      am: "ሥራዎች፦ የምርምር ረዳት፣ የትምህርት ቤት/ድርጅት ድጋፍ፣ HR ወይም የማህበረሰብ ፕሮግራም ረዳት። መንግሥት፦ ትምህርትና ማህበራዊ አገልግሎት። የግል፦ NGOዎች፣ HR ቡድኖችና ምርምር። ገለልተኛ የምክር አገልግሎት ተገቢ ከፍተኛ ትምህርትና ፈቃድ ይፈልጋል።",
    },
    requirement: {
      en: "Build statistics, research methods, listening, and ethical reasoning. Many specialist counseling roles require postgraduate training; verify scope-of-practice rules before choosing a path.",
      om: "Istatistiksii, mala qorannoo, dhaggeeffachuu fi yaada naamusaa cimsadhu. Hojii gorsaa ogummaa hedduun barnoota digrii olaanaa barbaada; daangaa hojii mirkaneessi.",
      am: "ስታቲስቲክስ፣ የምርምር ዘዴ፣ ማዳመጥና ሥነ ምግባራዊ አስተሳሰብን ያጠናክሩ። ብዙ የምክር ሙያዎች የድህረ ምረቃ ትምህርት ይፈልጋሉ፤ የሥራ ወሰንን ያረጋግጡ።",
    },
  },
];

const streamKeys = ["all", "engineering", "health", "natural", "business"];

function DepartmentDetails({ department, language, labels, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#132824]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="max-h-[94svh] w-full max-w-3xl overflow-y-auto bg-[#f8f9f4] shadow-2xl sm:max-h-[90svh]" role="dialog" aria-modal="true" aria-labelledby="department-detail-title">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#dfe5dc] bg-[#f8f9f4]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="min-w-0"><p className="font-mono text-[8px] tracking-[.14em] text-[#718078]">{labels.availability}</p><h2 id="department-detail-title" className="mt-1 font-serif text-xl leading-snug text-[#203832] sm:text-2xl">{department.name[language]}</h2></div>
          <button className="grid h-9 w-9 shrink-0 place-items-center border border-[#dce3dc] text-[#536a5f] transition hover:bg-white" type="button" onClick={onClose} aria-label={labels.closeDialog}><X size={17} /></button>
        </header>
        <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-sm leading-7 text-[#52645a]">{department.overview[language]}</p>
          <section><h3 className="font-mono text-[9px] font-semibold tracking-[.12em] text-[#75847c]">{labels.demand}</h3><p className="mt-2 text-sm leading-7 text-[#43584b]">{department.demand[language]}</p></section>
          <section><h3 className="font-mono text-[9px] font-semibold tracking-[.12em] text-[#75847c]">{labels.careers}</h3><p className="mt-2 text-sm leading-7 text-[#43584b]">{department.careers[language]}</p></section>
          <section>
            <h3 className="font-mono text-[9px] font-semibold tracking-[.12em] text-[#75847c]">{labels.salary}</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="border border-[#dfe5dc] bg-white px-3.5 py-3"><p className="text-[10px] text-[#79877f]">{labels.entry}</p><p className="mt-1 font-serif text-lg text-[#285c4d]">{department.salary.entry}<span className="ml-1 font-sans text-[10px] text-[#79877f]">/ {labels.month}</span></p></div>
              <div className="border border-[#dfe5dc] bg-white px-3.5 py-3"><p className="text-[10px] text-[#79877f]">{labels.experienced}</p><p className="mt-1 font-serif text-lg text-[#285c4d]">{department.salary.experienced}<span className="ml-1 font-sans text-[10px] text-[#79877f]">/ {labels.month}</span></p></div>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#7d8981]">{labels.salaryNote}</p>
          </section>
          <section><h3 className="font-mono text-[9px] font-semibold tracking-[.12em] text-[#75847c]">{labels.criteria}</h3><p className="mt-2 border-l-2 border-[#c78661] pl-3 text-sm leading-7 text-[#43584b]">{department.requirement[language]}</p><p className="mt-2 text-[10px] leading-relaxed text-[#7d8981]">{labels.gpaNote}</p></section>
          <section><h3 className="font-mono text-[9px] font-semibold tracking-[.12em] text-[#75847c]">{labels.availability}</h3><div className="mt-2 flex flex-wrap gap-1.5">{department.universities.map((university) => <span className="inline-flex items-center gap-1.5 border border-[#dce5dc] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#456252]" key={university}><Check size={11} />{university}</span>)}</div><p className="mt-2 text-[10px] leading-relaxed text-[#7d8981]">{labels.availabilityNote}</p></section>
        </div>
      </section>
    </div>
  );
}

function DepartmentCard({ department, language, labels, onOpen }) {
  return (
    <article className="flex min-h-66 flex-col border border-[#dce3dc] bg-[#fbfcf8] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#b7cabe] hover:shadow-[0_10px_26px_rgba(25,50,40,.08)] sm:p-5">
      <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center bg-[#e9f0e8] text-[#347363]"><GraduationCap size={20} /></span><span className="font-mono text-[8px] uppercase tracking-widest text-[#809087]">{labels.streams[streamKeys.indexOf(department.stream)]}</span></div>
      <h2 className="mt-4 font-serif text-lg leading-snug text-[#213a33]">{department.name[language]}</h2>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#738078]">{department.overview[language]}</p>
      <div className="mt-auto pt-4">
        <div className="mb-3 flex items-center gap-1.5 text-[9px] font-medium text-[#718078]"><Building2 size={12} />{labels.availability}<span className="ml-auto text-[#a26c50]">{labels.offeredAt}</span></div>
        <div className="flex flex-wrap gap-1">{department.universities.map((university) => <span className="border border-[#dce5dc] bg-white px-1.5 py-1 text-[8px] text-[#516c5c]" key={university}>{university}</span>)}</div>
        <button className="mt-4 inline-flex min-h-9 w-full items-center justify-between border border-[#c7d7cb] bg-[#f4f8f1] px-3 text-[10px] font-semibold text-[#285f50] transition hover:border-[#84a895] hover:bg-[#eaf2e9]" type="button" onClick={onOpen}>{labels.viewDetails}<ArrowRight size={14} /></button>
      </div>
    </article>
  );
}

export default function DepartmentGuide({ onBrowseExams, onBrowseNotes, onBackToAuth }) {
  const [language, setLanguage] = useState("en");
  const [activeStream, setActiveStream] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [search, setSearch] = useState("");
  const [activeDepartment, setActiveDepartment] = useState(null);
  const labels = copy[language];

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return departments.filter((department) => {
      const searchable = `${department.name.en} ${department.name.om} ${department.name.am} ${department.overview.en} ${department.overview.om} ${department.overview.am}`.toLocaleLowerCase();
      return (!query || searchable.includes(query))
        && (activeStream === "all" || department.stream === activeStream)
        && (selectedUniversity === "all" || department.universities.includes(selectedUniversity));
    });
  }, [activeStream, search, selectedUniversity]);

  return (
    <div className="min-h-screen bg-[#f2f4ee] font-sans text-[#172a28]">
      <div className="flex min-h-8 items-center justify-center gap-2 bg-[#1a302d] px-3 py-1.5 text-center font-mono text-[8px] tracking-wide text-[#e7eee7] sm:text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-[#e1ad62]" />{labels.eyebrow}</div>
      <header className="flex min-h-17 items-center justify-between gap-3 border-b border-[#dfe4dd] bg-[#fbfcf8] px-4 sm:px-7 lg:px-[max(6.5vw,calc((100vw-1320px)/2))]">
        <button className="flex shrink-0 items-center gap-2.5 text-left text-[#172a28]" type="button" onClick={onBackToAuth} aria-label="Freshman Exams ET home"><span className="grid h-9 w-9 place-items-center bg-[#1d4841] text-[#f0f0dc]"><GraduationCap size={20} /></span><span className="text-[16px] font-bold leading-tight sm:text-lg">freshman<span className="text-[#c86c50]">.</span><small className="block font-mono text-[8px] font-normal tracking-[.2em] text-[#7a8880]">EXAMS ET</small></span></button>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <button className="text-xs text-[#67756e] transition hover:text-[#172a28]" type="button" onClick={onBrowseExams}>{labels.examsNav}</button>
          <button className="text-xs text-[#67756e] transition hover:text-[#172a28]" type="button" onClick={onBrowseNotes}>{labels.notesNav}</button>
          <span className="relative grid h-17 place-items-center text-xs font-semibold text-[#203832] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#187566]">{labels.guideNav}</span>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button className="inline-flex items-center gap-1 border border-[#bacbc2] px-2 py-2 text-[9px] font-semibold text-[#24584d] transition hover:bg-[#edf4ee] sm:px-2.5" type="button" onClick={onBrowseExams} aria-label={labels.examsNav}><ArrowLeft size={12} /><span className="hidden sm:inline">{labels.examsNav}</span></button>
          <button className="hidden items-center gap-1 border border-[#bacbc2] px-2.5 py-2 text-[9px] font-semibold text-[#24584d] transition hover:bg-[#edf4ee] sm:inline-flex" type="button" onClick={onBrowseNotes}>{labels.notesNav}</button>
          <div className="flex items-center gap-0.5 border border-[#dce3dc] bg-white p-0.5" role="tablist" aria-label="Choose language">
            {[{ id: "om", text: "OM" }, { id: "en", text: "EN" }, { id: "am", text: "AM" }].map((option) => <button className={`min-h-7 min-w-8 px-1.5 font-mono text-[9px] font-semibold transition ${language === option.id ? "bg-[#225d4f] text-white" : "text-[#728078] hover:bg-[#edf3ec]"}`} type="button" role="tab" aria-selected={language === option.id} key={option.id} onClick={() => setLanguage(option.id)}>{option.text}</button>)}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#1c3935] px-5 py-10 text-[#f1f0e2] sm:px-9 sm:py-12 lg:px-[max(9.3vw,calc((100vw-1240px)/2))]">
          <div className="pointer-events-none absolute -right-28 -top-44 h-96 w-96 rounded-full border border-white/8 shadow-[0_0_0_48px_rgba(207,222,195,.025),0_0_0_96px_rgba(207,222,195,.018)] sm:right-[12%]" />
          <div className="relative mx-auto flex max-w-310 flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-3xl"><p className="mb-3 flex items-center gap-2 font-mono text-[8px] tracking-[.13em] text-[#c6d6c6] sm:text-[9px]"><span className="h-px w-5 bg-[#d29167]" />{labels.eyebrow}</p><h1 className="font-serif text-[38px] font-medium leading-[1.08] text-[#f4f1e6] sm:text-[52px]">{labels.title}</h1><p className="mt-3 max-w-2xl text-[11px] leading-7 text-[#c0cec3] sm:text-xs">{labels.subtitle}</p></div>
            <div className="grid grid-cols-2 gap-4 border-l border-white/25 pl-4 md:min-w-56"><div><span className="block font-serif text-2xl text-[#f4f1e6]">05</span><span className="font-mono text-[7px] tracking-[.08em] text-[#afc2b2]">UNIVERSITIES</span></div><div><span className="block font-serif text-2xl text-[#f4f1e6]">08</span><span className="font-mono text-[7px] tracking-[.08em] text-[#afc2b2]">FIELDS</span></div></div>
          </div>
        </section>

        <section className="mx-auto w-[calc(100%-32px)] max-w-280 pb-8 sm:w-[calc(100%-48px)]">
          <div className="mt-5 flex flex-col border border-[#dce1d9] bg-[#fbfcf8] md:min-h-14.5 md:flex-row md:items-center">
            <label className="flex min-h-12 flex-1 items-center gap-2.5 px-3.5 text-[#6e827a] sm:px-4"><Search size={17} /><span className="sr-only">{labels.search}</span><input className="w-full min-w-0 border-0 bg-transparent text-xs text-[#283a34] outline-none placeholder:text-[#8a9790] focus:ring-0" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={labels.search} type="search" /></label>
            <div className="flex min-h-11.5 items-center gap-2 border-t border-[#e3e8e0] px-3 md:min-h-14.5 md:border-l md:border-t-0 md:px-4"><MapPin className="shrink-0 text-[#71817a]" size={14} /><label className="sr-only" htmlFor="department-university">{labels.university}</label><select id="department-university" className="w-full min-w-0 border-0 bg-transparent py-2 pr-5 text-[10px] text-[#364840] outline-none focus:ring-0 sm:w-40" value={selectedUniversity} onChange={(event) => setSelectedUniversity(event.target.value)}><option value="all">{labels.allUniversities}</option>{universities.map((university) => <option key={university} value={university}>{university === "AAU" ? "Addis Ababa University (AAU)" : university === "ASTU" ? "Adama Science and Technology (ASTU)" : `${university} University`}</option>)}</select><ChevronDown aria-hidden="true" size={13} className="-ml-5 pointer-events-none text-[#819087]" /></div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 font-mono text-[8px] tracking-[.12em] text-[#75847c]">{labels.availability}</p><h2 className="font-serif text-2xl text-[#203832]">{filteredDepartments.length} {labels.results}</h2></div><p className="max-w-xl text-[10px] leading-relaxed text-[#7b8981]">{labels.availabilityNote}</p></div>

          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-[#dce3dc]" role="tablist" aria-label="Filter departments by stream">
            {streamKeys.map((stream, index) => <button className={`relative min-h-10 shrink-0 px-3 text-[10px] transition sm:px-4 ${activeStream === stream ? "font-semibold text-[#234b3e] after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-[#307364] sm:after:inset-x-4" : "text-[#89948b] hover:text-[#365c4d]"}`} type="button" role="tab" aria-selected={activeStream === stream} key={stream} onClick={() => setActiveStream(stream)}>{labels.streams[index]}</button>)}
          </div>

          {filteredDepartments.length ? <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{filteredDepartments.map((department) => <DepartmentCard key={department.id} department={department} language={language} labels={labels} onOpen={() => setActiveDepartment(department)} />)}</div> : <div className="mt-4 flex min-h-56 flex-col items-center justify-center border border-dashed border-[#cbd7cc] bg-[#fbfcf8]/70 px-5 text-center"><span className="grid h-11 w-11 place-items-center bg-[#e8f0e8] text-[#668477]"><Search size={21} /></span><h3 className="mt-3 font-serif text-xl text-[#28453b]">{labels.emptyTitle}</h3><p className="mt-1 text-[11px] text-[#75847c]">{labels.emptyText}</p><button className="mt-4 border border-[#bed0c3] px-3 py-2 text-[10px] font-semibold text-[#306957] hover:bg-[#edf4ed]" type="button" onClick={() => { setSearch(""); setSelectedUniversity("all"); setActiveStream("all"); }}>{labels.clear}</button></div>}

          <div className="mt-6 border-l-2 border-[#c78661] bg-[#f8f7f0] px-3.5 py-3 text-[10px] leading-relaxed text-[#6e7a71]">{labels.salaryNote} <span className="mt-1 block">{labels.gpaNote}</span></div>
          <footer className="mt-7 flex justify-between gap-3 border-t border-[#dbe2da] py-4 font-mono text-[7px] tracking-widest text-[#7e8980]"><span>{labels.brand} · CAREER GUIDE</span><span>ETHIOPIA</span></footer>
        </section>
      </main>
      {activeDepartment && <DepartmentDetails department={activeDepartment} language={language} labels={labels} onClose={() => setActiveDepartment(null)} />}
    </div>
  );
}