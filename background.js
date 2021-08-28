let cmid;
let url;

let decodeB64toURL = function(b64) {
    url = b64;
    for (let i = 0; i < 10; ++i) {
        try {
            url = atob(url);
        }
        catch (e) {
            return;
        }
    }
}

let openDecodedURL = function(word) {
    chrome.tabs.create({url: url});
}

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.request === "updateContextMenu") {
            if (msg.selection == '') {
                if (cmid != null) {
                    chrome.contextMenus.remove(cmid);
                    cmid = null;
                }
            }
            else {
                decodeB64toURL(msg.selection);
                let options = {
                    title: "Open " + url,
                    contexts: ["selection"],
                    onclick: openDecodedURL
                };
                if (cmid != null) {
                    chrome.contextMenus.update(cmid, options);
                }
                else {
                    cmid = chrome.contextMenus.create(options);
                }
            }
        }
    }
);