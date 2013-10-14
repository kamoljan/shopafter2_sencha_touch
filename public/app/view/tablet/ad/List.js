Ext.define('WL.view.tablet.ad.List', {
    extend: 'WL.view.ad.List',
    config: {
        listeners: {
            itemtap: function (dataview, index, target, record, evt) {
                var el = Ext.get(evt.target);
                this.fireEvent('tapAd', record, el);
            }
        },
        itemTpl: Ext.create('Ext.XTemplate',
            '<div class="img"><img src="{image}" /></div>',
            '$ {price}'
//            '<div class="friends">{[this.friendActivity(values.friendActivity)]}</div>',
        )
    }
});
