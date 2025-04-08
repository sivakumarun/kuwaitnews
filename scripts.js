// Update the style injection part in scripts.js
const style = document.createElement('style');
style.textContent = `
    /* Common styles for both desktop and mobile */
    .top-wrapper {
        width: 100%;
        background: linear-gradient(135deg, #CE1126, #007A3D);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
        .top-wrapper {
            padding: 0.5rem 1rem;
        }
        
        .header-container {
            padding: 0;
            flex-wrap: wrap;
        }
        
        .logo-container {
            order: 1;
            width: 100%;
            justify-content: center;
            padding: 0.5rem 0;
        }
        
        .nav-container {
            order: 2;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: transparent;
            padding: 0;
        }
        
        nav {
            width: 100%;
            justify-content: space-between;
        }
        
        .site-title {
            font-size: 1.2rem;
        }
        
        .site-tagline {
            display: none;
        }
        
        .menu-btn {
            color: white;
            margin-left: 0.5rem;
        }
        
        .search-bar {
            margin-right: 0.5rem;
        }
    }
`;
document.head.appendChild(style);
