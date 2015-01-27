
(function () {

    document.addEventListener('WebComponentsReady', function () {
        //lodash reference
        var utils= $.elliptical.utils;
        var _=utils._;

        $.form('elliptical.shippingAddress','shipping-address',{
            _initForm: function () {
                this._screenButton();
                this._setScope();
                this._publishScope();
                var self=this;
                setTimeout(function(){
                    self._setShippingSelectButtons();
                    self._shippingSelectEvent();
                }, 1000);

                this._setSelect();
            },

            /**
             * top right screen button submit
             * @private
             */
            _screenButton:function(){
                var self=this;
                var click=this._data.click;
                var btn=this.element.find('[data-role="screen-button"]');
                this._event(btn,click,function(event){
                    self._submit(true);
                });
            },

            /**
             * aside shipping label select button event
             * @private
             */
            _shippingSelectEvent:function(){
                var select=this._data.select;
                var click=this._data.click;
                this._event(select,click,this._onShippingSelect.bind(this));
            },

            _subscriptions:function(){
                this._subscribe('reset.shipping.to.billing',this._onShippingToBilling.bind(this));
                this._subscribe('reset.shipping',this._onShippingReset.bind(this));
            },

            /**
             * set the props of shipping object to empty string
             * @param addr
             * @private
             */
            _initScopeShippingAddress:function(addr){
                var shippingAddress={};
                for (var key in addr) {
                    if (addr.hasOwnProperty(key)) {
                        shippingAddress[key]='';
                    }
                }
                this.$scope.shippingAddress=shippingAddress;
            },

            _setScope:function(){
                var shippingAddresses = this.$viewBag.shippingAddresses;
                //get shipping address from transaction
                var addr = this._transactionShippingAddress();
                //if transaction shipping address populated, set scope address equal to it
                if (addr) {
                    this.$scope.shippingAddress = addr;
                } else {
                    //else: init a scope shipping address
                    addr = shippingAddresses[0];
                    this._initScopeShippingAddress(addr);
                }
                
                this.$scope.shippingAddresses=shippingAddresses;
            },

            _transactionShippingAddress: function(){
                var transaction = this.$viewBag.transaction;
                var addr = transaction.shippingAddress;
                return addr;
            },

            /**
             * publish scope to listeners
             * @private
             */
            _publishScope:function(){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'shippingAddress',
                        value:self.$scope.shippingAddress
                    };
                    self._publish('checkout.data',data);
                },100);
            },

            _updateScope:function(index){
                var addr=this.$scope.shippingAddresses[index];
                for (var key in addr) {
                    if (addr.hasOwnProperty(key)) {
                        this.$scope.shippingAddress[key]=addr[key];
                    }
                }
                this._setSelect();
            },

            /**
             * set the array of shipping label select buttons
             * @private
             */
            _setShippingSelectButtons:function(){
                var form=this._form();
                var select=form.find('.shipping-select');
                this._data.select=select;
            },

            /**
             * set the scope of the shipping Address==billing address
             * @param billing
             * @private
             */
            _onShippingToBilling:function(billing){
                this.$scope.shippingAddress=billing;
            },

            /**
             * reset the scope shipping address
             * @private
             */
            _onShippingReset:function(){
                var shippingAddresses=this.$viewBag.shippingAddress;
                var addr=shippingAddresses[0];
                this._initScopeShippingAddress(addr);
                this._publishScope();
            },

            /**
             * shipping address label select button handler
             * @param event
             * @private
             */
            _onShippingSelect:function(event){
                var target=$(event.target);
                if(!target.hasClass('disabled')){
                    var select=this._data.select;
                    var index=select.index(target);
                    this._updateScope(index);
                    select.removeClass('disabled');
                    target.addClass('disabled');
                }
            },

            /**

            */
            _setSelect: function () {
                var self = this;
                var $scope = this.$scope;
                setTimeout(function () {
                    try {
                        var select = self.element.find('[data-id="state-select"]');
                        select.val($scope.shippingAddress.state);
                        select[0].required = true;
                    } catch (ex) {
                    }
                }, 300);
            },


            /**
             * captured form submission event handler
             * @param data
             * @private
             */
            _onSubmit:function(data){
                var evtData={
                    currentStepIndex:1,
                    stepIndex:2
                };
                this._publish('checkout.step',evtData);
            }


        });
    });

})();
