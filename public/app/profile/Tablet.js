Ext.define('WL.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',

        controllers: [
        	'Movies'
        ],

        views: [
        	'Container',
            'WL.view.tablet.movie.List',
        	'WL.view.tablet.movie.Detail'
        ]
    },

    launch: function() {

        console.log('profile.Tablet launch');

        WL.view.tablet.movie.List.addXtype('movieList');
        WL.view.tablet.movie.Detail.addXtype('movieDetail');
    },

    isActive: function() {

        console.log('profile.Tablet isActive');

        return !Ext.os.is.Phone;
    }
});
