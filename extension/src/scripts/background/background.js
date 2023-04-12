import {
    execute
} from '../libs/processing'

import {
    setTabId,
    getIsRecording,
    getComponentBackground,
    getTypeRecordingFrame,
    getRecordType,
    getAudioDeviceId,
    getVideoDeviceId,
    getStartRecordingTimeMs,
    getCtlLeftPointer,
    getCtlTopPointer,
    getMouseRangeLeftPointer,
    getMouseRangeTopPointer,
    getCameraSize,
    getTypeInstalledChromeExt
} from "../constant"


/**
 * Initial install Listener.
 */
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        // chrome.tabs.create({url: 'https://example.com'}, function (tab) {});
    }
});


/**
 * Tab Active Listener.
 * Catch tab activation change.
 */
chrome.tabs.onActivated.addListener(activeInfo => {
    console.log("call frame " + getComponentBackground() + " " + activeInfo.tabId)
    setTabId(activeInfo.tabId);
    if (getIsRecording()) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
            tabId: activeInfo.tabId,
            component: getComponentBackground(),
            type: getTypeRecordingFrame(),
            recordType: getRecordType(),
            audioId: getAudioDeviceId(),
            videoId: getVideoDeviceId(),
            startRecordingTimeMs: getStartRecordingTimeMs(),
            ctlLeftPointer: getCtlLeftPointer(),
            ctlTopPointer: getCtlTopPointer(),
            mouseRangeLeftPointer: getMouseRangeLeftPointer(),
            mouseRangeTopPointer: getMouseRangeTopPointer(),
            cameraSize: getCameraSize()
        }).then((response) => {
        }).catch((error) => {});
    }
    chrome.tabs.sendMessage(activeInfo.tabId, {
        tabId: activeInfo.tabId,
        component: getComponentBackground(),
        type: getTypeInstalledChromeExt()
    }).then((response) => {
    }).catch((error) => {});
});

/**
 * Browser update Listener.
 * Catch tab change.
 */
chrome.tabs.onUpdated.addListener((id, info, tab) => {
    console.log("update frame " + JSON.stringify(info) + " " + tab.active)
    if (info.status === 'complete' && tab.active) {
        setTabId(id);
        if (getIsRecording()) {
            chrome.tabs.sendMessage(id, {
                tabId: id,
                component: getComponentBackground(),
                type: getTypeRecordingFrame(),
                recordType: getRecordType(),
                audioId: getAudioDeviceId(),
                videoId: getVideoDeviceId(),
                startRecordingTimeMs: getStartRecordingTimeMs(),
                ctlLeftPointer: getCtlLeftPointer(),
                ctlTopPointer: getCtlTopPointer(),
                mouseRangeLeftPointer: getMouseRangeLeftPointer(),
                mouseRangeTopPointer: getMouseRangeTopPointer(),
                cameraSize: getCameraSize()
            }).then((response) => {
            }).catch((error) => {});
        }
        chrome.tabs.sendMessage(id, {
            tabId: id,
            component: getComponentBackground(),
            type: getTypeInstalledChromeExt()
        }).then((response) => {
        }).catch((error) => {});
    }
});

/**
 * Message Listener.
 * popup -> background -> content
 * content -> background -> content
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("message listener")
    if (!getIsRecording()) {
    }
    execute(request, sendResponse, sender);
    return true;
});
