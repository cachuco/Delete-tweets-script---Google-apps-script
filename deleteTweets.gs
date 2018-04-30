//you must configure
var TWITTER_USER        = 'YOUR TWITTER USER NAME';
var MAX_AGE_IN_DAYS     = 7; //0 to delete all tweets
var SAVE_THIS_TWEET     = 0;
//From apps.twitter.com
var CONSUMER_KEY        = 'YOUR CONSUMER KEY';
var CONSUMER_SECRET     = 'YOUR CONSUMER CONSUMER_SECRET';
var ACCESS_TOKEN        = 'YOUR ACCESS TOKEN';
var ACCESS_SECRET       = 'YOUR ACCESS SECRET';
//From Google Drive
var TWEETS_CSV_SPREADSHEET_ID = 'SPREADSHEET ID WITH TWITTER HISTORY';

//You shouldn't have to change anything below this line
var NOW_DATE = new Date();
var authUrlFetch;
var destroy_tweets = 0;

function deleteTweets() {
  var connection = getTwitterService();
  var sheet = SpreadsheetApp.openById(TWEETS_CSV_SPREDSHEET_ID);
  var data = sheet.getDataRange().getValues();
  for(var i = data.length - 1; i > 1; i--){
    var tweet = data[i];
    var tweet_id = tweet[0];
    var str = tweet[3].substring(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    var tweet_date = new Date(+str[1], +str[2] - 1, +str[3]);
    var tweet_age = parseInt((NOW_DATE-tweet_date)/1000/60/60/24);
    
    if (tweet_age > MAX_AGE_IN_DAYS && tweet_id != SAVE_THIS_TWEET) { 
      destroy_tweets++;
      if (destroy(tweet_id)) {
        console.log('Deleted ' + tweet_id + " - " + tweet_age + " days old. Tweets destroy: " + destroy_tweets);
        sheet.deleteRow(i); //remove spreadsheet row with current destroyed tweet
      } 
    }
  }
}

function destroy(tweet_id) {
  var options = {
    method: "POST",
    payload: { id: tweet_id }
  };
  
  try {
    var result = authUrlFetch.fetch('https://api.twitter.com/1.1/statuses/destroy/' + tweet_id + '.json', '', options); 
    return(true);
  }  
  catch (e) {
    console.log('Error deleting ' + tweet_id);
    console.log(e.toString());
    return(false);
  }   
}

function getTwitterService() {
  if (typeof OAuth1 === 'undefined') {
    var libUrl = 'https://developers.google.com/adwords/scripts/docs/examples/oauth10-library';
    throw Error('OAuth1 library not found. Please take a copy of the OAuth1 ' +
        'library from ' + libUrl + ' and append to the bottom of this script.');
  }
  authUrlFetch = OAuth1.withAccessToken(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET);
}


/**
 * Adds a OAuth1 object to the global scope. This can be used as follows:
 *
 * var urlFetch = OAuth1.withAccessToken(consumerKey, consumerSecret,
 *     accessToken, accessSecret);
 * var response = urlFetch.fetch(url, params, options);
 */
(function(scope) {
  /**
   * Creates an object to provide OAuth1-based requests to API resources.
   * @param {string} consumerKey
   * @param {string} consumerSecret
   * @param {string} accessToken
   * @param {string} accessSecret
   * @constructor
   */
  function OAuth1UrlFetchApp(
    consumerKey, consumerSecret, accessToken, accessSecret) {
    this.consumerKey_ = consumerKey;
    this.consumerSecret_ = consumerSecret;
    this.accessToken_ = accessToken;
    this.accessSecret_ = accessSecret;
  }

  /**
   * Sends a signed OAuth 1.0 request.
   * @param {string} url The URL of the API resource.
   * @param {?Object.<string>=} opt_params Map of parameters for the URL.
   * @param {?Object.<string>=} opt_options Options for passing to UrlFetchApp
   *     for example, to set the method to POST, or to include a form body.
   * @return {?Object} The resulting object on success, or null if a failure.
   */
  OAuth1UrlFetchApp.prototype.fetch = function(url, opt_params, opt_options) {
    var oauthParams = {
      'oauth_consumer_key': this.consumerKey_,
      'oauth_timestamp': parseInt(new Date().getTime() / 1000),
      'oauth_nonce': this.generateNonce_(),
      'oauth_version': '1.0',
      'oauth_token': this.accessToken_,
      'oauth_signature_method': 'HMAC-SHA1'
    };

    var method = 'GET';
    if (opt_options && opt_options.method) {
      method = opt_options.method;
    }
    if (opt_options && opt_options.payload) {
      var formPayload = opt_options.payload;
    }

    var requestString =
        this.generateRequestString_(oauthParams, opt_params, formPayload);
    var signatureBaseString =
        this.generateSignatureBaseString_(method, url, requestString);
    var signature = Utilities.computeHmacSignature(
        Utilities.MacAlgorithm.HMAC_SHA_1, signatureBaseString,
        this.getSigningKey_());
    var b64signature = Utilities.base64Encode(signature);

    oauthParams['oauth_signature'] = this.escape_(b64signature);
    var fetchOptions = opt_options || {};
    fetchOptions['headers'] = {
      Authorization: this.generateAuthorizationHeader_(oauthParams)
    };
    if (fetchOptions.payload) {
      fetchOptions.payload = this.escapeForm_(fetchOptions.payload);
    }
    return UrlFetchApp.fetch(
        this.joinUrlToParams_(url, opt_params), fetchOptions);
  };

  /**
   * Concatenates request URL to parameters to form a single string.
   * @param {string} url The URL of the resource.
   * @param {?Object.<string>=} opt_params Optional key/value map of parameters.
   * @return {string} The full path built out with parameters.
   */
  OAuth1UrlFetchApp.prototype.joinUrlToParams_ = function(url, opt_params) {
    if (!opt_params) {
      return url;
    }
    var paramKeys = Object.keys(opt_params);
    var paramList = [];
    for (var i = 0, paramKey; paramKey = paramKeys[i]; i++) {
      paramList.push([paramKey, opt_params[paramKey]].join('='));
    }
    return url + '?' + paramList.join('&');
  };

  /**
   * Generates a random nonce for use in the OAuth request.
   * @return {string} A random string.
   */
  OAuth1UrlFetchApp.prototype.generateNonce_ = function() {
    return Utilities
        .base64Encode(Utilities.computeDigest(
            Utilities.DigestAlgorithm.SHA_1,
            parseInt(Math.floor(Math.random() * 10000))))
        .replace(/[\/=_+]/g, '');
  };

  /**
   * Creates a properly-formatted string from a map of key/values from a form
   * post.
   * @param {!Object.<string>} payload Map of key/values.
   * @return {string} The formatted string for the body of the POST message.
   */
  OAuth1UrlFetchApp.prototype.escapeForm_ = function(payload) {
    var escaped = [];
    var keys = Object.keys(payload);
    for (var i = 0, key; key = keys[i]; i++) {
      escaped.push([this.escape_(key), this.escape_(payload[key])].join('='));
    }
    return escaped.join('&');
  };

  /**
   * Returns a percent-escaped string for use with OAuth. Note that
   * encodeURIComponent is not sufficient for this as the Twitter API expects
   * characters such as exclamation-mark to be encoded. See:
   *     https://dev.twitter.com/discussions/12378
   * @param {string} str The string to be escaped.
   * @return {string} The escaped string.
   */
  OAuth1UrlFetchApp.prototype.escape_ = function(str) {
    return encodeURIComponent(str).replace(/[!*()']/g, function(v) {
      return '%' + v.charCodeAt().toString(16);
    });
  };

  /**
   * Generates the Authorization header using the OAuth parameters and
   * calculated signature.
   * @param {!Object} oauthParams A map of the required OAuth parameters. See:
   *     https://dev.twitter.com/oauth/overview/authorizing-requests
   * @return {string} An Authorization header value for use in HTTP requests.
   */
  OAuth1UrlFetchApp.prototype.generateAuthorizationHeader_ = function(
      oauthParams) {
    var params = [];
    var keys = Object.keys(oauthParams).sort();
    for (var i = 0, key; key = keys[i]; i++) {
      params.push(key + '="' + oauthParams[key] + '"');
    }
    return 'OAuth ' + params.join(', ');
  };

  /**
   * Generates the signature string for the request.
   * @param {string} method The HTTP method e.g. GET, POST
   * @param {string} The URL.
   * @param {string} requestString The string representing the parameters to the
   *     API call as constructed by generateRequestString.
   * @return {string} The signature base string. See:
   *     https://dev.twitter.com/oauth/overview/creating-signatures
   */
  OAuth1UrlFetchApp.prototype.generateSignatureBaseString_ = function(
      method, url, requestString) {
    return [method, this.escape_(url), this.escape_(requestString)].join('&');
  };

  /**
   * Generates the key for signing the OAuth request
   * @return {string} The signing key.
   */
  OAuth1UrlFetchApp.prototype.getSigningKey_ = function() {
    return this.escape_(this.consumerSecret_) + '&' +
        this.escape_(this.accessSecret_);
  };

  /**
   * Generates the request string for signing, as used to produce a signature
   * for the Authorization header. see:
   * https://dev.twitter.com/oauth/overview/creating-signatures
   * @param {!Object} oauthParams The required OAuth parameters for the request,
   *     see: https://dev.twitter.com/oauth/overview/authorizing-requests
   * @param {?Object=} opt_params Optional parameters specified as part of the
   *     request, in map form, for example to specify /path?a=b&c=d&e=f... etc
   * @param {?Object=} opt_formPayload Optional mapping of pairs used in a form
   *     as part of a POST request.
   * @return {string} The request string
   */
  OAuth1UrlFetchApp.prototype.generateRequestString_ = function(
      oauthParams, opt_params, opt_formPayload) {
    var requestParams = {};
    var requestPath = [];
    for (var i = 0; i < arguments.length; i++) {
      var mapping = arguments[i];
      if (mapping) {
        var paramKeys = Object.keys(mapping);
        for (var j = 0, paramKey; paramKey = paramKeys[j]; j++) {
          requestParams[paramKey] = mapping[paramKey];
        }
      }
    }
    var requestKeys = Object.keys(requestParams);
    requestKeys.sort();

    for (var m = 0, requestKey; requestKey = requestKeys[m]; m++) {
      requestPath.push([
        this.escape_(requestKey), this.escape_(requestParams[requestKey])
      ].join('='));
    }
    return requestPath.join('&');
  };

  /**
   * Builds a OAuth1UrlFetchApp object based on supplied access token (and other
   * parameters.
   * @param {string} consumerKey
   * @param {string} consumerSecret
   * @param {string} accessToken
   * @param {string} accessSecret
   * @return {!OAuth1UrlFetchApp}
   */
  function withAccessToken(
      consumerKey, consumerSecret, accessToken, accessSecret) {
    return new OAuth1UrlFetchApp(
        consumerKey, consumerSecret, accessToken, accessSecret);
  }

  scope.OAuth1 = {withAccessToken: withAccessToken};
})(this);