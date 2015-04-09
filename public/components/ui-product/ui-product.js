Elliptical(function(){
    $.controller("elliptical.product", "ui-product", [$.elliptical.baseProduct, $.elliptical.element], {
        options:{
          showSelections:true
        },

        _initController: function () {
            this._data.label=null;
            this._data.submit = 'bag';
            this._data.active = true;
            var showSelections=this.options.showSelections;
            if (!this.options.scope && showSelections) {
                //if no scope defined, initialization will databind from http service
                this._bindService();
            } 
        },

        
        _subscriptions:function(){
            this._subscribe('product.hide', this._onHide.bind(this));
            this._subscribe('product.remove', this._onRemove.bind(this));
            this._subscribe('product.selections.submit', this._onSubmit.bind(this));
        },

        //checks if the element published matches the instance element, if not, the instance hides itself
        _onHide: function (data) {
            var thisElement = this.element[0];//instance element
            var publishedElement = data.element;//published element
            if (typeof data.element === 'string') {//if the published data type is a string(=productid)
                thisElement = thisElement.getAttribute('product-id');
            }
            if (thisElement !== publishedElement) {
                this._hide();
                this._data.active = false;
            } else {
                this._show();
                this._data.active = true;
            }
            
        },

        //instance removes itself from the DOM
        _onRemove:function(data){
            var element = this.element;
            var thisId = element.attr('product-id');
            if (thisId.toString() === data.id.toString()) {
                this.element.remove();
            }
        },

        _bindService: function () {
            var srvName = this.options.service;
            var Product = this.service(srvName);
            var id = this.options.productId;
            var self = this;
            this._data.isLoaded = false;
            this._loading();
            Product.get({ id: id }, this._onLoaded.bind(this));
        },

        //sets modal and scrolltop when loading in a product from service
        _loading: function () {
            var scrollTop = 'productScrollTop' + this.eventNamespace;
            this._scrollTop(0, scrollTop);
            this._setModal($('body'), {opacity:.1});
            var self = this;
            var element = this.element[0];
            var id=setInterval(function () {
                if (self._data.isLoaded) {
                    self._onLoadingComplete(id, element);
                }
            }, 1000);
        },

        _onLoaded: function (err, data) {
            if (!err) {
                this.$scope.product = data;
                this._data.isLoaded = true;
                this._publish('product.added', data);
            }
        },

        //publishes its element to product.hide
        _onLoadingComplete:function(id,element){
            clearInterval(id);
            this._publish('product.hide', { element: element });
            this._removeModal();
            
        },

        _onAltImageSelected: function (data) {
            var label;
            if (!this._data.label) {
                label = this.element.find('.image-label');
            } else {
                label = this._data.label;
            }
            var target = $(data.target);
            var description = target.attr('data-description');
            if (description !== '') {
                label.text(description);
                label.show();
            } else {
                label.hide();
            }
        },

        //publishes add-to-bag, add-to-wishlist click event
        _onButtonAction: function (event) {
            var target = $(event.currentTarget);
            var attr = target.attr('data-role');
            this._data.submit = (attr === 'add-to-bag') ? 'bag' : 'wishlist';
            var thisId = this.element.attr('product-id');
            this._publish('product.selections', thisId);
        },


        //handler for product submit to shoppingbag or wishlist
        _onSubmit: function (data) {
            if (!this._data.active) {
                return false;
            }
           
            var channel = this.options.channel;
            var submitType = this._data.submit;
            var self = this;
            var srvName = this.options.service;
            var Product = this.service(srvName);
            var element = this.element;
            var id = element.attr('product-id');
            var quantity = this.element.find('#quantity').val();
            data.productId = id;
            data.quantity = quantity;
            var obj = {
                data: data,
                submitType:submitType
            };
            this._modal();
            
            //because of variation of model implementation details, fire to a generic onSubmit handler that should be defined in APP_JS
            Product.onSubmit(obj, function (err, result) {
                self._data.hideModal = true;
                if (submitType === 'bag') {
                    if (!err) {
                        self._publish(channel, result);//publish the bag item
                    } else {
                        self._notify('error', "Error: " + err.message, true);
                    }
                   
                } else {
                    if (err) {
                        self._notify('error', "Must be signed-in to add to wishlist", true);
                    } else {
                        self._notify('success', "Item has been added to your wish list", true);
                    }
                }
            });
        }
    });
        
});




