$(document).ready(function(){
  
ymaps.ready(init);

});//end.ready


//
function init(){
     current_deficit_to_title();//в title переносит текущий дефицит из select
   
  $(".add_new_deficit").click(function(){
    $("#add_new_deficit").modal('show');
  });

  $(".save_new_deficit").click(function(){
    var name_of_deficit=$("#input_name_deficit").val();
     if (name_of_deficit.length-1 < 2) { $("#emailHelp").html("<span style=\"color: red;\">слишком короткое наименование</span>");
  return;
   }
     //тут можно проверок поставить на правильное заполнение формы
     $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'add_new_deficit',
              'name_of_deficit': name_of_deficit
              
      },
           success: function(data){
             console.log(data); 
             $("#add_new_deficit").modal('hide');
                $(".products_name select").append("<option>"+name_of_deficit+"</option>");
                 var last_option=$(".products_name select>option").length -1;
                  $('select option:eq('+last_option+')').prop('selected',true);//делает выбранным эту опцию
                   $('.products_name').trigger('change');// вызывает событие на обработчике событий
                                         }
                    });//end ajax
  });
  

/* авторизация */
   var user_hash= localStorage.getItem('user_hash');
 var user_login= localStorage.getItem('user_login');
  console.log("изначальный user_hash="+ user_hash + " изначальный user_login="+ user_login);
  if (user_login != null ) {
    $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'check_user_hash',
              'user_hash': user_hash,
              'user_login': user_login
              
      },                    
           success: function(data){
            console.log("проверка совпадения хеша "+data);
            if (data == "user_hash_match"){
               $(".user_login").text(localStorage.getItem('user_login')); // этот блок смены меню надо в функцию
              $(".avtoriz_form").hide();
                $(".registration").hide();//кнопка регистрации-- лишнее действие?
                 $(".row_of_avtirization").hide();

              $(".row_of_user").show();
            } else { console.log("хеш не совпал!!");}
           }
         });//end ajax check_user_hash
  }
 
 $(".registration").click(function(){
  $(".reg_form").toggle();
 });

 $(".reg_button").click(function(){
  var login=$('[name = "reg_login"]').val();
  var password=$('[name = "reg_password"]').val();
  console.log(login);
  console.log(password);
    $(".system_tablo_mess").html("");
  /*  // тут нужна проверка на длинный/короткий логин/пароль
if (login.length<1) {
  return;
}
 if (password.length<5){
  return;
 }
 */
    $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'register_new_user',
              'login': login,
              'password': password
              
      },                    
           success: function(data){
            console.log("data="+ data);
            if (data == "login_have") {
              $(".system_tablo_mess").html("Пользователь с таким логином уже существует в базе данных");
            }

            if (data == "saved") {
              $(".reg_saved").show();
              $(".reg_form").hide();
              $(".registration").hide();
              $(".login_pass").trigger("click");
            }
           }
       });

 });
 $(".login_pass").click(function(){
   
   $(".login_pass").hide();
  $(".avtoriz_form").toggle();

    $(".enter_log_pass").click(function(){
      
      var login= $("[name = 'avtoriz_login']").val();
      var password= $("[name = 'avtoriz_password']").val();
       console.log (login +"  " +password);
       $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'enter_log_pass',
              'login': login,
              'password': password
              
      },                    
           success: function(data){
            if (data == "login/pass is wrong.") {
             $(".mess_from_log_pass").html(data);
            } else {
              $(".mess_from_log_pass").empty();//очистка окна сообщений об ошибочном пароле - для профилактики, на возможный случай ошибки
           var for_localStorage = JSON.parse(data);
            console.log("hash="+for_localStorage.user_hash +" login= "+ for_localStorage.user_login);
            localStorage.setItem('user_hash', for_localStorage.user_hash);
              localStorage.setItem('user_login', for_localStorage.user_login);
           var a= localStorage.getItem('user_hash');
            console.log("считано из user_hash="+a+"считано из user_login= "+ localStorage.getItem('user_login'));
             $(".user_login").text(localStorage.getItem('user_login'));
              $(".avtoriz_form").hide();
               // $(".registration").hide();//кнопка регистрации-- лишнее действие?
                 $(".row_of_avtirization").hide();

              $(".row_of_user").show();
               read_markers_all(myMap);//рисует все маркеры из категории
            }
           }
           });
    });//end .enter_log_pass
 });

