class Enemigo extends Modelo {

    constructor(imagen, x, y) {
        super(imagen, x, y)

        this.estado = estados.moviendo;

        this.vxInteligencia = 1;
        this.vyInteligencia = 1
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


    getRecompensa(){
        this.recompensas = [];
        recompensa[1] = null;
        recompensa[2] = new Moneda(imagenes.moneda, this.x, this.y);
        recompensa[3] = new Vida(imagenes.vida, this.x. this.y);

        var recompensa =  this.recompensas[Math.floor(Math.random() * this.recompensas.length)];
        return recompensa;
    }

}