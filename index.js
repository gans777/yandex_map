ymaps.ready(init);

function init(){ 
      $( ".products_name" ).change(function() {
       console.log( $(".products_name option:selected").text());
  });
        // Создание карты.  
        
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [47.2313455, 39.7232855],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 12
        },{balloonMaxWidth: 250,
           searchControlProvider: 'yandex#search'
        });
     
        var balloon = null;

    myMap.geoObjects.events.add('click', function (e) { // при клике по баллону поинт меняет цвет
    
    // Получение ссылки на дочерний объект, на котором произошло событие.
    var object = e.get('target');
    var lan=e.get('target').geometry.getCoordinates()[0];
    var lng = e.get('target').geometry.getCoordinates()[1];
    $(".info_point_on").removeClass("info_point_on");
    $('[lan="'+lan+'"][lng="'+lng+'"]').addClass("info_point_on");

  
   //console.log('data='+e.get('target').geometry.Point().id_point); // как id_point считать из объекта???
});
      $.ajax({
      	type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'read_markers_sql'},
           success: function(data){ 
           	console.log('данные из базы'+data);
            var all_markers = JSON.parse(data);
            console.log(all_markers);
             var count=1;
            all_markers.forEach(function(value){
            	var size = Object.keys(value).length;
            console.log("длина массива="+ size);
            var note="";
            note+="<button type='button' class='add_info btn btn-info'>Добавить инфо о цене.</button>";// добавка кнопки добовления комментариев
            note+="<button type='button' class='no_add_info btn btn-danger' style='display: none;'>скрыть это </button>";
            note+="<div class='wrap_add_comment_into_point'><div>стоимость:<input type='text' name='price'></div><div>комментарий</div><textarea name='description_point'  cols='40' rows='4'></textarea><button type='button' class='btn btn-primary' id='save_comment_about_product'>сохранить</button></div>";
        
            // последние 4-е элемента объекта id_point, lan,lng, name - все остальное ЗАМЕТКИ(purchase_descr)-- поэтому вычитаем 5
             for(var  i=(size-5);i >= 0;i--){
            
                note+= "<div class='wrap_note_this'><div class='note_this'>"+value[i].purchase_descr
                + "</div><div class='data_note'>"+value[i].data_note+"</div><div class='last_price'>"+value[i].price+"р.</div>"+
                 "</div>" ;
                
            // описание покупки для  показа в балоне маркера (описание покупки, время, цена)
             }
             
            myMap.geoObjects.add(new ymaps.Placemark([Number(value.lan), Number(value.lng)], {
            balloonContent: '<strong>'+ value.name+'</strong><br>'+ note
        }, {
            preset: 'islands#icon',
            iconColor: '#34c72a'
        },{
          id_point: value.id_point 
        }));
            
            $('.points_list').append('<div class="info_point" lan='+value.lan +' lng='+ value.lng +' id_point='+value.id_point+'><span>'+count+'.</span>'+value.name+
              '<span class="point_price" alt="последняя цена">'+value[size-5].price+'р.</span><div class="wrap_dropdown_info">'+note+'</div></div>');
            count++;
            });
            


           } // end - расставляет все маркеры из базы
          
      });

    var last_click;
    $(".points_list").delegate("div", "click", function(){ // Клик по названию Поинта- и выпадает меню с отзывами о покупках

      if (last_click != undefined) {
       last_click.toggle();//скрывает или показывает выбранные элемент
       last_click.closest(".info_point").toggleClass("toggle_name_point_dropdown_on");

      }
      last_click=$(this).children(".wrap_dropdown_info");
      last_click.toggle();
      last_click.closest(".info_point").toggleClass("toggle_name_point_dropdown_on");
      
     // myMap.setCenter([45.0701, 37.0048]);
     var lan=Number($(this).attr('lan')); var lng=Number($(this).attr('lng'));//Данный Поинт оказывается в центре карты 
       myMap.setCenter([lan,lng]);
    });

