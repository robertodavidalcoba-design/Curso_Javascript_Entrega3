// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// Definicion de Variables, constantes y arreglos globales 
let asientosDisponibles = 8;
let sistemaActivo = true;

const precioBase = 150.0;
const recargoExceso = 50.0;
const LimiteEquipaje = 23.0;

//Iniciliazar lista
const listaPasajeros=[];

class Pasajero {
    static id=0
    constructor(nombre, pesoEquipaje, recargoPasaje, costoPasaje) {
        this.id =++ Pasajero.id;
        this.nombre = nombre;
        this.pesoEquipaje = pesoEquipaje;
        this.recargoPasaje = recargoPasaje;
        this.costoPasaje = costoPasaje;
        this.descuentoPasaje=0;
        this.descuento = 0;              
    }
    
    aplicarDescuento(porcentaje) {
        this.descuento = porcentaje;
        this.recalcular();
    }

    recalcular() {
        this.descuentoPasaje= this.costoPasaje * (this.descuento / 100);
        this.costoPasaje = this.costoPasaje - this.descuentoPasaje;
    }
}
const excedePeso = (peso, limite) => peso > limite;

function cantidadValida(cantidad, disponibles) {
    if (isNaN(cantidad)) {
        return false;
    }
    if (cantidad % 1 !== 0) {
        return false;
    }
    if (cantidad <= 0 || cantidad > disponibles) {
        return false;
    }
    return true;
}

// Funciones

function solicitarCodigoVuelo(mensaje) {
    let codigo = prompt(mensaje);
    if (codigo === null || codigo.trim().toUpperCase() === "SALIR") {
        return "SALIR";
    }
    return codigo.trim().toUpperCase();
}

function solicitarCantidadPasajeros(codigoVuelo, disponibles) {
    let texto = prompt("Cuántos pasajes desea procesar?");
    return Number(texto);
}

function solicitarNombrePasajero() {
    let solicitarNombre = prompt("Ingrese el nombre y apellido:");
    let nombre=solicitarNombre.trim().toUpperCase();
    while (nombre === null || nombre.trim() === "") {
        nombre = prompt('Nombre inválido. Ingrese nuevamente');
    }
    return nombre;
}

// Pide el nombre del pasajero y lo devuelve como texto (string)
const solicitarDatosPasajero = () => {
    let solicitarNombre = prompt("Ingrese el nombre y apellido:");
    let nombre= solicitarNombre.trim().toUpperCase();
    while (nombre === null || nombre.trim() === "") {
        solicitarNombre = prompt('Nombre inválido. Ingrese nuevamente');
        nombre= solicitarNombre.trim().toUpperCase();
    }
    let entradaPesoEquipaje=prompt("Ingrese el peso del equipaje:");
    let pesoEquipaje=Number(entradaPesoEquipaje);
    while (isNaN(pesoEquipaje) || pesoEquipaje <= 0) {
        entradaPesoEquipaje = prompt("Peso inválido. Ingrese un número mayor a 0:");
        pesoEquipaje = Number(entradaPesoEquipaje);
    }
    let recargoPasaje = calcularRecargo(pesoEquipaje, recargoExceso);
    let costoPasaje= recargoPasaje + precioBase;
    return {
        nombre: nombre,
        pesoEquipaje: pesoEquipaje,
        recargoPasaje: recargoPasaje,
        costoPasaje: costoPasaje,
    };
  
}


function calcularRecargo(pesoMaleta, recargoExceso) {
    if (excedePeso(pesoMaleta, LimiteEquipaje)) {
        return recargoExceso;
    }
    return 0;
}

function mostrarPasajero(nombre, peso, recargo, costo, precioBase) {
    if (recargo > 0) {
        alert("Pasajero: " + nombre +"\nEquipaje: " + peso + " kg (Supera los " + LimiteEquipaje + " kg)" +  "\nCosto Boleto: $" + precioBase +
              "\nRecargo: $" + recargo + "\nTotal: $" + costo);
    } else {
        alert("Pasajero: " + nombre + "\nEquipaje: " + peso + " kg (Correcto)" + "\nCosto Boleto: $" + precioBase);
    }

    console.log("--- Registro de Pasaje ---");
    console.log("Nombre del pasajero:", nombre);
    console.log("Peso de equipaje:", peso, "kg");
    console.log("Recargo por peso maleta: $", recargo);
    console.log("Precio del pasaje: $", costo);
}

function mostrarResumen(codigoVuelo, confirmados, total) {
    alert(" RESUMEN DE LA RESERVA ---\nVuelo:" + codigoVuelo +"\nPasajeros confirmados: " + confirmados + " Monto total a pagar: $"+ total);
}


