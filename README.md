# The Watch List

The Watch List lets you share which movies you have seen and want to see with your friends on Facebook.

It displays a list of the latest movies with its corresponding poster image, synopsis, trailer, critics rating
(from Rotten Tomatoes) and a list of friend activity: whether your friend wants to see it, have seen it and
if so whether they liked it or not.

It allows you to search for movies and order the listing by popularity, rating or release date.

The app is available with both Phone and Tablet views depending on your device type.

You can see a demo of the app in action at http://www.watchlistapp.com

## Facebook integration

The Facebook integration works by checking the user's authentication on the client side using the Facebook JS SDK. If
the user is not logged in, they are presented with a button which forwards them to Facebook to authenticate. Since some
actions must be performed on the server side, we need a valid access token on both the client AND server side.

Luckily, there is a way to create an access token on the server side by reading in a cookie set by Facebook during the
client-side authentication process. When the user returns to our app after logging in to Facebook and authorizing our
app, the cookie will be set and can be exchanged for an access token and stored in the session.  See the `checkSession`
method inside  server-side/facebook.js to see how this works in detail.

## Building

This Source code does not include Sencha touch library, but assumes that You will be using version 2.1 of framework.

Please check our homepage for newer version : http://www.sencha.com/products/touch/download/

You will also need Sencha CMD to build your application. Please visit http://www.sencha.com/products/sencha-cmd/download

After download, unzip the framework file and copy the following directories and files to the touch sdk folder

 /microloader/*
 /resources/*
 /src/*
 /license.txt
 /sencha-touch* files
 /version.txt

## Config

You will need to create a file `config.js` with this content:

	exports.config = {
	    // Base URL of the App (must be a publically accessible URL)
	    redirect_uri:  'APP URL',

	    // Facebook Application ID, obtain from Facebook
	    client_id:     'APPID',

	    // Facebook Application Secret, obtain from Facebook
	    client_secret: 'SECRET',

	    // MongoDB connection string
	    mongoDb:       'mongodb://USER:PASS@SERVER:PORT/DATABASE',

	    // Session encyption key
	    sessionSecret: 'RANDOM STRING', // any string, like : vwertgwq45ygwrtb

	    appUrl: 'PUBLIC APP URL', // where your application is hosted, e.g. http://mygreatapp.com

	    fbNamespace: 'FACEBOOK NAMESPACE', //obtain from Facebook

	    rottenTomatoesApiKey: 'ROTTEN TOMATOES API KEY' // sign up and obtain your own key
	}

Change Your Facebook app ID inside app.js launch method:

 WL.Facebook.initialize('12345678901234');

## Deploying

Follow the instructions in the Jog With Friends example from the Sencha Touch 2 SDKs to learn how to set up your
Facebook application, Node.js, MongoDB and Heroku hosting service.

The commands you need to set up Git for use with Heroku are:

	git init
	git add .gitignore config.js Procfile app.js lib package.json views public/build/production
	git remote add heroku git@heroku.com:YOUR-HEROKU-APP.git
	git commit -m "Init"
	git push heroku master


## Scraping

Use the same config information for lib/scrape.js

Then run node lib/scrape.js to import database.
You must observe console messages like this:

Scraping Opening movies...
Parsed 16 movies.
Updated 771320794
Updated 771320299
Updated 771319353
Updated 771318628

....

## Going production

The Express framework uses the NODE_ENV environment variable to determine some behaviors related to caching.
If you’re using Express, set a config var with this value:

heroku config:add NODE_ENV=production

Then, if you want to switch back to production:

heroku config:set NODE_ENV=development