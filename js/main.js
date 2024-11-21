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
    
    // Pin verification system
    let pinBuffer = '';
    let pinTimeout;

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // PIN Modal functionality
    const terminalButton = document.getElementById('terminal-access');
    if (terminalButton) {
        const modal = createPinModal();
        document.body.appendChild(modal);
        
        terminalButton.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    function createPinModal() {
        const modal = document.createElement('div');
        modal.className = 'pin-modal';
        
        const container = document.createElement('div');
        container.className = 'pin-container';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'pin-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            clearPin();
        });
        
        const display = document.createElement('div');
        display.className = 'pin-display';
        for (let i = 0; i < 4; i++) {
            const digit = document.createElement('div');
            digit.className = 'pin-digit';
            display.appendChild(digit);
        }
        
        const keypad = document.createElement('div');
        keypad.className = 'pin-keypad';
        
        // Add number keys
        for (let i = 1; i <= 9; i++) {
            const key = document.createElement('button');
            key.className = 'pin-key';
            key.textContent = i;
            key.addEventListener('click', () => handlePinInput(i.toString()));
            keypad.appendChild(key);
        }
        
        // Add 0 key
        const zeroKey = document.createElement('button');
        zeroKey.className = 'pin-key';
        zeroKey.textContent = '0';
        zeroKey.style.gridColumn = '2';
        zeroKey.addEventListener('click', () => handlePinInput('0'));
        keypad.appendChild(zeroKey);
        
        container.appendChild(closeBtn);
        container.appendChild(display);
        container.appendChild(keypad);
        modal.appendChild(container);
        
        return modal;
    }

    function handlePinInput(digit) {
        pinBuffer += digit;
        updatePinDisplay();
        
        if (pinBuffer.length === 4) {
            verifyPin();
        }
    }

    function updatePinDisplay() {
        const digits = document.querySelectorAll('.pin-digit');
        digits.forEach((digit, index) => {
            digit.classList.toggle('filled', index < pinBuffer.length);
        });
    }

    async function verifyPin() {
        const hashedInput = await sha256(pinBuffer);
        const modal = document.querySelector('.pin-modal');
        
        if (hashedInput === CONFIG.PIN_HASH) {
            modal.classList.remove('active');
            window.location.href = '/pages/chat.html';
        } else {
            // Wrong PIN animation
            modal.classList.add('error');
            setTimeout(() => {
                modal.classList.remove('error');
                clearPin();
            }, 500);
        }
    }

    function clearPin() {
        pinBuffer = '';
        updatePinDisplay();
    }
}); 