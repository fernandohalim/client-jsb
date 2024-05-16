import React from 'react';
import { Pagination } from 'react-bootstrap';

function DataPagination({ currentPage, totalPages, onPageChange }) {
  const range = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      {range().map(page => (
        <Pagination.Item key={page} activeLabel='' active={page === currentPage} onClick={() => onPageChange(page)}>
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Last onClick={() => onPageChange(totalPages)} />
    </Pagination>
  );
}

export default DataPagination;
