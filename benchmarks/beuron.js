var Beuron = require('../beuron');

module.exports = {
  name: 'Beuron',
  tests: {
    'XOR Learn 4, Solve 4, Mem Inf': function () {
      var b = Beuron.create();
      b.learn([1, 1], 0);
      b.learn([0, 1], 1);
      b.learn([1, 0], 1);
      b.learn([0, 0], 0);
      b.solve([1, 1]);
      b.solve([0, 1]);
      b.solve([1, 0]);
      b.solve([0, 0]);
    },
    'XOR Learn 4, Solve 4, Mem 2': function () {
      var b = Beuron.create(2);
      b.learn([1, 1], 0);
      b.learn([0, 1], 1);
      b.learn([1, 0], 1);
      b.learn([0, 0], 0);
      b.solve([1, 1]);
      b.solve([0, 1]);
      b.solve([1, 0]);
      b.solve([0, 0]);
    },
    'XOR Learn 10, Solve 4, Mem 4': function () {
      var b = Beuron.create(4);
      b.learn([1, 1], 0);
      b.learn([0, 1], 1);
      b.learn([1, 0], 1);
      b.learn([0, 0], 0);
      b.learn([1, 1], 0);
      b.learn([0, 1], 1);
      b.learn([1, 1], 1); // noise
      b.learn([0, 0], 0);
      b.learn([0, 0], 1); // noise
      b.solve([1, 1]);
      b.solve([0, 1]);
      b.solve([1, 0]);
      b.solve([0, 0]);
    }
  }
};