$(".log_out").click(function(){
   localStorage.clear();
    location.href=location.href;
});

  /* end авторизация*/

      $( ".products_name" ).change(function() { // по какому товару карту выводить
        current_deficit_to_title();
         myMap.geoObjects.removeAll();
       
         read_markers_all(myMap);
  });

     var center_lng=47.2313455;
      var center_lat=39.7232855;
       var center_zoom=12;
    var deficit= $("#map").attr("data-deficit");
     if(deficit!=undefined) {console.log("i am not undefined");
      var center_lng=Number($("#map").attr("data-center_lng"));
      var center_lat=Number($("#map").attr("data-center_lat"));
      var center_zoom=Number($("#map").attr("data-center_zoom"));
     console.log("this deficit="+deficit+ "lng="+center_lng +" center_lat="+center_lat);
           $('select option:contains("'+deficit+'")').prop('selected',true);//делает выбранным эту опцию
        // stop here 2062020
   }
    
     // myMap.setCenter([center_lat,center_lng]);
        // Создание карты.  
         var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [center_lng, center_lat],
            zoom: center_zoom
        }, {
            searchControlProvider: 'yandex#search',
            'hasBalloon': true,
            balloonPanelMaxMapArea: Infinity
        });

    // Сравним положение, вычисленное по ip пользователя и
    // положение, вычисленное средствами браузера.
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: false

    }).then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение вычисленное по ip'
        });
              
        myMap.geoObjects.add(result.geoObjects);
        if(deficit==undefined){
        myMap.setCenter(result.geoObjects.get(0).geometry.getCoordinates());}
        // var lan=result.geoObjects.get(0).geometry.getCoordinates()[0];// так брать координаты
    
        myMap.setZoom(center_zoom);
    });

    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: false
    }).then(function (result) {
        // Синим цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение вычисленное  браузером'
        });
        myMap.geoObjects.add(result.geoObjects);
        if(deficit==undefined){
        myMap.setCenter(result.geoObjects.get(0).geometry.getCoordinates());}
        myMap.setZoom(center_zoom);
    });
    
         /*
         //старое начало карты без геолокации
         myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [47.2313455, 39.7232855],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 12
        },{
          'hasBalloon': false
        });
        */
