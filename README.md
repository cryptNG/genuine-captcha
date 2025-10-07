# Genuine CAPTCHA API

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Privacy](https://img.shields.io/badge/GDPR-compliant-success.svg)

**A privacy-first, open-source CAPTCHA API that verifies humans without logging IPs, cookies, or personal data.**

Genuine CAPTCHA provides a self-hostable CAPTCHA solution with time-windowed authentication, cryptographic security, and zero personal data collection. Built with ASP.NET Core and designed for complete privacy compliance.

## 🌟 Features

- **🔒 Privacy-First**: No IP logging, no cookies, no personal data collection - fully GDPR compliant by design
- **⏰ Time-Windowed Authentication**: 5-minute validity window prevents replay attacks and makes brute force attacks economically worthless
- **🔐 Cryptographic Security**: AES-256 encryption with SHA-256 hashed time-based keys
- **🛡️ Timing Attack Mitigation**: Random verification delays prevent timing-based attacks
- **🎨 Visual Noise Generation**: Dynamic visual obfuscation using SkiaSharp rendering
- **🔧 Custom Secret Support**: Bring your own encryption keys for complete control
- **🌐 CORS Ready**: Pre-configured for cross-origin requests
- **📦 Self-Hostable**: Deploy on your own infrastructure for complete data sovereignty
- **🚀 Lightweight**: Simple REST API with minimal dependencies

## 🔐 Security Architecture

### Time-Windowed Authentication

The API uses a sophisticated time-windowing mechanism to prevent replay attacks while allowing for clock skew:

1. **Key Generation**: Each captcha solution is encrypted using an AES key derived from:
   ```
   SHA256(secret + currentMinute)
   ```

2. **5-Minute Validity Window**: When verifying, the API checks the current minute and up to 4 minutes in the past, accommodating:
   - Network latency
   - Client-server clock differences
   - User solving time

3. **Automatic Expiration**: After 5 minutes, the captcha becomes invalid and cannot be reused

4. **Replay Attack Prevention**: The time-based key rotation makes replay attacks worthless:
   - Each captcha is valid for only 5 minutes
   - Keys change every minute
   - Old solutions cannot be reused beyond the validity window

### Cryptographic Details

- **Encryption**: AES-256 in CBC mode
- **Key Derivation**: SHA-256 hash of (secret + timestamp)
- **IV**: Randomly generated for each captcha
- **Solution Storage**: Encrypted solution is base64-encoded with IV appended

### Timing Attack Mitigation

The verification process includes random delays (`Task.Delay(1000)` on 50% of requests) to prevent attackers from using response time to infer information about the solution or secret.

## 📋 Prerequisites

- .NET 8.0 SDK or later
- SkiaSharp (for image generation)
- A font file (default: `fonts/pixhobo.ttf`)

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/genuine-captcha-api.git
   cd genuine-captcha-api
   ```

2. **Install dependencies**
   ```bash
   dotnet restore
   ```

3. **Configure your secret**
   
   Edit `appsettings.json`:
   ```json
   {
     "Captcha_Generation_Secret": "your-super-secret-key-change-this"
   }
   ```

4. **Add a font file**
   
   Place a TTF font file at `fonts/pixhobo.ttf` or modify the path in `CaptchaProvider.cs`

5. **Run the API**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5100` (or your configured port).

## 📚 API Reference

### Base URL

```
https://your-domain.com/api/captcha
```

### Endpoints

#### 1. Create CAPTCHA (Server Secret)

Generate a new captcha using the server's configured secret.

**Endpoint:** `GET /api/captcha/create`

**Response:**
```json
{
  "ImageAsBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "SecretAsBase64": "encrypted_solution_with_iv",
  "validTill": 1728312345000
}
```

**Fields:**
- `ImageAsBase64`: PNG image encoded as base64
- `SecretAsBase64`: Encrypted solution + IV (base64)
- `validTill`: Unix timestamp (milliseconds) when captcha expires

#### 2. Create CAPTCHA (Custom Secret)

Generate a captcha using your own encryption secret.

**Endpoint:** `GET /api/captcha/create/custom?customSecret=your-secret`

**Parameters:**
- `customSecret` (required): Your custom encryption key

**Response:** Same as standard create endpoint

**Use Case:** When you want to verify captchas in your own backend without calling our verify endpoint.

#### 3. Verify CAPTCHA (Server Secret)

Verify a captcha solution using the server's secret.

**Endpoint:** `GET /api/captcha/verify?captchaSolution=21&captchaSecret=encrypted_data`

**Parameters:**
- `captchaSolution` (required): The user's answer (integer)
- `captchaSecret` (required): The `SecretAsBase64` value from create endpoint

**Responses:**
- `200 OK`: Captcha verified successfully
- `400 Bad Request`: Invalid solution format (not a number)
- `401 Unauthorized`: Incorrect solution or expired captcha

#### 4. Verify CAPTCHA (Custom Secret)

Verify a captcha using your custom secret.

**Endpoint:** `GET /api/captcha/verify/custom?captchaSolution=21&captchaSecret=encrypted_data&customSecret=your-secret`

**Parameters:**
- `captchaSolution` (required): The user's answer
- `captchaSecret` (required): The encrypted secret from create
- `customSecret` (required): Your custom encryption key (same as used in create)

**Responses:** Same as standard verify endpoint

## 💻 Usage Examples

### Example 1: Vanilla HTML/JavaScript

Complete example with no framework dependencies:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genuine CAPTCHA - Vanilla JS Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
        }
        .captcha-container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background: #f9f9f9;
        }
        #captcha-image {
            max-width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin: 10px 0;
        }
        input, button {
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        button {
            background: #4CAF50;
            color: white;
            cursor: pointer;
            border: none;
        }
        button:hover {
            background: #45a049;
        }
        .message {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="captcha-container">
        <h2>Solve the CAPTCHA</h2>
        <img id="captcha-image" alt="CAPTCHA" style="display:none;">
        <div id="loading">Loading CAPTCHA...</div>
        
        <input type="number" id="solution" placeholder="Enter your answer" />
        <button onclick="verifyCaptcha()">Verify</button>
        <button onclick="loadCaptcha()">Refresh</button>
        
        <div id="message"></div>
    </div>

    <script>
        let captchaSecret = '';
        const API_URL = 'https://yitc.ddns.net:5100'; // Or your API URL

        // Load captcha on page load
        window.onload = loadCaptcha;

        async function loadCaptcha() {
            try {
                document.getElementById('loading').style.display = 'block';
                document.getElementById('captcha-image').style.display = 'none';
                document.getElementById('message').innerHTML = '';
                document.getElementById('solution').value = '';

                const response = await fetch(`${API_URL}/api/captcha/create`);
                const data = await response.json();

                // Display the captcha image
                const img = document.getElementById('captcha-image');
                img.src = `data:image/png;base64,${data.ImageAsBase64}`;
                img.style.display = 'block';
                
                // Store the secret for verification
                captchaSecret = data.SecretAsBase64;
                
                document.getElementById('loading').style.display = 'none';

                // Auto-refresh before expiry (optional)
                const timeUntilExpiry = data.validTill - Date.now();
                setTimeout(loadCaptcha, timeUntilExpiry);

            } catch (error) {
                document.getElementById('loading').innerHTML = 
                    '<span class="error">Error loading CAPTCHA. Please refresh.</span>';
                console.error('Error:', error);
            }
        }

        async function verifyCaptcha() {
            const solution = document.getElementById('solution').value;
            const messageDiv = document.getElementById('message');

            if (!solution) {
                messageDiv.innerHTML = '<div class="message error">Please enter your answer</div>';
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/captcha/verify?` +
                    `captchaSolution=${solution}&` +
                    `captchaSecret=${encodeURIComponent(captchaSecret)}`
                );

                if (response.ok) {
                    messageDiv.innerHTML = 
                        '<div class="message success">✓ CAPTCHA verified successfully!</div>';
                    
                    // Here you can submit your form or perform protected action
                    console.log('User verified! Proceed with form submission.');
                    
                } else {
                    messageDiv.innerHTML = 
                        '<div class="message error">✗ Incorrect solution. Please try again.</div>';
                    loadCaptcha(); // Load new captcha
                }

            } catch (error) {
                messageDiv.innerHTML = 
                    '<div class="message error">Error verifying CAPTCHA. Please try again.</div>';
                console.error('Error:', error);
            }
        }
    </script>
</body>
</html>
```

### Example 2: Using with @genuine-captcha/web-components

The easiest way to integrate Genuine CAPTCHA is using the official web component:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Self-Hosted Captcha</title>
</head>
<body>
    <script>
        // Handle successful verification
        window.genuineCaptchaHandleVerify = (solution, secret) => {
            console.log("CAPTCHA verified!");
            
            // Send to your backend
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    captchaSolution: solution,
                    captchaSecret: secret,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                })
            }).then(response => {
                if (response.ok) alert('Message sent!');
            });
        };

        window.genuineCaptchaReset = () => {
            console.log("CAPTCHA reset");
        };
    </script>

    <!-- Load the web component -->
    <script src="https://cryptng.github.io/genuine-captcha-vanillajs/genuine-captcha.js" 
            crossorigin="anonymous"></script>

    <form>
        <input type="email" id="email" placeholder="Your email" required>
        <textarea id="message" placeholder="Your message" required></textarea>
        
        <!-- Point to YOUR self-hosted API -->
        <genuine-captcha api-url="https://your-api.com">
            <button type="submit">Send Message</button>
        </genuine-captcha>
    </form>
