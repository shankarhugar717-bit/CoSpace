canvas=document.getElementById("page");
canvas.width=1100;
canvas.height=700;
ctx=canvas.getContext("2d");
let selectedshape="";
btn=document.getElementById("rect-btn");
btn.addEventListener("click",function(){
selectedshape="rectangle";
});
let isdrawing="";
let startx,starty;
canvas.addEventListener('mousedown',function(event){
    if(selectedshape=="rectangle"){
        let rect=canvas.getBoundingClientRect();
        startx=(event.clientX-rect.left)*(canvas.width/rect.width);
        starty=(event.clientY-rect.top)*(canvas.height/rect.height);
        isdrawing=true;
    }
});

canvas.addEventListener('mousemove',function(event){
    if(isdrawing&&selectedshape=='rectangle'){
    rect=canvas.getBoundingClientRect();
    currx=(event.clientX-rect.left)*(canvas.width/rect.width);
    curry=(event.clientY-rect.top)*(canvas.height/rect.height);
    let width=currx-startx;
    let height=curry-starty;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeRect(startx,starty,width,height);
    }
});

canvas.addEventListener('mouseup',function(event){
    if(isdrawing==true){
        isdrawing=false;
    }
});

