"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = templateComponent;
var _react = _interopRequireWildcard(require("react"));
var sqrl = _interopRequireWildcard(require("squirrelly"));
require("./styles.css");
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _merge = _interopRequireDefault(require("lodash/merge"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const {
  hasOwnProperty
} = Object.prototype;
function templateComponent(props) {
  const {
    properties,
    component,
    data = [],
    store = {},
    responseData = [],
    loading = undefined,
    error = undefined,
    payload = undefined,
    templateClassName,
    workflow = []
  } = props;
  const {
    template = '',
    configTextObject = {}
  } = properties;
  const copyToClipBoard = phoneNumber => {
    const el = document.createElement('textarea');
    el.value = phoneNumber;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
  (0, _react.useEffect)(() => {
    if (component && component.id) {
      window[window.sessionStorage?.tabId][`${component.id}copyToClipBoard`] = value => copyToClipBoard(value);
    }
    return () => {
      if (component && component.id) {
        delete window[window.sessionStorage?.tabId][`${component.id}copyToClipBoard`];
      }
    };
  });
  const templateHTML = (input, inputData) => {
    const html = input;
    try {
      return sqrl.Render(html, inputData || []);
    } catch (e) {
      return `Squirrelly Error: ${e}`;
    }
  };
  function createHTML(input) {
    let inputData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (input === '') {
      return {
        __html: ''
      };
    }
    return {
      __html: templateHTML(input, inputData)
    };
  }
  const [externalData, updateExternalData] = (0, _react.useState)({});
  const [updateTemplateCount, setUpdateTemplateCount] = (0, _react.useState)(0);
  function updateTemplateData(input) {
    let shouldOverwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const clonedOldObj = (0, _cloneDeep.default)(externalData);
    let mergedObj;
    // If the input is an object, merge it with the existing object.
    if (typeof input === 'object') {
      if (shouldOverwrite) {
        mergedObj = input;
      } else {
        mergedObj = (0, _merge.default)(clonedOldObj, input);
      }
    }
    // Otherwise increment the count by one and assign the input to that key.
    else {
      mergedObj = (0, _merge.default)(clonedOldObj, {
        [updateTemplateCount]: input
      });
      setUpdateTemplateCount(updateTemplateCount + 1);
    }
    updateExternalData(mergedObj);
  }
  (0, _react.useEffect)(() => {
    if (workflow.length > 0) {
      workflow.map(item => {
        if (hasOwnProperty.call(item, 'didMountWorkflowData')) {
          updateTemplateData(item.didMountWorkflowData);
        }
        return item;
      });
    }
  }, []);
  function resetTemplateData() {
    updateExternalData({});
    setUpdateTemplateCount(0);
  }
  (0, _react.useEffect)(() => {
    if (component && component.id) {
      window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`] = updateTemplateData;
      window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`] = resetTemplateData;
    }
    return () => {
      if (component && component.id) {
        delete window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`];
        delete window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`];
      }
    };
  });
  let __html = createHTML(template, {
    data,
    externalData,
    responseData,
    store,
    configTextObject,
    loading,
    error,
    payload
  });
  (0, _react.useEffect)(() => {
    __html = createHTML(template, {
      data,
      externalData,
      responseData,
      store,
      configTextObject,
      loading,
      error,
      payload
    });
  }, [externalData]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: templateClassName && templateClassName ? templateClassName : 'template-component',
    dangerouslySetInnerHTML: __html
  }));
}
module.exports = exports.default;