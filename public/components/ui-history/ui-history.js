Elliptical(function () {
    var utils = elliptical.utils;
    $.controller('elliptical.history', 'ui-history', {
        _initController: function () {
            var selector = this.options.viewSelector;
            this._setViewSelector(selector);
            this._initDelegate();
            this._initDomHandler();
            this._initDispatchHandler();
            this._setLocationHistoryService();
            this._setControllerLocationProvider();
            this._startRouterService();
        },

        _initDelegate: function () {
            var self = this;
            var click = this._data.click;
            var selector = this._getSelector();
            $(document).on(click, selector, function (event) {
                var target = event.currentTarget;
                self._requestDelegate(target,event);
            });
        },

        _initDomHandler:function(){
            $(document).on('ellipsis.onMutation', function (event,data) {
                var mutations=data.mutations;
                mutations.forEach(function (mutation) {
                    var added=mutation.addedNodes;
                    if (added.length > 0) {
                        $.each(added, function (index, element) {
                            if (element.hasAttribute && element.hasAttribute('html5-imported') && !element.hasAttribute('data-upgraded')) {
                                _HTML5Imports.upgradeElement(element.tagName, element);
                            }
                        });
                    }
                });
            });
        },

        _requestDelegate: function (target,event) {
            var $that = $(target);
            var that = target;
            var href = $that.attr('href'),
                dataRoute = $that.attr('route');
            
         
            if (typeof href !== 'undefined' && href !== '#' && dataRoute !== 'false') {
                if (event !== undefined) {
                    event.stopPropagation();
                    event.preventDefault();
                }
              
                //create data object
                var data = {
                    method: 'get',
                    href: href
                };

                /* query attributes and attach to the data objects
                 *
                 */
                $.each(that.attributes, function (i, att) {
                    data[att.name.toCamelCase()] = att.value;
                });
                data.route = href;
                //trigger event
                $(document).trigger('elliptical.onDocumentRequest', data);

            } else if (dataRoute !== undefined && dataRoute === 'false') {
                //redirect
                location.href = href;
            }
        },

        _initDispatchHandler:function(){
            var app = elliptical.module;
            app.onDispatchRequest();
        },

        _setLocationHistoryService:function(){
            var app = elliptical.module;
            app._setLocationHistoryService();
        },

        _setControllerLocationProvider: function () {
            var Router = elliptical.module.Router;
            var f = function (url) {
                Router.location(url, 'get', null);
            };
            $.widget.$providers({ location: f });
        },

        _startRouterService:function(){
            var app = elliptical.module;
            var Router = app.Router;
            var env = app.getEnvironment();
            if (env === 'production') {
                Router.debug = false;
            }
            Router.start();
            var self = this;
            setTimeout(function () {
                self._setLocation(Router);
            }, 1500);
            
        },

        _setLocation:function(Router){
            var path = location.pathname;
            Router.location(path, 'get', null);
        },

        _setViewSelector: function (selector) {
            if (selector !== undefined) {
                selector = utils.camelCaseToDash(selector);
                var View = elliptical.View;
                View.$setSelector(selector);
            }
           
        },

        _getSelector: function () {
            var selector = 'ui-history a';
            if (this.element.attr('controller') !== undefined) {
                selector='[controller="history"] a'
            }
            return selector;
        }


    });
});