"use strict";
// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAssentosGeral = exports.rowsToStatusAssento = exports.rowsToDado = exports.rowsToTrecho = exports.rowsToCidades = exports.rowsToVoos = exports.rowsToAeroportos = exports.rowsToAeronaves = void 0;
function rowsToAeronaves(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeronave
    let aeronaves = [];
    let aeronave;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeronave = {
                idAeronave: registro.IDAERONAVE,
                modeloAeronave: registro.MODELO,
                fabricanteAeronave: registro.FABRICANTE,
                anoFabricacao: registro.ANOFABRICACAO,
                qtdAssento: registro.QTDASSENTOS,
            };
            // inserindo o novo Array convertido.
            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}
exports.rowsToAeronaves = rowsToAeronaves;
function rowsToAeroportos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let aeroportos = [];
    let aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeroporto = {
                idAeroporto: registro.IDAEROPORTO,
                nomeAeroporto: registro.NOMEAEROPORTO,
                idAeronave: registro.AERONAVE,
            };
            // inserindo o novo Array convertido.
            aeroportos.push(aeroporto);
        });
    }
    return aeroportos;
}
exports.rowsToAeroportos = rowsToAeroportos;
function rowsToVoos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Voo
    let voos = [];
    let voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            voo = {
                idVoo: registro.IDVOO,
                dataSaida: registro.DATASAIDA,
                dataChegada: registro.DATACHEGADA,
                valor: registro.VALOR,
                idAeronave: registro.AERONAVE,
                trecho: registro.TRECHO,
            };
            // inserindo o novo Array convertido.
            voos.push(voo);
        });
    }
    return voos;
}
exports.rowsToVoos = rowsToVoos;
function rowsToCidades(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Cidade
    let cidades = [];
    let cidade;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            cidade = {
                idCidade: registro.IDCIDADE,
                nomeCidade: registro.NOMECIDADE,
                idAeroporto: registro.AEROPORTO,
            };
            // inserindo o novo Array convertido.
            cidades.push(cidade);
        });
    }
    return cidades;
}
exports.rowsToCidades = rowsToCidades;
function rowsToTrecho(oracleRows) {
    let trechos = [];
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            const trecho = {
                idTrecho: registro.IDTRECHO,
                idCidadeOrigem: registro.CIDADEORIGEM,
                idCidadeDestino: registro.CIDADEDESTINO,
            };
            trechos.push(trecho);
        });
    }
    return trechos;
}
exports.rowsToTrecho = rowsToTrecho;
function rowsToDado(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Dado
    let dados = [];
    let dado;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            dado = {
                idVoo: registro.IDVOO,
                dataSaida: registro.DATASAIDA,
                dataChegada: registro.DATACHEGADA,
                valor: registro.VALOR,
                modelo: registro.MODELOAERONAVE,
                origem: registro.CIDADEORIGEM,
                destino: registro.CIDADEDESTINO,
            };
            // inserindo o novo Array convertido.
            dados.push(dado);
        });
    }
    return dados;
}
exports.rowsToDado = rowsToDado;
function rowsToStatusAssento(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de StatusAssento
    let statusAssentos = [];
    let statusAssento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            statusAssento = {
                charStatusAssento: registro.STATUSASSENTO,
            };
            // inserindo o novo Array convertido.
            statusAssentos.push(statusAssento);
        });
    }
    return statusAssentos;
}
exports.rowsToStatusAssento = rowsToStatusAssento;
function rowsToAssentosGeral(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de StatusAssento
    let Assentos = [];
    let Assento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            Assento = {
                idAeronave: registro.IDAERONAVE,
                idAssento: registro.IDASSENTO,
                Status: registro.STATUSASSENTO,
            };
            // inserindo o novo Array convertido.
            Assentos.push(Assento);
        });
    }
    return Assentos;
}
exports.rowsToAssentosGeral = rowsToAssentosGeral;
