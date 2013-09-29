# ShopAfter 2 - realtime mobile classified project
(Powered by Nodejs(Expressjs) & Sencha Touch 2.3.0)

## Deployment details

URL: http://m.shopafter.com:9999

### Prerequisites
  * Install Sencha CMD to build your application.

  * Download touch-2.3.0 from http://sc13-live.sencha.com/touch/touch-2.3.0-beta.zip

    curl -O http://sc13-live.sencha.com/touch/touch-2.3.0-beta.zip

  * Place the project source code into the SDK (touch-2.3.0)

    mkdir -p touch-2.3.0/MyApps/shopafter2
    cd touch-2.3.0/MyApps/shopafter2
    git clone git@github.com:tokyoscale/shopafter2.git .

  * Install

    ruby 1.9.3
    nodejs
    compass
    mongodb (http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/)

  * In `mongo` console create fb database and user `admin`:

    mongo
    use fb
    db.addUser( { user: "admin", pwd: "12345678", roles: ["readWrite", "dbAdmin"] } )

  * To generate CSS files from SASS, run:

    cd resources/sass
    compass compile

  * Install all the required node modules by running:

     npm install

  * To run server for backend & frontend:

     node app.js

  * Visit your app by going to `http://localhost:9999`. You can also setup your `/etc/hosts` to point to m.shopafter.com


## Related, but already done tasks in the source code

### Facebook integration

The Facebook integration works by checking the user's authentication on the client side using the Facebook JS SDK. If
the user is not logged in, they are presented with a button which forwards them to Facebook to authenticate. Since some
actions must be performed on the server side, we need a valid access token on both the client AND server side.

Luckily, there is a way to create an access token on the server side by reading in a cookie set by Facebook during the
client-side authentication process. When the user returns to our app after logging in to Facebook and authorizing our
app, the cookie will be set and can be exchanged for an access token and stored in the session.  See the `checkSession`
method inside  server-side/facebook.js to see how this works in detail.

### Building

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

### Going production

The Express framework uses the NODE_ENV environment variable to determine some behaviors related to caching.
If you’re using Express, set a config var with this value:

heroku config:add NODE_ENV=production

Then, if you want to switch back to production:

heroku config:set NODE_ENV=development