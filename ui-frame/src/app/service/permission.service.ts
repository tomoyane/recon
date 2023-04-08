import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() {
  }

  public async requestCameraPermission() {
    return navigator.mediaDevices.getUserMedia({video: {width: 600, height: 400, deviceId: 'default'}})
      .then(mediaStream => {
        // Stop all track because not need track.
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }).catch(ignore => {
      });
  }

  public async requestMicrophonePermission() {
    const audioInfo = {
      echoCancellation: true,
      deviceId: 'default',
    };

    return navigator.mediaDevices.getUserMedia({audio: audioInfo, video: false})
      .then(mediaStream => {
        // Stop all track because not need track.
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }).catch(ignore => {
      });
  }

  public async checkCameraPermission(): Promise<PermissionStatus> {
    return await navigator.permissions.query({name: 'camera'}).then((status) => {
      return status;
    });
  }

  public async checkMicrophonePermission(): Promise<PermissionStatus> {
    return await navigator.permissions.query({name: 'microphone'}).then((status) => {
      return status;
    });
  }
}
