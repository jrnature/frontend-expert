import { useState } from "react";
import { Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";

const config= new AptosConfig ({network : Network.TESTNET});
const aptos= new Aptos(config);

const APTOS_COIN="0X1::aptos_coin::AptosCoin";
const COIN_STORE=`0x01::coin::CoinStore<${APTOS_COIN}>`;
const CONTRACT="0x3e88ab6d78869cee46bc200d51c3dda0b3ed18a756b677f519172fdc09793a33"; //transChain

function App2() {
  const [valor, setValor] = useState(0)

  const crearCuenta =async ()=>{
    const alicia = Account.generate();
    console.log(alicia.accountAddress);
    setValor(alicia.accountAddress);
  }

  const fondearCuenta= async ()=>{
    await aptos.fundAccount({
        accountAddress: valor,
        amount : 100_000_000,
    });

    console.log(`La cuenta ${valor} fue dondeada`)
  }

  const saldoCuenta = async () => {
    const saldoAlicia = await aptos.getAccountResource ({
        accountAddress: valor,
        resourceType: COIN_STORE,
    });
   console.log(`El saldo de la cuenta es: ${saldoAlicia.coin.value}`)
  }

  return (
    <div className="App2">
        <button onClick={crearCuenta}>Generar Cuenta</button>
        <button onClick={fondearCuenta}>Fondear Cuenta</button>
        <button onClick={saldoCuenta}>Saldo de la Cuenta</button>
    </div>
  );
}

export default App2;
