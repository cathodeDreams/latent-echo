// Theme management module
const ThemeManager = {
    init() {
        // Add loading class immediately
        document.documentElement.classList.add('loading');
        
        // Apply initial theme with fallback
        const theme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.applyTheme(theme);
        
        // Setup theme toggle once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggle());
        } else {
            this.setupToggle();
        }

        // Remove loading class after a maximum timeout
        setTimeout(() => this.removeLoading(), 1000);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },

    removeLoading() {
        document.documentElement.classList.remove('loading');
    },

    setupToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.setAttribute('aria-pressed', 'false');
        themeToggle.innerHTML = '◑';
        
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.appendChild(themeToggle);
            
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
                themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
            });
        }
    }
};

// Initialize theme management
ThemeManager.init(); 