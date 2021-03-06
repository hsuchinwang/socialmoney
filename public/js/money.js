var topay = 0, total = 0, availableAmount = 0, totalprice = 0;
var itemsHtml = '';
var indexOfElement = null;

$('#tabBar').on("click", "li", function (event) {         
   if ($(this).find('a').attr('href') == '#tabRecord') {
      $("#selectlist").html("");
      loadUser();
      loadCurrency();
   }
});

function loadUser() {
    $("#selectuser").html("");
    $("#friendlist").html("");
    var name = $('#name').html().toString();
    $.post('https://socialmoney.herokuapp.com/find_friend', {name: name}, function(result) {

      var tmpFri = result.split('.');
      tmpFri.pop();
      var htmlTextG1 = "<optgroup label='Friends:' class='group-1'>";
      for (var i=0; i<tmpFri.length;i++){
        htmlTextG1 += "<option value='"+ tmpFri[i] +"'>"+ tmpFri[i] +"</option>";
      }
      htmlTextG1 += "</optgroup>";
      $("#selectuser").append(htmlTextG1);
      $("#friendlist").append(htmlTextG1);
      $('#selectuser').multiselect('rebuild');
      $("#friendlist").multiselect('rebuild');
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
        $("#friendlist").append(htmlText);
        $("#friendlist").multiselect('rebuild');
        var input = $('input[value="'+name+'"]');
        input.prop('disabled', true);
        input.parent('li').addClass('disabled');

        
      });

    });

    
}

