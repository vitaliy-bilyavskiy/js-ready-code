function deepForEach(obj, callback, path = '') {
  Object.entries(obj)
    .forEach(
      ([key, value]) => {
        if (typeof value === 'object') {
          deepForEach(value, callback, [path, key].filter(Boolean).join('.'));
        } else {
          callback([path, key].filter(Boolean).join('.'), value);
        }
      },
    );
}
let result = '';
deepForEach(obj, (key, value) => {
  result += `${key}\t${value}\n`;
});
console.log(result);
