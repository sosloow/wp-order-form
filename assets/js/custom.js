"use strict";

//import IMask from './node_modules/imask/dist/imask.js';
var drawTable, drawCalc;
var PRODUCTS = [{
  id: 'ad99',
  label: 'Ад 99,99'
}, {
  id: 'adsi92',
  label: 'АдСи 92,5'
}];
var DIMENTIONS = [{
  id: 'length',
  label: 'м'
}, {
  id: 'weight',
  label: 'гр'
}];
var PRICES = [{
  width: 0.5,
  price: 70
}, {
  width: 0.75,
  price: 70
}, {
  width: 1.1,
  price: 70
}, {
  width: Infinity,
  price: 65
}];
var RESTRICTIONS = {
  width: {
    min: 0.5,
    max: 2
  },
  weight: {
    min: 1,
    max: 10000
  },
  length: {
    min: 0.01,
    max: 100
  }
};
var MIN_ORDER_WEIGHT = 100;
var Order = {
  items: [],
  addItem: function addItem() {
    this.items.push({
      // product: null,
      // width: null,
      // length: null,
      // weight: null,
      product: 'ad99',
      width: 1,
      length: 1,
      weight: null,
      dimention: 'length'
    });
  },
  removeItem: function removeItem(index) {
    this.items.splice(Number(index), 1);
  },
  total: function total() {
    return this.items.reduce(function (sum, item) {
      var priceDict = PRICES.find(function (p) {
        return item.width < p.width;
      });
      var price = item.width && priceDict ? priceDict.price : 0;
      var measure = item.dimention === 'weight' ? item.weight : item.length * 100;
      return sum + price * (measure || 0);
    }, 0);
  },
  weightList: function weightList() {
    var _this = this;

    return PRODUCTS.map(function (product) {
      var weight = _this.items.reduce(function (sum, i) {
        if (i.product !== product.id) {
          return sum;
        }

        var weight = i.dimention === 'weight' ? i.weight || 0 : (i.length || 0) * 100;
        return sum + weight;
      }, 0);

      return {
        product: product.label,
        weight: weight
      };
    }).filter(function (item) {
      return item.weight;
    });
  },
  totalWeight: function totalWeight() {
    return this.weightList().reduce(function (sum, i) {
      return sum + i.weight;
    }, 0);
  },
  isValid: function isValid() {
    return this.items.reduce(function (isValid, item) {
      var requiredFields = ['product', 'width', item.dimention];
      var itemValid = requiredFields.reduce(function (isValid, field) {
        var validRange = RESTRICTIONS[field] ? item[field] >= RESTRICTIONS[field].min && item[field] <= RESTRICTIONS[field].max : true;
        return isValid && validRange && Boolean(item[field]);
      }, true);
      return isValid && itemValid;
    }, true);
  }
};
$(document).ready(function () {
  // svg4everybody({});
  // init input mask
  var inputsNumberMask = document.querySelectorAll('.js-input-number-mask');
  var inputsPhoneMask = document.querySelectorAll('.js-input-phone-mask');
  inputsNumberMask.forEach(function (elem) {
    IMask(elem, {
      mask: Number
    });
  });
  inputsPhoneMask.forEach(function (elem) {
    IMask(elem, {
      mask: '+{7}(000)000-00-00'
    });
  });

  var setShowForm = function setShowForm(value) {
    var calcNode = document.querySelector('.calc');
    value ? calcNode.classList.add('-show-form') : calcNode.classList.remove('-show-form');
  };

  var tableBodyNode = document.querySelector('.calc-table__tbody');
  var addButtonRowNode = document.querySelector('.js-add-row-button');
  var checkoutButton = document.querySelector('.js-checkout-button');
  var cancelButton = document.querySelector('.js-cancel-button');
  var totalNode = document.querySelector('.js-calc-result-header');
  var priceListNode = document.querySelector('.js-price-list');
  var $tableBodyNode = $(tableBodyNode);
  var $totalNode = $(totalNode);
  var $priceListNode = $(priceListNode);
  var calcForm = $('form[name=calc-form]');
  var submitBtn = $('.order-form-submit');
  var successAlert = $('.alert-send-success');
  var errorAlert = $('.alert-send-error');
  checkoutButton.addEventListener('click', function () {
    if (Order.isValid()) {
      setShowForm(true);
    }
  });
  cancelButton.addEventListener('click', function () {
    return setShowForm(false);
  });
  tableBodyNode.addEventListener('click', function (e) {
    e.stopPropagation();
    var button = e.target.closest('.js-remove-row-button');
    var tr = e.target.closest('.calc-table__tr');
    if (!button) return;
    Order.removeItem(tr.dataset.id);
    drawTable();
    drawCalc();
  });
  addButtonRowNode.addEventListener('click', function () {
    Order.addItem();
    drawTable();
  });
  submitBtn.on('click', function (e) {
    e.preventDefault();
    submitForm(calcForm);
  });

  drawTable = function drawTable() {
    var rows = Order.items.map(function (item, id) {
      return createRowNode({
        id: id,
        item: item
      });
    });
    $(tableBodyNode).html(rows);
  };

  drawCalc = function drawCalc() {
    $totalNode.text("\u0418\u0442\u043E\u0433: ".concat(Order.total(), " \u0440."));
    $priceListNode.empty();
    $priceListNode.append(Order.weightList().map(createPriceListItemNode));
  };

  var submitForm = function submitForm(form) {
    var data = form.serializeArray(); // const formValid = validateForm(data, specs);
    // if (! formValid) {
    //     return;
    // }

    var json = {};
    data.forEach(function (_ref) {
      var name = _ref.name,
          value = _ref.value;
      return json[name] = value;
    });
    sendOrder(json).then(function (errors) {
      if (errors) {
        return sendFail(errors);
      }

      sendSuccess();
    }).catch(function () {
      sendFail();
    });
  };

  var sendFail = function sendFail(errors) {
    errorAlert.addClass('-active');
  };

  var sendSuccess = function sendSuccess(errors) {
    successAlert.addClass('-active');
  };

  var sendOrder = function sendOrder(json) {
    var url = 'http://localhost:8000/index.php?rest_route=/beta/v1/orders'; // const url = '/wp-json/beta/v1/orders';

    var disabledClass = 'button_base--disabled';
    var submitBtn = $('order-form-submit');
    submitBtn.addClass(disabledClass);
    return $.ajax({
      method: 'POST',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(json)
    }).then(function (res) {
      submitBtn.removeClass(disabledClass);

      if (res.errors) {
        return res.errors;
      }
    }).catch(function (e) {
      submitBtn.removeClass(disabledClass);
      throw e;
    });
  };

  Order.addItem();
  drawTable();
  drawCalc();
}); // Полифилы
// forEach IE 11

