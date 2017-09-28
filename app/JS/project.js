
// Google Autocomplete
function initialize(){
  const input = document.getElementById('search-box');
  const autocomplete = new google.maps.places.Autocomplete(input);
}

$(function(){
  
// Input autofocus
document.getElementById('search-box').focus();

// Slide down menu
$('#burger').click(function(e){
  e.preventDefault();
  $('ul.drop-nav').toggleClass('slide-menu');
});

// Toggles background of slide down menu
$('.drop-nav li').click(function(e){
  e.preventDefault();
  $('.drop-nav li').removeClass('active');
  $(this).addClass('active');
  $('ul.drop-nav').removeClass('slide-menu');
});

// Datepicker
$('.datepicker').datepick();

// Form reset
$('#button').click(function(e){
  e.preventDefault();
  $('form')[0].reset();
  })
});


