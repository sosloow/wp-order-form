//import IMask from './node_modules/imask/dist/imask.js';

let drawTable, drawCalc;

const PRODUCTS = [{
  id: 'ad99',
  label: 'Ад 99,99',
}, {
  id: 'adsi92',
  label: 'АдСи 92,5',
}];

const DIMENTIONS = [{
  id: 'length',
  label: 'м',
}, {
  id: 'weight',
  label: 'гр',
}];

WIDTH_WEIGHTS = [{
  "width": 0.5,
  "weight": 2.06
},
{
  "width": 0.6,
  "weight": 2.96
},
{
  "width": 0.7,
  "weight": 4.03
},
{
  "width": 0.8,
  "weight": 5.27
},
{
  "width": 0.9,
  "weight": 6.67
},
{
  "width": 1,
  "weight": 8.24
},
{
  "width": 1.1,
  "weight": 9.97
},
{
  "width": 1.2,
  "weight": 11.86
},
{
  "width": 1.3,
  "weight": 13.93
},
{
  "width": 1.4,
  "weight": 16.16
},
{
  "width": 1.5,
  "weight": 18.55
},
{
  "width": 1.6,
  "weight": 21.1
},
{
  "width": 1.7,
  "weight": 23.82
},
{
  "width": 1.8,
  "weight": 26.71
},
{
  "width": 1.9,
  "weight": 29.75
},
{
  "width": 2,
  "weight": 32.97
},
{
  "width": 2.1,
  "weight": 36.35
},
{
  "width": 2.2,
  "weight": 39.89
},
{
  "width": 2.3,
  "weight": 43.6
},
{
  "width": 2.4,
  "weight": 47.48
},
{
  "width": 2.5,
  "weight": 51.52
}];

const PRICES = [{
  width: 0.5,
  price: 70,
}, {
  width: 0.75,
  price: 70,
}, {
  width: 1.1,
  price: 70,
}, {
  width: Infinity,
  price: 65,
}];

const RESTRICTIONS = {
  width: {
    min: 0.5,
    max: 2,
  },
  weight: {
    min: 1,
    max: 10000,
  },
  length: {
    min: 0.01,
    max: 100,
  },
};

const MIN_ORDER_WEIGHT = 100;

const Order = {
  items: [],

  addItem() {
    this.items.push({
      product: null,
      width: null,
      length: null,
      weight: null,
      // product: 'ad99',
      // width: 1,
      // length: 1,
      // weight: null,
      dimention: 'length',
    });
  },

  removeItem(index) {
    this.items.splice(Number(index), 1);

    if (this.items.length < 1) {
      this.addItem();
    }
  },

  total() {
    const total = this.items.reduce((sum, item) => {
      const priceDict = PRICES.find((p) => item.width < p.width);
      const price = (item.width && priceDict ? priceDict.price : 0);
      const measure = item.dimention === 'weight'
        ? item.weight
        : item.length * 100;

      return sum + price * (measure || 0);
    }, 0);

    return Math.round(total * 100) / 100;
  },

  weightList() {
    return PRODUCTS.map((product) => {
      const weight = this.items.reduce((sum, i) => {
        if (i.product !== product.id) {
          return sum;
        }

        const weight = i.dimention === 'weight'
          ? i.weight || 0
          : (i.length || 0) * 100;

        return sum + weight;
      }, 0);

      return {
        product: product.label,
        weight,
      };
    })
    .filter((item) => item.weight);
  },

  totalWeight() {
    const weight = this.weightList().reduce((sum, i) => {
      return sum + i.weight;
    }, 0);

    return Math.round(weight * 100) / 100;
  },

  isValid() {
    return this.items.reduce((isValid, item) => {
      const requiredFields = [
        'product',
        'width',
        item.dimention,
      ];

      const itemValid = requiredFields.reduce((isValid, field) => {
        const validRange = RESTRICTIONS[field] ? item[field] >= RESTRICTIONS[field].min && item[field] <= RESTRICTIONS[field].max
          : true;

        return isValid && validRange && Boolean(item[field]);
      }, true);

      return isValid && itemValid;
    }, true);
  }
};


