export default function SearchInput({children}: {children: React.ReactNode}) {
   return (
      <>
      <div className="mb-4">
         <input type="text" placeholder="Search..." className="border rounded px-4 py-2 w-full" />
      </div>
      </>
   );
}