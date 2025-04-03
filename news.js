const newsData = [
    { title: "రాష్ట్రంలో భారీ వర్షాలు", date: "మార్చి 15, 2024", image: "https://via.placeholder.com/300x200?text=Rain+News" },
    { title: "కువైట్‌లో తెలుగు సంఘం", date: "మార్చి 14, 2024", image: "https://via.placeholder.com/300x200?text=Cultural+Event" },
    { title: "జాతీయ క్రికెట్ టీమ్ కు కొత్త కోచ్", date: "మార్చి 13, 2024", image: "https://via.placeholder.com/300x200?text=Cricket+News" }
];

const newsContainer = document.getElementById("newsContainer");
newsData.forEach(news => {
    const newsItem = document.createElement("div");
    newsItem.innerHTML = `<img src="${news.image}" alt="${news.title}">
                          <h3>${news.title}</h3>
                          <p>${news.date}</p>`;
    newsContainer.appendChild(newsItem);
});

