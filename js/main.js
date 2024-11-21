document.addEventListener('DOMContentLoaded', () => {
    console.log('Environment:', {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        configPresent: typeof CONFIG !== 'undefined',
        pinHash: CONFIG?.PIN_HASH?.substring(0, 8) + '...' // Log first 8 chars only
    });
    
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
    
    // PIN verification system
    let pinBuffer = '';
    
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Create chat interface
    function createChatInterface() {
        const chatModal = document.createElement('div');
        chatModal.className = 'chat-modal';
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        
        const chatHistory = document.createElement('div');
        chatHistory.className = 'chat-history';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'chat-input-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'chat-input';
        input.placeholder = 'Type your message...';
        
        const sendButton = document.createElement('button');
        sendButton.className = 'chat-send';
        sendButton.textContent = '→';

        const modelInfo = document.createElement('div');
        modelInfo.className = 'model-info';
        modelInfo.innerHTML = `
            <span>Model: Qwen2.5-14B</span>
            <button class="clear-button">Clear Chat</button>
        `;
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(sendButton);
        
        chatContainer.appendChild(chatHistory);
        chatContainer.appendChild(inputContainer);
        chatContainer.appendChild(modelInfo);
        chatModal.appendChild(chatContainer);
        
        document.body.appendChild(chatModal);
        
        return { chatModal, chatHistory, input, sendButton, modelInfo };
    }

    // Initialize chat interface
    const { chatModal, chatHistory, input, sendButton, modelInfo } = createChatInterface();

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
        
        const header = document.createElement('div');
        header.className = 'pin-header';
        header.textContent = 'Enter PIN';
        
        const display = document.createElement('div');
        display.className = 'pin-display';
        for (let i = 0; i < 4; i++) {
            const digit = document.createElement('div');
            digit.className = 'pin-digit';
            display.appendChild(digit);
        }
        
        const keypad = document.createElement('div');
        keypad.className = 'pin-keypad';
        
        // Add number keys with touch-friendly design
        for (let i = 1; i <= 9; i++) {
            const key = createPinKey(i.toString());
            keypad.appendChild(key);
        }
        
        // Add 0 key
        const zeroKey = createPinKey('0');
        zeroKey.style.gridColumn = '2';
        keypad.appendChild(zeroKey);
        
        // Add backspace key
        const backKey = createPinKey('←', () => {
            pinBuffer = pinBuffer.slice(0, -1);
            updatePinDisplay();
        });
        backKey.style.gridColumn = '3';
        keypad.appendChild(backKey);
        
        container.appendChild(closeBtn);
        container.appendChild(header);
        container.appendChild(display);
        container.appendChild(keypad);
        modal.appendChild(container);
        
        return modal;
    }

    function createPinKey(text, customHandler) {
        const key = document.createElement('button');
        key.className = 'pin-key';
        key.textContent = text;
        
        // Prevent default touch behavior
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            key.classList.add('active');
        });
        
        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            key.classList.remove('active');
            if (customHandler) {
                customHandler();
            } else if (pinBuffer.length < 4) {
                handlePinInput(text);
            }
        });
        
        // Keep mouse events for desktop
        key.addEventListener('click', (e) => {
            if (e.pointerType !== 'touch' && !customHandler) {
                if (pinBuffer.length < 4) {
                    handlePinInput(text);
                }
            }
        });
        
        return key;
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
            chatModal.classList.add('active');
            input.focus();
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

    // Handle chat submission
    async function handleChatSubmit() {
        const message = input.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user-message';
        userMsg.textContent = message;
        chatHistory.appendChild(userMsg);

        // Clear input
        input.value = '';
        input.disabled = true;
        sendButton.disabled = true;

        try {
            // Send message to server
            const response = await sendMessage(message);

            // Add assistant response to chat
            const assistantMsg = document.createElement('div');
            assistantMsg.className = 'chat-message assistant-message';
            assistantMsg.textContent = response;
            chatHistory.appendChild(assistantMsg);

            // Scroll to bottom
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'chat-message error-message';
            errorMsg.textContent = 'Error: Could not send message';
            chatHistory.appendChild(errorMsg);
        }

        // Re-enable input
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
    }

    // Add event listeners for chat
    sendButton.addEventListener('click', handleChatSubmit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });

    // Clear chat functionality
    const clearButton = modelInfo.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        chatHistory.innerHTML = '';
    });

    // Close chat when clicking outside
    chatModal.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.classList.remove('active');
        }
    });
}); 