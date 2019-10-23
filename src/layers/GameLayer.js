class GameLayer extends Layer {

    constructor() {
        super();

        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(0);

        this.scrollX = 0;
        this.bloques = [];

        this.fondo = new Fondo(imagenes.fondo_2, resolution.width * 0.5, resolution.height * 0.5);

        this.enemigos = [];

        this.coleccionables = []

        this.iconoMonedas = new Fondo(imagenes.moneda, resolution.width * 0.85, resolution.height * 0.05);
        this.monedas = new Texto(0, resolution.width * 0.9, resolution.height * 0.07);

        this.cargarMapa("res/" + nivelActual + ".txt");

        // cargar despues del mapa cuando se sepa las vidas del jugador
        this.iconoVidas = []
        var initialX = 0.1
        for (var i = 0; i < this.jugador.vidas; i++) {
            var x = parseFloat(initialX + i * 0.03).toFixed(2)
            this.iconoVidas.push(new Fondo(imagenes.icono_vidas, resolution.width * x, resolution.height * 0.05))
        }
    }

    actualizar() {
        this.espacio.actualizar();

        // elementos fuera
        // Enemigos muertos fuera del juego
        for (var j = 0; j < this.enemigos.length; j++) {
            if (this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto) {

                this.espacio.eliminarCuerpoDinamico(this.enemigos[j]);

                this.enemigos.splice(j, 1);
                j = j - 1;
            }
        }

        this.jugador.actualizar();
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].actualizar();
        }

        // colisiones
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.iniciar();
            }
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            if (this.jugador.colisiona(this.coleccionables[i])) {
                this.coleccionables[i].colosion(this.jugador);

                this.coleccionables.splice(i, 1);
                i = i - 1;
            }
        }

        this.monedas.valor = this.jugador.monedas

        var vidasAEliminar = this.iconoVidas.length - this.jugador.vidas
        this.iconoVidas.splice(this.iconoVidas.length - 1 - vidasAEliminar, vidasAEliminar);
    }

    calcularScroll() {
        this.scrollX = this.jugador.x - resolution.width / 2;
        this.scrollY = this.jugador.y - resolution.height / 2;
    }


    dibujar() {
        this.calcularScroll();

        this.fondo.dibujar();
        for (var i = 0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar(this.scrollX, this.scrollY);
        }

        this.jugador.dibujar(this.scrollX, this.scrollY);
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].dibujar(this.scrollX, this.scrollY);
        }

        // HUD
        this.iconoMonedas.dibujar();
        this.monedas.dibujar();

        for (var i = 0; i < this.iconoVidas.length; i++) {
            this.iconoVidas[i].dibujar()
        }
    }


    procesarControles() {
        // disparar
        if (controles.atacar) {
            var nuevoAtaque = this.jugador.atacar;
            if (nuevoAtaque != null) {
                this.espacio.agregarCuerpoDinamico(nuevoAtaque);
                // hacer algo con el ataque
            }
        }

        // Eje X
        if (controles.moverX > 0) {
            this.jugador.moverX(1);
        } else if (controles.moverX < 0) {
            this.jugador.moverX(-1);
        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if (controles.moverY > 0) {
            this.jugador.moverY(1)
        } else if (controles.moverY < 0) {
            this.jugador.moverY(-1)
        } else {
            this.jugador.moverY(0)
        }

    }

    cargarMapa(ruta) {
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function() {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length - 1) * 64;
            this.altoMapa = (lineas.length - 1) * 64;
            for (var i = 0; i < lineas.length; i++) {
                var linea = lineas[i].split(' ');

                for (var j = 0; j < linea.length; j++) {
                    var simbolo = linea[j];
                    var x = 64 / 2 + j * 64; // x central
                    var y = 64 + i * 64; // y de abajo
                    this.cargarObjetoMapa(simbolo, x, y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch (simbolo) {
            case "E":
                var enemigo = new Enemigo(x, y);
                enemigo.y = enemigo.y - enemigo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
            case "Pl_1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
        }

        // objetos del mapa
        switch (simbolo) {
            case this.getCase(simbolo, "ArbP"):
                // arbol verde
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.treeP, x, y)
                break;
            case this.getCase(simbolo, "ArbC"):
                // arbol rojo
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.treeC, x, y)
                break;
            case this.getCase(simbolo, "Mone"):
                // moneda
                var moneda = new Moneda(imagenes.moneda, x, y);
                moneda.y = moneda.y - moneda.alto / 2;
                this.coleccionables.push(moneda);
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.espacio.agregarCuerpoDinamico(moneda);
                break;
        }

        // añadimos los bloques
        // cesped
        switch (simbolo) {
            case this.getCase(simbolo, "0000"):
                //muro invisible
                this.añadirBloqueEstatico(imagenes.transparente, x, y)
                break;
            case this.getCase(simbolo, "C_si"):
                this.añadirBloque(imagenes.cesped_si, x, y)
                break;
            case this.getCase(simbolo, "C_sc"):
                this.añadirBloque(imagenes.cesped_sc, x, y)
                break;
            case this.getCase(simbolo, "C_sd"):
                this.añadirBloque(imagenes.cesped_sd, x, y)
                break;
            case this.getCase(simbolo, "C_ci"):
                this.añadirBloque(imagenes.cesped_ci, x, y)
                break;
            case this.getCase(simbolo, "C_cc"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
            case this.getCase(simbolo, "C_cd"):
                this.añadirBloque(imagenes.cesped_cd, x, y)
                break;
            case this.getCase(simbolo, "C_ii"):
                this.añadirBloque(imagenes.cesped_ii, x, y)
                break;
            case this.getCase(simbolo, "C_ic"):
                this.añadirBloque(imagenes.cesped_ic, x, y)
                break;
            case this.getCase(simbolo, "C_id"):
                this.añadirBloque(imagenes.cesped_id, x, y)
                break;
        }

        // caminos de tierra
        switch (simbolo) {
            case this.getCase(simbolo, "Ca_s"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_sup, x, y)
                break;
            case this.getCase(simbolo, "Ca_a"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_abajo, x, y)
                break;
            case this.getCase(simbolo, "Ca_i"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_izqda, x, y)
                break;
            case this.getCase(simbolo, "Ca_d"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_dcha, x, y)
                break;
            case this.getCase(simbolo, "Cr_d"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.cruce_supdcha, x, y)
                break;
            case this.getCase(simbolo, "Cr_i"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.cruce_supizqda, x, y)
                break;
        }

        // castillo
        switch (simbolo) {
            case this.getCase(simbolo, "Cas1"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.cast1, x, y)
                break;
            case this.getCase(simbolo, "Cas2"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_izqda, x, y)
                this.añadirBloqueEstatico(imagenes.cast2, x, y)
                break;
            case this.getCase(simbolo, "Cas3"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.cast3, x, y)
                break;
            case this.getCase(simbolo, "Cas4"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloque(imagenes.camino_dcha, x, y)
                this.añadirBloqueEstatico(imagenes.cast4, x, y)
                break;
            case this.getCase(simbolo, "Cas5"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.cast5, x, y)
                break;
            case this.getCase(simbolo, "Cas6"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.cast6, x, y)
                break;
        }
    }

    getCase(symbol, c) {
        var rt = symbol.includes(c)
        return rt ? symbol : ''
    }

    añadirBloqueEstatico(imagen, x, y) {
        this.espacio.agregarCuerpoEstatico(this.añadirBloque(imagen, x, y))
    }

    añadirBloque(imagen, x, y) {
        var bloque = new Bloque(imagen, x, y);
        bloque.y = bloque.y - bloque.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(bloque);
        return bloque
    }
}