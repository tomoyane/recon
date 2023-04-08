const TYPE_POPUP = 'start_popup';
const COMPONENT_POPUP = 'popup';

/**
 * Call with close popup.
 */
setTimeout(
    function call() {
        chrome.tabs.query({currentWindow: true, active: true}, tab => {
            if (isForbiddenPage(tab[0].url)) {
                insertCannotRecord();
            } else {
                const activeTabId = tab[0].id;
                if (chrome.extension.getBackgroundPage().isRecording) {
                    // TODO: 起動中は拡張で停止も可能にしたい
                    window.close();
                    return;
                }
                // Request menu
                chrome.runtime.sendMessage({
                    tabId: activeTabId,
                    component: COMPONENT_POPUP,
                    type: TYPE_POPUP
                });
                window.close();
            }
        });
    }, 1000
);

/**
 * Check forbidden page.
 *
 * @return {boolean}
 */
function isForbiddenPage(url) {
    return url.indexOf('chrome://') === 0 ||
        url.indexOf('https://chrome.google.com') === 0 ||
        url.indexOf('https://google.com') === 0;
}

/**
 * Insert can not record popup.
 */
function insertCannotRecord() {
    const data = document.createElement('div');
    data.innerHTML =
        `<div class="cannot-record">
            <img class="cannot-record-img" src="cannot_record.png" alt="record"/>
            <h2 class="warning-txt">このページでは動画が撮影できません</h2>
            <p>
            一部のページでは撮影ができません。
            <br>
            <a href="https://app.uppy.jp" rel="noopener" target="_blank">
                https://app.uppy.jp
            </a> など別ページを開き、
            <br>
            再度撮影をお試しください。
            </p>           
         </div>`;

    const loading = document.getElementById('loading');
    document.body.insertBefore(data, loading);

    loading.style.display = 'none';
}
