ymaps.ready(init);



function init(){ 
        // Создание карты.  
        
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [47.2313455, 39.7232855],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 13
        },{balloonMaxWidth: 200,
           searchControlProvider: 'yandex#search'
        });
        
        
      $.ajax({
      	type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'read_markers'},
           success: function(data){ 
            var all_markers = JSON.parse(data);
            all_markers.forEach(function(value){
           	var arr_about_this_point = value.split('||');
           	$(".point_list").append("<div class='one_point' lat='"+arr_about_this_point[0]+"' lng='"+arr_about_this_point[1]+"''>" +arr_about_this_point[2] + "</div>");
           	myMap.geoObjects.add(new ymaps.Placemark([Number(arr_about_this_point[0]), Number(arr_about_this_point[1])], {
            balloonContent: '<strong>'+ arr_about_this_point[2]+'</strong><br>'+arr_about_this_point[3]
        }, {
            preset: 'islands#icon',
            iconColor: '#34c72a'
        }));
           	//остановился здесь 11.08  
           	
           	
           
           });

           } // end - рассставляет все маркеры из базы
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
        var description_point=$('[name="description_point"]').val();
       // var unic_name = $('[name="unic_name"]').val();
        var lan = $('[name="lan"]').val();
        var lng = $('[name="lng"]').val();
        console.log(name_point+ ' ' +  description_point);

        if ((name_point == '')||(description_point == '')) { 
            console.log('не все поля заполнены');
            return;
    }
   
      
      $.ajax({
        type:'post',
        url:'ajax/ajaxrequest.php',
          data:{'label':'save_new_marker',
                  'name_point': name_point,
                  'description_point': description_point,
                  'lan':lan,
                  'lng':lng
       },
        success: function(data){  // добавление нового маркера на карту
        	myMap.geoObjects.removeAll();//удаляет все маркеры с карты
        	/*
          //console.log('тут данные сохраненной точки='+data);
             	var arr_about_this_point = data.split('||');
                    
         // myMap.geoObjects.remove(plasemark);
                  console.log(arr_about_this_point[0] +'--'+ arr_about_this_point[1]);
                  plasemark = new ymaps.Placemark([arr_about_this_point[0], arr_about_this_point[1]], {
            balloonContent: '<strong>'+ arr_about_this_point[2]+'</strong><br>'+arr_about_this_point[3]
        }, {
            preset: 'islands#icon',
            iconColor: '#fd1c10'
        });
             myMap.geoObjects.add(plasemark);
           */
          $.ajax({
      	type:'post',
        url:'ajax/ajaxrequest.php',
        data:{'label':'read_markers'},
           success: function(data){ 
            var all_markers = JSON.parse(data);
            all_markers.forEach(function(value){
           	var arr_about_this_point = value.split('||');
           	myMap.geoObjects.add(new ymaps.Placemark([Number(arr_about_this_point[0]), Number(arr_about_this_point[1])], {
            balloonContent: '<strong>'+ arr_about_this_point[2]+'</strong><br>'+arr_about_this_point[3]
        }, {
            preset: 'islands#icon',
            iconColor: '#34c72a'
        }))
           });

           } // end - рассставляет все маркеры из базы
      });// ajax запрос по расстановке маркеров

  }
});
     $(".wrap_coord_point").fadeOut(800);
    	$(".add_point").fadeIn();
    	$(".out_add_point").fadeOut();
    	myMap.events.remove('click', callback);

    	// очистка полей формы добавления
    	$('[name="lan"]').val('');
        $('[name="lng"]').val('');
        $('[name="name_point"]').val('');
        $('[name="description_point"]').val('');


    });//end .save

          $(".out_add_point").click(function(){ // выход из "добавить точку"  не оставив сохранений
    	$(".wrap_coord_point").fadeOut(800);
    	$(".add_point").fadeIn();
    	$(".out_add_point").fadeOut();
    	myMap.geoObjects.remove(plasemark);// удаляет маркер
    	myMap.events.remove('click', callback);
    });
    });//end add_point
    
        }//end init
   

  