// player 1
var oneKey = 49
var twoKey = 50

var spaceKey = 32
var eKey = 69

var upKey = 38
var downKey = 40
var leftKey = 37
var rightKey = 39

var teclas = [];

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    entrada = entradas.teclado;

    // agregar la tecla pulsada si no estaba
    var posicion = teclas.indexOf(event.keyCode);
    if (posicion == -1) {
        teclas.push(event.keyCode);
        switch (event.keyCode) {
            case spaceKey:
                controles.atacar = true;
                controles.continuar = true;
                break;
            case upKey:
                controles.moverY = -1;
                break;
            case downKey:
                controles.moverY = 1;
                break;
            case rightKey:
                controles.moverX = 1;
                break;
            case leftKey:
                controles.moverX = -1;
                break;
            case eKey:
                controles.interactuar = true;
                break;
        }

    }

}

function onKeyUp(event) {
    // sacar la tecla pulsada
    var posicion = teclas.indexOf(event.keyCode);
    teclas.splice(posicion, 1);
    switch (event.keyCode) {
        case spaceKey:
            controles.atacar = false;
            controles.continuar = false;
            break;
        case upKey:
            if (controles.moverY == -1) {
                controles.moverY = 0;
            }
            break;
        case downKey:
            if (controles.moverY == 1) {
                controles.moverY = 0;
            }
            break;
        case rightKey:
            if (controles.moverX == 1) {
                controles.moverX = 0;
            }
            break;
        case leftKey:
            if (controles.moverX == -1) {
                controles.moverX = 0;
            }
            break;
        case eKey:
            controles.interactuar = false
            break;
    }

}