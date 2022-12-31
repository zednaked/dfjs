// 1a. Crie a classe Cell

class Cell {
  constructor(x, y, type, item) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.item = item;
    this.color = currentPalette[0];
  }

  draw() {
    // Desenhe a célula aqui usando formas geométricas
    
    setColors(this.color);

    if (this.type === "Água") {
      rect(this.x, this.y, cellSize, cellSize);
    } else if (this.type === "Grama") {
      triangle(this.x, this.y, this.x + cellSize, this.y, this.x, this.y + cellSize);
    } else if (this.type === "Terra") {
      ellipse(this.x + cellSize / 2, this.y + cellSize / 2, cellSize, cellSize);
    } else if (this.type === "Pedra") {
      rect(this.x, this.y, cellSize, cellSize);
      rect(this.x + cellSize / 4, this.y + cellSize / 4, cellSize / 2, cellSize / 2);
    }
  }

  drawAscii() {
    // Desenhe a célula aqui usando caracteres ASCII
    let character;
    switch (this.type) {
      case "Água":
       // setColors(currentPalette[2])
        character = "~";
        setColors([0,102,255])
        break;
      case "Grama":
        character = ",";
        setColors([0,255,102])
        break;
      case "Terra":
        character = ".";
        setColors([90,20,0])
        break;
      case "Pedra":
        character = "."; 
        setColors([60,50,60])
        break;
      case "Arvore":
          character = "^"; 
          setColors([30,200,10])
        break;  
        case "Planta":
          character = ";"; 
          setColors([130,190,90])
        break;    
      case "Montanha":
          character = "^";
          setColors([130,130,130])
          break;
      default:
        character = " ";
        setColors(currentPalette[2])
        break;
    }
    push()
    textSize (18)
    text(character, this.x, this.y, cellSize, cellSize);
    pop()
  }
  mudaTipo (tiponovo)
  {

    this.type = tiponovo

  }
}
// 1b. Crie a classe Dwarf

class Dwarf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = [255,0,0];
    this.task = "Aguardando tarefa";
    this.destination = null
  }

  
  draw() {
    // Desenhe o anão aqui usando formas geométricas
    setColors(this.color);
   // ellipse(this.x, this.y, cellSize, cellSize);
  }

  drawAscii() {
    // Desenhe o anão aqui usando caracteres ASCII
    setColors(this.color);
    push()
    textSize (16)    
    text("@", this.x, this.y, cellSize, cellSize);
    pop()
  }

  startTask(destination) {
    this.destination = destination;
    this.task = "Indo para " + destination.type;
  }

  move() {
    if (this.destination) {

      let x
      let y
   

      if (this.x  >= this.destination.x){
         x = this.destination.x - (cellSize);
        

      }else if (this.x  <= this.destination.x){

         x = this.destination.x + (cellSize);
         
      }
      
      if (this.y  >= this.destination.y){
         y = this.destination.y - (cellSize);
         

      }else if (this.y <= this.destination.y){

         y = this.destination.y + (cellSize);
        
      }
     
      let distance = dist(this.x, this.y, x, y);
    
  
      // Se o anão estiver próximo o suficiente da célula de destino
      if (distance <= 65) {
        // Atualize a sua posição para o centro da célula de destino
        this.x = this.destination.x;
        this.y = this.destination.y-5;
        // Limpe a sua tarefa
        this.task = "Aguardando tarefa";
        this.destination.mudaTipo ("Terra")
        this.destination = null;
      } else {
        // Caso contrário, mova o anão em direção à célula de destino
        let angle = atan2(y - this.y, x - this.x);
        this.x += cos(angle) * 40;
        this.y += sin(angle) * 40;
      }
    }
  }
  
}

class Task {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

// 2. Inicialize as variáveis globais
let pendingTasks = [];
let canvasWidth = 800;
let canvasHeight = 800;
let cellSize = 25;
let gridWidth = canvasWidth / cellSize;
let gridHeight = canvasHeight / cellSize;
let map;
let dwarves;
let selectedDwarf = 0;
let useAscii = true;
let pastelPalette = [[255, 207, 220], [255, 255, 204], [204, 255, 255], [204, 255, 204], [255, 204, 255], [255, 204, 204]];
let greenPalette = [[0, 128, 0], [0, 255, 0], [128, 255, 128], [255, 255, 128], [255, 128, 0], [255, 0, 0]];
let currentPalette = greenPalette


function assignTasks() {
  for (let dwarf of dwarves) {
    let nearestTask = null;
    let nearestDistance = Infinity;
    for (let task of pendingTasks) {
      let distance = dist(dwarf.x, dwarf.y, task.x, task.y);
      if (distance < nearestDistance) {
        nearestTask = task;
        nearestDistance = distance;
      }
    }
    if (nearestTask) {
      dwarf.startTask(nearestTask);
      let index = pendingTasks.indexOf(nearestTask);
      pendingTasks.splice(index, 1);
    }
  }
}



// 3. Crie a função setup()

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  fonte = loadFont('Greenscr.ttf')
  textFont (fonte)
  textSize (10)
  map = generateMap();
  dwarves = [new Dwarf(floor (random (0,gridWidth)) *cellSize ,floor (random (0,gridWidth))*cellSize), new Dwarf(floor (random (0,gridWidth)) *cellSize ,floor (random (0,gridWidth))*cellSize)];
  selectedDwarf =  dwarves.push (new Dwarf(floor (random (0,gridWidth)) *cellSize ,floor (random (0,gridWidth))*cellSize)) -1
}