function loadCurrency() {
  var name = $("#name").html().toString();
  $.post('https://socialmoney.herokuapp.com/find_my_money', {name: name}, function(result) {
      var piece = result.split('.');
      piece.pop();
      var mycur = [], mypri = [], myavail = [];
      var htmlText = '', j = 0;
      for (var i = 0;i<piece.length;i=i+3){
        if (i==0){
          availableAmount = piece[i+2];
        }
        htmlText += '<option value="'+ piece[i+2]*Math.pow((j+1),5)+'">'+ piece[i]+' 幣, 餘 '+ piece[i+1]+ '('+piece[i+2]+')' +' 元</option>';
        j++;
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

    $('#friendlist').multiselect({
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        maxHeight: 200,
        enableCollapsibleOptGroups: true
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
          var htmlText = "", totalmoney = 0, totalDebt = 0;
          for (var i = 0;i<piece.length;i=i+3){
            totalmoney += parseInt(piece[i+1]);
            htmlText += '<li class="list-group-item"><span class="glyphicon glyphicon-check" aria-hidden="true"></span> '+ piece[i]+' 幣, 餘 '+piece[i+1]+ ' (' + piece[i+2] +') 元</li>';
          }
          totalDebt = totalmoney - 5000;
          htmlText += '<li class="list-group-item"><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span> 合計：'+ totalmoney +' 元 (' + totalDebt +')</li>';
          $("#moneylist").html(htmlText);

      });
      $( this ).attr("data-toggle", "collapse");
  });

  $( "#recordinput" ).click(function() {
      var name = $("#name").html().toString();
      $.post('https://socialmoney.herokuapp.com/getrecord', {name: name}, function(result) {

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

function checkAmount(amount, name) {
  //$("#"+name).html(amount+"個");
  document.getElementById(name).innerHTML = amount + "個";
  countTotal();
}

function countTotal() {
  totalprice = 0;
  if ($('#bagle').html().toString() != '數量' ) {
    totalprice += 25 * parseInt($('#bagle').html().toString().replace(/個/g,""));
  }
  if ($('#ice').html().toString() != '數量' ) {
    totalprice += 15 * parseInt($('#ice').html().toString().replace(/個/g,""));
  }
  if ($('#toast').html().toString() != '數量' ) {
    totalprice += 20 * parseInt($('#toast').html().toString().replace(/個/g,""));
  }
  if ($('#can').html().toString() != '數量' ) {
    totalprice += 25 * parseInt($('#can').html().toString().replace(/個/g,""));
  }
  if ($('#icebar').html().toString() != '數量' ) {
    totalprice += 20 * parseInt($('#icebar').html().toString().replace(/個/g,""));
  }
  if ($('#Mar').html().toString() != '數量' ) {
    totalprice += 30 * parseInt($('#Mar').html().toString().replace(/個/g,""));
  }
  $('#showtotal').html("Total: "+totalprice);
}

function checkTotal() {
  var htmlText = '<h4>您購買：</h4>';
  if ($('#bagle').html().toString() != '數量' ) {
    htmlText += "<h4>貝果 " + $('#bagle').html().toString() + "</h4>";
    itemsHtml += '貝果' + $('#bagle').html().toString() + '.'
  }
  if ($('#Mar').html().toString() != '數量' ) {
    htmlText += "<h4>馬芬 " + $('#Mar').html().toString() + "</h4>";
    itemsHtml += '馬芬' + $('#Mar').html().toString() + '.'
  }
  if ($('#toast').html().toString() != '數量' ) {
    htmlText += "<h4>烤土司 " + $('#toast').html().toString() + "</h4>";
    itemsHtml += '烤土司' + $('#toast').html().toString() + '.'
  }
  if ($('#ice').html().toString() != '數量' ) {
    htmlText += "<h4>冰淇淋 " + $('#ice').html().toString() + "</h4>";
    itemsHtml += '冰淇淋' + $('#ice').html().toString() + '.'
  }
  if ($('#can').html().toString() != '數量' ) {
    htmlText += "<h4>鮪魚罐 " + $('#can').html().toString() + "</h4>";
    itemsHtml += '罐頭' + $('#can').html().toString() + '.'
  }
  if ($('#icebar').html().toString() != '數量' ) {
    htmlText += "<h4>冰棒 " + $('#icebar').html().toString() + "</h4>";
    itemsHtml += '冰棒' + $('#icebar').html().toString() + '.'
  }
  if ($('#bagle').html().toString() == '數量' && $('#ice').html().toString() == '數量' && $('#can').html().toString() == '數量' && $('#icebar').html().toString() == '數量' && $('#Mar').html().toString() == '數量' && $('#toast').html().toString() == '數量'){
    removeItem();
    alert('請選擇商品數量！');
  }
  $("#itemDiv").html(htmlText);
  $("#itemtotal").html("Total: "+totalprice+"元");
  $('#myCheckModal').modal('show');
}

function removeItem() {
  $('#bagle').html('數量');
  $('#ice').html('數量');
  $('#can').html('數量');
  $('#icebar').html('數量');
  $('#Mar').html('數量');
  $('#toast').html('數量');
  $('#showtotal').html("Total: 0元");
  totalprice = 0;
  itemsHtml = '';
}

function removeCafeItem() {
  //$('#cafePrice').html('');
  document.getElementById("cafePrice").value = "";

}

function checkCafeTotal() {
  var price = document.getElementById("cafePrice").value;
  if (price == '') {
    alert('請輸入價錢');
  } else {
    $("#cafetotal").html("Total: "+parseInt(price)+"元");
    $('#cafeCheckModal').modal('show');
  }
  
}

function toPay() {
  var price = document.getElementById("cafePrice").value;
  var name = $("#name").html().toString();
  var currency = name + price;

  if ( parseInt(price) < availableAmount){
    $.post('https://socialmoney.herokuapp.com/toStore', {name: name, price: parseInt(price), store: 'Bonjour咖啡'}, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/keeprecord', {namec: 'Bonjour咖啡', named: name, price: parseInt(price), currency: currency}, function(result) {

      console.log(result);

    });
  } else {
    alert("You don't have enough money.");
  }
  removeCafeItem();
  $('#cafeCheckModal').modal('hide');
  alert("已結帳，謝謝惠顧！");
}


function toStore() {
  var name = $("#name").html().toString();
  var currency = name + totalprice.toString();
  if (totalprice < availableAmount) {
    console.log(totalprice);
    $.post('https://socialmoney.herokuapp.com/toStore', {name: name, price: totalprice, store: '誠實商店'}, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/keeprecord', {namec: '誠實商店', named: name, price: totalprice, currency: currency, description: itemsHtml}, function(result) {

      console.log(result);

    });
  } else {
    alert("You don't have enough money.");
  }
  removeItem();
  $('#myCheckModal').modal('hide');
  alert("已結帳，謝謝惠顧！");
}

function addFriend(name, addname) {
  $.post('https://socialmoney.herokuapp.com/addfriend', {name: name, friend: addname}, function(result) {

      console.log(result);

  });
}

function getFriend() {
  var brands = $('#friendlist option:selected');
  var addfriend = '';
  var name = $("#name").html().toString();
  $(brands).each(function(index, brand){
    if ($(this).parent('optgroup').hasClass('group-2')){
        addfriend += $(this).val()+'.';
    }
  });
  addfriend = addfriend.substring(0, addfriend.length-1);
  if (addfriend != '') {
    addFriend(name,addfriend);
    alert('Saved!')
  }
  $('#friendlist').multiselect('deselectAll', false);
  $('#friendlist').multiselect('updateButtonText');
  loadUser();
}

function getSelection(price,addfriend) {
  var brands = $('#selectlist option:selected');
  var selected = [], selectPri = [], selectcur = [];
  var name = $("#name").html().toString();
  $(brands).each(function(index, brand){
      if ( indexOfElement != null && $(this).index() == indexOfElement) {
        selected.push($(this).html().substring(0, $(this).html().indexOf('幣')-1));
        selectPri.push(topay);
      } else {
        selected.push($(this).html().substring(0, $(this).html().indexOf('幣')-1));
        selectPri.push($(this).val()/Math.pow(($(this).index()+1),5));                                    
      }
      
  });

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
  if (addfriend != '') {
    addFriend(name,addfriend);
    addFriend(addfriend,name);
  }
  
  return selectcur;
}


function create()
{
    var price = document.getElementById("price").value;
    if ( parseInt(price) > availableAmount ) {
      alert("You don't have enough money!");
      removeImg();
      return;
    }
    var username = $('#selectuser option:selected');
    var currency = getSelection(price,username.html().toString());
    var modalText = "<h4>我用</h4>";
    if (price != null && currency.length > 0 && username.length > 0 ){
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
        modalText += "<h5>共"+ price + "元</h5><h4>做抵押. 請查收</h4>";
        document.getElementById("comfirmList").innerHTML = modalText;
        $.post('https://socialmoney.herokuapp.com/pincode', { currency: data, pin: f, create: username.html() }, function(result) {

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
    loadUser();
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
    resultText = resultText.replace(/幣/g,"").replace(/元/g,"").replace(/\./g,"");
    var tmp = resultText.split(',');
    var resultNum = tmp[1].split(/\D+/);
    var resultCur = tmp[1].split(/\d+/);
    resultNum.shift();
    resultCur.pop();
    modalText += "<h4>您得到：</h4>"
    for (var i=0;i<resultCur.length;i++) {
        modalText += "<h5>"+resultCur[i]+" 幣, "+resultNum[i]+"元</h5>";
    }
    modalText += "<h5>共"+ tmp[2] + "元</h5>";
    document.getElementById("checkList").innerHTML = modalText;
    $('#mycomfirmModal').modal('show');
    $.post('https://socialmoney.herokuapp.com/minus', {name: tmp[0], currency: resultCur, price: resultNum }, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/add', {name: name, currency: resultCur, price: resultNum}, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/keeprecord', {namec: name, named: tmp[0], price: tmp[2], currency: tmp[1].toString()}, function(result) {

      console.log(result);

    });

}