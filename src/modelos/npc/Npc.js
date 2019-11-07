class Npc extends Modelo {

    constructor(imagen, x, y) {
        super(imagen, x, y)

        this.vx = 0;
        this.vy = 0;

        this.aIdle = null
        this.aDerecha = null
        this.aIzquierda = null
        this.aArriba = null
        this.aAbajo = null
        this.animacion = null

        this.tiempoBloque = this.ancho
        this.delay = this.tiempoBloque
        this.ms = 0
    }

    actualizar() {
        // nos movemos durante x tiempo
        if (this.ms++ < this.delay) {
            if (this.vx != 0) {
                if (this.vx > 0) {
                    this.animacion = this.aDerecha
                } else {
                    this.animacion = this.aIzquierda
                }
            } else if (this.vy != 0) {
                if (this.vy > 0) {
                    this.animacion = this.aAbajo
                } else {
                    this.animacion = this.aArriba
                }
            } else {
                this.animacion = this.aIdle
            }
        } else {
            this.animacion = this.aIdle
            this.vx = 0
            this.vy = 0
        }

        if (this.animacion != null) {
            this.animacion.actualizar();
        }
    }

    dibujar(scrollX, scrollY) {
        if (this.animacion != null) {
            scrollX = scrollX || 0;
            scrollY = scrollY || 0;
            this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
        }
    }

    isMovimiendo() {
        return this.vx != 0 || this.vy != 0
    }

    interactuar() {}

    async mostrarBocadillo(message, delay = 2 * 1000) {
        gameLayer.texto = new TextoBocadillo(message)
        await this.sleep(delay);
    }


    moverX(numBloques, vx) {
        this.vx = vx
        this.delay = this.tiempoBloque * numBloques / vx
        this.ms = 0
    }

    moverY(numBloques, vy) {
        this.vy = vy
        this.delay = this.tiempoBloque * numBloques / vy
        this.ms = 0
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}