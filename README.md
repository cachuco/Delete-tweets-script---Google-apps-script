# Delete tweets script with twitter file - Google Apps Script

Delete all tweets and retweets from your account, delete all tweets posted before the last X days. Authentication is required and twitter's historical file is needed.

## Prerequisites

### Get your Twitter archive

1. Open your [account page](https://twitter.com/settings/account).
2. Click 'Your Twitter archive', and a link to your archive will arrive per email.
3. Follow the link in the email to download the archive.
4. Unpack the archive, and move `tweets.csv` to the same directory as this script.

### Create new twitter app and configure API

1. Open Twitter's [Application Management](https://apps.twitter.com/), and create a new Twitter app.
2. Set the permissions of your app to *Read and Write*.
3. Set the required environment variables

### Create new Google Apps Script project [Google Apps Script](https://script.google.com)
### Copy deleteTweets.gs file in you GAS project and configure variables
### Add new spreadsheet file in your GAS project and import tweets.csv file from your twitter history
### Execute script and enjoy your life


## Use

**Configure the following variables:**

```javascript
var TWITTER_USER 				= 'YOUR TWITTER USER NAME';
var MAX_AGE_IN_DAYS 			= 7;
var SAVE_THIS_TWEET 			= 0;
var CONSUMER_KEY 				= 'YOUR CONSUMER KEY';
var CONSUMER_SECRET 			= 'YOUR CONSUMER CONSUMER_SECRET';
var ACCESS_TOKEN        		= 'YOUR ACCESS TOKEN';
var ACCESS_SECRET       		= 'YOUR ACCESS SECRET';
var TWEETS_CSV_SPREADSHEET_ID 	= 'SPREADSHEET ID WITH TWITTER HISTORY';
```

|variable|description|
|--------|--------------|
|TWITTER\_USER|Twitter username (exclude @)|
|MAX\_AGE\_IN\_DAYS|tweets with a date greater than this number, will be deleted |
|SAVE\_THIS\_TWEET|this ID won't be deleted |
|CONSUMER\_KEY|The Consumer Key from your Twitter App|
|CONSUMER\_SECRET|The Consumer Secret from your Twitter App|
|ACCESS\_TOKEN|The Access Token from your Twitter App|
|ACCESS\_SECRET|The Access Secret from your Twitter App|
|TWEETS\PER\_REQUEST|Numer of tweets by request (default: 200) |


# Versioning

1.0.0 First version of script.