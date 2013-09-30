Ext.ns('Ext.util'); // Fix for 2.1
//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src'
});
//</debug>

/**
 * This is the application definition file for ShopAfter.
 * Here we define the names of all our Profiles, Models, Stores,
 * Views & Controllers to include in the application.
 */

Ext.require([
    'Ext.field.Text',
    // Insert Ad
    'Ext.MessageBox',
    'Ext.data.JsonP',
    'Ext.data.Errors'
]);

Ext.application({

    name: 'WL',  // This is the namespace for our application.

    profiles: [
        'Phone',
        'Tablet'
    ],

    models: [
        'Ad',
        'InsertAdForm'
    ],

    stores: [
        'Ads',
        'Search',
        'Activity',
        'InsertAdForms'
    ],

    views: [
        'LoggedOut',
        'Main',
        'Activity',
        'ad.List',
        'Dialog',
        // Insert Ad
        'ad.CapturePicture',
        'ad.InsertAdForm'
    ],

    controllers: [
        'Facebook',
        'AdsViewings',
        'YouTube',
        'InsertAdForm'
    ],

    viewport: {
        autoMaximize: true // Causes the URL bar to be hidden once the application loads.
    },

    // This function will be run once the application is ready to be launched.
    launch: function () {

        console.log('application launch');

        // Initialize Facebook with our app ID
        WL.Facebook.initialize('723097297716821');

        if (window.localStorage && window.localStorage.WL) {
            var parsed = JSON.parse(window.localStorage.WL);
            this.fireEvent('localStorageData', parsed);

            console.log('app.launch parsed = %j', parsed);
        }

        // This is a convenience script which auto-reloads the CSS every second.
        // Combined with `compass watch`, this is useful during theme development as the page doesn't need to be reloaded.

        // setInterval(function(){
        //     Ext.DomQuery.select('link')[0].href = "resources/css/movies.css?" + Math.ceil(Math.random() * 100000000)
        // }, 1000);
    },

    /**
     * Convenience function for updating the URL location hash
     */
    updateUrl: function (url) {

        console.log('application updateUrl');

        this.getHistory().add(Ext.create('Ext.app.Action', {
            url: url
        }));
    },

    onUpdated: function () {

        console.log('application onUpdated');

        Ext.create('WL.view.Dialog', {
            msg: "Application update was a success. Reload now?",
            buttons: [
                {
                    ui: 'green',
                    text: 'Update Now',
                    handler: function () {
                        window.location.reload();
                    }
                },
                {
                    ui: 'red',
                    text: "Later"
                }
            ]
        }).show();
    }
});

