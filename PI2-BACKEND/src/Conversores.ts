// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 

import { Aeronave } from "./Aeronave";
import { Aeroporto } from "./Aeroporto";
import { Voo } from "./Voo";
import { Cidade } from "./Cidade";
import { Trecho } from "./Trecho";
import { Dado } from "./Dados";
import { StatusAssento } from "./StatusAssento";
import { AssentoGeral } from "./AssentosGeral";

export function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let aeronaves: Array<Aeronave> = [];
  let aeronave;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeronave = {
        idAeronave: registro.IDAERONAVE,
        modeloAeronave: registro.MODELO,
        fabricanteAeronave: registro.FABRICANTE,
        anoFabricacao: registro.ANOFABRICACAO,
        qtdAssento: registro.QTDASSENTOS,
      } as Aeronave;

      // inserindo o novo Array convertido.
      aeronaves.push(aeronave);
    })
  }
  return aeronaves;
}

export function rowsToAeroportos(oracleRows: unknown[] | undefined) : Array<Aeroporto> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroporto
  let aeroportos: Array<Aeroporto> = [];
  let aeroporto;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeroporto = {
        idAeroporto: registro.IDAEROPORTO,
        nomeAeroporto: registro.NOMEAEROPORTO,
        idAeronave: registro.AERONAVE,
      } as Aeroporto;

      // inserindo o novo Array convertido.
      aeroportos.push(aeroporto);
    })
  }
  return aeroportos;
}

export function rowsToVoos(oracleRows: unknown[] | undefined) : Array<Voo> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Voo
  let voos: Array<Voo> = [];
  let voo;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      voo = {
        idVoo: registro.IDVOO,
        dataSaida: registro.DATASAIDA,
        dataChegada: registro.DATACHEGADA,
        valor: registro.VALOR,
        idAeronave: registro.AERONAVE,
        trecho: registro.TRECHO,
      } as Voo;

      // inserindo o novo Array convertido.
      voos.push(voo);
    })
  }
  return voos;
}

export function rowsToCidades(oracleRows: unknown[] | undefined) : Array<Cidade> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Cidade
  let cidades: Array<Cidade> = [];
  let cidade;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      cidade = {
        idCidade: registro.IDCIDADE,
        nomeCidade: registro.NOMECIDADE,
        idAeroporto: registro.AEROPORTO,
      } as Cidade;

      // inserindo o novo Array convertido.
      cidades.push(cidade);
    })
  }
  return cidades;
}

export function rowsToTrecho(oracleRows: Array<any> | undefined): Array<Trecho> {
  let trechos: Array<Trecho> = [];

  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      const trecho: Trecho = {
        idTrecho: registro.IDTRECHO,
        idCidadeOrigem: registro.CIDADEORIGEM,
        idCidadeDestino: registro.CIDADEDESTINO,
      };

      trechos.push(trecho);
    });
  }

  return trechos;
}

export function rowsToDado(oracleRows: unknown[] | undefined) : Array<Dado>{
  // vamos converter um array any (resultados do oracle)
  // em um array de Dado
  let dados: Array<Dado> = [];
  let dado;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      dado = {
        idVoo: registro.IDVOO,
        dataSaida: registro.DATASAIDA,
        dataChegada: registro.DATACHEGADA,
        valor: registro.VALOR,
        modelo: registro.MODELOAERONAVE,
        origem: registro.CIDADEORIGEM,
        destino: registro.CIDADEDESTINO,
      } as Dado;

      // inserindo o novo Array convertido.
      dados.push(dado);
    })
  }
  return dados;
}

export function rowsToStatusAssento(oracleRows: unknown[] | undefined) : Array<StatusAssento>{
  // vamos converter um array any (resultados do oracle)
  // em um array de StatusAssento
  let statusAssentos: Array<StatusAssento> = [];
  let statusAssento;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      statusAssento = {
        charStatusAssento: registro.STATUSASSENTO,
      } as StatusAssento;

      // inserindo o novo Array convertido.
      statusAssentos.push(statusAssento);
    })
  }
  return statusAssentos;
}

export function rowsToAssentosGeral(oracleRows: unknown[] | undefined) : Array<AssentoGeral>{
  // vamos converter um array any (resultados do oracle)
  // em um array de StatusAssento
  let Assentos: Array<AssentoGeral> = [];
  let Assento;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      Assento = {
        idAeronave: registro.IDAERONAVE,
        idAssento: registro.IDASSENTO,
        Status: registro.STATUSASSENTO,
      } as AssentoGeral;

      // inserindo o novo Array convertido.
      Assentos.push(Assento);
    })
  }
  return Assentos;
}