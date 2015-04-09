Elliptical(function(){
    elliptical.binding('login',function(element,value){
        var $scope=$(element).loginForm('scope');
        var form={
            submitLabel:{},
            state:'Select'
        };
        $.extend($scope,form);
    });

    elliptical.binding('register',function(element,value){
        var $scope=$(element).signupForm('scope');
        var form={
            submitLabel:{},
            state:'Select'
        };
        $.extend($scope,form);
    });

});
