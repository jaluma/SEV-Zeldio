class Falo extends Npc {

    constructor(x, y) {
        super(imagenes.faloNpc, x, y)

        this.aIdle = new Animacion(imagenes.faloNpcIdle, this.ancho, this.alto, 2, 30, true);
        this.aDerecha = new Animacion(imagenes.faloNpcDerecha, this.ancho, this.alto, 2, 30, true)
        this.animacion = this.aIdle

        this.interaccion = [
            "Buenas chico... ",
            "Veo qué tienes monedas,\n te dejo pasar por 10",
            ""
        ]
        this.coste = 10
    }

    interactuar() {
        super.interactuar()
        this.restaMonedas = gameLayer.jugador.monedas - this.coste
        this.accion()
    }

    async accion() {
        await this.mostrarBocadillo("¡Buenas chico! ")
        if (gameLayer.jugador.monedas >= this.coste) {
            await this.mostrarBocadillo("Tengo un juego para tí... Tienes que encontrar mi llave.", 3000)
            await this.mostrarBocadillo("Veo qué tienes monedas, te dejaré pasar por 10 monedas.", 3000)
            await this.mostrarBocadillo("JEJEJJEJEJEJ, no te enfades. Ya puedes pasar a la sala.", 3000)
            gameLayer.jugador.monedas = this.restaMonedas
                // mover jugador a la derecha
            this.moverX(1, 1)
        } else {
            await this.mostrarBocadillo("Marcha de lado mio, eres pobre!!")
        }
    }
}