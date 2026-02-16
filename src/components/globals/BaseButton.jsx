/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { getFile, getImg } from "../../../globalActions";

import styled from "styled-components";

export const BaseButton = ({
  label,
  icon,
  svgIcon,
  link,
  img,
  svg,
  classs,
  textLabel,
  handleClick,
  disabled,
  onMouseEnter,
  onMouseLeave,
  target,
  onSubmit,
  colorbtn,
  colorbtnhoverprimary,
  colortextbtnprimary,
  colortextbtnhoverprimary,
  filterprimaryhover,
  hovercolorbtntextsecondary,
  filtersecondary,
  borderbtn,
  colorbtntextsecondary,
  colorbtnhoversecondary,
  filteroutline,
  filterhoveroutline,
  colortextbtnoutline,
  colortextbtnhoveroutline,
  hovercolorbtnoutline,
  colorbtnoutline,
  borderbtnhoveroutline,
  outline,
  filterprimary,
  filterhover,
  colorbtnsmall,
colorbtntextsmall,
colorbtnhoversmall,
colortextbtnhoversmall
  
}) => {
  return (
    <ButtonBase 
    colorbtn={colorbtn} 
    colorbtnhoverprimary={colorbtnhoverprimary} 
    borderbtn={borderbtn} 
    colortextbtnprimary={colortextbtnprimary} 
    colortextbtnhoverprimary={colortextbtnhoverprimary} 
    filterhover={filterhover}
    filtersecondary={filtersecondary}
    filteroutline={filteroutline}
    borderbtnhoveroutline={borderbtnhoveroutline}
    filterhoveroutline={filterhoveroutline}
    colortextbtnoutline={colortextbtnoutline} 
    colortextbtnhoveroutline={colortextbtnhoveroutline}
    outline={outline}
    colorbtnoutline={colorbtnoutline}
    colorbtntextsecondary={colorbtntextsecondary}
    colorbtnhoversecondary={colorbtnhoversecondary}
    hovercolorbtntextsecondary={hovercolorbtntextsecondary}
    hovercolorbtnoutline={hovercolorbtnoutline}
    filterprimary={filterprimary}
    filterprimaryhover={filterprimaryhover}
    colorbtnsmall={colorbtnsmall}
    colorbtntextsmall={colorbtntextsmall}
    colorbtnhoversmall={colorbtnhoversmall}
    colortextbtnhoversmall={colortextbtnhoversmall}
    >
      <button
        disabled={disabled}
        onClick={handleClick}
        className={`${classs} ${disabled ? "disabled" : ""}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onSubmit={onSubmit}
        {...(target & { target })}>
        <Link className="button__a" to={link} rel="noopener" target={target}>
          {img && <img src={getFile("svg", `${icon}`, "svg")} alt="" />}
          {svg && (
           <img src={getImg("svg", `${svgIcon}`, "svg")} alt="" />
          )}
          {link && <span className="button__span">{label}</span>}
          {textLabel && <span>{label}</span>}
        </Link>
      </button>
    </ButtonBase>
  );
};

const ButtonBase = styled.div`
  background: transparent;
  display: grid;

  .button {
    background: transparent;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 12px;
    margin: 0;
    padding: 0;

    &.primary {
      display: grid;
      width: ${({ width }) => width || 'auto'};
      height: ${({ height }) => height || 'auto'};
      position: relative;
      background: ${props => props.colorbtn || "transparent"};
      a {
        position: relative;
        text-decoration: none;
        justify-content: center;
        align-items: center;
        gap: 5px;
        display: flex;
        padding: 10px 15px;
        width: ${({ width }) => width || 'auto'};
        height: ${({ height }) => height || 'auto'};
        color: ${props => props.colortextbtnprimary || "transparent"};
        border-radius: 10px;
        font-weight: 500;
        font-size: 15px;
        transition: all ease 0.3s;
        img {
          filter: ${props => props.filterprimary || "brightness(500%)"};
          width: 13%;
        }
        &:hover {
          background: ${props => props.colorbtnhoverprimary || "transparent"};
          color: ${props => props.colortextbtnhoverprimary || "transparent"};
          img {
          filter: ${props => props.filterprimaryhover || "brightness(500%)"};
          width: 13%;
        }
        }
        span {
          width: fit-content;
        }
      }

    }

    &.secondary {
      display: grid;
      width: 100%;
      height: fit-content;

      a {
        font-size: 16px;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${props => props.colorbtn || "transparent"};
        border: none;
        color: ${props => props.colorbtntextsecondary || "var(--text-secondary)"};
        border-radius: 10px;
        padding: 12px 16px;
        /* font-weight: 600; */
        line-height: 120%;
        transition: all ease 0.3s;

        p {
          /* font-weight: 400; */
          margin: 0;
          padding: 0;
        }

        img {
          width: 10%;
          filter: ${props => props.filtersecondary || "brightness(500%)"};
        }
        &:hover {
          background: ${props => props.colorbtnhoversecondary || "var(--bg-secondary)"};
          color: ${props => props.hovercolorbtntextsecondary || "var(--text-secondary)"};
        }
      }
    }

    &.primary-gradient {
      display: grid;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      a {
        gap: 5px;
        display: flex;
        padding: 8px 20px;
        width: 100%;
        height: fit-content;
        background: var(--deg-fourty);
        color: white;
        border-radius: 50px;
        font-weight: 400;
        font-size: 1.5rem;
        transition: all ease 0.3s;
        text-decoration: none;
        img {
          filter: brightness(500%);
          width: 13%;
        }
        &:hover {
          background: var(--deg-six);
          font-weight: 600;
        }
        span {
          width: fit-content;
          background: transparent;
        }

        @media (max-width: 600px) {
          padding: 5px 10px;
        }
      }

      p {
        margin: 0;
        padding: 0;
      }

      &.disabled {
        cursor: default;
        z-index: 50;
        opacity: 0.6;
        transition: all ease 0.4s;

        a {
          cursor: not-allowed;
          background: gray;
        }

        &:hover {
          a {
            background: var(--deg-six);
          }
        }
      }
    }

    &.full-bullet {
      display: grid;
      width: 100%;
      height: 100%;
      overflow: hidden;

      &.disabled {
        cursor: default;
        z-index: 50;
        opacity: 0.6;
        transition: all ease 0.4s;

        a {
          cursor: not-allowed;
          background: gray;
        }

        &:hover {
          a {
            background: gray;
          }
        }
      }
      a {
        position: relative;
        overflow: hidden;
        text-decoration: none;
        margin: 0 auto;
        display: grid;
        justify-content: center;
        width: 80%;
        height: fit-content;
        background: rgb(153, 0, 0);
        border-radius: 50px;
        color: white;
        padding: 14px 16px;
        font-weight: 600;
        font-size: 17px;
        line-height: 120%;
        transition: all ease 0.3s;
        margin-top: 20px;
        @media (max-width: 550px) {
          padding: 16px;
        }

        img {
          filter: brightness(500%);
          width: 18%;
        }

        &:hover {
          background: #007a5a;
        }
      }
    }

    &.small {
      display: grid;
      width: fit-content;
      height: fit-content;
      overflow: hidden;

      &.disabled {
        cursor: default;
        z-index: 50;
        opacity: 0.6;
        transition: all ease 0.4s;

        a {
          cursor: not-allowed;
          background: gray;
        }

        &:hover {
          a {
            background: gray;
          }
        }
      }
      a {
        position: relative;
        overflow: hidden;
        text-decoration: none;
        margin: 0 auto;
        display: grid;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        background: ${props => props.colorbtnsmall || "transparent"};
        color: ${props => props.colorbtntextsmall || "var(--text-secondary)"};
        border-radius: 50px;
        color: white;
        padding: 5px 9px;
        font-weight: 600;
        font-size: 17px;
        line-height: 120%;
        transition: all ease 0.3s;

        @media (max-width: 550px) {
          font-size: 13px;
          font-weight: 400;
        }

        img {
          filter: brightness(500%);
          width: 18%;
        }

        &:hover {
          background: ${props => props.colorbtnhoversmall || "transparent"};
          color: ${props => props.colortextbtnhoversmall || "var(--dark)"};
        }
      }
    }

    &.outline {
      display: grid;
      width: 100%;
      height: 100%;
      a {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${props => props.colorbtnoutline || "transparent"};
        border: ${props => props.borderbtn || "transparent"} 1px solid;
        color: ${props => props.colortextbtnoutline || "transparent"};
        border-radius: 10px;
        padding: 7px 16px;
        font-weight: 600;
        font-size: 17px;
        line-height: 120%;
        transition: all ease 0.3s;
        @media (max-width: 820px) {
          font-size: 14px;
        }
        img {
          width: 12%;
          transition: all ease 0.3s;
          filter: ${props => props.filteroutline || "brightness(0%) invert(0%)"};
        }
        &:hover {
          background: ${props => props.hovercolorbtnoutline || "transparent"};
          color: ${props => props.colortextbtnhoveroutline || "transparent"};
          border: ${props => props.borderbtnhoveroutline || "var(--border-primary)"} 1px solid;
          transition: all ease 0.3s;

          img{
            transition: all ease 0.3s;
            filter: ${props => props.filterhoveroutline || "brightness(500%) invert(0%)"};
          }
        }
      }
    }

    &.delete {
      display: grid;
      width: 100%;
      height: 100%;
      a {
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;
        display: flex;
        padding: 10px 10px;
        width: 100%;
        height: 100%;
        background: #990000;
        color: white;
        border-radius: 5px;
        font-weight: 400;
        font-size: 10px;
        transition: all ease 0.3s;
        text-decoration: none;
        border: none;
        outline: none;
        img {
          filter: brightness(500%);
          width: 13%;
        }
        &:hover {
          background: #990000;
        }
        span {
          width: fit-content;
        }
      }
    }
    &.update {
      display: grid;
      width: 100%;
      height: 100%;
      a {
        text-align: center;
        font-size: 10px;
        align-items: center;
        text-decoration: none;
        justify-content: center;
        display: flex;
        gap: 5px;
        width: 100%;
        height: 100%;
        background: #1b6b84;
        border: none;
        color: white;
        border-radius: 5px;
        padding: 10px 10px;
        line-height: 120%;
        transition: all ease 0.3s;
        img {
          filter: brightness(500%);
          width: 13%;
        }
        &:hover {
          background: #15586b;
          color: white;
        }
        span {
          width: fit-content;
        }
      }

    }
  }
`;
