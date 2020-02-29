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
 * @param {Array} arr
 * @param {Array<Number>|Number} index
 */
function getLowerUpperSliceIndex(arr, index) {
    if (index) {
        if (Array.isArray(index)) { return [index[0] || 0, index[1] || arr.length]; }

        return [index, index + 1];
    }

    return [0, arr.length];
}

/**
 * slice indexing on array
 * @param {Array} arr
 * @param {Array<Number>|Number} index
 */
function singleIndex(arr, index) {
    return arr.slice(...getLowerUpperSliceIndex(arr, index));
}

/**
 *
 * @param {Array} array
 * @param {Array<Array<Number>>} dims each entry is either tuple or undefined (indicating :)
 */
function indexer(array, dims) {
    const res = singleIndex(array, dims[0]);
    if (dims.length === 1) {
        return res;
    }

    return res.map(row => indexer(row, dims.slice(1)));
}

/**
 * @param {Array} array
 * @param {Array<Array<Number>>} dims each entry is either tuple or undefined (indicating :)
 * @param {Array} arrayToAssign
 */
function lhsIndexer(array, dims, arrayToAssign) {
    // both indices inclusive
    const [lower, upper] = getLowerUpperSliceIndex(array, dims[0]),
        dimsToSend = dims.slice ? dims.slice(1) : undefined,
        isArray = Array.isArray(arrayToAssign);

    for (let i = lower; i < upper; i++) {
        const val = isArray ? arrayToAssign[i - lower] : arrayToAssign;

        if (dims.length === 1) {
            array[i] = val;
        } else {
            lhsIndexer(array[i], dimsToSend, val);
        }
    }
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

function repMat(matrix, rowRep = 1, colRep = 1) {
    let rows = matrix.length,
        cols = matrix[0].length;

    // in case of row matrix
    if (!Number.isInteger(cols)) {
        matrix = [matrix];
        cols = rows;
        rows = 1;
    }

    const newRows = rowRep * rows,
        newCols = colRep * cols,
        res = [];

    for (let i = 0; i < newRows; i++) {
        const row = [];
        for (let j = 0; j < newCols; j++) {
            row.push(matrix[i % rows][j % cols]);
        }
        res.push(row);
    }

    return res;
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

const matrices = [
    [[1, 2, 3], [4, 5, 6]],
    [1, 2, 3],
    [[1], [2], [3]],
];

console.log("Tranpose test");

for (const mat of matrices) { console.log(transpose(mat)); }

console.log("Repmat test");

for (const mat of matrices) {
    console.log(repMat(mat));
    console.log(repMat(mat, 2));
    console.log(repMat(mat, undefined, 2));
    console.log(repMat(mat, 2, 2));
    console.log("---");
}

console.log("LHS indexer test");

const matrix = [
    [[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]],
    [[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]],
];

console.log(matrix);
lhsIndexer(
    matrix,
    [undefined, [1, 2], 1],
    100,
);
console.log(matrix);
