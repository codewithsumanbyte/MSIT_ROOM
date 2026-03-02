export const getBaseUrl = () => {
    // If we're on localhost, use the local server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    // Otherwise use the production Render API
    return 'https://msit-room-api.onrender.com';
};

export const SERVER_URL = getBaseUrl();
