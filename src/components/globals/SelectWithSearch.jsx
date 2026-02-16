import { useState } from "react";
import styled from "styled-components";

export const SelectWithSearch = () => {
  const [options] = useState(["Pedidos", "Rastrear"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState("");

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(term)
      )
    );
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <SelectSearch>
        <div className="selectsearch">
          <div className="selectsearch-inside">
          <label htmlFor="options">
          </label>
              <select
                className="selectsearch-inside-options"
                id="options"
                value={selectedOption}
                onChange={handleSelectChange}
              >

                {filteredOptions.map((option, index) => (
                  <option className="selectsearch-inside-options-option" key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
          </div>
          <div className="selectsearch-inside">
              <label htmlFor="search">
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="No. de pedido o producto"

              />
          </div>
        </div>
          {selectedOption && (
            <p style={{ marginTop: "10px" }}>
              Has seleccionado: <strong>{selectedOption}</strong>
            </p>
          )}
    </SelectSearch>
  );
};

const SelectSearch = styled.div`
    display: grid;
    .selectsearch{
        display: grid;
        grid-template-columns: 43% 90%;
        width: fit-content;

        &-inside{
            display: grid;
            height: fit-content;
            select{
                width: 100%;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 5px 0px 0px 5px;
                outline: none;
                height: 35px;
         
            }
            &-options{
                border-radius: 10px;
                outline: none;
                border: none;

                &-option{
                    display: grid;
                    outline: none;
                    border: none;
                }
            }

            input{
                padding: 5px;
                width: 100%;
                border-radius: 0px 5px 5px 0px;
                border: 1px solid #ccc;
                color: #808080c9;
                outline: none;
                height: 35px;
            }
        }
    }
`