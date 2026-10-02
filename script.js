/* =============================================
   PORTFOLIO — script.js
   Everything here renders from RESUME (data.js).
   ============================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtMonth = ym => { if (!ym) return 'Present'; const [y, m] = ym.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
const fmtRange = (a, b) => `${fmtMonth(a)} – ${fmtMonth(b)}`;
const initials = name => name.replace(/\(.*?\)/g, '').split(/\s+/).filter(w => /^[A-Z]/.test(w) && w !== 'The').slice(0, 2).map(w => w[0]).join('');

/* ---------- Theme (dark by default) ---------- */
const root = document.documentElement;
$('#themeToggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* ---------- Nav ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navToggle = $('#navToggle');
const navMenu = $('#navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
$$('.nav__link').forEach(l => l.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const linkObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$('.nav__link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => linkObserver.observe(s));

$('#year').textContent = new Date().getFullYear();

/* ---------- Hero: simulated job run ---------- */
const JOB_TASKS = ['ingest_sources', 'validate_quality', 'build_model', 'publish_app'];
const jobTasks = $('#jobTasks');
const jobStatus = $('#jobStatus');
let jobTimer = null;

function setJobStatus(state) {
  jobStatus.textContent = state;
  jobStatus.className = `badge badge--${state}`;
}

function runJob() {
  clearTimeout(jobTimer);
  jobTasks.innerHTML = JOB_TASKS.map(t => `
    <li class="task" data-state="pending">
      <span class="task__icon" aria-hidden="true"></span>
      <span class="task__name mono">${t}</span>
      <span class="task__bar" aria-hidden="true"><i></i></span>
    </li>`).join('');
  const items = $$('.task', jobTasks);

  if (reducedMotion) {
    items.forEach(li => li.dataset.state = 'done');
    setJobStatus('succeeded');
    return;
  }
  setJobStatus('running');
  let i = 0;
  const step = () => {
    if (i > 0) items[i - 1].dataset.state = 'done';
    if (i === items.length) { setJobStatus('succeeded'); return; }
    items[i].dataset.state = 'running';
    i++;
    jobTimer = setTimeout(step, 800 + Math.random() * 400);
  };
  jobTimer = setTimeout(step, 500);
}
$('#jobReplay').addEventListener('click', runJob);
runJob();

/* ---------- KPI count-up ---------- */
const kpiObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    kpiObserver.unobserve(entry.target);
    if (reducedMotion) return;
    $$('[data-count]', entry.target).forEach(el => {
      const target = +el.dataset.count;
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / 1100);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
}, { threshold: 0.4 });
kpiObserver.observe($('#kpis'));

/* ---------- Experience timeline + skill filter ---------- */
const VISIBLE = 4; // bullets shown before "Show more"

$('#timeline').innerHTML = RESUME.experience.map((job, i) => {
  const extra = job.highlights.length - VISIBLE;
  return `
  <li class="job">
    <span class="job__badge" aria-hidden="true">${initials(job.company)}</span>
    <div class="job__card">
      <div class="job__top">
        <div>
          <h3 class="job__role">${esc(job.role)}</h3>
          <p class="job__company">${esc(job.company)}</p>
        </div>
        <div class="job__meta">
          <p class="job__dates">${fmtRange(job.start, job.end)}</p>
          <p class="muted small">${esc(job.location)}</p>
        </div>
      </div>
      <ul class="job__list" id="job-list-${i}">
        ${job.highlights.map((h, k) => `<li data-tags="${esc(h.tags.join('|'))}"${k >= VISIBLE ? ' class="is-extra"' : ''}>${esc(h.text)}</li>`).join('')}
      </ul>
      ${extra > 0 ? `<button class="link-btn job__more" aria-expanded="false" aria-controls="job-list-${i}" data-more="${extra}">Show ${extra} more</button>` : ''}
    </div>
  </li>`;
}).join('');

$('#timeline').addEventListener('click', e => {
  const btn = e.target.closest('.job__more');
  if (!btn) return;
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  btn.closest('.job').classList.toggle('is-open', open);
  btn.textContent = open ? 'Show less' : `Show ${btn.dataset.more} more`;
});

$('#education').innerHTML = RESUME.education.map(e => `
  <span class="edu__icon" aria-hidden="true">🎓</span>
  <div class="edu__text"><strong>${esc(e.degree)}</strong><span class="muted">${esc(e.school)} · ${esc(e.place)}</span></div>
  <span class="muted small">${fmtRange(e.start, e.end)}</span>`).join('');

const FILTER_TAGS = ['PySpark', 'Databricks', 'SQL', 'Data modeling', 'Data quality', 'CI/CD', 'ETL', 'MLflow', 'AI agents'];
const filter = $('#skillFilter');
filter.innerHTML = `<span class="filter__label muted small">Highlight:</span>` + ['All', ...FILTER_TAGS].map(t =>
  `<button class="chip${t === 'All' ? ' is-active' : ''}" data-tag="${esc(t)}" aria-pressed="${t === 'All'}">${esc(t)}</button>`
).join('');

filter.addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  const tag = btn.dataset.tag;
  const all = tag === 'All';
  $$('.chip', filter).forEach(c => {
    c.classList.toggle('is-active', c === btn);
    c.setAttribute('aria-pressed', c === btn);
  });
  const timeline = $('#timeline');
  timeline.classList.toggle('is-filtered', !all);
  $$('.job', timeline).forEach(job => {
    let hits = 0;
    $$('.job__list li', job).forEach(li => {
      const match = !all && li.dataset.tags.split('|').includes(tag);
      li.classList.toggle('is-match', match);
      if (match) hits++;
    });
    job.classList.toggle('is-dim', !all && hits === 0);
    job.classList.toggle('is-filter-open', hits > 0);
  });
});

/* ---------- Skills: bento cards with animated illustrations ---------- */
// Each illustration is a 160×90 SVG; `G` is replaced with the card's gradient id.
const SKILL_ART = {
  'Languages': `
    <polyline class="draw" points="52,24 30,45 52,66" stroke="url(#G)"/>
    <polyline class="draw" points="108,24 130,45 108,66" stroke="url(#G)"/>
    <line class="draw" x1="90" y1="18" x2="70" y2="72" stroke="url(#G)"/>
    <rect class="blink" x="138" y="36" width="4" height="18" rx="1" fill="url(#G)"/>`,
  'ETL & Data Modeling': `
    <path class="flow" d="M28 45 C50 45 56 22 80 22 M28 45 C50 45 56 68 80 68 M80 22 C104 22 110 45 132 45 M80 68 C104 68 110 45 132 45" stroke="url(#G)"/>
    <circle class="node" cx="28" cy="45" r="8"/><circle class="node" cx="80" cy="22" r="8"/>
    <circle class="node" cx="80" cy="68" r="8"/><circle class="node node--end" cx="132" cy="45" r="9" style="fill:url(#G)"/>`,
  'Data Quality & Governance': `
    <path class="draw" d="M80 10 L110 21 V43 C110 61 97 73 80 80 C63 73 50 61 50 43 V21 Z" stroke="url(#G)"/>
    <polyline class="check" points="66,45 76,55 95,35" stroke="url(#G)"/>
    <line class="scan" x1="44" x2="116" y1="0" y2="0" stroke="url(#G)"/>`,
  'Platforms': `
    ${[[48, 30], [80, 18], [112, 30]].map(([x, top], i) => `
      <path d="M${x - 18} ${top} V74 C${x - 18} 82 ${x + 18} 82 ${x + 18} 74 V${top}" stroke="url(#G)"/>
      <ellipse cx="${x}" cy="${top}" rx="18" ry="7" stroke="url(#G)"/>
      <path d="M${x - 18} ${(top + 74) / 2} C${x - 18} ${(top + 74) / 2 + 8} ${x + 18} ${(top + 74) / 2 + 8} ${x + 18} ${(top + 74) / 2}" stroke="url(#G)" opacity=".5"/>
      <circle class="led" style="animation-delay:${i * .5}s" cx="${x + 9}" cy="${top + 16}" r="2.5" fill="url(#G)"/>`).join('')}`,
  'AI & ML': (() => {
    const layers = [[30, [25, 45, 65]], [80, [15, 35, 55, 75]], [130, [32, 58]]];
    let s = '';
    for (let l = 0; l < layers.length - 1; l++)
      layers[l][1].forEach(y1 => layers[l + 1][1].forEach(y2 =>
        s += `<line x1="${layers[l][0]}" y1="${y1}" x2="${layers[l + 1][0]}" y2="${y2}" stroke="url(#G)" opacity=".28"/>`));
    let k = 0;
    layers.forEach(([x, ys]) => ys.forEach(y => s += `<circle class="neuron" style="animation-delay:${(k++ * .18).toFixed(2)}s" cx="${x}" cy="${y}" r="5.5" fill="url(#G)"/>`));
    return s;
  })(),
  'Visualization & Data Products': `
    ${[38, 56, 30, 64, 48].map((h, i) => `<rect class="bar" style="animation-delay:${i * .12}s" x="${30 + i * 22}" y="${80 - h}" width="14" height="${h}" rx="3" fill="url(#G)" opacity=".85"/>`).join('')}
    <polyline class="draw" points="37,36 59,20 81,42 103,14 125,28" stroke="var(--text)" opacity=".7"/>`,
  'DevOps': `
    <path id="G-loop" d="M80 45 C70 25 40 25 40 45 C40 65 70 65 80 45 C90 25 120 25 120 45 C120 65 90 65 80 45 Z" stroke="url(#G)"/>
    <circle r="5" fill="var(--text)"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#G-loop"/></animateMotion></circle>
    <text x="52" y="49" class="art-label">CI</text><text x="100" y="49" class="art-label">CD</text>`,
};
const WIDE = new Set(['ETL & Data Modeling', 'Platforms']);

$('#skillGrid').innerHTML = RESUME.skills.map((g, i) => {
  const id = `sg${i}`;
  const art = (SKILL_ART[g.category] || '').replace(/url\(#G\)/g, `url(#${id})`).replace(/G-loop/g, `${id}-loop`);
  return `
  <article class="skill-card${WIDE.has(g.category) ? ' skill-card--wide' : ''}" style="--d:${i * 70}ms">
    <div class="skill-card__art" aria-hidden="true">
      <svg viewBox="0 0 160 90" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent-2)"/>
        </linearGradient></defs>
        ${art}
      </svg>
    </div>
    <div class="skill-card__body">
      <div class="skill-card__head">
        <h3>${esc(g.category)}</h3>
        <span class="skill-card__count mono">${String(g.items.length).padStart(2, '0')}</span>
      </div>
      <div class="tags">${g.items.map((s, k) => `<span class="tag" style="--k:${k}">${esc(s)}</span>`).join('')}</div>
    </div>
  </article>`;
}).join('');

// Reveal cards as they scroll in
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    skillObserver.unobserve(e.target);
  });
}, { threshold: 0.2 });
$$('.skill-card').forEach(c => skillObserver.observe(c));

