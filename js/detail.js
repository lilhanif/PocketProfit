
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('#course-content-accordion .section-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('open');
        });
    });

    const currentPath = window.location.pathname;

    sidebarNavLinks.forEach(link => {
        if (currentPath.includes('course-detail.html') && link.getAttribute('href') === 'kursus.html') {
            link.classList.add('active');
            link.classList.remove('hover:bg-gray-700');
        } else if (!currentPath.includes(link.getAttribute('href').split('/').pop()) && link.getAttribute('href') !== 'kursus.html') {
        }
    });
});
