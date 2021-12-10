import $ from 'jquery';

// minimum interval between getting focus and clicking the mouse 50 milliseconds
const INTERVAL = 50;

const EMPTY_CALENDAR_HEIGHT = 129;
const ROW_CALENDAR_HEIGHT = 40;
const FILTER_ROW_CALENDAR_HEIGHT = 32;

const DURATION_OPEN = 500;

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const SHORT_MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function reformatDate(_) {
  return `${_[8]}${_[9]}.${_[5]}${_[6]}.${_[0]}${_[1]}${_[2]}${_[3]}`;
}

function handleExpandMousedown(event) {
  if ($(event.delegateTarget).hasClass('js-datepicker__expand_arrival')) {
    event.data.datepicker.setActiveDate('arrival');
  } else if ($(event.delegateTarget).hasClass('js-datepicker__expand_departure')) {
    event.data.datepicker.setActiveDate('departure');
  }

  if (Math.abs(event.timeStamp - event.data.datepicker.timeFocus) < INTERVAL) {
    return;
  }

  $(event.delegateTarget).toggleClass('datepicker__expand_open');
}

function handleExpandFocusin(event) {
  $(event.delegateTarget).removeClass('datepicker__expand_keeping-focus');

  event.data.datepicker.setTimeFocus(event.timeStamp);

  $(event.delegateTarget).addClass('datepicker__expand_open');
}

function handleExpandFocusout(event) {
  if ($(event.delegateTarget).hasClass('datepicker__expand_keeping-focus')) {
    $(event.delegateTarget).removeClass('datepicker__expand_keeping-focus');
    return;
  }

  $(event.delegateTarget).removeClass('datepicker__expand_open');
}

function handleMousedown(event) {
  if (event.data.datepicker.$datepicker.hasClass('datepicker_open')) {
    if (
      event.data.datepicker.activeDate === 'arrival'
      && event.data.datepicker.$datepicker__expand_arrival.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_arrival.addClass('datepicker__expand_keeping-focus');
    } else if (
      event.data.datepicker.activeDate === 'departure'
      && event.data.datepicker.$datepicker__expand_departure.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_departure.addClass('datepicker__expand_keeping-focus');
    } else if (
      event.data.datepicker.activeDate === 'both'
      && event.data.datepicker.$datepicker__expand_filter.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_filter.addClass('datepicker__expand_keeping-focus');
    }
  }

  if (event.data.datepicker.$datepicker__expands.hasClass('datepicker__expand_open')) {
    event.data.datepicker.open();
  } else {
    event.data.datepicker.close();
  }

  event.data.datepicker.$datepicker.addClass('datepicker_pressed');
}

function handleFocusin(event) {
  event.data.datepicker.open();
}

function handleFocusout(event) {
  if (!(event.data.datepicker.$datepicker__expands.hasClass('datepicker__expand_open'))) {
    event.data.datepicker.close();
  } /* else if (
    event.data.datepicker.activeDate === 'arrival'
    && event.data.datepicker.$datepicker__expand_arrival.hasClass('datepicker__expand_open')
  ) {
    event.data.datepicker.$datepicker__expand_arrival.trigger('focus');
  } else if (
    event.data.datepicker.activeDate === 'departure'
    && event.data.datepicker.$datepicker__expand_departure.hasClass('datepicker__expand_open')
  ) {
    event.data.datepicker.$datepicker__expand_departure.trigger('focus');
  } */
}

function handleMouseup(event) {
  if (event.data.datepicker.$datepicker.hasClass('datepicker_pressed')) {
    if (
      event.data.datepicker.activeDate === 'arrival'
      && event.data.datepicker.$datepicker__expand_arrival.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_arrival.trigger('focus');
    } else if (
      event.data.datepicker.activeDate === 'departure'
      && event.data.datepicker.$datepicker__expand_departure.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_departure.trigger('focus');
    } else if (
      event.data.datepicker.activeDate === 'both'
      && event.data.datepicker.$datepicker__expand_filter.hasClass('datepicker__expand_open')
    ) {
      event.data.datepicker.$datepicker__expand_filter.trigger('focus');
    }
  }
  event.data.datepicker.$datepicker.removeClass('datepicker_pressed');
}

