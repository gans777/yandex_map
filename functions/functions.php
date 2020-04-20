<?php
function MysqliFetchAll($res){
             $result=array();
             while ($row = mysqli_fetch_assoc($res)) {
              $result[]=$row;
     }
               return $result;
 }

function print_arr($arr){
	echo "<pre>".print_r($arr,true)."</pre>";
}
?>