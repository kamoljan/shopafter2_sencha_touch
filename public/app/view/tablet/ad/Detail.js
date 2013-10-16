Ext.define('WL.view.tablet.ad.Detail', {
    extend: 'Ext.Container',
    config: {
        scrollable: 'vertical',
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                cls: 'small',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        cls: 'shareBtn',
                        iconCls: 'shareBtn',
                        id: 'adShareButton'
                    }
                ]
            }
        ],
        tpl: Ext.create('Ext.XTemplate',
            '<div class="adDetail tablet">',
                '<div class="adDetailInner">',
                    
                        '<div class="img"><img src="{image}" /></div>',
                        '<div class="fbProfilePic"><img src="https://graph.facebook.com/{profileId}/picture?type=square" /></div>',
                        '<span class="userName">Van Do</span>',
                        '<p class="adDetailData">Posted at: {date}</p>',
                        '<p class="adDetailPrice">$ {price}</p>',
                        '<p class="adDetailPhone"><a href="tel:+{phone}">{phone}</a></p>',
                        '<p class="adDetailDesc">{description}</p>',
                    
                '</div>',
            '</div>',
            {
                selected: function () {
                    return Math.round(Math.random(1)) ? ' selected' : '';
                },
                castList: function (cast) {
                    return Ext.Array.map(cast,function (c) {
                        return c.name;
                    }).join(', ');
                }
            }
        )
    },

    initialize: function () {
        console.log('view.tablet.ad.Detail initialize');
        this.element.on({
            tap: function (e, dom) {
                var el = Ext.get(e.target),
                    fireEvent;
                if (el.dom.nodeName == 'B') el = el.parent();
                if (e.target.nodeName.match(/button|b/i)) {
                    if (el.hasCls('seen')) {
                        fireEvent = el.hasCls('selected') ? 'unSeen' : 'seen';
                        el.toggleCls('selected');
                    } else if (el.hasCls('want')) {
                        fireEvent = el.hasCls('selected') ? 'unWantToSee' : 'wantToSee';
                        el.toggleCls('selected');
                    } else if (el.hasCls('thumb') && el.hasCls('up')) {
                        fireEvent = el.hasCls('selected') ? 'unLike' : 'like';
                        el.toggleCls('selected');
                    } else if (el.hasCls('thumb') && el.hasCls('down')) {
                        fireEvent = el.hasCls('selected') ? 'unDislike' : 'dislike';
                        el.toggleCls('selected');
                    } else if (el.hasCls('postToWall')) {
                        fireEvent = 'postToWall';
                    } else if (el.hasCls('sendToFriend')) {
                        fireEvent = 'sendToFriend';
                    } else if (el.hasCls('trailer')) {
                        fireEvent = 'playTrailer';
                    }
                    if (fireEvent) {
                        this.fireEvent(fireEvent, WL.currentAd, el);
                    }
                }
            },
            scope: this
        });
    }
});
