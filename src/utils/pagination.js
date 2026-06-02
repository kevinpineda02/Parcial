function parsePagination(query = {}) {
  const page = Number.parseInt(query.page ?? '0', 10);
  const size = Number.parseInt(query.size ?? '10', 10);
  const sortBy = query.sortBy || 'nombre';
  const order = query.order || 'asc';

  return {
    page,
    size,
    sortBy,
    order
  };
}

function paginate(items, page, size) {
  const totalRegistros = items.length;
  const totalPaginas = Math.ceil(totalRegistros / size);
  const start = page * size;
  const data = items.slice(start, start + size);

  return {
    data,
    paginacion: {
      paginaActual: page,
      totalPaginas,
      totalRegistros,
      registrosPorPagina: size
    }
  };
}

module.exports = {
  parsePagination,
  paginate
};
