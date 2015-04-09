/*
 * =============================================================
 * elliptical.utils
 * =============================================================
 *
 * utils + lodash
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('lodash'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical=root.elliptical || {};
        root.elliptical.utils = factory(_);
        root.returnExports = root.elliptical.utils;
    }
}(this, function (_) {
    return {
        /* assign lodash to elliptical.utils._ */
        _:_,


        /**
         * Turns any object in an array.
         * @param array {Array}
         * @param results {Array} optional
         * @returns {Array} a new array or results
         */
        makeArray: function(array, results)
        {
            var ret = results || [];

            if (array != null)
            {
                var type = typeof array;
                if (array.length == null || type === "string" || type === "function"
                    || type === "regexp")
                {
                    ret.push(array);
                } else
                {
                    _.merge(ret, array);
                }
            }

            return ret;
        },

        concatArgs: function(arr, args){
            return this.makeArray(arr).concat(this.makeArray(args));
        },

        mergeArrays: function (array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        },

        cloneArray:function(arr){
            return arr.slice(0);
        },

        extend: function()
        {
            // copy reference to target object
            var target = arguments[0] ||
            {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

            // Handle a deep copy situation
            if (typeof target === "boolean")
            {
                deep = target;
                target = arguments[1] ||
                {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !typeof target === 'function')
            {
                target =
                {};
            }

            for (; i < length; i++)
            {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) !== null)
                {
                    // Extend the base object
                    for (name in options)
                    {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy)
                        {
                            continue;
                        }

                        // Recurse if we're merging object literal values or arrays
                        if (deep && copy && (isPlainObject(copy) || isArray(copy)))
                        {
                            var clone = src && (isPlainObject(src) || isArray(src)) ? src
                                : isArray(copy) ? [] :
                            {};

                            // Never move original objects, clone them
                            target[name] = extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (typeof copy !== "undefined")
                        {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },

        /**
         * monkey patch browsers(IE) that do not support Function.name
         *
         */
        patchFunctionName:function(){
            if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
                Object.defineProperty(Function.prototype, 'name', {
                    get: function() {
                        var funcNameRegex = /function\s([^(]{1,})\(/;
                        var results = (funcNameRegex).exec((this).toString());
                        return (results && results.length > 1) ? results[1].trim() : "";
                    },
                    set: function(value) {}
                });
            }
        },



        /**
         * remove of an array of items from an array
         * @param arr1 {Array}
         * @param arr2 {Array}
         * @returns {Array}
         */
        removeFromArray: function (arr1, arr2) {

            for (var i = 0; i < arr1.length; i++) {
                if (this.inArray(arr2, arr1[i])) {
                    arr1.splice(i, 1);
                }
            }

            return arr1;
        },

        /**
         * empty an array
         * @param arr {Array}
         */
        emptyArray:function(arr){
            arr.splice(0,arr.length);
        },


        isValidArrayIndex: function(val){
            return /^[0-9]+$/.test(String(val));
        },



        /**
         * generate a guid string
         * @returns {string}
         */
        guid: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        /**
         * generate a random string of length
         * @param length
         * @returns {string}
         */
        randomString: function (length) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        },

        /**
         * generate a random id string of 16 numbers
         * @returns {string}
         */
        idString: function () {
            var length=16;
            var chars = '0123456789';
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        },

        /**
         * returns an empty guid string
         * @returns {string}
         */
        emptyGuid: function(){
            return '00000000-0000-0000-0000-000000000000';
        },

        isEmptyGuid:function(g){
            var test=this.emptyGuid();
            return (g===test);
        },


        /**
         * tests for window to determine if browser environment
         * @returns {boolean}
         */
        isBrowser: function(){
            return typeof window != 'undefined';
        },

        isIPAddress:function(ip){
            return (/^(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])$/.test(ip));
        },

        isLocalHost:function(host){
            host=host.toLowerCase();
            if(host==='localhost'){
                return true
            }else if(host.indexOf('127.0.0.1')> -1){
                return true;
            }else {
                if(this.isIPAddress(host)){
                    return (isLocalBlock(host));
                }else{
                    return false;
                }
            }

            function isLocalBlock(ip){
                var x = ip.split("."), x1, x2, x3, x4;
                if (x.length == 4) {
                    x1 = parseInt(x[0], 10);
                    x2 = parseInt(x[1], 10);
                    x3 = parseInt(x[2], 10);
                    x4 = parseInt(x[3], 10);

                    return ((x1===10) || (x1===172 && x2===16) || (x1===192) && (x2===168));
                }
                return false;
            }
        },

        //{month:'Jan',usage:100},{month:'Jan',usage:145}, {usage:'prevYearUsage'}==>{month:'Jan',usage:100,prevYearUsage:145}
        extendObjProp:function(a,b,propMap){
            for (var key in b) {
                if(b.hasOwnProperty(key) && propMap.hasOwnProperty(key)){
                    a[propMap[key]]=b[key];
                }
            }
            return a;
        },

        /*
         a=[{month:'Jan',usage:100}...{month:'Dec',usage:175}]
         b=[{month:'Jan',usage:90}...{month:'Dec',usage:165}]
         propMap={usage:'prevYearUsage'}
         ===>[{month:'Jan',usage:100,prevYearUsage:90},{month:'Dec',usage:175,prevYearUsage:165}]
         */
        mergeObjArraysProp:function(a,b,propMap){
            var arr=[];
            if(_.isArray(a) && _.isArray(b) && a.length=== b.length){
                for(var i=0;i< a.length;i++){
                    arr.push(this.extendObjProp(a[i],b[i],propMap));
                }
                return arr;

            }else{
                return arr;
            }
        },

        /**
         * returns a crrent date string
         * @returns {string}
         */
        currentDate:function(){
            var obj=this.currentDateObj();
            return (obj.month + '/' + obj.day + '/' + obj.year);
        },

        encodeURISection:function(url,index){
            if(this.strFirstChar(url)==='/'){
                url=this.trimFirstChar(url);
            }
            var arr=url.split('/');
            var section=arr[index];
            section=encodeURIComponent(section);
            var length=arr.length;
            var url_='';
            for(var i=0;i<length;i++){
                url_+=(i===index) ? '/' + section : '/' + arr[i];
            }

            return url_;
        },

        /**
         * return an object representing current date
         * @returns {{day: number, month: number, year: number}}
         */
        currentDateObj:function(){

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            return{
                day:day,
                month:month,
                year:year
            };
        },

        /**
         * get first char of string
         * @param s {String}
         * @returns {string}
         */
        strFirstChar:function(s){
            return s.charAt(0);
        },

        /**
         * get last char of string
         * @param s {String}
         * @returns {String}
         */
        strLastChar:function(s){
            return s.slice(-1);

        },

        /**
         * returns first n chars of string
         * @param s {String}
         * @param n {Number}
         * @returns {string}
         */
        strFirstNChars:function(s,n){
            return s.substr(0,n);
        },

        /**
         * returns last n chars of string
         * @param s {String}
         * @param nv{Number}
         * @returns {string}
         */
        strLastNChars:function(s,n){
            return s.substr(s.length - n);
        },

        /**
         * trim first chr from string
         * @param s {String}
         * @returns {String}
         */
        trimFirstChar:function(s){
            return s.substring(1);
        },

        /**
         * trim last chr from string
         * @param s {String}
         * @returns {String}
         */
        trimLastChar:function(s){
            return s.substring(0, s.length-1);
        },

        trimLastNChars:function(s,n){
            return s.substring(0, s.length-n);
        },

        ellipsisTrim:function(s,maxLength){
            var ret=s;
            if (ret.length > maxLength) {
                ret = ret.substr(0,maxLength-4) + " ...";
            }
            return ret;
        },

        /**
         * replaces a string with another string at index
         *
         * @param string {String}
         * @param index {Number}
         * @param replaceStr {String}
         * @returns {string}
         */
        stringReplaceAt: function(string,index, replaceStr) {
            return string.substr(0, index) + replaceStr + string.substr(index+replaceStr.length);
        },

        /**
         * inserts a string value at specified index in a string
         * @param string {String}
         * @param index {Number}
         * @param insertStr {String}
         * @returns {string}
         */
        stringInsertAt:function(string,index,insertStr){
            return string.substr(0, index) + insertStr + string.substr(index);
        },

        /**
         * validates type to be numeric
         * @param n {Object}
         * @returns {boolean}
         */
        isNumeric: function(n){
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        /**
         * converts a dash delimited string to a camelCase string
         *
         * @param s {String}
         * @returns {String}
         */
        dashToCamelCase:function(s){
            return s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        },

        camelCaseToDash:function(s){
            return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },

        /**
         * camel case to space separated
         * @param s {String}
         * @returns {String}
         */
        camelCaseToSpace:function(s){
            var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
            return s.replace( rex, '$1$4 $2$3$5' );
        },

        camelCaseToSpacedTitleCase: function (s) {
            var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
            var ret = s.replace(rex, '$1$4 $2$3$5');
            return this.toTitleCase(ret);
        },

        /**
         * camel case input string
         * @param s
         * @returns {String}
         */
        toCamelCase:function(s){
            return s
                .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });

        },

        toTitleCase:function(s){
            return s.charAt(0).toUpperCase() + s.slice(1);
        },

        /**
         * converts a space delimited string to a dash delimited string
         *
         * @param s {String}
         * @returns {String}
         */
        spaceToDash:function(s){
            return s.replace(/\s+/g, '-').toLowerCase();
        },

        /**
         * validates if the value of an object prop is an array
         *
         * @param obj {Object}
         * @param prop {String}
         * @returns {boolean}
         */
        isPropertyArray:function(obj,prop){
            return !!((_.isArray(obj[prop])));
        },

        /**
         * is object/value in array
         * @param arr {Array}
         * @param obj {Object}
         * @returns {Boolean}
         */
        inArray:function(arr,obj){
            return  _.find(arr,function(o){
                return _.isEqual(o,obj);
            })
        },




        /**
         * validates if the value of an object prop by index is an array
         *
         *
         * @param obj {Object}
         * @param index {Number}
         * @returns {boolean}
         */
        isPropertyByIndexArray:function(obj,index){
            try{
                var o=obj[Object.keys(obj)[index]];
                return !!((_.isArray(o)));
            }catch(ex){
                return false;
            }

        },

        /**
         * gets the value of an object prop by index
         *
         *
         * @param obj {Object}
         * @param index {Number}
         * @returns value
         */
        objectPropertyByIndex:function(obj,index){
            return obj[Object.keys(obj)[index]];
        },

        isPropertyArrayByPath:function(obj,path){
            var prop=this.objectPropertyByPath(obj,path);
            return !!((_.isArray(prop)));

        },

        /**
         * converts a delimited path into an array of props
         * 'items.0.FirstName' --> [items,0,FirstName]
         *
         * @param path {String}
         * @param separator {String}
         * @returns {Array}
         */
        splitPath:function(path,separator){
            if (typeof separator == 'undefined') {
                separator = '.';
            }
            if ((typeof path ==='undefined') || path === '') {
                return [];
            } else {
                if (_.isArray(path)) {
                    return path.slice(0);
                } else {
                    return path.toString().split(separator);
                }
            }
        },

        /**
         * resolves the value of an object path
         * obj, 'items.0.FirstName'  --> 'John','FirstName'
         * returns an array of value,prop
         *
         * @param a {Object}
         * @param path {String}
         * @param options {Object}
         * @returns {Array}
         */
        resolvePath: function(a, path, options){
            var e, k, last, stack;
            if (options == null) {
                options = {};
            }
            stack = this.splitPath(path);
            last = [stack.pop()];
            e = a;
            while ((k = stack.shift()) !== void 0) {
                if (e[k] !== void 0) {
                    e = e[k];
                } else {
                    stack.unshift(k);
                    break;
                }
            }
            if (options.force) {
                while ((k = stack.shift()) !== void 0) {
                    if ((typeof stack[0] === 'number') || ((stack.length === 0) && (typeof last[0] === 'number'))) {
                        e[k] = [];
                    } else {
                        e[k] = {};
                    }
                    e = e[k];
                }
            } else {
                while ((k = stack.pop()) !== void 0) {
                    last.unshift(k);
                }
            }
            return [e, last];
        },

        /**
         * resolves the value of an object path
         * obj, 'items.0.FirstName'  --> 'John'
         *
         * @param obj {Object}
         * @param path {String}
         * @returns value
         */
        objectPropertyByPath: function(obj,path){
            try{
                var pathArray=this.splitPath(path);
                var a=obj;
                pathArray.forEach(function(p){
                    var b=a[p];
                    a=b;
                });
                return a;
            }catch(ex){
                return undefined;
            }

        },

        /**
         * returns the index of an element with idProp==id in an array
         * @param obj {Object}
         * @param id {String}
         * @param idProp {String}
         * @returns {Number}
         */
        objectIndexById:function(obj,id,idProp){
            if(idProp===undefined){
                idProp='id';
            }
            var arr=this.objectPropertyByIndex(obj,0);
            if(arr.length && arr.length > 0){
                var len=arr.length;
                var index;
                for(var i=0;i<len;i++){
                    if(arr[i][idProp]===id){
                        index=i;
                        break;
                    }
                }
                return index;
            }else{
                return undefined;
            }
        },

        assignValueToPath:function(obj,path,value){
            try{
                var pathArray=this.splitPath(path);
                var a=obj;
                var len=pathArray.length;
                var max=len-1;
                for(var i=0;i<len;i++){
                    if(i===max){
                        a[pathArray[i]]=value;
                    } else{
                        var b=a[pathArray[i]];
                        a=b;
                    }
                }
            }catch(ex){

            }
        },

        /**
         * return the length of an array property of an object by path
         * @param obj {Object}
         * @param path {String}
         * @returns {Number}
         */
        arrayPropertyLengthByPath:function(obj,path){
            //console.log(path);
            var prop=this.objectPropertyByPath(obj,path);
            return (prop && _.isArray(prop)) ? prop.length : null;

        },

        /**
         * returns the index of the path
         * @param path {String}
         * @returns {Number}
         */
        getIndexFromPath:function(path){
            if(path !==undefined){
                var parts=path.split('.');
                var length;
                if(parts.length){
                    length=parts.length;
                    length--;
                    return parts[length];

                }else{
                    return undefined;
                }
            }else{
                return undefined;
            }

        },

        /**
         * is path part of an array
         * @param path {String}
         * @returns {Boolean}
         */
        isPathInArray:function(path){
            var index=this.getIndexFromPath(path);
            return (index !== undefined) ? this.isNumeric(index) : undefined;
        },


        /**
         * converts an array(of contexts and indices) and a property into a path string
         * [{index:5,context:User},{index:0,context:Address}],City ---> User.5.Address.0.City
         * @param arr {Array}
         * @param prop {String}
         * @returns {String}
         */
        createPath: function(arr,prop){
            var path='';
            if(arr && arr.length){
                arr.forEach(function(obj){
                    path+=obj.context + '.' + obj.modelIndex + '.';
                });

                (typeof prop !=='undefined') ? path+=prop : path=path.substring(0, path.length - 1);
                return path;
            }
        },

        /**
         * converts an array of object properties into a path
         * @param arr {Array}
         * @returns {String} path
         */
        createPathFromArray:function(arr){
            var path='';
            if(arr && arr.length){
                var index=0;
                arr.forEach(function(obj){
                    path+=(index < arr.length -1) ? obj + '.' : obj;
                    index++;
                });
                return path;
            }
        },

        /**
         * deletes an obj prop by path
         * @param obj {Object}
         * @param path {String}
         */
        deleteObjectPropertyByPath: function(obj,path){
            var pathArray=this.splitPath(path);
            var a=obj;
            var len=pathArray.length;
            var max=len-1;
            for(var i=0;i<len;i++){
                if(i===max){
                    delete a[pathArray[i]];
                } else{
                    var b=a[pathArray[i]];
                    a=b;
                }
            }
        },

        /**
         * tests if a prop is the last node in a path
         * @param path {String}
         * @param prop {String}
         * @returns {boolean}
         */
        isPathProperty: function(path,prop){
            var splitPath=this.splitPath(path);
            var prop_=splitPath.pop();
            return ((prop_=== prop));
        },

        /**
         * deletes an object from a $scope model list by id value
         * @param obj {Object}
         * @param idProp {String}
         * @param id {String|Value}
         * @returns {Number} the index of the deleted object
         */
        deleteObjectByIdFromArrayProp: function(obj,idProp,id){
            var index=null;
            if(!this.isPropertyByIndexArray(obj,0)){
                return index;
            }
            var arr=obj[Object.keys(obj)[0]];
            for(var i=0;i<arr.length;i++){
                if(arr[i][idProp].toString()===id.toString()){
                    arr.splice(i,1);
                    index=i;
                    break;
                }
            }

            return index;
        },


        /**
         * finds an object in a $scope model list by id
         * @param obj {Object}
         * @param idProp {String}
         * @param id {String|Value}
         * @returns {*}
         */
        selectObjectByIdFromArrayProp: function(obj,idProp,id){
            var obj_;
            var index=null;
            if(!this.isPropertyByIndexArray(obj,0)){
                return index;
            }
            var arr=obj[Object.keys(obj)[0]];
            for(var i=0;i<arr.length;i++){
                if(arr[i][idProp].toString()===id.toString()){
                    obj_=arr[i];
                    break;
                }
            }

            return obj_;

        },

        /**
         * finds an object in an array by id
         * @param arr {Array}
         * @param id {String}|{Number}
         * @param propId {String}
         * @returns {Object}
         */
        findById: function(arr,id,propId){
            if(typeof propId==='undefined'){
                propId='id';
            }
            return _.find(arr, function(obj) {
                return obj[propId]===id;
            });

        },

        /**
         * inserts an index into a model list path(at path index=1)
         * @param path {String}
         * @param index {Number}
         * @returns {String}
         */
        replaceIndexInPath: function(path,index){
            var arr=this.splitPath(path);
            arr[1]=index;
            return arr.join('.');

        },

        observerMapPath:function(path){
            var arr=this.splitPath(path);
            var num=this.isNumeric;
            if(arr && arr.length){
                var mapped= _.map(arr,function(v){
                    return (num(v)) ? '['+ v.toString() + ']' : v;
                });

                return mapped.join('.').replace(/.\[/,'[');

            }else{
                return path;
            }
        },



        /**
         * returns the changes between two objects as properties on the returned object
         * ex: n={FirstName:'John',LastName:'Smith'},o={FirstName:'Bob',LastName:'Smith'} ===> {FirstName:'John'}
         * @param n {Object}
         * @param o {Object}
         * @returns {Object}
         */
        objChangedProps:function(n,o){
            var obj={};
            var keys= _.keys(n);
            keys.forEach(function(v){
                if(!_.isEqual(n[v],o[v])){
                    obj[v]=n[v];
                }
            });
            return obj;
        },

        parseCurrency:function(v){
            if(typeof v==='string'){
                v= v.replace('$','');
                v= v.replace(/,/g,'');
                v=parseFloat(v);
            }
            return v;
        },

        extendedAmount: function(v,q){
            if(typeof v==='string'){
                v= v.replace('$','');
                v=parseFloat(v);
            }
            return this.formatCurrency(v*q);
        },

        formatCurrency:function(value){
            value=parseFloat(value);
            return value.toFixed(2);

        },


        extFormatCurrency:function(m,v,symbolPrefix){

            if(typeof m==='number' || typeof m==='string' && (arguments.length===1 || typeof v==='boolean')){
                v=m;
                v=parseFloat(v);
                m='#,##0.00';
            }
            if(typeof symbolPrefix==='undefined'){
                symbolPrefix=false;
            }


            //convert any string to number according to formation sign.
            var v = m.charAt(0) == '-'? -v: +v;
            var isNegative = v<0? v= -v: 0; //process only abs(), and turn on flag.

            //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
            var result = m.match(/[^\d\-\+#]/g);
            var Decimal = (result && result[result.length-1]) || '.'; //treat the right most symbol as decimal
            var Group = (result && result[1] && result[0]) || ',';  //treat the left most symbol as group separator

            //split the decimal for the format string if any.
            var m = m.split( Decimal);
            //Fix the decimal first, toFixed will auto fill trailing zero.
            v = v.toFixed( m[1] && m[1].length);
            v = +(v) + ''; //convert number to string to trim off *all* trailing decimal zero(es)

            //fill back any trailing zero according to format
            var pos_trail_zero = m[1] && m[1].lastIndexOf('0'); //look for last zero in format
            var part = v.split('.');
            //integer will get !part[1]
            if (!part[1] || part[1] && part[1].length <= pos_trail_zero) {
                v = (+v).toFixed( pos_trail_zero+1);
            }
            var szSep = m[0].split( Group); //look for separator
            m[0] = szSep.join(''); //join back without separator for counting the pos of any leading 0.

            var pos_lead_zero = m[0] && m[0].indexOf('0');
            if (pos_lead_zero > -1 ) {
                while (part[0].length < (m[0].length - pos_lead_zero)) {
                    part[0] = '0' + part[0];
                }
            }
            else if (+part[0] == 0){
                part[0] = '';
            }

            v = v.split('.');
            v[0] = part[0];

            //process the first group separator from decimal (.) only, the rest ignore.
            //get the length of the last slice of split result.
            var pos_separator = ( szSep[1] && szSep[ szSep.length-1].length);
            if (pos_separator) {
                var integer = v[0];
                var str = '';
                var offset = integer.length % pos_separator;
                for (var i=0, l=integer.length; i<l; i++) {

                    str += integer.charAt(i); //ie6 only support charAt for sz.
                    //-pos_separator so that won't trail separator on full length
                    if (!((i-offset+1)%pos_separator) && i<l-pos_separator ) {
                        str += Group;
                    }
                }
                v[0] = str;
            }

            v[1] = (m[1] && v[1])? Decimal+v[1] : "";
            var curr=(isNegative?'-':'') + v[0] + v[1]; //put back any negation and combine integer and fraction.
            return (symbolPrefix)? '$' + curr : curr;
        },

        validateCreditCard:function(cardnumber, cardname){
            var ccErrorNo = 0;
            var ccErrors = new Array()

            ccErrors[0] = "Unknown card type";
            ccErrors[1] = "No card number provided";
            ccErrors[2] = "Credit card number is in invalid format";
            ccErrors[3] = "Credit card number is invalid";
            ccErrors[4] = "Credit card number has an inappropriate number of digits";
            ccErrors[5] = "Warning! This credit card number is associated with a scam attempt";

            if (cardname.toLowerCase() === 'paypal') {
                return true;
            }
            // Array to hold the permitted card characteristics
            var cards = new Array();

            // Define the cards we support. You may add addtional card types as follows.

            //  Name:         As in the selection box of the form - must be same as user's
            //  Length:       List of possible valid lengths of the card number for the card
            //  prefixes:     List of possible prefixes for the card
            //  checkdigit:   Boolean to say whether there is a check digit

            cards[0] = {
                name: "Visa",
                length: "13,16",
                prefixes: "4",
                checkdigit: true
            };
            cards[1] = {
                name: "MasterCard",
                length: "16",
                prefixes: "51,52,53,54,55",
                checkdigit: true
            };
            cards[2] = {
                name: "DinersClub",
                length: "14,16",
                prefixes: "36,38,54,55",
                checkdigit: true
            };
            cards[3] = {
                name: "CarteBlanche",
                length: "14",
                prefixes: "300,301,302,303,304,305",
                checkdigit: true
            };
            cards[4] = {
                name: "AmEx",
                length: "15",
                prefixes: "34,37",
                checkdigit: true
            };
            cards[5] = {
                name: "Discover",
                length: "16",
                prefixes: "6011,622,64,65",
                checkdigit: true
            };
            cards[6] = {
                name: "JCB",
                length: "16",
                prefixes: "35",
                checkdigit: true
            };
            cards[7] = {
                name: "enRoute",
                length: "15",
                prefixes: "2014,2149",
                checkdigit: true
            };
            cards[8] = {
                name: "Solo",
                length: "16,18,19",
                prefixes: "6334,6767",
                checkdigit: true
            };
            cards[9] = {
                name: "Switch",
                length: "16,18,19",
                prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
                checkdigit: true
            };
            cards[10] = {
                name: "Maestro",
                length: "12,13,14,15,16,18,19",
                prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
                checkdigit: true
            };
            cards[11] = {
                name: "VisaElectron",
                length: "16",
                prefixes: "4026,417500,4508,4844,4913,4917",
                checkdigit: true
            };
            cards[12] = {
                name: "LaserCard",
                length: "16,17,18,19",
                prefixes: "6304,6706,6771,6709",
                checkdigit: true
            };

            // Establish card type
            var cardType = -1;
            for (var i = 0; i < cards.length; i++) {

                // See if it is this card (ignoring the case of the string)
                if (cardname.toLowerCase() == cards[i].name.toLowerCase()) {
                    cardType = i;
                    break;
                }
            }

            // If card type not found, report an error
            if (cardType == -1) {
                ccErrorNo = 0;
                return false;
            }

            // Ensure that the user has provided a credit card number
            if (cardnumber.length == 0) {
                ccErrorNo = 1;
                return false;
            }

            // Now remove any spaces from the credit card number
            cardnumber = cardnumber.replace(/\s/g, "");

            // Check that the number is numeric
            var cardNo = cardnumber
            var cardexp = /^[0-9]{13,19}$/;
            if (!cardexp.exec(cardNo)) {
                ccErrorNo = 2;
                return false;
            }

            // Now check the modulus 10 check digit - if required
            if (cards[cardType].checkdigit) {
                var checksum = 0;                                  // running checksum total
                var mychar = "";                                   // next char to process
                var j = 1;                                         // takes value of 1 or 2

                // Process each digit one by one starting at the right
                var calc;
                for (i = cardNo.length - 1; i >= 0; i--) {

                    // Extract the next digit and multiply by 1 or 2 on alternative digits.
                    calc = Number(cardNo.charAt(i)) * j;

                    // If the result is in two digits add 1 to the checksum total
                    if (calc > 9) {
                        checksum = checksum + 1;
                        calc = calc - 10;
                    }

                    // Add the units element to the checksum total
                    checksum = checksum + calc;

                    // Switch the value of j
                    if (j == 1) { j = 2 } else { j = 1 };
                }

                // All done - if checksum is divisible by 10, it is a valid modulus 10.
                // If not, report an error.
                if (checksum % 10 != 0) {
                    ccErrorNo = 3;
                    return false;
                }
            }

            // Check it's not a spam number
            if (cardNo == '5490997771092064') {
                ccErrorNo = 5;
                return false;
            }

            // The following are the card-specific checks we undertake.
            var LengthValid = false;
            var PrefixValid = false;
            var undefined;

            // We use these for holding the valid lengths and prefixes of a card type
            var prefix = new Array();
            var lengths = new Array();

            // Load an array with the valid prefixes for this card
            prefix = cards[cardType].prefixes.split(",");

            // Now see if any of them match what we have in the card number
            for (i = 0; i < prefix.length; i++) {
                var exp = new RegExp("^" + prefix[i]);
                if (exp.test(cardNo)) PrefixValid = true;
            }

            // If it isn't a valid prefix there's no point at looking at the length
            if (!PrefixValid) {
                ccErrorNo = 3;
                return false;
            }

            // See if the length is valid for this card
            lengths = cards[cardType].length.split(",");
            for (j = 0; j < lengths.length; j++) {
                if (cardNo.length == lengths[j]) LengthValid = true;
            }

            // See if all is OK by seeing if the length was valid. We only check the length if all else was 
            // hunky dory.
            if (!LengthValid) {
                ccErrorNo = 4;
                return false;
            };

            // The credit card is in the required format.
            return true;
        },

        changeRecordsResult:function(){
            return {
                added:[],
                changed:[],
                removed:[]
            };
        },

        objectChangeRecord:function(){
            return{
                object:undefined,
                value:undefined,
                oldValue:undefined,
                path:undefined,
                name:undefined,
                root:undefined

            }
        },

        /**
         * returns the changes between two objects as properties on the returned object
         * ex: n={FirstName:'John',LastName:'Smith'},o={FirstName:'Bob',LastName:'Smith'} ===> {FirstName:'John'}
         * @param n {Object}
         * @param o {Object}
         * @returns {Object}
         */
        objectChangedProps:function(n,o){
            var obj={};
            var keys= _.keys(n);
            keys.forEach(function(v){
                if(!_.isEqual(n[v],o[v])){
                    obj[v]=n[v];
                }
            });
            return obj;
        },

        isModelList: function (obj) {
            if (_.isArray(obj)) {
                return obj;
            } else {
                var keys = _.keys(obj).length;
                if (keys > 1) {
                    return null;
                } else {
                    //else if keys <=1, test if prop is an array(model list)
                    var o = obj[Object.keys(obj)[0]];
                    return (_.isArray(o)) ? o : null;
                }
            }
           
        },

        /**
         * generate an difference summary report between two object states.
         * returns a result object with added,changed,removed array props
         *
         * summary report is intended to handle two object types: (i) model/document (ii) model list
         *
         * (i) a model is where the object represents a singleton document
         *
         * (ii) a model list is an object whose first prop/key is an array; so it acts as an array of documents or document container
         * Each element of the array prop corresponds to a unique document and should have a unique id key
         *
         *
         *
         * @param newObj {Object}
         * @param oldObj {Object}
         * @param id {String} Model id prop
         * @returns {Object}
         */
        objDiffReport: function(newObj,oldObj,id){
            var self=this;
            var newObj_;
            var oldObj_;
            var OBJ_;
            var result=this.changeRecordsResult();

            if(typeof id==='undefined'){
                id='id';
            }


            var _o=isModelList(oldObj);
            (_o) ? modelListSummary(_o) : modelSummary();


            //test for model list; returns the array if true, null if false
            function isModelList(oldObj_) {
                var keys= _.keys(oldObj).length;
                //if keys > 1, model
                if(keys > 1){
                    return null;
                }else{
                    //else if keys <=1, test if prop is an array(model list)
                    var o=oldObj_[Object.keys(oldObj_)[0]];
                    return (_.isArray(o)) ? o : null;
                }

            }


            return result;


            function modelListSummary(_o){
                var _n=newObjModelList();
                if(!_n){
                    result=null;
                    return false;
                }
                difference(_n,_o);
            }

            function modelSummary(){
                if(!_.isEqual(newObj,oldObj)){
                    /*result.changed.push({
                        object:newObj,
                        oldObject:oldObj
                    });*/
                    newObj_=newObj;
                    oldObj_=oldObj;
                    OBJ_=undefined;
                    var chg_=objectChangeRecord(newObj,oldObj,'');
                    result.changed.push(chg_);
                }
            }

            function objectChangeRecord(n,o,path){
                var obj=self.objectChangeRecord();
                var keys= _.keys(n);
                keys.forEach(function(v){
                    if(n && o){
                        if(!_.isEqual(n[v],o[v])){
                            var path_=(path !=='') ? path + '.' + v : v;
                            if(typeof n[v] ==='object' && n[v] !==null){
                                if(!_.isArray(n[v])){
                                    objectChangeRecord(n[v],o[v],path);
                                }else{
                                    var index_=0;
                                    var ov=o[v];
                                    n[v].forEach(function(oo){
                                        if(!_.isEqual(oo,ov[index_])){
                                            path_+='.' + index_;
                                            objectChangeRecord(oo,ov[index_],path_);
                                            index_++;
                                        }else{
                                            index_++;
                                        }
                                    });
                                }
                            }else{
                                obj.object=n;
                                obj.value=n[v];
                                obj.oldValue=o[v];
                                obj.path=path_;
                                obj.name=v;
                                obj.root=newObj_;

                                OBJ_=obj;
                            }
                        }
                    }
                });

                return OBJ_;
            }

            function newObjModelList(){
                var n=newObj[Object.keys(newObj)[0]];
                return (_.isArray(n)) ? n : null;
            }

            function difference(n,o){
                var oIds = {};
                o.forEach(function(obj){
                    oIds[obj[id]] = obj;
                });

                var nIds={};
                n.forEach(function(obj){
                    nIds[obj[id]] = obj;
                });

                var nArr=[],
                    oArr=[],
                    uArr=[];

                // return all elements in n not in o==added
                nArr= n.filter(function(obj){
                    return !(obj[id] in oIds);
                });

                // return all elements in o not in n==removed
                oArr= o.filter(function(obj){
                    return !(obj[id] in nIds);
                });

                //return unequal for common elements==changed
                n.forEach(function(obj){
                    var oo= _.find(o,function(__o){return __o[id]===obj[id]});
                    if( !(_.isEqual(oo,obj) || oo ===undefined) ){
                        /*uArr.push({
                            object:obj,
                            oldObject:oo
                        });*/
                        newObj_=obj;
                        oldObj_=oo;
                        OBJ_=undefined;
                        var chg_=objectChangeRecord(obj,oo,'');
                        uArr.push(chg_);
                    }
                });

                //update result
                result.added=result.added.concat(nArr);
                result.changed=result.changed.concat(uArr);
                result.removed=result.removed.concat(oArr);

            }
        },

        nativeObjDiffReport:function(obj,changeRecords){
            var result=this.changeRecordsResult();
            var self=this;
            var _o=this.isModelList(obj);
            var path_;
            if(changeRecords && changeRecords.length){
                changeRecords.forEach(function(c){
                    if(_o){
                        if(c.addedCount && c.addedCount>0 && c.type==='splice'){
                            result.added.push(c.object[c.index]);
                        }
                        if(c.removed && c.removed.length>0 && c.type==='splice'){
                            result.removed=result.removed.concat(c.removed);
                        }
                        if(c.type==='update'){
                            path_=pathReplace(c.path);
                            var u_={
                                object: c.object,
                                path: path_,
                                value: c.value,
                                oldValue: c.oldValue,
                                name: c.name,
                                root: c.root
                            };
                            result.changed.push(u_);
                        }
                    }else{
                        path_=pathReplace(c.path);
                        var chg_={
                            object: c.object,
                            value:c.object[c.name],
                            oldValue: c.oldValue,
                            path:path_,
                            name: c.name,
                            root: c.root
                        };

                        result.changed.push(chg_);
                    }
                });
            }

            function pathReplace(p){
                var n= p.replace(/\//g,'.');
                if(self.strFirstChar(n)==='.'){
                    n=self.trimFirstChar(n);
                }
                return n;
            }

            return result;
        }
    };


}));








/*
 * =============================================================
 * elliptical dust helpers
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('dustjs-linkedin'), require('dustjs-helpers'),require('moment'),require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['dustjs-linkedin','dustjs-helpers','moment','elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.dust,root.dust.helpers,root.moment,root.elliptical.utils);
    }
}(this, function (dust,helpers,moment,utils) {

    var _=utils._;

    dust.helpers.formatCurrency=function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var money;
        if(utils.isNumeric(value)){
            value=parseFloat(value);
            money =value.toFixed(2);
        }else{
            money='';
        }

        return chunk.write(money);
    };

    dust.helpers.extFormatCurrency=function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var money;
        if(utils.isNumeric(value)){
            value=parseFloat(value);
            money =value.toFixed(2);
            money = '$' + money.toString();
        }else{
            money='';
        }

        return chunk.write(money);
    };

    dust.helpers.formatDate=function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var format=params.format || 'MM-DD-YYYY';
        if(value){
            value=moment(value).format(format);
        }else{
            value='';
        }
        return chunk.write(value);
    };

    dust.helpers.placeholder=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var defaultValue=dust.helpers.tap(params.defaultValue, chunk, context);
        return (value) ? chunk.write(value) : chunk.write(defaultValue);
    };


    dust.helpers.phraseCase = function (chunk, context, bodies, params) {
        var value = dust.helpers.tap(params.value, chunk, context);
        value = utils.camelCaseToSpacedTitleCase(value);
        return chunk.write(value);
    };

    dust.helpers.checked=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var checked='';
        if(value){
            checked='checked';
        }
        return chunk.write(checked);
    };

    dust.helpers.radio=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.val, chunk, context);
        var key= dust.helpers.tap(params.key, chunk, context);
        var checked='';
        if(value && value.toLowerCase()===key.toLowerCase()){
            checked='checked';
        }
        
        return chunk.write(checked);
    };

    



    dust.helpers.selected=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var key= dust.helpers.tap(params.key, chunk, context);
        var selected='';
        if(value && value.toLowerCase()===key.toLowerCase()){
            selected='selected';
        }
        return chunk.write(selected);
    };

    dust.helpers.truthy=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var true_= dust.helpers.tap(params.true, chunk, context);
        var false_= dust.helpers.tap(params.false, chunk, context);

        var out=(value) ? true_ : false_;

        return chunk.write(out);
    };

    dust.helpers.hide=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var hide='';
        if(value){
            hide='hide';
        }
        return chunk.write(hide);
    };

    dust.helpers.disable=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var disable='';
        if(value){
            disable='disabled';
        }
        return chunk.write(disable);
    };

    dust.helpers.readonly=function(chunk,context,bodies,params){
        var value = dust.helpers.tap(params.value, chunk, context);
        var readOnly='';
        if(value){
            readOnly='readonly';
        }
        return chunk.write(readOnly);
    };

    dust.helpers.position=function(chunk,context,bodies){
        var value=context.stack.index + 1;
        return chunk.write(value);
    };

    dust.helpers.index=function(chunk,context,bodies){
        var value=context.stack.index;
        return chunk.write(value);
    };

    dust.helpers.urlEncode=function(chunk, context, bodies, params){
        var value = dust.helpers.tap(params.value, chunk, context);
        if(value){
            value=encodeURIComponent(value);
        }else{
            value='';
        }

        return chunk.write(value);
    };

    dust.helpers.toggle=function(chunk, context, bodies, params){
        var css='';
        var value = dust.helpers.tap(params.value, chunk, context);
        var on=dust.helpers.tap(params.on, chunk, context);
        var onCSS=dust.helpers.tap(params.onCSS, chunk, context);
        var offCSS=dust.helpers.tap(params.offCSS, chunk, context);
        css=(value===on) ? onCSS : offCSS;

        return chunk.write(css);
    };

    dust.helpers.compare=function(chunk, context, bodies, params){
        var output='';
        var value = dust.helpers.tap(params.value, chunk, context);
        var test=dust.helpers.tap(params.test, chunk, context);
        var echo=dust.helpers.tap(params.echo, chunk, context);

        if(value===test){
            output=echo;
        }

        return chunk.write(output);
    };

    dust.helpers.inArray=function(chunk,context,bodies,params){

        var index = dust.helpers.tap(params.index, chunk, context);
        var arrProp= dust.helpers.tap(params.array, chunk, context);
        var objProp=dust.helpers.tap(params.obj, chunk, context);
        var id=dust.helpers.tap(params.id, chunk, context);
        var context_=context.stack.tail.head;
        var cxt,arr,obj;
        cxt=context_;
        arr=cxt[arrProp];
        obj=(typeof index==='undefined') ? cxt[objProp] : cxt[objProp][index];

        var checked='';
        if(arr && arr.length){
            arr.forEach(function(o){
                if(obj[id]===o[id]){
                    checked='checked';
                }
            });
        }

        return chunk.write(checked);
    };

    dust.helpers.url=function(chunk,context,bodies,params){
        var href = dust.helpers.tap(params.href, chunk, context);
        var encodeURIIndex=dust.helpers.tap(params.encodeURIIndex, chunk, context);
        if(encodeURIIndex){
            href=utils.encodeURISection(href,parseInt(encodeURIIndex));
        }

        if(typeof window !== 'undefined' && window.elliptical.$hashTag){
            if(href.charAt(1) !=='#'){
                href='/#' + href;
            }
        }
        var global_=(typeof window==='undefined') ? global : window;
        var virtualRoot=global_.elliptical.$virtualRoot;
        if(virtualRoot !== '/'){
            href=virtualRoot + href;
        }
        var link='href="' + href + '"';
        return chunk.write(link);
    };

    dust.helpers.pluralize=function(chunk,context,bodies,params){
        var count = dust.helpers.tap(params.count, chunk, context);
        var singular = dust.helpers.tap(params.singular, chunk, context);
        var plural = dust.helpers.tap(params.plural, chunk, context);

        var text=(count===1) ? singular : plural;
        return chunk.write(text);
    };

    dust.helpers.id=function(chunk, context, bodies, params){
        var id = dust.helpers.tap(params.value, chunk, context);
        if(id===undefined){
            id=utils.idString();
        }

        return chunk.write(id);
    };

    dust.helpers.guid=function(chunk, context, bodies, params){
        var id = dust.helpers.tap(params.value, chunk, context);
        if(id===undefined || id===''){
            id=utils.guid();
        }

        return chunk.write(utils.guid());
    };

    dust.helpers.location = function (chunk, context, bodies, params) {
        var url = location.href;

        return chunk.write(url);
    };

    dust.helpers.inline={};

    dust.helpers.inline.formatDate=function(val,format){
        format=format || 'MM-DD-YYYY';
        return (val) ? moment(val).format(format) : '';
    };

    dust.helpers.inline.formatCurrency=function(val){
        val=parseFloat(val);
        var money;
        if(utils.isNumeric(val)){
            money =val.toFixed(2);
        }else{
            money='';
        }

        return money;
    };
    dust.helpers.inline.extFormatCurrency=function(val){
        val=parseFloat(val);
        var money;
        if(utils.isNumeric(val)){
            money =val.toFixed(2);
            money = '$' + money.toString();
        }else{
            money='';
        }

        return money;
    };


    return dust;
}));







/*
 * =============================================================
 * elliptical.Class
 * =============================================================
 *
 * Classical inheritance pattern adopted from JavascriptMVC(which is an implementation of the Resig pattern), sans the jQuery dependency.
 * https://github.com/jupiterjs/jquerymx/blob/master/class/class.js
 *
 * var MyClass=Class.extend({},{});
 *
 * examples.:
 *
 * var MyClass=Class.extend({
 *
 * //@static
 *    method1:function(){
 *       return 'method1';
 *    }
 * },{
 *
 * //@prototype
 *    init:function(arg){
 *      this.name=arg;
 *    },
 *
 *    method1: function(){
 *       return this.name;
 *    }
 *
 * });
 *
 * MyClass.method1() //  'method1'
 * var myClassInstance=new MyClass('Bob');
 *
 * myClassInstance instanceof MyClass // true
 * myClassInstance.method1()  // 'Bob'
 *
 * var AnotherClass=Class.extend({  //define only instance props and methods
 *    init:function(arg){
 *        this.name=arg;
 *    },
 *    method1: function(){
 *       return this.name;
 *    }
 * });
 *
 * var anotherClassInstance=new AnotherClass('Fred');
 * anotherClassInstance instanceof AnotherClass // true
 * anotherClassInstance.method1()  // 'Fred'
 *
 * var Class2=Class.extend({
 *      prop1:true
 *      method1:function(){
 *        return 'method1';
 *      }
 * },
 * {
 *    init:function(arg){
 *      this.name=arg;
 *    },
 *
 *    method1: function(){
 *       return this.name;
 *    }
 * });
 *
 * var Class3=Class2.extend({
 *      prop1:false,
 *      prop2:true,
 *      method2:function(){
 *         return 'method2';
 *      }
 *
 * },{
 *     method2: function(){
 *       return this.name + ' from method 2';
 *     }
 * });
 *
 * var myClass3=new Class3('Jane');
 * Class2.prop1 //true
 * Class3.prop1 //false
 * myClass3 instanceof Class2  //true
 * myClass3 instanceof Class3  //true
 *
 * myClass3.method2() // 'Jane from method 2'
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Class=factory(root.elliptical.utils);
        root.returnExports = root.elliptical.Class;
    }
}(this, function (utils) {
        var _=utils._,
        initializing = false,
        makeArray = utils.makeArray,
        isFunction = _.isFunction,
        isArray = _.isArray,
        extend = utils.extend,
        concatArgs = utils.concatArgs,


    /* tests if we can get super in .toString() */
    fnTest = /xyz/.test(function()
    {
        xyz;
    }) ? /\b_super\b/ : /.*/,


        /**
         * overwrites an object with methods, sets up _super
         * @param newProps {Object}
         * @param oldProps {Object}
         * @param addTo {Object}
         */
        inheritProps = function(newProps, oldProps, addTo)
        {

            addTo = addTo || newProps;
            for ( var name in newProps)
            {
                /* Check if we're overwriting an existing function */
                addTo[name] = isFunction(newProps[name]) && isFunction(oldProps[name])
                    && fnTest.test(newProps[name]) ? (function(name, fn)
                {
                    return function()
                    {
                        var tmp = this._super, ret;

                        /* Add a new ._super() method that is the same method, but on the super-class */
                        this._super = oldProps[name];

                        /* The method only need to be bound temporarily, so we remove it when we're done executing */
                        ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, newProps[name]) : newProps[name];
            }
        };

    var clss =function()
    {
        if (arguments.length)
        {
            clss.extend.apply(clss, arguments);
        }
    };

    /* @Static */
    extend(
        clss,
        {
            /**
             * Returns a callback function for a function on this Class.
             * Proxy ensures that 'this' is set appropriately.
             * @param funcs {Array}
             * @returns {Function} the callback function
             */
            proxy : function(funcs)
            {
                /* args that should be curried */
                var args = makeArray(arguments), self;

                funcs = args.shift();

                if (!isArray(funcs))
                {
                    funcs = [ funcs ];
                }

                self = this;
                for ( var i = 0; i < funcs.length; i++)
                {
                    if (typeof funcs[i] == "string"
                        && !isFunction(this[funcs[i]]))
                    {
                        throw ("class.js "
                            + (this.fullName || this.Class.fullName)
                            + " does not have a " + funcs[i] + "method!");
                    }
                }
                return function class_cb()
                {
                    var cur = concatArgs(args, arguments), isString, length = funcs.length, f = 0, func;
                    for (; f < length; f++)
                    {
                        func = funcs[f];
                        if (!func)
                        {
                            continue;
                        }

                        isString = typeof func == "string";
                        if (isString && self._set_called)
                        {
                            self.called = func;
                        }

                        cur = (isString ? self[func] : func).apply(self, cur
                            || []);
                        if (f < length - 1)
                        {
                            cur = !isArray(cur) || cur._use_call ? [ cur ]
                                : cur;
                        }
                    }
                    return cur;
                };
            },

            /**
             * Creates a new instance of the class.
             * @returns {Class} instance of the class
             */
            newInstance: function() {
                var inst = this.rawInstance(),
                    args;
                /* call setup if there is a setup */
                if ( inst.setup ) {
                    args = inst.setup.apply(inst, arguments);
                }
                /* call init if there is an init, if setup returned args, use those as the arguments */
                if ( inst.init ) {
                    inst.init.apply(inst, isArray(args) ? args : arguments);
                }
                return inst;
            },

            /**
             * Setup gets called on the inherting class with the base class followed by the inheriting class's raw properties.
             * Setup will deeply extend a static defaults property on the base class with properties on the base class.
             * @param baseClass {Object}
             * @param fullName {String}
             * @returns {Arguments}
             */
            setup: function( baseClass, fullName ) {
                this.defaults = extend(true, {}, baseClass.defaults, this.defaults);
                return arguments;
            },

            /**
             * returns the raw instance before application of setup and init
             * @returns {Class}
             */
            rawInstance: function() {
                initializing = true;
                var inst = new this();
                initializing = false;
                return inst;
            },

            /**
             * NOTE: support for namespacing fullName dropped because of its reliance on globals (S.Francis)
             * @param klass {Object}
             * @param proto {Object}
             * @returns {Class}
             */
            extend: function(klass, proto) {
                if(!proto) {
                    proto = klass;
                    klass = null;
                }
                proto = proto || {};
                var _super_class = this,
                    _super = this.prototype, prototype;

                /* Instantiate a base class (but only create the instance, don't run the init constructor */
                initializing = true;
                prototype = new this();
                initializing = false;
                /* Copy the properties over onto the new prototype */
                inheritProps(proto, _super, prototype);

                /* The dummy class constructor */

                function Class() {
                    /* All construction is actually done in the init method */
                    if ( initializing ) return;

                    /* extending */
                    if ( this.constructor !== Class && arguments.length ) {
                        return arguments.callee.extend.apply(arguments.callee, arguments);
                    } else { /* we are being called with new */
                        return this.Class.newInstance.apply(this.Class, arguments);
                    }
                }
                /* copy old stuff onto class */
                for ( name in this ) {
                    if ( this.hasOwnProperty(name) && ['prototype', 'defaults'].indexOf(name) == -1 ) {
                        Class[name] = this[name];
                    }
                }

                /* static inheritance */
                inheritProps(klass, this, Class);

                /* set things that can't be overwritten */
                extend(Class, {
                    prototype: prototype,
                    constructor: Class
                });

                //make sure our prototype looks nice
                Class.prototype.Class = Class.prototype.constructor = Class;

                var args = Class.setup.apply(Class, utils.concatArgs([_super_class],arguments));

                if ( Class.init ) {
                    Class.init.apply(Class, args || []);
                }

                /* @Prototype*/
                return Class;
            }
        });


    clss.callback=clss.prototype.callback=clss.prototype.proxy=clss.proxy;

    return clss;


}));





/*
 * =============================================================
 * elliptical.Controller
 * =============================================================
 *
 * Controller factory for an expressJS style application function/object
 * var Controller = new elliptical.Controller(app);
 *
 * Controller(route,f1,...fn,{
 *   Get:function(req,res,next){}
 *   Post:function(req,res,next){}
 *   Put: function(req,res,next){}
 *   Delete: function(req,res,next){}
 * });
 *
 * or:
 *
 * Controller(route/@action,f1,...fn,{
 *   Get:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Post:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Put:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Delete:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 * });
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        root.elliptical.Controller = factory(root.elliptical.utils);
        root.returnExports = root.elliptical.Controller;
    }
}(this, function (utils) {


    /* Controller is a simple factory for the app function. It accepts the app function as an argument and returns a function
     * with a variable arg list of (route,f1,...fn,obj}, where route=route{String}, f1,...fn =middleware, and the last arg
     * is a plain object that binds a callback to a http method
     * obj={Get:func(req,res,next),Post:func(req,res,next),Put:func(req,res,next),Delete:func(req,res,next)}
     *
     * the first arg of the list must be the route and the last one must be the plain object.
     *
     * Controller can also group an arbitrary number of Actions around a http method and a base route:
     * Example:
     * Controller('/Company/@action',{
     *   Get:{
     *      Home:function(req,res,next){},
     *      About:function(req,res,next){},
     *      Contact:function(req,res,next){},
     *   },
     *   Post:{
     *      Contact:function(req,res,next){}
     *   }
     * }
     *
     * instead of app.get('/Company/Home',function(req,res,next){}),app.get('/Company/About',function(req,res,next){})
     *            app.get('/Company/Contact',function(req,res,next){}),app.post('/Company/Contact',function(req,res,next){})
     *
      * */
    var Controller=function(app){
        this.app=app;
        /**
         * @param route {String}
         * @param obj {Object}
         * @returns {Function}
         */
        return function(route,obj){
            var args = [].slice.call(arguments);
            var route_=args[0];
            if(typeof route_ !=='string'){
                throw 'Controller requires a route as the first parameter';
            }
            var obj_=args.pop();
            if(typeof obj_ ==='object'){
                ['Get','Post','Put','Delete'].forEach(function(v){
                    if(obj_[v] && typeof obj_[v]==='function'){
                        var clonedArgs=utils.cloneArray(args);
                        clonedArgs.push(obj_[v]);
                        app[v.toLowerCase()].apply(app,clonedArgs);
                    }else{ //@action grouping,NOTE: @action must be the param name
                        for(var prop in obj_[v]){
                            var clonedArgs_=utils.cloneArray(args);
                            if(prop==='Index'){
                                clonedArgs_[0]=clonedArgs_[0].replace(/@action/g,'');
                            }else{
                                var prop_=prop.replace(/_/,'-'); //ex: '/Sign-In' ---> Sign_In:fn()
                                clonedArgs_[0]=clonedArgs_[0].replace(/@action/g,prop_);
                            }

                            clonedArgs_.push(obj_[v][prop]);
                            app[v.toLowerCase()].apply(app,clonedArgs_);
                        }
                    }
                });
            }else{
                throw 'Controller requires the last function parameter to be an object';
            }
        }
    };

    return Controller;
}));

/*
 * =============================================================
 * elliptical.factory
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.factory=factory(root.elliptical.utils);
        root.returnExports = root.elliptical.factory;
    }
}(this, function (utils) {
    var _=utils._;

    var factory={
        partial:function(){
            var args = [].slice.call(arguments);
            return _.partial.apply(this,args);
        },

        partialRight:function(){
            var args = [].slice.call(arguments);
            return _.partialRight.apply(this,args);
        },

        curry:function(){
            var args = [].slice.call(arguments);
            return _.curry.apply(this,args);
        },

        defer:function(){
            var args = [].slice.call(arguments);
            return _.defer.apply(this,args);
        },

        delay:function(){
            var args = [].slice.call(arguments);
            return _.delay.apply(this,args);
        },

        after:function(){
            var args = [].slice.call(arguments);
            return _.after.apply(this,args);
        },

        bind:function(){
            var args = [].slice.call(arguments);
            return _.bind.apply(this,args);
        },

        bindKey:function(){
            var args = [].slice.call(arguments);
            return _.bindKey.apply(this,args);
        },

        bindAll:function(){
            var args = [].slice.call(arguments);
            return _.bindAll.apply(this,args);
        },

        debounce:function(){
            var args = [].slice.call(arguments);
            return _.debounce.apply(this,args);
        },

        throttle:function(){
            var args = [].slice.call(arguments);
            return _.throttle.apply(this,args);
        },


        wrap:function(){
            var args = [].slice.call(arguments);
            return _.wrap.apply(this,args);
        },

        memoize:function(){
            var args = [].slice.call(arguments);
            return _.memoize.apply(this,args);
        }

    };

    return factory;

}));

/*
 * =============================================================
 * elliptical.Model
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../class/class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../class/class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Model=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Model;
    }
}(this, function (Class) {

    var Model = Class.extend({
            id: 'id', //{String} set a custom id property other than 'id'
            _data: null, //{Object}
            '@resource': null, //{String}
            $provider: {}, //{Class|Object|Function}
            $paginationProvider:null,//{Class|Object|Function}


            /**
             * @static
             */

            /**
             * get all models by class or get model by id
             * @param params {Object}
             * @param query {Object}
             * @param callback {Function}
             * @public
             */
            get: function (params, query,callback) {
                this.__isImplemented('get');
                if(typeof query==='function'){
                    callback=query;
                    query={};
                }
                var self = this,
                    $provider = this.$provider,
                    $paginationProvider=this.$paginationProvider,
                    resource = this['@resource'],
                    result;

                $provider.get(params, resource, query, function (err, data) {
                    if(!err){

                        if (query.paginate && $paginationProvider) {
                            result=$paginationProvider.get(query,data);
                            self._data=result.data;
                        }else{
                            result=data;
                            self._data=data;
                        }
                    }
                    if (callback) {
                        callback(err, result);
                    }
                });
            },


            /**
             * query model
             * @param params {Object}
             * @param query {Object}
             * @param callback {Function}
             * @public
             */
            query: function (params, query,callback) {
                this.__isImplemented('query');
                var self=this,
                    $provider = this.$provider,
                    $paginationProvider=this.$paginationProvider,
                    result;

                $provider.query(params, query,function (err, data) {
                    if(!err){
                        if (query.paginate && $paginationProvider) {
                            result=$paginationProvider.get(query,data);
                            self._data=result.data;
                        }else{
                            result=data;
                            self._data=data;
                        }
                    }
                    if (callback) {
                        callback(err, result);
                    }
                });
            },


            /**
             * post model
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            post: function (params, callback) {
                this.__isImplemented('post');
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.post(params, resource,callback);

            },

            /**
             * put model
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            put: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.put(params, resource,callback);

            },

            /**
             * patch model (~merge)
             * @param params {Object}
             * @param callback
             */
            patch: function (params, callback) {
                this.__isImplemented('patch');
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.patch(params, resource,callback);

            },

            /**
             * delete model
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            delete: function (params, callback) {
                this.__isImplemented('delete');
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.delete(params, resource, callback);

            },

            /**
             * command
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            command: function (params, callback) {
                this.__isImplemented('command');
                var $provider = this.$provider;
                $provider.command(params, callback);
            },

            /**
             * sets the model providers for implementation
             * @param $provider {Object}
             * @param $pagination {Object}
             * @public
             */
            $setProviders: function ($provider,$pagination) {
                this.$provider = $provider;
                this.$paginationProvider=$pagination;
            },

            __isImplemented:function(method){
                if(!this.$provider[method]){
                    throw new Error(method + ' not implemented');
                }
            }

        },

        /**
         * @prototype
         */

        {
            _data: null,

            /**
             *
             * @param params {Object}
             * @public
             */
            init: function (params) {
                /* this will get passed up as the params in below methods if params not explicitly passed in the calls */
                this._data = params;
                this.$query={};
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            get: function (params,callback) {
                var data = this._data,
                    query=this.$query;

                (typeof params==='function') ? callback=params : data=params;
                this.constructor.get(data,query, callback);
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            save: function (params,callback) {
                var data = this._data;
                var length=arguments.length;
                if(length===0){
                    params=data;
                }else if(length===1 && typeof params==='function'){
                    callback=params;
                    params=data;
                }
                var idProp=this.constructor.id;
                if(params===undefined || params[idProp]===undefined){
                    /* posting a new model */
                    this.constructor.post(params, callback);
                }else{
                    /* put an update */
                    this.constructor.put(params, callback);
                }
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             */
            put: function (params,callback) {
                var data = this._data;
                (typeof params==='function') ? callback=params : data=params;
                this.constructor.put(data, callback);
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             */
            patch: function (params,callback) {
                var data = this._data;
                (typeof params==='function') ? callback=params : data=params;
                this.constructor.query(data, callback);
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            query: function (params,callback) {
                var data = this._data,
                    query=this.$query;

                (typeof params==='function') ? callback=params : data=params;
                this.constructor.query(data, query,callback);
            },

            /**
             *
             * @param str {String}
             */
            filter: function (str) {
                this.$query.filter = str;
                return this;
            },

            /**
             *
             * @param str {String}
             */
            orderBy: function (str) {
                this.$query.orderBy = str;
                return this;
            },

            orderByDesc:function(str){
                this.$query.orderByDesc = str;
                return this;
            },

            /**
             *
             * @param num {Number}
             */
            top: function (num) {
                this.$query.top = num;
                return this;
            },

            /**
             *
             * @param num {Number}
             */
            skip: function (num) {
                this.$query.skip = num;
                return this;
            },

            /**
             *
             * @param params {Object}
             */
            paginate: function (params) {
                try{
                    params.page=parseInt(params.page);
                }catch(ex){
                    params.page=1;
                }
                this.$query.paginate = params;
                return this;
            },

            /**
             * @param params {Object}
             * @param callback  {Function}
             * @public
             */
            delete: function (params,callback) {
                var data = this._data;
                (typeof params==='function') ? callback=params : data=params;
                this.constructor.delete(data, callback);
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            command: function (params,callback) {
                var data = this._data;
                (typeof params==='function') ? callback=params : data=params;
                this.constructor.command(data, callback);
            }

        });


    return Model;



}));



/*
 * =============================================================
 * elliptical.noop
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.noop=factory();
        root.returnExports = root.elliptical.noop;
    }
}(this, function () {

    return{
        noop:function(){},
        throwErr:function(err){
            if (err) {
                throw err;
            }
        },
        doop:function(fn,args,context){
            if(typeof fn==='function') {
                return fn.apply(context, args);
            }
        }
    }


}));
/*
 * =============================================================
 * elliptical.debounce
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.debounce=factory(root.elliptical.utils);
        root.returnExports = root.elliptical.debounce;
    }
}(this, function (utils) {

    var _=utils._;

    return function debounce(fn,delay,opts){
        if(typeof delay==='undefined'){
            delay=1000;
        }
        if(typeof opts==='undefined'){
            opts={};
        }
        _.debounce(fn,delay,opts);
    }


}));

/*
 * =============================================================
 * elliptical.Interval
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./debounce'),require('./throttle'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./debounce','./throttle'], factory);
    } else {
        root.elliptical.Interval=factory(root.elliptical.debounce,root.elliptical.throttle);
        root.returnExports = root.elliptical.Interval;
    }
}(this, function (debounce,throttle) {

    return function Interval(opts){
        this.delay=opts.delay;
        this.timeOutId=null;
        if(opts.thread==='throttle'){
            this.thread=throttle;
        }else if(opts.thread==='debounce'){
            this.thread=debounce;
        }else{
            this.thread=_exe;
        }

        this.run=function(fn){
            var self=this;
            this.timeOutId=setInterval(function(){
                self.thread(fn,{
                    delay:10
                });

            },self.delay);
        };

        this.terminate=function(){
            clearInterval(this.timeOutId);
        }
    };


    function _exe(fn,opts){
        fn();
    }

}));


/*
 * =============================================================
 * elliptical.throttle
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.throttle=factory(root.elliptical.utils);
        root.returnExports = root.elliptical.throttle;
    }
}(this, function (utils) {

    var _=utils._;

    return function throttle(fn,delay,opts){
        if(typeof delay==='undefined'){
            delay=1000;
        }
        if(typeof opts==='undefined'){
            opts={};
        }
        _.throttle(fn,delay,opts);
    }


}));

/*
 * =============================================================
 * elliptical.proto
 * =============================================================
 *
 * EcmaScript5 inheritance pattern mostly culled from:
 * https://github.com/daffl/uberproto
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.proto=factory();
        root.returnExports = root.elliptical.proto;
    }
}(this, function () {

    var proto={

        /**
         *
         * @returns {Object}
         */
        create: function () {
            var instance = Object.create(this),
                init = typeof instance.__init === 'string' ? instance.__init : 'init';
            if (typeof instance[init] === "function") {
                instance[init].apply(instance, arguments);
            }
            return instance;
        },


        /**
         * Mixin a given set of properties
         * @param prop {Object} The properties to mix in
         * @param obj {Object} [optional] The object to add the mixin
         */
        mixin: function (prop, obj) {
            var self = obj || this,
                fnTest = /\b_super\b/,
                _super = Object.getPrototypeOf(self) || self.prototype,
                _old;

            // Copy the properties over
            for (var name in prop) {
                // store the old function which would be overwritten
                _old = self[name];
                // Check if we're overwriting an existing function
                self[name] = (typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name])) ||
                    (typeof _old === "function" && typeof prop[name] === "function") ? //
                    (function (old, name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but either pointing to the prototype method
                            // or to the overwritten method
                            this._super = (typeof old === 'function') ? old : _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(_old, name, prop[name]) : prop[name];
            }

            return self;
        },


        /**
         * Extend the current or a given object with the given property
         * and return the extended object.
         * @param prop {Object} The properties to extend with
         * @param obj {Object} [optional] The object to extend from
         * @returns {Object} The extended object
         */
        extend: function (prop, obj) {
            return this.mixin(prop, Object.create(obj || this));
        },


        /**
         * Return a callback function with this set to the current or a given context object.
         * @param name {String} Name of the method to proxy
         * @param args... [optional] Arguments to use for partial application
         */
        proxy: function (name) {
            var fn = this[name],
                args = Array.prototype.slice.call(arguments, 1);

            args.unshift(this);
            return fn.bind.apply(fn, args);
        }
    };

    return proto;
}));


/*
 * =============================================================
 * elliptical.Provider
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../class/class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../class/class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Provider=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Provider;
    }
}(this, function (Class) {

    var Provider=Class.extend({
        '@resource':null
    },{});

    return Provider;


}));
/*
 * =============================================================
 * elliptical.$Provider
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../class/class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../class/class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Provider=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Provider;
    }
}(this, function (Class) {

    var $Provider = function(name){
        return Class.extend({
            '@resource':name

        },{});
    };

    return $Provider;


}));

/*
 * =============================================================
 * elliptical.Service
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../model/model'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../model/model'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Service=factory(root.elliptical.Model);
        root.returnExports = root.elliptical.Service;
    }
}(this, function (Model) {

    var Service=Model.extend({
        _data:null, //{Object}
        '@resource':null,
        $provider:null

    },{});

    return Service;




}));


/*
 * =============================================================
 * elliptical.View
 * =============================================================
 *
 */

//umd pattern
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('../class/class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','../class/class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.View=factory(root.elliptical.utils,root.elliptical.Class);
        root.returnExports = root.elliptical.View;
    }
}(this, function (utils,Class) {


    var isBrowser=utils.isBrowser,
        _=utils._,
        isFunction=_.isFunction;



        var View = Class.extend({
                _data:{}, //{Object}
                transition:null, //{String},
                $provider:null, //{Object}
                selector:'[data-container="base"]', //{String}
                selectorSet:false,
                clientContextRootNamespace:'$$', //{String}
                pushContextToClient:true,

                /**
                 * static render method
                 * @param template {String}
                 * @param context {Object}
                 * @param transition {String}
                 * @param callback {Function}
                 * @returns callback
                 * @public
                 */
                render: function(template,context,transition,callback){
                    if(isFunction(transition)){
                        callback=transition;
                        transition=null;
                    }
                    this.selector=this.$getSelector();
                    this.$provider.render(template,context,function(err,out){
                        //_render(err,out,selector,transition,callback);
                        if(callback){
                            callback(err,out)
                        }
                    });
                },

                /**
                 * set the template provider
                 * @param $provider {Function}
                 * @public
                 */
                $setProvider:function($provider){
                    this.$provider=$provider;
                },

                /**
                 * set the DOM selector
                 * @param selector {String}
                 */
                $setSelector:function(selector){
                    this.selectorSet=true;
                    this.selector=selector;
                },

                $getSelector:function(){
                    if(typeof window !=='undefined'){
                        if(this.selectorSet){
                            return this.selector;
                        }else{
                            var selector=($('html').hasClass('customelements')) ? 'ui-container[name="base"]' : '[data-container="base"]';
                            this.selector=selector;
                            return selector;
                        }
                    }

                }


            },
            {
                /**
                 * new instance init
                 * @param $provider {Function}
                 * @param selector {String}
                 */
                init:function($provider,selector){
                    if(typeof $provider === 'undefined'){
                        $provider=this.constructor.$provider;
                        selector=this.constructor.$getSelector();
                    }
                    else if(typeof $provider === 'string'){
                        selector=$provider;
                        $provider=this.constructor.$provider;
                    }else if(typeof selector != 'string'){
                        selector=this.constructor.$getSelector();
                    }
                    this.constructor._data.$provider= new $provider(true);
                    this.constructor._data.selector= selector;

                },

                /**
                 * prototype render method
                 * @param template {String}
                 * @param context {Object}
                 * @param transition {String}
                 * @param callback {Function}
                 * @returns callback
                 * @public
                 */
                render: function(template,context,transition,callback){
                    if(isFunction(transition)){
                        callback=transition;
                        transition=this.constructor.transition;
                    }
                    var selector=this.constructor._data.selector;
                    this.constructor._data.$provider.render(template,context,function(err,out){
                        if(callback){
                            callback(err,out);
                        }
                    });
                }
            });







    return View;
}));


/*
 * =============================================================
 * elliptical.Event
 * =============================================================
 *
 * environment-independent Events/Pubsub implementation. Code culled in part from:
 * https://github.com/federico-lox/pubsub.js
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs

        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Event = factory();
        root.returnExports = root.elliptical.Event;
    }
}(this, function () {
    var Event = {};
    (function (context) {


        /**
         * @private
         */
        function init() {
            //the channel subscription hash
            var channels = {},
            //help minification
                funcType = Function;

            return {
                /*
                 * @public
                 *
                 * Publish/Emit some data on a channel
                 *
                 * @param String channel The channel to publish on
                 * @param Mixed argument The data to publish, the function supports
                 * as many data parameters as needed
                 *
                 * @example Publish stuff on '/some/channel'.
                 * Anything subscribed will be called with a function
                 * signature like: function(a,b,c){ ... }
                 *
                 * Event.emit(
                 *		"/some/channel", "a", "b",
                 *		{total: 10, min: 1, max: 3}
                 * );
                 */
                emit: function () {
                    //help minification
                    var args = arguments,
                    // args[0] is the channel
                        subs = channels[args[0]],
                        len,
                        params,
                        x;

                    if (subs) {
                        len = subs.length;
                        params = (args.length > 1) ?
                            Array.prototype.splice.call(args, 1) : [];

                        //run the callbacks asynchronously,
                        //do not block the main execution process
                        setTimeout(
                            function () {
                                //executes callbacks in the order
                                //in which they were registered
                                for (x = 0; x < len; x += 1) {
                                    try{
                                        subs[x].apply(context, params);

                                    } catch (ex) {

                                    }    
                                   
                                }

                                //clear references to allow garbage collection
                                subs = context = params = null;
                            },
                            0
                        );
                    }
                },

                /*
                 * @public
                 *
                 * Register a callback on a channel
                 *
                 * @param String channel The channel to subscribe to
                 * @param Function callback The event handler, any time something is
                 * published on a subscribed channel, the callback will be called
                 * with the published array as ordered arguments
                 *
                 * @return Array A handle which can be used to unsubscribe this
                 * particular subscription
                 *
                 * @example Event.on(
                 *				"/some/channel",
                 *				function(data){ ... }
                 *			);
                 */
                on: function (channel, callback) {
                    if (typeof channel !== 'string') {
                        throw "invalid or missing channel";
                    }

                    if (!(callback instanceof funcType)) {
                        throw "invalid or missing callback";
                    }

                    if (!channels[channel]) {
                        channels[channel] = [];
                    }

                    channels[channel].push(callback);

                    return { channel: channel, callback: callback };
                },

                /*
                 * @public
                 *
                 * Disconnect a subscribed function f.
                 *
                 * @param Mixed handle The return value from a subscribe call or the
                 * name of a channel as a String
                 * @param Function callback [OPTIONAL] The event handler originaally
                 * registered, not needed if handle contains the return value
                 * of subscribe
                 *
                 * @example
                 * var handle = Event.on("/some/channel", function(){});
                 * Event.off(handle);
                 *
                 * or
                 *
                 * Event.off("/some/channel", callback);
                 */
                off: function (handle, callback) {
                    if (handle.channel && handle.callback) {
                        callback = handle.callback;
                        handle = handle.channel;
                    }

                    if (typeof handle !== 'string') {
                        throw "invalid or missing channel";
                    }

                    if (!(callback instanceof funcType)) {
                        throw "invalid or missing callback";
                    }

                    var subs = channels[handle],
                        x,
                        y = (subs instanceof Array) ? subs.length : 0;

                    for (x = 0; x < y; x += 1) {
                        if (subs[x] === callback) {
                            subs.splice(x, 1);
                            break;
                        }
                    }

                },
                /* convenient global unsubscribe/off  */
                flush: function () {
                    channels = {};
                },

                /* list the channels */
                list: function (callback) {
                    if (callback) {
                        callback(channels);
                    }
                }
            };
        }

        Event.init = init();

    }(this));

    return Event.init; //UMD

}));



/*
 * =============================================================
 * elliptical.url v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 * in part, culled from https://github.com/cowboy/javascript-route-matcher
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.url=factory();
        root.returnExports = root.elliptical.url;

    }
}(this, function () {

    var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
    var reParam = /([:*])(\w+)/g;

    /**
     *
     * @param rule
     * @param value
     * @returns {*}
     */
    function validateRule(rule, value) {
        var obj={};
        var type = obj.toString.call(rule).charAt(8);
        return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
    }

    var url={
        match:function(route,rules){
            var self = {};
            var names = [];
            var re = route;
            if (typeof route === "string") {
                re = re.replace(reEscape, "\\$&");
                re = re.replace(reParam, function (_, mode, name) {
                    names.push(name);
                    return mode === ":" ? "([^/]*)" : "(.*)";
                });
                re = new RegExp("^" + re + "$");
                self.parse = function (url) {
                    var i = 0;
                    var param, value;
                    var params = {};
                    var matches = url.match(re);
                    // If no matches, return null.
                    if (!matches) {
                        return null;
                    }
                    // Add all matched :param / *splat values into the params object.
                    while (i < names.length) {
                        param = names[i++];
                        value = matches[i];
                        // If a rule exists for thie param and it doesn't validate, return null.
                        if (rules && param in rules && !validateRule(rules[param], value)) {
                            return null;
                        }
                        params[param] = decodeURIComponent(value);
                    }
                    return params;
                };

                // Build path by inserting the given params into the route.
                self.stringify = function (params) {
                    var param, re;
                    var result = route;
                    // Insert each passed param into the route string. Note that this loop
                    // doesn't check .hasOwnProperty because this script doesn't support
                    // modifications to Object.prototype.
                    for (param in params) {
                        re = new RegExp("[:*]" + param + "\\b");
                        result = result.replace(re, params[param]);
                    }
                    // Missing params should be replaced with empty string.
                    return result.replace(reParam, "");
                };
            } else {
                // RegExp route was passed. This is super-simple.
                self.parse = function (url) {
                    var matches = url.match(re);
                    return matches && { captures: matches.slice(1) };
                };
                // There's no meaningful way to stringify based on a RegExp route, so
                // return empty string.
                self.stringify = function () {
                    return "";
                };
            }

            return self;
        },

        /**
         * strip protocol,hostname and trailing slash from route
         * @param url {String}
         * @returns {String}
         */
        sanitize:function(url){
            var root,path;
            root=url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
            path=(root.indexOf('://') >-1)? url.replace(root,'') : root;
            if(path.length > 1 && path.charAt(path.length - 1)==='/'){
                path=path.slice(0, -1);
            }
            return path;

        },

        queryString:function(url,ji){
            var hu;
            if(typeof ji==='undefined' && typeof window !=='undefined'){
                hu = window.location.search.substring(1);
                ji=url;
            }else{
                hu = url.split('?')[1];
            }
            if(typeof hu !=='undefined'){
                var gy = hu.split("&");
                for (i = 0; i < gy.length; i++) {
                    var ft = gy[i].split("=");
                    if (ft[0] == ji) {
                        return ft[1];
                    }
                }
            }
            return null;
        },

        query:function(url){
            var query={};
            var hu = url.split('?')[1];
            if(typeof hu !== 'undefined'){
                var gy = hu.split("&");
                for (i = 0; i < gy.length; i++) {
                    var ft = gy[i].split("=");
                    query[ft[0]]=ft[1];
                }
            }

            return query;
        },

        httpValueCollection:function(url){
            var query = this.query(url);
            var arr = [];
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var obj = {
                        key: key,
                        value: decodeURIComponent(query[key])
                    };
                    arr.push(obj);
                }
            }

            return arr;
        },

        httpRequestObject: function (route, url) {
            url = (url) ? url : location.pathname;
            var rule = this.match(route);
            return rule.parse(url);
        },

        body:function(prms){
            var body = {};
            prms.forEach(function(p){
                body[p.name] = p.value;
            });
            return body;
        },

        hashTagFormat:function(route){
            if((route).charAt(1) !=='#'){
                return '/#' + route;
            }else{
                return route;
            }
        },

        pathComponent:function(url){
            var rte=url.split('?');
            return rte[0];
        }
    };

    return url;

}));



/*
 * =============================================================
 * elliptical.crypto.base64
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical=root.elliptical || {};
        root.elliptical.crypto=elliptical.crypto || {};
        root.elliptical.crypto.base64=factory();
        root.returnExports = root.elliptical.crypto.base64;
    }
}(this, function () {
    var base64 = {

        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    };

    return base64;

}));












/*
 * =============================================================
 * elliptical.crypto
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./base64'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./base64'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical = root.elliptical || {};
        root.elliptical.crypto=factory(root.elliptical.crypto.base64);
        root.returnExports = root.elliptical.crypto;
    }
}(this, function (basic) {

    var base64=basic.base64;
    var crypto={};
    crypto.base64=base64;
    crypto.base64Encrypt=function(o,n){
        return 'Basic ' + base64.encode(o + ":" + n);

    };

    return crypto;

}));
/*
 * =============================================================
 * elliptical.http.browser
 * =============================================================
 */


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory($);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.http = root.elliptical.http || {};
        var browser = factory(root.$);
        root.elliptical.http.browser=browser;
        root.returnExports = root.elliptical.http.browser;
    }
}(this, function ($) {

    var browser={
        send: function (params, callback) {
            var settings = {
                type: params.method || 'GET',
                dataType: params.dataType || 'json',
                url: params.protocol + '://' + params.host + ':' + (params.port || 80) + params.path

            };

            if (params.data) {
                params.data = JSON.stringify(params.data);
                settings.data = params.data;
                settings.contentType = 'application/json';

            }
            if (params.authorization) {
                settings.beforeSend = function (req) {
                    req.setRequestHeader('Authorization', params.authorization);
                }
            }

            var ajax = $.ajax(settings).done(function (data, status) {
                try {
                    if(typeof data==='string'){
                        data=JSON.parse(data);
                    }
                    callback(null, data);

                } catch (ex) {
                    callback(null, data);
                }

            }).fail(function (data, status, errThrown) {
                var err={};
                err.statusCode = data.status;
                var errMsg = errThrown;
                try{
                    if (data.responseText) {
                        errMsg = data.responseText;
                    }
                } catch (ex) {

                }
                err.message=errMsg;

                callback(err, data.responseJSON);
            });
        }
    };

    return browser;
}));

/*
 * =============================================================
 * elliptical.http
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        var transport=require('./node');
        if(typeof window != 'undefined'){
            //we are in a browserify bundle
            transport=require('./browser');
        }
        module.exports = factory(transport,require('elliptical-crypto'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./browser','elliptical-crypto'], factory);
    } else {
        // Browser globals (root is window)
        var browser=root.elliptical.http.browser;
        var crypto=root.elliptical.crypto;
        var http=factory(browser,crypto);
        http.browser=browser;
        root.elliptical.http=http;
        root.returnExports = root.elliptical.http;
    }
}(this, function (transport,crypto) {

    var http={
        send: function (options, callback) {
            transport.send(options,function(err,data){
                if (callback) {
                    callback(err, data);
                }
            });
        },

        base64Encrypt: crypto.base64Encrypt,

        base64:crypto.base64,

        encodeSessionToken: function(token){
            var authorization = 'Session ' + token;
            return authorization;
        },

        encodeOAuthToken: function(token){
            var authorization = 'OAuth ' + token;
            return authorization;
        }


    };

    http.crypto=crypto;

    return http;


}));

/*
 * =============================================================
 * elliptical.document
 * =============================================================
 *   serializes a form submission as a javascript object to be posted to an endpoint.
 *   the plugin handles broad cases of mapping a form to a model schema, including:
 *   (i) posting the form as an array or a deeply nested object
 *   (ii) checkbox handling, including posting boolean values for both checked and unchecked boxes
 *
 *   Note: the return object is not a json document.
 *   a json document can be constructed by simply calling JSON.stringify(which is usually handled by your js mvc framework).
 *   if you are not using a framework and manually invoking $.ajax(), you will need to stringify the return object
 *
 *   the idea is that the dev time is spent on form markup and not processing callbacks on submit captures
 *
 *   Most of the code culled from:
 *   SerializeJSON jQuery plugin.
 *   https://github.com/marioizquierdo/jquery.serializeJSON
 *  version 1.1.1 (Feb 16, 2014)
 *
 *  the method override for serializeArray() to include checkboxes as boolean values:
 *  http://tdanemar.wordpress.com/2010/08/24/jquery-serialize-method-and-checkboxes/
 *
 *  Final note: forms posted to the server-side controller action may not match client-side capture and post to json endpoint
 *  using this plugin due to different implementations by server-side frameworks re: array posts and checkboxes.
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {


        $.fn.document = function (options) {
            var o = $.extend({
                boolean: true,
                arrayAsBody:true
            }, options || {});
            var obj, formAsArray;
            obj = {};
            formAsArray = this.booleanSerializeArray(o);

            $.each(formAsArray, function (i, input) {
                var name, value, keys;
                name = input.name;
                value = input.value;

                // Split the input name in programatically readable keys
                // name = "foo"              => keys = ['foo']
                // name = "[foo]"            => keys = ['foo']
                // name = "foo[inn][bar]"    => keys = ['foo', 'inn', 'bar']
                // name = "foo[inn][arr][0]" => keys = ['foo', 'inn', 'arr', '0']
                // name = "arr[][val]"       => keys = ['arr', '', 'val']
                keys = $.map(name.split('['), function (key) {
                    var last;
                    last = key[key.length - 1];
                    return last === ']' ? key.substring(0, key.length - 1) : key;
                });
                if (keys[0] === '') { keys.shift(); } // "[foo][inn]" should be same as "foo[inn]"

                // Set value in the object using the keys
                $.deepSet(obj, keys, value);
            });

            /* if obj has only array prop && if arrayAsBody is set, return the array
             *  else return the object
             */
            if(Object.keys(obj).length===1 && o.arrayAsBody){
                var prop=obj[Object.keys(obj)[0]];
                return (isArray(prop)) ? prop : obj;
            }else{
                return obj;
            }

        };

        // Auxiliar function to check if a variable is an Object
        var isObject = function (obj) {
            return obj === Object(obj);
        };

        var isArray =function(obj){
            return (/Array/).test(Object.prototype.toString.call(obj));
        };

        // Auxiliar function to check if a variable is a valid Array index
        var isValidArrayIndex = function(val){
            return /^[0-9]+$/.test(String(val));
        };

        /**
         Access the object in a deep key and assigns the value:

         // Examples:
         deepSet(obj, ['foo'], v)                //=> obj['foo'] = v
         deepSet(obj, ['foo', 'inn'], v)         //=> obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
         deepSet(obj, ['foo', 'inn', 'inn'], v)  //=> obj['foo']['inn']['inn'] = v
         deepSet(obj, ['0'], v)                  //=> obj[0] = v // obj may be an Array
         deepSet(obj, [''], v)                   //=> obj.push(v) // assume obj as array, and add a new value to the end
         deepSet(obj, ['arr', '0'], v)           //=> obj['arr']['0'] = v // obj['arr'] is created as Array if needed
         deepSet(obj, ['arr', ''], v)            //=> obj['arr'].push(v)
         deepSet(obj, ['foo', 'arr', '0'], v)    //=> obj['foo']['arr'][0] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array, if needed
         deepSet(obj, ['arr', '0', 'foo'], v)    //=> obj['arr']['0']['foo'] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array and obj['foo']['arr'][0] as object, if needed

         // Complex example with array empty index,
         // it creates a new element, unless there is a nested non repeated key, so it assigns to the last element object:
         var arr = []
         deepSet(arr, [''], v)                   //=> arr === [v]
         deepSet(arr, ['', 'foo'], v)            //=> arr === [v, {foo: v}]
         deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}]
         deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}, {bar: v}]
         */
        $.deepSet = function (obj, keys, value) {
            var key, nextKey, tail, objectOrArray, lastKey, lastElement;

            if (!keys || keys.length === 0) { throw new Error("ArgumentError: keys param expected to be an array with least one key"); }
            key = keys[0];

            if (keys.length == 1) { // only one key, then it's not a deepSet, just assign the value.
                if (key === '') {
                    obj.push(value); // empty key is used to add values to the array
                } else {
                    obj[key] = value; // other keys can be used as array indexes or object keys
                }

            } else { // more keys menas a deepSet. Apply recursively

                nextKey = keys[1];

                // Empty key is used to add values to the array => merge next keys in the object element.
                if (key === '') {
                    lastKey = obj.length - 1;
                    lastElement = obj[obj.length - 1];
                    if (isObject(lastElement) && !lastElement[nextKey]) { // if nextKey is a new attribute in the last object element then set the new value in there.
                        key = lastKey;
                    } else { // if the array does not have an object as last element, create one.
                        obj.push({});
                        key = lastKey + 1;
                    }
                }

                // obj[key] defaults to Object or Array, depending on the next key
                if (obj[key] === undefined) {
                    if (nextKey === '' || isValidArrayIndex(nextKey)) { // if is '', 1, 2, 3 ... then use an Array
                        obj[key] = [];
                    } else { // if is something else, use an Object
                        obj[key] = {};
                    }
                }

                // Recursively access the inner Object
                tail = keys.slice(1);
                $.deepSet(obj[key], tail, value);
            }

        };
        $.fn.booleanSerializeArray = function (options) {
            var o = $.extend({
                boolean: true
            }, options || {});

            var rselectTextarea = /select|textarea/i;
            var rinput = /text|number|hidden|password|date|datetime|color|email|month|range|tel|time|url|week|search/i;

            return this.map(function () {
                return this.elements ? $.makeArray(this.elements) : this;
            })
                .filter(function () {
                    return this.name && !this.disabled &&
                        (this.checked
                            || (o.boolean && this.type === 'checkbox')
                            || rselectTextarea.test(this.nodeName)
                            || rinput.test(this.type));
                })
                .map(function (i, elem) {
                    var val = $(this).val();
                    return val == null ?
                        null :
                        $.isArray(val) ?
                            $.map(val, function (val, i) {
                                return { name: elem.name, value: val };
                            }) :
                        {
                            name: elem.name,
                            value: (o.boolean && this.type === 'checkbox') ?
                                (this.checked ? 'true' : 'false') :
                                val
                        };
                }).get();
        };


    return $;


}));
/*
 * =============================================================
 * elliptical.Router
 * =============================================================
 * Dependencies:
 * elliptical-utils,elliptical-mvc,elliptical-event,elliptical-url
 *
 * elliptical.Router implements a client-side version of "node express routing"
  * supports: (i) both html5 & hashTag routing
  *           (ii) virtual directories
  *           (iii) middleware
  *
  * Router consists of 5 classes: Listener,History,Location,Route & Router
  *
  * For a matched route, Router emits a data object with two properties:
  *  (i) route(path)
  *  (ii) the callback handlers, including a return function that matches the signature fn(req,res,next), binding params,body,query,route and
  *       statusCode to a request object
  *
  *       SAMPLE EXAMPLE IMPLEMENTATION
  *       var Router=require('elliptical-router');
  *       var Event=require('elliptical-event');
  *       var App=function(Router,Event){
  *           this.Router=Router;
  *           this.get=function(route,callbacks){
  *              this.Router.get(route,callbacks)
  *           }
  *           this.post=function(route,callbacks){
  *              this.Router.post(route,callbacks);
  *           }
  *           this.listen=function(){
  *              Event.on('onRouteDispatch',function(data){
  *                 _callStack(data.route,data.handlers);
  *              });
  *           }
  *
  *           function _callStack(route,handlers){
  *               //handle middleware callstack
  *           }
  *       }
  *
  *       var app=new App(Router,Event);
  *       app.get('/my/route/:id',function(req,res,next){
  *            var id=req.id;
  *            //do stuff
  *       });
  *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-mvc'),require('elliptical-event'),require('elliptical-url'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-mvc','elliptical-event','elliptical-url'], factory);
    } else {
        root.elliptical.Router=factory(root.elliptical.utils,root.elliptical,root.elliptical.Event,root.elliptical.url);
        root.returnExports = root.elliptical.Router;
    }
}(this, function (utils,elliptical,Event,url) {
    var Class=elliptical.Class,
        _=utils._;
    var press=('ontouchend' in document) ? 'touchstart' : 'click';
    var Listener=Class.extend({
        events:{
            request:'elliptical.onDocumentRequest',
            click:'touchclick',
            orientation: 'onOrientationChange',
            press:press
        },
        backButtonSelector:'[data-role="back"]',

        on:function(){
            var self=this;

            $(window).on(this.events.request, function (event,data) {
                self.forward(data);
            });
            
            $(document).on(this.events.press, this.backButtonSelector, function (event) {
                Router.history();
            });

            $(window).on(this.events.orientation, function (event, data) {
                data.method='get';
                self.forward(event,data);
            });
        },

        off:function(){
            var self=this;

            $(window).off(this.events.request, function (event,data) {
                self.forward(data);
            });

            $(document).off(this.events.click, this.backButtonSelector, function (event) {
                Router.history();
            });

            $(window).off(this.events.orientation, function (event, data) {
                data.method='get';
                self.forward(event,data);
            });


        },

        reset:function(){
            this.off();
            this.on();
        },

        forward: function(data){
            var route=data.route;
            var params={};
            var method=data.method;
            Router.location(route,method,params);
        }

    },{});



    var History=Class.extend({
        stateObject:null,

        poppedDelay:700,

        pushHistory:false,

        push:function(){
            if(this.pushHistory){
                var stateObject=this.stateObject;
                var title = '';
                stateObject.route = Location.hashify(stateObject.route);
                window.history.pushState(stateObject, title, stateObject.route);
            }
        },

        pop:function(event){
            var self=this;
            var isTouch= $.support.touch || false;
            if (event.originalEvent.state) {
                var route = event.originalEvent.state.route;
                var params = event.originalEvent.state.params;
                var method = event.originalEvent.state.method;

                this.pushHistory = false;
                if (isTouch) {
                    setTimeout(function () {
                        Route.location(route,method,params);

                    }, self.poppedDelay);
                } else {
                    Route.location(route,method,params);
                }
            }
        },

        start:function(){
            var self=this;
            var route=Location.path();
            var params=Location.search;
            var method = 'get';
            var stateObj = { route: route, params: params, method: method };
            this.stateObject = stateObj;
            this.pushHistory = true;
            Route.location(stateObj.route,'get',params);
            $(window).on('popstate', function (event) {
                self.pop(event);
            });
        },

        end: function(){
            var self=this;
            this.stateObject = null;
            this.pushHistory = false;
            $(window).off('popstate', function (event) {
                self.pop(event);
            });
        }

    },{});

    var Route=Class.extend({
        dispatchEvent:'elliptical.onRouteDispatch',

        add: function (method, route, callbacks) {
            if (this.verify(route, method)) {
                var rte = { route: route, method: method, handle: callbacks };
                Router.routes.push(rte);
                if (Router.debug) {
                    var msg='route: ' + route + ' has been added. Method: ' + method;
                    (Router.enabled) ? console.log(msg) : Router.messageQueue.push(msg);
                }
            }
        },

        remove:function(route,method){
            var index = -1;
            Router.routes.forEach(function(obj,i){
                var route_=obj.route;
                var method_=obj.method;
                if(route===route_ && method===method_){
                    index=i;
                }
            });
            if (index > -1) {
                Router.routes.splice(index, 1);
                if (Router.debug) {
                    console.log('route: ' + route + ' has been removed');
                }
            }
        },

        verify: function (route, method) {
            var bool=true;
            Router.routes.every(function(obj){
                var route_=obj.route;
                var method_=obj.method;
                if(route===route_ && method===method_){
                    bool= false;
                }
            });

            return bool;
        },

        decodeUrl:function(url){
            return decodeURIComponent(url.replace(/\+/g, '%20'));
        },

        deserialize:function(s){
            var data = s.split("&");
            var p = [];
            for (var i = 0; i < data.length; i++) {
                var pair = this.decodeUrl(data[i]).split("=");
                var _name = pair[0];
                var value = pair[1];
                var entry = { name: _name, value: value };
                p.push(entry);

            }
            return p;
        },

        location:function(route, method,params){

            route=Location.deHashify(route);
            History.push();

            if (!this.dispatch(route,method,params)) {
                //error --------->no matched route
                //emit the error

                var handlers = [];
                handlers.push(this.error);
                var data_={
                    route:route,
                    handlers:handlers
                };

                Event.emit(this.dispatchEvent,data_);
            }
        },

        dispatch:function(route, method, params){
            var self=this;
            var dispatchEvent=this.dispatchEvent;
            var success = false;
            var routes=Router.routes;
            /* routes should be case insensitive */
            route=route.toLowerCase();
            routes.forEach(function(obj,index){
                var body={};
                var query={};
                var route_ = obj.route;
                /* routes should be case insensitive */
                route_=route_.toLowerCase();
                var routePath=Location.toPath(route);
                var rule = url.match(route_);
                var data = rule.parse(routePath);

                if ((data != null) && (obj.method.toLowerCase() === method.toLowerCase()) &&(!success)) {
                    if(method.toLowerCase()!='get'){
                        body=url.body(data);
                    }
                    /* query component */
                    query=url.query(route);

                    //populate the array of route handlers
                    var handlers = [];
                    var fn = self.next(data,body,query,routePath);
                    handlers.push(fn);

                    var callbacks = obj.handle;
                    for (var i = 0; i < callbacks.length; i++) {
                        handlers.push(callbacks[i]);
                    }

                    //emit the dispatch event
                    var data_={
                        route:routePath,
                        handlers:handlers
                    };

                    Event.emit(dispatchEvent, data_);
                    $(window).trigger('LocationChange', routePath);
                    success = true;
                }

            });

            return success;

            /**
             * parses a location hashtag
             * if hashTag is set and location has hashtag but registered route does not, trim hashtag from location
             * @param route {String}  the registered route
             * @param location {String} the triggered route
             * @returns {*}
             */
            function parseHashTag(route,location){
                if(window.elliptical.$hashTag){
                    if((location).charAt(1) ==='#'){
                       if((route).charAt(1) !== '#'){
                           location=location.substring(2);
                       }
                    }
                }
                return location;
            }
        },

        next: function(params, body,query, route){
            return function (req, res, next) {
                res.statusCode = 200;
                req.params = params;
                req.query=query;
                req.route = route;
                req.body = body;
                next();
            }
        },

        error: function(req, res, next){
            res.statusCode = 404;
            var err = 'Page does not exist';
            next();
        }

    },{});

    /* replaces the native window.location object */
    var Location=Class.extend({
        "@resource":'Location',

        /**
         * if hashTag bit is set, adds a hashtag to the route, if not already present
         * @param route {String}
         * @returns {String}
         */
        hashify:function(route){
            var virtualRoot=Router.virtualRoot;
            var isVirtual=(virtualRoot !== '/');
            if(Router.hashTag && isVirtual){
                if(route.indexOf(virtualRoot) !==0){
                    route=virtualRoot + route;
                }
                var index=virtualRoot.length;
                if((route).charAt(index + 1) !== '#'){
                    route=utils.stringInsertAt(route,index,'/#');
                }
            }else if(Router.hashTag){
                if((route).charAt(1) !== '#'){
                    route='/#' + route;
                }
            }else if(isVirtual){
                if(route.indexOf(virtualRoot) !==0){
                    route=virtualRoot + route;
                }
            }


            return route;
        },

        /**
         * if hashTag bit is set, removes the leading hashtag from the route
         * @param route {String}
         * @returns {String}
         */
        deHashify:function(route){
            var virtualRoot=Router.virtualRoot;
            if(virtualRoot !=='/'){
                if(route.indexOf(virtualRoot)===0){
                    route=route.replace(virtualRoot,'');
                }
            }
            if(Router.hashTag){
                if((route).charAt(1) === '#'){
                    route=route.substring(2);
                }
            }
            return route;
        },

        hashRoot:function(route){
            if(Router.hashTag && route.slice(-1)==='#'){
                route+='/';
                return route;
            }else{
                return route;
            }
        },

        /**
         * replaces location.path, favtoring out virtual root and hashtag
         * @returns {string}
         */
        path:function(){
            var hashTag=window.elliptical.$hashTag;
            var virtualRoot=window.elliptical.$virtualRoot;
            var path;
            if(hashTag){
                path=location.hash;
                if((path).charAt(0) ==='#'){
                    path=path.substring(1);
                }
                if(path===''){
                    path='/';
                }
                path=this.toPath(path);
            }else{
                path=location.pathname;
                if(virtualRoot!=='/' ){
                    if(path.indexOf(virtualRoot)===0){
                        path=path.replace(virtualRoot,'');
                    }
                }
            }

            return path;

        },

        toPath:function(route){
            var rte=route.split('?');
            return rte[0];
        },

        /**
         * triggers a registered route
         * @param route {String}
         */
        redirect:function(route){
            //note: application.js will overwrite this if History enabled
            location.href=route;
        },

        /**
         * reloads the current route
         */
        reload:function(){
            //note: application.js will overwrite this if History enabled
            location.reload();
        },

        url:url,
        href:location.href,
        host:location.host,
        hostname:location.hostname,
        origin:location.origin,
        protocol:location.protocol,
        port:location.port,
        search:location.search



    },{});

    var Router = Class.extend({
        "@resource":'Router',
        validMethods:['get','post','put','delete'],
        enabled:false,
        debug:true,
        callbacks:[],
        routes:[],
        virtualRoot:'/',
        hashTag:false,
        messageQueue:[],


        get:function(route,callbacks){
            this.parseMethod('get',route,callbacks);
        },

        post:function(route,callbacks){
            this.parseMethod('post',route,callbacks);
        },

        put:function(route,callbacks){
            this.parseMethod('put',route,callbacks);
        },

        delete:function(route,callbacks){
            this.parseMethod('delete',route,callbacks);
        },

        parseMethod:function(method,route,callbacks){
            if(!_.contains(this.validMethods,method)){
                return false;
            }
            var handlers = [];
            if ('string' != typeof route) {
                route = '/';
            }
            if (utils.strLastChar(route) === '/') {
                route = utils.trimLastChar(route);
            }
            var args = Array.prototype.slice.call(arguments, 0);
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === 'function') {
                    handlers.push(args[i]);
                }
            }
            if (args.length < 1) {
                console.log('error adding route: "' + route + '".  A route must have at least one handler function.')
            } else {
                Route.add(method, route, handlers);
            }

        },

        remove:function(route, method){
            if (!this.enabled) {
                return false;
            }
            Route.remove(route, method);
        },

        removeAll:function(){
            var self=this;
            if (!this.enabled) {
                return false;
            }
            this.routes.forEach(function(obj){
                self.remove(obj.route,obj.method);
            });
        },

        location: function(route, method,params, delay){
            if (!this.enabled) {
                return false;
            }
            if(typeof params==='undefined'){
                params={};
            }
            route=url.sanitize(route);
            route=Location.hashRoot(route);

            var stateObj = { route: route, params: params, method: method };
            History.stateObject = stateObj;
            History.pushHistory = true;

            if (typeof delay != 'undefined') {
                setTimeout(function () {
                    Route.location(route,method,params);
                }, delay);
            } else {
                Route.location(route, method, params);
            }
        },




        start:function(){
            if (this.enabled) {    /* if already started, exit */
                return false;
            }
            this.enabled = true;
            History.start();
            Listener.on();
            if (this.debug) {
                var msg = 'Router has started in debug mode';
                console.log(msg);
                this.messageQueue.forEach(function(m){
                    console.log(m);
                });
                this.messageQueue.length=0;
            }
        },


        pause: function(){
            this.enabled=false;
            Listener.off();
        },

        resume:function(){
            this.enabled=false;
            Listener.on();
        },

        history:function(pages, delay){
            if (typeof delay != 'undefined') {
                setTimeout(function () {
                    if (typeof pages === 'undefined') {
                        window.history.back();
                    } else {
                        window.history.go(pages);
                    }

                }, delay);
            } else {
                if (typeof pages === 'undefined') {
                    window.history.back();
                } else {
                    window.history.go(pages);
                }
            }
        },

        end: function(){
            this.enabled=false;
            this.routes=[];
            History.end();
            Listener.off();
        },

        /**
         * set Route event provider and event name
         * @param $event {Object}
         * @param eventName {String}
         */
        $provider:function($event,eventName){
            if(typeof $event==='string'){
                Route.dispatchEvent=eventName;
            }else if(typeof $event !== 'undefined'){
                Event=$event;
                if(typeof eventName==='string'){
                    Route.dispatchEvent=eventName;
                }
            }
        },

        /* configure Listener/Event settings */
        configure:function(opts){
            if(opts.request){
                Listener.events.request=opts.request;
            }
            if(opts.orientation){
                Listener.events.orientation=opts.orientation;
            }
            if(opts.click){
                Listener.events.click=opts.click;
            }
            if(opts.backButtonSelector){
                Listener.backButtonSelector=opts.backButtonSelector;
            }
            if(opts.dispatchEvent){
                Route.dispatchEvent=opts.dispatchEvent;
            }
            /* reset Listener */
            Listener.reset();
        }


    },{});


    Router.Location=Location;


    return Router;
}));

/*
 * =============================================================
 * elliptical.middleware.authorization v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * elliptical http authorization middleware
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.authorization=factory();
        root.returnExports = root.elliptical.middleware.authorization;
    }
}(this, function () {

    return function authorization(callback) {
        return function authorization(req, res, next) {
            try{
                var app=req.app,
                    locations=app.locations,
                    acl=null,
                    authenticate=true,
                    utils=app.utils;

                var route=req._parsedUrl.pathname;

                for(var i=0;i<locations.length;i++){
                    if(utils.strLastNChars(locations[i].path,2)==='**'){
                        var location=utils.trimLastNChars(locations[i].path,2);
                        if(route.toLowerCase().indexOf(location.toLowerCase())===0){
                            acl=locations[i];
                            break;
                        }
                    }else if(route.toLowerCase()===locations[i].path.toLowerCase()){
                        acl=locations[i];
                        break;
                    }
                }

                if(acl){
                    var exclude=acl.exclude;
                    for(var i=0;i<exclude.length;i++){
                        if(utils.strLastNChars(exclude[i],2)==='**'){
                            var check=utils.trimLastNChars(exclude[i],2);
                            if(route.toLowerCase().indexOf(check.toLowerCase())===0){
                                authenticate=false;
                                break;
                            }
                        }else if(route.toLowerCase()===exclude[i].toLowerCase()){
                            authenticate=false;
                            break;
                        }
                    }
                    if(authenticate){
                        req.location=route;
                        if(callback){
                            callback(req,res,next);
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                }else{
                    next();
                }
            }catch(ex){
                next(ex);
            }
        }
    };
}));


/*
 * =============================================================
 * elliptical.middleware.globalCallback v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * simple callback middleware
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.globalCallback=factory();
        root.returnExports = root.elliptical.middleware.globalCallback;
    }
}(this, function () {

    return function globalCallback(callback) {
        return function globalCallback(req, res, next) {
            try{
                if(!req.context){
                    req.context={};
                }
                if(callback){
                    callback(req,res,next);
                }else{
                    next();
                }
            }catch(ex){
                next(ex);
            }
        }
    };

}));

/*
 * =============================================================
 * elliptical.middleware.http404 v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * elliptical http 404 error middleware
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.http404=factory();
        root.returnExports = root.elliptical.middleware.http404;
    }
}(this, function () {

    return function http404(template,callback) {
        return function http404(req, res, next) {
            if(typeof template==='undefined' || typeof template==='function'){
                if(typeof template==='function'){
                    callback=template;
                }
                template = 'http-status';
            }

            var app=req.app;
            var STRINGS=app.settings.STRINGS;
            var _404;
            if(STRINGS && STRINGS._404){
                _404=STRINGS._404;
            }else{
                _404={
                    statusCode:404,
                    message:'Page Not Found',
                    description:'The resource you are looking for could have been removed, had its name changed, or is temporarily unavailable.  Please review the following URL and make sure that it is spelled correctly.'
                };
            }

            if(callback){
                callback(_404,req,res,next,function(err_,req_,res_,next){
                    render_(err_,req_,res_);
                });
            }else{
                render_(_404,req,res);
            }



            function render_(error,request,response){
                response.context.statusCode = error.statusCode;
                response.context.message = error.message;
                response.context.description = error.description;
                response.context.url = request.url;

                response.render(template, response.context);
            }

        }
    }


}));


/*
 * =============================================================
 * elliptical.middleware.http404 v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * elliptical http 404 error middleware
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.httpError=factory();
        root.returnExports = root.elliptical.middleware.httpError;
    }
}(this, function () {

    return function httpError(template,callback) {
        return function httpError(err,req, res, next) {
            if(typeof template==='undefined' || typeof template==='function'){
                if(typeof template==='function'){
                    callback=template;
                }
                template = 'http-status';
            }
            var e={};
            if(err.stack){
                e.statusCode=500;
                e.description=err.stack;
                e.message='Internal Server Error';
            }else{
                e.statusCode=err.statusCode;
                e.description=err.description;
                e.message=err.message;
            }

            if(callback){
                callback(e,req,res,next,function(err_,req_,res_,next){
                    render_(err_,req_,res_);
                });
            }else{
                render_(e,req,res);
            }

        };

        function render_(error,request,response){
            response.context.statusCode=error.statusCode;
            response.context.description=error.description;
            response.context.message=error.message;
            response.context.url=request.url;
            response.render(template, response.context);
        }
    }


}));


/*
 * =============================================================
 * elliptical.middleware.logonIdentity v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * simple callback middleware
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.logonIdenity=factory();
        root.returnExports = root.elliptical.middleware.logonIdentity;
    }
}(this, function () {

    return function logonIdentity(tokenKey,identityTokenKey,callback) {
        return function logonIdentity(req, res, next) {
            try{
                var identity;
                if(req.cookies[tokenKey] && req.cookies[identityTokenKey] && !req.session.membership){
                    identity=req.cookies[identityTokenKey];
                    identity=JSON.parse(identity);
                    var identityToken=identity.authToken;
                    callback.call(this,req.cookies[tokenKey],identityToken,req,res,next);
                }else if(req.cookies[identityTokenKey]){
                    identity=req.cookies[identityTokenKey];
                    identity=JSON.parse(identity);

                    res.context.adminIdentity=identity;
                    //console.log(res.context.adminIdentity);
                }
                next();
            }catch(ex){
                next(ex);
            }
        }
    };

}));

/*
 * =============================================================
 * elliptical.middleware.service v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * elliptical service injection middleware
 * assigns response,request objects as properties to passed services(and the services' providers)
 * and passes the services to a created services array on the request object
 *
 * In this way services are made global to the application(routes or controller actions) and service providers
 * have access to the real-time req,res objects
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.service=factory();
        root.returnExports = root.elliptical.middleware.service;
    }
}(this, function () {

    return function service() {
        var args = [].slice.call(arguments);
        return function service(req, res, next) {
            req.services=[];
            req.service=function(name){
                var obj_=null;
                var model=null;
                if(req.services && req.services.length > 0){
                    req.services.forEach(function(obj){
                        if(obj.name===name){
                            obj_=obj.service;
                        }else if(obj.name==='Model'){
                            model=obj.service.extend({},{}); //if model, extend it so that each is a separate copy
                            model["@resource"]=name;
                        }
                    });
                }
                return (obj_) ? obj_ : model;
            };

            try{
                for(var i=0;i<args.length;i++){
                    var name=(args[i]["@resource"]);
                    if(!name){
                        if(args[i].constructor && args[i].constructor["@resource"]){
                            name=args[i].constructor["@resource"];
                        }else{
                            name='Model';
                        }
                    }
                    args[i].req=req;
                    args[i].res=res;
                    if(args[i].$provider){
                        args[i].$provider.req=req;
                        args[i].$provider.res=res;
                    }
                    req.services.push({
                        name:name,
                        service:args[i]
                    });
                }
                next();

            }catch(ex){
                next(ex);
            }
        }
    }

}));

/*
 * =============================================================
 * elliptical.middleware.sessionSync v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * elliptical-utils
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.sessionSync=factory(root.elliptical);
        root.returnExports = root.elliptical.middleware.sessionSync;
    }
}(this, function (utils) {
    var _=utils._;
    return function sessionSync() {
        return function sessionSync(req, res, next) {
            try{
                if(typeof window !=='undefined'){
                    var session= sessionStorage.getItem('sessionStore');

                    if(session){
                        session=JSON.parse(session);
                        _.defaults(req.session,session);
                    }
                }

                var Session=req.service('Session');
                Session.get(function(err,data){
                    if(data){
                        try{
                            _.defaults(req.session,data);
                        }catch(ex){

                        }
                    }
                    next();
                });


            }catch(ex){
                next(ex);
            }
        }
    };

}));

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */



(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    }else if (typeof module === 'object' && module.exports) {
        //CommonJS module

        if(typeof window!='undefined'){
            factory($);
        }

    } else {
        // Browser globals.
        factory($);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch(er) {}
    }

    var config = $.cookie = function (key, value, options) {
        config.raw = true;
        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

    return $;

}));



/*
 * =============================================================
 * elliptical.providers.$cookie
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('./cookie'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','./cookie'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$cookie = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$cookie;
    }
}(this, function (elliptical) {

    var $cookie=elliptical.Provider.extend({


        /**
         *
         * @param key {String}
         * @returns {Object}
         */

        get:function(key){
            //return (typeof key === 'undefined') ? $.cookie() : $.cookie(key);
            if (typeof key === 'undefined') {
                return $.cookie();
            } else {
                var val = $.cookie(key);
                try{
                    return JSON.parse(val);
                } catch (ex) {
                    return val;
                }
            }
        },

        /**
         *
         * @param params {Object}
         * @returns {Object}
         */
        post:function(params){
            var name=params.key;
            var value=params.value;
            var options = params.options;
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            if (options === undefined) {
                options.path = '/';
            } else if (options.path === undefined) {
                options.path = '/';
            }
            return $.cookie(name, value, options);
        },

        /**
         *
         * @param params {Object}
         * @returns {Object}
         */
        put:function(params){
            var name=params.key;
            var value=params.value;
            var options = params.options;
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            if (options === undefined) {
                options = {};
                options.path = '/';
            } else if (options.path === undefined) {
                options.path = '/';
            }
            return $.cookie(name, value, options);
        },

        /**
         *
         * @param key {String}
         * @returns {Object}
         */
        delete:function(key){
            return $.removeCookie(key);
        }

    },{});



    return $cookie;

}));



/*
 * =============================================================
 * elliptical.providers.$identity
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$identity = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$identity;
    }
}(this, function (elliptical) {

    var $identity=elliptical.Provider.extend({
        tokenKey:'authToken',
        identityTokenKey:'authIdentity',

        on:function(token,profile,callback){
            var req=this.req,
                res=this.res,
                session=req.session,
                membership=session.membership;

            var err=null;
            if(!membership){
                err.statusCode=401;
                err.message='No membership object available';
                callback(err,null);
            }else{
                //store current profile in cookie
                var aI={};
                aI.authToken=req.cookies[this.tokenKey];
                aI.profile=membership.profile;
                aI.roles=membership.roles;
                console.log(aI);
                res.cookie(this.identityTokenKey,JSON.stringify(aI));
                console.log(this.tokenKey);
                console.log(token);
                //set impersonated profile
                res.cookie(this.tokenKey,token);
                membership.profile=profile;

                callback(err,null);
            }
        },

        off:function(callback){
            var req=this.req,
                res=this.res,
                session=req.session,
                membership=session.membership;
            var err=null;
            if(!membership){
                err.statusCode=401;
                err.message='No membership object available';
                callback.call(this,err,null);
            }else{
                //restore profile
                var identity=req.cookies[this.identityTokenKey];
                identity=JSON.parse(identity);
                var authToken=identity.authToken;
                res.cookie(this.tokenKey,authToken);

                //delete cookie reference
                res.clearCookie(this.identityTokenKey);

                callback(err,identity);
            }
        },

        setKeys:function(params){
            if(typeof params.tokenKey !=='undefined'){
                this.tokenKey=params.tokenKey;
            }
            if(typeof params.identityTokenKey !=='undefined'){
                this.identityTokenKey=params.identityTokenKey;
            }
        }


    },{});



    return $identity;

}));


/*
 * =============================================================
 * elliptical.providers.$memory
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$memory = factory(root.elliptical,root.elliptical.utils);
        root.returnExports = root.elliptical.providers.$memory;
    }
}(this, function (elliptical,utils) {
    var async=elliptical.async;
    var _=utils._;

    var $memory=elliptical.Provider.extend({

        store: [],
        /* the memory store: an array of key/value pairs
         store=[obj1,obj2,...objN], where obj[i]={key:<key>,val:<val>}
         */

        index:[]
        /* array of index objects that contain the keys for each model type
         index=[obj1,obj2,...objN], where obj[i]={model:<model>,keys:<[key1,key2,...keyM]>}
         */


    },{
        /* prototype methods */

        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        get: function(params,model,callback){
            var id=params.id;
            if(typeof id==='undefined'){
                /* get all */
                this.getAll(model,function(err,data){
                    if(callback){
                        callback(err,data);
                    }
                });
            }else{
                /* get by id */
                this.getByKey(id,function(err,data){
                    if(callback){
                        callback(err,data);
                    }
                });
            }
        },



        /**
         *
         * @param key {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        getByKey: function (key, callback) {
            var store = this.constructor.store;
            var err = null;
            var val;

            try {
                for (var i = 0; i < store.length; i++) {
                    if (store[i].key === key) {
                        val = store[i].val;
                        break;
                    }
                }

                if (typeof val === 'undefined') {
                    err={
                        statusCode:404,
                        message:'key does not exist'
                    };

                    val = null;
                }

                if (callback) {

                    callback(err, val);

                }else{
                    return val;
                }
            } catch (ex) {
                if (callback) {
                    callback(ex, null);
                }
            }

        },

        /**
         *
         * @param keys {Array}
         * @param fn {Function}
         * @returns fn
         * @public
         */
        mget: function (keys, fn) {
            var err = null;
            var vals = [];
            var self = this;
            try {
                var length = keys.length;
                if (length > 0) {

                    async.forEach(keys, function (key, callback) {
                        self.getByKey(key, function (err, val) {
                            if (!err) {
                                vals.push(val);
                                callback(); //inform async that the iterator has completed
                            } else {
                                throw new Error(err);
                            }

                        });

                    }, function (err) {
                        if (!err) {
                            if (fn) {
                                fn(err, vals);
                            }
                        } else {
                            if (fn) {
                                fn(err, []);
                            }
                        }

                    });
                } else {
                    if (fn) {
                        err={
                            statusCode:400,
                            message:'invalid keys'
                        };
                        //err = 'invalid keys';
                        fn(err, []);
                    }
                }
            } catch (ex) {
                if (fn) {
                    fn(ex, []);
                }
            }
        },

        /**
         *
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        getAll:function(model,callback){
            var index=this.constructor.index;
            var modelIndex=_getModelIndex(model,index);
            var keyArray=modelIndex.keys;

            this.mget(keyArray,function(err,data){
                if(callback){
                    callback(err,data);
                }
            })

        },

        /**
         * returns the entire array store
         * @param callback {Function}
         * @public
         */
        list: function(callback){
            var store=this.constructor.store;
            if(callback){
                callback(null,store);
            }
        },

        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        post: function(params,model,callback){
            var id=utils.guid();
            params.id=id;
            this.set(id,params,model,function(err,data){
                if(callback){
                    callback(err,data);
                }
            });

        },

        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        put: function(params,model,callback){
            var id=params.id;
            this.set(id,params,model,function(err,data){
                if(callback){
                    callback(err,data);
                }
            });
        },




        /**
         *
         * @param key {String}
         * @param val {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        set: function (key, val, model, callback) {

            var store = this.constructor.store;
            var index = this.constructor.index;
            var err = null;
            //if object already exists, then we merge val with the old object to get a new object, delete the old object, insert the new object
            try {
                var obj=_validateKey(key,model, store,index);
                var oVal={};
                if(!obj){
                    oVal=val;
                }else{
                    oVal=_.extend(obj, val);

                }
                var cacheObj = {
                    key: key,
                    val: oVal
                };

                store.push(cacheObj);

                if (callback) {
                    callback(err, val);
                }
            } catch (ex) {
                if (callback) {
                    callback(ex, {});
                }
            }

        },

        /**
         *
         * @param pairArray {Array}
         * @param model {String}
         * @param fn {Function}
         * @returns fn
         * @public
         */
        mset: function (pairArray,model, fn) {
            var err = null;
            var vals = [];
            var self = this;
            try {
                var length = pairArray.length;
                if (length > 0 && length % 2 === 0) {
                    var list=_createObjectList(pairArray);
                    async.forEach(list, function (item, callback) {
                        self.set(item.key,item.val,model, function (err, val) {
                            if (!err) {
                                vals.push(val);
                                callback(); //inform async that the iterator has completed
                            } else {
                                throw new Error(err);
                            }

                        });

                    }, function (err) {
                        if (!err) {
                            if (fn) {
                                fn(err, vals);
                            }
                        } else {
                            if (fn) {
                                fn(err, []);
                            }
                        }

                    });
                } else {
                    if (fn) {
                        err={
                            statusCode:400,
                            message:'invalid keys'
                        };
                        fn(err, []);
                    }
                }
            } catch (ex) {
                if (fn) {
                    fn(ex, []);
                }
            }
        },

        /**
         *
         * @param key {String}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        remove: function (key,model, callback) {
            var store = this.constructor.store;
            var index=this.constructor.index;
            var err = null;

            try {
                _removeKeyFromIndex(key,model,index);
                _deleteKey(key, store);
                if (callback) {
                    callback(null);
                }
            } catch (ex) {
                if (callback) {
                    callback(ex);
                }
            }

        },



        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        delete: function(params,model,callback){
            var id=params.id;
            this.remove(id,model,function(err,data){
                if(callback){
                    callback(err,data);
                }
            });
        },



        flushModel:function(model,callback){
            var index = this.constructor.index;
            var modelIndex=_getModelIndex(model,index);
            try{
                if(!modelIndex){
                    if(callback){
                        return callback(null,null);
                    }
                }
                var keyArray=modelIndex.keys;
                for (var i = 0, max = keyArray.length; i < max; i++) {
                    var key=keyArray[i];
                    _deleteKey(key);
                }
                _removeModelIndex(model,index);
                if(callback){
                    callback(null,null);
                }
            }catch(ex){
                if(callback){
                    callback(err,null);
                }
            }


        },

        /**
         * clears the entire store and index
         * @param callback {Function}
         * @returns callback
         * @public
         */
        flushAll: function (callback) {
            var store = this.constructor.store;
            var index = this.constructor.index;
            var err = null;

            try {
                store.splice(0, store.length);
                index.splice(0, index.length);
                if (callback) {
                    callback(null);
                }
            } catch (ex) {
                if (callback) {
                    callback(ex);
                }
            }

        },

        /**
         *
         * @param callback {Function}
         * @returns callback
         * @public
         */
        length: function (callback) {
            var store = this.constructor.store;
            var err = null;

            try {
                var length = store.length;
                if (callback) {
                    callback(err, length);
                }
            } catch (ex) {
                if (callback) {
                    callback(ex, 0);
                }
            }

        },



        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        query: function(params,model,callback){
            throw new Error('query not implemented');
        },

        /**
         *
         * @param params {Object}
         * @param model {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        command: function(params,model,callback){
            throw new Error('command not implemented');
        }



    });

    /**
     *  validates a key against the store index
     *
     *  get model index
     *  if exists
     *    check if key exists,
     *    if key exists, delete object from store
     *     return obj
     *    else, insert key into index
     *     return null
     *  else
     *    create model index
     *    insert key
     *    return null
     *
     * @param key {String}
     * @param model {String}
     * @param store {Array}
     * @param index {Array}
     * @returns {Object}\null
     * @private
     */

    function _validateKey(key, model,store,index) {
        var obj=_getModelIndex(model,index);
        if(obj){
            if(_isModelIndexKey(key,obj)){
                return _deleteKey(key,store);
            }else{
                _insertModelIndexKey(key,obj);
                return null;
            }

        }else{
            _createModelIndex(key,model,index);
            return null;
        }

    }


    /**
     * get the model index
     * @param model {String}
     * @param index {Array}
     * @returns {Object}|null
     * @private
     */
    function _getModelIndex(model,index){
        var obj=null;
        for (var i = 0, max = index.length; i < max; i++) {
            if (index[i].model === model) {
                obj=index[i];
                break;
            }
        }
        return obj;
    }


    /**
     * is the key already indexed
     * @param key {String}
     * @param modelIndex {Object}
     * @returns {boolean}
     * @private
     */
    function _isModelIndexKey(key,modelIndex){
        var keyArray=modelIndex.keys;
        var exists=false;
        for (var i = 0, max = keyArray.length; i < max; i++) {
            if (keyArray[i] === key) {
                exists=true;
                break;
            }
        }
        return exists;
    }


    /**
     * insert a new modelIndex
     * @param key {String}
     * @param model {String}
     * @param index {Array}
     * @private
     */
    function _createModelIndex(key,model,index){
        var newModelIndex={};
        newModelIndex.model=model;
        newModelIndex.keys=[];
        newModelIndex.keys.push(key);
        index.push(newModelIndex);
    }


    /**
     * delete key/val pair object from the store
     * returns the deleted object
     * @param key {String}
     * @param store {Array}
     * @returns {Object}
     * @private
     */
    function _deleteKey(key, store) {
        var obj=null;
        for (var i = 0, max = store.length; i < max; i++) {
            if (store[i].key === key) {
                obj=store[i].val;
                store.splice(i, 1);
                break;
            }
        }

        return obj;
    }

    function _removeKeyFromIndex(key,model,index){
        var modelIndex=_getModelIndex(model,index);
        var keyArray=modelIndex.keys;
        for (var i = 0, max = keyArray.length; i < max; i++) {
            if (keyArray[i] === key) {
                keyArray.splice(i, 1);
                break;
            }
        }
    }

    /**
     * inserts key into the model index
     * @param key {String}
     * @param modelIndex {Object}
     * @private
     */
    function _insertModelIndexKey(key,modelIndex){
        var keyArray=modelIndex.keys;
        keyArray.push(key);
    }

    /**
     * remove the model index from the index
     * @param model {String}
     * @param index {Array}
     */
    function _removeModelIndex(model,index){
        for (var i = 0, max = index.length; i < max; i++) {
            if (index[i].model === model) {
                index.splice(i,1);
                break;
            }
        }
    }


    /**
     * create an array of objects from a pairArray
     * @param pairArray
     * @returns {Array}
     * @private
     */
    function _createObjectList(pairArray){
        var objArray=[];
        for (var i = 0, max = pairArray.length; i < max; i++) {
            if(i===0 || i%2===0){
                var obj={};
                obj.key=pairArray[i];
                var j=i+1;
                obj.val=pairArray[j];
                objArray.push(obj);
            }
        }

        return objArray;
    }



    return $memory;

}));



/*
 * =============================================================
 * elliptical.providers.$odata
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$odata = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$odata;
    }
}(this, function (elliptical) {

    var $odata=elliptical.Provider.extend({

        filter:function(endpoint,filter){
            var encodedFilter = '$filter=' + encodeURIComponent(filter);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedFilter : '?' + encodedFilter;
        },

        orderBy:function(endpoint,orderBy){
            var encodedOrderBy = '$orderby=' + encodeURIComponent(orderBy);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderBy : '?' + encodedOrderBy;
        },

        orderByDesc: function (endpoint, orderByDesc) {
            var encodedOrderByDesc = '$orderby=' + encodeURIComponent(orderByDesc + ' desc');
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderByDesc : '?' + encodedOrderByDesc;
        },

        top:function(endpoint,top){
            var encodedTop = '$top=' + top;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedTop : '?' + encodedTop;
        },

        skip:function(endpoint,skip){
            var encodedSkip = '$skip=' + skip;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedSkip : '?' + encodedSkip;
        },

        paginate:function(endpoint,params){
            var page=params.page,
                pageSize=params.pageSize,
                skip,
                encodedPaginate;

            if(typeof page==='undefined' || typeof pageSize==='undefined'){
                return endpoint;
            }else{
                page--;
                skip=page*pageSize;
                encodedPaginate=(skip > 0) ? '$skip=' + skip + '&$top=' + pageSize + '&$inlinecount=allpages' : '$top=' + pageSize + '&$inlinecount=allpages';
                return (endpoint.indexOf('?') > -1) ? '&' + encodedPaginate : '?' + encodedPaginate;
            }
        }

    },{});

    return $odata;


}));



/*
 * =============================================================
 * elliptical.providers.$pagination
 * =============================================================
 * returns a pagination ui context(object) for template binding
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$pagination=factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$pagination;
    }
}(this, function (elliptical) {
    /**
     * @param paginate {Object}
     * @param pagination {Object}
     * @param data {Object}
     * @returns {Object}
     */

    var $pagination=elliptical.Provider.extend({
        count:'count',
        data:'data',
        spread:10,

         get:function(params,data){

             var count_=this.count;
             var data_=this.data;
             var spread_=this.spread;

             if(params.paginate){
                 var filter=params.filter;
                 var orderBy=params.orderBy;
                 params=params.paginate;
                 if(filter !== undefined){
                     params.filter=filter;
                 }
                 if(orderBy !== undefined){
                     params.orderBy=orderBy;
                 }
;             }

             return _pagination(params,data);

             /**
              *
              * @param params {Object}
              * @param result {Object}
              *
              * @returns {Object}
              * @qpi private
              */
             function _pagination(params,result) {
                 var baseUrl,page,count,pageSize,pageSpread,data;
                 baseUrl=params.baseUrl;
                 page=params.page;

                 count=result[count_];
                 data=result[data_];

                 pageSize=params.pageSize;
                 pageSpread=spread_;
                 try {
                     page = parseInt(page);
                 } catch (ex) {
                     page = 1;
                 }

                 var pageCount = parseInt(count / pageSize);
                 var remainder=count % pageSize;
                 if(pageCount < 1){
                     pageCount=1;
                 }else if(remainder > 0){
                     pageCount++;
                 }

                 //pagination object
                 var pagination = {
                     page: page,
                     pageCount: pageCount,
                     prevPage: baseUrl,
                     prevClass: 'hide',
                     nextPage: baseUrl,
                     nextClass: 'hide',
                     pages: [],
                     count:count

                 };
                 //assign pagination properties
                 //prev
                 if (page > 1) {
                     pagination.prevClass = '';
                     pagination.prevPage = assignUrl(baseUrl,parseInt(page - 1),params);
                 }
                 //next
                 if (page < pageCount) {
                     pagination.nextClass = '';
                     pagination.nextPage = assignUrl(baseUrl,parseInt(page + 1),params);
                 }

                 //get page links

                 if (pageCount > 1) {
                     pagination.pages = _pageLinks(baseUrl, page, pageCount,pageSpread,params);

                 }

                 return{
                     pagination:pagination,
                     data:data
                 };

             }


             /**
              *
              * @param baseUrl {String}
              * @param page {Number}
              * @param pageCount {Number}
              * @param pageSpread {Number}
              * @returns {Array}
              * @api private
              */
             function _pageLinks(baseUrl, page, pageCount,pageSpread,params) {
                 var pages = [];
                 if (pageSpread > pageCount) {
                     pageSpread = pageCount;
                 }

                 if (page <= pageSpread) {

                     for (var i = 0; i < pageSpread; i++) {
                         var obj = {
                             page: i + 1,
                             pageUrl:assignUrl(baseUrl,parseInt(i + 1),params)
                         };

                         if (i === parseInt(page - 1)) {
                             obj.activePage = 'active';
                         }
                         pages.push(obj);
                     }
                     return pages;
                 } else {
                     var halfSpread = parseInt(pageSpread / 2);
                     var beginPage, endPage;
                     if (pageCount < page + halfSpread) {
                         endPage = pageCount;
                         beginPage = endPage - pageSpread;
                     } else {
                         endPage = page + halfSpread;
                         beginPage = page - halfSpread;
                     }
                     for (var i = beginPage; i < endPage + 1; i++) {
                         var obj = {
                             page: i,
                             pageUrl:assignUrl(baseUrl,i,params)
                         };
                         if (i === page) {
                             obj.activePage = 'active';
                         }
                         pages.push(obj);
                     }
                     return pages;
                 }
             }

             function assignUrl(baseUrl,index,params){
                 var isFiltered=false;
                 var pageUrl=baseUrl + '/' + index;
                 if(params.filter){
                     isFiltered=true;
                     pageUrl+='?' + '$filter=' + encodeURIComponent(params.filter);
                 }
                 if(params.orderBy){
                     pageUrl+=(isFiltered) ? '&$orderby=' + encodeURIComponent(params.orderBy) : '?$orderby=' + encodeURIComponent(params.orderBy);
                 }

                 return pageUrl;
             }

         }


    },{});


    return $pagination;


}));


/*
 * =============================================================
 * elliptical.providers.$rest
 * =============================================================
 * rest provider
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-http'),require('../odata/odata'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-http','../odata/odata'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$rest = factory(root.elliptical,root.elliptical.http,root.elliptical.providers.$odata);
        root.returnExports = root.elliptical.providers.$rest;
    }
}(this, function (elliptical,http,odata) {
    var factory=elliptical.factory;
    var async=elliptical.async || window.async;
    var utils = elliptical.utils;
    var $rest=elliptical.Provider.extend({
        _data:null,
        port: null,
        path: null,
        host: null,
        protocol:null,
        $queryProvider:odata,
        onSend: null,

        /**
         * constructor
         * @param opts {Object}
         * @param $queryProvider {Object}
         */
        init:function(opts,$queryProvider){
            this.host=opts.host || 'locahost';
            this.port = opts.port || 80;
            this.path = opts.path || '/api';
            this.protocol=opts.protocol || 'http';

            if($queryProvider !== undefined){
                this.$queryProvider=$queryProvider;
            }
        },

        /**
         * http get
         * @param params {Object}
         * @param resource {String}
         * @param query {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        get: function (params, resource, query,callback) {
            if(typeof query ==='function'){
                callback=query;


            }

            var options=this._getOptions(resource,'GET',undefined);

            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q+='?' + key + '=' + val;
                        i++;
                    } else {
                        q+='&' + key + '=' + val;
                    }
                }
            }
            if (q !== '') {
                options.path+='/' + q;
            }

            //test query options
            if(typeof query.filter !== 'undefined'){
                options.path += this.$queryProvider.filter(options.path,query.filter);
            }

            if(typeof query.orderBy !== 'undefined'){
                options.path += this.$queryProvider.orderBy(options.path,query.orderBy);
            }

            if (typeof query.orderByDesc !== 'undefined') {
                options.path += this.$queryProvider.orderByDesc(options.path, query.orderByDesc);
            }

            if(typeof query.paginate !== 'undefined'){
                options.path += this.$queryProvider.paginate(options.path,query.paginate);
            }else{
                //don't allow mixing of paginate with skip/top since paginate is more or less a convenience wrapper for skip & top
                if(typeof query.skip !== 'undefined'){
                    options.path += this.$queryProvider.skip(options.path,query.skip);
                }

                if(typeof query.top !== 'undefined'){
                    options.path += this.$queryProvider.top(options.path,query.top);
                }
            }

            //send
            this._send(options,resource,callback);

        },

        /**
         * http post
         * @param params {Object}
         * @param resource {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        post: function (params, resource, callback) {
            var options = this._getOptions(resource,'POST',params);
            this._send(options,resource,callback);

        },

        /**
         * non-standard http implementation of a "merge"
         * @param params {Object}
         * @param resource {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        patch: function (params, resource, callback) {
            throw new Error('patch not implemented');
        },


        /**
         * http put
         * @param params {Object}
         * @param resource {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        put: function (params, resource,callback) {
            var options = this._getOptions(resource,'PUT',params);
            this._send(options,resource,callback);
        },


        /**
         * http delete
         * @param params {Object}
         * @param resource {String}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        delete: function (params, resource, callback) {
            var options=this._getOptions(resource,'DELETE',undefined);
            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q+= '?' + key + '=' + val;
                        i++;
                    } else {
                        q+='&' + key + '=' + val;
                    }
                }
            }
            if (q != '') {
                options.path+= '/' + q;
            }
            //send
            this._send(options,resource,callback);
        },



        /**
         * non-standard http implementation of a sql query
         * @param params {Object}
         * @param resource {String}
         * @param opts {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        query: function (params, resource,opts, callback) {
            throw new Error('query not implemented');
        },


        /**
         * non-standard http implementation of a sql command
         * @param params {Object}
         * @param resource {String}
         * @param opts {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        command: function (params, resource,opts, callback) {
            throw new Error('command not implemented');
        },


        /**
         * send the request
         * @param options {Object}
         * @param resource {String}
         * @param callback {Function}
         * @returns callback
         * @private
         */
        _send:function(options,resource,callback){

            /* we asynchronously pass through to _onAuthenticate and _onSend(if a callback has been defined)
               using the async waterfall pattern before passing off to http.
               Note: _onAuthenticate should be implemented by extending the $rest provider and overwriting the current
               method which does nothing but pass through. You can also implement authentication by relying on the _onSend
               callback, which does pass up the request object, if available.
               ex:
                  $myRestProvider.onSend=function(req, options, resource,callback){
                      options.authorization=http.encodeSessionToken(req.cookies.authToken);
                      callback.call(this,null,options);
                  };

                  pass the options object back as the data param in the callback
             */
            var req=this.req || {};
            var funcArray=[];
            var onAuth=factory.partial(this._onAuthentication,options,resource).bind(this);
            funcArray.push(onAuth);
            if(typeof this.onSend==='function'){
                var onSendCallback=this.onSend;
                var onSend=factory.partial(this._onSend,onSendCallback,req,resource).bind(this);
                funcArray.push(onSend);
            }
            async.waterfall(funcArray,function(err,result){
                (err) ? callback(err,null) : http.send(result,callback);
            });

        },

        /**
         * set authorization/authentication on the request; implement by extending the $rest provider and class
         * and overwriting the method, returning options in the callback
         * @param options {Object}
         * @param resource {String}
         * @param callback {Function}
         * @private
         */
        _onAuthentication:function(options,resource,callback){
            if(callback){
                callback.call(this,null,options);
            }
        },


        /**
         * calls an onSend provided callback, if defined
         * @param fn {Function}
         * @param req {Object}
         * @param resource {String}
         * @param options {Object}
         * @param callback {Function}
         * @private
         */
        _onSend: function (fn,req,resource,options,callback) {
            fn.call(this,req, options, resource, callback);
        },

        /**
         * constructs the request options object
         * @param method {String}
         * @param resource {String}
         * @param data {Object}
         * @returns {Object}
         * @private
         */
        _getOptions:function(resource,method,data){
            var options = {};
            options.host = this.host;
            options.port = this.port;
            options.method = method;
            options.path = this.path;
            resource = (utils.strFirstChar(resource) === '/') ? resource : '/' + resource;
            options.path = options.path +  resource;
            options.protocol=this.protocol;
            if(data && data !==undefined){
                options.data=data;
            }
            return options;
        }


    });



    return $rest;

}));





/*
 * =============================================================
 * elliptical.providers.session.$cookie
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('../cookie/cookie'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','../cookie/cookie'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.session=root.elliptical.providers.session || {};
        root.elliptical.providers.session.$cookie = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.session.$cookie;
    }
}(this, function (elliptical) {

    var $cookie=elliptical.Provider.extend({
        key:'sessionStore',

        /**
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */

        get:function(params,callback){
            var key=(params.key===undefined) ? this.key : params.key;
            var session=$.cookie(key);
            session=(typeof session !== 'undefined') ? JSON.parse(session) : {};
            if(callback){
                return callback(null,session);
            }else{
                return session;
            }
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */
        put:function(params,callback){
            var key=(params.key===undefined) ? this.key : params.key;
            var session=(typeof params.session==='object') ? JSON.stringify(params.session) : params.session;
            $.cookie(key, session, {path:'/'});
            if(callback){
                callback(null,session);
            }else{
                return session;
            }
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         * @returns {*}
         */
        delete:function(params,callback){
            var key=(params.key===undefined) ? this.key : params.key;
            $.removeCookie(key);
            if(callback){
                callback(null,null);
            }
        },

        $setKey:function(key){
            this.key=key;
        }

    },{});



    return $cookie;

}));


/*
 * =============================================================
 * elliptical.providers.session.$local
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.session=root.elliptical.providers.session || {};
        root.elliptical.providers.session.$local = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.session.$local;
    }
}(this, function (elliptical) {

    var $local=elliptical.Provider.extend({
        key:'sessionStore',

        /**
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */
        get:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            var session=localStorage.getItem(key);
            try{
                session=JSON.parse(session);
            }catch(ex){
                session={};
            }

            if(callback){
                callback(null,session);
            }else{
                return session;
            }
        },

        /**
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */
        put:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            var session=(typeof params.session==='object') ? JSON.stringify(params.session) : params.session;
            localStorage.setItem(key,session);
            if(callback){
                callback(null,session);
            }else{
                return session;
            }
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         * @returns {*}
         */
        delete:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            localStorage.removeItem(key);
            if(callback){
                callback(null,null);
            }
        },

        $setKey:function(key){
            this.key=key;
        }


    },{});



    return $local;

}));




/*
 * =============================================================
 * elliptical.providers.session.$storage
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.session=root.elliptical.providers.session || {};
        root.elliptical.providers.session.$storage = factory(root.elliptical);
        root.returnExports = root.elliptical.providers.session.$storage;
    }
}(this, function (elliptical) {

    var $storage=elliptical.Provider.extend({
        key:'sessionStore',

        /**
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */
        get:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            var session=sessionStorage.getItem(key);
            try{
                session=JSON.parse(session);
            }catch(ex){
                session={};
            }

            if(callback){
                callback(null,session);
            }else{
                return session;
            }
        },

        /**
         * @param params {Object}
         * @param callback {Function}
         * @returns {Object}
         */
        put:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            var session=(typeof params.session==='object') ? JSON.stringify(params.session) : params.session;
            sessionStorage.setItem(key,session);
            if(callback){
                callback(null,session);
            }else{
                return session;
            }
        },

        /**
         *
         * @param params {Object}
         * @param callback {String}
         * @returns {*}
         */
        delete:function(params,callback){
            var key=(params===undefined || params.key===undefined) ? this.key : params.key;
            sessionStorage.removeItem(key);
            if(callback){
                callback(null,null);
            }
        },

        $setKey:function(key){
            this.key=key;
        }


    },{});



    return $storage;

}));



/*
 * =============================================================
 * elliptical.providers.$template
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-utils'),require('elliptical-dustjs'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-utils','elliptical-dustjs'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$template = factory(root.elliptical,root.elliptical.utils,dust);
        root.returnExports = root.elliptical.providers.$template;
    }
}(this, function (elliptical,utils,dust) {

    var _=utils._;
    dust.optimizers.format = function (ctx, node) {
        return node;
    };

    var $template=elliptical.Provider.extend({
        _data: {},

        $store: null,

        base: {
            server: 'base',
            client: 'base-client'
        },

        $provider: dust,

        compile: dust.compile,

        cache: dust.cache,

        model: 'template',

        api: '/api/template',

        namespace:null,


        /**
         *
         * @returns {String}
         * @public
         */
        getBase: function () {
            return (utils.isBrowser()) ? this.base.client : this.base.server;

        },

        /**
         *
         * @param opts {Object}
         */
        $setOpts: function(opts){
            if(opts){
                if(typeof opts.model !== 'undefined'){
                    this.model=opts.model;
                }
                if(typeof opts.api !== 'undefined'){
                    this.api=opts.api;
                }
                if(typeof opts.base !== 'undefined'){
                    this.base=opts.base;
                }
            }
        },

        $setProvider:function($provider){
            this.$provider=$provider;

        },

        /**
         *
         * @param template {String}
         * @param context {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        render: function (template, context, callback) {
            var $provider=this.$provider;
            var cache=$provider.cache;

            if (_.isEmpty(cache)){
                _loadTemplateCacheFromStore(this.model,this.$store,this.$provider,this.api,function(){
                    $provider.render(template,context,function(err,out){
                        if(callback){
                            callback(err,out);
                        }
                    });
                });
            }else{
                $provider.render(template,context,function(err,out){
                    if(callback){
                        callback(err,out);
                    }
                });
            }
        },

        /**
         * set the provider as a global to the window object
         * on the browser side, if compiled templates are referenced in script tag, you'll need to set
         * a reference to dust on the window object
         */
        setBrowserGlobal:function(){
            if(typeof window != 'undefined'){
                window.dust=this.$provider;
            }
        }

    },{
        /**
         * new instance init
         * @param base {boolean}
         */
        init: function (base) {
            if (base) {
                this.constructor._data.base = true;
            }
        },

        /**
         * renders with a context base
         * use render method on template provider's prototype to mixin a base context
         *
         * @param template {String}
         * @param context {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        render: function (template, context, callback) {

            if (this.constructor._data.base) {
                var baseRender = {
                    render: this.constructor.getBase()
                };
                var base = this.constructor.$provider.makeBase(baseRender);
                context=base.push(context);
            }

            this.constructor.render(template,context,function(err,out){
                if(callback){
                    callback(err,out);
                }
            });
        }
    });

    /**
     * if template cache is empty, load it from the store or client-side, load it from scripts
     * @param model {String}
     * @param $store {Object}
     * @param $provider {Object}
     * @param api {String}
     * @param callback {Function}
     * @private
     */
    function _loadTemplateCacheFromStore(model, $store, $provider, api, callback) {
        if(!utils.isBrowser()){
            $store.getAll(model,function(err,data){
                for(var i= 0, max=data.length;i<max;i++){
                    var obj=JSON.parse(data[i]);
                    dust.loadSource(obj);
                }
                callback();
            });


        }else{

            //continue to query at intervals for cache to load from script
            var iterations=0;
            var process=new elliptical.Interval({
                delay:10
            });
            process.run(function(){
                checkCache($provider,process,iterations,callback);
            })
        }
    }

    function checkCache($provider,process,iterations,callback){
        var cache=$provider.cache;
        if(!utils._.isEmpty(cache)){
            process.terminate();
            if(callback){
                callback();
            }
        }else{
            if(iterations > 1000){
                process.terminate();
                if(callback){
                    callback();
                }
            }else{
                iterations++;
            }
        }
    }


    return $template;

}));


/*
 * =============================================================
 * elliptical.providers.$transitions
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        if(typeof window !=='undefined'){
            module.exports = factory(require('elliptical-mvc'),require('ellipsis-animation'));
        }

    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','ellipsis-animation'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$transitions=factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$transitions;
    }
}(this, function (elliptical) {
    var _selector='[data-placeholder="content"]';
    if($('html').hasClass('customelements')){
        //_selector='ui-content-placeholder';
    }

    var Transitions=elliptical.Provider.extend({

        render:function(selector,html,transition,callback){
            var element=$(selector);

            if(transition !== 'none'){
                _transitionOut(function(){
                    element.html(html);
                    element.show();
                    _transitionIn(function(){

                    })
                });

            }else{
                element.html(html);
                if(callback){
                    callback.call(this);
                }
            }



            function _transitionOut(callback){
                var opts = {};
                opts.duration=300;
                opts.preset='fadeOut';

                element.transition(opts, function () {
                    callback.call(element[ 0 ]);

                });
            }

            function _transitionIn(callback){
                var opts = {};
                opts.duration=300;
                opts.preset=transition;
                var element_=$(_selector);
                element_.transition(opts, function () {
                    callback.call(element_[ 0 ]);

                });
            }
        }


    },{});

    return Transitions;
}));


/*
 * =============================================================
 * elliptical.providers.$validation
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.providers=root.elliptical.providers || {};
        root.elliptical.providers.$validation=factory(root.elliptical);
        root.returnExports = root.elliptical.providers.$validation;
    }
}(this, function (elliptical) {
    var utils = elliptical.utils;
    var $validation=elliptical.Provider.extend({

        schemas:[],

        submitLabel:'submitLabel',

        successMessage:'Successfully Submitted...',

        post: function (form,name,callback) {
            var err = null;
            var schema = this.getSchema(name);
            for (var key in schema) {
                if (schema.hasOwnProperty(key)) {
                    if (schema[key].required && (typeof form[key] === 'undefined' || form[key] === '')) {
                        form[key + '_placeholder'] = utils.camelCaseToSpacedTitleCase(key) + ' Required...';
                        form[key + '_error'] = 'error';
                        if(!err){
                            err=this.error();
                        }
                    } else if (schema[key].validate && typeof schema[key].validate==='function') {
                        var msg=schema[key].validate(form);
                        if(msg){
                            form[key + '_placeholder'] = msg;
                            form[key + '_error'] = 'error';
                            form[key] = '';
                            if(!err){
                                err=this.error();
                            }
                        }
                    } else if(schema[key].confirm){
                        if(form[key] && form['confirm' + key]){
                            if(form[key] != form['confirm' + key]){
                                form[key + '_placeholder'] = 'Does Not Match...';
                                form[key + '_error'] = 'error';
                                form['confirm' + key + '_placeholder'] = 'Does Not Match...';
                                form['confirm' + key + '_error'] = 'error';
                                if(!err){
                                    err=this.error();
                                }
                            }
                        }
                    } else if(key==='validate' && typeof schema[key]==='function') {
                        var msg=schema['validate'](form);
                        if (msg) {
                            err = this.error(msg);

                        }
                    }
                }
            }
            if(err){
                form=this.addSubmitLabel(form,false);
                callback(err,form);
            }else{
                form=this.deleteProperties(form);
                callback(null,form);
            }


        },

        put: function(schema,name,callback){
            var obj = {
                name: name,
                schema: schema
            };

            var schemas = this.schemas;
            schemas.push(obj);
            if (callback) {
                callback(null, obj);
            }
        },

        onError:function(form,msg){
            form=this.addSubmitLabel(form,msg,false);
            return form;
        },

        onSuccess:function(form){
            form=this.addEmptySubmitLabel(form);
            return form;
        },

        getSchema: function (name) {
            var schema = null;
            for (var i = 0; i < this.schemas.length; i++) {
                if (this.schemas[i].name.toLowerCase() === name.toLowerCase()) {
                    schema = this.schemas[i].schema;
                    break;
                }
            }
            return schema;
        },

        error:function(msg){
            if(typeof msg==='undefined'){
                msg='Form Submission Error';
            }
            var err={};
            err.message=msg;
            err.css='error';
            err.cssDisplay='visible';
            return err;
        },

        addSubmitLabel:function(form,msg,valid){
            if(typeof valid==='undefined'){
                valid=msg;
                msg=undefined;
            }
            var obj;
            if(valid){
                obj=this.success();
            }else{
                obj=this.error(msg);
            }
            form[this.submitLabel]=obj;
            return form;
        },

        addEmptySubmitLabel:function(form){
            form[this.submitLabel]=this.emptyLabelObject();
            return form;
        },

        success:function(){
            var msg={};
            msg.message=this.successMessage;
            msg.css='success';
            msg.cssDisplay='visible';
            return msg;
        },

        emptyLabelObject:function(){
            var msg={};
            msg.message='&nbsp;';
            msg.css='';
            msg.cssDisplay='';
            return msg;
        },

        deleteProperties:function(form){
            for (var key in form) {
                if (form.hasOwnProperty(key)) {
                    if(form['confirm' + key]){
                        delete form['confirm' + key];
                    }
                    if(form['confirm' + key + '_placeholder']){
                        delete form['confirm' + key + '_placeholder'];
                    }
                    if(form['confirm' + key + '_error']){
                        delete form['confirm' + key + '_error'];
                    }
                    if(form[key + '_placeholder']){
                        delete form[key + '_placeholder'];
                    }
                    if(form[key + '_error']){
                        delete form[key + '_error'];
                    }
                }
            }

            return form;
        }

    },{});

    return $validation;
}));



/*
 * =============================================================
 * elliptical.services.Cookie
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-providers'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-providers'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Cookie=factory(root.elliptical,root.elliptical.providers);
        root.returnExports = root.elliptical.services.Cookie;
    }
}(this, function (elliptical,providers) {

    var $cookie=providers.$cookie;
    var Cookie=elliptical.Service.extend({
        '@resource':'Cookie', //{String}
        $provider:$cookie,

        get:function(key){
            return this.$provider.get(key);
        },

        post:function(params){
            return this.$provider.post(params);
        },

        put:function(params){
            return this.$provider.put(params);
        },

        delete:function(key){
            return this.$provider.delete(key);
        }



    },{});

    return Cookie;



}));
/*
 * =============================================================
 * elliptical.services.Identity
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-providers'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-providers'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Identity=factory(root.elliptical,root.elliptical.providers);
        root.returnExports = root.elliptical.services.Identity;
    }
}(this, function (elliptical,providers) {

    var $identity=providers.$identity;

    var Identity=elliptical.Service.extend({
        '@resource':'Identity', //{String}
        $provider:$identity,

        on:function(token,profile,callback){
            this.$provider.on(token,profile,callback);
        },

        off:function(callback){
            this.$provider.off(callback);
        },

        setKeys:function(params){
            this.$provider.setKeys(params);
        }


    },{});

    return Identity;



}));

/*
 * =============================================================
 * elliptical.services.Log
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Log=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Log;
    }
}(this, function (elliptical) {

    var Log=elliptical.Service.extend({
        '@resource':'Log' //{String}



    },{});

    return Log;



}));

/*
 * =============================================================
 * elliptical.services.Membership
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Membership=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Membership;
    }
}(this, function (elliptical) {


    var Membership = elliptical.Service.extend({
        '@resource':'Membership', //{String}


        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        login: function(params,callback){
            if(!this.$provider.login){
                throw new Error('login method not implemented');
            }
            this.$provider.login(params,callback);
        },

        authenticate:function(params,callback){
            if(!this.$provider.authenticate){
                throw new Error('authenticate method not implemented');
            }
            this.$provider.authenticate(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        resetPassword: function(params,callback){
            if(!this.$provider.resetPassword){
                throw new Error('resetPassword method not implemented');
            }
            this.$provider.resetPassword(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        changePassword: function(params,callback){
            if(!this.$provider.changePassword){
                throw new Error('changePassword method not implemented');
            }
            this.$provider.changePassword(params,callback);
        },

        /**
         *
         * @param callback {Function}
         */
        logout: function(callback){
            if(!this.$provider.logout){
                throw new Error('logout method not implemented');
            }
            this.$provider.logout(callback);
        },

        /**
         * @param params {Object}
         * @param callback {Function}
         */
        signUp: function(params,callback){
            if(!this.$provider.signUp){
                throw new Error('signUp method not implemented');
            }
            this.$provider.signUp(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        roleExists: function(params,callback){
            if(!this.$provider.roleExists){
                throw new Error('roleExists method not implemented');
            }
            this.$provider.roleExists(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        isUserInRole: function(params,callback){
            if(!this.$provider.isUserInRole){
                throw new Error('isUserInRole method not implemented');
            }
            this.$provider.isUserInRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        isUserInRoles: function(params,callback){
            if(!this.$provider.isUserInRoles){
                throw new Error('isUserInRoles method not implemented');
            }
            this.$provider.isUserInRoles(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        getRolesForUser: function(params,callback){
            if(!this.$provider.getRolesForUser){
                throw new Error('getRolesForUser method not implemented');
            }
            this.$provider.getRolesForUser(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        addUserToRole: function(params,callback){
            if(!this.$provider.addUserToRole){
                throw new Error('addUserToRoles method not implemented');
            }
            this.$provider.addUserToRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        removeUserFromRole: function(params,callback){
            if(!this.$provider.removeUserFromRole){
                throw new Error('removeUserFromRoles method not implemented');
            }
            this.$provider.removeUserFromRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        getUsersInRole: function(params,callback){
            if(!this.$provider.getUsersInRole){
                throw new Error('getUsersInRole method not implemented');
            }
            this.$provider.getUsersInRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        createRole: function(params,callback){
            if(!this.$provider.createRole){
                throw new Error('createRole method not implemented');
            }
            this.$provider.createRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        deleteRole: function(params,callback){
            if(!this.$provider.deleteRole){
                throw new Error('deleteRole method not implemented');
            }
            this.$provider.deleteRole(params,callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        isAuthenticated: function(params,callback){
            if(!this.$provider.isAuthenticated){
                throw new Error('isAuthenticated method not implemented');
            }
            if(params===undefined && callback===undefined){
                return this.$provider.isAuthenticated(params,callback);
            }else{
                this.$provider.isAuthenticated(params,callback);
            }
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        profile: function(params,callback){
            if(!this.$provider.profile){
                throw new Error('profile method not implemented');
            }
            this.$provider.profile(params,callback);
        }



    },{

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        login: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.login(data, callback);
        },

        /**
         *
         * @param params {object}
         * @param callback {Function}
         */
        signUp:function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.signUp(data, callback);
        },

        /**
         *
         *
         * @param callback {Function}
         */
        logout: function(callback){
            this.constructor.logout(callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        roleExists: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.roleExists(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        isUserInRole: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.isUserInRole(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        isUserInRoles: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.isUserInRoles(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        getRolesForUser: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.getRolesForUser(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        addUserToRoles: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.addUserToRoles(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        removeUserFromRoles: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.removeUserFromRoles(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        getUsersInRole: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.getUsersInRole(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        createRole: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.createRole(data, callback);
        },

        /**
         *
         * @param params {Object}
         * @param callback {Function}
         */
        deleteRole: function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.deleteRole(data, callback);
        },

        profile:function(params,callback){
            var data = this._data;
            (typeof params==='function') ? callback=params : data=params;
            this.constructor.profile(data, callback);
        }

    });

    return Membership;


}));


/*
 * =============================================================
 * elliptical.services.Message
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Message=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Message;
    }
}(this, function (elliptical) {

    var Message=elliptical.Service.extend({
        '@resource':'Message' //{String}



    },{});

    return Message;



}));

/*
 * =============================================================
 * elliptical.services.Role
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Role=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Role;
    }
}(this, function (elliptical) {

    var Role=elliptical.Service.extend({
        '@resource':'Role' //{String}



    },{});

    return Role;



}));

/*
 * =============================================================
 * elliptical.services.Schema
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Schema=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Schema;
    }
}(this, function (elliptical) {

    var Schema=elliptical.Service.extend({
        '@resource':'Schema' //{String}



    },{});

    return Schema;



}));

/*
 * =============================================================
 * elliptical.services.Session
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Session=factory(root.elliptical);
        root.returnExports = root.elliptical.services.Session;
    }
}(this, function (elliptical) {


    var Session=elliptical.Service.extend({
        '@resource':'Session', //{String}

        get:function(params,callback) {
            return this.$provider.get(params,callback);
        },

        put:function(params,callback){
            return this.$provider.put(params,callback);
        },

        delete:function(params,callback){
            return this.$provider.delete(params,callback);
        }


    },{

        init:function($provider){
            ($provider!==undefined) ? this.$provider=$provider : this.$provider=null;

        },

        get:function(params,callback) {
            var $provider=(this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.get(params,callback);
        },

        put:function(params,callback){
            var $provider=(this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.put(params,callback);
        },

        delete:function(params,callback){
            var $provider=(this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.delete(params,callback);
        }


    });

    return Session;


}));

/*
 * =============================================================
 * elliptical.services.Validation
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-providers'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-providers'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.services=root.elliptical.services || {};
        root.elliptical.services.Validation=factory(root.elliptical,root.elliptical.providers);
        root.returnExports = root.elliptical.services.Validation;
    }
}(this, function (elliptical,providers) {
    var $validation=providers.$validation;

    var Validation=elliptical.Service.extend({
        '@resource':'Validation', //{String},
        $provider:$validation,
        schemas:null,

        /**
         *
         * @param data {Object}
         * @param name {String}
         * @param callback {Function}
         */
        post: function (data, name, callback) {
            if (this.schemas && !this.$provider.schemas) {
                this.$provider.schemas = this.schemas;
            }
            this.$provider.post(data,name,callback);
        },

        put: function (data, name, callback) {
            if (this.schemas && !this.$provider.schemas) {
                this.$provider.schemas = this.schemas;
            }
            this.$provider.put(data, name, callback);
        },

        /**
         *
         * @param data {Object}
         * @returns {Object}
         */
        onSuccess:function(data){
            return this.$provider.onSuccess(data);
        },

        /**
         *
         * @param data {Object}
         * @param msg {String}
         * @returns {Object}
         */
        onError:function(data,msg){
            return this.$provider.onError(data,msg);
        }



    }, {
        init: function ($provider) {
            ($provider !== undefined) ? this.$provider = $provider : this.$provider = null;

        },

        post: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !this.$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.post(data, name, callback);
        },

        put: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.put(data, name, callback);
        },

        /**
        *
        * @param data {Object}
        * @returns {Object}
        */
        onSuccess: function (data) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onSuccess(data);
        },

        /**
         *
         * @param data {Object}
         * @param msg {String}
         * @returns {Object}
         */
        onError: function (data, msg) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onError(data, msg);
        }

    });

    return Validation;



}));



/*
 * =============================================================
 * elliptical-delegate
 * =============================================================
 *
 * dependencies:
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-event'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-event'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Delegate = factory(root.elliptical,root.elliptical.Event);
        root.returnExports = root.elliptical.Delegate;
    }
}(this, function (elliptical,Event) {

    var Delegate=elliptical.Class.extend({
        bindings:null,

        init:function(bindings){
            this.bindings=bindings;

        },

        on:function(){
            var bindings=this.bindings;
            if(bindings && bindings.length){
                bindings.forEach(function(binding){
                    var eventName=binding.event;
                    var name=binding.delegate;
                    _bind(eventName,name);
                });
            }

            function _bind(eventName,name){
                $(document).on(eventName, '[delegate="'+ name +'"]', function (event) {
                    if (_validTarget(eventName,'delegate-target')) {
                        _handleEvent(event);
                    }

                });

                $(document).on(eventName, '[data-delegate="'+ name +'"]', function (event) {
                    if (_validTarget(event,'data-delegate-target')) {
                        _handleEvent(event);
                    }

                });
            }

            function _validTarget(event,attr){
                if(event.target===event.currentTarget){
                    return true;
                }else{
                    return ($(event.currentTarget).attr(attr)!==undefined);
                }
            }

            function _handleEvent(event) {
                var target = $(event.currentTarget);
                var evt,channel,camelCase;
                camelCase=false;
                if(target.attr('event')){
                    evt=target.attr('event');
                }else{
                    evt=target.attr('data-event');
                }
                if(target.attr('channel')){
                    channel=target.attr('channel');
                }else{
                    channel=target.attr('data-channel');
                }
                if(target.attr('camel-case')){
                    camelCase=target.attr('camel-case');
                }else if(target.attr('data-camel-case')){
                    camelCase=target.attr('data-camel-case');
                }

                /* pass the element attributes as the event data */
                var opts= $.element.getOpts(target[0],camelCase);
                //delete props channel and delegate-event
                if(opts.channel){
                    delete opts.channel;
                }
                if(opts.event){
                    delete opts.event;
                }
                if(opts.delegate){
                    delete opts.delegate;
                }
                if(opts.camelCase){
                    delete opts.camelCase;
                }

                opts.target=target[0];
                if (typeof channel !== 'undefined' && evt !== 'sync') {
                    Event.emit(channel + '.' + evt, opts);
                }
            }
        },

        off:function(){
            var bindings=this.bindings;
            if(bindings && bindings.length){
                bindings.forEach(function(binding){
                    var eventName=binding.event;
                    var name=binding.delegate;
                    _unbind(eventName,name);
                });
            }

            function _unbind(eventName,name){
                $(document).off(event, '[delegate="'+ name +'"]');
                $(document).on(eventName, '[data-delegate="'+ name +'"]');
            }
        }

    });

    return Delegate;


}));


/*
 Tested against Chromium build with Object.observe and acts EXACTLY the same,
 though Chromium build is MUCH faster

 Trying to stay as close to the spec as possible,
 this is a work in progress, feel free to comment/update

 Specification:
 http://wiki.ecmascript.org/doku.php?id=harmony:observe

 Built using parts of:
 https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js

 Limits so far;
 Built using polling... Will update again with polling/getter&setters to make things better at some point

 TODO:
 Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
 */


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    if(!Object.observe){
        (function(extend, global){
            "use strict";


            var isCallable = (function(toString){
                var s = toString.call(toString),
                    u = typeof u;
                return typeof global.alert === "object" ?
                    function isCallable(f){
                        return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
                    }:
                    function isCallable(f){
                        return s === toString.call(f);
                    }
                    ;
            })(extend.prototype.toString);
            // isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
            //Returns true if it is a DOM node
            var isNode = function isNode(o){
                return (
                        typeof Node === "object" ? o instanceof Node :
                    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
                    );
            };
            //Returns true if it is a DOM element
            var isElement = function isElement(o){
                return (
                        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
                    );
            };
            var _doCheckCallback=function(f){
                setTimeout(f, 10);
            };
            var _clearCheckCallback=function(id){
                clearTimeout(id);
            };
            var isNumeric=function isNumeric(n){
                return !isNaN(parseFloat(n)) && isFinite(n);
            };
            var sameValue = function sameValue(x, y){
                if(x===y){
                    return x !== 0 || 1 / x === 1 / y;
                }
                return x !== x && y !== y;
            };
            var isAccessorDescriptor = function isAccessorDescriptor(desc){
                if (typeof(desc) === 'undefined'){
                    return false;
                }
                return ('get' in desc || 'set' in desc);
            };
            var isDataDescriptor = function isDataDescriptor(desc){
                if (typeof(desc) === 'undefined'){
                    return false;
                }
                return ('value' in desc || 'writable' in desc);
            };

            var inArray=function(arr,val){
                var bool=false;
                arr.forEach(function(v){
                    if(v===val){
                        bool=true;
                    }
                });
                return bool;
            };

            var validateArguments = function validateArguments(O, callback, accept){
                if(typeof(O)!=='object'){
                    // Throw Error
                    throw new TypeError("Object.observeObject called on non-object");
                }
                if(isCallable(callback)===false){
                    // Throw Error
                    throw new TypeError("Object.observeObject: Expecting function");
                }
                if(Object.isFrozen(callback)===true){
                    // Throw Error
                    throw new TypeError("Object.observeObject: Expecting unfrozen function");
                }
                if (accept !== undefined) {
                    if (!Array.isArray(accept)) {
                        throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array");
                    }
                }
            };

            var Observer = (function Observer(){
                var wraped = [];

                var Observer = function Observer(O, callback, accept){

                    if (Array.isArray(O)) {
                        Observer._oldValue= O.concat([]);
                    }

                    validateArguments(O, callback, accept);
                    if (!accept) {
                        accept = ["add", "update", "delete", "slice"];
                    }

                    Object.getNotifier(O).addListener(callback, accept);
                    if(wraped.indexOf(O)===-1){
                        wraped.push(O);
                    }else{
                        Object.getNotifier(O)._checkPropertyListing();
                    }
                };

                Observer.prototype.deliverChangeRecords = function Observer_deliverChangeRecords(O){
                    Object.getNotifier(O).deliverChangeRecords();
                };

                wraped.lastScanned = 0;
                var f = (function f(wrapped){
                    return function _f(){
                        var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
                        for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
                            if(_indexes.indexOf(wrapped[i]) > -1){
                                Object.getNotifier(wrapped[i])._checkPropertyListing();
                                takingTooLong=((new Date())-startTime)>500; // make sure we don't take more than 100 milliseconds to scan all objects
                            }else{
                                wrapped.splice(i, 1);
                                i--;
                                l--;
                            }
                        }
                        wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
                        _doCheckCallback(_f);
                    };
                })(wraped);
                _doCheckCallback(f);
                return Observer;
            })();

            var Notifier = function Notifier(watching){
                var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
                var self = this;

                Object.defineProperty(self, '_watching', {
                    enumerable: true,
                    get: (function(watched){
                        return function(){
                            return watched;
                        };
                    })(watching)
                });
                var wrapProperty = function wrapProperty(object, prop){
                    var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor(object, prop);
                    if((prop==='getNotifier')||isAccessorDescriptor(descriptor)||(!descriptor.enumerable)){
                        return false;
                    }
                    if((object instanceof Array)&&isNumeric(prop)){
                        var idx = properties.length;
                        properties[idx] = prop;
                        values[idx] = object[prop];
                        return true;
                    }
                    (function(idx, prop){
                        properties[idx] = prop;
                        values[idx] = object[prop];
                        Object.defineProperty(object, prop, {
                            get: function(){
                                return values[idx];
                            },
                            set: function(value){
                                if(!sameValue(values[idx], value)){
                                    Object.getNotifier(object).queueUpdate(object, prop, 'update', values[idx]);
                                    values[idx] = value;
                                }
                            }
                        });
                    })(properties.length, prop);
                    return true;
                };
                self._checkPropertyListing = function _checkPropertyListing(dontQueueUpdates) {
                    var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
                    var newKeys = [], oldKeys = properties.slice(0), updates = [];
                    var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

                    if(object instanceof Array){
                        aLength = self._oldLength;
                    }

                    for(i=0; i<l; i++){
                        prop = keys[i];
                        value = object[prop];
                        propType = typeof(value);
                        if((idx = properties.indexOf(prop))===-1){
                            if(wrapProperty(object, prop)&&queueUpdates){
                                self.queueUpdate(object, prop, 'add', null, object[prop]);
                            }
                        }else{
                            if(!(object instanceof Array)||(isNumeric(prop))){
                                if(values[idx] !== value){
                                    if(queueUpdates){
                                        self.queueUpdate(object, prop, 'update', values[idx], value);
                                    }
                                    values[idx] = value;
                                }
                            }
                            oldKeys.splice(oldKeys.indexOf(prop), 1);
                        }
                    }

                    if(object instanceof Array && object.length !== aLength){
                        if(queueUpdates){
                            self.queueUpdate(object, 'length', 'update', aLength, object);
                        }
                        self._oldLength = object.length;
                    }

                    if(queueUpdates){
                        l = oldKeys.length;
                        for(i=0; i<l; i++){
                            idx = properties.indexOf(oldKeys[i]);
                            self.queueUpdate(object, oldKeys[i], 'delete', values[idx]);
                            properties.splice(idx,1);
                            values.splice(idx,1);
                        }
                    }
                };
                self.addListener = function Notifier_addListener(callback, accept){
                    var idx = _listeners.indexOf(callback);
                    if(idx===-1){
                        _listeners.push(callback);
                        _acceptLists.push(accept);
                    }
                    else {
                        _acceptLists[idx] = accept;
                    }
                };
                self.removeListener = function Notifier_removeListener(callback){
                    var idx = _listeners.indexOf(callback);
                    if(idx>-1){
                        _listeners.splice(idx, 1);
                        _acceptLists.splice(idx, 1);
                    }
                };
                self.listeners = function Notifier_listeners(){
                    return _listeners;
                };
                self.queueUpdate = function Notifier_queueUpdate(what, prop, type, was){
                    this.queueUpdates([{
                        type: type,
                        object: what,
                        name: prop,
                        oldValue: was
                    }]);
                };
                self.queueUpdates = function Notifier_queueUpdates(updates){
                    var self = this, i = 0, l = updates.length||0, update;
                    for(i=0; i<l; i++){
                        update = updates[i];
                        _updates.push(update);
                    }
                    if(_updater){
                        _clearCheckCallback(_updater);
                    }
                    _updater = _doCheckCallback(function(){
                        _updater = false;
                        self.deliverChangeRecords();
                    });
                };
                self.deliverChangeRecords = function Notifier_deliverChangeRecords(){
                    var i = 0, l = _listeners.length,
                    //keepRunning = true, removed as it seems the actual implementation doesn't do this
                    // In response to BUG #5
                        retval;

                    for(i=0; i<l; i++){
                        if(_listeners[i]){
                            var currentUpdates;
                            if (_acceptLists[i]) {
                                currentUpdates = [];
                                for (var j = 0, updatesLength = _updates.length; j < updatesLength; j++) {
                                    if (_acceptLists[i].indexOf(_updates[j].type) !== -1) {
                                        currentUpdates.push(_updates[j]);
                                    }
                                }
                            }
                            else {
                                currentUpdates = _updates;
                            }
                            if (currentUpdates.length) {
                                //support 'splice' for arrays

                                if(inArray(_acceptLists[i],'splice')){
                                    var spliceUpdates=self._arrayObserverSplice(currentUpdates);
                                    currentUpdates=(spliceUpdates) ? spliceUpdates : currentUpdates;
                                }

                                if(_listeners[i]===console.log){
                                    console.log(currentUpdates);
                                }else{
                                    _listeners[i](currentUpdates);
                                }
                            }
                        }
                    }
                    _updates=[];
                };
                self.notify = function Notifier_notify(changeRecord) {
                    if (typeof changeRecord !== "object" || typeof changeRecord.type !== "string") {
                        throw new TypeError("Invalid changeRecord with non-string 'type' property");
                    }
                    changeRecord.object = watching;
                    self.queueUpdates([changeRecord]);
                };
                self._checkPropertyListing(true);
                self._arrayObserverSplice=function(updates){
                    var currentValue=updates[0].object;
                    if (!Array.isArray(currentValue)) {
                        return false;
                    }
                    var oldValue=Observer._oldValue;
                    if(oldValue===undefined){
                        return false;
                    }
                    var oldLength=oldValue.length;
                    var currentLength=currentValue.length;
                    if(currentLength===oldLength){
                        return false;
                    }
                    var cr=self._spliceChangeRecord();
                    cr.object=currentValue;
                    var oldLastIndex=oldLength -1;
                    var currentLastIndex=currentLength-1;
                    if(currentLength > oldLength){
                        //add
                        cr.addedCount=currentLength-oldLength;
                        //get the index
                        //test for push
                        if(!(oldValue[oldLastIndex]===currentValue[currentLastIndex])){
                            cr.index=oldLastIndex +1;
                        }else if(!(oldValue[0]===currentValue[0])){//unshift
                            cr.index=0
                        }else{
                            //iterate for arbitrary splice
                            for(var i=0;i<oldLength;i++){
                                if(!(oldValue[i]===currentValue[i])){
                                    cr.index=i;
                                    break;
                                }
                            }
                        }
                    }else{
                        //delete
                        var removedCount=oldLength-currentLength;
                        //test the end
                        if(!(oldValue[oldLastIndex]===currentValue[currentLastIndex])){
                            cr.index=currentLastIndex + 1;
                        }else if(!(oldValue[0]===currentValue[0])){//shift
                            cr.index=0;
                        }else{
                            //iterate for arbitrary splice
                            for(var i=0;i<oldLength;i++){
                                if(!(oldValue[i]===currentValue[i])){
                                    cr.index=i;
                                    break;
                                }
                            }
                        }
                        cr.removed=self._removedArray(oldValue,cr.index,removedCount);
                    }

                    Observer._oldValue=currentValue.concat([]);//reset oldValue to the current value
                    return [cr];

                };
                self._spliceChangeRecord=function(){
                    return{
                        addedCount:0,
                        index:undefined,
                        object:[],
                        removed:[],
                        type:'splice'
                    }
                };
                self._removedArray=function(arr,index,count){
                    var rm=[];
                    var length=index+count;
                    for(var i=index;i<length;i++){
                        rm.push(arr[i])
                    }
                    return rm;
                }
            };

            var _notifiers=[], _indexes=[];
            extend.getNotifier = function Object_getNotifier(O){
                var idx = _indexes.indexOf(O), notifier = idx>-1?_notifiers[idx]:false;
                if(!notifier){
                    idx = _indexes.length;
                    _indexes[idx] = O;
                    notifier = _notifiers[idx] = new Notifier(O);
                }
                return notifier;
            };
            extend.observe = function Object_observe(O, callback, accept){
                // For Bug 4, can't observe DOM elements tested against canry implementation and matches
                if(!isElement(O)){
                    return new Observer(O, callback, accept);
                }
            };
            extend.unobserve = function Object_unobserve(O, callback){
                validateArguments(O, callback);
                var idx = _indexes.indexOf(O),
                    notifier = idx>-1?_notifiers[idx]:false;
                if (!notifier){
                    return;
                }
                notifier.removeListener(callback);
                if (notifier.listeners().length === 0){
                    _indexes.splice(idx, 1);
                    _notifiers.splice(idx, 1);
                }
            };
        })(Object, this);
    }



}));



// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {


    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0;
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  }

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  }

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    var path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, directObserver) {
      for (var i = 0; i < this.length; i++) {
        if (obj == null)
          return;
        obj = obj[this[i]];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[0]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n     ' + pathString + ' != null';
      }
      str += ')\n';

      var key = this[i];
      pathString += isIdent(key) ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return undefined;';
      return new Function('obj', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};

    for (var prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (var prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    var eomObj = { pingPong: true };
    var eomRunScheduled = false;

    Object.observe(eomObj, function() {
      runEOMTasks();
      eomRunScheduled = false;
    });

    return function(fn) {
      eomTasks.push(fn);
      if (!eomRunScheduled) {
        eomRunScheduled = true;
        eomObj.pingPong = !eomObj.pingPong;
      }
    };
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var observer;
      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      object: undefined,
      objects: objects,
      open: function(obs, object) {
        if (!rootObj) {
          rootObj = object;
          rootObjProps = {};
        }

        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
      }
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.object !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.object = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  }

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  var hasDebugForceFullDelivery = hasObserve && hasEval && (function() {
    try {
      eval('%RunMicrotasks()');
      return true;
    } catch (ex) {
      return false;
    }
  })();

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (hasDebugForceFullDelivery) {
      eval('%RunMicrotasks()');
      return;
    }

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        //this.directObserver_ = getObservedObject(this, this.value_,this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      };
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i]
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      var path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i]
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe)
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  }

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    for (var prop in added)
      added[prop] = object[prop];

    for (var prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (var prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      // "Addition" rows. Initialize null column.
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (var j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (var i = 1; i < rowCount; i++) {
        for (var j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return
      };

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  global.Observer = Observer;
  global.Observer.runEOM_ = runEOM;
  global.Observer.observerSentinel_ = observerSentinel; // for testing.
  global.Observer.hasObjectObserve = hasObserve;
  global.ArrayObserver = ArrayObserver;
  global.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  global.ArraySplice = ArraySplice;
  global.ObjectObserver = ObjectObserver;
  global.PathObserver = PathObserver;
  global.CompoundObserver = CompoundObserver;
  global.Path = Path;
  global.ObserverTransform = ObserverTransform;
})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root._utils=root._utils || {};
        root._utils.forEach=factory();
        root.returnExports = root._utils.forEach;
    }
}(this, function () {
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;

    return function forEach (obj, fn, ctx) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (l === +l) {
            for (var i = 0; i < l; i++) {
                fn.call(ctx, obj[i], i, obj);
            }
        } else {
            for (var k in obj) {
                if (hasOwn.call(obj, k)) {
                    fn.call(ctx, obj[k], k, obj);
                }
            }
        }
    };

}));









(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('foreach'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['foreach'], factory);
    } else {
        // Browser globals (root is window)
        root._utils.jsonPointer=factory(root._utils.forEach);
        root.returnExports = root._utils.jsonPointer;
    }
}(this, function (forEach) {

    /**
     * Convenience wrapper around the api.
     * Calls `.get` when called with an `object` and a `pointer`.
     * Calls `.set` when also called with `value`.
     * If only supplied `object`, returns a partially applied function, mapped to the object.
     *
     * @param obj
     * @param pointer
     * @param value
     * @returns {*}
     */
    var each=forEach;
    function api (obj, pointer, value) {
        // .set()
        if (arguments.length === 3) {
            return api.set(obj, pointer, value);
        }
        // .get()
        if (arguments.length === 2) {
            return api.get(obj, pointer);
        }
        // Return a partially applied function on `obj`.
        var wrapped = api.bind(api, obj);

        // Support for oo style
        for (var name in api) {
            if (api.hasOwnProperty(name)) {
                wrapped[name] = api[name].bind(wrapped, obj);
            }
        }
        return wrapped;
    }


    /**
     * Lookup a json pointer in an object
     *
     * @param obj
     * @param pointer
     * @returns {*}
     */
    api.get = function get (obj, pointer) {
        var tok,
            refTokens = api.parse(pointer);
        while (refTokens.length) {
            tok = refTokens.shift();
            if (!obj.hasOwnProperty(tok)) {
                throw new Error('Invalid reference token: ' + tok);
            }
            obj = obj[tok];
        }
        return obj;
    };

    /**
     * Sets a value on an object
     *
     * @param obj
     * @param pointer
     * @param value
     */
    api.set = function set (obj, pointer, value) {
        var refTokens = api.parse(pointer),
            tok,
            nextTok = refTokens[0];
        while (refTokens.length > 1) {
            tok = refTokens.shift();
            nextTok = refTokens[0];

            if (!obj.hasOwnProperty(tok)) {
                if (nextTok.match(/^\d+$/)) {
                    obj[tok] = [];
                } else {
                    obj[tok] = {};
                }
            }
            obj = obj[tok];
        }
        obj[nextTok] = value;
        return this;
    };

    /**
     * Removes an attribute
     *
     * @param obj
     * @param pointer
     */
    api.remove = function (obj, pointer) {
        var refTokens = api.parse(pointer);
        var finalToken = refTokens.pop();
        if (finalToken === undefined) {
            throw new Error('Invalid JSON pointer for remove: "' + pointer + '"');
        }
        delete api.get(obj, api.compile(refTokens))[finalToken];
    };

    /**
     * Returns a (pointer -> value) dictionary for an object
     *
     * @param obj
     * @param {function} descend
     * @returns {}
     */
    api.dict = function dict (obj, descend) {
        var results = {};
        api.walk(obj, function (value, pointer) {
            results[pointer] = value;
        }, descend);
        return results;
    };

    /**
     * Iterates over an object
     * Iterator: function (value, pointer) {}
     *
     * @param obj
     * @param {function} iterator
     * @param {function} descend
     */
    api.walk = function walk (obj, iterator, descend) {
        var refTokens = [];

        descend = descend || function (value) {
            var type = Object.prototype.toString.call(value);
            return type === '[object Object]' || type === '[object Array]';
        };

        (function next (cur) {
            each(cur, function (value, key) {
                refTokens.push(String(key));
                if (descend(value)) {
                    next(value);
                } else {
                    iterator(value, api.compile(refTokens));
                }
                refTokens.pop();
            });
        }(obj));
    };

    /**
     * Tests if an object has a value for a json pointer
     *
     * @param obj
     * @param pointer
     * @returns {boolean}
     */
    api.has = function has (obj, pointer) {
        try {
            api.get(obj, pointer);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Escapes a reference token
     *
     * @param str
     * @returns {string}
     */
    api.escape = function escape (str) {
        return str.toString().replace(/~/g, '~0').replace(/\//g, '~1');
    };

    /**
     * Unescapes a reference token
     *
     * @param str
     * @returns {string}
     */
    api.unescape = function unescape (str) {
        return str.replace(/~1/g, '/').replace(/~0/g, '~');
    };

    /**
     * Converts a json pointer into a array of reference tokens
     *
     * @param pointer
     * @returns {Array}
     */
    api.parse = function parse (pointer) {
        if (pointer === '') { return []; }
        if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
        return pointer.substring(1).split(/\//).map(api.unescape);
    };

    /**
     * Builds a json pointer from a array of reference tokens
     *
     * @param refTokens
     * @returns {string}
     */
    api.compile = function compile (refTokens) {
        if (refTokens.length === 0) { return ''; }
        return '/' + refTokens.map(api.escape).join('/');
    };

    return api;


}));










(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('json-pointer'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['json-pointer'], factory);
    } else {
        // Browser globals (root is window)
        root.Nested=factory(root._utils.jsonPointer);
        root.returnExports = root.Nested;
    }
}(this, function (jsonPointer) {

    var pointer = jsonPointer;
    var Nested=Object.create(null);
// This weak map is used for `.deliverChangeRecords(callback)` calls, where the
// provided callback has to mapped to its corresponding delegate.
    var delegates = new WeakMap; // <callback, delegate>

// When using `.observe(obj, callback)`, instead of forwarding the provided
// `callback` to `Object.observe(obj, callback)` directly, a delegate for the
// `callback` is created. This delegate transforms changes before forwarding
// them to the actual `callback`.
    var Delegate = function(callback) {
        this.callback  = callback;
        this.observers = new WeakMap;

        var self = this;
        this.handleChangeRecords = function(records) {
            try {
                var changes = records.map(self.transform, self);
                changes = Array.prototype.concat.apply([], changes); // flatten
                self.callback(changes)
            } catch (err) {
                if (Nested.debug) console.error(err.stack)
            }
        }
    };

// This method transforms the received change record with using the
// corresponding observer for the object that got changed.
    Delegate.prototype.transform = function(record) {
        var observers = this.observers.get(record.object);
        observers = observers.filter(function(value, index, self) {
            return self.indexOf(value) === index
        });
        return observers.map(function(observer) {
            return observer.transform(record)
        })
    };

// Each callback/object pair gets its own observer, which is used to track
// positions of nested objects and transforms change records accordingly.
    var Observer = function(root, delegate, accept) {
        this.root     = root;
        this.delegate = delegate;
        this.callback = delegate.handleChangeRecords;
        this.accept   = accept;
        this.paths    = new WeakMap
    }

// Recursively observe an object and its nested objects.
    Observer.prototype.observe = function(obj, path, visited) {
        if (!path)    path = '';
        if (!visited) visited = new WeakMap;

        if (visited.has(obj)) {
            return
        }

        visited.set(obj, true);

        // if the object is already observed, i.e., already somewhere else in the
        // nested structure -> do not observe it again
        if (!hasAt(this.delegate.observers, obj, this)) {
            if (Array.isArray(obj) && !this.accept) {
                Object.observe(obj, this.callback, ['add', 'update', 'delete', 'splice'])
            } else {
                Object.observe(obj, this.callback, this.accept)
            }
        }

        // track path and belonging
        addAt(this.paths, obj, path);
        addAt(this.delegate.observers, obj, this);

        // traverse the properties to find nested objects and observe them, too
        for (var key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !==null) {
                this.observe(obj[key], path + '/' + pointer.escape(key), visited)
            }
        }
    };

// Recursively unobserve an object and its nested objects.
    Observer.prototype.unobserve = function(obj, path) {
        console.log(path);
        if (!obj)  obj = this.root;
        if (!path) path = '';

        if (!hasAt(this.delegate.observers, obj, this)) {
            return
        }

        // clean up
        removeAt(this.paths, obj, path);
        removeAt(this.delegate.observers, obj, this);

        if (!this.paths.has(obj)) {
            Object.unobserve(obj, this.callback)
        }

        // traverse the properties to find nested objects and unobserve them, too
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                this.unobserve(obj[key], path + '/' + pointer.escape(key))
            }
        }
    };

// Transform a change record, ie., add the following properties:
// - **root** - the root of the nested structure
// - **path** - a [JSON Pointer](http://tools.ietf.org/html/rfc6901)
//              (absolute from the root) to the changed property
    Observer.prototype.transform = function(change) {
        var key = String(change.name || change.index);

        var path = this.paths.get(change.object)[0] + '/' + pointer.escape(key);
        var record = {
            root: this.root,
            path: path
        };

        // the original change record ist not extensible -> copy
        for (var prop in change) {
            record[prop] = change[prop]
        }

        // unobserve deleted/replaced objects
        var deleted = change.oldValue && [change.oldValue] || change.removed || [];
        deleted.forEach(function(oldValue) {
            if (!oldValue || typeof oldValue !== 'object') {
                return
            }

            var invalidPaths = this.paths.get(oldValue).filter(function(path) {
                return !pointer.has(this.root, path) || pointer.get(this.root, path) !== oldValue
            }, this);

            //this.unobserve(oldValue, invalidPaths[0])
        }, this);

        // observe added/updated objects
        var value = change.object[key];
        if (typeof value === 'object') {
            var desc = Object.getOwnPropertyDescriptor(change.object, key);
            if (desc.enumerable === true) {
                this.observe(value, path)
            } else {
                this.unobserve(value, path)
            }
        }

        Object.preventExtensions(record);

        return record
    };

// Corresponds to `Object.observe()` but for nested objects.

    Nested.observe = function(obj, callback, accept) {
        if(obj===undefined || typeof obj !=='object'){return false;}
        var delegate;

        if (!delegates.has(callback)) {
            delegate = new Delegate(callback);
            delegates.set(callback, delegate)
        } else {
            delegate = delegates.get(callback)
        }

        var observers = delegate.observers;
        if (observers.has(obj)) {
            return
        }

        var observer = new Observer(obj, delegate, accept);
        observer.observe(obj)
    };

// Corresponds to `Object.unobserve()` but for nested objects.
    Nested.unobserve = function(obj, callback) {
        if (!delegates.has(callback)) return;
        var delegate = delegates.get(callback);

        if (!delegate.observers.has(obj)) {
            return
        }
        console.log('nested unobserve');
        var observers = delegate.observers.get(obj);
        observers.forEach(function(observer) {
            observer.unobserve()
        })
    };

// Corresponds to `Object.deliverChangeRecords()` but for nested objects.
    Nested.deliverChangeRecords = function(callback) {

        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function, given: ' + callback)
        }

        if (!delegates.has(callback)) return;

        var delegate = delegates.get(callback);
        Object.deliverChangeRecords(delegate.handleChangeRecords)
    };

// whether to log exceptions thrown during change record delivery
    Nested.debug = false;

// Helper function to check if a value exists in the array at the provided
// position in the provided WeakMap.
    function hasAt(map, key, value) {
        if (!map.has(key)) return false;
        return map.get(key).indexOf(value) !== -1
    }

// Helper function to add a value to an array at the provided position
// in the provided WeakMap.
    function addAt(map, key, value) {
        var set = (!map.has(key) && map.set(key, []), map.get(key));
        // if (set.indexOf(value) === -1)
        set.push(value)
    }

// Helper function to remove a value from the array at the provided position
// in the provided WeakMap.
    function removeAt(map, key, value) {
        // if (!map.has(key)) return
        var set = map.get(key);

        var index = set.indexOf(value);
        /*if (index > -1) */
        set.splice(index, 1);

        // if the set is empty, remove it from the WeakMap
        if (!set.length) map.delete(key)

    }

    return Nested;

}));



//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('observe-js'),require('elliptical-utils'),require('nested-observe'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['observe-js','elliptical-utils','nested-observe'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root,root.elliptical.utils,root.Nested);
    }
}(this, function (global,utils,Nested) {

    var _=utils._;

    /* necessary  private method/variable definitions copied over from observe-js ************************************************** */


    // Detect and do basic sanity checking on Object/Array.observe.
    function detectObjectObserve() {
        if (typeof Object.observe !== 'function' ||
            typeof Array.observe !== 'function') {
            return false;
        }


        return true;
    }

    var hasObserve = detectObjectObserve();

    var OPENED = 1;

    function diffObjectFromOldObject(object, oldObject) {
        var added = {};
        var removed = {};
        var changed = {};

        for (var prop in oldObject) {
            var newValue = object[prop];

            if (newValue !== undefined && newValue === oldObject[prop])
                continue;

            if (!(prop in object)) {
                removed[prop] = undefined;
                continue;
            }

            if (newValue !== oldObject[prop])
                changed[prop] = newValue;
        }

        for (var prop in object) {
            if (prop in oldObject)
                continue;

            added[prop] = object[prop];
        }

        if (Array.isArray(object) && object.length !== oldObject.length)
            changed.length = object.length;

        return {
            added: added,
            removed: removed,
            changed: changed
        };
    }
    function getObservedObject(observer, object, arrayObserve) {
        var dir = observedObjectCache.pop() || newObservedObject();
        dir.open(observer);
        dir.observe(object, arrayObserve);
        return dir;
    }

    var observedObjectCache = [];

    function newObservedObject() {
        var observer;
        var object;
        var discardRecords = false;
        var first = true;

        function callback(records) {
            if (observer && observer.state_ === OPENED && !discardRecords)
                observer.check_(records);
        }
        return {
            open: function(obs) {
                if (observer)
                    throw Error('ObservedObject in use');

                if (!first)
                    Object.deliverChangeRecords(callback);

                observer = obs;
                first = false;
            },
            observe: function(obj, arrayObserve) {
                object = obj;
                if (arrayObserve)
                    Array.observe(object, callback);
                else
                    Object.observe(object, callback);
            },
            deliver: function(discard) {
                discardRecords = discard;
                Object.deliverChangeRecords(callback);
                discardRecords = false;
            },
            close: function() {
                observer = undefined;
                Object.unobserve(object, callback);
                observedObjectCache.push(this);
            }
        };
    }

    var expectedRecordTypes = {
        add: true,
        update: true,
        delete: true
    };


    function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
        var added = {};
        var removed = {};

        for (var i = 0; i < changeRecords.length; i++) {
            var record = changeRecords[i];
            if (!expectedRecordTypes[record.type]) {
                console.error('Unknown changeRecord type: ' + record.type);
                console.error(record);
                continue;
            }

            if (!(record.name in oldValues))
                oldValues[record.name] = record.oldValue;

            if (record.type == 'update')
                continue;

            if (record.type == 'add') {
                if (record.name in removed)
                    delete removed[record.name];
                else
                    added[record.name] = true;

                continue;
            }

            // type = 'delete'
            if (record.name in added) {
                delete added[record.name];
                delete oldValues[record.name];
            } else {
                removed[record.name] = true;
            }
        }

        for (var prop in added)
            added[prop] = object[prop];

        for (var prop in removed)
            removed[prop] = undefined;

        var changed = {};
        for (var prop in oldValues) {
            if (prop in added || prop in removed)
                continue;

            var newValue = object[prop];
            if (oldValues[prop] !== newValue)
                changed[prop] = newValue;
        }

        return {
            added: added,
            removed: removed,
            changed: changed
        };
    }
    /* end of private method/variable declarations ****************************************************************/

    /* elliptical observe only uses the Polymer ObjectObserver and PathObserver implementations. It also uses
     its own object change report implementation
     */

    /* overwrite the ObjectObserver Constructor
     *  Note: if no id prop is passed to the constructor, the entire implementation defaults to the standard polymer one, including
     *  the change reporting
     * */

    //first, save the prototype
    var ObjectObserver_prototype=ObjectObserver.prototype;

    //modify the constructor
    ObjectObserver= function(object,id){
        Observer.call(this);
        this.value_ = object;
        this.oldObject_ = undefined;
        /* modification */
        if(typeof id !=='undefined'){
            this.__id=id;
        }
    };
    //reassign the old prototype back to the modified constructor
    ObjectObserver.prototype=ObjectObserver_prototype;

    //modifications to prototype methods to allow reporting custom to elliptical
    ObjectObserver.prototype.connect_=function(){
        /* modification
         * if __id exists on the Observer prototype, we implement elliptical assignment
         *
          note: elliptical shims Object.observe, so there is no hasObserve if..else condition
        */
        if(this.__id !=='undefined'){
            //elliptical assignment, use nested-observe for deliver changes, allowing for deep observe changes
            Nested.observe(this.value_,this.check_.bind(this));
        }else{
            //polymer assignment
            this.directObserver_ = getObservedObject(this, this.value_,this.arrayObserve);
        }

    };
    ObjectObserver.prototype.check_=function(changeRecords, skipChanges) {
        /* modification
         * if __id exists on the Observer prototype, we implement elliptical deep change reporting
         * */

        if(this.__id !=='undefined'){
            var diff_;
            if (!changeRecords){
                return false;
            }
            diff_=utils.nativeObjDiffReport(this.value_,changeRecords);
            this.callback_.call(this,diff_);

            return true;

        }else{
            //polymer reporting
            var diff;
            var oldValues;
            if (!changeRecords)
                return false;

            oldValues = {};
            diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                oldValues);


            this.report_([
                    diff.added || {},
                    diff.removed || {},
                    diff.changed || {},
                function(property) {
                    return oldValues[property];
                }
            ]);

            return true;
        }

    };

    ObjectObserver.prototype.disconnect_=function(){
        //elliptical
        if(this.__id !=='undefined'){
            Nested.unobserve(this.value_,function(){});
        }else{
            //polymer
            this.directObserver_.close();
            this.directObserver_ = undefined;
        }
    };



    global.ObjectObserver=ObjectObserver;



    return global;

}));


// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

  function getTreeScope(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }

    return typeof node.getElementById === 'function' ? node : null;
  }

  Node.prototype.bind = function(name, observable) {
    console.error('Unhandled binding to Node: ', this, name, observable);
  };

  Node.prototype.bindFinished = function() {};

  function updateBindings(node, name, binding) {
    var bindings = node.bindings_;
    if (!bindings)
      bindings = node.bindings_ = {};
      /* modification from original repo */
      if (bindings[name]){
          if(binding[name]){
              binding[name].close();
          }else{
              bindings[name].close();
          }
      }


      return bindings[name] = binding;

  }

  function returnBinding(node, name, binding) {
    return binding;
  }

  function sanitizeValue(value) {
    return value == null ? '' : value;
  }

  function updateText(node, value) {
    node.data = sanitizeValue(value);
  }

  function textBinding(node) {
    return function(value) {
      return updateText(node, value);
    };
  }

  var maybeUpdateBindings = returnBinding;

  Object.defineProperty(Platform, 'enableBindingsReflection', {
    get: function() {
      return maybeUpdateBindings === updateBindings;
    },
    set: function(enable) {
      maybeUpdateBindings = enable ? updateBindings : returnBinding;
      return enable;
    },
    configurable: true
  });

  Text.prototype.bind = function(name, value, oneTime) {
    if (name !== 'textContent')
      return Node.prototype.bind.call(this, name, value, oneTime);

    if (oneTime)
      return updateText(this, value);

    var observable = value;
    updateText(this, observable.open(textBinding(this)));
    return maybeUpdateBindings(this, name, observable);
  }

  function updateAttribute(el, name, conditional, value) {
    if (conditional) {
      if (value)
        el.setAttribute(name, '');
      else
        el.removeAttribute(name);
      return;
    }

    el.setAttribute(name, sanitizeValue(value));
  }

  function attributeBinding(el, name, conditional) {
    return function(value) {
      updateAttribute(el, name, conditional, value);
    };
  }

  Element.prototype.bind = function(name, value, oneTime) {
    var conditional = name[name.length - 1] == '?';
    if (conditional) {
      this.removeAttribute(name);
      name = name.slice(0, -1);
    }

    if (oneTime)
      return updateAttribute(this, name, conditional, value);


    var observable = value;
    updateAttribute(this, name, conditional,
        observable.open(attributeBinding(this, name, conditional)));

    return maybeUpdateBindings(this, name, observable);
  };

  var checkboxEventType;
  (function() {
    // Attempt to feature-detect which event (change or click) is fired first
    // for checkboxes.
    var div = document.createElement('div');
    var checkbox = div.appendChild(document.createElement('input'));
    checkbox.setAttribute('type', 'checkbox');
    var first;
    var count = 0;
    checkbox.addEventListener('click', function(e) {
      count++;
      first = first || 'click';
    });
    checkbox.addEventListener('change', function() {
      count++;
      first = first || 'change';
    });

    var event = document.createEvent('MouseEvent');
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false,
        false, false, false, 0, null);
    checkbox.dispatchEvent(event);
    // WebKit/Blink don't fire the change event if the element is outside the
    // document, so assume 'change' for that case.
    checkboxEventType = count == 1 ? 'change' : first;
  })();

  function getEventForInputType(element) {
    switch (element.type) {
      case 'checkbox':
        return checkboxEventType;
      case 'radio':
      case 'select-multiple':
      case 'select-one':
        return 'change';
      case 'range':
        if (/Trident|MSIE/.test(navigator.userAgent))
          return 'change';
      default:
        return 'input';
    }
  }

  function updateInput(input, property, value, santizeFn) {
    input[property] = (santizeFn || sanitizeValue)(value);
  }

  function inputBinding(input, property, santizeFn) {
    return function(value) {
      return updateInput(input, property, value, santizeFn);
    }
  }

  function noop() {}

  function bindInputEvent(input, property, observable, postEventFn) {
    var eventType = getEventForInputType(input);

    function eventHandler() {
      observable.setValue(input[property]);
      observable.discardChanges();
      (postEventFn || noop)(input);
      Platform.performMicrotaskCheckpoint();
    }
    input.addEventListener(eventType, eventHandler);

    return {
      close: function() {
        input.removeEventListener(eventType, eventHandler);
        observable.close();
      },

      observable_: observable
    }
  }

  function booleanSanitize(value) {
    return Boolean(value);
  }

  // |element| is assumed to be an HTMLInputElement with |type| == 'radio'.
  // Returns an array containing all radio buttons other than |element| that
  // have the same |name|, either in the form that |element| belongs to or,
  // if no form, in the document tree to which |element| belongs.
  //
  // This implementation is based upon the HTML spec definition of a
  // "radio button group":
  //   http://www.whatwg.org/specs/web-apps/current-work/multipage/number-state.html#radio-button-group
  //
  function getAssociatedRadioButtons(element) {
    if (element.form) {
      return filter(element.form.elements, function(el) {
        return el != element &&
            el.tagName == 'INPUT' &&
            el.type == 'radio' &&
            el.name == element.name;
      });
    } else {
      var treeScope = getTreeScope(element);
      if (!treeScope)
        return [];
      var radios = treeScope.querySelectorAll(
          'input[type="radio"][name="' + element.name + '"]');
      return filter(radios, function(el) {
        return el != element && !el.form;
      });
    }
  }

  function checkedPostEvent(input) {
    // Only the radio button that is getting checked gets an event. We
    // therefore find all the associated radio buttons and update their
    // check binding manually.
    if (input.tagName === 'INPUT' &&
        input.type === 'radio') {
      getAssociatedRadioButtons(input).forEach(function(radio) {
        var checkedBinding = radio.bindings_.checked;
        if (checkedBinding) {
          // Set the value directly to avoid an infinite call stack.
          checkedBinding.observable_.setValue(false);
        }
      });
    }
  }

  HTMLInputElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value' && name !== 'checked')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);
    var sanitizeFn = name == 'checked' ? booleanSanitize : sanitizeValue;
    var postEventFn = name == 'checked' ? checkedPostEvent : noop;

    if (oneTime)
      return updateInput(this, name, value, sanitizeFn);


    var observable = value;
    var binding = bindInputEvent(this, name, observable, postEventFn);
    updateInput(this, name,
                observable.open(inputBinding(this, name, sanitizeFn)),
                sanitizeFn);

    // Checkboxes may need to update bindings of other checkboxes.
    return updateBindings(this, name, binding);
  }

  HTMLTextAreaElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateInput(this, 'value', value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateInput(this, 'value',
                observable.open(inputBinding(this, 'value', sanitizeValue)));
    return maybeUpdateBindings(this, name, binding);
  }

  function updateOption(option, value) {
    var parentNode = option.parentNode;;
    var select;
    var selectBinding;
    var oldValue;
    if (parentNode instanceof HTMLSelectElement &&
        parentNode.bindings_ &&
        parentNode.bindings_.value) {
      select = parentNode;
      selectBinding = select.bindings_.value;
      oldValue = select.value;
    }

    option.value = sanitizeValue(value);

    if (select && select.value != oldValue) {
      selectBinding.observable_.setValue(select.value);
      selectBinding.observable_.discardChanges();
      Platform.performMicrotaskCheckpoint();
    }
  }

  function optionBinding(option) {
    return function(value) {
      updateOption(option, value);
    }
  }

  HTMLOptionElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateOption(this, value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateOption(this, observable.open(optionBinding(this)));
    return maybeUpdateBindings(this, name, binding);
  }

  HTMLSelectElement.prototype.bind = function(name, value, oneTime) {
    if (name === 'selectedindex')
      name = 'selectedIndex';

    if (name !== 'selectedIndex' && name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);

    if (oneTime)
      return updateInput(this, name, value);

    var observable = value;
    var binding = bindInputEvent(this, name, observable);
    updateInput(this, name,
                observable.open(inputBinding(this, name)));

    // Option update events may need to access select bindings.
    return updateBindings(this, name, binding);
  }
})(this);

/*
 * =============================================================
 * elliptical.platform
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('ellipse-utils'),require('ellipsis-touch'),require('ellipsis-animation'),
            require('ellipsis-element'),require('elliptical-observe'),require('elliptical-nodebind'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','ellipse-utils','ellipsis-touch','ellipsis-animation','ellipsis-element',
            'elliptical-observe','elliptical-nodebind'], factory);
    } else {
        // Browser globals (root is window)
        window.$$=window.$$ || {};
        window.$$.elliptical=window.$$.elliptical || {};
        root.returnExports = factory(root.elliptical.utils);
    }
}(this, function (utils) {

    $.elliptical= $.elliptical || {};
    $.elliptical.hasObjectObserve=Observer.hasObjectObserve;
    $.elliptical.utils=utils;
    $.elliptical.startDirtyCheck=function(){
        var interval_=window.__dirtyCheckInterval || 500;
        console.log('dirty checking started...');
        var timeoutId=setInterval(function(){
            Platform.performMicrotaskCheckpoint();
        },interval_);
    };
    return $;


}));



//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs

        module.exports = factory(require('elliptical-platform'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-platform'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {
    var utils= $.elliptical.utils;
    var _=utils._;

    

    $.element('elliptical.scope',{

        options:{
            idProp:'id',
            dataBind: true,
            watch:null
        },

        /**
         *
         * @private
         */
        _initElement:function(){
            this._data._timeOutId=null;
            this._data.scopeObserver=null;
            this._data.scopeId=this.options.idProp;
            this._data._discard = false;
            this._data._observablesArray=[];
            this.__initScope();

            if(this.options.dataBind){
                this.__initScopeObservable();
            }
        },

        /**
         * init a $scope on the instance
         * @private
         */
        __initScope:function(){
            this.$scope={};
        },

        /**
         * init a watcher that binds an observable to the $scope when it becomes non-empty
         * terminates itself when it calls _setObservable
         * the init watcher avoids the initial $scope setting by the developer firing a change event
         * since an inherited parent's _initElement event is sequentially is going to fire before the element's _initElement
         * @private
         */
        __initScopeObservable:function(){
            var self = this;
            var timeOutId=setInterval(function(){
                var obj=self.__objectWatchValue();
                if(obj){
                    clearInterval(timeOutId);
                    self.__setObservable(obj);
                    self._onScopeInit(self.__cloneScope());
                }
            },500);
        },

        __objectWatchValue:function(){
            var $scope = this.$scope;
            if (!_.isEmpty($scope)) {
                var watch = this.options.watch;
                var obj = (typeof watch==='string') ? utils.objectPropertyByPath($scope, watch) : $scope;
                return (obj) ? obj : null;
            }

        },

        /**
         * set the observable
         * @private
         */
        __setObservable:function(obj){
            var observable = (obj) ? obj : this.$scope;
            var self=this;
            var id=this.options.idProp;
            if(id===undefined){
                id='id';
            }
            this.$observable = observable;
            var observer = new ObjectObserver(observable,id);
            observer.open(function (result) {
                self.__onScopeChange(result);
            });
            /* save reference to the observer instance */
            this._data.scopeObserver=observer;
        },

        /**
         * destroy the scope observable
         * @private
         */
        __destroyObservable:function(){
            if(this._data.scopeObserver){
                this._data.scopeObserver.close();
                this._data.scopeObserver=null;
                this.$scope=null;
            }
        },

        /**
         * destroys any additional observers
         * @private
         */
        __destroyObservablesArray:function(){
            var arr=this._data._observablesArray;
            if(arr.length && arr.length > 0 ){
                arr.forEach(function(obj){
                    try{
                        obj.close();
                        obj=null;
                    }catch(ex){

                    }
                });
            }
        },

        /**
         * reset observable
         * @private
         */
        __resetObservable: function(){
            this.__destroyObservable();
            this.__setObservable();
        },

        /**
         * clone the scope object...changes to this will not effect observable
         * @returns {Object}
         * @private
         */
        __cloneScope:function(){
            return _.cloneDeep(this.$scope);
        },

        /**
         * clone an object
         * @param obj {Object}
         * @returns {Object}
         * @private
         */
        __cloneObject:function(obj){
            return _.cloneDeep(obj);
        },

        /**
         * returns scope length...(-1)==object, not array
         * @returns {Number}
         * @controller
         */
        __scopeLength:function(obj){
            var scope=(typeof obj==='undefined') ? this.$scope : obj;
            if(utils.isPropertyByIndexArray(scope,0)){
                var arr=utils.objectPropertyByIndex(scope,0);
                return arr.length;
            }else{
                return -1;  //object
            }
        },

        /**
         *
         * @private
         */
        __isModelList: function () {
            /*if (this.options.objectBind) {
                return false;
            } else {
                return (this.__scopeLength() > -1);
            }*/
            return false;

        },

        /**
         *
         * @param val {Object}
         * @private
         */
        _removeFromModelListById: function(val){
            var scope=this.$scope;
            var id=this._data.scopeId;
            utils.deleteObjectByIdFromArrayProp(scope,id,val);
        },

        /**
         *
         * @param val {Object}
         * @returns {Object}
         * @private
         *
         */
        _selectFromModelListById: function(val){
            var scope=this.$scope;
            var id=this._data.scopeId;
            if(id===undefined){
                id='id';
            }
            return utils.selectObjectByIdFromArrayProp(scope,id,val);
        },

        /**
         *
         * @param obj {Object}
         * @returns {Object}
         * @private
         */
        _selectFromModelListByObj:function(obj){
            var __o;
            var items=this.$scope[Object.keys(this._scope)[0]];
            items.forEach(function(o){
                if(_.isEqual(obj,o)){
                    __o=o;
                }
            });

            return __o;
        },

        _scopeIndexById:function(id){
            var idProp=this._data.scopeId;
            if(idProp===undefined){
                idProp='id';
            }
            return utils.objectIndexById(this.$scope,id,idProp);
        },

        /**
         * recycles the observable
         * @private
         */
        __recycle:function(){
            this.__destroyObservable();
            this.__setObservable();
        },

        /**
         * clears the watcher(that only sets up the observable).
         * as soon as a $scope has a non-empty value, the watcher terminates itself
         * @private
         */
        __clearWatch: function(){
            if(this._data.timeOutId){
                clearInterval(self._data._timeOutId);
            }
        },

        /**
         * hook for scope observable change
         *
         * @param result {Object}
         * @controller
         */
        __onScopeChange:function(result){
            this._onScopeChange(result);
        },

        /**
         * console.log the current $scope
         * @param delay
         * @private
         */
        __printScope:function(delay){
            if(delay===undefined){
                delay=0;
            }
            var self=this;
            setTimeout(function(){
                console.log(self.$scope);
            },delay);
        },

        /**
         * returns changed object properties from the result param in _onScopeChange
         * @param obj
         * @returns {Object}
         * @private
         */
        _objectChange:function(obj){
            if(obj !==undefined){
                if(obj.object && obj.oldObject){
                    return utils.objChangedProps(obj.object,obj.oldObject);
                }else{
                    var chg_={};
                    chg_[obj.name]=obj.value;
                    return chg_;
                }
            }
        },


        __isEmptyObject:function(obj){
          return _.isEmpty(obj);
        },


        /**
         * destroy clean-up
         * @private
         */
        _dispose:function(){
            this.__clearWatch();
            this.__destroyObservable();
            this.__destroyObservablesArray();
        },

        _onScopeInit: $.noop,

        _onScopeChange: $.noop,

        /**
        * asynchronous $scope property setter for browsers that have polyfilled Object.observe
        * if Object.observe is native, defaults to a simple synchronous setter
        * @param prop {String}
        * @param value {Object} []
        * @param obj {Object} [optional object property on the $scope]
        */
        $scopeSetter: function (prop, value, obj) {
            var delay = this.options.setterDelay;
            var polyfilled = (typeof window.__observePolyfill !== 'undefined' && window.__observePolyfill);
            var $scope = this.$scope;
            if (typeof obj === 'undefined') {
                if (polyfilled) {
                    setTimeout(function () {
                        $scope[prop] = value;
                    }, delay);
                } else {
                    $scope[prop] = value; //just set if native observe
                }
            } else {
                if (polyfilled) {
                    setTimeout(function () {
                        $scope[obj][prop] = value;
                    }, delay);
                } else {
                    $scope[obj][prop] = value; //just set if native observe
                }
            }
        },

        /**
         * gives the difference between two objects
         * @param n {Object}
         * @param o {Object}
         * @returns {Object}
         * @public
         */
        $changeReport:function(n,o){
            return utils.objChangedProps(n,o);
        },

        /**
         * sets up a deep Object observer
         * @param obj
         * @param id
         * @param callback
         */
        $observer:function(obj,id,callback){
            var idProp=this._data.scopeId;
            if(typeof id==='function'){
                callback=id;
                id=(typeof idProp==='undefined') ? 'id' : idProp;
            }
            var observer = new ObjectObserver(obj,id);
            observer.open(function(result){
                callback(result);
            });

            this._data._observablesArray.push(observer);
        }

    });

    return $;


}));
/*
 * =============================================================
 * elliptical-cache
 * =============================================================
 *
 * usage:
 *
 * var $cache=this._data.$cache;
 * $cache.set(node,{foo:'bar'});
 *
 * var data=$cache.get(node);
 * var bar = data.foo; =>'bar'
 *
 * clean-up:
 * $cache.reset();
 *
 * a replacement for jQuery data as an alternative to HTML5 dataset(data attributes as DOM datastore).
 * The issue with jQuery data is that node removal clears the jQuery cache for that node. This interferes, for example, in those cases that rely
 * on mutation observer callback for removedNodes in terms of any necessity of querying a node's data to perform an action or actions.
  * $cache doesn't destroy the nodes data on removal, leaving clean-up to the developer, with fallback to component destroy event.
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.element('elliptical.cache',{

       _initElement:function(){
           this._data.$cache=this.$cache();
       },

        $cache:function(){
            var cache={};
            var count=1;
            return {
                reset:function(){
                    count=1;
                    cache={};
                },

                set:function(node,data){
                    if(!node.__data){
                        node.__data=count++;
                    }
                    cache[node.__data]=data;
                },

                get:function(node){
                    return cache[node.__data];
                }
            }
        },

        _dispose:function(){
            var $cache=this._data.$cache;
            $cache.reset();
        }

    });

    return $;

}));
/*
 * =============================================================
 * elliptical.template
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-dustjs'),require('elliptical-scope'),require('elliptical-cache'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-dustjs','elliptical-scope','elliptical-cache'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.dust);
    }
}(this, function (dust) {

    window.dust=dust;
    var utils= $.elliptical.utils;
    var _=utils._;
    if(typeof window.dust !== 'undefined'){
        $.widget.$providers({
            template:window.dust
        })
    }

    $.element('elliptical.template', [$.elliptical.scope, $.elliptical.cache],{

        /**
         * init
         * @private
         */
        _initElement:function(){
            if (this.options.setVisibility === undefined) {
                this.options.setVisibility = true;
            }
            if (this.options.templateBind === undefined) {
                this.options.templateBind = true;
            }
            this._data.Running=null;
            this._data.unlockInterval=300;
            this._data._intervalId=null;
            this._data.fragment=null;
            this._data.templateId=null;
            this._data.tree=[];
            this._data.pathObservers=[];
            this._data._setDiscardBit=true;
            this._data.modelPathTree=[];
            this._data.previouslyBound=false;
            this._data._watched = false;
            this._data.htmlProp = 'outerHTML';
            var __customElements = this.options.$customElements;
            this._data.modelNodeSelector=(!__customElements) ? '[model-id]' : '[model-id]';
            this._data.attrId=(!__customElements) ? 'model-id' : 'model-id';
            var template=this.__getTemplateNode();
            if(template[0] && this.options.templateBind){
                this._data.templateNode=template;
                this.__onScriptsLoaded();
            }

        },

        /**
         * watch for the client-side template scripts to be loaded in
         * @private
         */
        __onScriptsLoaded:function(){
            var self=this;
            this._data._intervalId=setInterval(function(){
                if($$.fragments !== undefined){
                    clearInterval(self._data._intervalId);
                    //precompile template, if applicable
                    var template = self._data.templateNode;
                    id = self.__getTemplateId(template);
                    var prop = self._data.htmlProp;
                    self._precompileTemplate(id, template,prop);

                    //bind
                    self.__bind();
                }
            },100);
        },


        /**
         * databind if we have a $scope, otherwise call the watcher
         * @param repeat {Boolean}
         * @private
         */
        __bind:function(repeat){
            var template=this._data.templateNode;
            this.__initTemplate(template);
            this.__initDOMObserver(template[0]);
            var redraw=this.options.autoRender;
            if(this.__isModelList()){
                (this.__scopeLength() > 0) ? this.__databind(template,repeat,redraw) : this.__watch(template,true,repeat);
            }else{
                (!_.isEmpty(this.$scope)) ? this.__databind(template,repeat,redraw) : this.__watch(template,false,repeat);
            }
        },

        /**
         *
         * @param template {Object}
         * @param isArray {Boolean}
         * @param repeat {Boolean}
         * @private
         */
        __watch:function(template,isArray,repeat){
            var self=this;
            this._data._watched=true;
            var redraw=this.options.autoRender;
            this._data.intervalId=setInterval(function(){
                if((isArray && self.__scopeLength() > 0 ) || (!isArray && !_.isEmpty(self.$scope))){
                    self._data._watched=false;
                    clearInterval(self._data.intervalId);
                    self.__databind(template,repeat,redraw);
                }
            },100);
        },

        /**
         *
         * @private
         */
        __getTemplateNode:function(){
            var template = this.element.find('ui-template');
            if (template[0]) {
                return template;
            } else {
                this._data.htmlProp = 'innerHTML';
                return this.element.selfFind('[template]');
            }
        },

        __getTemplateId:function(template){
            var id = template.attr('id');
            if (id === undefined) {
                id = template.attr('name');
            }
            if (id === undefined) {
                id = template.attr('template');
            }
           
            if (id === undefined || id==='') {
                var hasAttr = template[0].getAttribute('template');
                if (hasAttr !== null) {
                    id = 'str-' + this._randomString(8);
                    template.attr('template',id);
                }
            }
            
            return id;
        },

        /**
         * gets and parses the element template fragment
         * @param template {Object}
         * @private
         */
        __initTemplate:function(template){
            var fragment;
            var id = template.attr('id');
            if (id === undefined) {
                id = template.attr('template');
            }
            var name=template.attr('name');
            if(typeof id !=='undefined'){
                this._data.templateId=id;
                fragment=this._getFragmentById(id);
                this._data.fragment=fragment;
                if(fragment){
                    this.__parseTemplateFragment(fragment);
                }

            }else if(typeof name !=='undefined'){
                this._data.templateId=name;
                fragment=this.__getFragmentByName();
                this._data.fragment=fragment;

                if(fragment){
                    this.__parseTemplateFragment(fragment);
                }
            }
        },


        /**
         * init template fragment mutation observer for template DOM additions/removal
         * @param template {Object} Node Element
         * @private
         */
        __initDOMObserver:function(template){
            var self=this;
            var observer=new MutationObserver(function(mutations){
                mutations.forEach(function(mutation){
                    if(mutation.addedNodes && mutation.addedNodes.length>0){ //nodes added
                        self.__addedNodes(mutation.addedNodes);

                    }
                    if(mutation.removedNodes && mutation.removedNodes.length>0){ //nodes removed

                        self.__removedNodes(mutation.removedNodes);
                    }

                    /* fire the hook for the mutation record */
                    self._onDOMMutation(mutation);
                });

            });
            observer.observe(template, {childList: true,subtree:true});
            this._data.DOMObserver=observer;
        },


        __getFragmentByName:function(){
            var templateNode=this._data.templateNode;
            if(this.options.bindHTML5Imports){
                this._renderElementTemplateImports(templateNode);
            }
            return templateNode.html();
        },

        /**
         * parses a fragment into a contextKeyArray
         * a dom fragment is passed to dust.parse, which returns an array
         * the array is then further parsed into a contextKeyArray
         * contextKeyArray = array of cxt objects
         *
         * NOTE: context==section in the dustjs parlance
         *
         * cxt={
             *    index: {number} the context depth index
             *    context: {string} the context/section at the index
             *    cxt: {array} string of contexts(context/section tree) for each index up to current index
             *    key: {string} model prop/key
             * }
         *
         * the last object will be the array of context/section trees
         *
         * example: users=[
         *   {
             *    name:'Bob Smith'
             *    addresses:[{address:'1234 East Ave'},{address:'1673 Main St'}]
             *   },
         *   {
             *    name:'Jane Doe'
             *    addresses:[{address:'4321 West Ave'},{address:'9090 XYZ Ave'}]
             *   }
         * ]
         *
         * contextKeyArray=[
             *   {
             *     context:'users',
             *     cxt:['users'],
             *     index:0
             *   },
             *   {
             *     context:'users',
             *     cxt:['users'],
             *     index:0,
             *     key:'name'
             *   },
             *   {
             *     context:'addresses',
             *     cxt:['users','addresses'],
             *     index:1
             *   },
             *   {
             *     context:'addresses',
             *     cxt:['users','addresses'],
             *     index:1,
             *     key:'address'
             *   },
             *   {
             *     [
             *       {
             *        context:'users',
             *        cxt:['users'],
             *        index:0
             *       },
             *       {
             *        context:'addresses',
             *        cxt:['users','addresses'],
             *        index:1
             *       }
             *
             *
             *     ]
             *   }
         * ]
         * @param fragment {Object}
         * @private
         */
        __parseTemplateFragment:function(fragment){
            var provider=this.options.$providers.template;
            var parsed=provider.parse(fragment);
            var contextArray=[];
            var contextKeyArray=[];
            var index=0;
            var context;

            if(parsed.length && parsed.length >0){
                tree(parsed);
            }


            /**
             * recursively parses dust array to build our custom contextKeyArray to enable
             * matching node elements with a javascript model without having to resort to excessive data-path-annotations
             * @param arr {Array}
             */
            function tree(arr){
                if(arr && arr.length){
                    arr.forEach(function(obj){
                        if(obj[0]==='#' && _.isArray(obj)){
                            var obj_={
                                index:index,
                                context:obj[1][1],
                                cxt:getCxt(obj[1][1],index,false)
                            };
                            context=obj[1][1];
                            contextKeyArray.push(obj_);
                            contextArray.push(obj_);
                            var indexRef=index;
                            index++;
                            tree(obj);
                            index=indexRef;

                        }else if(obj[0]==='bodies'){
                            tree(obj[1]);
                        }else if(obj[0]==='reference'){
                            tree(obj[1]);
                        }else if(obj[0]==='body'){

                            obj.forEach(function(o){
                                if(o[0]==='reference'){
                                    var obj_={
                                        cxt:getCxt(context,index),
                                        context:context,
                                        index:index,
                                        key:o[1][1]
                                    };
                                    contextKeyArray.push(obj_);
                                }
                            });
                            tree(obj);
                        }
                    });
                }
            }

            /**
             * builds a context/section tree array for a passed context and context index(depth)
             * @param context {String}
             * @param index {Number}
             * @param dec {Boolean}
             * @returns {Array}
             */
            function getCxt(context,index,dec){
                if(typeof dec==='undefined'){
                    dec=true;
                }

                if(index > 0 && dec){
                    index--;
                }
                var arr=[];
                contextArray.forEach(function(obj){
                    if(obj.index < index){
                        arr.push(obj.context);
                    }
                });
                if(context){
                    arr.push(context);
                }

                return arr;
            }

            contextKeyArray.push(contextArray);
            this._data.contextKeyArray=contextKeyArray;

        },

        /**
         * returns template fragment model children (ui-model) nodes(jQuery objects)
         * @private
         * @returns {Array}
         */
        __templateModels: function(template){
            if(typeof template==='undefined'){
                template=this._data.templateNode;
            }
            var modelNode=this._data.modelNodeSelector;
            return (template) ? template.find(modelNode) : null;

        },

        _templateNodes:function(){
            return this.__templateModels();
        },

        _nodeById:function(id){
            var nodes=this._templateNodes();
            return nodes.selfFind('[model-id="' + id + '"]');
        },


        /**
         * bind path observers to DOM
         * @param template {Object}
         * @param repeat {Boolean}
         * @param redraw {Boolean}
         * @private
         */
        __databind:function(template,repeat,redraw){
            /* lock observer callbacks while data binding */
           this.__lock();

            var self=this;
            var $scope=this.$scope;

            var models=this.__templateModels(template);

            //two-way databind only: if the model is an array and model is already rendered
            if(this.__isModelList() && models && models.length > 0 && redraw===undefined) {
                $.each(models, function (i, model) {
                    self.__bindModel(model, i);
                });
            }else if(!_.isEmpty($scope) && repeat===undefined){
                //if we need to first render the model and then two-way databind
                this.__render($scope,function(){
                    self.__databind(template,false,undefined);
                });

            }else{
                //model is an object
                this.__bindModel(template[0],null);
            }
            /* mark DOM as bound(i.e., text Nodes have been created for keys) */
            this._data.previouslyBound=true;

            /* unlock observer callbacks */
            this.__unlock();

            self.__setVisibility(template);

        },

        /**
         * renders the template fragment directly using the $scope
         * @param $scope {Object}
         * @param callback {Function}
         * @private
         */
        __render: function($scope,callback){
            var opts={};
            opts.template=this._data.templateId;
            if(opts.template===null){
                opts.template = this._data.templateNode.attr('id');
            }
            if (opts.template === undefined || opts.template === null) {
                opts.template = this._data.templateNode.attr('template');
            }
            if(this.__isModelList()){
                var prop=Object.keys($scope)[0];
                opts.model=$scope[prop];
                opts.context=prop;
            }else{
                opts.model=$scope;
            }
            opts.parse=false;
            this.__renderTemplate(opts,callback);
        },

        /**
         *
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        __renderTemplate:function(opts,callback){
            var self=this;
            var templateNode=this._data.templateNode;
            var scope=this.$scope;
            this._renderTemplate(opts,function(err,out){
                var html=out.replace(/<ui-template(.*?)>/g,'').replace(/<\/ui-template>/g,'');
                self._data.templateNode.html(html);
                if(self.options.bindHTML5Imports){
                    self._renderElementTemplateImports(templateNode,scope);
                }
                if(callback){
                    callback(err,out);
                }
            });
        },

        /**
         * lock observer callbacks(scope and mutation)
         * @private
         */
        __lock:function(){
            this._data.Running=true;
            if(this._data._setDiscardBit){
                this._data._discard=true;
            }
        },

        /**
         * unlocks observer callbacks
         * if the mutation or scope observer callback is triggered during data binding, infinite
         * looping can result. so block this with flag settings
         * @private
         */
        __unlock:function(){
            var self=this;
            var unlockInterval=this._data.unlockInterval;
            setTimeout(function(){
                self._data.Running=null;
                self._data._discard=false;
                self._data._setDiscardBit=true;

            },unlockInterval);
        },

        __setVisibility:function(template){
            if(this.options.autoRender && this.options.setVisibility===true){
                this._setVisibility(template);
            }
        },

        _setVisibility:function(template){
            if(template===undefined){
                template=this._data.templateNode;
            }
            template.addClass('visible');
            this.element.attr('loaded', true);
        },



        /**
         * two-way binds a model to the template DOM fragment
         * @param fragment
         * @param index
         * @private
         */
        __bindModel:function(fragment,index){
            var self=this;
            var $scope=this.$scope;
            var contextIndex=0;
            var modelPathTree=[];
            var pathObservers=this._data.pathObservers;
            var templateNode=this._data.templateNode;
            if(!index && this.options.scope){
                setModelPath(0,this.options.scope,null);
            }
            /**
             *  pushes an object representing the resolved model path for the currently traversed node
             *  to the modelPathTree array
             *
             *  modelPathTree=array of {index:<number>,context:<string>,cxt:<array>,modelIndex:<number}}
             *  a modelPathTree and a key, for example, gives you a resolvable path for a node that can be passed to a pathObserver
             *
             *  the modelPathTree array records the resolved model path for each context/section in the current node tree hierarchy
             * @param cxtIndex {number} context/section depth
             * @param context {string} context/section name
             * @param modelIndex {number} model depth
             */
            function setModelPath(cxtIndex,context,modelIndex){
                var path_=self.__getTemplateContextArray();
                if(path_ && path_.length > 0){
                    path_.forEach(function(obj){
                        if(obj.index===cxtIndex && obj.context===context){
                            var cxt={
                                index:cxtIndex,
                                context:obj.context,
                                cxt:obj.cxt,
                                modelIndex:modelIndex
                            };
                            modelPathTree.push(cxt);

                        }
                    });
                }
            }

            /**
             * returns the last element of the modelPathTree array
             * @returns {Object}
             */
            function getLastRecordedModelPath(){
                return (modelPathTree.length > 0) ? modelPathTree[modelPathTree.length -1] : null;

            }

            /**
             * get context array by depth
             * @param cxtIndex{number}
             * @returns {Array}
             */
            function getModelContextByDepth(cxtIndex){
                var arr=[];
                var path_=self.__getTemplateContextArray();
                if(path_ && path_.length > 0){
                    path_.forEach(function(obj){
                        if(obj.index===cxtIndex){
                            arr.push(obj);
                        }
                    });
                }

                return arr;
            }

            /**
             * returns the context depth of a ui-model node relative to parent ui-template node
             * @param node {object} HTMLElement
             * @returns {number}
             */
            function modelDepth(node) {
                var depth = 0;
                var templateNode_ = templateNode[0];
                //simply get the parent of the current node until we reach the ui-template node.
                //test each parent for model node tag or attribute
                while (!(node===templateNode_)) {
                    node = $(node).parent()[0];
                    if(node.tagName==='UI-MODEL' || node.hasAttribute('model-id')){
                        depth++;
                    }
                }
                return depth;
            }


            /**
             * delete branches from tree that have index greater than the passed context index
             * @param cxtIndex
             */
            function popModelPathTree(cxtIndex){
                if(modelPathTree.length > 0){
                    _.remove(modelPathTree,function(obj){
                        return (obj.index > cxtIndex);
                    })
                }
            }
            function clearModelPathTree(){
                modelPathTree.length=0;
            }


            /**
             * sets the modelPathTree for the traversed node and passes any nodes with attributes to the parseNodeAttributes function
             * @param node {Object}
             * @private
             */
            function parseNode(node){

                //if <ui-model> node only
                if((node.tagName && node.tagName.toLowerCase()==='ui-model') ||(node.hasAttribute && node.hasAttribute('model-id'))){

                    /* resolve the model path for any <ui-model> node and insert into the modelPathTree.
                     The modelPathTree, along with any given node's data attributes(data-key=,data-attribute=),
                     is sufficient to set a pathObserver for a the given node within the node hierarchy
                     */

                    /* current context depth */
                    contextIndex=modelDepth(node);

                    var lastRecordedContext=getLastRecordedModelPath();
                    //if current depth less than last recorded depth, pop modelPathTree back to current depth
                    if(lastRecordedContext && lastRecordedContext.index > contextIndex){
                        popModelPathTree(contextIndex);
                    }


                    /* current model index.
                     NOTE: model index==applicable $scope index. it has no relation to any persistent backend index */
                    var parent=(contextIndex===0) ? self._data.templateNode[0] : $(node).parents(self._data.modelNodeSelector)[0];
                    /*  if there is only a single context at the tree depth, model index = <ui-model> DOM child index

                     Pagination NOTE: it is assumed pagination loads in a new scope with a different paginated view; two-way data-binding
                     will not work for $scope pagination, the nodes will not be synced with the $scope
                     */
                    if(parent===undefined){
                        parent=self._data.templateNode[0];
                    }
                    var modelNodeSelector = self._data.modelNodeSelector;
                    var modelNodes = $(parent).closestChildren(modelNodeSelector);
                    var modelIndex=modelNodes.index($(node));

                    //check if more than one context for this tree depth
                    var contextArr_=getModelContextByDepth(contextIndex);
                    var cxt_={};

                    if(contextArr_ && contextArr_.length > 1){
                        //multiple contexts at this tree depth

                        /* we have to correct model index, since it is calculated by simple children index in the DOM
                         for multiple contexts at the same depth, the model index is no longer synced with the DOM index
                         __getCurrentContextModelPath returns the correct model index for the context based on the DOM child index
                         and the $scope
                         */
                        cxt_=self.__getCurrentContextModelPath(modelPathTree,contextIndex,contextArr_,modelIndex);

                        if(lastRecordedContext && contextIndex > lastRecordedContext.index){
                            popModelPathTree(contextIndex);
                            setModelPath(contextIndex,cxt_.context,cxt_.modelIndex);

                        }else{
                            modelPathTree.pop();
                            setModelPath(contextIndex,cxt_.context,cxt_.modelIndex);
                        }

                        /* if current context tree depth greater than last recorded, just set the model path */
                    }else if(lastRecordedContext && contextIndex > lastRecordedContext.index) {
                        setModelPath(contextIndex, contextArr_[0].context, modelIndex);
                        //if last record but same depth as last record, pop and set:this refreshes model index
                    }else if(lastRecordedContext){
                        modelPathTree.pop();
                        setModelPath(contextIndex,contextArr_[0].context,modelIndex);
                        //if no last record, simply set
                    }else if(!lastRecordedContext && contextArr_.length > 0){
                        setModelPath(contextIndex,contextArr_[0].context,modelIndex);
                    }
                }else{

                    /* get reference to parent ui-model node */
                    var parent = $(node).parents(self._data.modelNodeSelector)[0];
                    /* get context index */
                    if(parent){
                        contextIndex=modelDepth(parent);

                    }else{
                        contextIndex=0;
                        clearModelPathTree();
                    }
                    var lastRecordedContext=getLastRecordedModelPath();
                    //if current depth less than last recorded depth, pop modelPathTree
                    if(lastRecordedContext && lastRecordedContext.index > contextIndex){
                        popModelPathTree(contextIndex);
                    }

                }

                //for non-textNodes with attributes
                if (node.nodeType !== 3) {
                    if (node.hasAttributes && node.hasAttributes()) {
                        parseNodeAttributes(node);
                    }
                }
            }

            /**
             * parses a node attributes to send for text binding or attribute binding
             * @param node {Object}
             * @private
             */
            function parseNodeAttributes(node){
                var id=self._data.scopeId;
                if(id===undefined){
                    id='id';
                }
                var key,keys,attr;
                $.each(node.attributes,function(i,attribute){
                    try{
                        if(attribute && attribute!==undefined){
                            if(attribute.name.indexOf('model')===0){
                                key=id;
                                attr=attribute.name;
                                var tuple_=[attr,key];
                                bindAttributeObserver(node,tuple_,attribute.value);
                            }else if(attribute.name.indexOf('data-bind')===0){
                                var values=attribute.value.split(',');

                                if(values.length){
                                    values.forEach(function(val){
                                        val=val.trim();
                                        var ntuple=val.split(':');
                                        var bindingType=ntuple[0];
                                        (bindingType==='text') ? bindTextNodeObserver(node,ntuple) : bindAttributeObserver(node,ntuple);
                                    });
                                }
                            }
                        }

                    }catch(ex){
                        console.log(ex);
                    }
                });


                //set index path for ui-model nodes
                if ((node.tagName && node.tagName.toLowerCase() === 'ui-model') || (node.hasAttribute('model-id'))) {
                    setData(node);
                }
            }

            /**
             * creates a textNode and path observer for a bindable model property
             * @param node {Object}
             * @param tuple {Array}
             */
            function bindTextNodeObserver(node,tuple){
                //var values_=tuple.split(':');
                var key=tuple[1];
                var fn={};
                if(tuple.length > 2){
                    fn=parseFunction(tuple[2]);
                }
                var $cache=self._data.$cache;
                var previouslyBound=self._data.previouslyBound;
                var path = self.__createPath(modelPathTree, $scope,key);
                var value = utils.objectPropertyByPath($scope, path);
                /* if the tuple has a function attached, evaluate the value from the function */
                if(!_.isEmpty(fn)){
                    value=eval_(value,fn,self);
                    //update the path value of scope
                    utils.assignValueToPath($scope,path,value);
                }
                var $node=$(node);
                var text,$text;
                /* if fragment has been previously bound, we select textNode, otherwise create it */
                if(previouslyBound){
                    var $textNodes=$node.findTextNodes();
                    $.each($textNodes,function(i,t){
                        if(t.textContent===value){
                            $text=$(t);
                        }
                    });
                    text=($text && $text[0]) ? $text[0] : self.__createTextNode($node,node,value);
                }else{
                    /* create and append */
                    text=self.__createTextNode($node,node,value);
                }
                $cache.set(text,{observers:path});
                var obsPath=utils.observerMapPath(path);
                var observer = new PathObserver($scope, obsPath);
                text.bind('textContent', observer);
                var observer_ = {
                    type: 'text',
                    value:'textContent',
                    node: text,
                    path:path,
                    observer: observer

                };

                pathObservers.push(observer_);
            }

            /**
             * bind path observers to attributes
             * @param node {Object}
             * @param tuple {Array}
             * @param mId {String}
             */
            function bindAttributeObserver(node,tuple,mId){
                var attribute=tuple[0];
                var key=tuple[1];
                var fn={};
                if(tuple.length > 2){
                    fn=parseFunction(tuple[2]);
                }
                var $cache=self._data.$cache;
                var observers_,id_;
                var path = self.__createPath(modelPathTree, $scope, key);
                var value = utils.objectPropertyByPath($scope, path);


                /* if the tuple has a function attached, evaluate the value from the function */
                if(!_.isEmpty(fn)){
                    value=eval_(value,fn,self);
                    //update the path value of scope
                    utils.assignValueToPath($scope,path,value);
                }
                var data=$cache.get(node);
                if(data){
                    observers_=data.observers;
                    id_=data.id;
                }else{
                    id_=mId;
                }
                if(observers_ && observers_.length > 0){
                    var obj_=null;
                    observers_.forEach(function(o){
                        if(o.value===attribute){
                            o.path=path;
                            o.value_=value;
                            obj_=o;
                        }
                    });
                    if(!obj_){
                        obj_={
                            value:attribute,
                            value_:value,
                            path:path
                        };
                        observers_.push(obj_);
                    }
                }else{
                    observers_=[];
                    obj_={
                        value:attribute,
                        value_:value,
                        path:path
                    };
                    observers_.push(obj_);
                    $cache.set(node,{observers:observers_,id:id_});
                }
                var obsPath=utils.observerMapPath(path);
                var observer = new PathObserver($scope, obsPath);
                node.bind(attribute, observer);
                var observer_ = {
                    type: 'attribute',
                    value:attribute,
                    node: node,
                    path:path,
                    observer: observer

                };

                pathObservers.push(observer_);
            }

            /* parse a stringified function into method name + arg list */
            function parseFunction(sFunc){
                var argList;
                var args=sFunc.match(/\((.*?)\)/g);
                if(!args){
                    args='';
                }
                var func=sFunc.replace(args,'');
                args=args.replace('(','');
                args=args.replace(')','');
                if(args.length < 1){
                    argList=[]
                }else{
                    argList=args.split(',');
                }

                return{
                    func:func,
                    args:argList
                }
            }

            /* evaluates a template value from a passed function */
            function eval_(value,fn,that){
                var func=fn.func;
                var f,args;
                if(window.dust.helpers.inline[func]){//dust.helpers.inline
                    f=window.dust.helpers.inline[func];
                    args=fn.args;
                    (args.length >0) ? args.unshift(value) : args.push(value);
                    return f.apply(this,args);
                }else if(window[func]){//window
                    f=window[func];
                    args=fn.args;
                    (args.length >0) ? args.unshift(value) : args.push(value);
                    return f.apply(this,args);
                }else if(that[func]){ //controller instance prototype
                    f=that[func];
                    args=fn.args;
                    (args.length >0) ? args.unshift(value) : args.push(value);
                    return f.apply(that,args);
                }else{
                    return value;
                }

            }

            /**
             *  set the index path data for ui-model nodes
             * @param node {Object}
             */
            function setData(node){
                var $cache=self._data.$cache;
                var data=$cache.get(node);
                var observers,id;
                if(data){
                    observers=data.observers;
                    id=data.id;
                }
                var path = self.__createPath(modelPathTree,$scope);
                try{
                    index=utils.getIndexFromPath(path);
                }catch(ex){

                }

                $cache.set(node,{path:path,id:id,index:index,observers:observers});

            }


            /* walk the dom fragment with parseNode as the function */
            this.__traverseDOM(fragment,parseNode);

        },

        /**
         * standard walk-the-dom recursion
         * @param node {Element}
         * @param func {Function}
         * @private
         */
        __traverseDOM:function(node,func){
            func(node);
            node = node.firstChild;
            while (node) {
                this.__traverseDOM(node, func);
                node = node.nextSibling;
            }
        },

        /** //TODO: enable multiple keys mappings to text nodes within an element: ex: <h2 data-key="firstName,lastName">Hello, {firstName} {lastName}</h2>
         *  //currently, to have correctly functioning two-way binding, you would have to do something like:
         *  //<h2>Hello, <span data-key="firstName">{firstName}</span> <span data-key="lastName">{lastName}</span></h2>
         *  //not a show-stopper, but it is a bit of an inconvenience
         *
         * create text node
         * @param $node {Object} jQuery
         * @param node {Object} Element
         * @param value {String}
         * @returns {Text} {Object} jQuery
         * @private
         */
        __createTextNode: function($node,node,value){
            $node.text($node.text().replace(value, ''));
            var text = document.createTextNode(value);
            node.appendChild(text);

            return text;
        },

        /**
         * returns the context tree array from the contextKeyArray(i.e., returns the last item in the contextKeyArray)
         * @returns {Array}
         * @private
         */
        __getTemplateContextArray:function(){
            var contextKeyArray=this._data.contextKeyArray;
            return (contextKeyArray && contextKeyArray.length > 0) ? contextKeyArray[contextKeyArray.length -1] : [];
        },

        /**
         * returns a resolved path based on the passed modelPathTree and key
         * @param modelPathTree {Array}
         * @param key {String}
         * @returns {string} path
         * @private
         */
        __createPath: function(modelPathTree,$scope,key){
            var path='';
            modelPathTree.forEach(function(obj){
                if (typeof obj.modelIndex !== 'undefined') {
                    var test = path + obj.context;
                    path =(utils.isPropertyArrayByPath($scope,test)) ? path + obj.context + '.' + obj.modelIndex + '.' : path + obj.context + '.';
                    //path += obj.context + '.' + obj.modelIndex + '.';
                }else{
                    path += obj.context + '.'
                }
            });

            (typeof key !=='undefined') ? path+=key : path=path.substring(0, path.length - 1);
            return path;
        },

        /**
         * returns a resolved context path based on the passed modelPathTree context index, and context
         * @param modelPathTree {Array}
         * @param cxtIndex {Number}
         * @param context {String}
         * @returns {String} path
         * @private
         */
        __createPathByContextIndex: function(modelPathTree,cxtIndex,context){
            var path='';
            modelPathTree.forEach(function(obj){
                if(obj.index <= cxtIndex){
                    path += obj.context + '.' + obj.modelIndex + '.';
                }

            });
            path += context;

            return path;
        },


        /**
         * @param modelPathTree {Array}
         * @param cxtIndex {Number}
         * @param contextArray {Array}
         * @param index {Number}
         * @returns {*}
         * @private
         */
        __getCurrentContextModelPath: function(modelPathTree,cxtIndex,contextArray,index){
            var self=this;
            var $scope=this.$scope;
            /*we need to calculate context/array lengths for contexts with equal hierarchy. The model index of the current
             node will then allow us to determine which context we are currently in.

             Hence, we need the resolved path for the context index==cIdx == (cxtIndex >0)? (cxtIndex-1) : 0;

             */

            var cIdx=(cxtIndex>0) ? cxtIndex-1 : 0;
            var pathArray=[];
            contextArray.forEach(function(obj){
                var path=self.__createPathByContextIndex(modelPathTree,cIdx,obj.context);
                var length=utils.arrayPropertyLengthByPath($scope,path);
                pathArray.push({length:length,context:obj.context,cxt:obj.cxt});
            });


            if(pathArray.length > 1){
                var obj_={};
                var cumlativeLength=0;

                for(var i=0;i<pathArray.length;i++){
                    if((index < pathArray[i].length + cumlativeLength)|| (!pathArray[i].length)){
                        obj_.modelIndex=index-cumlativeLength;
                        obj_.context=pathArray[i].context;
                        obj_.cxt=pathArray[i].cxt;
                        obj_.index=cxtIndex;
                        break;
                    }else{
                        cumlativeLength +=pathArray[i].length;
                    }
                }
                return obj_;
            }else{
                return {
                    modelIndex:index,
                    context:contextArray[0].context,
                    cxt:contextArray[0].cxt,
                    index:contextArray[0].index
                };
            }
        },

        /**
         * get parent model('ui-model') node of a node
         * @param node {Object}
         * @returns {Object}
         * @private
         */
        __getParentModelNode:function(node){
            var parent=$(node).parents(this._data.modelNodeSelector);
            if(parent[0]){
                return parent[0];
            }else{
                return this._data.templateNode[0];
            }
        },

        /**
         * onAddedNodes
         * @param added {Array}
         * @private
         */
        __addedNodes:function(added){
            if(this._data.Running){
                return;
            }
            if(this.__isModelList()){
                this.__rebind();
            }

        },

        /**
         * mutation handler for removed nodes.
         * deletes paths from the scope and rebinds path observers
         * @param removed{Array}
         * @private
         */
        __removedNodes:function(removed){
            /* exit if triggered during data-binding */
            return;
            if(this._data.Running){
                return;
            }
            var $scope=this.$scope;
            var self=this;
            var rebind_;
            var boolRebind=false;
            for(var i=0;i<removed.length;i++){
                var $cache=this._data.$cache;
                var node=removed[i];
                var observers=$cache.get(node);
                if(observers){
                    rebind_=this.__parseObservers(node,$scope);
                    if(rebind_){
                        boolRebind=true;
                    }
                }else{
                    var children=$(removed).findTextNodeDescendants();
                    if(children && children.length > 0){
                        $.each(children,function(i,obj){
                            rebind_=self.__parseObservers(obj,$scope);
                            if(rebind_){
                                boolRebind=true;
                            }
                        });
                    }
                }
            }

            if(boolRebind){
                this.__rebind();
            }

            this._onRemovedNodes(removed);
        },

        /**
         * performs a $scope splice or delete based on node path
         * @param node {Object}
         * @param $scope {Object}
         * @private
         */
        __parseObservers:function(node,$scope){
            var $cache=this._data.$cache;
            var observers=$cache.get(node);
            if(typeof observers !=='undefined'){
                var path=observers.path;
                /* determine if path if part of an array or object
                 if object, delete property
                 if array, splice
                 */
                //
                var isArray=utils.isPathInArray(path);
                (isArray) ? this.__spliceArray($scope,path) : utils.deleteObjectPropertyByPath($scope,path);
                return true;
            }else{
                return false;
            }
        },

        /**
         * splice an array $scope property
         * @param $scope {Object}
         * @param path {String}
         * @private
         */
        __spliceArray:function($scope,path){
            var index=utils.getIndexFromPath(path);
            if(index !== undefined){
                path=this.__parsePath(path,index);
                var arr=utils.objectPropertyByPath($scope,path);
                this._data._discard=false;
                this._data._setDiscardBit=false;
                arr.splice(index,1);
            }
        },

        /**
         * returns a path substring for the array property, removing the index of the array element
         * @param path {String}
         * @param index {Number}
         * @returns {string}
         * @private
         */
        __parsePath:function(path,index){
            return path.substring(0, path.length - (index.toString().length + 1));
        },


        /**
         * rebinds the pathObservers, called after a model removal or addition
         * @private
         */
        __rebind: function(){
            var template=this._data.templateNode;
            this.__unbindPathObservers();
            this.__databind(template);
        },


        /**
         * $scope change callback handler mediator
         * @param result {Object}
         * @private
         */
        __onScopeChange: function(result){
            if(result.removed && result.removed.length && result.removed.length > 0) {
                this.__onRemoved(result.removed)
            }
            if(this._data.drop){
            }
            this._onScopeChange(result);
        },


        /**
         * removes a ui-model node from the template by path
         * @param path {String}
         * @private
         */
        __onListRemove: function(path){

            var self=this;
            var fragment=this._data.templateNode[0];
            var $cache=this._data.$cache;

            function removeNode(node){
                if((node.tagName && node.tagName.toLowerCase()==='ui-model') ||(node.hasAttribute && node.hasAttribute('model-id'))){
                    var observers=$cache.get(node);
                    var index=observers.index;
                    if(index===path){
                        node.remove();
                        self._data.previouslyBound=true;
                        self.__rebind();
                    }
                }
            }

            /* walk the dom fragment with removeNode as the function */
            this.__traverseDOM(fragment,removeNode);

        },

        /**
         * adds a ui-model node to the template as the result of an array operation
         * @param path {String} the path reference to the array within the $scope
         * @param section {String} the section name
         * @param op {String} operation: push or unshift
         * @private
         */
        __onListAdd: function(path,section,op){

            var self=this;

            /* get template */
            var templateName=this._compileFragment(path,section);

            /* get parent model node of the array */
            var parent=this.__getParent(path,section);

            /* get insertion index */
            var insertionIndex=(op==='push' || op==='concat') ? this.__getPushInsertionIndex(path,section) : this.__getUnshiftInsertionIndex(path,section);

            /* get model */
            var model=this.__getModelFromPath(path,op);

            /* render */
            var opts={};
            opts.template=templateName;
            opts.model=model;
            opts.context=section;
            opts.parse=false;
            this._renderTemplate(opts,function(err,out){
                if(!err){
                    self.__insertRenderedTemplate(out,parent,insertionIndex);
                }
            });

        },

        /**
         * compile a fragment of an existing template into provider cache, by path and section
         * @param path {string]
         * @param section {string}
         * @returns {string}
         * @private
         */
        _compileFragment:function(path,section){
            //todo verify fragment has not previously been compiled
            var provider=this.options.$providers.template;
            var id=this._data.templateId;
            var templateName = id + '-' + section;
            var fragment=this._getFragmentById(id);
            var match='{#' + section + '}.(.*?){\/' + section + '}';
            var partial=fragment.match(new RegExp(match,'g'));
            /* if number of matches > 1, assign correct partial */
            var partial_=(partial.length > 1) ? this.__getPartial(partial,path,section) : partial[0];
            var compiled=provider.compile(partial_,templateName);
            provider.loadSource(compiled);
            return templateName;
        },

        /**
         * get the model from the array path based on operation(push==last element, unshift=first element)
         * @param path {String}
         * @param operation {String}
         * @returns {Object}
         * @private
         */
        __getModelFromPath:function(path,operation){
            var $scope=this.$scope;
            var arr=utils.objectPropertyByPath($scope,path);
            //return (operation==='push') ? arr[arr.length-1] : arr[0];
            var ret;
            if(operation==='push'){
                return arr[arr.length-1];
            }else if(operation==='unshift'){
                return arr[0];
            }else{
                return arr;
            }
        },

        /**
         * returns the correct ui-model template fragment for section depths that have more than one context
         * @param partial {Array}
         * @param path {String}
         * @param section {String}
         * @returns {String} ui-model template fragment
         * @private
         */
        __getPartial:function(partial,path,section){
            var match = section + '.';
            var matches=path.match(new RegExp(match,'g'));
            var length=matches.length;
            return partial[length-1];
        },

        /**
         * gets the parent ui-model node
         * @param path {String}
         * @returns {Object} node
         * @private
         */
        __getParent:function(path){
            var paths=path.split('.');
            if (paths.length < 2){
                return this._data.templateNode[0];
            }else{
                var path_=this.__getParentPath(paths);
                return this.__getParentByPath(path_);
            }
        },

        /**
         * gets the parent model node path
         * @param arr {Array}
         * @returns {string}
         * @private
         */
        __getParentPath:function(arr){
            var length=arr.length-1;
            var path='';
            for(var i=0;i<length;i++){
                path+=arr[i] + '.';
            }
            return path.substring(0,path.length-1);
        },

        /**
         * runs the walk the dom routine to find the ui-model parent node(finds it by the set index path in the dom cache store)
         * @param path {String}
         * @returns {*}
         * @private
         */
        __getParentByPath:function(path){
            var fragment=this._data.templateNode[0];
            var $cache=this._data.$cache;
            var node_;
            function getNode(node){
                if((node.tagName && node.tagName.toLowerCase()==='ui-model') ||(node.hasAttribute && node.hasAttribute('model-id'))){
                    var observers=$cache.get(node);
                    var path_=observers.path;
                    if(path_===path){
                        node_=node;
                    }
                }
            }

            this.__traverseDOM(fragment,getNode);

            return node_;
        },

        /**
         *
         * for push: gets the insertion index to insert ui-model node into ui-model children
         * @param path {String}
         * @param section {String}
         * @returns {number}
         * @private
         */
        __getPushInsertionIndex:function(path,section){
            var $scope=this.$scope;
            var arr=this.__getContextArrayFromPath(path);
            var sectionContextProp=this.__getSectionContextProp(arr,section);
            if(sectionContextProp.count===1){
                return -1;
            }else{
                if(sectionContextProp.position===sectionContextProp.count -1){
                    return -1;
                }else{
                    var paths=path.split('.');
                    var parentPath=this.__getParentPath(paths);
                    var index=0;
                    for(var i=0;i<sectionContextProp.position + 1;i++){
                        var path_=(parentPath.length && parentPath.length > 0) ? parentPath + '.' + sectionContextProp.cxt[i] : sectionContextProp.cxt[i];
                        var length = utils.arrayPropertyLengthByPath($scope,path_);
                        index=index + length;
                    }
                    return index;
                }
            }
        },

        /**
         * for unshift: gets insertion index to insert ui-model node into a parent section's ui-model children
         * @param path {String}
         * @param section {String}
         * @returns {number}
         * @private
         */
        __getUnshiftInsertionIndex:function(path,section){
            var $scope=this.$scope;
            var arr=this.__getContextArrayFromPath(path);
            var sectionContextProp=this.__getSectionContextProp(arr,section);
            if(sectionContextProp.count===1){
                return 0;
            }else{

                var paths=path.split('.');
                var parentPath=this.__getParentPath(paths);
                var index=0;
                for(var i=0;i<sectionContextProp.position;i++){
                    var path_=parentPath + '.' + sectionContextProp.cxt[i];
                    var length = utils.arrayPropertyLengthByPath($scope,path_);
                    index=index + length;
                }
                return index;

            }
        },

        /**
         * returns a prop object for a template section, given a child context within that section
         * count: number of child contexts
         * position: position of our section in the list
         * cxt: array of the one-level down child contexts
         * @param arr {Array}
         * @param section {String}
         * @returns {Object}
         * @private
         */
        __getSectionContextProp:function(arr,section){
            var prop={};
            prop.count=arr.length;
            prop.cxt=arr;
            prop.position= _.indexOf(arr,section);

            return prop;
        },



        __getParentIndex:function(path){
            var paths=path.split('.');
            return path[0] + '.' + paths[1];
        },

        /**
         * returns the array of context blocks for a path
         * @param path {String}
         * @returns {Array}
         * @private
         */
        __getContextArrayFromPath:function(path){
            var self=this;
            var arr=[];
            var paths=path.split('.');
            paths.forEach(function(s){
                if(!self.__isNumeric(s)){
                    arr.push(s);
                }
            });

            var depth=arr.length-1;
            var contextArray=this.__getTemplateContextArray();
            var cxtArray=[];
            contextArray.forEach(function(obj){
                if(obj.index===depth){
                    cxtArray.push(obj.context);
                }
            });

            return cxtArray;
        },


        /**
         * numeric check for a string
         * @param p
         * @returns {boolean}
         * @private
         */
        __isNumeric:function(p){
            var p_ = parseInt(p);
            return !(isNaN(p_));
        },

        /**
         * inserts rendering into the template DOM fragment, discarding text nodes
         * @param out {Array}
         * @param parent {Object}
         * @param index {Number}
         * @private
         */
        __insertRenderedTemplate:function(out,parent,index){
            var fragment,$fragment;
            var $parent=$(parent);
            var models=$parent.closestChildren(this._data.modelNodeSelector);
            $fragment=this._fragmentModelParser(out);
            fragment=$fragment[0];
            var model;
            if(index===-1){
                $parent.append($fragment);
            }else if(index===0){
                model=models[0];
                parent.insertBefore(fragment, model);
            }else{
                model=models[index];
                parent.insertBefore(fragment, model);
            }

            this.__rebind();
        },

        _fragmentModelParser:function(fragment){
            var doc = this._DOMParser(fragment);
            return $(doc).find('[model-id]');
        },


        /**
         * removes
         * @param removed
         * @private
         */
        __onRemoved:function(removed){
            var self=this;
            var rebind=false;
            var $cache=self._data.$cache;
            var id=this.options.idProp;
            if(id===undefined){
                id='id';
            }
            if(this.__isModelList()){
                removed.forEach(function(obj){
                    var models=self.__templateModels();
                    if(models && models.length > 0){
                        $.each(models,function(i,model){
                            var data=$cache.get(model);
                            if(data !==undefined && data.id !==undefined){
                                if(data.id===obj[id]){
                                    model.remove();
                                    rebind=true;
                                }
                            }else if(data && data.observers && data.observers.length){
                                data.observers.forEach(function(o){
                                    var id_=obj[id];
                                    if(o.value==='model-id' && o.value_===id_){
                                        model.remove();
                                        rebind=true;
                                    }
                                })
                            }
                        });
                    }
                });

                if(rebind){
                    self.__rebind();
                }
            }
        },


        /**
         * unbind path observers
         * @private
         */
        __unbindPathObservers:function(){
            var pathObservers=this._data.pathObservers;
            if(pathObservers && pathObservers.length && pathObservers.length >0){
                pathObservers.forEach(function(obj){
                    obj.observer.close();
                });
                utils.emptyArray(pathObservers);
            }
        },

        /**
         * unbind DOM mutation observer
         * @private
         */
        __unbindDOMObserver:function(){
            var DOMObserver=this._data.DOMObserver;
            if(DOMObserver){
                DOMObserver.disconnect();
            }
        },

        /**
         * unbind 2-way template binding
         * @private
         */
        __disposeTemplate: function(){
            this.__unbindDOMObserver();
            this.__unbindPathObservers();
        },

        /**
         * rebind template binding
         * @param render
         * @private
         */
        __rebindTemplate:function(render){
            if(this._data._watched){
                return false;
            }
            var repeat;
            if(typeof render==='undefined' || !render){
                repeat=true;
            }
            var template=this.__getTemplateNode();
            if(template[0]){
                this.__bind(repeat);
            }else if(this.options.loadedTemplate){
                this.__watchForTemplateInstance(repeat);
            }

            return true;
        },


        /**
         * watches for creation of a template instance before
         * firing template rebinding....e.g., ui-template tag is not initially part of the element DOM,
         * but included in the template rendered in by an element
         * @param repeat {Boolean}
         * @private
         */
        __watchForTemplateInstance:function(repeat){
            var self=this;
            var intervalId=setInterval(function(){
                var template=self.__getTemplateNode();
                if(template[0]){
                    clearInterval(intervalId);
                    self.__bind(repeat);
                }
            },100);
        },

        /**
         * reconnect disconnected MutationObserver
         * @private
         */
        __reconnect:function(){
            var observer=this._data.DOMObserver;
            if(observer){
                var template=this._data.templateNode;
                if(template[0]){
                    var node=template[0];
                    observer.observe(node, {childList: true,subtree:true});
                }
            }
        },

        /**
         *
         * @param delay {Number}
         * @private
         */
        _printPathObservers:function(delay){
           var self=this;
           if(delay===undefined){
               delay=0;
           }
            setTimeout(function(){
                console.log(self._data.pathObservers);
            },delay);
        },

        /**
         *
         * @param node {Object|Element}
         * @returns {String}
         * @private
         */
        _getModelIdByNode:function(node){
            return node.getAttribute('model-id');
        },

        /**
         *
         * @param target {Object} element
         * @returns {String}
         * @private
         */
        _getModelIdByTarget:function(target){
            var $target=$(target);
            var model=$target.parents('[model-id]');
            return model.attr('model-id');
        },

        /**
         * returns the a model node cache object
         * @param node {Object} Element
         * @returns {Object}
         * @private
         */
        _getModelNodeCache:function(node){
            var $cache=this._data.$cache;
            return $cache.get(node);
        },

        /**
         * element cleanup onDelete
         * @private
         */
        _dispose:function(){
            this.__disposeTemplate();
        },


        _onDOMMutation: $.noop,

        _onRemovedNodes: $.noop,

        _onScopeChange: $.noop,

        /**
         * delete node facade
         * used to delete a model node from DOM via splice or shift operation passed in a function
         * NOTE: if you don't use the facade, then its up to the dev to handle $scope changes in terms of removing deletions from DOM
         * @param func {Function}
         * @public
         */
        $deleteNodes:function(func){
            var self=this;
            var path;
            this.__unbindPathObservers();
            var $scope=this.$scope;
            func.call(this);

            /* stringify passed function */
            var str=func.toString();

            /* splice */
            path=str.match(/scope.(.*?).splice/g);
            if(path && path.length){
                path.forEach(function(s){
                    s= s.replace('scope.','');
                    s= s.replace('.splice','');
                    var pos1=str.indexOf('splice(');
                    var pos2=str.indexOf(',',pos1);
                    pos1=pos1 + 7;
                    var index=str.substring(pos1,pos2);
                    var path_=s + '.' + index;
                    path_=path_.replace(/]/g,'');
                    path_=path_.replace(/[[\]]/g,'.');

                    /* remove from DOM */
                    self.__onListRemove(path_);

                })
            }

            /* shift */
            path=str.match(/scope.(.*?).shift/g);
            if(path && path.length){
                path.forEach(function(s){
                    s= s.replace('scope.','');
                    s= s.replace('.shift','');
                    var path_=s + '.0';
                    path_=path_.replace(/]/g,'');
                    path_=path_.replace(/[[\]]/g,'.');

                    /* remove from DOM */
                    self.__onListRemove(path_);

                })
            }
        },

        /**
         * add node facade
         * adds a ui-model node to the template DOM as a result of a push or unshift operation on the $scope passed in a function
         * NOTE: if you don't use the facade, then its up to the dev to handle $scope changes in terms of rendering additions
         * @param func {Function}
         */
        $addNodes:function(func){
            var self=this;
            var path;
            this.__unbindPathObservers();
            var $scope=this.$scope;
            func.call(this);

            /* stringify passed function */
            var str=func.toString();

            /* push */
            path=str.match(/scope.(.*?).push/g);

            if(path && path.length){
                path.forEach(function(s){
                    s= s.replace('scope.','');
                    s= s.replace('.push','');
                    var path_=s;
                    path_=path_.replace(/]/g,'');
                    path_=path_.replace(/[[\]]/g,'.');
                    var paths=path_.split('.');
                    var section=paths[paths.length-1];

                   /* add the model node to the template */
                    self.__onListAdd(path_,section,'push');
                })
            }

            /* unshift */
            path=str.match(/scope.(.*?).unshift/g);
            if(path && path.length){
                path.forEach(function(s){
                    s= s.replace('scope.','');
                    s= s.replace('.unshift','');
                    var path_=s;
                    path_=path_.replace(/]/g,'');
                    path_=path_.replace(/[[\]]/g,'.');
                    var paths=path_.split('.');
                    var section=paths[paths.length-1];

                    /* add the model node to the template */
                    self.__onListAdd(path_,section,'unshift');
                })
            }

            path=str.match(/scope.(.*?).concat/g);
            if(path && path.length){
                path=str.replace(/scope.(.*?).=/g,'');
                path=path.match(/scope.(.*?).concat/g);
                if(path && path.length){
                    path.forEach(function(s){
                        s= s.replace('scope.','');
                        s= s.replace('.concat','');
                        var path_=s;
                        path_=path_.replace(/]/g,'');
                        path_=path_.replace(/[[\]]/g,'.');
                        var paths=path_.split('.');
                        var section=paths[paths.length-1];
                        /* add the model nodes to the template */
                        self.__onListAdd(path_,section,'concat');
                    })
                }
            }
        },

        $empty:function(){
            var template=this.__getTemplateNode();
            if(this.__isModelList()){
                var prop=(this.options.scope !==undefined) ? this.options.scope : utils.objectPropertyByIndex(this.$scope,0);
                this.$scope[prop].length=0;
                template.empty();
            }else{
                this.$scope={};
                template.empty();
            }
        },

        $unbindTemplate: function(){
            this.__disposeTemplate();
        },

        $rebindTemplate:function(){
            this.__rebindTemplate();
        },

        $renderTemplate:function(opts,callback){
            opts.parse=false;
            this.__renderTemplate(opts,callback);
        },

        $rebind:function(){
            if(!this._data._watched){
                var template=this._data.templateNode;
                this.__unbindPathObservers();
                this.__databind(template,undefined,true);
                this.__reconnect();
            }
        }
    });

    return $;

}));


/*
 * =============================================================
 * elliptical-pubsub
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'),require('elliptical-event'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element','elliptical-event'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($,root.elliptical.Event);
    }
}(this, function ($,Event) {
    var utils= $.elliptical.utils;
    var _=utils._;

    $.element('elliptical.pubsub',{

       options:{
           channel:null,
           eventBlock:false
       },

        _initElement:function(){
            this._data.subscriptions=[];
            this._subscriptions();
        },

        /**
         * publish data to channel
         * @param channel {String}
         * @param data {Object}
         * @param delay {Number}
         * @param force {Boolean}
         * @private
         */
        _publish: function(channel,data,delay,force){
            //support 2-4 params
            var length=arguments.length;
            if(length===2){
                delay=0;
                force=false;
            }else if(length===3){
                if(typeof delay==='boolean'){
                    force=delay;
                    delay=0;
                }else{
                    force=false;
                }
            }

            if(!this.options.eventBlock || force){
                setTimeout(function(){
                    Event.emit(channel,data);
                },delay);
            }
        },

        /**
         * subscribe to data/message over channel
         * @param channel {String}
         * @param control {String} throttle/debounce
         * @param delay {Number}
         * @param fn {Function}
         * @private
         */
        _subscribe:function(channel,control,delay,fn){
            //support 2-4 params
            var length=arguments.length;
            if(length===2){
                fn=control;
                control=null;
                delay=null;

            }else if(length===3){
                fn=delay;
                delay=350;
            }

            var opts={};
            var func=null;
            if(control==='throttle'){
                func= _.throttle(fn,delay);
            }else if(control==='debounce'){
                opts.leading=true;
                opts.trailing=false;
                func= _.debounce(fn,delay,opts);
            }else{
                func=fn;
            }
            var sub={
                channel:channel,
                fn:func
            };
            if(!(this._data.subscriptions && this._data.subscriptions.length)){
                this._data.subscriptions=[];
            }
            this._data.subscriptions.push(sub);
            Event.on(channel,func);
        },

        _subscriptions: $.noop,

        /**
         * unbind subscriptions
         * @private
         */
        _unbindSubscriptions:function(){

            var subs=this._data.subscriptions;
            subs.forEach(function(obj){
                Event.off(obj.channel,obj.fn);
            });

        },

        _dispose:function(){
            this._unbindSubscriptions();
        }

    });

    return $;

}));

/*
 * =============================================================
 * elliptical-controller
 * =============================================================
 *
 * elliptical controller: the elliptical UI factory
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-template'),require('elliptical-pubsub'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-template','elliptical-pubsub'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var utils= $.elliptical.utils;
    var _=utils._;

    /* custom elements flag, selector definitions */
    var DataSelector_='[data-controller]';
    var Selector_='ui-controller';



    /**
     * define $.elliptical.controller...$.elliptical.controller will the base Object used by $.controller
     */
    $.element('elliptical.controller','ui-controller',[$.elliptical.template, $.elliptical.pubsub],{

        options:{
            context:null, //$$.elliptical.context
            scope:null,  //prop of context to bind
            dataBind:true,
            autoRender:undefined
        },

        /**
         * $.controller setup on $.element's init event
         * @private
         */
        _initElement:function(){
            var context=this.options.context;
            if(!context){
                context=window.$$.elliptical.context;
                if(context){
                    this.options.context=context;
                }
            }

            this._data.hasObserve= $.elliptical.hasObjectObserve;
            this.$viewBag=context;
            this.__setScope();

            this._initController();//initController is $.controller's init event
            this.__subscriber();
            this.__publisher();

        },

        /**
         * if a scope property has been declared, auto set the instance $scope; if a scope
         * property has not been declared, it is up the dev to set the $scope in the _initController event
         * @private
         */
        __setScope: function(){
            var context=this.options.context,//context attached to $$.elliptical.context
                scopeProp=this.options.scope; //context property to bind to the instance $scope

            if(this.$scope && scopeProp && context){
                this.$scope[scopeProp]=context[scopeProp];
            }

        },

        /**
         * $.controller init event
         */
        _initController: $.noop,


        /**
         * sets up pre-defined subscribe events on a defined channel
         * @private
         */
        __subscriber:function(){
            var self=this;
            var channel=this.options.channel;
            var event=this.options.event;
            this._data._synced=false;
            if(channel){
                if(event==='sync'){
                    this._subscribe(channel +'.sync',function(data){
                        if(!self._data._synced){
                            self._data._synced=true;
                            self.__disposeTemplate();
                            self.__destroyObservable();
                            self.$scope=data.$scope;
                            self.__setObservable();
                            self.__rebindTemplate();
                            self.__onSyncSubscribe(data.proto);
                        }

                    });
                }

                this._subscribe(channel + '.add',function(data){
                    self.__onAddSubscribe(data);
                });

                this._subscribe(channel + '.remove',function(data){
                    self.__onRemoveSubscribe(data);
                });

                this._subscribe(channel + '.change',function(data){
                    self.__onChangeSubscribe(data);
                });

                this._subscribe(channel + '.select',function(data){
                    self.__onSelectSubscribe(data);
                });
            }


        },

        /**
         * if a channel has been declared, publish the $scope to channel.sync
         * this allows different $.controllers and custom elements to share the same $scope
         * @private
         */
        __publisher:function(){
            var channel=this.options.channel;
            var event =this.options.event;
            var self=this;
            if(channel && !event){
                if(this._data.scopeObserver){
                    this._publish(channel + '.sync',{proto:this,$scope:this.$scope});
                }else{
                    var timeoutId=setInterval(function(){
                        if(self._data.scopeObserver){
                            clearInterval(timeoutId);
                            self._publish(channel + '.sync',{proto:self,$scope:self.$scope});
                        }
                    },500);
                }
            }
        },



        /**
         * publishes events to the declared channel and then executes this_super()
         * to fire parent __onScopeChange handler
         * @param result
         * @private
         */
        __onScopeChange:function(result){
            //if(this._data._discard){
                //return false;
            //}
            var self=this;
            var event =this.options.event;
            if(result.added && result.added.length){
                result.added.forEach(function(obj){
                    var channel=self.options.channel;
                    if(channel && channel !==undefined && event !=='sync'){
                        self._publish(channel + '.add',obj);
                    }
                });
            }

            if(result.removed && result.removed.length){
                result.removed.forEach(function(obj){
                    var channel=self.options.channel;
                    if(channel && channel !==undefined && event !=='sync'){
                        self._publish(channel + '.remove',obj);
                    }
                });
            }

            if(result.changed && result.changed.length){
                result.changed.forEach(function(obj){
                    var channel=self.options.channel;
                    if(channel && channel !==undefined && event !=='sync'){
                        self._publish(channel + '.change',obj);
                    }
                });
            }

            this.__$scopePropsChange(result);
            this._super(result);

            return true;
        },

        /**
         * shortcut for returning the changed $scope object props
         * useful for model objects, but not model lists
         * @param result {Array}
         * @private
         */
        __$scopePropsChange: function(result){
            var changed_=this._objectChange;
            var hasObserve=this._data.hasObserve;
            var propsChange=this._$scopePropsChange.bind(this);
            if(result.changed && result.changed.length){
                result.changed.forEach(function(obj){
                    var changed={};
                    if(hasObserve){
                        changed[obj.name]=obj.value;
                    }else{
                        changed=changed_(obj);
                    }
                    propsChange(changed);
                });
            }
        },

        _$scopePropsChange: $.noop,

        /**
         * returns the elliptical viewBag
         * @returns {*}
         * @private
         */
        _viewBag:function(){
            return $$.elliptical.context;
        },

        /**
         * trigger event
         * @param evt {String}
         * @param data {Object}
         * @private
         */
        _triggerEvent:function(evt,data){
            var Event= $.Event(evt);
            $(window).trigger(Event,data);
        },

        /**
         * component handler for channel.sync subscription
         * @param data {Object}
         * @component
         */
        __onSyncSubscribe: function(data){
            this._onSyncSubscribe(data);
        },

        /**
         * handler for channel.sync, subscription
         * @param data {Object}
         * @private
         */
        _onSyncSubscribe: $.noop,

        /**
         * component handler for channel.add subscription
         * @param data {Object}
         * @component
         */
        __onAddSubscribe: function(data){
            this._onAddSubscribe(data);
        },

        /**
         * handler for channel.add subscription
         * @param data {Object}
         * @private
         */
        _onAddSubscribe: $.noop,

        /**
         * component handler for channel.change subscription
         * @param data {Object}
         * @component
         */
        __onChangeSubscribe: function(data){
            this._onChangeSubscribe(data);
        },

        /**
         * handler for channel.change subscription
         * @param data {Object}
         * @private
         */
        _onChangeSubscribe: $.noop,

        /**
         * component handler for channel.remove subscription
         * @param data {Object}
         * @component
         */
        __onRemoveSubscribe: function(data){
            this._onRemoveSubscribe(data);
        },

        /**
         * component handler for channel.remove subscription
         * @param id {String}
         * @private
         */

        _onRemoveSubscribe: $.noop,


        /**
         * channel.select subscription
         * @param data {Object}
         * @component
         */
        __onSelectSubscribe: function(data){
            var result;
            if(data.id && this.__isModelList()){
                result= utils.selectObjectByIdFromArrayProp(this.$scope,this._data.scopeId,data.id);
            }else{
                result= undefined;
            }
            this._onSelectSubscribe(result);
        },

        /**
         * component handler for channel.select subscription
         * @param id {Object}
         * @component
         */
        _onSelectSubscribe: $.noop,

        /**
         * returns the scope property of the ViewBag context(options.context)
         * @returns {Object}
         * @private
         */
        _scopedContextModel:function(){
            var context=this.options.context,
                scopeProp=this.options.scope;

            return (scopeProp && context) ? context[scopeProp] : undefined;
        },

        _onLocationChange:$.noop,


        _dispose: $.noop,

        scope:function(){
            return this.$scope;
        }



    });

    /**
     * define the factory
     * @param ElementProto {Object} <optional>, only should be supplied if the element not derived from HTMLElement
     * @param name {String}
     * @param tagName {String} <optional>
     * @param base {Object} <optional>
     * @param prototype {Object}
     */
    $.controller = function (ElementProto,name,tagName, base, prototype) {
        var baseObject;
        var tagName_=null;
        var ElementProto_=null;

        /* support 2-5 params */
        var length=arguments.length;
        if(length < 2){
            throw "Error: Controller requires a minimum of two parameter types: string name and a singleton for the prototype"
        }else if(length===2){

            prototype = name;
            if(typeof ElementProto==='object'){
                throw "Error: Controller requires a string name parameter";
            }
            if(typeof name!=='object'){
                throw "Error: Controller requires a singleton for the prototype";
            }
            name=ElementProto;
            baseObject = $.elliptical.controller;
            base=null;
        }else if(length===3){

            prototype=tagName;
            if(typeof ElementProto==='object'){
                if(typeof name!=='string'){
                    throw "Error: Controller requires a string name parameter";
                }
                if(typeof tagName!=='object'){
                    throw "Error: Controller requires a singleton for the prototype";
                }

                ElementProto_=ElementProto;
                baseObject = $.elliptical.controller;
                base=null;
            }else{
                if(typeof tagName==='object'){
                    if(typeof name==='string'){
                        tagName_=name;
                        baseObject = $.elliptical.controller;
                        base=null;
                    }else{
                        base=name;
                    }
                    name=ElementProto;
                }else{
                    throw "Error: Controller requires a singleton for the prototype";
                }
            }


        }else if(length===4){

            prototype=base;
            if(typeof ElementProto==='object'){
                ElementProto_=ElementProto;
                if(typeof name!=='string'){
                    throw "Error: Element requires a string name parameter";
                }
                if(typeof tagName==='string'){
                    tagName_=tagName;
                    baseObject = $.elliptical.controller;
                    base=null;
                }else{
                    base=tagName;
                }
            }else{
                base=tagName;
                tagName_=name;
                name=ElementProto;
            }
        }else{

            ElementProto_=ElementProto;
            tagName_=tagName;

        }

        if(base){
            var initFunc=[];
            /* controller inheritance creates a callstack for the parent  _init event,written to an array on the element prototype,
             so they get fired in sequence, avoiding being overwritten by the element's _initController event
             */
            if($.utils.array.isArray(base)){ /* support passing in array of base elements, not just one */
                /* array */

                /* setup baseObject constructor */
                baseObject = function () {};
                baseObject._childConstructors = [];

                /* iterate and extend */
                base.forEach(function(obj){
                    /* obj.__initFunc array of _initController gets concat'ed to the new stack */
                    if(obj.prototype.__initFunc && obj.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(obj.prototype.__initFunc);
                    }
                    $.extend(baseObject.prototype, obj.prototype, $.elliptical.controller.prototype);
                    /* push obj _initController or initElement onto initFunc stack */
                    if(obj.prototype._initController){
                        initFunc.push(obj.prototype._initController);
                    }else if(obj.prototype._initElement){
                        initFunc.push(obj.prototype._initElement);
                    }

                });

                /* attach the stack to the prototype */
                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }

            }else{
                /* object */
                if (base.prototype._initController) {
                    baseObject = base;
                    if(baseObject.prototype.__initFunc && baseObject.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(baseObject.prototype.__initFunc);
                    }
                    initFunc.push(baseObject.prototype._initController);
                } else {
                    /* base is not derived from controller, so extend onto a baseObject constructor */
                    baseObject = function () {};
                    baseObject._childConstructors = [];
                    if(base.prototype._initElement){
                        initFunc.push(base.prototype._initElement);
                    }
                    $.extend(baseObject.prototype, base.prototype, $.elliptical.controller.prototype);

                }

                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
            }
        }



        /* implement using the extended jQuery UI factory */
        $.widget(name, baseObject, prototype);



        /* register the element as a custom element, if enabled */
        if($.element.custom){
            if(!tagName_){
                tagName_=name.replace('.','-');
            }
            var name_= name.split( "." )[ 1 ];
            if(!ElementProto_){
                var __proto__=HTMLElement.prototype;
                __proto__._name='HTMLElement';
                ElementProto_=__proto__;
            }
            $.element.register(name_,tagName_,ElementProto_);


        }
    };


    /* copy props of element to controller */
    for(var key in $.element){
        $.controller[key]= $.element[key];
    }


    /* setup observer for ui-controller,data-controller instantiations on added mutations */
    $(function(){
        $(document).on('ellipsis.onMutation',function(event,data){
            var mutations=data.mutations;
            mutations.forEach(function (mutation) {
                var added=mutation.addedNodes;
                if(added.length>0){
                    /* support data-controller and ui-controller */
                    var dataUi=$(added).selfFind(DataSelector_);
                    if(dataUi && dataUi.length >0){
                        //html5 mode, the only selector is data-controller
                        __throttle(dataUi,'data-controller');
                    }

                    if($.element.custom){
                        var ui=$(added).selfFind(Selector_);
                        if(ui && ui.length >0){
                            //for base ui-controller tag, <ui-controller name=""></ui-controller>
                            __throttle(ui,'name');
                        }
                        var ctrl=$(added).selfFind('[controller]');
                        if(ctrl && ctrl.length > 0){
                            //previously registered custom elements not tied to $.controller
                            __throttle(ctrl,'controller');
                        }
                    }
                }
            });
        });
    });

    //for page loads
    (function(){
        document.addEventListener('WebComponentsReady', function() {
            /* support data-controller and ui-controller */
            var dataUi = $(document).find(DataSelector_);
            var ui,ctrl;
            if($.element.custom){
                ui = $(document).find(Selector_);
                ctrl=$(document).find('[controller]');
            }
            if(dataUi && dataUi.length >0){
                __throttle(dataUi,'data-controller');
            }
            if($.element.custom && ui && ui.length > 0){
                __throttle(ui,'name');
            }
            if($.element.custom && ctrl && ctrl.length > 0){
                __throttle(ctrl,'controller');
            }
        });



    })();
    //temporary hack...bundling controllers with elements using htmlimports, controllers may not be registered
    //with the jQuery object at the time of WebComponentsReady(on Firefox)
    function __throttle(ctrl,selector){
        setTimeout(function(){
            instantiateControllers(ctrl,selector);
        },100);
    }

    /* instantiate controllers from jQuery Array */
    function instantiateControllers(ui,attrSelector){
        $.each(ui,function(){
            var context=window.$$.elliptical.context;
            var controller= $(this).attr(attrSelector);
            if(controller !==undefined){
                controller=controller.toCamelCase();
            }
            var camelCase =($.element.custom) ? $(this).attr('camel-case') : $(this).attr('data-camel-case');
            if(camelCase===undefined){
                camelCase=true;
            }
            var opts= $.element.getOpts(this,camelCase);
            if(context){
                opts.context=context;
            }

          try{
            $(this)[controller](opts);
          }catch(ex){
            /* fork it to a set interval queue */
            setController(this,controller,opts);
          }

        });
    }

  /* setInterval queue for instantiation */
  function setController(that,controller,opts){
    var timeOutId=setInterval(function(){
      try{
        $(that)[controller](opts);
        clearInterval(timeOutId);
      }catch(ex) {

      }
    },300);
  }

    /* delete controller from custom element definitions,
       since we are already separately binding ui-controller instantiations to mutation observer changes

       this prevents each <ui-controller name=""></ui> from having two instances, a ".name" instance and a ".controller" instance

     */
    if($.element.custom){
        var definitions_=$.element.definitions;
        var len_=definitions_.length;
        for(var i=0;i<len_;i++){
            if(definitions_[i].name==='controller'){
                definitions_.splice(i,1);
            }
        }
    }

    /**
     * getter/setter for scope id prop
     * @type {Object}
     */
    $.controller.config={
        scope:Object.defineProperties({},{
            'id':{
                get:function(){
                    return $.Widget.prototype.options.idProp;
                },
                set:function(val){
                    $.Widget.prototype.options.idProp=val;
                }
            }
        }),

        template:Object.defineProperties({},{
            'autoRender':{
                get:function(){
                    return $.Widget.prototype.options.autoRender;
                },
                set:function(val){
                    $.Widget.prototype.options.autoRender=val;
                }
            },
            'bindHTML5Imports':{
                get:function(){
                    return $.Widget.prototype.options.bindHTML5Imports;
                },
                set:function(val){
                    $.Widget.prototype.options.bindHTML5Imports=val;
                }
            }
        })

    };



    return $;

}));
/*
 * =============================================================
 * elliptical-form
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var utils= $.elliptical.utils;
    var _=utils._;

    /* customElements object */
    var Selector_='[data-form]';
    var customElements_=false;
    if($('html').hasClass('customelements')){
        Selector_='ui-form';
        customElements_=true;
    }


    $.controller('elliptical.form','ui-form',{

        _initController: function () {
            this._initMethodAction();
            this._initForm();
        },

        _initForm:function(){

        },

        _initMethodAction: function () {
            var form = this.__getTemplateNode();
            if (this.options.action) {
                form.attr('action', this.options.action);
            }
            if (this.options.method) {
                form.attr('method', this.options.method);
            }
        },

        /**
         *
         * @private
         */
        __getTemplateNode:function(){
            return this.element.find('form');
        },

        /**
         * renders the template fragment directly using the $scope
         * @param $scope {Object}
         * @param callback {Function}
         * @private
         */
        __render: function($scope,callback){
            var opts={};
            opts.template=this._data.templateId;
            if(this.__isModelList()){
                var prop=Object.keys($scope)[0];
                opts.model=$scope[prop];
                opts.context=prop;
            }else{
                opts.model=$scope;
            }

            opts.parse=false;
            this.__renderTemplate(opts,callback);
        },

        _form:function(){
            return this.element.find('form');
        },

        _submit:function(validate){
            var form=this._form();
            if(validate !==undefined && validate){
                if(this.___validateForm(form)){
                    form.submit();
                }
            }else{
                form.submit();
            }
        },

        ___validateForm: function (form) {
            var fields = form.find('[required]');
            var bool=true;
            $.each(fields, function(i, field) {
                if (!field.value){
                    if(bool){
                        bool = false;
                        var name = (field.name) ? field.name : field.getAttribute('data-name');
                        if (name === undefined) {
                            name = 'Form element';
                        }
                        alert(name + ' is required');
                        field.focus();
                    }
                }
            });

            return bool;
        },

        /**
         *
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        __renderTemplate:function(opts,callback){
            var self=this;
            var templateNode=this._data.templateNode;
            this._renderTemplate(opts,function(err,out){
                var html=out.replace(/<form(.*?)>/g,'').replace(/<\/form>/g,'');
                templateNode.html(html);
                if(self.options.bindHTML5Imports){
                    self._renderElementTemplateImports(templateNode);
                }
                if(callback){
                    callback(err,out);
                }
            });
        },

        $render:function(model,context,callback){
            if(typeof context==='function'){
                callback=context;
                context=undefined;
            }
            var opts={};
            opts.parse=false;
            opts.template=this._data.templateId;
            opts.model=model;
            //opts.context=context;
            this.__renderTemplate(opts,callback);
        }

    });


    /**
     * define the factory

     * @param name {String}
     * @param tagName {String}
     * @param base {Object} <optional>
     * @param prototype {Object}
     */
    $.form = function (name,tagName,base, prototype) {
        var baseObject;
        var tagName_=null;
        /* support 2-4 params */
        var length=arguments.length;
        if(length < 2) {
            throw "Error: Form requires a minimum of two parameter types: string name and a singleton for the prototype";
        }else if(typeof name !=='string'){
            throw "Error: Form requires name of type string";
        }else if(length===2){
            if(typeof name==='string' && typeof tagName==='string'){
                throw "Error: Form requires a minimum of two parameter types: string name and a singleton for the prototype";
            }
            prototype = tagName;
            baseObject = $.elliptical.form;
            base=null;
        }else if(length===3){
            if(typeof name==='string' && typeof tagName==='string'){
                tagName_=tagName;
                prototype = base;
                baseObject = $.elliptical.form;
                base=null;
            }else{
                prototype=base;
                base=tagName;
            }
        }else if(length===4){
            tagName_=tagName;
        }

        if(base){
            var initFunc=[];
            /* controller inheritance creates a callstack for the parent form _initForm event,written to an array on the element prototype,
             so they get fired in sequence, avoiding being overwritten by the element's _initForm event
             */
            if($.utils.array.isArray(base)){ /* support passing in array of base elements, not just one */
                /* array */

                /* setup baseObject constructor */
                baseObject = function () {};
                baseObject._childConstructors = [];

                /* iterate and extend */
                base.forEach(function(obj){
                    /* obj.__initFunc array of _initForm gets concat'ed to the new stack */
                    if(obj.prototype.__initFunc && obj.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(obj.prototype.__initFunc);
                    }
                    $.extend(baseObject.prototype, obj.prototype, $.elliptical.form.prototype);
                    /* push obj _initForm or _initController or _initElement onto initFunc stack */
                    if(obj.prototype._initForm){
                        initFunc.push(obj.prototype._initForm);
                    }else if(obj.prototype._initController){
                        initFunc.push(obj.prototype._initController);
                    }else if(obj.prototype._initElement){
                        initFunc.push(obj.prototype._initElement);
                    }
                });

                /* attach the stack to the prototype */
                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }

            }else{
                /* object */
                if (base.prototype._initController) {
                    baseObject = base;
                    if(baseObject.prototype.__initFunc && baseObject.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(baseObject.prototype.__initFunc);
                    }
                    initFunc.push(baseObject.prototype._initForm);
                } else {
                    /* base is not derived from element, so extend onto a baseObject constructor */
                    baseObject = function () {};
                    baseObject._childConstructors = [];
                    if(base.prototype._initController){
                        initFunc.push(base.prototype._initController);
                    }else if(base.prototype._initElement){
                        initFunc.push(base.prototype._initElement);
                    }
                    $.extend(baseObject.prototype, base.prototype, $.elliptical.form.prototype);
                }

                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
            }
        }

        /* implement using the extended jQuery UI factory */
        $.widget(name, baseObject, prototype);

        /* register the element as a custom element, if enabled */
        if(customElements_){
            if(!tagName_){
                tagName_=name.replace('.','-');
            }
            var name_= name.split( "." )[ 1 ];

            $.widget.register(name_,tagName_,HTMLElement.prototype);
        }
    };

    //register ui-form as custom element
    if(customElements_){
        try{
            //$.widget.registerElement('ui-form');
            /* make public props/methods available on $.form */
            for(var key in $.controller){
                $.form[key]= $.controller[key];
            }
        }catch(ex){

        }
    }

    /* register a document listener for ellipsis.onMutation */
    $(function(){
        $(document).on('ellipsis.onMutation',function(event,data){
            var mutations=data.mutations;
            mutations.forEach(function (mutation) {
                var added=mutation.addedNodes;
                if(added.length>0){
                    /* support data-form and ui-form */
                    var ui=$(added).selfFind(Selector_);
                    if(ui && ui.length > 0){
                        //instantiateForms(ui);
                        __throttle(ui);
                    }
                }
            });
        });
    });


    //for page loads
    (function(){
        document.addEventListener('WebComponentsReady', function() {
            var ui = $(document).find(Selector_);
            if(ui && ui.length > 0){
                //instantiateForms(ui);
                __throttle(ui);
            }
        });
    })();


    function __throttle(ui){
        setTimeout(function(){
            instantiateForms(ui);
        },100);
    }

    /* instantiate forms from jQuery Array */
    function instantiateForms(ui){
        $.each(ui,function(){
            var form=(customElements_) ? $(this).attr('name') : $(this).attr('data-form');
            if(form !==undefined){
                form=form.toCamelCase();
            }
            var camelCase =($.element.custom) ? $(this).attr('camel-case') : $(this).attr('data-camel-case');
            if(camelCase===undefined){
                camelCase=true;
            }
            var opts= $.widget.getOpts(this,camelCase);
            $(this)[form](opts);

        });
    }

    /* delete form from custom element definitions,
     since we are already separately binding ui-form instantiations to mutation observer changes

     this prevents each <ui-form name=""></ui> from having two instances, a ".name" instance and a ".form" instance

     */
    if($.element.custom){
        var definitions_=$.element.definitions;
        var len_=definitions_.length;
        for(var i=0;i<len_;i++){
            if(definitions_[i].name==='form'){
                definitions_.splice(i,1);
            }
        }
    }

    return $;

}));

/*
 * =============================================================
 * $.controller prototype extension
 * =============================================================
 * Dependencies:
 * elliptical-controller
 *
 * extends $.controller for services injection and configuration
 */


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {



    /**
     * pass services to the controller prototype, $.controller.service(S1,S2,..SN);
     * invoke a service from the controller: var myService=this.service('serviceName');
     */
    $.controller.service=function(){
        var services=[];
        var args = [].slice.call(arguments);
        for(var i=0;i<args.length;i++){
            var name=(args[i]["@resource"]);
            if(!name){
                if(args[i].constructor && args[i].constructor["@resource"]){
                    name=args[i].constructor["@resource"];
                }else{
                    name='Service';
                }
            }

            services.push({
                name:name,
                service:args[i]
            });

        }
        var options=$.Widget.prototype.options;
        (typeof options.services != 'undefined') ? options.services=options.services.concat(services) :  options.services=services;

    };

    var prototype_={
        /**
         * return a service by name(@resource)
         * @param name {String}
         * @returns {Object}
         * @private
         */
        service:function(name){
            var obj_=null;
            var service=null;
            this.options.services.forEach(function(obj){
                if(obj.name===name){
                    obj_=obj.service;
                }else if(obj.name==='Service'){
                    service=obj.service.extend({},{}); //if model service, extend it so that it each is a separate copy
                    service["@resource"]=name;
                }
            });

            return (obj_) ? obj_ : service;
        },

        _service: function (name, method, params, callback) {
            var service = this.service(name);
            service[method](params, callback);
        },

        _upgraded: function () {
            var upgraded = this.element.attr('data-upgraded');
            return (!(upgraded === undefined));
        }

    };

    /* extend the controller UI Factory prototype */
    $.extend($.elliptical.controller.prototype,prototype_);



    return $;
}));




/*
 * =============================================================
 * elliptical.element
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {


        $.controller('elliptical.element',{
            _initController: $.noop
        });

        return $;



}));


/*
 * =============================================================
 * elliptical.scroll
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.controller("elliptical.scroll", {

        options:{
            touchScroll:false
        },
        /*==========================================
         PRIVATE
         *===========================================*/

        _initController:function(){
            if (!this._support.mq.touch || this.options.touchScroll) {
                this._data.scrollY = null;
                this._scrollEvent();
            }
        },

        _onScroll: $.noop,

        /**
         * element events
         * @private
         */
        _scrollEvent: function(){
            var self = this;
            var onScroll = this._onScroll;
            $(window).on('scroll', function (event) {
                self._data.scrollY = window.pageYOffset;
                try{
                    window.requestAnimationFrame(onScroll.bind(self));
                } catch (ex) {

                }
            });
        },

        _onDestroy: function () {
            $(window).off('scroll');
        }



    });

    return $;


}));







/*
 * =============================================================
 * elliptical.slideNotification
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    $.controller('elliptical.slideNotification',{
        options:{
            template:'ui-slide-notification',
            cssModalClass:null,
            animationIn:'bounceInDown',
            animationOut:'bounceOutUp',
            modalCssClass:null,
            modalZIndex:999,
            modalOpacity:.3,
            model:{}
        },


        _initElement:function(){
            this.__selector();
            this._attachElement();
            this._show();

        },

        _subscriptions:function(){
            this._subscribe('slide.notification.hide',this._hide.bind(this));
        },

        __selector:function(){
            var __customElements=this.options.$customElements;
            this._data.selector=(__customElements) ? 'ui-slide-Notification' : '.ui-slide-notification';
        },


        _attachElement:function(){
            var self=this;
            var container=$('<div></div>');
            this._data.container=container;
            var body=this.element;
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
                model:this.options.model

            },function(){
                self._data.element=container.find(self._data.selector);
                self._animate();
                var button= container.find('button');
                self._data.button=button;
                self._close();

            });
        },


        _showModal:function(callback){
            var opts={};
            if(this.options.modalCssClass){
                opts.cssClass=this.options.modalCssClass;
            }
            opts.opacity=this.options.modalOpacity;
            opts.zIndex=this.options.modalZIndex;
            this._setModal(this.element,opts,function(){
                callback();
            });
        },

        _animate:function(){
            var self=this;
            this._onEventTrigger('showing',{});
            var element=this._data.element;
            this._transitions(element,{
                preset:'bounceInDown'
            },function(){
                self._onEventTrigger('show',{});
            });
        },

        _close:function(){
            var self=this;
            var button=this._data.button;
            if(button){
                button.on('click',function(event){
                    self._hide();
                });
            }
        },

        _hide:function(){

            this._removeModal();
            var element=this._data.element;
            this._onEventTrigger('hiding',{});
            (!$.browser.msie) ? this.__transitionOut(element) : this._destroy();

        },

        __transitionOut:function(element){
            var self=this;
            var animationOut=this.options.animationOut;
            this._transitions(element,{
                preset:animationOut

            },function(){
                self.destroy();
            });
        },

        _unbindButtonEvent:function(){
            var button=this._data.button;
            if(button){
                button.off('click');
            }
        },

        _onDestroy:function(){
            this._unbindButtonEvent();
            var container=this._data.container;
            container.remove();
        },

        hide:function(){
            this._hide();
        }

    });

    return $;

}));






/*
 * =============================================================
 * elliptical.form prototype extension
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * elliptical-form
 *
 * extends the elliptical form factory
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-form'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-form'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {
    var _submitLabel = 'submitLabel';
    var _successMessage = 'Form Successfully Submitted';

    var prototype_ = {

        __setScope: $.noop,

        /**
         * init
         * @private
         */
        _initController: function () {
            this._data.data = null;
            this._data.notificationElement = null;
            this._setFormElement();
            this.__setFormScope();
            this._initMethodAction();
            this._checkValidation();
            this._checkSubmissionType();
            this.__initRadioGroup();
            this._initForm();

        },

        __setFormScope:function(){
            var scopeProp = this.options.scope;
            var cxt=this.options.context;
            if(!cxt){
                cxt=$$.elliptical.context || {};
            }
            if (scopeProp && typeof scopeProp !== 'undefined' && !this.__isEmptyObject(cxt)) {
                var formContext=this.__cloneObject(cxt[scopeProp]);
                this.$scope = formContext;
                if (this.$scope.submitLabel === undefined) {
                    this.$scope.submitLabel = {};
                }
            }

        },

        __initFormScope:function(prop){
            var empty={};
            empty[prop]={};
            var formContext=this.__cloneObject(empty[prop]);
            this.$scope = formContext;
            this.$scope.submitLabel = {};

        },

        __initRadioGroup:function(){
            setTimeout(this._initRadioGroup.bind(this), 500);
        },

        _initRadioGroup:function(){
            var radioList = this.element.find('ui-radio-list');
            var self = this;
            $.each(radioList, function (index, ele) {
                var id = ele.getAttribute('id');
                self.__checkRadio(ele, id);
            });
        },

        __bindRadio: function () {
            var element = this.element;
            var press = this._press();
            this._event(element, press, "ui-radio", this._onRadioChecked.bind(this));
        },

        _onRadioChecked: function (event) {
            var element = $(event.currentTarget);
            var input = element.find('input');
            var name = input.prop('name');
            var id = input.prop('id');
            this.$scope[name] = id;
        },

        __checkRadio:function(ele,id){
            try{
                var $scope = this.$scope;
                var val = $scope[id];
                var input = $(ele).find('[id="' + val + '"]');
                if (input[0]) {
                    input.prop("checked", true)
                }
                this.__bindRadio();
            } catch (ex) {

            }
        },

        _initForm: $.noop,

        /**
         * events: bind _onValidate to the submitEvent delegate
         *         bind _onReset to DOM reset event
         * @private
         */
        _events: function () {
            this.element.on('change', 'select', this._onSelectChange.bind(this));
            $(document).on(this.options.submitEvent,this._onValidate.bind(this));
            $(document).on(this.options.resetEvent, this._onReset.bind(this));

            this._onEvents();
        },

        _checkValidation:function(){
            if (this.options.schema === undefined) {
                this._setValidationSchema();
            }
        },

        _checkSubmissionType:function(){
            if (this.options.actionSubmit) {
                this._captureSubmitEvent();
            }
        },

        _captureSubmitEvent:function(){
            var press = this._press();
            var element = this.element;
            this._event(element, press, 'button', this._capturedSubmitEventHandler.bind(this));
        },

        _capturedSubmitEventHandler:function(event){
            event.preventDefault();
            var form = this.element.find('form');
            var body = form.document();
            var data = {
                route: form[0].action,
                body: body,
                method: form.attr('method'),
                element: form[0]
            };
            this._onValidate({},data);
        },

        /**
         *  bind _onReset published reset event(can be called, .e.g., from the slide notification panel)
         * @private
         */
        _subscriptions:function(){
            this._subscribe(this.options.resetSubscription,this._onReset.bind(this));
            this._onSubscriptions();
        },

        _onEvents: $.noop,

        _onSubscriptions: $.noop,


        /**
         * intermediate form validation:
         * if schema declared, pass to Validation service, otherwise, pass on to submit mediator
         * @param event {Object}
         * @param data {Object}
         * @private
         */
        _onValidate: function (event, data) {
            if(this.__verifyFormElement(data.element)){
                (this.options.schema) ? this._validate(data) : this.___onSubmit(data);
            }
        },

        /**
         * verify submitting form element is in the component node tree
         * @param target {Object} element
         * @private
         */
        __verifyFormElement:function(target){
            var thisForm=this._form();
            if(thisForm[0]){
                return (thisForm[0]===target);
            }else{
                return false;
            }

        },

        /**
         * calls internal method to reset form
         * @param event {Object}
         * @param data {Object}
         * @private
         */
        _onReset: function (event, data) {
            this._reset();
            this._killNotification();
        },

        _getRedirectUrl: function () {
            var Location = this.service('Location');
            if (!Location) {
                return false;
            }
            var href = Location.href;
            var returnUrl = Location.url.queryString(href, this.options.returnUrlQueryString);
            if (returnUrl && returnUrl !== undefined) {
                this._data.returnUrl = returnUrl;
            } else if (this.options.returnUrl && this.options.returnUrl !== undefined) {
                this._data.returnUrl = this.options.returnUrl;
            } else {
                this._data.returnUrl = "/";
            }
            this._data.returntUrl = decodeURIComponent(this._data.returnUrl);

        },

        /**
         * submit mediator method:
         * if service is declared, internally submit, otherwise pass off to dev _onSubmit
         * @param data {Object}
         * @private
         */
        ___onSubmit: function (data) {
            if (this.options.service){
                this.__onSubmit(data);
            }else if(this.options.actionSubmit){
                this._submit();
            }else{
                this._onSubmit(data);
            }

        },

        /**
         * if Validation service has been injected, passes to validation, otherwise passes to internal __onSubmit
         * @param data {Object}
         * @private
         */
        _validate: function (data) {
            var validationSrvName = this._getValidationServiceName();
            var Validation = this.service(validationSrvName);
            var body = data.body;
            var schema = this.options.schema;
            var formElement = this._data.form;
            var method = formElement.attr('method');
            var action = formElement.attr('action');
            if (Validation !== undefined) {
                this._callValidation(Validation, data, body, method, action, schema);
            } else {
                this.___onSubmit(data);
            }

        },

        _getValidationServiceName: function () {
            var srvName=this.options.validationService;
            return (srvName === undefined) ? 'Validation' : srvName;
        },

        _setValidationSchema:function(){
            var form = this.element.find('form');
            if (form[0] && form[0].hasAttribute('name')) {
                var schemaName = form.attr('name');
                var elements = form.find('[ea-required]');
                if (elements.length > 0) {
                    var schemaObj = {};
                    $.each(elements, function (i, ele) {
                        var name_ = ele.getAttribute('name');
                        schemaObj[name_] = {
                            required: true
                        };
                    });
                    var service = this.service('Validation');
                    service.put(schemaObj, schemaName);
                    this.options.schema = schemaName;
                }
            }
        },

        /**
         * uses the validate method of the Validation service to validate
         * @param Validation {Object/Function}
         * @param data {Object}
         * @param body {Object}
         * @param method {String}
         * @param action {String}
         * @param schema {String}
         * @private
         */
        _callValidation: function (Validation, data, body, method, action, schema) {
            var self = this;
            body=this._onBeforeValidate(body);
            Validation.post(body,schema, function (err, form) {
                if (err) {
                    self._onError(err, form);
                    self._renderError(form,err.message);
                } else {
                    self.___onSubmit(data);
                }
            });
        },

        _onSubmit: $.noop,

        _onSuccess: $.noop,

        _onError: $.noop,

        _onBeforeSubmit:function(data){
            return data;
        },

        _onBeforeValidate:function(body){
            return body;
        },


        /**
         * internal method to submit form to service
         * @param data {Object}
         * @private
         */
        __onSubmit: function (data) {
            //show notification message
            this._notify('info', this.options.processingMessage, false);
            var body = this._onBeforeSubmit(data.body);
            var self = this;
            var model = this.options.service;
            if (model) {
                var formElement = this._data.form;
                var method = formElement.attr('method').toLowerCase();
                var Model = this.service(model);
                Model[method](body, function (err, result) {
                    if (!err) {
                        //trigger success event
                        self._triggerEvent(self.options.successEvent,result);
                        //render success form
                        self._renderSuccess(result);
                        //dev handled _onSuccess
                        self._onSuccess(result);
                        //show notification status
                        self._sendNotification(err, result);
                    } else {
                        //trigger failure event
                        self._triggerEvent(self.options.failureEvent,err);
                        self._sendNotification(err, null);
                        //dev handled _onError
                        self._onError(err, data);
                        //render error form
                        self._renderError({});
                    }
                });
            } else {
                var err_ = {};
                err_.statusCode = 400;
                err_.message = 'Model undefined';
                this._onError(err_, data);
                this._renderError({});
            }
        },

        /**
         * render success form-->pass $scope to re-render form
         * @param data {Object}
         * @private
         */
        _renderSuccess: function (data) {
            var validationSrvName = this._getValidationServiceName();
            var Validation = this.service(validationSrvName);
            try{
                Validation.onSuccess(data);
            } catch (ex) {
                this.__onSuccess(data);
            }
            var mergedData = this._mergeFormData(data);
            this._renderForm(mergedData);
        },


        /**
         * render error form-->merge validation onError method with $scope to re-render form
         * @param data {Object}
         * @param msg {String}
         * @private
         */
        _renderError: function (data,msg) {
            var validationSrvName = this._getValidationServiceName();
            var Validation = this.service(validationSrvName);
            try{
                Validation.onError(data, msg);
            }catch(ex){
                this.__onError(data,msg);
            }

            var mergedData = this._mergeFormData(data);
            this._renderForm(mergedData);
        },

        /**
         * merges a data object with the current $scope
         * @param data {Object}
         * @returns {Object}
         * @private
         */
        _mergeFormData: function (data) {
            return $.extend({}, this.$scope, data);
        },

        /**
         * renders form
         * @param form
         * @private
         */
        _renderForm: function (form) {
            var self=this;
            this._publishEvents(form);
            this.$render(form, function () {
                self.__rebindTemplate();
                self._initRadioGroup();

            });
        },

        _publishEvents: function(data){
            if(this.options.channel !==undefined){
                var channel=this.options.channel;
                var event=this.options.event;
                if(event !==undefined){
                    var subscribeChannel=this.options.channel + '.' + this.options.event;
                    this._publish(subscribeChannel,data);
                }
            }
        },


        /**
         * set the form element
         * @private
         */
        _setFormElement: function () {
            var form = this.element.find('form');
            this._data.form = form;

        },

        /**
         * display notification
         * @param err {Object}
         * @param data {Object}
         * @param delay {Number}
         * @private
         */
        _sendNotification: function (err, data,delay) {
            var self=this;
            if(delay===undefined){
                delay=1000;
            }
            var opts = {};
            opts.terminate = true;
            opts.data = data;
            opts.slideIn=(this.options.slideIn !== undefined);

            if (err) {
                opts.cssClass = 'error';
                (typeof err.message === 'string') ? opts.message = err.message : opts.message = 'Submission Error...';
                opts.message = this._jsonParseMessage(opts.message);
            } else {
                opts.cssClass = 'success';
                opts.message = (typeof this.options.successMessage === 'undefined') ? _successMessage : this.options.successMessage;
            }

            setTimeout(function(){
                self._notification($('body'), opts);
            },delay);

        },

        /**
         * instantiates a notification element
         * @param element {Object}
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _notification: function (element, opts, callback) {
            //save ref to the notification element
            this._data.notificationElement = element;
            var self = this;
            if (typeof opts === 'function') {
                callback === opts;
                opts = {};
            } else if (!opts) {
                opts = {};
            }

            opts.slideIn = opts.slideIn || false;


            if (opts.slideIn) {
                opts.terminateTimeout = opts.terminateTimeout || 100;
                opts.cssModalClass = opts.cssModalClass || 'forms';

                setTimeout(function () {
                    /* destroy notification widget */
                    if (element.data('ellipsisNotification')) {
                        element.notification('destroy');
                    }
                    opts.model = self._getNotificationModel();
                    opts.context = 'model';
                    /* show slide notification */
                    element.slideNotification(opts);

                }, opts.terminateTimeout);

                if (callback) {
                    callback();
                }

            } else {

                opts.terminateTimeout = opts.terminateTimeout || 3000;
                opts.inline = opts.inline || false;
                opts.terminateDelay = opts.terminateDelay || 1000;
                opts.cssClass = opts.cssClass || 'info';
                opts.message = opts.message || 'processing...';
                opts.terminate = opts.terminate || false;

                element.notification(opts);
                element.notification('show');

                if (callback) {
                    callback();
                }
            }
        },

        /**
         * constructs a notification model for notifications
         * @returns {Object}
         * @private
         */
        _getNotificationModel: function () {
            var model = {};
            var formElement = this._data.form;
            var method = formElement.attr('method');
            var action = formElement.attr('action');
            //reset
            if (method && method.toLowerCase() === 'post') {
                model.reset = true;
            }
            //previous location
            model.referrer = {
                url: document.referrer
            };

            //redirect
            if (this.options.returnUrl) {
                model.redirect = {
                    url: this.options.returnUrl
                };
                if (this.options.redirectLabel) {
                    model.redirect.label = this.options.redirectLabel;
                }
            }

            return model;

        },

        _killNotifier:function(){
            var element=$('body');
            if (element.data('ellipsisNotification')) {
                element.notification('destroy');
            }
        },

        _onSelectChange:function(event){
            var target = $(event.currentTarget);
            var id = target.attr('ea-id');
            if (id !== undefined) {
                var hidden = this.element.find('input[name="' + id + '"]');
                var val = target.val();
                if (val !== undefined) {
                    hidden.val(val);
                }
                var uiSelect = this.element.find('#' + id);
                if (uiSelect[0]) {
                    if (uiSelect.hasClass('error')) {
                        uiSelect.removeClass('error');
                        this._semanticLabel();
                    }
                }
            }
        },

        /**
         * destroy slide notification element
         * @private
         */
        _killNotification:function(){
            var element=this._data.notificationElement;
            if(element[0]){
                element.slideNotification('hide');
            }
        },

        /**
         * internal scope change handler
         * @param result {Object}
         * @private
         */
        __$scopePropsChange:function(result){
            var self = this;
            var element = this.element;
            this._semanticLabel();
            result.changed.forEach(function(obj){
                if(obj){
                    var changed = self._objectChange(obj);
                    var scope = self.$scope;
                    if(changed){
                        for(var key in changed){
                            if (changed.hasOwnProperty(key)) {
                                var input = element.find('#' + key);
                                if(input[0] && input.hasClass('error')){
                                    input.removeClass('error');
                                }
                                var ele = element.find('[ea-id="' + key + '"]');
                                if (ele[0] && ele.hasClass('error')) {
                                    ele.removeClass('error');
                                }
                            }
                        }
                    }
                }

            });

            var changed_=this._objectChange;
            if(result.changed && result.changed.length){
                result.changed.forEach(function(obj){
                    var changed=changed_(obj);
                    self._$scopePropsChange(changed);
                });
            }

        },

        _semanticLabel:function(){
            var element = this.element;
            var label = element.find('.ui-semantic-label');
            if (label[0] && label.hasClass('error')) {
                label.removeClass('error').removeClass('visible').addClass('hidden');
            }
        },

        __onError: function (form, msg) {
            form = this.__addSubmitLabel(form, msg, false);
            return form;
        },

        __onSuccess: function (form) {
            form = this.__addEmptySubmitLabel(form);
            return form;
        },

        __getSchema: function (name) {
            var schema = null;
            for (var i = 0; i < this.schemas.length; i++) {
                if (this.schemas[i].name.toLowerCase() === name.toLowerCase()) {
                    schema = this.schemas[i].schema;
                    break;
                }
            }
            return schema;
        },

        __error: function (msg) {
            if (typeof msg === 'undefined') {
                msg = 'Form Submission Error';
            }
            var err = {};
            err.message = msg;
            err.css = 'error';
            err.cssDisplay = 'visible';
            return err;
        },

        __addSubmitLabel: function (form, msg, valid) {
            if (typeof valid === 'undefined') {
                valid = msg;
                msg = undefined;
            }
            var obj;
            if (valid) {
                obj = this.__success(msg);
            } else {
                obj = this.__error(msg);
            }
            form[_submitLabel] = obj;
            return form;
        },

        __addEmptySubmitLabel: function (form) {
            form[_submitLabel] = this.__emptyLabelObject();
            return form;
        },

        __success: function () {
            var msg = {};
            msg.message = this.__successMessage();
            msg.css = 'success';
            msg.cssDisplay = 'visible';
            return msg;
        },

        __emptyLabelObject: function () {
            var msg = {};
            msg.message = '&nbsp;';
            msg.css = '';
            msg.cssDisplay = '';
            return msg;
        },

        __sucessMessage:function(){
            var successMessage=this.options.successMessage;
            return (successMessage !== undefined) ? successMessage : _successMessage;
        },

        /**
         * reset form
         * @private
         */
        _reset: function () {
            this.__disposeTemplate();
            //var model = this.options.context;
            //var context = this.options.scope;
            var model=this._scopedContextModel();
            var self=this;
            this.$render(model, function(){
                self.__setFormScope();
                self.__resetObservable();
                self.__rebindTemplate();

            });
        },

        _onDestroy: function(){
            $(document).off(this.options.submitEvent);
            $(document).off(this.options.resetEvent);
            this.element.off('change', 'select');
        },


        /**
         * display notification
         * @param element {Object}
         * @param opts {Object}
         * @param callback {Function}
         * @public
         */
        notification: function (element, opts, callback) {
            this._notification(element, opts, callback);
        },


        /**
         * reset form
         * @public
         */
        reset: function () {
            this._reset();
        },

        /**
         * render form
         * @param data {Object}
         * @public
         */
        renderForm: function (data) {
            this._renderForm(data);
        }
    };

    /**
     * options
     * @private
     */
    var options_ = {
        submitEvent: 'elliptical.onDocumentSubmit',
        successEvent:'elliptical.onSubmitSuccess',
        failureEvent:'elliptical.onSubmitFailure',
        resetEvent:'elliptical.onFormReset',
        resetSubscription:'elliptical.form.reset',
        schemas: null,
        schemaValidation: null,
        resetModel: {
            submitLabel: {
                cssDisplay: 'hidden',
                message: '&nbsp;'
            }
        },
        processingMessage: 'Processing...',
        redirectLabel: null,
        returnUrl: null,
        actionSubmit:null
    };

    /* extend the form Factory prototype */
    $.extend($.elliptical.form.prototype, prototype_);



    /* extend options */
    $.extend($.elliptical.form.prototype.options, options_);

    return $;

}));






/*
 * =============================================================
 * elliptical.autoCompleteBind
 * =============================================================

 * dependencies:
 * ellipsis-element
 * ellipsis-autocomplete
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.controller('elliptical.autoCompleteBind',{

        options:{
            dataBind:false
        },

        _initController: $.noop,

        _onAutoCompleteBinding: $.noop,

        _onAutoCompleteSelected: $.noop,

        _events:function(){
            var self=this;
            this._event($(document),'autocomplete.binding',function(event,data){
                self._onAutoCompleteBinding(event,data);

            });

            this._event($(document),'autocomplete.selected',function(event,data){
                self._onAutoCompleteSelected(event,data);
            });

        }
    });

    return $;

}));




/*
 * =============================================================
 * elliptical.pluralize
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

 $(function(){
     $.controller('elliptical.pluralize','ui-pluralize',  {

         _initController:function(){


         },

         _onRemoveSubscribe:function(data){
             var count=this.options.count;
             var singular=this.options.singular;
             var plural=this.options.plural;
             count--;
             this.options.count=count;
             (count===1) ? this.element.text(singular) : this.element.text(plural);


         },

         _onAddSubscribe:function(data){
             var count=this.options.count;
             var singular=this.options.singular;
             var plural=this.options.plural;
             count++;
             this.options.count=count;
             (count===1) ? this.element.text(singular) : this.element.text(plural);
         },

         _onChangeSubscribe:function(data){
             var singular=this.options.singular;
             var plural=this.options.plural;
             this.options.count=data;
             (data===1) ? this.element.text(singular) : this.element.text(plural);
         }


     });

     return $;
 });


}));



/*
 * =============================================================
 * elliptical.selectList
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $(function(){
        $.controller('elliptical.selectList',{

            options:{
                dataBind:false
            },

            _onChange: $.noop,

            _events:function(){
                var self=this;
                this._event(this.element,'change',function(event){
                    var element=$(event.target);
                    var value=element.val();
                    self._onChange(value);

                });
            }


        });

        return $;
    });


}));




/*
 * =============================================================
 * elliptical.autosearch
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.controller('elliptical.autosearch', $.elliptical.autoCompleteBind,{

        options:{
            dataBind:false
        },

        _initController:function(){
            //autosearch only active for desktop media
            if(!this._support.mq.touch){
                this._data.element=null;
                var input=this.element.find('input');
                this._data.input=input;
                this._initAutoSearch(input);
                this._data.message=this.options.message || 'Your search filter returned no results...';
                this._data.cssClass=this.options.cssClass || 'warning';
                this._data.paginationContext=this.options.paginationContext || 'pagination';
                this._data.paginationTemplate=this.options.paginationTemplate || 'ui-pagination';
                if(this._instantiated(input[0],'autocomplete')){
                    try{
                        input.autocomplete('destroy');
                    }catch(ex){

                    }
                }else{
                    this._onAutocompleteLoaded();
                }
            }
        },

        _onAutocompleteLoaded:function(){
            var input=this._data.input;
            this._event($(document),'autocomplete.loaded',function(event){
                try{
                    input.autocomplete('destroy');
                }catch(ex){

                }
            });

        },

        _onSyncSubscribe:function(data){
            if(!this._data.element){
                data.$filterQueue=0;
                this._data.element=data;
            }
        },

        _onInput:function(){
            var input=this._data.input;
            var self=this;
            input.keyup(function (event) {
                self._onChange(event);
            });
        },

        _onChange:function(event){
            var key = event.which;
            var self=this;
            console.log('search keyboard key: ' + key);

            //alpha-numeric or backspace
            if ((key >= 48 && key <= 90)||(key===8)) {
                setTimeout(function(){
                    self._filter();
                },100);
            }
        },

        _applyData:function(data){
            var $element=this._data.element;
            $element.options.eventBlock=true;
            $element.$filterQueue=$element.$filterQueue + 1;
            var $scope=this.$scope;
            $element.$empty();

            if(data && data.length){
                $element._killNotificationLabel();
                this._onScopeBind($scope,$element,data);

            }else{
                $element._notificationLabel({
                    cssClass:this._data.cssClass,
                    message:this._data.message
                });
            }
        },

        _updatePagination:function(pagination){
            var element=this._data.pagination;
            var opts={
                context:this._data.paginationContext,
                model:pagination,
                template:this._data.paginationTemplate
            };
            var self=this;
            this._render(element,opts,function(){

            });
        },

        _animate:function(element){
            this._transitions(element, {
                preset: 'fadeIn',
                duration: 750
            }, function () {

            });
        },

        _updateCount:function(count){
            var channel;
            if(this.options.channel){
                channel=this.options.channel + '.change';
                this._publish(channel,count);
            }
        },

        _filter: $.noop,

        _initAutoSearch: $.noop,

        _onScopeBind: $.noop
    });

    return $;

}));


/*
 * =============================================================
 * elliptical.download
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('../controller/controller'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../controller/controller'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.controller("elliptical.download", {


        /*==========================================
         PRIVATE
         *===========================================*/

        _download:function(url,opts){
            var self=this;
            var delay=opts.delay;
            if(!this._support.device.touch){
                if(typeof opts !=='undefined'){
                    var cssClass=(opts.cssClass===undefined) ? 'info' : opts.cssClass;
                    var msg=(opts.msg===undefined) ? 'Downloading File' : opts.msg;
                    var terminate=opts.terminate;
                    if(terminate===undefined){
                        terminate=true;
                    }

                    this._notify(cssClass,msg,terminate);

                    if(delay===undefined){
                        delay=100;
                    }
                }

                if(delay===undefined){
                    delay=100;
                }

                setTimeout(function(){
                    self.__download(url);
                },delay);

            }else{
                //touch
                window.open(url);
            }

        },

        __download:function(url){
            if($.browser.webkit){
                var link = document.createElement('a');
                link.href = url;

                if (link.download !== undefined) {
                    link.download = url;
                }

                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    link.dispatchEvent(event);
                    return true;
                }
                if (url.indexOf('?') === -1) {
                    url += '?download';
                }

                window.open(url, '_self');
            }else{
                if (url.indexOf('?') === -1) {
                    url += '?download';
                }

                window.open(url);
            }


            return true;
        }

    });

    return $;


}));



/*
 * =============================================================
 * elliptical.delegate.request
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.delegate=root.elliptical.delegate || {};
        root.elliptical.delegate.request=factory();
        root.returnExports =root.elliptical.delegate.request;
    }
}(this, function () {

    return function request(customElements){
        var routeAttr =(customElements) ? 'route' : 'data-route';

        $(document).on('touchclick', 'a', function (event) {

            //element href defined, point to a local resource, and element not attributed for exclusion from routing
            var href = $(this).attr('href'),
                dataRoute = $(this).attr(routeAttr);

            if (!(typeof href === 'undefined' || href==='#') || (typeof dataRoute !=='undefined' && dataRoute==='false')) {
                event.stopPropagation();
                event.preventDefault();

                //create data object
                var data={
                    method:'get',
                    href:href
                };

                /* query attributes and attach to the data objects
                 *
                 */
                $.each(this.attributes, function(i, att){
                    if(!customElements){
                        if(att.name.indexOf('data-')===0){
                            att.name=att.name.replace('data-','');
                            data[att.name.toCamelCase()]=att.value;
                        }
                    }else{
                        data[att.name.toCamelCase()]=att.value;
                    }

                });
                data.route=href;
                //trigger event
                $(document).trigger('elliptical.onDocumentRequest',data);
            }



        });
    };

}));


/*
 * =============================================================
 * elliptical.delegate.submit
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * elliptical-document
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-document'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-document'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.delegate=root.elliptical.delegate || {};
        root.elliptical.delegate.submit=factory();
        root.returnExports =root.elliptical.delegate.submit;
    }
}(this, function () {

    return function submit(customElements,history){
        var formSelector,routeAttr;
        if(customElements){
            formSelector='ui-form';
            routeAttr='route';
        }else{
            formSelector='[data-role="form"]';
            routeAttr='data-route';
        }

        $(document).on('submit', '[role="form"] form', function (event) {
            //var element=getParent(this,formSelector,customElements);

            var element = $(event.currentTarget).parents('[role="form"]');
            event.stopPropagation();
            event.preventDefault();
            var body= $(this).document();

            var dataRoute=element.attr(routeAttr);

            //create data object
            var data={
                route:this.action,
                body:body,
                method:$(this).attr('method'),
                element:this
            };

            /* query attributes and attach to the data objects
             *
             */
            $.each(element[0].attributes, function(i, att){
                if(!customElements){
                    if(att.name.indexOf('data-option-')===0){
                        var opt=att.name.replace('data-','');
                        data[opt.toCamelCase()]=att.value;
                    }
                }else{
                    data[att.name.toCamelCase()]=att.value;
                }
            });

            //trigger event  -->individual form route attribute takes precedence on any global setting
            if(typeof dataRoute !=='undefined' && dataRoute.toLowerCase()==='true'){
                $(document).trigger('elliptical.onDocumentRequest',data);
            }else if(typeof dataRoute !=='undefined' && dataRoute.toLowerCase()==='false'){
                $(document).trigger('elliptical.onDocumentSubmit',data);
            }else if(history){
                $(document).trigger('elliptical.onDocumentRequest',data);
            }else{
                $(document).trigger('elliptical.onDocumentSubmit',data);
            }
        });

        function getParent(that,selector,customElements){
            var parent=$(that).parents(formSelector);
            if(!parent[0] && customElements){
                parent=$(that).parents('[role="form"]');
            }
            return (parent[0]) ? parent : $(that);
        }
    };

}));



/*
 * =============================================================
 * elliptical.request
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-mvc'),require('elliptical-router'),require('elliptical-services'),
            require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-mvc','elliptical-router','elliptical-services','elliptical-utils'], factory);
    } else {
        //browser

        root.elliptical.request=factory(root.elliptical,root.elliptical.Router,root.elliptical.services,root.elliptical.utils);
        root.returnExports = root.elliptical.request;
    }
}(this, function (elliptical,Router,services,utils) {
    var Class=elliptical.Class;
    var Location=Router.Location;
    var _=utils._;
    var url_=Location.url;
    var request = Class.extend({


    },{
        init: function($sessionProvider){

            this.params={};
            this.query={};
            this.body={};
            this.route={};
            this.files={};


            var Session=services.Session;
            var session=new Session($sessionProvider);

            var sess_=session.get() || {};
            var Cookie=services.Cookie;

            Object.defineProperties(this, {
                'path':{
                    get: function(){

                        return Location.path();
                    },
                    configurable:false
                },

                'url':{
                    get: function(){

                        return Location.path();
                    },
                    configurable:false
                },

                'protocol':{
                    get: function(){
                        var protocol=window.location.protocol;
                        protocol=protocol.replace(':','');
                        return protocol;
                    },
                    configurable:false
                },

                'get':{
                    get: function(field){
                        console.log('warning: "get" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'accepted':{
                    get: function(){
                        console.log('warning: "accepted" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'accepts':{
                    get: function(){
                        console.log('warning: "accepts" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'is':{
                    get: function(){
                        console.log('warning: "is" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'xhr':{
                    get: function(){
                        return true;
                    },
                    configurable:false
                },

                'acceptsLanguage':{
                    get: function(lang){
                        console.log('warning: "acceptsLanguage" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'acceptsCharset':{
                    get: function(charset){
                        console.log('warning: "acceptsLanguage" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'acceptsCharsets':{
                    get: function(){

                        return false;
                    },
                    configurable:false
                },

                'acceptedLanguages':{
                    get: function(){

                        return false;
                    },
                    configurable:false
                },

                'originalUrl':{
                    get: function(){

                        return false;
                    },
                    configurable:false
                },

                'subdomains':{
                    get: function(){

                        return false;
                    },
                    configurable:false
                },

                'secure':{
                    get: function(){

                        return false;
                    },
                    configurable:false
                },

                'stale':{
                    get: function(){
                        console.log('warning: "stale" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'fresh':{
                    get: function(){
                        console.log('warning: "fresh" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'host':{
                    get: function(){
                        return window.location.hostname;

                    },
                    configurable:false
                },

                'ip':{
                    get: function(){


                    },
                    configurable:false
                },

                'ips':{
                    get: function(){
                        console.log('warning: "ips" not implemented on the browser.');
                        return false;
                    },
                    configurable:false
                },

                'cookies':{
                    get: function(key){
                        if(typeof key==='undefined'){
                            return Cookie.get();
                        }else{
                            return Cookie.get(key);
                        }
                    },
                    configurable:false
                },

                'signedCookies':{
                    get: function(){

                        return {};
                    },
                    configurable:false
                },

                'session' :{
                    get:function(){
                        _.extend(sess_,session.get());
                        session.put({session:sess_});
                        return sess_;
                    }
                }
            });
            this._parsedUrl={};
            this._parsedUrl.pathname=Location.path();
            this._parsedUrl.virtualize=function(url){
                var hashTag=window.elliptical.$hashTag;
                var virtualRoot=window.elliptical.$virtualRoot;

                if(hashTag){
                    url=url_.hashTagFormat(url);
                }

                url=url_.pathComponent(url);
                return url;
            };
            this.header=function(key){
                switch(key){
                    case 'Referer':
                        return document.referrer;
                        break;
                }
            };



        }


    });

    return request;


}));


/*
 * =============================================================
 * elliptical.response
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-mvc'),require('elliptical-services'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-mvc','elliptical-services'], factory);
    } else {
        //browser
        root.elliptical.response=factory(root.elliptical.utils,root.elliptical,root.elliptical.services);
        root.returnExports = root.elliptical.response;
    }
}(this, function (utils,elliptical,services) {
    var Class=elliptical.Class;
    var Cookie=services.Cookie;
    var response = Class.extend({
        req:{}



    },{
        init: function(req){
            this.req=req;
            this.charset={};
            this.context={};
            this.transition={};
            this.locals={};
            this.status=function(value){

            };
            this.set=function(field,value){

            };
            this.get=function(field){

            };
            this.cookie=function(name,value,options){
                var params={};
                params.key=name;
                params.value=value;
                params.options=options;
                return Cookie.put(params);
            };
            this.clearCookie=function(name,options){
                return Cookie.delete(name);
            };

            this.redirect=function(status,url){
                if(typeof url==='undefined'){
                    url=status;
                }
                url=decodeURIComponent(url);
                window.location = url;

            };
            this.location=function(path){

            };
            this.send=function(status,body){

            };
            this.json=function(status,body){

            };
            this.jsonp=function(status,body){

            };
            this.type=function(type){

            };
            this.format=function(obj){

            };
            this.attachment=function(filename){

            };
            this.sendfile=function(path,options,fn){

            };
            this.download=function(path,options,fn){

            };
            this.links=function(links){

            };

        },

        render:function(template,context,transition,callback){
            // support callback function as second arg or third arg
            if ('function' == typeof context) {
                callback = context, context = {};
            }else if('function' === typeof transition){
                callback=transition, transition=undefined;
            }
            this.app.render(template,context,transition,this.req,callback);
        },

        /**
         * merge a context with req.session.context
         * @param context {Object}
         * @public
         */
        setContext: function(context){
            var _=utils._;
            var req = this.req;
            req.session = req.session || {};
            _.merge(req.session,context);
        },

        /**
         * bind new instance of app.contextHelpers() to response
         * @returns {Object}
         */
        contextHelpers:function(){
            var req=this.req;
            var app=req.app;
            return new app.contextHelpers();
        },

        formContext:function(){
            return {
                submitLabel: {
                    css:"",
                    cssDisplay: "",
                    message:"&nbsp;"
                }
            }
        },

        /**
         * convenience method to execute function or next() based on error object
         * @param err {Object}
         * @param next {Function}
         * @param fn {Function}
         * @public
         */
        dispatch:function(err,next,fn){
            if(!err){
                fn.apply(this,arguments);
            }else{
                next(err);
            }
        }


    });

    return response;




}));


/*
 * =============================================================
 * elliptical.application
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-mvc'),require('elliptical-event'),require('elliptical-providers'),
            require('./request'),require('./response'),require('elliptical-router'),require('./delegates/index'),require('elliptical-delegate'),
            require('elliptical-platform'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-mvc','elliptical-event','elliptical-providers',
            './request','./response','elliptical-router','./delegates/index','elliptical-delegate',
            'elliptical-platform'], factory);
    } else {
        //browser

        root.elliptical.application=factory(root.elliptical.utils,root.elliptical,root.elliptical.Event,
            root.elliptical.providers,root.elliptical.request,root.elliptical.response,root.elliptical.Router,root.elliptical.delegate,root.elliptical.Delegate);
        root.returnExports = root.elliptical.browser;
    }
}(this, function (utils,elliptical,Event,providers,request,response,Router,delegate,Delegate) {
    var _=utils._,
        Transitions=providers.$transitions,
        url_=Router.Location.url;

    //console.log(Event.Event);
    var _customElements=false;

    return {
        /**
         * app init
         * @internal
         *
         */
        init:function(){
            window.elliptical.$hashTag=false;
            this.history=false;
            this.sessionSync=false;
            this.__observables=[];
            this.async=elliptical.async;
            this.factory=elliptical.factory;
            this.contextSettings();
            this.setEnvironment();
            this.$setDefaultProviders();
            /* define middleware stack */
            this.stack=[];
            /* init locations */
            this.locations=[];
            this.$sessionProvider=providers.session.$storage;
            this.Router=Router;
            this.utils=utils;
            this._defineProps();
            customElements();
            /* define a 'click' delegate */
            var delegate_=new Delegate([{event:'touchclick',delegate:'click'}]);
            delegate_.on();
            /* init the middleware stack */
            initStack(this);

            function initStack(app){
                /* monkey patch support for Function.name(IE) */
                utils.patchFunctionName();

                app.router = function appRouter() {
                    app.next();
                };
                /* use __name property to identify appRouter. Function.name is unreliable under minification */
                app.router.__name='appRouter';
                var route = '/';
                var fn = app.router;
                app.stack.push({route: route, handle: fn});

            }
            function customElements(){
                if($('html').hasClass('customelements')){
                    _customElements=true;
                }
            }
        },

        _defineProps:function(){
            /* getters/setters props */
            this._debug=false;
            this._virtualRoot='/';
            this._hashTag=false;
            this.settings.siteTitle='';
            var app_=this;

            Object.defineProperties(this, {
                'debug': {
                    get:function(){
                        return app_._debug;
                    },

                    set: function (val) {
                        Router.debug=val;
                        app_._debug=val;
                    }
                },

                'hashTag': {
                    get:function(){
                        return app_._hashTag;
                    },

                    set: function (val) {
                        Router.hashTag=val;
                        app_._hashTag=val;
                        window.elliptical.$hashTag=val;
                    }
                },

                'virtualRoot':{
                    get:function(){
                        return app_._virtualRoot;
                    },

                    set: function (val) {
                        Router.virtualRoot=val;
                        app_._virtualRoot=val;
                        app_.context.rootPath=val;
                        window.elliptical.$virtualRoot=val;
                    }
                },

                'siteRootTitle':{
                    get:function(){
                        return app_.settings.siteTitle;
                    },

                    set: function (val) {
                        app_.settings.siteTitle=val;
                    }
                }
            });
        },

        Location:function(params){
            if(params.history){
                this._setLocationHistoryService();
            }

            return Router.Location;
        },

        $setDefaultProviders:function(){
            //set the default Model provider
            var Service=elliptical.Service;
            //pagination provider
            Service.$paginationProvider=providers.$pagination;
            //set the view provider to the template provider
            elliptical.View.$provider=providers.$template;
        },


        /**
         * sets the environment (production or dev)
         * @param env {String}
         * @returns {String}
         * @public
         */
        setEnvironment:function(env){
            if(typeof env !== 'undefined'){
                this.context.ENV=env.toLowerCase();
            }else{
                if(!setFromDocumentQuery(this)){
                    setFromLocationQuery(this);
                }
            }

            function setFromDocumentQuery(c){
                var html=$('html');
                var dataEnv=html.attr('data-environment');
                if(typeof dataEnv !== 'undefined'){
                    c.context.ENV=dataEnv.toLowerCase();
                    return true;
                }else{
                    return false;
                }
            }

            function setFromLocationQuery(c){
                var hostname=document.location.hostname;
                c.context.ENV=(utils.isLocalHost(hostname)) ? 'development' : 'production';
            }
        },

        getPort:function(){
            return undefined;
        },


        /**
         * returns the environment(production or dev)
         * @returns {String}
         * @public
         */
        getEnvironment:function(){
            return this.context.ENV;
        },

        /**
         * configure
         * @param mode {String}
         * @param fn {Function}
         * @public
         */
        configure:function(mode,fn){
            if(typeof mode==='function'){
                fn=mode;
                fn.call(this);
            }else if(typeof mode==='string'){
                if(mode.toLowerCase()==='production' && this.context.ENV==='production'){
                    fn.call(this);
                }else if(mode.toLowerCase()==='development' && this.context.ENV==='development'){
                    fn.call(this);
                }
            }
        },


        /**
         * SERVER ONLY
         * returns a configuration object from config.json
         */
        config:function(){
            //ignore
        },




        /**
         *  **History Enabled Only**
         *
         * maps to Router.get
         * @param route {String}
         * @param callbacks {Function}
         * @public
         */
        get:function(route,callbacks){
            Router.get(route,callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.post
         * @param route {String}
         * @param callbacks {Function}
         * @public
         */
        post:function(route,callbacks){
            Router.post(route,callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.put
         * @param route {String}
         * @param callbacks {Function}
         * @public
         */
        put:function(route,callbacks){
            Router.put(route,callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.delete
         * @param route {String}
         * @param callbacks {Function}
         * @public
         */

        delete:function(route,callbacks){
            Router.delete(route,callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * @returns {Object}
         * @public
         */
        contextHelpers:function(){
            this.form=function(){
                return {
                    submitLabel:{
                        cssDisplay:'hidden',
                        message:'&nbsp;'
                    }
                }
            };
        },


        /**
         *
         *
         * context settings
         * @returns void
         * @public
         */
        contextSettings: function(){
            /* init app.context merged with template context for every route */
            this.context={};
            this.context.virtualRoot='/';

            /* this is a browser app */
            this.isServer=false;
            this.isBrowser=true;


            /* create an empty config object on app.settings */
            this.settings=this.settings || {};
            this.settings.config={
                cookie:{},
                session:{},
                providers:{}
            };
        },



        /**
         * BROWSER ONLY
         * appends template scripts tag to the document
         * @params rootPath {String}
         */
        templatesScriptLoader: function(rootPath){
            var root=this.virtualRoot;
            if(typeof rootPath !== 'undefined'){
                root=rootPath;
            }
            if(root==='/'){
                root='';
            }
            window.onload=function(){
                var script = document.createElement("script");
                script.src = root + "/scripts/templates.js";
                document.body.appendChild(script);
            };
        },

        /**
         *  **History Enabled Only**
         *
         * add an acl to a root path
         * @param path {String}
         * @param excludeArray {Array}
         * @returns void
         * @public
         */
        location: function(path,excludeArray){
            /* path must have leading slash */
            if (path.substring(0, 1) != '/') {
                path = '/' + path;
            }

            if(typeof excludeArray !== 'object'){
                excludeArray=[];
            }

            var access={
                path:path,
                exclude:excludeArray
            };

            this.locations.push(access);
        },

        /**
         *
         * @param url {String}
         * @returns {String}
         */
        parseRoute:function(url){
            return (this.hashTag) ? url_.hashTagFormat(url) : url;
        },


        /**
         *  **History Enabled Only**
         *
         *  subscriber to the Router dispatch emitted event
         */
        onDispatchRequest:function(){
            var self=this;
            Event.on('elliptical.onRouteDispatch',function(data){
                //dispatch, unless
                if(!(self.__cancelledRoute && self.__route===data.route)){
                    var route=data.route;
                    var handlers=data.handlers;
                    self.dispatch(route,handlers);
                }else{
                    self.__cancelledRoute=false;
                    self.__route=null;
                }

            });

        },

        /**
         *   **History Enabled Only**
         *   One Exception: setting the rootPath
         *
         * adds a function to the middleware stack
         *
         * @param route {String}
         * @param fn {Function}
         * @returns void
         * @public
         */
        use:function (route,fn){
            var stack = this.stack;
            if ('string' != typeof route) {
                fn = route;
                route = '/';
            }

            if (typeof fn != 'function') {
                //set the root path
                this.virtualRoot=route;
                return; //if not a function, exit
            }

            /* check if handler is appRouter */
            if (fn.__name && fn.__name === this.router.__name) {
                /* if so, delete the current app.router position in the stack */
                for (var i = 0; i < stack.length; i++) {
                    var handle = stack[i].handle;
                    if (handle.__name && handle.__name === this.router.__name || handle.length === 0) {
                        stack.splice(i, 1);
                        break;
                    }
                }
            }

            try {
                if (fn.length === 0 && fn.__name===undefined) {
                    return;
                }
            } catch (ex) {

            }
            //push the handler onto the middleware stack
            stack.push({route: route, handle: fn});
        },

        /**
         *  **History Enabled Only**
         *
         *  dispatches the callbacks for a route
         * @param route {String}
         * @param handlers {Array}
         * @returns void
         * @public
         */
        dispatch:function(route, handlers){
            route = _checkRoute(route);
            var stack = this.stack;

            /* build the middleware stack for this route */
            var thisCallStack = [];
            for (var i = 0; i < stack.length; i++) {
                var handle = stack[i].handle;
                if (handle.__name && handle.__name === this.router.__name) {
                    //push the route callbacks onto the stack at this position
                    for (var j = 0; j < handlers.length; j++) {
                        thisCallStack.push(handlers[j]);
                    }
                } else {
                    var rte = stack[i].route;
                    var index = route.toLowerCase().indexOf(rte);
                    if ((index > -1) && (route.length === rte.length || route.substring(index + 1, 0) === '/')) {
                        thisCallStack.push(stack[i].handle);
                    }
                }
            }

            /* instantiate request,response objects */
            _closeObservables(this);
            var req = new request(this.$sessionProvider);
            req.route=route;
            var res = new response(req);
            var app_=this;
            req.app=res.app=app_;
            req.res=res;
            res.req=req;

            /* if history, redefine res.redirect */
            if(this.history){
                res.redirect=function(route){
                    Router.location(route,'get',null);
                };
            }

            /* run the stack of callbacks */
            _callStack(thisCallStack, req, res);


            /**
             *
             * @param route
             * @returns {String}
             * @private
             */
            function _checkRoute(route) {
                if (route.substring(0, 1) != '/') {
                    route = '/' + route;
                }
                return route;
            }


            /**
             * executes the middleware stack
             * @param stack {Array}
             * @param req {Object}
             * @param res {Object}
             * @private
             */
            function _callStack(stack, req, res) {
                var i = 0;

                function next(err) {
                    var fn = stack[i++];

                    if (typeof fn === 'undefined') {
                        return;
                    }

                    if (typeof err != 'undefined') {
                        if (fn.length === 4) {
                            fn(err, req, res, next);
                        } else {
                            next(err);
                        }
                    } else {
                        if (fn.length < 4) {
                            fn(req, res, next);
                        } else {
                            next();
                        }
                    }
                }
                app_.next=next; /* next() is mangled under minification, so preserve the name by attaching it as a prop  */
                next();
            }

            function _closeObservables(app){
                var arr=app.__observables;
                arr.forEach(function(o){
                    o.close();
                })
            }
        },

        closeObservables:function(){
            var arr=this.__observables;
            arr.forEach(function(o){
                o.close();
            })
        },

        /**
         * SERVER ONLY
         * server-side execution of a function
         * @param fn {Function}
         */
        server:function(fn){
            //ignore
        },

        /**
         * BROWSER ONLY
         * client-side execution of a function
         * @param fn {Function}
         */
        browser:function(fn){
            fn.call(this);
        },

        /**
         * SERVER ONLY
         * convenience method to set standard middleware,cookies and session
         * @param params
         * @param $provider
         */
        defaultMiddleware: function (params,$provider) {
            //ignore
        },


        /**
         * SERVER ONLY
         * execute bootstrap functions on server start-up
         * @param stack {Array}(of Functions)
         * @param server {Object}
         * @param fn {Function} Callback
         */
        bootstrap: function (stack, server, fn) {
            //ignore
        },

        /**
         * executes document listeners, if applicable, then executes user provided function
         * @param params {Object}
         * @param fn {Function}
         */
        listen:function(params,fn){
            var self=this;
            var app_=this;
            var env=this.getEnvironment();
            var func=null;
            var length=arguments.length;
            //support 0-2 params
            if(length===0){
                /* $.controller will handle form submissions */
                delegate.submit(_customElements,false);
            }else if(length===1){
                if(typeof params==='function'){
                    func=fn;
                    /* $.controller will handle form submissions */
                    delegate.submit(_customElements,false);
                }else{
                    if(typeof params.history !=='undefined'){
                        if(params.history===true && params.forms==='history'){
                            start(true,this);//history for all http actions
                        }else if(params.history===true){
                            start(false,this) //history for http get only, event capture for forms
                        }
                        //if params.history=false, no event capture for any http action
                    }else{
                        /* $.controller will handle form submissions */
                        delegate.submit(_customElements,false);
                    }
                }
            }else{
                func=fn;
                if(typeof params.history !=='undefined'){
                    if(params.history===true && params.forms==='history'){
                        start(true,this);//history for all http actions
                    }else if(params.history===true){
                        start(false,this)//history for http get only, event capture for forms
                    }
                    //if params.history=false, no event capture for any http action
                }else{
                    /* $.controller will handle form submissions */
                    delegate.submit(_customElements,false);
                }
            }

            if(func){
                $(function(){
                    setTimeout(function(){
                        fn.call(this);
                    },3000);
                });
            }

            var TouchDrawer={};
            TouchDrawer.open=false;

            function start(history,c){
                /* $.controller will handle form submissions */
                delegate.submit(_customElements,history);
                /* router will listen for document requests */
                delegate.request(_customElements);
                /* set widget location provider */
                handleTouchLocation();
                location();
                /* subscribe to the router dispatch event */
                c.onDispatchRequest();
                /* replace Location redirect,reload functions */
                self._setLocationHistoryService();

                if(env==='production'){
                    Router.debug=false;
                }
                Router.start();
            }

            function location(){
                var f=function(url){
                    if(TouchDrawer.open){
                        TouchDrawer.close();
                        setTimeout(function(){
                            Router.location(url,'get',null);
                        },600);
                    }else{
                        Router.location(url,'get',null);
                    }

                };

                $.widget.$providers({location:f});

            }

            function handleTouchLocation(){
                $(window).on('drawer.open',function(event,data){
                    TouchDrawer.open=true;
                    TouchDrawer.close=data.closeEvent;
                });

                $(window).on('drawer.close',function(event,data){
                    TouchDrawer.open=false;
                });

                $(window).on('route.cancellation',function(event,data){
                    app_.__cancelledRoute=true;
                    app_.__route=data;
                });
            }

        },

        _setLocationHistoryService:function(){
            this.history=true;
            Router.Location.redirect=function(route){
                Router.location(route,'get',null);
            };

            Router.Location.reload=function(){
                var route=Location.path();
                Router.location(route,'get');
            };
        },


        /**
         *  **History Enabled Only**
         *
         * define a onBeforeRender hook
         * @param fn {Function}
         * @public
         */
        onBeforeRender:function(fn){
            if(typeof fn==='function'){
                this.viewCallback=fn;
            }
        },

        /**
         *  **History Enabled Only**
         *
         * render view or template
         * @param template {String}
         * @param context {Object}
         * @param transition {String}
         * @param req {Object}
         * @param callback {Function}
         * @public
         */
        render:function(template,context,transition,req,callback){
            var self = this
                , context = context || {}
                , app = this
                , transition = transition || 'none';

            //init transition param
            var transition_=transition;

            //instantiate the view object
            var View=elliptical.View;
            var view = new View();


            try{
                //merge context with app.context
                _.merge(context,app.context);

                //extend context with req.session

                if(req.session){
                    _.defaults(context,req.session);
                }
            }catch(ex){

            }

            context=setPageTitle(context,app);

            //reset root path, if default
            if(context.rootPath && context.rootPath==='/'){
                context.rootPath='';
            }

            //get the selector
            var selector=View.$getSelector();

            //test transition for selector and animation
            if(typeof transition ==='object'){
                if(typeof transition.selector != 'undefined'){
                    selector=transition.selector;
                }
                if(typeof transition.animation != 'undefined'){
                    transition_=transition.animation;
                }

            }
            //render...if onBeforeRender hook is defined, pass to it before rendering the view
            if(typeof app.viewCallback !='undefined'){
                app.viewCallback(req,this,context,function(cxt){

                    _render(cxt);
                });
            }else{
                _render(context);
            }

            //private dry function encapsulation of view render method
            function _render(context_){

                //set browser context
                var clientNamespace=View.clientContextRootNamespace;
                (View.pushContextToClient) ? setClientContext(clientNamespace,context) : setClientContext(clientNamespace,'');

                view.render(template,context_,function(err,out){

                    Transitions.render(selector,out,transition_,function(){
                        if(callback){
                            callback(err,out);
                        }
                    });

                });
            }

            // provide the context to the browser consistent with the server-side rendering method from elliptical.server
            function setClientContext(namespace,context){
                //TODO delete the script object, if exists

                if(window[namespace] && window[namespace].elliptical && window[namespace].elliptical.context) {
                    window[namespace].elliptical.context = context;
                }else if(window[namespace]){
                    window[namespace].elliptical={};
                    window[namespace].elliptical.context=context;
                }else{
                    window[namespace]={};
                    window[namespace].elliptical={};
                    window[namespace].elliptical.context=context;
                }
            }
            function setPageTitle(context,app){
                if(context.PageTitle){
                    if(app.settings.siteTitle){
                        context.PageTitle=app.settings.siteTitle + '-' + context.PageTitle;
                    }

                }else{
                    if(app.settings.siteTitle){
                        context.PageTitle=app.settings.siteTitle;
                    }
                }

                return context;
            }
        }
    }

}));



/*
 * =============================================================
 * elliptical.browser
 * =============================================================
 *
 *
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-mvc'),require('elliptical-event'),require('elliptical-middleware'),
            require('elliptical-providers'),require('elliptical-services'),require('elliptical-http'),require('elliptical-crypto'),
            require('./application'),require('./response'),require('./request'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-mvc','elliptical-event','elliptical-middleware','elliptical-providers','elliptical-services',
            'elliptical-http','elliptical-crypto','./application','./response','./request'], factory);
    } else {
        //browser
        root.elliptical.browser=factory(root.elliptical.utils,root.elliptical,root.elliptical.Event,root.elliptical.middleware,root.elliptical.providers,
            root.elliptical.services,root.elliptical.http,root.elliptical.crypto,root.elliptical.application,root.elliptical.response,root.elliptical.request);
        root.returnExports = root.elliptical.browser;
    }
}(this, function (utils,elliptical,Event,middleware,providers,services,http,crypto,application,response,request) {




    var _ = utils._;
    elliptical.Event=Event;
    elliptical.application=application;
    elliptical.response=response;
    elliptical.request=request;
    elliptical.http=http;
    elliptical.providers=providers;
    elliptical.services=services;
    elliptical.crypto = crypto;


    /* expose a try...catch  facade */
    elliptical.Try=function(next,fn){
        try{
            fn.apply(this,arguments);
        }catch(ex){
            next(ex);
        }
    };



    /**
     * Expose createApplication().
     */
    var exports_ = createApplication;


    /**
     * @return {Function}
     * @public
     */
    function createApplication() {
        /* create the browser app */
        var app=function(){};

        /* expose application object */
        _.defaults(app, application);

        /* init */
        app.init();

        return app;
    }


    /* expose elliptical */
    _.defaults(exports_, elliptical);

    /* expose elliptical middleware */
    _.defaults(exports_, middleware);

    /* expose elliptical services */
    _.defaults(exports_, services);

    window.elliptical=exports_;
    window.elliptical.$virtualRoot='/';

    return exports_;

}));



///elliptical.binding

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.binding=factory();
        root.returnExports =root.elliptical;
    }
}(this, function () {


    var services=[];

    var binding=function(x,fn){
        var self=this;

        $(document).on('OnElementBinding',function(event,data){
            var attr_=parseNodeAttributes(data.node,'ea-' + x);
            if(attr_){
                fn.call(self,data.node,attr_.value);
            }
        });

        this.service=function(name){
            var obj_=null;
            var service=null;
            services.forEach(function(obj){
                if(obj.name===name){
                    obj_=obj.service;
                }else if(obj.name==='Service'){
                    service=obj.service.extend({},{}); //if model service, extend it so that it each is a separate copy
                    service["@resource"]=name;
                }
            });

            return (obj_) ? obj_ : service;
        };

        this.jsonParseMessage = function (obj) {
            try {
                var msgObj = JSON.parse(obj);
                if (msgObj.message) {
                    return msgObj.message;
                } else {
                    return obj;
                }
            } catch (ex) {
                return obj;
            }
        };


    };

    binding.inject=function(){
        var services_=[];
        var args = [].slice.call(arguments);
        for(var i=0;i<args.length;i++){
            var name=(args[i]["@resource"]);
            if(!name){
                if(args[i].constructor && args[i].constructor["@resource"]){
                    name=args[i].constructor["@resource"];
                }else{
                    name='Service';
                }
            }

            services_.push({
                name:name,
                service:args[i]
            });

        }

        services=services.concat(services_);

    };



    function parseNodeAttributes(node,attrName){
        var attr_=null;
        $.each(node.attributes, function(i, att){
            if(attrName===att.name){
                attr_=att;
            }
        });

        return attr_
    }


    return binding;

}));












