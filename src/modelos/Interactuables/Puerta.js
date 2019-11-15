class Puerta extends BaseInteractuable {

    constructor(imagen, x, y, recuperarLayer = false, nivel = nivelActual + 1) {
        super(imagen, x, y, null)

        this.aPuerta = new Animacion(imagen, this.ancho, this.alto, 1, 1, true);

        this.animacion = this.aPuerta
        this.activarConBoton = false
        this.rango = 10

        this.recuperarLayer = recuperarLayer
        this.nivel = nivelActual
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
        estadosLayers[nivelActual] = this.clone(gameLayer)

        nivelActual++;
        if (nivelActual > nivelMaximo) {
            nivelActual = 0;
        }

        if (this.recuperarLayer) {
            nivelActual--
            layer = estadosLayers[nivelActual]
            layer.jugador.x = gameLayer.spawnX
            layer.jugador.y = gameLayer.spawnY
        } else {
            layer.iniciar()
        }
    }

    clone(model) {
        return Object.assign(Object.create(Object.getPrototypeOf(model)), model);
    }

}