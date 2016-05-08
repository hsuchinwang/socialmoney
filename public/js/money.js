var topay = 0;
// var topay2 = 0;
var total = 0;
var indexOfElement = null;

$('#tabRecord a').click(function (e) {
  loadCurrency();
})

function loadCurrency() {

  var name = $("#name").html().toString();
  $.post('https://socialmoney.herokuapp.com/find_my_money', {name: name}, function(result) {
      console.log(result);
      var mycur = [];
      var mypri = []; 
      mycur = result.split(/\d+/);
      mycur.pop();
      mypri = result.split(/\D+/);
      mypri.shift();
      console.log(mycur,mypri);
      var htmlText = '';
      for (var i=0;i<mycur.length;i++){
        htmlText += '<option value="'+ mypri[i]*Math.pow((i+1),5)+'">'+ mycur[i]+' 幣, 餘 '+ mypri[i] +' 元</option>';
      }

      $("#selectlist").html(htmlText);
      $(document).ready(function() {
          
          $('#selectlist').multiselect({
            buttonWidth: '100%',
            onChange: function(element, checked) {
                if (checked === true) {
                    //action taken here if true
                    // if (element.val() == "0") {
                    //   console.log(element.val()/Math.pow((element.index()+1),5));
                    //   topay = parseInt($("#price").val()) - total;
                    //   total = parseInt($("#price").val());
                    // } else {

                    if ($("#price").val() == '') {
                      alert("請輸入價錢!!");
                    }

                    total += parseInt(element.val()/Math.pow((element.index()+1),5));
                    if (total > parseInt($("#price").val())) {
                      indexOfElement = element.index();
                      console.log(indexOfElement);
                      topay = parseInt(element.val()/Math.pow((element.index()+1),5))- (total - parseInt($("#price").val()));
                      total = parseInt($("#price").val());;
                      
                    }

                    // }
                }
                else if (checked === false) {
                    // if (element.val() == "0") {
                    //   total -= topay;
                    //   topay = 0;
                    // } else {
                      //total -= parseInt(element.val());
                    total = 0;
                    topay = 0;
                    var brands = $('#selectlist option:selected');
                    var selected = [];
                    $(brands).each(function(index, brand){
                        selected.push($(this).val()/Math.pow(($(this).index()+1),5));
                    });
                    console.log(selected);
                    for (var i=0;i<selected.length;i++) {
                      total += parseInt(selected[i]);
                    }
                    // }
                }
            },
            buttonText: function(options, select) {
                console.log(options)
                console.log(select);
                if (options.length === 0) {
                    return 'Select currency  ';
                } else if (options.length >= 1) {
                    return "$ " + total + " will pay";
                }

            }
            
          });

      });

  });
}

function getSelection(price) {
  var brands = $('#selectlist option:selected');
  var selected = [];
  var selectPri = [];
  var selectcur = [];
  $(brands).each(function(index, brand){
      if ( indexOfElement != null && $(this).index() == indexOfElement) {
        selected.push($(this).html().substring(0, $(this).html().indexOf(' ')));
        selectPri.push(topay);
      } else {
        selected.push($(this).html().substring(0, $(this).html().indexOf(' ')));
        // if ($(this).val() == "0") {
        //   selectPri.push(topay);
        // } else {
          selectPri.push($(this).val()/Math.pow(($(this).index()+1),5));
        //}                                    
      }
      
  });
  console.log(selectPri);
  if ( total < price ) {
    selected.push($("#name").html().toString());
    selectPri.push(price - total);
  }
  for (var i=0;i<selected.length;i++) {
    selectcur.push(selected[i]+"幣"+selectPri[i]+"元");
  }
  return selectcur;
}


function create()
{

    var price = document.getElementById("price").value;
    var currency = getSelection(price);
    console.log(currency);
    if (price != null && currency.length > 0 ){
        var data = $("#name").html().toString() + ',' + currency.join('.') + ',' + price;
        console.log(data);
        //data = utf16to8(data);
        //document.getElementById("qrimage").innerHTML="<img src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+data+"'/>";
        //encodeURIComponent(data)
        var a, b, c, d, e, f;
        a = Math.floor((Math.random() * 10) + 1);
        b = Math.floor((Math.random() * 10) + 1);
        c = Math.floor((Math.random() * 10) + 1);
        d = Math.floor((Math.random() * 10) + 1); 
        e = Math.floor((Math.random() * 10) + 1);
        f = (a+b)*c*d*e;
        $("#pincode").html(f);
        document.getElementById("comfirmList").innerHTML = "我用 "+currency + "  共" + price + "元 做抵押. 請查收！";
        $.post('https://socialmoney.herokuapp.com/pincode', { currency: data, pin: f }, function(result) {

          console.log(result);

        });

        $('#myModal').modal('show'); 

    } else {
        alert("Please input the price and currency correctly!")
    }

}




function removeImg() {
    //document.getElementById("qrimage").innerHTML = "";
    document.getElementById("price").value = "";
    $('option', $('#selectlist')).each(function(element) {
        $(this).removeAttr('selected').prop('selected', false);
        console.log(element);
    });
    $('#selectlist').multiselect('refresh');
    $("#pincode").html('');
    total = 0;
    topay = 0;

}

function checkPin(){
  var userpin = document.getElementById('userpin').value;
  var resultText = '';
  console.log(userpin);
  //document.domain = 'socialmoney.herokuapp.com';
  //if ($('#fb-root').length === 0) $('body').prepend('<div id="fb-root"></div>');
  $.post('https://socialmoney.herokuapp.com/checkpin', { pin: userpin }, function(result) {
      console.log(result);
      if (result.toString() != 'fail'){
        resultText = result.toString();
        console.log(resultText);
        updateDB(resultText);
        alert('The record is saved!');
      } else {
        alert('The Pin Code is wrong! Please input the correct one!');
      }
      
  });

  if (resultText != '') {
    console.log(resultText);
    updateDB(resultText);
  }
  document.getElementById('userpin').value = '';

}

function updateDB(resultText) {
    //resultText = '王敍親,盧奕安幣35元,35';
    // var resultText = $("#result").text();
    resultText = resultText.replace(/幣/g,"");
    resultText = resultText.replace(/元/g,"");
    resultText = resultText.replace(/\./g,"");
    var tmp = resultText.split(',');
    var resultPri = tmp[2];
    var resultName = tmp[0];
    var resultNum = tmp[1].split(/\D+/);
    var resultCur = tmp[1].split(/\d+/);
    var creditname = $("#name").html().toString();
    resultNum.shift();
    resultCur.pop();
    console.log(tmp,resultPri,resultName,resultCur,resultNum, creditname);
    $.post('https://socialmoney.herokuapp.com/minus', {name: resultName, currency: resultCur, price: resultNum }, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/add', {name: creditname, currency: resultCur, price: resultNum}, function(result) {

      console.log(result);

    });
    $.post('https://socialmoney.herokuapp.com/keeprecord', {namec: creditname, named: resultName, price: resultPri, currency: tmp[1].toString()}, function(result) {

      console.log(result);

    });

}