# Task: Add a Private Local-First Chat Interface to Personal Website

## Context
You are helping extend an existing personal website with a private chat interface. The website is currently hosted on Cloudflare Pages as a static site, and the source code is public on GitHub.

## Core Requirements

### Privacy & Security
- Chat interface should only be accessible to the website owner
- No sensitive credentials should be stored in the public repository
- Chat conversations must remain private and stored locally
- Authentication should be elegant and device-based rather than password-dependent

### Architecture
- Frontend remains hosted on Cloudflare Pages
- New local backend server to host the LLM (GGUF model)
- Local storage for chat history
- Device-based authentication system

## Detailed Specifications

### Frontend Components
1. Create a new route `/chat` in the existing website
2. Design a clean chat interface with:
   - Message history display
   - Input field for new messages
   - Clear indication of connection status to local backend
   - Proper error states for when local server is unavailable

### Local Backend Server
1. Implement a lightweight API server that:
   - Runs locally on the owner's machine
   - Serves the GGUF model
   - Handles chat completions
   - Manages chat history storage
   - Implements security validations

### Authentication System
1. Device Registration Flow:
   - Generate unique device fingerprint on first visit
   - Store encrypted device key in localStorage
   - Validate device key with local backend
   - Provide clear UX for new device registration

### Data Privacy
1. Chat History:
   - Store all conversations locally
   - Implement optional encryption at rest
   - Add export/backup functionality
   - Include clear history option

### Security Measures
1. API Security:
   - CORS restrictions to known origins
   - Request signing between frontend/backend
   - Rate limiting
   - Localhost-only binding

### Error Handling
1. Graceful degradation for common scenarios:
   - Local server not running
   - Invalid device credentials
   - Network interruptions
   - Model loading issues

## Implementation Guidelines

### Frontend Code Structure
```javascript
// Example component structure
/components
  /chat
    DeviceAuth.js      // Handle device registration
    ChatInterface.js   // Main chat UI
    MessageList.js     // Chat history display
    InputArea.js       // Message input
    ConnectionStatus.js // Backend status indicator
```

### Local Server API Endpoints
```
GET  /api/health       // Server status
POST /api/auth/device  // Device registration
POST /api/chat        // Chat completions
GET  /api/history     // Chat history
```

### Security Flow
```
1. User visits /chat
2. Check for existing device key
3. If none exists:
   - Generate device fingerprint
   - Request registration from local server
   - Store encrypted key
4. All subsequent requests:
   - Include device key in headers
   - Validate with local server
```

## Development Phases

### Phase 1: Core Infrastructure
- Set up local server
- Implement basic device authentication
- Add chat route to frontend

### Phase 2: Chat Features
- Integrate GGUF model
- Implement chat interface
- Add real-time connection status

### Phase 3: Security & Privacy
- Add encryption
- Implement proper error handling
- Add history management

### Phase 4: Polish
- Improve UI/UX
- Add settings/preferences
- Documentation

## Success Criteria
- Website owner can access chat from their devices
- Unauthorized users cannot access chat interface
- All conversations remain private and local
- System is resilient to common failure modes
- UX remains smooth and intuitive

## Notes
- This implementation prioritizes privacy and security while maintaining simplicity
- No cloud services or complex authentication required
- All sensitive operations happen locally
- Design allows for future extensions while keeping core simple