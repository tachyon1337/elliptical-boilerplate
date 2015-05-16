Elliptical(function(){
    $.controller('elliptical.shareButtons','share-buttons',{
        options:{
            dataBind:false
        },

        _initController:function(){

        },

        _events:function(){
            var $document=$(document);
            var click=this._data.click;
            this._event(this.element,click,'a',this._onClick.bind(this));
            this._event($(window), 'window.action', this._submitEmail.bind(this));
            this._event($document,'focus','[data-role="share-input"]',this._onFocus.bind(this));
        },

        _onClick:function(event){
            var target=$(event.target);
            var id=target.attr('data-id');
            switch(id){
                case 'twitter':
                    this._twitter(target);
                    break;
                case 'facebook':
                    this._facebook(target);
                    break;
                case 'pinterest':
                    this._pinterest(target);
                    break;
                case 'google':
                    this._google(target);
                    break;
                case 'linkedin':
                    this._linkedIn(target);
                    break;
                case 'email':
                    this._email(target);
                    break;
            }

        },

        _twitter:function(target){
            var element=this.element;
            var url=encodeURI(element.attr('url'));
            var text=encodeURI(element.attr('title'));
            var URL='https://twitter.com/share?url=' + url + '&text=' + text;
            this._launchWindow(URL);
        },

        _facebook:function(target){
            var element=this.element;
            var url=encodeURI(element.attr('url'));
            var text=encodeURI(element.attr('title'));
            var URL='https://www.facebook.com/share.php?u=' + url + '&title=' + text;
            this._launchWindow(URL);
        },

        _pinterest:function(target){
            var element=this.element;
            var url=encodeURI(element.attr('url'));
            var text=encodeURI(element.attr('title'));
            var media=encodeURI(element.attr('media'));
            var URL='https://pinterest.com/pin/create/bookmarklet/?media=' + media + '&url=' + url + '&is_video=false&description=' + text;
            this._launchWindow(URL);
        },

        _google:function(target){
            var element=this.element;
            var url=encodeURI(element.attr('url'));
            var URL='https://plus.google.com/share?url=' + url;
            this._launchWindow(URL);
        },

        _linkedIn:function(target){
            var element=this.element;
            var url=encodeURI(element.attr('url'));
            var text=encodeURI(element.attr('title'));
            var source=this._getDomainName();
            var URL='http://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + text + '&source=' + source;
            this._launchWindow(URL);
        },

        _email:function(target){
            var opts = {};
            opts.animationIn='slideDownIn';
            opts.model = {
                partial: 'email-share',
                title: 'Email Share',
                buttonLabel: 'Send',
                id: 'x-wind',
                buttonRole: 'send',
                buttonSize: 'small',
                buttonClass: 'inverse'
            };

            opts.window = {
                animationIn: 'none',
                cssClass: '',
                modal:false,
                width: 540,
                height: 510

            };
            this._window(opts, function (err, window) {

            });
        },

        _getDomainName:function(){
            var hostName=location.hostname;
            return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
        },

        _launchWindow:function(url){
            window.open(url);
        },

        _onFocus:function(event){
            var target=$(event.target);
            if(target.hasClass('error')){
                target.removeClass('error');
                var dataPlaceholder=target.attr('data-placeholder');
                target.attr('placeholder',dataPlaceholder);
            }

        },

        _submitEmail:function(event,data){
            var target=data.target;
            var emailElement=target.find('#share-buttons-email');
            var email=emailElement.val();
            if(email===''){
                emailElement.addClass('error');
                emailElement.attr('placeholder','Required');
                return;
            }
            var nameElement=target.find('#share-buttons-name');
            var name=nameElement.val();
            if(name===''){
                nameElement.addClass('error');
                nameElement.attr('placeholder','Required');
                return;
            }
            var messageElement=target.find('#share-buttons-message');
            var message=messageElement.val();
            var params={
                name:name,
                email:email,
                message:message,
                url:location.href
            };
            this._notify('success','Your shared link has been sent',true);
            var service=this.service('SendToFriend');
            service.post(params);
            target.window('hide');
        }


    });
});
