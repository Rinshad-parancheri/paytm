import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/SubHeading"
import axios from "axios"

export const Signup = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="bg-slate-300 h-screen grid place-items-center">
      <div className="flex flex-col justify-center ">
        <div className="rounded-l bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"}></Heading>
          <Subheading label={"Enter your credentials to signup"}></Subheading>
          <InputBox label={"First Name"} placeholder={"jan doe"} onChange={e =>
            setFirstName(e.target.value)
          }></InputBox>
          <InputBox label={"Second Name"} placeholder={"Doe"} onChange={e =>
            setLastName(e.target.value)
          }></InputBox>
          <InputBox label={"Email"} placeholder={"dapper948@gmail"} onChange={e =>
            setEmail(e.target.value)
          }></InputBox>
          <InputBox label={"Password"} placeholder={"2f9f8fl"} onChange={e =>
            setPassword(e.target.value)
          }></InputBox>
          <Button label="Sign Up" onClick={async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post('http://localhost:3000/app/v1/user/signup', {
                firstName,
                lastName,
                email,
                password
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              console.log('Signup successful:', response.data);
            } catch (error) {
              console.error('Signup error:', error.response ? error.response.data : error.message);

            }
          }}></Button>
          <BottomWarning label={"Alreday have an account"} btnText={"Sign in"} to={"/signin"} ></BottomWarning> </div>
      </div>
    </div >

  )


}



