import styled from "styled-components"
import { getFile } from "../../../globalActions"
import PropTypes from "prop-types"

export const Empty = ({message, img}) => {
  return (
    <EmPty>
    <div>
        <img src={getFile('svg', `${img}`, 'svg')} alt="" />
        <h2>{message}</h2>
    </div>
    </EmPty>
  )
}

const EmPty = styled.div`
  display: grid;
  width: fit-content;
  height: fit-content;
  text-align: center;
  margin: auto;
  gap: 10px;

  img{
      width: 300px;
      filter: invert(80%);
      opacity: 0.1;

      @media (max-width: 780px) {
        width: 100%;
      }
  }
  h2{
    color: #0000004d;
  }
  div{
    display: grid;
    width: fit-content;
    height: fit-content;
    place-items: center;
    place-content: center;
  }
`

Empty.propTypes = {
  message: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
} 
