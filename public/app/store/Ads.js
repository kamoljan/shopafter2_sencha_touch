Ext.define('WL.store.Ads', {
    extend: 'Ext.data.Store',
    requires: [
        'WL.model.InsertAdForm'
    ],
    config: {
        model: 'WL.model.InsertAdForm',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '/ad',
            reader: {
                type: 'json',
                rootProperty: 'ads'
            }
        }
    }
});
