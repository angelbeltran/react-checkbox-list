'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var React = require('react');
var ReactBS = require('react-bootstrap');

var Checkbox = ReactBS.Checkbox;

function getCheckboxes(boxes, handleChange) {
  return boxes.map(function (box) {
    return React.createElement(
      Checkbox,
      { key: box.value, checked: box.checked, value: box.value, onChange: handleChange },
      box.value
    );
  });
}

function fail() {
  throw new Error('CheckboxList onCheck prop must either return a boolean, accept a callback as it\' second parameter that returns a bool, or return a promise the resolved to a boolean');
}

var CheckboxList = React.createClass({
  displayName: 'CheckboxList',

  propTypes: {
    boxes: React.PropTypes.arrayOf(React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      checked: React.PropTypes.bool
    })).isRequired,
    onChange: React.PropTypes.func.isRequired // a function taking two arguments, value and checked, must return a bool or a promise resolving to a bool, or accept a callback as a third argument, calling it with a bool about the state of the checkbox clicked
  },
  handleChange: function handleChange(e) {
    e = e.nativeEvent; // so the event will persist across the asynchronous callback
    e.preventDefault(); // so the box doesn't change it's checked prop automatically

    function callback(res) {
      if (typeof res !== 'boolean') fail();
      if (res !== e.target.checked) e.preventDefault(); // don't let checkbox toggle if callback didn't change status
      e.target.checked = res;
    }

    var parentResponse = this.props.onChange(e.target.value, e.target.checked, callback);

    if (typeof parentResponse === 'boolean') {
      if (parentResponse !== e.target.checked) e.preventDefault(); // don't let checkbox toggle if response didn't change status
    } else if ((typeof parentResponse === 'undefined' ? 'undefined' : _typeof(parentResponse)) === 'object') {
      // check for promise
      console.log('thenable?:', !!parentResponse.then);
      if (parentResponse.then) return parentResponse.then(callback);else fail();
    } else {} // this.props.onChange should call the callback provided
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      getCheckboxes(this.props.boxes || [], this.handleChange)
    );
  }
});

module.exports = CheckboxList;
//# sourceMappingURL=CheckboxList.js.map