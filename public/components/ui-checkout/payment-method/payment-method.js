(function () {

    document.addEventListener('WebComponentsReady', function () {
        var utils = elliptical.utils;
        var _ = utils._;
        $.form('elliptical.paymentMethod','payment-method',{
            options:{
                objectBind: true
            },

            _initForm: function () {
                var m = moment();
                this._data.moment = m;
                this._screenButton();
                this._redirectEvents();
                this._setScope();
                this._publishScope();
                this._data.LastCreditCard = null;
            },

            _redirectEvents: function () {
                var press = this._press();
                this._event(this.element, press, '[data-redirect-btn]', this._onRedirectPress.bind(this));
            },

            _screenButton:function(){
                var self=this;
                var click=this._data.click;
                var btn=this.element.find('[data-role="screen-button"]');
                this._event(btn,click,function(event){
                    self._submit(true);
                });
            },

            _setScope:function(){
               
                var scope = {};
                var years = this._getYears();
                this._data.creditCardItem = null;
                var creditCardItem = this.$viewBag.transaction.creditCardItem;
                var transaction = this.$viewBag.transaction;
                if (transaction.allowLastTransactionCard) {
                    this._data.creditCardItem = creditCardItem;
                    var year = parseInt(creditCardItem.expYear);
                    scope.months = this._getMonths(year);
                } else {
                    scope.months = this._getMonths(years[0].year);
                }
                var id = creditCardItem.id;
                if (id === null || id === undefined || id === '') {
                    this._resetCreditCardItem(creditCardItem);
                }
                scope.acceptedCreditCards = this.$viewBag.acceptedCreditCards;
                scope.transaction = transaction;
                scope.years=years;
                scope.creditCardItem = creditCardItem;
                this.$scope = scope;
               
            },

            _resetCreditCardItem: function (creditCardItem) {
                var m = this._data.moment;
                creditCardItem.expYear = m.year();
                creditCardItem.expMonth = m.month() + 1;
                creditCardItem.id = 'Select';
                creditCardItem.cardNumber = '';
                creditCardItem.ccCode = '';
                creditCardItem.nameOnCard = '';
            },

            _getYears:function(){
                var m = this._data.moment;
                var currYear= m.year();
                var years=[];
                for(var i=0; i<10;i++){
                    years.push({year:currYear++});
                }
                return years;
            },

            _getMonths:function(year){
                var m = this._data.moment;
                var currYear= m.year();
                var month = this._getMonth(m.month(), year,currYear);
                return this._buildMonthsArray(month);
            },

            _getMonth:function(month,year,currYear){
                var month_;
                if (year > currYear) {
                    month_ = 1;
                } else {
                    month_ = month + 1;
                }
                
                return month_;
            },

            _buildMonthsArray:function(startMonth){
                var arr_=[{month:01,label:'Jan'},{month:02,label:'Feb'},{month:03,label:'Mar'},{month:04,label:'Apr'},{month:05,label:'May'},{month:06,label:'Jun'},
                    {month:07,label:'Jul'},{month:08,label:'Aug'},{month:09,label:'Sep'},{month:10,label:'Oct'},{month:11,label:'Nov'},{month:12,label:'Dec'}];

                arr_.splice(0,startMonth-1);

                return arr_;
            },


            _publishScope:function(){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'creditCardItem',
                        value:self.$scope.creditCardItem
                    };
                    self._publish('checkout.data',data);
                },100);
            },

            _validateForm: function (body) {
                if (_.isEmpty(body)) {
                    alert("Credit Card Payment Required");
                    return false;
                } else {
                    var submitLastTransactionCard = this.$scope.transaction.submitLastTransactionCard;
                    var cardNumber = body.cardNumber;
                    var cardType = body.id;
                    var ccCode=body.ccCode;
                    if (cardType === 'Select') {
                        alert("Payment Type Required");
                        return false;
                    }
                    if (cardNumber === "") {
                        alert("Card Number Required");
                        return false;
                    }

                    if(!submitLastTransactionCard && !utils.validateCreditCard(cardNumber,cardType)){
                        alert("Invalid Credit Card Number");
                        return false;
                    }

                    return true;
                }
            },

            /**
             * captured form submission event handler
             * @param data
             * @private
             */
            _onSubmit: function (data) {
                if (!this._validateForm(data.body)) {
                    return false;
                }
                var evtData={
                    currentStepIndex:3,
                    stepIndex:4
                };
                this._publish('checkout.step',evtData);
            },

            /**
             * render card select list with a templateStr based on changed selected year
             * @param year
             * @private
             */
            _onChange:function(year){
                var months=this._getMonths(year);
                this.$scope.months=months;

                var opts={
                    templateStr:'{#months}<option value="{month}">{label}</option>{/months}',
                    model:months,
                    context:'months'
                };
                var selectElement=this.element.find('#expMonth');
                this._render(selectElement,opts);
            },

            _updateLastTransactionCreditCard:function(){
                var submitLastTransactionCard = this.$scope.transaction.submitLastTransactionCard;
                if (submitLastTransactionCard) {
                    var creditCardItem = this._data.creditCardItem;
                    this.$scope.creditCardItem = _.clone(creditCardItem);
                    var year = parseInt(creditCardItem.expYear);
                    this.$scope.months = this._getMonths(year);
                    this._onChange(year);
                    $('#lastTransactionCard').removeClass('warning').addClass('success');
                    this._showFormElements();
                    this._hideRedirectButton();
                } else {
                    var creditCardItem = this.$scope.creditCardItem;
                    this._resetCreditCardItem(creditCardItem);
                    $('#lastTransactionCard').removeClass('success').addClass('warning');
                }
            },

            _onRedirectPress: function (event) {
                var transaction = this.$scope.transaction;
                var id = this._data.typeId;
                var creditCardItem = transaction.creditCardItem;
                creditCardItem.id = id;
                var cookie = this.service('CookieSession');
                cookie.put({ key: 'transaction', session: transaction });
                var redirectAction = this._data.redirectAction;
                var msg = "Redirecting to " + id;
                this._notify('info', msg, false);
                location.href = redirectAction;
            },

            _parsePaymentTypeSelection: function () {
                var id = this.$scope.creditCardItem.id;
                if (this._data.creditCardItem) {
                    var lastCardTransactionId = this._data.creditCardItem.id;
                    if (id !== lastCardTransactionId) {
                        this.$scope.transaction.submitLastTransactionCard = false;
                    }
                }
                
                if (id.toLowerCase() !== 'select') {
                    var select = this.element.find('#id');
                    this._data.typeId = id;
                    var option = select.find('option[value="' + id + '"]');
                    var redirectAction = option.attr('data-redirect-action');
                    this._data.redirectAction = redirectAction;
                    if (redirectAction !== '') {
                        this._hideFormElements();
                        this._showRedirectButton(id);
                    } else {
                        this._showFormElements();
                        this._hideRedirectButton();
                    }
                } else {
                    this._showFormElements();
                    this._hideRedirectButton();
                }
            },

            _hideFormElements:function(){
                var dataCard = this.element.find('[data-card]');
                dataCard.addClass('hide');
                var buttons = this.element.find('button');
                buttons.addClass('hide');
                $('#lastTransactionCard').hide();
            },

            _showRedirectButton:function(id){
                var redirectBtn = this.element.find('[data-redirect-btn]');
                redirectBtn.html('Pay with ' + id);
                redirectBtn.removeClass('hide');
            },

            _showFormElements: function () {
                var dataCard = this.element.find('[data-card]');
                dataCard.removeClass('hide');
                var buttons = this.element.find('button');
                buttons.removeClass('hide');
                $('#lastTransactionCard').show();
            },

            _hideRedirectButton: function () {
                var redirectBtn = this.element.find('[data-redirect-btn]');
                redirectBtn.addClass('hide');
            },

            _onScopeChange:function(result){
                var self=this;
                if(result.changed.length > 0){
                    result.changed.forEach(function(obj){
                        if(obj.name==='expYear'){
                            self._onChange(obj.value);
                        }
                        if (obj.name === 'submitLastTransactionCard') {
                            self._updateLastTransactionCreditCard();
                        }
                        if (obj.name === "id") {
                            self._parsePaymentTypeSelection();
                        }
                        
                    });
                }
            },

            updateUI: function () {
                var id = this.$scope.creditCardItem.id;
                this._parsePaymentTypeSelection();
                return id;
            }

        });

    });

})();

