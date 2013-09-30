
Ext.define('WL.store.Search', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'WL.model.Ad',

        pageSize: 10,

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
