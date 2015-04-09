Elliptical(function () {
   
    $.controller('app.itemStrip', 'ui-item-strip', {
        options:{
            outAnimation: 'slideOutRight',
            outDuration: 2000,
            inAnimation: 'fadeIn',
            inDuration: 300,
            closeDelay:800
        },

        _initController: function () {
            this._data.id = null;
            this._data.initItem = null;
            this._data.isVisiable = true;
            if (this.element.hasClass('hide')) {
                this._data.isVisible = false;
            }
           
        },
        
        _subscriptions:function(){
            this._subscribe('item.strip.init', this.__init.bind(this));
            this._subscribe('item.strip.add', this._add.bind(this));
           
        },

        __init: function (data) {
            this.options.scope = 'items';
            var arr = [];
            arr.push(data);
            this.$scope.items = arr;
        },

        

        _events: function () {
            var click = this._data.click;
            var press = this._press();
            var close = this.element.find('[data-role="close"]');
            this._event(close, press, this._onClick.bind(this));
            this._event(this.element, press, 'strip-item>div', this._onItemClick.bind(this));
            this._event(this.element, press, 'label', this._onRemoveClick.bind(this));
            this._event(this.element, 'dbltap', this._onClick.bind(this));//
        },

        _onClick: function (event) {
            this._hide();
            var delay = this.options.closeDelay;
            var self = this;
            setTimeout(function () {
                self._publish('item.strip.hide', {});
            },delay);
        },

        _onItemClick: function (event) {
            var channel = this.options.channel;
            var items = this.element.find('strip-item');
            items.removeClass('active');
            var target = $(event.currentTarget);
            var parent = target.parent();
            parent.addClass('active');
            var id = parent.attr('model-id');
            this._data.id = id;
            var data = {
                element:id
            }
            if (channel !== undefined) {
                channel+='.hide';
                this._publish(channel, data);
            }
        },

        _onRemoveClick: function (event) {
            var channel = this.options.channel;
            var target = $(event.currentTarget);
            var parent = target.parent();
            parent.addClass('active');
            var id = parent.attr('model-id');
            var data = {
                element: id
            }
            this._remove(id);
            var activeId = this._data.id;
            if (activeId.toString() === id.toString()) {
                this._resetCss(0);
                if (channel !== undefined) {
                    var id_ = this._getFirstChildId();
                    var data_ = {
                        element:id_
                    }
                    channel+='.hide';
                    this._publish(channel, data_);
                }
            }
            this._publish('item.strip.remove', data);
            this.$rebind();
        },

        _add: function (data) {
            var prop = this.options.scope;
            this._resetCss();
            this._data.id = data.id;
            data.remove = true;
            this.$scope[prop].push(data);
            this.$rebind();
        },

        _remove: function (id) {
            var prop = this.options.scope;
            var arr = this.$scope[prop];
            console.log(id);
            if (arr.length > 0) {
                var length = arr.length;
                for (var i = 0; i < length; i++) {
                    if (arr[i].id.toString() === id.toString()) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
        },

        _resetCss: function (index) {
            var cssProp = this.options.cssClass || 'cssClass';
            var prop = this.options.scope;
            var arr = this.$scope[prop];
            if (arr.length > 0) {
                var length = arr.length;
                for (var i = 0; i < length; i++) {
                    arr[i][cssProp] = (index === i) ? 'active' : '';
                }
            }
        },

        _getFirstChildId:function(){
            var prop = this.options.scope;
            var arr = this.$scope[prop];
            return arr[0].id;
        },



        _show: function () {
            this.element.removeClass('hide');
            this._transitions(this.element, {
                preset: this.options.inAnimation,
                duration:this.options.inDuration
            }, function () {

            });
        },

        _hide: function () {
            var element = this.element;
            this._transitions(element, {
                preset: this.options.outAnimation,
                duration:this.options.outDuration
            }, function () {
                element.addClass('hide');
            });

        },

        _onAdded:function(){
            if (!this._data.initItem) {
                var prop = this.options.scope;
                var arr = this.$scope[prop];
                this._data.initItem = arr[0];
            }
            if (this._support.mq.touch) {
                this._publish('item.strip.touch.show', {});
            } else {
                this._show();
            }
            
        },

        _onScopeChange: function (result) {
            if (result.added.length > 0) {
                this._onAdded();
            }
        },

        show: function () {
            this._show();
        },

        hide: function () {
            this._hide();
        },

        add: function (data) {
            this._add(data);
        },

        remove: function (id) {
            this._remove(id);
        },
       
    });
});