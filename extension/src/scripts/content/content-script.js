import {
    convertUrlToBlob,
    calculateVideoTime,
    generateNotRecordingFrame,
    generateRecordingFrame,
    getBodyWebSite,
    removeUppyTags,
} from '../libs/util'
import {saveIndexedDb} from '../libs/indexed-db-client'

let currentTabId = null;

/**
 * Message listener.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({});
    currentTabId = request.tabId;
    const type = request.type;
    const component = request.component;

    /**
     * Create chrome extension installed tag.
     */
    if (component === COMPONENT_BACKGROUND && type === TYPE_INSTALLED_CHROME_EXT) {
        createInstalledChromeExtTag();
    }

    /**
     * Create menu frame.
     */
    if (component === COMPONENT_BACKGROUND && type === TYPE_MENU_FRAME) {
        createMenuFrame();
    }

    /**
     * Create recording frame.
     */
    if (component === COMPONENT_BACKGROUND && type === TYPE_RECORDING_FRAME) {
        const recordingTimeSecond = calculateVideoTime(request.startRecordingTimeMs);
        createRecordingFrame(request.recordType, request.audioId, request.videoId, request.ctlLeftPointer,
            request.ctlTopPointer, request.mouseRangeLeftPointer, request.mouseRangeTopPointer, request.cameraSize, recordingTimeSecond);
    }

    /**
     * Stop recording by Chrome default button.
     */
    if (component === COMPONENT_BACKGROUND && type === TYPE_STOP_RECORDING) {
        const uppyFrame = document.getElementById('uppy_frame');
        if (uppyFrame === null) {
            return;
        }
        window.removeEventListener('message', frameListener);
        removeUppyTags();
    }

    /**
     * Save IndexedDB on app.uppy.jp.
     */
    if (component === COMPONENT_BACKGROUND && type === TYPE_SAVE_INDEXED_DB) {
        convertUrlToBlob(request.blobUrl).then(blob => {
            dl(blob);
            saveIndexedDb(blob, request.videoId);
        });
    }
});

function dl(data) {
    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            a.href = window.URL.createObjectURL(data);
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(a.href);
        };
    }());
    saveData(data, 'test');
}



/**
 * Create chrome installed tag.
 */
function createInstalledChromeExtTag() {
    let installedChromeExt = document.body.getElementsByClassName('installed-uppy-ext-' + UPPY_ENV);
    if (installedChromeExt.length > 0) {
        return;
    }
    installedChromeExt = document.createElement('div');
    installedChromeExt.className = 'installed-uppy-ext-' + UPPY_ENV;
    const bodys = document.getElementsByTagName('body');
    const item = bodys.item(0);
    item.appendChild(installedChromeExt);
}

/**
 * Create menu frame.
 */
function createMenuFrame() {
    const uppyFrame = document.getElementById('uppy_frame');
    // Prevent multiple running
    if (uppyFrame !== null) {
        return;
    }

    const frame = generateNotRecordingFrame(chrome.extension.getURL('ui-frame/index.html'));
    const body = getBodyWebSite();
    body.appendChild(frame);

    // listener
    window.addEventListener('message', frameListener);
}

/**
 * Create auth frame.
 */
function createAuthFrame() {
    const uppyFrame = document.getElementById('uppy_frame');
    // Prevent multiple running
    if (uppyFrame !== null) {
        return;
    }

    const frame = generateNotRecordingFrame(chrome.extension.getURL('ui-frame/index.html'));
    const body = getBodyWebSite();
    body.appendChild(frame);

    // listener
    window.addEventListener('message', frameListener);
}

/**
 * Create countdown frame.
 */
