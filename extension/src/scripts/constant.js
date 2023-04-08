/**
 * Constant variable.
 */
global.COMPONENT_CONTENT = 'content';
global.COMPONENT_BACKGROUND = 'background';
global.COMPONENT_POPUP = 'popup';

global.TYPE_INSTALLED_CHROME_EXT = 'installed_chrome_extension';
global.TYPE_POPUP = 'start_popup';
global.TYPE_MENU_FRAME = 'start_menu_frame';
global.TYPE_USER_FRAME = 'start_user_frame';
global.TYPE_RECORDING_FRAME = 'start_recording_frame';
global.TYPE_NO_FRAME = 'no_frame';
global.TYPE_START_RECORDING = 'start_recording';
global.TYPE_STOP_RECORDING = 'stop_recording';
global.TYPE_SAVE_INDEXED_DB = 'save_indexed_db';
global.TYPE_FORCE_STOP_RECORDING = 'force_stop_recording';
global.TYPE_SIGN_IN_SUCCESS = 'sing_in_success';
global.TYPE_REQ_NOTIFICATION = 'request_notifications';
global.TYPE_RES_NOTIFICATION = 'response_notifications';
global.TYPE_UPDATE_FRAME_POINTER = 'update_frame_pointer';
global.TYPE_UPDATE_CAMERA_SIZE = 'update_camera_size';

global.FRAME_SHUTDOWN = 'shutdown';
global.FRAME_COUNTDOWN = 'start_countdown';
global.FRAME_START = 'start_recording';
global.FRAME_STOP = 'stop_recording';
global.FRAME_FORCE_STOP_RECORDING = 'force_stop_recording';
global.FRAME_SIGN_IN_SUCCESS = 'sign_in';
global.FRAME_REQ_NOTIFICATION = 'request_notifications';
global.FRAME_RES_NOTIFICATION = 'response_notifications';
global.FRAME_REQ_NOTIFICATION = 'request_notifications';
global.FRAME_RES_NOTIFICATION = 'response_notifications';
global.FRAME_UPDATE_CAMERA_SIZE = 'update_camera_size';

global.COOKIE_UID = 'UID';
global.COOKIE_PID = 'PID';
global.COOKIE_AUTH_ID = 'AUTH_ID';
global.COOKIE_R_AUTH_ID = 'R_AUTH_ID';

global.DB_VERSION = 1;
global.OPEN_UI_SLEEP_MS = 3000;
global.START_RECORDING_MS = 5000;
global.INITIALIZE_FRAME_SLEEP_MS = 200;

global.HTTP_REQ = new XMLHttpRequest();
global.HTTP_REQ.timeout = 60000;

/**
 * Filed variable.
 * Always update value.
 */
// Content tab id
global.tabId = null;

// Recording
global.isRecording = false;
global.recorder = null;
global.mediaStream = null;
global.recordType = 0;
global.startRecordingTimeMs = 0;
global.audioDeviceId = null;
global.videoDeviceId = null;
global.videoTitle = null;
global.cameraSize = 1;
global.ctlLeftPointer = null;
global.ctlTopPointer = null;
global.mouseRangeLeftPointer = null;
global.mouseRangeTopPointer = null;

// Cookie
global.isRefreshCall = false;
global.uId = null;
global.pId = null;
global.authId = null;
global.rAuthId = null;

// Request variable
global.videoId = null;
global.blob = null;
global.chunks = [];
