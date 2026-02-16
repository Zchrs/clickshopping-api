/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";


export const SimpleSelect = () => {
    const [options] = useState(["Cualquier momento", "Últimos 6 meses", "Último año", "Últimos 2 años"]);
        const [filteredOptions, setFilteredOptions] = useState(options);
        const [selectedOption, setSelectedOption] = useState("");
      
        const handleSelectChange = (event) => {
          setSelectedOption(event.target.value);
        };

  return (
    <SelectSimple>
        <div className="simpleselect">
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
     </SelectSimple>
  )
}

const SelectSimple = styled.div`
    display: grid;
    .simpleselect{
        display: grid;
        width: fit-content;

            select{
                width: 100%;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
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
    
}
`
