console.log('Am I JS?');
var sketch = document.getElementById('sketch');
var canvas;
var ctx;
var canvasWidth = 500;
var canvasHeight = 500;
var overlay;
var otx;
var imgxpos;
var imgypos;
var bgimgheight;
var bgimgwidth;
var mouse = {x: 0, y: 0};
var randpos = {x: 0, y: 0};
var paint_color = '#000';
var size = 10;
var scribble_on = false;
var instance;
var customURL;
var resourceNum = 3;
var curLoadNum = 0;
var imgStore = [];
var bgimg_0 = new Image();
var bgimg_1 = new Image();
var bgimg_2 = new Image();
imgStore[0] = bgimg_0;
imgStore[1] = bgimg_1;
imgStore[2] = bgimg_2;
bgimg_0.onload = function() {countLoad();};
bgimg_0.onerror = function(){console.error('ERROR: bgimg_0 not loaded!');};
bgimg_0.src = 'images/logo.jpg';
bgimg_1.onload = function() {countLoad();};
bgimg_1.onerror = function(){console.error('ERROR: bgimg_1 not loaded!');};
bgimg_1.src = 'images/bgimg_1.png';
bgimg_2.onload = function() {countLoad();};
bgimg_2.onerror = function(){console.error('ERROR: bgimg_2 not loaded!');};
bgimg_2.src = 'images/poohfriends.gif';
function countLoad () {
    console.log('load ' + curLoadNum);
    if (++curLoadNum == resourceNum) {
        prepareCanvas();
        prepareOverlayCanvas();
        drawFunct();
        ctx.drawImage(bgimg_0, (canvas.width - bgimg_0.width) / 2, (canvas.height - bgimg_0.height) / 2);
    }
}
function prepareCanvas() {
    canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'paint');
	sketch.appendChild(canvas);
    ctx = canvas.getContext('2d');
}
function prepareOverlayCanvas() {
    overlay = document.createElement('canvas');
    overlay.setAttribute('width', canvasWidth);
    overlay.setAttribute('height', canvasHeight);
    overlay.setAttribute('id', 'colorins');
    sketch.appendChild(overlay);
    otx = overlay.getContext('2d');
}
function drawBgImg (imgcode) {
    if (imgcode > 0) {
        eraseAll();
        otx.drawImage(imgStore[imgcode], (overlay.width - imgStore[imgcode].width) / 2, (overlay.height - imgStore[imgcode].height) / 2);
        document.getElementById('bg_value').innerHTML=imgcode;
    } else { 
        otx.clearRect(0, 0, overlay.width, overlay.height);
        document.getElementById('bg_value').innerHTML='None';
    }
}
function setImgURL(string) {
    customURL = string;
}
function getImgFromURL() {
    console.log(customURL);
    var cusimg = new Image();
    cusimg.src=customURL;
    cusimg.onerror = function () {
        document.getElementById('custom_img').value='URL Error!';
    };
    cusimg.onload = function () {
        eraseAll();
        otx.drawImage(cusimg, (overlay.width - cusimg.width) / 2, (overlay.height - cusimg.height) / 2);
        document.getElementById('bg_value').innerHTML='Custom';
    };
}
function changeSize (newValue) {
    size = newValue;
    document.getElementById("size_value").innerHTML=newValue;
}
function changeColor (newValue) {
    paint_color = newValue;
}
function updateMode (newValue) {
    scribble_on = document.getElementById("scribble").checked;
}
function eraseAll () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    otx.clearRect(0, 0, overlay.width, overlay.height);
    document.getElementById('bg_value').innerHTML='None';
    document.getElementById('custom_img').value='';
}   
function drawFunct() {
    var normalMode = function normalMode() {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = paint_color;
        ctx.lineWidth = size;
        ctx.stroke();
    };
    var scribbleMode = function() {
        ctx.lineTo(randpos.x, randpos.y);
        ctx.strokeStyle = paint_color;
        ctx.lineWidth = size;
        ctx.stroke();
    };
    overlay.addEventListener('mousemove', function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        document.getElementById("mousex").innerHTML=mouse.x;
        document.getElementById("mousey").innerHTML=mouse.y;
        randpos.x = mouse.x + (Math.random() * size); //for scribble mode
        randpos.y = mouse.y + (Math.random() * size);
    });
    overlay.addEventListener('mousedown', function (e) {
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.moveTo(mouse.x, mouse.y);
        if (scribble_on === true) {
            overlay.addEventListener('mousemove', scribbleMode);
        } else {
            overlay.addEventListener('mousemove', normalMode);
        }
    });
    document.addEventListener('mouseup', function (e) {
        if (scribble_on === true) {
            overlay.removeEventListener('mousemove', scribbleMode);
        } else {
            overlay.removeEventListener('mousemove', normalMode);
        }
    });
}
$("#sketch").resizable(
    {
        minWidth: 200,
        minHeight: 200,
        maxWidth: 1000,
        maxHeigth: 1000,
        start:
            function(event, ui) {
                canvassave = new Image();
                overlaysave = new Image();
                canvassave.src = canvas.toDataURL();
                overlaysave.src = overlay.toDataURL();
            },
        resize:
            function(event, ui) {
                canvas.width = $("#sketch").width();
                canvas.height = $("#sketch").height();
                overlay.width = $("#sketch").width();
                overlay.height = $("#sketch").height();
                document.getElementById('canvasx').innerHTML=$('#sketch').width();
                document.getElementById('canvasy').innerHTML=$('#sketch').height();
                ctx.drawImage(canvassave, 0, 0);
                otx.drawImage(overlaysave, 0, 0);
            }
    }
);
$('#color_picker').ColorPicker(
    {
        flat: true,
        onChange: function (hsb, hex, rgb) {
           paint_color = '#' + hex;
        },
        color: '000'
    }
);
