/**
 * This controller responds when a user clicks the 'Seen it', 'Want to see it', 'Like' and 'Dislike' buttons shown
 * in the ad list and ad detail pages.
 */
Ext.define('WL.controller.AdsViewings', {
    extend: 'Ext.app.Controller',

    config: {
        control: {

            // Target the adList xtype
            adList: {
                seen:        'onSeenAd',
                unSeen:      'onUnSeenAd',
                wantToSee:   'onWantToSeeAd',
                unWantToSee: 'onUnWantToSeeAd',
                like:        'onLikeAd',
                unLike:      'onUnLikeAd',
                dislike:     'onDislikeAd',
                unDislike:   'onUnDislikeAd'
            },

            // Target the adDetail xtype
            adDetail: {
                seen:        'onSeenAd',
                unSeen:      'onUnSeenAd',
                wantToSee:   'onWantToSeeAd',
                unWantToSee: 'onUnWantToSeeAd',
                like:        'onLikeAd',
                unLike:      'onUnLikeAd',
                dislike:     'onDislikeAd',
                unDislike:   'onUnDislikeAd'
            }
        }
    },


    /**
     * If a user wants to see a ad, set the fact they've seen it, liked it or disliked it to false
     */
    onWantToSeeAd: function(record) {
        console.log('controller.AdsViewings onWantToSeeAd');
        this.updateViewing(record, { wantToSee: true, seen: false, like: false, dislike: false });
    },

    onUnWantToSeeAd: function(record) {
        console.log('controller.AdsViewings onUnWantToSeeAd');
        this.updateViewing(record, { wantToSee: false, seen: false, like: false, dislike: false });
    },

    onSeenAd: function(record) {
        console.log('controller.AdsViewings onSeenAd');
        this.updateViewing(record, { wantToSee: false, seen: true, like: false, dislike: false });
    },

    onUnSeenAd: function(record) {
        console.log('controller.AdsViewings onUnSeenAd');
        this.updateViewing(record, { wantToSee: false, seen: false, like: false, dislike: false });
    },

    /**
     * Make sure a ad is 'disliked' when it is 'liked'. You can't like and dislike a ad at the same time.
     */
    onLikeAd: function(record) {
        console.log('controller.AdsViewings onLikeAd');
        this.updateViewing(record, { like: true, dislike: false });
    },

    onUnLikeAd: function(record) {
        console.log('controller.AdsViewings onUnLikeAd');
        this.updateViewing(record, { like: false, dislike: false });
    },

    onDislikeAd: function(record) {
        console.log('controller.AdsViewings onDislikeAd');
        this.updateViewing(record, { like: false, dislike: true });
    },

    onUnDislikeAd: function(record) {
        console.log('controller.AdsViewings onUnDislikeAd');
        this.updateViewing(record, { like: false, dislike: false });
    },

    /**
     * Sends the updated viewing information for a ad back to the server side via AJAX request. Also updates the
     * local viewing data, which will in turn update the HTML to highlight or un-highlight the appropriate button.
     */
    updateViewing: function(record, data) {
        console.log('controller.AdsViewings updateViewing');
        if (this.updating) {
            return;
        }
        this.updating = true;
        record.set(data);
        Ext.Ajax.request({
            url: '/viewing',
            method: 'POST',
            params: Ext.apply({
                adId: record.data.rottenId,
                title:   record.data.title
            }, data),
            success: function(response) {
                var data = JSON.parse(response.responseText);
                this.updating = false;
                // If there was an error from the Facebook api, pass it to the Facebook error handler to be parsed
                if (data.fbError) {
                    WL.Facebook.error(data.fbError)
                }
            },
            scope: this
        });
    }
});

