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
                var jugadorX = parseInt(gameLayer.jugador.x)
                var jugadorY = parseInt(gameLayer.jugador.y)

                var enemigoX = parseInt(this.x)
                var enemigoY = parseInt(this.y)

                if (Math.abs(jugadorX - enemigoX) <= Math.abs(jugadorY - enemigoY)) {
                    if (jugadorY < enemigoY) {
                        this.vy = -this.vxInteligencia
                    } else if (jugadorY > enemigoY) {
                        this.vy = this.vxInteligencia
                    }
                    this.vx = 0
                } else {
                    if (jugadorX < enemigoX) {
                        this.vx = -this.vxInteligencia
                    } else if (jugadorX > enemigoY) {
                        this.vx = this.vxInteligencia
                    }
                }

                if (this.vy < 0) {
                    this.animacion = this.aMoverArriba
                } else if (this.vy > 0) {
                    this.animacion = this.aMoverAbajo;
                } else if (this.vx < 0) {
                    this.animacion = this.aMoverIzq;
                } else if (this.vx > 0) {
                    this.animacion = this.aMoverDer;
                } else {
                    this.animacion = this.aIdle;
                }
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                this.vx = 0;
                this.vy = 0
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