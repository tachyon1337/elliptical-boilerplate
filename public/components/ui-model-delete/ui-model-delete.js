Elliptical(function(){
    $.element('elliptical.modelDelete','ui-model-delete',{
        options:{
            confirm:false,
            confirmText:'Are you sure you want to delete this item?',
            disabled:false
        },

        _initElement:function(){
            var __customElements=this.options.$customElements;
            this._data.selector=(__customElements) ? '[model-id]' : '[model-id]';
        },

        _events:function(){
            var click=this._data.click;
            var self=this;

            this.element.on(click,function(event){
                if(!self.options.disabled){
                    self._remove();
                }
            });
        },

        _remove:function(){
            var confirm_=this.options.confirm;
            var confirmText=this.options.confirmText;
            var selector=this._data.selector;
            var model=this.element.parents(selector);
            var model_=model[0];
            if(confirm_){
                if(confirm(confirmText)){
                    try{
                        model_.remove(); //remove DOM node
                    }catch(ex){
                        model.remove();
                    }

                }
            }else{
                try{
                    model_.remove(); //remove DOM node
                }catch(ex){
                    model.remove();
                }

            }
        },

        _destroy:function(){
            var click=this._data.click;
            this.element.off(click);
        },

        disable:function(){
            this.options.disabled=true;
            this.element.addClass('disabled');
        },

        enable:function(){
            this.options.disabled=false;
            this.element.removeClass('disabled');
        }
    });
});
