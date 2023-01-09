import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useCallback } from "react";
import { createSwitch } from "typescript";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart,{ generateCartItemsFrom }  from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [finalData, setFinalData] = useState([]);
  const [tempProd, setTempProd] = useState([]);
  let tempArray = [];
  let product= {
            "name": "iPhone XR",
             "category": "Phones",
            "cost": 100,
            "rating": 4,
            "image": "https://i.imgur.com/lulqWzW.jpg",
          "_id": "v4sLtEcMpzabRyfx"     
       }
//   useEffect(() => {
//     performAPICall();
// },[]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  //  const setTempArray = (result) => {
  //   console.log('result:: ',result);
  
  // }

  const performAPICall = useCallback(async () => {
    setLoading(true);
    try{
      const url = `${config.endpoint}/products`;
      const response = await axios.get(url);
      const result = await response.data;
      setTempProd(result);
      tempArray = result;
      return result;
    }catch(e){
      if(e.response && e.response.status === 500){
      enqueueSnackbar(e.response.data.message, {variant: "error"});
      }
    }finally{
      setLoading(false);
    }
  },[enqueueSnackbar]);
   useEffect(() =>{
    let dataLoaded = true;
    const reloadData = async() =>{
      const response = await performAPICall();
      if(dataLoaded){
        setFinalData(response);
      }
    } 
    reloadData();
    return () => {
      dataLoaded = false;
    }
   },[performAPICall])
    // setLoading(true);
    // try{
    //   const url = `${config.endpoint}/products`;
    //   const response = await axios.get(url);
    //   setFinalData(response.data);
    // }catch(e){
    //   if(e.response && e.response.status === 500){
    //     enqueueSnackbar(e.response.data.message, {variant: "error"});
    //   }
    // }finally{
    //   setLoading(false);
    // }   

  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    const url = `${config.endpoint}/products/search?value=${text}`;
      try{
        const response = await axios.get(url);
        setFinalData(response.data);
      }catch(e){
        if(e.response.status === 404){
          setFinalData(null);
        }
      }finally{
        setLoading(false);
      }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
   
   let newTimeout;
  const debounceSearch = (event, debounceTimeout) => {
      clearTimeout(newTimeout);
      newTimeout = setTimeout(() =>{
        performSearch(event.target.value);
      }, debounceTimeout);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
   
   const [cartItems, setCartItems] = useState([]);
   const fetchCart = async (token) => {
    if (!token) return;
    const url = `${config.endpoint}/cart`;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("res",res.data)
      setTempProd(finalData);
      const data = await generateCartItemsFrom(res.data, finalData);
      setCartItems(data)
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };
  useEffect(async () => {
    await fetchCart(localStorage.getItem("token"));
    //  console.log(products)
  }, [finalData]);
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
   const isItemInCart = (items, productId) => {
    // console.log("items", items, productId);
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === productId) {
        return true;
      }
    }
    return false;
  };
 /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // console.log(
    //   "addtocart",
    //   isItemInCart(cartItems, productId),
    //   token,
    //   items,
    //   products,
    //   productId,
    //   qty,
    //   (options = { preventDuplicate: false })
    // );
    if (products.length > 0) {
      for (var i in products) {
        if (products[i]._id === productId) {
          products[i].qty = qty;
          const url = `${config.endpoint}/cart`;

          try {
            const res = await axios.post(
              url,
              { productId: productId, qty: qty },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "content-type": "application/json",
                },
              }
            );
            const data = generateCartItemsFrom([...res.data], tempProd);
            setCartItems(data)
            console.log("addtocart", res.data,cartItems);
          } catch (e) {
            if (e.response && e.response.status === 400) {
              enqueueSnackbar(e.response.data.message, { variant: "error" });
            } else {
              enqueueSnackbar(
                "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
                {
                  variant: "error",
                }
              );
            }
            return null;
          }
        }
      }
     const data = generateCartItemsFrom(cartItems, products);
     setCartItems(data)
    } else if (!isItemInCart(cartItems, productId)) {
      const url = `${config.endpoint}/cart`;

      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        const res = await axios.post(
          url,
          { productId: productId, qty: qty },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        );
        const data = generateCartItemsFrom([...res.data], tempProd);
        setCartItems(data)
        console.log(
          "from add to cart",
          [...res.data],
          cartItems,
          tempProd,
          setCartItems
        );
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return null;
      }
    } else {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    }
  };

  return (
    <div style={{height:"auto"}}>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className=" search-desktop"
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e) =>{
          debounceSearch(e,500);}}
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className=" search-mobile"
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e) =>{
          debounceSearch(e,500);}}
      />
      {console.log(window.location.pathname)}
    <Grid container spacing={2}>
      <Grid item sm={12} md={localStorage.getItem("username") ? 9 : 12}>
        <Grid container>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s{" "}
                <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
            </Box>
          </Grid>
        </Grid>
      <Grid container spacing={2} >
        {loading === true ? (<div className="loading">
                          <CircularProgress />
                          <h5 >Loading Products...</h5>
                          </div>) :finalData === null ? (<div className="loading">
                <SentimentDissatisfied />
                <h5>No products found</h5>
              </div>): (finalData.map((item) => {
                return(<ProductCard
                  product={item}
                  key={item._id}
                  handleAddToCart={addToCart}
                />)
              }))}
        </Grid>
      </Grid>
       {localStorage.getItem("username") ? <Grid item xs={12} md={3} style={{ marginTop: "1rem", backgroundColor: "#E9F5E1" }} >
       <Cart
              items={cartItems}
              products={finalData}
              handleQuantity={addToCart}
            />
            </Grid>: <></>}
    </Grid>
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Footer />
    </div>
  );
};

export default Products
