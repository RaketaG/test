/* TASK
  1. At the top add a button named "Generate Random Product".
  2. Clicking button should call API https://fakestoreapi.com/products/{product_id}. {product_id} should be randomly generated number between 1 and 20. Fetch the randomly generated product and save it in state.
  3. Display on screen all the information about product.
*/

import { useState, useRef } from 'react'
import './App.css'

function App() {
  const cacheData = useRef({});
  const abortController = useRef(null);
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const randomProductGenerator = () => {
    const randomNumber = Math.floor(Math.random() * 20) + 1;

    if (randomNumber in cacheData.current) {
      setProductData(cacheData.current[randomNumber]);
    } else {
      abortController.current && abortController.current.abort();

      abortController.current = new AbortController();

      setIsLoading(true);
      fetch(`https://fakestoreapi.com/products/${randomNumber}`, {
        signal: abortController.current.signal
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`Something went wrong!\nHTTP: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setProductData(data);
          cacheData.current[randomNumber] = data;
          setIsLoading(false);
        })
        .catch((error) => {
          error.name !== 'AbortError' && alert(error);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <button
        onClick={randomProductGenerator}
      >
        Generate Random Product
      </button>

      {isLoading ?
        <div className="spinner" /> :
        Object.entries(productData).map(([key, value]) => (
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
        ))
      }
    </>
  )
}

export default App
