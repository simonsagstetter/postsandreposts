'use strict';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url.match('https://soundcloud.com/feed')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          url: changeInfo.url,
        });
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ hideType: 'repost' }, function () {
    console.log('Storage initiated.');
  });
});
