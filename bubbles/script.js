/// <reference path="../typings/jquery/jquery.d.ts"/>

$(document).ready(function () {
	$("#settings-button").click(function () { $("#settings").toggle(); });
});

$(window).load(function () {
	var interval_id = null;
	var max_size = 80;
	var colors = {
		red: {
			min: 0,
			max: 255,
		},
		green: {
			min: 0,
			max: 255,
		},
		blue: {
			min: 0,
			max: 255,
		},	
	};
	
	$("#background-ripple").on("iron-change", function () {
		if (this.checked) {
			backgroundBubbles(colors, max_size);
			interval_id = window.setInterval(function () {
				backgroundBubbles(colors, max_size);
			}, 2000);
		} else {
			window.clearInterval(interval_id);
		}
	});

	$("#cursor-ripple").on("iron-change", function () {
		if (this.checked) {
			$(document).mousemove(function (event) {
				mouseBubble(event, colors, max_size);
			});
		} else {
			$(document).off("mousemove");
		}
	});
	
	$(".color-setting").on("value-change", function () {
		colors[$(this).data("color")][$(this).data("target")] = this.value;
	})

});

function mouseBubble (event, colors, max_size) {
	var top   = event.pageY - 20;
	var left  = event.pageX - 20;
	var size  = randInt(max_size - 50, max_size);
	var color = "rgb(" + randInt(colors.red.min, colors.red.max) +  "," 
					+ randInt(colors.green.min, colors.green.max) + ","
					+ randInt(colors.blue.min, colors.blue.max) +   ")";
	
	blowBubble(top, left, size, color);
}

function backgroundBubbles (colors, max_size) {
	var window_width = $(window).width();
	var window_height = $(window).height();

	for (var i = 0; i < 100; i++) {
		window.setTimeout(function () {
			var top   = randInt(0, window_height);
			var left  = randInt(0, window_width);
			var size  = randInt(max_size - 50, max_size);
			var color = "rgb(" + randInt(colors.red.min, colors.red.max) +     "," 
							   + randInt(colors.green.min, colors.green.max) + ","
							   + randInt(colors.blue.min, colors.blue.max) +   ")";
			
			blowBubble(top, left, size, color);
		}, i * 10);
	};
}

function randInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function blowBubble (top, left, size, color) {
	var bubble = $("<div class='bubble'></div>");

	bubble.css({
		"top": top, "left": left,
		"background-color": color,
		"width": size, "height": size,
	});

	$("body").append(bubble);

	bubble.addClass("animate");

	setTimeout(function () { bubble.remove() }, 3000)
}

