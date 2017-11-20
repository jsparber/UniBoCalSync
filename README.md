# UniBoCalSync
Simple node script to import the lecture calendar form LM-Informatica UniBo into nextCloud.

The script downloads this [webpage](http://corsi.unibo.it/informatica-magistrale/Pagine/orario-lezioni.aspx?Indirizzo=992) and parses the HTML.
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
config.server = "path to nextCloud calendar";
config.username = "your username";
config.password = "your password";
config.classes = ""; //comma separated list of class ids to include, leave it empty for all classes
module.exports = config;
```
