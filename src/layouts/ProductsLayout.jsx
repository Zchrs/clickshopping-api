import { Footer } from "../components/globals/Footer"
import { HeaderProducts } from "../components/globals/HeaderProduct"
import { ProductRouter } from "../router/AppRouter"
import './productslayout.scss'


export const ProductsLayout = () => {
  return (
    <section className="productslayout">
        <div className="productslayout-header">
            <HeaderProducts headClass={"headproducts blackhead"} />
        </div>
        <div className="productslayout-contain">
            <ProductRouter />
        </div>
        <div className="productslayout-footer">
            <Footer />
        </div>
    </section>
  )
}
