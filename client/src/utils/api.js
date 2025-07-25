export async function apiFetch(url, options = {}, token = null) {
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API Error");
    return data;
}

export const apiPost = async (url, data, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // If a token is provided, add it to Authorization header
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
    }

    return response.json();
};