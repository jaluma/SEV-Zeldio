// To create your canvas object.
var canvas = NewCanvas(GetId("canvas"), true);

// If you want to update your canvas size use this:
window.addEventListener("resize", function() {
    UpdateCvs(canvas);
});

// Set it to current width
UpdateCvs(canvas);

var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

// Controles
var controles = {};


// Capas
var resolution = new Object();
resolution.width = canvas.width;
resolution.height = canvas.height;
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
    if (layer != null) {
        layer.actualizar();
        if (entrada == entradas.pulsaciones) {
            layer.calcularPulsaciones(pulsaciones);
        }
        layer.procesarControles()
        layer.dibujar();

        actualizarPulsaciones();
    }
}

function actualizarPulsaciones() {
    for (var i = 0; i < pulsaciones.length; i++) {
        if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}

// Cambio de escalado

window.requestAnimationFrame(loop);
contexto.fillRect(0, 0, canvas.width, canvas.height);

/**
 * @author TessavWalstijn. GitHub: https://github.com/TessavWalstijn
 * Sets the canvas properties.
 * @param {object} Cvs Give the html canvas Id.
 * @param {boolean} Fullscreen Change the canvas fullscreen default false.
 * @param {string} Dimension Change the canvas dimension default "2d".
 * @return {object}
 */
function NewCanvas(cvs, fullscreen, dimension) {
    if (!dimension) dimension = "2d";
    var ctx = cvs.getContext(dimension);
    if (fullscreen) {
        cvs.style.position = "fixed";
        cvs.style.left = cvs.x = 0;
        cvs.style.top = cvs.y = 0;
    } else {
        var rect = cvs.getBoundingClientRect();
        cvs.x = rect.left;
        cvs.y = rect.top;
    }
    cvs.ctx = ctx;
    cvs.dimension = dimension;
    cvs.fullscreen = fullscreen;
    return cvs;
}

/**
 * @author TessavWalstijn. GitHub: https://github.com/TessavWalstijn
 * Updates the canvas width and hight.
 * @param {object} Cvs NewCanvas() object.
 * @param {boolean} Clear Change the canvas clear default true.
 */
function UpdateCvs(cvs, clear = true) {
    if (cvs.fullscreen) {
        //if the width is not the same resize the canvas width
        if (window.innerWidth != cvs.width) {
            cvs.width = window.innerWidth;
        }
        //if the height is not the same resize the canvas height
        if (window.innerHeight != cvs.height) {
            cvs.height = window.innerHeight;
        }
    } else {
        let rect = cvs.getBoundingClientRect();
        cvs.x = rect.left;
        cvs.y = rect.top;
    }
    if (cvs.dimension == "2d")
        if (clear)
            cvs.ctx.fillRect(0, 0, cvs.width, cvs.height);
}

/**
 * @author TessavWalstijn. GitHub: https://github.com/TessavWalstijn
 * get html element by id.
 * @param {string} id give the html element id.
 * @return {object} document.getElementById(id);
 */
function GetId(id) { return document.getElementById(id) }