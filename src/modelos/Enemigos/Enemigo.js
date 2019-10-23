class Enemigo extends Modelo {

    constructor(imagen, x, y) {
        super(imagen, x, y)

        this.estado = estados.moviendo;

        this.vxInteligencia = 1;
        this.vx = 0;
        this.vy = 0;

        this.animacion = null

    }

    finAnimacionMorir() {
        this.estado = estados.muerto;
    }

    actualizar() {
        this.animacion.actualizar();

        switch (this.estado) {
            case estados.moviendo:
                if (gameLayer.jugador.x < this.x) {
                    this.vx = -this.vxInteligencia
                    this.vy = 0
                } else if (gameLayer.jugador.x > this.x) {
                    this.vx = this.vxInteligencia
                    this.vy = 0
                } else if (gameLayer.jugador.y < this.y) {
                    this.vy = -this.vxInteligencia
                    this.vx = 0
                } else if (gameLayer.jugador.y > this.y) {
                    this.vy = this.vxInteligencia
                    this.vx = 0
                }

                if (this.vx < 0) {
                    this.animacion = this.aMoverIzq;
                } else if (this.vx > 0) {
                    this.animacion = this.aMoverDer;
                } else {
                    if (this.vy < 0) {
                        this.animacion = this.aMoverArriba
                    } else if (this.vy > 0) {
                        this.animacion = this.aMoverAbajo;
                    } else {
                        this.animacion = this.aIdle;
                    }
                }
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                this.vx = 0;
                break;
        }

    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }


    impactado() {
        if (this.estado != estados.muriendo) {
            this.estado = estados.muriendo;
        }
    }
}