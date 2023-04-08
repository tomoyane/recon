import {Component} from '@angular/core';
import {Constant} from '../../common/const/constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public static IS_DISABLE_UI = false;
  public isNotification = false;

  constructor() {
  }

  onClickClose() {
    window.parent.postMessage({type: Constant.typeShutdown}, '*');
  }

  onClickVideoMenu() {
    // Early return when case of already starting video menu
    if (!this.isNotification) {
      return;
    }
    this.isNotification = false;
  }


  onClickNotification() {
    // Early return when case of already starting notification
    if (this.isNotification) {
      return;
    }
    this.isNotification = true;
  }

  get isDisableUi() {
    return HomeComponent.IS_DISABLE_UI;
  }
}