function handleButtonMousedown(event) {
  if ($(event.target).hasClass('js-datepicker__button_action_month-plus')) {
    event.data.datepicker.calendarMonth.setMonth(
      event.data.datepicker.calendarMonth.getMonth() + 1,
    );
  } else if (
    $(event.target).hasClass('js-datepicker__button_action_month-minus')
    && event.data.datepicker.calendarMonth > event.data.datepicker.todayMonth
  ) {
    event.data.datepicker.calendarMonth.setMonth(
      event.data.datepicker.calendarMonth.getMonth() - 1,
    );
  } else if ($(event.target).hasClass('js-datepicker__button_action_clear')) {
    event.data.datepicker.calendarMonth.setFullYear(
      event.data.datepicker.todayMonth.getFullYear(),
      event.data.datepicker.todayMonth.getMonth(),
    );
  }

  event.data.datepicker.updateCalendar();
}

function handleCellMouseover(event) {
  if ($(event.target).hasClass('datepicker__cell_selected')) {
    return;
  }

  const targetDate = new Date(event.target.dataset.date);
  targetDate.setHours(0, 0, 0);

  if (event.data.datepicker.activeDate === 'arrival') {
    if (event.data.datepicker.$datepicker__input_departure.val()) {
      if (
        targetDate < event.data.datepicker.departureDate
        && targetDate.getTime() >= event.data.datepicker.today.getTime()
      ) {
        $(event.target).addClass('datepicker__cell_highlight');
      }
    } else if (targetDate.getTime() >= event.data.datepicker.today.getTime()) {
      $(event.target).addClass('datepicker__cell_highlight');
    }
  } else if (event.data.datepicker.activeDate === 'departure') {
    if (event.data.datepicker.$datepicker__input_arrival.val()) {
      if (targetDate > event.data.datepicker.arrivalDate) {
        $(event.target).addClass('datepicker__cell_highlight');
      }
    } else if (targetDate > event.data.datepicker.today) {
      $(event.target).addClass('datepicker__cell_highlight');
    }
  } else if (targetDate.getTime() >= event.data.datepicker.today.getTime()) {
    $(event.target).addClass('datepicker__cell_highlight');
  }

  /*
  if (targetDate > event.data.datepicker.today) {
    console.log('БУДУЩЕЕ');
  } else if (event.data.datepicker.today > targetDate) {
    console.log('ПРОШЛОЕ');
  } else {
    console.log('НАСТОЯЩЕЕ');
  }

  console.log(targetDate);

  console.log(event.data.datepicker.today);
  */

  // $(event.target).addClass('datepicker__cell_highlight');
}

function handleCellMouseout(event) {
  $(event.target).removeClass('datepicker__cell_highlight');
}

