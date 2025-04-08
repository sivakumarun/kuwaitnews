// FINAL WORKING scripts.js
(function() {
    // 1. Detect environment
    const isGitHub = window.location.hostname.includes('github.io');
    const basePath = isGitHub ? '/kuwaitnews' : '';
    
    // 2. Load components with absolute URLs
    function loadComponent(url, targetId) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`${url} failed: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    const target = document.getElementById(targetId);
                    if (!target) throw new Error(`Target #${targetId} not found`);
                    target.innerHTML = html;
                    console.log(`✅ Loaded ${url}`);
                    resolve();
                })
                .catch(error => {
                    console.error(`❌ Failed ${url}:`, error);
                    reject(error);
                });
        });
    }

    // 3. Main initialization
    function init() {
        Promise.all([
            loadComponent(`${basePath}/includes/header.html`, 'header-container'),
            loadComponent(`${basePath}/includes/navigation.html`, 'nav-container')
        ])
        .then(() => {
            // Initialize components after load
            setTimeout(() => {
                initMobileMenu();
                setActiveNavLink();
            }, 100);
        })
        .catch(error => {
            console.error('Initialization failed:', error);
            showFallbackNavigation(basePath);
        });
    }

    // 4. Mobile menu functionality
    function initMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navContent = document.querySelector('.nav-content');
        
        if (!menuBtn || !navContent) {
            console.warn('Mobile menu elements not found');
            return;
        }

        menuBtn.addEventListener('click', () => {
            const isOpen = navContent.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isOpen);
            menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // 5. Active link highlighting
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-menu a').forEach(link => {
            const linkPath = link.getAttribute('href');
            const isActive = currentPath.endsWith(linkPath);
            link.classList.toggle('active', isActive);
            link.toggleAttribute('aria-current', isActive);
        });
    }

    // 6. Fallback content
    function showFallbackNavigation(basePath) {
        const header = document.getElementById('header-container');
        if (header) {
            header.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #CE1126, #007A3D);
                    color: white;
                    padding: 1rem;
                    text-align: center;
                ">
                    <h1 style="margin:0">కువైట్ తెలుగు వార్తలు</h1>
                    <nav style="margin-top: 1rem;">
                        <a href="${basePath}/index.html" style="color:white;margin:0 10px">Home</a>
                        <a href="${basePath}/sports.html" style="color:white;margin:0 10px">Sports</a>
                    </nav>
                </div>
            `;
        }
    }

    // Start when DOM is ready
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
