"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const cors_1 = __importDefault(require("cors"));
// criamos um arquivo para conter só a constante de conexão do oracle. com isso deixamos o código mais limpo por aqui
const OracleConnAtribs_1 = require("./OracleConnAtribs");
// conversores para facilitar o trabalho de conversão dos resultados Oracle para vetores de tipos nossos.
const Conversores_1 = require("./Conversores");
const Conversores_2 = require("./Conversores");
const Conversores_3 = require("./Conversores");
const Conversores_4 = require("./Conversores");
const Conversores_5 = require("./Conversores");
const Conversores_6 = require("./Conversores");
const Conversores_7 = require("./Conversores");
// validadores para facilitar o trabalho de validação.
const Validadores_1 = require("./Validadores");
const Validadores_2 = require("./Validadores");
const Validadores_3 = require("./Validadores");
const Validadores_4 = require("./Validadores");
const Validadores_5 = require("./Validadores");
// preparar o servidor web de backend na porta 3000
const app = (0, express_1.default)();
const port = 3000;
// preparar o servidor para dialogar no padrao JSON 
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Acertando a saída dos registros oracle em array puro javascript.
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
app.put("/AlteraStatusAssento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
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
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const resAlter = yield connection.execute(cmdAlterAssento, dados);
        console.log(cmdAlterAssento);
        console.log(resAlter);
        console.log(dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        const rowsAltered = resAlter.rowsAffected;
        if (rowsAltered !== undefined && rowsAltered === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave alterada.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/BuscaAssentosGeral", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
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
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_7.rowsToAssentosGeral)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/BuscaAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        const resultadoConsulta = `
    SELECT idAeronave FROM aeronave
    WHERE modelo = :1
    `;
        const dados = [req.query.modelo];
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_1.rowsToAeronaves)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/StatusAssento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        const resultadoConsulta = `
    SELECT statusAssento FROM aeronave_assento
    WHERE idaeronave = :1 AND idassento = :2
    `;
        const dados = [req.query.idAeronave, req.query.idAssento];
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_6.rowsToStatusAssento)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/BuscaVooId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
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
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_5.rowsToDado)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/BuscaVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
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
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_5.rowsToDado)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/BuscaVoo2", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
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
        let resSelect = yield connection.execute(resultadoConsulta, dados);
        console.log(dados);
        console.log(resultadoConsulta);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        console.log(resSelect);
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_5.rowsToDado)(resSelect.rows));
        console.log(cr.payload);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AERONAVE`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_1.rowsToAeronaves)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero = req.body;
    console.log(aero);
    // antes de prosseguir, vamos validar a aeronave!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAero = `INSERT INTO AERONAVE 
      (IDAERONAVE, MODELO, FABRICANTE, ANOFABRICACAO, QTDASSENTOS)
      VALUES
      (:1, :2, :3, :4, :5)`;
            const dados = [aero.idAeronave, aero.modeloAeronave, aero.fabricanteAeronave, aero.anoFabricacao, aero.qtdAssento];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeronave inserida.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.put("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero = req.body;
    console.log(aero);
    // antes de prosseguir, vamos validar a aeronave!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdAlterAero = `UPDATE AERONAVE SET MODELO = :1, FABRICANTE = :2, ANOFABRICACAO = :3, QTDASSENTOS = :4 WHERE IDAERONAVE = :5`;
            const dados = [aero.modeloAeronave, aero.fabricanteAeronave, aero.anoFabricacao, aero.qtdAssento, aero.idAeronave];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdAlterAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeronave alterada.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAero = `DELETE AERONAVE WHERE IDAERONAVE = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave excluída.";
        }
        else {
            cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.get("/Aeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AEROPORTO`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_2.rowsToAeroportos)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/Aeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero = req.body;
    console.log(aero);
    // antes de prosseguir, vamos validar o aeroporto!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_2.aeroportoValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAero = `INSERT INTO AEROPORTO 
        (IDAEROPORTO, NOMEAEROPORTO, AERONAVE)
        VALUES
        (:1, :2, :3)`;
            const dados = [aero.idAeroporto, aero.nomeAeroporto, aero.idAeronave];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeroporto inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.put("/Aeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero = req.body;
    console.log(aero);
    // antes de prosseguir, vamos validar o Aeroporto!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_2.aeroportoValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdAlterAero = `UPDATE AEROPORTO SET NOMEAEROPORTO = :1, AERONAVE = :2 WHERE IDAEROPORTO = :3`;
            const dados = [aero.nomeAeroporto, aero.idAeronave, aero.idAeroporto];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdAlterAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeroporto alterado.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/Aeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAero = `DELETE AEROPORTO WHERE IDAEROPORTO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto excluído.";
        }
        else {
            cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.get("/Voos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`
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
        cr.payload = ((0, Conversores_5.rowsToDado)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/Voos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const voo = req.body;
    console.log(voo);
    // antes de prosseguir, vamos validar o voo!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_3.vooValida)(voo);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertVoo = `INSERT INTO VOO 
        (IDVOO, DATASAIDA, DATACHEGADA, VALOR, AERONAVE, TRECHO)
        VALUES
        (:1, TO_DATE(:2, 'dd-mm-yyyy'), TO_DATE(:3, 'dd-mm-yyyy'), :4, :5, :6)`;
            const dados = [voo.idVoo, voo.dataSaida, voo.dataChegada, voo.valor, voo.idAeronave, voo.trecho];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertVoo, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Voo inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.put("/Voos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const voo = req.body;
    console.log(voo);
    // antes de prosseguir, vamos validar a aeronave!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_3.vooValida)(voo);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdAlterVoo = `UPDATE VOO SET DATASAIDA = TO_DATE(:1, 'dd-mm-yyyy'), DATACHEGADA = TO_DATE(:2, 'dd-mm-yyyy'), VALOR = :3, AERONAVE = :4, TRECHO = :5 WHERE IDVOO = :6`;
            const dados = [voo.dataSaida, voo.dataChegada, voo.valor, voo.idAeronave, voo.trecho, voo.idVoo];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdAlterVoo, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Voo alterado.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/Voos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteVoo = `DELETE FROM VOO WHERE IDVOO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteVoo, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo excluído.";
        }
        else {
            cr.message = "Voo não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.get("/Cidades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM CIDADE`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        cr.payload = ((0, Conversores_3.rowsToCidades)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/Cidades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const cidade = req.body;
    console.log(cidade);
    // antes de prosseguir, vamos validar o voo!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_4.cidadeValida)(cidade);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertCidade = `INSERT INTO CIDADE 
        (IDCIDADE, NOMECIDADE, AEROPORTO)
        VALUES
        (:1, :2, :3)`;
            const dados = [cidade.idCidade, cidade.nomeCidade, cidade.idAeroporto];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertCidade, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Cidade inserida.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.put("/Cidades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const cid = req.body;
    console.log(cid);
    // antes de prosseguir, vamos validar a Cidade!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_4.cidadeValida)(cid);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdAlterCidade = `UPDATE CIDADE SET NOMECIDADE = :1, AEROPORTO = :2 WHERE IDCIDADE = :3`;
            const dados = [cid.nomeCidade, cid.idAeroporto, cid.idCidade];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdAlterCidade, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Cidade alterada.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/Cidades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteCidade = `DELETE CIDADE WHERE IDCIDADE = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteCidade, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Cidade excluída.";
        }
        else {
            cr.message = "Cidade não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.get("/Trechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`
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
        cr.payload = ((0, Conversores_4.rowsToTrecho)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/Trechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const trecho = req.body;
    console.log(trecho);
    // antes de prosseguir, vamos validar o trecho!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_5.trechoValida)(trecho);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertTrecho = `INSERT INTO TRECHO 
        (IDTRECHO, CIDADEORIGEM, CIDADEDESTINO)
        VALUES
        (:1, :2, :3)`;
            const dados = [trecho.idTrecho, trecho.idCidadeOrigem, trecho.idCidadeDestino];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertTrecho, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Trecho inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.put("/Trechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const trecho = req.body;
    console.log(trecho);
    // antes de prosseguir, vamos validar a Cidade!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_5.trechoValida)(trecho);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdAlterTrecho = `UPDATE TRECHO SET CIDADEORIGEM = :1, CIDADEDESTINO = :2 WHERE IDTRECHO = :3`;
            const dados = [trecho.idCidadeOrigem, trecho.idCidadeDestino, trecho.idTrecho];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdAlterTrecho, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Trecho alterado.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/Trechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteTrecho = `DELETE FROM TRECHO WHERE IDTRECHO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteTrecho, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluído.";
        }
        else {
            cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
