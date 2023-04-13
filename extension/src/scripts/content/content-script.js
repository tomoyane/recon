import {
    calculateVideoTime,
    generateMediaOpt,
    generateNotRecordingFrame,
    generateRecordingFrame,
    generateUuid,
    getBodyWebSite,
    removeReconTags,
} from '../libs/util'

import {
    getAudioDeviceId,
    getBlob,
    getChunks,
    getComponentBackground,
    getComponentContent,
    getFrameCountdown,
    getFrameForceStopRecording,
    getFrameShutdown,
    getFrameStart,
    getFrameStop,
    getFrameUpdateCameraSize,
    getInitFrameSleepMs,
    getMediaStream,
    getRecorder,
    getStartRecordingMs,
    getTabId,
    getTypeForceStopRecording,
    getTypeInstalledChromeExt,
    getTypeMenuFrame,
    getTypeRecordingFrame,
    getTypeSaveVideo,
    getTypeStartMediaFrame,
    getTypeStartRecording,
    getTypeStopRecording,
    getTypeUpdateCameraSize,
    getTypeUpdateFramePointer,
    getVideoDeviceId,
    setBlob,
    setCameraSize,
    setChunks,
    setCtlLeftPointer,
    setCtlTopPointer,
    setIsRecording,
    setMediaStream,
    setMouseRangeLeftPointer,
    setMouseRangeTopPointer,
    setRecorder,
    setRecordType,
    setStartRecordingTimeMs,
    setVideoId
} from "../constant";

import {sendToDlCommand} from "../libs/processing";

let currentTabId = null;

/**
 * Message listener.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({});
    mainProcess(request, sender);
});

function mainProcess(request, sender) {
    currentTabId = request.tabId;
    const type = request.type;
    const component = request.component;
    console.log("call frame " + type + " " + component)

    /**
     * Create chrome extension installed tag.
     */
    if (component === getComponentBackground() && type === getTypeInstalledChromeExt()) {
        createInstalledChromeExtTag();
    }

    /**
     * Create menu frame.
     */
    if (component === getComponentBackground() && type === getTypeMenuFrame()) {
        createMenuFrame();
    }

    /**
     * Create recording frame.
     */
    if (component === getComponentBackground() && type === getTypeRecordingFrame()) {
        console.log("call recording frame")
        const recordingTimeSecond = calculateVideoTime(request.startRecordingTimeMs);
        createRecordingFrame(request.recordType, request.audioId, request.videoId, request.ctlLeftPointer,
            request.ctlTopPointer, request.mouseRangeLeftPointer,
            request.mouseRangeTopPointer, request.cameraSize, recordingTimeSecond);
    }

    /**
     * Stop recording by Chrome default button.
     */
    if (component === getComponentBackground() && type === getTypeStopRecording()) {
        const reconFrame = document.getElementById('recon_frame');
        if (reconFrame === null) {
            return;
        }
        window.removeEventListener('message', frameListener);
        removeReconTags();
    }

    /**
     * Save Video
     */
    if (component === getComponentBackground() && type === getTypeSaveVideo()) {
        // convertUrlToBlob(request.blobUrl).then(blob => {
        //     dl(blob);
        //     saveIndexedDb(blob, request.videoId);
        // });
        dl(request.blobUrl);
    }

    /**
     * Generate stream media
     */
    if (component === getComponentBackground() && type === getTypeStartMediaFrame()) {
        navigator.mediaDevices.getUserMedia(generateMediaOpt(request.streamId))
        .then((stream) => {
            if (request.topPointer !== null && request.leftPointer !== null) {
                setCtlTopPointer(Math.abs(request.topPointer) + 'px');
                setCtlLeftPointer(Math.abs(request.leftPointer) + 'px');
                setMouseRangeTopPointer(Math.abs(request.topPointer) + 'px');
                setMouseRangeLeftPointer(Math.abs(request.leftPointer) + 'px');
            }
            setIsRecording(true);
            setMediaStream(stream);
            setRecordType(request.recordType);
            setCameraSize(request.cameraSize);
            const isAudio = request.isAudio;

            if (isAudio) {
                // navigator.mediaDevices.getUserMedia({audio: true})
                //     .then((audioStream) => {
                //         startRecording(audioStream);
                //     }).catch((audioErr) => {
                //         setIsRecording(false);
                //         throw audioErr;
                //     });
                startRecording(null);
            } else {
                startRecording(null);
            }

            request.component = getComponentBackground();
            request.type = getTypeRecordingFrame();
            request.audioId = getAudioDeviceId();
            request.videoId = getVideoDeviceId();
            mainProcess(request, sender);

        }).catch((err) => {
            setIsRecording(false);
            console.log(err);
        });
    }
}

