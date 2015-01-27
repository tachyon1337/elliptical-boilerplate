(function(){
    window.addEventListener('HTMLImportsLoaded', function() {
        imports();
    });

    function imports(){
        /* attach sticky-reveal import to main document instance */
        var stickyDoc = document.querySelector('#sticky-doc')
            .import
            .querySelectorAll('ui-sticky-reveal>*');
        var stickyInstance=document.querySelector('#sticky-reveal');
        for (var i = 0; i < stickyDoc.length; i++) {
            stickyInstance.appendChild(stickyDoc[i]);
        }
    }
})();
