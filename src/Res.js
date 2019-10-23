// Lista re recursos a precargar
var imagenes = {
    jugador: "res/jugador/default.png",
    icono_puntos: "res/icono_puntos.png",
    icono_vidas: "res/icono_vidas.png",
    icono_recolectable: "res/icono_recolectable.png",
    fondo_2: "res/fondo_2.png",
    jugador_idle: "res/jugador/jugador_idle.png",
    jugador_corriendo_derecha: "res/jugador/jugador_corriendo_derecha.png",
    jugador_corriendo_izquierda: "res/jugador/jugador_corriendo_izquierda.png",
    jugador_corriendo_arriba: "res/jugador/jugador_corriendo_arriba.png",
    jugador_corriendo_abajo: "res/jugador/jugador_corriendo_abajo.png",
    boton_pausa: "res/boton_pausa.png",
    menu_fondo: "res/menu_fondo.png",
    boton_jugar: "res/boton_jugar.png",
    mensaje_ganar: "res/mensaje_ganar.png",
    mensaje_perder: "res/mensaje_perder.png",
    treeP: "res/bloques/arbolperenne.png",
    treeC: "res/bloques/arbolcaduca.png",
    camino_sup: "res/bloques/caminosuperior.png",
    camino_abajo: "res/bloques/caminoinferior.png",
    camino_izqda: "res/bloques/caminoizqda.png",
    camino_dcha: "res/bloques/caminodcha.png",
    cruce_supdcha: "res/bloques/caminosupdcha.png",
    cruce_supizqda: "res/bloques/caminosupizqda.png",
    cesped_si: "res/bloques/cesped/cesped_si.png",
    cesped_sc: "res/bloques/cesped/cesped_sc.png",
    cesped_sd: "res/bloques/cesped/cesped_sd.png",
    cesped_ci: "res/bloques/cesped/cesped_ci.png",
    cesped_cc: "res/bloques/cesped/cesped_cc.png",
    cesped_cd: "res/bloques/cesped/cesped_cd.png",
    cesped_ii: "res/bloques/cesped/cesped_ii.png",
    cesped_ic: "res/bloques/cesped/cesped_ic.png",
    cesped_id: "res/bloques/cesped/cesped_id.png",
    transparente: "res/bloques/transparente.png",
    moneda: "res/monedas/1.png",
    monedas: "res/monedas/monedas.png",
    cast1: "res/bloques/castillo/Cas1.png",
    cast2: "res/bloques/castillo/Cas2.png",
    cast3: "res/bloques/castillo/Cas3.png",
    cast4: "res/bloques/castillo/Cas4.png",
    cast5: "res/bloques/castillo/Cas5.png",
    cast6: "res/bloques/castillo/Cas6.png",
    rickEnemigo: "res/enemigos/rick/1.png",
    rickEnemigoAbajo: "res/enemigos/rick/rick_abajo.png",
    rickEnemigoArriba: "res/enemigos/rick/rick_arriba.png",
    rickEnemigoIzquierda: "res/enemigos/rick/rick_izquierda.png",
    rickEnemigoDerecha: "res/enemigos/rick/rick_derecha.png",
    rickEnemigoMorir: "res/enemigos/rick/1.png",
    teleport_azul: "res/enemigos/teleport_1.png",
    teleport_azul_a: "res/enemigos/teleport_azul.png",
    teleport_naranja: "res/enemigos/teleport_4.png",
    teleport_naranja_a: "res/enemigos/teleport_naranja.png"


};

var rutasImagenes = Object.values(imagenes);

cargarImagenes(0);

function cargarImagenes(indice) {
    var imagenCargar = new Image();
    imagenCargar.src = rutasImagenes[indice];
    imagenCargar.onload = function() {
        if (indice < rutasImagenes.length - 1) {
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}