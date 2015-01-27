Elliptical(function(){
    $.element('elliptical.modelPaginatedCount','ui-pagination-badge', $.elliptical.pubsub, {

        _initController: function () {
            //this._subscriptions();
        },

        _subscriptions: function () {
            var channel=this.options.channel;
            this._subscribe(channel + '.count',this._setLabel.bind(this));

        },

        _setLabel:function(data){
            this._data.count=data;
            this.element.text(data);
        },

        _setCount:function(){
            var count=this.data.count;
            count--;
            this._setLabel(count);
        }

    });
});
