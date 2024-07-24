'use strict';

import FeedMenu from './feedMenu'
import EventEmitter from 'eventemitter3'
import { Liquid } from 'liquidjs'

describe('FeedMenu', () => {
  let containerElement, feedMenu;

  beforeEach(() => {
    containerElement = document.createElement('div');
    feedMenu = new FeedMenu(containerElement);
  });

  function violateConfigurable(object, property) {
    delete object[property];
  }

  function violateWriteable(object, property) {
    object[property] = null;
  }

  test('it should initialize', () => {
    expect(feedMenu.containerElement).not.toBeNull();
    expect(feedMenu.postClass).not.toBeNull();
    expect(feedMenu.repostClass).not.toBeNull();
    expect(feedMenu.templateEngine).not.toBeNull();
    expect(feedMenu.templateEngine instanceof Liquid).toBeTruthy();
    expect(feedMenu.events).not.toBeNull();
    expect(feedMenu.events instanceof EventEmitter).toBeTruthy();
  });

  test('some properties should be writeable/configurable', () => {
    expect(() => violateConfigurable(feedMenu, 'containerElement')).toThrow(
      TypeError
    );
    expect(() => violateConfigurable(feedMenu, 'postClass')).toThrow(TypeError);
    expect(() => violateConfigurable(feedMenu, 'repostClass')).toThrow(
      TypeError
    );
    expect(() => violateConfigurable(feedMenu, 'templateEngine')).toThrow(
      TypeError
    );
    expect(() => violateWriteable(feedMenu, 'containerElement')).toThrow(
      TypeError
    );
  });

  describe('FeedMenu.init', () => {
    test('containerElemenet should have tabbar template dom', () => {
      feedMenu.init('repost');
      expect(containerElement.children.length).toBeGreaterThan(0);
      expect(containerElement.querySelector('#togglePosts')).not.toBeNull();
      expect(containerElement.querySelector('#toggleReposts')).not.toBeNull();
    });

    describe('hideType repost', () => {
      let postLiElement, repostLiElement;
      beforeEach(() => {
        feedMenu.init('repost');
        postLiElement = containerElement.querySelector('#togglePosts');
        repostLiElement = containerElement.querySelector('#toggleReposts');
      });

      test('post li element should have active class, repost li element not', () => {
        expect(postLiElement.classList.contains('sce-tab-active')).toBeTruthy();
        expect(
          repostLiElement.classList.contains('sce-tab-active')
        ).toBeFalsy();
      });

      test('active classes should have switched after repost li element was clicked', () => {
        repostLiElement.click();
        expect(postLiElement.classList.contains('sce-tab-active')).toBeFalsy();
        expect(
          repostLiElement.classList.contains('sce-tab-active')
        ).toBeTruthy();
      });
    });

    describe('hideType post', () => {
      let postLiElement, repostLiElement;
      beforeEach(() => {
        feedMenu.init('post');
        postLiElement = containerElement.querySelector('#togglePosts');
        repostLiElement = containerElement.querySelector('#toggleReposts');
      });

      test('repost li element should have active class, post li element not', () => {
        expect(postLiElement.classList.contains('sce-tab-active')).toBeFalsy();
        expect(
          repostLiElement.classList.contains('sce-tab-active')
        ).toBeTruthy();
      });

      test('active classes should have switched after post li element was clicked', () => {
        postLiElement.click();
        expect(postLiElement.classList.contains('sce-tab-active')).toBeTruthy();
        expect(
          repostLiElement.classList.contains('sce-tab-active')
        ).toBeFalsy();
      });
    });
  });

  describe('FeedMenu.setCount', () => {
    let liElement, feedElements;
    beforeEach(() => {
      feedMenu.init('repost');
      liElement = document.createElement('li');
      liElement.classList.add('soundList__item');
      feedElements = [
        {
          type: 'post',
          element: liElement,
        },
      ];
    });

    test('span elements should receive the correct total count', () => {
      feedMenu.setCount(feedElements);
      const posts = containerElement.querySelector("[data-set='posts']");
      const reposts = containerElement.querySelector("[data-set='reposts']");
      expect(posts).not.toBeNull();
      expect(reposts).not.toBeNull();
      expect(posts.textContent).toBe('1');
      expect(reposts.textContent).toBe('0');
    });
  });
});
