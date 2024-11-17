document.addEventListener('DOMContentLoaded', () => {
    // Reading time calculation
    const text = document.querySelector('.manifesto').textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const timeElement = document.createElement('div');
    timeElement.className = 'reading-time';
    timeElement.textContent = `${readingTime} min read`;
    document.querySelector('header').appendChild(timeElement);

    // Theme toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = '🌓';
    document.body.appendChild(themeToggle);

    // Theme handling
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}); 