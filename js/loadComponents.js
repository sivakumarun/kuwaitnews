// ==============================================
// 1. Function to LOAD HTML COMPONENTS (header/nav)
// ==============================================
async function loadComponent(url, targetElement, position = 'beforeend') {
  try {
    // Fetch the HTML file (e.g., header.html)
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);

    // Get the HTML content
    const html = await response.text();

    // Find where to insert it (e.g., <body>)
    const target = document.querySelector(targetElement);

    if (target) {
      // Insert the HTML at specified position
      target.insertAdjacentHTML(position, html);
      return true;
    } else {
      console.error(`Target element '${targetElement}' not found`);
      return false;
    }
  } catch (error) {
    console.error('Error loading component:', error);
    return false;
  }
}

// ==============================================
// 2. Function to HIGHLIGHT CURRENT PAGE in navigation
// ==============================================
function setActiveNavLink() {
  // Get current page filename (e.g., "gold-price.html")
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Find all navigation links
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const linkPage = link.getAttribute('href');
    
    // Add 'active' class if this link matches current page
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page'); // For accessibility
    }
  });
}

// ==============================================
// 3. Function to INITIALIZE MOBILE MENU TOGGLE
// ==============================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      // Toggle menu visibility
      navMenu.classList.toggle('active');
      
      // Update ARIA attribute for screen readers
      menuBtn.setAttribute(
        'aria-expanded', 
        navMenu.classList.contains('active')
      );
    });
  }
}

// ==============================================
// 4. MAIN FUNCTION - Loads everything in order
// ==============================================
async function loadCommonComponents() {
  // Load HEADER at start of <body>
  await loadComponent('/includes/header.html', 'body', 'afterbegin');

  // Load NAVIGATION after header
  await loadComponent('/includes/navigation.html', '.header-bg', 'afterend');

  // Initialize features
  setActiveNavLink(); // Highlight active page
  initMobileMenu();   // Enable mobile menu toggle

  // Notify other scripts when done
  document.dispatchEvent(new Event('commonComponentsLoaded'));
}

// ==============================================
// 5. START THE PROCESS when page loads
// ==============================================
document.addEventListener('DOMContentLoaded', loadCommonComponents);
