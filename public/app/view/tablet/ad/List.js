Ext.define('WL.view.tablet.ad.List', {
    extend: 'WL.view.ad.List',
    config: {
        listeners: {
            itemtap: function(dataview, index, target, record, evt) {
                var el = Ext.get(evt.target);
                this.fireEvent('tapAd', record, el);
            }
        },
        itemTpl: Ext.create('Ext.XTemplate',
            '<div class="img"><img src="{image}" /></div>',
            '<div class="meta">',
                '<h3>{description}</h3>',
                '<div class="actions">',
                    '<p>{price}</p>',
                    '<p>{date}</p>',
                '</div>',
                '<div class="friends">{[this.friendActivity(values.friendActivity)]}</div>',
            '</div>'
        )
    }
});
