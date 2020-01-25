
    // Функция ymaps.ready() будет вызвана, когда
    // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    ymaps.ready(init);
    
    function init(){ 
        // Создание карты.  
        var  myPlacemark; 
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
        /*
        var plasemark = new ymaps.Placemark([47.2313455, 39.7232855]);
        myMap.geoObjects.add(plasemark);
        */
     // Слушаем клик на карте.
   
      var plasemark;
      myMap.events.add('click', function (e) {
        console.log(typeof plasemark);
        if (typeof plasemark != 'undefined') {
            console.log(' в этой переменной   маркер');
           myMap.geoObjects.remove(plasemark);// удаляет маркер
            }
        //map.removeAllOverlays(Placemark);
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
         
          $('[name="lan"]').val(coords[0]);
           $('[name="lng"]').val(coords[1]);
           
           plasemark = new ymaps.Placemark([coords[0], coords[1]], {
            balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        });
            
            myMap.geoObjects.add(plasemark);
                
        }
        else {
            myMap.balloon.close();
        }

    myMap.setCenter([coords[0], coords[1]]);// перемещение  центра карты по координатам маркера

    });//myMap.events
       

    $('.save').click(function(){
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
                  //'unic_name': unic_name,
                  'name_point': name_point,
                  'description_point': description_point,
                  'lan':lan,
                  'lng':lng
       },
        success: function(data){
          console.log(data);
  }
});

    });
   
    }//end 
    