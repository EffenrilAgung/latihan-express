function formatTime() {
	const date = new Date();
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	console.log(date.toLocaleDateString('id-ID', options));
	return date.toLocaleDateString('id-ID', options);
}

module.exports = formatTime;
