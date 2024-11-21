async function sendMessage(message) {
    try {
        const response = await fetch('http://localhost:8080/chat', {
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