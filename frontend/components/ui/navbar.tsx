export default function Navbar() {

   return (
      <>
         <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
               Microservices Platform
            </div>
            <div>
               <a href="/" style={{ marginRight: '1rem' }}>Home</a>
               <a href="/users" style={{ marginRight: '1rem' }}>Users</a>
               <a href="/payments" style={{ marginRight: '1rem' }}>Payments</a>
               <a href="/notifications">Notifications</a>
            </div>
            <div>
               <a href="/login" style={{ marginRight: '1rem' }}>Login</a>
               <a href="/register">Register</a>
            </div>
         </nav>
      </>
   );
}