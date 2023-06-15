export function applyPagination(data, page, rowsPerPage) {
   
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
   
  }