// Beuron
//   Basically a histogram for possible input-output pairs.
//

var Beuron = (function () {
  var exports = {};
  /////////////////
  


  var Beu;


  
  // Constructor
  
  Beu = function (memoryLimit) {
    // Create new beuron.
    // 
    // Parameter
    //   memoryLimit (optional, default 0)
    //     Each learnt sample adds 1 to the size of its associated bucket.
    //     If the sum of the buckets exceeds the limit then each bucket is
    //     reduced propotionally so that the sum goes back to the limit.
    //     An outcome is that the effect of old samples eventually decreases
    //     while more recent samples have the biggest effect. Smaller
    //     the memory, more quickly Beuron learns if the distribution changes.
    //     

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

    // Weighted sum of the samples.
    this.total = 0;

    // Memory limit. Limit for beuron.total.
    // Smaller the limit, greater the learning rate.
    // Memory limit of zero or negative means max limit.
    //   Max integer of JavaScript is 2^53. In the worst case
    //   we need to sum 16 (2^4) integers. Max memory limit
    //   comes then to 2^49. Add some margin: 2^46;
    if (typeof memoryLimit === 'undefined') { memoryLimit = 0; }
    if (memoryLimit <= 0) {
      memoryLimit = 70368744177664; // Math.pow(2, 46);
    }
    this.memoryLimit = memoryLimit;
  };
  
  exports.create = function () {
    return new Beu();
  };
  
  

  // Accessors

  Beu.prototype.solve = function (sourceVector) {
    // Solve the source vector
    // 
    // Parameter
    //   sourceVector
    //     Array of size 2. Only 0's or 1's. Example [1, 0]
    // 
    // Return
    //   most probable value
    //     0 or 1

    var bucketIndex = 0;
    if (sourceVector[0] === 1) {
      bucketIndex += 4;
    }
    if (sourceVector[1] === 1) {
      bucketIndex += 2;
    }

    if (this.buckets[bucketIndex] < this.buckets[bucketIndex + 1]) {
      return 1;
    } // else zero has more or equal number of samples
    return 0;
  };


  
  // Mutators
  
  Beu.prototype.learn = function (sourceVector, targetVector) {
    // Parameter
    //   sourceVector
    //     Input. Array of size 2. Only 0's or 1's. Example [1, 0]
    //   targetVector
    //     Output. Single value, 0 or 1.
    // 
    // Return
    //   this
    //     for chaining

    var bucketIndex = 0,
        reducer,
        i;

    if (sourceVector[0] === 1) {
      bucketIndex += 4;
    }
    if (sourceVector[1] === 1) {
      bucketIndex += 2;
    }
    if (targetVector === 1) {
      bucketIndex += 1;
    }

    this.buckets[bucketIndex] += 1;
    this.total += 1;

    // Memory limit.
    // If there is too many samples in buckets, multiplies each bucket
    // so that the total decreases to memoryLimit.
    // This is done only after memoryLimit is exceeded so the first
    // samples are not exaggerated.
    if (this.total > this.memoryLimit) {
      reducer = this.memoryLimit / this.total;
      for (i = 0; i < 8; i += 1) {
        this.buckets[i] *= reducer;
      }
      this.total = this.memoryLimit; // new total
    }

    return this;
  };
  


  // Extendability

  // Usage: Beuron.extension.myFunction = function (...) {...};
  exports.extension = Beu.prototype;
  

  
  ///////////////
  return exports;
}());
