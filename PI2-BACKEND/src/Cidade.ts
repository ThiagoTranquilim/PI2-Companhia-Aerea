// vamos definir um tipo chamado Cidade. 
// vai representar para nós a estrutura de dados do que é uma cidade.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Cidade = {
    idCidade?: number,
    nomeCidade?: string,
    idAeroporto?: number,
}