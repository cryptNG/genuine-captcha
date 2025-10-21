# \<genuine-captcha> VanillaJS Web Components

![Version](https://img.shields.io/badge/version-1.0.10-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

\<genuine-captcha> Genuine Captcha is a privacy-first, open-source CAPTCHA API that lets you verify humans without logging IPs, cookies or personal data — fully GDPR-compliant by design. This repo provides HTML5 web component for easy usage of genuine captcha.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Interaction Hooks](#interaction-hooks)
- [Styling](#styling)
- [Language Support](#language-support)
- [How It Works](#how-it-works)
- [Named Instances](#named-instances)
- [Examples](#examples)
- [Backend Verification](#backend-verification)
- [Support](#support)

## Installation - Vanilla JS (CDN)

Simply include the \<genuine-captcha> web component in your HTML file. Add the following script tag:

```html
<script type="module" src="https://cryptng.github.io/genuine-captcha-vanillajs/genuine-captcha.js"></script>
```

> **Note:** The component automatically prepends its template to the document body, so it can be loaded anywhere in your HTML.

## Installation - NPM

Install the \<genuine-captcha> web component in your project:

```bash
npm install @genuine-captcha/web-components
```

Import the package in your main app file:

```js
import '@genuine-captcha/web-components';
```

## Usage

### Basic Usage

To use the `<genuine-captcha>` component, wrap your form submit button (or any content you want to protect) within the `<genuine-captcha>` element:

```html
<form action="/submit" method="post">
  <label for="email">Your Email</label>
  <input name="email" id="email" type="email" required>
  
  <genuine-captcha>
    <button type="submit">Submit</button>  
  </genuine-captcha>
</form>
```

The content inside `<genuine-captcha>` (in this case, the submit button) will only be displayed after the user successfully solves the captcha.

## Configuration

The component supports the following attributes:

### Attributes

- **`api-url`** (Optional): Custom genuine captcha API endpoint URL. Defaults to `https://api.genuine-captcha.io`
- **`name`** (Optional): Unique identifier for the captcha instance. Required when using multiple captchas on the same page or when you want to identify which captcha was verified/reset in the hook functions.

### Example with Configuration

```html
<genuine-captcha api-url="https://your-custom-api.com" name="contact-captcha">
  <button type="submit">Submit</button>
</genuine-captcha>
```

## Interaction Hooks

The \<genuine-captcha> component provides JavaScript interaction hooks for custom handling. These functions should be defined as top-level functions in the `window` object **before** the component loads or within the 100ms initialization window.

### Available Hooks

#### `window.genuineCaptchaHandleVerify(solution, secret)` or `window.genuineCaptchaHandleVerify(name, solution, secret)`

Called when the captcha is successfully verified.

**Parameters (unnamed captcha):**
- `solution` (string): The user's solution to the captcha
- `secret` (string): The base64-encoded captcha secret for server-side verification

**Parameters (named captcha):**
- `name` (string): The name attribute value of the captcha instance
- `solution` (string): The user's solution to the captcha
- `secret` (string): The base64-encoded captcha secret for server-side verification

**Example (unnamed captcha):**
```js
window.genuineCaptchaHandleVerify = (solution, secret) => {
    console.log("CAPTCHA verified!");
    console.log("Solution:", solution);
    console.log("Secret:", secret);
    
    // Send these values to your backend for verification
};
```

**Example (named captcha):**
```js
window.genuineCaptchaHandleVerify = (name, solution, secret) => {
    console.log(`CAPTCHA "${name}" verified!`);
    console.log("Solution:", solution);
    console.log("Secret:", secret);
    
    // Handle different captchas based on name
    if (name === 'contact-captcha') {
        // Handle contact form verification
    } else if (name === 'signup-captcha') {
        // Handle signup form verification
    }
};
```

#### `window.genuineCaptchaReset()` or `window.genuineCaptchaReset(name)`

Called when the user clicks "Try Another CAPTCHA" to refresh/reset the captcha.

**Parameters (unnamed captcha):**
- None

**Parameters (named captcha):**
- `name` (string): The name attribute value of the captcha instance

**Example (unnamed captcha):**
```js
window.genuineCaptchaReset = () => {
    console.log("CAPTCHA has been reset");
    // Perform any cleanup or state reset needed
};
```

**Example (named captcha):**
```js
window.genuineCaptchaReset = (name) => {
    console.log(`CAPTCHA "${name}" has been reset`);
    
    // Handle different captchas based on name
    if (name === 'contact-captcha') {
        // Clear contact form captcha state
    } else if (name === 'signup-captcha') {
        // Clear signup form captcha state
    }
};
```

### Complete Example with Hooks

```html
<!DOCTYPE html>
<html>
<head>
    <title>Genuine Captcha Example</title>
    <script>
        // Define hooks before loading the component
        window.genuineCaptchaHandleVerify = (solution, secret) => {
            console.log("CAPTCHA verified:", solution, secret);
            
            // Send to your backend for verification
            fetch('/api/verify', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    captchaSolution: solution,
                    captchaSecret: secret
                })
            });
        };

        window.genuineCaptchaReset = () => {
            console.log("CAPTCHA reset - clearing form state");
            // Clear any stored captcha data
        };
    </script>
</head>
<body>
    <script type="module" src="https://cryptng.github.io/genuine-captcha-vanillajs/genuine-captcha.js"></script>

    <form id="myForm">
        <input type="email" name="email" placeholder="Your email" required>
        
        <genuine-captcha>
            <button type="submit">Submit Form</button>
        </genuine-captcha>
    </form>
</body>
</html>
```

## Styling

The component uses Shadow DOM and provides CSS custom properties for styling:

```css
genuine-captcha {
    /* Button colors */
    --verify-button-background-color: #6366f1;
    --verify-button-background-color-hover: #4346d4;
}
```

### Styling Example

```html
<style>
    genuine-captcha {
        --verify-button-background-color: #10b981;
        --verify-button-background-color-hover: #059669;
    }
</style>

<genuine-captcha>
    <button type="submit">Submit</button>
</genuine-captcha>
```

## Language Support

The component automatically detects the browser language and displays text in the appropriate language:

- **English** (default): Displayed when browser language is English or as fallback
- **German**: Displayed when browser language starts with 'de'

### Supported UI Text

All user-facing text is automatically localized, including:

| UI Element | English | German |
|------------|---------|--------|
| Puzzle title | "Tiny puzzle time: what is the solution?" | "Kleines Rätsel: Was ist die Lösung?" |
| Input placeholder | "Your answer" | "Deine Antwort" |
| Verify button | "Verify" | "Überprüfen" |
| Refresh button | "Try Another CAPTCHA" | "Neues CAPTCHA" |
| Loading message | "Loading CAPTCHA..." | "Lade CAPTCHA..." |
| Success message | "Success! CAPTCHA verified correctly." | "Erfolg! CAPTCHA korrekt gelöst." |
| Error messages | Various error states | Corresponding German translations |

Language detection is based on `navigator.language` and happens automatically on component initialization.

## How It Works

1. **Initialization**: When the component loads, it automatically fetches a new captcha from the API after a 100ms delay
2. **Display**: The captcha image is displayed along with an input field for the user's answer
3. **Auto-Refresh**: Captchas are automatically reloaded 2 seconds before expiration (based on `validTill` from API, defaults to 5 minutes)
4. **Verification**: When the user submits their answer:
   - The solution is verified against the captcha secret via the API
   - On success: The protected content (slot content) is revealed and `genuineCaptchaHandleVerify` is called
   - On failure: An error message is displayed and the user can try again
5. **Manual Refresh**: Users can click "Try Another CAPTCHA" to load a new challenge at any time, triggering the `genuineCaptchaReset` hook

### Captcha Lifecycle

```
┌─────────────┐
│  Component  │
│   Mounts    │
└──────┬──────┘
       │
       ▼ (100ms delay)
┌─────────────┐
│Load Captcha │
│  from API   │
└──────┬──────┘
       │
       ▼
┌─────────────┐   validTill-2s timer   ┌─────────────┐
│   Display   │────────────────────────▶│Auto Refresh │
│   Captcha   │                         └──────┬──────┘
└──────┬──────┘                                │
       │                                       │
       │ User clicks "Try Another CAPTCHA"     │
       │  → genuineCaptchaReset() called       │
       │◄──────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│   Enters    │
│  Solution   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     Success        ┌────────────────────┐
│   Verify    │───────────────────▶│   Show Content &   │
│  Solution   │                     │genuineCaptchaHandle│
└──────┬──────┘                     │    Verify()        │
       │                            └────────────────────┘
       │ Failure
       ▼
┌─────────────┐
│Show Error & │
│Allow Retry  │
└─────────────┘
```

### Visual States

The component has several visual states:

1. **Loading**: Displays a spinner and loading message while fetching captcha
2. **Ready**: Shows the captcha image, input field, verify button, and refresh button
3. **Success**: Hides the captcha interface and displays success message with protected content
4. **Error**: Shows error message while keeping the captcha interface visible for retry

## Named Instances

When using multiple captchas on the same page, provide unique `name` attributes to identify each instance in both verify and reset hooks:

```html
<form id="contactForm">
    <genuine-captcha name="contact-captcha">
        <button type="submit">Send Message</button>
    </genuine-captcha>
</form>

<form id="newsletterForm">
    <genuine-captcha name="newsletter-captcha">
        <button type="submit">Subscribe</button>
    </genuine-captcha>
</form>

<script>
    // Handle verification for multiple captchas
    window.genuineCaptchaHandleVerify = (name, solution, secret) => {
        console.log(`Captcha "${name}" verified`);
        
        if (name === 'contact-captcha') {
            // Handle contact form
            document.getElementById('contactForm').submit();
        } else if (name === 'newsletter-captcha') {
            // Handle newsletter form
            document.getElementById('newsletterForm').submit();
        }
    };
    
    // Handle reset for multiple captchas
    window.genuineCaptchaReset = (name) => {
        console.log(`Captcha "${name}" reset`);
        
        if (name === 'contact-captcha') {
            // Clear contact form state
            document.getElementById('contactForm').reset();
        } else if (name === 'newsletter-captcha') {
            // Clear newsletter form state
            document.getElementById('newsletterForm').reset();
        }
    };
</script>
```

## Backend Verification

For security, you should **always verify the captcha on your backend** using the `solution` and `secret` provided through the `genuineCaptchaHandleVerify` hook.

### Verification Endpoint

Send a GET request to the verification endpoint:

```
GET https://api.genuine-captcha.io/api/captcha/verify?captchaSolution={solution}&captchaSecret={secret}
```

### Backend Verification Examples

#### Node.js / Express

```javascript
const verifyCaptcha = async (solution, secret) => {
    const response = await fetch(
        `https://api.genuine-captcha.io/api/captcha/verify?captchaSolution=${solution}&captchaSecret=${encodeURIComponent(secret)}`,
        { mode: 'cors' }
    );
    
    return response.ok;
};

app.post('/api/submit', async (req, res) => {
    const { captchaSolution, captchaSecret, ...formData } = req.body;
    
    const isValid = await verifyCaptcha(captchaSolution, captchaSecret);
    
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid captcha' });
    }
    
    // Process form data
    res.json({ success: true });
});
```

#### PHP

```php
function verifyCaptcha($solution, $secret) {
    $url = 'https://api.genuine-captcha.io/api/captcha/verify?' . 
           http_build_query([
               'captchaSolution' => $solution,
               'captchaSecret' => $secret
           ]);
    
    $response = file_get_contents($url);
    $statusCode = $http_response_header[0];
    
    return strpos($statusCode, '200') !== false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $solution = $_POST['captchaSolution'];
    $secret = $_POST['captchaSecret'];
    
    if (verifyCaptcha($solution, $secret)) {
        // Process form
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid captcha']);
    }
}
```

#### Python / Flask

```python
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_captcha(solution, secret):
    url = f'https://api.genuine-captcha.io/api/captcha/verify'
    params = {
        'captchaSolution': solution,
        'captchaSecret': secret
    }
    
    response = requests.get(url, params=params)
    return response.ok

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    solution = data.get('captchaSolution')
    secret = data.get('captchaSecret')
    
    if not verify_captcha(solution, secret):
        return jsonify({'error': 'Invalid captcha'}), 400
    
    # Process form data
    return jsonify({'success': True})
```

## Examples

### Example 1: Contact Form

```html
<form id="contactForm">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Message" required></textarea>
    
    <genuine-captcha>
        <button type="submit">Send Message</button>
    </genuine-captcha>
</form>

<script>
    window.genuineCaptchaHandleVerify = (solution, secret) => {
        // Add captcha data to form before submission
        const form = document.getElementById('contactForm');
        
        const solutionInput = document.createElement('input');
        solutionInput.type = 'hidden';
        solutionInput.name = 'captchaSolution';
        solutionInput.value = solution;
        
        const secretInput = document.createElement('input');
        secretInput.type = 'hidden';
        secretInput.name = 'captchaSecret';
        secretInput.value = secret;
        
        form.appendChild(solutionInput);
        form.appendChild(secretInput);
    };
</script>
```

### Example 2: Custom API Endpoint

```html
<genuine-captcha api-url="https://my-captcha-server.com">
    <button type="submit">Protected Action</button>
</genuine-captcha>
```

### Example 3: AJAX Form Submission

```html
<form id="ajaxForm">
    <input type="email" name="email" placeholder="Email" required>
    
    <genuine-captcha>
        <button type="submit">Subscribe</button>
    </genuine-captcha>
</form>

<script>
    let captchaData = {};
    
    window.genuineCaptchaHandleVerify = (solution, secret) => {
        captchaData = { solution, secret };
    };
    
    document.getElementById('ajaxForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Include captcha data
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                captchaSolution: captchaData.solution,
                captchaSecret: captchaData.secret
            })
        });
        
        if (response.ok) {
            alert('Subscribed successfully!');
            e.target.reset();
        } else {
            alert('Subscription failed. Please try again.');
        }
    });
