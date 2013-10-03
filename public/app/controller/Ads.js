/**
 * This controller handles functions common to both Phone and Tablets
 */
Ext.define('WL.controller.Ads', {
    extend: 'Ext.app.Controller',
    config: {
        routes: {
            'ad/:id': 'onAdUrl'
        },
        refs: {
            adList: 'adList',
            main: 'main',
            loggedOut: 'loggedOut',
            toolbar: 'adDetail toolbar',
            sortBar: 'adSortBar',
            searchBar: 'adSearchBar',
            searchButton: 'main toolbar button[iconCls=search]'
        },
        control: {
            adList: {
                tapAd: 'onAdTap'
            },
            adDetail: {
                postToWall: 'onPostToWall',
                sendToFriend: 'onSendToFriend',
                playTrailer: 'onPlayTrailer'
            },
            activity: {
                itemtap: 'onViewingTap'
            },
            searchButton: {
                tap: 'onSearchButton'
            },
            '#sortBy': {
                toggle: 'onSortToggle'
            },
            '#searchField': {
                action: 'onSearch',
                change: 'onSearch',
                clearicontap: 'onSearchClear'
            },
            'toolbar button[iconCls=ads]': {
                tap: 'onAdIconTap'
            },
            'toolbar button[iconCls=friends]': {
                tap: 'onActivityIconTap'
            },
            'toolbar button[iconCls=insertAdBtn]': {
                tap: 'onInsertAdTap'
            },
            '#fbProfilePic': {
                tap: 'onProfileTap'
            },
            '#logoutButton': {
                tap: 'logout'
            },
            '#adShareButton': {
                tap: 'onAdShare'
            },
            '#saveAdForm': {
                tap: 'validateAdForm'
            }
        }
    },
    onLocalStorageData: function (data) {
        console.log('controller.Ads onLocalStorageData');
        var store = Ext.getStore('Ads');
        this.initContainer();
        store.setData(data.ads);
        store.fireEvent('load', store, store.data);
        this.onFirstLoad(data.profileId);
    },

    onFacebookLogin: function () {
        console.log('controller.Ads onFacebookLogin');
        Ext.getBody().removeCls('splashBg');
        Ext.getStore('Ads').onBefore('datarefresh', function (store, data, operation, eOpts, e) {
            var tmp = JSON.parse(operation.getResponse().responseText);
            var cache = JSON.stringify({
                ads: tmp.ads,
                profileId: FB.getUserID()
            });
            if (window.localStorage && window.localStorage.WL && window.localStorage.WL == cache) {
                return false;
            }
            window.localStorage.WL = cache;
            if (!this.firstLoad) {
                this.onFirstLoad(FB.getUserID());
                this.firstLoad = true;
            }
        }, this);
        Ext.getStore('Ads').load();
    },

    onFirstLoad: function (profileId) {
        console.log('controller.Ads onFirstLoad');
        Ext.getCmp('fbProfilePic').setData({
            profileId: profileId
        });
        /*
         var learnMore = Ext.ComponentQuery.query('#promo-container')[0];
         learnMore.element.on({
         tap: this.onAbout,
         scope: this,
         delegate: 'button'
         });
         */
    },


    init: function () {
        console.log('controller.Ads init');
        WL.app.on({
            localStorageData: 'onLocalStorageData',
            scope: this
        });
    },

    /**
     * When a user clicks the search button, scroll to the top
     */
    onSearchButton: function () {
        console.log('controller.Ads onSearchButton');
        var bar = this.getAdList().down('adSearchBar');
        if (bar.getHidden()) {
            bar.show({type: 'fade'});
        } else {
            bar.hide();
        }
    },

    onAdTap: function (record) {
        console.log('controller.Ads onAdTap');
        WL.app.updateUrl('ad/' + record.get('_id'));
        this.showAd(record);
    },

    onViewingTap: function (list, idx, el, record) {
        console.log('controller.Ads onViewingTap');
        this.onAdUrl(record.get('_id'));
    },

    onAdUrl: function (adId) {
        console.log('controller.Ads onAdUrl');
        var adStore = Ext.getStore('Ads'),
            ad = adStore.findRecord('_id', adId);
        if (ad) {
            this.showAd(ad);
        } else {
            WL.model.Ad.load(adId, {
                success: function (ad) {
                    this.showAd(ad);
                },
                scope: this
            });
        }
    },

    onSearch: function (searchField) {
        console.log('controller.Ads onSearch');
        var searchStore = Ext.getStore('Search'),
            value = searchField.getValue();
        if (value != '') {
            this.getAdList().setMasked({ xtype: 'loadmask' });
            searchStore.load({
                params: {
                    q: searchField.getValue()
                },
                callback: function () {
                    this.getAdList().setStore(searchStore);
                    this.getAdList().setMasked(false);
                },
                scope: this
            });
        }
    },

    onSearchClear: function () {
        console.log('controller.Ads onSearchClear');
        this.getAdList().setStore(Ext.getStore('Ads'));
    },

    onAdIconTap: function () {
        console.log('controller.Ads onAdIconTap');
        this.getSearchButton().show();
        this.getMain().setActiveItem(this.getAdList());
    },

    onActivityIconTap: function () {
        console.log('controller.Ads onActivityIconTap');
        this.getSearchButton().hide();
        if (!this.activityCard) {
            this.activityCard = Ext.widget('activity');
            Ext.getStore('Activity').load();
        }
        this.getMain().setActiveItem(this.activityCard);
        this.activityCard.deselectAll();
    },

    onInsertAdTap: function () {
        console.log('controller.Ads onInsertAdTap');
        //this.getSearchButton().hide();
        if (!this.insertAdCard) {
            this.insertAdCard = Ext.widget('insertadform');
        }
        this.getMain().setActiveItem(this.insertAdCard);
    },

    onSortToggle: function (segBtn, btn) {
        console.log('controller.Ads onSortToggle');
        this.getAdList().setStore(Ext.getStore('Ads'));
        this.getAdList().setMasked({ xtype: 'loadmask' });
        this.getAdList().deselectAll();
        Ext.getStore('Ads').getProxy().setExtraParams({sort: btn.getText()});
        Ext.getStore('Ads').loadPage(1);
    },

    /**
     * When the user profile picture is tapped, create a Logout button and pop it up next to the avatar.
     */
    onProfileTap: function (cmp) {
        console.log('controller.Ads onProfileTap');
        if (!this.logoutCmp) {
            this.logoutCmp = Ext.create('Ext.Panel', {
                width: 120,
                height: 45,
                top: 0,
                left: 0,
                modal: true,
                cls: 'float-panel', //2.1
                hideOnMaskTap: true,
                items: [
                    {
                        xtype: 'button',
                        id: 'logoutButton',
                        text: 'Logout',
                        ui: 'decline'
                    }
                ]
            });
        }
        this.logoutCmp.showBy(cmp);
    },

    /**
     * Hide the logout popup, then call the Facebook logout function. We have a listener elsewhere to deal with the
     * `logout` event the Facebook SDK fires once the user has successfully been logged out.
     */
    logout: function () {
        console.log('controller.Ads logout');
        this.logoutCmp.hide();
        FB.logout();
    },

    onFacebookLogout: function () {
        console.log('controller.Ads onFacebookLogout');
        Ext.getBody().addCls('splashBg');
        Ext.Viewport.setActiveItem({ xtype: 'loggedOut' });
        if (this.adDetailCmp) {
            this.adDetailCmp.destroy();
        }
        this.getMain().destroy();
    },

    onAdShare: function () {
        console.log('controller.Ads onAdShare');
        var me = this;
        Ext.create('WL.view.Dialog', {
            msg: "Share this ad to your Wall?",
            items: [
                {
                    xtype: 'textfield',
                    labelWidth: 0,
                    width: '100%',
                    cls: 'wallMessage',
                    id: 'wallMessage',
                    placeHolder: 'Message...'
                }
            ],
            buttons: [
                {
                    ui: 'green',
                    text: 'Post to wall.',
                    handler: function () {
                        me.postToWall();
                        this.getParent().hide();
                    }
                },
                {
                    ui: 'red',
                    text: "No thanks.",
                    handler: function () {
                        this.getParent().hide()
                    }
                }
            ]
        }).show();
    },

    onAbout: function () {
        console.log('controller.Ads onAbout');
        Ext.create('WL.view.Dialog', {
            msg: [
                "<p>The Watch List was built with Sencha Touch, a Javascript framework that lets you easily build ",
                "beautiful mobile apps using Javascript, HTML5 and CSS3.</p>"
            ].join(''),
            buttons: [
                {
                    ui: 'green',
                    text: 'Visit Sencha Touch Website',
                    handler: function () {
                        window.open("http://www.sencha.com/products/touch", "_blank");
                    }
                }
            ]
        }).show();
    },

    onPlayTrailer: function (ad) {
        console.log('controller.Ads onPlayTrailer');
        var videoId = ad.get('trailer').match(/v=(.*)$/);
        WL.app.getController('YouTube').showTrailer(videoId[1]);
    },

    onFacebookUnauthorized: function () {
        console.log('controller.Ads onFacebookUnauthorized');
        if (this.mainContainer) {
            Ext.create('WL.view.Dialog', {
                msg: "Oops! Your Facebook session has expired.",
                buttons: [
                    {
                        ui: 'green',
                        text: 'Login to Facebook',
                        handler: function () {
                            window.location = WL.Facebook.redirectUrl();
                        }
                    }
                ]
            }).show();
        } else {
            Ext.Viewport.add({ xtype: 'loggedOut' });
        }
    },

    validateAdForm: function (button, e, options) {
        console.log('controller.Ads validateAdForm');
        var errorString = '',
            form = Ext.getCmp('insertadform'),
            fields = form.query('field');
        for (var i = 0; i < fields.length; i++) {
            fields[i].removeCls('invalidField');
        }
        var model = Ext.create('WL.model.InsertAdForm', form.getValues());
        var errors = model.validate();
        if (!errors.isValid()) {
            errors.each(function (errorObj) {
                errorString += errorObj.getMessage() + '<br />';
                var s = Ext.String.format('field[name={0}]', errorObj.getField());
                //FIXME: need validation for category_id
                form.down(s).addCls('invalidField');
            });
            alert('Errors in your input', errorString);
            //return false;  //FIXME: need a validation
        }
        Ext.getCmp('insertadform').setMasked({
            xtype: 'loadmask',
            message: 'Posting your ad ...'
        });
        this.getLocation();
        return true;
    },

    postAd: function (lat, lon) {
        var form = Ext.getCmp('insertadform'),
            capture = form.down('capturepicture'),
            values = form.getValues();
        Ext.Ajax.request({
            url: '/ad',
            scope: this,  //need this to be able access the controller scope
            method: 'POST',
            params: {
                image: capture.getImageDataUrl(),
                category: values.category,
                description: values.description,
                price: values.price,
                latitude: lat,
                longitude: lon
            },
            callback: function (success) {
                if (success) {
                    this.onAdIconTap();
                } else {
                    alert('Error occurred. Please, check your connection');
                }
                Ext.getCmp('insertadform').setMasked(false);
            }
        });
    },

    getLocation: function () {
        console.log('controller.Ads updateLocation');
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                scope: this,  //need this to be able access the controller scope
                locationupdate: function (geo) {
                    //Asynchronously coming here
                    this.postAd(geo.getLatitude(), geo.getLongitude());
                },
                locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout) {
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred. Please, enable your Location access');
                    }
                    Ext.getCmp('insertadform').setMasked(false);
                }
            }
        });
        geo.updateLocation();
    }

});