function handleCellMousedown(event) {
  if (!($(event.target).hasClass('datepicker__cell_highlight'))) {
    return;
  }

  if (event.data.datepicker.activeDate === 'arrival') {
    event.data.datepicker.updateDate({ date: 'arrival', value: event.target.dataset.date });
    /*
    const arrivalValue = event.data.datepicker.$datepicker__input_arrival.val();
    if (arrivalValue) {
      $(`td[data-date="${arrivalValue}"`, event.data.datepicker.$datepicker__calendar)
      .removeClass('datepicker__cell_selected');
    }

    $(event.target).addClass('datepicker__cell_selected');

    event.data.datepicker.arrivalDate.setTime(Date.parse(event.target.dataset.date));
    event.data.datepicker.arrivalDate.setHours(0, 0, 0);

    event.data.datepicker.$datepicker__input_arrival.val(event.target.dataset.date);
    */
    $('.js-datepicker__value', event.data.datepicker.$datepicker__expand_arrival).text(reformatDate(event.target.dataset.date));

    event.data.datepicker.setActiveDate('departure');
    event.data.datepicker.$datepicker__expand_arrival.removeClass('datepicker__expand_open');
    event.data.datepicker.$datepicker__expand_departure.addClass('datepicker__expand_open');
  } else if (event.data.datepicker.activeDate === 'departure') {
    event.data.datepicker.updateDate({ date: 'departure', value: event.target.dataset.date });
    /*
    const departureValue = event.data.datepicker.$datepicker__input_departure.val();
    if (departureValue) {
      $(`td[data-date="${departureValue}"`, event.data.datepicker.$datepicker__calendar)
      .removeClass('datepicker__cell_selected');
    }

    $(event.target).addClass('datepicker__cell_selected');

    event.data.datepicker.departureDate.setTime(Date.parse(event.target.dataset.date));
    event.data.datepicker.departureDate.setHours(0, 0, 0);

    event.data.datepicker.$datepicker__input_departure.val(event.target.dataset.date);
    */
    $('.js-datepicker__value', event.data.datepicker.$datepicker__expand_departure).text(reformatDate(event.target.dataset.date));

    event.data.datepicker.setActiveDate('arrival');
    event.data.datepicker.$datepicker__expand_departure.removeClass('datepicker__expand_open');
    event.data.datepicker.$datepicker__expand_arrival.addClass('datepicker__expand_open');
  } else {
    const targetDate = new Date(event.target.dataset.date);
    targetDate.setHours(0, 0, 0);

    if (event.data.datepicker.lastSelectedDate === '') {
      /*
      const arrivalValue = event.data.datepicker.$datepicker__input_arrival.val();
      if (arrivalValue) {
        $(`td[data-date="${arrivalValue}"`, event.data.datepicker.$datepicker__calendar)
        .removeClass('datepicker__cell_selected');
      }

      $(event.target).addClass('datepicker__cell_selected');

      event.data.datepicker.arrivalDate.setTime(Date.parse(event.target.dataset.date));
      event.data.datepicker.arrivalDate.setHours(0, 0, 0);

      event.data.datepicker.$datepicker__input_arrival.val(event.target.dataset.date);
      */

      event.data.datepicker.updateDate({ date: 'arrival', value: event.target.dataset.date });

      $('.js-datepicker__value', event.data.datepicker.$datepicker__expand_filter).text(
        `${event.data.datepicker.arrivalDate.getDate()} ${SHORT_MONTHS[event.data.datepicker.arrivalDate.getMonth()]}`,
      );

      event.data.datepicker.setLastSelectedDate('arrival');
    } else {
      if (event.data.datepicker.lastSelectedDate === 'departure') {
        if (targetDate < event.data.datepicker.departureDate) {
          event.data.datepicker.updateDate({ date: 'arrival', value: event.target.dataset.date });

          event.data.datepicker.setLastSelectedDate('arrival');
        } else {
          event.data.datepicker.updateDate({ date: 'arrival', value: event.data.datepicker.$datepicker__input_departure.val() });
          event.data.datepicker.updateDate({ date: 'departure', value: event.target.dataset.date });

          $(`td[data-date=${event.data.datepicker.$datepicker__input_arrival.val()}]`, event.data.datepicker.$datepicker__calendar).addClass('datepicker__cell_selected');

          event.data.datepicker.setLastSelectedDate('departure');
        }
      } else if (targetDate > event.data.datepicker.arrivalDate) {
        event.data.datepicker.updateDate({ date: 'departure', value: event.target.dataset.date });

        event.data.datepicker.setLastSelectedDate('departure');
      } else {
        event.data.datepicker.updateDate({ date: 'departure', value: event.data.datepicker.$datepicker__input_arrival.val() });
        event.data.datepicker.updateDate({ date: 'arrival', value: event.target.dataset.date });

        $(`td[data-date=${event.data.datepicker.$datepicker__input_departure.val()}]`, event.data.datepicker.$datepicker__calendar).addClass('datepicker__cell_selected');

        event.data.datepicker.setLastSelectedDate('arrival');
      }

      $('.js-datepicker__value', event.data.datepicker.$datepicker__expand_filter).text(
        `${event.data.datepicker.arrivalDate.getDate()} ${SHORT_MONTHS[event.data.datepicker.arrivalDate.getMonth()]} - ${event.data.datepicker.departureDate.getDate()} ${SHORT_MONTHS[event.data.datepicker.departureDate.getMonth()]}`,
      );
    }
  }

  $(event.target).addClass('datepicker__cell_selected');
}

