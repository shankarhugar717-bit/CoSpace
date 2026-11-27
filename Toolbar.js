canvas=document.getElementById("main");
canvas.width=1100;
canvas.height=700;
canvas2=document.getElementById("preview");
canvas2.width=1100;
canvas2.height=700;
ctx=canvas.getContext("2d");
ctx2=canvas2.getContext("2d");
let selectedshape="";
btnrect=document.getElementById("rect-btn");
btncircle=document.getElementById("circle-btn");
btnline=document.getElementById("line-btn");
btnerase=document.getElementById("erase-btn");  
btnheart=document.getElementById("heart-btn");
btnrange=document.getElementById("h-range");
btntri=document.getElementById("tri-btn");
btnselect=document.getElementById("select-btn");
let shapes=[];
let selectedobj=-1;
btnrange.addEventListener("input",function(){
    if(selectedobj!=-1){
        let shape=shapes[selectedobj];
        if(shape.type=="heart"){
            shape.size=Number(btnrange.value);
            redraw();
        }
        else if(shape.type=="rectangle"){
            let ratio=shape.height/shape.width;
            shape.width=Number(btnrange.value);
            shape.height=shape.width*ratio;
            redraw();
        }
        else if(shape.type=="circle"){
            shape.radius=btnrange.value
            redraw();
        }
        else if(shape.type=="triangle"){
            let width=shape.x2-shape.x1;
            let  height=shape.y2-shape.y1;
            shape.x2=shape.x1+width+Number(btnrange.value);
            shape.y2=shape.y1+width+Number(btnrange.value);
            redraw();
        }
    }
});
btncircle.addEventListener("click",function(){
    if(selectedshape=="circle"){
            selectedshape="";
        }
        else{
        selectedshape="circle";
        }
});
btnrect.addEventListener("click",function(){ 
    if(selectedshape=="rectangle"){
            selectedshape="";
        }
        else{
        selectedshape="rectangle";
        }
});
btnline.addEventListener("click",function(){
    if(selectedshape=="line"){
            selectedshape="";
        }
        else{
        selectedshape="line"
        }
});
btnerase.addEventListener("click",function(){
    if(selectedshape=="erase"){
            selectedshape="";
        }
        else{
        selectedshape="erase";
        }
});
btnheart.addEventListener("click",function(){
    if(selectedshape=="heart"){
        selectedshape="";
    }
    else{
        selectedshape="heart";
    }
});
btntri.addEventListener("click",function(){
    if(selectedshape=="triangle"){
        selectedshape="";
    }
    else{
        selectedshape="triangle";
    }
});
btnselect.addEventListener("click",function(){
    if(selectedshape=="select"){
        selectedshape="";
    }
    else{
        selectedshape="select";
    }
});
let isdrawing=false;
let startx,starty;

canvas.addEventListener('mousedown',function(event){
    if(selectedshape=="rectangle" || selectedshape=="circle"||selectedshape=="line"||selectedshape=="erase"||selectedshape=="triangle"||selectedshape=="select"){
        let rect=canvas.getBoundingClientRect();
        startx=(event.clientX-rect.left)*(canvas.width/rect.width);
        starty=(event.clientY-rect.top)*(canvas.height/rect.height);
        isdrawing=true;
    }
});
canvas.addEventListener("click",function(event){
    if(selectedshape=="heart"){
        let ctx=canvas.getContext("2d");
        let rect=canvas.getBoundingClientRect();
        startx=(event.clientX-rect.left)*(canvas.width/rect.width);
        starty=(event.clientY-rect.top)*(canvas.height/rect.height);
        let size=Number(btnrange.value);
        let x=startx;
        let y=starty;
        shapes.push({
            type:"heart",
            x:x,
            y:y,
            size:size,
        });
        ctx.beginPath();
        ctx.moveTo(x,y-size/4);
        ctx.bezierCurveTo(x-0.5*(size),y-0.5*(size),x-size,y+0.25*(size),x,y+size);
        ctx.bezierCurveTo(x+size,y+0.25*(size),x+0.5*(size),y-0.5*(size),x,y-size/4);
        ctx.stroke();
    }
});
canvas.addEventListener('mousemove',function(event){
    if(isdrawing){
    rect=canvas.getBoundingClientRect();
    currx=(event.clientX-rect.left)*(canvas.width/rect.width);
    curry=(event.clientY-rect.top)*(canvas.height/rect.height);
   if(selectedshape=="rectangle"){
    width=currx-startx;
    height=curry-starty;
    ctx2.strokeStyle = "black";
    ctx2.lineWidth = 2;
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
    ctx2.strokeRect(startx,starty,width,height);
    }
    else if(selectedshape=="circle"){
        let radius=Math.sqrt((currx-startx)**2+(curry-starty)**2);
        ctx2.strokeStyle="black";
        ctx2.lineWidth=2;
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx2.beginPath();
        ctx2.arc(startx,starty,radius,0,2*Math.PI);
        ctx2.stroke();
    }
    else if(selectedshape=="line"){
        ctx2.strokeStyle="black";
        ctx2.lineWidth=2;
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx2.beginPath();
        ctx2.moveTo(startx,starty);
        ctx2.lineTo(currx,curry);
        ctx2.stroke();
    }
    else if(selectedshape=="erase"){
        ctx.clearRect(currx-10,curry-10,20,20);
    }
    else if(selectedshape=="triangle"){
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx2.beginPath();
        ctx2.moveTo(startx,starty);
        ctx2.lineTo(currx,starty);
        ctx2.lineTo(startx+(currx-startx)/2,curry);
        ctx2.closePath();
        ctx2.stroke();
    }
}
});

