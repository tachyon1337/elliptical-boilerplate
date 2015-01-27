Elliptical(function () {
    var __proto__ = HTMLInputElement.prototype;
    __proto__._name = 'HTMLInputElement';
    $.element(__proto__, "elliptical.datepicker", "ui-datepicker", {

        /* Options to be used as defaults */
        options: {
            maxWidth: '25em',

            constrainWidth: false,

            // bind the picker to a form field
            field: null,

            // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
            bound: undefined,

            // the default output format for `.toString()` and `field` value
            format: 'MM-DD-YYYY',

            // the initial date to view when first opened
            defaultDate: new Date(),

            // make the `defaultDate` the initial selected value
            setDefaultDate: false,

            // first day of week (0: Sunday, 1: Monday etc)
            firstDay: 0,

            // the minimum/earliest date that can be selected
            minDate: null,
            // the maximum/latest date that can be selected
            maxDate: null,

            // number of years either side, or array of upper/lower range
            yearRange: 10,

            todayMaxDate: false,

            isRTL: false,

            // how many months are visible (not implemented yet)
            numberOfMonths: 1,

            // internationalization
            i18n: {
                previousMonth: 'Previous Month',
                nextMonth: 'Next Month',
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            }

        },

        /* internal/private object store */
        _data: {
            hasMoment: null,
            buttonClass: 'button',
            isDisabledClass: 'is-disabled',
            isEmptyClass: 'is-empty',
            prevClass: 'prev',
            nextClass: 'next',
            selectClass: 'select',
            selectMonthClass: 'select-month',
            selectYearClass: 'select-year',
            isHiddenClass: 'is-hidden',
            isTodayClass: 'is-today',
            isSelectedClass: 'is-selected',
            isBoundClass: 'is-bound',
            titleClass: 'title',
            labelClass: 'label',
            tableClass: 'table',
            minYear: 0,
            maxYear: 9999,
            minMonth: undefined,
            maxMonth: undefined


        },

        /*==========================================
         PRIVATE
         *===========================================*/




        /* init fired once, on _create */
        _initElement: function () {
            //todo handle smartphone
            this._setContainer();
            this._config();
            this._events();
            this._initPicker();

        },

        __onInit: $.noop,

        _setContainer: function () {
            if (this.options.constrainWidth) {
                var parent = this.element.parent();
                parent.css({
                    width: this.options.maxWidth
                });
            }

        },

        _config: function () {
            this._data.hasMoment = typeof moment === 'function';
            if (this.options.todayMaxDate) {
                this.options.maxDate = moment();
            }
            this.options.field = this.element[0];
            this._o = this.options;
            var opts = this.options;
            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!this._utils.datetime.isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!this._utils.datetime.isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this._utils.datetime.setToStartOfDay(opts.minDate);
                this._data.minYear = opts.minDate.getFullYear();
                this._data.minMonth = opts.minDate.getMonth();
            }
            if (opts.maxDate) {
                this._utils.datetime.setToStartOfDay(opts.maxDate);
                this._data.maxYear = opts.maxDate.getFullYear();
                this._data.maxMonth = opts.maxDate.getMonth();
            }

            if (this._utils.array.isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || opts.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }


        },

        _initPicker: function () {

            var self = this;
            var opts = this.options;
            var element = this.el;

            if (opts.field) {
                if (opts.bound) {
                    element.addClass('contained');
                    $(opts.field).after(element);
                } else {
                    opts.field.parentNode.insertBefore(element[0], opts.field.nextSibling);

                }
                this._addEvent(opts.field, 'change', self._onInputChange.bind(this));

                if (!opts.defaultDate) {
                    if (this._data.hasMoment && opts.field.value) {
                        opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                    } else {
                        opts.defaultDate = new Date(Date.parse(opts.field.value));
                    }
                    opts.setDefaultDate = true;
                }
            }

            var defDate = opts.defaultDate;

            if (this._utils.datetime.isDate(defDate)) {
                if (opts.setDefaultDate) {
                    self.setDate(defDate, true);
                } else {
                    self.gotoDate(defDate);
                }
            } else {
                self.gotoDate(new Date());
            }

            if (opts.bound) {
                this.hide();
                self.el[0].className += ' ' + this._data.isBoundClass;
                this._addEvent(opts.trigger, 'click', this._onInputClick.bind(this));
                this._addEvent(opts.trigger, 'focus', this._onInputFocus.bind(this));
                this._addEvent(opts.trigger, 'blur', this._onInputBlur.bind(this));
            } else {
                this.show();
            }
        },

        _show: $.noop,

        _hide: $.noop,

        _addEvent: function (el, event, callback, capture) {

            el.addEventListener(event, callback, !!capture);

        },

        _removeEvent: function (el, event, callback, capture) {
            el.removeEventListener(event, callback, !!capture);

        },

        _fireEvent: function (el, eventName, data) {

            this._onEventTrigger(eventName, data);
        },

        _renderDayName: function (opts, day, abbr) {
            day += opts.firstDay;
            while (day >= 7) {
                day -= 7;
            }
            return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
        },

        _renderDay: function (i, isSelected, isToday, isDisabled, isEmpty) {
            if (isEmpty) {
                return '<td class="' + this._data.isEmptyClass + '"></td>';
            }
            var arr = [];
            if (isDisabled) {
                arr.push(this._data.isDisabledClass);
            }
            if (isToday) {
                arr.push(this._data.isTodayClass);
            }
            if (isSelected) {
                arr.push(this._data.isSelectedClass);
            }
            return '<td data-day="' + i + '" class="' + arr.join(' ') + '"><button class="' + this._data.buttonClass + '" type="button">' + i + '</button>' + '</td>';
        },

        _renderRow: function (days, isRTL) {
            return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
        },

        _renderBody: function (rows) {
            return '<tbody>' + rows.join('') + '</tbody>';
        },

        _renderHead: function (opts) {
            var i, arr = [];
            for (i = 0; i < 7; i++) {
                arr.push('<th scope="col"><abbr title="' + this._renderDayName(opts, i) + '">' + this._renderDayName(opts, i, true) + '</abbr></th>');
            }
            return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
        },

        _renderTitle: function (instance) {
            var i, j, arr,
                opts = instance._o,
                month = instance._m,
                year = instance._y,
                isMinYear = year === this._data.minYear,
                isMaxYear = year === this._data.maxYear,
                html = '<div class="' + this._data.titleClass + '">',
                prev = true,
                next = true;

            for (arr = [], i = 0; i < 12; i++) {
                arr.push('<option value="' + i + '"' +
                    (i === month ? ' selected' : '') +
                    ((isMinYear && i < this._data.minMonth) || (isMaxYear && i > this._data.maxMonth) ? 'disabled' : '') + '>' +
                    opts.i18n.months[i] + '</option>');
            }
            html += '<div class="' + this._data.labelClass + '">' + opts.i18n.months[month] + '<select class="' + this._data.selectClass + ' ' + this._data.selectMonthClass + '">' + arr.join('') + '</select></div>';

            if (this._utils.array.isArray(opts.yearRange)) {
                i = opts.yearRange[0];
                j = opts.yearRange[1] + 1;
            } else {
                i = year - opts.yearRange;
                j = 1 + year + opts.yearRange;
            }

            for (arr = []; i < j && i <= this._data.maxYear; i++) {
                if (i >= this._data.minYear) {
                    arr.push('<option value="' + i + '"' + (i === year ? ' selected' : '') + '>' + (i) + '</option>');
                }
            }
            html += '<div class="' + this._data.labelClass + '">' + year + '<select class="' + this._data.selectClass + ' ' + this._data.selectYearClass + '">' + arr.join('') + '</select></div>';

            if (isMinYear && (month === 0 || this._data.minMonth >= month)) {
                prev = false;
            }

            if (isMaxYear && (month === 11 || this._data.maxMonth <= month)) {
                next = false;
            }

            html += '<button class="' + this._data.prevClass + (prev ? '' : ' ' + this._data.isDisabledClass) + '" type="button">' + opts.i18n.previousMonth + '</button>';
            html += '<button class="' + this._data.nextClass + (next ? '' : ' ' + this._data.isDisabledClass) + '" type="button">' + opts.i18n.nextMonth + '</button>';

            return html += '</div>';
        },

        _renderTable: function (opts, data) {
            return '<table cellpadding="0" cellspacing="0" class="' + this._data.tableClass + '">' + this._renderHead(opts) + this._renderBody(data) + '</table>';
        },


        _onMouseDown: function (event) {
            var self = this;
            var opts = this.options;
            if (!this._v) {
                return;
            }

            var target = $(event.target);
            if (!target) {
                return;
            }

            if (!target.hasClass(this._data.isDisabledClass)) {
                if (target.hasClass(this._data.buttonClass) && !target.hasClass(this._data.isEmptyClass)) {
                    this.setDate(new Date(this._y, this._m, parseInt(target[0].innerHTML, 10)));
                    if (opts.bound) {
                        setTimeout(function () {
                            self.hide();
                        }, 100);
                    }
                    return;
                }
                else if (target.hasClass(this._data.prevClass)) {
                    this.prevMonth();
                }
                else if (target.hasClass(this._data.nextClass)) {
                    this.nextMonth();
                }
            }
            if (!target.hasClass(this._data.selectClass)) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                    return false;
                }
            } else {
                this._c = true;
            }
        },

        _onChange: function (event) {

            var target = $(event.target);
            if (!target) {
                return;
            }
            if (target.hasClass(this._data.selectMonthClass)) {
                this.gotoMonth(target.val());
            }
            else if (target.hasClass(this._data.selectYearClass)) {
                this.gotoYear(target.val());
            }
        },

        _onInputChange: function (event) {

            var date;
            var opts = this.options;
            if (event.firedBy === this) {
                return;
            }

            if (this._data.hasMoment) {

                date = moment(opts.field.value, opts.format);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            this.setDate(this._utils.datetime.isDate(date) ? date : null);
            if (!this._v) {
                this.show();
            }
        },

        _onInputFocus: function () {
            this.show();
        },

        _onInputClick: function () {
            this.show();
        },

        _onInputBlur: function () {
            var self = this;
            if (!this._c) {
                this._b = setTimeout(function () {
                    self.hide();
                }, 50);
            }
            this._c = false;

        },

        _onClick: function (event) {
            var opts = this.options;
            var target = $(event.target),
                pEl = target;
            if (!target) {
                return;
            }

            do {
                if (pEl.hasClass('ui-datepicker')) {
                    return;
                }
            }
            while ((pEl[0] = pEl[0].parentNode));
            if (this._v && target[0] !== opts.trigger) {
                this.hide();
            }

        },

        /**
         * element events
         * @private
         */
        _events: function () {
            var self = this;
            var el = document.createElement('div');
            el.className = 'ui-datepicker' + (this.options.isRTL ? ' is-rtl' : '');

            var element = $(el);
            this.el = element;

            element.on('mousedown', function (event) {
                self._onMouseDown(event);
            });

            var button = this.element.next();
            button.on(this._data.click, function (event) {
                self.element[0].focus();
            });

        },


        /**
         *
         * @private
         */
        _onDestroy: function () {
            this.hide();
            this._removeEvent(this.el[0], 'mousedown', this._onMouseDown, true);
            this._removeEvent(this.el[0], 'change', this._onChange);
            if (this._o.field) {
                this._removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    this._removeEvent(this._o.trigger, 'click', this._onInputClick);
                    this._removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    this._removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el[0].parentNode) {
                this.el[0].parentNode.removeChild(this.el);
            }
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/


        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function (format) {
            return !this._utils.datetime.isDate(this._d) ? '' : this._data.hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function () {
            return this._data.hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function (date) {
            if (this._data.hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate());
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function () {
            return this._utils.datetime.isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function (date, preventOnSelect) {
            if (!date) {
                this._d = null;
                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!this._utils.datetime.isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (this._utils.datetime.isDate(min) && date < min) {
                date = min;
            } else if (this._utils.datetime.isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            this._utils.datetime.setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();

                this._fireEvent(this._o.field, 'change', { firedBy: this });
            }

            if (!preventOnSelect) {
                var data = {
                    date: this.getDate()
                };


                this._onEventTrigger('select', data);
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function (date) {
            if (!this._utils.datetime.isDate(date)) {
                return;
            }
            this._y = date.getFullYear();
            this._m = date.getMonth();
            this.draw();
        },

        gotoToday: function () {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function (month) {
            if (!isNaN((month = parseInt(month, 10)))) {
                this._m = month < 0 ? 0 : month > 11 ? 11 : month;
                this.draw();
            }
        },

        nextMonth: function () {
            if (++this._m > 11) {
                this._m = 0;
                this._y++;
            }
            this.draw();
        },

        prevMonth: function () {
            if (--this._m < 0) {
                this._m = 11;
                this._y--;
            }
            this.draw();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function (year) {
            if (!isNaN(year)) {
                this._y = parseInt(year, 10);
                this.draw();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function (value) {
            this._o.minDate = value;
        },

        /**
         * change the maxDate
         */
        setMaxDate: function (value) {
            this._o.maxDate = value;
        },

        /**
         * refresh the HTML
         */
        draw: function (force) {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = this._data.minYear,
                maxYear = this._data.maxYear,
                minMonth = this._data.minMonth,
                maxMonth = this._data.maxMonth;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            this.el[0].innerHTML = this._renderTitle(this) + this.render(this._y, this._m);

            if (opts.bound) {
                this.adjustPosition();
                if (opts.field.type !== 'hidden') {
                    setTimeout(function () {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            var self = this;
            setTimeout(function () {
                self._onEventTrigger('draw', {});
            }, 0);
        },

        adjustPosition: function () {
            var field = this._o.trigger, pEl = field,
                width = this.el.offsetWidth, height = this.el.offsetHeight,
                viewportWidth = this._support.device.viewport.width,
                viewportHeight = this._support.device.viewport.height,
                scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
                left, top, clientRect;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top = pEl.offsetTop + pEl.offsetHeight;
                while ((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top += pEl.offsetTop;
                }
            }

            if (left + width > viewportWidth) {
                left = field.offsetLeft + field.offsetWidth - width;
            }
            if (top + height > viewportHeight + scrollTop) {
                top = field.offsetTop - height;
            }

            //if bound to form element, don't adjust
            if (!this._o.bound) {
                this.el[0].style.cssText = 'position:absolute;left:' + left + 'px;top:' + top + 'px;';
            }

        },

        /**
         * render HTML for a particular month
         */
        render: function (year, month) {
            var opts = this._o,
                now = new Date(),
                days = this._utils.datetime.getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data = [],
                row = [];
            this._utils.datetime.setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while (after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++) {
                var day = new Date(year, month, 1 + (i - before)),
                    isDisabled = (opts.minDate && day < opts.minDate) || (opts.maxDate && day > opts.maxDate),
                    isSelected = this._utils.datetime.isDate(this._d) ? this._utils.datetime.compareDates(day, this._d) : false,
                    isToday = this._utils.datetime.compareDates(day, now),
                    isEmpty = i < before || i >= (days + before);

                row.push(this._renderDay(1 + (i - before), isSelected, isToday, isDisabled, isEmpty));

                if (++r === 7) {
                    data.push(this._renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return this._renderTable(opts, data);
        },

        isVisible: function () {
            return this._v;
        },

        show: function () {
            if (!this._v) {
                if (this._o.bound) {
                    this._addEvent(document, 'click', this._onClick);
                }
                this.el.removeClass(this._data.isHiddenClass);
                this._v = true;
                this.draw();
                this._onEventTrigger('open', {});

            }
        },

        hide: function () {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    this._removeEvent(document, 'click', this._onClick);
                }
                this.el[0].style.cssText = '';
                this.el.addClass(this._data.isHiddenClass);
                this._v = false;
                this._onEventTrigger('close', {});

            }
        }


    });
});