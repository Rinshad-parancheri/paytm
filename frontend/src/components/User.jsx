import { useState } from "react"
import { Button } from "./Button"
export const Users = () => {
  const [users, setUsers] = useState({

  })

  return (
    <>
      <div className="font-bold mt-6 text-lg">
        Users
      </div>
      <div className="my-2">
        <input type="search" name="" placeholder="Search...user" className="w-full px-2 py-1 border rounded border-slate-200" />

      </div>
      <div >

        {users.filter((user) => {
          <User user={user}></User>
        })}
      </div>
    </>
  )

}

const User = ({ user }) => {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-10 w-10 bg-slate-200 flex items-center justify-center text-xi">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div>{`${user.firstName} ${user.secondName}`}</div>
      </div>
      <div >
        <Button label={"Send money"}></Button>
      </div>

    </div>
  )
}
