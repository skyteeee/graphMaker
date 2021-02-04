function ugmInit() {
    let canvas = document.getElementById("graph_canvas");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width=width;
    canvas.height=height;
    if (!storage.getItem("GraphMaker")){
        storage.setItem("GraphMaker", JSON.stringify([]));
    } else {
        ugmLoad();
    }
    console.log("Loaded.")
}

function ugmLoad() {
    data.numbers=JSON.parse(storage.getItem("GraphMaker"));
    ugmDraw();
    ugmUpdateList();
}

function ugmAddNumber() {
    let number = document.getElementById("input").value;
    if (number !== "") {
        data.numbers.push(parseFloat(number));
        ugmUpdateAll();
    }

}

function ugmUpdateList() {
    let list = document.getElementById("list");
    list.innerHTML="";
    for (let value of data.numbers){
        let string = document.createElement("li");
        string.innerText = value;
        list.appendChild(string);
    }
}

function ugmUpdateStorage() {
    storage.setItem("GraphMaker", JSON.stringify(data.numbers));
    console.log("Successfully updated storage.");
}

function ugmUndo() {
    data.numbers.pop();
    ugmUpdateAll();
}

function ugmClearTable() {
    data.numbers=[];
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

    if (arrayLength!==0) {
        if (arrayLength === 1) {
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, height / 75, 0, Math.PI * 2);
            ctx.fill();
        } else {
            let biasX = 1.5 * width / 100;
            let biasY = 4 * height / 100;
            width = width - (biasX * 2);
            height = height - (biasY * 2);
            let xStep = width / (arrayLength - 1);
            let maxNum = Math.max(...data.numbers);
            let min = Math.min(...data.numbers);
            let max = maxNum - min;
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
};

let storage = window.localStorage;

window.onload = ugmInit;

console.log("Initializing");