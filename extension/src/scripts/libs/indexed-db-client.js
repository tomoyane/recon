let dbClient = null;

/**
 * Save blob data in IndexedDb.
 *
 * @param blob
 * @param videoId
 */
export function saveIndexedDb(blob, videoId) {
    const req = window.indexedDB.open('uppy_db', DB_VERSION);
    req.onerror = function () {
    };

    req.onsuccess = function () {
        dbClient = req.result;
        addData(blob, videoId)
    };

    req.onupgradeneeded = function (e) {
        let db = e.target.result;
        db.createObjectStore('videos', {autoIncrement: true});
    };
}

/**
 * Add
 *
 * @param blob
 * @param videoId
 */
export function addData(blob, videoId) {
    if (dbClient === null) {
        return;
    }

    let transaction = dbClient.transaction(['videos'], 'readwrite');
    let objectStore = transaction.objectStore('videos');

    const request = objectStore.add({video_id: videoId, blob: blob});
    request.onsuccess = function () {
        console.log('Success add blob');
    };

    transaction.oncomplete = function () {
        console.log('Complete add blob');
    };

    transaction.onerror = function () {
    };
}
