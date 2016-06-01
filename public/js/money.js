var topay = 0;
var total = 0;
var indexOfElement = null;

$('#tabBar').on("click", "li", function (event) {         
   if ($(this).find('a').attr('href') == '#tabRecord') {
      $("#selectlist").html("");
      loadCurrency();
   }
});

function loadUser() {
    name = $('#name').html().toString();
    $.post('https://socialmoney.herokuapp.com/find_friend', {name: name}, function(result) {

      console.log(result);
      var tmpFri = result.split('.');
      console.log(tmpFri);
      tmpFri.pop();
      htmlText = "<optgroup label='Friends:' class='group-1'>";
      for (var i=0; i<tmpFri.length;i++){
        htmlText += "<option value='"+ tmpFri[i] +"'>"+ tmpFri[i] +"</option>";
      }
      htmlText += "</optgroup>";
      $("#selectuser").append(htmlText);
      //$('#selectuser').multiselect('rebuild');

    });

    $.get('https://socialmoney.herokuapp.com/find_user', function(data){
      var tmp = data.split('|');
      tmp.pop();
      var htmlText = "<optgroup label='All users:' class='group-2'>";
      for (var i=0; i<tmp.length;i++) {

        var tmpName = tmp[i].substring(0, tmp[i].indexOf('%'));
        //var tmpPic = tmp[i].substring(tmp[i].indexOf('%')+1, tmp[i].length);
        //htmlText += "<option value='"+ tmpName +"' style='background-image:url('"+ tmpPic + "');'>"+ tmpName +"</option>";
        htmlText += "<option value='"+ tmpName +"'>"+ tmpName +"</option>";

      }
      htmlText += "</optgroup>"
      $("#selectuser").append(htmlText);
      $('#selectuser').multiselect('rebuild');

      
    });
}

function loadCurrency() {
  var name = $("#name").html().toString();
  $.post('https://socialmoney.herokuapp.com/find_my_money', {name: name}, function(result) {
      var piece = result.split('.');
      piece.pop();
      var mycur = [], mypri = [], myavail = [];
      for (var i = 0;i<piece.length;i=i+3){
        mycur.push(piece[i]);
        mypri.push(piece[i+1]);
        myavail.push(piece[i+2]);
      }
      var htmlText = '';
      for (var i=0;i<mycur.length;i++){
        htmlText += '<option value="'+ myavail[i]*Math.pow((i+1),5)+'">'+ mycur[i]+' 幣, 餘 '+ mypri[i]+ '('+myavail[i]+')' +' 元</option>';
      }
      htmlText += '<option value="clean">全部清除</option>';
      $("#selectlist").append(htmlText);
      $('#selectlist').multiselect('rebuild');
      var input = $('input[value="0"]');
      input.prop('disabled', true);
      input.parent('li').addClass('disabled');
      
  });
}

