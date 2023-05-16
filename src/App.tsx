import { useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item'
import Cart from './Cart/Cart'
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import {ShoppingCartTwoTone} from "@material-ui/icons";
import Badge from '@material-ui/core/Badge';
// Styles
import { Wrapper, StyledButton } from './App.styles';
// @ts-ignore
import axios from "axios";
import {inspect} from "util";



export type CartItemType = {
    id: number;
    category: string;
    description: string;
    image: string;
    price: number;
    title: string;
    quantity: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
    axios
        .get('https://fakestoreapi.com/products')
        .then((response) => {
            return response.data;
        });
const App = () => {
    const [cartOpen, isCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[])
    const { data, isLoading, error } = useQuery<CartItemType[]>(
        'products',
        getProducts
    );
    console.log(data);
    const getTotalItems = (items: CartItemType[]) =>
        items.reduce((acc: number, item ) => acc + item.quantity, 0);

    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems( prev => {
            const isItemInCart = prev.find(item => item.id === clickedItem.id)
            if (isItemInCart) {
                return prev.map(item => (
                    item.id === clickedItem.id ? { ...item, quantity: item.quantity + 1}
                        : item
                ))
            }
            return [...prev,{...clickedItem , quantity: 1}]
        })
    };
    const handleRemoveFromCart = (id: number) => {
        setCartItems(prevState => (
            prevState.reduce((acc, item) => {
                if(item.id === id) {
                 if(item.quantity === 1) return acc;
                 return[...acc, {...item, quantity: item.quantity -1}]
                } else {
                   return [...acc, item];
                }
            },[] as CartItemType[])
        ))
    };

    if (isLoading) return <LinearProgress/>
    if (error) return <div> Something went wrong </div>
  return (
     <Wrapper>
         <Drawer anchor='right' open={cartOpen} onClose={() => isCartOpen(false)}>
             HELLO CART
             <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
         </Drawer>
         <StyledButton onClick={() => isCartOpen(true)}>
             <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                 <ShoppingCartTwoTone style={{ fontSize: '2.5rem', color: 'bisque' }}  />
             </Badge>
         </StyledButton>
        <Grid container spacing={6}>
            {data?.map(item => (
                <Grid item key={item.id} xs={12} sm={3}>
                    <Item item={item} handleAddToCart={handleAddToCart} />
                </Grid>
            ))}
        </Grid>
      </Wrapper>
  );
}

export default App;