$(document).ready(function() {
  // init input mask
  const inputsNumberMask = document.querySelectorAll('.js-input-number-mask');
  const inputsPhoneMask = document.querySelectorAll('.js-input-phone-mask');

  inputsNumberMask.forEach(elem => {
    IMask(elem, { mask: Number });
  });

  inputsPhoneMask.forEach(elem => {
    IMask(elem, {
      mask: '+{7}(000)000-00-00'
    });
  });


  const setShowForm = value => {
    const calcNode = document.querySelector('.calc');

    value
      ? calcNode.classList.add('-show-form')
      : calcNode.classList.remove('-show-form');
  };

  const tableBodyNode = document.querySelector('.calc-table__tbody');
  const addButtonRowNode = document.querySelector('.js-add-row-button');
  const checkoutButton = document.querySelector('.js-checkout-button');
  const cancelButton = document.querySelector('.js-cancel-button');
  const totalNode = document.querySelector('.js-calc-result-header');
  const priceListNode = document.querySelector('.js-price-list');

  const $tableBodyNode = $(tableBodyNode);
  const $totalNode = $(totalNode);
  const $priceListNode = $(priceListNode);
  const calcForm = $('form[name=calc-form]');
  const submitBtn = $('.order-form-submit');
  const successAlert = $('.alert-send-success');
  const errorAlert = $('.alert-send-error');

  checkoutButton.addEventListener('click', () => {
    if (Order.isValid()) {
      setShowForm(true);
    }
  });
  cancelButton.addEventListener('click', () => setShowForm(false));

  tableBodyNode.addEventListener('click', e => {
    e.stopPropagation();
    const button = e.target.closest('.js-remove-row-button');
    const tr = e.target.closest('.calc-table__tr');

    if (!button) return;

    Order.removeItem(tr.dataset.id);
    drawTable();
    drawCalc();
  });

  addButtonRowNode.addEventListener('click', () => {
    Order.addItem();
    drawTable();
  });

  submitBtn.on('click', (e) => {
    e.preventDefault();

    submitForm(calcForm);
  });

  drawTable = () => {
    const rows = Order.items.map((item, id) => {
      return createRowNode({
        id,
        item,
      });
    });

    $(tableBodyNode).html(rows);
  }

  drawCalc = () => {
    $totalNode.text(`Итог: ${Order.total()} р.`);

    $priceListNode.empty();

    $priceListNode.append(Order.weightList().map(createPriceListItemNode));
  }

  const sendOrder = (json) => {
    const url = '/index.php?rest_route=/beta/v1/orders';
    // const url = '/wp-json/beta/v1/orders';
    const disabledClass = 'button_base--disabled';
    const submitBtn = $('order-form-submit');
    submitBtn.addClass(disabledClass);

    return $.ajax({
      method: 'POST',
      url,
      contentType : 'application/json',
      data: JSON.stringify({
        name: json.name,
        phone: json.phone,
        email: json.email,
        items: Order.items,
      }),
    })
    .then((res) => {
      submitBtn.removeClass(disabledClass);

      if (res.errors) {
        return res.errors;
      }
    })
    .catch((e) => {
      submitBtn.removeClass(disabledClass);

      throw e;
    });
  }

  const submitForm = (form) => {
    const data = form.serializeArray();

    // const formValid = validateForm(data, specs);

    // if (! formValid) {
    //     return;
    // }

    const json = {};
    data.forEach(({name, value}) => json[name] = value);

    return sendOrder(json)
    .then((errors) => {
      if (errors) {
        return sendFail(errors);
      }

      sendSuccess();
    })
    .catch(() => {
      sendFail();
    });
  }

  const sendFail = (errors) => {
    errorAlert.addClass('-active');
  }

  const sendSuccess = (errors) => {
    setShowForm(false);

    successAlert.addClass('-active');
  }

  Order.addItem();
  drawTable();
  drawCalc();
});

// Полифилы

