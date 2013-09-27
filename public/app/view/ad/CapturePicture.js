Ext.define('WL.view.ad.CapturePicture', {
    extend: 'Ext.Component',
    xtype: 'capturepicture',

    config: {
        captured: false,
        width: 140,
        height: 100,
        cls: 'picture-capture',
        html: [
            '<div class="icon"><i class="icon-camera"></i> Make a pic</div>',
            '<img class="image-tns" />',
            '<input type="file" capture="camera" accept="image/*" />' //Step 1
        ].join('')
    },

    initialize: function() {

        console.log('view.ad.CapturePicture initialize');

        this.callParent(arguments);

        this.file = this.element.down('input[type=file]');
        this.img = this.element.down('img');

        this.file.on('change', this.setPicture, this); //Step 2

        //FIX for webkit
        window.URL = window.URL || window.webkitURL; //Step 3
    },

    setPicture: function(event) {

        console.log('view.ad.CapturePicture setPicture');

        var files = event.target.files;
        if (files.length === 1 && files[0].type.indexOf("image/") === 0) {
            this.img.setStyle('display', 'block');
            this.img.set({
                src: URL.createObjectURL(files[0]) //Step 4
            });
            this.setCaptured(true);
        }
    },

    reset: function() {

        console.log('view.ad.CapturePicture reset');

        this.img.setStyle('display', 'none');
        this.img.set({
            src: ''
        });
        this.setCaptured(false);
    },

    getImageDataUrl: function() { //Step 6

        console.log('view.ad.CapturePicture getImageDataUrl');

        var img = this.img.dom,
            imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

        if (this.getCaptured()) {
            // Make sure canvas is as big as the picture
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;

            // Draw image into canvas element
            imgContext.drawImage(img, 0, 0, img.width, img.height);

            // Return the image as a data URL
            return imgCanvas.toDataURL("image/jpeg");
        }
    }
});