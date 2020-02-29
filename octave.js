"use strict";

/**
 * Function generator for generating n-dimen arrays initialized with some value
 *  Modified version of https://stackoverflow.com/a/16357947
 *
 *  @param {Integer} init: if it's undefined, fill random values else fill init
 */
function nDArrayGenerator(init) {
    return function generator(...dimens) {
        const ret = new Array(dimens[0]);

        if (dimens.length === 1) {
            for (let i = 0; i < dimens[0]; i++) {
                ret[i] = init === undefined ? Math.random() : init;
            }

            return ret;
        }

        const rest = dimens.slice(1);

        for (let i = 0; i < dimens[0]; i++) {
            ret[i] = generator(...rest);
        }

        return ret;
    };
}

/**
 * Replicates octave's rand function behaviour
 *  create a `dimens` dimensional array filled with random values
 *
 * @param {Array} dimens - list of dimensions of the output array
 *
 * Example:
 *  rand(2, 3, 4)
 */
const rand = nDArrayGenerator(),

    /**
     * Replicates octave's zeros function behaviour
     *  create a `dimens` dimensional array filled with random values
     *
     * @param {Array} dimens - list of dimensions of the output array
     *
     * Example:
     *  zeros(1, 2, 3)
     */
    zeros = nDArrayGenerator(0),

    /**
     * Replicates octave's ones function behaviour
     *  create a `dimens` dimensional array filled with random values
     *
     * @param {Array} dimens - list of dimensions of the output array
     *
     * Example:
     *  ones(1, 2, 3)
     */
    ones = nDArrayGenerator(1);

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
function shape(mat) {
    if (mat instanceof Array) {
        return [mat.length].concat(shape(mat[0]));
    }
    return [];
}

/**
 *
 * @param {Array} array
 * @param {Array<Array<Number>>} dims each entry is either tuple or undefined (indicating :)
 */
function indexer(array, dims) {
    function singleIndex(arr, index) {
        if (index) {
            return arr.slice(index[0], index[1]);
        }
        return arr;
    }

    const res = singleIndex(array, dims[0]);
    if (dims.length === 1) {
        return res;
    }

    return res.map(row => indexer(row, dims.slice(1)));
}

/**
 *
 * @param {Array} matrix
 */
function transpose(matrix) {
    if (Array.isArray(matrix[0])) {
        const rows = matrix.length,
            cols = matrix[0].length,
            res = [];


        for (let j = 0; j < cols; j++) {
            const row = [];
            for (let i = 0; i < rows; i++) {
                row.push(matrix[i][j]);
            }
            // column vector becomes row vector
            if (cols === 1) { return row; }
            res.push(row);
        }

        return res;
    }


    // row vector, make into column
    return matrix.map(x => [x]);
}

/*
 * Examples
 */
console.log(rand(1, 2, 3));
console.log(ones(1, 2, 3));
console.log(zeros(1, 2, 3));

console.log(shape(zeros(1, 2, 3)));

console.log("Indexer test");

const testArr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log(indexer(testArr, [undefined, [1, 2]]));
console.log(indexer(testArr, [[1, 2], [1, 2]]));
console.log(indexer(testArr, [undefined, undefined]));

console.log("Tranpose test");

console.log(transpose([[1, 2, 3], [4, 5, 6]]));
console.log(transpose([1, 2, 3]));
console.log(transpose([[1], [2], [3]]));
