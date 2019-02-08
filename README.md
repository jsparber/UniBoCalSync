# UniBoCalSync
Simple node script to import the lecture calendar form LM-Informatica UniBo into nextCloud.

The script downloads a JSON from this [webpage](http://corsi.unibo.it/informatica-magistrale/Pagine/orario-lezioni.aspx?Indirizzo=992).
It generates events which are then send to a remote nextCloud instance. 
## Usage
```
git clone https://github.com/jsparber/UniBoCalSync.git
cd UniBoCalSync
npm install
## Create file called config.js (see section configuration)
node index.js
```
## Configuration
Create a config.js file with the follwing content:
```
var config = {};
config.server = "https://cloud.sparber.net";
config.path = "path to nextCloud calendar"; //e.g.  "/remote.php/dav/calendars/USERNAME/uni/"
config.username = "your username";
config.password = "your password";
module.exports = config;
```
