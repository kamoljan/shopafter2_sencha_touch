Ext.define('WL.controller.InsertAdForm', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            '#saveAdForm': {
                tap: 'validateAdForm'
            }
        }
    },

    validateAdForm: function (button, e, options) {

        console.log('controller.AdForm validateAdForm');

        var errorString = '',
            form = Ext.getCmp('insertadform'),
            fields = form.query('field');

        for (var i = 0; i < fields.length; i++) {
            fields[i].removeCls('invalidField');
        }

        var model = Ext.create('Yoglam.model.Ad', form.getValues());
        var errors = model.validate();

        if (!errors.isValid()) {
            errors.each(function (errorObj) {
                errorString += errorObj.getMessage() + '<br />';
                var s = Ext.String.format('field[name={0}]', errorObj.getField());
                //FIXME: need validation for category_id
                form.down(s).addCls('invalidField');
            });
            //alert('Errors in your input', errorString);
            return false;
        }

        Ext.getCmp('insertadform').setMasked({
            xtype: 'loadmask',
            message: 'Posting your ad ...'
        });

        this.updateLocation();
        return true;
    },

    init: function (application) {
        console.log('controller.AdForm init');
    },

    updateLocation: function () {

        console.log('controller.AdForm updateLocation');

        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function (geo) {
                    var form = Ext.getCmp('insertadform'),
                        capture = form.down('capturepicture'),
                        values = form.getValues();

                    // it is asynchronously coming here
                    Ext.Ajax.request({
                        url: '/ad',
                        method: 'POST',
                        params: {
                            image: capture.getImageDataUrl(),
                            category: values.category,
                            description: values.description,
                            price: values.price,
                            latitude: geo.getLatitude(),
                            longitude: geo.getLongitude()
                        },
                        //          callback: this.onAddRun,
                        scope: this
                    });
                    Ext.getCmp('insertadform').setMasked(false);
                    //Ext.Viewport.animateActiveItem({ xtype: 'main'}, { type: "slide", direction: "up" });

                    // TODO: bring user back to Search page and refresh search list
                    //Ext.ComponentQuery.query('main')[0].refresh();

                    //var viewport = Ext.ComponentQuery.query('main');
                    //target = Ext.ComponentQuery.query('searchcontainer');
                    //viewport[0].setActiveItem(target);
                },
                locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout) {
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred. Please, enable your Location access');
                    }
                    Ext.getCmp('insertadform').setMasked(false);
                }
            }
        });

        geo.updateLocation();
    }
});


