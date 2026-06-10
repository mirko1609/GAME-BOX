// Script originale — mostra l'immagine della card se caricata correttamente
document.querySelectorAll('.proj-preview img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
        img.style.display = 'block';
        img.nextElementSibling.style.display = 'none';
    } else {
        img.addEventListener('load', () => {
            img.style.display = 'block';
            img.nextElementSibling.style.display = 'none';
        });
    }
});

// Script originale — nasconde lo scroll indicator dopo 100px di scroll
const scrollHint = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollHint.style.opacity = '0';
    } else {
        scrollHint.style.opacity = '1';
    }
});



// ================================================================
// [RESPONSIVE] — Hamburger menu
// Per rimuovere: cancella da qui fino a END [RESPONSIVE]
// ================================================================

const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

// Funzione di chiusura riutilizzabile da più eventi
function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';   // ripristina lo scroll
}

// Click sull'hamburger: apre/chiude il menu
hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Blocca lo scroll della pagina mentre il menu è aperto
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Click su un link del menu mobile: chiude e naviga
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Click fuori dall'hamburger e dal menu: chiude
document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        closeMenu();
    }
});

// Resize oltre il breakpoint tablet: forza la chiusura
// (evita che il menu resti aperto se si ruota il dispositivo)
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
});

// ================================================================
// END [RESPONSIVE]
// ================================================================


// ================================================================
// CLASSIFICA
// ================================================================
 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

    // ─── CONFIGURAZIONE ───────────────────────────────────────────────────────
    // Modifica solo questi due valori se cambiano le credenziali
    const SUPABASE_URL      = 'https://yvaiodtdtnsxvbkixexp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YWlvZHRkdG5zeHZia2l4ZXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODY0MjYsImV4cCI6MjA5MzY2MjQyNn0.YWWZIyqrE4bzjjKLsY2CpPGP6_olESEZq2H3TZAm43Q';

    // Nome della tabella e colonne — se il prof le rinomina, cambia solo qui
    const TABLE   = 'ranking'
    const COL_USER  = 'user'
    const COL_GAME  = 'game'
    const COL_SCORE = 'score'
    // ─────────────────────────────────────────────────────────────────────────

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // ── Legge tutti i record dal database ──
    async function fetchRanking({ game = null, limit = 10 } = {}) {
      let query = supabase
        .from(TABLE)
        .select(`${COL_USER}, ${COL_GAME}, ${COL_SCORE}`)
        .order(COL_SCORE, { ascending: false })

      if (game)  query = query.eq(COL_GAME, game)
      if (limit) query = query.limit(Number(limit))

      const { data, error } = await query
      if (error) throw error
      return data
    }

    // ── Legge la lista dei giochi distinti ──
    async function fetchGames() {
      const { data, error } = await supabase
        .from(TABLE)
        .select(COL_GAME)
      if (error) throw error
      return [...new Set(data.map(r => r[COL_GAME]).filter(Boolean))].sort()
    }

    // ── Popola il menu a tendina dei giochi ──
    function populateGameFilter(games) {
      const sel = document.getElementById('game-filter')
      games.forEach(g => {
        const opt = document.createElement('option')
        opt.value = opt.textContent = g
        sel.appendChild(opt)
      })
    }

    // ── Renderizza le righe della tabella ──
    function renderTable(rows) {
      const tbody = document.getElementById('ranking-body')
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty">Nessun record trovato.</td></tr>'
        return
      }
      tbody.innerHTML = rows.map((row, i) => {
        const rank = i + 1
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other'
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank
        return `
          <tr>
            <td class="rank-cell ${rankClass}">${medal}</td>
            <td>${escapeHtml(row[COL_USER] ?? '—')}</td>
            <td class="game-cell">${escapeHtml(row[COL_GAME] ?? '—')}</td>
            <td class="score-cell">${row[COL_SCORE] ?? 0}</td>
          </tr>`
      }).join('')
    }

    // ── Imposta il messaggio di stato ──
    function setStatus(msg, type = '') {
      const el = document.getElementById('status')
      el.textContent = msg
      el.className = type
    }

    // ── Piccola utility anti-XSS ──
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]))
    }

    // ── Funzione principale: carica e mostra i dati ──
    async function loadData() {
      const game  = document.getElementById('game-filter').value
      const limit = document.getElementById('limit-filter').value
      setStatus('Caricamento...', 'loading')
      try {
        const rows = await fetchRanking({ game, limit })
        renderTable(rows)
        setStatus(`${rows.length} record caricati · ${new Date().toLocaleTimeString('it-IT')}`)
      } catch (err) {
        setStatus('Errore: ' + err.message, 'error')
      }
    }

    // ── Inizializzazione ──
    async function init() {
      try {
        const games = await fetchGames()
        populateGameFilter(games)
      } catch (_) { /* se non riesce il filtro giochi, non è bloccante */ }
      await loadData()
      document.getElementById('game-filter').addEventListener('change', loadData)
      document.getElementById('limit-filter').addEventListener('change', loadData)
    }

    // Esponi refresh globalmente per il bottone HTML
    window.refresh = loadData

    init()