// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

var resolution = new Object();
resolution.width = canvas.width;
resolution.height = canvas.height;

// Controles
var controles = {};


// Capas
var layer;
var gameLayer;
var menuLayer;


// Inicio capas y bucle del juego
function iniciarJuego() {
    menuLayer = new MenuLayer();
    layer = menuLayer;

    setInterval(loop, 1000 / 30);
}

function loop() {
    layer.actualizar();
    if (entrada == entradas.pulsaciones) {
        layer.calcularPulsaciones(pulsaciones);
    }
    layer.procesarControles()
    layer.dibujar();

    actualizarPulsaciones();
}

function updateCanvas() {
    container = document.getElementById("container");
    if (container.width != window.innerWidth) {
        container.style.width = window.innerWidth - 250;
    }
    if (container.height != window.innerHeight) {
        container.style.height = window.innerHeight;
    }
}

function actualizarPulsaciones() {
    for (var i = 0; i < pulsaciones.length; i++) {
        if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}

window.requestAnimationFrame(loop);
ctx.fillRect(0, 0, canvas.width, canvas.height);
makeTileCover(ctx, mousex, mousey);