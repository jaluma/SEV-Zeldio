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
        this.restaMonedas = gameLayer.jugador.monedas - this.coste
        this.accion()
    }

    async accion() {
        await this.mostrarBocadillo("¡Buenas, chico!")
        if (gameLayer.jugador.monedas >= this.coste) {
            await this.mostrarBocadillo("Tengo un juego para ti... Tienes que encontrar mi llave.", 3000)
            await this.mostrarBocadillo("Veo que tienes monedas, te dejaré pasar por 10.", 3000)
            await this.mostrarBocadillo("JEJEJEJEJE, no te enfades. Ya puedes pasar a la sala.", 3000)
            gameLayer.jugador.monedas = this.restaMonedas
                // mover jugador a la derecha
            this.moverX(1, 1)
        } else {
            await this.mostrarBocadillo("Aléjate de mí, ¡eres pobre!")
        }
    }
}