var canvas = document.getElementById('canvas'),
    FRAME_WIDTH = canvas.width,
    FRAME_HEIGHT = canvas.height,
    UNIT_SIZE = 20; //1 cm mis à l'échèlle de 20px pour la simulation

const STEP = 5;


var CIRCLE_X = -(2 * UNIT_SIZE),
    CIRCLE_Y = -(2 * UNIT_SIZE),
    GDOT_X = -(2 * UNIT_SIZE),
    GDOT_Y = -(4 * UNIT_SIZE),
    LINE_X1 = 0,
    LINE_Y1 = (10 * UNIT_SIZE),
    LINE_X2 = 0,
    LINE_Y2 = -(10 * UNIT_SIZE);

var interval;

var mesPoints = [];

var ctx = canvas.getContext('2d');
ctx.translate(FRAME_WIDTH / 2, FRAME_HEIGHT / 2);

start();
setTimeout(stop, 5000);

//Démarre la simulation
function start() {
    interval = setInterval(draw, 50);
}

//Arrête la simulation
function stop() {
    clearInterval(interval);
}

/*
* trouve les intersections en se basant sur le système d'équation
formée par :
(1) y = mx + p
(2) R^2 = (x - a)^2 + (y - b)^2 
*/

// function trouverIntersection(rayon, centreX, centreY, penteM, exartY) {
//     const t = ecartY - centreY;
//     const delta = Math.pow((centreX - (penteM * t)), 2) - ((1 + Math.pow(penteM, 2)) * (Math.pow(t, 2) - Math.pow(rayon, 2)));
//     if (delta < 0) {
//         return [] // aucune intersection
//     }
//     var arrayPoint = []
//     var x1 = (centreX - (penteM * t)) + Math.sqrt(delta),
//         x2 = (centreX - (penteM * t)) - Math.sqrt(delta);
//     arrayPoint.push([x1, penteM * x1 + exartY]);
//     arrayPoint.push([x2, penteM * x2 + exartY]);
//     return arrayPoint;
// }


//affiche un cercle à l'écran
function drawCircle() {
    ctx.beginPath();
    ctx.arc(CIRCLE_X, CIRCLE_Y, 2 * UNIT_SIZE, 0, 2 * Math.PI, false);//(x,y) = (-2, 2)
    ctx.closePath();
    ctx.fillStyle = 'blue';
    //ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

//affiche le point G donnée en vert
function drawGDot() {
    ctx.beginPath();
    ctx.arc(GDOT_X, GDOT_Y, 2, 0, 2 * Math.PI, false);//(x,y) = (-4, 4)
    //ctx.fillStyle = 'green';
    //ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'green';
    ctx.stroke();
}

// affiche le segment de droite de 10cm à l'écran (déssine sur le canevas)
function drawAxe() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue'
    ctx.moveTo(LINE_X1, LINE_Y1);
    ctx.lineTo(LINE_X2, LINE_Y2);
    ctx.stroke();
}

function afficherLaCourbe() {
    if(mesPoints.length <= 0){
        return;
    }
	ctx.beginPath();
    ctx.moveTo(mesPoints[0][0], mesPoints[0][1]);
	var i  = 0;
    for (i = 1; i < mesPoints.length - 2; i++) {
        var xc = (mesPoints[i][0] + mesPoints[i + 1][0]) / 2;
        var yc = (mesPoints[i][1] + mesPoints[i + 1][1]) / 2;
        ctx.quadraticCurveTo(mesPoints[i].x, mesPoints[i].y, xc, yc);
    }
	if(i > mesPoints.length){
		ctx.quadraticCurveTo(mesPoints[i][0], mesPoints[i][1], mesPoints[i + 1][0], mesPoints[i + 1][1]);
	}
	ctx.stroke();
    // curve through the last two points
}

// affiche la distribution des points d'intersection
function drawScatterPlot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
}

// vérifie si le point  est sur le cercle en se basant sur 
// l'équation du cercle R^2 = (x - a)^2 + (y - b)^2 (a,b) etant les coordonnées du centre du cercle
// function pointSurLeCercle(p, c) {
//     var result = (p.x - c.x) ^ 2 + (p.y - c.y) ^ 2;
//     return Math.round(result) == c.r || Math.ceil(result) == c.r;
// }

var lastAngle = Math.PI / STEP

function draw() {
    //Ajouter cette ligne permet de voir le cercle rouler :) :) :)
    ctx.clearRect(-(FRAME_WIDTH / 2), -(FRAME_HEIGHT / 2), FRAME_WIDTH, FRAME_HEIGHT);
    //
    ctx.beginPath();
    drawCircle();
    drawAxe();
    drawGDot();
    
	afficherLaCourbe();
	
    var cercle = new Circle(CIRCLE_X, CIRCLE_X, (2 * UNIT_SIZE));
    var segment = new LineSegment(LINE_X1, LINE_Y1, LINE_X2, LINE_Y2);
    var p = lineSegmentCircleIntersection(segment, cercle);
    if (p.length > 0) {
        p.forEach(point => {
			mesPoints.push([point.x, point.y]);
			//console.log(mesPoints);
            drawScatterPlot(point.x, point.y, 'red');
        });
    }

    CIRCLE_X += STEP;
    CIRCLE_Y += STEP * Math.sin(Math.PI / 6);

    //
    GDOT_X = CIRCLE_X + ((2 * UNIT_SIZE) * Math.cos(lastAngle + Math.PI / 6));
    GDOT_Y = CIRCLE_Y + ((2 * UNIT_SIZE) * Math.sin(lastAngle + Math.PI / 6));

    lastAngle += Math.PI / 6;
    // //
    LINE_X1 = LINE_X1 + STEP * 2;
    LINE_Y1 = LINE_Y1 - STEP * 2;

    LINE_X2 = LINE_X2 - STEP * 2;
    LINE_Y2 = LINE_Y2 + STEP * 2;

    var pointCercleG = new Point(GDOT_X, GDOT_Y);

    if (isPointSegmentIntersection(pointCercleG, segment)) {
        drawScatterPlot(pointCercleG.x, pointCercleG.y, 'green');
    };
    //   
}

