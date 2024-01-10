import EmberRouter from '@ember/routing/router';
import config from 'genuine-captcha-web/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('usecases');
  this.route('features');
  this.route('app');
  this.route('why');
  this.route('how-to');
  this.route('terms');
});