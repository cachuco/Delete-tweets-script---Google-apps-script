# ⚠️ DEPRECATED - Thanks, Elon! 🚀🔥

**Este proyecto está más muerto que la verificación azul gratuita.**

En 2018, cuando Twitter era Twitter y los pájaros volaban libres, este script te permitía borrar tus tweets de forma masiva y gratuita usando la API v1.1. Luego llegó un tipo con un cohete, compró el pájaro, lo mató, lo rebautizó como "X" y puso la API detrás de un muro de pago.

**RIP Twitter API Free Tier (2006-2023)** 🪦

Si aún así eres lo suficientemente valiente (o masoquista) para querer hacer funcionar algo similar, aquí tienes lo que necesitas cambiar:

### Cambios mínimos necesarios

| Qué cambió | Antes (gratis y bonito) | Ahora (gracias Elon) |
|---|---|---|
| **API** | v1.1 `POST /statuses/destroy/:id` | v2 `DELETE /2/tweets/:id` |
| **Autenticación** | OAuth 1.0a | OAuth 2.0 con PKCE |
| **Coste** | $0 | Desde $100/mes (plan Basic) |
| **Portal de desarrollo** | `apps.twitter.com` | `developer.x.com` (requiere solicitud y aprobación) |
| **Nombre de la red social** | Twitter 🐦 | X 💀 |

### Si insistes en revivirlo

1. Date de alta en el [X Developer Portal](https://developer.x.com/) y reza para que te aprueben
2. Contrata como mínimo el plan **Basic ($100/mes)**
3. Reemplaza el endpoint por `DELETE https://api.x.com/2/tweets/:id`
4. Migra la autenticación de OAuth 1.0a a OAuth 2.0 con PKCE
5. Actualiza las cabeceras de autorización a `Bearer Token`
6. Piensa si realmente vale la pena pagar $100/mes por borrar tweets cuando hay servicios que lo hacen por menos

> *"El que quiera borrar tweets, que pase por caja"* — Elon Musk, probablemente.

---

# Delete tweets script with twitter file - Google Apps Script

Delete all tweets and retweets from your account or delete all tweets posted before the last X days.

The script reads the twitter file and deletes one by one starting with the oldest tweet. It is possible to set a number of days (MAX_AGE_IN_DAYS) for which there are no more tweets, for example: if MAX_AGE_IN_DAYS = 30, the script will not delete the tweets published in the last 30 days. It is also possible to define a specific ID that we do not want to eliminate, for example, if we put the ID of our first tweet in the SAVE_THIS_TWEET variable, it will not be deleted.

[Google Apps Script has a limitation](https://developers.google.com/apps-script/guides/services/quotas) on the script runtime of 6 min, so it is advisable to schedule a script execution automatically every 15 minutes so as not to exceed the limits of the Twitter API requests. (Running the script every 10 minutes 6,000 tweets per hour are deleted.)

## Prerequisites

**Get your Twitter archive**

1. Open your [account page](https://twitter.com/settings/account).
2. Click 'Your Twitter archive', and a link to your archive will arrive per email.
3. Follow the link in the email to download the archive.
4. Unpack the archive.

**Create new twitter app and configure API**

1. Open Twitter's [Application Management](https://apps.twitter.com/), and create a new Twitter app.
2. Set the permissions of your app to *Read and Write*.
3. Set the required environment variables

**Create new Google Apps Script project [Google Apps Script](https://script.google.com)**

**Copy deleteTweets.gs file in you GAS project and configure variables**

**Copy your TWEET.JS file from twiiter archive to your Google Drive and save the file ID**

**Execute script and enjoy your life**


## Use

**Configure the following variables:**

```javascript
var TWITTER_USER = 'YOUR TWITTER USER NAME';
var MAX_AGE_IN_DAYS = 30;
var SAVE_THIS_TWEET = 0;
var CONSUMER_KEY = 'YOUR CONSUMER KEY';
var CONSUMER_SECRET = 'YOUR CONSUMER CONSUMER_SECRET';
var ACCESS_TOKEN = 'YOUR ACCESS TOKEN';
var ACCESS_SECRET = 'YOUR ACCESS SECRET';
var TWEET_JS_FILE = 'TWEET.JS FILE ID SAVED IN YOUR GOOGLE DRIVE';
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
|TWEETS\_JS\_FILE|ID from tweet.js file in your Google Drive |


# Versioning

1.1.0

# License

See the [LICENSE](LICENSE.md) file for license rights and limitations (GPL-3).
