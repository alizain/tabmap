const STORAGE_TYPE = 'local';

export function set(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage[STORAGE_TYPE].set({ [key]: value }, () => {
      if (chrome.runtime.lastError === undefined) {
        resolve();
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage[STORAGE_TYPE].get(key, (data) => {
      if (chrome.runtime.lastError === undefined) {
        resolve(data);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    chrome.storage[STORAGE_TYPE].get(null, (data) => {
      if (chrome.runtime.lastError === undefined) {
        resolve(data);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export function remove(key) {
  return new Promise((resolve, reject) => {
    chrome.storage[STORAGE_TYPE].remove(key, () => {
      if (chrome.runtime.lastError === undefined) {
        resolve();
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export function onChange(func) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === STORAGE_TYPE) {
      func(changes);
    }
  });
}

export default {
  set,
  get,
  getAll,
  remove,
  onChange
};
