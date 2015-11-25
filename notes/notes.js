/* Code mostly used to move between pages of notes. */

var CLASSES = {ids:"IDS", networks:"networks", compilers:"compilers", web:"web"};

$("document").ready(displayContent);

$(document).keydown(navigation);

// Put links in the body
// of the page.
function displayContent() {
	var class_query = getClass();

	if (class_query in CLASSES) {
		var new_path = "/notes/" + CLASSES[class_query] + "/1.html";
		window.location.replace(new_path);
	} else {
		listClasses();
	}
}

// Just give the top-menu
// links in the body
function listClasses() {
	for (var q in CLASSES) {
		$("#class-list").append("<div><a href=\"?class=" + q + "\">"
								+ CLASSES[q] + "</a></div>");
	}
}

// Checks URL for query string
function getClass() {
	var url = window.location.href;

	// we only care about the match for class
	var match = url.match(/\?.*class=(\w+)(?:\&.*)?/);
	if (match) {
		return match[1];
	} else {
		return "";
	}
}

function navigation(event) {
	if (event.which == 37 || event.which == 39) {
		var url = window.location.href;
		var match = url.match(/.*\/(\d+)\.html/);
		var page;
		if (match) { page = parseInt(match[1]) } else { return; }
		
		var new_page = (event.which == 37) ? page - 1 : page + 1;
		
		var new_url = url.replace(/\d+\.html/, new_page + ".html");
		window.location.replace(new_url);
	} else {
		return;
	}
}

