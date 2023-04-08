import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {RecorderService} from '../../service/recorder.service';
import {Constant} from '../../common/const/constant';
import {RecordType} from '../../common/enum/record-type';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Util} from '../../common/util/util';
import {CameraSize} from '../../common/enum/camera-size';
import {CameraSizeClassname} from '../../common/enum/camera-size-classname';
import {RecordContentClassname} from '../../common/enum/record-content-classname';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnDestroy {
  public recordType: RecordType;
  public cameraSize: CameraSize;
  public cameraSizeClassName: CameraSizeClassname;
  public recordContentClassName: RecordContentClassname;
  public destroy = new Subject();
  public isFinish = false;
  public displayTime = null;
  public time = 0;

  @ViewChild('recon_local_video')
  public localVideo: ElementRef;

  constructor(private recorderService: RecorderService) {
    this.recordContentClassName = RecordContentClassname.screenSmall;
    this.cameraSizeClassName = CameraSizeClassname.small;
    this.cameraSize = CameraSize.small;

    window.addEventListener('message', event => {
      this.cameraSize = event.data.cameraSize;
      this.time = event.data.recordingTime;
      this.recordType = event.data.recordType;
      const videoId = event.data.videoId;
      const audioId = event.data.audioId;
      this.updateContentClassname();
      this.updateCameraSizeClassName();

      if (this.time === 0) {
        this.displayTime = '00:00:00';
      } else {
        this.displayTime = Util.convertTime(this.time);
      }
      this.startTimer();
      switch (this.recordType) {
        case RecordType.screen:
          break;

        case RecordType.screenWithCamera:
          this.recorderService.startCamera(false, false, videoId, audioId).then(result => {
            if (result === null) {
              return;
            }
            this.localVideo.nativeElement.srcObject = result;
            this.localVideo.nativeElement.volume = 0;
          });
          break;

        case RecordType.camera:
          this.recorderService.startCamera(true, false, videoId, audioId).then(result => {
            if (result === null) {
              return;
            }
            this.localVideo.nativeElement.srcObject = result;
            this.localVideo.nativeElement.volume = 0;
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy.complete();
  }

  onClickStopRecord() {
    this.isFinish = true;
    this.recorderService.stopCamera().then(res => {
      if (this.recordType === RecordType.camera) {
        window.parent.postMessage({
          type: Constant.typeStopRecord,
          recordType: this.recordType,
          url: res
        }, '*');
      } else {
        window.parent.postMessage({
          type: Constant.typeStopRecord,
          recordTpe: this.recordType
        }, '*');
      }
    });
  }

  onClickSizeS() {
    this.cameraSizeClassName = CameraSizeClassname.small;
    this.cameraSize = CameraSize.small;
    this.updateContentClassname();
    window.parent.postMessage({
      type: Constant.typeUpdateCameraSize,
      cameraSize: this.cameraSize
    }, '*');
  }

  onClickSizeM() {
    this.cameraSizeClassName = CameraSizeClassname.medium;
    this.cameraSize = CameraSize.medium;
    this.updateContentClassname();
    window.parent.postMessage({
      type: Constant.typeUpdateCameraSize,
      cameraSize: this.cameraSize
    }, '*');
  }

  onClickSizeL() {
    this.cameraSizeClassName = CameraSizeClassname.large;
    this.cameraSize = CameraSize.large;
    this.updateContentClassname();
    window.parent.postMessage({
      type: Constant.typeUpdateCameraSize,
      cameraSize: this.cameraSize
    }, '*');
  }

  private updateCameraSizeClassName() {
    switch (this.cameraSize) {
      case CameraSize.small:
        this.cameraSizeClassName = CameraSizeClassname.small;
        break;
      case CameraSize.medium:
        this.cameraSizeClassName = CameraSizeClassname.medium;
        break;
      case CameraSize.large:
        this.cameraSizeClassName = CameraSizeClassname.large;
        break;
    }
  }

  private updateContentClassname() {
    if (this.recordType === RecordType.screen) {
      switch (this.cameraSize) {
        case CameraSize.small:
          this.recordContentClassName = RecordContentClassname.screenSmall;
          break;
        case CameraSize.medium:
          this.recordContentClassName = RecordContentClassname.screenMedium;
          break;
        case CameraSize.large:
          this.recordContentClassName = RecordContentClassname.screenLarge;
          break;
      }
    } else {
      switch (this.cameraSize) {
        case CameraSize.small:
          this.recordContentClassName = RecordContentClassname.loadingSmall;
          break;
        case CameraSize.medium:
          this.recordContentClassName = RecordContentClassname.loadingMedium;
          break;
        case CameraSize.large:
          this.recordContentClassName = RecordContentClassname.loadingLarge;
          break;
      }
    }
  }

  public startTimer() {
    timer(1000, 1000).pipe(takeUntil(this.destroy)).subscribe(val => {
      this.time++;
      this.displayTime = Util.convertTime(this.time);
    });
  }

  get recordTypeEnum() {
    return RecordType;
  }

  get cameraSizeEnum() {
    return CameraSize;
  }
}
