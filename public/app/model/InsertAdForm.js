Ext.define('WL.model.InsertAdForm', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'profileId'
            },
            {
                name: 'image'
            },
            {
                name: 'thumb'
            },
            {
                name: 'category',
                type: 'int'
            },
            {
                name: 'description'
            },
            {
                name: 'price',
                type: 'int'
            },
            {
                name: 'phone'
            },
            {
                name: 'latitude',
                type: 'float'
            },
            {
                name: 'longitude',
                type: 'float'
            },
            {
                name: 'date'
            }
        ],
        validations: [
//            {
//                type: 'presence',
//                field: 'image',
//                message: 'The pictures help you sell better, please upload them now!'
//            },
            {
                type: 'presence',
                field: 'category',
                message: 'The right category helps people find your item faster'
            },
            {
                type: 'presence',
                field: 'description',
                message: "People might not buy your item if they don’t understand what you’re selling. Why not describe it?"
            },
            {
                type: 'presence',
                field: 'price',
                message: "Tell people what your item’s worth!"
            },
            {
                type: 'presence',
                field: 'phone',
                message: "Enter your phone number"
            }
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
