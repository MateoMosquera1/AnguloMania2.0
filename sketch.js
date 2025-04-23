let anguloActual, tipoCorrecto, modo = "inicio";
let opciones = ["Agudo", "Recto", "Obtuso", "Llano", "Completo"];
let puntaje = 0, vidas = 3, tiempo = 15, timer;
let nombreJugador = "";
let niveles = 1;
let modoJuego = "seleccion";

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);
  textAlign(CENTER, CENTER);

  document.getElementById("startButton").onclick = () => {
    nombreJugador = document.getElementById("nameInput").value || "Anónimo";
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("tituloJuego").style.display = "none";
    document.getElementById("creditos").style.display = "none";
    iniciarJuego();
  };

  document.getElementById("retryButton").onclick = () => {
    location.reload();
  };

  document.getElementById("btnEnviarRespuesta").onclick = () => {
    let inputValor = document.getElementById("inputRespuestaTexto").value.trim();
    evaluarRespuesta(inputValor);
    document.getElementById("inputRespuestaTexto").value = "";
  };
}

function iniciarJuego() {
  modo = "jugando";
  puntaje = 0;
  vidas = 3;
  niveles = 1;
  generarNuevoAngulo();
  iniciarTimer();
}

function draw() {
  background("#1e1e2f");

  if (modo === "jugando") {
    fill(255);
    textSize(20);
    text(`Nivel ${niveles} | Puntaje: ${puntaje} | Vidas: ${vidas} | Tiempo: ${tiempo}s`, width / 2, 30);

    textSize(22);
    text(`¿Qué tipo de ángulo es este?`, width / 2, 70);
    text(`${anguloActual}°`, width / 2, 100);

    push();
    translate(width / 2, height / 2 + 30);
    stroke(255);
    strokeWeight(8);
    line(0, 0, 120, 0);
    rotate(radians(anguloActual));
    line(0, 0, 120, 0);
    pop();

    if (modoJuego === "seleccion") {
      document.getElementById("respuestaBox").style.display = "none";
      textSize(18);
      for (let i = 0; i < opciones.length; i++) {
        fill(100, 200, 255);
        rect(100 + i * 140, height - 150, 120, 40, 10);
        fill(0);
        text(opciones[i], 160 + i * 140, height - 130);
      }
    } else if (modoJuego === "escribir") {
      document.getElementById("respuestaBox").style.display = "block";
    }
  }
}

function mousePressed() {
  if (modoJuego === "seleccion") {
    for (let i = 0; i < opciones.length; i++) {
      let x = 100 + i * 140;
      let y = height - 150;
      if (mouseX > x && mouseX < x + 120 && mouseY > y && mouseY < y + 40) {
        evaluarRespuesta(opciones[i]);
      }
    }
  }
}

function evaluarRespuesta(respuesta) {
  if (respuesta.toLowerCase() === tipoCorrecto.toLowerCase() || parseInt(respuesta) === anguloActual) {
    puntaje++;
    niveles++;
    generarNuevoAngulo();
    reiniciarTimer();
  } else {
    vidas--;
    if (vidas <= 0) {
      mostrarFinJuego();
    }
  }
}

function generarNuevoAngulo() {
  modoJuego = niveles % 3 === 0 ? "escribir" : "seleccion";
  document.getElementById("respuestaBox").style.display = "none";

  let tipo = random(opciones);
  tipoCorrecto = tipo;

  switch (tipo) {
    case "Agudo": anguloActual = int(random(10, 89)); break;
    case "Recto": anguloActual = 90; break;
    case "Obtuso": anguloActual = int(random(91, 179)); break;
    case "Llano": anguloActual = 180; break;
    case "Completo": anguloActual = 360; break;
  }
}

function iniciarTimer() {
  tiempo = 15;
  timer = setInterval(() => {
    tiempo--;
    if (tiempo <= 0) {
      vidas--;
      if (vidas > 0) {
        generarNuevoAngulo();
        tiempo = 15;
      } else {
        clearInterval(timer);
        mostrarFinJuego();
      }
    }
  }, 1000);
}

function reiniciarTimer() {
  clearInterval(timer);
  iniciarTimer();
}

function mostrarFinJuego() {
  modo = "fin";
  clearInterval(timer);
  document.getElementById("respuestaBox").style.display = "none";
  guardarPuntaje();
  mostrarRanking();
  document.getElementById("retryButton").style.display = "block";
}

function guardarPuntaje() {
  let puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];
  puntajes.push({ nombre: nombreJugador, puntos: puntaje });
  puntajes.sort((a, b) => b.puntos - a.puntos);
  localStorage.setItem("puntajes", JSON.stringify(puntajes.slice(0, 10)));
}

function mostrarRanking() {
  let tabla = document.getElementById("tablaPuntajes");
  let puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];
  tabla.innerHTML = `<strong>🏆 TOP 10 JUGADORES</strong><br><br>` +
    puntajes.map((p, i) => `${i + 1}. ${p.nombre}: ${p.puntos} pts`).join("<br>");
  tabla.style.display = "block";
}
