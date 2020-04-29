
let values = [];

function randomGraph() {
    document.getElementById("valueset").value = "A,B,C,D,E,F,G";
    clickValueSet();

    arrayAdjacencyInput.forEach(function (val, i) {
        let oneCount = Math.floor(Math.random() * values.length - 3);
        let indexs = new Array();
        values.forEach((value, i) => {
            indexs.push(i);
        });

        for (let k = 0; k < oneCount; k++) {
            let indIndexs = Math.floor(Math.random() * indexs.length);
            let oneInd = indexs[indIndexs];
            indexs.splice(indIndexs, 1);
            arrayAdjacencyInput[i][oneInd].value = "1";
        }
    });
}

function clickValueSet() {
    values = splitValueSet();

    let isTrue = true;
    values.forEach(element => {
        if (element == "" || element.length > 1) {
            isTrue = false;
            return;
        }
    })
    if (values.length < 2 || values.length > 15){
        isTrue = false;
    } 
    for(let i = 0 ; i < values.length-1 ; i++){
        for(let j = i+1 ; j < values.length ; j++){
            if(values[i] == values[j]){
                isTrue = false;
                break;
            }
        }
    }
    if (!isTrue) {
        document.getElementById("adjacencymatrix").style.display = 'none';
        return;
    }
    e = "";
    arrayAdjacency = new Array(values.length);
    nodeList = new Array(values.length);

    displayAdjacencyMatrix();

    let a = getComputedStyle(document.getElementById("matrixdiv")).getPropertyValue('width');
    a = a.substring(0, a.length - 2);
    document.getElementById("matrixbutton").style.marginLeft = a - 35 + 'px';

    if (getComputedStyle(document.getElementById("simulation")).getPropertyValue('display') != "none") {
        document.getElementById("simulation").style.display = "none";
    }
}

function splitValueSet() {
    let stringValueSet = document.getElementById("valueset").value;
    let valueSet = stringValueSet.split(",")
    return valueSet;
}

let arrayAdjacencyInput;
function displayAdjacencyMatrix() {
    arrayAdjacencyInput = new Array(values.length);
    let grid = document.getElementById("grid-container");
    grid.innerHTML = "";
    document.getElementById("adjacencymatrix").style.display = 'block';

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(' + (values.length + 1) + ',' + '10px)';

    grid.style.gridGap = '13px';
    grid.style.gridRowGap = "3px"

    for (var i = -1; i < values.length; i++) {
        let tempDim = new Array(values.length);
        for (var j = -1; j < values.length; j++) {
            var element;
            if (i == -1 && j == -1) {
                element = document.createElement("span");
            } else if (i == -1) {
                element = document.createElement("span");
                element.innerHTML = values[j];
            } else if (j == -1) {
                element = document.createElement("span");
                element.innerHTML = values[i];
            }
            else {
                element = document.createElement("input");
                element.setAttribute("type", "text");
                element.value = "0";
                //İnputu diziye ver
                tempDim[j] = element;
                arrayAdjacencyInput[i] = tempDim;
            }
            element.className = "grid-item";
            grid.appendChild(element);
        }
    }


    arrayAdjacencyInput.forEach(function (val, i) {
        arrayAdjacencyInput[i].forEach(function (inp, j) {
            arrayAdjacencyInput[i][j].addEventListener('change', function () {
                if (document.getElementById("indirect").checked)
                    arrayAdjacencyInput[j][i].value = inp.value;

                if (!(inp.value == "1" || inp.value == "0")) {
                    inp.value = "0";
                    arrayAdjacencyInput[j][i].value = "0";
                }

            });
        })
    })
}

function changeRadios() {
    if (document.getElementById("indirect").checked) {
        arrayAdjacencyInput.forEach(function (val, i) {
            arrayAdjacencyInput[i].forEach(function (inp, j) {
                if (inp.value == "1")
                    arrayAdjacencyInput[j][i].value = "1";
            })
        })
    }
}

/*Kullanici bilgileri girdikten veya random graph olustuktan sonra*/
class Node {
    name = "";
    isVisited = false;
    popTime = 0;
    pushTime = 0;

    neighbors = new Array();
}

let arrayAdjacency;
let nodeList;
let e;
function clickMatrix() {
    e = "";
    arrayAdjacency = new Array(values.length);
    nodeList = new Array(values.length);
    document.getElementById("simulation").style.display = "block";
    window.location.href = "#simulation";
    matrixToAdjacencyArray();
    createNodes();
    createGraphDisplay();
    resetSimulation();

}

function matrixToAdjacencyArray() {
    arrayAdjacencyInput.forEach(function (val, i) {
        let tempList = new Array(values.length);
        arrayAdjacencyInput[i].forEach(function (inp, j) {
            tempList[j] = arrayAdjacencyInput[i][j].value;
            arrayAdjacency[i] = tempList;
        })
    })
}

