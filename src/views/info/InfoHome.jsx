import {useLocation} from  'react-router-dom';

export const InfoHome = () => {
    const location = useLocation();
    const footerLocation = useLocation();
    const infoDoc = footerLocation.state;
    console.log(infoDoc.name)

  return (
    <section className="legaldocs">
        <div className="legaldocs-header">
            <span>{`home${location.pathname.replace(/\//g, ' > ')}`}</span>
            <h2>{infoDoc.name}</h2>
        </div>
            
   </section>
  )
}


