# ⛽ FuelApp | Gerenciador de Consumo de Veículos

[![Tecnologia](https://img.shields.io/badge/Tecnologia-Ionic%20%7C%20Angular-blue?style=for-the-badge&logo=angular)](https://angular.io/)
[![Linguagem](https://img.shields.io/badge/Linguagem-TypeScript%20%7C%20SCSS-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

##  Sobre o Projeto

O **FuelApp** é um aplicativo mobile desenvolvido com Ionic e Angular, focado em ajudar o usuário a monitorar e otimizar o consumo de combustível e os custos associados ao seu(s) veículo(s).

Este projeto foi desenvolvido com atenção especial à arquitetura de componentes e à manipulação de estados via JavaScript (como a lógica de *Modais* e gerenciamento de dados).

##  Funcionalidades Principais

O aplicativo oferece as seguintes telas e recursos essenciais para o gerenciamento de combustível:

* **Cálculo Rápido (Cálculo):**
    * Registra a KM atual, KM anterior e litros abastecidos.
    * Calcula instantaneamente o consumo por litro (**Km/L**).
    * Calcula o **Custo por Km** com base no valor total pago.
* **Histórico de Abastecimentos:**
    * Armazena um registro cronológico de todos os abastecimentos realizados.
    * Permite o acompanhamento da performance ao longo do tempo.
* **Gerenciamento de Veículos:**
    * Suporte para múltiplos veículos.
    * Definição de qual veículo está ativo para o registro de novos cálculos.
* **Gráficos e Estatísticas (Gráficos):**
    * Visualização da evolução do consumo e tendências de gastos.

##  Tecnologias Utilizadas

* **Framework:** Ionic Framework (Interface de Usuário)
* **Frontend:** Angular (Estrutura e Lógica)
* **Linguagem:** TypeScript
* **Estilização:** SCSS (Estrutura e customização de tema)
* **Persistência:** `localStorage` (Para testes e persistência de dados simples como o tema e registros).

##  Como Rodar o Projeto

Para clonar e executar este projeto em sua máquina local, siga os passos abaixo:

1.  **Pré-requisitos:** Certifique-se de ter o Node.js, npm e a CLI do Ionic instalados.
2.  **Clone o Repositório:**
    ```bash
    git clone [LINK DO SEU REPOSITÓRIO]
    ```
3.  **Acesse o Diretório:**
    ```bash
    cd [NOME DO SEU REPOSITÓRIO]
    ```
4.  **Instale as Dependências:**
    ```bash
    npm install
    ```
5.  **Execute a Aplicação:**
    ```bash
    ionic serve
    ```
    O aplicativo será aberto no seu navegador padrão (`http://localhost:8100`).

---

**Autor:** Juliana, Júlia e Ester

*Feito com ☕ e TypeScript.*
