/***
 * Versão melhorada do backend. 
 * 
 * 1 - externalização da constante oraConnAttribs (pois é usada em todos os serviços);
 * O processo de externalizar é tirar aquela constante de dentro de cada serviço e colocá-la na área "global"
 * 
 * 2 - criação de um tipo estruturado chamado aeronave.
 * 
 * 3 - criação de uma função para validar se os dados da aeronave existem.
 * 
 * 4 - retorno correto do array em JSON para representar as AERONAVES cadastradas. 
 * 
 */
// recursos/modulos necessarios.
import express from "express";
import oracledb from "oracledb";
import cors from "cors";


// aqui vamos importar nossos tipos para organizar melhor (estao em arquivos .ts separados)
import { CustomResponse } from "./CustomResponse";
import { Aeronave } from "./Aeronave";
import { Aeroporto } from "./Aeroporto";
import { Voo } from "./Voo";
import { Cidade } from "./Cidade";
import { Trecho } from "./Trecho";
import { Dado } from "./Dados";
import { AssentoGeral } from "./AssentosGeral";

// criamos um arquivo para conter só a constante de conexão do oracle. com isso deixamos o código mais limpo por aqui
import { oraConnAttribs } from "./OracleConnAtribs";

// conversores para facilitar o trabalho de conversão dos resultados Oracle para vetores de tipos nossos.
import { rowsToAeronaves } from "./Conversores";
import { rowsToAeroportos } from "./Conversores";
import { rowsToVoos } from "./Conversores";
import { rowsToCidades } from "./Conversores";
import { rowsToTrecho } from "./Conversores";
import { rowsToDado } from "./Conversores";
import { rowsToStatusAssento } from "./Conversores";
import { rowsToAssentosGeral } from "./Conversores";

// validadores para facilitar o trabalho de validação.
import { aeronaveValida } from "./Validadores";
import { aeroportoValida } from "./Validadores";
import { vooValida } from "./Validadores";
import { cidadeValida } from "./Validadores";
import { trechoValida} from "./Validadores";

// preparar o servidor web de backend na porta 3000
const app = express();
const port = 3000;
// preparar o servidor para dialogar no padrao JSON 
app.use(express.json());
app.use(cors());

// Acertando a saída dos registros oracle em array puro javascript.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;



