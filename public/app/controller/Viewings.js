/**
 * This controller responds when a user clicks the 'Seen it', 'Want to see it', 'Like' and 'Dislike' buttons shown
 * in the movie list and movie detail pages.
 */
Ext.define('WL.controller.Viewings', {
    extend: 'Ext.app.Controller',

    config: {
        control: {

            // Target the movieList xtype
            movieList: {
                seen:        'onSeenMovie',
                unSeen:      'onUnSeenMovie',
                wantToSee:   'onWantToSeeMovie',
                unWantToSee: 'onUnWantToSeeMovie',
                like:        'onLikeMovie',
                unLike:      'onUnLikeMovie',
                dislike:     'onDislikeMovie',
                unDislike:   'onUnDislikeMovie'
            },

            // Target the movieDetail xtype
            movieDetail: {
                seen:        'onSeenMovie',
                unSeen:      'onUnSeenMovie',
                wantToSee:   'onWantToSeeMovie',
                unWantToSee: 'onUnWantToSeeMovie',
                like:        'onLikeMovie',
                unLike:      'onUnLikeMovie',
                dislike:     'onDislikeMovie',
                unDislike:   'onUnDislikeMovie'
            }
        }
    },


    /**
     * If a user wants to see a movie, set the fact they've seen it, liked it or disliked it to false
     */
    onWantToSeeMovie: function(record) {

        console.log('controller.Viewings onWantToSeeMovie');

        this.updateViewing(record, { wantToSee: true, seen: false, like: false, dislike: false });
    },
    onUnWantToSeeMovie: function(record) {

        console.log('controller.Viewings onUnWantToSeeMovie');

        this.updateViewing(record, { wantToSee: false, seen: false, like: false, dislike: false });
    },

    onSeenMovie: function(record) {

        console.log('controller.Viewings onSeenMovie');

        this.updateViewing(record, { wantToSee: false, seen: true, like: false, dislike: false });
    },
    onUnSeenMovie: function(record) {

        console.log('controller.Viewings onUnSeenMovie');

        this.updateViewing(record, { wantToSee: false, seen: false, like: false, dislike: false });
    },

    /**
     * Make sure a movie is 'disliked' when it is 'liked'. You can't like and dislike a movie at the same time.
     */
    onLikeMovie: function(record) {

        console.log('controller.Viewings onLikeMovie');

        this.updateViewing(record, { like: true, dislike: false });
    },
    onUnLikeMovie: function(record) {

        console.log('controller.Viewings onUnLikeMovie');

        this.updateViewing(record, { like: false, dislike: false });
    },

    onDislikeMovie: function(record) {

        console.log('controller.Viewings onDislikeMovie');

        this.updateViewing(record, { like: false, dislike: true });
    },
    onUnDislikeMovie: function(record) {

        console.log('controller.Viewings onUnDislikeMovie');

        this.updateViewing(record, { like: false, dislike: false });
    },

    /**
     * Sends the updated viewing information for a movie back to the server side via AJAX request. Also updates the
     * local viewing data, which will in turn update the HTML to highlight or un-highlight the appropriate button.
     */
    updateViewing: function(record, data) {

        console.log('controller.Viewings updateViewing');

        if (this.updating) {
            return;
        }

        this.updating = true;

        record.set(data);

        Ext.Ajax.request({
            url: '/viewing',
            method: 'POST',
            params: Ext.apply({
                movieId: record.data.rottenId,
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

