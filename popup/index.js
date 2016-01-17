function randomString(length, charset) {
  length = length || 12;
  charset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var rStr = [];
  for (var i = 0; i < length; i++) {
    rStr.push(charset[Math.floor(Math.random() * charset.length)]);
  }
  return rStr.join('');
}

function getAllTabsForCurr(cb) {
  var arr = [];
  chrome.tabs.query({
    currentWindow: true
  }, function(data) {
    cb(data);
  });
}

console.log(randomString(12));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
