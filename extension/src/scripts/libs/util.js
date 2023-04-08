/**
 * Generate uuid.
 *
 * @return {string}
 */
export function generateUuid() {
    let chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case 'x':
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case 'y':
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join('');
}

/**
 * Login check.
 *
 * @return {boolean}
 */
export function isLogin() {
    return !(uId === null || pId === null || authId === null || rAuthId === null);
}

/**
 * Generate video url.
 *
 * @return {string}
 */
export function generateVideoUrl() {
    const fileName = generateUuid();
    const objectName = `${pId}/${videoId}/${fileName}`;
    return `https://${STORAGE_HOST}/v0/b/${BUCKET_NAME}/o?name=${objectName}`;
}

/**
 * Convert url to blob.
 *
 * @param url ObjectUrl
 * @return {Promise<Blob>}
 */
export function convertUrlToBlob(url) {
    return fetch(url).then(r => r.blob());
}

/**
 * Calculate video time second.
 */
export function calculateVideoTime(startRecodingTimeMs) {
    const nowTimeMs = new Date().getTime() / 1000;
    return Math.floor(nowTimeMs) - Math.floor(startRecodingTimeMs);
}

/**
 * Check token expired.
 *
 * @return true or false
 */
export function checkTokenExpired() {
    const payloadBase64 = authId.split('.');
    const payloadJson = JSON.parse(atob(payloadBase64[1]));
    const now = new Date();
    // 10 minute ago of expired
    const expDate = new Date((payloadJson['exp'] * 1000) - 600000);
    return expDate.getTime() <= now.getTime();
}

/**
 * Get body tag on any WebSite.
 */
export function getBodyWebSite() {
    const bodys = document.getElementsByTagName('html');
    return bodys.item(0);
}

/**
 * Generate recording frame tag.
 */
export function generateRecordingFrame(srcUrl, ctlLeftPointer, ctlTopPointer,
                                       mouseRangeLeftPointer, mouseRangeTopPointer, isBottom) {

    const container = document.createElement('div');
    container.id = 'uppy_frame';
    container.className = 'uppy-frame';

    const mouseRange = document.createElement('div');
    mouseRange.id = 'uppy_mouse_range';
    mouseRange.className = 'uppy-mouse-range';
    if (mouseRangeLeftPointer !== null) {
        mouseRange.style.left = mouseRangeLeftPointer;
    }
    if (mouseRangeTopPointer !== null && !isBottom) {
        mouseRange.style.top = mouseRangeTopPointer;
    }
    if (mouseRangeTopPointer !== null && isBottom) {
        mouseRange.style.bottom = mouseRangeTopPointer;
    }

    const ctl = document.createElement('div');
    ctl.id = 'uppy_ctl';
    ctl.className = 'uppy-mouse-ctl';
    if (ctlLeftPointer !== null) {
        ctl.style.left = ctlLeftPointer;
    }
    if (ctlTopPointer !== null && !isBottom) {
        ctl.style.top = ctlTopPointer;
    }
    if (ctlTopPointer !== null && isBottom) {
        ctl.style.bottom = mouseRangeTopPointer;
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'uppy_iframe'
    iframe.src = srcUrl
    iframe.allow = 'microphone; camera';
    iframe.className = 'uppy-camera-frame';

    mouseRange.appendChild(ctl);
    mouseRange.appendChild(iframe);
    container.appendChild(mouseRange);
    return container;
}

/**
 * Generate not recording frame tag.
 */
export function generateNotRecordingFrame(srcUrl) {
    const container = document.createElement('div');
    container.id = 'uppy_frame';
    container.className = 'uppy-frame';

    const iframe = document.createElement('iframe');
    iframe.id = 'uppy_iframe'
    iframe.src = srcUrl;
    iframe.allow = 'microphone; camera';
    iframe.className = 'uppy-no-camera-frame';

    container.appendChild(iframe);
    return container;
}

/**
 * Remove uppy tags.
 */
export function removeUppyTags() {
    const uppyFrame = document.getElementById('uppy_frame');
    if (uppyFrame !== null) {
        uppyFrame.remove();
    }
}
