<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <meta charset="utf-8">
    <title>Form</title><!--[if IE]>
    <meta http-equiv="X-UA-Compatible" content="IE = edge"><![endif]-->
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="keywords" content="">
    <link rel="stylesheet" type="text/css" href="static/css/styles.min.css"><!--[if lt IE 9]>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script><![endif]-->
  </head>
  <body>
    <div class="wrapper">
      <header class="header"></header>
      <div class="content">
        <div class="calc">
          <div class="calc__container">
            <div class="calc__wrap">
              <div class="calc__content">
                <div class="calc__requisition"><span class="calc__title">Оформление заявки</span>
                  <form class="calc-form">
                    <div class="calc-form__row">
                      <div class="calc-form__input">
                                <div class="input_base"><span class="input_base__label">Имя:</span>
                                  <input class="input_base__input" type="text">
                                </div>
                      </div>
                    </div>
                    <div class="calc-form__row">
                      <div class="calc-form__input">
                                <div class="input_base"><span class="input_base__label">Номер для связи</span>
                                  <input class="input_base__input js-input-phone-mask" type="text">
                                </div>
                      </div>
                    </div>
                    <div class="calc-form__row">
                      <div class="calc-form__input">
                                <div class="input_base"><span class="input_base__label">Email (необязательно)</span>
                                  <input class="input_base__input" type="text">
                                </div>
                      </div>
                    </div>
                    <div class="calc-form__buttons">
                      <div class="calc-form__button">
                                <button class="button button_base" type="button">Отправить</button>
                      </div>
                      <div class="calc-form__button">
                                <button class="button button_base js-cancel-button button_base--gray" type="button">Отмена</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="calc__calculator">
                  <div class="calc__alert">
                            <div class="alert">
                              <div class="alert__container">
                                <div class="alert__wrap"><span class="alert__text">Внимание! Минимальный заказ - 100 гр.</span></div>
                              </div>
                            </div>
                  </div>
                  <div class="calc-table">
                    <div class="calc-table__thead">
                      <div class="calc-table__tr">
                        <div class="calc-table__td"><span>label1</span></div>
                        <div class="calc-table__td"><span>label2</span></div>
                        <div class="calc-table__td"><span>label3</span></div>
                        <div class="calc-table__td"><span>label4</span></div>
                      </div>
                    </div>
                    <div class="calc-table__tbody">
                      <div class="calc-table__tr">
                        <div class="calc-table__td">
                                  <select class="select select_base">
                                    <option class="select_base__option" selected disabled>Марка</option>
                                    <option class="select_base__option">Ад 99,99</option>
                                    <option class="select_base__option">АдСи 92,5</option>
                                  </select>
                        </div>
                        <div class="calc-table__td">
                                  <div class="input_base">
                                    <input class="input_base__input js-input-number-mask" type="text" placeholder="Толщина">
                                  </div>
                        </div>
                        <div class="calc-table__td">
                                  <div class="input_base">
                                    <input class="input_base__input js-input-number-mask" type="text" placeholder="Длинна">
                                  </div>
                        </div>
                        <div class="calc-table__td">
                                  <select class="select select_base">
                                    <option class="select_base__option" selected disabled>ед. изм</option>
                                    <option class="select_base__option">м</option>
                                    <option class="select_base__option">гр</option>
                                  </select>
                        </div>
                        <div class="calc-table__button js-remove-row-button"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve">
	<path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
			c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
			c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
			L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
			c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
			c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
			c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
</svg>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="calc__button -add-row">
                            <button class="button button_base js-add-row-button" type="button">Добавить строку</button>
                  </div>
                  <div class="calc__footer">
                    <div class="calc-result"><span class="calc-result-header">Итог: 50 000р</span><span class="calc-result-price">Ад 99,99: 35 гр.</span><span class="calc-result-price">АдСи 92,5: 45 гр.</span></div>
                    <div class="from__button -checkout">
                              <button class="button button_base js-checkout-button" type="button">Оформить заказ</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer"></footer>
    </div>
    <script src="static/js/jquery-3.3.1.min.js"></script>
    <script src="static/js/libs.min.js"></script>
    <script src="static/js/main.js"></script>
  </body>
</html>