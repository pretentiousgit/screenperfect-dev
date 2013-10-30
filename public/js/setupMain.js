//jQueryUI schmutz
$(".selectable").selectable();
$("#videoListBox").accordion();



$(function(){

// Draw hotspots on canvas to trace where the video should link to.
    var x1, y1,x2,y2;
 
    $("#canvas").mousedown(function (e) {
    	console.log(e.target);
        
        //detect if the click is on a close, delete the send hotspot box, return the click.
        if ($(event.target).hasClass("close") ) {
        	console.log('close');
        	$(event.target).parent().remove();
        	return false;
	    }

	    // On clicking an existing video hotspot, make a modal of available branch videos appear.
	    // this needs to be functionified to make it pop on clicking Thumb, too.
		    if ($(event.target).hasClass('send-video') ) {
		    var spot = $(event.target);
		    var nextVideoInBranch;
			console.log('send-video hotspot clicked');
			
			// Dialog of available videos
		    $('#dialog').dialog({
		        modal: true,
		        buttons: [{
		            text: "Set",
		            click: function () {
		                nextVideoInBranch = $('.ui-selected').attr('id');
		                $(spot).attr('nextVid', nextVideoInBranch)
		                $(".thumb", spot).html('<img src="/image/A/' + nextVideoInBranch +'A.png" />');
		                $(this).dialog("destroy");
		                $('#thumbnailsForBranchSelection').addClass('hidden');
		            }
		        }, {
		            text: "Cancel",
		            click: function () {
		                $(this).dialog("destroy");
		                $('#thumbnailsForBranchSelection').addClass('hidden');
		            }
		        }],
		        maxHeight: 500,
		        position: {
		            my: "center top",
		            at: "center top",
		            of: "#canvas"
		        }
		    });
			    $(event.target).attr('id', nextVideoInBranch);
			    $('#thumbnailsForBranchSelection').removeClass('hidden')
			    $('.ui-selectee').removeClass('ui-selected');
	    }

	    // begin drawing boxes for hotspots.
        if (e.target !== this) return; // if it's not over the canvas, don't do any of the following.
        console.log('mousedown on canvas detected');
        $("#current").attr({
            id: ''
        });

        var box = $('<div class="send-video box-setup" ></div>');

        $(this).append(box);

        var parentOffset = $(this).parent().offset();
        var canvasWidth = $('#canvas').width();
        var canvasHeight = $('#canvas').height();

        console.log (canvasWidth +' '+ canvasHeight);
        console.log (e.pageX +' '+ e.pageY);
        console.log ( Math.round((e.pageX/canvasWidth)*100) +' '+ Math.round((e.pageY/canvasHeight)*100));

        x1 = e.pageX - parentOffset.left;
        y1 = e.pageY - parentOffset.top;

        x2 = Math.round((e.pageX/canvasWidth)*100);
        y2 = Math.round((e.pageY/canvasHeight)*100);

        box.attr({
            id: 'current'
        });

        box.css({
            top: y2 + '%', //offsets
            left: x2  + '%', //offsets
        });
    });

// when the mouse moves, extend the box.
    $("#canvas").mousemove(function (e) {
        var w = Math.round(((e.pageX - x1)/$('#canvas').width())*100)+'%';
        var h =  Math.round(((e.pageY - y1)/$('#canvas').height())*100)+'%';
        $("#current").css({
            width: w, //offsets
            height: h, //offsets
        });
    });

// When the mouse stops moving, create the box
    $("#canvas").mouseup(function () {
    	$('#current').append('<button class="close">X</button><div class="thumb">Click to set branch.</div>');
    	console.log($('#current').attr('style')); // here is probz where math should go
        $("#current")
        	.removeClass('box-setup')
            .attr({
                id: ''
            });

    });

    // select a video from the thumbnail list of available videos in order to set spots on it
	$('.videoListThumbnail').click(function() {
		// store any existing image links to their JSON
		if ($('.send-video').length && $('.send-video').attr('nextVid') ){
			
			var current = $("#canvas").attr('vidId');
			var links = [current];

			$(".send-video").each(function (index) {
				var $video = $(this);
				
				  var obj = {
					id: $video.attr("nextVid"),
					css: $video.attr("style"),
					link: $video.attr("nextVid")
			  };
				
				links.push(obj);

			});
			
			message('emitted \'' + JSON.stringify(links) + '\'');
			socket.emit('setup', links);
		}

		// clear hotspots already drawn
		    $("div.send-video").remove();

		// change the background image to a new background image
			var imgSrc = $(this).attr('src');
			var vidId = $(this).parent().attr('vidId');
			$('.highlight').removeClass('highlight');
			$(event.target).parent().addClass('highlight');
			$('#canvas').css(
					{
					    'background': 'url('+ imgSrc +') no-repeat fixed center',
						'background-size': '720px 540px'
	    			}).attr('vidId', vidId);
		
		// Is there already a json for this? Then put those hotspots onscreen.
			$.getJSON('/tmp/'+vidId+'.json', function(data) {
			    for (var i in data.spots) {
					var skeleton = $('<div class="send-video"><button class="close">X</button><div class="thumb">Click to set branch.</div></div>');
		        	$(skeleton).attr('style', data.spots[i].css);
		        	if (data.spots[i].link) {
		        		$(skeleton).attr('nextvid', data.spots[i].link);
			        	$(skeleton).html('<button class="close">X</button><div class="thumb"><img src="/image/A/' + data.spots[i].link +'A.png" /></div></div>');
		        		}
		        	$(skeleton).appendTo($('#canvas'));
			    }
			  });
		return false;
	});
    
 
	//save spots to server json
	$('#save').click(function(e){
		var current = $("#canvas").attr('vidId');
			var links = [current];

			$(".send-video").each(function (index) {
				  var $video = $(this);
				
				  var obj = {
					id: $video.attr("nextVid"),
					css: $video.attr("style"),
					link: $video.attr("nextVid")
			  };
			
			  links.push(obj);
		});
		
		message('emitted \'' + JSON.stringify(links) + '\'');
		socket.emit('setup', links);
		
		return false;
	});

	//delete individual spots - controlled in sidebar
	$('.close').click(function () {
		console.log('close clicked');
	    $(this).parent().remove();
	    return false;
	});

	//clear all spots - controlled in sidebar
	$('#clear').click(function() {
		console.log('clear clicked');
	    $("div.send-video").remove();
	    return false; 
	});
});