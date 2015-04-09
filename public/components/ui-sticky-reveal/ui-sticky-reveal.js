Elliptical(function(){

    $.element.registerElement('reveal-container');
    $.controller("elliptical.stickyReveal",'ui-sticky-reveal', $.elliptical.scroll, {


        /*==========================================
         PRIVATE
         *===========================================*/
        options:{
            animationIn:'slideIn',
            animationOut:'slideOut',
            durationIn:500,
            durationOut:500,
            yOffset:60
        },

        _initController:function(){
            if(!this._support.mq.touch){
                this._data.$element=null;
                this._data.visible=false;
                this._getContainer();
                if(this.options.template && this.options.event !=='sync'){
                    var model=this._getModel();
                    this._renderElement(model);
                }
                this.__setElement();
            }else{
                this._destroy();
            }


        },

        __setElement:function(){
            //var scrollY = window.pageYOffset;
            this._data.scrollY = window.pageYOffset;
            //this._onScroll(scrollY);
            this._onScroll();
        },

        _getContainer:function(){
            this._data.container=(this.options.$customElements) ? this.element.find('reveal-container') : this.element.find('.reveal-container');
        },

        _onScroll:function(){
            if(this._data.disabled){
                return;
            }
            var y = this._data.scrollY;
            var yOffset=this.options.yOffset;
            var visible=this._data.visible;
            if(y>yOffset && !visible){
                this._data.visible=true;
                this._show();
            }else if(y<yOffset && visible){
                this._data.visible=false;
                this._hide();
            }
        },

        _getModel:function(){
            var scope=this.options.scope;
            var model;
            if(scope){
                if($$ && $$.elliptical && $$.elliptical.context){
                    model=($$.elliptical.context[scope]) ? $$.elliptical.context[scope] : {};
                }
            }
            return model;
        },

        _onRenderElement: function($scope){
            this._renderElement($scope);
        },


        _renderElement:function(model){
            var self=this;
            var container=this._data.container;

            this._render(container,{
                template:this.options.template,
                model:model

            },function(){

            });

        },

        _show:function(){
            var element=this.element;

            this._transitions(element,{
                preset:this.options.animationIn,
                duration:this.options.durationIn
            },function(){

            });
        },

        _hide:function(){
            var element=this.element;
            this._transitions(element,{
                preset:this.options.animationOut,
                duration:this.options.durationOut
            },function(){


            });
        },

        _onSyncSubscribe:function($element){
            if(!this._support.mq.touch){
                this._data.$element=$element;
                var $scope=this.$scope;
                this._onRenderElement($scope);
            }

        },



        _onDestroy:function(){
            if(this.options.template && this._data.container){
                this._data.container.empty();
            }
            if(this._support.mq.touch){
                this._super();
            }

        }

    });
});
