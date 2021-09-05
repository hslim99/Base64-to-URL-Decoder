let openMenu, copyMenu;
let url;

let decodeB64toURL = function(b64) {
    url = b64;
    let decoded = false;
    for (let i = 0; i < 10; ++i) {
        try {
            url = atob(url);
            decoded = true;
        }
        catch (e) {
            return decoded;
        }
    }
    return decoded;
}

let checkValidURL = function(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?([-a-zA-Z0-9]+\\.)+([-a-zA-Z]{2,}\\/?)');
    return pattern.test(url);
}

let openDecodedURL = function() {
    chrome.tabs.create({url: url});
}

let copyDecodedURL = function() {
    navigator.clipboard.writeText(url);
    textarea.parentNode.removeChild(textarea);
}

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.request === "updateContextMenu") {
            let decoded = decodeB64toURL(msg.selection);
            // manage openMenu
            if (msg.selection == '' || !checkValidURL(url)) {
                if (openMenu != null) {
                    chrome.contextMenus.remove(openMenu);
                    openMenu = null;
                }
            }
            else {
                let options = {
                    title: "Open " + url,
                    onclick: openDecodedURL
                };
                if (openMenu != null) {
                    chrome.contextMenus.update(openMenu, options);
                }
                else {
                    openMenu = chrome.contextMenus.create(options);
                }
            }
            // manage copyMenu
            if (msg.selection == '' || !decoded) {
                if (copyMenu != null) {
                    chrome.contextMenus.remove(copyMenu);
                    copyMenu = null;
                }
            }
            else {
                let options = {
                    title: "Copy " + url,
                    onclick: copyDecodedURL
                };
                if (copyMenu != null) {
                    chrome.contextMenus.update(copyMenu, options);
                }
                else {
                    copyMenu = chrome.contextMenus.create(options);
                }
            }
        }
    }
);
