/**
 * This is a Phone specific controller for Movies.
 */
Ext.define('WL.controller.phone.Movies', {
    extend: 'WL.controller.Movies',

    config: {
        routes: {
            'home': 'onMovieBack'
        },
        control: {
            '#movieBackButton': {
                tap: 'doMovieBack'
            }
        },
        refs: {
            toolbar: 'movieDetail titlebar'
        }
    },

    init: function() {

        console.log('controller.phone.Movies init');

        this.callParent();

        WL.Facebook.on({
            connected: this.onFacebookLogin,
            logout: this.onFacebookLogout,
            unauthorized: this.onFacebookUnauthorized,
            scope: this
        });
    },

    onFacebookLogin: function() {

        console.log('controller.phone.Movies onFacebookLogin');

        this.callParent(arguments);
        this.initContainer();
    },

    initContainer: function() {

        console.log('controller.phone.Movies initContainer');

        if (!this.mainContainer) {
            this.mainContainer = Ext.Viewport.add({ xtype: 'main' });
        }
    },

    showMovie: function(record) {

        console.log('controller.phone.Movies showMovie');

        WL.currentMovie = record;

        if (!this.movieDetailCmp) {
            this.movieDetailCmp = Ext.widget('movieDetail');
        }

        this.getToolbar().setTitle(record.get('title'));

        Ext.Viewport.animateActiveItem(this.movieDetailCmp, {
            type: 'slide',
            direction: 'left'
        });

        // This needs to be after the item is painted so we can set the content height
        this.movieDetailCmp.setRecord(record);
    },

    doMovieBack: function() {

        console.log('controller.phone.Movies doMovieBack');

        WL.app.updateUrl('home');
        this.onMovieBack();
    },

    onMovieBack: function() {

        console.log('controller.phone.Movies onMovieBack');

        Ext.Viewport.animateActiveItem(this.getMain(), {
            type: 'slide',
            direction: 'right'
        });
    }

});
