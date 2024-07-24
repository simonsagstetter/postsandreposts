'use strict';

import EventEmitter from 'eventemitter3';
import { Liquid } from 'liquidjs';

/**
 * @class FeedMenu
 */
export default class FeedMenu {
  /**
  * @constructor
  * @param {HTMLDivElement} containerElement
  */
  constructor(containerElement) {
    Object.defineProperties(this, {
      containerElement: {
        value: containerElement,
      },
      postClass: {
        value: '',
        writable: true,
      },
      repostClass: {
        value: '',
        writable: true,
      },
      templateEngine: {
        value: new Liquid(),
        writable: true,
      },
    });
    this.events = new EventEmitter();
    this.getTabBar = this.getTabBar.bind(this)
  }
  /**
   * @method
   * @param {string} hideType
   * Inserts feed menu html from ejs file and registers events
   * Sets tab active class based on active hide type
   */
  init(hideType) {
    hideType === 'post'
      ? (this.repostClass = 'sce-tab-active')
      : (this.postClass = 'sce-tab-active');
    this.containerElement.insertAdjacentHTML('afterbegin', this.getTabBar({
      postClass: this.postClass,
      repostClass: this.repostClass,
    }));
    this.registerEvents();
  }
  /**
   * @method
   * @param {object} data
   * @returns {HTMLDivElement}
   * Renders data object into html string and returns html
   */
  getTabBar(data) {
    return this.templateEngine.parseAndRenderSync(
      `<div class="sce-tab-bar-container">
            <div class="sce-tab-bar">
                <ul class="sce-tabs">
                    <li id="togglePosts" class="sce-tab {{ postClass }}">Posts <span data-set="posts">0</span></li>
                    <li id="toggleReposts" class="sce-tab {{ repostClass }}">Reposts <span data-set="reposts">0</span></li>
                </ul>
            </div>
        </div>`,
      data
    );
  }
  /**
   * @method
   * Registers event listeners for the feed menu elements
   */
  registerEvents() {
    const postLiElement = this.containerElement.querySelector('#togglePosts');
    const repostLiElement = this.containerElement.querySelector('#toggleReposts');
    postLiElement.addEventListener('click', (event) => {
      this.toggleActiveClass(postLiElement,repostLiElement)
      this.events.emit('clickFeedMenu', event.target);
    });
    repostLiElement.addEventListener('click', (event) => {
      this.toggleActiveClass(postLiElement,repostLiElement)
      this.events.emit('clickFeedMenu', event.target);
    });
  }
  /**
   * @method
   * @param {HTMLLIElement} postLiElement 
   * @param {HTMLLIElement} repostLiElement 
   * toggles css sce-tab-active class on click event
   */
  toggleActiveClass(postLiElement, repostLiElement){
    postLiElement.classList.toggle('sce-tab-active');
    repostLiElement.classList.toggle('sce-tab-active');
  }
  /**
   * @method
   * @param {Array} feedElements
   * Updates the total reposts and post elements
   */
  setCount(feedElements) {
    const posts = this.containerElement.querySelector("[data-set='posts']");
    const reposts = this.containerElement.querySelector("[data-set='reposts']");
    posts.textContent = feedElements.filter(
      ({type}) => type === 'post'
    )?.length;
    reposts.textContent = feedElements.filter(
      ({type}) => type === 'repost'
    )?.length;
  }
}
