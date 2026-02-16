import PropTypes from 'prop-types';
import styled from "styled-components"


export const Backward = ({ onClick }) => {
  return (
    <BackCont>
        <button onClick={onClick} className="backward">
        </button>
    </BackCont>
  )
}

Backward.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

const BackCont = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    cursor: pointer;
    .backward{
      cursor: pointer;
      display: grid;
      width: 100%;
      height: 100%;
        display: grid;
        clip-path: polygon(80% 0, 30% 50%, 80% 100%, 50% 100%, 0% 50%, 50% 0);
        background: #990000;
        border: none;
        outline: none;
    }
`