/*
       geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение'
        });
        myMap.geoObjects.add(result.geoObjects);
    });
*/
           read_markers_all(myMap); //расстановка всех маркеров по карте

    myMap.geoObjects.events.add('click', function (e) { // при клике по маркеру выпадает меню покупок дефицита
    
    // Получение ссылки на дочерний объект, на котором произошло событие.
    var object = e.get('target');
    var lan=e.get('target').geometry.getCoordinates()[0];
        var lng = e.get('target').geometry.getCoordinates()[1];

 if (opening_window_point != undefined) 
        { 
            $('[id_point="'+opening_window_point+'"]').find(".wrap_dropdown_info").removeAttr("style");
             $('[id_point="'+opening_window_point+'"]').removeClass("toggle_name_point_dropdown_on");
              
       }
    
   
    $('[lan="'+lan+'"][lng="'+lng+'"]').children(".wrap_dropdown_info").css("display","block");
     $('[lan="'+lan+'"][lng="'+lng+'"]').addClass("toggle_name_point_dropdown_on");
       opening_window_point =  $('[lan="'+lan+'"][lng="'+lng+'"]').attr("id_point");
         var id_point=opening_window_point;

          myMap.geoObjects.each(function(geoObject){// этот кусок надо в функцию оформить
                              
                          if (geoObject.options.get('last_center')==1){
                               geoObject.options.set({'last_center':0});
                                geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                          }
                           if (id_point==geoObject.options.get('id_point')) {
                              geoObject.options.set({'iconColor': '#bada55'});//цвет маркера в центре карты
                               geoObject.options.set({'last_center':1});
                           }
          
        });
  
   });
      
     var opening_window_point; //глобальная переменная для запоминания последнего открытого меню поинта
    $(".points_list").delegate("div", "click", function(e){ // Клик по названию Поинта- и выпадает меню с отзывами о покупках
     myMap.balloon.close();//закрывает все открытые балууны на карте- если они есть
        //e.stopPropagation();// запрещает дальнейщую передачу события(и проблемы с исчезновением карты добавляет!!!)
/*
      if (last_click != undefined) { //скрывает открытое предыдущее окно 
        console.log("click to .point_list="+e.target);
       //last_click.toggle();//скрывает или показывает выбранные элемент 
       // где-то здесь проблема
       last_click.hide();
       last_click.closest(".info_point").toggleClass("toggle_name_point_dropdown_on");
      }
      */
      // определить открыте id точки и открыто ли окно - 
      console.log("event.target="+e.target.tagName);
      if (e.target.tagName != 'SPAN' ) { return;}
      var id_point= $(this).attr('id_point');
       if (opening_window_point != undefined) 
        { 
            $('[id_point="'+opening_window_point+'"]').find(".wrap_dropdown_info").removeAttr("style");
             $('[id_point="'+opening_window_point+'"]').removeClass("toggle_name_point_dropdown_on");
              
       }
           opening_window_point=id_point;
     var last_click=$(this).children(".wrap_dropdown_info");
       
      last_click.css("display","block");//появление меню
      last_click.closest(".info_point").addClass("toggle_name_point_dropdown_on");
                
     var lan=Number($(this).attr('lan')); var lng=Number($(this).attr('lng'));//Данный Поинт оказывается в центре карты 
       myMap.setCenter([lan,lng]);

        
       //here need to change color of marker
        //console.log('zx= '+Object.keys(myMap.geoObjects));
        myMap.geoObjects.each(function(geoObject){
                              
                          if (geoObject.options.get('last_center')==1){
                               geoObject.options.set({'last_center':0});
                                geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                          }
                           if (id_point==geoObject.options.get('id_point')) {
                              geoObject.options.set({'iconColor': '#bada55'});//цвет маркера в центре карты
                               geoObject.options.set({'last_center':1});
                           }
          
        });
       
        

    });


