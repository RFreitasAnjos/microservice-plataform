import AuthForm from "@/components/forms/auth-form";

export default function LoginPage(){
   return (
      <div>
         <div>
            <h1>Login</h1>
         </div>
         <AuthForm type="login" />
      </div>
   )
}