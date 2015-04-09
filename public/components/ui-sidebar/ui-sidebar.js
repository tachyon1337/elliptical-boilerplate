Elliptical(function(){
    $.element("ellipsis.sidebar","ui-sidebar" ,{

        /* Options to be used as defaults */
        options: {
            contentSelector: '[data-sidebar]',
            autoPopulate: true,
            sticky: false,
            top: 0,
            bottom: null,
            padding:null

        },

        /* internal/private object store */
        _data: {
            content: null,
            headersArray: null,
            mainHeaderNode: 'h3',
            secondaryHeaderNode: 'h4',
            headerClass: 'header',
            a:null

        },

        /*==========================================
         PRIVATE
         *===========================================*/

        /**
         * init
         * @private
         */
        _initElement: function () {
            this._parseOptions();
            if (this.options.autoPopulate) {
                if (!this._verifyContent()) {
                    return;
                }
                this._headersArray();
                this._buildSidebar();
                this._clickEvents();
            }

            if (this.options.sticky) {
                this._sticky();
            }

        },

        /**
         * parseInt options
         * @private
         */
        _parseOptions:function(){
            if(this.options.top){
                this.options.top=parseInt(this.options.top);
            }
            if(this.options.bottom){
                this.options.bottom=parseInt(this.options.bottom);
            }
            if(this.options.padding){
                this.options.padding=parseInt(this.options.padding);
            }
        },


        /**
         *
         * @returns {boolean}
         * @private
         */
        _verifyContent: function () {
            var content = $(this.options.contentSelector);
            this._data.content = content;
            return (content[0]) ? true : false;
        },

        /**
         *
         * @private
         */
        _headersArray: function () {
            var headers = this._data.content
                .children('section')
                .children('h3,h4');

            this._data.headersArray = headers;

        },

        /**
         *
         * @private
         */
        _buildSidebar: function () {
            var menu = $(this._data.menuElement);
            var elements = this._data.headersArray;
            var mainHeaderNode = this._data.mainHeaderNode;
            var headerClass = this._data.headerClass;
            $.each(elements, function (index, obj) {
                var li = $(this._data.listItemElement);
                var $obj = $(obj);

                if (obj.nodeName.toLowerCase() === mainHeaderNode.toLowerCase()) {
                    li.addClass(headerClass);
                    li.html('<a><h3>' + $obj.html() + '</h3></a>');
                } else {
                    li.html('<a>' + $obj.html() + '</a>');
                }

                menu.append(li);
            });

            this.element.append(menu);
        },

        /**
         *
         * @private
         */
        _sticky: function () {
            this.element.sticky({
                top: this.options.top
            });
        },


        /**
         *
         * @param element {Object}
         * @private
         */
        _onClick: function(element){
            var a = this._data.a;
            var index= a.index(element);
            var header=this._data.headersArray[index];
            var offset=$(header).offset();
            var top=offset.top;
            if(this.options.padding){
                top=top - this.options.padding;
            }
            this._removeActive();
            this._setActive(element);
            $(window).scrollTop(top);

        },

        /**
         *
         * @param obj {Object}
         * @private
         */
        _setActive: function(obj){
            var parent=obj.parent(this._data.listItem);
            parent.addClass('active');
        },

        /**
         *
         * @private
         */
        _removeActive:function(){
            this.element.find('.active')
                .removeClass('active');
        },

        /**
         *
         * @private
         */
        _clickEvents: function(){
            /* click special event name */
            var click=this._data.click;

            var self=this;
            this._data.a = this.element.find('a');
            this._event(element,click,'a',function(event){
                self._onClick($(event.currentTarget));
            });

        }


        /*==========================================
         PUBLIC METHODS
         *===========================================*/



    });

});
