/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

/**
 * Elements with 'is-isolated' in the class list will not trigger on mouse down events.
 */
module.exports = {
  getDefaultProps: function(){
    return {
      sortableClassName: '',
      sortableStyle: {},
      onSortableItemMount: function(){},
      onSortableItemMouseDown: function(){},
      isDraggable: true
    }
  },
  handleSortableItemMouseDown: function(e){
    var evt = {
      pageX: e.pageX,
      pageY: e.pageY,
      offset: this.getPosition()
    };
    if (!e.target.classList.contains('is-isolated') && this.props.isDraggable) {
      this.props.onSortableItemMouseDown(evt, this.props.sortableIndex);
    }
  },
  outerHeight: function() {
    var element = this.getDOMNode();
    var style = getComputedStyle(element);
    return element.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
  },
  outerWidth: function() {
    var element = this.getDOMNode();
    var style = getComputedStyle(element);
    return element.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
  },
  getPosition: function() {
    return {
      left: this.getDOMNode().offsetLeft,
      top: this.getDOMNode().offsetTop
    }
  },
  componentDidMount: function(){
    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
  },

  componentDidUpdate: function(){
    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
  },

  renderWithSortable: function(item){
    return React.addons.cloneWithProps(item, {
      className: this.props.sortableClassName,
      style: this.props.sortableStyle,
      key: this.props.sortableIndex,
      onMouseDown: this.handleSortableItemMouseDown
    });
  }
};