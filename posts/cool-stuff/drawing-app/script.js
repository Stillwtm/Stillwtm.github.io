const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImg = document.querySelector('.save-img'),
ctx = canvas.getContext('2d');

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = 'brush',
selectedColor = '#000',
brushWidth = 5;

const setCanvasBackground = () => {
    // 将canvas背景设置成白色，保存的图片就不是透明背景了
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
};

window.addEventListener('load', () => {
    // 调整canvas大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if (fillColor.checked) {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();  // 重新设置起点
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // 复制canvas的数据作为snapshot暂存，可以防止奇怪的拖动效果
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    switch (selectedTool) {
        case 'eraser':
            ctx.strokeStyle = '#fff';
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY);  // 画线
            ctx.stroke();  // 显示出来
            break;
        case 'rectangle':
            drawRect(e);
            break;
        case 'circle':
            drawCircle(e);
            break;
        case 'triangle':
            drawTriangle(e);
            break;
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveImg.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => isDrawing = false);
