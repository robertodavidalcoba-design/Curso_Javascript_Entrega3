// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// Definicion de Variables, constantes y arreglos globales 
let asientosDisponibles = 8;
let sistemaActivo = true;

const precioBase = 150.0;
const recargoExceso = 50.0;
const limiteEquipaje = 23.0;

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

function calcularRecargo(pesoMaleta) {
    if (excedePeso(pesoMaleta, limiteEquipaje)) {
        return recargoExceso;
    }
    return 0;
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
    let recargoPasaje = calcularRecargo(pesoEquipaje);
    let costoPasaje= recargoPasaje + precioBase;
    return {
        nombre: nombre,
        pesoEquipaje: pesoEquipaje,
        recargoPasaje: recargoPasaje,
        costoPasaje: costoPasaje,
    };
  
}


function mostrarPasajero(newPasajero) {
    if (newPasajero.recargoPasaje > 0) {
        alert("Pasajero: " + newPasajero.nombre +"\nEquipaje: " + newPasajero.pesoEquipaje + " kg (Supera los " + limiteEquipaje + " kg)" +  "\nCosto Boleto: $" + precioBase +
              "\nRecargo: $" + newPasajero.recargoPasaje + "\nTotal: $" + newPasajero.costoPasaje);
    } else {
        alert("Pasajero: " + newPasajero.nombre + "\nEquipaje: " + newPasajero.pesoEquipaje + " kg (Correcto)" + "\nCosto Boleto: $" + precioBase);
    }

    console.log("--- Registro de Pasaje ---");
    console.log("Nombre del pasajero:", newPasajero.nombre);
    console.log("Peso de equipaje Kg:", newPasajero.pesoEquipaje);
    console.log("Recargo por peso maleta: $", newPasajero.recargoPasaje);
    console.log("Precio del pasaje: $", newPasajero.costoPasaje);
}

function mostrarResumen(codigoVuelo, confirmados, total) {
    alert(" RESUMEN DE LA RESERVA ---\nVuelo:" + codigoVuelo +"\nPasajeros confirmados: " + confirmados + " Monto total a pagar: $"+ total);
}


// Opcion 1 - Procesar las reservas de asientos
function procesarReserva() {
    while (sistemaActivo) {
        if (asientosDisponibles > 0) {
            const codigoVuelo = solicitarCodigoVuelo("Ingrese el código del vuelo (ej: AR1400) o escriba 'salir' para cerrar el sistema:");
            if (codigoVuelo !== "SALIR") {
                const cantidad = solicitarCantidadPasajeros(codigoVuelo, asientosDisponibles);
                if (cantidadValida(cantidad, asientosDisponibles)) {
                    let i = 0;
                    let totalReserva=0;
                    while (i < cantidad) {
                        const datos = solicitarDatosPasajero();
                        const yaExiste = listaPasajeros.some((p) => p.nombre === datos.nombre);
                        if (yaExiste) {
                            alert("Aviso: el pasajero " + datos.nombre + " ya tiene registrado un pasaje. Ingrese otro pasajero.");
                        } else {
                            const nuevoPasajero = new Pasajero(
                                datos.nombre,
                                datos.pesoEquipaje,
                                datos.recargoPasaje,
                                datos.costoPasaje
                            );
                            listaPasajeros.push(nuevoPasajero);
                            totalReserva += datos.costoPasaje;
                            mostrarPasajero(nuevoPasajero);
                            i++; 
                        }
                    }
                    const confirmados = i;
                    asientosDisponibles -= confirmados;
                    mostrarResumen(codigoVuelo, confirmados, totalReserva);
                } else {
                    alert("ERROR, Cantidad inválida.\nAsientos disponibles: " + asientosDisponibles);
                }
            } else {
                sistemaActivo = false;
                alert("Cerrando sesión del sistema de reservas. ¡Chau!");
            }
        } else {
            sistemaActivo = false;
            alert("Cerrando sesión del sistema de reservas. No tenemos asientos disponibles");
        }
    }
}

// Opcion 2 - Buscar por el nombre del pasajero
function buscarPasajero() {
    let nombre = solicitarNombrePasajero();

    // .find() devuelve el objeto Pasajero encontrado (o undefined si no está)
    const pasajeroBuscado = listaPasajeros.find((pasajero) => pasajero.nombre === nombre);

    if (pasajeroBuscado) {
        const posicion = listaPasajeros.indexOf(pasajeroBuscado);
        console.log("El pasajero está en lista, en la posición", posicion);
        alert("El pasajero " + pasajeroBuscado.nombre + " está en lista, en la posición " + posicion);
    } else {
        console.log("El pasajero no está en lista");
        alert("El pasajero no está en lista");
    }

    return pasajeroBuscado;
}

// Opcion 3 - Imprimir listado de pasajeros
function imprimirListadoFinalConsola() {
    console.log("         LISTADO FINAL DE PASAJEROS PROCESADOS              ");

    if (listaPasajeros.length === 0) {
        console.log("No se procesó ninguna reserva.");
    } else {
        listaPasajeros.forEach((pasajero) => console.log("Nombre=",pasajero.nombre," Costo del Pasaje=$",pasajero.costoPasaje));
        console.log("Total: ", listaPasajeros.length, " pasajeros");
    }
    console.log("============================================================\n");
}

