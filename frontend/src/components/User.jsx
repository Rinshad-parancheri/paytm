import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export const Users = () => {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/app/v1/user/bulk?filter=" + filter, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then(response => {
      setUsers(response.data.users)
    })
  }, [filter])

  return <div>
    <div className="font-bold mt-6 text-lg">
      Users
    </div>
    <div className="my-2">
      <input type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => {
        setFilter(e.target.value)
      }}></input>
    </div>
    <div>
      {users.map(user => <User key={user.id} user={user} />)}
    </div>
  </div>


}

const User = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-center gap-1">
        <div className="rounded-full h-8 w-8 bg-slate-200 flex items-center justify-center mr-1">
          <div className="flex flex-col justify-center h-full font-semibold text-lg">
            {user.firstName[0]}
          </div>
        </div>
        <div>{`${user.firstName} ${user.lastName}`}</div>
      </div>
      <div >
        <Button label={"Send money"} onClick={e => {
          navigate(`/sendmoney?id=${user.id}&firstName=${user.firstName}&lastName=${user.lastName}`);
        }}></Button>
      </div>

    </div >
  )
}
