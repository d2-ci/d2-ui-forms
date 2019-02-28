'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _AsyncValidatorRunner = require('./AsyncValidatorRunner');

var _AsyncValidatorRunner2 = _interopRequireDefault(_AsyncValidatorRunner);

var _d2UiCore = require('@dhis2/d2-ui-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

var FormBuilder = function (_React$Component) {
    (0, _inherits3.default)(FormBuilder, _React$Component);

    function FormBuilder(props) {
        (0, _classCallCheck3.default)(this, FormBuilder);

        var _this = (0, _possibleConstructorReturn3.default)(this, (FormBuilder.__proto__ || (0, _getPrototypeOf2.default)(FormBuilder)).call(this, props));

        _this.state = _this.initState(props);
        _this.asyncValidators = _this.createAsyncValidators(props);
        _this.asyncValidationRunner = props.asyncValidationRunner || new _AsyncValidatorRunner2.default();

        _this.getFieldProp = _this.getFieldProp.bind(_this);
        _this.getStateClone = _this.getStateClone.bind(_this);
        return _this;
    }

    /**
     * Called by React when the component receives new props, but not on the initial render.
     *
     * State is calculated based on the incoming props, in such a way that existing form fields
     * are updated as necessary, but not overridden. See the initState function for details.
     *
     * @param props
     */


    (0, _createClass3.default)(FormBuilder, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            var _this2 = this;

            this.asyncValidators = this.createAsyncValidators(props);

            var clonedState = this.getStateClone();

            props.fields
            // Only check fields that are set on the component state
            .filter(function (field) {
                return _this2.state && _this2.state.fields && _this2.state.fields[field.name];
            })
            // Filter out fields where the values changed
            .filter(function (field) {
                return field.value !== _this2.state.fields[field.name].value;
            })
            // Change field value and run validators for the field
            .forEach(function (field) {
                clonedState.fields[field.name].value = field.value;
                _this2.validateField(clonedState, field.name, field.value);
            });

            this.setState(clonedState);
        }

        /**
         * Custom state deep copy function
         *
         * @returns {{form: {pristine: (boolean), valid: (boolean), validating: (boolean)}, fields: *}}
         */

    }, {
        key: 'getStateClone',
        value: function getStateClone() {
            var _this3 = this;

            return {
                form: {
                    pristine: this.state.form.pristine,
                    valid: this.state.form.valid,
                    validating: this.state.form.validating
                },
                fields: (0, _keys2.default)(this.state.fields).reduce(function (p, c) {
                    p[c] = {
                        pristine: _this3.state.fields[c].pristine,
                        validating: _this3.state.fields[c].validating,
                        valid: _this3.state.fields[c].valid,
                        value: _this3.state.fields[c].value,
                        error: _this3.state.fields[c].error
                    };
                    return p;
                }, {})
            };
        }

        /**
         * Render the form fields.
         *
         * @returns {*} An array containing markup for each form field
         */

    }, {
        key: 'renderFields',
        value: function renderFields() {
            var _this4 = this;

            var styles = {
                field: {
                    position: 'relative'
                },
                progress: this.props.validatingProgressStyle,
                validatingErrorStyle: {
                    color: 'orange'
                }
            };

            return this.props.fields.map(function (field) {
                var _ref = field.props || {},
                    errorTextProp = _ref.errorTextProp,
                    props = (0, _objectWithoutProperties3.default)(_ref, ['errorTextProp']);

                var fieldState = _this4.state.fields[field.name] || {};

                var changeHandler = _this4.handleFieldChange.bind(_this4, field.name);

                var onBlurChangeHandler = props.changeEvent === 'onBlur' ? function (e) {
                    var stateClone = _this4.updateFieldState(_this4.getStateClone(), field.name, { value: e.target.value });
                    _this4.validateField(stateClone, field.name, e.target.value);
                    _this4.setState(stateClone);
                } : undefined;

                var errorText = fieldState && fieldState.validating ? field.validatingLabelText || _this4.props.validatingLabelText : errorTextProp;

                return _react2.default.createElement(
                    'div',
                    { key: field.name, style: (0, _assign2.default)({}, styles.field, _this4.props.fieldWrapStyle) },
                    fieldState.validating ? _react2.default.createElement(_d2UiCore.CircularProgress, { mode: 'indeterminate', size: 0.33, style: styles.progress }) : undefined,
                    _react2.default.createElement(field.component, (0, _extends3.default)({
                        value: fieldState.value,
                        onChange: props.changeEvent && props.changeEvent === 'onBlur' ? onBlurChangeHandler : changeHandler,
                        onBlur: props.changeEvent && props.changeEvent === 'onBlur' ? changeHandler : undefined,
                        errorStyle: fieldState.validating ? styles.validatingErrorStyle : undefined,
                        errorText: fieldState.valid ? errorText : fieldState.error
                    }, props))
                );
            });
        }

        /**
         * Render the component
         *
         * @returns {XML}
         */

    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: this.props.style },
                this.renderFields()
            );
        }

        /**
         * Calculates initial state based on the provided props and the existing state, if any.
         *
         * @param props
         * @returns {{form: {pristine: (boolean), valid: (boolean), validating: (boolean)}, fields: *}}
         */

    }, {
        key: 'initState',
        value: function initState(props) {
            var _this5 = this;

            var state = {
                fields: props.fields.reduce(function (fields, field) {
                    var currentFieldState = _this5.state && _this5.state.fields && _this5.state.fields[field.name];
                    return (0, _assign2.default)(fields, (0, _defineProperty3.default)({}, field.name, {
                        value: currentFieldState !== undefined && !currentFieldState.pristine ? currentFieldState.value : field.value,
                        pristine: currentFieldState !== undefined ? currentFieldState.value === field.value : true,
                        validating: currentFieldState !== undefined ? currentFieldState.validating : false,
                        valid: currentFieldState !== undefined ? currentFieldState.valid : true,
                        error: currentFieldState && currentFieldState.error || undefined
                    }));
                }, {})
            };
            state.form = {
                pristine: (0, _keys2.default)(state.fields).reduce(function (p, c) {
                    return p && state.fields[c].pristine;
                }, true),
                validating: (0, _keys2.default)(state.fields).reduce(function (p, c) {
                    return p || state.fields[c].validating;
                }, false),
                valid: (0, _keys2.default)(state.fields).reduce(function (p, c) {
                    return p && state.fields[c].valid;
                }, true)
            };
            return state;
        }

        /**
         * Create an object with a property for each field that has async validators, which is later used
         * to store Rx.Observable's for any currently running async validators
         *
         * @param props
         * @returns {*}
         */

    }, {
        key: 'createAsyncValidators',
        value: function createAsyncValidators(props) {
            var _this6 = this;

            return props.fields.filter(function (field) {
                return Array.isArray(field.asyncValidators) && field.asyncValidators.length;
            }).reduce(function (p, currentField) {
                p[currentField.name] = _this6.asyncValidators && _this6.asyncValidators[currentField.name] || undefined;
                return p;
            }, {});
        }

        /**
         * Cancel the currently running async validators for the specified field name, if any.
         *
         * @param fieldName
         */

    }, {
        key: 'cancelAsyncValidators',
        value: function cancelAsyncValidators(fieldName) {
            if (this.asyncValidators[fieldName]) {
                this.asyncValidators[fieldName].unsubscribe();
                this.asyncValidators[fieldName] = undefined;
            }
        }

        /**
         * Utility method to mutate the provided state object in place
         *
         * @param state A state object
         * @param fieldName A valid field name
         * @param fieldState Mutations to apply to the specified field name
         * @returns {*} A reference to the mutated state object for chaining
         */

    }, {
        key: 'updateFieldState',
        value: function updateFieldState(state, fieldName, fieldState) {
            var fieldProp = this.getFieldProp(fieldName);
            state.fields[fieldName] = {
                pristine: fieldState.pristine !== undefined ? !!fieldState.pristine : state.fields[fieldName].value === fieldProp.value,
                validating: fieldState.validating !== undefined ? !!fieldState.validating : state.fields[fieldName].validating,
                valid: fieldState.valid !== undefined ? !!fieldState.valid : state.fields[fieldName].valid,
                error: fieldState.error,
                value: fieldState.value !== undefined ? fieldState.value : state.fields[fieldName].value
            };

            // Form state is a composite of field states
            var fieldNames = (0, _keys2.default)(state.fields);
            state.form = {
                pristine: fieldNames.reduce(function (p, current) {
                    return p && state.fields[current].pristine;
                }, true),
                validating: fieldNames.reduce(function (p, current) {
                    return p || state.fields[current].validating;
                }, false),
                valid: fieldNames.reduce(function (p, current) {
                    return p && state.fields[current].valid;
                }, true)
            };

            return state;
        }

        /**
         * Field value change event
         *
         * This is called whenever the value of the specified field has changed. This will be the onChange event handler, unless
         * the changeEvent prop for this field is set to 'onBlur'.
         *
         * The change event is processed as follows:
         *
         * - If the value hasn't actually changed, processing stops
         * - The field status is set to [not pristine]
         * - Any currently running async validators are cancelled
         *
         * - All synchronous validators are called in the order specified
         * - If a validator fails:
         *    - The field status is set to invalid
         *    - The field error message is set to the error message for the validator that failed
         *    - Processing stops
         *
         * - If all synchronous validators pass:
         *    - The field status is set to [valid]
         *    - If there are NO async validators for the field:
         *       - The onUpdateField callback is called, and processing is finished
         *
         * - If there ARE async validators for the field:
         *    - All async validators are started immediately
         *    - The field status is set to [valid, validating]
         *    - The validators keep running asynchronously, but the handleFieldChange function terminates
         *
         * - The async validators keep running in the background until ONE of them fail, or ALL of them succeed:
         * - The first async validator to fail causes all processing to stop:
         *    - The field status is set to [invalid, not validating]
         *    - The field error message is set to the value that the validator rejected with
         * - If all async validators complete successfully:
         *    - The field status is set to [valid, not validating]
         *    - The onUpdateField callback is called
         *
         * @param fieldName The name of the field that changed.
         * @param event An event object. Only `event.target.value` is used.
         */

    }, {
        key: 'handleFieldChange',
        value: function handleFieldChange(fieldName, event) {
            var _this7 = this;

            var newValue = event.target.value;

            var field = this.getFieldProp(fieldName);

            // If the field has changeEvent=onBlur the change handler is triggered whenever the field loses focus.
            // So if the value didn't actually change, abort the change handler here.
            if (field.props && field.props.changeEvent === 'onBlur' && newValue === field.value) {
                return;
            }

            // Using custom clone function to maximize speed, albeit more error prone
            var stateClone = this.getStateClone();

            // Update value, and set pristine to false
            this.setState(this.updateFieldState(stateClone, fieldName, { pristine: false, value: newValue }), function () {
                if (!(0, _lodash.isObject)(newValue) && newValue === (field.value ? field.value : '')) {
                    _this7.props.onUpdateField(fieldName, newValue);
                    return;
                }

                // Cancel async validators in progress (if any)
                if (_this7.asyncValidators[fieldName]) {
                    _this7.cancelAsyncValidators(fieldName);
                    _this7.setState(_this7.updateFieldState(stateClone, fieldName, { validating: false }));
                }

                // Run synchronous validators
                var validatorResult = _this7.validateField(stateClone, fieldName, newValue);

                // Async validators - only run if sync validators pass
                if (validatorResult === true) {
                    _this7.runAsyncValidators(field, stateClone, fieldName, newValue);
                } else {
                    // Sync validators failed set field status to false
                    _this7.setState(_this7.updateFieldState(stateClone, fieldName, { valid: false, error: validatorResult }), function () {
                        // Also emit when the validator result is false
                        _this7.props.onUpdateFormStatus(_this7.state.form);
                        _this7.props.onUpdateField(fieldName, newValue);
                    });
                }
            });
        }
    }, {
        key: 'runAsyncValidators',
        value: function runAsyncValidators(field, stateClone, fieldName, newValue) {
            var _this8 = this;

            if ((field.asyncValidators || []).length > 0) {
                // Set field and form state to 'validating'
                this.setState(this.updateFieldState(stateClone, fieldName, { validating: true }), function () {
                    _this8.props.onUpdateFormStatus(_this8.state.form);
                    _this8.props.onUpdateField(fieldName, newValue);

                    // TODO: Subscription to validation results could be done once in `componentDidMount` and be
                    // disposed in the `componentWillUnmount` method. This way we don't have to create the
                    // subscription every time the field is changed.
                    _this8.asyncValidators[fieldName] = _this8.asyncValidationRunner.listenToValidatorsFor(fieldName, stateClone).subscribe(function (status) {
                        _this8.setState(_this8.updateFieldState(_this8.getStateClone(), status.fieldName, {
                            validating: false,
                            valid: status.isValid,
                            error: status.message
                        }), function () {
                            _this8.cancelAsyncValidators(status.fieldName);
                            _this8.props.onUpdateFormStatus(_this8.state.form);
                        });
                    });

                    _this8.asyncValidationRunner.run(fieldName, field.asyncValidators, newValue);
                });
            } else {
                this.setState(this.updateFieldState(stateClone, fieldName, { valid: true }), function () {
                    _this8.props.onUpdateFormStatus(_this8.state.form);
                    _this8.props.onUpdateField(fieldName, newValue);
                });
            }
        }

        /**
         * Run all synchronous validators (if any) for the field and value, and update the state clone depending on the
         * outcome
         *
         * @param stateClone A clone of the current state
         * @param fieldName The name of the field to validate
         * @param newValue The value to validate
         * @returns {true|String} The error message from the first validator that fails, or true if they all pass
         */

    }, {
        key: 'validateField',
        value: function validateField(stateClone, fieldName, newValue) {
            var field = this.getFieldProp(fieldName);

            var validatorResult = (field.validators || []).reduce(function (pass, currentValidator) {
                return pass === true ? currentValidator.validator(newValue, stateClone) === true || currentValidator.message : pass;
            }, true);

            if ((0, _lodash.get)(field, 'fieldOptions.disabled')) {
                validatorResult = true;
            }

            this.updateFieldState(stateClone, fieldName, {
                valid: validatorResult === true,
                error: validatorResult === true ? undefined : validatorResult
            });

            return validatorResult;
        }

        /**
         * Retreive the field that has the specified field name
         *
         * @param fieldName
         * @returns {}
         */

    }, {
        key: 'getFieldProp',
        value: function getFieldProp(fieldName) {
            return this.props.fields.filter(function (f) {
                return f.name === fieldName;
            })[0];
        }
    }]);
    return FormBuilder;
}(_react2.default.Component);

