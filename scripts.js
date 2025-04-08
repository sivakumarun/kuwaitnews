// Update this part in scripts.js
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
        background: linear-gradient(135deg, #CE1126, #007A3D); /* Default for desktop */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header-bg {
        background: transparent; /* No gradient here */
        width: 100%;
    }
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            flex-direction: column;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #CE1126, #007A3D);
        }
        .header-container {
            flex-grow: 1;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0;
        }
        .logo-container {
            flex-grow: 1;
        }
        .site-title {
            font-size: 1.2rem;
        }
        .site-tagline {
            display: none;
        }
        .nav-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
        }
        nav {
            width: 100%;
            justify-content: space-between;
        }
        .search-bar {
            margin-left: 0;
            margin-right: 1rem;
        }
        .menu-btn {
            color: white;
            margin-left: 0.5rem;
        }
    }
`;
document.head.appendChild(style);
