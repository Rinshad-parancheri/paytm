import { Link } from "react-router-dom"

export const BottomWarning = ({ label, btnText, to }) => {
  return (
    <div className="py-2 text-sm flex justify-center items-center">
      <div>
        {label}
      </div>
      <Link className="pointer cursor-pointer underline p-1 justify-self-start" to={to} >{btnText}</Link>
    </div>
  )
}