function startRecording(audioStream) {
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
    var recorder = new MediaRecorder(getMediaStream(), options);
    setRecorder(recorder);

    recorder.ondataavailable = ev => {
        const chunks = getChunks();
        chunks.push(ev.data);
        setChunks(chunks);
    };
    recorder.onstop = () => {
        // Insert And Upload video data
        setVideoId(generateUuid());
        setBlob(new Blob(getChunks(), {type: 'video/webm'}));
        blobToBase64(getBlob()).then(base64Data => {
            sendToDlCommand(base64Data);

            // Reset data
            setIsRecording(false);
            setRecordType(0);
            getMediaStream().getTracks().forEach(track => {
                track.stop();
            });
            setMediaStream(null);
        })
    };
    setTimeout(function () {
        // Force stop is null when intercept
        if (recorder !== null) {
            recorder.start();
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

function dl(url) {
    const saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data) {
            a.href =data;
            a.download = 'recon_data_' + Date.now().toString();
            a.click();
            window.URL.revokeObjectURL(a.href);
        };
    }());
    saveData(url);
}

/**
 * Create chrome installed tag.
 */
function createInstalledChromeExtTag() {
    let installedChromeExt = document.body.getElementsByClassName('installed-recon-ext-' + RECON_ENV);
    if (installedChromeExt.length > 0) {
        return;
    }
    installedChromeExt = document.createElement('div');
    installedChromeExt.className = 'installed-recon-ext-' + RECON_ENV;
    const bodys = document.getElementsByTagName('body');
    const item = bodys.item(0);
    item.appendChild(installedChromeExt);
}

/**
 * Create menu frame.
 */
function createMenuFrame() {
    const reconFrame = document.getElementById('recon_frame');
    // Prevent multiple running
    if (reconFrame !== null) {
        return;
    }

    const frame = generateNotRecordingFrame(chrome.runtime.getURL('ui-frame/index.html'));
    const body = getBodyWebSite();
    body.appendChild(frame);

    // listener
    window.addEventListener('message', frameListener);
}

/**
 * Create countdown frame.
 */
function createCountdownFrame(recordType, audioId, videoId, topPointer, leftPointer, cameraSize) {
    let reconFrame = document.getElementById('recon_frame');
    // Prevent multiple running
    if (reconFrame !== null) {
        return;
    }

    const frame = generateNotRecordingFrame(chrome.runtime.getURL('ui-frame/index.html#/countdown'));
    const body = getBodyWebSite();
    body.appendChild(frame);

    // Post record type
    const reconIFrame = document.getElementById('recon_iframe');
    reconIFrame.addEventListener("load", function () {
        this.contentWindow.postMessage({
            recordType: recordType,
            audioId: audioId,
            videoId: videoId,
            topPointer: topPointer,
            leftPointer: leftPointer,
            cameraSize: cameraSize
        }, '*');
    });

    // listener
    window.addEventListener('message', frameListener);
}

/**
 * Create recording frame.
 */
function createRecordingFrame(recordType, audioId, videoId, ctlLeftPointer,
                              ctlTopPointer, mouseRangeLeftPointer, mouseRangeTopPointer, cameraSize,
                              recordingTime = 0, isBottom = false) {

    document.getElementById("recon_frame").remove();
    let reconFrame = document.getElementById('recon_frame');
    // Prevent multiple running
    if (reconFrame !== null) {
        return;
    }

    const frame = generateRecordingFrame(chrome.runtime.getURL('ui-frame/index.html#/recording'),
        ctlLeftPointer, ctlTopPointer, mouseRangeLeftPointer, mouseRangeTopPointer, isBottom);

    const body = getBodyWebSite();
    body.appendChild(frame);
    console.log('created!!!!')
    dragListener();

    // Post record type
    const reconIFrame = document.getElementById('recon_iframe');
    reconIFrame.addEventListener("load", function () {
        this.contentWindow.postMessage({
            recordType: recordType,
            audioId: audioId,
            videoId: videoId,
            recordingTime: recordingTime,
            cameraSize: cameraSize
        }, '*');
    });

    // listener
    window.addEventListener('message', frameListener);
}

/**
 * Initialize frame.
 * Call UI Frame <-> Content Script.
 */
function initializeFrame(recordType, isCountDown, audioId, videoId,
                         topPointer = null, leftPointer = null, cameraSize = 1) {
    removeReconTags();
    // Sleep create countdown frame
    setTimeout(
        function call() {
            if (isCountDown) {
                createCountdownFrame(recordType, audioId, videoId, topPointer, leftPointer, cameraSize);

            } else {
                const ctlTopPointer = topPointer !== null ? Math.abs(topPointer) + 'px' : null;
                const ctlLeftPointer = leftPointer !== null ? Math.abs(leftPointer) + 'px' : null;
                const mouseRangeTopPointer = topPointer !== null ? Math.abs(topPointer) + 'px' : null;
                const mouseRangeLeftPointer = leftPointer !== null ? Math.abs(leftPointer) + 'px' : null;

                createRecordingFrame(recordType, audioId, videoId, ctlLeftPointer, ctlTopPointer,
                    mouseRangeLeftPointer, mouseRangeTopPointer, cameraSize, 0, true);
            }
        }, getInitFrameSleepMs()
    );
}

/**
 * Drag mouse listener.
 */
function dragListener() {
    var ctl = document.getElementById('recon_ctl');
    var mouseRange = document.getElementById('recon_mouse_range');
    ctl.style.cursor = 'pointer';
    ctl.ondragstart = function (e) {
        return false;
    };

    function onMouseMove(event) {
        var x = event.clientX;
        var y = event.clientY;
        var width = ctl.offsetWidth;
        var height = ctl.offsetHeight;
        mouseRange.style.top = (y - height / 2) + 'px';
        mouseRange.style.left = (x - width / 2) + 'px';
        ctl.style.top = (y - height / 2) + 30 + 'px';
        ctl.style.left = (x - width / 2) + 30 + 'px';
    }

    ctl.addEventListener('mouseup', function (e) {
        chrome.runtime.sendMessage({
            tabId: currentTabId,
            component: getComponentContent(),
            type: getTypeUpdateFramePointer(),
            ctlLeft: ctl.style.left,
            ctlTop: ctl.style.top,
            mouseRangeLeft: mouseRange.style.left,
            mouseRangeTop: mouseRange.style.top
        }).then((response) => {
        }).catch((error) => {});

        document.removeEventListener('mousemove', onMouseMove);
    });

    ctl.addEventListener('mousedown', function (e) {
        e.preventDefault();
        document.addEventListener('mousemove', onMouseMove);
    });
}

/**
 * Frame listener.
 */
function frameListener(event) {
    switch (event.data.type) {
        case getFrameShutdown():
            removeEventListener('message', function () {
            });
            removeReconTags();
            break;

        case getFrameCountdown():
            if (event.data.recordType === 2) {
                initializeFrame(event.data.recordType, true, event.data.audioId,
                    event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
                return;
            }
            const title = document.getElementsByTagName('title')[0].innerHTML;
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: getComponentContent(),
                type: getTypeStartRecording(),
                recordType: event.data.recordType,
                isAudio: event.data.isAudio,
                audioId: event.data.audioId,
                videoId: event.data.videoId,
                cameraSize: event.data.cameraSize,
                topPointer: event.data.topPointer,
                leftPointer: event.data.leftPointer,
                title: (title === undefined || title === null) ? '' : title
            }).then((res) => {
                if (res.component === getComponentBackground() && res.type === getTypeRecordingFrame()) {
                    initializeFrame(event.data.recordType, true, event.data.audioId,
                        event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
                }
            }).catch((error) => {});
            break;

        case getFrameStart():
            initializeFrame(event.data.recordType, false, event.data.audioId,
                event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
            break;

        case getFrameStop():
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: getComponentContent(),
                type: getTypeStopRecording(),
                recordType: event.data.recordType,
                url: event.data.url,
            }).then((res) => {
                removeEventListener('message', function () {});
                removeReconTags();
            }).catch((error) => {});
            break;
        case getFrameForceStopRecording():
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: getComponentContent(),
                type: getTypeForceStopRecording()
            }).then((response) => {
            }).catch((error) => {});

            this.removeEventListener('message', function () {});
            removeReconTags();
            break
        case getFrameUpdateCameraSize():
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: getComponentContent(),
                type: getTypeUpdateCameraSize(),
                cameraSize: event.data.cameraSize
            }).then((response) => {
            }).catch((error) => {});
            break;
    }
}
