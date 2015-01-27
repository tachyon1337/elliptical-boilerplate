
(function(){
    window.addEventListener('HTMLImportsLoaded', function() {
        imports();
    });

    function imports(){
        /* attach footer import to main document footer instance */
        var footerDoc = document.querySelector('#footer-doc')
            .import
            .querySelectorAll('footer>*');
        var footerInstance=document.querySelector('[data-role=footer]');
        for (var i = 0; i < footerDoc.length; i++) {
            footerInstance.appendChild(footerDoc[i]);
        }
    }
})();