class Datepicker {
  constructor(datepicker) {
    this.$datepicker = $(datepicker);
    this.$datepicker__input_arrival = $('.js-datepicker__input_arrival', this.$datepicker);
    this.$datepicker__input_departure = $('.js-datepicker__input_departure', this.$datepicker);
    this.$datepicker__drop = $('.js-datepicker__drop', this.$datepicker);
    this.$datepicker__down = $('.js-datepicker__down', this.$datepicker);
    this.$datepicker__expands = $('.js-datepicker__expand', this.$datepicker__drop);
    this.$datepicker__expand_arrival = $('.js-datepicker__expand_arrival', this.$datepicker__drop);
    this.$datepicker__expand_departure = $('.js-datepicker__expand_departure', this.$datepicker__drop);
    this.$datepicker__expand_filter = $('.js-datepicker__expand_filter', this.$datepicker__drop);
    this.$datepicker__monthYear = $('.js-datepicker__month-year', this.$datepicker__down);
    this.$datepicker__calendar = $('.js-datepicker__calendar', this.$datepicker__down);
    this.$datepicker__buttons = $('.js-datepicker__button', this.$datepicker__down);

    this.name = datepicker.dataset.name;
    this.zIndex = 2 * datepicker.dataset.zIndex - 1;

    this.calendarHeight = EMPTY_CALENDAR_HEIGHT;
    if (this.$datepicker.hasClass('js-datepicker_filter')) {
      this.rowCalendarHeight = FILTER_ROW_CALENDAR_HEIGHT;
    } else {
      this.rowCalendarHeight = ROW_CALENDAR_HEIGHT;
    }
    this.demo = this.$datepicker.hasClass('js-datepicker_demo');

    this.timeFocus = 0;

    this.activeDate = 'both';
    this.lastSelectedDate = '';

    this.arrivalDate = new Date(this.$datepicker__input_arrival.val());
    this.departureDate = new Date(this.$datepicker__input_departure.val());

    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.todayMonth = new Date(now.getFullYear(), now.getMonth());
    this.calendarMonth = new Date(now.getFullYear(), now.getMonth());
  }

  init() {
    this.$datepicker__monthYear.text(`${MONTHS[this.calendarMonth.getMonth()]} ${this.calendarMonth.getFullYear()}`);
    const calendarHTML = this.getCalendarHTMLandSetCalendarHeight();
    if (this.demo) {
      this.setCalendarHeight();
    }
    this.$datepicker__calendar.html(calendarHTML);

    this.$datepicker__expands.on(
      `mousedown.datepicker__expand.${this.name}`,
      null,
      { datepicker: this },
      handleExpandMousedown,
    );

    this.$datepicker__expands.on(
      `focusin.datepicker__expand.${this.name}`,
      null,
      { datepicker: this },
      handleExpandFocusin,
    );

    this.$datepicker__expands.on(
      `focusout.datepicker__expand.${this.name}`,
      null,
      {},
      handleExpandFocusout,
    );

    this.$datepicker.on(
      `mousedown.datepicker.${this.name}`,
      null,
      { datepicker: this },
      handleMousedown,
    );

    this.$datepicker.on(
      `focusin.datepicker.${this.name}`,
      null,
      { datepicker: this },
      handleFocusin,
    );

    this.$datepicker.on(
      `focusout.datepicker.${this.name}`,
      null,
      { datepicker: this },
      handleFocusout,
    );

    this.$datepicker.on(
      `mouseup.datepicker.${this.name} mouseout.datepicker.${this.name}`,
      null,
      { datepicker: this },
      handleMouseup,
    );

    this.$datepicker__buttons.on(
      `mousedown.datepicker__button.${this.name}`,
      null,
      { datepicker: this },
      handleButtonMousedown,
    );

    this.$datepicker__calendar.on(
      `mouseover.datepicker__calendar.${this.name}`,
      'td',
      { datepicker: this },
      handleCellMouseover,
    );

    this.$datepicker__calendar.on(
      `mouseout.datepicker__calendar.${this.name}`,
      'td',
      { datepicker: this },
      handleCellMouseout,
    );

    this.$datepicker__calendar.on(
      `mousedown.datepicker__calendar.${this.name}`,
      'td',
      { datepicker: this },
      handleCellMousedown,
    );
  }

  setTimeFocus(time) {
    this.timeFocus = time;
  }

  setActiveDate(activeDate) {
    this.activeDate = activeDate;
  }

  setLastSelectedDate(lastSelectedDate) {
    this.lastSelectedDate = lastSelectedDate;
  }

  open() {
    if (!(this.$datepicker.hasClass('datepicker_open'))) {
      this.$datepicker.addClass('datepicker_open');
      this.$datepicker__down.css({
        height: `${this.calendarHeight}px`,
        border: '1px solid rgba(31, 32, 65, 0.25)',
        transition: `height ${DURATION_OPEN}ms, border ${DURATION_OPEN}ms`,
        'z-index': this.zIndex,
      });
    }
  }

