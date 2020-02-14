//import IMask from './node_modules/imask/dist/imask.js';

$(document).ready(function() {
  svg4everybody({});

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

  // add row
  const createTableTdNode = content => {
    const tableTd = document.createElement('div');
    tableTd.classList.add('calc-table__td');
    tableTd.appendChild(content);

    return tableTd;
  };

  const createSelectNode = (defaultValue, options) => {
    const select = document.createElement('select');
    select.classList.add('select', 'select_base');

    if (defaultValue) {
      const defaultOptionNode = document.createElement('option');
      defaultOptionNode.classList.add('select_base__option');
      defaultOptionNode.setAttribute('disabled', '');
      defaultOptionNode.setAttribute('selected', '');
      defaultOptionNode.innerText = defaultValue;

      select.appendChild(defaultOptionNode);
    }

    options.forEach(option => {
      const optionNode = document.createElement('option');
      optionNode.classList.add('select_base__option');
      optionNode.innerText = option;

      select.appendChild(optionNode);
    });

    return select;
  };

  const createInputNode = placeholder => {
    const div = document.createElement('div');
    div.classList.add('input_base');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);
    input.classList.add('input_base__input');

    IMask(input, { mask: Number });

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

  const createRowNode = () => {
    const tableTr = document.createElement('div');
    const selectMark = createSelectNode('Марка', ['Ад 99,99', 'АдСи 92,5']);
    const inputThickness = createInputNode('Толщина');
    const inputLong = createInputNode('Длинна');
    const selectUnitOfMeasure = createSelectNode('ед. изм', ['м', 'гр']);
    const buttonClose = createButtonNode();

    const elemtsArr = [
      selectMark,
      inputThickness,
      inputLong,
      selectUnitOfMeasure
    ];

    tableTr.classList.add('calc-table__tr');

    elemtsArr.forEach(elem => tableTr.appendChild(createTableTdNode(elem)));
    tableTr.appendChild(buttonClose);

    return tableTr;
  };

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

  checkoutButton.addEventListener('click', () => setShowForm(true));
  cancelButton.addEventListener('click', () => setShowForm(false));

  tableBodyNode.addEventListener('click', e => {
    e.stopPropagation();
    const button = e.target.closest('.js-remove-row-button');
    const tr = e.target.closest('.calc-table__tr');

    if (!button) return;

    tr.remove();
  });

  addButtonRowNode.addEventListener('click', () => {
    tableBodyNode.appendChild(createRowNode());
  });
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
