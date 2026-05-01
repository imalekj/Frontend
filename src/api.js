
export const apiFetch = (endpoint, options = {}) => {
    return fetch(`${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            ...options.headers
        }
    });
};
