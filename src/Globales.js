var pulsaciones = []; // actuales registradas

var tipoPulsacion = {}; // tipos
tipoPulsacion.inicio = 1;
tipoPulsacion.mantener = 2;

var entradas = {}; // tipos
entradas.pulsaciones = 1;
entradas.teclado = 2;
entradas.gamepad = 3;
var entrada = entradas.pulsaciones;


var nivelActual = 0;
var nivelMaximo = 3;


var estados = {};
estados.moviendo = 2; // Incluye parado, derecha , izquierda
estados.saltando = 3;
estados.muriendo = 4;
estados.muerto = 5;
estados.atacando = 6;
estados.impactado = 7;

var orientaciones = {};
orientaciones.arriba = 0;
orientaciones.arriba = 1;
orientaciones.derecha = 2;
orientaciones.izquierda = 3;

var estadosTile = {};
estadosTile.normal = 2;
estadosTile.rompiendo = 3;
estadosTile.roto = 4;

var estadosMC = {};
estadosMC.vacio = 0;
estadosMC.jugador = 1;
estadosMC.bloque = 2;
estadosMC.npc = 3
estadosMC.enemigo = 4

estadosMC.start = 10;
estadosMC.valid = 11;
estadosMC.invalid = 12;
estadosMC.blocked = 13;
estadosMC.visited = 14;
estadosMC.unknown = 15

var directions = {}
directions.north = [0, -1]
directions.south = [0, 1]
directions.west = [-1, 0]
directions.east = [1, 0]

var estadosLayers = Array(nivelMaximo)