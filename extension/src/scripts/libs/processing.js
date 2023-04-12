import {
    generateUuid,
    convertUrlToBlob
} from './util'

import {
    setTabId,
    getTabId,
    getComponentPopup,
    getStartPopup,
    getComponentBackground,
    getTypeMenuFrame,
    setVideoDeviceId,
    setAudioDeviceId,
    setCtlLeftPointer,
    setCtlTopPointer,
    setMouseRangeTopPointer,
    setMouseRangeLeftPointer,
    setRecordType,
    setIsRecording,
    setMediaStream,
    setCameraSize,
    getTypeRecordingFrame,
    getAudioDeviceId,
    getVideoDeviceId,
    getComponentContent,
    getTypeStartRecording,
    setVideoTitle,
    getTypeStopRecording,
    setVideoId,
    setBlob,
    getTypeForceStopRecording,
    getTypeNoFrame,
    getTypeUpdateFramePointer,
    getTypeUpdateCameraSize,
    getMediaStream,
    getRecorder,
    setRecorder,
    getChunks,
    setStartRecordingTimeMs,
    getStartRecordingMs,
    getBlob,
    getVideoId,
    setChunks, getTypeSaveVideo,
} from "../constant"

/**
 * Execute main process.
 */
export function execute(request, sendResponse, sender) {
    setTabId(request.tabId);
    const type = request.type;
    const component = request.component;
    console.log("main process " + type + " " + component)

    /**
     * Record frame
     */
    if (component === getComponentPopup() && type === getStartPopup()) {
        chrome.tabs.sendMessage(getTabId(), {
            tabId: getTabId(),
            component: getComponentBackground(),
            type: getTypeMenuFrame()
        }).then((response) => {
        }).catch((error) => {
        });
        return getTypeMenuFrame();
    }

    /**
     * Start recording
     */
    if (component === getComponentContent() && type === getTypeStartRecording()) {
        console.log("hello");
        setVideoTitle(request.title);
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], sender.tab, function (streamId) {
            setAudioDeviceId(request.audioId);
            setVideoDeviceId(request.videoId);

            console.log("hello2 " + streamId);
            if (streamId) {
                console.log("hello3-1");
                var mediaInfo = generateMediaOpt(streamId);
                console.log("hello3-2");
                navigator.mediaDevices.getUserMedia(mediaInfo)
                    .then((stream) => {
                        if (request.topPointer !== null && request.leftPointer !== null) {
                            setCtlTopPointer(Math.abs(request.topPointer) + 'px');
                            setCtlLeftPointer(Math.abs(request.leftPointer) + 'px');
                            setMouseRangeTopPointer(Math.abs(request.topPointer) + 'px');
                            setMouseRangeLeftPointer(Math.abs(request.leftPointer) + 'px');
                        }
                        console.log("hello3-4");
                        setIsRecording(true);
                        setMediaStream(stream);
                        setRecordType(request.recordType);
                        setCameraSize(request.cameraSize);
                        const isAudio = request.isAudio;
                        console.log("hello3-5");

                        if (isAudio) {
                            navigator.mediaDevices.getUserMedia({audio: true})
                                .then((audioStream) => {
                                    startRecording(audioStream);
                                }).catch((audioErr) => {
                                    setIsRecording(false);
                                    throw err;
                                });
                        } else {
                            startRecording(null);
                        }

                        console.log("hello4");
                        sendResponse({
                            component: getComponentBackground(),
                            type: getTypeRecordingFrame(),
                            recordType: request.recordType,
                            audioId: getAudioDeviceId(),
                            videoId: getVideoDeviceId(),
                        })

                        console.log("hello5");
                    }).catch((err) => {
                        setIsRecording(false);
                        // throw err;
                        console.log(err);
                    });
            }
        });
        return getTypeRecordingFrame();
    }

    /**
     * Stop recording
     */
    if (component === getComponentContent() && type === getTypeStopRecording()) {
        if (request.recordType === 2) {
            setVideoId(generateUuid());
            convertUrlToBlob(request.url).then(result => {
                // setBlob(result);
                sendToDlCommand(request.url);
            });
            sendResponse({
                component: getComponentBackground(),
                type: getTypeStopRecording(),
                recordType: request.recordType
            })
        } else {
            if (getRecorder() !== null) {
                getRecorder().stop();
            }
        }

        if (getMediaStream() !== null) {
            getMediaStream().getTracks().forEach(track => {
                track.stop();
            });
        }
        initializeRecordVal();
        return getTypeNoFrame();
    }

    /**
     * Force stop recording
     */
    if (component === getComponentContent() && type === getTypeForceStopRecording()) {
        if (getMediaStream() !== null) {
            getMediaStream().getTracks().forEach(track => {
                track.stop();
            });
        }
        initializeRecordVal();
        return getTypeNoFrame();
    }

    /**
     * Update frame pointer data. `update frame pointer`.
     */
    if (component === getComponentContent() && type === getTypeUpdateFramePointer()) {
        setCtlLeftPointer(request.ctlLeft);
        setCtlTopPointer(request.ctlTop);
        setMouseRangeLeftPointer(request.mouseRangeLeft);
        setMouseRangeTopPointer(request.mouseRangeTop);
        return getTypeNoFrame();
    }

    /**
     * Update camera size. `update camera size`.
     */
    if (component === getComponentContent() && type === getTypeUpdateCameraSize()) {
        setCameraSize(request.cameraSize);
        return getTypeNoFrame();
    }
}