$(document).ready(function() {
          
    var lastSelected = '';
      $('#selectuser').multiselect({
          enableCaseInsensitiveFiltering: true,
          buttonWidth: '100%',
          maxHeight: 200,
          enableCollapsibleOptGroups: true,
          buttonText: function(options, select) {
              if (options.length === 0) {
                  return 'Select user ';
              } else{
                  return select.val();
              }
          },
          onChange: function(element, checked) {
            if (checked === true){
              $("#selectuser").multiselect('deselect', lastSelected);
              lastSelected = $('#selectuser option:selected').val();
            } else if (checked === false) {
              lastSelected = '';
            }
          }
    });

    $('#selectlist').multiselect({
      buttonWidth: '100%',
      onChange: function(element, checked) {
          if (checked === true) {

              if (element.val() == 'clean') {

                $('#selectlist').multiselect('deselectAll', true);
                $('#selectlist').multiselect('updateButtonText');
                total = 0;
                var nonSelectedOptions = $('#selectlist option').filter(function() {
                  return !$(this).is(':selected');
                });
                var dropdown = $('#selectlist').siblings('.multiselect-container');
                $('#selectlist option').each(function() {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                });

              } 
              else {

                if ($("#price").val() == '') {
                  
                  alert("請輸入價錢!!");
                  $("#selectlist").multiselect('deselect', element.val());

                } 
                else {

                  total += parseInt(element.val()/Math.pow((element.index()+1),5));
                  if (total > parseInt($("#price").val())) {
                    indexOfElement = element.index();
                    console.log(indexOfElement);
                    topay = parseInt(element.val()/Math.pow((element.index()+1),5))- (total - parseInt($("#price").val()));
                    total = parseInt($("#price").val());
                    var nonSelectedOptions = $('#selectlist option').filter(function() {
                        return !$(this).is(':selected');
                    });

                    var dropdown = $('#selectlist').siblings('.multiselect-container');
                    nonSelectedOptions.each(function() {
                        var input = $('input[value="' + $(this).val() + '"]');
                        input.prop('disabled', true);
                        input.parent('li').addClass('disabled');
                    });
                    var input = $('input[value="clean"]');
                    input.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                  } 
                }
              }
              
          }
          else if (checked === false) {

              total = 0;
              topay = 0;
              var brands = $('#selectlist option:selected');
              var selected = [];
              $(brands).each(function(index, brand){
                  selected.push($(this).val()/Math.pow(($(this).index()+1),5));
              });
              for (var i=0;i<selected.length;i++) {
                total += parseInt(selected[i]);
              }
              var nonSelectedOptions = $('#selectlist option').filter(function() {
                  return !$(this).is(':selected');
              });
              var dropdown = $('#selectlist').siblings('.multiselect-container');
              $('#selectlist option').each(function() {
                  var input = $('input[value="' + $(this).val() + '"]');
                  input.prop('disabled', false);
                  input.parent('li').addClass('disabled');
              });

          }
      },
      buttonText: function(options, select) {
          if (options.length === 0) {
              return 'Select currency  ';
          } else if (options.length >= 1) {
              return "$ " + total + " will pay";
          }

      }
      
    });
  $(function () {
      $('[data-toggle="tooltip"]').tooltip()
  })
  $( "#walletinput" ).click(function() {
      var name = $("#name").html().toString();
      $.post('https://socialmoney.herokuapp.com/find_my_money', {name: name}, function(result) {
          var piece = result.split('.');
          piece.pop();
          var mycur = [], mypri = [], myavail = [];
          for (var i = 0;i<piece.length;i=i+3){
            mycur.push(piece[i]);
            mypri.push(piece[i+1]);
            myavail.push(piece[i+2]);
          }
          var htmlText = "";
          for (var x=0;x<mycur.length;x++){
            htmlText += '<li class="list-group-item"><span class="glyphicon glyphicon-check" aria-hidden="true"></span> '+ mycur[x]+' 幣, 餘 '+mypri[x]+ ' (' + myavail[x] +') 元</li>';
          }
          $("#moneylist").html(htmlText);

      });
      $( this ).attr("data-toggle", "collapse");
  });

  $( "#recordinput" ).click(function() {
      var name = $("#name").html().toString();
      $.post('https://socialmoney.herokuapp.com/getrecord', {name: name}, function(result) {

        console.log(result);
        var resultRecord = result.split('.');
        resultRecord.pop();
        var htmlText = "";
        for (var x=resultRecord.length-1;x>=0;x--){
          htmlText += '<li class="list-group-item"><span class="glyphicon glyphicon-check" aria-hidden="true"></span> '+resultRecord[x]+'</li>';
        }
        $("#moneylist").html(htmlText);

      });
      $( this ).attr("data-toggle", "collapse");
  });

});

function getSelection(price,addfriend) {
  var brands = $('#selectlist option:selected');
  var selected = [];
  var selectPri = [];
  var selectcur = [];
  var available = 0;
  var name = $("#name").html().toString();
  $(brands).each(function(index, brand){
      available += $(this).val()/Math.pow(($(this).index()+1),5);
      if ( indexOfElement != null && $(this).index() == indexOfElement) {
        selected.push($(this).html().substring(0, $(this).html().indexOf('幣')-1));
        selectPri.push(topay);
      } else {
        selected.push($(this).html().substring(0, $(this).html().indexOf('幣')-1));
        selectPri.push($(this).val()/Math.pow(($(this).index()+1),5));                                    
      }
      
  });
  if ( price > available ) {
    alert("You don't have enough money!");
    removeImg();
    return;
  }
  if ( total < price ) {
    selected.push($("#name").html().toString());
    selectPri.push(price - total);
  }
  for (var i=0;i<selected.length;i++) {
    selectcur.push(selected[i]+"幣"+selectPri[i]+"元");
  }
  $.post('https://socialmoney.herokuapp.com/minusAvailable', {name: name, currency: selected, price: selectPri }, function(result) {

    console.log(result);

  });
  $.post('https://socialmoney.herokuapp.com/addfriend', {name: name, friend: addfriend}, function(result) {

    console.log(result);

  });
  $.post('https://socialmoney.herokuapp.com/addfriend', {name: addfriend, friend: name}, function(result) {

    console.log(result);

  });
  return selectcur;
}


