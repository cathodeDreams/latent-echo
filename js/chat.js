async function sendMessage(message) {
    try {
        // Determine API endpoint based on environment
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocalhost 
            ? 'http://localhost:8080/chat'
            : 'https://api.latentecho.net/chat';  // Update this to your API domain

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Export the function so it can be used by other modules
window.sendMessage = sendMessage; 