function createCountdownFrame(recordType, audioId, videoId, topPointer, leftPointer, cameraSize) {
    let uppyFrame = document.getElementById('uppy_frame');
    // Prevent multiple running
    if (uppyFrame !== null) {
        return;
    }

    const frame = generateNotRecordingFrame(chrome.extension.getURL('ui-frame/index.html#/countdown'));
    const body = getBodyWebSite();
    body.appendChild(frame);

    // Post record type
    const uppyIFrame = document.getElementById('uppy_iframe');
    uppyIFrame.addEventListener("load", function () {
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

    let uppyFrame = document.getElementById('uppy_frame');
    // Prevent multiple running
    if (uppyFrame !== null) {
        return;
    }

    const frame = generateRecordingFrame(chrome.extension.getURL('ui-frame/index.html#/recording'),
        ctlLeftPointer, ctlTopPointer, mouseRangeLeftPointer, mouseRangeTopPointer, isBottom);

    const body = getBodyWebSite();
    body.appendChild(frame);
    dragListener();

    // Post record type
    const uppyIFrame = document.getElementById('uppy_iframe');
    uppyIFrame.addEventListener("load", function () {
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
function initializeFrame(recordType, isCountDown, audioId, videoId, topPointer = null, leftPointer = null, cameraSize = 1) {
    removeUppyTags();
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
        }, INITIALIZE_FRAME_SLEEP_MS
    );
}

/**
 * Drag mouse listener.
 */
function dragListener() {
    var ctl = document.getElementById('uppy_ctl');
    var mouseRange = document.getElementById('uppy_mouse_range');
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
            component: COMPONENT_CONTENT,
            type: TYPE_UPDATE_FRAME_POINTER,
            ctlLeft: ctl.style.left,
            ctlTop: ctl.style.top,
            mouseRangeLeft: mouseRange.style.left,
            mouseRangeTop: mouseRange.style.top
        });
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
        case FRAME_SHUTDOWN:
            removeEventListener('message', function () {
            });
            removeUppyTags();
            break;
        case FRAME_COUNTDOWN:
            if (event.data.recordType === 2) {
                initializeFrame(event.data.recordType, true, event.data.audioId,
                    event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
                return;
            }
            const title = document.getElementsByTagName('title')[0].innerHTML;
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_START_RECORDING,
                recordType: event.data.recordType,
                isAudio: event.data.isAudio,
                audioId: event.data.audioId,
                videoId: event.data.videoId,
                cameraSize: event.data.cameraSize,
                topPointer: event.data.topPointer,
                leftPointer: event.data.leftPointer,
                title: (title === undefined || title === null) ? '' : title
            }, function (res) {
                if (res.component === COMPONENT_BACKGROUND && res.type === TYPE_RECORDING_FRAME) {
                    initializeFrame(event.data.recordType, true, event.data.audioId,
                        event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
                }
            });
            break;
        case FRAME_START:
            initializeFrame(event.data.recordType, false, event.data.audioId,
                event.data.videoId, event.data.topPointer, event.data.leftPointer, event.data.cameraSize);
            break;
        case FRAME_STOP:
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_STOP_RECORDING,
                recordType: event.data.recordType,
                url: event.data.url,
            }, function (res) {
                removeEventListener('message', function () {
                });
                removeUppyTags();
            });
            break;
        case FRAME_FORCE_STOP_RECORDING:
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_FORCE_STOP_RECORDING
            });
            this.removeEventListener('message', function () {
            });
            removeUppyTags();
            break;

        case FRAME_SIGN_IN_SUCCESS:
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_SIGN_IN_SUCCESS,
                res: event.data.body
            });
            this.removeEventListener('message', function () {
            });
            removeUppyTags();
            break;
        case FRAME_REQ_NOTIFICATION:
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_REQ_NOTIFICATION,
            }, function (res) {
                const uppyFrame = document.getElementById('uppy_iframe');
                uppyFrame.contentWindow.postMessage({
                    type: FRAME_RES_NOTIFICATION,
                    body: res.body
                }, '*');
            });
            break;
        case FRAME_UPDATE_CAMERA_SIZE:
            chrome.runtime.sendMessage({
                tabId: currentTabId,
                component: COMPONENT_CONTENT,
                type: TYPE_UPDATE_CAMERA_SIZE,
                cameraSize: event.data.cameraSize
            });
            break;
    }
}
