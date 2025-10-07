

//defer loading because of fastboot and similar

export default class GenuineCaptcha extends HTMLElement {
  shadowRoot = null;
  captchaSecret=null;
  timerId=null;
  gcApiUrl =  `https://api.genuine-captcha.io`;
  handleVerify=(a,b)=>{};
  handleReset=()=>{};
  constructor() {
    super();
    this.texts = {};
    if(navigator.language.toLowerCase().indexOf('de')===0){
      this.texts = {
        puzzleTitle: 'Kleines Rätsel: Was ist die Lösung?',
        inputPlaceholder: 'Deine Antwort',
        verifyButton: 'Überprüfen',
        refreshButton: 'Neues CAPTCHA',
        loadingCaptcha: 'Lade CAPTCHA...',
        errorLoadingCaptcha: 'Fehler beim Laden des CAPTCHAs. Bitte versuche es erneut.',
        errorIncorrectSolution: 'Falsche Lösung. Bitte versuche es erneut.',
        errorFailedToVerify: 'Fehler bei der Überprüfung. Bitte versuche es erneut.',
        successMessage: 'Erfolg! CAPTCHA korrekt gelöst.',
        alertNoSolution: 'Bitte gib deine Antwort zum CAPTCHA ein',
        responseOk: '<strong>Erfolg!</strong> CAPTCHA korrekt gelöst.',
        responseNotOk: '<strong>Fehler:</strong> Falsche Lösung. Bitte versuche es erneut.',
        responseFailedToVerify: '<strong>Fehler:</strong> Fehler bei der Überprüfung. Bitte versuche es erneut.'
      };
    }
    if(navigator.language.toLowerCase().indexOf('en')===0 || this.texts.puzzleTitle===undefined){
      this.texts = {
        puzzleTitle: 'Tiny puzzle time: what is the solution?',
        inputPlaceholder: 'Your answer',
        verifyButton: 'Verify',
        refreshButton: 'Try Another CAPTCHA',
        loadingCaptcha: 'Loading CAPTCHA...',
        errorLoadingCaptcha: 'Error loading CAPTCHA. Please try again.',
        errorIncorrectSolution: 'Incorrect solution. Please try again.',
        errorFailedToVerify: 'Failed to verify. Please try again.',
        successMessage: 'Success! CAPTCHA verified correctly.',
        alertNoSolution: 'Please enter your answer to the CAPTCHA',
        responseOk: '<strong>Success!</strong> CAPTCHA verified correctly.',
        responseNotOk: '<strong>Error:</strong> Incorrect solution. Please try again.',
        responseFailedToVerify: '<strong>Error:</strong> Failed to verify. Please try again.'
      };
    }
    this.prompt = '';
    this.captchaSecret = '';
    const template = document.getElementById('genuine-captcha');
    const templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.shadowRoot = shadowRoot;

    const style = document.createElement('style');
    style.textContent = `
          :host{
            --underline-color:red;
            --underline-style:dashed;
            --underline-width:0.1em;
            --underline-top:calc(50% + 0.5em);
            --text-color:inherited;
            --text-family:revert;
            --text-size:auto;
            --text-cursor:pointer;
            --underline-rgb:linear-gradient(90deg, #e50b58,#b29d23,#55ddbd);
            --underline-rgb-1:linear-gradient(90deg, #ae1ffd,#ff3c34,#9bbf24);
            --underline-rgb-2:linear-gradient(130deg,#2E3192,#1BFFFF 76.05%);
            --underline-rgb-3:linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%);
            --underline-rgb-5:linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%);
            --asterisk-margin-right:0.2em;
          }

          .captcha-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
            #captcha-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        
        #captcha-image-container {
            position: relative;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        
        #captcha-image {
            max-width: 100%;
            display: none;
        }
        
        #captcha-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #6366f1;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .input-group {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        input {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
        }
        
        button {
            padding: 8px 16px;
            background-color: #6366f1;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background-color: #4f46e5;
        }
        
        #captcha-error {
            padding: 15px;
            border-radius: 6px;
            display: none;
            margin-top: 15px;
            width: 100%;
        }

        .captcha-result {
            padding: 15px;
            border-radius: 6px;
            display: block;
            margin-bottom: 15px;
            width: 100%;
        }
        
        .success {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            padding: 15px;
            border-radius: 6px;
            display: block;
            margin-bottom: 15px;
           
        }
        
        .error {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
      `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(templateContent.cloneNode(true));

    shadowRoot.querySelector('.captcha-container #puzzle-title').innerText = this.texts.puzzleTitle;
    shadowRoot.querySelector('.captcha-container #captcha-solution').placeholder = this.texts.inputPlaceholder;
    shadowRoot.querySelector('.captcha-container #verify-captcha').innerText = this.texts.verifyButton;
    shadowRoot.querySelector('.captcha-container #refresh-captcha').innerText = this.texts.refreshButton;
    shadowRoot.querySelector('.captcha-container #loading-catcha').innerText = this.texts.loadingCaptcha;

    this.registerOptionsChange();
    this.registerHandleVerify();
    this.registerHandleReset();
    shadowRoot.querySelector('.captcha-container #refresh-captcha').addEventListener('click', (event) => {
      event.stopPropagation();
      this.loadCaptcha();
    });

    shadowRoot.querySelector('.captcha-container #verify-captcha').addEventListener('click', (event) => {
      event.stopPropagation();
      this.verifyCaptcha();
    });

    (async () => {
      await Sleep(100);
      this.loadCaptcha();
    })();
    

  }

