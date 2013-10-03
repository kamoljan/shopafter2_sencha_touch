Ext.define('WL.store.Ads', {
    extend: 'Ext.data.Store',
    requires: [
        'WL.model.Ad'
    ],
    config: {
        model: 'WL.model.Ad',
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
