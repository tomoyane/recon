import {Component} from '@angular/core';
import {RecorderService} from './service/recorder.service';
import {Constant} from './common/const/constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private recordService: RecorderService) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordService.stopCamera();
        window.parent.postMessage({type: Constant.typeShutdown}, '*');
      }
    });
  }
}
