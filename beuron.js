/*! beuron - v0.0.1 - 2014-02-26
 * https://github.com/axelpale/beuronjs
 *
 * Copyright (c) 2014 Akseli Palen <akseli.palen@gmail.com>;
 * Licensed under the MIT license */

(function (window, undefined) {
  'use strict';
  
  
  
  
  
  
  
  // ten lines to ease counting and finding the lines in test output.


// Beuron
//   Very inefficient but semantically clear version.
//
// Known Issues
//   - Extremely inefficient

var Beuron = (function () {
  var exports = {};
  /////////////////
  


  var Beu,
      hitsTotal,
      probability,
      zeros,
      hypotheses,
      indexOfMax,
      bestHypothesis,
      limitHits;



  // Helper functions

  hitsTotal = function (hits) {
    // Sum over all the hits.
    var i,
        sum = 0;
    for (i = 0; i < hits.length; i += 1) {
      sum += hits[i];
    }
    return sum;
  };

  probability = function (i, hits) {
    // Probability of i:th hypothesis
    return hits[i] / hitsTotal(hits);
  };

  zeros = function (n) {
    // Return array filled with zeros and length of n
    var i,
        array = [];
    for (i = 0; i < n; i += 1) {
      array.push(0);
    }
    return array;
  };

  hypotheses = (function () {
    return [
      // Terminology
      //   http://en.wikipedia.org/wiki/Truth_table#Binary_operations
      // 
      // Truth table
      //        b
      //      0   1
      //    +---+---+
      //   0|   |   |
      // a  +---+---+
      //   1|   |   |
      //    +---+---+
      // 
      function contradiction(a, b) {
        // 0 0
        // 0 0
        return 0;
      },
      function logicalConjunction(a, b) {
        // 0 0
        // 0 1
        return a * b;
      },
      function materialNonimplication(a, b) {
        // 0 0
        // 1 0
        return a * (1 - b);
      },
      function projectionFunctionA(a, b) {
        // 0 0
        // 1 1
        return a;
      },
      function converseNonimplication(a, b) {
        // 0 1
        // 0 0
        return (1 - a) * b;
      },
      function projectionFunctionB(a, b) {
        // 0 1
        // 0 1
        return b;
      },
      function exclusiveDisjunction(a, b) {
        // 0 1
        // 1 0
        return a * (1 - b) + (1 - a) * b;
      },
      function logicalDisjunction(a, b) {
        // 0 1
        // 1 1
        return a + (1 - a) * b;
      },
      function logicalNOR(a, b) {
        // 1 0
        // 0 0
        return (1 - a) * (1 - b);
      },
      function logicalBiconditional(a, b) {
        // 1 0
        // 0 1
        return (1 - a) * (1 - b) + a * b;
      },
      function negationB(a, b) {
        // 1 0
        // 1 0
        return (1 - b);
      },
      function converseImplication(a, b) {
        // 1 0
        // 1 1
        return (1 - b) + a * b;
      },
      function negationA(a, b) {
        // 1 1
        // 0 0
        return (1 - a);
      },
      function materialImplication(a, b) {
        // 1 1
        // 0 1
        return (1 - a) + a * b;
      },
      function logicalNAND(a, b) {
        // 1 1
        // 1 0
        return 1 - a * b;
      },
      function tautology(a, b) {
        // 1 1
        // 1 1
        return 1;
      }
    ];
  }());

  indexOfMax = function (array) {
    var max = array[0],
        i,
        item,
        indexMax = 0;

    for (i = 1; i < array.length; i += 1) {
      item = array[i];
      if (item > max) {
        max = item;
        indexMax = i;
      }
    }

    return indexMax;
  };

  bestHypothesis = function (hypotheses, hits) {
    // Select the best hypotheses
    return hypotheses[indexOfMax(hits)];
  };

  limitHits = function (hits, memoryLimit) {
    var total = hitsTotal(hits),
        reducer,
        i;
    if (total > memoryLimit) {
      reducer = memoryLimit / total;
      for (i = 0; i < this.hits.length; i += 1) {
        this.hits[i] = this.hits[i] * reducer;
      }
    }
  };


  
  // Constructor
  
  Beu = function (memoryLimit) {
    // Hypotheses' histogram for 16 hypotheses.
    this.hits = zeros(16);

    // Memory limit. Limit for hitsTotal.
    // Smaller the limit, greater the learning rate.
    // Memory limit of zero or negative means max limit.
    //   Max integer of JavaScript is 2^53. In the worst case
    //   we need to sum 16 (2^4) integers. Max memory limit
    //   comes then to 2^49. Add some margin: 2^46;
    if (typeof memoryLimit === 'undefined') { memoryLimit = 0; }
    if (memoryLimit <= 0) {
      memoryLimit = Math.pow(2, 46);
    }
    this.memoryLimit = memoryLimit;
  };
  
  exports.create = function () {
    return new Beu();
  };
  
  

  // Accessors

  Beu.prototype.solve = function (sourceVector) {
    // Solve the source vector
    // Return most probable targetVector
    var h = bestHypothesis(hypotheses, this.hits),
        a = sourceVector[0],
        b = sourceVector[1];
    return h(a, b);
  };


  
  // Mutators
  
  Beu.prototype.learn = function (sourceVector, targetVector) {
    // Learn the mapping.
    var i,
        hypothesis,
        matches = [],
        reward,
        matchIndex,
        a = sourceVector[0],
        b = sourceVector[1],
        y = targetVector;

    // Find the matching hypotheses
    for (i = 0; i < hypotheses.length; i += 1) {
      hypothesis = hypotheses[i];
      if (hypothesis(a, b) === y) {
        matches.push(i);
      }
    }

    // Share 1 point evenly among the hypotheses
    reward = 1 / matches.length;
    for (i = 0; i < matches.length; i += 1) {
      matchIndex = matches[i];
      this.hits[matchIndex] += reward;
    }

    // Memory limit.
    limitHits(this.hits, this.memoryLimit);
  };
  


  // Extendability

  // Usage: Beuron.extension.myFunction = function (...) {...};
  exports.extension = Beu.prototype;
  

  
  ///////////////
  return exports;
}());


  // Version
  Beuron.version = '0.0.1';


  
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
