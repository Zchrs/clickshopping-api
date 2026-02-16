/* eslint-disable no-debugger */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { addRating, fetchProductRatings} from '../../actions/productActions'; // Asegúrate de importar las acciones correctas
import Swal from 'sweetalert2';
import io from 'socket.io-client';

export const Rating = ({ title, sellings, ratings, productID, userID }) => {
  const socket = io(import.meta.env.VITE_APP_API_WEBSOCKET_URL);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    if (productID) {
      if (!ratings || !ratings[productID]) {
        dispatch(fetchProductRatings([productID]));
      }
    }
  }, [productID, dispatch, ratings]);

  useEffect(() => {
    if (productID && ratings && ratings[productID]) {
      setAverageRating(ratings[productID].averageRating || 0);
      setTotalRatings(ratings[productID].totalRatings || 0);
    }
  }, [ratings, productID]);

  useEffect(() => {
    socket.on('updateRating', ({ product_id, averageRating, totalRatings }) => {
      if (product_id === productID) {
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
      }
    });

    return () => {
      socket.off('updateRating');
    };
  }, [productID]);

  const handleRatingChange = async (value) => {
    try {
      if (!user) {
        Swal.fire({
          title: 'Debes ser cliente',
          text: 'Debes ser cliente y comprar este producto para calificarlo',
          icon: 'info',
          showCancelButton: false,
          confirmButtonText: 'Volver',
          cancelButtonText: 'Volver',
          background: '#f0f0f0',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-confirm-button',
          },
        });
        return;
      }

      setRating(value);
      await addRating(productID, userID, value);
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  return (
    <RaTings>
      <div className="rating">
        {title && <h2>{title}</h2>}
        {productID && (
          <div className="rating-contain">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={value <= (rating || averageRating) ? 'selected' : 'star'}
                  onClick={() => handleRatingChange(value)}
                >
                  <div className="star">
                    <svg viewBox="0 0 576 512" title="star">
                      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                    </svg>
                  </div>
                </span>
              ))}
            </div>
            <div className="group">
              <p><b>Promedio:</b> {averageRating.toFixed(1)}</p>
              <p>Calificaciones: {totalRatings}</p>
              
            </div>
          </div>
        )}
      </div>
    </RaTings>
  );
};

const RaTings = styled.div`
.rating {
    display: grid;
    width: 100%;
    height: fit-content;
    

    h2 {
      font-size: 40px;
      line-height: 1.1;
    }

    .star {
      position: relative;
      fill: gray;
      white-space: nowrap;
      svg {
        width: 16px;
        cursor: pointer;
      }
    }

    &-contain {
      display: grid;
      padding: 0;
    }

    .cover {
      
      background: transparent;
      height: 100%;
      overflow: hidden;
      mix-blend-mode: color;
      position: absolute;
      top: 0;
      right: 0;
    }

    svg {
      position: relative;
      fill: rgb(195, 191, 191);
      height: 20px;
      stroke: black;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1px;

      &::before {
        top: 0;
        left: 0;
        position: absolute;
        content: "";
        width: 21px;
        height: 21px;
        background: black;
      }
    }

    .selected {
      cursor: default;
      transition: all ease 0.3s;
      svg {
        fill: #EC3337;
        transform: scale(1.1);
      }
    }

    .flex {
      display: flex;
      margin: 0;
      padding: 0;
      gap: 1px;
      align-items: self-start;
      width: fit-content;
      height: fit-content;
    }
    
    .group {
      width: fit-content;
      height: 100%;
      display: flex;
      gap: 10px;

      h4 {
        font-weight: 800;
        font-size: 18px;
        height: 100%;
        margin-bottom: 3px;
      }

      p {
        margin: 0;
        padding: 0;
        font-weight: 500;
        font-size: 12px;
      }
    }
  }
`