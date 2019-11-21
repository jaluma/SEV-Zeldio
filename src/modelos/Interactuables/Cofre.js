class Cofre extends BaseInteractuable {

    constructor(x, y, objeto = null) {
        super(imagenes.cofre, x, y, objeto)

        this.aCofre = new Animacion(imagenes.cofre, this.ancho, this.alto, 1, 1, true);
        this.aAbrirCofre = new Animacion(imagenes.cofre_anim, this.ancho, this.alto, 5, 4, false);

        this.animacion = this.aCofre

        this.abierto = false
    }

    actualizar() {
        this.animacion.actualizar();
    }

    abrir() {
        this.animacion = this.aAbrirCofre
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    async interactuar() {
        this.abrir()
        if (!this.abierto) {
            this.abierto = !this.abierto
            if (this.objeto == null) {
                estadosLayers[nivelActual] = this.clone(layer)
                nivelActual--
                var jugador = this.clone(layer.jugador)

                await this.sleep(1000);

                layer = estadosLayers[nivelActual]
                layer.jugador.vidas = jugador.vidas
                layer.jugador.monedas = jugador.monedas
                layer.jugador.x = layer.spawnX
                layer.jugador.y = layer.spawnY

                layer.texto = new TextoBocadillo("Ohh, mala suerte...")
            }

            return this.getObjeto()
        }
        return null
    }
}