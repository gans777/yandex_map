<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>чтение маркеров в данной категории</title>
	
        <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=9c6493e9-1ae2-463f-9c8d-737e2f259b07" type="text/javascript"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
    <link rel="stylesheet" href="css/style.css?rnd=211">
</head>
<body>
	<i class="fa fa-times-circle-o" aria-hidden="true"></i>

	<div class="container">

		<div class="wrap_products_name">
		<div class="products_name">товар:
			<?php
               include 'functions/connect.php';
               include 'functions/functions.php';
               include 'functions/create_tables.php';// это проверить!!!!!!
               $sql = "SELECT name_of_product FROM deficit_products";
               $res = mysqli_query($link,$sql);
               $all_products = MysqliFetchAll($res);
               echo "<select>";
                foreach ($all_products as  $value) {
                	echo "<option>".$value['name_of_product']."</option>".PHP_EOL;
                }
                echo "</select>";
			 ?>
		
        </div>
        </div>
<div class="wrap_map">
	<div id="map" style="width: 90%; height: 300px">
		
	</div>
	<div class="points_list"><ul></ul></div>
	</div>
	<div class="wrap_out_add_point">
		<div class="wrap_button_point">
<button type="button" class="btn btn-primary add_point" >
  Добавить точку
</button>
        </div>
        <div class="point_list"></div>
        	
        </div>
        <div class="wrap_button_point">
<button type="button" class="btn btn-danger out_add_point" style="display: none;">выйти из режима "Добавления точки"</button>
         </div>
</div>
	<div class="wrap_coord_point" style="display: none;">
		
		<div>широта: <input type="text" name="lan"> долгота:<input type="text" name="lng"></div>
          
          
          <div>название точки:<input type="text" name="name_point"></div>
          <div>стоимость:<input type="text" name="price_"></div>
          
		<div>комментарий</div><textarea name="description_point_"  cols="40" rows="4"></textarea>

		<button type="button" class="btn btn-primary save">сохранить</button>
	</div>
	</div>
	<!--html для модального окна-->
	<div class="modal fade" id="delete_note" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Удалить этот отзыв?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body delete_wrap_note_this">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Нет</button>
        <button type="button" class="btn btn-primary delete_note_on">Удалить</button>
      </div>
    </div>
  </div>
</div>
<!-- end html для модального окна --> 
	<script src="https://code.jquery.com/jquery-3.1.1.min.js">
 <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="https://use.fontawesome.com/819122889b.js"></script>

	<script src="index.js"></script>
</body>
</html>