// vamos definir um tipo chamado Trecho. 
// vai representar para nós a estrutura de dados do que é um trecho.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Trecho = {
    idTrecho?: number,
    idCidadeOrigem?: number,
    idCidadeDestino?: number,
}