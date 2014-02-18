# Beuron.js

Binary neuron. A logic port that learns the logical function from examples.


## Basic example

    > var b = Beuron.create();
    > b.learn([1, 1], 0);
    > b.learn([0, 1], 0);
    > b.learn([1, 0], 0);
    > b.learn([0, 0], 1);
    > b.solve([1, 0]);
    0
    > b.solve([0, 0]);
    1

## Customize Beuron

Customize Beuron by:

    Beuron.extension.myFunction = function (...) {...};

After that you can:

    var b = Beuron.create();
    b.myFunction();

## History

The development of Beuron started in 2013 as an experiment about fundamentals of machine learning.

## License

[MIT License](../blob/master/LICENSE)