// Opcion 4 - reporte de total de kilos en equipajes
function reportePesoEquipaje() {
    const kilosTotales = listaPasajeros.map((p) => p.pesoEquipaje).reduce((acum, kg) => acum + kg, 0);
    const conRecargo = listaPasajeros.filter((p) => p.recargoPasaje > 0);
    console.log("Total de peso de equipaje Kg: " , kilosTotales );
    console.log("Pasajeros con recargo:" , conRecargo.length );
    if (conRecargo.length > 0) {
        conRecargo.forEach((p) =>console.log("-" , p.nombre , " | " , p.pesoEquipaje , " kg | Recargo: $" , p.recargoPasaje));
    }
}

// Opcion 5 - Modificar los datos de un pasajero de la lista
function modificarDatosPasajero(pasajero) {
    if (pasajero) {
        alert("El pasajero a modificar es: " + pasajero.nombre);
        const datos = solicitarDatosPasajero();
        const nombreDuplicado = listaPasajeros.some((p) => p.nombre === datos.nombre && p.id !== pasajero.id);
        if (nombreDuplicado) {
            alert("Error: Ya existe otro pasajero registrado con el nombre: " , datos.nombre);
            return;
        }
        pasajero.nombre = datos.nombre;
        pasajero.pesoEquipaje = datos.pesoEquipaje;
        pasajero.recargoPasaje = datos.recargoPasaje;
        pasajero.costoPasaje = datos.costoPasaje;
        pasajero.descuento = 0;
        pasajero.descuentoPasaje = 0;

        console.log("--- Registro de Pasajero Modificado ---");
        console.log("ID:", pasajero.id, "| Posición en lista:", listaPasajeros.indexOf(pasajero));
        console.log("Nombre del pasajero:", pasajero.nombre);
        console.log("Peso de equipaje Kg:", pasajero.pesoEquipaje);
        console.log("Recargo por peso maleta: $", pasajero.recargoPasaje);
        console.log("Precio del pasaje: $", pasajero.costoPasaje);
        alert("Datos del pasajero modificados correctamente");
    } else {
        console.log("El pasajero no está en lista");
        alert("No se puede modificar: el pasajero no está en lista");
    }
}

// Opcion 6 - Aplicar un descuento en el pasaje a un pasajero de la lista
function aplicarDescuentoPasajero(seleccionPasajero) {
    if (seleccionPasajero) {
        alert("El pasajero a aplicar descuento es: " + seleccionPasajero.nombre);

        let entradaPorcentaje = prompt("Ingrese porcentaje de descuento a aplicar (1 a 100):");
        let porcentaje = Number(entradaPorcentaje);

        while (entradaPorcentaje === null || entradaPorcentaje.trim() === "" || isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
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
        alert("Descuento aplicado correctamente a " + seleccionPasajero.nombre + "\nNuevo precio: $" + seleccionPasajero.costoPasaje);
    } else {
        console.log("El pasajero no está en lista");
        alert("No se puede aplicar descuento: el pasajero no está en lista");
    }
}

// Opcion 7 - Reporte del vuelo: total de pasajeros, total de ventas y descuento total
function reporteVuelo() {
    const totalPasajeros = listaPasajeros.length;
  
    const totalVentas = listaPasajeros.reduce((acum, p) => acum + p.costoPasaje, 0);
    const totalDescuentos = listaPasajeros.reduce((acum, p) => acum + p.descuentoPasaje, 0);
    const pasajerosConDescuento = listaPasajeros.filter((p) => p.descuento > 0).length;

    console.log("--- REPORTE DEL VUELO AR1400 ---");
    console.log("Total de pasajeros:", totalPasajeros);
    console.log("Total de venta de pasajes: $", totalVentas);
    console.log("Descuento total otorgado: $", totalDescuentos);
    console.log("Pasajeros con descuento:", pasajerosConDescuento);

    alert("REPORTE VUELO AR1400:" + "Total de pasajeros: " + totalPasajeros + "|Total de venta de pasajes: $" + totalVentas +"|Descuento total otorgado: $" + totalDescuentos);
}


// PROGRAMA PRINCIPAL

alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");


let opcion = "";
let pos=-1;
while (opcion !== "8") {
  opcion = prompt(
    "MENÚ DE VUELOS\n\n" +
    "1 - Procesar Registrar pasajes\n" +
    "2 - Buscar un pasajero\n" +
    "3 - Impresion de pasajeros\n" +
    "4 - Reporte de Total peso en equipajes\n" +
    "5 - Modificar datos de un pasajero\n" +
    "6 - Aplicar descuento a un pasajero\n" +
    "7 - Reporte del vuelo AR1400\n" +
    "8 - Fin\n\n" +
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
        pasajeroEncontrado = buscarPasajero();
        break;
    case "3":
        alert("Imprimir lista de pasajeros");
        imprimirListadoFinalConsola();
        break;
    case "4":
        alert("Reporte Total en Kg en equipajes");
        reportePesoEquipaje();
        break;
    case "5":
        alert("Modificar datos de un pasajero");
        pasajeroEncontrado = buscarPasajero();
        modificarDatosPasajero(pasajeroEncontrado);
        break;
    case "6":
        alert("Aplicar un descuento a un pasajero");
        pasajeroEncontrado = buscarPasajero();
        aplicarDescuentoPasajero(pasajeroEncontrado);
        break;        
    case "7":
        alert("Reporte del vuelo AR1400");
        reporteVuelo(); 
        break;  
    case "8":
        alert("Fin del programa");
        break;     
    default:
      alert("Opción no válida, intente de nuevo");
    }
}