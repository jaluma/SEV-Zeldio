class Enemigo extends Modelo {

    constructor(imagen, x, y) {
        super(imagen, x, y)

        this.estado = estados.moviendo;

        this.vxInteligencia = 1;
        this.vyInteligencia = 1
        this.vx = 0;
        this.vy = 0;

        this.animacion = null

        this.coleccionables = []
        this.coleccionables.push(null)  // no devolver nada
        this.coleccionables.push(new Moneda(imagenes.moneda))

        this.delay = 3000
        this.actual = 0
    }

    finAnimacionMorir() {
        this.estado = estados.muerto;
        this.añadirColeccionable()
    }

    actualizar() {
        this.animacion.actualizar();

        switch (this.estado) {
            case estados.moviendo:
                var path = findShortestPath(this, layer.matrizCaminos);
                if (!path) {
                    // no hay camino
                    this.vx = 0
                    this.vy = 0
                } else {
                    var direction = path[0]
                    this.vx = this.vxInteligencia * direction[0]
                    this.vy = this.vxInteligencia * direction[1]
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
                this.vy = 0;

                if (this.actual++ >= this.delay) {
                    this.finAnimacionMorir()
                }

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

    getColeccionable() {
        var random = Math.floor(Math.random() * this.coleccionables.length)
        var coleccionable = this.coleccionables[random]
        console.log(this)
        if (coleccionable) {
            coleccionable.x = Math.floor(this.x)
            coleccionable.y = Math.floor(this.y)
            coleccionable.vx = 0
            coleccionable.vy = 0
            return this.clone(coleccionable)
        }
        return null
    }

    añadirColeccionable() {
        var coleccionable = this.getColeccionable()
        if (coleccionable !== null) {
            layer.coleccionables.push(coleccionable)
            layer.espacio.agregarCuerpoDinamico(coleccionable);
        }
    }

}