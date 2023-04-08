import {Constant} from '../../../common/const/constant';

export class MenuBtn {
  public static activeScreeWithCamera(typeValue: any, type: any): Map<any, any> {
    const screenWithCameraMap = new Map();
    screenWithCameraMap.set(typeValue.btnClass, 'menu-btn-active');
    screenWithCameraMap.set(typeValue.imgClass, 'ic-screen-with-camera');
    screenWithCameraMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_camera_with_screen_active.png');
    screenWithCameraMap.set(typeValue.title, Constant.Title.screenWithCamera);
    screenWithCameraMap.set(typeValue.type, type.screenWithCamera);
    return screenWithCameraMap;
  }

  public static screeWithCamera(typeValue: any, type: any): Map<any, any> {
    const screenWithCameraMap = new Map();
    screenWithCameraMap.set(typeValue.btnClass, 'menu-btn');
    screenWithCameraMap.set(typeValue.imgClass, 'ic-screen-with-camera');
    screenWithCameraMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_camera_with_screen.png');
    screenWithCameraMap.set(typeValue.title, Constant.Title.screenWithCamera);
    screenWithCameraMap.set(typeValue.type, type.screenWithCamera);
    return screenWithCameraMap;
  }

  public static activeScreen(typeValue: any, type: any): Map<any, any> {
    const screenMap = new Map();
    screenMap.set(typeValue.btnClass, 'menu-btn-active');
    screenMap.set(typeValue.imgClass, 'ic-screen');
    screenMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_screen_active.png');
    screenMap.set(typeValue.title, Constant.Title.screen);
    screenMap.set(typeValue.type, type.screen);
    return screenMap;
  }

  public static screen(typeValue: any, type: any): Map<any, any> {
    const screenMap = new Map();
    screenMap.set(typeValue.btnClass, 'menu-btn');
    screenMap.set(typeValue.imgClass, 'ic-screen');
    screenMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_screen.png');
    screenMap.set(typeValue.title, Constant.Title.screen);
    screenMap.set(typeValue.type, type.screen);
    return screenMap;
  }

  public static activeCamera(typeValue: any, type: any): Map<any, any> {
    const cameraMap = new Map();
    cameraMap.set(typeValue.btnClass, 'menu-btn-active');
    cameraMap.set(typeValue.imgClass, 'ic-camera');
    cameraMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_camera_active.png');
    cameraMap.set(typeValue.title, Constant.Title.camera);
    cameraMap.set(typeValue.type, type.camera);
    return cameraMap;
  }

  public static camera(typeValue: any, type: any): Map<any, any> {
    const cameraMap = new Map();
    cameraMap.set(typeValue.btnClass, 'menu-btn');
    cameraMap.set(typeValue.imgClass, 'ic-camera');
    cameraMap.set(typeValue.imgSrc, 'ui-frame/assets/ic_camera.png');
    cameraMap.set(typeValue.title, Constant.Title.camera);
    cameraMap.set(typeValue.type, type.camera);
    return cameraMap;
  }
}