// Spotlight that follows the cursor
$('#skillGrid').addEventListener('pointermove', e => {
  const card = e.target.closest('.skill-card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
});

/* ---------- Contact ---------- */
const links = [
  RESUME.github && { href: RESUME.github, label: 'GitHub' },
  RESUME.linkedin && { href: RESUME.linkedin, label: 'LinkedIn' },
].filter(Boolean);
$('#contactLinks').innerHTML = links.map(l =>
  `<a class="cta__link" href="${esc(l.href)}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('') +
  `<span class="cta__loc">📍 ${esc(RESUME.location)}</span>`;

$('#copyEmail').addEventListener('click', async e => {
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText(RESUME.email);
    btn.textContent = 'Copied ✓';
  } catch (err) {
    btn.textContent = 'Press ⌘C';
    const range = document.createRange();
    range.selectNodeContents($('.copy-row__value'));
    getSelection().removeAllRanges(); getSelection().addRange(range);
  }
  setTimeout(() => btn.textContent = 'Copy', 1800);
});

/* ---------- One-page resume ---------- */
const contactLine = [RESUME.location, `<a href="mailto:${RESUME.email}">${RESUME.email}</a>`,
  RESUME.linkedin && `<a href="${esc(RESUME.linkedin)}">${esc(RESUME.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a>`,
  RESUME.github && `<a href="${esc(RESUME.github)}">${esc(RESUME.github.replace(/^https?:\/\//, ''))}</a>`,
].filter(Boolean).join(' · ');

$('#resumeSheet').innerHTML = `
  <header class="sheet__head">
    <h2 id="resumeName">${esc(RESUME.name)}</h2>
    <p class="sheet__title">${esc(RESUME.title)}</p>
    <p class="sheet__contact">${contactLine}</p>
  </header>
  <section><h3>Summary</h3><p>${esc(RESUME.summary)}</p></section>
  <section><h3>Experience</h3>
    ${RESUME.experience.map(j => `
      <div class="sheet__job">
        <div class="sheet__row"><strong>${esc(j.role)} · ${esc(j.company)}</strong><span>${fmtRange(j.start, j.end)}</span></div>
        <p class="sheet__loc">${esc(j.location)}</p>
        <ul>${j.highlights.map(h => `<li>${esc(h.text)}</li>`).join('')}</ul>
      </div>`).join('')}
  </section>
  <section><h3>Skills</h3>
    <ul class="sheet__skills">${RESUME.skills.map(g => `<li><strong>${esc(g.category)}:</strong> ${g.items.map(esc).join(', ')}</li>`).join('')}</ul>
  </section>
  <section><h3>Education</h3>
    ${RESUME.education.map(e => `<div class="sheet__row"><span><strong>${esc(e.degree)}</strong>, ${esc(e.school)}, ${esc(e.place)}</span><span>${fmtRange(e.start, e.end)}</span></div>`).join('')}
  </section>`;

const dialog = $('#resumeDialog');
$$('[data-open-resume]').forEach(b => b.addEventListener('click', () => {
  dialog.showModal();
  dialog.scrollTop = 0;
}));
$('#closeResume').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
$('#printResume').addEventListener('click', () => window.print());

/* ---------- SQL console (sql.js) ---------- */
const PRESETS = [
  { label: 'Career timeline', sql:
`SELECT company, role, start_date,
       COALESCE(end_date, 'present') AS end_date
FROM experience
ORDER BY start_date DESC;` },
  { label: 'Where I used PySpark', sql:
`SELECT h.company, h.text
FROM highlights h
JOIN highlight_skills s ON s.highlight_id = h.id
WHERE s.skill = 'PySpark';` },
  { label: 'Top skills', sql:
`SELECT skill, COUNT(*) AS times_used
FROM highlight_skills
GROUP BY skill
ORDER BY times_used DESC
LIMIT 6;` },
  { label: 'Skills by category', sql:
`SELECT category, GROUP_CONCAT(name, ', ') AS skills
FROM skills
GROUP BY category;` },
];

const sqlInput = $('#sqlInput');
const sqlRun = $('#sqlRun');
const sqlOut = $('#sqlOut');
let db = null;

$('#presets').innerHTML = PRESETS.map((p, i) => `<button class="chip" data-i="${i}">${esc(p.label)}</button>`).join('');
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  $$('#presets .chip').forEach(c => c.classList.toggle('is-active', c === b));
  sqlInput.value = PRESETS[+b.dataset.i].sql;
  runQuery();
});
sqlInput.value = PRESETS[0].sql;
$('#presets .chip').classList.add('is-active');

function buildDatabase(SQL) {
  const d = new SQL.Database();
  d.run(`
    CREATE TABLE experience (id INTEGER PRIMARY KEY, company TEXT, role TEXT, location TEXT, start_date TEXT, end_date TEXT);
    CREATE TABLE highlights (id INTEGER PRIMARY KEY, experience_id INTEGER, company TEXT, text TEXT);
    CREATE TABLE highlight_skills (highlight_id INTEGER, skill TEXT);
    CREATE TABLE skills (name TEXT, category TEXT);
  `);
  let hid = 0;
  RESUME.experience.forEach((j, i) => {
    d.run('INSERT INTO experience VALUES (?,?,?,?,?,?)', [i + 1, j.company, j.role, j.location, j.start, j.end]);
    j.highlights.forEach(h => {
      hid++;
      d.run('INSERT INTO highlights VALUES (?,?,?,?)', [hid, i + 1, j.company, h.text]);
      h.tags.forEach(t => d.run('INSERT INTO highlight_skills VALUES (?,?)', [hid, t]));
    });
  });
  RESUME.skills.forEach(g => g.items.forEach(s => d.run('INSERT INTO skills VALUES (?,?)', [s, g.category])));
  return d;
}

function runQuery() {
  if (!db) return;
  const sql = sqlInput.value.trim();
  if (!sql) return;
  const t0 = performance.now();
  try {
    const res = db.exec(sql);
    const ms = (performance.now() - t0).toFixed(1);
    if (!res.length) {
      sqlOut.innerHTML = `<p class="console__meta">No rows · ${ms} ms</p>`;
      return;
    }
    const { columns, values } = res[res.length - 1];
    sqlOut.innerHTML = `
      <p class="console__meta">${values.length} row${values.length === 1 ? '' : 's'} · ${ms} ms</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr>${columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${values.map(r => `<tr>${r.map(v => `<td class="${typeof v === 'number' ? 'num mono' : ''}">${v === null ? '<span class="null">NULL</span>' : esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
  } catch (err) {
    sqlOut.innerHTML = `<p class="console__error mono">Error: ${esc(err.message)}</p>`;
  }
}

sqlRun.addEventListener('click', runQuery);
sqlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); runQuery(); }
});

window.initSql = async () => {
  try {
    const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}` });
    db = buildDatabase(SQL);
    sqlRun.disabled = false;
    sqlRun.textContent = 'Run ▸';
    runQuery();
  } catch (err) {
    window.sqlFailed();
  }
};
window.sqlFailed = () => {
  sqlRun.textContent = 'Unavailable';
  sqlOut.innerHTML = '<p class="console__error">The SQL demo could not load. Try refreshing the page.</p>';
};