// Opcion 1 - Procesar las reservas de asientos

function procesarReserva() {
    let totalReserva = 0;
    let confirmados = 0;
    let asignados=listaPasajeros.length;
    
    while (sistemaActivo) {
        if (asientosDisponibles > 0) {
            const codigoVuelo = solicitarCodigoVuelo(
            "Ingrese el código del vuelo (ej: AR1400) o escriba 'salir' para cerrar el sistema:"
            );
            if (codigoVuelo !== "SALIR") {
                const cantidad = solicitarCantidadPasajeros(codigoVuelo, asientosDisponibles);
                if (cantidadValida(cantidad, asientosDisponibles)) {
                    for (let i = 0; i < cantidad; i++) {
                        if (asientosDisponibles > 0) {
                            const datos = solicitarDatosPasajero();
                            const pasajero1 = new Pasajero(datos.nombre, datos.pesoEquipaje, datos.recargoPasaje,datos.costoPasaje);
                            listaPasajeros.push(pasajero1);
                            mostrarPasajero(datos.nombre, datos.pesoEquipaje, datos.recargoPasaje, datos.costoPasaje, precioBase);
                            totalReserva += datos.costoPasaje;
                            asientosDisponibles--;
                            confirmados++;
                        }else{
                            alert("SIN CUPO, No quedan asientos disponibles.");
                            sistemaActivo = false;
                        }
                    } 
                    mostrarResumen(codigoVuelo, confirmados, totalReserva)   
                } else {
                    alert("ERROR, Cantidad inválida.\nAsientos disponibles: " + asientosDisponibles);
                }
            } else {
                sistemaActivo = false;
                alert("Cerrando sesión del sistema de reservas. ¡Chau!");
            }
        }else{
            sistemaActivo=false;
            alert("Cerrando sesión del sistema de reservas. No tenemos asientos disponibles");
        }
    }
}

// Opcion 2 - Buscar por el nombre del pasajero
function buscarPasajero() {
    let nombre = solicitarNombrePasajero();

    let posicion = -1;
    let contador = 0;

    // Recorre el array uno por uno comparando el nombre
    for (const pasajero of listaPasajeros) {
        if (pasajero.nombre === nombre) {
            posicion = contador;
        }
        contador++;
    }

    if (posicion !== -1) {
        console.log("El pasajero está en lista, en la posición", posicion);
        alert("El pasajero " + nombre + " está en lista, en la posición " + posicion);
    } else {
        console.log("El pasajero no está en lista");
        alert("El pasajero no está en lista");
    }
    return posicion;
}

// Opcion 3 - Imprimir listado de pasajeros
function imprimirListadoFinalConsola() {
    console.log("         LISTADO FINAL DE PASAJEROS PROCESADOS              ");
 

    if (listaPasajeros.length === 0) {
        console.log("No se procesó ninguna reserva.");
    } else {
        for (const pasajero of listaPasajeros) {
            console.log("Pasajero:" + pasajero.nombre + " Peso Equipaje:"+ pasajero.pesoEquipaje + " Costo del pasaje:" + pasajero.costoPasaje);
        }
        console.log("Total: " , listaPasajeros.length ," pasajeros");
    }
    console.log("============================================================\n");
}

// Opcion 4 - Eliminar los pasajeros que ingresaron por el sistema no incluyen los inicializados
function borrarPasajeros(posicion) {
    if (listaPasajeros.length===8){
        const pasajero1 = listaPasajeros.pop();
        console.log("Se ha eliminado al pasajero: ", pasajero1.nombre);
        const pasajero2 = listaPasajeros.pop(); 
        console.log("Se ha eliminado al pasajero: ", pasajero2.nombre);
        const pasajero3 = listaPasajeros.pop(); 
        console.log("Se ha eliminado al pasajero: ", pasajero3.nombre);
        const pasajero4 = listaPasajeros.pop(); 
        console.log("Se ha eliminado al pasajero: ", pasajero4.nombre);
        asientosDisponibles+=asientosDisponibles+4;
    } else{
        alert("Todavia existen asientos disponibles, ir a la opcion 1 del menu");
    }

}

