class Mario extends Npc {

    constructor(x, y) {
        super(imagenes.marioNpc, x, y)

        this.aIdle = new Animacion(imagenes.marioNpcIdle, this.ancho, this.alto, 12, 3, true)
        this.aFeliz = new Animacion(imagenes.marioNpcFeliz, this.ancho, this.alto, 6, 5, true);
        this.animacion = this.aIdle

        this.movimientoAnimaciones = false
    }

    finAnimacionFeliz() {
        this.animacion = this.aIdle
    }

    ponerFeliz() {
        this.animacion = this.aFeliz
    }

    interactuar() {
        super.interactuar()
        this.accion()
    }

    async accion() {
        this.ponerFeliz()
        await this.mostrarBocadillo("¡¡Gracias, te debo una!! ")
        layer = new FinishLayer();
        controles.continuar = false;
    }
}