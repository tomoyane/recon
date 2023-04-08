import {generateUuid, convertUrlToBlob} from './util'

/**
 * Execute main process.
 */
export function execute(request, sendResponse) {
    tabId = request.tabId;
    const type = request.type;
    const component = request.component;

    /**
     * Record frame
     */
    if (component === COMPONENT_POPUP && type === TYPE_POPUP) {
        chrome.tabs.sendMessage(tabId, {tabId: tabId, component: COMPONENT_BACKGROUND, type: TYPE_MENU_FRAME});
        return TYPE_MENU_FRAME;
    }

    /**
     * Start recording
     */
    if (component === COMPONENT_CONTENT && type === TYPE_START_RECORDING) {
        videoTitle = request.title;
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], function (streamId) {
            audioDeviceId = request.audioId
            videoDeviceId = request.videoId
            if (streamId) {
                navigator.getUserMedia(generateMediaOpt(streamId), function (stream) {
                    if (request.topPointer !== null && request.leftPointer !== null) {
                        ctlTopPointer = Math.abs(request.topPointer) + 'px';
                        ctlLeftPointer = Math.abs(request.leftPointer) + 'px';
                        mouseRangeTopPointer = Math.abs(request.topPointer) + 'px';
                        mouseRangeLeftPointer = Math.abs(request.leftPointer) + 'px';
                    }
                    isRecording = true;
                    mediaStream = stream;
                    recordType = request.recordType;
                    cameraSize = request.cameraSize;
                    const isAudio = request.isAudio;

                    if (isAudio) {
                        navigator.getUserMedia({audio: true}, function (audioStream) {
                            startRecording(audioStream);
                        }, function (err) {
                            isRecording = false;
                            throw err;
                        });
                    } else {
                        startRecording(null);
                    }

                    sendResponse({
                        component: COMPONENT_BACKGROUND,
                        type: TYPE_RECORDING_FRAME,
                        recordType: request.recordType,
                        audioId: audioDeviceId,
                        videoId: videoDeviceId,
                    })
                }, function (err) {
                    isRecording = false;
                    throw err;
                });
            }
        });
        return TYPE_RECORDING_FRAME;
    }

    /**
     * Stop recording
     */
    if (component === COMPONENT_CONTENT && type === TYPE_STOP_RECORDING) {
        if (request.recordType === 2) {
            videoId = generateUuid();
            convertUrlToBlob(request.url).then(result => {
                blob = result;
                sendToDlCommand();
            });
            sendResponse({
                component: COMPONENT_BACKGROUND,
                type: TYPE_STOP_RECORDING,
                recordType: request.recordType
            })
        } else {
            if (recorder !== null) {
                recorder.stop();
            }
        }
        return TYPE_NO_FRAME;
    }

    /**
     * Force stop recording
     */
    if (component === COMPONENT_CONTENT && type === TYPE_FORCE_STOP_RECORDING) {
        if (mediaStream !== null) {
            mediaStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        initializeRecordVal();
        return TYPE_NO_FRAME;
    }

    /**
     * Update frame pointer data. `update frame pointer`.
     */
    if (component === COMPONENT_CONTENT && type === TYPE_UPDATE_FRAME_POINTER) {
        ctlLeftPointer = request.ctlLeft;
        ctlTopPointer = request.ctlTop;
        mouseRangeLeftPointer = request.mouseRangeLeft;
        mouseRangeTopPointer = request.mouseRangeTop;
        return TYPE_NO_FRAME;
    }

    /**
     * Update camera size. `update camera size`.
     */
    if (component === COMPONENT_CONTENT && type === TYPE_UPDATE_CAMERA_SIZE) {
        cameraSize = request.cameraSize;
        return TYPE_NO_FRAME;
    }
}

/**
 * Start recording.
 */
export function startRecording(audioStream) {
    if (audioStream !== null) {
        mediaStream.addTrack(audioStream.getTracks()[0]);
    }

    mediaStream.getVideoTracks()[0].onended = () => {
        chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            component: COMPONENT_BACKGROUND,
            type: TYPE_STOP_RECORDING,
        });
        recorder.stop();
    }

    const options = {
        mimeType: 'video/webm'
    };
    recorder = new MediaRecorder(mediaStream, options);
    recorder.ondataavailable = ev => {
        chunks.push(ev.data);
    };
    recorder.onstop = () => {
        // Insert And Upload video data
        videoId = generateUuid();
        blob = new Blob(chunks, {type: 'video/webm'});
        sendToDlCommand();

        // Reset data
        isRecording = false;
        recordType = 0;
        mediaStream.getTracks().forEach(track => {
            track.stop();
        });
        mediaStream = null;
    };
    setTimeout(function () {
        // Force stop is null when intercept
        if (recorder !== null) {
            recorder.start();
            startRecordingTimeMs = new Date().getTime() / 1000;
        }
    }, START_RECORDING_MS);
}

/**
 * Generate Media Option.
 */
export function generateMediaOpt(streamId) {
    return {
        audio: {
            optional: [{
                deviceId: {exact: audioDeviceId}
            }],
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
            }
        },
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
            }
        }
    };
}


export function sendToDlCommand() {
    chrome.tabs.sendMessage(tabId, {
        tabId: tabId,
        component: COMPONENT_BACKGROUND,
        type: TYPE_SAVE_INDEXED_DB,
        blobUrl: window.URL.createObjectURL(blob),
        videoId: videoId,
    });
}

export function initializeRecordVal(isSuccess = false) {
    if (isSuccess) {
        chunks = [];
        isRecording = false;
        recorder = null;
        startRecordingTimeMs = 0;
        ctlLeftPointer = null;
        ctlTopPointer = null;
        mouseRangeLeftPointer = null;
        mouseRangeTopPointer = null;
        mediaStream = null;
    } else {
        videoId = null;
        chunks = [];
        blob = null;
        isRecording = false;
        recorder = null;
        ctlLeftPointer = null;
        ctlTopPointer = null;
        mouseRangeLeftPointer = null;
        mouseRangeTopPointer = null;
        startRecordingTimeMs = 0;
        mediaStream = null;
    }
}
