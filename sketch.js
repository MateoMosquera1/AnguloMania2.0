let anguloCorrecto, anguloUsuario, nivel = 1, puntos = 0;
let tiempo = 30, tiempoInicio, jugando = false, nombre = "", estado = "menu";
let jugadores = [];
let inputNombre, botonInicio, botonReiniciar;
let figuras = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  cargarJugadores();

  inputNombre = createInput();
  inputNombre.position(width / 2 - 100, height / 2 - 60);
  inputNombre.size(200);
  inputNombre.attribute("placeholder", "Ingresa tu apodo");

  botonInicio = createButton("¡JUGAR!");
  botonInicio.position(width / 2 - 50, height / 2);
  botonInicio.mousePressed(iniciarJuego);

  botonReiniciar = createButton("Jugar de nuevo");
  botonReiniciar.position(width / 2 - 60, height - 60);
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.hide();
}

function draw() {
  cambiarFondo();
  if (estado === "menu") {
    mostrarMenu();
  } else if (estado === "jugando") {
    mostrarJuego();
  } else if (estado === "final") {
    mostrarFinal();
  }
}

function iniciarJuego() {
  nombre = inputNombre.value().trim();
  if (nombre === "") return;

  inputNombre.hide();
  botonInicio.hide();
  tiempoInicio = millis();
  jugando = true;
  estado = "jugando";
  nuevoNivel();
}

function mostrarMenu() {
  textAlign(CENTER);
  fill(255);
  textSize(36);
  text("🎯 ÁnguloManía 🎮", width / 2, height / 4);
  textSize(20);
  text("Gira los ángulos con ← y →, presiona ESPACIO para confirmar", width / 2, height / 4 + 40);
}

function mostrarJuego() {
  let tiempoRestante = tiempo - floor((millis() - tiempoInicio) / 1000);
  textSize(24);
  fill(255);
  textAlign(LEFT);
  text("⏱️ Tiempo: " + tiempoRestante, 30, 40);
  text("Nivel: " + nivel, 30, 70);
  text("Puntos: " + puntos, 30, 100);

  push();
  translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(5);
  line(0, 0, 150, 0);
  rotate(anguloUsuario);
  stroke(255, 0, 0);
  line(0, 0, 150, 0);
  pop();

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Gira el ángulo con ← y →", width / 2, height - 120);
  text("Presiona ESPACIO si crees que está bien", width / 2, height - 90);

  if (tiempoRestante <= 0) {
    finalizarJuego();
  }
}

function keyPressed() {
  if (estado === "jugando") {
    if (keyCode === LEFT_ARROW) anguloUsuario -= 1;
    if (keyCode === RIGHT_ARROW) anguloUsuario += 1;
    if (key === " ") verificarAngulo();
  }
}

function nuevoNivel() {
  anguloCorrecto = int(random(20, 160));
  anguloUsuario = 0;
}

function verificarAngulo() {
  if (abs(anguloUsuario - anguloCorrecto) <= 5) {
    puntos += 10;
    nivel++;
    nuevoNivel();
  } else {
    puntos -= 5;
  }
}

function finalizarJuego() {
  jugando = false;
  estado = "final";
  guardarPuntaje();
  botonReiniciar.show();
}

function reiniciarJuego() {
  puntos = 0;
  nivel = 1;
  tiempoInicio = millis();
  botonReiniciar.hide();
  estado = "jugando";
  nuevoNivel();
}

function guardarPuntaje() {
  jugadores.push({ nombre: nombre, puntos: puntos });
  jugadores.sort((a, b) => b.puntos - a.puntos);
  jugadores = jugadores.slice(0, 10);
  localStorage.setItem("jugadoresAnguloMania", JSON.stringify(jugadores));
}

function cargarJugadores() {
  let data = localStorage.getItem("jugadoresAnguloMania");
  if (data) jugadores = JSON.parse(data);
}

function mostrarFinal() {
  background(0);
  fill(0, 255, 200);
  textAlign(CENTER);
  textSize(32);
  text("¡Juego terminado!", width / 2, 80);
  textSize(20);
  text("Puntaje: " + puntos, width / 2, 120);
  text("Top jugadores:", width / 2, 160);

  for (let i = 0; i < jugadores.length; i++) {
    let jugador = jugadores[i];
    text(`${i + 1}. ${jugador.nombre} - ${jugador.puntos} pts`, width / 2, 200 + i * 25);
  }
}

function cambiarFondo() {
  let c1 = color(10, 10, 30);
  let c2 = nivel < 4 ? color(0, 255, 150) : nivel < 7 ? color(255, 0, 150) : color(255, 150, 0);

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }

  if (figuras.length < 50) {
    figuras.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      shape: random(["circle", "square", "triangle"]),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI)
    });
  }

  noStroke();
  for (let f of figuras) {
    fill(255, 50);
    push();
    translate(f.x, f.y);
    rotate(f.angle);
    if (f.shape === "circle") ellipse(0, 0, f.size);
    else if (f.shape === "square") rectMode(CENTER), rect(0, 0, f.size, f.size);
    else triangle(-f.size/2, f.size/2, 0, -f.size/2, f.size/2, f.size/2);
    pop();
    f.y += f.speed;
    if (f.y > height) f.y = 0;
    f.angle += 0.003;
  }
}
