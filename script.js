document.querySelectorAll('.proj-preview img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
        // immagine già caricata — mostrala subito
        img.style.display = 'block';
        img.nextElementSibling.style.display = 'none';
    } else {
        // immagine non ancora caricata — aspetta l'evento
        img.addEventListener('load', () => {
            img.style.display = 'block';
            img.nextElementSibling.style.display = 'none';
        });
    }
});