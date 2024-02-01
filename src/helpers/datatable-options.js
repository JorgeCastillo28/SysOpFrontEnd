// Configuración del datatable
const dataTableOptions = {
  responsive: true,
  autoWidth: false,
  dom: 'Bfrtipl',
  paging: true,
  lengthChange: true,
  language: {
    search: 'Buscar', zeroRecords: 'No hay registros para mostrar',
    info: 'Mostrando del _START_ a _END_ de _TOTAL_ registros',
    infoFiltered: '(Filtrados de _MAX_ registros.)',
    lengthMenu: 'Mostrar _MENU_ registros',
    paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Último' }
  }
};

// const dataTableButtons: [
//   {
//     title: 'Excel',
//     extend: 'excelHtml5',
//     text: '<i class="fa-solid fa-file-excel"><i/> Excel',
//     className: 'btn btn-success'
//   },
//   {
//     title: 'PDF',
//     extend: 'pdfHtml5',
//     text: '<i class="fa-solid fa-file-pdf"><i/> PDF',
//     className: 'btn btn-danger'
//   },
//   {
//     title: 'Print',
//     extend: 'print',
//     text: '<i class="fa-solid fa-file-pdf"><i/> Imprimir',
//     className: 'btn btn-dark'
//   },
//   {
//     title: 'Copy',
//     extend: 'copy',
//     text: '<i class="fa-solid fa-file-copy"><i/> Copiar tabla',
//     className: 'btn btn-light'
//   }
// ],

export { dataTableOptions };