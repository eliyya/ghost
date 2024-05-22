// document.addEventListener('DOMContentLoaded', function () {

//     const addClassButtons = document.querySelectorAll('.add-class');
//     addClassButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             const newClassName = prompt('Ingrese el nombre de la nueva clase:');
//             if (newClassName) {
//                 const startTime = prompt('Ingrese la hora de inicio (formato HH:MM):');
//                 const endTime = prompt('Ingrese la hora de fin (formato HH:MM):');
//                 if (startTime && endTime) {
//                     const newClassElement = document.createElement('div');
//                     newClassElement.classList.add('event');
//                     newClassElement.dataset.startTime = startTime;
//                     newClassElement.dataset.endTime = endTime;
//                     newClassElement.textContent = `${newClassName} (${startTime} - ${endTime})`;

//                     const eventsContainer = button.previousElementSibling;
//                     eventsContainer.appendChild(newClassElement);
//                     sortEvents(eventsContainer);

//                     newClassElement.addEventListener('click', function () {
//                         const updatedClassName = prompt('Actualizar nombre de la clase:', newClassElement.textContent.split(' ')[0]);
//                         const updatedStartTime = prompt('Actualizar hora de inicio (formato HH:MM):', newClassElement.dataset.startTime);
//                         const updatedEndTime = prompt('Actualizar hora de fin (formato HH:MM):', newClassElement.dataset.endTime);
//                         if (updatedClassName && updatedStartTime && updatedEndTime) {
//                             newClassElement.textContent = `${updatedClassName} (${updatedStartTime} - ${updatedEndTime})`;
//                             newClassElement.dataset.startTime = updatedStartTime;
//                             newClassElement.dataset.endTime = updatedEndTime;
//                             sortEvents(eventsContainer);
//                         }
//                     });
//                 }
//             }
//         });
//     });

//     function sortEvents(container) {
//         const events = Array.from(container.children);
//         events.sort((a, b) => {
//             const timeA = a.dataset.startTime;
//             const timeB = b.dataset.startTime;
//             return timeA.localeCompare(timeB);
//         });
//         events.forEach(event => container.appendChild(event));
//     }
// });


// // ----evento de botones

// const button = document.getElementById('miBoton')
// const rolSeleccionado = document.getElementById('rol-seleccionado')

// button.addEventListener('click', function () {
//     const valor = button.dataset.valor
//     rolSeleccionado.innerHTML = `El rol seleccionado es: ${valor}`
//     document.body.appendChild(rolSeleccionado)
// })



botton.addEventListener('click', function () {
    const valor = botton.dataset.valor
    console.log(valor)
})






















