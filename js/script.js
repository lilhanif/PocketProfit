
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const sidebarItemTexts = document.querySelectorAll('.sidebar-item-text');
    const userNameSidebar = document.getElementById('user-name-sidebar');
    const userAvatarContainer = document.getElementById('user-avatar-container');
    const navLinks = sidebar ? sidebar.querySelectorAll('nav a') : [];
    const logoutButton = document.getElementById('logout-button');

    const messageModal = document.getElementById('messageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseButton = document.getElementById('modalCloseButton');

    let isSidebarMinimized = false; 

    function applySidebarState() {
        if (!sidebar) {
            return;
        }

        if (isSidebarMinimized) {
            sidebar.style.width = '88px';
            sidebar.classList.remove('p-4');
            sidebar.classList.add('p-3', 'items-center');
            if (mainContent) mainContent.style.marginLeft = '88px';
            if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';

            sidebarItemTexts.forEach(text => text.classList.add('hidden'));
            if (userNameSidebar) userNameSidebar.classList.add('hidden');

            if (userAvatarContainer) {
                userAvatarContainer.classList.remove('w-20', 'h-20');
                userAvatarContainer.classList.add('w-12', 'h-12', 'mb-0');
            }

            navLinks.forEach(link => {
                link.classList.add('justify-center');
                link.classList.remove('space-x-3');
            });

            if (logoutButton) {
                logoutButton.classList.add('justify-center');
                logoutButton.classList.remove('space-x-3');
            }

        } else {
            sidebar.style.width = '260px';
            sidebar.classList.add('p-4');
            sidebar.classList.remove('p-3', 'items-center');
            if (mainContent) mainContent.style.marginLeft = '260px';
            if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';

            sidebarItemTexts.forEach(text => text.classList.remove('hidden'));
            if (userNameSidebar) userNameSidebar.classList.remove('hidden');

            if (userAvatarContainer) {
                userAvatarContainer.classList.add('w-20', 'h-20');
                userAvatarContainer.classList.remove('w-12', 'h-12', 'mb-0');
            }

            navLinks.forEach(link => {
                link.classList.remove('justify-center');
                link.classList.add('space-x-3');
            });

            if (logoutButton) {
                logoutButton.classList.remove('justify-center');
                logoutButton.classList.add('space-x-3');
            }
        }
    }

    if (sidebar) {
        applySidebarState();
    }

    if (sidebarToggle && sidebar && mainContent && toggleIcon) {
        sidebarToggle.addEventListener('click', () => {
            isSidebarMinimized = !isSidebarMinimized;
            applySidebarState();
        });
    }

    function showMessage(title, message) {
        if (modalTitle && modalMessage && messageModal) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            messageModal.classList.remove('hidden');
        }
    }

    if (modalCloseButton && messageModal) {
        modalCloseButton.addEventListener('click', () => {
            messageModal.classList.add('hidden');
        });
        messageModal.addEventListener('click', (event) => {
            if (event.target === messageModal) {
                 messageModal.classList.add('hidden');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            showMessage('Log Out', 'You have been logged out.');
            console.log('Logout button clicked');
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();

            link.classList.remove('active');
            link.classList.remove('bg-custom-green', 'hover:bg-custom-green-hover'); 


            if (linkPage === currentPage) {
                link.classList.add('active'); 
                link.classList.remove('hover:bg-gray-700');
            } else {
                 link.classList.add('hover:bg-gray-700');
            }
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active')); 
                tabContents.forEach(content => content.classList.add('hidden'));

                button.classList.add('active');
                const tabId = button.dataset.tab;
                const activeContent = document.getElementById(`tab-content-${tabId}`);
                if (activeContent) {
                    activeContent.classList.remove('hidden');
                }
            });
        });
    }
});
