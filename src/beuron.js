/*
Beuron

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

*/

var Beuron = (function () {
  var exports = {};
  /////////////////
  


  var Beu;

  // Max integer of JavaScript is 2^53. In the worst case
  // we need to sum two integers. Max size limit
  // comes then to 2^52. Add some margin: 2^50;
  var maxSizeLimit = Math.pow(2,50);


  
  // Constructor
  
  Beu = function (sizeLimit) {
    // Create new beuron.
    // 
    // Parameter
    //   sizeLimit (optional, default 0)
    //     Bucket pair max size.
    //     Smaller the size, quicker the adaptation to new distributions,
    //     larger the learning rate and more vunerable to noise.
    //     Set to zero (default) to base solved results to all learned data.

    // Histogram for 8 possible input-output pairs.
    // 0: 00 0
    // 1: 00 1
    // 2: 01 0
    // 3: 01 1
    // 4: 10 0
    // 5: 10 1
    // 6: 11 0
    // 7: 11 1
    this.buckets = [0, 0, 0, 0, 0, 0, 0, 0];

    // Bucket pair size limit.
    // Zero or negative means max limit.
    if (typeof sizeLimit === 'undefined') { sizeLimit = 0; }
    if (sizeLimit <= 0 || sizeLimit > maxSizeLimit) {
      sizeLimit = maxSizeLimit;
    }
    this.sizeLimit = sizeLimit;
  };
  
  exports.create = function (sizeLimit) {
    return new Beu(sizeLimit);
  };
  
  

  // Accessors

  Beu.prototype.solve = function (inputVector) {
    // Solve the input vector based on the learned samples.
    // 
    // Parameter
    //   inputVector
    //     Array of size 2. Only 0's or 1's. Example [1, 0]
    // 
    // Return
    //   most probable value
    //     0 or 1

    var bucketIndex = 0;
    if (inputVector[0] === 1) {
      bucketIndex += 4;
    }
    if (inputVector[1] === 1) {
      bucketIndex += 2;
    }

    if (this.buckets[bucketIndex] < this.buckets[bucketIndex + 1]) {
      return 1;
    } // else zero bucket has more or equal number of samples
    return 0;
  };

  Beu.prototype.save = function () {
    // Return
    //   State of beuron in single array to be for example stored to database.
    // 
    // See also load()
    var copy = this.buckets.slice(0);
    copy.push(this.sizeLimit);
    return copy;
  };


  
  // Mutators
  
  Beu.prototype.learn = function (inputVector, outputVector) {
    // Parameter
    //   inputVector
    //     Input. Array of size 2. Only 0's or 1's. Example [1, 0]
    //   outputVector
    //     Output. Single value, 0 or 1.
    // 
    // Return
    //   this
    //     for chaining

    var bucketIndex = 0,
        reducer,
        i,
        pairSum;

    // Find out bucket pair
    if (inputVector[0] === 1) {
      bucketIndex += 4;
    }
    if (inputVector[1] === 1) {
      bucketIndex += 2;
    }

    // Memory limit.
    // If there is no room for additional sample in the bucket pair, multiply
    // both buckets so that there is.
    // This is done only after size is going to be exceeded so
    // the first samples are not exaggerated.
    pairSum = this.buckets[bucketIndex] + this.buckets[bucketIndex + 1];
    if (pairSum > this.sizeLimit - 1) {
      reducer = (this.sizeLimit - 1) / pairSum;
      this.buckets[bucketIndex] *= reducer;
      this.buckets[bucketIndex + 1] *= reducer;
    }

    // Now there is room for one more sample in the pair.
    if (outputVector === 1) {
      bucketIndex += 1;
    }
    this.buckets[bucketIndex] += 1;

    return this;
  };

  Beu.prototype.load = function (savedArray) {
    // See save()
    this.buckets = savedArray.slice(0, -1);
    this.sizeLimit = savedArray[savedArray.length - 1];
  };

  Beu.prototype.setSizeLimit = function (newSizeLimit) {
    // Set new size limit. See create()
    var i, pairSum, reducer;

    this.sizeLimit = newSizeLimit;

    for (i = 0; i < 8; i += 2) {
      pairSum = this.buckets[i] + this.buckets[i + 1];
      if (pairSum > this.sizeLimit) {
        reducer = this.sizeLimit / pairSum;
        this.buckets[i] *= reducer;
        this.buckets[i + 1] *= reducer;
      }
    }
  };
  


  // Extendability

  // Usage: Beuron.extension.myFunction = function (...) {...};
  exports.extension = Beu.prototype;
  

  
  ///////////////
  return exports;
}());
