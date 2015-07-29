function blowBubble (top, left, size, color) {
	var bubble = $("<div class='bubble'></div>");

	bubble.css({
		"top": top, "left": left,
		"background-color": color,
		"width": size, "height": size,
	});

	$("body").append(bubble);

	bubble.addClass("animate");
}