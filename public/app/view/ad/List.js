/**
 * This view contains functionality shared between the ad list component for Phone and Tablet profiles.
 */
Ext.define('WL.view.ad.List', {
    extend: 'Ext.List',
    requires: [
        'Ext.form.Panel',
        'Ext.plugin.ListPaging',
        'Ext.TitleBar',
        'WL.view.ad.SortBar',
        'WL.view.ad.SearchBar'
    ],
    config: {
        store: 'Ads',
        plugins: [
            //To use this plugin its very important to include also CSS mixin : @include sencha-list-paging;
            {
                xclass: 'Ext.plugin.ListPaging'
            }
        ],
        itemCls: 'expandedAd',
        itemHeight: 114, //specify customItemHeight for 2.1
		// Specifying the `items` config on an Ext.List will add them at the top of the list, before the list itself.
        items: [
            {
                xtype: 'adSortBar',
                docked: 'top'
            },
            {
                xtype: 'adSearchBar',
                docked: 'top',
                hidden: true
            }
        ],
        loadingText: null
    },

    /**
     * This is an XTemplate formatting function shared between the tablet and phone list views. It displays the profile
     * pictures of friends with activity on this ad. If there are more than 5 friends, it will say '+X friend'
     */
    friendActivityFormatter: function (activity) {
        console.log('view.ad.List friendActivityFormatter');
        var pics = [], friendIds = [], additionalFriends, numAdditionalFriends, i;
        if (activity && activity.length) {
            for (i = 0; i < activity.length; i++) {
                if (!Ext.Array.contains(friendIds, activity[i].profileId)) {
                    pics.push('<img src="http://src.sencha.io/20/https://graph.facebook.com/' + activity[i].profileId + '/picture?type=square" />');
                    friendIds.push(activity[i].profileId);
                }
            }
            numAdditionalFriends = pics.length - 5;
            additionalFriends = numAdditionalFriends > 0 ? (' + ' + numAdditionalFriends + ' friend' + (numAdditionalFriends > 1 ? 's' : '')) : '';
            return pics.slice(0, 5).join('') + additionalFriends;
        } else {
            return 'No Friend Activity'
        }
    },

    /**
     * This function adds the formatting function above to the ad list template of the current profile. This is so
     * we don't have to duplicate this function to each of the Ad Detail templates for both phone and tablet.
     */
    applyItemTpl: function () {
        console.log('view.ad.List applyItemTpl');
        var itemTpl = this.callParent(arguments);
        itemTpl.friendActivity = this.friendActivityFormatter;
        return itemTpl;
    }
});
