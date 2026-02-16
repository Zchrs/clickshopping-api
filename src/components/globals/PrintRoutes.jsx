import { Route } from 'react-router-dom'
export const PrintRoutes = () => {
    const routes = Route();
    console.log(routes)
  
    return (
      <div>
        {routes.map((route, index) => (
          <span key={index}>{route.path}</span>
        ))}
      </div>
    );
  };