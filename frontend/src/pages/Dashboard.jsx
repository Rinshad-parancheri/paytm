import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/User"



export const Dashboard = ({ }) => {
  return (
    <div className="flex flex-col">
      <Appbar></Appbar>
      <div>
        <Balance></Balance>
        <Users></Users>
      </div>
    </div>
  )
}
