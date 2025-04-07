// ==============================================
// 1. Function to LOAD HTML COMPONENTS (header/nav)
// ==============================================
async function loadComponent(url, targetElement, position = 'beforeend') {
  try {
    // Fetch the HTML file (e.g., header.html or navigation.html)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }

    // Get the HTML content
    const html = await response.text();

    // Find the target element to insert the component
    const target = document.querySelector(targetElement);
    if (!target) {
      throw new Error(`Target element '${targetElement}' not found in the DOM`);
    }

    // Insert the HTML at the specified position
    target.insertAdjacentHTML(position, html);
    return true;
  } catch (error) {
    console.error('Error loading component:', error.message);
    return false;
  }
}

// ==============================================
// 2. Function to HIGHLIGHT CURRENT PAGE in navigation
// ==============================================
function setActiveNavLink() {
  // Get the current page filename (e.g., "news-kuwait.html" or "index.html")
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Find all navigation links
  const navLinks = document.querySelectorAll('.nav-menu a');
  if (navLinks.length === 0) {
    console.warn('No navigation links found with class .nav-menu a');
    return;
  }

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');

    // Add 'active' class if the link matches the current page
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page'); // Accessibility enhancement
    } else {
      link.classList.remove('active'); // Ensure other links aren't marked active
      link.removeAttribute('aria-current');
    }
  });
}

// ==============================================
// 3. Function to INITIALIZE MOBILE MENU TOGGLE
// ==============================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Check if both elements exist
  if (!menuBtn || !navMenu) {
    console.warn('Mobile menu elements not found: .menu-btn or .nav-menu');
    return;
  }

  menuBtn.addEventListener('click', () => {
    // Toggle menu visibility
    const isActive = navMenu.classList.toggle('active');

    // Update ARIA attribute for accessibility
    menuBtn.setAttribute('aria-expanded', isActive);

    // Optional: Update button text/icon for better UX (if applicable)
    menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
}

// ==============================================
// 4. MAIN FUNCTION - Loads everything in order
// ==============================================
async function loadCommonComponents() {
  try {
    // Load HEADER at the start of <body>
    const headerLoaded = await loadComponent('/includes/header.html', 'body', 'afterbegin');
    if (!headerLoaded) {
      console.warn('Header failed to load, proceeding with navigation');
    }

    // Load NAVIGATION after the header (inside or after .header-bg)
    const navLoaded = await loadComponent('/includes/navigation.html', '.header-bg', 'afterend');
    if (!navLoaded) {
      console.warn('Navigation failed to load, some features may not work');
    }

    // Initialize features only if components are loaded
    if (headerLoaded || navLoaded) {
      setActiveNavLink(); // Highlight active page
      initMobileMenu();   // Enable mobile menu toggle
    }

    // Notify other scripts when done
    document.dispatchEvent(new Event('commonComponentsLoaded'));
  } catch (error) {
    console.error('Error in loadCommonComponents:', error);
  }
}

// ==============================================
// 5. START THE PROCESS when page loads
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  loadCommonComponents().catch(error => {
    console.error('Failed to initialize common components:', error);
  });
});