</script>
```

### Example 4: Multiple Named Captchas

```html
<h2>Contact Form</h2>
<form id="contactForm">
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    
    <genuine-captcha name="contact-form">
        <button type="submit">Send</button>
    </genuine-captcha>
</form>

<h2>Newsletter Signup</h2>
<form id="newsletterForm">
    <input type="email" name="email" required>
    
    <genuine-captcha name="newsletter-form">
        <button type="submit">Subscribe</button>
    </genuine-captcha>
</form>

<script>
    const captchaData = {};
    
    window.genuineCaptchaHandleVerify = (name, solution, secret) => {
        console.log(`Captcha "${name}" verified`);
        captchaData[name] = { solution, secret };
    };
    
    window.genuineCaptchaReset = (name) => {
        console.log(`Captcha "${name}" reset`);
        // Clear stored data for this captcha
        delete captchaData[name];
    };
    
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = captchaData['contact-form'];
        // Submit contact form with data.solution and data.secret
    });
    
    document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = captchaData['newsletter-form'];
        // Submit newsletter form with data.solution and data.secret
    });
</script>
```

### Example 5: Custom Styled Captcha

```html
<style>
    genuine-captcha {
        --verify-button-background-color: #10b981;
        --verify-button-background-color-hover: #059669;
    }
    
    .captcha-wrapper {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        background: #f9fafb;
        border-radius: 0.5rem;
    }
