export default function Navbar() {
   return (
      <header className=" top-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-lg z-50">
         <div>
            <a href="/" className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 transition">
               Microservices Platform
            </a>
         </div>
         <nav>
            <ul className="flex space-x-4">
               <li>
                  <a href="/login" className="text-indigo-500 hover:text-gray-400 transition">Login</a>
               </li>
               <li>
                  <a href="/register" className="text-indigo-500 hover:text-gray-400 transition">Register</a>
               </li>
            </ul>
         </nav>
      </header>
   )
}