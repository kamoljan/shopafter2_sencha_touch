exports.config = {
    // Base URL of the App (must be a publicly accessible URL)
    redirect_uri: '',
    // Facebook App ID/API Key
    client_id: '723097297716821',
    // Facebook Application Secret
    client_secret: '3780ed7dbc6e0cded57506a8fa566036',
    //mongoDb:       'mongodb://USER:PASS@SERVER:PORT/DATABASE',
    mongoDb: 'mongodb://admin:12345678@localhost:27017/shopafter',
    // Session encyption key
    sessionSecret: 'kenta234?@#$ewfdhgsadjfhbasd!@#naomibasyihd',
    appUrl: 'https://shopafter.com',
    fbNamespace: 'shopafter',

    rottenTomatoesApiKey: '12341243531425642564356',

    aws: {
        "accessKeyId": "AKIAJVYDZS3ZM5UT4V4A",
        "secretAccessKey": "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",
        "region": "ap-southeast-1",
        "s3_bucket": "img.shopafter.com",
        "sslEnabled": false
    }
};