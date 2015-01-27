Elliptical(function(){
    $.controller('elliptical.badge','ui-model-badge',  {

        _initController:function(){
            var count=this.element.text();
            if(typeof count !== 'undefined' || count!==''){
                count=parseInt(count);
            }else{
                count=0;
            }
            this._data.count=count;

        },

        _subscriptions:function(){
            var channel=this.options.channel + '.count';
            this._subscribe(channel,this._onCountInit.bind(this));
        },

        _onRemoveSubscribe:function(data){
            var count=this._data.count;
            count--;
            this._data.count=count;
            this.element.text(count);

        },

        _onAddSubscribe:function(data){
            var count=this._data.count;
            count++;
            this._data.count=count;
            this.element.text(count);
        },

        _onCountInit:function(count){
            this._data.count=parseInt(count);
        },

        _onChangeSubscribe: $.noop


    });
});
