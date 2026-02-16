import styled from 'styled-components';
import PropTypes from 'prop-types';

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    colorText,
    arrowPrev,
    arrowNext 
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <PaginationContainer>
      <button className={arrowPrev} onClick={handlePreviousPage} disabled={currentPage === 1}>
        
      </button>
      <span className={colorText}>
        Página {currentPage} de {totalPages}
      </span>
      <button className={arrowNext} onClick={handleNextPage} disabled={currentPage === totalPages}>
        
      </button>
    </PaginationContainer>
  );
};
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  colorText: PropTypes.string.isRequired,
  arrowPrev: PropTypes.string.isRequired,
  arrowNext: PropTypes.string.isRequired
};


const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid var(--bg-tertiary); */
  background: transparent;
  gap: 10px;
  width: 250px;
  height: fit-content;
  outline: none;
  margin: auto;
  .button {
      position: relative;
      cursor: pointer;
      background: transparent;
      transition: transform 0.3s;
      padding: 0;
      width: 20px;
      height: 27px;
      border: none;
      &:hover{
        outline: none;
        transform: scale(1.2);
      }
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-tertiary);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }

    &:last-child{
        position: relative;
    cursor: pointer;
    background: transparent;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-tertiary);
        transform: rotate(180deg);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    }
    &.bg-light{
        position: relative;
    cursor: pointer;
    background: transparent;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-tertiary);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    &:last-child{
        position: relative;
    cursor: pointer;
    background: transparent;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-tertiary);
        transform: rotate(180deg);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    }
    &:disabled {
    cursor: not-allowed;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-secondary-semi-soft);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    }
    }

    &.bg-dark{
        position: relative;
    cursor: pointer;
    background: transparent;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-dark);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    &:last-child{
        position: relative;
    cursor: pointer;
    background: transparent;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-dark);
        transform: rotate(180deg);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    }
    }
    &:disabled {
    cursor: not-allowed;
    width: 23px;
    height: 27px;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-secondary-semi-soft);
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
    }

    :disabled {
    position: relative;
    cursor: pointer;
    background: transparent;
    outline: none;
    width: 23px;
    height: 27px;
    cursor: not-allowed;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #818080;
        clip-path: polygon(100% 0%, 25% 50%, 100% 100%, 75% 100%, 0% 50%, 75% 0);
    }
  }
}

.dark{
    color: var(--text-dark);
    text-align: center;
    width: fit-content;
}
.light{
    color: var(--text-tertiary);
    text-align: center;
    width: fit-content;
}

`;