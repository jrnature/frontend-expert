import { useState } from "react";

function App() {
  const [valor, setValor] = useState(0)

  const incrementarContador = () => {
    setValor(valor + 1)
  }

  const decrementarContador = () => {
    setValor(valor - 1)
  }

  const inicializarContador = () =>{
    setValor(0)
  }
  return (
    <div className="App">
      <p>El valor del contador = {valor}</p>
      <button onClick={incrementarContador}>Aumentar Contador</button>
      <button onClick={decrementarContador}>Disminuir Contador</button>
      <button onClick={inicializarContador}>Resetear Contador</button>
    </div>
  );
}

export default App;
