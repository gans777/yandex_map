<?php

//echo $info_one_marker = mb_convert_encoding($info_one_marker, 'UTF-8');
  $dir ="points";
  $category="drugs";

  $file = file("$dir/$category.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

 echo json_encode($file);

/*
echo '<pre>';
  print_r($file);
 echo '</pre>'; 
  */  
?>