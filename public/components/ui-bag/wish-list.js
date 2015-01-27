Elliptical(function () {
    var utils = elliptical.utils;
    $.controller("elliptical.wishList","wish-list",[$.elliptical.bag,$.elliptical.element],{

        _events:function(){
            var click=this._data.click;
            this._event(this.element, click, '.bag-remove', this._onRemoveClick.bind(this));
            this._event(this.element, click, '.bag-add', this._onAddBagClick.bind(this));
            this._event(this.element, click, 'bag-actions>button', this._onButtonAction.bind(this));
            this._event(this.element, click, 'footer>button', this._onUpdateAction.bind(this));
        },

        _onButtonAction:function(event){
            var Service = this.service(this.options.moveService);
            var shoppingBagAction = this.options.shoppingBagAction;
            Service.post({});
            if (shoppingBagAction !== undefined) {
                this._redirectAction(shoppingBagAction);
            } else {
                this._rebindAction();
            }
        },

        _redirectAction:function(action){
            var Location = this.service('Location');
            Location.redirect(action);
        },

        _rebindAction:function(){
            var count = this._getCount();
            this._publish('shoppingbag.new.item', count);
            var items = this._getItems();
            items.length = 0;
            this.$rebind();
        },

        _getItems: function () {
            var scopeProp = this.options.scope;
            var $scope = this.$scope;
            var items = $scope[scopeProp].items;
            return items;
        },

        _getCount:function(){
            var items = this._getItems();
            var length = items.length;
            var count = 0;
            if (length > 0) {
                item.forEach(function (obj) {
                    count += parseInt(obj.quantity);
                });
            }
            return count;
        },

        _onUpdateAction:function(event){
            this._notify('success', 'Updated', true);
        },


        _onAddBagClick:function(event){
            var id = this._getModelIdByTarget(event.currentTarget);
            if (id !== undefined) {
                this._add(id);
            }
        },

        _onRemoveClick:function(event){
            var id = this._getModelIdByTarget(event.currentTarget);
            if (id !== undefined) {
                this._remove(id);
            }
        },

        _remove: function (id) {
            var items = this._getItems();
            var length=items.length;
            for (var i = 0; i < length; i++) {
                if (items[i].id.toString() === id.toString()) {
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

        _add:function(id){
            var items = this._getItems();
            var length = items.length;
            var item = null;
            for (var i = 0; i < length; i++) {
                if (items[i].id.toString() === id.toString()) {
                    item = items[i];
                    items.splice(i, 1);
                    break;
                }
            }

            if (item) {
                var Model = this._getServiceReference();
                Model.put(item);
            }
            this.$rebind();
            this._publish('shoppingbag.new.item', item.quantity);
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

        _onScopeChange: function (result) {
            var items = this._getItems();
            if (items.length < 1) {
                this._emptyTemplate();
            }
        }

       

    });
})

        
    

