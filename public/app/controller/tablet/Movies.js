/**
 * The tablet specific controller for Movies
 */
Ext.define('WL.controller.tablet.Movies', {

    extend: 'WL.controller.Movies',

    config: {
        refs: {
            tabletContainer: 'tabletContainer'
        }
    },

    init: function() {

        console.log('controller.tablet.Movies init');

        this.callParent();

        WL.Facebook.on({
            connected: this.onFacebookLogin,
            logout: this.onFacebookLogout,
            unauthorized: this.onFacebookUnauthorized,
            scope: this
        });
    },

    onFacebookLogin: function() {

        console.log('controller.tablet.Movies onFacebookLogin');

        this.callParent(arguments);
        this.initContainer();
    },

    initContainer: function() {

        console.log('controller.tablet.Movies initContainer');

        if (!this.mainContainer) {
            this.mainContainer = Ext.Viewport.add({ xtype: 'tabletContainer' });
        }
    },

    showMovie: function(record) {

        console.log('controller.tablet.Movies showMovie');

        WL.currentMovie = record;

        if (!this.movieDetailCmp) {
            this.movieDetailCmp = Ext.widget('movieDetail');
        }

        this.movieDetailCmp.setRecord(record);
        this.getToolbar().setTitle(record.get('title'));
        this.getTabletContainer().setActiveItem(this.movieDetailCmp);
    }
});
