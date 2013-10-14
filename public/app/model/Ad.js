Ext.define('WL.model.Ad', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: '_id',
        fields: [
            'profileId',
            'image',
            'thumb',
            'category',
            'description',
            'price',
            'phone',
            'latitude',
            'longitude',
            'date',
            '_id'
        ],
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