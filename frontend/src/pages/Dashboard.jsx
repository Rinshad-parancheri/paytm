import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/User"



export const Dashboard = ({ }) => {
  return (
    <div className="">
      <Appbar></Appbar>
      <div className="mt-5 p-7">
        <Balance></Balance>
        <Users></Users>
      </div>
    </div>
  )
}
