# Beuron.js

Binary neuron. A logic port that learns the most probable logical function from samples. Capable of online learning and handling noisy data.


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

## API Documentation

### Beuron.create(memorySize?)

    > var b = Beuron.create();
    > var c = Beuron.create(6);

The memorySize is optional positive number that defines how quickly old samples will be forgotten when new ones are learnt. Set to zero to force solve() results to be based on all the learnt samples. Default is zero.

### b.learn(sample, result)

    > b.learn([0, 1], 1);

Sample is an array with length of _two_. The elements of the array and also the result must be 0 or 1.

Does not return anything.

### b.solve(sample)

    > b.solve([0, 1]);
    1

Takes in a sample array similar to __b.learn()__. Returns the most probable result, 0 or 1.

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
