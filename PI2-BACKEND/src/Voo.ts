// vamos definir um tipo chamado Voo. 
// vai representar para nós a estrutura de dados do que é um voo.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Voo = {
    idVoo?: number, 
    dataSaida?: string,
    dataChegada?: string,
    valor?: number, 
    idAeronave?: number,
    trecho?: number,
}