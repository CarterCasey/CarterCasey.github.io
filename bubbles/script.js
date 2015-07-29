var MAX_SIZE = 80;

$(window).load(function () {

	var interval_id = null;
	$("#background-ripple").on("iron-change", function () {
		if (this.checked) {
			backgroundBubbles();
			interval_id = window.setInterval(backgroundBubbles, 2000);
		} else {
			window.clearInterval(interval_id);
		}
	});

	$("#cursor-ripple").on("iron-change", function () {
		if (this.checked) {
			$(document).mousemove(function (event) {
				blowBubble(event.pageY, event.pageX,
						   randInt(MAX_SIZE - 50, MAX_SIZE),
						   "rgb(" + randInt(0, 255) + "," 
								  + randInt(0, 255) + ","
								  + randInt(0, 255) + ")"
				);
			});
		} else {
			$(document).off("mousemove");
		}
	});

});

function backgroundBubbles () {
	$(".ink").remove();

	var window_width = $(window).width();
	var window_height = $(window).height();

	for (var i = 0; i < 100; i++) {
		window.setTimeout(function () {
			blowBubble(randInt(0, window_height),
					   randInt(0, window_width),
					   randInt(MAX_SIZE - 50, MAX_SIZE),
					   "rgb(" + randInt(0, 255) + "," 
							  + randInt(0, 255) + ","
							  + randInt(0, 255) + ")"
			);
		}, i * 10);
	};
}

function randInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

