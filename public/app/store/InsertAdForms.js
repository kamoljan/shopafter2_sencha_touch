Ext.define('WL.store.InsertAdForms', {
    extend: 'Ext.data.Store',
    requires: [
        'WL.model.InsertAdForm'
    ],
    config: {
        model: 'WL.model.InsertAdForm',
        storeId: 'Ads',
        proxy: {
            type: 'ajax',
            url: 'ad',
            reader: {
                type: 'json',
                rootProperty: 'ads'
            }
        }
    }
});