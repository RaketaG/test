/* TASK
  1. At the top add a button named "Generate Random Product".
  2. Clicking button should call API https://fakestoreapi.com/products/{product_id}. {product_id} should be randomly generated number between 1 and 20. Fetch the randomly generated product and save it in state.
  3. Display on screen all the information about product.
*/

import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [productData, setProductData] = useState({});

  const randomProductGenerator = () => {
    const randomNumber = Math.floor(Math.random() * 20) + 1;

    fetch(`https://fakestoreapi.com/products/${randomNumber}`)
      .then((response) => response.json())
      .then((data) => setProductData(data));
  };

  return (
    <>
      <button
        onClick={randomProductGenerator}
      >
        Generate Random Product
      </button>
      {Object.entries(productData).map(([key, value]) => (
        <div key={key} className='infoContainer'>
          <p className='infoKey'><strong>{key}: </strong></p>
          <p className='infoValue'>
            {(typeof value === "object" && value !== null)
              ? Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join(" | ")
              : value}
          </p>
        </div>
      ))}
    </>
  )
}

export default App
