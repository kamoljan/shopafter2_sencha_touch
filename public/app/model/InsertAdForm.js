Ext.define('WL.model.InsertAdForm', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'image' },
            { name: 'thumb'},
            { name: 'category', type: 'int' },
            { name: 'description' },
            { name: 'price', type: 'int' },
            { name: 'latitude', type: 'float' },
            { name: 'longitude', type: 'float' }
        ],
        validations: [
            {type: 'presence', field: 'description', message: "Description what are you selling."},
            {type: 'presence', field: 'price', message: "Enter price"}
        ]
    }
});
