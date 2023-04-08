import {subscribeCookie, postRefreshToken, execute} from '../libs/processing'
import {isLogin, checkTokenExpired} from '../libs/util'

/**
 * Initial install Listener.
 */
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        chrome.tabs.create({url: 'https://uppy.jp?chrome_extension_installed=true'}, function (tab) {
        });
    }
});

/**
 * Tab Active Listener.
 * Catch tab activation change.
 */
chrome.tabs.onActivated.addListener(activeInfo => {
    tabId = activeInfo.tabId;
    if (isRecording) {
        chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            component: COMPONENT_BACKGROUND,
            type: TYPE_RECORDING_FRAME,
            recordType: recordType,
            audioId: audioDeviceId,
            videoId: videoDeviceId,
            startRecordingTimeMs: startRecordingTimeMs,
            ctlLeftPointer: ctlLeftPointer,
            ctlTopPointer: ctlTopPointer,
            mouseRangeLeftPointer: mouseRangeLeftPointer,
            mouseRangeTopPointer: mouseRangeTopPointer,
            cameraSize: cameraSize
        });
    }
    chrome.tabs.sendMessage(tabId, {
        tabId: tabId,
        component: COMPONENT_BACKGROUND,
        type: TYPE_INSTALLED_CHROME_EXT
    });
});

/**
 * Browser update Listener.
 * Catch tab change.
 */
chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (info.status === 'complete' && tab.active) {
        tabId = id;
        if (isRecording) {
            chrome.tabs.sendMessage(tabId, {
                tabId: tabId,
                component: COMPONENT_BACKGROUND,
                type: TYPE_RECORDING_FRAME,
                recordType: recordType,
                audioId: audioDeviceId,
                videoId: videoDeviceId,
                startRecordingTimeMs: startRecordingTimeMs,
                ctlLeftPointer: ctlLeftPointer,
                ctlTopPointer: ctlTopPointer,
                mouseRangeLeftPointer: mouseRangeLeftPointer,
                mouseRangeTopPointer: mouseRangeTopPointer,
                cameraSize: cameraSize
            });
        }
        chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            component: COMPONENT_BACKGROUND,
            type: TYPE_INSTALLED_CHROME_EXT
        });
    }
});

/**
 * Message Listener.
 * popup -> background -> content
 * content -> background -> content
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!isRecording) {
        // Wait get cookie
        subscribeCookie().then(res => {
            if (isLogin()) {
                const isExpired = checkTokenExpired();
                // Refresh token
                if (isExpired) {
                    postRefreshToken(rAuthId);
                }
            }
            execute(request, sendResponse);
        });
    } else {
        execute(request, sendResponse);
    }
    return true;
});
