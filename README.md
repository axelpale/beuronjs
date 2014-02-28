# Beuron.js<sup>v1.1.0</sup>

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

## API

### Beuron.create(sizeLimit?)

    > var b = Beuron.create();
    > var c = Beuron.create(6);

The sizeLimit is an optional positive number that defines how quickly old samples will be forgotten when new ones are learned. Set to zero to force solve() results to be based on all the learned samples. Set to 2 to base results on approximately two previous samples for each four different sample types. Default is zero.

### b.learn(sample, result)

    > b.learn([0, 1], 1);
    undefined

Sample is an array with length of __two__. The elements of the array and also the result must be 0 or 1.

Does not return anything (undefined).

### b.solve(sample)

    > b.solve([0, 1]);
    1

Takes in a sample array similar to _b.learn()_. Returns the most probable result, 0 or 1. If equally probable or no data, returns 0.

### b.save()

    > b.save();
    [3.2, 1.2, 0, 18, 2.9, 1.6, 0, 2.1, 29]

Exports the state of beuron for example to be stored in database. See b.load().

### b.load(savedArray)

    > b.load(previouslySavedArray);
    undefined

Resets beuron back to the saved state. See b.save().

### b.setSizeLimit(newSizeLimit)

    > b.setSizeLimit(4);
    undefined

See Beuron.create().

## Customize Beuron

Customize Beuron by:

    Beuron.extension.myFunction = function (...) {...};

After that you can:

    var b = Beuron.create();
    b.myFunction();

## Under the hood

Beuron learns a logical 2-to-1 function from a set of samples and is able
to adapt quickly if the function changes.

There is four pairs of buckets. Each possible input has its own pair.
In a pair the first bucket collects the number of zero outputs and the second
collects ones accordingly.

     0,0    0,1    1,0   1,1     Input vector (bucket pair)
       _    _            _ _
     _| |  | |          | | |
    | | |  | |_    _    | | |    Likelihood distribution of outputs (buckets)
    | | |  | | |  | |   | | |
    |_|_|  |_|_|  |_|_  |_|_|
     0 1    0 1    0 1   0 1     Output (bucket labels)

When a input need to be solved, an associated pair is taken under
examination. If the bucket of zeros weights more than the bucket of ones,
the result is zero. Also when the weights are equal the result is zero.
If the bucket of ones weights more, the result is one.

Beuron can adapt to change by forgetting. If the buckets were infinite,
the result would simply be the most frequent one. In another words the result
would be based on all the learned data. What if the logical function changes?
To learn the new function, infinite beuron would need at least same amount of
learning samples as it has already learned. To avoid that the bucket pairs can
have a size limit.

A bucket pair with a size limit decreases the effect of previous samples as
news are learned. Smaller the limit, larger the effect of new samples.
In practice, before new sample is added to a bucket, beuron makes sure that
there is enough space in the pair of the bucket. If the space would be
exceeded both buckets are multiplied with number < 1 so that there is room
for one sample. As an outcome the effect of previous samples is reduced.

For example lets take a bucket pair (0,0) and let the first bucket be B0 and
the second B1. The limit for the pair is 2. Lets assume B0 equals to 2 and
B1 to 0. The sum B0 + B1 equals to 2 so the limit is not exceeded.
Now a new sample (0,0) -> 1 is added so it matches with B1. If B1 was
increased by one the sum would exceed the limit so before the increase 
the pair is multiplied by 0.5. B0 becomes to 1 and B1 stays at 0. Now B1
is increased to 1. As a result B0 and B1 are equal, meaning that 0 and 1 are
equally likely to be the outcome. It's decided that in this case output will
default to 0. After second similar sample B0 decreases to 0.5 and B1 increases
to 1.5.

     _
    | |     Initial state, size limit 2
    |_|_      b.solve([0,0]) === 0
    B0 B1
    
     _ _    State after first (0,0) -> 1
    |_|_|     b.solve([0,0]) === 0
    B0 B1
       
      |-|   State after second (0,0) -> 1
    |-|_|     b.solve([0,0]) === 1
    B0 B1

## History

The development of Beuron started in 2013 as an experiment about fundamentals of machine learning.

## License

[MIT License](../blob/master/LICENSE)
