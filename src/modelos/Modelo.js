class Modelo {

    constructor(imagenRuta, x, y) {
        this.path = imagenRuta
        this.imagen = cache[imagenRuta];
        this.x = x;
        this.y = y;
        this.ancho = this.imagen.width;
        this.alto = this.imagen.height;
        this.rango = 2
    }

    estaEnPantalla() {
        if ((this.x - gameLayer.scrollX) - this.ancho / 2 <= resolution.width &&
            (this.x - gameLayer.scrollX) + this.ancho / 2 >= 0 &&
            this.y - this.alto / 2 <= resolution.height &&
            this.y + this.alto / 2 >= 0) {
            return true;
        }
        return false;
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        contexto.drawImage(this.imagen,
            this.x - this.imagen.width / 2 - scrollX,
            this.y - this.imagen.height / 2 - scrollY);
    }

    colisiona(modelo) {
        var colisiona = false;

        if (modelo.x - modelo.ancho / this.rango <= this.x + this.ancho / this.rango &&
            modelo.x + modelo.ancho / this.rango >= this.x - this.ancho / this.rango &&
            this.y + this.alto / this.rango >= modelo.y - modelo.alto / this.rango &&
            this.y - this.alto / this.rango <= modelo.y + modelo.alto / this.rango) {

            colisiona = true;

        }
        return colisiona;
    }


}