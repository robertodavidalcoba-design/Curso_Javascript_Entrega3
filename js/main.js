// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// Definicion de Variables, constantes y arreglos globales 
let asientosDisponibles = 8;
let sistemaActivo = true;

const precioBase = 150.0;
const recargoExceso = 50.0;
const LimiteEquipaje = 23.0;

//Iniciliazar listas
const listaPasajeros=["DAVID","LUIS","CECILIA","JUAN"];
const listaPesoEquipajes=[20,20,30,30];
const listaCostoPasajes=[150,200,200,200];

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

// Pide el peso del equipaje y lo devuelve como número
function solicitarPesoPasajero() {
    let peso = Number(prompt("Ingrese el peso del equipaje (en kg):"));
    while (isNaN(peso) || peso < 0) {
        peso = Number(prompt("Peso inválido. Ingrese nuevamente el peso (en kg)"));
    }
    return peso;
}

// Pide el nombre del pasajero y lo devuelve como texto (string)
function solicitarNombrePasajero() {
    let nombre = prompt("Ingrese el nombre y apellido:");
    while (nombre === null || nombre.trim() === "") {
        nombre = prompt('Nombre inválido. Ingrese nuevamente');
    }
    return nombre.trim().toUpperCase();
}


function calcularRecargo(pesoMaleta, recargoExceso) {
    if (excedePeso(pesoMaleta, LimiteEquipaje)) {
        return recargoExceso;
    }
    return 0;
}

function calcularCostoFinal(precioBase, recargo) {
    return precioBase + recargo;
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
                            let nombre = solicitarNombrePasajero();
                            let peso=solicitarPesoPasajero();
                            let recargo = calcularRecargo(peso, recargoExceso);
                            let costo = calcularCostoFinal(precioBase, recargo);
                    
                            listaPasajeros.push(nombre.toUpperCase());
                            listaPesoEquipajes.push(peso);
                            listaCostoPasajes.push(costo);

                            mostrarPasajero(nombre, peso, recargo, costo, precioBase);

                            totalReserva += costo;
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

    const posicion = listaPasajeros.indexOf(nombre.toUpperCase());

    if (posicion !== -1) {
        console.log("El pasajero está en lista, en la posición ", posicion);
    } else {
        console.log("El pasajero no está en lista");
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
            console.log("Pasajero:" + pasajero);
        }
        console.log("Total: " , listaPasajeros.length ," pasajeros");
    }
    console.log("============================================================\n");
}

// Opcion 4 - Eliminar los pasajeros que ingresaron por el sistema no incluyen los inicializados
function borrarPasajeros(posicion) {
    if (listaPasajeros.length===8){
        const pasajero1 = listaPasajeros.pop();
        const pesoEquipaje1 = listaPesoEquipajes.pop();
        const costoPasaje1 = listaCostoPasajes.pop();
        console.log("Se ha eliminado el elemento: ", pasajero1);
        const pasajero2 = listaPasajeros.pop(); 
        const pesoEquipaje2 = listaPesoEquipajes.pop();
        const costoPasaje2 = listaCostoPasajes.pop();
        console.log("Se ha eliminado el elemento: ", pasajero2);
        const pasajero3 = listaPasajeros.pop(); 
        const pesoEquipaje3 = listaPesoEquipajes.pop();
        const costoPasaje3 = listaCostoPasajes.pop();
        console.log("Se ha eliminado el elemento: ", pasajero3);
        const pasajero4 = listaPasajeros.pop(); 
        const pesoEquipaje4 = listaPesoEquipajes.pop();
        const costoPasaje4 = listaCostoPasajes.pop();
        console.log("Se ha eliminado el elemento: ", pasajero4);
        asientosDisponibles+=asientosDisponibles+4;
    } else{
        alert("Todavia existen asientos disponibles, ir a la opcion 1 del menu");
    }

}

// Opcion 5 - Modificar los datos de un pasajero de la lista
function modificarDatosPasajero(posicion) {
    if (posicion>0){
        console.log("El pasajero es=" + listaPasajeros[posicion]);
       
        let nombre = solicitarNombrePasajero();
        let peso=solicitarPesoPasajero();
        let recargo = calcularRecargo(peso, recargoExceso);
        let costo = calcularCostoFinal(precioBase, recargo);

        listaPasajeros.splice(posicion, 1, nombre); 
        listaPesoEquipajes.splice(posicion,1,peso);
        listaCostoPasajes.splice(posicion,1,costo);
        console.log("--- Registro de Pasaje ---");
        console.log("Nombre del pasajero:", listaPasajeros[posicion]);
        console.log("Peso de equipaje:", listaPesoEquipajes[posicion], " kg");
        console.log("Precio del pasaje: $", listaCostoPasajes[posicion]);
    } else {
        console.log("El pasajero no está en lista");
    }
    return posicion;
}


// PROGRAMA PRINCIPAL

alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");


let opcion = "";
let pos=-1;
asientosDisponibles= 8 - listaPasajeros.length;
while (opcion !== "6") {
  opcion = prompt(
    "MENÚ DE VUELOS\n\n" +
    "1 - Procesar Registrar pasajes\n" +
    "2 - Buscar un pasajero\n" +
    "3 - Impresion de pasajeros\n" +
    "4 - Eliminar los pasajeros ingresados\n" +
    "5 - Modificar datos de un pasajero\n" +
    "6 - Fin\n\n" +
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
        alert("Fin del programa");
        break;    
    default:
      alert("Opción no válida, intente de nuevo");
    }
}