document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <div class="logo">Kuwait Telugu News</div>
        <nav class="nav-menu">
            <a href="index.html">Home</a>
            <a href="news-kuwait.html">News-Kuwait</a>
            <a href="news-telugu-states.html">News-Telugu-States</a>
            <a href="gold-price.html">Gold Price</a>
        </nav>
    `;
    document.body.prepend(header);
    console.log('Header and navigation injected successfully.');
});
