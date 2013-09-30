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
            'latitude',
            'longitude',
            'date',

            '_id'
        ],

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