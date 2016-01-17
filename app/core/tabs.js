export function capture() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      currentWindow: true
    }, (result) => {
      if (Array.isArray(result)) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

export function open(urls) {
  return new Promise((resolve, reject) => {
    chrome.windows.create({
      url: urls
    }, (window) => {
      resolve(window);
    });
  });
}

export default {
  open,
  capture
};
