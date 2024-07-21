import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/SubHeading"

export const Signup = () => {
  return (
    <div className="bg-slate-300 h-screen">
      <div className="flex flex-col justify-center ">
        <div className="rounded-l bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"}></Heading>
          <Subheading label={"Enter your credentials to signin"}></Subheading>
          <InputBox label={"First Name"} placeholder={"jan doe"}></InputBox>
          <InputBox label={"Second Name"} placeholder={"Doe"}></InputBox>
          <InputBox label={"Email"} placeholder={"dapper948@gmail"}></InputBox>
          <InputBox label={"Password"} placeholder={"2f9f8fl"}></InputBox>
          <Button label={"Sign In"}></Button>
          <BottomWarning label={"Alreday have an account"} btnText={"Sign in"} to={"/signin"}></BottomWarning> </div>
      </div>
    </div>

  )


}



