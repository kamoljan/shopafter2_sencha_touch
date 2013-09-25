/**
 * The definition for the Search bar at the top of the ad list
 */
Ext.define('WL.view.ad.SearchBar', {

	extend: 'Ext.form.Panel',
	xtype: 'adSearchBar',

	config: {

    	scrollable: false, // Override the form panel
    	//style: 'visibility: hidden',
        cls: 'search',
        id: 'searchContainer',

        items: [
        	{
        		xtype: 'textfield',
        		clearIcon: true,
        		labelWidth: 0,
		        inputCls: 'searchField',
        		placeHolder: 'Enter Search Term',
        		id: 'searchField'
        	}
        ]
	}
});
