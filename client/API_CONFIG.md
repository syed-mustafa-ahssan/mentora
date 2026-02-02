# Using the API Configuration

To ensure your app works in both development and production, use the API configuration helper.

## Import the helper

```javascript
import { getApiUrl } from '../src/config/api';
```

## Usage

Instead of hardcoding URLs like:
```javascript
// ❌ Don't do this
fetch('http://localhost:5000/api/users/login', { ... })
```

Use the helper function:
```javascript
// ✅ Do this
import { getApiUrl } from '../src/config/api';

fetch(getApiUrl('users/login'), { ... })
```

## Examples

```javascript
// Login
fetch(getApiUrl('users/login'), {
  method: 'POST',
  body: JSON.stringify({ email, password })
})

// Get courses
apiFetch(getApiUrl('users/get-all-courses'))

// Get user profile
fetch(getApiUrl(`users/profile/${userId}`))
```

## How it works

- **Development**: Uses `VITE_API_URL` from `.env` (defaults to `http://localhost:5000/api`)
- **Production**: Uses `/api` which routes to your Vercel serverless functions

The helper automatically handles:
- Environment detection
- Proper URL construction
- Removing duplicate slashes
