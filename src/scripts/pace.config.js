
(function config(){
	window.paceOptions = {
	// Only show the progress on regular and ajax-y page navigation, not every request
		restartOnRequestAfter: true,
		ajax: true, // ajax requests 
		document: true, // Checks the document readyState
		eventLag: false, // Checks for event loop lag signaling that javascript is being executed
	}
})();
