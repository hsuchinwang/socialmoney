function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //window.location.replace("/success");
      getUserPic();
      document.getElementById("logindiv").style.display = "none";
      document.getElementById("picdiv").style.display = "block";
      document.getElementById("tabBar").style.display = "block";
      document.getElementById('status').innerHTML = "";
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
       'into this app.';
      if( navigator.userAgent.match('CriOS') ){
        loginWithFacebook();
      }
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
       'into Facebook.';
      if( navigator.userAgent.match('CriOS') ){
        loginWithFacebook();
      }
    }
  }

  function loginWithFacebook(){
      var redirect_uri = document.location.href;
        if(redirect_uri.indexOf('?') !== -1){
                redirect_uri += '&back_from_fb=1';
        } else {
                redirect_uri += '?back_from_fb=1';
        }
      var url = 'https://www.facebook.com/dialog/oauth?client_id=1493213687646728&redirect_uri='+redirect_uri+'&scope=email,public_profile';
      var win = window.open(url, '_self');
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
        $.post('https://socialmoney.herokuapp.com/save_name', {name: res.name, pic: res.picture.data.url}, function(result) {
          console.log(result);
        });

        loadCurrency();
        loadUser();

      }
    );
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1493213687646728',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5', // use version 2.2
    channelUrl : '//socialmoney.herokuapp.com'
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
