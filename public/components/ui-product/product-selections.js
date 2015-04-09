Elliptical(function () {
    var _ = elliptical.utils._;
    var utils = elliptical.utils;
    var factory = elliptical.factory;
    var url = elliptical.url;

    /* binds product selections from a service, watches an observable object from path specified in the element-attribute
       listens to changes in select lists, rebinding, if cascading
       subscribes to product button action, validates the current select list selection state
       and publishes the validated observable state object to subscribers
    */
    $.controller('app.productSelections', 'product-selections', {
        _initController: function () {
            if (!this._upgraded()) {//exit if element instance not bound to custom element-definition by htmlimports(i.e, not upgraded)
                return false;
            }
            var id = this._getProductId();
            this._getViewModel(id);
        },

        _subscriptions:function(){
            this._subscribe('product.selections', this._publishSelections.bind(this));
        },

        //get product id from parent web component attribute
        _getProductId:function(){
            var parent = this.element.parents('[ea-id="product"]');
            var id = parent.attr('product-id');
            return id;
        },

        _getViewModel: function (id) {
            var self = this;
            var serviceRef = this._service.bind(this);
            var partial = factory.partial;
            var s1 = partial(serviceRef, 'ProductVariant', 'get', { id: id });
            var s2 = partial(serviceRef, 'ProductSwatch', 'get', { id: id });
            async.series([s1,s2], function (err, results) {
                if (!err) {
                    self._bindViewModel(results);
                }
            });
        },

        _bindViewModel: function (results) {
            var data = results[0];
            var refineModel = this._initFilters(data);
            var swatches = results[1];
            this._variantColors(refineModel.columns, swatches);
            refineModel.swatches = swatches;
            this.options.watch = 'refineModel.selected';
            this.$scope.refineModel = refineModel;
            this._selectionEvents();
            this._loaded();
        },

        _loaded:function(){
            this._publish('loading.selections.hide', {});
        },

        _selectionEvents:function(){
            var click=this._press();
            this._event(this.element, click, '[data-color]', this._onColorClick.bind(this));
        },

        _initFilters: function (refineModel) {
            var columns = refineModel.columns;
            var variants = refineModel.variants;
            var self = this;
            var filterObject = {};
            columns.forEach(function (obj, index) {
                obj.id = index;
                var col = utils.toCamelCase(obj.column);
                obj.column = col;
                obj.isColor = (obj.column === 'color');
                filterObject[col] = 'Select';
                obj.filters = [];
                obj.filters.push({ filter: 'Select', label: 'Select ' + obj.label, selected: 'selected' });
                var filters = obj.filters;
                var arr = [];
                var sort = obj.sortBy;
                if (sort !== '') {
                    variants = self._sort(variants, sort);
                }
                variants.forEach(function (o) {
                    arr.push(o[col]);
                });
                arr = _.uniq(arr);
                if (arr.length && arr.length > 0) {
                    arr.forEach(function (s) {
                        if (s !== '') {
                            obj.filters.push({ filter: s, label: s, selected: '' });
                        }
                    });
                }
            });
            this._data.filterObject = filterObject; //refine filter object
            refineModel.selected = filterObject;
            refineModel.columns = columns;
            refineModel.variants = variants;
            return refineModel;
        },

        _variantColors:function(columns,swatches){
            var length = columns.length;
            var index = length - 1;
            var colors = columns[index];
            var filters = colors.filters;
            var self = this;
            var colorFilters = [];
            if (filters.length) {
                filters.forEach(function (obj, index) {
                    obj.label = self._getColorImg(swatches, obj.filter);
                    if (obj.label !== '') {
                        if (obj.selected === 'selected') {
                            obj.selected = 'active';
                        }
                        colorFilters.push(obj);
                    }
                });

                colors.filters = colorFilters;
            }
        },


        _getColorImg:function(swatches,name){
            var length = swatches.length;
            var img = '';
            for (var i = 0; i < length; i++) {
                if (swatches[i].name === name) {
                    img = swatches[i].img;
                    break;
                }
            }
            return img;
        },

        _cascadeDatabindColumnFilters: function (columns, variants, filterObject) {
            columnIterationArray = [];
            var self = this;
            columns.forEach(function (obj, index) {
                var arr = [];
                var col = obj.column;
                obj.filters = [];
                obj.filters.push({ filter: 'Select', label: 'Select ' + obj.label, selected: '' });
                var sort = obj.sortBy;
                if (sort !== '') {
                    variants = self._sort(variants, sort);
                }
                variants.forEach(function (o) {
                    if (_filter(o)) {
                        arr.push(o[col]);
                    }
                });

                arr = _.uniq(arr);
                if (arr.length && arr.length > 0) {
                    arr.forEach(function (s) {
                        var fc = filterObject[col];
                        var s_ = s;
                        var selected = (filterObject[col] === s) ? 'selected' : '';
                        obj.filters.push({ filter: s, label:s,selected:selected });
                    });
                }
                self._validateColumnSelectedFilter(col, obj.filters);
                columnIterationArray.push(col);
            });

            
            this.$scope.refineModel.columns = columns;
            return columns;

            //private filter function
            function _filter(o) {
                var bool = true;
                var length = columnIterationArray.length;
                for (var i = 0; i < length; i++) {
                    var col_ = columnIterationArray[i];
                    bool = (!filterObject[col_] || filterObject[col_]==='Select' || (filterObject[col_] === o[col_]));
                    if (!bool) {
                        break;
                    }
                }
                return bool;
            }
        },

        _sort: function (arr, sort) {
            return _.sortBy(arr, sort);
        },


        _filterObject: function () {
            return Object.create(this._data.filterObject);
        },

        _onColorClick: function (event) {
            var element = $(event.currentTarget);
            element.addClass('active');
            var color = element.attr('data-color');
            this.$observable.color = color;
            
        },

        _getRefineColumns: function () {
            var columns = this.$scope.refineModel.columns;
            var clone = columns.concat([]);
            return clone;
        },

        //validate currently selected dropdown column filter value is an allowable filter selection given the change in selections
        _validateColumnSelectedFilter: function (column, filters) {
            var selectedFilter = this.$observable[column];
            var resetSelected = true;
            var length = filters.length;
            for (var i = 0; i < length; i++) {
                if (filters[i].filter === selectedFilter) {
                    resetSelected = false;
                    break;
                }
            }
            //if not reset the observed value(which automatically updates the DOM)
            if (resetSelected) {
                this.$observable[column] = 'Select';
            }
        },

        _modelRebind: function () {
            var filterObject = this.$observable;
            var columns = this._getRefineColumns();
            var $scope = this.$scope;
            var variants = $scope.refineModel.variants;
            var swatches = $scope.refineModel.swatches;
            columns = this._cascadeDatabindColumnFilters(columns, variants, filterObject);
            this._variantColors(columns, swatches);
            this.$rebind();//-->rebind the template view
           
        },

        _publishSelections: function (id) {
            var id_ = this._getProductId();
            if (id !== id_) {
                return false;
            }
            var o = this.$observable;
            if (this._validateObservable(o)) {
                var clone = _.clone(o);
                this._publish('product.selections.submit', clone);
            } else {
                this._notify('error','Selections Required',true);
            }
        },

        _validateObservable: function (o) {
            var passedValidation = true;
            var element = this.element;
            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    var value = o[key];
                    var formElement = element.find('[name="' + key + '"]');
                    if (value === 'Select') {
                        passedValidation = false;
                        formElement.addClass('error');
                    } else {
                        formElement.removeClass('error');
                    }
                }
            }
            return passedValidation;
        },


        _onScopeChange: function (result) {
            this._modelRebind();
        }
       
    });
});