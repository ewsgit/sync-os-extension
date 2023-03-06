import { useEffect, useState } from 'react'

function Loading() {
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  if (isLoading)
    return (
        <div
            className={"bg-gray-900 w-full h-full overflow-hidden flex items-center justify-center"}>
          <img src={require("./assets/").default} alt=""/>
        </div>
    )

  return <div>a</div>
}

export default Loading
