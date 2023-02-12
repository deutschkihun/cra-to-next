import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Image src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link href="/sample">next page</Link>
      </header>
    </div>
  );
}

export default App;
