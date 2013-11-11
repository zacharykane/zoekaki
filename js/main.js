$(function() {
	var art = $('.art').get(0).getContext('2d');
	var scratch = $('.scratch').get(0).getContext('2d');
	var palette = $('#palette').get(0).getContext('2d');

	var brush = {
		color: 'black',
		width: 3,
		lineCap: 'butt',
		shadowBlur: 0,
		setColor: function(r,g,b) {
			this.color = 'rgb('+r+','+g+','+b+')';
		},
		setLineCap: function(cap) {
			this.lineCap = cap;
		},
		setSize: function(size) {
			this.width = size;
		}
	};
	var x = [0], 
		y = [0];
	var color, width, cap, i=0;

	function init() {
		if (art) {
			var colorGrad = palette.createLinearGradient(0,0,640,0);
			colorGrad.addColorStop(0, 'red');
			colorGrad.addColorStop(0.1, 'orange');
			colorGrad.addColorStop(0.3, 'yellow');
			colorGrad.addColorStop(0.5, 'green');
			colorGrad.addColorStop(0.7, 'blue');
			colorGrad.addColorStop(0.9, 'indigo');
			colorGrad.addColorStop(1, 'violet');

			var greyGrad = palette.createLinearGradient(0,0,640,0);
			greyGrad.addColorStop(0, 'white');
			greyGrad.addColorStop(1, 'black');

			palette.fillStyle = colorGrad;
			palette.fillRect(0,0,640,60);
			palette.fillStyle = greyGrad;
			palette.fillRect(0,60,640,80);
			
			$( "#slider" ).slider({
			  range: "min",
			  value: 3,
			  min: 1,
			  max: 32,
			  change: function( event, ui ) { width = true; }
			});
		}
	};

	function makeStroke(ctx) {
	    var i;
	    ctx.beginPath();
	    ctx.shadowBlur = 3;
	    ctx.shadowColor = brush.color;
	    ctx.strokeStyle = brush.color;
	    ctx.lineWidth = brush.width;
	    ctx.lineCap = brush.lineCap;
	    ctx.moveTo(x[0], y[0]);
	    for (i=1; i < x.length; i++) {
	        ctx.lineTo(x[i], y[i]);
	    }
	    ctx.stroke();

	    if (color) { brush.setColor(color[0], color[1], color[2]); color = null; }
	    if (width) { brush.setSize($("#slider").slider( "value" )); width = false; }
	    if (cap) { brush.setLineCap($("#lineStyle option:selected").val()); cap = false; }
	};

	init();

	$("#palette").mousedown(function(e){
		if (e.which === 1) {
			color = palette.getImageData(e.offsetX, e.offsetY, 1, 1).data;
			//brush.setColor(color[0], color[1], color[2]);
		}
	});

	$('.scratch').mousedown(function(e){
		//scratch.clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
		this.getContext('2d').clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
		//makeStroke(art);
		makeStroke($(this).siblings('.art')[0].getContext('2d'));
		x = [e.offsetX];
    	y = [e.offsetY];
	});
	$('.scratch').mousemove(function(e){
		if (e.which === 1) {
			x.push(e.offsetX);
        	y.push(e.offsetY);
			//scratch.clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
			this.getContext('2d').clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
			//makeStroke(scratch);
			makeStroke(this.getContext('2d'));
		}
	});
	$('#undo').click(function(e) {
		scratch.clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
	    x = [0];
	    y = [0];
	});
	$('#clear').click(function(e) {
		art.clearRect(0, 0, art.canvas.width, art.canvas.height);
		scratch.clearRect(0, 0, scratch.canvas.width, scratch.canvas.height);
		x = [0];
	    y = [0];
	});
	$('#lineStyle').change(function() {
		cap = true;
		//brush.setLineCap($("#lineStyle option:selected").val());
	});
	// $('#lineSize').change(function() {
// 		width = true;
// 		//brush.setSize($("#lineSize option:selected").val());
// 	});

	$('#addLayer').click(function(e) {
		i = i + 1;
		$('#layer0').clone(true, true).attr("id", "layer"+i).appendTo("#canvases");
	});
});