// ===== ТГМУ MedLib — логика приложения =====

const LS_MATERIALS = 'tgmu_materials_v1';
const LS_FAVS = 'tgmu_favs_v1';
const LS_USER = 'tgmu_user_v1';

let materials = loadMaterials();
let favorites = JSON.parse(localStorage.getItem(LS_FAVS) || '[]');
let user = JSON.parse(localStorage.getItem(LS_USER) || 'null');
let currentPage = 'home';
let listView = false;
let filters = { types:new Set(), faculties:new Set(), dept:'', langs:new Set(), search:'', sort:'popular' };
let pendingFile = null;

function loadMaterials(){
  const saved = localStorage.getItem(LS_MATERIALS);
  if(saved) return JSON.parse(saved);
  localStorage.setItem(LS_MATERIALS, JSON.stringify(SEED_MATERIALS));
  return [...SEED_MATERIALS];
}
function saveMaterials(){ localStorage.setItem(LS_MATERIALS, JSON.stringify(materials)); }
function saveFavs(){ localStorage.setItem(LS_FAVS, JSON.stringify(favorites)); }

const $ = id => document.getElementById(id);
const facName = id => (FACULTIES.find(f=>f.id===id)||{}).name || id;
const deptName = (fid,did) => ((DEPARTMENTS[fid]||[]).find(d=>d.id===did)||{}).name || did;
const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---------- Навигация ----------
function showPage(page){
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-'+page).classList.add('active');
  document.querySelectorAll('#mainNav a').forEach(a => a.classList.toggle('active', a.dataset.page===page));
  $('mainNav').classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
  if(page==='catalog') renderCatalog();
  if(page==='favorites') renderFavorites();
  if(page==='profile') renderProfile();
  if(page==='admin') renderAdmin();
  if(page==='faculties') renderFaculties();
}

