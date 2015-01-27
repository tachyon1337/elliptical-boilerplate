(function(){
    document.addEventListener('WebComponentsReady', function () {
        $.controller("hub.productGallery","product-gallery",{
            _initController:function(){
                //this._bind();
                console.log(this.$scope);
                console.log(this.$viewBag);
            },

            _bind:function(){
                var holder=this._setHolder.bind(this);
                var $scope=this.$scope;
                var Product=this.service('Product');
                Product.get({},function(err,data){
                    $scope.items=data;
                    holder();
                });
            },

            _setHolder:function(){
                var self=this;
                setTimeout(function(){
                    Holder.run({});
                    self._setVisibility();
                },100);
            }

        });
    });
})();
