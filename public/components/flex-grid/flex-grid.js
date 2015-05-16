Elliptical(function(){
    $.element.registerElements(['grid-item','grid-pagination','page-navigation','page-info']);
    var _= $.elliptical.utils._;
    $.controller('elliptical.flexGrid','flex-grid',{
        __setScope: function(){
            var context=this.options.context,//context attached to $$.elliptical.context
                scopeProp=this.options.scope; //context property to bind to the instance $scope

            this._data.isEmptyScope= _.isEmpty(this.$scope);
            if(this.$scope && scopeProp && context){
                var $scope=context[scopeProp];
                var columnService=this.options.columnService;
                if(columnService !==undefined){
                    var self=this;
                    this._setColumns(columnService,$scope,function(scope){
                        self.$scope[scopeProp]=scope;
                    });
                }else{
                    this.$scope[scopeProp]=$scope;
                }
            }
        },

        _initController:function(){
            if(this._data.isEmptyScope){
                this._initPaginationStore();
                this.bind();
            }else{
                var pagination=this.$scope.pagination;
                this._setPaginationStore(pagination);
            }
        },

        _events:function(){

        },

        _bind: function(page){
            var self=this;
            var service=this.service(this.options.service);
            var params={
                page:page
            };
            service.get(params,function(err,result){
                if(!err){
                    var pagination=result.pagination;
                    self._setPaginationStore(pagination);
                    self._resetScope(result);
                    self._rebindGrid();

                }else{
                    this._notify('error','error binding data',true);
                }
            });
        },

        _rebindGrid:function(){
            var self=this;
            var $scope=this.$scope;
            this.__render($scope,function(){
                //self.$rebind();
            });
        },

        _resetScope:function(result){
            var $scope=this.$scope;
            result.columns=$scope.columns;
            this.$scope=result;
        },

        _setPaginationStore:function(p){
            this._data.page= p.page;
            this._data.pageCount= p.pageCount;
            this._data.count= p.count;
        },

        _initPaginationStore:function(){
            this._data.page= null;
            this._data.pageCount= null;
            this._data.count= null;
        },

        _setColumns:function(serviceName,$scope,callback){
            var service=this.service(serviceName);
            service.get({},function(err,data){
                if(!err){
                    $scope.columns=data;
                    callback($scope);
                }else{
                    callback($scope);
                }
            })
        }
    });

});
