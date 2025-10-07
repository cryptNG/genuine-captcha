# \<genuine-captcha> VanillaJS Web Components

![Version](https://img.shields.io/badge/version-1.0.10-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

<genuine-captcha> Genuine Captcha is a privacy-first, open-source CAPTCHA API that lets you verify humans without logging IPs, cookies or personal data — fully GDPR-compliant by design. This repo provides HTML5 web component for easy usage of genuine captcha.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Interaction Hooks](#interaction-hooks)
- [Styling](#styling)
- [Language Support](#language-support)
- [How It Works](#how-it-works)
- [Examples](#examples)
- [Support](#support)

## Installation - Vanilla JS (CDN)

Simply include the <genuine-captcha> web component in your HTML file. Add the following script tag as the first element inside the `<body>` tag:

```html
<body>
    <script src="https://cryptng.github.io/genuine-captcha-vanillajs/genuine-captcha.js" crossorigin="anonymous"></script>
    <!-- Your content goes here -->
</body>
```

## Installation - NPM

Install the <genuine-captcha> web component in your project:

```bash
npm install @genuine-captcha/web-components
```

You might, depending on your bundler, have to import the package to make it available in your project. For example, in your main app file:

```js
import '@genuine-captcha/web-components';
```

## Usage

### Basic Usage

To use the `<genuine-captcha>` component, wrap your form submit button (or any content you want to protect) within the `<genuine-captcha>` element:

```html
<form action="https://genuine-forms.io/s/{form_id}" method="post">
  <label for="email">Your Email</label>
  <input name="Email" id="email" type="email">
  
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
- **`api-key`** (Optional): Your unique API key for accessing extended services

### Example with Configuration

```html
<genuine-captcha api-url="https://your-custom-api.com" api-key="your-api-key">
  <button type="submit">Submit</button>
</genuine-captcha>
```

## Interaction Hooks

The <genuine-captcha> component provides JavaScript interaction hooks for custom handling. These functions should be defined as top-level functions in the `window` object **before** the component loads.

### Available Hooks

#### `window.genuineCaptchaHandleVerify(solution, secret)`

Called when the captcha is successfully verified.

**Parameters:**
- `solution` (string): The user's solution to the captcha
- `secret` (string): The base64-encoded captcha secret for server-side verification

**Example:**
```js
window.genuineCaptchaHandleVerify = (solution, secret) => {
    console.log("CAPTCHA verified!");
    console.log("Solution:", solution);
    console.log("Secret:", secret);
    
    // You can now send these values to your backend for verification
    // Example: include them in a form submission or AJAX request
};
```

#### `window.genuineCaptchaReset()`

Called when the captcha is reset or reloaded.

**Example:**
```js
window.genuineCaptchaReset = () => {
    console.log("CAPTCHA has been reset");
    // Perform any cleanup or state reset needed
};
```

### Complete Example with Hooks

```html
<!DOCTYPE html>
<html>
<head>
    <title>Genuine Captcha Example</title>
</head>
<body>
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
            console.log("CAPTCHA reset");
        };
    </script>

    <script src="https://cryptng.github.io/genuine-captcha-vanillajs/genuine-captcha.js" crossorigin="anonymous"></script>

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
    --underline-color: red;
    --underline-style: dashed;
    --underline-width: 0.1em;
    --underline-top: calc(50% + 0.5em);
    --text-color: inherited;
    --text-family: revert;
    --text-size: auto;
    --text-cursor: pointer;
    --asterisk-margin-right: 0.2em;
}
```

## Language Support

The component automatically detects the browser language and displays text in the appropriate language:

- **English** (default): Displayed when browser language is English or as fallback
- **German**: Displayed when browser language starts with 'de'

Supported UI text includes:
- Puzzle title
- Input placeholder
- Button labels
- Success and error messages

## How It Works

1. **Initialization**: When the component loads, it automatically fetches a new captcha from the API
2. **Display**: The captcha image is displayed along with an input field for the user's answer
3. **Auto-Refresh**: Captchas are valid for 5 minutes by default. The component automatically loads a new captcha after expiration
4. **Verification**: When the user submits their answer:
   - The solution is verified against the captcha secret via the API
   - On success: The protected content (slot content) is revealed
   - On failure: An error message is displayed
5. **Manual Refresh**: Users can click "Try Another CAPTCHA" to load a new challenge at any time

### Captcha Lifecycle

```
┌─────────────┐
│  Component  │
│   Mounts    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Load Captcha │
│  from API   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     5 min timer    ┌─────────────┐
│   Display   │────────────────────▶│Auto Refresh │
│   Captcha   │                     └──────┬──────┘
└──────┬──────┘                            │
       │                                   │
       ▼                                   │
┌─────────────┐                            │
│    User     │                            │
│   Enters    │                            │
│  Solution   │                            │
└──────┬──────┘                            │
       │                                   │
       ▼                                   │
┌─────────────┐     Success        ┌──────┴──────┐
│   Verify    │───────────────────▶│Show Content │
│  Solution   │                     └─────────────┘
└──────┬──────┘
       │
       │ Failure
       ▼
┌─────────────┐
│Show Error & │
│Allow Retry  │
└─────────────┘
```

## Backend Verification

For security, you should verify the captcha on your backend using the `solution` and `secret` provided through the `genuineCaptchaHandleVerify` hook:

```javascript
// Backend verification example (Node.js)
const verifyCaptcha = async (solution, secret) => {
    const response = await fetch(
        `https://api.genuine-captcha.io/api/captcha/verify?captchaSolution=${solution}&captchaSecret=${encodeURIComponent(secret)}`,
        { mode: 'cors' }
    );
    
    return response.ok;
};
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
        const input1 = document.createElement('input');
        const input2 = document.createElement('input');
        input1.type = 'hidden';
        input1.name = 'captchaSolution';
        input1.value = solution;
        input2.type = 'hidden';
        input2.name = 'captchaSecret';
        input2.value = secret;
        form.appendChild(input1);
        form.appendChild(input2);
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
    <input type="email" name="email" required>
    
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
        }
    });
</script>
```

## Support

For support, issues, or contributions, please visit the [GitHub repository](https://github.com/cryptNG/genuine-captcha-vanillajs).

## License

MIT