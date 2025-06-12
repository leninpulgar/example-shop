
// [1,2,3,4,5,...,7]
export const generatePaginationNumbers = ( currentPage: number, totalPages: number ) => {
    
    // Si el número total de páginas es 7 o menos
    // Vamos a mostrar todas las páginas sin puntos suspensivos
    if ( totalPages <= 7 ) {
        return Array.from({ length: totalPages }, (_, i) => i + 1 );
    }

    // Si la página actual está entre las primeras 3 páginas
    // Mostrar las primeras 3, puntos suspensivos y las últimas 2 páginas
    if ( currentPage <= 3 ) {
        return [1, 2, 3, '...', totalPages - 1, totalPages]; // [1,2,3,...,7]
    }

    // Si la página actual está entre las últimas 3 páginas
    // Mostrar las primeras 2, puntos suspensivos y las últimas 3 páginas
    if ( currentPage >= totalPages - 2 ) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]; // [1,2,...,5,6,7]
    }

    // Si la página actual está en otro lugar medio
    // Mostrar la primera página, puntos suspensivos, la página actual, puntos suspensivos y la última página
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]; // [1,...,4,5,6,...,7]

    
}