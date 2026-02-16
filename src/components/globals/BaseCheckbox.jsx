import styled from "styled-components";

// eslint-disable-next-line react/prop-types
export const BaseCheckbox = ({ label, modelValue, valueChange, id }) => {
  return (
    <CheckBox>
      <label className="checkbox" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={modelValue}
          onChange={valueChange}
        />
        <span className="box" />
        {label && <span className="text">{label}</span>}
      </label>
    </CheckBox>
  );
};

const CheckBox = styled.div`
display: grid;
margin: 0;
padding: 0;
box-sizing: border-box;

  .checkbox {
    display: flex;
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    gap: 0px;
    cursor: pointer;

    input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 1;
      pointer-events: none;
      border-color: green;
    }

    .box {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 1px solid var(--secondary);
      display: grid;
      justify-content: center;
      transition: all 0.15s ease;
      background: transparent;
      overflow  : hidden;
    }

    .box::after {
      content: "";
      width: 8px;
      height: 12px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg) scale(0);
      transition: transform 0.12s ease;
    }

    input:checked + .box {
      background: var(--primary);
      border-color: var(--primary);
    }

    input:checked + .box::after {
      transform: rotate(45deg) scale(1);
    }

    input:focus-visible + .box {
      outline: 3px solid var(--primary-tr);
    }

    .text {
      font-size: 1.4rem;
      color: var(--dark);
    }
  }
`;
