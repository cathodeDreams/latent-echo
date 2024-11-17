document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.innerHTML = '◐';
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    const theme = storedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
    
    const updateThemeToggle = (isDark) => {
        themeToggle.setAttribute('aria-label', 
            `Switch to ${isDark ? 'light' : 'dark'} mode`);
        themeToggle.setAttribute('aria-pressed', isDark);
    };
    
    const handleThemeChange = () => {
        try {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggle(newTheme === 'dark');
        } catch (e) {
            console.error('Theme preference could not be saved:', e);
        }
    };
    
    themeToggle.addEventListener('click', handleThemeChange);
    
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute(
                'data-theme',
                e.matches ? 'dark' : 'light'
            );
            updateThemeToggle(e.matches);
        }
    });
    
    document.body.appendChild(themeToggle);
});
