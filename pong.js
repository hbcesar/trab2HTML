var canvas;
var ctx;
var timeBefore;
var vidas = 5;
var vitorias = 0;
var animate = true;

var ball1;
var ball2;
var balls;
var paddle;
var controller;
var brickData;
var bricks;
var ballImg;
var numBolas = 1;

window.onload = function() {
	
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	
	document.addEventListener('keydown', keyHandler);
	document.addEventListener('keyup', keyHandler);

	ballImg = document.createElement('img');
	ballImg.src = 'bola.png';

	var menu = document.getElementById("menu");
	var bplay = document.getElementById("bplay");
    var bpause = document.getElementById("bpause");
    var brestartar = document.getElementById("restartar");

    menu.addEventListener('click', abrirMenu);
    bplay.addEventListener('click', continuarAnimacao);
    bpause.addEventListener('click', pararAnimacao);
    brestartar.addEventListener('click', restartar);
	
	ball = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: 0.2,
		dx: 1,
		dy: -1,
		color: "blue"
	};
	
	ball2 = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: 0.2,
		dx: 1,
		dy: -1,
		color: "green"
	};

	balls = [];
	balls[0] = ball;
	balls[1] = ball2;

	paddle = {
		x:canvas.width/2 - 35,
		y:canvas.height - 10,
		width:70,
		height:10,
		speed:0.5
	};
	
	brickData = {
		count:7,
		width:60,
		height:10,
		left:30,
		top:40
	};
	
	controller = {
		right:false,
		left:false
	};
	
	restoreBricks();

	requestAnimationFrame(function(timeStamp) { timeBefore = timeStamp; })
	requestAnimationFrame(onFrame);
}

function onFrame(timeStamp) {
	var delta = getDeltaTime(timeStamp);
	
	if(animate)
		update(delta);
	draw();
	
	requestAnimationFrame(onFrame);
}

function update(delta) {
	
	//ball behaviour
	for(var i=0; i<numBolas; i++){
		balls[i].x += balls[i].speed*balls[i].dx*delta;
		balls[i].y += balls[i].speed*balls[i].dy*delta;
		if (balls[i].x + balls[i].radius > canvas.width)
			balls[i].dx = -1;
		else if (balls[i].x - balls[i].radius < 0)
			balls[i].dx = 1;
		if (balls[i].y - balls[i].radius < 0)
			balls[i].dy = 1;
		else if (balls[i].y + balls[i].radius > canvas.height - paddle.height) {
			if (balls[i].x > paddle.x && balls[i].x < paddle.x + paddle.width)
				balls[i].dy = -1;
			else if (balls[i].y > canvas.height + balls[i].radius) {
				console.log('Cadê essa feminilidade?');

				var vhtml = document.getElementById('vidas');
				vidas -= 1;
				vhtml.innerHTML = " &nbsp; Vidas Restantes: " + vidas;
				//document.location.reload();
				if(vidas >=0){
					restore();
				} else {
					animate = false;
					abrirDialogo();
				}
			}
		}
	}
	
	//paddle behaviour
	if (controller.right && paddle.x + paddle.width < canvas.width)
		paddle.x += paddle.speed*delta;
	if (controller.left && paddle.x > 0)
		paddle.x -= paddle.speed*delta;
	
	//brick behaviour
	var brick;
	for (var i=0; i<bricks.length; i++) {
		brick = bricks[i];
		
		if (ball.x > brick.x && ball.x < brick.x + brick.width
		&& ball.y > brick.y && ball.y < brick.y + brick.height) {
			bricks.splice(i, 1);
			ball.dy *= -1;
		}
	}
	
	//win condition
	if (bricks.length === 0) {
		alert('A senhora é destruidora mesmo, viu viado?!');
		var vhtml = document.getElementById('vitorias');
		vitorias += 1;
		vhtml.innerHTML = "&nbsp; Vitorias: " + vitorias;
		//document.location.reload();
		restore();

	}
}

function continuarAnimacao() {
	animate = true;
}

function pararAnimacao() {
	animate = false;
}

function restartar() {
	document.location.reload();
}