</body>
</html>
```

For more details on the web component, see [@genuine-captcha/web-components](https://github.com/cryptNG/genuine-captcha-vanillajs).

### Example 3: Backend Verification (Node.js)

```javascript
// Your backend API endpoint
app.post('/api/contact', async (req, res) => {
    const { captchaSolution, captchaSecret, email, message } = req.body;
    
    // Verify captcha with YOUR self-hosted API
    const verifyResponse = await fetch(
        `https://your-api.com/api/captcha/verify?` +
        `captchaSolution=${captchaSolution}&` +
        `captchaSecret=${encodeURIComponent(captchaSecret)}`
    );
    
    if (!verifyResponse.ok) {
        return res.status(400).json({ error: 'Invalid captcha' });
    }
    
    // Captcha verified - process the request
    // ... send email, save to database, etc.
    
    res.json({ success: true });
});
```

### Example 4: Custom Secret (Self-Verification)

When using a custom secret, you can verify captchas in your own backend without calling the API's verify endpoint:

```javascript
// Frontend: Create captcha with your custom secret
const customSecret = 'your-application-secret-key';
const response = await fetch(
    `https://your-api.com/api/captcha/create/custom?customSecret=${customSecret}`
);
const { ImageAsBase64, SecretAsBase64 } = await response.json();