/**
 * Start recording.
 */
export function startRecording(audioStream) {
    if (audioStream !== null) {
        getMediaStream().addTrack(audioStream.getTracks()[0]);
    }

    getMediaStream().getVideoTracks()[0].onended = () => {
        chrome.tabs.sendMessage(getTabId(), {
            tabId: getTabId(),
            component: getComponentBackground(),
            type: getTypeStopRecording(),
        });
        getRecorder().stop();
    }

    const options = {
        mimeType: 'video/webm'
    };
    setRecorder(new MediaRecorder(getMediaStream(), options));

    getRecorder().ondataavailable = ev => {
        const chunks = getChunks();
        chunks.push(ev.data);
        setChunks(chunks);
    };
    getRecorder().onstop = async () => {
        // Insert And Upload video data
        setVideoId(generateUuid());
        setBlob(new Blob(getChunks(), {type: 'video/webm'}));
        var url = await blobToBase64(getBlob());
        sendToDlCommand(url);

        // Reset data
        setIsRecording(false);
        setRecordType(0);
        getMediaStream().getTracks().forEach(track => {
            track.stop();
        });
        setMediaStream(null);
    };
    setTimeout(function () {
        // Force stop is null when intercept
        if (getRecorder() !== null) {
            getRecorder().start();
            setStartRecordingTimeMs(new Date().getTime() / 1000);
        }
    }, getStartRecordingMs());
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

/**
 * Generate Media Option.
 */
export function generateMediaOpt(streamId) {
    return {
        audio: {
            optional: [{
                deviceId: {exact: getAudioDeviceId()}
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


export function sendToDlCommand(url) {
    chrome.tabs.sendMessage(getTabId(), {
        tabId: getTabId(),
        component: getComponentBackground(),
        type: getTypeSaveVideo(),
        blobUrl: url,
        videoId: getVideoId(),
    });
}

export function initializeRecordVal(isSuccess = false) {
    setVideoId(null);
    setChunks([]);
    setBlob(null);
    setIsRecording(false);
    setRecorder(null);
    setCtlLeftPointer(null);
    setCtlTopPointer(null);
    setMouseRangeTopPointer(null);
    setMouseRangeLeftPointer(null);
    setStartRecordingTimeMs(0);
    setMediaStream(null);
}