$(".points_list").delegate("button.close_wrap_dropdown_info ", "click", function(){//клик по КРЕСТУ закрытия wrap_dropdown_info
      console.log("click to cross");
        opening_window_point=undefined;
      $(this).closest(".wrap_dropdown_info").removeAttr("style");
       $(this).closest(".info_point").removeClass("toggle_name_point_dropdown_on");
         myMap.geoObjects.each(function(geoObject){
                              
                          if (geoObject.options.get('last_center')==1){
                               geoObject.options.set({'last_center':0});
                                geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                          }
                          /*
                           if (id_point==geoObject.options.get('id_point')) {
                              geoObject.options.set({'iconColor': '#bada55'});//цвет маркера в центре карты
                               geoObject.options.set({'last_center':1});
                           }
                           */
          
        });

    

});
  $(".points_list").delegate("button.add_info", "click", function(){ //клик по кнопке "добавить инфо о цене"
      var id_point=$(this).parent().parent().parent().attr("id_point");
console.log("id_point= "+ id_point);//номер id поинта
$("[id_point='"+id_point+"']").find(".wrap_add_comment_into_point").show();// показвает форму добавления комментария
 
 });


  $(".points_list").delegate("#save_comment_about_product", "click", function(){// сохранение цены и комментария о ПОСЛЕДНЕЙ покупке  в выбранном Поинте
 
 var id_point=$(this).parent().parent().parent().parent().attr("id_point");
 console.log("id_point="+ id_point);
         var price=$(this).siblings().find('[name="price"]').val();
         var comment=$(this).siblings('[name="description_point"]').val();
          console.log(price+' comment='+comment);

                          $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'save_new_comment_about_purchase_sql',
              'product_price': price,
              'comment':comment,
              'id_point':id_point
      },
           success: function(data){ 
                      
            var this_target=$('[id_point="'+id_point+'"]').find(".wrap_dropdown_info");
            this_target.empty();// очищен выпад-ющий список - надо заполнить его обновленными данными
                
                 var data_object = JSON.parse(data);
               
               
               var note= html_wrap_close_and_addinfo();
                for (var i=data_object.length-1; i>=0; i--){
                  
                  if (i==data_object.length-1) {
                    note+=html_wrap_note_this(data_object[i],'bg-success');
                    /*
                    note+= "<div class='wrap_note_this bg-success' data-id_note='"+data_object[i]['id_note']+"'><div class='note_this'>"+data_object[i]['purchase_descr']                  
                + "</div><div class='data_note'>"+data_object[i]['data_note']+"</div><div class='last_price'>"+data_object[i]['params_value']+"р.</div>"
                +"<div class='delete_this_note'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></div> "+"</div>" ;
                    */
                 $("[id_point='"+id_point+"']").find(".point_price").html(data_object[i]['params_value']+"р.");//выводит на главную панель меню последнюю стоимость
                 
                 myMap.geoObjects.each(function(geoObject){ //добавляет в маркер оследнюю стоимость
                  if (geoObject.options.get('id_point')==id_point){
                       geoObject.properties.set({'iconContent': data_object[i]['params_value']});
                                 }
                 });
                  } else {
                    note+=html_wrap_note_this(data_object[i]);
                    /*
                    note+= "<div class='wrap_note_this' data-id_note='"+data_object[i]['id_note']+"'><div class='note_this'>"+data_object[i]['purchase_descr']
                                    
                + "</div><div class='data_note'>"+data_object[i]['data_note']+"</div><div class='last_price'>"+data_object[i]['params_value']+"р.</div>"
                 +"<div class='delete_this_note'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></div>"+"</div>" ;
                  */
                 }
                
                }// 
       
              this_target.append(note);    

             
           } // 
          
      });

  });

$(".points_list").delegate(".delete_this_note", "click", function(){// удаление заметки  (если заметка последняя, то и Поинт удаляется)
  var id_note= $(this).closest(".wrap_note_this").attr('data-id_note');

  console.log('клик по корзине='+id_note);
   //проверка не последняя ли это запись в этом ПОИНТЕ, если последняя- то удалить потом весь поинт
    var id_point=$(this).closest(".info_point ").attr('id_point');
     console.log("id_point этой записи="+id_point); //stop here 1304
       var how_many_wrap_note_this = $("[id_point='"+id_point+"']").find(".wrap_note_this").length;
         console.log("количество .wrap_note_this="+how_many_wrap_note_this);
   //
   $('.delete_wrap_note_this').empty();
   var html_string = $(this).closest(".wrap_note_this").html();
    $('.delete_wrap_note_this').append("<div class='wrap_note_this'>"+html_string+"</div>");
     $('.delete_wrap_note_this').find('.delete_this_note').remove();
      $('#delete_note').modal();//появление окна  подтверждения удаления
        
        $('.delete_note_on').click(function(){
          
           
          $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'delete_purchase_descr_sql',
              'id_note': id_note
              
      },                    //stop here 23.06
           success: function(data){
                console.log(data);//stop here 0504 (теперь обновить меню ПОИНТА)
                $('#delete_note').modal('hide');//это бутсраповское модальное окно
                var this_wrap_dropdown_info=$("[data-id_note='"+id_note+"']").closest(".info_point");
                $("[data-id_note='"+id_note+"']").remove();
                var last_price = this_wrap_dropdown_info.find('.last_price:eq(0)').text();//определяет цену из последнего отзыва

                 this_wrap_dropdown_info.find(".point_price").html(last_price);// вставляет цену из последнего отзыва в титульную панель
                  // надо в маркер цену вставить 28.06 !!!
                                           myMap.geoObjects.each(function(geoObject){
                                           // console.log(geoObject.options.get('id_point'));
                              
                              
                          if (geoObject.options.get('id_point')==id_point){
                               //geoObject.options.set({'last_center':0});
                               // geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                                //geoObject.options.remove();
                               // myMap.geoObjects.remove(geoObject);
                               console.log("id_point comparision="+id_point);
                               geoObject.properties.set({

                                iconContent: last_price
                               });
                              //stop here -2906 -вроде подставлет верхнюю в списке цену покупки- теперь надо...
                            
                          }
                           
          
        });


                  if (how_many_wrap_note_this==1) {
                    console.log('тут последний коммент id_point='+ id_point);
                    $.ajax({
                      type:'post',
                      url:'ajax/ajaxrequest.php',
                      data:{'label':'delete_empty_point',
                            'id_point':id_point
                      },
                          success: function(data){
                            console.log(data);
                            $("[id_point='"+id_point+"']").remove();

                                 myMap.geoObjects.each(function(geoObject){
                              
                          if (geoObject.options.get('last_center')==1){
                               //geoObject.options.set({'last_center':0});
                               // geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                                //geoObject.options.remove();
                                myMap.geoObjects.remove(geoObject);
                          }
                           
          
        });
                                 if ($(".points_list").is(':empty')) { //если поинт последний, то при подтерждении и
                                   console.log(".point_list ПУСТОЙ");
                                    var product_name=$('.products_name select>option:selected').text();
                                     $("#title_deleting_deficit").text('удалить "'+product_name+'"');
                                     $(".text-wrap").text(product_name);
                                     $("#delete_empty_deficit").modal('show');

                                      $(".delete_empty_deficit").click(function(){
                                         console.log('click to deleting category');
                                                   $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'delete_empty_deficit',
              'product_name': product_name
              
      },
           success: function(data){
          $("#delete_empty_deficit").modal('hide');
          console.log(data);
          location.reload();
           }
         });//end.ajax
                                      });//end.delete_empty_deficit click
                                   
                               }//end.if
                          }//end.success delete_empty_point
                    });//end.ajax.delete_empty_point
                  }
                  
           }
         }); //end ajax       
        });

   

});//end удаление записи

