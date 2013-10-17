Ext.define('WL.view.LoggedOut', {
    extend: 'Ext.Container',
    xtype: 'loggedOut',
    config: {
        layout: 'fit',
        cls: 'loggedOut',
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                cls: 'loginScreen',
                items: [
                    {
                        html: "Log in and become part of the best online market place in Southeast Asia!!!"
                            + "<br />"
                            + "Don't worry, we won't share anything without your okay. Promise!"
                            + "<br />"
                            + "<br />"
                    },
                    {
                        xtype: 'button',
                        text: 'Login with Facebook',
                        id: 'fbLogin',
                        cls: 'fbLogin'
                    },
                    {
                        xtype: 'spacer'
                    },
                ]
            }
        ]
    }
});
