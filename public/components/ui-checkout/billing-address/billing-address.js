(function () {

    document.addEventListener('WebComponentsReady', function () {
        $.form('elliptical.billingAddress','billing-address',{
            _initForm: function () {
                this._screenButton();
                this._publishScope();
                this._resetEvent();
                this._data.currentStepIndex=0;
                this._data.stepIndex=1;
                this._setShippingAddressEvent();
                this._getService();
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

            _getService:function(){
                var checkout = $('ui-checkout');
                var srvName = checkout.attr('service');
                var service = this.service(srvName);
                this._data.service = service;
            },

            /**
             * publish billing address scope to listeners
             * @private
             */
            _publishScope:function(){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'billingAddress',
                        value:self.$scope
                    };
                    self._publish('checkout.data',data);
                },100);
            },

            /**
             * define the event for reseting the billing address
             * @private
             */
            _resetEvent:function(){
                var checkbox=this.element.find('#resetBilling');
                this._event(checkbox,'change',this._handleResetEvent.bind(this));
            },

            /**
             * define the event for setting shipping address = billing address
             * @private
             */
            _setShippingAddressEvent:function(){
                var checkbox=this.element.find('#setShippingToBilling');
                this._event(checkbox,'change',this._setToBilling.bind(this));

            },

            /**

            */
            _setSelect: function () {
                var self = this;
                var $scope = this.$scope;
                setTimeout(function () {
                    try{
                        var select = self.element.find('[data-id="state-select"]');
                        select.val($scope.state);
                        select[0].required = true;
                    }catch(ex){
                    }
                }, 300);
            },

           
            /**
             * handles the billing address reset event
             * @param event
             * @private
             */
            _handleResetEvent:function(event){
                var checkbox=$(event.target);
                (checkbox.is(':checked')) ? this._clearBillingAddress() : this._resetBillingAddress();
            },

            /**
             * resets billing address to empty string props
             * @private
             */
            _clearBillingAddress:function(){
                var $scope=this.$scope;
                for (var key in $scope) {
                    if ($scope.hasOwnProperty(key)) {
                        $scope[key]='';
                    }
                }
            },

            /**
             * resets billing address to $viewBag object
             * @private
             */
            _resetBillingAddress:function(){
                var obj=this.$viewBag.billingAddress;
                var $scope=this.$scope;
                for (var key in $scope) {
                    if ($scope.hasOwnProperty(key)) {
                        $scope[key]=obj[key];
                    }
                }
            },

            /**
             * handler for ship to billing address checkbox event
             * @param event
             * @private
             */
            _setToBilling:function(event){
                var checkbox=$(event.target);
                if(checkbox.is(':checked')){
                    this._publish('set.shipping.to.billing',{});
                    this._data.currentStepIndex=1;
                    this._data.stepIndex=2;
                }else{
                    this._publish('reset.shipping',{});
                    this._data.currentStepIndex=0;
                    this._data.stepIndex=1;
                }

            },

            /**
             * captured form submission event handler
             * @param data
             * @private
             */
            _onSubmit:function(data){
                var evtData={
                    currentStepIndex:this._data.currentStepIndex,
                    stepIndex:this._data.stepIndex
                };
                this._publish('checkout.step', evtData);
                this._serviceEvent(data);
            },

            _serviceEvent: function () {
                var scope = $('ui-checkout').checkout('scope');
                var service = this._data.service;
                if (service !== undefined && service.onBillingSubmit) {
                    service.onBillingSubmit(scope);
                }
            }


        });
    });

})();