</style>

<div class="captcha-wrapper">
    <h3>Verify you're human</h3>
    <genuine-captcha>
        <button type="submit">Continue</button>
    </genuine-captcha>
</div>
```

### Example 6: Reset Hook with State Management

```html
<form id="complexForm">
    <input type="email" name="email" required>
    <div id="captcha-status"></div>
    
    <genuine-captcha name="complex-form">
        <button type="submit">Submit</button>
    </genuine-captcha>
</form>

<script>
    let formState = {
        captchaVerified: false,
        captchaSolution: null,
        captchaSecret: null
    };
    
    window.genuineCaptchaHandleVerify = (name, solution, secret) => {
        formState.captchaVerified = true;
        formState.captchaSolution = solution;
        formState.captchaSecret = secret;
        document.getElementById('captcha-status').textContent = '✓ Verified';
        document.getElementById('captcha-status').style.color = 'green';
    };
    
    window.genuineCaptchaReset = (name) => {
        // Clear all captcha state when user clicks refresh
        formState.captchaVerified = false;
        formState.captchaSolution = null;
        formState.captchaSecret = null;
        document.getElementById('captcha-status').textContent = '';
        console.log('Form state cleared due to captcha reset');
    };
    
    document.getElementById('complexForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!formState.captchaVerified) {
            alert('Please complete the captcha first');
            return;
        }
        
        // Submit with captcha data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                captchaSolution: formState.captchaSolution,
                captchaSecret: formState.captchaSecret
            })
        });
    });