app.put("/AlteraStatusAssento", async (req, res) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
  // chega na requisição para um tipo nosso!
  const assento = req.body.assentoSelecionado;
  const idaero = req.body.idAeronave;
  console.log(assento);
  console.log(idaero);

  let connection;
  try {
      const cmdAlterAssento = `
      UPDATE aeronave_assento
      SET statusassento = 'O'
      WHERE
          idaeronave = :1 AND idassento = :2
      `;
      var dados = [idaero, assento];

      connection = await oracledb.getConnection(oraConnAttribs);
      const resAlter = await connection.execute(cmdAlterAssento, dados);
      console.log(cmdAlterAssento);
      console.log(resAlter);
      console.log(dados);

      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();

      const rowsAltered = resAlter.rowsAffected;
      if (rowsAltered !== undefined &&  rowsAltered === 1) {
        cr.status = "SUCCESS";
        cr.message = "Aeronave alterada.";
      }


  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/BuscaAssentosGeral", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
    SELECT *
    FROM AERONAVE_ASSENTO
    WHERE idAeronave = :1
    ORDER BY 
      SUBSTR(idAssento, 1, 1),
      TO_NUMBER(SUBSTR(idAssento, 2))
    `;
    const dados = [req.query.idAeronave];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToAssentosGeral(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/BuscaAeronave", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
    SELECT idAeronave FROM aeronave
    WHERE modelo = :1
    `;
    const dados = [req.query.modelo];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToAeronaves(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/StatusAssento", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
    SELECT statusAssento FROM aeronave_assento
    WHERE idaeronave = :1 AND idassento = :2
    `;
    const dados = [req.query.idAeronave, req.query.idAssento];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToStatusAssento(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/BuscaVooId", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
      SELECT
      VOO.idVoo,
      TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') AS dataSaida,
      TO_CHAR(VOO.dataChegada, 'dd/mm/yyyy') AS dataChegada,
      VOO.valor,
      AERONAVE.modelo AS modeloAeronave,
      CIDADE_ORIGEM.nomeCidade AS cidadeOrigem,
      CIDADE_DESTINO.nomeCidade AS cidadeDestino
    FROM
      VOO
      INNER JOIN AERONAVE ON VOO.aeronave = AERONAVE.idAeronave
      INNER JOIN TRECHO ON VOO.trecho = TRECHO.idTrecho
      INNER JOIN CIDADE CIDADE_ORIGEM ON TRECHO.cidadeOrigem = CIDADE_ORIGEM.idCidade
      INNER JOIN CIDADE CIDADE_DESTINO ON TRECHO.cidadeDestino = CIDADE_DESTINO.idCidade
    WHERE
      VOO.idVoo = :1
    `;
    const dados = [req.query.idVoo];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToDado(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/BuscaVoo", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
      SELECT
      VOO.idVoo,
      TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') AS dataSaida,
      TO_CHAR(VOO.dataChegada, 'dd/mm/yyyy') AS dataChegada,
      VOO.valor,
      AERONAVE.modelo AS modeloAeronave,
      CIDADE_ORIGEM.nomeCidade AS cidadeOrigem,
      CIDADE_DESTINO.nomeCidade AS cidadeDestino
    FROM
      VOO
      INNER JOIN AERONAVE ON VOO.aeronave = AERONAVE.idAeronave
      INNER JOIN TRECHO ON VOO.trecho = TRECHO.idTrecho
      INNER JOIN CIDADE CIDADE_ORIGEM ON TRECHO.cidadeOrigem = CIDADE_ORIGEM.idCidade
      INNER JOIN CIDADE CIDADE_DESTINO ON TRECHO.cidadeDestino = CIDADE_DESTINO.idCidade
    WHERE
      TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') = :1 AND 
      CIDADE_ORIGEM.nomeCidade = :2 AND CIDADE_DESTINO.nomeCidade = :3
    `;
    const dados = [req.query.dataSaida, req.query.origem, req.query.destino];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToDado(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/BuscaVoo2", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;

  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    const resultadoConsulta = `
      SELECT
      VOO.idVoo,
      TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') AS dataSaida,
      TO_CHAR(VOO.dataChegada, 'dd/mm/yyyy') AS dataChegada,
      VOO.valor,
      AERONAVE.modelo AS modeloAeronave,
      CIDADE_ORIGEM.nomeCidade AS cidadeOrigem,
      CIDADE_DESTINO.nomeCidade AS cidadeDestino
    FROM
      VOO
      INNER JOIN AERONAVE ON VOO.aeronave = AERONAVE.idAeronave
      INNER JOIN TRECHO ON VOO.trecho = TRECHO.idTrecho
      INNER JOIN CIDADE CIDADE_ORIGEM ON TRECHO.cidadeOrigem = CIDADE_ORIGEM.idCidade
      INNER JOIN CIDADE CIDADE_DESTINO ON TRECHO.cidadeDestino = CIDADE_DESTINO.idCidade
    WHERE
      TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') = :1 AND TO_CHAR(VOO.dataChegada, 'dd/mm/yyyy') = :2 AND 
      CIDADE_ORIGEM.nomeCidade = :3 AND CIDADE_DESTINO.nomeCidade = :4
    `;
    const dados = [req.query.dataSaida, req.query.dataChegada, req.query.origem, req.query.destino];

    let resSelect = await connection.execute(resultadoConsulta, dados);
    
    console.log(dados);
    console.log(resultadoConsulta);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    console.log(resSelect);
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToDado(resSelect.rows));
    console.log(cr.payload);

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);
  }
});


app.get("/Aeronaves", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVE`); 
  
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    cr.payload = (rowsToAeronaves(resultadoConsulta.rows));

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.post("/Aeronaves", async(req,res)=>{
  
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
  // chega na requisição para um tipo nosso!
  const aero: Aeronave = req.body as Aeronave;
  console.log(aero);

  // antes de prosseguir, vamos validar a aeronave!
  // se não for válida já descartamos.
  let [valida, mensagem] = aeronaveValida(aero);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  } else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdInsertAero = `INSERT INTO AERONAVE 
      (IDAERONAVE, MODELO, FABRICANTE, ANOFABRICACAO, QTDASSENTOS)
      VALUES
      (:1, :2, :3, :4, :5)`
      const dados = [aero.idAeronave, aero.modeloAeronave, aero.fabricanteAeronave, aero.anoFabricacao, aero.qtdAssento];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave inserida.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

app.put("/Aeronaves", async(req,res)=>{
  
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
  // chega na requisição para um tipo nosso!
  const aero: Aeronave = req.body as Aeronave;
  console.log(aero);

  // antes de prosseguir, vamos validar a aeronave!
  // se não for válida já descartamos.
  let [valida, mensagem] = aeronaveValida(aero);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  } else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdAlterAero = `UPDATE AERONAVE SET MODELO = :1, FABRICANTE = :2, ANOFABRICACAO = :3, QTDASSENTOS = :4 WHERE IDAERONAVE = :5`;
      const dados = [aero.modeloAeronave, aero.fabricanteAeronave, aero.anoFabricacao, aero.qtdAssento, aero.idAeronave];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdAlterAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave alterada.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

  app.delete("/Aeronaves", async(req,res)=>{
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo as number;
   
    console.log('Codigo recebido: ' + codigo);
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // conectando 
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
      const cmdDeleteAero = `DELETE AERONAVE WHERE IDAERONAVE = :1`
      const dados = [codigo];
  
      let resDelete = await connection.execute(cmdDeleteAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
      
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsDeleted = resDelete.rowsAffected
      if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave excluída.";
      }else{
        cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // fechando a conexao
      if(connection!==undefined)
        await connection.close();
  
      // devolvendo a resposta da requisição.
      res.send(cr);  
    }
  });


  app.get("/Aeroportos", async(req,res)=>{

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
  
      // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
      // não mais um array dentro de array.
      let resultadoConsulta = await connection.execute(`SELECT * FROM AEROPORTO`); 
    
      cr.status = "SUCCESS"; 
      cr.message = "Dados obtidos";
      // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
      cr.payload = (rowsToAeroportos(resultadoConsulta.rows));
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      if(connection !== undefined){
        await connection.close();
      }
      res.send(cr);  
    }
  });

  app.post("/Aeroportos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero: Aeroporto = req.body as Aeroporto;
    console.log(aero);
  
    // antes de prosseguir, vamos validar o aeroporto!
    // se não for válida já descartamos.
    let [valida, mensagem] = aeroportoValida(aero);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO AEROPORTO 
        (IDAEROPORTO, NOMEAEROPORTO, AERONAVE)
        VALUES
        (:1, :2, :3)`
        const dados = [aero.idAeroporto, aero.nomeAeroporto, aero.idAeronave];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Aeroporto inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.put("/Aeroportos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero: Aeroporto = req.body as Aeroporto;
    console.log(aero);
  
    // antes de prosseguir, vamos validar o Aeroporto!
    // se não for válida já descartamos.
    let [valida, mensagem] = aeroportoValida(aero);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdAlterAero = `UPDATE AEROPORTO SET NOMEAEROPORTO = :1, AERONAVE = :2 WHERE IDAEROPORTO = :3`;
        const dados = [aero.nomeAeroporto, aero.idAeronave, aero.idAeroporto];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdAlterAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Aeroporto alterado.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.delete("/Aeroportos", async(req,res)=>{
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo as number;
   
    console.log('Codigo recebido: ' + codigo);
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // conectando 
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
      const cmdDeleteAero = `DELETE AEROPORTO WHERE IDAEROPORTO = :1`
      const dados = [codigo];
  
      let resDelete = await connection.execute(cmdDeleteAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
      
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsDeleted = resDelete.rowsAffected
      if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeroporto excluído.";
      }else{
        cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // fechando a conexao
      if(connection!==undefined)
        await connection.close();
  
      // devolvendo a resposta da requisição.
      res.send(cr);  
    }
  });

  app.get("/Voos", async(req,res)=>{

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);

      // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
      // não mais um array dentro de array.
      let resultadoConsulta = await connection.execute(`
        SELECT
        VOO.idVoo,
        TO_CHAR(VOO.dataSaida, 'dd/mm/yyyy') AS dataSaida,
        TO_CHAR(VOO.dataChegada, 'dd/mm/yyyy') AS dataChegada,
        VOO.valor,
        AERONAVE.modelo AS modeloAeronave,
        CIDADE_ORIGEM.nomeCidade AS cidadeOrigem,
        CIDADE_DESTINO.nomeCidade AS cidadeDestino
      FROM
        VOO
        INNER JOIN AERONAVE ON VOO.aeronave = AERONAVE.idAeronave
        INNER JOIN TRECHO ON VOO.trecho = TRECHO.idTrecho
        INNER JOIN CIDADE CIDADE_ORIGEM ON TRECHO.cidadeOrigem = CIDADE_ORIGEM.idCidade
        INNER JOIN CIDADE CIDADE_DESTINO ON TRECHO.cidadeDestino = CIDADE_DESTINO.idCidade
      `);
      
      console.log(resultadoConsulta);
      cr.status = "SUCCESS";
      cr.message = "Dados obtidos";
      // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
      cr.payload = (rowsToDado(resultadoConsulta.rows));

    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      if(connection !== undefined){
        await connection.close();
      }
      res.send(cr);
    }
  });

  app.post("/Voos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const voo: Voo = req.body as Voo;
    console.log(voo);
  
    // antes de prosseguir, vamos validar o voo!
    // se não for válida já descartamos.
    let [valida, mensagem] = vooValida(voo);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertVoo = `INSERT INTO VOO 
        (IDVOO, DATASAIDA, DATACHEGADA, VALOR, AERONAVE, TRECHO)
        VALUES
        (:1, TO_DATE(:2, 'dd-mm-yyyy'), TO_DATE(:3, 'dd-mm-yyyy'), :4, :5, :6)`
        const dados = [voo.idVoo, voo.dataSaida, voo.dataChegada, voo.valor, voo.idAeronave, voo.trecho];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertVoo, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Voo inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.put("/Voos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const voo: Voo = req.body as Voo;
    console.log(voo);
  
    // antes de prosseguir, vamos validar a aeronave!
    // se não for válida já descartamos.
    let [valida, mensagem] = vooValida(voo);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdAlterVoo = `UPDATE VOO SET DATASAIDA = TO_DATE(:1, 'dd-mm-yyyy'), DATACHEGADA = TO_DATE(:2, 'dd-mm-yyyy'), VALOR = :3, AERONAVE = :4, TRECHO = :5 WHERE IDVOO = :6`;
        const dados = [voo.dataSaida, voo.dataChegada, voo.valor, voo.idAeronave, voo.trecho, voo.idVoo];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdAlterVoo, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Voo alterado.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.delete("/Voos", async(req,res)=>{
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo as number;
   
    console.log('Codigo recebido: ' + codigo);
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // conectando 
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
      const cmdDeleteVoo = `DELETE FROM VOO WHERE IDVOO = :1`
      const dados = [codigo];
  
      let resDelete = await connection.execute(cmdDeleteVoo, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
      
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsDeleted = resDelete.rowsAffected
      if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Voo excluído.";
      }else{
        cr.message = "Voo não excluído. Verifique se o código informado está correto.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // fechando a conexao
      if(connection!==undefined)
        await connection.close();
  
      // devolvendo a resposta da requisição.
      res.send(cr);  
    }
  });

  app.get("/Cidades", async(req,res)=>{

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
  
      // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
      // não mais um array dentro de array.
      let resultadoConsulta = await connection.execute(`SELECT * FROM CIDADE`); 
    
      cr.status = "SUCCESS"; 
      cr.message = "Dados obtidos";
      // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
      cr.payload = (rowsToCidades(resultadoConsulta.rows));
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      if(connection !== undefined){
        await connection.close();
      }
      res.send(cr);  
    }
  });

  app.post("/Cidades", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const cidade: Cidade = req.body as Cidade;
    console.log(cidade);
  
    // antes de prosseguir, vamos validar o voo!
    // se não for válida já descartamos.
    let [valida, mensagem] = cidadeValida(cidade);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertCidade = `INSERT INTO CIDADE 
        (IDCIDADE, NOMECIDADE, AEROPORTO)
        VALUES
        (:1, :2, :3)`
        const dados = [cidade.idCidade, cidade.nomeCidade, cidade.idAeroporto];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertCidade, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Cidade inserida.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.put("/Cidades", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const cid: Cidade = req.body as Cidade;
    console.log(cid);
  
    // antes de prosseguir, vamos validar a Cidade!
    // se não for válida já descartamos.
    let [valida, mensagem] = cidadeValida(cid);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdAlterCidade = `UPDATE CIDADE SET NOMECIDADE = :1, AEROPORTO = :2 WHERE IDCIDADE = :3`;
        const dados = [cid.nomeCidade, cid.idAeroporto, cid.idCidade];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdAlterCidade, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Cidade alterada.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.delete("/Cidades", async(req,res)=>{
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo as number;
   
    console.log('Codigo recebido: ' + codigo);
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // conectando 
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
      const cmdDeleteCidade = `DELETE CIDADE WHERE IDCIDADE = :1`
      const dados = [codigo];
  
      let resDelete = await connection.execute(cmdDeleteCidade, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
      
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsDeleted = resDelete.rowsAffected
      if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Cidade excluída.";
      }else{
        cr.message = "Cidade não excluída. Verifique se o código informado está correto.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // fechando a conexao
      if(connection!==undefined)
        await connection.close();
  
      // devolvendo a resposta da requisição.
      res.send(cr);  
    }
  });

  app.get("/Trechos", async(req,res)=>{

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
  
      // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
      // não mais um array dentro de array.
      let resultadoConsulta = await connection.execute(`
        SELECT
          TRECHO.idTrecho,
          CIDADE_ORIGEM.nomeCidade AS cidadeOrigem,
          CIDADE_DESTINO.nomeCidade AS cidadeDestino
        FROM
          TRECHO
          INNER JOIN CIDADE CIDADE_ORIGEM ON TRECHO.cidadeOrigem = CIDADE_ORIGEM.idCidade
          INNER JOIN CIDADE CIDADE_DESTINO ON TRECHO.cidadeDestino = CIDADE_DESTINO.idCidade
      `);
  

      console.log(resultadoConsulta);
      cr.status = "SUCCESS"; 
      cr.message = "Trechos obtidos";
      // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
      cr.payload = (rowsToTrecho(resultadoConsulta.rows));
  
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      if(connection !== undefined){
        await connection.close();
      }
      res.send(cr);  
    }
  });

  app.post("/Trechos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const trecho: Trecho = req.body as Trecho;
    console.log(trecho);
  
    // antes de prosseguir, vamos validar o trecho!
    // se não for válida já descartamos.
    let [valida, mensagem] = trechoValida(trecho);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertTrecho = `INSERT INTO TRECHO 
        (IDTRECHO, CIDADEORIGEM, CIDADEDESTINO)
        VALUES
        (:1, :2, :3)`
        const dados = [trecho.idTrecho, trecho.idCidadeOrigem, trecho.idCidadeDestino];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertTrecho, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Trecho inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.put("/Trechos", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const trecho: Trecho = req.body as Trecho;
    console.log(trecho);
  
    // antes de prosseguir, vamos validar a Cidade!
    // se não for válida já descartamos.
    let [valida, mensagem] = trechoValida(trecho);
    if(!valida) {
      // já devolvemos a resposta com o erro e terminamos o serviço.
      cr.message = mensagem;
      res.send(cr);
    } else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdAlterTrecho = `UPDATE TRECHO SET CIDADEORIGEM = :1, CIDADEDESTINO = :2 WHERE IDTRECHO = :3`;
        const dados = [trecho.idCidadeOrigem, trecho.idCidadeDestino, trecho.idTrecho];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdAlterTrecho, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Trecho alterado.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
  });

  app.delete("/Trechos", async(req,res)=>{
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo as number;
   
    console.log('Codigo recebido: ' + codigo);
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // conectando 
    let connection;
    try{
      connection = await oracledb.getConnection(oraConnAttribs);
      const cmdDeleteTrecho = `DELETE FROM TRECHO WHERE IDTRECHO = :1`
      const dados = [codigo];
  
      let resDelete = await connection.execute(cmdDeleteTrecho, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
      
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsDeleted = resDelete.rowsAffected
      if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Trecho excluído.";
      }else{
        cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // fechando a conexao
      if(connection!==undefined)
        await connection.close();
  
      // devolvendo a resposta da requisição.
      res.send(cr);  
    }
  });

app.listen(port, ()=>{
    console.log("Servidor HTTP rodando...");
});