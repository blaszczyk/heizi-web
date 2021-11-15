
const baseurl = 'http://heizi.fritz.box:4321'

function requestLatest() {
  $.ajax({
	type: 'GET',
	url: baseurl + '/latest',
    Accept : 'application/json',
	success: onLatest
  });
}

function f00(value) {
	return ("0" + value).slice(-2)
}

function blink() {
	const color1 = '#FF0000';
	const color2 = '#222222';
	const $body = $('body');
	if ($('#message').html()) {
		$body.css('color', color2);
		$body.css('background-color', color1);
		setTimeout(() => {
			$body.css('color', color1);
			$body.css('background-color', color2);
			setTimeout(blink, 1500);
		}, 500);
	}
}

function onLatest(dataset) {

	function setValue(key) {
		const dkey = 'd' + key;
		const value = dataset[key];
		$('#' + key).html(value + '°C');
		const slope = dataset[dkey];
		const angle = Math.atan(slope) * -57.3;
		$('#' + dkey).css({
			'transform': 'rotate('+angle+'deg)',
			'transform-origin': '50% 50%'
		});
	}
	setValue('tag');
	setValue('ty');
	setValue('po');
	setValue('pu');
	
	const d = new Date(0);
	const maxtime = Math.max(dataset.time, dataset.tur);
	d.setUTCSeconds(maxtime);
	const timestring = f00(d.getHours()) + ":" + f00(d.getMinutes()) + ":" + f00(d.getSeconds());
	$('#time').html(timestring);
	if (dataset.message) {
		const message = dataset.message;
		$('#message').html(message.title);
		if(message.level == 'ALERT') {
			blink();
		}
	}
	else {
		$('#message').html('');
	}
}

$(() => {
	requestLatest();
})
