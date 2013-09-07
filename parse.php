<?php

$filename_replace = array('\\', '/', '*', '|', '?', '<', '>', '"', ':');
$maximum_matching = 10;

$matching_start = '<div class="matching_section">';
$matching_seta_start = '<ul id="set_a">';
$matching_setb_start = '<ul id="set_b">';
$matching_sets_end = '</ul>';
$matching_end = '</div>
	  <div class="single_column cards_section">
	   <button id="exit" class="return_to_home full_button" onclick="">Exit</button>
	  </div>';
	  
/**END MATCH**/
	  
$tile_start = '<div class="tile_section"><ul id="card_tiles">';
$tile_end = '</ul></div>';
$tile_bottom = '
	  <div class="single_column cards_section">
	   <button id="exit" class="return_to_home full_button">Exit</button>
	  </div>';
	  
/**END TILE**/
	  
$choice_start = '<div class="single_column answer_section"><div id="mc_answer">';
$choice_start_bottom = '</div>
	  </div>';
$choice_end = '<div class="single_column choice_section"><ul id="mc_choices">
	    <li></li>
		<li></li>
		<li></li>
	   </ul>';
$choice_end_bottom = '<button id="next" class="full_button" action="start">Start</button>
	   <button id="exit" class="return_to_home full_button">Exit</button>
	  </div>';
	  
/**END CHOICE**/
	  
$classic_start = '<div class="single_column cards_section">
	   <div id="qa_cards" class="classic_box">
	    <ul>
		 <li id="question"></li>
		 <li id="answer"></li>
		</ul>
	   </div>
	   <button id="next" class="full_button" action="start">Start</button>
	  </div>
	  <div class="single_column score_section">
	   <div id="tools" class="classic_box">
	    <div id="progress_bar">
		 <div id="current_progress">
		  <div id="right_progress"></div>
		  <div id="wrong_progress"></div>
		 </div>
		</div>
	   </div>
	   <button id="correct" class="half_button right_half">Correct</button>
	   <button id="wrong" class="half_button">Wrong</button>
	   <button id="exit" class="return_to_home full_button">Exit</button>';
$classic_end = '</div>';

function check_title_file(){
 if(file_exists('title_file.txt') === false){
  $titles_project = fopen('title_file.txt', "w");
  if($titles_project){
   fclose($titles_project);
  }else{
   exit;
  }
 }
}

function init($filename){
 $titles_file = file_get_contents($filename.'.txt');
 if($titles_file === false){
  return false;
 }else{
  $titles_series = explode("||", $titles_file);
  return array_filter($titles_series);
 }
}

function valid_filename($filename){
 global $filename_replace;
 return str_replace($filename_replace, '', $filename);
}

function break_apart_cards($array_of_cards){
 $cards_array = array();
 if(count($array_of_cards)){
  foreach($array_of_cards as $single_set){
   $q_and_a = explode("::", $single_set);
   $cards_array['question'][] = $q_and_a[0];
   $cards_array['answer'][] = $q_and_a[1];
  }
 }
 return $cards_array;
}

function generate_random_different_num($min, $max){
 if(func_num_args() > 2){
  $not_equal_to = func_get_arg(2);
  $random = rand($min, $max);
  if(in_array($random, $not_equal_to, TRUE)){
   return generate_random_different_num($min, $max, $not_equal_to);
  }else{
   return $random;
  }
 }else{
  return rand($min, $max);
 }
}

check_title_file();

