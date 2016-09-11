module.exports = function(callback) {
  var oldWrite = process.stdout.write;

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(process.stdout, arguments);
      callback(string, encoding, fd);
    };
  })(process.stdout.write);

  return function() {
    process.stdout.write = oldWrite;
  };
};
