class Texto {

    constructor(valor, x, y) {
        this.valor = valor;
        this.x = x;
        this.y = y;
    }

    dibujar() {
        contexto.font = "72px Consoles, Monaco, monospace";
        contexto.fillStyle = "white";
        contexto.textAlign = "center";
        contexto.fillText(this.valor, this.x, this.y);
    }

}