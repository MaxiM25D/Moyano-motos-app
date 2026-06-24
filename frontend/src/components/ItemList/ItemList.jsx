import Item from "../Item/Item";
import "./ItemList.css";

function ItemList({ products }) {

  return (
    <div className="products-grid">
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ItemList;