import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { later } from '@ember/runloop';
import ENV from 'genuine-captcha-web/config/environment';

export default class ShowCaptchaComponent extends Component {
  @tracked invalidCaptchaMessage = '';

  @tracked enteredCaptchaContent = ''; 
  @tracked isWorking = false;
  @tracked isGettingCaptcha = false;

  captchaSecret = '';

  constructor() {
    super(...arguments);
    later(
      this,
      function () {
        this.getCaptcha();
      },
      200
    );
  }

  @action close() {
    for (const elem of window.document.querySelectorAll(
      '#captcha-container img'
    )) {
      elem.remove();
    }
    this.args.close();
  }

  @action async solveCaptcha() {
    const response = await fetch(
      ENV.captchaApiHost +
        '/api/captcha/verify?captchaSolution=' +
        this.enteredCaptchaContent +
        '&captchaSecret=' +
        encodeURIComponent(this.captchaSecret),
      {
        credentials: 'include',
        method: 'GET',
      }
    );
    if (response.status === 401) {
      this.invalidCaptchaMessage = await response.text();
      await this.getCaptcha();
    }
    if (response.status === 200) {
      
    }
  }

  getCaptcha = async () => {
    this.isGettingCaptcha = true;
    const container = window.document.querySelector('#captcha-container');

    for (const elem of window.document.querySelectorAll(
      '#captcha-container img'
    )) {
      elem.remove();
    }

    await timeout(200);
    const response = await fetch(ENV.captchaApiHost + '/api/captcha/create', {
      method: 'GET',
      credentials: 'include',
    });

    let json = await response.json();
    this.captchaSecret = json.SecretAsBase64;
    const byteCharacters = atob(json.ImageAsBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/bmp' });
    const imageUrl = URL.createObjectURL(blob);

    const image = document.createElement('img');
    image.src = imageUrl;

    container.append(image);

    this.isGettingCaptcha = false;
  };

  @action doNothing(event) {
    event.stopPropagation();
    return false;
  }

  @action updateEnteredCaptchaContent(e) {
    this.invalidCaptchaMessage = '';
    this.enteredCaptchaContent = e.target.value;
  }

 

  @action clearCaptchaContent() {
    this.enteredCaptchaContent = '';
  }

}
