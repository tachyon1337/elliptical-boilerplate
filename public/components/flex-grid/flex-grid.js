Elliptical(function(){
    $.element.registerElements(['grid-item','grid-pagination','page-navigation','page-info']);
    var _= $.elliptical.utils._;
    $.controller('elliptical.flexGrid','flex-grid',{
        __setScope: function(){
            var context=this.options.context,//context attached to $$.elliptical.context
                scopeProp=this.options.scope; //context property to bind to the instance $scope

            this._data.isEmptyScope= _.isEmpty(this.$scope);
            if(this.$scope && scopeProp && context){
                this.$scope=context[scopeProp];
            }
        },

        _initController:function(){
            if(this._data.isEmptyScope){
                this._initPaginationStore();
                this._bind();
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
            var data=this._data;
            this.__render($scope,function(){
                //self.$rebind();
                var section=self.element.find('section');
                if(section.children().length===0){
                    section.empty();
                }
            });
        },

        _resetScope:function(result){
            this.$scope=result;
        },

        _setPaginationStore:function(p){
            if(p && p!==undefined){
                this._data.page= p.page;
                this._data.pageCount= p.pageCount;
                this._data.count= p.count;
            }else{
                this._data.page= 1;
                this._data.pageCount= 1;
                this._data.count= 0;
            }
        },

        _initPaginationStore:function(){
            this._data.page= null;
            this._data.pageCount= null;
            this._data.count= null;
        }
    });

});
