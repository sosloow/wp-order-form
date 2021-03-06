<div id="order-form">
  <div class="wrapper">
    <header class="header"></header>
    <div class="content">
      <div class="calc">
        <div class="calc__container">
          <div class="calc__wrap">
            <div class="calc__content">
              <div class="calc__requisition"><span class="calc__title">Оформление заявки</span>
                <div class="calc__alert">
                  <div class="alert alert-send alert-send-error">
                    <div class="alert__container">
                      <div class="alert__wrap"><span class="alert__text">Произошла ошибка при отправке заявки.</span></div>
                    </div>
                  </div>
                </div>
                <form class="calc-form" name="calc-form">
                  <div class="calc-form__row">
                    <div class="calc-form__input">
                      <div class="input_base"><span class="input_base__label">Имя:</span>
                        <input class="input_base__input" type="text" name="name" required>
                      </div>
                    </div>
                  </div>
                  <div class="calc-form__row">
                    <div class="calc-form__input">
                      <div class="input_base"><span class="input_base__label">Номер для связи</span>
                        <input class="input_base__input js-input-phone-mask" type="text" name="phone" required>
                      </div>
                    </div>
                  </div>
                  <div class="calc-form__row">
                    <div class="calc-form__input">
                      <div class="input_base"><span class="input_base__label">Email (необязательно)</span>
                        <input class="input_base__input" type="text" name="email">
                      </div>
                    </div>
                  </div>
                  <div class="calc-form__buttons">
                    <div class="calc-form__button">
                      <button class="button button_base button_base--disabled order-form-submit" type="button">Отправить</button>
                    </div>
                    <div class="calc-form__button">
                      <button class="button button_base js-cancel-button button_base--gray" type="button">Отмена</button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="calc__calculator">
                <div class="calc__alert">
                  <div class="alert alert-send alert-send-success">
                    <div class="alert__container">
                      <div class="alert__wrap"><span class="alert__text">Заявка успешно отправленa!</span></div>
                    </div>
                  </div>
                  <div class="alert">
                    <div class="alert__container">
                      <div class="alert__wrap"><span class="alert__text">Внимание! Минимальный заказ - 100 гр.</span></div>
                    </div>
                  </div>
                </div>
                <div class="calc-table">
                  <div class="calc-table__thead">
                    <div class="calc-table__tr">
                      <div class="calc-table__td"><span>Марка</span></div>
                      <div class="calc-table__td"><span>Диаметр, мм</span></div>
                      <div class="calc-table__td length-weight-header"><span>Количество</span></div>
                      <div class="calc-table__td"><span>Измерение</span></div>
                    </div>
                  </div>
                  <div class="calc-table__tbody">
                  </div>
                </div>
                <div class="calc__button -add-row">
                  <button class="button button_base js-add-row-button" type="button">Добавить строку</button>
                </div>
                <div class="calc__footer">
                  <div class="calc-result">
                    <span class="calc-result-header js-calc-result-header">Итог: 0р</span>
                    <span class="js-price-list calc-result-price-list"></span>
                  </div>
                  <div class="from__button -checkout">
                    <button class="button button_base button_base--disabled js-checkout-button" type="button">Оформить заявку</button>
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
</div>