// Backend: Verify in your own code (Python example)
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
import base64
import time

def verify_captcha(solution, secret_with_iv, custom_secret):
    # Decode the secret
    enc_iv = base64.b64decode(secret_with_iv)
    enc_data = enc_iv[:-16]
    iv = enc_iv[-16:]
    
    # Try current minute and up to 5 minutes back
    current_minute = int(time.time() / 60)
    
    for offset in range(5):
        time_key = current_minute - offset
        key = SHA256.new(f"{custom_secret}{time_key}".encode()).digest()
        
        cipher = AES.new(key, AES.MODE_CBC, iv)
        try:
            decrypted = cipher.decrypt(enc_data).decode('utf-8').strip()
            if decrypted == str(solution):
                return True
        except:
            continue
    
    return False
```

## ⚙️ Configuration

### appsettings.json

```json
{
  "Captcha_Generation_Secret": "change-this-to-a-secure-random-string",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### CORS Configuration

Edit `Program.cs` to configure allowed origins:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: policyName,
        builder =>
        {
            builder
                .WithOrigins("https://your-frontend.com", "https://another-domain.com")
                .WithMethods("GET", "OPTIONS")
                .AllowAnyHeader()
                .AllowCredentials();
        });
});
```

### Captcha Validity Duration

Edit `CaptchaProvider.cs` to change the validity window:

```csharp
public static int validityInMinutes = 5; // Change to desired minutes
```

## 🔒 Security Best Practices

1. **Change the Default Secret**: Always set a strong, random `Captcha_Generation_Secret` in production

2. **Use HTTPS**: Always serve the API over HTTPS in production

3. **Configure CORS Properly**: Restrict origins to your actual domains, don't use `*` in production

4. **Backend Verification**: Always verify captchas on your backend, never trust client-side verification alone

5. **Rate Limiting**: Consider adding rate limiting to prevent abuse (not included in this implementation)

6. **Monitor Logs**: While we don't log personal data, monitor for suspicious patterns

7. **Rotate Secrets**: Periodically rotate your `Captcha_Generation_Secret`

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. GET /create
       ▼
┌─────────────────┐
│  CaptchaController│
└──────┬──────────┘
       │
       │ 2. Generate
       ▼
┌─────────────────┐
│ CaptchaProvider │
│  - Math problem │
│  - AES encrypt  │
│  - SkiaSharp img│
└──────┬──────────┘
       │
       │ 3. Return image + secret
       ▼
┌─────────────┐
│   Client    │
│ (displays)  │
└──────┬──────┘
       │
       │ 4. User solves
       │ 5. GET /verify
       ▼
┌─────────────────┐
│ CaptchaProvider │
│  - Try 5 minute │
│    time windows │
│  - AES decrypt  │
│  - Compare      │
└──────┬──────────┘
       │
       │ 6. Return OK/401
       ▼
┌─────────────┐
│   Client    │
└─────────────┘
```

