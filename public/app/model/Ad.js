Ext.define('WL.model.Ad', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'profileId',
            'image',
            'thumb',
            'category',
            'description',
            'price',
            'latitude',
            'longitude',
            'date',
            '_id'
        ],
        proxy: {
            type: 'jsonp',
            url: '/ads',
            limitParam: 'count',
            startParam: 'min',
            pageParam: false,
            extraParams: {
            },
            reader: {
                type: 'json',
                rootProperty: 'ads'
            }
        }
    }
});