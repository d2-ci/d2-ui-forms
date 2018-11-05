import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import FormField from './FormField.component';
import createFormValidator from './FormValidator';
import { FormFieldStatuses } from './FormValidator';

var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, (Form.__proto__ || _Object$getPrototypeOf(Form)).call(this, props));

        var i18n = _this.props.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass(Form, [{
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

                return React.createElement(FormField, {
                    fieldOptions: fieldConfig.fieldOptions,
                    key: fieldConfig.name,
                    type: fieldConfig.type,
                    isRequired: fieldConfig.required,
                    isValidating: validationStatus.status === FormFieldStatuses.VALIDATING,
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
            var classList = classes('form');

            return React.createElement(
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
}(Component);

Form.propTypes = {
    d2: PropTypes.object.isRequired,
    fieldConfigs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.func.isRequired,
        fieldOptions: PropTypes.object,
        validators: PropTypes.arrayOf(PropTypes.func)
    })).isRequired,
    formValidator: PropTypes.object,
    onFormFieldUpdate: PropTypes.func,
    source: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

Form.defaultProps = {
    d2: {},
    fieldConfigs: [],
    formValidator: createFormValidator([]),
    onFormFieldUpdate: function onFormFieldUpdate() {},
    children: null
};

export default Form;