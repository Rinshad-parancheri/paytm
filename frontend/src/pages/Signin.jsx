import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/SubHeading"
import axios from "axios"

export const Signin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    < div className="bg-slate-300 h-screen grid place-items-center" >
      <div className="flex flex-col justify-center rounded-lg">
        <div className="rounded-lg bg-white w-80 text-center p-5 h-max px-4">
          <Heading label={"Sign in"}></Heading>
          <Subheading label={"Enter your credentials to signin"}></Subheading>
          <InputBox label={"Email"} placeholder={"dapper948@gmail"} onChange={e =>
            setEmail(e.target.value)
          }></InputBox>
          <InputBox label={"Password"} placeholder={"2f9f8fl"} onChange={e =>
            setPassword(e.target.value)
          }></InputBox>

          <Button label={"Sign In"} onClick={async (e) => {
            e.preventDefault()

            let response = await axios.post("http://localhost:3000/app/v1/user/signin", {
              email,
              password
            })

            localStorage.setItem("token", response.token)
          }}></Button>
          <BottomWarning label={"couldn't find account"} btnText={"Sign up"} to={"/signin"}></BottomWarning>
        </div>
      </div>
    </div >

  )


}