// добавление новой точки в текущем товаре
    $(".add_point").click(function(){
      $(".points_list").fadeOut();// скрывает список поинтов
    	$(".wrap_coord_point").fadeIn(800);
    	$(".out_add_point").fadeIn(800);
    	$(".add_point").fadeOut();
    	var plasemark;
    	var callback = function (e) {
          if (typeof plasemark != 'undefined') {
            myMap.geoObjects.remove(plasemark);// удаляет маркер
            }
        
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
         
          $('[name="lan"]').val(coords[0]);
           $('[name="lng"]').val(coords[1]);
           
           plasemark = new ymaps.Placemark([coords[0], coords[1]], {
            balloonContent: ' <strong>новая точка</strong>'
        }, {
            preset: 'islands#redSportIcon',
            iconColor: '#ff05b6'
        });
            
            myMap.geoObjects.add(plasemark);
                
        }
        else {
            myMap.balloon.close();
        }

    myMap.setCenter([coords[0], coords[1]]);// перемещение  центра карты по координатам маркера

    };// end callback
      myMap.events.add('click', callback);//myMap.events

          $('.save').click(function(){  //сохранить поинт
        var name_point=$('[name="name_point"]').val();
        //$('[name="description_point"]').css("border","5px solid red");
        var description_point = $('[name="description_point_"]').val();
        var product_price = $('[name="price_"]').val();
       // $('[name="price"]').css("border","3px solid green");
       
        var lan = $('[name="lan"]').val();
        var lng = $('[name="lng"]').val();
        console.log(name_point+ ' '+ 'цена='+product_price + ' ; описание= '+description_point + ' lan=' + lan + ' lng='+lng);

        if ((name_point == '')||(description_point == '')) { 
            console.log('не все поля заполнены');
            return;
    }
   /* 
надо  будет очистить все поля формы добавления точки перед записиью их в базу
   */
      
      $.ajax({  
        type:'post',
        url:'ajax/ajaxrequest.php',
          data:{'label':'save_new_marker_sql',
                  'name_point': name_point,
                  'description_point': description_point,
                  'lan':lan,
                  'lng':lng,
                  'product':$(".products_name option:selected").text(),
                  'product_price':product_price
       },
        success: function(data){  // добавление нового маркера на карту

        	console.log(data);
        	myMap.geoObjects.removeAll();//удаляет все маркеры с карты
           read_markers_all(myMap);
           $(".points_list").fadeIn(800);//возвращение панели с точками
 
  }});

     $(".wrap_coord_point").fadeOut();
    	$(".add_point").fadeIn();
    	$(".out_add_point").fadeOut();
    	myMap.events.remove('click', callback);

    	// очистка полей формы добавления
    	$('[name="lan"]').val('');
        $('[name="lng"]').val('');
        $('[name="name_point"]').val('');
        $('[name="price"]').val('');
        $('[name="description_point"]').val('');


    });//end .save

          $(".out_add_point").click(function(){ // выход из "добавить точку"  не оставив сохранений
       $(".points_list").fadeIn(800);    
    	$(".wrap_coord_point").fadeOut(800);
    	$(".add_point").fadeIn();
    	$(".out_add_point").fadeOut();
    	myMap.geoObjects.remove(plasemark);// удаляет маркер
    	myMap.events.remove('click', callback);
    });
    });//end add_point (ох, странно эта скобка стоит)
    

    $(".points_list").delegate("button.no_add_info", "click", function(){ // скрыть меню о добавлении инфо о цене и наличии--(клик по кресту закрытия) 
   
    $(this).closest(".wrap_add_comment_into_point").css("display","none");
     });

    $(".this_photo_map").click(function(){
       var current_deficit=$(".products_name>select option:selected").text();
      // res.geoObjects.get(0).geometry.getCoordinates()
       console.log(current_deficit);
       var lng=myMap.getCenter()[0];
       var lat=myMap.getCenter()[1];
       var zoom=myMap.getZoom();
       console.log("lng="+lng+" "+"lat="+lat+" zoom="+ zoom);
       console.log(location.href);
       var url_for_frend=location.href + "index.php?deficit="+current_deficit+"&lng="+lng+"&lat="+lat+"&zoom="+zoom;
       $("#input_photo_map_link").val();//предворительная очистка поля ввода 
       $("#input_photo_map_link").val(url_for_frend);


    });
    $(".copy_photo_map_link_to_buffer").click(function(){
      var copyText = document.getElementById("input_photo_map_link");
      copyText.select();
      document.execCommand("copy");
  
    });

    $(".points_list").delegate("button.edit_point","click",function(){
      console.log("будем редактировать");
      $(".wrap_edit_coord_point").fadeIn(800);
       var id_point = Number($(this).closest(".info_point").attr('id_point'));
        var lan= Number($(this).closest(".info_point").attr('lan'));
         $(".wrap_edit_coord_point").find('#lan_field').val(lan);
         var lng=Number($(this).closest(".info_point").attr('lng'));
           $(".wrap_edit_coord_point").find('#lng_field').val(lng);
          var name_this_point=$(this).closest(".info_point").find(".name_this_point").text();
            $(".wrap_edit_coord_point").find('#name_point_field').val(name_this_point);
        console.log('id_point='+id_point +"name_point="+name_this_point);


         //удаление выпадающего меню точки с комментариями покупок (надо будет это в функцию спрятать-- повтор кода!!!)
             opening_window_point=undefined;
      $(this).closest(".wrap_dropdown_info").removeAttr("style");
       $(this).closest(".info_point").removeClass("toggle_name_point_dropdown_on");

         var plasemark;// функция ГДЕ КЛИК- ТАМ и МАРКЕР
      var callback = function (e) {
          if (typeof plasemark != 'undefined') {
            myMap.geoObjects.remove(plasemark);// удаляет маркер
            }
        
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
             
          $('[id="lan_field"]').val(coords[0]);
           $('[id="lng_field"]').val(coords[1]);
           
           plasemark = new ymaps.Placemark([coords[0], coords[1]], {
            balloonContent: ' <strong>уточненная координата ПОИНТА</strong>'
        }, {
            preset: 'islands#redSportIcon',
            iconColor: '#ff05b6'
        });
            
            myMap.geoObjects.add(plasemark);
                
        }
        else {
            myMap.balloon.close();
        }

    myMap.setCenter([coords[0], coords[1]]);// перемещение  центра карты по координатам маркера

    };// end callback

         myMap.geoObjects.each(function(geoObject){
                              
                          if (geoObject.options.get('last_center')==1){
                               geoObject.options.set({'last_center':0});
                                geoObject.options.set({'iconColor': '#79c142'});// восстановление цвета маркера на прежний
                               // myMap.geoObjects.remove(geoObject); //убираем прежний маркер
                                 geoObject.options.set('visible', false);// делает маркер невидимым
                                 plasemark = new ymaps.Placemark([lan, lng], {
            balloonContent: ' <strong>уточненная координата ПОИНТА</strong>'
        }, {
            preset: 'islands#redSportIcon',
            iconColor: '#ff05b6'
        });
            
            myMap.geoObjects.add(plasemark);
                          }
                        
          
        });
         //end удаление выпадающего меню точки с комментариями покупок (надо будет это в функцию спрятать-- повтор кода!!!)
         $(".points_list").toggle();// скрытие меню с ТОЧКАМИ
         $(".wrap_button_point").toggle();// cкрытие кнопки ДОБАВИТЬ ТОЧКУ
         $(".wrap_this_photo_map").fadeOut();//скрытие "фото карты"

       
              
      myMap.events.add('click', callback);//myMap.events--где кликнешь- там и маркер
         //надо заменить маркер на  РЕДАКТИРУЕМЫЙ и добывить сохранение новых координат и названия в базу; 18.06
 $(".out_edit_coord_point").click(function(){// этот слушатель событий помещен внутрь слушателя button.edit.point, чтоб через plasemark удалить временный маркер
      $(".wrap_edit_coord_point").fadeOut(800);
      $(".points_list").fadeIn();
      $(".wrap_button_point").toggle();// появление кнопки ДОБАВИТЬ ТОЧКУ
       $(".wrap_this_photo_map").fadeIn();//возвращение "фото карты"
             myMap.geoObjects.each(function(geoObject){ //делает видимыми все маркеры
              if (!geoObject.options.get('visible')) {
               geoObject.options.set('visible', true);
              }
             myMap.geoObjects.remove(plasemark);// удаляет маркер
                                       
                                                                      
        });

    });//end out_edit_coord_point

           
     $(".save_edit_point").click(function(){ //save edit_point to mysql -(этот слушатель внутрь слушателя button.edit.point)
      
      var lan=$(".wrap_edit_coord_point").find('[id = "lan_field"]').val();
       var lng=$(".wrap_edit_coord_point").find('[id = "lng_field"]').val();//19.06 stop here
        var name_point=$(".wrap_edit_coord_point").find("#name_point_field").val();
         // var id_point = Number($(this).closest(".info_point").attr('id_point'));
         console.log("save data to mysql= "+name_point+ ' lan='+lan+ ' lng='+lng+ " id_point"+ id_point);
          
                    $.ajax({   // сохранение отредактированных данных поинта(название и координаты)
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'save_edit_marker',
              'lan': lan,
              'lng': lng,
              'name_point': name_point,
              'id_point': id_point
            },
           success: function(data){ 
                    $('.wrap_edit_coord_point').fadeOut();
                    $('.points_list').fadeIn(800);
                     $(".wrap_this_photo_map").fadeIn();//появление "фото карты"
                    myMap.geoObjects.removeAll();//удаляет все маркеры с карты
                    read_markers_all(myMap);

                               }
               });
         
     });
    });//end button.edit.point

 
        
        }//end init
   