// ---------- Рендер карточек ----------
function cardHTML(m){
  const t = TYPES[m.type] || TYPES.lecture;
  const fav = favorites.includes(m.id);
  return `<article class="card" onclick="openMaterial('${m.id}')">
    <div class="card-top">
      <span class="card-icon" style="background:${t.color}">${t.icon}</span>
      <h3>${esc(m.title)}</h3>
      <button class="fav-btn ${fav?'on':''}" title="В избранное" onclick="toggleFav(event,'${m.id}')">${fav?'★':'☆'}</button>
    </div>
    <div class="card-meta">
      <span>🎓 ${esc(facName(m.faculty))}</span>
      <span>🏛 ${esc(deptName(m.faculty,m.dept))}</span>
    </div>
    <div class="card-tags">
      <span class="tag">${t.name}</span><span class="tag">${LANGS[m.lang]||m.lang}</span>
      ${(m.tags||[]).slice(0,3).map(tg=>`<span class="tag">#${esc(tg)}</span>`).join('')}
      ${m.status==='pending'?'<span class="badge-pending">⏳ На модерации</span>':''}
    </div>
    <div class="card-foot">
      <span>⭐ ${m.rating||'—'} · ⬇ ${m.downloads||0}</span>
      <span class="dl">${esc(m.size||'')}</span>
    </div>
  </article>`;
}
function renderGrid(elId, list){
  const el = $(elId);
  el.innerHTML = list.map(cardHTML).join('');
}

// ---------- Главная ----------
function renderHome(){
  const approved = materials.filter(m=>m.status==='approved');
  const totalDl = approved.reduce((s,m)=>s+(m.downloads||0),0);
  $('heroStats').innerHTML = `
    <div><b>${approved.length}</b><span>материалов</span></div>
    <div><b>${FACULTIES.length}</b><span>факультетов</span></div>
    <div><b>${Object.values(DEPARTMENTS).flat().length}</b><span>кафедр</span></div>
    <div><b>${totalDl.toLocaleString('ru-RU')}</b><span>скачиваний</span></div>`;

  $('typeGrid').innerHTML = Object.entries(TYPES).map(([key,t])=>{
    const n = approved.filter(m=>m.type===key).length;
    return `<div class="type-card" onclick="filterByType('${key}')">
      <span class="t-icon">${t.icon}</span><b>${t.name}</b><span>${n} материалов</span></div>`;
  }).join('');

  renderGrid('popularGrid', [...approved].sort((a,b)=>(b.downloads||0)-(a.downloads||0)).slice(0,6));
  renderGrid('recentGrid', [...approved].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6));
  $('facPreview').innerHTML = FACULTIES.map(f=>{
    const n = approved.filter(m=>m.faculty===f.id).length;
    return `<div class="fac-card" onclick="filterByFaculty('${f.id}')">
      <span class="f-icon">${f.icon}</span><h3>${f.name}</h3><p>${f.desc}</p>
      <span class="f-stats">${n} материалов · ${DEPARTMENTS[f.id].length} кафедр</span></div>`;
  }).join('');
}

// ---------- Каталог и фильтры ----------
function buildFilters(){
  $('filterTypes').innerHTML = Object.entries(TYPES).map(([k,t])=>
    `<label><input type="checkbox" value="${k}" onchange="toggleFilterSet('types','${k}',this.checked)"> ${t.icon} ${t.name}</label>`).join('');
  $('filterFaculties').innerHTML = FACULTIES.map(f=>
    `<label><input type="checkbox" value="${f.id}" onchange="toggleFilterSet('faculties','${f.id}',this.checked)"> ${f.icon} ${f.name}</label>`).join('');
  $('filterLangs').innerHTML = Object.entries(LANGS).map(([k,v])=>
    `<label><input type="checkbox" value="${k}" onchange="toggleFilterSet('langs','${k}',this.checked)"> ${v}</label>`).join('');
  $('filterDept').innerHTML = '<option value="">Все кафедры</option>' +
    Object.values(DEPARTMENTS).flat().map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  $('upFaculty').innerHTML = FACULTIES.map(f=>`<option value="${f.id}">${f.name}</option>`).join('');
  fillDeptSelect('upDept', FACULTIES[0].id);
}
function fillDeptSelect(id, fid){
  $(id).innerHTML = (DEPARTMENTS[fid]||[]).map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
}
function toggleFilterSet(key, val, on){ on ? filters[key].add(val) : filters[key].delete(val); applyFilters(); }
function applyFilters(){
  filters.dept = $('filterDept').value;
  filters.sort = $('sortSelect').value;
  renderCatalog();
}
function resetFilters(){
  filters = { types:new Set(), faculties:new Set(), dept:'', langs:new Set(), search:'', sort:'popular' };
  document.querySelectorAll('#filtersPanel input[type=checkbox]').forEach(c=>c.checked=false);
  $('filterDept').value=''; $('sortSelect').value='popular';
  $('globalSearch').value=''; $('heroSearch').value='';
  renderCatalog();
}
function getFiltered(){
  let list = materials.filter(m=>{
    if(m.status!=='approved' && (!user || user.role!=='admin')) return false;
    if(filters.types.size && !filters.types.has(m.type)) return false;
    if(filters.faculties.size && !filters.faculties.has(m.faculty)) return false;
    if(filters.dept && m.dept!==filters.dept) return false;
    if(filters.langs.size && !filters.langs.has(m.lang)) return false;
    if(filters.search){
      const q = filters.search.toLowerCase();
      const hay = (m.title+' '+m.desc+' '+(m.tags||[]).join(' ')+' '+facName(m.faculty)+' '+deptName(m.faculty,m.dept)).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    popular:(a,b)=>(b.downloads||0)-(a.downloads||0),
    new:(a,b)=>new Date(b.date)-new Date(a.date),
    rating:(a,b)=>(b.rating||0)-(a.rating||0),
    az:(a,b)=>a.title.localeCompare(b.title,'ru'),
  };
  return list.sort(by[filters.sort]||by.popular);
}
function renderCatalog(){
  const list = getFiltered();
  const grid = $('catalogGrid');
  grid.classList.toggle('list-view', listView);
  grid.innerHTML = list.map(cardHTML).join('');
  $('catalogEmpty').hidden = list.length>0;
  $('resultsCount').textContent = `Найдено: ${list.length}`;
  const parts = [];
  if(filters.search) parts.push(`«${filters.search}»`);
  if(filters.faculties.size) parts.push([...filters.faculties].map(facName).join(', '));
  if(filters.types.size) parts.push([...filters.types].map(k=>TYPES[k].name).join(', '));
  $('catalogTitle').textContent = parts.length ? 'Результаты: '+parts.join(' · ') : 'Каталог материалов';
}
function toggleView(){ listView=!listView; $('viewToggle').textContent = listView?'⊞ Сетка':'☰ Список'; renderCatalog(); }
function filterByType(t){ resetFilters(); filters.types.add(t); document.querySelector(`#filterTypes input[value="${t}"]`).checked=true; showPage('catalog'); }
function filterByFaculty(f){ resetFilters(); filters.faculties.add(f); document.querySelector(`#filterFaculties input[value="${f}"]`).checked=true; showPage('catalog'); }
function quickSearch(q){ filters.search=q; $('globalSearch').value=q; showPage('catalog'); }
function heroSearchGo(){ filters.search=$('heroSearch').value.trim(); $('globalSearch').value=filters.search; showPage('catalog'); }
function onGlobalSearch(v){ filters.search=v.trim(); if(currentPage!=='catalog') showPage('catalog'); else renderCatalog(); }

// ---------- Факультеты ----------
function renderFaculties(){
  const approved = materials.filter(m=>m.status==='approved');
  $('facGrid').innerHTML = FACULTIES.map(f=>{
    const n = approved.filter(m=>m.faculty===f.id).length;
    return `<div class="fac-card" onclick="openFaculty('${f.id}')">
      <span class="f-icon">${f.icon}</span><h3>${f.name}</h3><p>${f.desc}</p>
      <span class="f-stats">${n} материалов · ${DEPARTMENTS[f.id].length} кафедр →</span></div>`;
  }).join('');
}
function openFaculty(fid){
  const f = FACULTIES.find(x=>x.id===fid);
  const approved = materials.filter(m=>m.status==='approved');
  $('deptSection').hidden = false;
  $('deptTitle').textContent = f.icon+' '+f.name;
  $('deptList').innerHTML = DEPARTMENTS[fid].map(d=>{
    const n = approved.filter(m=>m.dept===d.id).length;
    return `<div class="dept-item" onclick="filterByDept('${d.id}')"><b>${d.name}</b><span>${n} материалов</span></div>`;
  }).join('');
  $('deptSection').scrollIntoView({behavior:'smooth'});
}
function filterByDept(did){ resetFilters(); filters.dept=did; $('filterDept').value=did; showPage('catalog'); }

// ---------- Материал: просмотр ----------
function openMaterial(id){
  const m = materials.find(x=>x.id===id); if(!m) return;
  const t = TYPES[m.type]||TYPES.lecture;
  $('materialModalBody').innerHTML = `
    <div class="mat-head">
      <span class="card-icon" style="background:${t.color}">${t.icon}</span>
      <div><h2 style="font-size:20px;line-height:1.3">${esc(m.title)}</h2>
      <div style="color:var(--muted);font-size:14px;margin-top:4px">${t.name} · ${LANGS[m.lang]||m.lang} · ${esc(m.size||'')}</div></div>
    </div>
    <p>${esc(m.desc||'Описание не указано.')}</p>
    <div class="mat-meta">
      <div><span>Факультет</span>${esc(facName(m.faculty))}</div>
      <div><span>Кафедра</span>${esc(deptName(m.faculty,m.dept))}</div>
      <div><span>Автор</span>${esc(m.author||'—')}</div>
      <div><span>Добавлен</span>${new Date(m.date).toLocaleDateString('ru-RU')}</div>
      <div><span>Рейтинг</span>⭐ ${m.rating||'—'}</div>
      <div><span>Скачиваний</span>⬇ ${m.downloads||0}</div>
    </div>
    <div class="card-tags">${(m.tags||[]).map(tg=>`<span class="tag">#${esc(tg)}</span>`).join('')}</div>
    <div class="mat-actions">
      <button class="btn btn-primary btn-lg" onclick="downloadMaterial('${m.id}')">⬇ Скачать</button>
      <button class="btn btn-ghost" onclick="toggleFav(event,'${m.id}');openMaterial('${m.id}')">${favorites.includes(m.id)?'★ В избранном':'☆ В избранное'}</button>
      <button class="btn btn-ghost" onclick="shareMaterial('${m.id}')">🔗 Поделиться</button>
    </div>`;
  $('materialModal').hidden = false;
}
function downloadMaterial(id){
  const m = materials.find(x=>x.id===id); if(!m) return;
  m.downloads = (m.downloads||0)+1; saveMaterials();
  // Демо-скачивание: текстовый файл-описание (в боевом режиме — сам загруженный файл)
  const blob = new Blob([`ТГМУ MedLib\n\n${m.title}\nТип: ${TYPES[m.type].name}\nФакультет: ${facName(m.faculty)}\nКафедра: ${deptName(m.faculty,m.dept)}\nАвтор: ${m.author||'—'}\n\n${m.desc||''}\n\n(Демо-версия портала: здесь будет скачиваться загруженный файл)`], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = m.title.slice(0,60)+'.txt'; a.click();
  URL.revokeObjectURL(a.href);
  toast('⬇ Скачивание началось: '+m.title, 'success');
  openMaterial(id); renderHome();
}
function shareMaterial(id){
  const url = location.origin + location.pathname + '#material-' + id;
  if(navigator.clipboard) navigator.clipboard.writeText(url).catch(()=>{});
  toast('🔗 Ссылка скопирована: '+url, 'success');
}
function toggleFav(e, id){
  e.stopPropagation();
  const i = favorites.indexOf(id);
  if(i>=0){ favorites.splice(i,1); toast('Удалено из избранного'); }
  else { favorites.push(id); toast('⭐ Добавлено в избранное','success'); }
  saveFavs();
  if(currentPage==='home') renderHome();
  if(currentPage==='catalog') renderCatalog();
  if(currentPage==='favorites') renderFavorites();
}
function renderFavorites(){
  const list = materials.filter(m=>favorites.includes(m.id));
  renderGrid('favGrid', list);
  $('favEmpty').hidden = list.length>0;
}

// ---------- Загрузка ----------
const dz = $('dropzone');
dz.addEventListener('click', ()=>$('fileInput').click());
dz.addEventListener('dragover', e=>{ e.preventDefault(); dz.classList.add('drag'); });
dz.addEventListener('dragleave', ()=>dz.classList.remove('drag'));
dz.addEventListener('drop', e=>{ e.preventDefault(); dz.classList.remove('drag'); onFilePicked(e.dataTransfer.files[0]); });
function onFilePicked(file){
  if(!file) return;
  if(file.size > 100*1024*1024){ toast('❌ Файл больше 100 МБ','error'); return; }
  pendingFile = file;
  $('dzFile').hidden = false;
  $('dzFile').textContent = `📎 ${file.name} (${(file.size/1024/1024).toFixed(1)} МБ)`;
  if(!$('upTitle').value) $('upTitle').value = file.name.replace(/\.[^.]+$/,'');
}
function submitUpload(e){
  e.preventDefault();
  const m = {
    id:'u'+Date.now(),
    title:$('upTitle').value.trim(),
    type:$('upType').value,
    faculty:$('upFaculty').value,
    dept:$('upDept').value,
    lang:$('upLang').value,
    author:$('upAuthor').value.trim()||(user?user.name:'Гость'),
    desc:$('upDesc').value.trim(),
    tags:$('upTags').value.split(',').map(s=>s.trim()).filter(Boolean),
    size: pendingFile ? (pendingFile.size/1024/1024).toFixed(1)+' МБ' : '—',
    downloads:0, rating:0,
    date:new Date().toISOString().slice(0,10),
    status: (user && user.role==='admin') ? 'approved' : 'pending',
  };
  materials.unshift(m); saveMaterials();
  $('uploadForm').reset(); pendingFile=null; $('dzFile').hidden=true;
  toast(m.status==='approved' ? '✅ Материал опубликован!' : '⏳ Материал отправлен на модерацию', 'success');
  showPage('catalog');
}

// ---------- Авторизация (демо) ----------
function openAuth(){ $('authModal').hidden = false; }
function doAuth(role){
  const names = { student:'Азиз Рахимов (студент, 3 курс)', teacher:'д.м.н. Саидова (преподаватель)', admin:'Администратор MedLib' };
  user = { role, name:names[role] };
  localStorage.setItem(LS_USER, JSON.stringify(user));
  closeModal('authModal'); updateAuthUI();
  toast('👋 Добро пожаловать, '+user.name, 'success');
  if(role==='admin') showPage('admin'); else showPage('profile');
}
function logout(){
  user=null; localStorage.removeItem(LS_USER); updateAuthUI();
  toast('Вы вышли из аккаунта'); showPage('home');
}
function updateAuthUI(){
  const b = $('authBtn');
  if(user){ b.textContent = '👤 '+user.name.split(' ')[0]; b.onclick = ()=>showPage(user.role==='admin'?'admin':'profile'); }
  else { b.textContent='Войти'; b.onclick = openAuth; }
}

// ---------- Профиль ----------
function renderProfile(){
  if(!user){ $('profileContent').innerHTML = `<div class="empty"><div class="empty-icon">🔐</div><h3>Требуется вход</h3><p>Войдите, чтобы видеть свой профиль</p><button class="btn btn-primary" onclick="openAuth()">Войти</button></div>`; return; }
  const mine = materials.filter(m=>m.author===user.name);
  const roleName = {student:'Студент',teacher:'Преподаватель',admin:'Администратор'}[user.role];
  $('profileContent').innerHTML = `
    <div class="profile-grid">
      <div class="stat-card"><b>${user.name.split(' ')[0]}</b><span>Роль: ${roleName}</span></div>
      <div class="stat-card"><b>${favorites.length}</b><span>в избранном</span></div>
      <div class="stat-card"><b>${mine.length}</b><span>загружено мной</span></div>
      <div class="stat-card"><b>${mine.reduce((s,m)=>s+(m.downloads||0),0)}</b><span>скачиваний моих файлов</span></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px">
      <button class="btn btn-primary" onclick="showPage('upload')">＋ Загрузить материал</button>
      <button class="btn btn-ghost" onclick="showPage('favorites')">⭐ Избранное</button>
      ${user.role==='admin'?'<button class="btn btn-ghost" onclick="showPage(\'admin\')">🛡 Админ-панель</button>':''}
      <button class="btn btn-danger" onclick="logout()">Выйти</button>
    </div>
    <h3 style="margin-bottom:14px">Мои материалы</h3>
    <div class="cards-grid">${mine.map(cardHTML).join('')||'<p style="color:var(--muted)">Вы пока ничего не загружали</p>'}</div>`;
}

// ---------- Админка ----------
function renderAdmin(){
  if(!user || user.role!=='admin'){ $('adminContent').innerHTML = `<div class="empty"><div class="empty-icon">🛡</div><h3>Доступ запрещён</h3><p>Войдите как администратор</p><button class="btn btn-primary" onclick="openAuth()">Войти</button></div>`; return; }
  const pending = materials.filter(m=>m.status==='pending');
  const totalDl = materials.reduce((s,m)=>s+(m.downloads||0),0);
  $('adminContent').innerHTML = `
    <div class="profile-grid">
      <div class="stat-card"><b>${materials.length}</b><span>всего материалов</span></div>
      <div class="stat-card"><b>${pending.length}</b><span>на модерации</span></div>
      <div class="stat-card"><b>${totalDl.toLocaleString('ru-RU')}</b><span>скачиваний</span></div>
      <div class="stat-card"><b>${favorites.length}</b><span>избранных отметок</span></div>
    </div>
    <h3 style="margin-bottom:14px">⏳ Ожидают модерации (${pending.length})</h3>
    ${pending.length ? `<table class="admin-table"><tr><th>Название</th><th>Тип</th><th>Факультет</th><th>Автор</th><th>Действия</th></tr>
      ${pending.map(m=>`<tr><td>${esc(m.title)}</td><td>${TYPES[m.type].name}</td><td>${esc(facName(m.faculty))}</td><td>${esc(m.author)}</td>
      <td><button class="btn btn-primary btn-sm" onclick="moderate('${m.id}','approved')">✓ Одобрить</button>
      <button class="btn btn-danger btn-sm" onclick="moderate('${m.id}','rejected')">✕ Отклонить</button></td></tr>`).join('')}</table>`
    : '<p style="color:var(--muted);margin-bottom:24px">Новых материалов нет</p>'}
    <h3 style="margin:24px 0 14px">Все материалы</h3>
    <table class="admin-table"><tr><th>Название</th><th>Тип</th><th>Скачивания</th><th>Статус</th><th></th></tr>
      ${materials.map(m=>`<tr><td>${esc(m.title)}</td><td>${TYPES[m.type].name}</td><td>${m.downloads||0}</td>
      <td>${m.status==='approved'?'✅ Опубликован':'⏳ Модерация'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="moderate('${m.id}','deleted')">🗑 Удалить</button></td></tr>`).join('')}</table>`;
}
function moderate(id, action){
  if(action==='deleted'){ materials = materials.filter(m=>m.id!==id); toast('🗑 Материал удалён'); }
  else { const m = materials.find(x=>x.id===id); if(m) m.status = action; toast(action==='approved'?'✅ Материал одобрен':'Материал отклонён'); }
  saveMaterials(); renderAdmin(); renderHome();
}

// ---------- Утилиты ----------
function closeModal(id){ $(id).hidden = true; }
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click', e=>{ if(e.target===m) m.hidden=true; }));
function toast(msg, type){
  const t = document.createElement('div');
  t.className = 'toast '+(type||''); t.textContent = msg;
  $('toasts').appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}
function toggleMobileNav(){ $('mainNav').classList.toggle('open'); }

// ---------- Старт ----------
buildFilters();
renderHome();
updateAuthUI();