// Opcion 5 - Modificar los datos de un pasajero de la lista
function modificarDatosPasajero(posicion) {
    if (posicion >= 0 && posicion < listaPasajeros.length) {
        const pasajero = listaPasajeros[posicion];
        alert("El pasajero a modificar es: " + pasajero.nombre);

        const datos = solicitarDatosPasajero();
        pasajero.nombre = datos.nombre;
        pasajero.pesoEquipaje = datos.pesoEquipaje;
        pasajero.recargoPasaje = datos.recargoPasaje;
        pasajero.costoPasaje = datos.costoPasaje;

        console.log("--- Registro de Pasajero Modificado ---");
        console.log("Nombre del pasajero:", pasajero.nombre);
        console.log("Peso de equipaje:", pasajero.pesoEquipaje, "kg");
        console.log("Recargo por peso maleta: $", pasajero.recargoPasaje);
        console.log("Precio del pasaje: $", pasajero.costoPasaje);
        alert("Datos del pasajero modificados correctamente");
    } else {
        console.log("El pasajero no está en lista");
        alert("No se puede modificar: el pasajero no está en lista");
    }
    return posicion;
}

// Opcion 6 - Aplicar un descuento en el pasaje a un pasajero de la lista
function aplicarDescuentoPasajero(posicion) {
    if (posicion >= 0 && posicion < listaPasajeros.length) {
        const seleccionPasajero = listaPasajeros[posicion];
        alert("El pasajero a aplicar descuento es: " + seleccionPasajero.nombre);

        let entradaPorcentaje = prompt("Ingrese porcentaje de descuento a aplicar (1 a 100):");
        let porcentaje = Number(entradaPorcentaje);

        while (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
            entradaPorcentaje = prompt("Error. Ingrese un valor entre 1 y 100:");
            porcentaje = Number(entradaPorcentaje);
        }

        seleccionPasajero.aplicarDescuento(porcentaje);

        console.log("--- Registro de Pasajero con Descuento ---");
        console.log("Nombre del pasajero:", seleccionPasajero.nombre);
        console.log("Peso de equipaje:", seleccionPasajero.pesoEquipaje, "kg");
        console.log("Recargo por peso maleta: $", seleccionPasajero.recargoPasaje);
        console.log("Descuento aplicado (" + porcentaje + "%): -$", seleccionPasajero.descuentoPasaje);
        console.log("Precio final del pasaje: $", seleccionPasajero.costoPasaje);

        alert("Descuento aplicado correctamente a " + seleccionPasajero.nombre);
    } else {
        console.log("El pasajero no está en lista");
        alert("No se puede aplicar descuento: el pasajero no está en lista");
    }
    return posicion;
}

function inicializarListaObjetos(){
    let texto="";
    const pasajero1 = new Pasajero("DAVID",20,0,150);
    listaPasajeros.push(pasajero1);
    const pasajero2 = new Pasajero("JUAN",25,50,200);
    listaPasajeros.push(pasajero2);
    const pasajero3 = new Pasajero("CECILIA",30,50,200);
    listaPasajeros.push(pasajero3);
    const pasajero4 = new Pasajero("MILAGROS",20,0,150);
    listaPasajeros.push(pasajero4);
    for (const pasajero of listaPasajeros) {
        texto += "\nNombre: " + pasajero.nombre + " | Equipaje: " + pasajero.pesoEquipaje + " kg" + " | Costo: $" + pasajero.costoPasaje;
    }

    alert(texto);
}


// PROGRAMA PRINCIPAL

alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");


let opcion = "";
let pos=-1;
inicializarListaObjetos();
alert("Se procedio a realizar la instanciacion de 4 objetos");
asientosDisponibles= 8 - listaPasajeros.length;
while (opcion !== "7") {
  opcion = prompt(
    "MENÚ DE VUELOS\n\n" +
    "1 - Procesar Registrar pasajes\n" +
    "2 - Buscar un pasajero\n" +
    "3 - Impresion de pasajeros\n" +
    "4 - Eliminar los pasajeros ingresados\n" +
    "5 - Modificar datos de un pasajero\n" +
    "6 - Aplicar descuento a un pasajero\n" +
    "7 - Fin\n\n" +
    "Seleccione una opción:"
  );

  switch (opcion) {
    case "1":
        alert("Registrar pasajeros");
        procesarReserva();
        sistemaActivo = true;
        break;
    case "2":
        alert("Buscar a un pasajero en el vuelo");
        pos=buscarPasajero();
        break;
    case "3":
        alert("Imprimir lista de pasajeros");
        imprimirListadoFinalConsola();
        break;
    case "4":
        alert("Eliminar los pasajeros que ingresaste");
        borrarPasajeros();
        imprimirListadoFinalConsola();
        break;
    case "5":
        alert("Modificar datos de un pasajero");
        pos=buscarPasajero();
        modificarDatosPasajero(pos);
        break;
    case "6":
        alert("Aplicar un descuento a un pasajero");
        pos=buscarPasajero();
        aplicarDescuentoPasajero(pos);
        break;        
    case "7":
        alert("Fin del programa");
        break;    
    default:
      alert("Opción no válida, intente de nuevo");
    }
}