/**
 * Component prop types
 * @type {{fields: (Object|isRequired), validatingLabelText: *, validatingProgressStyle: *, onUpdateField: (Function|isRequired)}}
 */


FormBuilder.propTypes = {
    fields: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        value: _propTypes2.default.any,
        component: _propTypes2.default.func.isRequired,
        props: _propTypes2.default.shape({
            changeEvent: _propTypes2.default.oneOf(['onChange', 'onBlur'])
        }),
        validators: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            validator: _propTypes2.default.func.isRequired,
            message: _propTypes2.default.string.isRequired
        })),
        asyncValidators: _propTypes2.default.arrayOf(_propTypes2.default.func.isRequired),
        validatingLabelText: _propTypes2.default.string
    })).isRequired,
    validatingLabelText: _propTypes2.default.string,
    validatingProgressStyle: _propTypes2.default.object,
    onUpdateField: _propTypes2.default.func.isRequired,
    onUpdateFormStatus: _propTypes2.default.func,
    style: _propTypes2.default.object,
    fieldWrapStyle: _propTypes2.default.object
};

/**
 * Default values for optional props
 * @type {{validatingLabelText: string, validatingProgressStyle: {position: string, right: number, top: number}}}
 */
FormBuilder.defaultProps = {
    validatingLabelText: 'Validating...',
    validatingProgressStyle: {
        position: 'absolute',
        right: -12,
        top: 16
    },
    onUpdateFormStatus: noop
};

exports.default = FormBuilder;