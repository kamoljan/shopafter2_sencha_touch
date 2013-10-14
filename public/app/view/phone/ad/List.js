Ext.define('WL.view.phone.ad.List', {

    extend: 'WL.view.ad.List',

    config: {

        listeners: {
            order: 'before',
            select: function () {
                return false;
            },

            itemtap: function (dataview, index, target, record, evt) {

                var el = Ext.get(evt.target),
                    fireEvent;

                if (el.dom.nodeName == 'B') el = el.parent();

                WL.currentAd = record;

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
                } else {
                    fireEvent = 'tapAd';
                }

                if (fireEvent) {
                    this.fireEvent(fireEvent, record, el);
                }
            }
        },

        disableSelection: true,

        itemTpl: Ext.create('Ext.XTemplate',
            '<div class="img"><img src="{image}" /></div>',
            '$ {price}'
        )
    }
});
