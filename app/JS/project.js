
// Responsive images
// $(function(){
//     $('.responsive').picture();
// });

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
  $('ul.drop-nav').toggleClass('slide-down');
  $('ul.drop-nav').toggleClass('slide-up');
});
// Toggles background of slide down menu
$('.drop-nav li').click(function(e){
  e.preventDefault();
  $('.drop-nav li').removeClass('active');
  $(this).addClass('active');
  $('ul.drop-nav').removeClass('slide-down');
  $('ul.drop-nav').addClass('slide-up');
});

});


