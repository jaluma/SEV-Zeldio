class Puerta extends BaseInteractuable {

    constructor(imagen, x, y, recuperarLayer = false, activarConBoton = false) {
        super(imagen, x, y, null)

        this.aPuerta = new Animacion(imagen, this.ancho, this.alto, 1, 1, true);

        this.animacion = this.aPuerta
        this.activarConBoton = activarConBoton
        this.rango = 10

        this.recuperarLayer = recuperarLayer
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    interactuar() {
        // save info
        estadosLayers[nivelActual] = this.clone(layer)

        nivelActual++;
        if (nivelActual > nivelMaximo) {
            nivelActual = 0;
        }

        var jugador = this.clone(layer.jugador)
        if (this.recuperarLayer && typeof estadosLayers[nivelActual] != "undefined") {
            layer = estadosLayers[nivelActual]
        } else { 
            layer.iniciar()
        }
        layer.jugador.vidas = jugador.vidas
        layer.jugador.monedas = jugador.monedas 
        layer.jugador.x = layer.spawnX
        layer.jugador.y = layer.spawnY
    }

}