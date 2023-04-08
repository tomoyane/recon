import {Injectable} from '@angular/core';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecorderService {
  private recorder: any = null;
  private mediaStream: any = null;
  private isCameraRunning = false;
  private chunks = [];
  private blob: Blob = null;

  constructor() {
  }

  public async getExternalDevice() {
    const externalDevices = new Map<string, Map<string, string>>();
    const audioData = new Map<string, string>();
    const videoData = new Map<string, string>();

    return navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          if (device.kind === 'videoinput') {
            videoData.set(device.label, device.deviceId);
          } else if (device.kind === 'audioinput') {
            audioData.set(device.label, device.deviceId);
          }
          externalDevices.set('audio', audioData);
          externalDevices.set('video', videoData);
        });
        return externalDevices;
      })
      .catch(err => {
        return null;
      });
  }

  public async startCamera(isAudio: boolean, isMenu: boolean, videoId: string, audioId): Promise<MediaStream> {
    if (this.isCameraRunning) {
      await this.stopCamera().then(res => {
        return res;
      });
    }

    let audioInfo;
    if (isAudio) {
      audioInfo = {
        echoCancellation: true,
        deviceId: audioId,
      };
    } else {
      audioInfo = false;
    }

    return navigator.mediaDevices.getUserMedia({audio: audioInfo, video: {width: 600, height: 400, deviceId: videoId}})
      .then(mediaStream => {
        // Always delete audio on menu frame because audio is enable background
        if (isMenu && isAudio) {
          mediaStream.removeTrack(mediaStream.getAudioTracks()[0]);
        }
        this.isCameraRunning = true;
        this.mediaStream = mediaStream;

        this.recorder = new MediaRecorder(this.mediaStream);
        this.recorder.ondataavailable = ev => {
          this.chunks.push(ev.data);
        };
        this.recorder.start();

        return this.mediaStream;
      }).catch(_ => {
        return null;
      });
  }

  public async stopCamera(): Promise<any> {
    if (this.recorder !== null && this.mediaStream !== null) {
      if (this.recorder.state !== 'inactive') {
        this.recorder.stop();
        this.recorder.onstop = () => {
          this.blob = new Blob(this.chunks, {type: 'video/webm'});
        };
      }

      this.mediaStream.getTracks().forEach(track => {
        track.stop();
      });

      await timer(1000).toPromise();

      this.isCameraRunning = false;
      this.mediaStream = null;
      this.recorder = null;
    }

    if (this.blob === null) {
      return null;
    }

    const url = window.URL.createObjectURL(this.blob);
    this.blob = null;
    return url;
  }
}
