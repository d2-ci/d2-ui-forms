'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _FormField = require('./FormField.component');

var _FormField2 = _interopRequireDefault(_FormField);

var _FormValidator = require('./FormValidator');

var _FormValidator2 = _interopRequireDefault(_FormValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Form = function (_Component) {
    (0, _inherits3.default)(Form, _Component);

    function Form(props) {
        (0, _classCallCheck3.default)(this, Form);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Form.__proto__ || (0, _getPrototypeOf2.default)(Form)).call(this, props));

        var i18n = _this.props.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    (0, _createClass3.default)(Form, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.disposables = [];
            this.disposables.push(this.props.formValidator.status.subscribe(function () {
                // TODO: Should probably have some sort of check to see if it really needs to update? That update might be better at home in the formValidator however
                _this2.forceUpdate();
            }));
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            if (props.hasOwnProperty('formValidator')) {
                this.forceUpdate();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.disposables.forEach(function (d) {
                d.unsubscribe();
            });
        }
    }, {
        key: 'renderFieldsFromFieldConfigs',
        value: function renderFieldsFromFieldConfigs() {
            var _this3 = this;

            return this.props.fieldConfigs.filter(function (fieldConfig) {
                return fieldConfig.type;
            }).map(function (fieldConfig) {
                var fieldValue = _this3.props.source && _this3.props.source[fieldConfig.name];
                var updateEvent = fieldConfig.updateEvent === 'onBlur' ? 'onBlur' : 'onChange';
                var validationStatus = _this3.props.formValidator.getStatusFor(fieldConfig.name);
                var errorMessage = void 0;

                if (validationStatus && validationStatus.messages && validationStatus.messages.length) {
                    errorMessage = validationStatus.messages[0];
                }

                return _react2.default.createElement(_FormField2.default, {
                    fieldOptions: fieldConfig.fieldOptions,
                    key: fieldConfig.name,
                    type: fieldConfig.type,
                    isRequired: fieldConfig.required,
                    isValidating: validationStatus.status === _FormValidator.FormFieldStatuses.VALIDATING,
                    errorMessage: errorMessage ? _this3.getTranslation(errorMessage) : undefined,
                    onChange: _this3.updateRequest.bind(_this3, fieldConfig),
                    value: fieldValue,
                    isValid: _this3.isValid(),
                    updateFn: _this3.updateRequest.bind(_this3, fieldConfig),
                    updateEvent: updateEvent
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var classList = (0, _classnames2.default)('form');

            return _react2.default.createElement(
                'form',
                { className: classList },
                this.renderFieldsFromFieldConfigs(),
                this.props.children
            );
        }
    }, {
        key: 'isValid',
        value: function isValid() {
            return true;
        }
    }, {
        key: 'updateRequest',
        value: function updateRequest(fieldConfig, event) {
            this.props.formValidator.runFor(fieldConfig.name, event.target.value, this.props.source);
            this.props.onFormFieldUpdate && this.props.onFormFieldUpdate(fieldConfig.name, fieldConfig.beforeUpdateConverter ? fieldConfig.beforeUpdateConverter(event.target.value, fieldConfig) : event.target.value);
        }
    }]);
    return Form;
}(_react.Component);

Form.propTypes = {
    d2: _propTypes2.default.object.isRequired,
    fieldConfigs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        type: _propTypes2.default.func.isRequired,
        fieldOptions: _propTypes2.default.object,
        validators: _propTypes2.default.arrayOf(_propTypes2.default.func)
    })).isRequired,
    formValidator: _propTypes2.default.object,
    onFormFieldUpdate: _propTypes2.default.func,
    source: _propTypes2.default.object.isRequired,
    children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object])
};

Form.defaultProps = {
    d2: {},
    fieldConfigs: [],
    formValidator: (0, _FormValidator2.default)([]),
    onFormFieldUpdate: function onFormFieldUpdate() {},
    children: null
};

exports.default = Form;