</script>
```

## Troubleshooting

### Captcha doesn't load
- Check browser console for errors
- Verify the API endpoint is accessible
- Ensure you're not blocking requests with CORS or CSP policies

### Verification fails even with correct answer
- Ensure the captcha hasn't expired (auto-refreshes after 5 minutes by default)
- Check that your backend is properly verifying with the API
- Verify the solution and secret are being passed correctly

### Multiple captchas interfere with each other
- Assign unique `name` attributes to each captcha instance
- Update your verify and reset hooks to handle the `name` parameter

### Custom hooks not being called
- Define hooks before loading the component script
- Check for JavaScript errors that might prevent hook registration
- Verify hook function names are exactly: `window.genuineCaptchaHandleVerify` and `window.genuineCaptchaReset`

### Reset hook not triggered
- The reset hook is currently only called when the user manually clicks "Try Another CAPTCHA"
- Auto-refresh (after expiry) does not trigger the reset hook

## API Response Format

### Create Captcha Response

```json
{
  "ImageAsBase64": "iVBORw0KGgoAAAANS...",
  "SecretAsBase64": "eyJhbGciOiJIUzI1...",
  "validTill": 1234567890000
}
```

### Verify Response

- **Success**: HTTP 200 OK
- **Failure**: HTTP 4xx/5xx error

## Support

For support, issues, or contributions, please visit the [GitHub repository](https://github.com/cryptNG/genuine-captcha-vanillajs).

## License

MIT