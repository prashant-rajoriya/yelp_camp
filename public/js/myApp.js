
$('.close').on('click',function(event) {
  $('#message').css('display','none');
  event.stopPropagation();
});
