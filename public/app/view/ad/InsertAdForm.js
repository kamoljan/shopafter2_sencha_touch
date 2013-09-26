Ext.define('WL.view.InsertAdForm', {
//    extend: 'Ext.form.Panel',
    // FIXME: should I convert to Panel?
    extend: 'Ext.Container',

    xtype: 'insertadform',
    id: 'insertadform',

    config: {
        items: [
            {
                xtype: 'fieldset',
                id: 'fieldset1',
                // title: 'Post your ad!',
                //instructions: 'Please enter the information above.',
                defaults: {
                    labelWidth: '25%'
                },
                items: [
                    {
                        xtype: 'capturepicture'
                    },
                    {
                        xtype: 'selectfield',
                        id: 'category',
                        name: 'category',
                        required: true,
                        placeHolder: 'Choose a category',
                        autoSelect: false,
                        options: [
                            {text: 'Clothes', value: 1},
                            {text: 'Accessories', value: 2},
                            {text: 'Cosmetics', value: 3},
                            {text: 'Mobile Phones', value: 4},
                            {text: 'Babies & Children', value: 5},
                            {text: 'Other Electronics', value: 6},
                            {text: 'Household Items', value: 7},
                            {text: 'Hobbies & Collectibles', value: 8},
                            {text: 'Pets', value: 9},
                            {text: 'Cars', value: 10},
                            {text: 'Houses', value: 11},
                            {text: 'Sports', value: 12}
                        ]
                    },
                    {
                        xtype: 'textareafield',
                        id: 'description',
                        name: 'description',
                        placeHolder: 'What are you selling?',
                        required: true,
                        clearIcon: true
                    },
                    {
                        xtype: 'numberfield',
                        id: 'price',
                        name: 'price',
                        placeHolder: 'Your price?',
                        required: true,
                        clearIcon: true
                    }
                ]
            },
            {
                xtype: 'container',
                defaults: {
                    xtype: 'button',
                    style: 'margin: .5em',
                    flex: 1
                },
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        text: 'Reset',
                        handler: function () {
                            Ext.getCmp('insertadform').reset();
                        }
                    },
                    {
                        text: 'Save',
                        id: 'saveAdForm',
                        ui: 'confirm'
                    }
                ]
            }
        ]
    }
});