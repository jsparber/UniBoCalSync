const request = require('request');
const hash = require('sha1');
const config = require('./config');

function genCourseUrl(code) {
  let url = "http://www.scienze.unibo.it//it/corsi/insegnamenti?codiceScuola=843899&codiceMateria=" +
    code +
    "&annoAccademico=2018&codiceCorso=8028&single=True&search=True";
  return url;
}

let cal = require('@datafire/caldav').create({
  username: config.username,
  password: config.password,
  server: config.server,
  basePath: "/remote.php/dav",
  principalPath: "/principals"
});

getLectures(updateLectures, 2);
function updateLectures(lectures, index) {
	let element = lectures[index];
	if (element != undefined) {
		var id = hash(element.summary + element.start + element.end);
    element.id = id;
		element.filename = config.path + id + ".ics";
		console.log(element);
		cal.createEvent(element).then( _ => {
			console.log(index);
			updateLectures(lectures, ++index);
		});
	}
}

function getLectures (finished, index) {
	var lectures = [];
  const base_url = "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?anno=" + index + "&curricula=A58-000";
	request(base_url, function (error, response, body) {
		let json = JSON.parse(body);
		let events = json.events;

		for (let key of events) {
			var id = key.title + key.start + key.end;
			var description = "Docente: " + key.docente + " | " + genCourseUrl(key.cod_modulo);
      var building = key.aule[0];
      var location = building.des_risorsa + " | " + building.des_piano + " | " + building.des_ubicazione;

			const event = {
        summary: key.title,
        description: description,
        start: key.start,
        end: key.end,
        location: location
      }
      lectures.push(event);
    }
    finished (lectures, 0);
  });
}
