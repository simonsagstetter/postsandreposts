'use strict';

jest.mock('../api/storage');
jest.mock('../api/window');

import { experiments } from 'webpack';
import FeedList from './feedList'
import EventEmitter from 'eventemitter3'

describe('FeedList', () => {
  let containerElement, feedListElement, hideType, feedList;
  beforeEach(() => {
    containerElement = document.createElement('div');
    feedListElement = document.createElement('div');
    feedListElement.classList.add('lazyLoadingList__list');
    hideType = 'repost';
    feedList = new FeedList(containerElement, feedListElement, hideType);
  });

  function violateConfigurable(object, property) {
    delete object[property];
  }

  function violateWriteable(object, property) {
    object[property] = null;
  }

  test('it should initialize', () => {
    expect(feedList.containerElement).not.toBeNull();
    expect(feedList.feedListElement).not.toBeNull();
    expect(feedList.hideType).not.toBeNull();
    expect(feedList.hideType).toBe('repost');
    expect(feedList.feedElements).not.toBeNull();
    expect(feedList.feedElements).toEqual([]);
    expect(feedList.events).not.toBeNull();
    expect(feedList.events instanceof EventEmitter).toBeTruthy();
  });

  test('some properties should be writeable/configurable', () => {
    expect(() => violateConfigurable(feedList, 'containerElement')).toThrow(
      TypeError
    );
    expect(() => violateConfigurable(feedList, 'feedListElement')).toThrow(
      TypeError
    );
    expect(() => violateConfigurable(feedList, 'hideType')).toThrow(TypeError);
    expect(() => violateConfigurable(feedList, 'feedElements')).toThrow(
      TypeError
    );
    expect(() => violateWriteable(feedList, 'containerElement')).toThrow(
      TypeError
    );
    expect(() => violateWriteable(feedList, 'feedListElement')).toThrow(
      TypeError
    );
    expect(() => violateWriteable(feedList, 'feedElements')).toThrow(TypeError);
  });

  describe('FeedList.init', () => {
    let liElement, spanElement, contextElement;
    beforeEach(() => {
      liElement = document.createElement('li');
      liElement.classList.add('soundList__item');
      spanElement = document.createElement('span');
      spanElement.classList.add('relativeTime');
      liElement.appendChild(spanElement);
    });

    describe('FeedList.init type post', () => {
      beforeEach(() => {
        feedList.feedListElement.appendChild(liElement);
        feedList.init();
      });

      test('feedListElement should receive padding styles', () => {
        expect(feedList.feedListElement.style.padding).toBe('0px 1rem');
      });

      test('feedElements array should contain new li element type post', () => {
        const element = {
          type: 'post',
          element: liElement,
        };
        expect(feedList.feedElements).toStrictEqual([element]);
      });

      test('relativeTime element should have new color', () => {
        const relativeTime =
          feedList.feedElements[0].element.querySelector('.relativeTime');
        expect(relativeTime.style.color).toBe('rgb(255, 85, 0)');
      });

      test('feedElement should be visible', () => {
        const feedElement = feedList.feedElements[0].element;
        expect(feedElement.style.display).toBe('');
      });
    });

    describe('FeedList.init type repost', () => {
      beforeEach(() => {
        contextElement = document.createElement('div');
        contextElement.classList.add('soundContext__repost');
        liElement.appendChild(contextElement);
        feedList.feedListElement.appendChild(liElement);
        feedList.init();
      });

      test('feedElements array should contain new li element type post', () => {
        const element = {
          type: 'repost',
          element: liElement,
        };
        expect(feedList.feedElements).toStrictEqual([element]);
      });

      test('relativeTime element should have new color', () => {
        const relativeTime =
          feedList.feedElements[0].element.querySelector('.relativeTime');
        expect(relativeTime.style.color).toBe('rgb(255, 85, 0)');
      });

      test('feedElement should not be visible', () => {
        const feedElement = feedList.feedElements[0].element;
        expect(feedElement.style.display).toBe('none');
      });
    });
  });

  describe('FeedList.changeHideType', () => {
    let liElement, spanElement, srcElement;
    beforeEach(() => {
      liElement = document.createElement('li');
      liElement.classList.add('soundList__item');
      spanElement = document.createElement('span');
      spanElement.classList.add('relativeTime');
      liElement.appendChild(spanElement);
      feedList.feedListElement.appendChild(liElement);
      srcElement = document.createElement('li');
      feedList.init();
    });

    test('hide type property should be post, li element should be hidden', async () => {
      feedList.hideType = '';
      srcElement.id = 'toggleReposts';
      await feedList.changeHideType(srcElement);
      expect(feedList.hideType).toBe('post');
      expect(feedList.feedElements[0].element.style.display).toEqual('none');
    });

    test('hide type property should be repost, li element should be visble', async () => {
      feedList.hideType = '';
      srcElement.id = 'togglePosts';
      await feedList.changeHideType(srcElement);
      expect(feedList.hideType).toBe('repost');
      expect(feedList.feedElements[0].element.style.display).toEqual('');
    });
  });

  describe('FeedList.observerFeedList', () => {
    let liElement, spanElement;
    beforeEach(() => {
      liElement = document.createElement('li');
      liElement.classList.add('soundList__item');
      spanElement = document.createElement('span');
      spanElement.classList.add('relativeTime');
      liElement.appendChild(spanElement);
      feedList.feedListElement.appendChild(liElement);
      feedList.init();
      let observeLiElement = liElement.cloneNode(true);
      feedList.feedListElement.appendChild(observeLiElement);
    });

    test('should observe li element after initilization', () => {
      expect(feedList.feedElements.length).toBe(2);
    });
  });
});
