// src/utils/api.js

export async function apiFetch(url, options = {}) { // Removed token parameter, will get it internally
    // --- Fix: Get token from localStorage (or sessionStorage) ---
    const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token');
    // --- End Fix ---

    // Build headers, ensuring Content-Type is set and Authorization is added if token exists
    const headers = {
        "Content-Type": "application/json", // Default for JSON APIs
        ...(token && { "Authorization": `Bearer ${token}` }), // Add Bearer token if available
        ...options.headers, // Allow overriding or adding other headers from the call site
    };

    // Make the fetch request with the constructed headers
    const res = await fetch(url, { ...options, headers });

    // Handle non-OK responses
    if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
            // Try to parse error JSON from the response
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage; // Use backend error message if available
        } catch (e) {
            // If parsing JSON fails, fall back to status text
            errorMessage = `${errorMessage} - ${res.statusText}`;
        }
        // Throw an error object that can be caught by the calling function
        throw new Error(errorMessage);
    }

    // If the response is OK, try to parse JSON
    try {
        const data = await res.json();
        return data; // Return the parsed data
    } catch (e) {
        // If the response is OK but not JSON (e.g., empty 204), return null or handle as needed
        // For now, we assume successful responses are JSON. Adjust if needed.
        console.warn("Response was OK but parsing JSON failed:", e);
        return null; // Or throw an error if non-JSON success is unexpected
    }
}

// Keep your apiPost function, ensuring it also includes the token logic if needed
export const apiPost = async (url, data) => { // Removed token parameter
    const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        // Add Authorization header if token exists
        ...(token && { "Authorization": `Bearer ${token}` }),
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            errorMessage = `${errorMessage} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    // Try to parse JSON response
    try {
        const responseData = await response.json();
        return responseData;
    } catch (e) {
        console.warn("POST Response was OK but parsing JSON failed:", e);
        return null; // Or handle non-JSON response
    }
};

// --- Optional: Create a more generic apiCall function ---
// You could refactor both GET/PUT/PATCH/DELETE and POST to use a single base function
// if they share the same auth logic.