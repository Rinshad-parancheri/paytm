import { useEffect, useState } from "react"
import axios from "axios"


export const Balance = () => {
  const [balance, setBalance] = useState("")

  useEffect(() => {

    axios.get("http://localhost:3000/app/v1/account/balance", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then(response => {

      let balanceInRupees = (response.data.balance / 100).toFixed(2)
      setBalance(balanceInRupees)
    })

  })

  return (
    <div className="flex">
      <div className="font-bold text-lg">
        Balance
      </div>
      <div className="font-semibold ml-4 text-lg">
        {balance}
      </div>
    </div>
  )
}
