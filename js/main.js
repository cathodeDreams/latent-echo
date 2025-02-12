document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.innerHTML = '◑';
    
    // Find footer content and append theme toggle
    const footerContent = document.querySelector('.footer-content');
    footerContent.appendChild(themeToggle);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    const theme = storedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
    
    function updateThemeToggle(isDark) {
        themeToggle.setAttribute('aria-label', 
            `Switch to ${isDark ? 'light' : 'dark'} mode`);
        themeToggle.setAttribute('aria-pressed', isDark);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggle(newTheme === 'dark');
    });
    
    // Add viewport height calculation
    function setVHProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial value
    setVHProperty();
    
    // Update on resize and orientation change
    ['resize', 'orientationchange'].forEach(evt => 
        window.addEventListener(evt, () => {
            setVHProperty();
        })
    );
    
    // Update last modified date
    function updateLastModified() {
        const timeElement = document.querySelector('#last-updated time');
        if (timeElement) {
            const now = new Date();
            const dateString = now.toISOString().split('T')[0];
            timeElement.textContent = dateString;
            timeElement.setAttribute('datetime', dateString);
        }
    }
    
    // Call it after DOM is loaded
    updateLastModified();
}); 