  registerOptionsChange = async () => {
    const body = document.querySelector('body');
    while (body.genuineCaptchaRegisterOptionChange === undefined) {
      await Sleep(100);
    }
    body.genuineCaptchaRegisterOptionChange(this.handleOptionsChange);
  };

  registerHandleVerify = async () => {
    const body = document.querySelector('body');
    while (window.genuineCaptchaHandleVerify === undefined) {
      await Sleep(100);
    }
    this.handleVerify = window.genuineCaptchaHandleVerify;
  };

  registerHandleReset = async () => {
    const body = document.querySelector('body');
    while (window.genuineCaptchaReset === undefined) {
      await Sleep(100);
    }
    this.handleReset = window.genuineCaptchaReset;
  };


  handleOptionsChange = (options) => {
    if ((options?.highlight || null) !== null) {
      options.highlight
        .split(',')
        .forEach((hl) =>
          this.shadowRoot.querySelector('.captcha-container').classList.add(hl)
        );
    }

  };

  static get observedAttributes() {
    return ['api-url', 'api-key'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'api-url') this.gcApiUrl = newValue;
  }

  startTimer=(delay)=> {
    clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.loadCaptcha();
      }, delay); //reload every 5 minutes
    }

  loadCaptcha () {
    this.shadowRoot.getElementById('captcha-loading').style.display = 'block';
    this.shadowRoot.getElementById('captcha-image').style.display = 'none';
    this.shadowRoot.getElementById('captcha-input-container').style.display = 'none';
    this.shadowRoot.getElementById('captcha-error').style.display = 'none';
    this.shadowRoot.getElementById('captcha-error').classList.remove( 'error');
    this.shadowRoot.getElementById('allowed-action').style.display = 'none';
    this.shadowRoot.querySelector('.captcha-result').classList.remove( 'success');
    this.shadowRoot.getElementById('refresh-captcha').style.display = 'none';
    this.shadowRoot.getElementById('captcha-solution').value = '';
    this.shadowRoot.getElementById('captcha-display').style.display = 'flex';

    fetch(`${this.gcApiUrl}/api/captcha/create`)
        .then(response => response.json())
        .then(data => {
            const imageType = 'image/png';
            const base64Image = `data:${imageType};base64,${data.ImageAsBase64}`;
            this.shadowRoot.getElementById('captcha-image').src = base64Image;
            
            // Store the secret for verification later
            this.captchaSecret = data.SecretAsBase64;

            const validTill= data.validTill || Date.now() + (1000 * 60 * 5); //5 minutes from now
        
            this.startTimer(validTill - Date.now()); //reload 4 minutes before expiry
            
            // Show the captcha and input field
            this.shadowRoot.getElementById('captcha-image').style.display = 'block';
            this.shadowRoot.getElementById('captcha-loading').style.display = 'none';
            this.shadowRoot.getElementById('captcha-input-container').style.display = 'block';
            this.shadowRoot.getElementById('refresh-captcha').style.display = 'inline-block';
        })
        .catch(error => {

            console.error("Error loading captcha:", error);
            this.shadowRoot.getElementById('captcha-loading').innerHTML = 
                this.texts.errorLoadingCaptcha;
        });
    }

    verifyCaptcha() {
        const solution = this.shadowRoot.getElementById('captcha-solution').value.trim();
        if (!solution) {
            alert(this.texts.alertNoSolution);
            return;
        }

        
        
        fetch(`${this.gcApiUrl}/api/captcha/verify?captchaSolution=${solution}&captchaSecret=${encodeURIComponent(this.captchaSecret)}`, {
            mode: 'cors'
        })
        .then(response => {
            if (response.ok) {
                this.shadowRoot.getElementById('allowed-action').style.display = 'block';
                const resultElement = this.shadowRoot.querySelector('.captcha-result');
                resultElement.classList.add( 'success');
                resultElement.innerHTML = this.texts.responseOk;
                this.shadowRoot.getElementById('captcha-error').style.display = 'none';
                this.shadowRoot.getElementById('captcha-display').style.display = 'none';
                this.shadowRoot.getElementById('captcha-input-container').style.display = 'none';
                
                this.handleVerify(solution, this.captchaSecret);
            } else {
                const errorElement = this.shadowRoot.getElementById('captcha-error');
                errorElement.style.display = 'block';
                errorElement.classList.add('error');
                errorElement.innerHTML = this.texts.responseNotOk;
            }
        })
        .catch(error => {
            console.error("Error verifying captcha:", error);
            const errorElement = this.shadowRoot.getElementById('captcha-error');
            errorElement.style.display = 'block';
            errorElement.classList.add('error');
            resultElement.innerHTML = this.texts.responseFailedToVerify;
        });
    }
}

