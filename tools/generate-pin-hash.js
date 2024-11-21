async function generatePinHash(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(`PIN: ${pin}\nHash: ${hashHex}`);
}

// You can run this in your browser's console with:
// await generatePinHash("YOUR_PIN_HERE") 