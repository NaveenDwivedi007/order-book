import { LoaderInterface } from "../interfaces/loaderInterfaces"

function Loader({
  isImageVisible=true,
  isTextVisible=true
}:Partial<LoaderInterface>={
  isImageVisible:true,
  isTextVisible:true
}) {
  return (
    <div className="loader-container loader-animation">
      {isImageVisible && <img src="/favicon.png" className="loading-img" alt="Loading" />}
      {isTextVisible && <span className="loading-text">Loading</span>}
    </div>
  )
}


export default Loader