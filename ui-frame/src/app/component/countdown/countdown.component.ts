import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Constant} from '../../common/const/constant';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  public countDownTitle = Constant.Title.countDown;
  public cancelTitle = Constant.Title.cancel;
  public recordType;
  public audioId;
  public videoId;
  public cameraSize;
  public topPointer = null;
  public leftPointer = null;
  public destroy = new Subject();
  public isShowCountDown = false;
  public time = 3;

  constructor() {
  }

  ngOnInit(): void {
    window.addEventListener('message', event => {
      this.recordType = event.data.recordType;
      this.audioId = event.data.audioId;
      this.videoId = event.data.videoId;
      this.audioId = event.data.audioId;
      this.cameraSize = event.data.cameraSize;
      this.topPointer = event.data.topPointer;
      this.leftPointer = event.data.leftPointer;

      this.startTimer();
    });
  }

  ngOnDestroy() {
    this.destroy.complete();
  }

  public startTimer() {
    timer(1000, 1000).pipe(takeUntil(this.destroy)).subscribe(val => {
      if (this.time <= 0) {
        this.isShowCountDown = false;
        this.destroy.next();
        this.destroy.complete();
        this.startRecording();
        return;
      }
      this.time--;
    });
  }

  public startRecording() {
    window.parent.postMessage({
      type: Constant.typeStartRecord,
      recordType: this.recordType,
      audioId: this.audioId,
      videoId: this.videoId,
      cameraSize: this.cameraSize,
      topPointer: this.topPointer,
      leftPointer: this.leftPointer
    }, '*');
  }

  onClickCancel() {
    window.parent.postMessage({type: Constant.typeForceStopRecord}, '*');
  }
}
