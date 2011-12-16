// This is an example of how to use KissMetrics to easily optimize your landing page copy<.
// See https://github.com/petewarden/copyoptimizer for more details
// Pete Warden, pete@jetpac.com

// Edit these options to change the copy being randomly tested on the page
g_copyChoices = {
  'action_header': [
    'Please click me!',
    'If you wouldn\'t mind, click here',
    'I\'d really like you to<br>click below'
  ],
  'action_button': [
    'Start Here',
    'Next',
    'Sign up'
  ]
};

$(document).ready(function() {
  setCopyChoices(g_copyChoices);
});

// Walks through the array of options, picks random choices for the text (or uses the previously-stored
// choices if this is a repeat visit), and stores the choices in KissMetrics so we can keep track of 
// how well the different text options are working for conversion.
function setCopyChoices(copyChoices) {
  
  // For debugging purposes, we can forget the choices we made on the last visit, but the default is remembering
  // To ignore previous choices, pass forget_previous_choices somewhere in the URL arguments, eg
  // http://www.example.com/mypage.html?forget_previous_choices
  var forgetPreviousChoices = (window.location.search.indexOf('forget_previous_choices') !== -1)

  // Go through the different class names of the elements whose content we will be experimenting with
  for (var className in copyChoices) {
    var currentCopyChoices = copyChoices[className];
    
    // Look to see if we have already made a choice for this text on a previous visit
    var cookieName = className+'_chosen_copy';
    var chosenCopy = getCookie(cookieName);
    if ((chosenCopy == '') || forgetPreviousChoices) {
      // Make a new choice and remember it
      var choiceIndex = randomInt(0, currentCopyChoices.length);
      var chosenCopy = currentCopyChoices[choiceIndex];
      setCookie(cookieName, chosenCopy);
      setKissProperty(className, chosenCopy);
    }
    
    // We've made a choice, so set the element's text
    $('.'+className).html(chosenCopy);
  }
  
}

// Stores the value as a cookie
function setCookie(cookieName, cookieValue, nDays) {
  var today = new Date();
  var expire = new Date();
  if (nDays==null || nDays==0) nDays=1;
  expire.setTime(today.getTime() + 3600000*24*nDays);
  document.cookie = cookieName+"="+escape(cookieValue)
    + ";expires="+expire.toGMTString();
}  

// Returns a previously stored value, or '' if nothing was stored under that name
function getCookie(cookieName) {
  var theCookie=" "+document.cookie;
  var ind=theCookie.indexOf(" "+cookieName+"=");
  if (ind==-1) ind=theCookie.indexOf(";"+cookieName+"=");
  if (ind==-1 || cookieName=="") return "";
  var ind1=theCookie.indexOf(";",ind+1);
  if (ind1==-1) ind1=theCookie.length; 
  return unescape(theCookie.substring(ind+cookieName.length+2,ind1));
}

// Stores off the chosen value as a KissMetrics property
function setKissProperty(name, value) {
  var setData = {};
  setData[name] = value;
  _kmq.push(['set', setData]);
}

// Returns an integer between start and end (excluding end)
function randomInt(start, end) {
  return Math.floor(start + (1+end-start)*Math.random());
}