function current_deficit_to_title(){
    var current_deficit=$(".products_name>select option:selected").text();
    $("title").text(current_deficit);//в title считывает дефиит из select
   }
function html_wrap_close_and_addinfo(){
   var note="";
            note+="<div class='wrap_close_and_addinfo'>";
            note+="<button type=\"button\" class=\"close_wrap_dropdown_info btn btn-success mr-1\"><i class=\"fa fa-times fa-lg\" aria-hidden=\"true\"></i></button>";
            note+="<button type='button' class='add_info btn btn-info' title='записать отзыв о покупке/наличии дефицита'><i class=\"fa fa-cart-plus fa-lg\" aria-hidden=\"true\"></i> куплено</button>";// кнопки добовления комментариев
            note+="<button type='button' class='btn btn-secondary edit_point'><i class=\"fa fa-cog fa-lg\" aria-hidden=\"true\"></i></button>";
            note+="<div class='wrap_add_comment_into_point'>";
            note+="<button type='button' class='no_add_info btn btn-danger'><i class=\"fa fa-times fa-lg\" aria-hidden=\"true\"></i> </button>";
            note+="<div>стоимость:<input type='text' name='price'></div><div>комментарий</div><textarea name='description_point'  cols='40' rows='4'></textarea><button type='button' class='btn btn-primary' id='save_comment_about_product'>сохранить</button></div>";
            note+="</div>";
  return note;
}
function html_wrap_note_this(value,last_add_purchase_descr='') {
  var note =  "<div class='wrap_note_this "+ last_add_purchase_descr +"' data-id_note='"+value['id_note']+"'><div class='note_this'>"+value['purchase_descr']
                + "</div><div class='data_note'>"+value['data_note']+"</div><div class='last_price'>"+value['params_value']+"р.</div>"+
                 "<div class='delete_this_note'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></div>"+"</div>" ;
  return note;
}
  function read_markers_all(myMap) {
       $(".points_list").empty();//очистка списка точек

        $.ajax({   // расстановка маркеров на карте
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'read_markers_sql',
               'hash': localStorage.getItem('user_hash'),
               'user_login': localStorage.getItem('user_login'),  
              'product': $(".products_name option:selected").text()},
           success: function(data){ 
            console.log('данные из базы'+data);
            if (data == "not autorization"){
               console.log("в нутри not autoriztion");
              $(".row_of_user").hide();
              $(".row_of_avtirization").show();
              $(".login_pass").show();
               return;
            }

            var all_markers = JSON.parse(data); 
            console.log(all_markers);
             var count=1;
            all_markers.forEach(function(value){
              var size = Object.keys(value).length;
        
           var note=html_wrap_close_and_addinfo();

            // последние 4-е элемента объекта id_point, lan,lng, name - все остальное ЗАМЕТКИ(purchase_descr)-- поэтому вычитаем 5
             for(var  i=(size-5);i >= 0;i--){
                note+= html_wrap_note_this(value[i]);
                
             
            // описание покупки для  показа в балоне маркера (описание покупки, время, цена)
             } 
             var balloon_last_purchase="<div class='wrap_note_this' data-id_note='"+value[size-5]['id_note']+"'><div class='note_this'>"+value[size-5].purchase_descr
                + "</div><div class='data_note'>"+value[size-5].data_note+"</div><div class='last_price'>"+value[size-5].params_value+"р.</div>"+
                 "</div>" ;// здесь может лучше еще маленькое фото поинта добавить 
             
            myMap.geoObjects.add(new ymaps.Placemark([Number(value.lan), Number(value.lng)], {
            iconContent: value[size-5].params_value,
            balloonContent: '<strong>'+ value.name+'</strong><br>'+ balloon_last_purchase   //содержимое балуна
        }, {
            preset: 'islands#icon',
            iconColor: '#79c142',// основной цвет маркеров
            id_point: value.id_point ,

        }));
            
              
            $('.points_list').append('<div class="info_point" lan='+value.lan +' lng='+ value.lng +' id_point='+value.id_point+'><span>'+count+'.</span>'+'<span class="name_this_point">'+value.name+'</span>'+
              '<span class="point_price" alt="последняя цена" style="display:none">'+value[size-5].params_value+'</span><div class="wrap_dropdown_info">'+note+'</div></div>');
            count++;
            });
            


           } // end success- расставляет все маркеры из базы
          
      });// end ajax - расстановки всех маркеров из базы
  }