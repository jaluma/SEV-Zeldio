class Bomba extends Modelo {

    constructor(x, y, delay, rango) {
        super(imagenes.bomba, x, y)
        
        this.aInicio = new Animacion(imagenes.bomba, this.ancho, this.alto, 1, 1);

        this.aExplotando = new Animacion(imagenes.bomba_explosion, this.ancho, this.alto, 15, 3, false);

        this.animacion = this.aExplotando
        this.estado = bombaEstado.explotando
        this.delay = delay
        this.actual = 0
        this.rango = rango
    }

    finAnimacionMorir() {
        this.estado = estados.muerto;
    }

    actualizar (){
        this.actual++
        if (this.actual >= this.delay * 15) {
            this.estado = bombaEstado.haExplotado
        }
        this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    colisiona(modelo) {
        var colisiona = false;

        if (modelo.x - modelo.ancho / 2 <= this.x + this.ancho / 2 &&
            modelo.x + modelo.ancho / 2 >= this.x - this.ancho / 2 &&
            this.y + this.alto / 2 >= modelo.y - modelo.alto / 2 &&
            this.y - this.alto / 2 <= modelo.y + modelo.alto / 2) {

            colisiona = true;

        }
        return colisiona;
    }

    getRango() {
        return this.rango * this.ancho
    }

}
