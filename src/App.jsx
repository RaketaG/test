import { useState, useEffect } from 'react'
import './App.css'

const FAKESTORE_STORAGE_KEY = 'productDescriptionCache'

const loadSessionStorage = () => JSON.parse(sessionStorage.getItem(FAKESTORE_STORAGE_KEY)) || {};
const saveSessionStorage = (sessionCacheData) => {
    sessionStorage.setItem(FAKESTORE_STORAGE_KEY, JSON.stringify(sessionCacheData));
};

const cacheData = loadSessionStorage();

function App() {
    const [productData, setProductData] = useState({});
    const [randomNumber, setRandomNumber] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const randomNumberGenerator = () => setRandomNumber(Math.floor(Math.random() * 20) + 1);

    useEffect(() => {
        const abortController = new AbortController();

        const randomProductGenerator = async () => {
            if (randomNumber in cacheData) {
                setProductData(cacheData[randomNumber]);
            } else {
                try {
                    setIsLoading(true);
                    const response = await fetch(
                        `https://fakestoreapi.com/products/${randomNumber || Math.floor(Math.random() * 20) + 1}`,
                        { signal: abortController.signal }
                    );
                    if (!response.ok) {
                        throw new Error(`Something went wrong!\nHTTP: ${response.status}`);
                    }
                    const data = await response.json();
                    setProductData(data);
                    cacheData[randomNumber] = data;
                    saveSessionStorage(cacheData);
                } catch (error) {
                    error.name !== 'AbortError' && alert(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        randomProductGenerator();

        return () => {
            abortController.abort();
        }
    }, [randomNumber]);

    return (
        <>
            <button className='btnClass'
                onClick={randomNumberGenerator}
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
