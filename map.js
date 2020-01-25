
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


        
        var plasemark = new ymaps.Placemark([47.2313455, 39.7232855]);
        myMap.geoObjects.add(plasemark);
        
     // Слушаем клик на карте.
     /*
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        console.log("широта клика="+coords[0]+", "+"долгота клика="+coords[1]); });
*/
/*
      myMap.events.add('click', function (e) {
        
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            myMap.balloon.open(coords, {
                contentHeader:'Событие!',
                contentBody:'<p>Кто-то щелкнул по карте.</p>' +
                    '<p>Координаты щелчка: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                    ].join(', ') + '</p>',
                contentFooter:'<sup>Щелкните еще раз</sup><br>'
            });
           
          
           
            
            myMap.geoObjects       
        .add(new ymaps.Placemark([coords[0], coords[1]], {
            balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        }));
           
        
        }
        else {
            myMap.balloon.close();
        }
    });
  */      

   
    }//end
    