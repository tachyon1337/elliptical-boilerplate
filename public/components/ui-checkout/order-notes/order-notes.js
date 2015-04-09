(function () {

    document.addEventListener('WebComponentsReady', function () {
        $.form('elliptical.orderNotes','order-notes',{
            _initForm: function () {
                this._screenButton();
                this._setScope();
                this._publishScope();
            },

            _screenButton:function(){
                var self=this;
                var click=this._data.click;
                var btn=this.element.find('[data-role="screen-button"]');
                this._event(btn,click,function(event){
                    self._submit(true);
                });
            },

            _setScope: function () {
                var transaction = this.$viewBag.transaction;
                var notes = transaction.notes;
                this.$scope.notes = notes;
            },

            _publishScope:function(){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'notes',
                        value:self.$scope.notes
                    };
                    self._publish('checkout.data',data);
                },100);
            },

            _onSubmit:function(data){
                var evtData={
                    currentStepIndex:4,
                    stepIndex:5
                };
                this._publish('checkout.step',evtData);
            },

            _onScopeChange: function () {
                this._publishScope();
            }

        });
    });

})();
