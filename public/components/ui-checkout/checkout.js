(function () {
    
    document.addEventListener('WebComponentsReady', function () {
        //get lodash reference
        var utils= $.elliptical.utils;
        var _=utils._;

        $.controller('ellipsis.checkout', 'ui-checkout', {
            options:{
                cssEmailTable: 'bordered',
                loaderDelay: 1000,
                templateBind:false
            },

            _initController: function () {
                this.$scope = this.$viewBag;
                //console.log(this.$scope);
                var accordion=this.element.find('ui-collapse');
                this._data.accordion=accordion;
                this._data.items=this._getCollapseItems(accordion);
                this._getHeaders();
                this._getScreens();
                this._publishScope();
                var index = this.options.stepIndex;
                if (index !== undefined) {
                    index = parseInt(index);
                    if (index > 0) {
                        this._publishStepIndex(index);
                    }
                    if (this.options.disableToggleIndices) {
                        this.element.trigger('collapse.toggle.disable', { type: 'range', index: index });
                        this._publish('step.toggle.disable', { type: 'range', index: index });
                    }
                }
            },

            _events:function(){
                this._event($(window),'collapse.show',this._onItemShow.bind(this));
            },


            _subscriptions:function(){
                this._subscribe('checkout.data',this._onDataBind.bind(this));
                this._subscribe('checkout.shipMethod',this._onShipMethod.bind(this));
                this._subscribe('checkout.step',this._onStep.bind(this));
                this._subscribe('set.shipping.to.billing', this._onShippingToBilling.bind(this));
                this._subscribe('checkout.bag', this._setBag.bind(this));
                this._subscribe('checkout.order', this._onPlaceOrder.bind(this));
               
            },

            _getHeaders: function () {
                this._data.header = null;
                this._data.successHeader = null;
                this._data.failureHeader = null;
                if (this.options.header) {
                    this._data.header = $(this.options.header);
                }
                if (this.options.successHeader) {
                    this._data.successHeader = $(this.options.successHeader);
                }
                if (this.options.failureHeader) {
                    this._data.failureHeader = $(this.options.failureHeader);
                }
                var obj={
                    header:this._data.header,
                    failureHeader:this._data.failureHeader
                }
                this._publish('order.headers', obj);
            },

            _getScreens:function(){
                this._data.checkoutScreen = this.element.find('checkout-screen');
                this._data.processedScreen = this.element.find('processed-screen');
                var obj = {
                    checkoutScreen: this._data.checkoutScreen,
                    processedScreen: this._data.processedScreen
                }
                this._publish('order.screens', obj);
            },

            _onDataBind:function(data){
                var prop=data.prop;
                var val=data.value;
                this.$scope[prop] = val;
                this.$scope.transaction[prop] = val;
            },

            _onShipMethod: function (data) {
                var prop=data.prop;
                var val=data.value;
                this.$scope[prop]=val;
                this._updateBagShipping(val);
                this._shippingItemTransaction(val);
            },

            _shippingItemTransaction:function(val){
                $.extend(this.$scope.transaction.shippingItem, val);
            },

            _shippingAddressTransaction:function(){
                this.$scope.transaction.shippingAddress = this.$scope.billingAddress;
                this.$scope.transaction.billingAddress = this.$scope.billingAddress;
            },


            _onShippingToBilling:function(){
                this.$scope.shippingAddress = this.$scope.billingAddress;
                this._shippingAddressTransaction();
                var data={
                    prop:'shippingAddress',
                    value:this.$scope.shippingAddress
                };
                this._publish('checkout.data',data);
                this._publish('reset.shipping.to.billing',this.$scope.billingAddress);
            },

            _setBag:function(data){
                this.$scope.transaction.shoppingBag = data.value;
            },

            _setNotes:function(){
                this.$scope.transaction.shoppingBag.notes = this.$scope.transaction.notes;
            },

            _onItemShow:function(event,data){
                this._scrollTop();
                var index=data.index;
                this._setIconItemOn(index);
                var offStartIndex=index + 1;
                this._setIconItemOff(offStartIndex);
            },

            _onStep:function(data){
                var stepIndex=data.stepIndex;
                var accordion=this._data.accordion;
                accordion.collapse('show',stepIndex);
            },

            _setIconItemOn:function(index){
                var accordion=this._data.accordion;

                for(var i=index;i > -1;i--){
                    accordion.collapse('showToggle',i);
                    var item=this._data.items[i];
                    item=$(item);
                    var icon=item.find('collapse-icon');
                    icon.addClass('on');
                }
            },

            _setIconItemOff:function(index){
                var length=this._data.items.length;
                for(var i=index;i <length;i++){
                    var item=this._data.items[i];
                    item=$(item);
                    var icon=item.find('collapse-icon');
                    icon.removeClass('on');
                }
            },

            _scrollTop:function(){
                var scrollY = window.pageYOffset;
                if(scrollY > 500){
                    window.scrollTo(0, 0);
                }
            },

            _getCollapseItems:function(accordion){
                var items=accordion.find('collapse-item');
                return items;
            },

            _updateBagShipping: function (obj) {
                var price = parseFloat(obj.price);
                price = utils.formatCurrency(price);
                this.$scope.shoppingBag.shipping = price;
            },

            _updateBagTotal: function(){
                var subtotal=this.$scope.shoppingBag.subtotal;
                var discount=this.$scope.shoppingBag.discount;
                var tax=this.$scope.shoppingBag.tax;
                var shipping=this.$scope.shoppingBag.shipping;

                var total = parseFloat(subtotal);
                if (discount !== null && discount !== '' && discount !== undefined) {
                    total = total - parseFloat(discount);
                }
                if (tax !== null && tax !== '' && tax !== undefined) {
                    total += parseFloat(tax);
                }
                if (shipping !== null && shipping !== '' && shipping !== undefined) {
                    total += parseFloat(shipping);
                }
                total = utils.formatCurrency(total);
                this.$scope.shoppingBag.total=total;
            },

            _onPlaceOrder:function(){
                var self = this;
                this._setNotes();
                var Order=this.service(this.options.service);
                var transaction = this.$scope.transaction;
                var transaction_ = _.cloneDeep(transaction);
                this._showLoader();
                Order.onSubmit(transaction_, function (err, result) {
                    if (!err) {
                        (result.approved) ? self._onOrderSuccess(result) : self._onOrderFailure(result);
                    } else {
                        (err.statusCode === 401) ? self._onOrderFailure(err, transaction) : self._onOrderError(err);
                    }
                });
            },

            _onOrderSuccess: function (transaction) {
                var delay = this.options.loaderDelay;
                this._publish('order.success',transaction);
                var self=this;
                var checkoutScreen=this._data.checkoutScreen;
                var processedScreen=this._data.processedScreen;
                setTimeout(function(){
                    self._hideLoader();
                    if(self._data.header && self._data.successHeader){
                        self._data.header.hide();
                        self._data.successHeader.removeClass('hide');
                    }
                    checkoutScreen.hide();
                    processedScreen.removeClass('hide');
                    window.scrollTo(0, 0);
                    self._publish('shoppingbag.item.count', 0);
                    self._emailOrder(transaction);
                },delay);

            },

            _onOrderFailure:function(err,transaction){
                var delay = this.options.loaderDelay;
                transaction.paymentItem.failureReason = err.message;
                this._publish('order.failure', transaction);
                var self = this;
                var checkoutScreen = this._data.checkoutScreen;
                var processedScreen = this._data.processedScreen;
                setTimeout(function () {
                    self._hideLoader();
                    if (self._data.header && self._data.failureHeader) {
                        self._data.header.hide();
                        self._data.failureHeader.removeClass('hide');
                    }
                    checkoutScreen.hide();
                    processedScreen.removeClass('hide');
                    window.scrollTo(0, 0);
                   
                }, delay);
            },

            _onOrderError:function(err){
                this._hideLoader();
                this._notify('error', 'Internal Server Error Processing Order', true);
            },

            _publishScope: function () {
                var $scope = this.$scope;
                var self = this;
                this._publish('checkout.scope', $scope,500);
            },

            _emailOrder: function (transaction) {
                transaction.cssClass = this.options.cssEmailTable;
                var OrderEmail = this.service('OrderEmail');
                var provider = this.options.$providers.template;
                provider.render('order-email', transaction, function (err, out) {
                    OrderEmail.post({ body: out });
                });
            },

            _publishStepIndex: function (index) {
                this._onStep({ stepIndex: index });
            },

            _onScopeChange: function () {
                this._updateBagTotal();
            }

        });
    });

})();
