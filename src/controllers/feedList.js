'use strict';

import EventEmitter from 'eventemitter3';
import { setHideType } from '../api/storage';
import { scrollTo } from '../api/window';

/**
 * @class FeedList
 */
export default class FeedList {
  
  /**
   * @constructor
   * @param {HTMLDivElement} containerElement 
   * @param {HTMLDivElement} feedListElement 
   * @param {string} hideType  /**
   */
  constructor(containerElement, feedListElement, hideType) {
    Object.defineProperties(this, {
      containerElement: {
        value: containerElement,
      },
      feedListElement: {
        value: feedListElement,
      },
      hideType: {
        value: hideType,
        writable: true,
      },
      feedElements: {
        value: [],
      },
    });
    this.events = new EventEmitter();
    this.setVisibility = this.setVisibility.bind(this)
    this.addFeedElement = this.addFeedElement.bind(this)
  }

  /**
   * @method
   * Sets padding of feedList
   * Adds feed elements which were insert into dom before mutation observer was running
   * Runs mutation observer
   */
  init() {
    this.setCss();
    this.addFeedElements(this.feedListElement.children);
    this.observeFeedList();
  }
  /**
   * @method
   * Sets padding of feed list element
   */
  setCss() {
    this.feedListElement.style.padding = '0 1rem';
  }
  /**
   * @method
   * @param {HTMLLIElement} srcElement
   * Receives Li Element from Event and toggles view type between posts and reposts
   */
  changeHideType(srcElement) {
    this.hideType = (srcElement.id === 'toggleReposts') ? 'post' : 'repost'
    setHideType(this.hideType).then(() => {
      this.toggleVisibility();
      scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    });
  }
  /**
   * @method
   * Sets visibility of all elements in feedElements
   */
  toggleVisibility() {
    this.feedElements.forEach(this.setVisibility)
  }
  /**
   * @method
   * @param {object} feedElement
   * Sets css property display
   */
  setVisibility(feedElement) {
    feedElement.element.style.display = (this.hideType === feedElement.type) ? 'none' : ''
  }
  /**
   * @method
   * @param {Array} feedElements Array of NodeElements
   * Adds feed elements which were inserted into dom before mutation observer was running
   * Sets their visibility
   * Emits addFeedElement Event which will update total counter
   */
  addFeedElements(feedElements) {
    [...feedElements]
    .map(this.addFeedElement)
    .map(this.setVisibility)
  }
  /**
   * @method
   * @param {HTMLLIElement} feedElement
   * Determines feedElement type
   * Adds feedElement to feedElements array
   * @returns {object} Instance of feedElement
   */
  addFeedElement(element) {
    const feedElement = {
      type: (element.querySelector('.soundContext__repost') !== null) ? 'repost' : 'post',
      element: element,
    };
    feedElement.element.querySelector('.relativeTime').style.color = '#f50';
    this.feedElements.push(feedElement);
    this.events.emit('addFeedElement', this.feedElements);
    return feedElement;
  }
  /**
   * @method
   * Runs a new mutation observer which listens to feedListElement
   * and adds new feedElement to feedElements.
   * Sets visibility
   * Emits event for total counter
   */
  observeFeedList() {
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target;
        if (target.classList.contains('lazyLoadingList__list')) {
          const element = mutation.previousSibling;
          const feedElement = this.addFeedElement(element);
          this.setVisibility(feedElement);
        }
      }
    }).observe(this.feedListElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}
