Ext.define('WL.store.InsertAdForms', {
    extend: 'Ext.data.Store',

    requires: [
        'WL.model.Ad'
    ],

    config: {
        model: 'WL.model.Ad',
        storeId: 'Ads',
        proxy: {
            type: 'ajax',
            url: 'ad'
        }

    }
});