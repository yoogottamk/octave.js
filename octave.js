"use strict";

/**
 * Function generator for generating n-dimen arrays initialized with some value
 *  Modified version of https://stackoverflow.com/a/16357947
 *
 *  @param {Integer} init: if it's undefined, fill random values else fill init
 */
const nDArrayGenerator = init => {
  const func = function(...dimens) {
    let ret = undefined;

    if (dimens.length == 1) {
      ret = new Array(dimens[0]);

      for (let i = 0; i < dimens[0]; i++)
        ret[i] = init === undefined ? Math.random() : init;

      return ret;
    } else {
      let rest = dimens.slice(1);
      ret = new Array(dimens[0]);

      for (let i = 0; i < dimens[0]; i++) ret[i] = func(...rest);

      return ret;
    }
  };

  return func;
};

/**
 * Replicates octave's rand function behaviour
 *  create a `dimens` dimensional array filled with random values
 *
 * @param {Array} dimens - list of dimensions of the output array
 *
 * Example:
 *  rand(2, 3, 4)
 */
const rand = nDArrayGenerator();

/**
 * Replicates octave's zeros function behaviour
 *  create a `dimens` dimensional array filled with random values
 *
 * @param {Array} dimens - list of dimensions of the output array
 *
 * Example:
 *  zeros(1, 2, 3)
 */
const zeros = nDArrayGenerator(0);

/**
 * Replicates octave's ones function behaviour
 *  create a `dimens` dimensional array filled with random values
 *
 * @param {Array} dimens - list of dimensions of the output array
 *
 * Example:
 *  ones(1, 2, 3)
 */
const ones = nDArrayGenerator(1);

/**
 * Replicates octave's shape behaviour
 *  Return the `shape` of the array
 *  Modified version of https://gist.github.com/srikumarks/4303229
 *
 * @param {Array} mat - The matrix whose shape is to be calculated
 *
 * Example:
 *  shape(ones(1, 2, 3))
 */
const shape = mat => {
  if (mat instanceof Array) {
    return [mat.length].concat(shape(mat[0]));
  } else {
    return [];
  }
};

/*
 * Examples
 */
console.log(rand(1, 2, 3));
console.log(ones(1, 2, 3));
console.log(zeros(1, 2, 3));

console.log(shape(zeros(1, 2, 3)));
