# Projeto Integrador 2: Controle de Passagem Aérea

Este repositório contém a implementação do Projeto Integrador 2 da disciplina de Controle de Passagem Aérea da PUC-Campinas, referente ao semestre de agosto de 2023. O projeto tem como propósito integrar os conhecimentos adquiridos ao longo do semestre, abrangendo programação web, banco de dados, processos de Engenharia, estrutura de dados e algoritmos de programação.

## Objetivo do Projeto

O Projeto Integrador 2 busca unir habilidades técnicas e práticas de gestão de equipe, planejamento, desenvolvimento, documentação e apresentação de projetos. Os alunos, organizados em equipes autogerenciáveis, serão orientados pelo professor orientador que atuará como diretor das equipes, oferecendo direcionamento e auxiliando na gestão do próprio projeto.

## Funcionalidades

### Módulo 1: Interface Administrativa da Cia Aérea

O painel web administrativo permite que o administrador gerencie os seguintes cadastros:

- Aeronaves da Cia (modelo, número de identificação, fabricante, ano de fabricação, mapa de assentos).
- Aeroportos e Cidades (com relacionamento entre essas duas tabelas).
- Trechos (Trajetos) que a Cia aérea opera, exemplo: Campinas -> São Paulo e São Paulo -> Campinas.
- O cadastro dos voos (data, trecho, horário previsto de partida e chegada, aeroporto de saída e chegada). Cada voo terá um valor único por assento.

Para testes, o painel administrativo deve ser alimentado com pelo menos 10 aeronaves, 20 aeroportos, 15 trechos e 40 voos até o final de 2023.

### Módulo 2: Interface do Cliente da Cia Aérea

O módulo destinado aos consumidores finais possibilita a consulta e simulação de compra de passagens aéreas, com funcionalidades como:

1. **Busca de Voos:**
   - Escolha do tipo de passagem: ida e volta ou somente ida.
   - Seleção de datas de ida e, se aplicável, de retorno.
   - Escolha de Cidade / Aeroporto de Origem e Cidade / Aeroporto de Destino.
   - Exibição das opções de voo para que o usuário escolha e prossiga para a próxima etapa que será a compra.

2. **Reserva de Assentos:**
   - Após a escolha do voo, o sistema apresentará um mapa interativo de assentos da aeronave.
   - Todos os assentos são considerados iguais.
   - A interface destaca o assento escolhido pelo usuário e desabilita assentos reservados.

3. **Conclusão do Pagamento:**
   - O usuário escolhe a forma de pagamento (PIX ou cartão de crédito), informa nome completo e e-mail.
   - Simulação de cenários: pagamento aprovado, transação não autorizada e erro técnico amigável.
   - Se a compra for aprovada, a passagem aérea é armazenada no banco, e os assentos reservados são registrados.
   - Exibição de uma mensagem informativa final: "Sua passagem aérea foi emitida e enviada para seu endereço de e-mail."

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript/TypeScript
- Node.js
- Oracle
- Git
