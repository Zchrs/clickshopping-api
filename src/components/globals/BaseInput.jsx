/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PropTypes from "prop-types";
import { getFile } from "../../../globalActions";
import styled from "styled-components";

export const BaseInput = forwardRef((props, ref) => {
  const {
    label,
    placeholder,
    classs = "",
    id,
    name,
    value,
    required,
    onChange,
    onBlur,
    isTextarea,
    isNumber,
    isEmail,
    isPassword,
    isSelect,
    isSearchableSelect = false,
    options = [],
    isDate,
    error,
    readOnly,
    onFocus,
    inputRef, // 👈 este es el ref real que viene de useValidations
  } = props;

  const internalRef = useRef(null);
  const resolvedRef = inputRef || ref || internalRef;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  useImperativeHandle(ref, () => resolvedRef.current);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        resolvedRef.current &&
        !resolvedRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (isSearchableSelect) setShowOptions(true);
    if (onFocus) onFocus(e);
  };

  const handleBlurInternal = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleSelectChange = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
    if (isSearchableSelect) {
      setShowOptions(false);
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      if (selectedOption) setSearchTerm(selectedOption.label);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayValue = () => {
    if (!isSearchableSelect) return value;
    const selected = options.find((o) => o.value === value);
    return selected ? selected.label : "";
  };

  return (
    <InputBase>
      <div className={classs}>
        {label && (
          <label htmlFor={id}>
            {required && <span>*</span>}
            {label}
          </label>
        )}

        {isSearchableSelect ? (
          <div className="search-select-container">
            <input
              ref={resolvedRef}
              type="text"
              value={showOptions ? searchTerm : getDisplayValue()}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!showOptions) setShowOptions(true);
              }}
              onFocus={handleFocus}
              onBlur={handleBlurInternal}
              placeholder={placeholder || "Buscar..."}
              readOnly={readOnly}
            />
            {showOptions && (
              <div className="options-dropdown" ref={dropdownRef}>
                {filteredOptions.length ? (
                  filteredOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`option-item ${
                        value === opt.value ? "selected" : ""
                      }`}
                      onClick={() => handleSelectChange(opt.value)}>
                      {opt.label}
                    </div>
                  ))
                ) : (
                  <div className="option-item">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            )}
          </div>
        ) : isSelect ? (
          <select
            ref={resolvedRef}
            id={id}
            name={name}
            value={value}
            onChange={(e) => handleSelectChange(e.target.value)}
            onBlur={handleBlurInternal}
            onFocus={handleFocus}
            required>
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            ref={resolvedRef}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={handleBlurInternal}
            onFocus={handleFocus}
          />
        ) : (
          <>
            {isDate ? (
              <div className="date-wrapper">
                    {!value && !isFocused && (
      <span className="date-placeholder">{placeholder}</span>
    )}
                <input
                  ref={resolvedRef}
                  id={id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={handleBlurInternal}
                  onFocus={handleFocus}
                  type="date"
                />
              </div>
            ) : (
              <input
                ref={resolvedRef}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={handleBlurInternal}
                onFocus={handleFocus}
                type={
                  isPassword && !showPassword
                    ? "password"
                    : isEmail
                    ? "email"
                    : isNumber
                    ? "number"
                    : "text"
                }
              />
            )}
            {isPassword && (
              <div
                type="button"
                className="inputs-show-hide-pass"
                onClick={togglePasswordVisibility}>
                <img
                  src={
                    showPassword
                      ? getFile("svg", "hide-icon", "svg")
                      : getFile("svg", "show-icon", "svg")
                  }
                  alt={showPassword ? "Hide" : "Show"}
                  className="eye-icon"
                />
              </div>
            )}
          </>
        )}

        {error && !isFocused && <p className="error-message">{error}</p>}
      </div>
    </InputBase>
  );
});

BaseInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  classs: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  isTextarea: PropTypes.bool,
  isNumber: PropTypes.bool,
  isEmail: PropTypes.bool,
  isPassword: PropTypes.bool,
  isSelect: PropTypes.bool,
  options: PropTypes.array,
  isDate: PropTypes.bool,
};

