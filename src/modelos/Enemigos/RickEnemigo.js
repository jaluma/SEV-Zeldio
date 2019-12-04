class RickEnemigo extends Enemigo {

    constructor(x, y) {
        super(imagenes.rickEnemigo, x, y)

        this.aIdle = new Animacion(imagenes.rickEnemigo, this.ancho, this.alto, 10, 1)
        this.aMoverAbajo = new Animacion(imagenes.rickEnemigoAbajo, this.ancho, this.alto, 10, 4)
        this.aMoverArriba = new Animacion(imagenes.rickEnemigoArriba, this.ancho, this.alto, 10, 4)
        this.aMoverDer = new Animacion(imagenes.rickEnemigoDerecha, this.ancho, this.alto, 10, 4)
        this.aMoverIzq = new Animacion(imagenes.rickEnemigoIzquierda, this.ancho, this.alto, 10, 4)
        this.aMorir = new Animacion(imagenes.rickEnemigoMorir, this.ancho, this.alto, 3, 5)

        // Ref a la animación actual
        this.animacion = this.aMoverAbajo;

        this.vxInteligencia = 0.7;
        this.delay = this.aMorir.framesTotales * this.aMorir.velocidadRefresco
    }
}