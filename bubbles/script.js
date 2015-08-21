/// <reference path="../typings/jquery/jquery.d.ts"/>

$(document).ready(function () {
	$("#control-button").click(function () { $("#control-panel").toggle(); });
});

$(window).load(function () {
	var interval_id = null;
	var size_range = {
		min: +$(".size-setting[data-target='min']").attr("value"),
		max: +$(".size-setting[data-target='max']").attr("value"),
	};
	var colors = {
		red: {
			min: +$(".color-setting.red[data-target='min']").attr("value"),
			max: +$(".color-setting.red[data-target='max']").attr("value"),
		},
		green: {
			min: +$(".color-setting.green[data-target='min']").attr("value"),
			max: +$(".color-setting.green[data-target='max']").attr("value"),
		},
		blue: {
			min: +$(".color-setting.blue[data-target='min']").attr("value"),
			max: +$(".color-setting.blue[data-target='max']").attr("value"),
		},
	};
	
	$("#background-ripple").on("iron-change", function () {
		if (this.checked) {
			backgroundBubbles(colors, size_range);
			interval_id = window.setInterval(function () {
				backgroundBubbles(colors, size_range);
			}, 2000);
		} else {
			window.clearInterval(interval_id);
		}
	});

	$("#cursor-ripple").on("iron-change", function () {
		if (this.checked) {
			$(document).mousemove(function (event) {
				mouseBubble(event, colors, size_range);
			});
		} else {
			$(document).off("mousemove");
		}
	});
	
	$(".color-setting").on("value-change", function () {
		var target = $(this).data("target");
		var color  = $(this).data("color");
		var value  = this.value;
		
		var opposite = (target == "max") ? "min" : "max";
		var other_setting = $(".color-setting." + color + "[data-target='" + opposite + "']")[0]; 
		var other_value = other_setting.value;
		
		if ((target == "max") != (value >= other_value)) {
			other_setting.value = value;
			colors[color][opposite] = value;			
		}
		colors[color][target] = value;
	});
	
	$(".size-setting").on("value-change", function () {
		var target = $(this).data("target");
		var value  = this.value;
		
		var opposite = (target == "max") ? "min" : "max";
		var other_setting = $(".size-setting[data-target='" + opposite + "']")[0];
		var other_value = other_setting.value;
		
		if ((target == "max") != (value >= other_value)) {
			other_setting.value = value;
			size_range[opposite] = other_setting.value;
		}
		size_range[target] = value;
	})
});

function mouseBubble (event, colors, size_range) {
	var top   = event.pageY - 20;
	var left  = event.pageX - 20;
	var size  = randInt(size_range.min, size_range.max);
	var color = "rgb(" + randInt(colors.red.min, colors.red.max) +     "," 
					   + randInt(colors.green.min, colors.green.max) + ","
					   + randInt(colors.blue.min, colors.blue.max) +   ")";
	
	blowBubble(top, left, size, color);
}

function backgroundBubbles (colors, size_range) {
	var window_width = $(window).width();
	var window_height = $(window).height();

	for (var i = 0; i < 100; i++) {
		window.setTimeout(function () {
			var top   = randInt(0, window_height);
			var left  = randInt(0, window_width);
			var size  = randInt(size_range.min, size_range.max);
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

