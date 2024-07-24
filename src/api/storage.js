'use strict';

/**
 * Gets the current hideType
 * @returns {Promise}
 */
export const getHideType = async () => {
  return await chrome.storage.local
    .get(['hideType'])
    .then((data) => data['hideType'])
    .catch((error) => {
      console.log(error);
      return error
    });
};

/**
 * Sets the current hideType
 * @param {string} hideType
 * @returns {Promise}
 */
export const setHideType = async (hideType) => {
  return await chrome.storage.local.set({ hideType: hideType }).catch((error) => {
    console.log(error);
    return error
  });
};
