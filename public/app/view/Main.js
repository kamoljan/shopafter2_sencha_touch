Ext.define('WL.view.Main', {

    extend: 'Ext.Container',

    requires: [
        'Ext.SegmentedButton',
        'WL.view.ad.List'
    ],

    xtype: 'main',

    config: {

        layout: {
            type: 'card',
            animation: {
                type: 'fade'
            }
        },

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
		cls: 'small withBg',
		title:{
			title: '<div class="headerTitle"></div>',
			style:{'position':'absolute', 'left':'0px', 'top':'9px'}
		},
                items: [
		{
                        xtype: 'spacer'
                    },

                    {
                        xtype: 'segmentedbutton',
                        allowDepress: false,
                        items: [
                            {
                                cls: 'ads',
                                iconCls: 'ads',
                                pressed: true
                            },
                            {
                                xtype: 'button',
                                cls: 'insertAdBtn',
                                iconCls: 'insertAdBtn'
                            }
//                            {
//                                xtype: 'button',
//                                cls: 'friends',
//                                iconCls: 'friends'
//                            }
                        ]
                    },


                    {
                        xtype: 'button',
                        cls: 'searchBtn',
                        iconCls: 'search'
                    },
                    {
                        xtype: 'component',
                        cls: 'fbProfilePic',
                        id: 'fbProfilePic',
                        tpl: '<img src="https://graph.facebook.com/{profileId}/picture?type=square" />'
                    }
                ]
            },
            {
                xtype: 'adList'
            }
        ]
    },

    initialize: function () {

        console.log('view.Main initialize');

        this.callParent();

        // Enable the Tap event on the profile picture in the toolbar, so we can show a logout button
        var profilePic = Ext.getCmp('fbProfilePic');
        if (profilePic) {
            profilePic.element.on('tap', function (e) {
                profilePic.fireEvent('tap', profilePic, e);
            });
        }
    }
});
