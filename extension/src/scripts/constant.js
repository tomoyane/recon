'use strict';

var OPEN_UI_SLEEP_MS = 3000;
export function getOpenUiSleepMs() {
    return OPEN_UI_SLEEP_MS;
}

var INITIALIZE_FRAME_SLEEP_MS = 200;
export function getInitFrameSleepMs() {
    return INITIALIZE_FRAME_SLEEP_MS;
}

var FRAME_UPDATE_CAMERA_SIZE = 'update_camera_size';
export function getFrameUpdateCameraSize() {
    return FRAME_UPDATE_CAMERA_SIZE;
}

var FRAME_FORCE_STOP_RECORDING = 'force_stop_recording';
export function getFrameForceStopRecording() {
    return FRAME_FORCE_STOP_RECORDING;
}

var FRAME_START = 'start_recording';
export function getFrameStart() {
    return FRAME_START;
}

var FRAME_STOP = 'stop_recording';
export function getFrameStop() {
    return FRAME_STOP;
}

var FRAME_COUNTDOWN = 'start_countdown';
export function getFrameCountdown() {
    return FRAME_COUNTDOWN;
}

var FRAME_SHUTDOWN = 'shutdown';
export function getFrameShutdown() {
    return FRAME_SHUTDOWN;
}

var tabId = null;
export function setTabId(i) {
    tabId = i;
}
export function getTabId() {
    return tabId;
}

var isRecording = false;
export function setIsRecording(r) {
    isRecording = r;
}
export function getIsRecording() {
    return isRecording;
}

var COMPONENT_BACKGROUND = 'background';
export function getComponentBackground() {
    return COMPONENT_BACKGROUND;
}

var TYPE_RECORDING_FRAME = 'start_recording_frame';
export function getTypeRecordingFrame() {
    return TYPE_RECORDING_FRAME;
}

var TYPE_START_MEDIA_FRAME = 'start_user_media_frame';
export function getTypeStartMediaFrame() {
    return TYPE_START_MEDIA_FRAME;
}


var recordType = 0;
export function setRecordType(r) {
    recordType = r;
}
export function getRecordType() {
    return recordType;
}

var audioDeviceId = null;
export function setAudioDeviceId(i) {
    audioDeviceId = i;
}
export function getAudioDeviceId() {
    return audioDeviceId;
}

var videoDeviceId = null;
export function setVideoDeviceId(i) {
    videoDeviceId = i;
}
export function getVideoDeviceId() {
    return videoDeviceId;
}

var startRecordingTimeMs = 0;
export function setStartRecordingTimeMs(t) {
    startRecordingTimeMs = t;
}
export function getStartRecordingTimeMs() {
    return startRecordingTimeMs;
}

var ctlLeftPointer = null;
export function setCtlLeftPointer(pointer) {
    ctlLeftPointer = pointer;
}
export function getCtlLeftPointer() {
    return ctlLeftPointer;
}

var ctlTopPointer = null;
export function setCtlTopPointer(pointer) {
    ctlTopPointer = pointer;
}
export function getCtlTopPointer() {
    return ctlTopPointer;
}

var mouseRangeLeftPointer = null;
export function setMouseRangeLeftPointer(pointer) {
    mouseRangeLeftPointer = pointer;
}
export function getMouseRangeLeftPointer() {
    return mouseRangeLeftPointer;
}

var mouseRangeTopPointer = null;
export function setMouseRangeTopPointer(pointer) {
    mouseRangeTopPointer = pointer;
}
export function getMouseRangeTopPointer() {
    return mouseRangeTopPointer;
}

var cameraSize = 1;
export function setCameraSize(s) {
    cameraSize = s;
}
export function getCameraSize() {
    return cameraSize;
}

var TYPE_INSTALLED_CHROME_EXT = 'installed_chrome_extension';
export function getTypeInstalledChromeExt() {
    return TYPE_INSTALLED_CHROME_EXT;
}

var COMPONENT_POPUP = 'popup';
export function getComponentPopup() {
    return COMPONENT_POPUP;
}

var TYPE_POPUP = 'start_popup';
export function getStartPopup() {
    return TYPE_POPUP;
}

var TYPE_MENU_FRAME = 'start_menu_frame';
export function getTypeMenuFrame() {
    return TYPE_MENU_FRAME;
}

var videoTitle = null;
export function setVideoTitle(t) {
    videoTitle = t;
}
export function getVideoTitle() {
    return videoTitle;
}

var mediaStream = null;
export function setMediaStream(stream) {
    mediaStream = stream;
}
export function getMediaStream() {
    return mediaStream;
}

var COMPONENT_CONTENT = 'content';
export function getComponentContent() {
    return COMPONENT_CONTENT;
}

var TYPE_START_RECORDING = 'start_recording';
export function getTypeStartRecording() {
    return TYPE_START_RECORDING;
}

var TYPE_STOP_RECORDING = 'stop_recording';
export function getTypeStopRecording() {
    return TYPE_STOP_RECORDING;
}

var videoId = null;
export function setVideoId(i) {
    videoId = i;
}
export function getVideoId() {
    return videoId;
}

var blob = null;
export function setBlob(b) {
    blob = b;
}
export function getBlob() {
    return blob;
}

var TYPE_NO_FRAME = 'no_frame';
export function getTypeNoFrame() {
    return TYPE_NO_FRAME;
}

var TYPE_FORCE_STOP_RECORDING = 'force_stop_recording';
export function getTypeForceStopRecording() {
    return TYPE_FORCE_STOP_RECORDING;
}

var TYPE_UPDATE_FRAME_POINTER = 'update_frame_pointer';
export function getTypeUpdateFramePointer() {
    return TYPE_UPDATE_FRAME_POINTER;
}

var TYPE_UPDATE_CAMERA_SIZE = 'update_camera_size';
export function getTypeUpdateCameraSize() {
    return TYPE_UPDATE_CAMERA_SIZE;
}

var recorder = null;
export function setRecorder(recoder) {
    recorder = recoder;
}
export function getRecorder() {
    return recorder;
}

var chunks = [];
export function setChunks(chunk) {
    chunks = chunk;
}
export function getChunks() {
    return chunks;
}

var START_RECORDING_MS = 5000;
export function getStartRecordingMs() {
    return START_RECORDING_MS;
}

var TYPE_SAVE_INDEXED_DB = 'save_indexed_db';
export function getTypeSaveIndexedDb() {
    return TYPE_SAVE_INDEXED_DB;
}

var TYPE_SAVE_VIDEO = 'save_video';
export function getTypeSaveVideo() {
    return TYPE_SAVE_VIDEO;
}