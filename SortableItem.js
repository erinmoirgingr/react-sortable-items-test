'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var cx = require('classnames');

/**
 * Elements with 'is-isolated' in the class list will not trigger on mouse down events.
 */

var SortableItem = (function (_React$Component) {
  _inherits(SortableItem, _React$Component);

  function SortableItem(props) {
    _classCallCheck(this, SortableItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SortableItem).call(this, props));

    _this.handleSortableItemMouseDown = _this.handleSortableItemMouseDown.bind(_this);
    return _this;
  }

  _createClass(SortableItem, [{
    key: 'handleSortableItemMouseDown',
    value: function handleSortableItemMouseDown(e) {
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
  }, {
    key: 'outerHeight',
    value: function outerHeight() {
      var element = ReactDOM.findDOMNode(this);
      var style = getComputedStyle(element);
      return element.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
  }, {
    key: 'outerWidth',
    value: function outerWidth() {
      var element = ReactDOM.findDOMNode(this);
      var style = getComputedStyle(element);
      return element.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      return {
        left: ReactDOM.findDOMNode(this).offsetLeft,
        top: ReactDOM.findDOMNode(this).offsetTop
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.props.onSortableItemMount(this.getPosition(), this.outerWidth(), this.outerHeight(), this.props.sortableIndex);
    }
  }, {
    key: 'renderWithSortable',
    value: function renderWithSortable(item) {
      var originalClasses = item.props.className.split(' ');

      var classes = {};

      originalClasses.forEach(function (className) {
        classes[className] = true;
      });

      classes['SortableItem'] = true;
      classes['is-dragging'] = this.props._isDragging;
      classes['is-undraggable'] = !this.props.isDraggable;
      classes['is-placeholder'] = this.props._isPlaceholder;

      var classNames = cx(classes);

      return React.cloneElement(this.props._isPlaceholder && this.getPlaceholderContent && Object.prototype.toString.call(this.getPlaceholderContent) === '[object Function]' ? this.getPlaceholderContent() : item, {
        className: classNames,
        style: this.props.sortableStyle,
        key: this.props.sortableIndex,
        onMouseDown: this.handleSortableItemMouseDown,
        onMouseUp: this.handleSortableItemMouseUp
      });
    }
  }]);

  return SortableItem;
})(React.Component);

exports.default = SortableItem;
;

SortableItem.defaultProps = {
  sortableStyle: {},
  onSortableItemMount: function onSortableItemMount() {},
  onSortableItemMouseDown: function onSortableItemMouseDown() {},
  isDraggable: true,
  // Used by the Sortable component
  _isPlaceholder: false,
  _isDragging: false
};