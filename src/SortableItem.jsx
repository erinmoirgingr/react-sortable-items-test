'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var cx = require('classnames');

/**
 * Elements with 'is-isolated' in the class list will not trigger on mouse down events.
 */
export default class SortableItem extends React.Component {
  handleSortableItemMouseDown(e) {
    var evt = {
      pageX: e.pageX,
      pageY: e.pageY,
      offset: this.getPosition()
    };
    if (!e.target.classList.contains('is-isolated') && this.props.isDraggable) {
      this.props.onSortableItemMouseDown(evt, this.props.sortableIndex);
      e.stopPropagation();
    }
  }

  outerHeight() {
    var element = ReactDOM.findDOMNode(this);
    var style = getComputedStyle(element);
    return element.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
  }

  outerWidth() {
    var element = ReactDOM.findDOMNode(this);
    var style = getComputedStyle(element);
    return element.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
  }

  getPosition() {
    return {
      left: ReactDOM.findDOMNode(this).offsetLeft,
      top: ReactDOM.findDOMNode(this).offsetTop
    }
  }

  componentDidMount() {
    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
  }

  componentDidUpdate() {
    this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
  }

  renderWithSortable(item){
    var originalClasses = item.props.className.split(' ');

    var classes = {};

    originalClasses.forEach(function(className) {
        classes[className] = true;
    })

    classes['SortableItem'] = true;
    classes['is-dragging']  = this.props._isDragging;
    classes['is-undraggable'] = !this.props.isDraggable;
    classes['is-placeholder'] = this.props._isPlaceholder;

    var classNames = cx(classes);

    return React.cloneElement(
      this.props._isPlaceholder && this.getPlaceholderContent && Object.prototype.toString.call(this.getPlaceholderContent) === '[object Function]'
        ? this.getPlaceholderContent() : item, {
      className: classNames,
      style: this.props.sortableStyle,
      key: this.props.sortableIndex,
      onMouseDown: this.handleSortableItemMouseDown,
      onMouseUp: this.handleSortableItemMouseUp
    });
  }
};

SortableItem.defaultProps = {
  sortableStyle: {},
  onSortableItemMount: function(){},
  onSortableItemMouseDown: function(){},
  isDraggable: true,
  // Used by the Sortable component
  _isPlaceholder: false,
  _isDragging: false
}