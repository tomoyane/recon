import {isLogin, generateUuid, generateVideoUrl, convertUrlToBlob, calculateVideoTime} from './util'

/**
 * Execute main process.
 *
 * @param request
 * @param sendResponse
 * @return Sending Type
 */
export function execute(request, sendResponse) {
    tabId = request.tabId;
    const type = request.type;
    const component = request.component;

    /**
     * Login process on chrome extension. `update cookie`.
     */
    // if (component === COMPONENT_CONTENT && type === TYPE_SIGN_IN_SUCCESS) {
    //     const authInfo = request.res;
    //     updateCookie(authInfo["uid"], authInfo["public_id"], authInfo["id_token"], authInfo["refresh_token"]);
    //     chrome.tabs.sendMessage(tabId, {tabId: tabId, component: COMPONENT_BACKGROUND, type: TYPE_MENU_FRAME});
    //     return TYPE_MENU_FRAME;
    // }

    /**
     * Not login `user frame`.
     */
    // if (!isLogin()) {
    //     chrome.tabs.sendMessage(tabId, {tabId: tabId, component: COMPONENT_BACKGROUND, type: TYPE_USER_FRAME});
    //     return TYPE_USER_FRAME;
    // }

    /**
     * Require login. `menu frame`.
     */
    if (component === COMPONENT_POPUP && type === TYPE_POPUP) {
        chrome.tabs.sendMessage(tabId, {tabId: tabId, component: COMPONENT_BACKGROUND, type: TYPE_MENU_FRAME});
        return TYPE_MENU_FRAME;
    }

    /**
     * Require login. `start recording`.
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
     * Require login. `stop recording`.
     */
    if (component === COMPONENT_CONTENT && type === TYPE_STOP_RECORDING) {
        if (request.recordType === 2) {
            videoId = generateUuid();
            convertUrlToBlob(request.url).then(result => {
                blob = result;
                postVideo(authId, pId);
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
     * Require login. `force stop recording`.
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

    /**
     * Require login. `get notification`.
     */
    if (component === COMPONENT_CONTENT && type === TYPE_REQ_NOTIFICATION) {
        getNotifications(sendResponse);
        return TYPE_REQ_NOTIFICATION;
    }
}

/**
 * Start recording.
 *
 * @param audioStream AudioStream or null
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
        postVideo(authId, pId);

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
 *
 * @return Option Object
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

/**
 * Subscribe uppy cookie.
 *
 * @return {Promise<>} Get cookie
 */
export function subscribeCookie() {
    chrome.cookies.get({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_UID,
    }, callback => {
        if (callback !== null) {
            uId = callback.value;
        } else {
            uId = null;
        }
    });

    chrome.cookies.get({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_PID,
    }, callback => {
        if (callback !== null) {
            pId = callback.value;
        } else {
            pId = null;
        }
        console.log(pId);
    });

    chrome.cookies.get({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_AUTH_ID,
    }, callback => {
        if (callback !== null) {
            authId = callback.value;
        } else {
            authId = null;
        }
    });

    return new Promise((resolve) => {
        chrome.cookies.get({
            url: 'https://' + TARGET_HOST,
            name: COOKIE_R_AUTH_ID
        }, callback => {
            if (callback !== null) {
                rAuthId = callback.value;
            } else {
                rAuthId = null;
            }
            resolve(true);
        });
    });
}

/**
 * Update uppy cookie.
 *
 * @param uid UserId
 * @param pid publicId
 * @param idToken IdToken
 * @param rToken RToken
 */
export function updateCookie(uid, pid, idToken, rToken) {
    chrome.cookies.set({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_UID,
        value: uid,
        secure: true,
        domain: '.' + TARGET_HOST,
    });

    chrome.cookies.set({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_PID,
        value: pid,
        secure: true,
        domain: '.' + TARGET_HOST,
    });

    chrome.cookies.set({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_AUTH_ID,
        value: idToken,
        secure: true,
        domain: '.' + TARGET_HOST,
    });

    chrome.cookies.set({
        url: 'https://' + TARGET_HOST,
        name: COOKIE_R_AUTH_ID,
        value: rToken,
        secure: true,
        domain: '.' + TARGET_HOST,
    });
}

/**
 * Refresh token request.
 *
 * @param refreshToken Token
 */
export function postRefreshToken(refreshToken) {
    if (isRefreshCall) {
        return;
    }
    isRefreshCall = true;
    const body = JSON.stringify({refresh_token: refreshToken, grant_type: 'refresh_token'});
    HTTP_REQ.open('POST', `https://${API_HOST}/v1/refresh_token`);
    HTTP_REQ.setRequestHeader('Content-Type', 'application/json')
    HTTP_REQ.send(body);

    HTTP_REQ.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const res = JSON.parse(this.responseText);
            uId = res['uid'];
            pId = res['public_id'];
            authId = res['id_token'];
            rAuthId = res['refresh_token'];
            updateCookie(uId, pId, authId, rAuthId);
            isRefreshCall = false;
        }
    }
}

/**
 * Video generate request.
 * Flow is bellow
 * 1. POST   video
 * 2. Upload video
 * 3. PATCH  video
 */
export function postVideo() {
    // Calculate video time
    const recordingTimeSecond = calculateVideoTime(startRecordingTimeMs);

    // Request body
    const body = JSON.stringify({
        id: videoId,
        comment: '',
        name: videoTitle,
        description: '',
        directory: '',
        share_query: '',
        created_at: new Date(),
        updated_at: new Date(),
        video_url: '',
        thumbnail_url: '',
        password: '',
        video_time_second: recordingTimeSecond,
    });
    HTTP_REQ.open('POST', `https://${API_HOST}/v1/users/video`);
    HTTP_REQ.setRequestHeader('Content-Type', 'application/json')
    HTTP_REQ.setRequestHeader('Authorization', 'Bearer ' + authId)
    HTTP_REQ.send(body);

    HTTP_REQ.onreadystatechange = function () {
        if (this.status === 500 || this.status === 403) {
            initializeRecordVal();
        }

        if (this.readyState === 4 && this.status === 201) {
            moveVideoDetail();
            uploadVideo()
        }
    }
}

/**
 * Patch video request.
 *
 * @param videoUrl VideoUrl of Storage
 * @param thumbnailUrl thumbnailUrl of Storage
 */
export function patchVideo(videoUrl, thumbnailUrl) {
    const body = JSON.stringify({
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
    });
    HTTP_REQ.open('PATCH', `https://${API_HOST}/v1/users/video/${videoId}`);
    HTTP_REQ.setRequestHeader('Content-Type', 'application/json')
    HTTP_REQ.setRequestHeader('Authorization', 'Bearer ' + authId)
    HTTP_REQ.send(body);

    HTTP_REQ.onreadystatechange = function () {
        if (this.status === 500 || this.status === 403) {
            initializeRecordVal();
        }

        if (this.readyState === 4 && this.status === 200) {
            initializeRecordVal(true);
        }
    }
}

/**
 * Upload video request.
 */
export function uploadVideo() {
    HTTP_REQ.open('POST', generateVideoUrl());
    HTTP_REQ.setRequestHeader('Content-Type', 'video/webm')
    HTTP_REQ.setRequestHeader('Authorization', 'Firebase ' + authId)
    HTTP_REQ.send(blob);

    HTTP_REQ.onreadystatechange = function () {
        if (this.status === 500 || this.status === 403) {
            initializeRecordVal();
        }

        if (this.readyState === 4 && this.status === 200) {
            const res = JSON.parse(this.responseText);
            const objectPath = res['name'].replace(new RegExp('/', 'g'), '%2F');
            const videoUrl = `https://${STORAGE_HOST}/v0/b/${BUCKET_NAME}/o/${objectPath}?alt=media&token=${res['downloadTokens']}`;
            const thumbUrl = `https://${STORAGE_HOST}/v0/b/${BUCKET_NAME}/o/${objectPath}_img?alt=media&token=${res['downloadTokens']}`;
            patchVideo(videoUrl, thumbUrl);
        }
    }
}

/**
 * Get notifications.
 */
export function getNotifications(sendResponse) {
    HTTP_REQ.open('GET', `https://${API_HOST}/v1/users/notification`);
    HTTP_REQ.setRequestHeader('Authorization', 'Bearer ' + authId)
    HTTP_REQ.send();

    HTTP_REQ.onreadystatechange = function () {
        if (this.status === 500 || this.status === 403 || this.status === 401) {
            initializeRecordVal();
        }

        if (this.readyState === 4 && this.status === 200) {
            const res = JSON.parse(this.responseText)
            // Send content script
            sendResponse({
                component: COMPONENT_BACKGROUND,
                type: TYPE_RES_NOTIFICATION,
                body: res
            })
        }
    }
}

/**
 * Move video detail.
 */
export function moveVideoDetail() {
    chrome.tabs.create({url: `https://${TARGET_HOST}/users/video/${videoId}`}, function (tab) {
        setTimeout(function () {
            // Send message to app.uppy.jp. Not recording site.
            chrome.tabs.sendMessage(tab.id, {
                tabId: tab.id,
                component: COMPONENT_BACKGROUND,
                type: TYPE_SAVE_INDEXED_DB,
                blobUrl: window.URL.createObjectURL(blob),
                videoId: videoId,
            });
        }, OPEN_UI_SLEEP_MS);
    });
}

/**
 * Initialize recoding variable.
 */
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
