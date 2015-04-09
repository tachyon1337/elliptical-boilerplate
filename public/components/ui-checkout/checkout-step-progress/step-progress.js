(function(){
    document.addEventListener('WebComponentsReady', function () {

        $.controller('elliptical.stepProgress','checkout-step-progress',{

            _initController:function(){
                this.element.sticky({top:100,fudge:-540});
                this._data.steps=null;
            },

            _events:function(){
                var click = this._data.click;
                var element = this.element;
                this._event($(window), 'collapse.show', this._onItemShow.bind(this));
                this._event(element, click,'.ui-button', this._onEditClick.bind(this));

            },

            _buttonEvent:function(){
                var buttons=this.element.find('.ui-button');
                this._data.buttons=buttons;
                this._event(buttons,'click',this._onEditClick.bind(this));
            },

            _subscriptions:function(){
                this._subscribe('checkout.data',this._onDataBind.bind(this));
                this._subscribe('checkout.shipMethod', this._onShipMethod.bind(this));
                this._subscribe('step.show', this._showItem.bind(this));
                this._subscribe('step.toggle.disable', this._onDisableToggle.bind(this));
            },

            /**
             * step items reference
             * @returns {*}
             * @private
             */
            _setStepElementsReference:function(){
                var steps=this.element.find('step-item');
                this._data.steps=steps;
                return steps;
            },

            /**
             * get step item element by index
             * @param index
             * @returns {*|jQuery|HTMLElement}
             * @private
             */
            _getStepByIndex: function(index){
                var steps=this._data.steps;
                if(!steps){
                    steps=this._setStepElementsReference();
                }
                var step=steps[index];
                return $(step);
            },

            /**
             * handler that binds step scopes to this controller scope(two-way data bind automatic display)
             * @param data
             * @private
             */
            _onDataBind:function(data){
                var prop=data.prop;
                var val=data.value;
                this.$scope[prop]=val;
            },

            _onShipMethod:function(data){
                var prop=data.prop;
                var val=data.value;
                this.$scope[prop]=val;

            },

            /**
             * event handler for collapse.show
             * @param event
             * @param data
             * @private
             */
            _onItemShow: function (event, data) {
                this._showItem(data);
            },

            /**
             * when the displayed step changes, update the progress display
             * @param event
             * @param data
             * @private
             */
            _showItem:function(data){
                var index = data.index;
                var lastIndex = index - 1;
                this._showItemTemplates(lastIndex);
                this._hideItemTemplates(index);
                this._updateProgress(index);
            },

            /**
             * show applicable item data templates
             * @param index
             * @private
             */
            _showItemTemplates:function(index){
                for(var i=index;i>-1;i--){
                    var item=this._getStepByIndex(i);
                    var div=item.find('div');
                    div.addClass('visible');
                    var label=item.find('label');
                    label.hide();
                    var button=item.find('.ui-button');
                    button.addClass('visible');
                }
            },

            /**
             * hide applicable item data templates(shows message: 'pending..'
             * @param index
             * @private
             */
            _hideItemTemplates:function(index){
                var length=this._data.steps.length;
                for(var i=index;i<length;i++){
                    var item=this._getStepByIndex(i);
                    var div=item.find('div');
                    div.removeClass('visible');
                    var label=item.find('label');
                    label.show();
                    var button=item.find('.ui-button');
                    button.removeClass('visible');
                }
            },

            /**
             * update progress ui
             * @param index
             * @private
             */
            _updateProgress:function(index){
                var completedIndex=index-1;
                for(var i=completedIndex;i>-1;i--){
                    var item=this._getStepByIndex(i);
                    item.removeClass('current')
                        .addClass('complete');
                }
                var length=this._data.steps.length;
                for(var i=index;i<length;i++){
                    var item=this._getStepByIndex(i);
                    item.removeClass('current')
                        .removeClass('complete');
                }
                var currentItem=this._getStepByIndex(index);
                currentItem.removeClass('complete')
                    .addClass('current');
            },

            /**
             * handler for progress step edit button
             * @private
             */
            _onEditClick:function(event){
                var buttons = this.element.find('.ui-button');
                var target=$(event.target);
                var index=buttons.index(target);
                var data={
                    stepIndex:index
                };

                this._publish('checkout.step',data);
            },

            _getToggles: function () {
                return this.element.find('.ui-button');
            },

            _disableTogglesByRange: function (index) {
                var toggles = this._getToggles();
                $.each(toggles, function (i, toggle) {
                    if (i < index) {
                        $(toggle).css({ visibility: 'hidden' });
                    }
                });
            },

            _onDisableToggle: function (data) {
                var self = this;
                var type = data.type;
                var index = data.index;
                var toggles = this._getToggles();
                if (type === 'range') {
                    setTimeout(function () {
                        self._disableTogglesByRange(index);
                    }, 500);
                    
                } else {
                    var toggle = toggles[index];
                    $(toggle).css({ visibility: 'hidden' });
                }
            },

            _onScopeChange:function(result){
               
            }

        });
    });
})();

