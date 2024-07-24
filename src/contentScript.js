'use strict';

import FeedList from './controllers/feedList'
import FeedMenu from './controllers/feedMenu'
import { getHideType } from './api/storage'

/**
 * @function containerElement
 * Creates and initializes FeedMenu and FeedList Instance
 * Registers callback functions of clickFeedMenu and addFeedElement
 */
function init() {
  getHideType().then((hideType) => {
    const containerElement = document.querySelector('.stream__list');
    const feedListElement = containerElement.querySelector(
      '.lazyLoadingList__list'
    );

    const feedMenu = new FeedMenu(containerElement);
    feedMenu.init(hideType);

    const feedList = new FeedList(containerElement, feedListElement, hideType);
    
    feedMenu.events.on('clickFeedMenu', (eventData) => {
      feedList.changeHideType(eventData);
    });

    feedList.events.on('addFeedElement', (eventData) => {
      feedMenu.setCount(eventData);
    });

    feedList.init();
  });
}

/**
 * @function runContentScript
 * Observes feed list and waits for waveforms to be inserted into dom
 */
function runContentScript() {
  const soundListElement = document.querySelector('soundList__item');

  if (soundListElement === null) {
    new MutationObserver(function (mutations, me) {
      let loaded = false;
      mutations.forEach((record) => {
        const element = record.target;
        if (element instanceof HTMLElement && element !== null) {
          if (element.classList.contains('waveform')) {
            loaded = true;
          }
        }
      });
      if (loaded) {
        init();
        me.disconnect();
        return;
      }
    }).observe(document.getElementById('app'), {
      childList: true,
      subtree: true,
      characterData: true,
    });
  } else {
    init();
  }
}

/**
 * @event load
 * Listens for page to be loaded on refresh
 */
window.addEventListener('load', (event) => {
  if (window.location.pathname === '/feed') {
    runContentScript();
  }
});

/**
 * @event
 * Listens for url changes
 */
chrome.runtime.onMessage.addListener(function (request) {
  if (request.url === 'https://soundcloud.com/feed') {
    runContentScript();
  }
});
