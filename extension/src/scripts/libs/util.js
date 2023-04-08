/**
 * Generate uuid.
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
 * Convert url to blob.
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
    container.id = 'recon_frame';
    container.className = 'recon-frame';

    const mouseRange = document.createElement('div');
    mouseRange.id = 'recon_mouse_range';
    mouseRange.className = 'recon-mouse-range';
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
    ctl.id = 'recon_ctl';
    ctl.className = 'recon-mouse-ctl';
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
    iframe.id = 'recon_iframe'
    iframe.src = srcUrl
    iframe.allow = 'microphone; camera';
    iframe.className = 'recon-camera-frame';

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
    container.id = 'recon_frame';
    container.className = 'recon-frame';

    const iframe = document.createElement('iframe');
    iframe.id = 'recon_iframe'
    iframe.src = srcUrl;
    iframe.allow = 'microphone; camera';
    iframe.className = 'recon-no-camera-frame';

    container.appendChild(iframe);
    return container;
}

/**
 * Remove tags.
 */
export function removeReconTags() {
    const reconFrame = document.getElementById('recon_frame');
    if (reconFrame !== null) {
        reconFrame.remove();
    }
}
