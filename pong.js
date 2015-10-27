var canvas;
var ctx;
var timeBefore;
var vidas = 5;
var vitorias = 0;
var animate = true;

var ball;
var ball2;
var balls;
var paddle;
var controller;
var brickData;
var bricks;
var numBolas = 1;

window.onload = function() {
	
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	
	document.addEventListener('keydown', keyHandler);
	document.addEventListener('keyup', keyHandler);

	var menu = document.getElementById("menu");
	var bplay = document.getElementById("bplay");
    var bpause = document.getElementById("bpause");
    var brestartar = document.getElementById("restartar");

    menu.addEventListener('click', abrirMenu);
    bplay.addEventListener('click', continuarAnimacao);
    bpause.addEventListener('click', pararAnimacao);
    brestartar.addEventListener('click', restartar);
	
	//propriedades da ball 1
	ball = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: 0.2,
		dx: 1,
		dy: -1,
		color: "blue"
	};

	//propriedades da ball 2, criada ao pressionar a tecla espaco	
	ball2 = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: 0.2,
		dx: 1,
		dy: -1,
		color: "green"
	};

	//preenche manualmente o vetor com ball 1 e ball 2
	balls = [];
	balls[0] = ball;
	balls[1] = ball2;

	//propriedades do paddle
	paddle = {
		x:canvas.width/2 - 35,
		y:canvas.height - 10,
		width:70,
		height:10,
		speed:0.5
	};
	
	//propriedades dos bricks
	brickData = {
		count:7,
		width:60,
		height:10,
		left:30,
		top:40
	};
	
	//controlador do paddle
	controller = {
		right:false,
		left:false
	};
	
	restoreBricks();

	requestAnimationFrame(function(timeStamp) { timeBefore = timeStamp; })
	requestAnimationFrame(onFrame);
}

//funcao chamada frame a frame para 
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
				if(numBolas > 1){
					console.log("removeu");
					removerBola(balls[i].color);
				} else {
					var vhtml = document.getElementById('vidas');
					vidas -= 1;
					vhtml.innerHTML = " &nbsp; Vidas Restantes: " + vidas;
					//document.location.reload();
					if(vidas >=0){
						console.log("chamei restore");
						restore();
					} else {
						animate = false;
						abrirDialogoPerca();
					}
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
		
		for(var j=0; j<numBolas; j++){
			if (balls[j].x > brick.x && balls[j].x < brick.x + brick.width
			&& balls[j].y > brick.y && balls[j].y < brick.y + brick.height) {
				bricks.splice(i, 1);
				balls[j].dy *= -1;
			}
		}
	}
	
	//win condition
	if (bricks.length === 0) {
		var vhtml = document.getElementById('vitorias');
		vitorias += 1;
		vhtml.innerHTML = "&nbsp; Vitorias: " + vitorias;
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

//abre dialogo informando que jogador nao possui mais "vidas"
function abrirDialogoPerca() {
	document.getElementById('quadro').innerHTML = '<a href="#openModal" id="link">'
	+ '</a><div id="openModal" class="modalDialog">'
	+ '<div><a href="#close" title="Close" class="close">X</a>'
	+ '<p id="dialogo"> <br> Você não possui mais vidas. <br><br></p>'
	+ '<img src="perdeu.jpg" height="250" width="250">'
	+ '<p><br><br> <button><a href="javascript:document.location.reload();">Reiniciar</a></button></div></div>';

	var el = document.getElementById('link');

	if (document.createEvent) {
    	var event = document.createEvent("MouseEvents");
    	event.initEvent("click", true, true);
    	el.dispatchEvent(event);
	}
}

//abre dialogo parabenizando jogador pela sua vitoria
function abrirDialogoPerca() {
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

//recria bricks
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

//reseta todos os parametros de posicao das bolas e dos bricks, para que o jogo possa ser reiniciado
function restore() {

	balls[0] = ball;
	balls[1]= ball2;
	
	for(var i=0; i< 2; i++){
		balls[i].x = canvas.width/2;
		balls[i].y = canvas.height/2;
		balls[i].dx = 1;
		balls[i].dy = -1;	
	}

	numBolas = 1;

	drawBall();
	restoreBricks();
}

//desenha elementos no canvas
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBall();
	drawPaddle();
	drawBricks();
}

//funcao responsavel por desenhar a bola
function drawBall() {

	for(var i = 0; i < numBolas; i++) {
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI*2, true);
		ctx.fillStyle = balls[i].color;
		ctx.fill();
		ctx.closePath();
	}
}

//desenha paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();
}

//desenha bricks
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

//controlador de teclado, detecta se setas sao pressionadas (para mover o paddle)
//ou se espaco foi pressionada (para criar nova bola)
function keyHandler(event) {
	if (event.key === 'ArrowRight')
		controller.right = (event.type === 'keydown');
	if (event.key === 'ArrowLeft')
		controller.left = (event.type === 'keydown');
	if(event.key === ' ')
		numBolas = 2;
}

//corrige atualização de tempo do canvas
function getDeltaTime(timeStamp) {
	delta  = timeStamp - timeBefore;
	timeBefore = timeStamp;
	
	return delta;
}

//se apenas uma bola "cai", remove-a do canvas
function removerBola(cor) {
	if(cor == "blue"){
		balls[0] = balls[1];
	}

	numBolas -= 1;
}


//------- Move o Paddle em Relação ao Mouse ------
function readMouseMove(e){
	// var result_x = document.getElementById('x_result');
	// var result_y = document.getElementById('y_result');
	// result_x.innerHTML = e.clientX;
	// result_y.innerHTML = e.clientY;
	var oldx = e.clientX;
	console.log(e.clientX);
	console.log(e.clientY);

	if(e.clientX - oldx > 0){
		paddle.x = paddle.x - (e.clientX - oldx)/100;
	} else {
		//controller.right = true;
	}
}
document.onmousemove = readMouseMove;