/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { getFile } from '../../reducers/globalReducer'
import { Avatar } from './Avatar';


export const HeaderInfo = ({headClass}) => {

    

  return (
    <div className={headClass}>
        <div className='headproducts-info'>
            <Link to={"/"}><img src={getFile('svg', 'logo', 'svg')} alt="" /></Link>
        </div>
        <div className="headproducts-group">

          <div className='headproducts-useravatar'>
                  <Avatar img={"default-avatar"} avtsmall={true} dropData={true} classWhite={"avatar black"} clas={"avatar tumb"} />
          </div>

        </div>
    </div>
  )
}