function abrirMenu() {
	animate = false;
	document.getElementById('quadro').innerHTML = '<a href="#openModal" id="link">'
	+ '</a><div id="openModal" class="modalDialog">'
	+ '<div><a href="#close" title="Close" class="close" id="close">X</a>'
	+ '<p id="dialogo"><br><b>Menu</b><br></p>'
	+ '<p><i><br>Paddle</i></p>'
	+ '<p>Tamanho do Paddle: <button id="aumentarTamPaddle">+</button> <button id="diminuirTamPaddle">-</button><br>'
	+ '<p>Velocidade do Paddle: <button id="aumentarVelPaddle">+</button> <button id="diminuirVelPaddle">-</button><br><br>'
	+ '<p><i><br>Bola</i></p>'
	+ '<p>Tamanho da Bola: <button id="aumentarTamBola">+</button> <button id="diminuirTamBola">-</button><br>'
	+ '<p>Velocidade da Bola: <button id="aumentarVelBola">+</button> <button id="diminuirVelBola">-</button><br>';

	var el = document.getElementById('link');

	if (document.createEvent) {
    	var event = document.createEvent("MouseEvents");
    	event.initEvent("click", true, true);
    	el.dispatchEvent(event);
	}

	var baumentarTamPaddle = document.getElementById('aumentarTamPaddle');
	var bdiminuirTamPaddle = document.getElementById('diminuirTamPaddle');
	var baumentarVelPaddle = document.getElementById('aumentarVelPaddle');
	var bdiminuirVelPaddle = document.getElementById('diminuirVelPaddle');

	var baumentarTamBola = document.getElementById('aumentarTamBola');
	var bdiminuirTamBola = document.getElementById('diminuirTamBola');
	var baumentarVelBola = document.getElementById('aumentarVelBola');
	var bdiminuirVelBola = document.getElementById('diminuirVelBola');

	var bclose = document.getElementById('close');

	baumentarTamPaddle.addEventListener('click', modificarPaddle);
	bdiminuirTamPaddle.addEventListener('click', modificarPaddle);
	baumentarVelPaddle.addEventListener('click', modificarPaddle);
	bdiminuirVelPaddle.addEventListener('click', modificarPaddle);

	baumentarTamBola.addEventListener('click', modificarBola);
	bdiminuirTamBola.addEventListener('click', modificarBola);
	baumentarVelBola.addEventListener('click', modificarBola);
	bdiminuirVelBola.addEventListener('click', modificarBola);

	bclose.addEventListener('click', continuarAnimacao);
}

function modificarPaddle(event) {
	if(event.target.id == 'aumentarTamPaddle')
		paddle.width += 5;
	else if(event.target.id == 'diminuirTamPaddle'){
		if(paddle.width > 0)
			paddle.width -= 5;
	} else if(event.target.id == 'aumentarVelPaddle')
		paddle.speed += 0.5;
	else if(event.target.id == 'diminuirTamPaddle'){
		if(paddle.speed >0)
			paddle.speed -= 0.5;
	}
}

function modificarBola(event) {
	if(event.target.id == 'aumentarTamBola')
		ball.radius += 5;
	else if(event.target.id == 'diminuirTamBola'){
		if(ball.radius > 0)
			ball.radius -= 5;
	} else if(event.target.id == 'aumentarVelBola')
		ball.speed += 0.2;
	else if(event.target.id == 'diminuirVelBola'){
		if(ball.speed >= 0.4)
			ball.speed -= 0.2;
	}
}

function abrirDialogo() {
	document.getElementById('quadro').innerHTML = '<a href="#openModal" id="link">'
	+ '</a><div id="openModal" class="modalDialog">'
	+ '<div><a href="#close" title="Close" class="close">X</a>'
	+ '<p id="dialogo"> <br> Você não possui mais vidas. <br> Uma peninha nénon?</p>'
	+ '<img src="perdeu.jpg" height="250" width="250">'
	+ '<p><br><br> <a href="javascript:document.location.reload();">Reiniciar</a></div></div>';

	var el = document.getElementById('link');

	if (document.createEvent) {
    	var event = document.createEvent("MouseEvents");
    	event.initEvent("click", true, true);
    	el.dispatchEvent(event);
	}
}

function restoreBricks() {
	brickData.count = 7;
	
	bricks = [];
	for (var i=0; i<brickData.count; i++) {
		bricks[i] = {
			x: (i+1)*brickData.left + i*brickData.width,
			y: brickData.top,
			width:brickData.width,
			height:brickData.height
		};
	}
}

function restore() {
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;
	ball.dx = 1;
	ball.dy = -1;

	drawBall();
	restoreBricks();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBall();
	drawPaddle();
	drawBricks();
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
	ctx.fillStyle = ball.color;
	ctx.fill();
    //ctx.drawImage(ballImg, ball.x-ball.radius, ball.y, 2*ball.radius, 1.5*ball.radius);
    ctx.closePath();

    if(numBolas == 2){
		ctx.beginPath();
		ctx.arc(ball2.x, ball2.y, ball2.radius, 0, Math.PI*2, true);
		ctx.fillStyle = ball2.color;
		ctx.fill();
	    //ctx.drawImage(ballImg, ball.x-ball.radius, ball.y, 2*ball.radius, 1.5*ball.radius);
		ctx.closePath();
	}
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	var brick;
	for (var i=0; i<bricks.length; i++) {
		brick = bricks[i];
		ctx.beginPath();
		ctx.rect(brick.x, brick.y, brick.width, brick.height);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.closePath();
	}
}

function keyHandler(event) {
	if (event.key === 'ArrowRight')
		controller.right = (event.type === 'keydown');
	if (event.key === 'ArrowLeft')
		controller.left = (event.type === 'keydown');
	if(event.key === ' ')
		numBolas = 2;
}

function getDeltaTime(timeStamp) {
	delta  = timeStamp - timeBefore;
	timeBefore = timeStamp;
	
	return delta;
}