const InputBase = styled.div`
  .inputs {
    display: grid;
    margin: 0;
    padding: 0;

    &.nobg {
      background: transparent;
      position: relative;
      outline: none;
      input {
        border: 1px solid rgb(153, 0, 0);
        border-radius: 5px;
      }
      img {
        width: 70%;
      }
    }

    &.outline {
      position: relative;
      outline: none;

      .textarea {
        border: 1px solid #ec333632;
        background: white;
        height: 130px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 5px;
        outline: none;
        color: black;
        font-weight: 400;
        position: relative;
        padding: 5px 15px;

        &::placeholder {
          padding: 5px 15px;
          font-weight: 300;
          font-size: 14px;
          line-height: 140%;
          color: #bdbbbb;
        }
      }

      input {
        border: 1px solid #ec333632;
        background: white;
        font-size: 16px;
        font-weight: 500;
        border-radius: 5px;
        outline: none;
        color: black;
        font-weight: 400;
        position: relative;
        border: 1px solid var(--bg-secondary-semi-soft);
      }
      &:focus {
        padding: 10px 16px;
      }
    }

    &-show-hide-pass {
      display: grid;
      place-items: center;
      border: none;
      outline: none;
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      right: 10px;
      width: 6%;
      border-radius: 0 7px 7px 0;
      cursor: pointer;
      font-size: 12px;

      img {
        width: 100%;
        filter: invert(70%);
      }
    }

    &.normal {
      position: relative;
      color: black;
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      align-items: center;
      display: grid;
      background: transparent;
      border-radius: 10px;
      outline: none;

      input {
        border-radius: 10px;
        position: relative;
        background: white;
        border: 1px solid var(--trans-primary);
        padding: 8px 10px;
        color: black;
        font-size: 1.6rem;
        font-weight: 200;
        width: 100%;
        transition: all ease 0.3s;
        outline: none;

        &::placeholder {
          font-weight: 300;
          font-size: 14px;
          line-height: 140%;
          color: #bdbbbb;
        }
      }
      select {
        border-radius: 10px;
        position: relative;
        background: white;
        border: 1px solid var(--trans-primary);
        padding: 8px 10px;
        color: black;
        font-size: 1.6rem;
        font-weight: 200;
        width: 100%;
        transition: all ease 0.3s;
        outline: none;
      }

      textarea {
        outline: none;
        border: 1px solid var(--trans-primary);
        background: white;
        height: 130px;
        font-size: 1.8rem;
        font-weight: 500;
        border-radius: 10px;
        color: black;
        font-weight: 400;
        position: relative;
        padding: 5px 10px;

        &::placeholder {
          font-weight: 300;
          font-size: 14px;
          line-height: 140%;
          color: #bdbbbb;
        }
      }
    }

    label {
      font-weight: 400;
      font-size: 14px;
      line-height: 140%;
      color: #295170;

      span {
        position: absolute;
        color: red;
        font-weight: 700;
        margin-left: -5px;
      }
    }
  }

  /* Aplica color gris solo si la opción seleccionada tiene valor vacío */
  .inputs.normal select {
    color: black; /* por defecto */
  }

  .inputs.normal select option[value=""] {
    color: #bdbbbb; /* placeholder */
  }

  .inputs.normal select option {
    color: black;
  }

  .inputs.normal select:invalid {
    color: #bdbbbb; /* color placeholder si no se ha seleccionado nada */
  }

  .inputs.error input {
    border: 1px solid red !important;
  }
  .inputs.success input {
    border: 1px solid #34b0be !important;
  }

  .inputs.normal .date-wrapper {
  position: relative;
  width: 100%;
}

.inputs.normal .date-wrapper input[type="date"] {
  position: relative;
  z-index: 1;
  background-color: white;
  color: black;
  border-radius: 10px;
  border: 1px solid var(--trans-primary);
  padding: 8px 10px;
  font-size: 1.6rem;
  font-weight: 200;
  width: 100%;
  outline: none;
}

.inputs.normal .date-wrapper .date-placeholder {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bdbbbb;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
  z-index: 2;
  background: white;
  padding-right: 8px;
}
`;
