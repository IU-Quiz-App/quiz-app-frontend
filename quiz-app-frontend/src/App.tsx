import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
    const [data, setData] = useState<string>("");

    useEffect(() => {
        fetch('api/hello')
            .then((response) =>
                response.json()
            )
            .then((data) => setData(data.message))
            .catch((err) => console.error(err));
    }, []);

  const [count, setCount] = useState(0)

  return (
      <div className={'min-h-screen h-screen flex-1 bg-primary'}>
          <div className={'flex h-full items-center justify-center'}>
              <div className="text-white">{data ? data : "Loading..."}</div>
          </div>
      </div>
  )
}

export default App