canvas.addEventListener('mouseup',function(event){
    if(isdrawing==true){
        rect=canvas.getBoundingClientRect();
        let currx=(event.clientX-rect.left)*(canvas.width/rect.width);
        let curry=(event.clientY-rect.top)*(canvas.height/rect.height);
       if(selectedshape=="rectangle"){
        let width=currx-startx;
        let height=curry-starty;
        shapes.push({
            type:"rectangle",
            width:width,
            height:height,
            x:startx,
            y:starty,
        });
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx.strokeStyle="black";
        ctx.lineWidth=2;
        ctx.strokeRect(startx,starty,width,height);
        }


        else if(selectedshape=="circle"){
        let width=currx-startx;
        let height=curry-starty;
        let radius=Math.sqrt((width)**2+(height)**2);
        shapes.push({
            type:"circle",
            radius:radius,
            x:startx,
            y:starty,
        });
        ctx.strokeStyle="black";
        ctx.lineWidth=2;
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx.beginPath();
        ctx.arc(startx,starty,radius,0,2*Math.PI)
        ctx.stroke();
        }


        else if(selectedshape=="line"){
        ctx.strokeStyle="black";
        shapes.push({
            type:"line",
            x1:startx,
            y1:starty,
            x2:currx,
            y2:curry,
        });
        ctx.lineWidth=2;
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx.beginPath();
        ctx.moveTo(startx,starty);
        ctx.lineTo(currx,curry);
        ctx.stroke();
        }
        else if(selectedshape=="triangle"){
            ctx2.clearRect(0,0,canvas2.width,canvas2.height);
            ctx.beginPath();
            shapes.push({
            type:"triangle",
            x1:startx,
            y1:starty,
            x2:currx,
            y2:curry,
            });
            ctx.moveTo(startx,starty);
            ctx.lineTo(currx,starty);
            ctx.lineTo(startx+(currx-startx)/2,curry);
            ctx.closePath();
            ctx.stroke();
        }
        else if(selectedshape=="select"){
            selectedobj=-1;
        for(let i=0;i<shapes.length;i++){
            let shape=shapes[i];
            if(shape.type=="rectangle"){
                if(startx>=Math.min(shape.x,shape.x+shape.width)&&startx<=Math.max(shape.x,shape.x+shape.width)&&starty>=Math.min(shape.y,shape.y+shape.height)&&starty<=Math.max(shape.y,shape.y+shape.height)){
                selectedobj=i;
                }
            }   
            else if(shape.type=="circle"){
                let dist=Math.sqrt((shape.x-startx)**2+(shape.y-starty)**2);
                if(dist<=shape.radius){
                    selectedobj=i;
                }
            }
            else if(shape.type=="line"){
                let dx = shape.x2 - shape.x1;
                let dy = shape.y2 - shape.y1;
                let t = ((startx-shape.x1)*dx + (starty-shape.y1)*dy) / (dx*dx + dy*dy);
                t = Math.max(0, Math.min(1, t));
                let closestX = shape.x1 + t*dx;let closestY = shape.y1 + t*dy;
                let dist = Math.sqrt(
                (startx-closestX)**2 + (starty-closestY)**2
                );
                if(dist <= 5){
                selectedobj = i;
                }
            }
            else if(shape.type=="heart"&&((startx>=shape.x-shape.size)&&(startx<=shape.x+shape.size)&&(starty>=shape.y-shape.size/2)&&(starty<=shape.y+shape.size))){
                selectedobj=i;
            }
            else if(shape.type=="triangle"&&((startx>=Math.min(shape.x1,shape.x2)&&startx<=Math.max(shape.x1,shape.x2)&&starty>=Math.min(shape.y1,shape.y2)&&starty<=Math.max(shape.y1,shape.y2)))){
                selectedobj=i;
            }
            redraw();
    }
    }
        isdrawing=false;
    }
 });
 function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth=2;
    for(let i=0;i<shapes.length;i++){
        let shape=shapes[i];
        if(i==selectedobj){
            ctx.strokeStyle="blue";
        }
        else{
            ctx.strokeStyle="black";
        }
        if(shape.type=="rectangle"){
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
        else if(shape.type=="circle"){
            ctx.beginPath();
            ctx.arc(shape.x,shape.y,shape.radius,0,2*Math.PI);
            ctx.stroke();
        }
        else if(shape.type=="heart"){
            ctx.beginPath();
            ctx.moveTo(shape.x,shape.y-shape.size/4);
            ctx.bezierCurveTo(shape.x-0.5*(shape.size),shape.y-0.5*(shape.size),shape.x-shape.size,shape.y+0.25*(shape.size),shape.x,shape.y+shape.size);
            ctx.bezierCurveTo(shape.x+shape.size,shape.y+0.25*(shape.size),shape.x+0.5*(shape.size),shape.y-0.5*(shape.size),shape.x,shape.y-shape.size/4);
           ctx.stroke();
        }
        else if(shape.type=="triangle"){
            ctx.beginPath();
            ctx.moveTo(shape.x1,shape.y1);
            ctx.lineTo(shape.x2,shape.y1);
            ctx.lineTo(shape.x1+(shape.x2-shape.x1)/2,shape.y2);
            ctx.closePath();
            ctx.stroke();
        }
        else if(shape.type=="line"){
            ctx.beginPath();
            ctx.moveTo(shape.x1,shape.y1);
            ctx.lineTo(shape.x2,shape.y2);
            ctx.stroke();
        }
    }
 };
   