class ObjetoInventario {

    constructor(imagenRuta, texto) {
        this.path = imagenRuta
        this.imagen = cache[imagenRuta];
        this.texto = texto
    }

    dibujar() {
        contexto.drawImage(this.imagen,
            this.x - this.imagen.width / 2,
            this.y - this.imagen.height / 2);
    }
}