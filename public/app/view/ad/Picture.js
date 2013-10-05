Ext.define('WL.view.ad.Picture', {
    extend: 'Ext.Container',
    alias: 'widget.contactpic',
    xtype: 'devicepicture',

    config: {
        height: 120,
        minHeight: 100,
        style: 'overflow: hidden',
        ui: '',
        layout: {
            align: 'center',
            type: 'vbox'
        },
        overflow: 'hidden',
        tpl: [
            '<img src="{picture}" width="160" />'
        ],
        items: [
            {
                xtype: 'component',
                html: ''
            },
            {
                xtype: 'button',
                bottom: 5,
                itemId: 'mybutton',
                right: 5,
                iconCls: 'add',
                iconMask: true
            }
        ],
        listeners: [
            {
                fn: 'onMybuttonTap',
                event: 'tap',
                delegate: '#mybutton'
            }
        ]
    },

    onMybuttonTap: function (button, e, options) {
        Ext.device.Camera.capture({
            source: 'camera',
            destination: 'file',

            success: function (url) {
                this.fireEvent('change', this, url);
            },
            failure: function () {
                Ext.Msg.alert('Error', 'There was an error when acquiring the picture.');
            },
            scope: this
        });
    }

});