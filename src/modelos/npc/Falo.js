class Falo extends Npc {

    constructor(x, y) {
        super(imagenes.faloNpc, x, y)

        this.aIdle = new Animacion(imagenes.faloNpcIdle, this.ancho, this.alto, 2, 30, true);
        this.aDerecha = new Animacion(imagenes.faloNpcDerecha, this.ancho, this.alto, 2, 30, true)
        this.animacion = this.aIdle

        this.coste = 10
    }

    interactuar() {
        super.interactuar()
        this.restaMonedas = layer.jugador.monedas - this.coste
        this.accion()
    }

    async accion() {
        await this.mostrarBocadillo("¡Buenas chico! ")
        if (layer.jugador.monedas >= this.coste) {
            await this.mostrarBocadillo("Tengo un juego para tí... Tienes que encontrar mi llave.", 3000)
            await this.mostrarBocadillo("Veo qué tienes monedas, te dejaré pasar por 10 monedas.", 3000)
            await this.mostrarBocadillo("JEJEJJEJEJEJ, no te enfades. Ya puedes pasar a la sala.", 3000)
            layer.jugador.monedas = this.restaMonedas
                // mover jugador a la derecha
            this.moverX(1, 1)
        } else {
            await this.mostrarBocadillo("Marcha de lado mio, eres pobre!!")
        }
    }
}