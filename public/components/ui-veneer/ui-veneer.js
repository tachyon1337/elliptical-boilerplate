Elliptical(function(){

    $.element.registerElement('overlay-element');
    $.element('elliptical.veneer','ui-veneer',{

        options:{
            animationIn:'bounceInDown',
            modalCssClass:null,
            modalZIndex:10000,
            modalOpacity:.3,
            cssClass:null,
            scope:null
        },

        _initElement:function(){
            if(!this.options.template){
                return; //template required
            }
            this._data.model={};
            this._getModel();
            this._attachElement();
            this._show();
        },

        _getModel:function(){
            var scope=this.options.scope;
            if(scope){
                if($$ && $$.elliptical && $$.elliptical.context){
                    this._data.model=($$.elliptical.context[scope]) ? $$.elliptical.context[scope] : {};
                }
            }
        },

        _attachElement:function(){
            var container=$('<overlay-element></overlay-element>');
            this._data.container=container;
            if(this.options.cssClass){
                container.addClass(this.options.cssClass);
            }
            var body=$('body');
            body.append(container);

        },

        _show:function(){
            var self=this;
            this._showModal(function(){
                self._renderElement();
            });
        },

        _renderElement:function(){
            var self=this;
            var container=this._data.container;

            this._render(container,{
                template:this.options.template,
                model:this._data.model

            },function(){
                self._data.element=self._data.container.find('>*');
                self._animate();
            });
        },

        _showModal:function(callback){
            var opts={};
            opts.opacity=this.options.modalOpacity;
            opts.zIndex=this.options.modalZIndex;
            this._setModal(this.element,opts,function(){
                callback();
            });
        },

        _animate:function(){
            var element=this._data.element;
            this._transitions(element,{
                preset:this.options.animationIn
            },function(){

            });
        },

        _onDestroy:function(){
            if(this._data.container){
                this._data.container.remove();
            }
            this._removeModal();
        }

    });

});
