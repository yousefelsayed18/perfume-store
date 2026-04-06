import Customers from "./Customers/Customers";
import FAQ from "./FAQ/FAQ";
import Header from "./Header/Header";
import ProductsSlider from "./ProductsSlider/ProductsSlider";
import Shopping from "./Shopping/Shopping";
import WomanSlider from "./WomanSlider/WomanSlider";

export default async function Home() {
  return (
    <>
      <Header />
      <Shopping/>
      <ProductsSlider/>
      <WomanSlider/>
      <Customers/>
      <FAQ/>
    </>
  );
}
