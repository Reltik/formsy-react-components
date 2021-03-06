/*jshint node:true */

'use strict';

var React = require('react');
var Formsy = require('formsy-react');
var ComponentMixin = require('./mixins/component');
var Row = require('./row');

var Select = React.createClass({

    mixins: [Formsy.Mixin, ComponentMixin],

    changeValue: function(event) {
        var target = event.currentTarget;
        var value;
        if (this.props.multiple) {
            value = [];
            for (var i = 0; i < target.length; i++){
                var option = target.options[i];
                if (option.selected) {
                    value.push(option.value);
                }
            }
        } else {
            value = target.value;
        }
        this.setValue(value);
        this.props.onChange(this.props.name, value);
    },

    render: function() {

        if (this.getLayout() === 'elementOnly') {
            return this.renderElement();
        }

        return (
            <Row
                {...this.getRowProperties()}
                htmlFor={this.getId()}
            >
                {this.renderElement()}
                {this.renderHelp()}
                {this.renderErrorMessage()}
            </Row>
        );
    },

    renderElement: function() {
        var options = this.props.options;
        var groups = [];

        this.props.options.map(function (item) {
            var exists = groups.some(function (it) {
                return it == item.group;
            });
            if (item.group && item.group != "" && !exists) {
                groups.push(item.group);
            }
        });

        var optionNodes = [];

        if (groups.length == 0) {
            optionNodes = options.map(function (item, index) {
                return <option value={item.value} key={index} {...item} label={null}>{item.label}</option>;
            });
        } else {
			// For items without groups
            var itemsWithoutGroup = options.filter(function (c) {
                return !c.group || c.group == "";
            })

            itemsWithoutGroup.forEach(function (item, index) {
                optionNodes.push(<option value={item.value} key={(index == 0 ? 1 * -1 : index * -1)} {...item} label={null}>{item.label}</option>);
            });
			
            groups.forEach(function (group, indexGroup) {
                var allItems = options.filter(function (c) {
                    return c.group == group;
                });

                var itemsJsx = [];

                allItems.forEach(function (item, index) {
                    itemsJsx.push(<option value={item.value} key={index} {...item} label={null}>{item.label}</option>);
                });

                optionNodes.push(<optgroup label={group} key={indexGroup}>{itemsJsx}</optgroup>);
            });
        }
        return (
            <select
                ref="element"
                className="form-control"
                {...this.props}
                id={this.getId()}
                value={this.getValue()}
                onChange={this.changeValue}
                disabled={this.isFormDisabled() || this.props.disabled}
            >
                {optionNodes}
            </select>
        );
    }
});

module.exports = Select;
