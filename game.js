 var current_page = document.URL;
 var project_title = decodeURIComponent(current_page.substr(current_page.indexOf("?title=") + 1, (current_page.indexOf("&mode=") - current_page.indexOf("?title=")) - 1));
 var game_mode = decodeURIComponent(current_page.substr(current_page.indexOf("&mode=") + 1, (current_page.length - current_page.indexOf("&mode="))));
 if(project_title == '' && game_mode == ''){
  window.location = 'index.html';
 }else{
  var title_text = project_title.slice(project_title.indexOf("=") + 1);
  var mode_text = game_mode.slice(game_mode.indexOf("=") + 1);
  var highlight_colors = new Array();
  
  //get page variables
  var page_container = document.getElementById('game_container');
  var page_header = document.getElementById('home_page').getElementsByTagName('h3')[0];
  var page_content, first_card = '', second_card = '', finished_cards = 0, cards_left, current_color;
  var current_card, hidden_set = new Array(),  answer_container = '', choices_container = '', classic_answer = '';
  var choice_selected = '', action_tbd, progress_bar, current_progress, wrong_points = 0, right_points = 0, correct_btn, wrong_btn, current_total_points, end_total_points, correct_bar, wrong_bar, check_btn;
  
  function checkIfTitleExists(proj_title){
   var check_title = new Array();
   check_title['project_title'] = proj_title;
   check_title['mode'] = mode_text;
   check_title['action'] = 'check';
   sendDataGet('parse.php', '', check_title, function(response){
	page_container.innerHTML = response;
	if(mode_text === 'choice' && response.indexOf('class="not_enough"') !== -1){
	 document.getElementById('next').disabled = true;
	}
	var input_exist = document.createElement('input');
	input_exist.setAttribute("type","hidden");
	input_exist.setAttribute("id", "project_exists");
	input_exist.setAttribute("value", Boolean(response));
	page_container.appendChild(input_exist);
   });
   init();
   return (document.getElementById('project_exists').getAttribute('value') === 'true')?true:false;
  }
  
  
  //borrowed from a stackoverflow user
  function get_random_color() {
   var letters = '0123456789ABCDEF'.split('');
   var color = '#';
   for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
   }
   return color;
  }
  
  
  /**CLASSIC**/
  function correct_answer(){
   //only execute code if the answer is shown
   if(classic_answer.innerHTML !== ''){
    right_points += 1;
	show_progress();
   }
  }
  
  function wrong_answer(){
   //only execute code if the answer is shown
   if(classic_answer.innerHTML !== ''){
    wrong_points += 1;
	show_progress();
   }
  }
  
  function show_progress(){
   current_total_points = right_points + wrong_points;
   current_right_percentage = Math.round((right_points/current_total_points) * 100);
   current_wrong_percentage = Math.round((wrong_points/current_total_points) * 100);
   current_total_percentage = Math.round((current_total_points/end_total_points)*100);
   if ((current_right_percentage + current_wrong_percentage)>100){
    current_wrong_percentage = 100 - current_right_percentage;
   }
   current_progress.style.width = current_total_percentage + "%";
   correct_bar.style.width = current_right_percentage + "%";
   correct_bar.innerHTML = (current_right_percentage === 0)?'':current_right_percentage + "%";
   wrong_bar.style.width = current_wrong_percentage + "%";
   wrong_bar.innerHTML = (current_wrong_percentage === 0)?'':current_wrong_percentage + "%";
   
   correct_btn.disabled = true;
   wrong_btn.disabled = true;
   check_btn.disabled = false;
  }
  
  
  /**CHOICE, TILE **/
  function select_card(element){
   if(element.className.indexOf('finished') === -1){
    if(mode_text === 'tile'){
	 reveal_card(element);
    }else if(mode_text === 'matching'){
	 highlight_card(element);
    }
	if(first_card == ''){
     first_card = element;
	 replaceOrAddClass(element, 'selected', '');
	 console.log('first');
    }else if(first_card === element){
     first_card = '';
	 unselect_card(element);
	 replaceOrAddClass(element, '', 'selected');
	 console.log('second');
    }else{
     second_card = element;
	 console.log('third');
	 var match_result = check_match_cards(first_card, second_card);
	 if(match_result){
	  finished_cards++;
	  add_fisished(first_card);
	  add_fisished(second_card);
	  first_card = '';
	  second_card = '';
	  cards_left -= 1;
	  if(cards_left === 0){
	   alert("WELL DONE");
	  }
	 }else{
	  replaceOrAddClass(first_card, '', 'selected');
	  replaceOrAddClass(second_card, '', 'selected');
	  alert("WRONG");
	  unselect_card(first_card);
	  unselect_card(second_card);
	  console.log(highlight_colors);
	 }
    }
   }
  }
  
  function unselect_card(element){
   if(mode_text === 'tile'){
    hide_card(element);
   }else if(mode_text === 'matching'){
    darken_card(element);
   }
   first_card = '';
  }
  
  function add_fisished(element){
   replaceOrAddClass(element, 'finished', '');
  }
  
  function reveal_card(card_element){
   console.log(card_element);
   if(card_element.className.indexOf("selected") === -1){
    var card_content = card_element.getElementsByTagName('div')[0];
	var current_opacity = window.getComputedStyle(card_content, null).getPropertyValue('opacity');
    if(current_opacity < 1){
	 card_content.style.opacity = 1;
    }
   }else{
    hide_card(card_element);
   }
  }
  
  function hide_card(card_element){
   console.log(card_element + " <= on hide_card()");
   var card_content = card_element.getElementsByTagName('div')[0];
   card_content.style.opacity = 0;
  }
  
  function highlight_card(card_element){
   if(card_element.className.indexOf("selected") === -1){
	if(current_color == true || cards_left > highlight_colors.length){
     border_color = current_color;
    }else{
     random_for_color = Math.floor(Math.random()*highlight_colors.length);
	 border_color = highlight_colors[random_for_color];
	 highlight_colors.splice(random_for_color, 1);
    }
    card_element.style.borderColor = border_color;
    if(first_card != '' || cards_left > highlight_colors.length){
     current_color = border_color;
    }else{
     current_color = '';
    }
   }else{
    darken_card(card_element);
   }
  }
  
  function darken_card(card_element){
   card_element.style.borderColor = "#e9e9e9";
  }
  
  function check_match_cards(card_1, card_2){
   var check_match = new Array();
   check_match['ref'] = title_text;
   check_match['first_card'] = card_1.getElementsByTagName('div')[0].innerHTML;
   check_match['second_card'] = card_2.getElementsByTagName('div')[0].innerHTML;
   check_match['action'] = 'check';
   sendDataGet('parse.php', '', check_match, function(response){
    console.log(response);
	var is_it_correct = document.getElementById('is_it_correct');
	if(is_it_correct){
	 is_it_correct.setAttribute("value", Boolean(response));
	}else{
	 var input_exist = document.createElement('input');
	 input_exist.setAttribute("type","hidden");
	 input_exist.setAttribute("value", Boolean(response));
	 input_exist.setAttribute("id", "is_it_correct");
	 page_container.appendChild(input_exist);
	}
   });
   return (document.getElementById('is_it_correct').getAttribute('value') === 'true')?true:false;
  }
  
  
  /**START**/
  
  function addToElement(elemEvent, elemName, elemHandler){
   elemName.addEventListener(elemEvent, elemHandler);
  }
  
  function grabCardElements(){
   var individual_cards = document.getElementsByClassName('individual_card');
   if(individual_cards){
    for(i = 0; i < individual_cards.length; i++){
	 addToElement('click', individual_cards[i], function(){
	  select_card(this);
	 });
	}
    cards_left = individual_cards.length/2;
	var start_splice = (individual_cards.length/2) - 1;
	var length_splice = highlight_colors.length - individual_cards.length/2;
	highlight_colors.splice(start_splice, length_splice);
   }
  }
  
  function select_choice(list_element){
   if(action_tbd !== 'check_answer'){
    choice_selected = list_element;
    for(i=0; i < choices_container.length; i++){
     replaceOrAddClass(choices_container[i], '', 'selected');
    }
    replaceOrAddClass(list_element, 'selected', '');
   }
  }
  
  function unselect_choice(){
   choice_selected = '';
   for(i=0; i < choices_container.length; i++){
    replaceOrAddClass(choices_container[i], '', 'selected');
    replaceOrAddClass(choices_container[i], '', 'correct');
   }
  }
  
  function getNextButtons(){
   var next_button = document.getElementById('next');
   if(next_button){
    next_button.onclick = function(){
	 next_action(this);
	}
	if(mode_text === 'classic'){
	 check_btn = next_button;
	}
   }
  }
  
  
  function next_action(next_button){
   action_tbd = next_button.getAttribute('action');
   if(current_card + 1 >= hidden_set.length && action_tbd !== 'check_answer'){
	alert("WELL DONE");
   }else{
	if(action_tbd === 'check_answer'){
	 //when user clicks check answer (highlight list item with correct answer)
	  if((choice_selected !== '' && mode_text === 'choice') || (mode_text === 'classic')){
	   //if the user has already chosen, show the correct answer
	   var return_correct_answer = new Array();
	   return_correct_answer['ref'] = title_text;
	   return_correct_answer['q'] = answer_container.innerHTML;
	   if(correct_btn && wrong_btn){
	    correct_btn.disabled = false;
		wrong_btn.disabled = false;
		check_btn.disabled = true;
	   }
	   sendDataGet('parse.php', '', return_correct_answer, function(response){
	    if(choices_container){
		 for(k=0; k < choices_container.length; k++){
	      if(choices_container[k].innerHTML === response){
		   replaceOrAddClass(choices_container[k], 'correct', 'selected');
		  }
	     }
		}else{
		 classic_answer.innerHTML = response;
		}
	   });
	   turn_to_btn(next_button, 'Next Card', 'next_card');
	  }else{
	   alert("Choose an answer first.");
	   action_tbd = 'start';
	  }
    }else{
	 if(correct_btn && wrong_btn){
	  correct_btn.disabled = true;
	  wrong_btn.disabled = true;
	  check_btn.disabled = false;
	 }
	 if(action_tbd === 'start'){
      //when user clicks start (show first card)
	  get_hidden_cards();
	  current_card = 0;	 
	  turn_to_btn(next_button, 'Show Answer', 'check_answer');
	  choice_selected = '';
     }else if(action_tbd === 'next_card'){
      //when user clicks next card (show next card)
	  if(classic_answer){
	   classic_answer.innerHTML = '';
	  }
	  current_card += 1;
	  unselect_choice();
	  turn_to_btn(next_button, 'Show Answer', 'check_answer');
     }
	 if(answer_container){
	  answer_container.innerHTML = hidden_set[current_card][0];
	  if(choices_container){
	   for(j=0; j<choices_container.length; j++){
		choices_container[j].innerHTML = hidden_set[current_card][1][j];
	   }
	  }
	 }
    }
   }
  }
  
  function get_hidden_cards(){
   var hidden_cards = document.getElementsByClassName('hidden_cards');
   answer_container = (mode_text === 'choice')?document.getElementById('mc_answer'):document.getElementById('question');
   choices_parent = document.getElementById('mc_choices')
   if(choices_parent){
    choices_container = choices_parent.getElementsByTagName('li');
    for(h=0; h < choices_container.length; h++){
     choices_container[h].onclick = function(){
	  select_choice(this);
	 }
    }
   }
   if(hidden_cards){
	for(i=0; i < hidden_cards.length; i++){
     var question_content = hidden_cards[i].getAttribute('question');
	 var answer_value = hidden_cards[i].getAttribute('choices');
	 if(answer_value){
	  var answer_choices = answer_value.split("::");
	  hidden_set.push([question_content, answer_choices]);
	 }else{
	  hidden_set.push([question_content]);
	 }
	}
	if(mode_text !== 'matching' && mode_text !== 'tile' && mode_text !== 'choice'){
	 end_total_points = hidden_cards.length;
	}
   }else{
    console.log('There are no cards');
   }
  }
  
  function turn_to_btn(button_element, btn_label, action_value){
   button_element.innerHTML = btn_label;
   button_element.setAttribute('action', action_value);
  }
  
  
  //check if the project title exists and can be opened
  if(checkIfTitleExists(title_text)){
   page_header.innerHTML = title_text;
   //check for matching game
   if(mode_text === 'matching'){
    console.log('match till you drop!');
	//load layout
	grabCardElements();
	for(i=0; i<cards_left; i++){
	 highlight_colors.push(get_random_color());
	}
	
   //check for multiple choice game
   }else if(mode_text === 'choice'){
    console.log('it\s your choice!');
	getNextButtons();
	
	
   //check for tile game
   }else if(mode_text === 'tile'){
    console.log('tile\'s it is!');
	grabCardElements();
	
	
   //when all else fails, just choose the classic game
   }else{
    console.log('classic game begins!');
	classic_answer = document.getElementById('answer');
	progress_bar = document.getElementById('progress_bar');
	current_progress = document.getElementById('current_progress');
	correct_bar = document.getElementById('right_progress');
	wrong_bar = document.getElementById('wrong_progress');
	correct_btn = document.getElementById('correct');
	if(correct_btn){
	 correct_btn.onclick = correct_answer;
	}
	wrong_btn = document.getElementById('wrong');
	if(wrong_btn){
	 wrong_btn.onclick = wrong_answer;
	}
	getNextButtons();
	
	
   }
  }else{
   console.log('Not there')
   //redirect or do nothing
  }
  
 }