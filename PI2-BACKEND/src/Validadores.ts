import { Aeronave } from "./Aeronave";
import { Aeroporto } from "./Aeroporto";
import { Voo } from "./Voo";
import { Cidade } from "./Cidade";
import { Trecho } from "./Trecho";

// neste arquivo colocaremos TODAS as funções de validação para todo tipo de objeto. 

// diferentemente de outras linguagens, podemos fazer uma função
// que possa retornar ou um booleano, ou uma string ou um tipo não definido.
// para que isso? se retornar TRUE no final significa que deu tudo certo. 
// se retornar uma string será o código de erro.

export function aeronaveValida(aero: Aeronave) {

  let valida = false;
  let mensagem = "";

  if(aero.idAeronave === undefined){
    mensagem = "ID não informado";
  }

  if((aero.idAeronave !== undefined) && (aero.idAeronave < 1)){
    mensagem = "ID é inválido";
  }

  if(aero.fabricanteAeronave === undefined){
    mensagem = "Fabricante não informado";
  }

  if(aero.modeloAeronave === undefined){
    mensagem = "Modelo não informado.";
  }

  if(aero.qtdAssento === undefined){
    mensagem = "Total de assentos não informado";
  }

  if((aero.qtdAssento !== undefined) && (aero.qtdAssento < 100 || aero.qtdAssento > 1000)){
    mensagem = "Total de assentos é inválido";
  }

  if(aero.anoFabricacao === undefined){
    mensagem = "Ano de fabricação não informado";
  }

  if((aero.anoFabricacao!== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)){
    mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function aeroportoValida(aero: Aeroporto) {

  let valida = false;
  let mensagem = "";

  if(aero.idAeroporto === undefined){
    mensagem = "ID não informado";
  }

  if((aero.idAeroporto !== undefined) && (aero.idAeroporto < 1)){
    mensagem = "ID é inválido";
  }

  if(aero.nomeAeroporto === undefined){
    mensagem = "Nome não informado";
  }

  if(aero.idAeronave === undefined){
    mensagem = "ID não informado";
  }

  if((aero.idAeronave !== undefined) && (aero.idAeronave < 1)){
    mensagem = "ID Aeronave é inválido";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function vooValida(voo: Voo) {

  let valida = false;
  let mensagem = "";

  if(voo.idVoo === undefined){
    mensagem = "ID não informado";
  }

  if((voo.idVoo !== undefined) && (voo.idVoo < 1)){
    mensagem = "ID é inválido";
  }

  if(voo.dataSaida === undefined){
    mensagem = "Data de saida não informado";
  }

  if(voo.dataChegada === undefined){
    mensagem = "Data de chegada não informado.";
  }

  if(voo.valor === undefined){
    mensagem = "Valor não informado";
  }

  if(voo.trecho === undefined){
    mensagem = "Trecho não informado";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function cidadeValida(cidade: Cidade) {

  let valida = false;
  let mensagem = "";

  if(cidade.idCidade === undefined){
    mensagem = "ID não informado";
  }

  if((cidade.idCidade !== undefined) && (cidade.idCidade < 1)){
    mensagem = "ID é inválido";
  }

  if(cidade.nomeCidade === undefined){
    mensagem = "Nome da cidade não informado";
  }

  if(cidade.idAeroporto === undefined){
    mensagem = "Aeroporto não informado.";
  }

  if((cidade.idAeroporto !== undefined) && (cidade.idAeroporto < 1)){
    mensagem = "ID Aeroporto é inválido";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function trechoValida(trecho: Trecho) {

  let valida = false;
  let mensagem = "";

  if(trecho.idTrecho === undefined){
    mensagem = "ID não informado";
  }

  if((trecho.idTrecho !== undefined) && (trecho.idTrecho < 1)){
    mensagem = "ID é inválido";
  }

  if(trecho.idCidadeOrigem === undefined){
    mensagem = "ID da Cidade Origem não informado";
  }

  if((trecho.idCidadeOrigem !== undefined) && (trecho.idCidadeOrigem < 1)){
    mensagem = "ID da Cidade Origem é inválido";
  }

  if(trecho.idCidadeDestino === undefined){
    mensagem = "ID da Cidade Destino não informado.";
  }

  if((trecho.idCidadeDestino !== undefined) && (trecho.idCidadeDestino < 1)){
    mensagem = "ID da Cidade Destino é inválido";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}