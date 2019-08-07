'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _rxjs = require('rxjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Run `validatorFunctions` in parallel and returns a resolved `Promise` with the validation status.
 * @param {function:Promise[]} validatorFunctions Array of validator functions that return a Promise.
 * @param {*} value The value that should be checked by the given validators
 * @returns {Promise.<Object>} Resolves promise with `{ isValid: true }` when validators passed
 * or with `{ isValid: false, message: '<error_message>'`} when one of the validators failed. The `message` property
 * contains the value that the failed validator function rejected with.
 */
function runValidatorFunctions(validatorFunctions, value, formState) {
    return _promise2.default.all(validatorFunctions.map(function (validator) {
        return validator.call(null, value, formState);
    }))
    // All validators passed
    .then(function () {
        return { isValid: true };
    })
    // When one of the validators failed a failure status with error message are emitted
    .catch(function (errorMessage) {
        return { isValid: false, message: errorMessage };
    });
}

/**
 *
 */

var AsyncValidatorRunner = function () {
    /**
     *
     * @param {Rx.Scheduler} [scheduler] Optional scheduler to be used for the Rx methods that can accept one.
     */
    function AsyncValidatorRunner(scheduler) {
        (0, _classCallCheck3.default)(this, AsyncValidatorRunner);

        // Rx.Scheduler to be used to run the operations on
        this.scheduler = scheduler;

        // Rx.Subject that will serve as the validator pipeline
        // The Runner passes the fields and values and emits
        // success
        this.validatorPipeline = new _rxjs.Subject();

        // The amount of time to be used for debouncing the field values
        this.debounceTimeInMs = 400;
    }

    /**
     * Run the `asyncValidators` passed for the field with `fieldName`. `fieldName` is only
     * used to pass through to the result so `listenToValidatorsFor` can identify which field
     * the result belong to.
     *
     * @param {string} fieldName The name of the field
     * @param {Array<Function>} asyncValidators An array of functions that each return a Promise thar resolves on valid
     * and rejects on failure.
     * @param {*} value The value that should be checked for validity.
     *
     * @returns {AsyncValidatorObject} Returns itself for chaining purposes
     */


    (0, _createClass3.default)(AsyncValidatorRunner, [{
        key: 'run',
        value: function run(fieldName) {
            var asyncValidators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var value = arguments[2];

            this.validatorPipeline.next({ fieldName: fieldName, asyncValidators: asyncValidators, value: value });

            return this;
        }

        /**
         * Returns an Rx.Observable that can be subscribed to to be updated of validation results for the field
         * with `fieldName`. This function when subscribing runs the validators that are passed for the given field when
         * `run` was called. This allows for only running the validators that are at the time the validation request was
         * issued were applicable to the field.
         *
         * @param {string} fieldName The name of the field to filter statuses for.
         * @returns {Rx.Observable} Observable that represents validation results for the given `fieldName`.
         */

    }, {
        key: 'listenToValidatorsFor',
        value: function listenToValidatorsFor(fieldName, formState) {
            return this.validatorPipeline
            // Filter the values by fieldName to make sure we only deal with the values for the requested field
            .filter(function (field) {
                return field.fieldName === fieldName;
            })
            // Only process the latest value within the specified time window
            .debounceTime(this.debounceTimeInMs, this.scheduler)
            // .do((v) => console.log(v.value))
            .map(function (field) {
                return _rxjs.Observable.fromPromise(runValidatorFunctions(field.asyncValidators, field.value, formState)).map(function (status) {
                    return (0, _assign2.default)(status, { fieldName: field.fieldName, value: field.value });
                });
            })
            // Flatten all observables in the correct order they should be processed
            .concatAll();
            // .do((v) => console.log(v));
        }

        /**
         * Creates an instance of the AsyncValidatorRunner class
         *
         * @param {Rx.Scheduler} scheduler A scheduler to be used while running the pipeline operations
         * @returns {AsyncValidatorRunner} The instantiated runner
         * @static
         */

    }], [{
        key: 'create',
        value: function create(scheduler) {
            return new AsyncValidatorRunner(scheduler);
        }
    }]);
    return AsyncValidatorRunner;
}();

exports.default = AsyncValidatorRunner;