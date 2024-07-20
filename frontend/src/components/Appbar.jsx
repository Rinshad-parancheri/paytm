export const Appbar = ({ label, userName = "User" }) => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between"></nav>
      <div className="text-lg font-semibold">Paytm App</div>
      <div className="flex items-center space-x-4">
        <span className="text-sm"> {userName}</span>
        <div className="rounded-full h-10 w-10 bg-slate-200 flex items-center justify-center text-xi">
          {userName[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}


