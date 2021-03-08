
const baseurl = 'http://192.168.2.119:4321'

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


function onLatest(dataset) {

	function setValue(key) {
		const dkey = 'd' + key;
		const value = dataset[key];
		$('#' + key).html(value + '°C');
		const slope = dataset[dkey];
		const angle = Math.atan(slope * 180) * -57.3;
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
	d.setUTCSeconds(dataset.time);
	const timestring = f00(d.getHours()) + ":" + f00(d.getMinutes()) + ":" + f00(d.getSeconds());
	$('#time').html(timestring);
}

$(() => {
	requestLatest();
})