if(isset($_GET['project_title']) === true && isset($_GET['action']) === true){
 $project_title = $_GET['project_title'];
 $project_titles = init('title_file');
 
 if($project_titles === false){
  
 }else{
  //check for creating new project
  if($_GET['action'] == 'add'){
   $project_result;
   if(empty($project_title) === true || strlen($project_title) > 30){
    $project_result = 'The project title must be 1-30 characters long. <a href="index.html">Try again.</a>';
   }elseif(in_array(strtolower($project_title), array_map('strtolower', $project_titles)) === true){
    $project_result = 'That project title already exists. <a href="index.html">Try again.</a>';
   }else{  
    $new_project_filename = valid_filename($project_title);
    $new_project = fopen($new_project_filename.'.txt', "w");
    fclose($new_project);
    $new_project_file = file_put_contents('title_file.txt', $new_project_filename.'||', FILE_APPEND);
    if ($new_project_file === FALSE){
     $project_result = 'There was an error trying to create the project. <a href="index.html">Try again.</a>';
    }else{
     $project_result = '<h4>'.$project_title.'</h4>';
    }
   }
   echo $project_result;
  //check for deleting projects
  }elseif($_GET['action'] == 'delete'){
   $project_titles_str = file_get_contents('title_file.txt');
   //delete from title_file.txt
   if($project_titles_str){
	$newtitles_content = str_replace($project_title.'||', '', $project_titles_str);
	$new_project_file = file_put_contents('title_file.txt', $newtitles_content);
	if($new_project_file){
    //delete the file
	 $del_file = unlink($project_title.'.txt');
	 if($del_file){
	  $total_proj = init('title_file');
	  if($total_proj === false){
	  
	  }else{
	   if(count($total_proj) > 0){
	    foreach($total_proj as $position=>$title){
		 if(strlen($title) > 0){
		  echo '<li class="project_title"><input type="radio" onclick="enableButtons(\'projects_page\', \'projects_disabled\')" name="project_title" value="'.$title.'" id="item_'.$position.'"/><label for="item_'.$position.'">'.$title.'</label></li>';
		 }
		}
	   }else{
		echo '<li class="nothing">You currently have no projects.</li>';
	   }
	  }
	 }else{
	  echo 'There was an error trying to create the project. <a href="index.html">Try again.</a>';
	 }
	}else{
	 echo 'There was an error trying to create the project. <a href="index.html">Try again.</a>';
	}
   }
  }elseif($_GET['action'] == 'check' && isset($_GET['mode']) === true){
   $mode = $_GET['mode'];
   if(in_array($project_title, $project_titles)){
    $project_contents =  init($project_title);
	//shuffle cards first
	shuffle($project_contents);
	$cards_contents = break_apart_cards($project_contents);
	$min = 0;
	if(count($cards_contents)){
     if($mode == 'matching'){
	  //echo $matching_start;
	  $matching_seta_middle = '';
	  $matching_setb_middle = '';
	  for($i = count($cards_contents['question']); $i > 0; $i--){
	   $max = count($cards_contents['question']) - 1;
	   $random_number_a = generate_random_different_num($min, $max);
	   $random_number_b = generate_random_different_num($min, $max);
	   $matching_seta_middle .= '<li class="individual_card q_card"><div>'.$cards_contents['question'][$random_number_a].'</div></li>';
	   $matching_setb_middle .= '<li class="individual_card a_card"><div>'.$cards_contents['answer'][$random_number_b].'</div></li>';
	   
	   unset($cards_contents['question'][$random_number_a]);
	   unset($cards_contents['answer'][$random_number_b]);
	   $cards_contents['question'] = array_values($cards_contents['question']);
	   $cards_contents['answer'] = array_values($cards_contents['answer']);
	  }
	  echo $matching_start;
	  echo $matching_seta_start;
	  echo $matching_seta_middle;
	  echo $matching_sets_end;
	  echo $matching_setb_start;
	  echo $matching_setb_middle;
	  echo $matching_sets_end;
	  echo $matching_end;
	 }elseif($mode == 'tile'){
	  $tile_middle = '';
	  $merge_q_a = array_merge($cards_contents['question'], $cards_contents['answer']);
	  for($i = count($merge_q_a); $i > 0; $i--){
	   $max = count($merge_q_a) - 1;
	   $random_number = generate_random_different_num($min, $max);
	   $tile_middle .= '<li class="individual_card"><div>'.$merge_q_a[$random_number].'</div></li>';
	   
	   unset($merge_q_a[$random_number]);
	   $merge_q_a = array_values($merge_q_a);
	  }
	  
	  echo $tile_start;
	  echo $tile_middle;
	  echo $tile_end;
	  echo $tile_bottom;
	 }elseif($mode == 'choice'){
	  echo $choice_start;
	  if(count($cards_contents['answer']) >= 3){
	   $choices = '';
	   
	   foreach($cards_contents['question'] as $index=>$content){
	    $max = count($cards_contents['answer']) - 1;
	    $different = array($index);
	    $random_1 = generate_random_different_num($min, $max, $different);
	    $different_2 = array($index, $random_1);
	    $random_2 = generate_random_different_num($min, $max, $different_2);
	   
	    $three_random_choices = array($cards_contents['answer'][$index], $cards_contents['answer'][$random_1], $cards_contents['answer'][$random_2]);
	    shuffle($three_random_choices);
	    $choices .= '<input type="hidden" class="hidden_cards" question="'.$content.'" choices="'.implode('::', $three_random_choices).'"/>';
	   }
	   echo $choices;
	  }else{
	   echo '<span class="not_enough">You do not have enough cards in this project.</span>';
	  }
	  echo $choice_start_bottom;
	  echo $choice_end;
	  echo $choice_end_bottom;
	 }else{
	  //last one
	  $classic_middle = '';
	  
	  foreach($cards_contents['question'] as $index=>$content){
	   $classic_middle .= '<input type="hidden" class="hidden_cards" question="'.$content.'"/>';
	  }
	  
	  echo $classic_start;
	  echo $classic_middle;
	  echo $classic_end;
	 }
	}else{
	 echo 'There are no cards yet in '.$project_title.'. <a href="index.html">Go back</a> and add to your project.';
	}
   }else{
    echo 'You have no project named '.$project_title;
   }
  }
 }
}elseif(isset($_GET['card_title']) === true && empty($_GET['card_title']) === false && isset($_GET['card_question']) === true && empty($_GET['card_question']) === false && isset($_GET['card_answer']) === true && empty($_GET['card_answer']) === false && isset($_GET['action']) === true){
 //check for creating new cards
 if($_GET['action'] == 'add'){
  $card_title = $_GET['card_title'];
  $card_question = $_GET['card_question'];
  $card_answer = $_GET['card_answer'];
  $action_result = file_put_contents($card_title.'.txt', $card_question.'::'.$card_answer.'||', FILE_APPEND);
  if ($action_result === FALSE){
   //output error message
   echo 'Error';
  }else{
   //output new card
   $new_cardslist = init($card_title);
   if(count($new_cardslist) > 0){
    foreach($new_cardslist as $position=>$title){
	 if(strlen($title) > 0){
	  $question = substr($title, 0, strpos($title, '::'));
	  $answer = substr($title, strpos($title, '::') + 2, strlen($title));
	  if(isset($_GET['new']) === true){
	   echo '<li>Q:'.$question.'<hr/>A:'.$answer.'</li>';
	  }else{
	   echo '<li class="project_cards" id="qa_'.$position.'"><input type="radio" name="card_number" value="qa_'.$position.'" onclick="chooseCard(\'qa_'.$position.'\')"/>Q:<textarea class="question_text projects_disabled" disabled>'.$question.'</textarea><hr/>A:<textarea class="answer_text projects_disabled" disabled>'.$answer.'</textarea></li>';
      }
     }
    }
   }else{
    echo '<li class="nothing">You currently have no projects.</li>';
   }
  }
  
 //check for editing cards
 }elseif($_GET['action'] == 'edit' && isset($_GET['prev']) === true && empty($_GET['prev']) === false){
  $card_title = $_GET['card_title'];
  $previous_line = $_GET['prev'];
  $new_question = $_GET['card_question'];
  $new_answer = $_GET['card_answer'];
  
  $prev_content = file_get_contents($card_title.'.txt');
  
  $new_content = str_replace($previous_line, $new_question.'::'.$new_answer, $prev_content);
  $action_result = file_put_contents($card_title.'.txt', $new_content);
  
  
  if ($action_result === FALSE){
   //output error message
   echo 'Error';
  }else{
   //output new card
   $new_cardslist = init($card_title);
   if(count($new_cardslist) > 0){
    foreach($new_cardslist as $position=>$title){
	 if(strlen($title) > 0){
      $question = substr($title, 0, strpos($title, '::'));
	  $answer = substr($title, strpos($title, '::') + 2, strlen($title));
      echo '<li class="project_cards" id="qa_'.$position.'"><input type="radio" name="card_number" value="qa_'.$position.'" onclick="chooseCard(\'qa_'.$position.'\')"/>Q:<textarea class="question_text projects_disabled" disabled>'.$question.'</textarea><hr/>A:<textarea class="answer_text projects_disabled" disabled>'.$answer.'</textarea></li>';
     }
    }
   }else{
    echo '<li class="nothing">You currently have no projects.</li>';
   }
  }
 //check for deleting cards
 }elseif($_GET['action'] == 'delete'){
  $card_title = $_GET['card_title'];
  $del_question = $_GET['card_question'];
  $del_answer = $_GET['card_answer'];
  
  $prev_content = file_get_contents($card_title.'.txt');
  
  $new_content = str_replace($del_question.'::'.$del_answer.'||', '', $prev_content);
  $action_result = file_put_contents($card_title.'.txt', $new_content);
  
  if ($action_result === FALSE){
   //output error message
   echo 'Error';
  }else{
   //output new card
   $new_cardslist = init($card_title);
   if(count($new_cardslist) > 0){
    foreach($new_cardslist as $position=>$title){
	 if(strlen($title) > 0){
      $question = substr($title, 0, strpos($title, '::'));
	  $answer = substr($title, strpos($title, '::') + 2, strlen($title));
      echo '<li class="project_cards" id="qa_'.$position.'"><input type="radio" name="card_number" value="qa_'.$position.'" onclick="chooseCard(\'qa_'.$position.'\')"/>Q:<textarea class="question_text projects_disabled" disabled>'.$question.'</textarea><hr/>A:<textarea class="answer_text projects_disabled" disabled>'.$answer.'</textarea></li>';
     }
    }
   }else{
    echo '<li class="nothing">You currently have no projects.</li>';
   }
  }
 }

//for checking card a and card b 
}elseif(isset($_GET['ref']) === true && empty($_GET['ref']) === false && isset($_GET['first_card']) === true && empty($_GET['first_card']) === false && isset($_GET['second_card']) === true && empty($_GET['second_card']) === false && isset($_GET['action']) === true && $_GET['action'] === 'check'){
 $title_ref = $_GET['ref'];
 $first_card = $_GET['first_card'];
 $second_card = $_GET['second_card'];
 $ref_cards = init($title_ref);
 $indiv_cards = break_apart_cards($ref_cards);
 
 
 $search_first_as_q = array_search($first_card, $indiv_cards['question']);
 $search_first_as_a = array_search($first_card, $indiv_cards['answer']);
 if($search_first_as_q !== false){
  echo ($search_first_as_q === array_search($second_card, $indiv_cards['answer']))?'1':'';
 }else{
  echo ($search_first_as_a === array_search($second_card, $indiv_cards['question']))?'1':'';
 }
 
//for return answer card b to card a
}elseif(isset($_GET['ref']) === true && empty($_GET['ref']) === false && isset($_GET['q']) === true && empty($_GET['q']) === false){
 $title_ref = $_GET['ref'];
 $question = $_GET['q'];
 $ref_cards = init($title_ref);
 $indiv_cards = break_apart_cards($ref_cards);
 if(in_array($question, $indiv_cards['question'])){
  $correct_index = array_search($question, $indiv_cards['question']);
  echo $indiv_cards['answer'][$correct_index];
 }else{
  echo 'NOT THERE';
 }
//for showing project titles
}elseif(isset($_GET['title']) === true){
 $total_proj = init('title_file');
 if($total_proj === false){
 
 }else{
  if(count($total_proj) > 0){
   foreach($total_proj as $position=>$title){
    if(strlen($title) > 0){
     echo '<li class="project_title"><input type="radio" onclick="enableButtons(\'projects_page\', \'projects_disabled\')" name="project_title" value="'.$title.'" id="item_'.$position.'"/><label for="item_'.$position.'">'.$title.'</label></li>';
    }
   }
  }else{
   echo '<li class="nothing">You currently have no projects.</li>';
  }
 }
//for showing project title cards
}elseif(isset($_GET['cards']) === true){
 $proj_cards = init($_GET['cards']);
 if($proj_cards === false){
 
 }else{
  if(count($proj_cards) > 0){
   foreach($proj_cards as $position=>$title){
    $title_len = strlen($title);
	if($title_len > 0){
	 $question = substr($title, 0, strpos($title, '::'));
	 $answer = substr($title, strpos($title, '::') + 2, strlen($title));
     echo '<li class="project_cards" id="qa_'.$position.'"><input type="radio" name="card_number" value="qa_'.$position.'" onclick="chooseCard(\'qa_'.$position.'\')"/>Q:<textarea class="question_text projects_disabled" disabled>'.$question.'</textarea><hr/>A:<textarea class="answer_text projects_disabled" disabled>'.$answer.'</textarea></li>';
    }
   }
  }else{
   echo '<li class="nothing">You currently have no cards.</li>';
  }
 }
}

?>