import _extends from 'babel-runtime/helpers/extends';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import LinearProgress from 'material-ui/LinearProgress';

var emptyComponent = function emptyComponent() {};

/**
 * Is required to be a direct child of the `Form.component`
 * Will receive a updateFormStatus method from the Form to be called when the state of the input changes.
 * This will be passed down as an onChange event.
 * If the component passed as `type` does not support onChange
 * consider passing a wrapper component that wraps your `type` component
 * and fires the onChange
 *
 * The field fires an update request for the value by calling `onChange` by default but it is optional to set the update event to `onBlur`.
 * Pass the string `onBlur` to `updateEvent` to update the `<Form>` component on blur.
 */

var FormField = function (_Component) {
    _inherits(FormField, _Component);

    function FormField() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, FormField);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FormField.__proto__ || _Object$getPrototypeOf(FormField)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            isFocused: false
        }, _this.onFocus = function () {
            _this.setState({ isFocused: true });
        }, _this.onBlur = function () {
            _this.setState({ isFocused: false });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    } // eslint-disable-line react/no-multi-comp


    _createClass(FormField, [{
        key: 'renderHelpText',
        value: function renderHelpText() {
            if (!this.props.fieldOptions || !this.props.fieldOptions.helpText || this.props.errorMessage) {
                return null;
            }

            var helpText = this.props.fieldOptions.helpText;
            var dynamic = this.props.fieldOptions.dynamicHelpText;

            var helpStyle = {
                color: '#888',
                fontSize: '12px'
            };

            if (dynamic) {
                _Object$assign(helpStyle, {
                    marginTop: this.state.isFocused ? 0 : -18,
                    marginBottom: this.state.isFocused ? 0 : 0,
                    transition: 'margin 175ms ease-in-out'
                });
            }

            return React.createElement(
                'div',
                { style: { overflow: 'hidden', marginTop: dynamic ? -5 : 0 } },
                React.createElement(
                    'div',
                    { style: helpStyle },
                    helpText
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var classList = classes('form-field');

            var onChangeFn = this.props.updateFn;
            var onBlurFn = this.onBlur;
            if (this.props.updateEvent === 'onBlur') {
                onBlurFn = function onBlurFn(e) {
                    _this2.onBlur(e);
                    if (e.target.value !== (_this2.props.value ? _this2.props.value : '')) {
                        _this2.props.updateFn(e);
                    }
                };
                onChangeFn = undefined;
            }

            return React.createElement(
                'div',
                { className: classList },
                React.createElement(this.props.type, _extends({
                    errorText: this.props.errorMessage,
                    defaultValue: this.props.value,
                    onChange: onChangeFn,
                    onBlur: onBlurFn,
                    onFocus: this.onFocus,
                    isRequired: this.props.isRequired
                }, this.props.fieldOptions)),
                this.renderHelpText(),
                this.props.isValidating ? React.createElement(LinearProgress, { mode: 'indeterminate' }) : null
            );
        }
    }]);

    return FormField;
}(Component);

FormField.propTypes = {
    type: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    fieldOptions: PropTypes.shape({
        helpText: PropTypes.string,
        dynamicHelpText: PropTypes.bool
    }).isRequired,
    value: PropTypes.any,
    updateFn: PropTypes.func.isRequired,
    updateEvent: PropTypes.oneOf(['onChange', 'onBlur']),
    isValidating: PropTypes.bool,
    isRequired: PropTypes.bool
};

FormField.defaultProps = {
    type: emptyComponent,
    validators: []
};

export default FormField;