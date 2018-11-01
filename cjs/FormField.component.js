'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LinearProgress = require('material-ui/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    (0, _inherits3.default)(FormField, _Component);

    function FormField() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, FormField);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FormField.__proto__ || (0, _getPrototypeOf2.default)(FormField)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            isFocused: false
        }, _this.onFocus = function () {
            _this.setState({ isFocused: true });
        }, _this.onBlur = function () {
            _this.setState({ isFocused: false });
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    } // eslint-disable-line react/no-multi-comp


    (0, _createClass3.default)(FormField, [{
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
                (0, _assign2.default)(helpStyle, {
                    marginTop: this.state.isFocused ? 0 : -18,
                    marginBottom: this.state.isFocused ? 0 : 0,
                    transition: 'margin 175ms ease-in-out'
                });
            }

            return _react2.default.createElement(
                'div',
                { style: { overflow: 'hidden', marginTop: dynamic ? -5 : 0 } },
                _react2.default.createElement(
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

            var classList = (0, _classnames2.default)('form-field');

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

            return _react2.default.createElement(
                'div',
                { className: classList },
                _react2.default.createElement(this.props.type, (0, _extends3.default)({
                    errorText: this.props.errorMessage,
                    defaultValue: this.props.value,
                    onChange: onChangeFn,
                    onBlur: onBlurFn,
                    onFocus: this.onFocus,
                    isRequired: this.props.isRequired
                }, this.props.fieldOptions)),
                this.renderHelpText(),
                this.props.isValidating ? _react2.default.createElement(_LinearProgress2.default, { mode: 'indeterminate' }) : null
            );
        }
    }]);
    return FormField;
}(_react.Component);

FormField.propTypes = {
    type: _propTypes2.default.func.isRequired,
    isValid: _propTypes2.default.bool.isRequired,
    errorMessage: _propTypes2.default.string,
    fieldOptions: _propTypes2.default.shape({
        helpText: _propTypes2.default.string,
        dynamicHelpText: _propTypes2.default.bool
    }).isRequired,
    value: _propTypes2.default.any,
    updateFn: _propTypes2.default.func.isRequired,
    updateEvent: _propTypes2.default.oneOf(['onChange', 'onBlur']),
    isValidating: _propTypes2.default.bool,
    isRequired: _propTypes2.default.bool
};

FormField.defaultProps = {
    type: emptyComponent,
    validators: []
};

exports.default = FormField;