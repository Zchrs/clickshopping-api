/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"
import { routesHelpcenter } from "../../routes/routes"


export const VerticalMenu = () => {

    const rules = routesHelpcenter.slice(6, routesHelpcenter.length)
  return (
    <div className="verticalmenu">
            {rules.map((item) =>(
            <NavLink to={item.route} key={item.id}>
              {item.name}
            </NavLink>
          ))}
    </div>
  )
}
