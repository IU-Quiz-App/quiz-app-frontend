import {useEffect, useState} from 'react'

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

  return (
      <div className={'min-h-screen h-screen flex-1 bg-primary'}>
          <div className={'flex h-full items-center justify-center'}>
              <div className="text-white">{data ? data : "Loading... 123"}</div>
          </div>
      </div>
  )
}

export default App
