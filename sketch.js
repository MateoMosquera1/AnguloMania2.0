let anguloObjetivo;
let anguloJugador = 0;
let puntaje = 0;
let vidas = 3;
let margenError = 15;
let tiempoTotal = 5;
let tiempoRestante;
let tiempoInicial;
let jugando = false;
let estado = "inicio"; // "inicio", "jugando", "fin", "explicacion"
let explicacion = "";

const nombresAngulos = [
  { nombre: "Agudo", rango: [10, 89], explicacion: "Un ángulo agudo mide menos de 90°." },
  { nombre: "Recto", rango: [90, 90], explicacion: "Un ángulo recto mide exactamente 90°." },
  { nombre: "Obtuso", rango: [91, 179], explicacion: "Un ángulo obtuso mide más de 90° y menos de 180°." },
  { nombre: "Llano", rango: [180, 180], explicacion: "Un ángulo llano mide 180° y forma una línea recta." },
  { nombre: "Completo", rango: [360, 360], explicacion: "Un ángulo completo da una vuelta entera (360°)." }
];

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  noLoop();
  document.getElementById("startButton").onclick = comenzarJuego;
  document.getElementById("retryButton").onclick = reiniciarJuego;
}

function draw() {
  background(30, 30, 60);
  fill(255);
  textSize(24);

  if (estado === "inicio") {
    text("ÁnguloManía: Maestro del Giro", width / 2, 100);
    textSize(18);
    text("Instrucciones:\nUsá las flechas ← → para girar al ángulo pedido.\nTenés 5 segundos para girar. ¡Acierta para ganar puntos!", width / 2, 180);
    document.getElementById("startButton").style.display = "block";
    return;
  }

  if (estado === "fin") {
    textSize(36);
    fill(255, 0, 0);
    text("¡Juego Terminado!", width / 2, height / 2 - 40);
    textSize(24);
    fill(255);
    text("Puntaje final: " + puntaje, width / 2, height / 2 + 10);
    document.getElementById("retryButton").style.display = "block";
    return;
  }

  if (estado === "explicacion") {
    textSize(20);
    fill(255, 200, 100);
    text(explicacion, width / 2, height - 160);
  }

  // Mostrar ángulo objetivo
  fill(255);
  text("Girá hasta: " + anguloObjetivo + "°", width / 2, 40);

  // Mostrar ángulo del jugador
  push();
  translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(8);
  line(0, 0, 100, 0);
  rotate(radians(anguloJugador));
  line(0, 0, 100, 0);
  pop();

  // Info
  textSize(18);
  fill(255);
  text("Tu ángulo: " + int(anguloJugador) + "°", width / 2, height - 100);
  text("Puntaje: " + puntaje + " | Vidas: " + vidas, width / 2, height - 60);

  // Temporizador visual
  let barra = map(tiempoRestante, 0, tiempoTotal, 0, width);
  noStroke();
  fill(tiempoRestante < 2 ? "red" : "lightgreen");
  rect(0, 0, barra, 10);

  // Conteo
  textSize(16);
  fill(200);
  text("Tiempo: " + tiempoRestante.toFixed(1) + "s", width / 2, 20);

  if (jugando) {
    let tiempoActual = (millis() - tiempoInicial) / 1000;
    tiempoRestante = tiempoTotal - tiempoActual;
    if (tiempoRestante <= 0) {
      verificarRespuesta();
    }
  }
}

function comenzarJuego() {
  document.getElementById("startButton").style.display = "none";
  estado = "jugando";
  anguloJugador = 0;
  puntaje = 0;
  vidas = 3;
  margenError = 15;
  generarNuevoReto();
  jugando = true;
  loop();
}

function reiniciarJuego() {
  document.getElementById("retryButton").style.display = "none";
  estado = "jugando";
  vidas = 3;
  puntaje = 0;
  margenError = 15;
  generarNuevoReto();
  jugando = true;
  loop();
}

function keyPressed() {
  if (!jugando) return;

  if (keyCode === LEFT_ARROW) {
    anguloJugador -= 5;
    if (anguloJugador < 0) anguloJugador += 360;
  } else if (keyCode === RIGHT_ARROW) {
    anguloJugador += 5;
    if (anguloJugador >= 360) anguloJugador -= 360;
  }
}

function verificarRespuesta() {
  jugando = false;
  const diferencia = abs(anguloJugador - anguloObjetivo);
  const esCorrecto = diferencia <= margenError || abs(diferencia - 360) <= margenError;

  if (esCorrecto) {
    puntaje++;
    if (puntaje % 3 === 0 && margenError > 3) {
      margenError -= 2;
    }
    generarNuevoReto();
    jugando = true;
  } else {
    vidas--;
    let tipo = nombresAngulos.find(tipo => anguloObjetivo >= tipo.rango[0] && anguloObjetivo <= tipo.rango[1]);
    explicacion = `Un ángulo de ${anguloObjetivo}° se llama '${tipo.nombre}' porque: ${tipo.explicacion}`;

    estado = "explicacion";
    setTimeout(() => {
      if (vidas <= 0) {
        estado = "fin";
        noLoop();
      } else {
        estado = "jugando";
        generarNuevoReto();
        jugando = true;
      }
    }, 3000);
  }
}

function generarNuevoReto() {
  anguloJugador = 0;
  anguloObjetivo = int(random(10, 360));
  tiempoRestante = tiempoTotal;
  tiempoInicial = millis();
}
