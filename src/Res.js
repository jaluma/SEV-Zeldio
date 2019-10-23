// Lista re recursos a precargar
var imagenes = {
    jugador: "res/jugador.png",
    fondo: "res/fondo.png",
    enemigo: "res/enemigo.png",
    enemigo_movimiento: "res/enemigo_movimiento.png",
    disparo_jugador: "res/disparo_jugador.png",
    disparo_enemigo: "res/disparo_enemigo.png",
    icono_puntos: "res/icono_puntos.png",
    icono_vidas: "res/icono_vidas.png",
    icono_recolectable: "res/icono_recolectable.png",
    fondo_2: "res/fondo_2.png",
    jugador_idle: "res/jugador_idle.png",
    jugador_corriendo_derecha: "res/jugador_corriendo_derecha.png",
    jugador_corriendo_izquierda: "res/jugador_corriendo_izquierda.png",
    jugador_corriendo_arriba: "res/jugador_corriendo_arriba.png",
    jugador_corriendo_abajo: "res/jugador_corriendo_abajo.png",
    enemigo_morir: "res/enemigo_morir.png",
    bloque_tierra: "res/bloque_tierra.png",
    bloque_metal: "res/bloque_metal.png",
    bloque_fondo_muro: "res/bloque_fondo_muro.png",
    copa: "res/copa.png",
    pad: "res/pad.png",
    boton_disparo: "res/boton_disparo.png",
    boton_salto: "res/boton_salto.png",
    boton_pausa: "res/boton_pausa.png",
    menu_fondo: "res/menu_fondo.png",
    boton_jugar: "res/boton_jugar.png",
    mensaje_como_jugar: "res/mensaje_como_jugar.png",
    mensaje_ganar: "res/mensaje_ganar.png",
    mensaje_perder: "res/mensaje_perder.png",
    cesped_si: "res/bloques/cesped_si.png",
    cesped_sc: "res/bloques/cesped_sc.png",
    cesped_sd: "res/bloques/cesped_sd.png",
    cesped_ci: "res/bloques/cesped_ci.png",
    cesped_cc: "res/bloques/cesped_cc.png",
    cesped_cd: "res/bloques/cesped_cd.png",
    cesped_ii: "res/bloques/cesped_ii.png",
    cesped_ic: "res/bloques/cesped_ic.png",
    cesped_id: "res/bloques/cesped_id.png",
    treeP: "res/bloques/arbolperenne.png",
    treeC: "res/bloques/arbolcaduca.png",
    camino_sup: "res/bloques/caminosuperior.png",
    camino_abajo: "res/bloques/caminoinferior.png",
    camino_izqda: "res/bloques/caminoizqda.png",
    camino_dcha: "res/bloques/caminodcha.png",
    cruce_supdcha: "res/bloques/caminosupdcha.png",
    cruce_supizqda: "res/bloques/caminosupizqda.png",
};

var rutasImagenes = Object.values(imagenes);

var lengthCesped = 2;
for (const x of Array(lengthCesped).keys()) {
    imagenes["cesped_basico_" + [x]] = "res/bloques/cesped_basico_" + x + ".png"
}

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