if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');

  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
} // closest IE 11


(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;else node = node.parentElement;
      }

      return null;
    };
  }
})(); // matches IE 11


(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
  }
})(); //Array.form IE 11


if (!Array.from) {
  Array.from = function (object) {
    'use strict';

    return [].slice.call(object);
  };
} // add row


function createTableTdNode(content) {
  var tableTd = document.createElement('div');
  tableTd.classList.add('calc-table__td');
  tableTd.appendChild(content);
  return tableTd;
}

;

function createSelectNode(_ref2) {
  var placeholder = _ref2.placeholder,
      options = _ref2.options,
      data = _ref2.data,
      key = _ref2.key,
      onChange = _ref2.onChange;
  var value = data[key];
  var select = document.createElement('select');
  var $select = $(select);
  select.classList.add('select', 'select_base');
  var selectedOption = options.find(function (o) {
    return o.id === value;
  });

  if (!selectedOption && placeholder) {
    var defaultOptionNode = document.createElement('option');
    defaultOptionNode.classList.add('select_base__option');
    defaultOptionNode.setAttribute('disabled', '');
    defaultOptionNode.setAttribute('selected', '');
    defaultOptionNode.innerText = placeholder;
    select.appendChild(defaultOptionNode);
  }

  options.forEach(function (option) {
    var optionNode = document.createElement('option');
    optionNode.classList.add('select_base__option');
    optionNode.innerText = option.label;
    optionNode.dataset.id = option.id;

    if (value === option.id) {
      optionNode.setAttribute('selected', '');
    }

    select.appendChild(optionNode);
  });
  $select.on('change', function (e) {
    var option = $select.find('option:selected');

    if (option) {
      var oldKey = data[key];
      data[key] = option.data('id');

      if (oldKey !== data[key]) {
        onChange();
      }
    }
  });
  return select;
}

