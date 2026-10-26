# Sistema Interactivo de Reserva de Vuelos

## Descripción del problema

Una aerolínea necesita un sistema simple, que funcione desde el navegador,
para que un operador registre reservas de vuelo de manera interactiva.
El sistema controla el cupo disponible del vuelo y calcula el costo de cada
pasaje según el peso del equipaje. El operador ingresa los datos mediante
ventanas emergentes (prompt/alert) y los resultados también se muestran por consola.

## Funcionamiento

1. El operador ingresa el **código del vuelo** (ej: `AR1400`) mediante `prompt`.
   Puede escribir `salir` o presionar *Cancelar* para cerrar el sistema.
2. El sistema muestra los **asientos disponibles** y solicita la cantidad de
   pasajes a procesar. Se valida que sea un número entero, mayor que 0 y que no
   supere los asientos disponibles.
3. Si la cantidad es válida, el operador **carga los datos de cada pasajero**:
   - Nombre y apellido (no puede quedar vacío).
   - Peso del equipaje en kg (debe ser un número, no negativo).
4. Se calcula el costo de cada pasaje:
   - **Precio base:** $150.
   - **Recargo por exceso de equipaje:** +$50 si el equipaje supera los 23 kg.
5. Al finalizar el grupo, se muestra un **resumen de la reserva**: vuelo,
   pasajeros confirmados y monto total a pagar.
6. El ciclo se repite hasta que el operador escribe `salir` o el vuelo se
   queda sin asientos. En ese caso el sistema informa **sin cupo** y se cierra.
7. Al terminar la carga, se imprime por consola el **listado final de pasajeros**
   con la cantidad total.
8. **Corrección de equipaje:** el operador ingresa el nombre de un pasajero para
   verificar si está en el listado. Si está, se solicita el nuevo peso, se recalcula
   el recargo y el costo, y se actualiza la información. Si no está, se informa
   que el pasajero no se encuentra en el listado.



## Tipos de funciones aplicadas

- **Función flecha:** `excedePeso`, que compara el peso de la maleta con el límite permitido.
- **Funciones de validación:** `cantidadValida`, que controla que la cantidad ingresada sea correcta.
- **Funciones de entrada de datos:** interactúan con el usuario mediante `prompt`
  (`solicitarCodigoVuelo`, `solicitarCantidadPasajeros`, `solicitarNombrePasajero`,
  `solicitarPesoPasajero`).
- **Funciones de procesamiento:** realizan los cálculos de recargos y costos
  (`calcularRecargo`, `calcularCostoFinal`).
- **Función de búsqueda:** `buscarPasajero`, que devuelve la posición del pasajero
  en el listado o `-1` si no está.
- **Funciones de visualización:** muestran resultados por `alert` y por consola
  (`mostrarPasajero`, `mostrarResumen`, `imprimirListadoFinalConsola`).
- **Función principal:** `procesarReserva`, que coordina la carga de cada pasajero
  dentro de un grupo.

## Uso de arreglos (vectores)

Los tres arreglos comienzan vacíos (`[]`) y se completan con `.push()` durante la carga.
Cada posición corresponde al mismo pasajero en los tres arreglos.

- **`l_pasajeros`**: nombres de los pasajeros (se guardan en minúsculas).
- **`l_pesos`**: peso del equipaje de cada pasajero.
- **`l_costos`**: costo final del pasaje de cada pasajero.

Métodos utilizados:

- `.push()` para agregar datos a cada arreglo.
- `.includes()` e `.indexOf()` para saber si un pasajero está en el listado y en qué posición.
- `.splice()` para reemplazar el peso y el costo de un pasajero ya cargado.
- Ciclo `for` para recorrer los arreglos y mostrar el listado.

## Ámbito de las variables (Scope)

- **Variables globales (`let` y `const`):** declaradas al inicio del script, como
  `asientosDisponibles`, `sistemaActivo`, `PRECIO_BASE`, `RECARGO_EXCESO`,
  `LIMITE_EQUIPAJE_KG` y los arreglos `l_pasajeros`, `l_pesos` y `l_costos`.
  Mantienen el estado general del sistema durante toda la ejecución.
- **Variables locales:** utilizadas dentro de las funciones y ciclos (como
  `totalReserva`, `confirmados`, `nombre`, `peso`, `recargo`, `costo`). Su ámbito
  está limitado al bloque donde se declaran.

## Datos iniciales

| Variable | Valor |
|---|---|
| Asientos disponibles | 4 |
| Precio base | $150 |
| Recargo por exceso | $50 |
| Límite de equipaje | 23 kg |

## Ejecución

Abrir `index.html` en un navegador (con `main.js` enlazado) y seguir las
indicaciones que aparecen en pantalla. Los registros de cada pasaje, el listado
final y los cambios de equipaje se muestran también en la consola del navegador.
