  
  // Modules
  if(typeof module === 'object' && typeof module.exports === 'object') {
    // Common JS
    // http://wiki.commonjs.org/wiki/Modules/1.1
    module.exports = Beuron;
  } else {
    // Browsers
    window.Beuron = Beuron;
  }
})(this);
