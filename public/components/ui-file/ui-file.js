Elliptical(function () {
    $.element("elliptical.file", "ui-file", {

        /* Options to be used as defaults */
        options: {
            buttonSelector: '[data-role="file-picker"]',
            postUrl: null,
            maxSize: 10,
            delay: 1000,
            multiple: true,
            showOnLoad: true,
            text: 'Images'
        },

        /* internal/private object store */
        _data: {
            file: null,
            drop: null,
            dropClass: 'ui-drop-zone',
            previewClass: 'ui-preview',
            overlayClass: 'ui-upload-overlay',
            overlay: null,
            preview: null,
            progress: null,
            button: null,
            files: null,
            fileIndex: 0,
            images: null,
            xhr: null,
            element: null
        },

        /*==========================================
         PRIVATE
         *===========================================*/



        /**
         *
         * @private
         */
        _initElement: function () {
            /* add the html5 dataTransfer event to the jquery event object */
            $.event.props.push("dataTransfer");
            this._initUI();
            //only want to instantiate one of these suckers during the lifecycle of the widget
            this._initRequestObject();

            this._onEventTrigger('init', {});
        },

        /**
         * create a xmlhttprequest object and attach progress,load listeners
         * @private
         */
        _initRequestObject: function () {
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (e) {
                self._progress(e);
            }, false);

            xhr.upload.addEventListener("load", function (e) {
                self._onLoad(e);
            }, false);
            this._data.xhr = xhr;
        },

        /**
         * attach html UI to the DOM
         * @private
         */
        _initUI: function () {
            var overlay = $('<div class="' + this._data.overlayClass + '"></div>');
            var drop = $('<div class="' + this._data.dropClass + '"><h2>Drop ' + this.options.text + ' here</h2><p>or</p></div>');
            var input = $('<input type="file" />');
            if (this.options.multiple) {
                input.attr({
                    multiple: true
                })
            }
            var button = $('<button class="ui-button small" data-role="file-picker">Select ' + this.options.text + '</button>');
            drop.append(input);
            drop.append(button);

            var preview = $('<div class="' + this._data.previewClass + '"></div>');
            var progress = $('<progress data-role="progress" min="0" max="100" value="0"></progress>');

            overlay.append(drop);
            overlay.append(preview);
            overlay.append(progress);


            if (!this.options.showOnLoad) {
                overlay.hide();
            } else {
                this.element.addClass('active');
            }
            this.element.prepend(overlay);

            this._data.drop = drop;
            this._data.button = button;
            this._data.preview = preview;
            this._data.progress = progress;
            this._data.overlay = overlay;

            if (this._support.mq.touch) {
                this._hide();
            }

        },

        /**
         * called on file select change or "drop"
         * @param files{Array}
         * @private
         */
        _onFileChange: function (files) {
            this._data.fileIndex = 0;
            this._data.drop.hide();
            var preview = this._data.preview;
            preview.empty();
            preview.show();
            var ul = $('<ul></ul>');
            //var files=file[0].files;
            this._data.files = files;
            var imgArray = [];
            var limit = (files.length > this.options.maxSize) ? this.options.maxSize : files.length;
            for (var i = 0; i < limit; i++) {
                var li = $('<li></li>');
                ul.append(li);
                var img = document.createElement("img");
                var URL = window.URL || window.webkitURL;
                img.src = URL.createObjectURL(files[i]);
                img.onload = function (e) {
                    URL.revokeObjectURL(this.src);
                };
                imgArray.push(img);
                li[0].appendChild(img);
                var div = $('<div></div>');
                div.html(files[i].name + ': ' + parseInt(files[i].size / 1024) + ' KB');
                li.append(div);
            }

            this._data.preview.append(ul);
            this._data.images = imgArray;
            this._uploadFile(files[0]);

        },

        /**
         * show the upload UI
         * @private
         */
        _show: function () {
            this._data.overlay.show();
            this.element.addClass('active');
        },

        /**
         * hide the UI
         * @private
         */
        _hide: function () {
            this._data.overlay.hide();
            this.element.removeClass('active');
        },

        /**
         * fired when files have been uploaded
         * @private
         */
        _uploadComplete: function () {
            var progress = this._data.progress[0];
            progress.value = 0;
            var preview = this._data.preview;
            preview.empty();
            preview.hide();
            this._data.drop.show();
            this._data.fileIndex = 0;
            var eventData = {
                files: this._data.files
            };
            this._onEventTrigger('uploadcomplete', eventData);

        },

        /**
         *  method that either passes the next file to be uploaded or calls uploadComplete
         *
         * @private
         */
        _fileManager: function () {
            var index = this._data.fileIndex;
            var img = $(this._data.images[index]);
            var li = img.parent();
            li.remove();

            var files = this._data.files;
            index++;
            this._data.fileIndex = index;
            var limit = (files.length > this.options.maxSize) ? this.options.maxSize : files.length;
            if (index === limit) {
                this._uploadComplete();

            } else {
                this._uploadFile(files[index]);
            }

        },

        /**
         * upload a file
         * @param file
         * @private
         */
        _uploadFile: function (file) {
            var progress = this._data.progress[0];
            progress.value = 0;
            var postUrl = this.options.postUrl;

            var formData = new FormData();
            formData.append('file', file);

            var xhr = this._data.xhr;
            xhr.open("POST", postUrl);

            xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
            xhr.send(formData);

        },

        /**
         * XMLHttpRequest 'progress' handler, updates the progress bar UI
         * @param e
         * @private
         */
        _progress: function (e) {
            var progress = this._data.progress[0];
            if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);
                progress.value = percentage;
            }
        },

        /**
         * XMLHttpRequest 'load' event handler
         * @param e
         * @private
         */
        _onLoad: function (e) {
            var progress = this._data.progress[0];
            var self = this;
            progress.value = 100;

            setTimeout(function () {
                self._fileManager();

            }, self.options.delay);
        },

        _onClick: function (event) {
            var self = this;
            var file = this.element.find('input[type="file"]');

            file.trigger('click');
            this._event(file, 'change', function (event) {
                var files = file[0].files;
                self._onFileChange(files);
            });
        },



        /**
         * widget events
         * @private
         */
        _events: function () {
            var click = this._data.click;
            var self = this;
            /* input[type=file] click */
            var button = this._data.button;

            this._event(button, click, function (event) {
                self._onClick(event);
            });

            /* drag & drop */
            this._event(this.element, 'dragover', function (event) {
                event.preventDefault();
                event.stopPropagation();
            });

            this._event(this.element, 'drop', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var files = event.dataTransfer.files;
                self._onFileChange(files);
            });

        },

        _onDestroy: function () {
            this._data.overlay.remove();
            this.element.removeClass('active');
            var xhr = this._data.xhr;
            xhr.upload.removeEventListener("progress", function (e) {
                self._progress(e);
            }, false);

            xhr.upload.removeEventListener("load", function (e) {
                self._onLoad(e);
            }, false);
            this._data.xhr = null;
        },



        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show: function () {
            this._show();
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hide();
        }


    });
});