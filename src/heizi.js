
const baseurl = 'http://192.168.2.119:4321'

function requestLatest() {
  $.ajax({
	type: 'GET',
	url: baseurl + '/latest',
    Accept : 'application/json',
	success: onLatest
  });
};

function onLatest(dataset) {
	$('#tag').html(dataset.tag + '°C');
	$('#ty').html(dataset.ty + '°C');
	$('#po').html(dataset.po + '°C');
	$('#pu').html(dataset.pu + '°C');
	const d = new Date(0);
	d.setUTCSeconds(dataset.time);
	const timestring = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
	$('#time').html(timestring);
}

$(() => {
	requestLatest();
})
