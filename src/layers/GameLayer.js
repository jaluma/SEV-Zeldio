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

        this.generadoresEnemigos = []
        this.enemigos = [];

        this.coleccionables = []
        this.interactuables = []
        this.textos = []

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
        for (var i = 0; i < this.generadoresEnemigos.length; i++) {
            this.generadoresEnemigos[i].actualizar();
        }
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }
        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].actualizar();
        }
        for (var i = 0; i < this.interactuables.length; i++) {
            this.interactuables[i].actualizar();
        }
        for (var i = 0; i < this.bloques.length; i++) {
            if (this.bloques[i].isDestruible()) {
                if (this.bloques[i].isSaltable() && this.jugador.colisiona(this.bloques[i])) {
                    this.destruirBloques(i)
                }
            }
        }

        // colisiones
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.jugador.perderVida()

                this.enemigos.splice(i, 1);
                i = i - 1;
            }
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            if (this.jugador.colisiona(this.coleccionables[i])) {
                this.coleccionables[i].colision(this.jugador);

                this.coleccionables.splice(i, 1);
                i = i - 1;
            }
        }

        if (this.jugador.isInteractuar()) {
            for (var i = 0; i < this.interactuables.length; i++) {
                if (this.jugador.colisiona(this.interactuables[i])) {
                    var object = this.interactuables[i].interactuar(this.modelo)
                    if (typeof object === "string") {
                        this.textos.push(new TextoBocadillo(object))
                    } else if (object !== null) {
                        this.textos.push(new TextoBocadillo(object))
                            // añadir objeto al inventario
                    }
                    break;
                }
            }
        }

        this.monedas.valor = this.jugador.monedas

        var vidasAEliminar = this.iconoVidas.length - this.jugador.vidas
        if (vidasAEliminar > 0) {
            this.iconoVidas.splice(this.iconoVidas.length - vidasAEliminar, vidasAEliminar);
        }
    }

    destruirBloques(i) {
        if (this.bloques[i].estado == estadosTile.roto) {
            // creamos un nuevo elemento
            var bf = new Bloque(this.bloquePorDefecto, this.bloques[i].x, this.bloques[i].y)
            var b = new Bloque(imagenes.tablon, this.bloques[i].x, this.bloques[i].y)
            this.bloques.push(bf);
            this.espacio.agregarCuerpoEstatico(bf)
            this.bloques.push(b)
            this.espacio.agregarCuerpoEstatico(b)
                // eliminamos el anterior
            this.bloques.splice(i, 1);
            i = i - 1;

            // mover al jugador
            this.textos.push(new TextoBocadillo("Ohhh, te has caido!!", 3 * 10))
            this.jugador.x = this.spawnX
            this.jugador.y = this.spawnY
        } else {
            this.bloques[i].destruir();
        }
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
        for (var i = 0; i < this.generadoresEnemigos.length; i++) {
            this.generadoresEnemigos[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i = 0; i < this.interactuables.length; i++) {
            this.interactuables[i].dibujar(this.scrollX, this.scrollY);
        }

        // HUD
        this.iconoMonedas.dibujar();
        this.monedas.dibujar();

        for (var i = 0; i < this.iconoVidas.length; i++) {
            this.iconoVidas[i].dibujar()
        }

        for (var i = 0; i < this.textos.length; i++) {
            this.textos[i].dibujar(this.scrollX, this.scrollY);
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

        if (controles.interactuar) {
            this.jugador.interactuar = true
        } else {
            this.jugador.interactuar = false
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

            this.bloquePorDefecto = this.cargarObjetoMapa(lineas[0], 0, 0).path
            this.bloques.splice(0, 1)

            this.anchoMapa = (lineas[0].length - 1) * 64;
            this.altoMapa = (lineas.length - 2) * 64;
            for (var i = 1; i < lineas.length; i++) {
                var linea = lineas[i].split(' ');

                for (var j = 0; j < linea.length; j++) {
                    var simbolo = linea[j];
                    var x = 64 / 2 + j * 64; // x central
                    var y = 64 + i * 64; // y de abajo
                    this.cargarObjetoMapa(simbolo, x, y, this.bloquePorDefecto);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y, bloquePorDefecto = imagenes.cesped_cc) {
        switch (simbolo) {
            case "Pl_1":
                // jugador 1
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                this.añadirBloque(bloquePorDefecto, x, y)

                // guardamos los puntos de spawn
                this.spawnX = this.jugador.x
                this.spawnY = this.jugador.y
                break;
            case "G_En":
                // Generador de enemigos
                var generadorEnemigos = new GeneradorEnemigos(imagenes.teleport_azul, x, y)
                generadorEnemigos.y = generadorEnemigos.y - generadorEnemigos.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.generadoresEnemigos.push(generadorEnemigos)
                this.espacio.agregarCuerpoEstatico(generadorEnemigos);
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
        }

        // objetos del mapa
        switch (simbolo) {
            case this.getCase(simbolo, "ArbP"):
                // arbol verde
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.treeP, x, y)
                break;
            case this.getCase(simbolo, "ArbC"):
                // arbol rojo
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.treeC, x, y)
                break;
            case this.getCase(simbolo, "Mone"):
                // moneda
                var moneda = new Moneda(imagenes.moneda, x, y);
                moneda.y = moneda.y - moneda.alto / 2;
                this.coleccionables.push(moneda);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.espacio.agregarCuerpoDinamico(moneda);
                break;
            case this.getCase(simbolo, "Moha"):
                // mohai
                var mohai = new Mohai(x, y);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirModeloEstatico(mohai)
                break;
            case this.getCase(simbolo, "CofA"):
                // cofre
                var modelo = new Cofre(x, y);
                this.añadirBloque(bloquePorDefecto, x, y)
                modelo.y = modelo.y - modelo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.interactuables.push(modelo);
                this.espacio.agregarCuerpoEstatico(modelo)
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
                return this.añadirBloque(imagenes.cesped_si, x, y)
            case this.getCase(simbolo, "C_sc"):
                return this.añadirBloque(imagenes.cesped_sc, x, y)
            case this.getCase(simbolo, "C_sd"):
                return this.añadirBloque(imagenes.cesped_sd, x, y)
            case this.getCase(simbolo, "C_ci"):
                return this.añadirBloque(imagenes.cesped_ci, x, y)
            case this.getCase(simbolo, "C_cc"):
                return this.añadirBloque(imagenes.cesped_cc, x, y)
            case this.getCase(simbolo, "C_cd"):
                return this.añadirBloque(imagenes.cesped_cd, x, y)
            case this.getCase(simbolo, "C_ii"):
                return this.añadirBloque(imagenes.cesped_ii, x, y)
            case this.getCase(simbolo, "C_ic"):
                return this.añadirBloque(imagenes.cesped_ic, x, y)
            case this.getCase(simbolo, "C_id"):
                return this.añadirBloque(imagenes.cesped_id, x, y)
        }

        // caminos de tierra
        switch (simbolo) {
            case this.getCase(simbolo, "Ca_s"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_sup, x, y)
                break;
            case this.getCase(simbolo, "Ca_a"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_abajo, x, y)
                break;
            case this.getCase(simbolo, "Ca_i"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_izqda, x, y)
                break;
            case this.getCase(simbolo, "Ca_d"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_dcha, x, y)
                break;
            case this.getCase(simbolo, "Cr_d"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.cruce_supdcha, x, y)
                break;
            case this.getCase(simbolo, "Cr_i"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.cruce_supizqda, x, y)
                break;
        }

        // suelo de madera
        switch (simbolo) {
            case this.getCase(simbolo, "Ma_H"):
                var bloque = new TileDestruible(imagenes.madera_h, x, y);
                bloque.y = bloque.y - bloque.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                return bloque
            case this.getCase(simbolo, "Ma_V"):
                var bloque = new TileDestruible(imagenes.madera_v, x, y);
                bloque.y = bloque.y - bloque.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                return bloque
        }

        // baldosas
        switch (simbolo) {
            case this.getCase(simbolo, "B_si"):
                return this.añadirBloque(imagenes.baldosa_si, x, y)
            case this.getCase(simbolo, "B_sc"):
                return this.añadirBloque(imagenes.baldosa_sc, x, y)
            case this.getCase(simbolo, "B_sd"):
                return this.añadirBloque(imagenes.baldosa_sd, x, y)
            case this.getCase(simbolo, "B_ci"):
                return this.añadirBloque(imagenes.baldosa_ci, x, y)
            case this.getCase(simbolo, "B_cc"):
                return this.añadirBloque(imagenes.baldosa_cc, x, y)
            case this.getCase(simbolo, "B_cd"):
                return this.añadirBloque(imagenes.baldosa_cd, x, y)
            case this.getCase(simbolo, "B_ii"):
                return this.añadirBloque(imagenes.baldosa_ii, x, y)
            case this.getCase(simbolo, "B_ic"):
                return this.añadirBloque(imagenes.baldosa_ic, x, y)
            case this.getCase(simbolo, "B_id"):
                return this.añadirBloque(imagenes.baldosa_id, x, y)
        }

        // castillo
        switch (simbolo) {
            case this.getCase(simbolo, "Cas1"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.cast1, x, y)
                break;
            case this.getCase(simbolo, "Cas2"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_izqda, x, y)
                this.añadirBloqueEstatico(imagenes.cast2, x, y)
                break;
            case this.getCase(simbolo, "Cas3"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.cast3, x, y)
                break;
            case this.getCase(simbolo, "Cas4"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_dcha, x, y)
                this.añadirBloqueEstatico(imagenes.cast4, x, y)
                break;
            case this.getCase(simbolo, "Cas5"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.cast5, x, y)
                break;
            case this.getCase(simbolo, "Cas6"):
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.cast6, x, y)
                break;
        }
    }

    getCase(symbol, c) {
        var rt = symbol.includes(c)
        return rt ? symbol : ''
    }

    añadirBloqueEstatico(imagen, x, y) {
        return this.espacio.agregarCuerpoEstatico(this.añadirBloque(imagen, x, y))
    }

    añadirBloque(imagen, x, y) {
        var bloque = new Bloque(imagen, x, y);
        bloque.y = bloque.y - bloque.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(bloque);
        return bloque
    }

    añadirModeloEstatico(modelo) {
        modelo.y = modelo.y - modelo.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(modelo);
        this.espacio.agregarCuerpoEstatico(modelo)
        return modelo
    }
}