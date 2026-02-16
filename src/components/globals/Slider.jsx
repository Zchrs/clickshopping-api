/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';


export const Slider = () => {
  const images = [
    'default-product',
    'man-avatar',
    'default-product',
    'icon-avatar',
    'default-avatar'
  ];

  const productThumbs = useSelector(state => state.product.selectedProduct?.images || []);
  // console.log(productThumbs)
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    let index = currentIndex - 1;
    if (index < 0) index = images.length - 1;
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    let index = currentIndex + 1;
    if (index >= images.length) index = 0;
    setCurrentIndex(index);
  };

  return (
    <SliDer>
      <div className="slider-container">
        <button className='prev' onClick={goToPrevSlide}></button>
        <div className="slider">
          <div className="slide">
          <img loading='lazy' src={productThumbs[currentIndex].img_url} alt="" />
          </div>
        </div>
        <button className='next' onClick={goToNextSlide}></button>
        <div className="thumbs">
          {productThumbs.map((thumb, index) => (
            <div
              key={index}
              className={index === currentIndex ? 'thumb activesl' : 'thumb'}
              onClick={() => goToIndex(index)}
            >
              <img
                loading='lazy'
                src={thumb.img_url}
                alt="" />
            </div>
          ))}
        </div>
      </div>
    </SliDer>
  );
};

const SliDer = styled.div`
.slider-container {
    position: relative;
    display: grid;
    place-content: center;
    // border: green 1px solid;
    gap: 8px;

    button{
        background: transparent;
        outline: none;
        border: none;

        &:active{
            outline: none;
            border: none;
        }
        &:visited{
            border: none;
            outline: none;
        }
        &:focus{
            border: none;
            outline: none;
        }
    }
    .active {
      transform: translateX(0);
      width: 100%;
      border-bottom: #EC3337 3px solid;
      // box-shadow: 1px 1px 1px black;
      img{
        width: 100%;
        object-fit: cover;
      }
    }
    
  }
  
  .slider {
    position: relative;
    display: flex;
    overflow: hidden;
    width: 100%; /* Cambiar el ancho del slider según tus necesidades */
    height: 400px; /* Cambiar la altura del slider según tus necesidades */
  }
  
  .slide {
    position: relative;
    flex: 0 0 auto;
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.5s ease-in-out;

    img{
        object-fit: cover;
        width: 100%;
    }

  }
  

  /* Estilos para los botones de "Prev" y "Next" */
  .next {
    display: grid;
    right: -10px;
    margin: auto;
    bottom: 0;
    top: 0;
    position: absolute;
    width: 40px;
    height: 40px;
    // border: black 1px solid;



    &::before{
        position: absolute;
        margin: auto;
        left: 3px;
        display: block;
        content: "";
        clip-path: polygon(90% 0, 40% 50%, 90% 100%, 75% 100%, 25% 50%, 75% 0);
        background: rgba(0, 0, 0, 0.142);
        transform: rotateZ(-180deg) scale(0.7);
        width: 100%;
        height: 100%;
        transition: all ease .3s;
        
    }
    &:hover::before{
        background: rgba(0, 0, 0, 0.579);
        transform: rotateZ(-180deg) scale(1);
    }

}
.prev {
    display: grid;
    margin: auto;
    bottom: 0;
    top: 0;
    left: -16px;
    position: absolute;
    width: 40px;
    height: 40px;
    border: black 1px solid;


    &::before{
        position: absolute;
        margin: auto;
        left: 3px;
        display: block;
        content: "";
        clip-path: polygon(90% 0, 40% 50%, 90% 100%, 75% 100%, 25% 50%, 75% 0);
        background: rgba(0, 0, 0, 0.142);
        width: 100%;
        height: 100%;
        transition: all ease .3s;
        transform: scale(0.7);
    }
    &:hover::before{
        background: rgba(0, 0, 0, 0.579);
        transform: scale(1);
    }
  }

  .thumbs{
    display: flex;
    // grid-template-columns: repeat(5, 1fr);
    gap: 5px;
    width: 100%;
    height: 80px;
    // background: black;
  }
  .thumb{
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    border: 1px solid rgb(225, 221, 221);
    overflow: hidden;

    img{
      top: 0;
      left: 0;
      position: absolute;
      object-fit: contain;
      height: 100%;
      width: 100%;
    }
  }

`