async function Sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}


//defer loading because of fastboot and similar
if (typeof document !== 'undefined') {
  const tpl1 = document.createElement('template');
  tpl1.id = 'genuine-captcha';
  tpl1.innerHTML = `<div class="captcha-container">
        <div id="captcha-display">
            <div id="captcha-image-container">
                <img id="captcha-image" alt="CAPTCHA Challenge" src=""/>
                <div id="captcha-loading" style="display: none;">
                    <div class="spinner"></div>
                    <p id="loading-catcha">Loading CAPTCHA...</p>
                </div>
            </div>
            
            <div id="captcha-input-container" style="display: block;">
                <p id="puzzle-title">Tiny puzzle time: what is the solution?</p>
                <div class="input-group">
                    <input type="text" id="captcha-solution" placeholder="Your answer">
                    <button id="verify-captcha">Verify</button>
                </div>
            </div>
            
            <div id="captcha-error" style="display: none;"></div>
            
            <button id="refresh-captcha" style="display: inline-block;">Try Another CAPTCHA</button>
        </div>
        <div id="allowed-action" style="display: none;">
            <div class="captcha-result"></div>
        <slot></slot></div>
        
    </div>`;

  document.querySelector('body').prepend(tpl1);

  customElements.define('genuine-captcha', GenuineCaptcha);
}

export {GenuineCaptcha };