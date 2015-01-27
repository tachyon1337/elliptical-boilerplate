(function(){
    document.addEventListener('WebComponentsReady', function () {
        var _ = elliptical.utils._;
        var utils = elliptical.utils;
        $.element.registerElement('filters-container');
        $.element.registerElement('refine-summary');
        $.element.registerElement('summary-item');
        $.element.registerElement('selection-filters');
        $.element.registerElement('filter-item');
        var _selectionFilters = 'selection-filters';
        var _filterItem = 'filter-item';
        var _selectedClass = 'disabled';
        var url = elliptical.url;

        $.controller('app.refineFilters','refine-filters',{
            _initController: function () {
                var model = this.options.model;
                var refineModel = this.$viewBag[model];
                var cascading = false;
                if(this.options.cascading === true){
                    cascading = true;
                }
                var summary = [];
                refineModel.summary = summary;
                var href = location.href;
                var refine = url.queryString(href, 'refine');
                if (cascading && !refine) {
                    //default bind, all filters
                    this._onReadyInit(refineModel,model);
                } else if (cascading && refine) {
                    //cascade bind the queryString httpValueCollection
                    this._onBindRequestCollectionInit(href, refineModel,model);
                }
            },

            _onReadyInit:function(refineModel,model){
                var columns = refineModel.columns;
                var variants = this.$viewBag[model].variants;
                var ret = this._initFilters(columns, variants)
                refineModel.columns = ret.columns;
                refineModel.variants = ret.variants;
                refineModel.btnClass = 'disabled';
                //only watch the summary array property of refineModel
                this.options.watch = 'refineModel.summary';
                this.$scope.refineModel = refineModel;
                var self = this;
                setTimeout(function () {
                    self._postInit();
                }, 1000);
            },

            _onBindRequestCollectionInit:function(href,refineModel,model){
                var columns = refineModel.columns;
                columns = this._initColumns(columns);
                var variants = this.$viewBag[model].variants;
                refineModel.variants = variants;
                refineModel.columns = columns;
                refineModel.btnClass = '';
                //bind summary
                var summary = [];
                var collection = url.httpValueCollection(href);
                if (collection.length) {
                    var filterObject = this._filterObject();
                    collection.forEach(function (obj) {
                        var key_ = utils.toCamelCase(obj.key);
                        if (obj.key !== 'refine' && obj.key !=='page') {
                            var o = {
                                filter: obj.value,
                                column: key_,
                                label: utils.camelCaseToSpace(key_).toLowerCase(),
                                columnIndex: undefined
                            };
                            summary.push(o);
                            filterObject[key_] = obj.value;
                        }
                    });
                }
                refineModel.summary = summary;
                //only watch the summary array property of refineModel
                this.options.watch = 'refineModel.summary';
                this.$scope.refineModel = refineModel;
                var self = this;
                setTimeout(function () {
                    self._postInit();
                    //cascade bind the httpValueCollection
                    self._cascadeDatabindColumnFilters(columns, variants, filterObject);
                    self.$rebind();//-->bind the template view
                }, 1000);
            },

            _postInit:function(){
                this._refineEvents();
                this._publish('refine.sync', this.$observable);//-->sync observable with refine controller(which updates button label)
            },

            _refineEvents:function(){
                var self = this;
                var selectionFilters = this.element.find(_selectionFilters);
                var press = this._press();
               
                //filter click
                this._event(this.element, press, 'filter-item', function (event) {
                    
                    self._onFilterClick(event);
                });
                //summary click
                this._event(this.element, press, 'summary-item[filter-type]', this._onSummaryItemClick.bind(this));
                //show all click
                this._event(this.element, press, 'button[data-show-all]', this._onShowAllClick.bind(this));
                //show filtered
                this._event(this.element, press, 'button[data-filter-button]', this._onShowFilteredClick.bind(this));
            },

            _onShowAllClick: function (event) {
                var path = location.pathname;
                location.href = path;
            },

            _onShowFilteredClick:function(event){
                var path = location.pathname;
                var url = path + '?refine=true';
                var summary = this.$observable;
                summary.forEach(function (obj) {
                    url += "&" + utils.toTitleCase(obj.column) + "=" + encodeURIComponent(obj.filter);
                });
                location.href = url;
            },

            _onFilterClick:function(event){
                var filter_ = $(event.currentTarget);
                var a = filter_.find('a');
                if (a.hasClass(_selectedClass)) {
                    return false;
                }
                var filter = a.html();
                var selectionFilter = a.parents(_selectionFilters);
                var column = selectionFilter.attr('filter');
                var columnIndex = selectionFilter.attr('index');
                var obj = {
                    filter: filter,
                    column:column,
                    label: utils.camelCaseToSpace(column).toLowerCase(),
                    columnIndex: columnIndex
                };
                var summary = this.$observable;
                this._addToSummary(summary, obj);//-->adds to or updates summary model
            },

            //either replaces a current summary line with an updated filter
            //from the same column or adds a new line to the summary
            _addToSummary: function (summary, obj) {
                var push = true;
                var length = summary.length;
                for (var i = 0; i < length; i++) {
                    if (summary[i].column === obj.column) {
                        summary[i] = obj;//update model
                        push = false;
                        break;
                    }
                }
                if (push) {
                    summary.push(obj);
                }

                if (this._support.device.ios) {
                    this._modelRebind();//temp hack to work on iOS 8
                }
            },

            _onSummaryItemClick: function (event) {
                var a = $(event.currentTarget);
                var filter = a.attr('filter-value');
                var column = a.attr('filter-type');
                var $scope = this.$scope;
                var obj = {
                    filter: filter,
                    column: column
                };
                var summary = this.$observable;
                this._removeFromSummary(summary, obj);//-->removes item from summary model
            },

            _removeFromSummary: function (summary, obj) {
                var length = summary.length;
                for (var i = 0; i < length; i++) {
                    if (summary[i].column === obj.column && summary[i].filter===obj.filter) {
                        summary.splice(i, 1);
                        break;
                    }
                }
            },

            _filterObject:function(){
                return Object.create(this._data.filterObject);
            },

            _initColumns:function(columns){
                var filterObject = {};
                columns.forEach(function (obj, index) {
                    obj.id = index;
                    var col = utils.toCamelCase(obj.column);
                    obj.column = col;
                    filterObject[col] = null;
                    obj.filters = [];
                });
                this._data.filterObject = filterObject; //refine filter object
                this._data.columns = columns;//store reference to original binding
                return columns;
            },

            _initFilters:function(columns,variants)
            {
                var self = this;
                var filterObject = {};
                columns.forEach(function (obj, index) {
                    obj.id = index;
                    var col = utils.toCamelCase(obj.column);
                    obj.column = col;
                    filterObject[col] = null;
                    obj.filters = [];
                    var filters = obj.filters;
                    var arr = [];
                    var sort = obj.sortBy;
                    if(sort!==''){
                        variants = self._sort(variants,sort);
                    }
                    variants.forEach(function (o) {
                        arr.push(o[col]);
                    });
                    arr = _.uniq(arr);
                    if (arr.length && arr.length > 0) {
                        arr.forEach(function (s) {
                            obj.filters.push({ filter: s,selected:'' });
                        });
                    }
                    
                });
                this._data.filterObject = filterObject; //refine filter object
                this._data.columns = columns;//store reference to original binding
                return {
                    columns: columns,
                    variants: variants
                }
            },

            _sort: function (arr,sort) {
                return _.sortBy(arr, sort);
            },

            _getRefineColumns:function(){
                var columns = this.$scope.refineModel.columns;
                var clone = columns.concat([]);
                return clone;
            },

            _cascadeDatabindColumnFilters: function (columns, variants, filterObject) {
                columnIterationArray = [];
                var self = this;
                columns.forEach(function (obj, index) {
                    var arr = [];
                    var col = obj.column;
                    obj.filters = [];
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
                            var cssClass = (filterObject[col] === s) ? 'disabled' : '';
                            obj.filters.push({ filter: s, selected: cssClass });
                        });
                    }
                 
                    columnIterationArray.push(col);
                });

                this.$scope.refineModel.columns = columns;

                //private filter function
                function _filter(o) {
                    var bool = true;
                    var length=columnIterationArray.length;
                    for (var i = 0; i < length; i++) {
                        var col_ = columnIterationArray[i];
                        bool = (!filterObject[col_] || (filterObject[col_] === o[col_]));
                        if (!bool) {
                            break;
                        }
                    }
                    return bool;
                }
            },

            _modelRebind: function () {
                var columns = this._getRefineColumns();
                var $scope = this.$scope;
                var variants = $scope.refineModel.variants;
                var filterObject = this._filterObject();
                var summary = this.$observable;
                $scope.refineModel.btnClass = (summary.length < 1) ? 'disabled' : '';
                summary.forEach(function (obj) {
                    filterObject[obj.column] = obj.filter;
                });

                this._cascadeDatabindColumnFilters(columns, variants, filterObject);
                this.$rebind();//-->rebind the template view
            },

            _onScopeChange: function (result) {
                this._modelRebind();
            }
        });
    });
})();
