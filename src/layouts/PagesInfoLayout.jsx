import { Footer } from '../components/globals/Footer';
import { HeaderInfo } from '../components/globals/HeaderInfo';
import { InputSearch } from '../components/globals/InputSearch';
import { VerticalMenu } from '../components/globals/VerticalMenu';
import { RulesRouter } from '../router/AppRouter';
import './pagesinfolayout.scss';

export const PagesInfoLayout = () => {
  return (
    <section className="infodocs">
        <div className="infodocs-header">
            <HeaderInfo headClass={"headproducts whitehead"} />
        </div>
        <div className="infodocs-subheader">
          <div>
            <h2>Reglamento</h2>
          </div>
        <InputSearch clas={"inputSearch short"} placeholder={"palabras clave"} />
        </div>
        <div className="infodocs-contain">
          <div className="infodocs-contain-left">
            <VerticalMenu />
          </div>
          <div className="infodocs-contain-center">
            <RulesRouter />
          </div>
          <div className="infodocs-contain-right">

          </div>
        </div>
        <div className="infodocs-footer">
            <Footer />
        </div>
    </section>
  )
}
