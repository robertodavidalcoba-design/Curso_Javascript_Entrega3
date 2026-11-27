# Sistema Interactivo de Reserva de Vuelos

## Descripción del problema

Una aerolínea necesita un sistema simple, que funcione desde el navegador,
para que un operador registre reservas de vuelo de manera interactiva.
El sistema controla el cupo disponible del vuelo, calcula el costo de cada
pasaje según el peso del equipaje, permite aplicar descuentos y genera reportes.
El operador ingresa los datos mediante ventanas emergentes (prompt/alert)
y los resultados también se muestran por consola.

## Funcionamiento

El sistema muestra un **menú principal** que se repite hasta que el operador elige la opción 8:

| Opción | Descripción |
|---|---|
| 1 | Procesar / registrar pasajes |
| 2 | Buscar un pasajero |
| 3 | Impresión del listado de pasajeros |
| 4 | Reporte del total de peso en equipajes |
| 5 | Modificar datos de un pasajero |
| 6 | Aplicar descuento a un pasajero |
| 7 | Reporte del vuelo AR1400 |
| 8 | Fin |

### Opción 1 - Registrar pasajes
1. El operador ingresa el **código del vuelo** (ej: `AR1400`). Puede escribir
   `salir` o presionar *Cancelar* para cerrar la carga.
2. Se solicita la cantidad de pasajes a procesar. Se valida que sea un número
   entero, mayor que 0 y que no supere los asientos disponibles.
3. Por cada pasajero se ingresa:
   - Nombre y apellido (no puede quedar vacío ni repetirse en el vuelo).
   - Peso del equipaje en kg (número mayor que 0).
4. Se calcula el costo del pasaje:
   - **Precio base:** $150.
   - **Recargo por exceso de equipaje:** +$50 si el equipaje supera los 23 kg.
5. Se crea un objeto `Pasajero`, se agrega a `listaPasajeros` y se descuenta un asiento.
6. Al finalizar el grupo se muestra un **resumen de la reserva**: vuelo,
   pasajeros confirmados y monto total a pagar.
7. Si el vuelo se queda sin asientos, el sistema informa **sin cupo** y cierra la carga.

### Opción 2 - Buscar un pasajero
Se ingresa el nombre y el sistema informa si el pasajero está en la lista y en qué posición.

### Opción 3 - Listado de pasajeros
Imprime por consola el nombre y el costo de cada pasaje, y la cantidad total de pasajeros.

### Opción 4 - Reporte de peso de equipajes
Calcula el **total de kilos** de equipaje y lista los **pasajeros que pagaron recargo**.

### Opción 5 - Modificar datos de un pasajero
Se busca al pasajero por nombre y se vuelven a cargar sus datos (nombre y peso).
Se recalcula el recargo y el costo, y se reinicia el descuento. Se valida que el
nuevo nombre no pertenezca a otro pasajero.

### Opción 6 - Aplicar descuento
Se busca al pasajero por nombre y se ingresa un porcentaje de descuento (1 a 100).
El objeto `Pasajero` recalcula su costo final y guarda el monto descontado.

### Opción 7 - Reporte del vuelo
Informa el **total de pasajeros**, el **total de venta de pasajes**, el
**descuento total otorgado** y la cantidad de pasajeros con descuento.

## Estructura de datos: array de objetos

Los pasajeros se guardan en un único arreglo, listaPasajeros, que comienza
vacío ([]) y se completa con .push(). Cada elemento es un objeto creado con
la clase `Pasajero`:

```javascript
class Pasajero {
    constructor(nombre, pesoEquipaje, recargoPasaje, costoPasaje) {
        this.id = ++Pasajero.id;          // identificador único
        this.nombre = nombre;
        this.pesoEquipaje = pesoEquipaje;
        this.recargoPasaje = recargoPasaje;
        this.costoPasaje = costoPasaje;   // costo final (con descuento aplicado)
        this.descuento = 0;               // porcentaje de descuento
        this.descuentoPasaje = 0;         // monto descontado en $
    }
}
```

Ejemplo del contenido del arreglo:


[
  { id: 1, nombre: "DAVID PERES",   pesoEquipaje: 20, recargoPasaje: 0,  costoPasaje: 150, descuento: 0,  descuentoPasaje: 0 },
  { id: 2, nombre: "JUAN QUIROZ",   pesoEquipaje: 25, recargoPasaje: 50, costoPasaje: 180, descuento: 10, descuentoPasaje: 20 }
]



## Métodos de arrays utilizados

### filter(): seleccionar elementos que cumplen una condición
Devuelve un **nuevo arreglo** solo con los elementos para los que la función devuelve `true`.


### map(): transformar cada elemento
Devuelve un nuevo arreglo del mismo largo, con el resultado de aplicar una función a cada elemento.


### reduce(): acumular los elementos en un único valor
Recorre el arreglo acumulando un resultado a partir de un valor inicial.

## Tipos de funciones aplicadas

- **Función flecha:** `excedePeso, que compara el peso de la maleta con el límite permitido.
- **Funciones de validación:** cantidadValida, que controla que la cantidad ingresada sea correcta.
- **Funciones de entrada de datos:** interactuan con el usuario mediante prompt
  (solicitarCodigoVuelo, solicitarCantidadPasajeros, solicitarNombrePasajero,
  solicitarDatosPasajero).
- **Funciones de procesamiento:** calcularRecargo y los métodos aplicarDescuento y
  recalcular de la clase Pasajero.
- **Función de búsqueda:** buscarPasajero, que devuelve el objeto del pasajero o undefined.
- **Funciones de visualización:** mostrarPasajero, mostrarResumen, imprimirListadoFinalConsola.
- **Funciones de reporte:** reportePesoEquipaje y reporteVuelo, basadas en filter, map y reduce.
- **Funciones de gestión:** procesarReserva, modificarDatosPasajero y aplicarDescuentoPasajero.

## Ámbito de las variables (Scope)

- **Variables globales (let y const):** declaradas al inicio del script, como
  asientosDisponibles, sistemaActivo, precioBase, recargoExceso,
  limiteEquipaje y el arreglo listaPasajeros. Mantienen el estado general del
  sistema durante toda la ejecución.
- **Variables locales:** utilizadas dentro de las funciones y ciclos (como
  totalReserva, confirmados, nombre, pesoEquipaje, kilosTotales,
  conRecargo, totalVentas). Su ámbito está limitado al bloque donde se declaran.

## Datos iniciales

| Variable | Valor |
|---|---|
| Asientos disponibles | 8 |
| Precio base | $150 |
| Recargo por exceso | $50 |
| Límite de equipaje | 23 kg |

## Ejecución

Abrir `index.html` en un navegador (con main.js enlazado) y seguir las
indicaciones que aparecen en pantalla. Los registros de cada pasaje, el listado
final, las modificaciones, los descuentos y los reportes se muestran también en
la consola del navegador.
