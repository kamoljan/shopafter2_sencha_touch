Ext.define('WL.store.Ads', {

    extend: 'Ext.data.Store',

    requires: [
        'WL.model.Ad'
    ],

    config: {
        model: 'WL.model.Ad',

        pageSize: 20,

        proxy: {
            type: 'jsonp',
            url: '/ad',

            reader: {
                type: 'json',
                rootProperty: 'ads'
            }
        }
    }
});
