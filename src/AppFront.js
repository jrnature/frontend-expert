import { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network, Account, SimpleTransaction} from "@aptos-labs/ts-sdk";
import { ABI } from './abi.ts'
import { createSurfClient } from "@thalalabs/surf";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Alert } from 'react-bootstrap';


export const config= new AptosConfig ({network : Network.TESTNET});
export const aptos= new Aptos(config);

export const surfClient = createSurfClient(aptos).useABI(ABI);

const APTOS_COIN="0X1::aptos_coin::AptosCoin";
const COIN_STORE=`0x01::coin::CoinStore<${APTOS_COIN}>`;
const CONTRACT="0x3e88ab6d78869cee46bc200d51c3dda0b3ed18a756b677f519172fdc09793a33"; //transChain

function AppFront() {
  const [cuenta, setCuenta] = useState()
  const [message, setMessage] = useState(' ')
  const [dependencia,setDependencia]= useState({
    nombreDependencia:'',
    direccionDependencia:'',
    telDependencia:'',
    correoDependencia:'',
    idDependencia:0,
  })
  const [enlace, setEnlace]=useState({
    nombreEnlace : '',
    cargoEnlace : '', 
    idDependenciaEnlace : 0,
    correoEnlace : '',
    idEnlace:0,
  })
  const [respuesta,setRespuesta] = useState({
    idSolicitudRespuesta: 0,
    informacion: '',
    anexos : '',
    fechaRespuesta  : '',
    responsable : "0x00",
    validacion : false,
    validador : "0x00",
    idRespuesta:0,
  })
  const [solicitud,setSolicitud]=useState({
    solicitante : '',
    correoSolicitud : '',
    idDependenciaSolicitud : 0,
    fechaSolicitud : '',
    atendido : false,
    idSolicitud : 0,
  })

  const {connect, account, connected, disconnect, signAndSubmitTransaction} = useWallet();

   useEffect(() => {
    setCuenta(Account.generate())
  },[])

  useEffect(()=>{
    console.log(`${cuenta?.accountAddress}`)},[cuenta]
  )

  const handleInputDependenciaChange = (e) => {
    const { name, value } = e.target;
    setDependencia(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInputEnlaceChange = (e) => {
    const { name, value } = e.target;
    setEnlace(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInputSolicitudChange = (e) => {
    const { name, value } = e.target;
    setSolicitud(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInputRespuestaChange = (e) => {
    const { name, value } = e.target;
    setRespuesta(prevState => ({ ...prevState, [name]: value }));
  };

  const inicializar = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::inicializar`,
        typeArguments:[],
        functionArguments:[],
      }
    })
    console.log(result)
  }

  const addDependencia = async () =>{ 
    console.log(dependencia)
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::add_dependencia`,
        typeArguments : [],
        functionArguments : [account.address,dependencia.nombreDependencia,dependencia.direccionDependencia,dependencia.telDependencia,dependencia.correoDependencia,dependencia.idDependencia],
      }
    })
    console.log(result)
    setDependencia({
      nombreDependencia:'',
      direccionDependencia:'',
      telDependencia:'',
      correoDependencia:'',
      idDependencia:0,
    });
    setMessage("La dependencia ha sido creada con éxito")
  }

  const addEnlace = async () =>{
    console.log(enlace)
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::add_enlace`,
        typeArguments : [],
        functionArguments : [account.address,enlace.nombreEnlace,enlace.cargoEnlace,enlace.idDependenciaEnlace,enlace.correoEnlace,enlace.idEnlace],
      }
    })
    console.log(result)
    setEnlace({
      nombreEnlace : '',
      cargoEnlace : '', 
      idDependencia : 0,
      correoEnlace : '',
      idEnlace:0,
    });
    setMessage("El enlace ha sido creado con éxito")
  }

  const addSolicitud = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::add_Solicitud`,
        typeArguments : [],
      functionArguments : [account.address,solicitud.solicitante,solicitud.correoSolicitud,solicitud.idDependenciaSolicitud,solicitud.fechaSolicitud,solicitud.atendido,solicitud.idSolicitud],
      }
    })
    console.log(result)
    setSolicitud({
      solicitante : '',
      correoSolicitud : '',
      idDependenciaSolicitud : 0,
      fechaSolicitud : '',
      atendido : false,
      idSolicitud : 0,
    });
    setMessage("La solicitud fue creada con éxito")
  }

  const addRespuesta = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::add_Respuesta`,
        typeArguments : [],
        functionArguments : [account.address,respuesta.idSolicitudRespuesta,respuesta.informacion,respuesta.anexos,respuesta.fechaRespuesta,respuesta.idRespuesta],
      }
    })
    console.log(result)
    setRespuesta({
      idSolicitudRespuesta: 0,
      informacion: '',
      anexos : '',
      fechaRespuesta  : '',
      responsable : "0x00",
      validacion : false,
      validador : "0x00",
      idRespuesta:0,
    });
    setMessage("La solicitud fue creada con éxito")
  }

  const getDependencia = async () =>{
    try{
        const result =  await surfClient.view.get_Dependencia({
        typeArguments : [],
        functionArguments : [account.address,dependencia.idDependencia],
        account: account,
     })

     setDependencia({
      nombreDependencia:result.nombre,
      direccionDependencia: result.direccion,
      telDependencia:result.telefono,
      correoDependencia:result.correo,
      idDependencia:dependencia.idDependencia,
    });

    console.log(`La dependencia ${dependencia.idDependencia} fue recuperada`)
    }catch
    {
      console.log(`Error la dependencia ${dependencia.idDependencia} no existe`)
    }
  }

  const getEnlace = async () =>{
    try{
    const result =  await surfClient.view.get_Enlace({
      typeArguments : [],
      functionArguments : [account.address,enlace.idEnlace],
      account: account,
    })
    setEnlace({
      nombreEnlace:result.nombre,
      cargoEnlace: result.cargo,
      idDependencia:result.idDependencia,
      correoEnlace:result.correo,
      idEnlace:enlace.idEnlace,
    });

    console.log(`El enlace ${enlace.idEnlace} fue recuperado`)
    }catch
    {
      console.log(`Error, el enlace ${enlace.idEnlace} no existe`)
    }
  }

  const getSolicitud = async () =>{
    try{
    const result =  await surfClient.view.get_Solicitud({
      typeArguments : [],
      functionArguments : [account.address,solicitud.idSolicitud],
      account: account,
    })
    setSolicitud({
      solicitante : result.solicitante,
      correoSolicitud : result.correo,
      idDependenciaSolicitud : result.idDependencia,
      fechaSolicitud : result.fecha,
      atendido : result.atendido,
      idSolicitud : solicitud.idSolicitud,
    });

    console.log(`La solicitud ${solicitud.idSolicitud} fue recuperada`)
    }catch
    {
      console.log(`Error, la solicitud ${respuesta.idSolicitud} no existe`)
    }
  }

  const getRespuesta = async () =>{
    try{
    const result =  await surfClient.view.get_Respuesta({
      typeArguments : [],
      functionArguments : [account.address,respuesta.idRespuesta],
      account: account,
    })
    setRespuesta({
      idSolicitudRespuesta: result.idSolicitud,
      informacion: result.informacion,
      anexos : result.anexos,
      fechaRespuesta  : result.fecha,
      responsable : result.responsable,
      validacion : result.validacion,
      validador : result.validador,
      idRespuesta:respuesta.idRespuesta,
    });

    console.log(`La respuesta ${respuesta.idRespuesta} fue recuperada`)
    }catch
    {
      console.log(`Error, la respuesta ${respuesta.idRespuesta} no existe`)
    }
  }

  const delDependencia = async () =>{

    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::erase_Dependencia`,
        typeArguments : [],
        functionArguments : [account.address,dependencia.idDependencia],
      }
    })
    console.log(result)
  }
  const delEnlace = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::erase_Enlace`,
        typeArguments : [],
        functionArguments : [account.address,enlace.idEnlace],
      }
    })

    console.log(result)
  }

  const delSolicitud = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::erase_Solicitud`,
        typeArguments : [],
        functionArguments : [account.address,solicitud.idSolicitud],
      }
    })

    console.log(result)
  }
  const delRespuesta = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::erase_Respuesta`,
        typeArguments : [],
        functionArguments : [account.address,respuesta.idRespuesta],
      }
    })

    console.log(result)
  }

  const actDepCorreo = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Dep_correo`,
        typeArguments : [],
        functionArguments : [account.address,dependencia.idDependencia,dependencia.correoDependencia],
      }
    })
    console.log(result)
  }
  const actDepDireccion = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Dep_direccion`,
        typeArguments : [],
        functionArguments : [account.address,dependencia.idDependencia,dependencia.direccionDependencia],
      }
    })

    console.log(result)
  }

  const actDepTelefono = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Dep_telefono`,
        typeArguments : [],
        functionArguments : [account.address,dependencia.idDependencia,dependencia.telDependencia],
      }
    })

    console.log(result)
  }

  const actEnlCargo = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Enl_cargo`,
        typeArguments : [],
        functionArguments : [account.address,enlace.idEnlace,enlace.cargoEnlace],
      }
    })

    console.log(result)
  }
  const actEnlCorreo = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Enl_correo`,
        typeArguments : [],
        functionArguments : [account.address,enlace.idEnlace,enlace.correoEnlace],
      }
    })

    console.log(result)
  }

  const actEnlNombre = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Enl_nombre`,
        ttypeArguments : [],
        functionArguments : [account.address,enlace.idEnlace,enlace.nombreEnlace],
      }
    })
    
    console.log(result)
  }

  const actResAnexos = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Res_anexos`,
        typeArguments : [],
      functionArguments : [account.address,respuesta.idRespuesta,respuesta.anexos],
      }
    })

    console.log(result)
  }
  const actResFecha = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Res_fecha`,
        typeArguments : [],
      functionArguments : [account.address,respuesta.idRespuesta,respuesta.fechaRespuesta],
      }
    })

    console.log(result)
  }

  const actResInformacion = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Res_informacion`,
        typeArguments : [],
        functionArguments : [account.address,respuesta.idRespuesta,respuesta.informacion],
      }
    })

    console.log(result)
  }
  const actResValidado = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Res_validado`,
        typeArguments : [],
        functionArguments : [account.address,respuesta.idRespuesta,respuesta.validacion],
      }
    })

    console.log(result)
  }

  const actSolAtendido = async () =>{
    const result=await signAndSubmitTransaction({
      sender:account.address,
      data:{
        function:`${CONTRACT}::transChain::upd_Sol_atendido`,
        typeArguments : [],
        functionArguments : [account.address,solicitud.idSolicitud,solicitud.atendido],
      }
    })

    console.log(result)
  }

  const connexionWallet = async () => {
    if (connected){
      await disconnect();
    } else{
      await connect("Petra");
    }
  }

  return (
    <div className="AppFront.1">
      <table>
        <tbody>
        <tr>
          <td>
            {
              connected? `Cuenta Conectada: ${account?.address}`:"Ninguna"
              }
          </td>
          </tr>
          <tr>
          <td>
            <button onClick={connexionWallet}>{connected? "Desconectar":"Conectar"}</button>
          </td>
        </tr>
      </tbody>
      </table>
      <table>
        <tbody>
        <tr>Acciones para inicializar y crear elementos</tr>
        <tr></tr>
        <tr>
          <td>
            <button onClick={inicializar}>Inicializar</button>
          </td>
          <td>
            <button onClick={addDependencia}>Añadir Dependencia</button>
          </td>
          <td>
            <button onClick={addEnlace}>Añadir Enlace</button>
          </td>
          <td>
            <button onClick={addSolicitud}>Añadir Solicitud</button>
          </td>
          <td>
            <button onClick={addRespuesta}>Añadir Respuesta</button>
          </td>
        </tr>
        <tr></tr>
        <tr>Acciones para lectura de los datos creados en el blockchain</tr>
        <tr></tr>
        <tr>
          <td>
            <button onClick={getDependencia}>Obtener Dependencia</button>
          </td>
          <td>
            <button onClick={getEnlace}>Obtener Enlace</button>
          </td>
          <td>
            <button onClick={getSolicitud}>Obtener Solicitud</button>
          </td>
          <td>
            <button onClick={getRespuesta}>Obtener Respuesta</button>
          </td>
        </tr>
        <tr></tr>
        <tr>Acciones para borrar información del blockchain</tr>
        <tr></tr>
        <tr>
          <td>
            <button onClick={delDependencia}>Borrar Dependencia</button>
          </td>
          <td>
            <button onClick={delEnlace}>Borrar Enlace</button>
          </td>
          <td>
            <button onClick={delSolicitud}>Borrar Solicitud</button>
          </td>
          <td>
            <button onClick={delRespuesta}>Borrar Respuesta</button>
          </td>
        </tr>
        <tr></tr>
        <tr>Acciones para actualizar información en el blockchain</tr>
        <tr></tr>
        <tr>
          <td>
            <button onClick={actDepCorreo}>Actualizar Correo de Dependencia</button>
          </td>
          <td>
            <button onClick={actDepDireccion}>Actualizar Dirección de la Dependencia</button>
          </td>
          <td>
            <button onClick={actDepTelefono}>Actualizar Teléfono de la Dependencia</button>
          </td>
          <td>
            <button onClick={actEnlCargo}>Actualizar Cargo del Enlace</button>
          </td>
          <td>
            <button onClick={actEnlCorreo}>Actualizar Correo del Enlace</button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={actEnlNombre}>Actualizar Nombre del Enlace</button>
          </td>
          <td>
           <button onClick={actResAnexos}>Actualizar anexos de la Respuesta</button>
          </td>
          <td>
            <button onClick={actResFecha}>Acualizar fecha de la Respuesta</button>
          </td>
          <td>
            <button onClick={actResInformacion}>Actualizar Información de la Respuesta</button>
          </td>
          <td>
            <button onClick={actResValidado}>Validar Respuesta</button>
          </td>
          <td>
            <button onClick={actSolAtendido}>Solicitud Atendida</button>
          </td>
        </tr>
        </tbody>
      </table> 
      <table>
        <thead>  Entrada/Salida de campos  </thead>
        <tbody>
          <tr>
            <td>
              <h2>
                Dependencia
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                <label htmlFor="idDependencia"># Dependencia</label>
                <input value={dependencia.idDependencia} type="number" name="idDependencia" id="idDependencia" onChange={handleInputDependenciaChange}/>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="nombreDependencia">Dependencia</label>
              <input value={dependencia.nombreDependencia} type="text" name="nombreDependencia" id="nombreDependencia" onChange={handleInputDependenciaChange}/>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="telDependencia">Telefono</label>
                <input value={dependencia.telDependencia} type="text" name="telDependencia" id="telDependencia" onChange={handleInputDependenciaChange}/>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="correoDependencia">Correo</label>
                <input value={dependencia.correoDependencia} type="text" name="correoDependencia" id="correoDependencia" onChange={handleInputDependenciaChange}/>
              </h2>
            </td>
            <td>
            <h2>
                <label htmlFor="direccionDependencia">Dirección</label>
                <input value={dependencia.direccionDependencia} type="text" name="direccionDependencia" id="direccionDependencia" onChange={handleInputDependenciaChange}/>
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                Enlace
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                <label htmlFor="idEnlace"># Enlace</label>
                <input value={enlace.idEnlace} type="number" name="idEnlace" id="idEnlace" onChange={handleInputEnlaceChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="nombreEnlace">Nombre</label>
              <input value={enlace.nombreEnlace} type="text" name="nombreEnlace" id="nombreEnlace" onChange={handleInputEnlaceChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="idDependenciaEnlace"># Dependencia</label>
                <input value={enlace.idDependenciaEnlace} type="number" name="idDependenciaEnlace" id="idDependenciaEnlace" onChange={handleInputEnlaceChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="correoEnlace">Correo</label>
                <input value={enlace.correoEnlace} type="text" name="correoEnlace" id="correoEnlace" onChange={handleInputEnlaceChange}></input>
              </h2>
            </td>
            <td>
            <h2>
                <label htmlFor="cargoEnlace">Cargo</label>
                <input value={enlace.cargoEnlace} type="text" name="cargoEnlace" id="cargoEnlace" onChange={handleInputEnlaceChange}></input>
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                Solicitud
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                <label htmlFor="idSolicitud"># Solicitud</label>
                <input value={solicitud.idSolicitud} type="number" name="idSolicitud" id="idSolicitud" onChange={handleInputSolicitudChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="solicitante">Solicitante</label>
              <input value={solicitud.solicitante} type="text" name="solicitante" id="solicitante" onChange={handleInputSolicitudChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="correoSolicitud">Solicitud</label>
              <input value={solicitud.correoSolicitud} type="text" name="correoSolicitud" id="correoSolicitud" onChange={handleInputSolicitudChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="idDependenciaSolicitud"># Dependencia</label>
                <input value={solicitud.idDependenciaSolicitud} type="number" name="idDependenciaSolicitud" id="idDependenciaSolicitud" onChange={handleInputSolicitudChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="atendido">Atendido? <input value={solicitud.atendido} type="checkbox"name="atendido" id="atendido" onChange={handleInputSolicitudChange}></input></label>
              </h2>
            </td>
            </tr>
            <tr>
            <td>
              <h2>
                <label htmlFor="fechaSolicitud">Fecha de solicitud</label>
                <input value={solicitud.fechaSolicitud} type="date" name="fechaSolicitud" id="fechaSolicitud" onChange={handleInputSolicitudChange}></input>
              </h2>
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            </tr>
          <tr>
            <td>
              <h2>
                Respuesta
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <h2>
                <label htmlFor="idRespuesta"># Respuesta</label>
                <input value={respuesta.idRespuesta} type="number" name="idRespuesta" id="idRespuesta"  onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="informacion">Respuesta</label>
              <input value={respuesta.informacion} type="text" name="informacion" id="informacion" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="anexos">Anexos</label>
              <input value={respuesta.anexos} type="text" name="anexos" id="anexos" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="fechaRespuesta">Fecha de atención</label>
                <input value={respuesta.fechaRespuesta} type="date" name="fechaRespuesta" id="fechaRespuesta" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
              <h2>
                <label htmlFor="responsable">Responsable</label>
                <input value={respuesta.responsable} type="text" name="responsable" id="responsable" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            </tr>
            <tr>
            <td>
              <h2>
                <label htmlFor="validador">Validador</label>
                <input value={respuesta.validador} type="text" name="validador" id="validador" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
              <h2>
              <label htmlFor="validacion">Validado? <input value={respuesta.validacion} type="checkbox"name="validacion" id="validacion" onChange={handleInputRespuestaChange}></input></label>
              </h2>
            </td>
            <td>
            <h2>
                <label htmlFor="idSolicitudRespuesta">Solicitud</label>
                <input value={respuesta.idSolicitudRespuesta} type="number" name="idSolicitudRespuesta" id="idSolicitudRespuesta" onChange={handleInputRespuestaChange}></input>
              </h2>
            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
            </td>
            </tr>
        </tbody>
      </table>      
    </div>

  );
}

export default AppFront;
