Ext.define('WL.view.phone.ad.Detail', {

    extend: 'Ext.Container',
    requires: ['Ext.Anim'],

    config: {

        scrollable: 'vertical',

        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                cls: 'small',
                items: [
                    {
                        xtype: 'button',
                        cls: 'backBtn',
                        id: 'adBackButton',
                        align: 'left'
                    },
                    {
                        xtype: 'button',
                        cls: 'shareBtn',
                        iconCls: 'shareBtn',
                        id: 'adShareButton',
                        align: 'right'
                    }
                ]
            }
        ],
        tpl: Ext.create('Ext.XTemplate',
            '<div class="adDetail">',
//            '<div class="moreArrow"></div>',
            '<div class="adDetailInner">',
            '<div class="img"><img src="{image}" /></div>',
            '<tpl if="trailer"><button class="trailer">Play Trailer</button></tpl>',
//            '<div class="actions">',
//            '<div class="rating"><span>{% if (values.criticRating >= 0) { %}{criticRating}%{% } else { %}?{% } %}</span> on Rotten Tomatoes</div>',
//            '<button class="seen{[values.seen ? " selected" : ""]}">Seen It</button>',
//            '{% if (values.seen) { %}',
//            '<button class="thumb up{[values.like ? " selected" : ""]}"><b></b></button>',
//            '<button class="thumb down{[values.dislike ? " selected" : ""]}"><b></b></button>',
//            '{% } else { %}',
//            '<button class="want{[values.wantToSee ? " selected" : ""]}">Want to See It</button>',
//            '{% } %}',
//            '</div>',
            '<div class="synopsis">{description}</div>',
            '<tpl if="criticsConsensus"><div class="consensus">"{criticsConsensus}"</div></tpl>',
            '<div>',
            '<p>{price}</p>',
            '<p><span>Date:</span>{date}</p>',
            '<p><span>Phone number: </span><a href="tel:+{phone}">{phone}</a></p>',
            '</div>',
            '<div>',
            '<tpl if="director"><p>Directed By: {director}</p></tpl>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="fbActivity">',
            '<tpl for="friendActivity">',
            '<div class="x-list-item"><div class="x-list-item-label">',
            '<img src="https://graph.facebook.com/{profileId}/picture?type=square" />',
            '<b>{name}</b> {action} it',
            '</div></div>',
            '</tpl>',
            '</div>',
            {
                selected: function() {
                    return Math.round(Math.random(1)) ? ' selected' : '';
                },
                castList: function(cast) {
                    return Ext.Array.map(cast, function(c) {
                        return c.name;
                    }).join(', ');
                }
            }
        )
    },

    initialize: function() {

        console.log('view.phone.ad.Detail initialize');

        this.element.on({
            tap: function(e, dom) {

                var el = Ext.get(e.target),
                    fireEvent;

                if (el.dom.nodeName == 'B') el = el.parent();

                if (!e.target.nodeName.match(/button|b/i)) {
                    this.toggle();
                } else {

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
                    } else if (el.hasCls('trailer')) {
                        fireEvent = 'playTrailer';
                    }

                    if (fireEvent) {
                        this.fireEvent(fireEvent, WL.currentAd, el);
                    }
                }
            },
            delegate: '.adDetail',
            scope: this
        });

        this.element.on({
            tap: function(e, dom) {

                var el = Ext.get(e.target),
                    fireEvent;

                if (el.dom.nodeName == 'B') el = el.parent();

                if (el.hasCls('postToWall')) {
                    fireEvent = 'postToWall';
                } else if (el.hasCls('sendToFriend')) {
                    fireEvent = 'sendToFriend';
                }

                if (fireEvent) {
                    this.fireEvent(fireEvent, WL.currentAd, el);
                }
            },
            delegate: '.fbActions',
            scope: this
        });

        this.on('updatedata', this.calculateHeights);
        Ext.Viewport.on('orientationchange', this.calculateHeights, this);
    },

    calculateHeights: function() {

        console.log('view.phone.ad.Detail calculateHeights');

        var element = this.element.down('.adDetail'),
            innerElement = this.element.down('.adDetailInner');

        element.removeCls('ellipsis');
        element.setHeight('');
        this.outerHeight = element.getHeight();
        this.innerHeight = innerElement.getHeight();
        element.addCls('ellipsis');
    },

  /*  toggle: function() {

        console.log('view.phone.ad.Detail toggle');

        var me = this,
            element = this.element.down('.adDetail'),
            isClosed = element.hasCls('ellipsis');

        if (isClosed) {
            element.removeCls('ellipsis');

            if (Ext.os.is.Android) {
                element.setHeight(this.innerHeight);
            } else {
                Ext.Animator.run({
                    element: element,
                    duration: 250,
                    preserveEndState: true,
                    from: {
                        height: this.outerHeight
                    },
                    to: {
                        height: this.innerHeight
                    }
                });
            }

        } else {
            if (Ext.os.is.Android) {
                element.setHeight(this.outerHeight);
                element.addCls('ellipsis');
            } else {
                Ext.Animator.run({
                    element: element,
                    duration: 250,
                    from: {
                        height: this.innerHeight
                    },
                    to: {
                        height: this.outerHeight
                    },
                    preserveEndState: true,
                    onEnd: function() {
                        element.addCls('ellipsis')
                    }
                });
            }
        }

    }*/
});
