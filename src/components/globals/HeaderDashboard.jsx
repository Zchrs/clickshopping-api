/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { useMenu } from '../../layouts/MenuContext';
import { Link } from 'react-router-dom';
import { getFile } from '../../reducers/globalReducer'
import { Avatar } from './Avatar';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { startChecking } from "../../actions/authActions";


import '../../assets/sass/header-dashboard.scss'

export const HeaderDashboard = () => {
  const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch]);
    const { showMenu } = useMenu();
    
  return (
    <div className='headdash'>
        <div className='headdash-logo'>
            <Link to={"/"}><img src={getFile('svg', 'logo', 'svg')} alt="" /></Link>
        </div>
        
          <div className='headdash-useravatar'>
                  { user ?
                    <Avatar img={"default-avatar"} avtsmall={true} clas={"avatar tumb"} />
                    : false
                  }
          </div>
        <div onClick={showMenu} className='headdash-menuhamb'>
              <img src={getFile('svg', 'hamburguer', 'svg')} alt="" />
          </div>

       
    </div>
  )
}