//добавить комментарий о наличии и цене товара в поинте
  $(".points_list").delegate("button.add_info", "click", function(){ 
      var id_point=$(this).parent().parent().attr("id_point");
console.log("id_point= "+ id_point);//номер id поинта

$("[id_point='"+id_point+"']").find(".wrap_add_comment_into_point").toggle();// показвает/скрывает меню добавления комментария
$("[id_point='"+id_point+"']").find("button.add_info").toggle();// показывает/скрывает кнопку "добавить инфо о цене"
$("[id_point='"+id_point+"']").find("button.no_add_info").toggle();// ох,странно- событие не ставил на эту кнопку "скрыть", а работает как надо
 });

  $(".points_list").delegate("#save_comment_about_product", "click", function(){// сохранение цены и комментария о ПОСЛЕДНЕЙ покупке  в выбранном Поинте
 console.log('сохранение цены и комментария о покупке');

 var id_point=$(this).parent().parent().parent().attr("id_point");
 console.log("мой id_point="+id_point);
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
               
               
            var note="";
            //note+="<button type='button' class='add_info btn btn-info'>Добавить инфо о цене.</button>";// добавка кнопки добовления комментариев(может стоить убрать этот "Добавить инфо о цене.")
            note+="<button type='button' class='no_add_info btn btn-danger' style='display: none;'>скрыть это </button>";
            note+="<div class='wrap_add_comment_into_point'><div>стоимость:<input type='text' name='price'></div><div>комментарий</div><textarea name='description_point'  cols='40' rows='4'></textarea><button type='button' class='btn btn-primary' id='save_comment_about_product'>сохранить</button></div>";
               
                for (var i=data_object.length-1; i>=0; i--){
                  
                  if (i==data_object.length-1) {
                    note+= "<div class='wrap_note_this bg-success' ><div class='note_this'>"+data_object[i]['purchase_descr']
                  
                + "</div><div class='data_note'>"+data_object[i]['data_note']+"</div><div class='last_price'>"+data_object[i]['params_value']+"р.</div>"+
                 "</div>" ;
                 $("[id_point='"+id_point+"']").find(".point_price").html(data_object[i]['params_value']+"р.");
                  } else {
                    note+= "<div class='wrap_note_this'><div class='note_this'>"+data_object[i]['purchase_descr']
                                    
                + "</div><div class='data_note'>"+data_object[i]['data_note']+"</div><div class='last_price'>"+data_object[i]['params_value']+"р.</div>"+
                 "</div>" ;}
                
                }// 
       
              this_target.append(note);    


           } // 
          
      });

  });


    $(".add_point").click(function(){
    	$(".wrap_coord_point").fadeIn(800);
    	$(".out_add_point").fadeIn(800);
    	$(".add_point").fadeOut();
    	var plasemark;
    	var callback = function (e) {
        
        if (typeof plasemark != 'undefined') {
            console.log(' в этой переменной   маркер');
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
                  'product_price':product_price
       },
        success: function(data){  // добавление нового маркера на карту

        	console.log(data);
        	myMap.geoObjects.removeAll();//удаляет все маркеры с карты
        
           $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'read_markers_sql'},
           success: function(data){ 
            console.log('данные из базы'+data);
            var all_markers = JSON.parse(data);
            console.log(all_markers);
            all_markers.forEach(function(value){
              var size = Object.keys(value).length;
            console.log("длина массива="+ size);
            var note="";
            // последние 4-е элемента объекта id_point, lan,lng, name - все остальное ЗАМЕТКИ-- поэтому вычитаем 5
             for(var  i=(size-5);i >= 0;i--){
            
                note+= "<div class='wrap_note_this'><div class='note_this'>"+value[i].purchase_descr+ "</div><div class='data_note'>"+value[i].data_note+"</div><div class='last_price'>цена="+value[i].price+"</div></div>" ;
             }

            myMap.geoObjects.add(new ymaps.Placemark([Number(value.lan), Number(value.lng)], {
            balloonContent: '<strong>'+ value.name+'</strong><br>'+ note
        }, {
            preset: 'islands#icon',
            iconColor: '#34c72a'
        }));
            });
          /* написание маркеров в управляющем списке */


           } // end - рассставляет все маркеры из базы
          
      });

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
    
    $(".points_list").delegate("button.no_add_info", "click", function(){
console.log('должно скрыть');
    $(".wrap_add_comment_into_point").toggle();
    $("button.no_add_info").toggle();
    $("button.add_info").toggle();

     });
        
        }//end init
   

  