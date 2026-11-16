
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const brushSize = document.getElementById("brushSize");
const sizeValue = document.getElementById("sizeValue");
const penColor = document.getElementById("penColor");
const eraserButton = document.getElementById("eraserTool");
const undoButton = document.getElementById("undoButton");
const resetButton = document.getElementById("resetBoard");
const shapeTool = document.getElementById("shapeTool");

let isDrawing = false;
let isErasing = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let savedCanvas;
let curvePoints = [];
let isCreatingCurve = false;

let undoStack = [];
const maxUndo = 30;

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left - canvas.clientLeft)
            * canvas.width / canvas.clientWidth,
        y: (event.clientY - rect.top - canvas.clientTop)
            * canvas.height / canvas.clientHeight
    };
}

function saveState() {
    if (undoStack.length >= maxUndo) {
        undoStack.shift();
    }

    undoStack.push(
        ctx.getImageData(0, 0, canvas.width, canvas.height)
    );
}

function drawShape(type, x1, y1, x2, y2) {

    const width = x2 - x1;
    const height = y2 - y1;

    ctx.beginPath();

    if (type === "square") {
        const side = Math.max(Math.abs(width), Math.abs(height));
        const x = width < 0 ? x1 - side : x1;
        const y = height < 0 ? y1 - side : y1;

        ctx.rect(x, y, side, side);
    }

    else if (type === "rectangle") {
        ctx.rect(x1, y1, width, height);
    }

    else if (type === "line") {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }

    else if (type === "circle") {
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;

        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    }

    else if (type === "ellipse") {
        ctx.ellipse(
            x1 + width / 2,
            y1 + height / 2,
            Math.abs(width) / 2,
            Math.abs(height) / 2,
            0, 0, Math.PI * 2
        );
    }

    else if (type === "star") {
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;
        const outerRadius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        const innerRadius = outerRadius * 0.4;

        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / 5) * i - Math.PI / 2;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
    }

    ctx.stroke();
}

canvas.addEventListener("pointerdown", function(event) {
    event.preventDefault();

    const pos = getPosition(event);

    if (shapeTool.value === "curve") {

        if (curveStage === 0) {
            saveState();

            curveBase = ctx.getImageData(
                0, 0, canvas.width, canvas.height
            );

            curveStart = pos;
            curveEnd = pos;
            curveControl = pos;

            curveStage = 1;
        }

        else if (curveStage === 1) {
            curveEnd = pos;

            curveControl = {
                x: (curveStart.x + curveEnd.x) / 2,
                y: (curveStart.y + curveEnd.y) / 2
            };

            curveStage = 2;
        }

        else if (curveStage === 2) {
            curveControl = pos;

            previewCurve();

            curveStage = 0;
        }

        return;
    }

    isDrawing = true;
    canvas.setPointerCapture(event.pointerId);

    startX = pos.x;
    startY = pos.y;

    saveState();

    savedCanvas = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    if (shapeTool.value === "pen" || isErasing) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

canvas.addEventListener("pointermove", function(event) {

    const pos = getPosition(event);

    if (shapeTool.value === "curve" && curveStage > 0) {

        if (curveStage === 1) {
            curveEnd = pos;

            curveControl = {
                x: (curveStart.x + curveEnd.x) / 2,
                y: (curveStart.y + curveEnd.y) / 2
            };
        }

        else if (curveStage === 2) {
            curveControl = pos;
        }

        previewCurve();
        return;
    }

    if (!isDrawing) return;

    currentX = pos.x;
    currentY = pos.y;

    ctx.lineWidth = Number(brushSize.value);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = penColor.value;
    }

    const selectedShape = shapeTool.value;

    if (selectedShape === "pen" || isErasing) {
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
    } else {
        ctx.putImageData(savedCanvas, 0, 0);

        drawShape(
            selectedShape,
            startX,
            startY,
            currentX,
            currentY
        );
    }
});

function stopDrawing() {

    if (!isDrawing) return;

    isDrawing = false;
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);

brushSize.addEventListener("input", function() {
    sizeValue.textContent = brushSize.value;
});

eraserButton.addEventListener("click", function() {

    isErasing = !isErasing;

    eraserButton.textContent =
        isErasing ? "Eraser: ON" : "Eraser: OFF";
});

undoButton.addEventListener("click", function() {

    if (isDrawing) return;

    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
    }
});

resetButton.addEventListener("click", function() {

    if (isDrawing) return;

    saveState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function drawCurve(points) {

    ctx.beginPath();

    if (points.length < 2) return;

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {

        const previous = points[i - 1];
        const current = points[i];

        const midX = (previous.x + current.x) / 2;
        const midY = (previous.y + current.y) / 2;

        ctx.quadraticCurveTo(
            previous.x,
            previous.y,
            midX,
            midY
        );
    }

    const last = points[points.length - 1];

    ctx.lineTo(last.x, last.y);

    ctx.stroke();
}