// forEach IE 11
if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// closest IE 11
(function() {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(css) {
      var node = this;
      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();

// matches IE 11
(function() {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
})();

//Array.form IE 11
if (!Array.from) {
  Array.from = function(object) {
    'use strict';
    return [].slice.call(object);
  };
}


// add row
function createTableTdNode(content) {
  const tableTd = document.createElement('div');
  tableTd.classList.add('calc-table__td');
  tableTd.appendChild(content);

  return tableTd;
};

function createSelectNode({placeholder, options, data, key, onChange}) {
  const value = data[key];

  const select = document.createElement('select');
  const $select = $(select);
  select.classList.add('select', 'select_base');

  const selectedOption = options.find(o => o.id === value);

  if (! selectedOption && placeholder) {
    const defaultOptionNode = document.createElement('option');
    defaultOptionNode.classList.add('select_base__option');
    defaultOptionNode.setAttribute('disabled', '');
    defaultOptionNode.setAttribute('selected', '');
    defaultOptionNode.innerText = placeholder;

    select.appendChild(defaultOptionNode);
  }

  options.forEach(option => {
    const optionNode = document.createElement('option');
    optionNode.classList.add('select_base__option');

    optionNode.innerText = option.label;
    optionNode.dataset.id = option.id;
    if (value === option.id) {
      optionNode.setAttribute('selected', '');
    }

    select.appendChild(optionNode);
  });

  $select.on('change', (e) => {
    const option = $select.find('option:selected');

    if (option) {
      const oldKey = data[key];
      data[key] = option.data('id');

      if (oldKey !== data[key]) {
        onChange();
      }
    }
  });

  return select;
};

function createInputNode({
  placeholder,
  data = {},
  key,
  min = 0,
  max = Infinity,
  step = 0.05,
  onChange = () => {},
}) {
  const div = document.createElement('div');
  div.classList.add('input_base');
  const input = document.createElement('input');
  const $input = $(input);
  input.setAttribute('type', 'number');
  input.setAttribute('min', min);
  input.setAttribute('max', max);
  input.setAttribute('step', step);
  input.setAttribute('placeholder', placeholder);
  input.classList.add('input_base__input');

  // IMask(input, { mask: Number });

  input.value = data[key];
  $input.on('change', (e) => {
    if (inputValue === 'null') {
      return;
    }

    const inputValue = Number(input.value);

    const value = Math.max(Math.min(inputValue, max), min);

    input.value = value;
    data[key] = value;

    const isValid = value >= min && value <= max;
    if (isValid) {
      input.classList.remove('input_base__input--error');
    } else {
      input.classList.add('input_base__input--error');
    }

    onChange();
  });

  div.appendChild(input);
  return div;
};

const createButtonNode = () => {
  const button = document.createElement('button');
  button.classList.add('calc-table__button', 'js-remove-row-button');

  button.innerHTML = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve"><path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
        c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
        c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
        L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
        c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
        c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
        c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
      </svg>
    `;

  return button;
};

function createPriceListItemNode({product, weight}) {
  const span = document.createElement('span');

  span.classList.add('calc-result-price');
  span.textContent = `${product}: ${weight} гр.`;

  return span;
}

function createRowNode({id, item}) {
  const tableTr = document.createElement('div');

  const selectMark = createSelectNode({
    placeholder: 'Марка',
    options: PRODUCTS,
    data: item,
    key: 'product',
    onChange() {
      drawTable();
      drawCalc();
    },
  });

  const inputWidth = createInputNode({
    placeholder: 'Толщина',
    data: item,
    key: 'width',
    min: RESTRICTIONS.width.min,
    max: RESTRICTIONS.width.max,
    onChange() {
      drawCalc();
    },
  });
  const inputLength = createInputNode({
    placeholder: 'Длина',
    data: item,
    key: 'length',
    min: RESTRICTIONS.length.min,
    max: RESTRICTIONS.length.max,
    onChange() {
      drawCalc();
    },
  });
  const inputWeight = createInputNode({
    placeholder: 'Вес',
    data: item,
    key: 'weight',
    min: RESTRICTIONS.weight.min,
    max: RESTRICTIONS.weight.max,
    onChange() {
      drawCalc();
    },
  });
  const selectUnitOfMeasure = createSelectNode({
    placeholder: 'ед. изм',
    options: DIMENTIONS,
    data: item,
    key: 'dimention',
    onChange() {
      drawTable();
      drawCalc();
    },
  });
  const buttonClose = createButtonNode();

  tableTr.dataset.id = id;

  const elemtsArr = [
    selectMark,
    inputWidth,
    item.dimention === 'length' ? inputLength : inputWeight,
    selectUnitOfMeasure
  ];

  tableTr.classList.add('calc-table__tr');

  elemtsArr.forEach(elem => tableTr.appendChild(createTableTdNode(elem)));
  tableTr.appendChild(buttonClose);

  return tableTr;
};
