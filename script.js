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