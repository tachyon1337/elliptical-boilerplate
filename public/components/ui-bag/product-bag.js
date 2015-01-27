Elliptical(function () {
    $.element.registerElements(['bag-list', 'bag-item', 'thumb-image', 'bag-summary', 'bag-totals', 'bag-actions']);

    var utils = elliptical.utils;
    $.controller('elliptical.productBag', 'product-bag', {
        options:{
            inAnimation: 'slideInDown',
            inDuration: 300,
            touchInAnimation:'fadeIn',
            outDelay: 3000,
            objectBind:true
        },

        _events:function(){
            this._event(this.element, 'click', '[data-role="close"]', this._hide.bind(this));
        },

        _initController: function () {
            if (!this.options.scope) {
                //if no scope defined, initialization will databind from http service
                this._bindService();
            }
        },

        _subscriptions: function () {
            var channel = this.options.channel;
            this._subscribe(channel, this._onAdd.bind(this));
        },

        _getServiceRef:function(){
            var srvName = this.options.service;
            return this.service(srvName);
        },

        _bindService: function () {
            var ShoppingBag = this._getServiceRef();
            ShoppingBag.get({}, this._onLoaded.bind(this));
        },

        _onLoaded: function (err, data) {
            if (!err) {
                var subtotal = this._getSubtotal(data,0);
                var bag = {
                    items: data,
                    subtotal: subtotal,
                    item:null
                }
                this.$scope = bag;
            }
        },

        _getSubtotal:function(data,subtotal){
            if (data.length > 0) {
                data.forEach(function (obj) {
                    subtotal += parseFloat(obj.subtotal);
                });
            }
            return utils.formatCurrency(subtotal);
        },

        _onAdd: function (item) {
            var self = this;
            this._hide();
            var items = this.$scope.items;
            items.unshift(item);
            var subtotal = parseFloat(this.$scope.subtotal);
            subtotal = parseFloat(item.subtotal) + parseFloat(subtotal);
            subtotal = utils.formatCurrency(subtotal);
            this.$scope.subtotal = subtotal;
            this._publishCount(items);
            var ShoppingBag = this._getServiceRef();
            if (ShoppingBag.onItemAdded) {
                ShoppingBag.onItemAdded(item, function (err, data) {
                    if (!err) {
                        self._bindBag(data);
                    }
                });
            } else {
                this._bindBag(item);
            }
        },

        _publishCount:function(items){
            var count = items.length;
            this._publish('shoppingbag.item.count', count);
        },

        _bindBag:function(item){
            this.$scope.item = item;
            this.$rebind();
            this._transitionIn();
        },

        _hide:function(){
            this.element.hide();
        },

        _transitionIn: function () {
            var self = this;
            var delay = this.options.outDelay;
            var isTouch=this._support.mq.touch;
            var preset = (isTouch) ? this.options.touchInAnimation : this.options.inAnimation;
            this._transitions(this.element, {
                preset: preset,
                duration: this.options.inDuration
            }, function () {
                setTimeout(function () {
                    if (isTouch) {
                        self._transitionOut();
                    }
                  
                }, delay);
            });
        },

        _transitionOut: function () {
            this._transitions(this.element, {
                preset: 'fadeOut',
                duration: 1000
            });
        }

    });
});