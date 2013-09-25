
Ext.define('WL.store.Ads', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'WL.model.Ad',

        pageSize: 20,

        proxy: {
            type: 'jsonp',
            url: '/ads',

            reader: {
                type: 'json',
                rootProperty: 'ads'
            }
        }
    }
});
