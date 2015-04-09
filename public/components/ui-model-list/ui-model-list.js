Elliptical(function(){
    $.controller('elliptical.modelList','ui-model-list', {
        __setScope: function () {
            var context=this.options.context, //context attached by the route
                scopeProp=this.options.scope,//context property to use as the scope
                key=this.options.idProp;

            if(key===undefined){
                this.options.key=this._data.scopeId;
            }
            if(scopeProp && context){
                this.$scope[scopeProp]=context[scopeProp];
            }else{
                this.$scope = {items:[]};
            }

        },

        _initController:function(){


        },

        __onActiveSubscribe:function(id){
            var models=this.__templateModels();
            models.removeClass('active');
            var node=this.__templateNode(id);
            node.addClass('active');
        },

        __onSyncSubscribe: function(result){
            if(!result || result===undefined){
                return false;
            }
            var data=result.$scope;
            var self=this;
            var arr=data[Object.keys(data)[0]];
            arr.forEach(function(obj){
                var result={};
                result.added=[];
                result.added.push(obj);
                self.__onScopeChange(result);
            });
            this._onSyncSubscribe(data);
            return true;
        },

        _publishCount:function(){
            var length=this.__scopeLength();
            if(this.options.channel){
                this._publish(this.options.channel + '.count',length);
            }else if(this.options.scope){
                this._publish(this.options.scope + '.count',length);
            }
        },

        _publishRemove:function(){
            if(this.options.channel){
                this._publish(this.options.channel + '.remove',{});
            }
        },


        _onScopeChange:function(result){
            this._publishCount();
            var model=this.options.service;
            var id=this.options.idProp;
            var key=this.options.modelKey;
            if(key!==undefined){
                id=key;
            }
            var eventBlock=this.options.eventBlock;
            if(typeof model !== 'undefined' && !eventBlock){
                var Model=this.service(model);
                if(result.removed && result.removed.length){
                    result.removed.forEach(function(obj){
                        var params={};
                        params[id]=obj[id];
                        Model.delete(params);

                    });
                }
            }
        }

    });
});
