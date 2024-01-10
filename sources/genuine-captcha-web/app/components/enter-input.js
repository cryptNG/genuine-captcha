import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EnterOrUploadInputComponent extends Component {
  get hasValueInserted() {
    return this.args.inputContent.length > 0;
  }

  @tracked isLoading = false;
  element = null;

  @action didInsertComponent(element) {
    this.element = element;
    const inputData = element.querySelector('input');
    const label = element.querySelector('label');

    let file;
    label.onclick = () => {
      inputData.focus();
    };
  }
}
