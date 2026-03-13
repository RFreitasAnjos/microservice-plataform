import RegisterForm from "@/components/forms/register-form";

export default function RegisterPage(){
   return (
      <div>
         <div>
            <h1>Cadastro</h1>
         </div>
         <RegisterForm type="register" />
      </div>
   )
}