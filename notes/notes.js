/* Code mostly used to move between pages of notes.
 * 
 *
 */

var CLASSES = {ids:"IDS", networks:"networks", compilers:"compilers", web:"web"};

$("document").ready(displayContent);

// Put links in the body
// of the page
function displayContent() {
	var class_query = getClass();

	if (class_query in CLASSES) {
		window.location.replace("https://cartercasey.github.io/notes/" +
								CLASSES[class_query] + "/1.html");
	} else {
		listClasses();
	}
}

// Just give the top-menu
// links in the body
function listClasses() {
	for (q in CLASSES) {
		$("#class-list").append("<p><a href=\"?class=" + q + "\">"
								+ CLASSES[q] + "</a></p>");
	}
}

// Checks URL for query string
function getClass() {
	var url = window.location.href;

	// we only care about the match for class
	var match = url.match(/\?.*class=(\w+)\&?.*/);
	if (match) {
		return match[1];
	} else {
		return "";
	}
}

