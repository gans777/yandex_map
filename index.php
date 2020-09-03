<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>дефицит</title>
	
        <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=9c6493e9-1ae2-463f-9c8d-737e2f259b07" type="text/javascript"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
    <link rel="stylesheet" href="css/style.css?rnd=213">
</head>
<body>
	<div class="container">
   <div class="row row_of_avtirization">
    <div class="col">
  <button type="button" class="btn btn-primary registration">регистрация</button>
</div>
    <div class="col">
      <button type="button" class="btn btn-primary login_pass">авторизация</button>
    </div>
    
</div>
 <div class="row row_of_user">
  <div class="col">
      <div class="wrap_user_name">
      <button type="button" class="btn btn-primary user_login"></button>
      <button type="button" class="btn btn-link log_out">выход</button>
    </div>
    </div>
 </div> 
  </div>

	<div class="container row_of_user">
        <div class="wrap_header">
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
        <button type="button" class="d-none d-sm-block btn btn-secondary btn-lg add_new_deficit"><i class="fa fa-plus" aria-hidden="true"></i>
        <i class="fa fa-sitemap" aria-hidden="true"></i> новый дефицит
         </button>
         <button type="button" class="d-block d-sm-none btn btn-secondary btn add_new_deficit"><i class="fa fa-plus" aria-hidden="true"></i>
        <i class="fa fa-sitemap" aria-hidden="true"></i> новый дефицит
          </button>
        </div>
<div class="wrap_map">
	<div id="map" style="width: 94%; height: 300px;" <?php 
            /* ccылка для друга */
                if(isset($_GET['deficit'])){
                  echo "data-deficit=\"".$_GET['deficit']."\" data-center_lng=\"".$_GET['lng']."\" data-center_lat=\"".$_GET['lat']."\""." data-center_zoom=\"".$_GET['zoom']."\"";
                  
                }
   ?>>
		
	</div>
</div>
	<div class="points_list"><ul></ul></div>
	
	<div class="wrap_out_add_point">
		<div class="wrap_button_point">
<button type="button" class="btn btn-primary add_point" >
  Добавить точку
</button>
        </div>
        <div class="point_list"></div>
        	
        </div>
        <!--
        <div class="wrap_button_point">
<button type="button" class="btn btn-danger out_add_point" style="display: none;">выйти из режима "Добавления точки"</button>
         </div>
       -->
          <div class="wrap_coord_point" style="display: none;">
      
    <p><label for="lan_field">широта: </label> <input type="text" name="lan" id="lan_field"> <label for="lng_field"> долгота: </label><input type="text" name="lng" id="lng_field"></p>
          
          
          <p><label for="name_point_field">название точки:</label><input type="text" name="name_point" id="name_point_field"></p>
          <p><label for="price_field">стоимость: </label><input type="text" name="price_" id="price_field"></p>
          
  <p> <label for="description_point_field">комментарий:</label><br><textarea name="description_point_"  cols="40" rows="4" id="description_point_field"></textarea></p>

    <button type="button" class="btn btn-primary save">сохранить</button>
     <div class="wrap_out_add_point_x">
       <button type="button" class="btn btn-danger out_add_point mr-1 out_add_point"><i class="fa fa-times fa-lg" aria-hidden="true"></i></button>
     </div>
     <div class="help_info_for_users_add_point">
       Кликните на карте место торговой точки.
     </div>
  </div>

  <div class="wrap_edit_coord_point" style="display: none;">
      <p><label for="lan_field">широта: </label> <input type="text" name="lan" id="lan_field"> <label for="lng_field"> долгота: </label><input type="text" name="lng" id="lng_field"></p>
          
          
          <p><label for="name_point_field">название точки:</label><input type="text" name="name_point" id="name_point_field"></p>
          
          
  

    <button type="button" class="btn btn-primary save_edit_point">сохранить</button>
     <div class="wrap_out_add_point_x">
       <button type="button" class="btn btn-danger out_add_point mr-1 out_edit_coord_point"><i class="fa fa-times fa-lg" aria-hidden="true"></i></button>
     </div>
  </div>

  <!-- отправить данный вид карты другу -->
  <div class="wrap_this_photo_map"><input type="text" style="width:70%;" id="input_photo_map_link"><button type="button" class="btn btn-secondary copy_photo_map_link_to_buffer">скопировать в буфер</button><button type="button" class="btn btn-warning this_photo_map" >ссылка на данный вид карты</button></div>

</div><!--end class=container-->
	
	
	<!--html для модального окна для удаления note-->
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
<!-- Modal для создания новой категории/ДЕФИЦИТА -->
<div class="modal fade" id="add_new_deficit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">создание категории дефицита</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <form>
  <div class="form-group">
    <label for="exampleInputEmail1">название товара</label>
    <input type="text" class="form-control" id="input_name_deficit" aria-describedby="emailHelp">
    <small id="emailHelp" class="form-text text-muted">введите название наблюдаемого товара.</small>
  </div>
    
</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        <button type="button" class="btn btn-primary save_new_deficit">Сохранить</button>
      </div>
    </div>
  </div>
</div>
<!-- end.Modal для создания новой категории/ДЕФИЦИТА -->
<!--modal для удаления категории(товара-дефицит) при удалении последнего поинта-->
<div class="modal fade" id="delete_empty_deficit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="title_deleting_deficit">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Удалить товар <div class="badge badge-primary text-wrap name_deleting_category" style="font-size: 20px;"></div> ?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary delete_empty_deficit">Да-Удалить</button>
      </div>
    </div>
  </div>
</div>
<!--end.modal для удаления категории(товара-дефицит) при удалении последнего поинта-->
<!--скрытый html относящийся к авторизации -->
<!-- фома авторизации -->
<div class="avtoriz_form">
  Логин <input name="avtoriz_login" type="text" ><br>
Пароль <input name="avtoriz_password" type="password" ><br>
<div class="mess_from_log_pass"></div>
<button type="button" class="btn btn-secondary enter_log_pass">Войти</button>
</div>
<!-- end форма авторизации -->
  <!-- форма регистрации для авторизации -->
<div class="reg_form">
  <div class="system_tablo_mess"></div>
Логин <input name="reg_login" type="text" ><span></span><br>
Пароль <input name="reg_password" type="password" ><br>
<button name="submit"  class="btn btn-secondary reg_button">Зарегистрироваться</button>
</div>
<!--end форма регистрации для авторизации -->
<div class="reg_saved">сохранено</div>
<!-- end    скрытый html относящийся к авторизации -->
	<script src="https://code.jquery.com/jquery-3.1.1.min.js">
 <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="https://use.fontawesome.com/819122889b.js"></script>
<!--<script src="http://code.jquery.com/mobile/1.0a1/jquery.mobile-1.0a1.min.js"></script>-->


	<script src="index.js"></script>
</body>
</html>