function create()
{
    var price = document.getElementById("price").value;
    var name = $('#selectuser option:selected');
    var addfriend = '';
    if (name.parent('optgroup').hasClass('group-2')){
        addfriend += name.html();
        console.log(addfriend);
    }
    var currency = getSelection(price,addfriend);
    var modalText = "<h4>我用</h4>";
    if (price != null && currency.length > 0 && name.length > 0 && price ){
        var data = $("#name").html().toString() + ',' + currency.join('.') + ',' + price;
        console.log(data);
        var a, b, c, d, e, f;
        a = Math.floor((Math.random() * 10) + 1);
        b = Math.floor((Math.random() * 10) + 1);
        c = Math.floor((Math.random() * 10) + 1);
        d = Math.floor((Math.random() * 10) + 1); 
        e = Math.floor((Math.random() * 10) + 1);
        f = (a+b)*c*d*e;
        $("#pincode").html(f);
        for (var i=0;i<currency.length;i++) {
          modalText += "<h5>"+currency[i]+"</h5>";
        }
        modalText += "<h5>共"+ price + "元</h5>";
        modalText += "<h4>做抵押. 請查收</h4>";
        document.getElementById("comfirmList").innerHTML = modalText;
        $.post('https://socialmoney.herokuapp.com/pincode', { currency: data, pin: f, create: name.html() }, function(result) {

          console.log(result);

        });

        $('#myModal').modal('show'); 

    } else {
        alert("Please input the price, currency and user correctly!")
    }

}


function removeImg() {

    document.getElementById("price").value = "";
    $('#selectlist').multiselect('deselectAll', false);
    $('#selectlist').multiselect('updateButtonText');
    $('#selectuser').multiselect('deselectAll', false);
    $('#selectuser').multiselect('updateButtonText');
    $("#pincode").html('');
    $("#selectlist").html("");
    loadCurrency();
    total = 0;
    topay = 0;

}


function checkPin(){
  var userpin = document.getElementById('userpin').value;
  var resultText = '';
  var name = $("#name").html().toString();
  if (userpin == '') {
    alert("Please input the correct Pin Code.");
  } else {
    $.post('https://socialmoney.herokuapp.com/checkpin', { pin: userpin, name: name }, function(result) {
      console.log(result);
      if (result.toString() != 'fail'){
        resultText = result.toString();
        updateDB(resultText);
      } else {
        alert('The Pin Code is wrong or it is not for you! Please input the correct one!');
      }
      
    });
  }

  document.getElementById('userpin').value = '';

}


function updateDB(resultText) {
    var name = $("#name").html().toString();
    var modalText = '';
    resultText = resultText.replace(/幣/g,"");
    resultText = resultText.replace(/元/g,"");
    resultText = resultText.replace(/\./g,"");
    var tmp = resultText.split(',');
    var resultPri = tmp[2];
    var resultName = tmp[0];
    var resultNum = tmp[1].split(/\D+/);
    var resultCur = tmp[1].split(/\d+/);
    resultNum.shift();
    resultCur.pop();
    modalText += "<h4>您得到：</h4>"
    for (var i=0;i<resultCur.length;i++) {
        modalText += "<h5>"+resultCur[i]+" 幣, "+resultNum[i]+"元</h5>";
    }
    modalText += "<h5>共"+ resultPri + "元</h5>";
    document.getElementById("checkList").innerHTML = modalText;
    $('#mycomfirmModal').modal('show');
    $.post('https://socialmoney.herokuapp.com/minus', {name: resultName, currency: resultCur, price: resultNum }, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/add', {name: name, currency: resultCur, price: resultNum}, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/keeprecord', {namec: name, named: resultName, price: resultPri, currency: tmp[1].toString()}, function(result) {

      console.log(result);

    });
    // $.post('https://socialmoney.herokuapp.com/addfriend', {name: name, friend: resultName}, function(result) {

    //   console.log(result);

    // });

}