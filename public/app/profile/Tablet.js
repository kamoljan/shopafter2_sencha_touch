Ext.define('WL.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',

        controllers: [
            'Ads'
        ],

        views: [
            'Container',
            'WL.view.tablet.ad.List',
            'WL.view.tablet.ad.Detail',
            'WL.view.ad.CapturePicture',
            'WL.view.ad.InsertAdForm'
        ]
    },

    launch: function () {
        console.log('profile.Tablet launch');
        WL.view.tablet.ad.List.addXtype('adList');
        WL.view.tablet.ad.Detail.addXtype('adDetail');
    },

    isActive: function () {
        console.log('profile.Tablet isActive');
        return !Ext.os.is.Phone;
    }
});