// 4. Crie a função draw()

function draw() {
  background(0);
  drawMap();
  drawDwarves();

  assignTasks();
  for (let dwarf of dwarves) {
    dwarf.move();
    dwarf.draw();
  }

  drawMenu();
  handleInput();
}

// 5. Crie a função generateMap()

function generateMap() {
  let map = [];
  for (let y = 0; y < gridHeight; y++) {
    let row = [];
    for (let x = 0; x < gridWidth; x++) {
      let type = "Terra";
      // Gere um valor de ruído para a coordenada (x, y)
      let noiseValue = noise(x * 0.1, y * 0.1);
      if (noiseValue < 0.25) {
        type = "Água";
      } else if (noiseValue < 0.35) {
        type = "Pedra";
      } else if (noiseValue < 0.40) {
        type = "Montanha";
      } else if (noiseValue < 0.50) {
        type = "Arvore";
      }else if (noiseValue < 0.6) {
        type = "Terra";
      }
      else if (noiseValue < 0.8) {
        type = "Grama";
      }

      let item = "";
      if (random() < 0.1) {
        item = "Arvore";
      } else if (random() < 0.2) {
        item = "Planta";
      } else if (random() < 0.3) {
        item = "Minério";
      } else if (random() < 0.4) {
        item = "Peixe";
      }
      row.push(new Cell(x * cellSize, y * cellSize, type, item));
    }
    map.push(row);
  }
  return map;
}
// 6. Crie a função drawMap()

function drawMap() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let cell = map[y][x];
      if (useAscii) {
        cell.drawAscii();
      } else {
        cell.draw();
      }
    }
  }
}

// 7. Crie a função drawDwarves()

function drawDwarves() {
  for (let dwarf of dwarves) {
    if (useAscii) {
      dwarf.drawAscii();
    } else {
      dwarf.draw();
    }
  }
}
// 8. Crie a função drawMenu()


function drawMenu() {
  // Desenhe o menu aqui usando caracteres ASCII
  
  push()
  fill (0,0,0)
  noStroke()
  rect (0, canvasHeight - cellSize * 37, cellSize * 9, cellSize * 13)
  
  pop()
  let menu = "";
  menu += "+------------------------+\n";
  menu += "| Fortaleza do rei anao  |\n";
  menu += "+------------------------+\n";
  menu += "| [G]ramado              |\n";
  menu += "| [T]erra                |\n";
  menu += "| [P]edra                |\n";
  menu += "| [A]gua                 |\n";
  menu += "| [E]scolher anão        |\n";
  menu += "| [Q]uadro ASCII         |\n";
  menu += "| [C]ores pastel         |\n";
  menu += "| [S]aida                |\n";
  menu += "+------------------------+\n";
  menu += "| Anao selecionado: " + selectedDwarf + "    |\n";
  menu += "+------------------------+\n";
  
  let log = "";
  for (let i = 0; i < dwarves.length; i++) {
  log += "Anao " + i + ": " + dwarves[i].task + "\n";
  }
  
  fill (255,255,255)
  text(menu + log, 10, canvasHeight - cellSize * 35, cellSize * 30, cellSize * 19);
  }



// 10. Crie a função handleInput()

function handleInput() {
  if (mouseIsPressed) {
    let my = mouseY + 20 
    let mouseMapX = floor(mouseX / cellSize);
    let mouseMapY = floor(my / cellSize);
   // console.log(mouseMapX)
    if (mouseMapX >= 0 && mouseMapX < gridWidth && mouseMapY >= 0 && mouseMapY < gridHeight) {
      let cell = map[mouseMapY][mouseMapX];
      let dwarf = dwarves[selectedDwarf];
      dwarf.startTask(cell);
    }
  }
  for (let dwarf of dwarves) {
    dwarf.move();
  }
}


function keyPressed() {
  // Adicione uma nova tarefa quando o usuário pressionar a tecla "T"
  if (key === "T") {
    let x = mouseX;
    let y = mouseY;
    let type = "Tarefa de exemplo";
    let task = new Task(x, y, type);
    pendingTasks.push(task);
  }
}



function generateColorfulPalette(numColors) {
  let palette = [];
  for (let i = 0; i < numColors; i++) {
    let color = [floor(random(256)), floor(random(256)), floor(random(256))];
    palette.push(color);
  }
  return palette;
}

function setColors(color) {
  if (useAscii) {
  fill(color[0], color[1], color[2]);
  stroke(color[0], color[1], color[2]);
  } else {
  fill(color);
  stroke(color);
  }
  }