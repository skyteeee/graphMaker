function ugmInit() {
    let canvas = document.getElementById("graph_canvas");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width=width;
    canvas.height=height;
    ugmLoad();
    console.log("Loaded.")
}

function ugmLoad() {
    if (storage.getItem("GraphMaker3")){
        data=JSON.parse(storage.getItem("GraphMaker3"));
        ugmDraw();
        ugmUpdateList();
    }
}

function ugmAddNumber() {
    let number = document.getElementById("input").value;
    if (number !== "") {
        data.numbers.push(parseFloat(number));
        data.xValues.push(Math.max(...data.xValues)+data.delta);
        ugmUpdateAll();
    }

}

function ugmDeleteSpecific(idx) {
    data.numbers.splice(idx, 1);
    data.xValues.splice(idx,1);
    ugmUpdateAll();
}

function ugmSpecialGraph (min, max, delta) {
    data.numbers=[];
    data.delta = delta;
    data.xValues=[];
    for (let x=min; x<=max; x+=delta) {
        let number = x*x*x*x*x+4*x*x*x*x+7*x*x-x+1;
        data.numbers.push(number);
        data.xValues.push(x);
    }
    ugmUpdateAll();
}

function ugmUpdateList() {
    let list = document.getElementById("list");
    list.innerHTML="";
    for (let idx in data.numbers){
        let value = data.numbers[idx];
        let string = document.createElement("li");
        let image = document.createElement("img");
        image.alt = "X";
        image.src = "omg/cross.png";
        image.onclick = () => {ugmDeleteSpecific(idx)};
        let div = document.createElement("div");
        string.innerText = value;
        string.appendChild(div);
        div.appendChild(image);
        list.appendChild(string);
    }
}

function ugmUpdateStorage() {
    storage.setItem("GraphMaker3", JSON.stringify(data));
    console.log("Successfully updated storage.");
}

function ugmUndo() {
    data.numbers.pop();
    data.xValues.pop();
    ugmUpdateAll();
}

function ugmClearTable() {
    data.numbers=[];
    data.xValues=[];
    ugmUpdateAll();
}

function ugmUpdateAll() {
    ugmDraw();
    ugmUpdateStorage();
    ugmUpdateList();
}

function ugmDraw() {
    let canvas = document.getElementById("graph_canvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let arrayLength = data.numbers.length;
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, width, height);

    let biasY = 4 * height / 100;
    let biasX = 1.5 * width / 100;
    let maxNum = Math.max(...data.numbers);
    let min = Math.min(...data.numbers);
    let max = maxNum - min;
    height = height - (biasY * 2);

    let value = 0-min;
    let zeroY = height - (height / max * value) + biasY;


    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    width = width - (biasX * 2);

    let xMax = Math.max(...data.xValues);
    let xMin = Math.min(...data.xValues);
    let xRange = xMax-xMin;

    let zeroX = (width / xRange * (0-xMin)) + biasX;

    ctx.beginPath();
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, height+(biasY*2));
    ctx.stroke();

    if (arrayLength!==0) {
        if (arrayLength === 1) {
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, height / 75, 0, Math.PI * 2);
            ctx.fill();
        } else {
            let xStep = width / (arrayLength - 1);
            if (max === 0) {
                max = 2 * min;
                min = 0;
            }

            ctx.fillStyle = "rgb(0,0,0)";
            for (let idx in data.numbers) {
                let value = data.numbers[idx] - min;
                ctx.beginPath();
                ctx.arc(Math.floor(xStep * idx + biasX), height - (height / max * value) + biasY, height / 75, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.moveTo(Math.floor(biasX), height - (height / max * (data.numbers[0] - min)) + biasY);
            for (let idx in data.numbers) {
                let value = data.numbers[idx] - min;
                ctx.lineTo(Math.floor(xStep * idx + biasX), height - (height / max * value) + biasY);
            }
            ctx.stroke();
        }
    }
}

let data = {
    numbers: [],
    xValues: [],
    delta:1,
};

let storage = window.localStorage;

window.onload = ugmInit;

console.log("Initializing");