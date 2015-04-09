Elliptical(function () {
    var service = null;
    $.controller('elliptical.lazyLoad', $.elliptical.scroll, {
        options:{
            touchScroll:true
        },

        _initController: function () {
            if (this.options.service !== undefined) {
                service = this.options.service;
                this.__initializeComponent();
            }else{
                this._destroy();
            }
        },

        __initializeComponent: function(){
            this._data.scrollHeight = null;
            this._setPaginationProps();
            var self = this;
            setTimeout(function () {
                self._observeTemplateNode();
            }, 500);
        },

        _setPaginationProps: function () {
            var scopeProp = this.options.scope;
            var pagination = this.$scope[scopeProp].pagination;
            var count = parseInt(pagination.count);
            var pageSize = parseInt(pagination.pageSize);
            var page = parseInt(pagination.page);
            var maxPage = parseInt(count / pageSize);
            var remainder = count % pageSize;
            if (remainder > 0) {
                maxPage += 1;
            }
            this._data.page = page;
            this._data.maxPage = maxPage;
        },

        _observeTemplateNode:function(){
            var templateNode = this._data.templateNode;
            var height = templateNode.outerHeight();
            var offset = templateNode.offset().top;
            var scrollHeight = parseFloat(height) - parseFloat(offset);
            this._data.scrollHeight = scrollHeight;
        },

        _initServiceCall:function(){
            var maxPage = this._data.maxPage;
            var page = this._data.page;
            if (page < maxPage) {
                page += 1;
                this._data.page = page;
                this._setLoader();
                this._callService(page);
            }
        },

        _setLoader: function () {
            var element = this._data.templateNode;
            var spinner = element.find('ui-spinner');
            if (!spinner[0]) {
                var loader = $('<ui-spinner class="bottom" html5-imported="true"></ui-spinner>');
                element.css({ 'padding-bottom': '3em' });
                loader.css({ 'padding-bottom': '1em' });
                element.append(loader);
            }
        },

        _removeLoader:function(){
            var element = this._data.templateNode;
            var loader = element.find('ui-spinner');
            loader.remove();
            element.css({ 'padding-bottom': '' });
        },

        _callService: function (page) {
            var self = this;
            var Service = this.service(service);
            Service.get({ page: page }, function (err, data) {
                self._bindModel(data);
            });
        },

        _bindModel: function (data) {
            var self = this;
            var opts = {};
            opts.context=this.options.scope;
            opts.model = data;
            opts.template = this._data.templateId;
            this._renderTemplate(opts, function (err, out) {
                if (!err) {
                    self._bindTemplate(out)
                } else {
                    self._removeLoader();
                }
            });
        },

        _bindTemplate:function(html){
            var element = this._data.templateNode;
            element.append(html);
            this._removeLoader();
            this._observeTemplateNode();
        },

        _onScroll: function () {
            var y = this._data.scrollY;
            var scrollHeight=this._data.scrollHeight;
            if (y > scrollHeight) {
                this._initServiceCall();
            }
        }
    });
});