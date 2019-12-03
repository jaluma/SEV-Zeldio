class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador, x, y)
        this.estado = estados.moviendo;

        this.orientacion = orientaciones.derecha;

        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        // Animaciones
        this.aIdle = new Animacion(imagenes.jugador_idle, this.ancho, this.alto, 10, 8);

        this.aCorriendoDerecha = new Animacion(imagenes.jugador_corriendo_derecha,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoIzquierda = new Animacion(imagenes.jugador_corriendo_izquierda,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoArriba = new Animacion(imagenes.jugador_corriendo_arriba,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoAbajo = new Animacion(imagenes.jugador_corriendo_abajo,
            this.ancho, this.alto, 6, 8);

        // this.aAtacarDerecha = new Animacion(imagenes.jugador_disparando_derecha,
        //     this.ancho, this.alto, 6, 4, this.finAnimacionAtacar.bind(this));

        // this.aAtacarIzquierda = new Animacion(imagenes.jugador_disparando_izquierda,
        //     this.ancho, this.alto, 6, 4, this.finAnimacionAtacar.bind(this));

        this.animacion = this.aIdle;

        this.monedas = 0

        this.vidas = 3
        this.lastPerdida = Date.now()

        this.inventario = []
        this.interactuar = false
        this.delayBomba = 5
        this.actualBomba = 0
    }

    actualizar() {
        this.animacion.actualizar();

        this.actualBomba++

        // Establecer orientación
        if (this.vx > 0) {
            this.orientacion = orientaciones.derecha;
        }
        if (this.vx < 0) {
            this.orientacion = orientaciones.izquierda;
        }
        if (this.vy > 0) {
            this.orientacion = orientaciones.abajo;
        }
        if (this.vy < 0) {
            this.orientacion = orientaciones.arriba;
        }

        switch (this.estado) {
            case estados.atacando:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aAtacarDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aAtacarIzquierda;
                }
                break;
            case estados.moviendo:
                if (this.vx != 0) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aCorriendoDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aCorriendoIzquierda;
                    }
                }
                if (this.vy != 0) {
                    if (this.orientacion == orientaciones.arriba) {
                        this.animacion = this.aCorriendoArriba;
                    }
                    if (this.orientacion == orientaciones.abajo) {
                        this.animacion = this.aCorriendoAbajo;
                    }
                }

                if (this.vx == 0 && this.vy == 0) {
                    this.animacion = this.aIdle;
                }
                break;
        }
    }

    moverX(direccion) {
        if (this.vy == 0) {
            this.vx = direccion * 2.5;
        }
    }

    moverY(direccion) {
        if (this.vx == 0) {
            this.vy = direccion * 2.5;
        }
    }

    atacar() {
        if (this.actualBomba >= this.delayBomba * 20) {
            var bomba = new Bomba(this.x, this.y, 3, 2);
            bomba.y = bomba.y - bomba.alto / 2;

            this.actualBomba = 0

            return bomba
        }
        return null
    }

    finAnimacionAtacar() {
        this.estado = estados.moviendo;
    }


    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    perderVida() {
        if (Date.now() - this.lastPerdida > 3 * 1000) {
            this.vidas--
            this.lastPerdida = Date.now()
        }
    }

    getDirection() {
        if (this.vx > 0) {
            return "R"
        }
        if (this.vx < 0) {
            return "L"
        }
        if (this.vy < 0) {
            return "U"
        }
        if (this.vy > 0) {
            return "D"
        }
    }

    isInteractuar() {
        return this.interactuar
    }
}