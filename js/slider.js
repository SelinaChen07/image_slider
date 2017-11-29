const imagesLength = 6; //total number of images in the .images_container
var loop; //ID of setInterval for slider
var imageID = 1; //imageID of current on show image, starting from 1 to 6

//Slide to the next image on the right
var slideToNext = function(){
	if(imageID >= imagesLength){
		$("#images_container").css("left", "0");
		imageID = 1;
	} //if reach the end of the images_container, reset the images_container to original position.
	$("#images_container").animate({left: ["-=100%","linear"]}, "slow"); 
	imageID++;
	//console.log(imageID);
	//console.log($("#images_container").css("left"));
	updatePreviewButton();
};

//Slide to the previous image on the left
var slideToPrevious = function(){
	if(imageID <= 1){
		$("#images_container").css("left", "-500%");
		imageID = 6;
	}//if reach the end of the images_container, reset the images_container to original position.
	$("#images_container").animate({left: ["+=100%","linear"]}, "slow"); 
	imageID--;
	updatePreviewButton();
};

var startSlide = function(){
	loop = setInterval(slideToNext, 5000);
	//console.log("start"+loop);

};

var stopSlide = function(){
	//console.log("kill"+loop);
 	window.clearInterval(loop);
};


$(document).ready(function(){	
	$("#slider").hover(
		stopSlide,
		startSlide
	);

	//If user click on the next/previous button too quick before the animate is finished, there will be a problem. For example, if the current position is -500%, should reset to left:0; but the next click coming too soon, and it's before the image_container is reset, then $("#images_container").animate({left: ["-=100%","linear"]}, "slow"); is performed based on the current position and will turn into -600%, the next click will be -700%. That's why we need to close the click event after the first click and wait for a while and open the click event handler again after the action is finished.
	$("#pre_button").one('click',function preClkHandler(event){
		event.preventDefault();
		slideToPrevious();
		setTimeout(function(){$("#pre_button").one('click', preClkHandler)},1000);
	});
		
	$("#next_button").one('click',function nxtClkHandler(event){
		event.preventDefault();
		slideToNext();
		setTimeout(function(){$("#next_button").one('click', nxtClkHandler)},1000);
	});

	//when user click on preview buttons in a row too quickly, there will be a problem. For example, when the preview button is click, loop id = 53 is killed, stop sliding. Image is shown. Then another loop with id =54 will begin in 3 secs. However, if another preview butoon is clicked within 3 sec before loop 54 is started, then won't kill loop 54 becuase it is not started yet. Will continue to open another loop 55. Next click kill 55. Thus loop 54 will be lost, no one could kill it becuase the value of loop is updated to new. Thus event though mouse hover on slider, only kill loop 55 or later id. But loop 54 continue to slide without stopping. If click on too quick a couple preview buttons, then a couple loop is there sliding, which makes a mess. Solution, stopSlide totally when mouse hove on preview button.

	$('#preview_bar').on('click','.preview_button',function(event){
		event.preventDefault();
		//stopSlide();
		showImage(event);
		//setTimeout(startSlide, 3000);
	});

	$(".preview_button").hover(
		stopSlide,
		startSlide
	);

	//Show preview of the image when mouse hover on the preview button
	$('#preview_bar').on('mouseenter','.preview_button',showPreview);
	$('#preview_bar').on('mouseleave','.preview_button',hidePreview);

	startSlide();

});

//Show the image in slider when its preview button is clicked.
var showImage = function(event){
	var image_index = $(event.target).index(); //image_index from 0 to 4
	imageID = image_index + 1;
	$("#images_container").css("left", ""+image_index*-100+"%");
	updatePreviewButton();
}


//Preview image is shown on top of preview button when mouse hover on.
var showPreview = function(){
	$(this).children().last().css("display","block");
}

var hidePreview = function(){
	$(this).children().last().css("display","none");
}

//Only the on show image's preview button is black, the others are transparent.
var updatePreviewButton = function(){
	$(".preview_button").css('background-color','transparent');
	if(imageID === 6){
		$(".preview_button:first-child").css('background-color','black');
	}else{
		$(".preview_button:nth-child("+(imageID)+')').css('background-color','black');
	}
}