Ext.define('WL.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',

        controllers: [
        	'Ads'
        ],

        views: [
        	'WL.view.phone.ad.List',
        	'WL.view.phone.ad.Detail'
        ]
    },

    launch: function() {

        console.log('profile.Phone launch');

        WL.view.phone.ad.List.addXtype('adList');
        WL.view.phone.ad.Detail.addXtype('adDetail');
    },

    isActive: function() {

        console.log('profile.Phone isActive');

        return Ext.os.is.Phone;
    }
});
