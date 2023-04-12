const TYPE_POPUP = 'start_popup';
const COMPONENT_POPUP = 'popup';

/**
 * Call with close popup.
 */
chrome.tabs.query({currentWindow: true, active: true}, tab => {
    if (isForbiddenPage(tab[0].url)) {
        insertCannotRecord();
    } else {
        const activeTabId = tab[0].id;
        // if (chrome.extension.getBackgroundPage().isRecording) {
        //     window.close();
        //     return;
        // }
        // Request menu
        chrome.runtime.sendMessage({
            tabId: activeTabId,
            component: COMPONENT_POPUP,
            type: TYPE_POPUP
        }).then((response) => {
        }).catch((error) => {});
    }
});

setTimeout(
    function call() {
        window.close();
    }, 300
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
            <h2 class="warning-txt">Could not record video on thi page</h2>
            <p>
            Please change page 
            <br>
            <a href="https://example.com" rel="noopener" target="_blank">
                https://example.com
            </a> 
            <br>
            </p>           
         </div>`;

    const loading = document.getElementById('loading');
    document.body.insertBefore(data, loading);
    loading.style.display = 'none';
}
