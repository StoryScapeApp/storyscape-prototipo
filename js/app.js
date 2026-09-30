/* StoryScape MVP · navegación y visualización sin dependencias de ejecución. */
(() => {
  const app = document.getElementById("app");
  const credentials = { email: "docente@storyscape.edu.pe", password: "Story2026" };
  const state = { authenticated: sessionStorage.getItem("storyscape-auth") === "true", search: "", progressStudentId: "EST-001", menuOpen: false };
  const icons = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const studentById = id => students.find(student => student.id === id);
  const sectionById = id => sections.find(section => section.id === id);
  const byNewest = (a, b) => b.finalizedAt.localeCompare(a.finalizedAt);
  const studentSessions = id => sessions.filter(session => session.studentId === id).sort((a, b) => a.finalizedAt.localeCompare(b.finalizedAt));
  const lastSession = id => studentSessions(id).at(-1);
  const average = (items, key) => items.length ? Math.round(items.reduce((sum, item) => sum + item[key], 0) / items.length) : 0;
  const dateShort = value => new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
  const dateFull = value => new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value));
  const avatar = student => `<span class="avatar ${student.color}">${student.initials}</span>`;
  const titleBlock = (eyebrow, title, description = "") => `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${description ? `<p>${description}</p>` : ""}</div></div>`;
  const bookSection = (sectionId, label = "Sección") => `<div class="book-reference"><span>${icons("book")} ${book.title}</span><span>${label}: <strong>${sectionById(sectionId).title}</strong></span></div>`;
  const scoreCard = (label, value, variant = "violet") => `<article class="score-card ${variant}"><div class="score-card-top"><span>${label}</span><span class="score-dot"></span></div><strong>${value}%</strong><div class="meter"><span style="width:${value}%"></span></div></article>`;

  function shell(content, active) {
    const links = [
      ["dashboard", "grid", "Dashboard"], ["estudiantes", "users", "Estudiantes"],
      ["sesiones", "clock", "Sesiones"], ["progreso", "chart", "Progreso"]
    ];
    app.innerHTML = `<div class="app-shell">
      <div class="mobile-shade ${state.menuOpen ? "visible" : ""}" data-action="close-menu"></div>
      <aside class="sidebar ${state.menuOpen ? "open" : ""}" aria-label="Navegación principal">
        <a class="brand" href="#dashboard"><span class="brand-mark">${icons("book")}<i></i></span><span><strong>StoryScape</strong><small>Panel docente</small></span></a>
        <div class="sidebar-label">ESPACIO DE TRABAJO</div>
        <nav>${links.map(([route, icon, label]) => `<a href="#${route}" class="nav-link ${active === route ? "active" : ""}" ${active === route ? 'aria-current="page"' : ""}>${icons(icon)}<span>${label}</span>${active === route ? '<i class="active-rail"></i>' : ""}</a>`).join("")}</nav>
        <div class="sidebar-bottom"><div class="pilot-card"><span class="pilot-icon">${icons("spark")}</span><strong>Un libro, una historia</strong><p>Seguimiento de las secciones del libro piloto.</p></div><button type="button" class="nav-link logout" data-action="logout">${icons("logout")}<span>Cerrar sesión</span></button></div>
      </aside>
      <div class="main-wrap"><header class="topbar"><button type="button" class="icon-button menu-button" aria-label="Abrir menú" aria-expanded="false" data-action="toggle-menu">${icons("menu")}</button><div class="topbar-context"><span class="status-dot"></span> Prototipo docente <span class="topbar-divider">/</span> <strong>${active.charAt(0).toUpperCase() + active.slice(1)}</strong></div><div class="topbar-user"><span class="teacher-avatar">DP</span><span><strong>Docente piloto</strong><small>Cuenta de demostración</small></span></div></header><main id="main-content" class="main-content">${content}</main><footer class="footer">StoryScape · Prototipo docente MVP <span>Datos simulados para fines de prototipado</span></footer></div>
    </div>`;
  }

  function login(error = "") {
    app.innerHTML = `<main class="login-page"><div class="login-art"><div class="login-orbit orbit-one"></div><div class="login-orbit orbit-two"></div><div class="login-art-inner"><span class="login-art-badge">${icons("spark")} STORYSCAPE · MVP</span><div class="login-book">${icons("book")}</div><h2>Una historia, nuevas formas de comprender.</h2><p>Una mirada clara al progreso de comprensión lectora de tus estudiantes.</p><div class="login-art-foot"><span class="tiny-line"></span> Un libro piloto · Cuatro secciones</div></div></div><div class="login-form-side"><div class="login-form-wrap"><div class="login-mobile-brand"><span class="brand-mark">${icons("book")}</span><strong>StoryScape</strong></div><span class="login-eyebrow">BIENVENIDO DE NUEVO</span><h1>Accede a tu panel docente</h1><p class="login-subtitle">Consulta sesiones, respuestas y progreso de comprensión en un solo lugar.</p><form id="login-form" novalidate><label for="email">Correo electrónico</label><input id="email" name="email" type="email" autocomplete="username" placeholder="docente@storyscape.edu.pe" required><label for="password">Contraseña</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Ingresa tu contraseña" required>${error ? `<p class="form-error" role="alert">${error}</p>` : ""}<button class="primary-button login-submit" type="submit">Ingresar al dashboard ${icons("arrow")}</button></form><div class="demo-note"><span>${icons("spark")}</span><div><strong>Acceso de demostración</strong><p>Usa las credenciales indicadas en el README.</p></div></div><small class="login-bottom">Prototipo académico · Datos simulados</small></div></div></main>`;
    document.getElementById("login-form").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      if (form.get("email").toString().trim().toLowerCase() === credentials.email && form.get("password") === credentials.password) {
        sessionStorage.setItem("storyscape-auth", "true"); state.authenticated = true; location.hash = "#dashboard"; render();
      } else login("Las credenciales no coinciden. Revisa el correo y la contraseña de la demo.");
    });
  }

  function dashboard() {
    const recent = [...sessions].sort(byNewest).slice(0, 5);
    const overall = average(sessions, "globalScore");
    shell(`${titleBlock("VISTA GENERAL", "Dashboard", "Un panorama del aprendizaje a través del libro piloto.")}
      <section class="hero"><div class="hero-copy"><span class="hero-kicker">${icons("spark")} SEGUIMIENTO ACADÉMICO</span><h2>Lectura que se convierte en comprensión.</h2><p>Explora las sesiones y acompaña el progreso de cada estudiante en las secciones de ${book.title}.</p><a href="#estudiantes" class="hero-link">Ver estudiantes ${icons("arrow")}</a></div><div class="hero-graphic" aria-hidden="true"><div class="hero-ring ring-outer"></div><div class="hero-ring ring-inner"></div><span class="hero-book">${icons("book")}</span><span class="hero-star star-one">✦</span><span class="hero-star star-two">✧</span></div></section>
      <section class="stats-grid" aria-label="Resumen"><article class="stat-card"><div class="stat-icon violet">${icons("users")}</div><span>Estudiantes registrados</span><strong>${students.length.toString().padStart(2, "0")}</strong><small>En seguimiento</small></article><article class="stat-card"><div class="stat-icon blue">${icons("book")}</div><span>Sesiones realizadas</span><strong>${sessions.length.toString().padStart(2, "0")}</strong><small>Del libro piloto</small></article><article class="stat-card"><div class="stat-icon pink">${icons("chart")}</div><span>Comprensión general promedio</span><strong>${overall}%</strong><small>Dato simulado de las sesiones</small></article></section>
      <section class="dashboard-grid"><article class="panel activity-panel"><div class="section-head"><div><span class="eyebrow">REGISTRO RECIENTE</span><h2>Actividad reciente</h2></div><a href="#sesiones" class="text-link">Ver todas ${icons("arrow")}</a></div><div class="activity-list">${recent.map(session => { const student = studentById(session.studentId); return `<a class="activity-item" href="#sesion/${session.id}"><div class="activity-avatar">${avatar(student)}</div><div class="activity-body"><div class="activity-title"><strong>${student.name}</strong> completó una sesión</div>${bookSection(session.sectionId)}<div class="activity-meta"><span>Comprensión global: <b>${session.globalScore}%</b></span><span>${dateShort(session.finalizedAt)}</span></div></div>${icons("chevron")}</a>`; }).join("")}</div></article><article class="panel overview-panel"><div class="section-head"><div><span class="eyebrow">LIBRO PILOTO</span><h2>Secciones trabajadas</h2></div></div><p class="panel-intro">Distribución de sesiones registradas por sección del mismo libro.</p><div class="section-bars">${sections.map(section => { const count = sessions.filter(session => session.sectionId === section.id).length; return `<div class="section-bar-item"><div><strong>${section.title}</strong><span>${count} ${count === 1 ? "sesión" : "sesiones"}</span></div><div class="section-track"><span style="width:${Math.round(count / sessions.length * 100)}%"></span></div></div>`; }).join("")}</div><div class="overview-foot">${icons("book")} ${book.title}</div></article></section>`, "dashboard");
  }

  function studentRow(student) {
    const items = studentSessions(student.id), latest = items.at(-1);
    return `<a href="#estudiante/${student.id}" class="student-row"><div class="student-main">${avatar(student)}<div><strong>${student.name}</strong><small>${student.grade}</small></div></div><div class="row-cell"><small>Sesiones</small><strong>${items.length}</strong></div><div class="row-cell"><small>Comprensión global</small><strong>${average(items, "globalScore")}%</strong></div><div class="row-cell"><small>Última sesión</small><strong>${dateShort(latest.finalizedAt)}</strong></div><div class="row-section"><small>${book.title}</small><strong>Última sección trabajada: ${sectionById(latest.sectionId).title}</strong></div><span class="row-arrow">${icons("chevron")}</span></a>`;
  }

  function studentsView() {
    shell(`${titleBlock("SEGUIMIENTO INDIVIDUAL", "Estudiantes", "Consulta el avance de cada estudiante dentro del libro piloto.")}
      <section class="panel list-panel"><div class="list-toolbar"><div><h2>Estudiantes registrados <span class="count-pill">${students.length}</span></h2><p>Selecciona un estudiante para ver su detalle.</p></div><label class="search-box">${icons("search")}<input id="student-search" type="search" placeholder="Buscar estudiante" aria-label="Buscar estudiante" value="${state.search.replaceAll('"', '&quot;')}"></label></div><div id="student-list" class="student-list">${filteredStudents()}</div></section>`, "estudiantes");
    const input = document.getElementById("student-search");
    input.addEventListener("input", () => { state.search = input.value; document.getElementById("student-list").innerHTML = filteredStudents(); });
  }
  function filteredStudents() {
    const query = state.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const matches = students.filter(student => student.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query));
    return matches.length ? matches.map(studentRow).join("") : `<div class="empty-state">No se encontraron estudiantes con esa búsqueda.</div>`;
  }

  function studentDetail(id) {
    const student = studentById(id); if (!student) return notFound();
    const items = studentSessions(id), latest = items.at(-1);
    shell(`<a class="back-link" href="#estudiantes">${icons("back")} Volver a estudiantes</a><div class="profile-heading"><div class="profile-identity">${avatar(student)}<div><div class="eyebrow">PERFIL DEL ESTUDIANTE</div><h1>${student.name}</h1><p>${student.grade} <span>•</span> ${items.length} sesiones registradas</p></div></div><a class="secondary-button" href="#progreso/${student.id}">${icons("chart")} Ver progreso</a></div>
      <div class="profile-info"><div><small>LIBRO</small><strong>${book.title}</strong></div><div><small>ÚLTIMA SECCIÓN TRABAJADA</small><strong>${sectionById(latest.sectionId).title}</strong></div><div><small>ÚLTIMA SESIÓN</small><strong>${dateShort(latest.finalizedAt)}</strong></div></div>
      <section class="score-grid">${scoreCard("Comprensión global", average(items, "globalScore"))}${scoreCard("Comprensión literal", average(items, "literalScore"), "blue")}${scoreCard("Comprensión inferencial", average(items, "inferentialScore"), "pink")}</section>
      <section class="detail-grid"><article class="panel chart-panel"><div class="section-head"><div><span class="eyebrow">EVOLUCIÓN</span><h2>Comprensión global</h2></div><span class="legend"><i></i> Por sesión</span></div>${lineChart(items.map(item => item.globalScore), "violet", "Evolución de comprensión global")}</article><article class="panel history-panel"><div class="section-head"><div><span class="eyebrow">HISTORIAL</span><h2>Sesiones de lectura</h2></div></div><div class="compact-history">${[...items].reverse().map((session, index) => `<a href="#sesion/${session.id}" class="compact-session"><span class="history-number">${String(items.length - index).padStart(2, "0")}</span><span><strong>Sesión #${session.id.slice(-3)}</strong><small>${sectionById(session.sectionId).title} · ${dateShort(session.finalizedAt)}</small></span><b>${session.globalScore}%</b>${icons("chevron")}</a>`).join("")}</div></article></section>`, "estudiantes");
  }

  function sessionsView() {
    const ordered = [...sessions].sort(byNewest);
    shell(`${titleBlock("REGISTRO ACADÉMICO", "Sesiones", "Historial de sesiones finalizadas del libro piloto.")}
      <div class="notice">${icons("book")} Todas las sesiones corresponden a <strong>${book.title}</strong>. Cada registro indica la sección trabajada.</div>
      <section class="panel list-panel"><div class="list-toolbar"><div><h2>Historial de sesiones <span class="count-pill">${sessions.length}</span></h2><p>Ordenado de la sesión más reciente a la más antigua.</p></div></div><div class="session-list">${ordered.map(session => { const student = studentById(session.studentId); return `<a href="#sesion/${session.id}" class="session-row"><div class="session-id"><span class="session-icon">${icons("book")}</span><span><strong>Sesión #${session.id.slice(-3)}</strong><small>Finalizada: ${dateFull(session.finalizedAt)}</small></span></div><div class="session-student">${avatar(student)}<span><small>Estudiante</small><strong>${student.name}</strong></span></div><div class="session-book">${bookSection(session.sectionId)}</div><div class="session-result"><small>Literal ${session.literalScore}% · Inferencial ${session.inferentialScore}%</small><strong>Global ${session.globalScore}%</strong></div><span class="status-pill">${icons("check")} Finalizada</span>${icons("chevron")}</a>`; }).join("")}</div></section>`, "sesiones");
  }

  function sessionDetail(id) {
    const session = sessions.find(item => item.id === id); if (!session) return notFound();
    const student = studentById(session.studentId);
    shell(`<a class="back-link" href="#sesiones">${icons("back")} Volver a sesiones</a><div class="detail-title"><div><span class="eyebrow">DETALLE DE SESIÓN</span><h1>Sesión #${session.id.slice(-3)}</h1><p>Resultado de comprensión registrado al finalizar la sesión.</p></div><span class="status-pill large">${icons("check")} Finalizada</span></div>
      <section class="panel session-summary"><div class="summary-person">${avatar(student)}<div><small>ESTUDIANTE</small><a href="#estudiante/${student.id}">${student.name} ${icons("arrow")}</a><span>${student.grade}</span></div></div><div class="summary-field"><small>LIBRO Y SECCIÓN</small>${bookSection(session.sectionId)}</div><div class="summary-field"><small>FECHA DE FINALIZACIÓN</small><strong>${icons("calendar")} ${dateFull(session.finalizedAt)}</strong></div></section>
      <section class="score-grid">${scoreCard("Comprensión global", session.globalScore)}${scoreCard("Comprensión literal", session.literalScore, "blue")}${scoreCard("Comprensión inferencial", session.inferentialScore, "pink")}</section>
      <section class="panel questions-panel"><div class="section-head"><div><span class="eyebrow">EVIDENCIA DE COMPRENSIÓN</span><h2>Preguntas y respuestas</h2><p class="questions-note">Muestra parcial de las actividades registradas durante la sesión.</p></div><span class="count-pill">${questions[session.sectionId].length} evidencias mostradas</span></div><div class="question-list">${questions[session.sectionId].map((question, index) => `<article class="question-card"><div class="question-top"><span class="question-index">${String(index + 1).padStart(2, "0")}</span><span class="question-type ${question.type.toLowerCase()}">Pregunta ${question.type.toLowerCase()}</span><span class="question-result">${icons("check")} ${question.result}</span></div><h3>“${question.prompt}”</h3><div class="answer-grid"><div><small>RESPUESTA DEL ESTUDIANTE</small><p>“${question.answer}”</p></div><div><small>PISTA UTILIZADA</small><p>${question.usedHint ? "Sí" : "No"}</p></div></div><div class="feedback"><strong>Retroalimentación</strong><p>${question.feedback}</p></div></article>`).join("")}</div></section>`, "sesiones");
  }

  function lineChart(values, color, label) {
    const w = 620, h = 210, left = 35, right = 20, top = 18, bottom = 38;
    const x = index => left + (values.length === 1 ? (w - left - right) / 2 : index * (w - left - right) / (values.length - 1));
    const y = value => top + (100 - value) * (h - top - bottom) / 100;
    const points = values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    const grid = [0, 25, 50, 75, 100].map(value => `<line x1="${left}" x2="${w-right}" y1="${y(value)}" y2="${y(value)}" class="chart-grid-line"/><text x="${left-9}" y="${y(value)+4}" text-anchor="end" class="chart-axis">${value}</text>`).join("");
    const dots = values.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="5" class="chart-dot ${color}"><title>Sesión ${index+1}: ${value}%</title></circle><text x="${x(index)}" y="${h-9}" text-anchor="middle" class="chart-axis">S${index+1}</text>`).join("");
    return `<div class="chart-wrap" role="img" aria-label="${label}: ${values.map((value, index) => `sesión ${index+1}, ${value}%`).join('; ')}"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${grid}<polyline points="${points}" class="chart-line ${color}"/>${dots}</svg></div>`;
  }

  function progressView(id) {
    if (id && studentById(id)) state.progressStudentId = id;
    const student = studentById(state.progressStudentId), items = studentSessions(student.id);
    shell(`${titleBlock("EVOLUCIÓN DE COMPRENSIÓN", "Progreso", "Resultados por sesión para un estudiante del libro piloto.")}
      <section class="progress-toolbar panel"><div class="progress-person">${avatar(student)}<div><small>ESTUDIANTE SELECCIONADO</small><strong>${student.name}</strong><span>${student.grade} · ${items.length} sesiones</span></div></div><label class="select-wrap">Seleccionar estudiante ${icons("chevron")}<select id="progress-select" aria-label="Seleccionar estudiante">${students.map(item => `<option value="${item.id}" ${item.id === student.id ? "selected" : ""}>${item.name}</option>`).join("")}</select></label></section>
      <div class="progress-charts"><article class="panel progress-chart"><div class="section-head"><div><span class="eyebrow">RESULTADO POR SESIÓN</span><h2>Comprensión global</h2></div><span class="chart-label violet">Global</span></div>${lineChart(items.map(item => item.globalScore), "violet", "Comprensión global")}</article><article class="panel progress-chart"><div class="section-head"><div><span class="eyebrow">RESULTADO POR SESIÓN</span><h2>Comprensión literal</h2></div><span class="chart-label blue">Literal</span></div>${lineChart(items.map(item => item.literalScore), "blue", "Comprensión literal")}</article><article class="panel progress-chart"><div class="section-head"><div><span class="eyebrow">RESULTADO POR SESIÓN</span><h2>Comprensión inferencial</h2></div><span class="chart-label pink">Inferencial</span></div>${lineChart(items.map(item => item.inferentialScore), "pink", "Comprensión inferencial")}</article></div>
      <section class="panel progress-sections"><div class="section-head"><div><span class="eyebrow">RECORRIDO DEL LIBRO</span><h2>Secciones trabajadas</h2></div><span class="book-caption">${icons("book")} ${book.title}</span></div><div class="progress-steps">${items.map((session, index) => `<a href="#sesion/${session.id}" class="progress-step"><span class="step-number">${String(index+1).padStart(2,"0")}</span><span><small>SESIÓN ${index+1}</small><strong>${sectionById(session.sectionId).title}</strong><em>${dateShort(session.finalizedAt)}</em></span><b>${session.globalScore}%</b>${icons("chevron")}</a>`).join("")}</div></section>`, "progreso");
    document.getElementById("progress-select").addEventListener("change", event => { location.hash = `#progreso/${event.target.value}`; });
  }

  function notFound() { location.hash = "#dashboard"; }
  function render() {
    if (!state.authenticated) { login(); return; }
    state.menuOpen = false;
    const [route, id] = location.hash.slice(1).split("/");
    if (!route || route === "dashboard") dashboard();
    else if (route === "estudiantes") studentsView();
    else if (route === "estudiante") studentDetail(id);
    else if (route === "sesiones") sessionsView();
    else if (route === "sesion") sessionDetail(id);
    else if (route === "progreso") progressView(id);
    else notFound();
    window.scrollTo(0, 0);
  }
  app.addEventListener("click", event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (event.target.closest(".sidebar a[href]")) { state.menuOpen = false; document.querySelector(".sidebar")?.classList.remove("open"); document.querySelector(".mobile-shade")?.classList.remove("visible"); document.querySelector(".menu-button")?.setAttribute("aria-expanded", "false"); }
    if (action === "logout") { sessionStorage.removeItem("storyscape-auth"); state.authenticated = false; location.hash = ""; render(); }
    if (action === "toggle-menu") { state.menuOpen = !state.menuOpen; document.querySelector(".sidebar")?.classList.toggle("open", state.menuOpen); document.querySelector(".mobile-shade")?.classList.toggle("visible", state.menuOpen); document.querySelector(".menu-button")?.setAttribute("aria-expanded", String(state.menuOpen)); }
    if (action === "close-menu") { state.menuOpen = false; document.querySelector(".sidebar")?.classList.remove("open"); document.querySelector(".mobile-shade")?.classList.remove("visible"); document.querySelector(".menu-button")?.setAttribute("aria-expanded", "false"); }
  });
  window.addEventListener("hashchange", render);
  render();
})();
