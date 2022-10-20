const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasTwo = document.getElementById('canvastwo');
const ctxTwo = canvasTwo.getContext('2d');
const button = document.getElementById('button');

points = [];
pointsEnd = [];
let isDrawing = false;
let x = 0;
let y = 0;
let xe, ye;
let pointxx;
let pointyy;
let A,B,C;





canvas.addEventListener( 'mousedown', (e) => {
    points.push({x:e.offsetX, y:e.offsetY});    
    x = e.offsetX;
    y = e.offsetY;
   isDrawing = true;
   
})

canvas.addEventListener( 'mouseup', (e) => {
    pointsEnd.push({x:e.offsetX, y:e.offsetY});    
    xe = e.offsetX;
    ye = e.offsetY;
    paintTwo();      
    isDrawing = false;
})

canvas.addEventListener( 'mousemove', (e) => {
    if (isDrawing) {
        xm = e.offsetX;
        ym = e.offsetY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);        
        paint(ctx, x, y, xm, ym);
        for(let i = 0; i < points.length; i++) {
            tempCheck(ctx, points[i], pointsEnd[i], {x: x, y: y}, {x: xm, y: ym});        
        }
        
    }
    
})

function paintTwo () {
    for(let i = 0; i < points.length; i++) {
        paint(ctxTwo, points[i].x, points[i].y, pointsEnd[i].x, pointsEnd[i].y);
        tempCheck(ctxTwo, points[i], pointsEnd[i], {x: x, y: y}, {x: xe, y: ye});         
    }
    
}

function paint (context, x1, y1, x2, y2) {   
    
    context.beginPath();
    context.moveTo(x1, y1);    
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();      
        
}
button.addEventListener('click', collapse)    
    
 function collapse() {   
    animate({
        duration: 3000,
    timing(timeFraction) {
        return timeFraction;
    },
    draw(progress) {
        ctxTwo.strokeStyle = "white";
        ctxTwo.lineWidth = '5';        
        for(let i = 0; i < points.length; i++) {
            equationOfTheLine(points[i], pointsEnd[i])
            // let xc = Math.abs(pointsEnd[i].x - points[i].x) / 2 + points[i].x;
            // let ycc = (-C - A*xc*progress) / B;
            // paint(ctxTwo, points[i].x, points[i].y, xc*progress, ycc);
            // paint(ctxTwo, pointsEnd[i].x, pointsEnd[i].y, xc*progress, ycc);
            let yc = (-C - A*pointsEnd[i].x*progress) / B;
            paint(ctxTwo, points[i].x, points[i].y, pointsEnd[i].x*progress, yc);            
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = '5';
        for(let i = 0; i < points.length; i++) {
            equationOfTheLine(points[i], pointsEnd[i]);            
            let yc = (-C - A*pointsEnd[i].x*progress) / B;
            paint(ctx, points[i].x, points[i].y, pointsEnd[i].x*progress, yc); 
        }        
    }
    })    
 }

function animate({timing, draw, duration}) {

    let start = performance.now();
  
    requestAnimationFrame(function animate(time) {

      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
  
      let progress = timing(timeFraction);
  
      draw(progress);
  
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
  
    });
}

function vek(ax,ay,bx,by)//векторное произведение
{
	return ax*by-bx*ay;
}
 
function crossingCheck(p1,p2,p3,p4) //проверка пересечения
{
	let v1,v2,v3,v4;
    
	v1=vek(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
	v2=vek(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
	v3=vek(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
	v4=vek(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
	if(v1*v2<0 && v3*v4<0) return true;
	else return false;
}
 
 function equationOfTheLine(p1,p2) //построение уравнения прямой Ax+By+C
 {
	  
	  A=p2.y-p1.y;                                            
      B=p1.x-p2.x;
      C=-p1.x*(p2.y-p1.y)+p1.y*(p2.x-p1.x);
 
 }
 
 function intersectionX(a1,b1,c1,a2,b2,c2)// поиск точки пересечения по Х
 {
	 let d,dx,pointx;
	 d=a1*b2-b1*a2;
	 dx=-c1*b2+b1*c2;
	 pointx=dx/d;
	 return pointx;
 }
 
 function intersectionY(a1,b1,c1,a2,b2,c2) //поиск точки пересечения по Y
 {
	 let d,dy,pointy;
	 d=a1*b2-b1*a2;
	 dy=-a1*c2+c1*a2;
	 pointy=dy/d;
	 return pointy;
 }
 
 function tempCheck(context, p1, pe1, p2, pe2)// проверка отрезков на пересечение
 {
	context.fillStyle = "red"; 
    for (let i = 0; i < points.length; i++) {
	    if(crossingCheck(p1, pe1, p2, pe2))
	    {
            let a1,b1,c1,a2,b2,c2;
            equationOfTheLine(p1, pe1);
            a1=A;b1=B;c1=C;
            equationOfTheLine(p2, pe2);
            a2=A;b2=B;c2=C;
            pointxx=intersectionX(a1,b1,c1,a2,b2,c2);
            pointyy=intersectionY(a1,b1,c1,a2,b2,c2);
            console.log(pointxx)
            context.arc(pointxx,pointyy,2,0,Math.PI*2,true);
            context.fill();            
	    }  
    }
 }

 