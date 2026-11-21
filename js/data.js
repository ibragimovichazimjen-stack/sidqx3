// ===== ТГМУ MedLib — данные портала =====

const FACULTIES = [
  { id:'lechebny',   name:'Лечебный факультет',            icon:'🩺', desc:'Подготовка врачей-лечебников по всем клиническим специальностям' },
  { id:'pediatr',    name:'Педиатрический факультет',      icon:'👶', desc:'Детская медицина: педиатрия, неонатология, детская хирургия' },
  { id:'stomat',     name:'Стоматологический факультет',  icon:'🦷', desc:'Стоматология, челюстно-лицевая хирургия, ортодонтия' },
  { id:'farm',       name:'Фармацевтический факультет',    icon:'💊', desc:'Фармация, фармакология, фармацевтическая технология' },
  { id:'medprof',    name:'Медико-профилактический факультет', icon:'🛡', desc:'Гигиена, эпидемиология, общественное здоровье' },
  { id:'sestr',      name:'Факультет сестринского дела',   icon:'👩‍⚕️', desc:'Сестринское дело, уход за больными, медсестринская практика' },
];

const DEPARTMENTS = {
  lechebny: [
    { id:'anatomy',   name:'Кафедра анатомии человека' },
    { id:'histology', name:'Кафедра гистологии' },
    { id:'physio',    name:'Кафедра нормальной физиологии' },
    { id:'biochem',   name:'Кафедра биологической химии' },
    { id:'pathanat',  name:'Кафедра патологической анатомии' },
    { id:'therapy',   name:'Кафедра терапии' },
    { id:'surgery',   name:'Кафедра общей хирургии' },
    { id:'obgyn',     name:'Кафедра акушерства и гинекологии' },
    { id:'neuro',     name:'Кафедра неврологии' },
    { id:'cardio',    name:'Кафедра кардиологии' },
  ],
  pediatr: [
    { id:'pediatr1',  name:'Кафедра педиатрии' },
    { id:'neonat',    name:'Кафедра неонатологии' },
    { id:'childsurg', name:'Кафедра детской хирургии' },
    { id:'childinf',  name:'Кафедра детских инфекционных болезней' },
  ],
  stomat: [
    { id:'therstom',  name:'Кафедра терапевтической стоматологии' },
    { id:'surgstom',  name:'Кафедра хирургической стоматологии' },
    { id:'orthodont', name:'Кафедра ортодонтии' },
  ],
  farm: [
    { id:'pharmacol', name:'Кафедра фармакологии' },
    { id:'pharmtech', name:'Кафедра фармацевтической технологии' },
    { id:'pharmchem', name:'Кафедра фармацевтической химии' },
  ],
  medprof: [
    { id:'hygiene',   name:'Кафедра гигиены' },
    { id:'epid',      name:'Кафедра эпидемиологии' },
    { id:'pubhealth', name:'Кафедра общественного здоровья' },
  ],
  sestr: [
    { id:'nursing',   name:'Кафедра сестринского дела' },
    { id:'care',      name:'Кафедра ухода за больными' },
  ],
};

const TYPES = {
  lecture:      { name:'Лекции',       icon:'📖', color:'#ccfbf1' },
  presentation: { name:'Презентации',  icon:'📊', color:'#dbeafe' },
  textbook:     { name:'Учебники',     icon:'📚', color:'#fef3c7' },
  method:       { name:'Методички',    icon:'📝', color:'#fce7f3' },
  test:         { name:'Тесты',        icon:'✅', color:'#dcfce7' },
  video:        { name:'Видео',        icon:'🎬', color:'#ede9fe' },
  atlas:        { name:'Атласы',       icon:'🖼', color:'#ffedd5' },
  notes:        { name:'Конспекты',    icon:'🗒', color:'#e0e7ff' },
};

const LANGS = { ru:'Русский', tg:'Таджикский', en:'English' };

