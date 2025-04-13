document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <div class="logo">Kuwait Telugu News</div>
        <nav class="nav-menu">
            <a href="index.html">Home</a>
            <div class="dropdown">
                <a href="#" class="dropdown-toggle">News <i class="fas fa-caret-down"></i></a>
                <div class="dropdown-menu">
                    <a href="news/kuwait.html">Kuwait</a>
                    <a href="news/andhra-pradesh.html">Andhra Pradesh</a>
                    <a href="news/telangana.html">Telangana</a>
                    <a href="news/india.html">India</a>
                </div>
            </div>
            <a href="gold-price.html">Gold Price</a>
        </nav>
    `;
    document.body.prepend(header);
    console.log('Header and navigation injected successfully.');

    // Dropdown toggle for mobile
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = dropdownToggle.nextElementSibling;
            dropdownMenu.classList.toggle('active');
        });
    }
});