;

function createInputNode(_ref3) {
  var placeholder = _ref3.placeholder,
      _ref3$data = _ref3.data,
      data = _ref3$data === void 0 ? {} : _ref3$data,
      key = _ref3.key,
      _ref3$min = _ref3.min,
      min = _ref3$min === void 0 ? 0 : _ref3$min,
      _ref3$max = _ref3.max,
      max = _ref3$max === void 0 ? Infinity : _ref3$max,
      _ref3$step = _ref3.step,
      step = _ref3$step === void 0 ? 0.05 : _ref3$step,
      _ref3$onChange = _ref3.onChange,
      onChange = _ref3$onChange === void 0 ? function () {} : _ref3$onChange;
  var div = document.createElement('div');
  div.classList.add('input_base');
  var input = document.createElement('input');
  var $input = $(input);
  input.setAttribute('type', 'number');
  input.setAttribute('min', min);
  input.setAttribute('max', max);
  input.setAttribute('step', step);
  input.setAttribute('placeholder', placeholder);
  input.classList.add('input_base__input'); // IMask(input, { mask: Number });

  input.value = data[key];
  $input.on('change', function (e) {
    if (inputValue === 'null') {
      return;
    }

    var inputValue = Number(input.value);
    var value = Math.max(Math.min(inputValue, max), min);
    input.value = value;
    data[key] = value;
    var isValid = value >= min && value <= max;

    if (isValid) {
      input.classList.remove('input_base__input--error');
    } else {
      input.classList.add('input_base__input--error');
    }

    onChange();
  });
  div.appendChild(input);
  return div;
}

;

var createButtonNode = function createButtonNode() {
  var button = document.createElement('button');
  button.classList.add('calc-table__button', 'js-remove-row-button');
  button.innerHTML = "\n    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 492 492\" style=\"enable-background:new 0 0 492 492;\" xml:space=\"preserve\"><path d=\"M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872\n        c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872\n        c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052\n        L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116\n        c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952\n        c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116\n        c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z\"/>\n      </svg>\n    ";
  return button;
};

function createPriceListItemNode(_ref4) {
  var product = _ref4.product,
      weight = _ref4.weight;
  var span = document.createElement('span');
  span.classList.add('calc-result-price');
  span.textContent = "".concat(product, ": ").concat(weight, " \u0433\u0440.");
  return span;
}

function createRowNode(_ref5) {
  var id = _ref5.id,
      item = _ref5.item;
  var tableTr = document.createElement('div');
  var selectMark = createSelectNode({
    placeholder: 'Марка',
    options: PRODUCTS,
    data: item,
    key: 'product',
    onChange: function onChange() {
      drawTable();
      drawCalc();
    }
  });
  var inputWidth = createInputNode({
    placeholder: 'Толщина',
    data: item,
    key: 'width',
    min: RESTRICTIONS.width.min,
    max: RESTRICTIONS.width.max,
    onChange: function onChange() {
      drawCalc();
    }
  });
  var inputLength = createInputNode({
    placeholder: 'Длина',
    data: item,
    key: 'length',
    min: RESTRICTIONS.length.min,
    max: RESTRICTIONS.length.max,
    onChange: function onChange() {
      drawCalc();
    }
  });
  var inputWeight = createInputNode({
    placeholder: 'Вес',
    data: item,
    key: 'weight',
    min: RESTRICTIONS.weight.min,
    max: RESTRICTIONS.weight.max,
    onChange: function onChange() {
      drawCalc();
    }
  });
  var selectUnitOfMeasure = createSelectNode({
    placeholder: 'ед. изм',
    options: DIMENTIONS,
    data: item,
    key: 'dimention',
    onChange: function onChange() {
      drawTable();
      drawCalc();
    }
  });
  var buttonClose = createButtonNode();
  tableTr.dataset.id = id;
  var elemtsArr = [selectMark, inputWidth, item.dimention === 'length' ? inputLength : inputWeight, selectUnitOfMeasure];
  tableTr.classList.add('calc-table__tr');
  elemtsArr.forEach(function (elem) {
    return tableTr.appendChild(createTableTdNode(elem));
  });
  tableTr.appendChild(buttonClose);
  return tableTr;
}

;