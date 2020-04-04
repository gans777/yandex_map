ymaps.ready(init);
//
function init(){

      $( ".products_name" ).change(function() { // по какому товару карту выводить
       console.log( $(".products_name option:selected").text());
      myMap.geoObjects.removeAll();
       
         read_markers_all(myMap);
  });
        // Создание карты.  
         var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [47.2313455, 39.7232855],
            zoom: 12
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
        myMap.setCenter(result.geoObjects.get(0).geometry.getCoordinates());
        // var lan=result.geoObjects.get(0).geometry.getCoordinates()[0];// так брать координаты
    
        myMap.setZoom(12);
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
        myMap.setCenter(result.geoObjects.get(0).geometry.getCoordinates());
        myMap.setZoom(12);
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
      if (e.target.tagName != 'DIV' ) { return;}
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
 //$("[id_point='"+id_point+"']").find("button.add_info").toggle();// показывает/скрывает кнопку "добавить инфо о цене"
  //$("[id_point='"+id_point+"']").find("button.no_add_info").toggle();
 });


  $(".points_list").delegate("#save_comment_about_product", "click", function(){// сохранение цены и комментария о ПОСЛЕДНЕЙ покупке  в выбранном Поинте
 console.log('сохранение цены и комментария о покупке');

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
$(".points_list").delegate(".delete_this_note", "click", function(){// удаление записи
  console.log('клик по корзине');// stop here 04.04
});

// добавление новой точки в текущем товаре
    $(".add_point").click(function(){
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
 
  }});

     $(".wrap_coord_point").fadeOut(800);
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
        
        }//end init
   
function html_wrap_close_and_addinfo(){
   var note="";
            note+="<div class='wrap_close_and_addinfo'>";
            note+="<button type=\"button\" class=\"close_wrap_dropdown_info btn btn-success mr-1\"><i class=\"fa fa-times fa-lg\" aria-hidden=\"true\"></i></button>";
            note+="<button type='button' class='add_info btn btn-info' title='записать отзыв о покупке/наличии дефицита'><i class=\"fa fa-cart-plus fa-lg\" aria-hidden=\"true\"></i> наличие</button>";// кнопки добовления комментариев
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
              'product': $(".products_name option:selected").text()},
           success: function(data){ 
            console.log('данные из базы'+data);
            var all_markers = JSON.parse(data);
            console.log(all_markers);
             var count=1;
            all_markers.forEach(function(value){
              var size = Object.keys(value).length;
        
           var note=html_wrap_close_and_addinfo();

            // последние 4-е элемента объекта id_point, lan,lng, name - все остальное ЗАМЕТКИ(purchase_descr)-- поэтому вычитаем 5
             for(var  i=(size-5);i >= 0;i--){
                note+= html_wrap_note_this(value[i]);
                /*
                note+= "<div class='wrap_note_this' data-id_note='"+value[i]['id_note']+"'><div class='note_this'>"+value[i]['purchase_descr']
                + "</div><div class='data_note'>"+value[i]['data_note']+"</div><div class='last_price'>"+value[i]['price']+"р.</div>"+
                 "<div class='delete_this_note'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></div>"+"</div>" ;
                */
            // описание покупки для  показа в балоне маркера (описание покупки, время, цена)
             } 
             var balloon_last_purchase="<div class='wrap_note_this' data-id_note='"+value[size-5]['id_note']+"'><div class='note_this'>"+value[size-5].purchase_descr
                + "</div><div class='data_note'>"+value[size-5].data_note+"</div><div class='last_price'>"+value[size-5].params_value+"р.</div>"+
                 "</div>" ;// здесь может лучше еще маленькое фото поинта добавить 
             
            myMap.geoObjects.add(new ymaps.Placemark([Number(value.lan), Number(value.lng)], {
            balloonContent: '<strong>'+ value.name+'</strong><br>'+ balloon_last_purchase   //содержимое балуна
        }, {
            preset: 'islands#icon',
            iconColor: '#79c142',// основной цвет маркеров
            id_point: value.id_point 
        }));
            
              
            $('.points_list').append('<div class="info_point" lan='+value.lan +' lng='+ value.lng +' id_point='+value.id_point+'><span>'+count+'.</span>'+value.name+
              '<span class="point_price" alt="последняя цена">'+value[size-5].params_value+'р.</span><div class="wrap_dropdown_info">'+note+'</div></div>');
            count++;
            });
            


           } // end success- расставляет все маркеры из базы
          
      });// end ajax - расстановки всех маркеров из базы
  }