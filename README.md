# Angular Schema Form Bootstrap Switch

This is an add-on for [Angular Schema Form](https://github.com/json-schema-form/angular-schema-form).

[![Build Status](https://travis-ci.org/JChampigny/angular-schema-form-bootstrap-switch.svg?branch=master)](https://travis-ci.org/JChampigny/angular-schema-form-bootstrap-switch)

This is an adaptation of the [Bootstrap Switch](https://github.com/nostalgiaz/bootstrap-switch) to enable toggles in place of checboxes or radio buttons.

## Installation
The bootstrap switch is an add-on to the Bootstrap decorator. To use it, just include bootstrap-switch.min.js after bootstrap-decorator.min.js.

You'll need to load a few additional files to use bootstrap switch in this order:
* [JQuery](https://jquery.com) (Bootstrap switch depends on it)
* [Bootstrap](http://getbootstrap.com) CSS
* The [bootstrap switch](https://github.com/nostalgiaz/bootstrap-switch) switch source files
* The [bootstrap switch](https://github.com/nostalgiaz/bootstrap-switch) switch CSS
 
You can also install the module with bower
`$ bower install angular-schema-form-datepicker`

## Usage
The datepicker add-on adds a new form type, switch.

Form Type | Becomes
--- | ---
switch | a pickadate widget

Schema | Default Form type
--- | ---
"type": "boolean" | Bootstrap switch

## Example
Below a Javascript example
### Schema
`
{
  type: "object",
  properties: {
    isActive: {
      "title": "Is Active",
      "type": "boolean"
    }
  }
}
`
### Form
`
{
  key: "isActive",
  type: "switch"
}
`
