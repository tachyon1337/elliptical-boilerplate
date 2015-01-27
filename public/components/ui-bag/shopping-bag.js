Elliptical(function () {
    var utils = elliptical.utils;
    $.controller("elliptical.shoppingBag","shopping-bag",[$.elliptical.bag,$.elliptical.element],{
        options:{
            updateMessage:'Updating Price Calculations'
        },
        _events:function(){
            var click=this._data.click;
            this._event(this.element, click, '.bag-remove', this._onRemoveClick.bind(this));
            this._event(this.element, click, '#apply-coupon', this._onCouponAction.bind(this));
            this._event(this.element, click, 'bag-actions>button', this._onButtonAction.bind(this));
            this._event(this.element, click, 'footer>button', this._onUpdateAction.bind(this));
        },

        _getItems: function () {
            var scopeProp = this.options.scope;
            var $scope = this.$scope;
            var items = $scope[scopeProp].items;
            return items;
        },

        _onCouponAction:function(event){
            var input = this.element.find('input[data-id="code"]');
            var code = input.val();
            if (code !== '') {
                this._getDiscount(code, true);
            }
        },

        _onButtonAction:function(event){
            var action = this.options.checkoutAction;
            location.href=action;
        },

        _onUpdateAction: function (event) {
            var rebind = false;
            var items = this._getItems();
            var length = items.length;
            var copy = items.concat([]);
            var decrement = 0;
            for (var i = 0; i < length; i++) {
                var qty = copy[i].quantity;
                if (qty < 1) {
                    rebind = true;
                    var spliceIndex = i - decrement;
                    items.splice(spliceIndex, 1);
                    decrement++;
                }
            }
            if (rebind) {
                if (items.length > 0) {
                    console.log(this.$scope.bag.items);
                    this.$rebind();
                } else {
                    this._emptyTemplate();
                }
            }
            
            this._notify('success', 'Updated', true);
        },

        _onRemoveClick:function(event){
            var id = this._getModelIdByTarget(event.currentTarget);
            if (id !== undefined) {
                this._remove(id);
            }
        },

        _remove: function (id) {
            var $scope = this.$scope;
            var scopeProp = this.options.scope;
            var items = this._getItems();
            var length=items.length;
            for (var i = 0; i < length; i++) {
                if (items[i].id.toString() === id.toString()) {
                    $scope[scopeProp].subtotal = $scope[scopeProp].subtotal - parseFloat(items[i].subtotal);
                    items.splice(i, 1);
                    break;
                }
            }
            this.$rebind();
            var id_ = parseInt(id);
            var Model = this._getServiceReference();
            Model.delete({ id: id_ });
            this._scroll();
            if (length === 1) {
                this._emptyTemplate();
            }
        },

        _getServiceReference:function(){
            var srvName = this.options.service;
            return this.service(srvName);
        },

        _scroll:function(){
            var scrollTop = 'bagScrollTop' + this.eventNamespace;
            this._scrollTop(0, scrollTop);
        },

        _emptyTemplate: function () {
            var element = this.element;
            var template = element.find('bag-container');
            template.hide();
            var emptyTemplate = element.find('empty-template');
            emptyTemplate.addClass('show');
        },

        _getDiscount: function (code, onError) {
            var self = this;
            var element = this.element;
            var scopeProp = this.options.scope;
            var $scope = this.$scope;
            var srvName = this.options.couponService;
            var Model = this.service(srvName);
            var subtotal = this.$scope[scopeProp].subtotal;
            subtotal = parseFloat(subtotal);
            Model.get({ code: code, subtotal: subtotal }, function (err, data) {
                if (!err) {
                    if (data > 0) {
                        $scope[scopeProp].discount = data;
                    } else {
                        if (onError) {
                            var input=element.find('[data-id="code"]');
                            input.addClass('error');
                            input.attr('placeholder', 'Invalid Coupon');
                            input.val('');
                            $scope[scopeProp].discount = null;
                            self._onChange();
                        }
                    }
                }
            });
        },

        _onAfterChange: function () {
            var scopeProp = this.options.scope;
            var $scope = this.$scope;
            var code = $scope[scopeProp].code;
            if (code) {
                this._getDiscount(code, false);
            }
            var count = 0;
            var items = this._getItems();
            for (var i = 0; i < items.length; i++) {
                count += parseInt(items[i].quantity);
            }
            this._publish('shoppingbag.item.count', count);
        },

        _onQtyChange: function (obj) {
            var scopeProp = this.options.scope;
            obj.quantity = parseInt(obj.quantity);
            var oldSubtotal = obj.subtotal;
            var subtotal = obj.quantity * parseFloat(obj.price);
            var diff = subtotal - oldSubtotal;
            obj.subtotal = utils.formatCurrency(subtotal);
            var bagSubtotal = parseFloat(this.$scope[scopeProp].subtotal);
            bagSubtotal = parseFloat(bagSubtotal) + parseFloat(diff);
            this.$scope[scopeProp].subtotal = utils.formatCurrency(bagSubtotal);
            this._onChange();
            var Model = this._getServiceReference();
            Model.put(obj,this._onUpdateCallback.bind(this));
        },

        _onUpdateCallback:function(err,data){
            if (!err) {
                var $scope = this.$scope;
                var scopeProp = this.options.scope;
                var items = this._getItems();
                var subtotal = 0;
                var isPriceChange = false;
                items.forEach(function (item) {
                    if (item.id == data.id) {
                        var price = data.price;
                        if (item.price !== data.price) {
                            isPriceChange = true;
                            item.price = data.price;
                            item.subtotal = utils.formatCurrency(data.subtotal);
                        }
                    }
                    subtotal = subtotal + parseFloat(item.subtotal);
                });
                
                if (isPriceChange) {
                    var bagSubtotal = parseFloat($scope[scopeProp].subtotal);
                    this.$rebind();
                    this._notify('info', this.options.updateMessage, true);
                    $scope[scopeProp].subtotal = utils.formatCurrency(subtotal);
                    this._onChange();
                }
            }
        },

        _onCodeChange:function(){
            var input = this.element.find('input[data-id="code"]');
            if (input.hasClass('error')) {
                input.removeClass('error');
            }
            val = input.val();
            if (val === '') {
                input.attr('placeholder', 'Enter Promo Code');
            }
        },

        _onChange: function () {
            var scopeProp = this.options.scope;
            var $scope = this.$scope;
            var bagSubtotal = parseFloat($scope[scopeProp].subtotal);
            var discount = $scope[scopeProp].discount;
            if (discount) {
                bagSubtotal= bagSubtotal - parseFloat(discount);
            }
            this.$scope[scopeProp].total = utils.formatCurrency(bagSubtotal);
            this._onAfterChange();
        },

        _onScopeChange: function (result) {
            var self = this;
            if (result.changed.length > 0) {
                result.changed.forEach(function (obj) {
                    if (obj.name === 'quantity' && !isNaN(parseInt(obj.value))) {
                        if (obj.oldValue !== '' && obj.value !=='') {
                            if (parseInt(obj.oldValue) !== parseInt(obj.value)) {
                                self._onQtyChange(obj.object);
                            }
                        } else {
                            self._onQtyChange(obj.object);
                        }
                    }
                    if (obj.name === 'subtotal' || obj.name==='discount') {
                        self._onChange(obj.object);
                    }
                    if (obj.name === 'code') {
                        self._onCodeChange();
                    }
                    
                });
            }
           
        }

    });
})

        
    

