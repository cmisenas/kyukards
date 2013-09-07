
 
 var page_container = document.getElementById('page_container');
 var home_page = document.getElementById('home_page');
 var login_page = document.getElementById('login_page');
 var projects_page = document.getElementById('projects_page');
 var config_page = document.getElementById('config_page');
 var create_page = document.getElementById('create_page');
 var edit_page = document.getElementById('edit_page');
 var register_user = true;
 var login_user = true;
 var local_projects = document.getElementById('local_projects');
 var web_projects = document.getElementById('web_projects');
 var node, selected_project, selected_answer, selected_question;
 var return_buttons, page_title, input_controls;
 
 var pixel_unit = 10;
 var time_unit = 1;
 
 //borrowed from stackoverflow
 Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
 
 function slideFromDown(element, target_top_padding){
  var current_top_padding = window.getComputedStyle(element, null).getPropertyValue('padding-top').replace('px', '');
  if (current_top_padding > target_top_padding){
   if(current_top_padding != target_top_padding && current_top_padding < pixel_unit){
    element.style.paddingTop = (current_top_padding - current_top_padding) + "px";
   }else{
    element.style.paddingTop = (current_top_padding - pixel_unit) + "px";
   }
   window.setTimeout(function() {
    slideFromDown(element, target_top_padding);
   }, time_unit);
  }else{
   return true;
  }
 }
 
 function showPage(page_tbs){
  hidePage();
  notId(page_tbs, "page");
  slideFromDown(page_container, "0px");
 }
 
 function showHomePage(){
  showPage(home_page);
 }
 
 function notId(element, element_class){
  var id = element.getAttribute('id');
  var child_nodes = element.parentNode.getElementsByClassName(element_class);
  for(i = 0; i<child_nodes.length; i++){
   if(child_nodes[i].getAttribute('id') != id){
    child_nodes[i].style.display = "none";
   }else{
    child_nodes[i].style.display = "block";
   }
  }
 }
 
 function hidePage(){
  page_container.style.paddingTop = "100%";
 }
 
 function sendDataGet(file_name, element_container, get_string, return_function){
  var xmlhttp;

  if (window.XMLHttpRequest){
   // code for IE7+, Firefox, Chrome, Opera, Safari
   xmlhttp=new XMLHttpRequest();
  }else{
   // code for IE6, IE5
   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp.onreadystatechange=function(){
   if (xmlhttp.readyState==4 && xmlhttp.status==200){
	if(return_function){
	 return_function(xmlhttp.responseText);
	}
	element_container.innerHTML = xmlhttp.responseText;
   }
  }
  
  var send_to_url = changeArrayToUrlString(get_string);
  
  xmlhttp.open("GET", file_name + '?' + send_to_url, false);
  xmlhttp.send();
 }
 
 function sendDataPost(file_name, element_container, post_string){
  var xmlhttp_post;
  if (window.XMLHttpRequest){
   // code for IE7+, Firefox, Chrome, Opera, Safari
   xmlhttp_post=new XMLHttpRequest();
  }else{
   // code for IE6, IE5
   xmlhttp_post=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp_post.onreadystatechange=function(){
   if (xmlhttp_post.readyState==4 && xmlhttp_post.status==200){
	element_container.innerHTML = xmlhttp_post.responsetext;
   }
  }
  
  var send_to_url = changeArrayToUrlString(post_string);
  xmlhttp_post.open("POST", file_name, true);
  xmlhttp_post.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp_post.send(send_to_url);
 }
 
 function changeArrayToUrlString(change_array){
  var stringed_array = '';
  var key;
  var i = 0;
  for(key in change_array){
   if(change_array[key] instanceof Array){
    changeArrayToUrlString(change_array[key]);
   }else{
	stringed_array += key + '=' + change_array[key];
	if(Object.size(change_array) > 1 && i < Object.size(change_array) -1){
	 stringed_array += '&';
	}
   }
   i++;
  }
  return stringed_array;
 }
 
 function blurControl(element){
  var default_val = element.getAttribute('default');
  var element_id = element.getAttribute('id');
  var element_val = element.value;
  if(element_val.replace(/^\s+|\s+$/g,'') == '' || element_val.replace(/^\s+|\s+$/g,'') == default_val){
   element.value = default_val;
   setPasswordAsText(element);
   addErrorNotif(element_id);
  }else{
   var input_type = element.getAttribute('id');
   if(input_type == 'email'){
	if(validEmail(element_val) === false){
	 addErrorNotif(element_id);
	}else{
	 addRightNotif(element_id);
	}
   }else if(input_type == 'password'){
    if(validAlphaNumeric(element_val) === false){
	 addErrorNotif(element_id);
	}else{
	 addRightNotif(element_id);
	}
	blurControl(document.getElementById('confirm_password'));
   }else if(input_type == 'confirm_password'){
    if(element_val != document.getElementById('password').value || validAlphaNumeric(element_val) === false){
	 addErrorNotif(element_id);
	}else{
	 addRightNotif(element_id);
	}
   }else{
    addRightNotif(element_id);
   }
  }
 }
 
 function focusControl(element){
  var default_val = element.getAttribute('default');
  if(default_val == element.value.replace(/^\s+|\s+$/g,'')){
   element.value = '';
  }
  setTextAsPassword(element);
 }
 
 function validAlphaNumeric(element_value){
  var regex_alpha_numeric = /^[A-Za-z0-9]*$/;
  return regex_alpha_numeric.test(element_value);
 }
 
 function validLength(element_value, length){
  if(element_value.length > length){
   return true;
  }
  return false;
 }
 
 function validEmail(email){
  var regex_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex_email.test(email);
 }
 
 function validValue(element_id){
  var element_value = document.getElementById(element_id);
  if(element_value.value == element_value.getAttribute('default')){
   return true;
  }
  return false;
 }
 
 function checkIfPassword(element){
  return (' ' + element.className + ' ').indexOf('password_control') > -1;
 }
 
 function setPasswordAsText(element){
  if(checkIfPassword(element)){
   element.setAttribute('type', 'text');
  }
 }
 
 function setTextAsPassword(element){
  if(checkIfPassword(element)){
   element.setAttribute('type', 'password');
  }
 }
 
 // borrowed from a stackoverflow user
 function whichChild(elem){
  var i= 0;
  while((elem = elem.previousSibling) !=null){
   if(elem.nodeType === 1){
    i++;
   }
  }
  return i;
}
 
 function containErrorNotif(class_name, class_content){
  var notif_container = document.getElementsByClassName('notif_section');
  if(notif_container){
   for(i = 0; i < notif_container.length; i++){
    var input_elements = notif_container[i].parentNode.getElementsByTagName('input');
	if(input_elements){
	 var list_elements = '';
	 for(j = 0; j < input_elements.length; j++){
	  list_elements += '<li class="' + class_name + '">' + class_content + '</li>';
	 }
	 notif_container[i].innerHTML = '<ul>' + list_elements + '</ul>';
	}
   }
  }
 }
 
 function addErrorNotif(elem_id){
  var element = document.getElementById(elem_id);
  var child_position = whichChild(element);
  var error_container = document.getElementById(elem_id).parentNode.getElementsByClassName('notif_section')[0];
  if(error_container){
   var child_error = error_container.getElementsByTagName('li')[child_position];
   replaceOrAddClass(child_error, 'error', 'right');
   child_error.innerHTML = '&#10006;';
  }
 }
 
 function addRightNotif(elem_id){
  var element = document.getElementById(elem_id);
  var child_position = whichChild(element);
  var right_container = document.getElementById(elem_id).parentNode.getElementsByClassName('notif_section')[0];
  if(right_container){
   var child_right = right_container.getElementsByTagName('li')[child_position];
   replaceOrAddClass(child_right, 'right', 'error');
   child_right.innerHTML = '&#10004;';
  }
 }
 
 function replaceOrAddClass(element, new_class, old_class){
  reg = new RegExp('(\\s|^)'+ old_class +'(\\s|$)')
  if(element.className.match(reg)){
   element.className = element.className.replace(reg, ' ' + new_class + '');
  }else{
   reg_2 = new RegExp('(\\s|^)'+ new_class +'(\\s|$)');
   if(element.className.match(reg_2) == null){
    new_class = " " + new_class;
    element.className += " " + new_class;
   }
  }
 }
 
 /********/
 /**INIT**/
 /********/
 
 function init(){
  get_return_buttons();
 }
 
 init();
 showHomePage();
 containErrorNotif('required', '&#42;');
 
 var input_control = document.getElementsByTagName("input");
 for(i = 0; i < input_control.length; i++){
  input_control[i].onfocus = function(){
   focusControl(this);
  }
  input_control[i].onblur = function(){
   blurControl(this);
  }
 }
 
 var password_control = document.getElementsByClassName("password_control")
 for(i = 0; i < password_control.length; i++){
  setPasswordAsText(password_control[i]);
 } 
 
 //when user hits the local button
 var local_button = document.getElementById('local');
 if(local_button){
  local_button.onclick = function(){
   var param = new Array();
   param['title'] = 0;
   sendDataGet('parse.php', local_projects, param);
   //TODO
   //getFileContents('parse.php', web_projects, 'popular');
   showPage(projects_page);
  }
 }
 
 //when user hits the online button
 var online_button = document.getElementById('online');
 if(online_button){
  online_button.onclick = function(){
   showPage(login_page);
  }
 }
 
 //when user hits the start button
 var start_button = document.getElementById('start');
 if(start_button){
  start_button.onclick = function(){
   selected_project = getSelected('project_title');
   showPage(config_page);
  }
 }
 
 //when user hits the new project button
 var new_button = document.getElementById('new_project');
 if(new_button){
  new_button.onclick = function(){
   showPage(create_page);
  }
 }
 
 //when user hits the start game button
 var game_button = document.getElementById('game');
 if(game_button){
  game_button.onclick = function(){
   var project_title = getSelected('project_title');
   var mode = getSelected('game_type');
   console.log(project_title);
   console.log(mode);
   window.location = 'game.html?title=' + project_title + '&mode=' + mode;
  }
 }
 
 //when user hits return to home button
 function get_return_buttons(){
  return_buttons = document.getElementsByClassName('return_to_home');
  page_title = document.getElementsByTagName('title')[0].innerHTML;
  input_controls = document.getElementsByTagName('input');
  for(i = 0; i < return_buttons.length; i++){
    return_buttons[i].onclick = return_to_home;
  }
 }
 
 function return_to_home(){
  if(page_title.indexOf('Study') !== -1){
   window.location = 'index.html';
  }else if(page_title.indexOf('Home') !== -1){
   showHomePage();
   disableButtons('page_container', 'projects_disabled');
   for(j = 0; j < input_controls.length; j++){
    input_controls[j].checked = false;
   }
   document.getElementById('add_title_container').innerHTML = '<input type="text" id="add_title" default="Enter project title" value="Enter project title" onblur="blurControl(this)" onfocus="focusControl(this)"/>';
  }
 }
 
 /*******************/
 /**users functions**/
 /*******************/
 
 //logging in
 var login_button = document.getElementById('login_button');
 if(login_button){
  var login = document.getElementById('login');
  login_button.onclick = function(){
   var login_controls = login.getElementsByTagName('input');
   if(login_controls){
    var login_details = new Array();
    for(i = 0; i < login_controls.length; i++){
	 //validate the input fields
	 blurControl(login_controls[i]);
     login_details[i] = [login_controls[i].getAttribute('id'), login_controls[i].value];
    }
	//if correct, ajax it to parse.php
	if(login.getElementsByClassName('error').length < 1){
	 console.log('ready for ajax');
	 //TODO
	}
   }
  }
 }
 
 //registering
 var register_button = document.getElementById('register_button');
 if(register_button){
  var register = document.getElementById('register');
  register_button.onclick = function(){
   var register_controls = register.getElementsByTagName('input');
   if(register_controls){
    var register_details = new Array();
    for(i = 0; i < register_controls.length; i++){
	 //validate the input fields
     blurControl(register_controls[i]);
	 register_details.push([register_controls[i].getAttribute('id'), register_controls[i].value]);
    }
	if(register.getElementsByClassName('error').length < 1){
	 //if correct, ajax it to parse.php
	}
   }
  }
 }
 
 
 /**********************/
 /**projects functions**/
 /**********************/
 
 //creating new project
 var add_project = document.getElementById('add_project');
 if(add_project){
  add_project.onclick = function(){
   var add_title = document.getElementById('add_title');
   var title_value = add_title.value;
   var post_string = new Array();
   post_string['project_title'] = title_value;
   post_string['action'] = 'add';
   sendDataGet('parse.php', add_title.parentNode, post_string, function(response){
    if(response.indexOf('<h4>') !== -1){
	 enableButtons('create_page', 'projects_disabled');
	}
   });
  }
 }
 
 //borrowed from a stackoverflow user
 function getSelected(name) {
  var elements = document.getElementsByName(name);
  for (i=0; i<elements.length; ++i)
  if (elements[i].checked) return elements[i].value;
 }
 
 function enableButtons(parent_container, button_class){
  var project_disabled = document.getElementById(parent_container).getElementsByClassName(button_class);
  if(project_disabled){
   for(j=0; j<project_disabled.length; ++j){
	project_disabled[j].disabled = false;
   }
  }
 }
 
 function disableButtons(parent_container, button_class){
  var project_enabled = document.getElementById(parent_container).getElementsByClassName(button_class);
  if(project_enabled){
   for(i=0; i<project_enabled.length; ++i){
	project_enabled[i].disabled = true;
   }
  }
 }
 
 //selecting a project 
 function chooseCard(radio_container){
  var radio_cards = document.getElementById(radio_container).parentNode.getElementsByTagName('input');
  var question_text = document.getElementById(radio_container).getElementsByClassName('question_text')[0];
  var answer_text = document.getElementById(radio_container).getElementsByClassName('answer_text')[0];
  selected_question = question_text.value;
  selected_answer = answer_text.value;
  
  if(radio_cards){
   for(j=0; j<radio_cards.length; ++j){
    if(radio_cards[j].checked === false){
	 disableButtons(radio_cards[j].value, 'projects_disabled');
	}
   }
  }
  enableButtons('existing_buttons', 'projects_disabled');
  enableButtons(radio_container, 'projects_disabled');
 }
 
 //deleting project
 var delete_project = document.getElementById('delete_project');
 if(delete_project){
  delete_project.onclick = function(){
   //confirm if user was conscious when he/she clicked the delete button
   var del_projecttitle = getSelected('project_title');
   var projects_container = document.getElementById('local_projects');
   var do_delete = confirm("Do you really want to delete " + del_projecttitle + "?");
   if(do_delete){
	//get the variables needed
	var project_cards = new Array();
    project_cards['project_title'] = del_projecttitle;
    project_cards['action'] = 'delete';
    //send using sendDataGet()
	sendDataGet('parse.php', projects_container, project_cards);
   }
  }
 }
 
 //editing a project
 var edit_project = document.getElementById('edit_project');
 if(edit_project){
  edit_project.onclick = function(){
   //get the necessary variables
   var edit_projecttitle = getSelected('project_title');
   var edittitle_container = document.getElementById('edit_page').getElementsByTagName('h3')[0];
   var cards_container = document.getElementById('edit_page').getElementsByClassName('content_list')[0];
   var project_cards = new Array();
   project_cards['cards'] = edit_projecttitle;
   edittitle_container.innerHTML = edit_projecttitle;
   sendDataGet('parse.php', cards_container, project_cards);
   showPage(edit_page);
  }
 }
 
 var edit_add_card = document.getElementById('edit_add_card');
 if(edit_add_card){
  edit_add_card.onclick=function(){
   //get the necessary variables
   var edit_question = document.getElementById('edit_question');
   var edit_question_val = edit_question.value;
   var edit_answer = document.getElementById('edit_answer');
   var edit_answer_val = edit_answer.value;
   var edit_projecttitle = document.getElementById('edit_page').getElementsByTagName('h3')[0].innerHTML;
   var cards_container = document.getElementById('edit_page').getElementsByClassName('content_list')[0];
   
   if(edit_question_val !== '' && edit_answer_val !== ''){
    var project_cards = new Array();
    project_cards['card_title'] = edit_projecttitle;
	project_cards['card_question'] = edit_question_val;
	project_cards['card_answer'] = edit_answer_val;
	project_cards['action'] = 'add';
    
    sendDataGet('parse.php', cards_container, project_cards, function(response){
	 if(response.indexOf('li') !== -1){
	  var addcard_textarea = document.getElementById('edit_page').getElementsByTagName('textarea');
	  for(i = 0; i < addcard_textarea.length; i++){
	   addcard_textarea[i].value = '';
	  }
	 }else{
	  cards_container.innerHTML = 'An error ocurred. <a href="index.html">Try again.</a>';
	 }
	});
    
   }else{
    alert('Enter a value for question and answer');
   }
  }
 }
 
 //adding a card
 var add_card = document.getElementById('add_card');
 if(add_card){
  add_card.onclick = function(){
   var add_question = document.getElementById('add_question');
   var add_question_val = add_question.value;
   var add_answer = document.getElementById('add_answer');
   var add_answer_val = add_answer.value;
   var addcard_title = document.getElementById('add_title_container').getElementsByTagName('h4')[0];
   if(add_question_val !== '' && add_answer_val !== ''){
    var card_string = new Array();
    card_string['card_title'] = addcard_title.innerHTML;
    card_string['card_question'] = add_question_val;
    card_string['card_answer'] = add_answer_val;
    card_string['action'] = 'add';
    card_string['new'] = 'true';
    console.log(card_string)
    sendDataGet('parse.php', '', card_string, function(response){
     console.log(response)
	 var create_cardlist = document.getElementById('create_page').getElementsByClassName('content_list')[0];
	 if(response.indexOf('li') !== -1){
	  if(create_cardlist){
	   console.log(create_cardlist)
	   cardlist = create_cardlist.innerHTML;
	   console.log(cardlist)
	   create_cardlist.innerHTML = cardlist + response;
	   var addcard_textarea = document.getElementById('create_page').getElementsByTagName('textarea');
	   for(i = 0; i < addcard_textarea.length; i++){
	    addcard_textarea[i].value = '';
	   }
	  }
	 }else{
	  create_cardlist.innerHTML = 'An error ocurred. <a href="index.html">Try again.</a>';
	 }
    });
   }else{
    alert('Enter a value for question and answer');
   }
  }
 }
 
 //deleting a card
 var delete_existcard = document.getElementById('delete_existcard');
 if(delete_existcard){
  delete_existcard.onclick=function(){
   var card_position = getSelected('card_number');
   var project_filename = document.getElementById('edit_page').getElementsByTagName('h3')[0].innerHTML;
   var del_question = document.getElementById(card_position).getElementsByClassName('question_text')[0].innerHTML;
   var del_answer = document.getElementById(card_position).getElementsByClassName('answer_text')[0].innerHTML;
   var cards_container = document.getElementById('edit_page').getElementsByClassName('content_list')[0];
   
   var card_string = new Array();
   card_string['card_title'] = project_filename;
   card_string['card_question'] = del_question;
   card_string['card_answer'] = del_answer;
   card_string['action'] = 'delete';
   console.log(card_string);
   sendDataGet('parse.php', cards_container, card_string);
  }
 }
 
 //editing a card
 var edit_existcard = document.getElementById('edit_existcard');
 if(edit_existcard){
  edit_existcard.onclick=function(){
   var card_position = getSelected('card_number');
   var old_line = selected_question + '::' + selected_answer;
   var project_filename = document.getElementById('edit_page').getElementsByTagName('h3')[0].innerHTML;
   var current_question = document.getElementById(card_position).getElementsByClassName('question_text')[0].value;
   var current_answer = document.getElementById(card_position).getElementsByClassName('answer_text')[0].value;
   var cards_container = document.getElementById('edit_page').getElementsByClassName('content_list')[0];
   
   if(current_question !== '' && current_answer !== ''){
    var card_string = new Array();
    card_string['card_title'] = project_filename;
    card_string['card_question'] = current_question;
    card_string['card_answer'] = current_answer;
    card_string['prev'] = old_line;
    card_string['action'] = 'edit';
    console.log(card_string);
    sendDataGet('parse.php', cards_container, card_string);
   }else{
    alert('Enter a value for question and answer');
   }
  }
 }