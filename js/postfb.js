function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //window.location.replace("/success");
      getUserPic();
      document.getElementById("fbButton").style.display = "none";
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  function getUserPic() {
    FB.api(
      '/me',
      'GET',
      {"fields":"name,picture"},
      function(res) {
          // Insert your code here
          console.log(res);
          if(!res || res.error) {
          alert(!res ? 'error occurred' : res.error);
          console.log(res);
          return;
        }
      document.getElementById("userpic").src = res.picture.data.url;
      document.getElementById("name").innerHTML = res.name;
      }
    );
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1493213687646728',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use version 2.2
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
