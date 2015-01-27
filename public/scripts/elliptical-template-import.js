/* clone template nodes from imported custom element definitions to instances in the current HTML document
 *
 * handle "upgrade" for two events: HTMLImportsLoaded & ellipsis.onMutation
 * also expose an api method for use in implementing two-way data-binding on imported elements
 * */
(function(){
    var nativeTemplate=supportsTemplate();
    var linkImports=null;
    var importElements=[];

    //http://jsfiddle.net/brianblakely/h3EmY/
    //polyfills html5 template (IE & safari)
    function templatePolyFill(d){

        if(nativeTemplate){
            return false;
        }

        var qPlates = d.getElementsByTagName('template'),
            plateLen = qPlates.length,
            elPlate,
            qContent,
            contentLen,
            docContent;

        for(var x=0; x<plateLen; ++x) {
            elPlate = qPlates[x];
            qContent = elPlate.childNodes;
            contentLen = qContent.length;
            docContent = d.createDocumentFragment();

            while(qContent[0]) {
                docContent.appendChild(qContent[0]);
            }

            elPlate.content = docContent;
        }

    }

    //polyfill unsupported template innerHTML
    function templateInnerHTML(template){
        if(nativeTemplate){
            return template.innerHTML;
        }else{
            var content=template.content;
            var innerHTML='';
            var childNodes=content.childNodes;
            var length=childNodes.length;
            for(var i=0;i<length;i++){
                var ele=$(childNodes[i]);
                var ele0=ele[0];
                if(ele0.innerHTML !==undefined){
                    innerHTML+=ele0.outerHTML;
                }

            }
            return innerHTML;
        }
    }

    function supportsTemplate(){

        return ('content' in document.createElement('template'));
    }

    /* listeners ---------------------------------------------------- */
    window.addEventListener('HTMLImportsLoaded', function() {
        appendCustomElementsTemplateImports()
    });
    //TODO: replace ellipsis.onMutation with more generic 'OnDocumentMutation'
    window.addEventListener('ellipsis.onMutation ', function() {

    });
    /* end listeners ----------------------------------------------- */

    function appendCustomElementsTemplateImports(){
        var links=getLinks();
        $.each(links,function(index,link){
            var doc=link.import;
            parseImportDocument(doc,index);
        });
    }

    function getLinks(){
        if(linkImports){
            return linkImports;
        }else{
            linkImports=[];
            var links=$('link[rel="import"]');
            $.each(links,function(index,link){
               recurseLink(link);
            });
            return linkImports;
        }
    }

    //note: possibility of embedded/sub imports necessitates recursion
    function recurseLink(link){
        if(link.import){
            linkImports.push(link);
            var all=link.import.all;
            if(all !==undefined){
                var length=all.length;
                for(var i=0;i<length;i++){
                    var link_=all[i];
                    var import_=link_.import;
                    if(import_ !==undefined){
                        recurseLink(link_);
                    }
                }
            }
        }
    }

    function parseImportDocument(doc,idx){
        templatePolyFill(doc);
        var templates=$(doc).find('template');
        $.each(templates,function(index,template){
            var parentNode=template.parentNode;
            var tag=parentNode.tagName;
            //polyfill innerHTML if template unsupported
            var templateStr=templateInnerHTML(template);
            var parse=(parseTemplate(parentNode)) ? true : false;
            var o_={tag:tag,index:idx,parse:parse,str:templateStr,template:template};
            importElements.push(o_);
            parseDocument(tag,template,parse,templateStr);
        });
    }

    function parseDocument(tag,template,parseTemplate,templateStr){
        var elements=$(document).find(tag);
        $.each(elements,function(index,element){
            //check to make sure document element instance requires upgrading
            if(doUpgrade(element)){
                upgradeElement(element,parseTemplate,template,templateStr);
            }
        });
    }

    function doUpgrade(element){
        var noTemplate=element.getAttribute('no-template');
        var upgraded=element.dataset.upgraded;
        return (!noTemplate && noTemplate !=='' && (upgraded===undefined || upgraded==='false'));
    }

    function upgradeElement(element, parseTemplate, template, templateStr) {
        /* if the element definition contains a 'parse-template' attribute, we will need to
         to regex replace ##attribute## occurrences in the definition with values in the instance
         before we clone the template.content and append to the element instance(hence, attributeBind)
         */

        var clone;
        if (parseTemplate) {
            //clone template node content from definition
            clone = attributeBind(element, templateStr);
            //merge the content with the innerHTML of the instance(replaces ui-template node in the definition with the instance innerHTML)
            clone = mergeTemplateContent(clone, element);
            $(element).empty();
            //attribute binding occasionally causes the dreaded chrome "ah, snap" w/o a setTimeout 
            setTimeout(function () {
                //append the cloned content to the element instance
                element.appendChild(clone);
                element.dataset.upgraded = true;
                //publish the upgrade event
                $(document).trigger('OnElementImport', { node: element });
            }, 100);
        } else {
            var content = template.content;
            //IE issue: if template.content has no childNodes, create a new document-fragment from the templateStr
            if (content.childNodes && content.childNodes.length === 0) {
                template = createTemplateNode(templateStr);
            }
            //clone template node content from definition
            clone = template.content.cloneNode(true);
            //merge the content with the innerHTML of the instance
            clone = mergeTemplateContent(clone, element);
            $(element).empty();
            //append the cloned content to the element instance
            element.appendChild(clone);
            element.dataset.upgraded = true;
            //publish the upgrade event
            $(document).trigger('OnElementImport', { node: element });
        }
    }

    function attributeBind(element,templateStr){
        $.each(element.attributes, function(i, att){
            /* note: "{{ }}" interferes with other popular template engines, including dustjs
               hence, we use "## ##"
             */
            var re = new RegExp("##" + att.name + "##","g");
            templateStr=templateStr.replace(re,att.value);
        });
        //replace undefined ##attr## occurrences in the templateStr with an empty string
        templateStr=templateStr.replace(/##(.*?)##/g, '');
        templateStr=templateStr.replace(/##/g, '');
        var template = createTemplateNode(templateStr);
        return template.content.cloneNode(true);
    }

    function parseTemplate(importNode){
        var att=importNode.getAttribute('parse-template');
        return (att || att ==='');
    }

    function _DOMParser(markup, type) {
        var doc = document.implementation.createHTMLDocument("");
        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
            doc.documentElement.innerHTML = markup;
        }
        else {
            doc.body.innerHTML = markup;
        }
        return doc;
    }

    function mergeTemplateContent(clone,instance){
        var innerHtml = instance.innerHTML;
        innerHtml = (innerHtml.trim) ? innerHtml.trim() : innerHtml.replace(/^\s+/, '');
        if (innerHtml !== '') {
            var uiTemplate = clone.querySelector('ui-template');
            if (uiTemplate) {
                $(uiTemplate).replaceWith(innerHtml);
                return clone;
            } else {
                var uiTemplateForm = clone.querySelector('form');
                if (uiTemplateForm) {
                    $(uiTemplateForm).replaceWith(innerHtml);
                    return clone;
                }
            }
        } else {
            return clone;
        }
    }

    function parseElementImport(tag,element){
        var length=importElements.length;
        var elementImport=null;
        for(var i=0;i<length;i++){
            var tag_=importElements[i].tag;
            if(tag_.toLowerCase()===tag.toLowerCase()){
                elementImport=importElements[i];
                break;
            }
        }
        if(elementImport){
            var parseTemplate=elementImport.parse;
            var templateStr=elementImport.str;
            var template=elementImport.template;
            upgradeElement(element,parseTemplate,template,templateStr);
        }
    }

    function createTemplateNode(templateStr) {
        templateStr = '<template>' + templateStr + '</template>';
        var doc = new DOMParser().parseFromString(templateStr, 'text/html');
        //mainly for safari here(???, native DOMParser for safari returning null)
        if (!doc) {
            doc = _DOMParser(templateStr, 'text/html');
        }
        templatePolyFill(doc);
        return doc.querySelector('template');
    }



    function onMutation(){

    }

    //api
    var HTML5Imports={};
    HTML5Imports.upgradeElement=function(tag,node){
        parseElementImport(tag,node);
    };
    window._HTML5Imports=HTML5Imports;


})();
