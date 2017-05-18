var jsonData = {
  objects: [],
  activeUsers: [],
	error: []
};

var dataOrganize = function(rawData) {
  $("#chatroom").text("");

  // script to allow admins to delete an image
  for (i=0; i < rawData.length; i++) {
    $("#chatroom").append('<form id="form' + rawData[i]['id'] + '" action="/message/' + rawData[i]['id'] + '/delete" method="post">' +
    '<input type="hidden" name="_method" value="delete">');

    $("#chatroom").append('<li><span class="redx"><a href="#" onclick="document.getElementById(\'form' + rawData[i]['id'] + '\').submit();">&#10005; </a></span> ' +
    '<span class="time-span">' + rawData[i]['display_time'] + " ></span> " + '<span class="name-span">' + rawData[i]['username'] + ': </span> ' + rawData[i]['content'] +
    '<input type="hidden" name="remove-message" value="' + rawData[i]['id'] + '"/>' +
    '</li>');

    $("#chatroom").append('</form>');
  }
};

$(document).ready(function() {

  // JS Spinner animation script

    var opts = {
    lines: 13 // The number of lines to draw
  , length: 28 // The length of each line
  , width: 14 // The line thickness
  , radius: 42 // The radius of the inner circle
  , scale: 0.15 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#000' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  }

  var target = document.getElementById("load");
  var spinner = new Spinner(opts).spin(target);


  // async call for information
  var async = function() {

    fetch("/data")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText
          });
        }
      })
      .then(data => {
        jsonData.objects = data;
      })
      .catch(error => {
        if (error.status !== 200) {
          $("body").text(`Something isn't quite right with the message get request: ${error.status} ${error.statusText}`);
          console.log(error.status)
        }
      })
      .then(function() {
        dataOrganize(jsonData.objects)
        spinner.stop();
        spinner2.stop();
      });

    fetch("/active-users")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText
          });
        }
      })
      .then(data => {
        jsonData.activeUsers = data;
      })
      .catch(error => {
        if (error.status !== 200) {
          $("body").text(`Something isn't quite right with the user get request: ${error.status} ${error.statusText}`);
        }
      })
      .then(function() {
        displayUsers(jsonData.activeUsers);
      });

      $("#chatroom").animate({ scrollTop: $('#chatroom').prop("scrollHeight")}, 500);
  };

  var target2 = document.getElementById("load-below");
  var spinner2 = new Spinner(opts)

  $("#new-msg-form").submit(function(e){
    e.preventDefault();

    spinner2.spin(target2)
    var newMessage = $("#new-message").val();
		console.log(newMessage)
    var user_id = $("#id").val();

    fetch('/chat/messages/new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage + "~||~" + user_id)
    });
    $("#new-message").val("");
  });

  setInterval(async , 2000);
});
