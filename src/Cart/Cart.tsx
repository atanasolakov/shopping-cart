import CartItem from "../CartItem/CartItem";
import {Wrapper} from "./Cart.styles";
import { CartItemType} from "../App";

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id:number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart}) => {
    const calculateTotalAmount = (items: CartItemType[]) =>
        items.reduce((acc:number, item) => acc + item.quantity * item.price, 0)

    return (
        <Wrapper>
            <h2> Shop Cart</h2>
            { cartItems.length === 0 ? <p>Cart is Empty.</p> : null }
            { cartItems.map(item =>(
                <CartItem key={item.id}
                          item={item}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                />
            ))}
            <h2> Total : ${calculateTotalAmount(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}
export  default Cart