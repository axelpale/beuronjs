# Beuron.js<sup>v0.2.1</sup>

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
    undefined

Sample is an array with length of _two_. The elements of the array and also the result must be 0 or 1.

Does not return anything (undefined).

### b.solve(sample)

    > b.solve([0, 1]);
    1

Takes in a sample array similar to __b.learn()__. Returns the most probable result, 0 or 1.

### b.save()

    > b.save();
    [3.2, 1.2, 0, 18, 2.9, 1.6, 0, 2.1, 29]

Exports the state of beuron for example to be stored in database. See b.load().

### b.load(savedArray)

    > b.load(previouslySavedArray);
    undefined

Resets beuron back to the saved state. See b.save().

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