function createNodes() {
    //Nodeları olustur
    for (let i = 0; i < values.length; i++) {
        let node = new Node();
        node.name = values[i];
        nodeList[i] = node;
    }

    //Komsulukları olustur ve E displayi için string olustur.
    arrayAdjacency.forEach(function (dim, i) {
        let neighbors = new Array();
        arrayAdjacency[i].forEach(function (val, j) {
            if (val == "1") {
                neighbors.push(nodeList[j]);
                e += "(" + values[i] + "," + values[j] + ")"
            }
        })
        nodeList[i].neighbors = neighbors;
    })

    document.getElementById("info").innerHTML = " G = (V,E) <br>V = {" + values + "} <br>E = {" + e + "}<br>";
}

let $ = go.GraphObject.make;
let diagram =
    $(
        go.Diagram,
        "myDiagramDiv",
        {
            "undoManager.isEnabled": true, layout: $(go.LayeredDigraphLayout, { direction: 0, layerSpacing: 10 })
        }
    );
let nodeDataArray;
let linkDataArray;
function createGraphDisplay() {
    diagram.nodeTemplate =
        $(
            go.Node,
            "Auto",
            { locationSpot: go.Spot.Center, rotatable: true },
            $(
                go.Shape,
                "ellipse",
                { fill: "white", desiredSize: new go.Size(45, 45)},
                new go.Binding("fill", "color"),
                new go.Binding("stroke","stroke"),
                new go.Binding("strokeWidth","strokeW"),
            ),
            $(
                go.TextBlock,
                { margin: 5 },
                new go.Binding("text", "key")
            )
        );
    if (document.getElementById("direct").checked) {
        diagram.linkTemplate =
            $(
                go.Link,
                { curve: go.Link.Bezier },  // Bezier curve
                $(
                    go.Shape,
                    { strokeWidth: 1.5 }
                ),
                $(
                    go.Shape,
                    new go.Binding("fromArrow", "fromArrow"),
                    { fill: null, segmentOrientation: go.Link.None },
                    new go.Binding("stroke", "stroke"),
                ),
                $(
                    go.Shape,
                    { toArrow: "Standard", fill: null }
                )
            );
    } else {
        diagram.linkTemplate =
            $(
                go.Link,
                { curve: go.Link.Bezier },  // Bezier curve
                $(
                    go.Shape,
                    { strokeWidth: 1.5 }
                )
            );
    }
    nodeDataArray = createNodeDataArray();
    linkDataArray = createLinkDataArray();
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

function createNodeDataArray() {
    let arr = new Array();
    for (let i = 0; i < values.length; i++) {
        arr.push(
            { key: values[i]}
        )
    }
    return arr;
}

function createLinkDataArray() {
    let arr = new Array();
    nodeList.forEach(node => {
        node.neighbors.forEach(neighbor => {
            if (document.getElementById("indirect").checked) {
                let isContain = false;
                arr.forEach(element => {
                    if (element.from == neighbor.name && element.to == node.name) {
                        isContain = true;
                        return;
                    }
                });
                if (!isContain) {
                    arr.push({ from: node.name, to: neighbor.name });
                }
            }
            else {
                let isContain = false;
                arr.forEach(function (element, i) {
                    if (element.from == neighbor.name && element.to == node.name) {
                        arr.splice(i, 1);
                        isContain = true;
                        return;
                    }
                });
                if (isContain) {
                    arr.push({ from: node.name, to: neighbor.name, fromArrow: "Backward", stroke: "black" });
                } else {
                    arr.push({ from: node.name, to: neighbor.name, fromArrow: "Standard", stroke: "transparent" });
                }
            }
        });
    });
    return arr;
}


let stack;
function clickRunDfs() {
    stack = new Array();
    count = 0;

    resetSimulation();
    let startVertexS = document.getElementById("startVertex").value;
    let node = findNodeByName(startVertexS);
    console.log(startVertexS);
   
    DFS(node);          //DFS Basladi
    //Animasyon Fonksiyonu;
    runAnimation();
    //DFS bitti
}

function resetSimulation() {
    nodeList.forEach(node => {
        node.isVisited = false;
        let nodeG = diagram.findNodeForKey(node.name);
        diagram.model.commit(function (m) {
            m.set(nodeG.data, "color", "white");
        }, "change color");
    });

    document.getElementById("desc").innerHTML = "";
    document.getElementById("visited").innerHTML = "";
    document.getElementById("stack").innerHTML = "";
    document.getElementById("myRange").value = 50;
    speed = 1500;
}


/**Algoritma */
let count = 0;
const DFS = (node) => {
    count++;
    pushNodeToStack(node)   //Stacke pushlandı.

    while (!isDeep(node)) {   //Dibe gelene (Ziyaret edilmeyen komşu kalmayana) kadar, rastgele komsular secerek git.
        let randomNeigbor = getRandomNotVisitedNeigbor(node);
        DFS(randomNeigbor);
    }

    //Dibe ulasti. Simdi poplayıp, stackin en üstündeki node'un diger ziyaret edilmeyenlerine bakacak.
    popNodeFromStack(node);
    if (stack.length != 0) {  //Stack zaten boş ise DFS bitmistir.
        DFS(stack[stack.length - 1]);
    }
}

function popNodeFromStack(node) {
    let isTaken = false;
    stack.forEach(element => {
        if (element == node) {
            isTaken = true;
            return;
        }
    });
    if (isTaken) {
        node.popTime = count;
        stack.pop(node);
    }
}

function pushNodeToStack(node) {
    let isTaken = false;
    stack.forEach(element => {
        if (element == node) {
            isTaken = true;
            return;
        }
    });
    if (!isTaken) {
        node.isVisited = true;
        node.pushTime = count;
        stack.push(node);
    }
}

function getRandomNotVisitedNeigbor(node) {
    let arrNotVisited = new Array();
    node.neighbors.forEach(element => {
        if (!element.isVisited) arrNotVisited.push(element);
    });
    let ind = Math.floor(Math.random() * arrNotVisited.length);
    return arrNotVisited[ind];
}

function isDeep(node) {
    let retBool = true;
    node.neighbors.forEach(element => {
        if (!element.isVisited) {
            retBool = false;
            return;
        }
    });
    return retBool;
}

function findNodeByName(name) {
    let retNode = null;
    nodeList.forEach(element => {
        if (element.name == name) {
            retNode = element;
        }
    });
    return retNode;
}



/**Animasyon */
let speed;
async function runAnimation(){
    let tempStack = new Array();

    let tempNodeList = nodeList.slice();
    tempNodeList.forEach(element=>{
        element.isVisited = false;
    })

    for(let i = 1 ; i <= count ; i++){
        let currentNode;
        let isPushed = false;
        
        let popedNode;
        let isPoped = false;
        
        tempNodeList.forEach(node => {
            if(node.pushTime == i){
                isPushed = true;
                node.isVisited = true;
                currentNode = node;
            }
            if(node.popTime == i){
                isPoped = true;
                popedNode = node;
            }
            
        });

        //Eklenen node varsa bunu ekrana bas, rengini degistir. (Onu kırmızı diğerlerini sarı)
        if(isPushed){
            tempStack.push(currentNode);

            document.getElementById("desc").innerHTML += "<span style='color:yellow'>Visited Node " + currentNode.name + " (Pushed to Stack)</span></br>";
            document.getElementById("visited").innerHTML += currentNode.name + " -> ";
            displayStack(tempStack,tempNodeList);
            paintGraph(currentNode,tempNodeList);
            await sleep(speed);
        }

        if(isPoped){
            tempStack.pop();
            document.getElementById("desc").innerHTML += "<span>Popped Node From Stack " + popedNode.name +"</span></br>";

            displayStack(tempStack,tempNodeList);
            await sleep(speed);
        }
    }

    let visDis = document.getElementById("visited");
    visDis.innerHTML = visDis.innerHTML.substring(0, (visDis.innerHTML.length - 6));
}

function paintLine(node, neighbors, color) {
    linkDataArray.forEach(link => {
        neighbors.forEach(element => {
        });
    });
}

function displayStack(stack,tempNodeList){
    document.getElementById("stack").innerHTML = "-";

    //En üstteki node'u al. Onu Göster, ziyaret edilmeyen komşuları boya
    let top = stack[stack.length-1];
    tempNodeList.forEach(node => {
        let nodeG = diagram.findNodeForKey(node.name);
        if(node == top){
            diagram.model.commit(function (m) {
                m.set(nodeG.data, "stroke", "red");
            }, "change stroke");
            diagram.model.commit(function (m) {
                m.set(nodeG.data, "strokeW", 3);
            }, "change strokeWidth");
        }else{
            diagram.model.commit(function (m) {
                m.set(nodeG.data, "stroke", null);
            }, "change stroke");
            diagram.model.commit(function (m) {
                m.set(nodeG.data, "strokeW", null);
            }, "change strokeWidth");
        }
    });
    for(let i = stack.length - 1 ; i >= 0 ; i--){
        element = stack[i];
        if (i == stack.length - 1) document.getElementById("stack").innerHTML += ">" + element.name + "</br>";
        else document.getElementById("stack").innerHTML += "&nbsp&nbsp" + element.name + "</br>";
    }

}

function paintGraph(current,nodeList) {
    nodeList.forEach(node => {
        let nodeG = diagram.findNodeForKey(node.name);
        if (node == current) {
            diagram.model.commit(function (m) {
                m.set(nodeG.data, "color", "red");
            }, "change color");
        } else {
            if (node.isVisited) {
                diagram.model.commit(function (m) {
                    m.set(nodeG.data, "color", "yellow");
                }, "change color");
            } else {
                diagram.model.commit(function (m) {
                    m.set(nodeG.data, "color", "white");
                }, "change color");
            }
        }
    });
}

/**Animasyon */


/**Kullanılacak */

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
/**Kullanılacak */

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


var slider = document.getElementById("myRange");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    let val = this.value;
    if(val<=10){
        speed = 4000;
    }else if(val <=20){
        speed = 3000;
    }else if(val <=30){
        speed = 2500;
    }else if(val <=40){
        speed = 2000;
    }else if(val <=50){
        speed = 1500;
    }else if(val <=60){
        speed = 1750;
    }else if(val <=70){
        speed = 1500;
    }else if(val <=80){
        speed = 1000;
    }else if(val <=90){
        speed = 500;
    }else{
        speed = 200;
    }
}