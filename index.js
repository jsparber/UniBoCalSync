const request = require('request');
const moment = require('moment');
const caldav = require("node-caldav-mod");
const cheerio = require('cheerio');
const hash = require('sha1');
const config = require('./config');

const base_url = "http://corsi.unibo.it/informatica-magistrale/Pagine/orario-lezioni.aspx?Indirizzo=992";

sync();

function sync () {
  request(base_url, function (error, response, body) {
    var $ = cheerio.load(body);
    var searchString = "$create(Telerik.Web.UI.RadScheduler, "
    var start = body.indexOf(searchString) + searchString.length;
    var end = body.indexOf("}, {", start) + 1;
    body = JSON.parse(body.substring(start, end));
    appointments = JSON.parse(body.appointments);

    for (var key in appointments) {
      if (appointments.hasOwnProperty(key)) {
        var element = appointments[key];
        if (config.classes == "" ||
          config.classes.indexOf(element.attributes.CodiceAttivita) !== -1) {
          var label = "<strong>Aula</strong><br>";
          var location = $("#" + element["domElements"][0])
            .find("strong:contains('Aula')")
            .parent()
            .html()
            .replace(/(\r\n|\n|\r|  )/gm,"");
          location = location.substr(location.indexOf(label) + label.length)
            .replace(/<br>/g," - ");

          label = "<strong>Docente</strong><br>";
          var prof = $("#" + element["domElements"][0])
            .find("strong:contains('Docente')")
            .parent()
            .html()
            .replace(/(\r\n|\n|\r|  )/gm,"");
          prof = prof.substr(prof.indexOf(label) + label.length)
            .replace(/<br>/g," - ");

          var description = "Prof.:\\n" +
            prof + "\\n"+
            "URL:\\n" +
            "http://www.scienze.unibo.it/it/corsi/insegnamenti?codiceScuola=843899&codiceMateria=" +
            element.attributes.CodiceAttivita +
            "&annoAccademico=2017&codiceCorso=8028&single=True&search=True"
          const event = {
            key: hash(element.internalID),
            summary: element.toolTip,
            description: description,
            startDate: moment(element.start, "YYYY/MM/DD HH:mm"),
            endDate: moment(element.end, "YYYY/MM/DD HH:mm"),
            location: location
          }
          caldav.addEvent(event, config.server, config.username, config.password,
            function (error) {
              if (error)
                console.log(error);
              else
                console.log("Imported");
            });
        }
      }
    }
  });
}
