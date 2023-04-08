import {Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {Constant} from '../../../common/const/constant';
import {MenuBtn} from './menu-btn';
import {RecordType} from '../../../common/enum/record-type';
import {RecordTypeValue} from '../../../common/enum/record-type-value';
import {RecorderService} from '../../../service/recorder.service';
import {Util} from '../../../common/util/util';
import {MatDialog} from '@angular/material/dialog';
import {PermissionService} from '../../../service/permission.service';
import {PermissionDialogComponent} from './permission-dialog/permission-dialog.component';
import {HomeComponent} from '../home.component';
import {ActivatedRoute} from '@angular/router';
import {CameraSize} from '../../../common/enum/camera-size';
import {CameraSizeClassname} from '../../../common/enum/camera-size-classname';
import {RecordContentClassname} from '../../../common/enum/record-content-classname';
import {CdkDragEnd} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnDestroy {
  public screenWithCameraMap = MenuBtn.screeWithCamera(RecordTypeValue, RecordType);
  public screenMap = MenuBtn.activeScreen(RecordTypeValue, RecordType);
  public cameraMap = MenuBtn.camera(RecordTypeValue, RecordType);

  public textRecordAudio = Constant.Text.recordAudio;
  public textSelectMicrophone = Constant.Text.selectMicrophone;
  public textSelectCamera = Constant.Text.selectCamera;
  public textSelect = Constant.Text.select;
  public textRecord = Constant.Text.startRecord;

  public audioDevices = new Map<string, string>();
  public videoDevices = new Map<string, string>();
  public selectedType = RecordType.screen;
  public cameraSize: CameraSize;
  public topPointer = null;
  public leftPointer = null;
  public cameraSizeClassName: CameraSizeClassname;
  public recordContentClassName: RecordContentClassname;

  public audioDefault = null;
  public videoDefault = null;

  public isAudio = false;
  public isMicrophonePermission = false;

  private audioId = null;
  private videoId = null;

  @ViewChild('recon_local_video')
  public localVideo: ElementRef;

  constructor(private recorderService: RecorderService,
              private permissionService: PermissionService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {

    this.recordContentClassName = RecordContentClassname.screenMedium;
    this.cameraSizeClassName = CameraSizeClassname.small;
    this.cameraSize = CameraSize.small;
    this.updateContentClassname();
    this.updateCameraSizeClassName();

    this.permissionService.checkMicrophonePermission().then(result => {
      if (result.state === 'prompt') {
        this.permissionService.requestMicrophonePermission();
        const menuInstance = this;
        // tslint:disable-next-line:only-arrow-functions
        result.onchange = function() {
          if (this.state === 'granted') {
            menuInstance.isMicrophonePermission = true;
            menuInstance.isAudio = true;
            menuInstance.getInitialExternalDevices();
          }
        };
        return;
      }

      if (result.state === 'denied') {
        return;
      }

      this.isMicrophonePermission = true;
      this.isAudio = true;
      this.getInitialExternalDevices();
      return;
    });
  }

  ngOnDestroy() {
    this.recorderService.stopCamera();
  }

  onChangeExternalMicrophone(event) {
    this.audioId = this.audioDevices.get(event.value);
  }

  onChangeExternalCamera(event) {
    this.videoId = this.videoDevices.get(event.value);
    if (this.selectedType === RecordType.screen) {
      return;
    }
    this.recorderService.startCamera(true, true, this.videoId, this.audioId).then(result => {
      if (result === null) {
        return;
      }
      this.localVideo.nativeElement.srcObject = result;
    });
  }

  onClickType(type) {
    this.selectedType = type;
    this.getInitialExternalDevices();
    this.updateContentClassname();

    switch (type) {
      case RecordType.screenWithCamera:
        this.permissionService.checkCameraPermission().then(result => {
          const menuInstance = this;
          if (result.state === 'prompt') {
            // tslint:disable-next-line:only-arrow-functions
            result.onchange = function() {
              // Update permission with tab
              menuInstance.changePermission(result.state, type);
            };
            this.permissionService.requestCameraPermission();
            return;
          }
          if (result.state === 'denied') {
            this.openPermissionDialog();
            return;
          }
          this.screenWithCameraMap = MenuBtn.activeScreeWithCamera(RecordTypeValue, RecordType);
          this.screenMap = MenuBtn.screen(RecordTypeValue, RecordType);
          this.cameraMap = MenuBtn.camera(RecordTypeValue, RecordType);
          this.recorderService.startCamera(this.isAudio, true, this.videoId, this.audioId).then(res => {
            if (res === null) {
              return;
            }
            this.localVideo.nativeElement.srcObject = res;
          });
        });
        break;
      case RecordType.screen:
        this.permissionService.checkMicrophonePermission().then(result => {
          if (result.state === 'prompt') {
            this.permissionService.requestMicrophonePermission();
            return;
          }
          this.screenWithCameraMap = MenuBtn.screeWithCamera(RecordTypeValue, RecordType);
          this.screenMap = MenuBtn.activeScreen(RecordTypeValue, RecordType);
          this.cameraMap = MenuBtn.camera(RecordTypeValue, RecordType);
          this.recorderService.stopCamera();
          this.localVideo.nativeElement.srcObject = null;
        });
        break;
      case RecordType.camera:
        this.permissionService.checkCameraPermission().then(result => {
          const menuInstance = this;
          if (result.state === 'prompt') {
            // tslint:disable-next-line:only-arrow-functions
            result.onchange = function() {
              // Update permission with tab
              menuInstance.changePermission(result.state, type);
            };
            this.permissionService.requestCameraPermission();
            return;
          }
          if (result.state === 'denied') {
            this.openPermissionDialog();
            return;
          }
          this.screenWithCameraMap = MenuBtn.screeWithCamera(RecordTypeValue, RecordType);
          this.screenMap = MenuBtn.screen(RecordTypeValue, RecordType);
          this.cameraMap = MenuBtn.activeCamera(RecordTypeValue, RecordType);
          this.localVideo.nativeElement.srcObject = null;
          this.recorderService.startCamera(this.isAudio, true, this.videoId, this.audioId).then(res => {
            if (res === null) {
              return;
            }
            this.localVideo.nativeElement.srcObject = res;
          });
        });
        break;
    }
  }

  onClickStartRecord() {
    this.route.data.subscribe(data => {
      this.localVideo.nativeElement.srcObject = null;
      this.recorderService.stopCamera();
      window.parent.postMessage({
        type: Constant.typeStartCountDown,
        recordType: this.selectedType,
        isAudio: this.isAudio,
        audioId: this.audioId,
        videoId: this.videoId,
        cameraSize: this.cameraSize,
        topPointer: this.topPointer,
        leftPointer: this.leftPointer
      }, '*');
    });
  }

  onChangeAudio(isAudio) {
    this.permissionService.checkMicrophonePermission().then(result => {
      if (result.state === 'denied') {
        this.openPermissionDialog();
        return;
      }
      this.isMicrophonePermission = true;
      this.isAudio = isAudio.checked;
    });
  }

  onClickSizeS() {
    this.cameraSizeClassName = CameraSizeClassname.small;
    this.cameraSize = CameraSize.small;
    this.updateContentClassname();
  }

  onClickSizeM() {
    this.cameraSizeClassName = CameraSizeClassname.medium;
    this.cameraSize = CameraSize.medium;
    this.updateContentClassname();
  }

  onClickSizeL() {
    this.cameraSizeClassName = CameraSizeClassname.large;
    this.cameraSize = CameraSize.large;
    this.updateContentClassname();
  }

  onDragEnd(event: CdkDragEnd) {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = Util.getPosition(element);
    this.topPointer = (boundingClientRect.y - parentPosition.top);
    this.leftPointer = (boundingClientRect.x - parentPosition.left);
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
    switch (this.cameraSize) {
      case CameraSize.small:
        this.recordContentClassName = this.selectedType === RecordType.screen ?
          RecordContentClassname.screenSmall : RecordContentClassname.loadingSmall;
        break;
      case CameraSize.medium:
        this.recordContentClassName = this.selectedType === RecordType.screen ?
          RecordContentClassname.screenMedium : RecordContentClassname.loadingMedium;
        break;
      case CameraSize.large:
        this.recordContentClassName = this.selectedType === RecordType.screen ?
          RecordContentClassname.screenLarge : RecordContentClassname.loadingLarge;
        break;
    }
  }

  public getInitialExternalDevices() {
    this.recorderService.getExternalDevice().then(result => {
      const externalDevices = result;
      this.audioId = 'default';
      this.audioDevices = externalDevices.get('audio');
      this.audioDefault = Util.getDefaultKeyName(this.audioDevices);

      this.videoId = 'default';
      this.videoDevices = externalDevices.get('video');
      this.videoDefault = Util.getDefaultKeyName(this.videoDevices, true);
    });
  }

  public openPermissionDialog() {
    this.closePermissionDialog();
    HomeComponent.IS_DISABLE_UI = true;
    this.dialog.open(PermissionDialogComponent, {
      width: '600px',
      data: {},
      backdropClass: 'permission-dialog'
    });
  }

  public closePermissionDialog() {
    this.dialog.closeAll();
  }

  public changePermission(state, recordType) {
    this.onClickType(recordType);
  }

  get recordTypeValue() {
    return RecordTypeValue;
  }

  get recordType() {
    return RecordType;
  }

  get cameraSizeEnum() {
    return CameraSize;
  }
}
