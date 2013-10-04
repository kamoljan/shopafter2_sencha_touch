/**
 * The definition for the Sort bar at the top of the ad list
 */
Ext.define('WL.view.ad.SortBar', {

    extend: 'Ext.Toolbar',
    xtype: 'adSortBar',

    config: {

        cls: 'sort',
        id: 'sortContainer',
//        style: 'visibility: hidden',

        items: [
            {
                xtype: 'segmentedbutton',
                id: 'sortBy',
                flex: 1,

                layout: {
                    pack: 'center'
                },

                defaults: {
                    xtype: 'button',
                    flex: 1
                },

                items: [
//                    { text: 'Popular', pressed: true },
                    { text: 'Location' },
                    { text: 'Date' }
                ]
            }
        ]
    }
});
