import React from 'react';
import { Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function DataPagination({ currentPage, totalPages, onPageChange }) {
  const range = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <Pagination>
      <ButtonGroup aria-label="Basic example">
        <Button variant="primary" onClick={() => onPageChange(1)}>«</Button>
        {range().map(page => (
          <Pagination.Item key={page} activeLabel='' active={page === currentPage} onClick={() => onPageChange(page)}>
            {page}
          </Pagination.Item>
        ))}
        <Button variant="primary" onClick={() => onPageChange(totalPages)}>»</Button>
      </ButtonGroup>
    </Pagination>
  );
}

export default DataPagination;
