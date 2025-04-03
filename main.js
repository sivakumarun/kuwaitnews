// In the renderNews function, update the newsItem creation:
filteredNews.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.innerHTML = `
        <a href="news/${getNewsSlug(news.title)}.html">
            <img src="${news.image}" alt="${news.title}" class="news-image">
            <div class="news-content">
                <span class="news-category">${getCategoryName(news.category)}</span>
                <h3 class="news-title">${news.title}</h3>
                <div class="news-date">${news.date}</div>
                <p class="news-excerpt">${news.excerpt}</p>
                <span class="read-more">ఇంకా చదవండి →</span>
            </div>
        </a>
    `;
    newsContainer.appendChild(newsItem);
});

// Helper function to create slugs for filenames
function getNewsSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\u0C00-\u0C7F]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
