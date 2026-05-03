export const apiFetch = (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  return fetch(endpoint, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "ngrok-skip-browser-warning": "true",
      ...options.headers
    }
  });
};