  close() {
    if (this.demo) return;

    this.$datepicker.removeClass('datepicker_open');
    this.$datepicker__down.css({
      height: 0,
      border: '0px solid rgba(31, 32, 65, 0)',
      transition: `height ${DURATION_OPEN}ms, border ${DURATION_OPEN}ms`,
      'z-index': this.zIndex,
    });
  }

  setCalendarHeight() {
    this.$datepicker__down.css({
      height: `${this.calendarHeight}px`,
      border: '1px solid rgba(31, 32, 65, 0.25)',
      transition: 'height 0ms, border 0ms',
      'z-index': this.zIndex,
    });
  }

  getCalendarHTMLandSetCalendarHeight() {
    const calendarDate = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth());

    // 0 - понедельник, 1 - вторник, 2 - среда...
    const dayOfWeek = calendarDate.getDay() ? calendarDate.getDay() - 1 : 6;
    calendarDate.setDate(calendarDate.getDate() - dayOfWeek);

    this.calendarHeight = EMPTY_CALENDAR_HEIGHT + this.rowCalendarHeight;

    let calendarHTML = '<tr class="datepicker__calendar-header"><th class="datepicker__cell">Пн</th><th class="datepicker__cell">Вт</th><th class="datepicker__cell">Ср</th><th class="datepicker__cell">Чт</th><th class="datepicker__cell">Пт</th><th class="datepicker__cell">Сб</th><th class="datepicker__cell">Вс</th></tr>';

    do {
      this.calendarHeight += this.rowCalendarHeight;

      calendarHTML += '<tr class="datepicker__row">';

      for (let i = 0; i < 7; i += 1) {
        let cellClasses = '';

        if (
          calendarDate.getTime() === this.arrivalDate.getTime()
          || calendarDate.getTime() === this.departureDate.getTime()
        ) {
          cellClasses += ' datepicker__cell_selected';
        }

        if (calendarDate.getMonth() !== this.calendarMonth.getMonth()) {
          cellClasses += ' datepicker__cell_other-month';
        }

        const zeroMonth = calendarDate.getMonth() < 9 ? '0' : '';
        const zeroDate = calendarDate.getDate() < 10 ? '0' : '';

        calendarHTML += `<td class="datepicker__cell${cellClasses}" data-date="${calendarDate.getFullYear()}-${zeroMonth}${calendarDate.getMonth() + 1}-${zeroDate}${calendarDate.getDate()}">${calendarDate.getDate()}</td>`;

        calendarDate.setDate(calendarDate.getDate() + 1);
      }

      calendarHTML += '</tr>';
    } while (calendarDate.getMonth() === this.calendarMonth.getMonth());

    return calendarHTML;
  }

  updateCalendar() {
    this.$datepicker__monthYear.text(
      `${MONTHS[this.calendarMonth.getMonth()]} ${this.calendarMonth.getFullYear()}`,
    );

    const calendarHTML = this.getCalendarHTMLandSetCalendarHeight();
    this.setCalendarHeight();
    this.$datepicker__calendar.html(calendarHTML);
  }

  updateDate({ date = '', value = '' } = { date: '', value: '' }) {
    let oldValue = '';

    if (date === 'arrival') {
      oldValue = this.$datepicker__input_arrival.val();

      this.arrivalDate.setTime(Date.parse(value));
      this.arrivalDate.setHours(0, 0, 0);

      this.$datepicker__input_arrival.val(value);
    } else if (date === 'departure') {
      oldValue = this.$datepicker__input_departure.val();

      this.departureDate.setTime(Date.parse(value));
      this.departureDate.setHours(0, 0, 0);

      this.$datepicker__input_departure.val(value);
    }

    if (oldValue) {
      $(`td[data-date="${oldValue}"`, this.$datepicker__calendar).removeClass('datepicker__cell_selected');
    }

    /*
    if (value) {
      $(`td[data-date="${value}"`, this.$datepicker__calendar)
      .addClass('datepicker__cell_selected');
    }
    */
  }
}

$('.js-datepicker').each((index, element) => {
  const datepicker = new Datepicker(element);
  datepicker.init();
});