// ===== Стартовые материалы (демо-данные) =====
const SEED_MATERIALS = [
  { id:'m1',  title:'Анатомия человека. Лекции по остеологии', type:'lecture', faculty:'lechebny', dept:'anatomy', lang:'ru', author:'Кафедра анатомии', size:'12.4 МБ', downloads:3421, rating:4.9, date:'2026-11-10', tags:['анатомия','кости','лекция'], desc:'Полный курс лекций по остеологии: строение костей, суставы, соединения. С схемами и таблицами.', status:'approved' },
  { id:'m2',  title:'Атлас анатомии человека (Ибн Сина)', type:'atlas', faculty:'lechebny', dept:'anatomy', lang:'ru', author:'ТГМУ', size:'86 МБ', downloads:5102, rating:5.0, date:'2026-10-02', tags:['атлас','анатомия','иллюстрации'], desc:'Иллюстрированный атлас с подробными подписями на русском и таджикском языках.', status:'approved' },
  { id:'m3',  title:'Фармакология: конспект лекций', type:'notes', faculty:'farm', dept:'pharmacol', lang:'ru', author:'Кафедра фармакологии', size:'4.1 МБ', downloads:2876, rating:4.8, date:'2026-11-15', tags:['фармакология','лекарства','конспект'], desc:'Сжатый конспект по основным группам лекарственных препаратов с дозировками.', status:'approved' },
  { id:'m4',  title:'Хирургия. Презентация: асептика и антисептика', type:'presentation', faculty:'lechebny', dept:'surgery', lang:'ru', author:'Кафедра общей хирургии', size:'18.7 МБ', downloads:1934, rating:4.7, date:'2026-11-05', tags:['хирургия','асептика','презентация'], desc:'Презентация к практическому занятию: правила стерилизации, обработка рук хирурга.', status:'approved' },
  { id:'m5',  title:'Педиатрия. Методичка по уходу за новорождённым', type:'method', faculty:'pediatr', dept:'neonat', lang:'tg', author:'Кафедра неонатологии', size:'3.2 МБ', downloads:1543, rating:4.6, date:'2026-11-18', tags:['педиатрия','неонатология','методичка'], desc:'Методические указания на таджикском языке: кормление, гигиена, профилактика заболеваний.', status:'approved' },
  { id:'m6',  title:'Тесты по гистологии (300 вопросов)', type:'test', faculty:'lechebny', dept:'histology', lang:'ru', author:'Кафедра гистологии', size:'1.8 МБ', downloads:4210, rating:4.9, date:'2026-11-01', tags:['гистология','тесты','экзамен'], desc:'Банк тестов для подготовки к экзамену с ответами и пояснениями.', status:'approved' },
  { id:'m7',  title:'Стоматология. Лекция: кариес и его осложнения', type:'lecture', faculty:'stomat', dept:'therstom', lang:'ru', author:'Кафедра терапевтической стоматологии', size:'9.6 МБ', downloads:987, rating:4.5, date:'2026-10-20', tags:['стоматология','кариес','лекция'], desc:'Классификация кариеса, методы диагностики и лечения на современном этапе.', status:'approved' },
  { id:'m8',  title:'Биохимия. Учебник для 2 курса', type:'textbook', faculty:'lechebny', dept:'biochem', lang:'ru', author:'Кафедра биологической химии', size:'42 МБ', downloads:2654, rating:4.8, date:'2026-09-15', tags:['биохимия','учебник','2 курс'], desc:'Полный учебник: обмен белков, углеводов, липидов, ферменты, витамины.', status:'approved' },
  { id:'m9',  title:'Видео: техника в/в инъекции', type:'video', faculty:'sestr', dept:'nursing', lang:'ru', author:'Факультет сестринского дела', size:'156 МБ', downloads:3210, rating:4.9, date:'2026-11-12', tags:['видео','инъекции','практика'], desc:'Обучающее видео с пошаговой демонстрацией внутривенной инъекции.', status:'approved' },
  { id:'m10', title:'Эпидемиология. Презентация: профилактика инфекций', type:'presentation', faculty:'medprof', dept:'epid', lang:'tg', author:'Кафедра эпидемиологии', size:'11.3 МБ', downloads:876, rating:4.4, date:'2026-11-08', tags:['эпидемиология','профилактика','презентация'], desc:'Презентация на таджикском языке о мерах профилактики инфекционных заболеваний.', status:'approved' },
  { id:'m11', title:'Физиология. Конспект по нервной системе', type:'notes', faculty:'lechebny', dept:'physio', lang:'ru', author:'Кафедра физиологии', size:'5.5 МБ', downloads:2109, rating:4.7, date:'2026-11-14', tags:['физиология','нервная система','конспект'], desc:'Конспект лекций: рефлексы, высшая нервная деятельность, анализаторы.', status:'approved' },
  { id:'m12', title:'Акушерство. Методичка: ведение родов', type:'method', faculty:'lechebny', dept:'obgyn', lang:'ru', author:'Кафедра акушерства и гинекологии', size:'7.9 МБ', downloads:1432, rating:4.8, date:'2026-10-28', tags:['акушерство','роды','методичка'], desc:'Методические указания по ведению физиологических родов и послеродовому периоду.', status:'approved' },
  { id:'m13', title:'Кардиология. Лекции по ЭКГ', type:'lecture', faculty:'lechebny', dept:'cardio', lang:'ru', author:'Кафедра кардиологии', size:'14.2 МБ', downloads:1876, rating:4.9, date:'2026-11-16', tags:['кардиология','экг','лекция'], desc:'Чтение электрокардиограммы: норма, аритмии, инфаркт миокарда.', status:'approved' },
  { id:'m14', title:'Фармацевтическая технология. Лабораторный практикум', type:'method', faculty:'farm', dept:'pharmtech', lang:'ru', author:'Кафедра фармтехнологии', size:'6.4 МБ', downloads:654, rating:4.3, date:'2026-10-10', tags:['фармтехнология','лаборатория','практикум'], desc:'Методичка лабораторных работ: приготовление растворов, мазей, таблеток.', status:'approved' },
  { id:'m15', title:'Тесты по анатомии для 1 курса', type:'test', faculty:'lechebny', dept:'anatomy', lang:'ru', author:'Кафедра анатомии', size:'2.1 МБ', downloads:3890, rating:4.8, date:'2026-11-19', tags:['анатомия','тесты','1 курс'], desc:'500 тестовых заданий с ключами для самоподготовки.', status:'approved' },
  { id:'m16', title:'Детская хирургия. Атлас операций', type:'atlas', faculty:'pediatr', dept:'childsurg', lang:'ru', author:'Кафедра детской хирургии', size:'64 МБ', downloads:723, rating:4.6, date:'2026-09-30', tags:['детская хирургия','атлас','операции'], desc:'Иллюстрированный атлас основных операций у детей.', status:'approved' },
  { id:'m17', title:'Гигиена. Учебник для медико-профилактического факультета', type:'textbook', faculty:'medprof', dept:'hygiene', lang:'tg', author:'Кафедра гигиены', size:'38 МБ', downloads:1102, rating:4.5, date:'2026-10-05', tags:['гигиена','учебник','профилактика'], desc:'Учебник на таджикском языке по общей и коммунальной гигиене.', status:'approved' },
  { id:'m18', title:'Неврология. Презентация: инсульт', type:'presentation', faculty:'lechebny', dept:'neuro', lang:'ru', author:'Кафедра неврологии', size:'13.8 МБ', downloads:1298, rating:4.7, date:'2026-11-11', tags:['неврология','инсульт','презентация'], desc:'Клиника, диагностика и лечение острого нарушения мозгового кровообращения.', status:'approved' },
  { id:'m19', title:'Патологическая анатомия. Лекции', type:'lecture', faculty:'lechebny', dept:'pathanat', lang:'ru', author:'Кафедра патологической анатомии', size:'16.5 МБ', downloads:1654, rating:4.6, date:'2026-10-22', tags:['патанатомия','лекция','морфология'], desc:'Курс лекций по общей и частной патологической анатомии.', status:'approved' },
  { id:'m20', title:'Уход за больными. Видеоуроки (серия)', type:'video', faculty:'sestr', dept:'care', lang:'tg', author:'Кафедра ухода за больными', size:'210 МБ', downloads:987, rating:4.8, date:'2026-11-17', tags:['видео','уход','сестринское дело'], desc:'Серия видеоуроков на таджикском языке по уходу за пациентами.', status:'approved' },
  { id:'m21', title:'Терапия. Конспект по болезням органов дыхания', type:'notes', faculty:'lechebny', dept:'therapy', lang:'ru', author:'Кафедра терапии', size:'8.3 МБ', downloads:2210, rating:4.7, date:'2026-11-13', tags:['терапия','лёгкие','конспект'], desc:'Пневмония, бронхит, астма: клиника, диагностика, лечение.', status:'approved' },
  { id:'m22', title:'Ортодонтия. Презентация: брекет-системы', type:'presentation', faculty:'stomat', dept:'orthodont', lang:'ru', author:'Кафедра ортодонтии', size:'10.1 МБ', downloads:543, rating:4.4, date:'2026-10-18', tags:['ортодонтия','брекеты','презентация'], desc:'Виды брекет-систем, этапы ортодонтического лечения.', status:'approved' },
  { id:'m23', title:'Фармацевтическая химия. Методичка', type:'method', faculty:'farm', dept:'pharmchem', lang:'ru', author:'Кафедра фармхимии', size:'5.9 МБ', downloads:432, rating:4.2, date:'2026-10-08', tags:['фармхимия','методичка','анализ'], desc:'Методические указания по анализу лекарственных средств.', status:'approved' },
  { id:'m24', title:'Общественное здоровье. Лекции', type:'lecture', faculty:'medprof', dept:'pubhealth', lang:'ru', author:'Кафедра общественного здоровья', size:'9.8 МБ', downloads:765, rating:4.5, date:'2026-11-03', tags:['общественное здоровье','лекция','организация'], desc:'Организация здравоохранения в Таджикистане, статистика здоровья населения.', status:'approved' },
];