## 🧪 Testing

### Test Hosting Available

We provide a **free test instance** for development and testing purposes:

**Base URL:** `https://yitc.ddns.net:5100`

⚠️ **Note:** This is a test server for development only. For production use, please deploy your own instance.

### Quick Test Examples

```bash
# Create a captcha
curl https://yitc.ddns.net:5100/api/captcha/create

# The response will look like:
# {
#   "ImageAsBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
#   "SecretAsBase64": "encrypted_solution...",
#   "validTill": 1728312345000
# }

# Verify a solution (replace with actual values from the response)
curl "https://yitc.ddns.net:5100/api/captcha/verify?captchaSolution=21&captchaSecret=YOUR_SECRET_HERE"

# Test with custom secret
curl "https://yitc.ddns.net:5100/api/captcha/create/custom?customSecret=my-test-secret"

curl "https://yitc.ddns.net:5100/api/captcha/verify/custom?captchaSolution=21&captchaSecret=YOUR_SECRET_HERE&customSecret=my-test-secret"
```

### Testing with JavaScript

```javascript
// Quick test in browser console
fetch('https://yitc.ddns.net:5100/api/captcha/create')
  .then(r => r.json())
  .then(data => {
    console.log('Captcha created!');
    console.log('Image:', data.ImageAsBase64.substring(0, 50) + '...');
    console.log('Secret:', data.SecretAsBase64);
    console.log('Valid until:', new Date(data.validTill));
  });
```

### Local Testing

For testing your own deployment:

```bash
# Create a captcha
curl https://localhost:5100/api/captcha/create

# Verify a solution (replace with actual values)
curl "https://localhost:5100/api/captcha/verify?captchaSolution=21&captchaSecret=abc123..."
```

### Integration Testing

You can use the test server to develop your frontend integration before deploying your own instance:

```html
<script>
    const API_URL = 'https://yitc.ddns.net:5100';
    // ... rest of your code
</script>
```

Once ready for production, simply change the URL to your own deployed instance.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- **[@genuine-captcha/web-components](https://github.com/cryptNG/genuine-captcha-vanillajs)**: Official web component for easy integration
- **[Demo Site](https://genuine-captcha.io)**: Live demonstration

## 📞 Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/cryptNG/genuine-captcha-api).

---

**Privacy Notice**: This API does not log IP addresses, does not use cookies, does not cache user data, and does not collect any personal information. It is fully GDPR compliant by design.