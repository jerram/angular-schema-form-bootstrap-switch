(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular-schema-form'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular-schema-form'));
    } else {
        root.angularSchemaFormBootstrapSwitch = factory(root.schemaForm);
    }
}(this, function(schemaForm) {
    angular.module("schemaForm").run(["$templateCache", function ($templateCache) {
        $templateCache.put("directives/decorators/bootstrap/switch/switch.html",
            '<div class="form-group schema-form-checkbox {{form.htmlClass}}"' +
            '     ng-class="{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}">' +
            '   <label class="control-label {{form.labelHtmlClass}}" ng-show="showTitle()">{{ form.title }}</label>' +
            '   <input bs-switch data-indeterminate="false" type="checkbox" sf-changed="form" ng-disabled="form.readonly" sf-changed="form" schema-validate="form" ng-model="$$value$$"' +
            '          ng-model-options="form.ngModelOptions" schema-validate="form" class="{{form.fieldHtmlClass}}"' +
            '          name="{{form.key.slice(-1)[0]}}"></label>' +
            '   <div class="help-block" sf-message="form.description"></div>' +
            '</div>');
    }]);
    
    angular.module('schemaForm').directive('bsSwitch', [
        '$parse',
        '$timeout',
        function ($parse, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    ngModel: '=',
                    bsSwitch: '='
                },
                link: function link($scope, $element, $attrs, ngModel) {
                    // We need the ngModelController on several places,
                    // most notably for errors.
                    // So we emit it up to the decorator directive so it can put it on scope.
                    $scope.$emit('schemaFormPropagateNgModelController', ngModel);

                    var isInit = false;
                    var form = $scope.$parent.$eval($attrs.validate);

                    /**
                    * Return the true value for this specific checkbox.
                    * @returns {Object} representing the true view value; if undefined, returns true.
                    */
                    var getTrueValue = function() {
                        if ($attrs.type === 'radio') {
                            return $attrs.value || $parse($attrs.ngValue)($scope) || true;
                        }
                        var trueValue = $parse($attrs.ngTrueValue)($scope);
                        if (angular.isUndefined(trueValue)) {
                            trueValue = true;
                        }
                        return trueValue;
                    };
                    /**
                    * Get a boolean value from a boolean-like string, evaluating it on the current $scope.
                    * @param value The input object
                    * @returns {boolean} A boolean value
                    */
                    var getBooleanFromString = function(value) {
                        return $scope.$eval(value) === true;
                    };
                    /**
                    * Get a boolean value from a boolean-like string, defaulting to true if undefined.
                    * @param value The input object
                    * @returns {boolean} A boolean value
                    */
                    var getBooleanFromStringDefTrue = function(value) {
                        return value === true || value === 'true' || !value;
                    };
                    /**
                    * Returns the value if it is truthy, or undefined.
                    *
                    * @param value The value to check.
                    * @returns the original value if it is truthy, {@link undefined} otherwise.
                    */
                    var getValueOrUndefined = function(value) {
                        return value ? value : undefined;
                    };
                    /**
                    * Get the value of the angular-bound attribute, given its name.
                    * The returned value may or may not equal the attribute value, as it may be transformed by a function.
                    *
                    * @param attrName  The angular-bound attribute name to get the value for
                    * @returns {*}     The attribute value
                    */
                    var getSwitchAttrValue = function(attrName) {
                        var map = {
                            'switchRadioOff': getBooleanFromStringDefTrue,
                            'switchActive': function(value) {
                                return !getBooleanFromStringDefTrue(value);
                            },
                            'switchAnimate': getBooleanFromStringDefTrue,
                            'switchLabel': function(value) {
                                return value ? value : '&nbsp;';
                            },
                            'switchIcon': function(value) {
                                if (value) {
                                    return '<span class=\'' + value + '\'></span>';
                                }
                            },
                            'switchWrapper': function(value) {
                                return value || 'wrapper';
                            },
                            'switchInverse': getBooleanFromString,
                            'switchReadonly': getBooleanFromString
                        };
                        var transFn = map[attrName] || getValueOrUndefined;
                        return transFn($attrs[attrName]);
                    };
                    /**
                    * Set a bootstrapSwitch parameter according to the angular-bound attribute.
                    * The parameter will be changed only if the switch has already been initialized
                    * (to avoid creating it before the model is ready).
                    *
                    * @param element   The switch to apply the parameter modification to
                    * @param attr      The name of the switch parameter
                    * @param modelAttr The name of the angular-bound parameter
                    */
                    var setSwitchParamMaybe = function(element, attr, modelAttr) {
                        if (!isInit) {
                            return;
                        }
                        var newValue = getSwitchAttrValue(modelAttr);
                        element.bootstrapSwitch(attr, newValue);
                    };
                    var setActive = function() {
                        setSwitchParamMaybe($element, 'disabled', 'switchActive');
                    };
                    /**
                    * If the directive has not been initialized yet, do so.
                    */
                    var initMaybe = function() {
                        // if it's the first initialization
                        if (!isInit) {
                            var viewValue = ngModel.$modelValue === getTrueValue();
                            isInit = !isInit;
                            // Bootstrap the switch plugin
                            $element.bootstrapSwitch({
                                radioAllOff: getSwitchAttrValue('switchRadioOff'),
                                disabled: getSwitchAttrValue('switchActive'),
                                state: viewValue,
                                onText: getSwitchAttrValue('switchOnText'),
                                offText: getSwitchAttrValue('switchOffText'),
                                onColor: getSwitchAttrValue('switchOnColor'),
                                offColor: getSwitchAttrValue('switchOffColor'),
                                animate: getSwitchAttrValue('switchAnimate'),
                                size: getSwitchAttrValue('switchSize'),
                                labelText: $attrs.switchLabel ? getSwitchAttrValue('switchLabel') : getSwitchAttrValue('switchIcon'),
                                wrapperClass: getSwitchAttrValue('switchWrapper'),
                                handleWidth: getSwitchAttrValue('switchHandleWidth'),
                                labelWidth: getSwitchAttrValue('switchLabelWidth'),
                                inverse: getSwitchAttrValue('switchInverse'),
                                readonly: getSwitchAttrValue('switchReadonly')
                            });
                            if ($attrs.type === 'radio') {
                                ngModel.$setViewValue(ngModel.$modelValue);
                            } else {
                                ngModel.$setViewValue(viewValue);
                            }
                        }
                    };
                    /**
                    * Listen to model changes.
                    */
                    var listenToModel = function() {
                        $attrs.$observe('switchActive', function(newValue) {
                            var active = getBooleanFromStringDefTrue(newValue);
                            // if we are disabling the switch, delay the deactivation so that the toggle can be switched
                            if (!active) {
                                $timeout(function() {
                                    setActive(active);
                                });
                            } else {
                                // if we are enabling the switch, set active right away
                                setActive(active);
                            }
                        });

                        function modelValue() {
                            return ngModel.$modelValue;
                        }

                        // When the model changes
                        $scope.$watch(modelValue, function(newValue) {
                            initMaybe();
                            if (newValue !== undefined) {
                                $element.bootstrapSwitch('state', newValue === getTrueValue(), false);
                            } else {
                                $element.bootstrapSwitch('toggleIndeterminate', true, false);
                            }
                        }, true);
                        // angular attribute to switch property bindings
                        var bindings = {
                            'switchRadioOff': 'radioAllOff',
                            'switchOnText': 'onText',
                            'switchOffText': 'offText',
                            'switchOnColor': 'onColor',
                            'switchOffColor': 'offColor',
                            'switchAnimate': 'animate',
                            'switchSize': 'size',
                            'switchLabel': 'labelText',
                            'switchIcon': 'labelText',
                            'switchWrapper': 'wrapperClass',
                            'switchHandleWidth': 'handleWidth',
                            'switchLabelWidth': 'labelWidth',
                            'switchInverse': 'inverse',
                            'switchReadonly': 'readonly'
                        };
                        var observeProp = function(prop, bindings) {
                            return function() {
                                $attrs.$observe(prop, function() {
                                    setSwitchParamMaybe($element, bindings[prop], prop);
                                });
                            };
                        };
                        // for every angular-bound attribute, observe it and trigger the appropriate switch function
                        for (var prop in bindings) {
                            $attrs.$observe(prop, observeProp(prop, bindings));
                        }
                    };
                    /**
                    * Listen to view changes.
                    */
                    var listenToView = function() {
                        if ($attrs.type === 'radio') {
                            // when the switch is clicked
                            $element.on('change.bootstrapSwitch', function (e) {
                                // discard not real change events
                                if (ngModel.$modelValue === ngModel.$viewValue && e.target.checked !== $(e.target).bootstrapSwitch('state')) {
                                    // $setViewValue --> $viewValue --> $parsers --> $modelValue
                                    // if the switch is indeed selected
                                    if (e.target.checked) {
                                        // set its value into the view
                                        ngModel.$setViewValue(getTrueValue());
                                    } else if (getTrueValue() === ngModel.$viewValue) {
                                        // otherwise if it's been deselected, delete the view value
                                        ngModel.$setViewValue(undefined);
                                    }
                                }
                            });
                        } else {
                            // When the checkbox switch is clicked, set its value into the ngModel
                            $element.on('switchChange.bootstrapSwitch', function (e) {
                                // $setViewValue --> $viewValue --> $parsers --> $modelValue
                                ngModel.$setViewValue(e.target.checked);
                            });
                        }
                    };
                    // Listen and respond to view changes
                    listenToView();
                    // Listen and respond to model changes
                    listenToModel();
                    // On destroy, collect ya garbage
                    $scope.$on('$destroy', function() {
                        $element.bootstrapSwitch('destroy');
                    });

                    //// Validate
                    if (ngModel) {
                        $scope.validate = function () {
                            // We set the viewValue to trigger parsers,
                            // since modelValue might be empty and validating just that
                            // might change an existing error to a "required" error message.
                            if (ngModel.$setDirty) {

                                // Angular 1.3+
                                ngModel.$setDirty();
                                ngModel.$setViewValue(ngModel.$viewValue);
                                ngModel.$commitViewValue();

                                // In Angular 1.3 setting undefined as a viewValue does not trigger parsers
                                // so we need to do a special required check. Fortunately we have $isEmpty
                                if (form.required && ngModel.$modelValue === null && ngModel.$modelValue === undefined) {
                                    ngModel.$setValidity('tv4-302', false);
                                } else {
                                    ngModel.$setValidity('tv4-302', true);
                                }
                                ngModel.$validate();
                            } else {
                                // Angular 1.2
                                // In angular 1.2 setting a viewValue of undefined will trigger the parser.
                                // hence required works.
                                ngModel.$setViewValue(ngModel.$viewValue);
                            }
                        };

                        $scope.$on('schemaFormValidate', $scope.validate);
                    }
                }
            };
        }
    ]).directive('bsSwitch', function() {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<input bs-switch>',
            replace: true
        };
    });
    // Source: bsSwitch.suffix

    angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
      function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

          var bsSwitch = function (name, schema, options) {
              if (schema.type === 'boolean' && schema.format === 'switch') {
                  var f = schemaFormProvider.stdFormObj(name, schema, options);
                  f.key = options.path;
                  f.type = 'switch';
                  options.lookup[sfPathProvider.stringify(options.path)] = f;
                  return f;
              }
          };

          schemaFormProvider.defaults.boolean.unshift(bsSwitch);

          //Add to the bootstrap directive
          schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
            'switch',
            'directives/decorators/bootstrap/switch/switch.html'
          );
          schemaFormDecoratorsProvider.createDirective(
            'switch',
            'directives/decorators/bootstrap/switch/switch.html'
          );
      }
    ]);
}));
