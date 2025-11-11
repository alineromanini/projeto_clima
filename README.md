<h1 align="left">🌦️ Aplicativo de Previsão do Tempo ☀️</h1>

<p align="left">
  <img src="https://img.shields.io/badge/Status-Ativo-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Testes-Jest-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Linguagem-JavaScript-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Licença-MIT-lightgrey?style=for-the-badge"/>
</p>

<p align="left">
  Aplicação web simples e intuitiva que permite consultar o <b>clima atual de qualquer cidade do mundo</b> 🌍<br>
  Desenvolvida em <b>HTML, CSS e JavaScript</b>, consumindo a <b>API Open-Meteo</b>.
</p>

---

## 🧭 Visão do Projeto

O **Aplicativo de Previsão do Tempo** foi criado com o objetivo de fornecer uma experiência direta e funcional para visualizar informações meteorológicas em tempo real, como temperatura, condição do clima e localização.  

Além da funcionalidade principal, o projeto busca demonstrar:
- Boas práticas de desenvolvimento **front-end moderno**.  
- Consumo de **APIs REST** com `fetch` assíncrono.  
- **Organização modular** do código.  
- Documentação clara com **JSDoc** e testes com **Jest**.

---

## 🧩 Metodologia e Desenvolvimento

O desenvolvimento seguiu uma metodologia **incremental e orientada a testes (TDD)**, passando por estas etapas:

1. **Planejamento** da interface e comportamento.  
2. **Prototipagem** em HTML e integração visual.  
3. **Integração com a API Open-Meteo**.  
4. **Tratamento de erros e respostas inválidas**.  
5. **Refatoração e documentação técnica (JSDoc)**.  
6. **Criação de testes automatizados** com Jest.  
7. **Deploy** da versão final no Vercel.

---

## 🗂️ Organização do Projeto

```bash
📁 projeto-clima
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── api.js
├── __tests__/
│   └── api.test.js
├── README.md
└── package.json

```
---
## ⚙️ Funcionalidades Implementadas

| Funcionalidade | Descrição |
|----------------|------------|
| 🔍 Busca de cidade | Permite ao usuário digitar o nome de uma cidade e obter os dados meteorológicos atuais. |
| 🌡️ Exibição de temperatura | Mostra a temperatura atual e o ícone correspondente à condição climática. |
| 🏙️ Localização e descrição | Exibe o nome da cidade e uma breve descrição do clima. |
| 📅 Data e hora | Mostra a data e hora local atual. |
| 🏠 Botão de voltar | Permite retornar à tela inicial de busca. |
| ⚠️ Tratamento de erros | Exibe mensagens de erro em caso de falha na busca ou nome inválido. |

---

## 🧱 Arquitetura do Sistema

| Camada | Responsabilidade |
|---------|------------------|
| **Interface (HTML/CSS)** | Estrutura e estilização da aplicação. |
| **Lógica (JavaScript)** | Manipulação do DOM, chamadas à API e controle de exibição. |
| **Serviço (API)** | Comunicação com a Open-Meteo para obter dados de latitude, longitude e clima. |
| **Testes (Jest)** | Verificação de comportamento esperado e simulação de respostas da API. |

---

## 🧰 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|-------------|-------------|
| **HTML5** | Estrutura semântica da interface. |
| **CSS3** | Estilização da aplicação. |
| **JavaScript (ES6+)** | Lógica principal e integração com a API. |
| **Open-Meteo API** | Fonte de dados meteorológicos. |
| **Weather Icons** | Ícones visuais de condições climáticas. |
| **Font Awesome** | Ícones de interface. |
| **Jest** | Testes automatizados de unidade. |

---

## 🚧 Desafios e Soluções

| Desafio | Solução Implementada |
|----------|----------------------|
| A busca não retornava resultados ao alterar o nome da cidade | Implementação de mocks separados para cada cidade no Jest. |
| Erros ao integrar `fetch` com a API Open-Meteo | Uso correto de `async/await` e tratamento com `ok` e `json()`. |
| A função `buscarClima` não executava no botão “Buscar” | Adição do `addEventListener` e correção do seletor de elementos. |
| Testes passando indevidamente com diferentes cidades | Reset do mock (`fetch.mockReset()`) a cada novo teste. |
| Mensagens de erro não exibiam no DOM | Implementação de verificação de resposta e exibição condicional. |

---
## 🧪 Testes Automatizados

Os testes foram implementados utilizando **Jest**, com simulação das respostas da API via `fetch.mockResolvedValueOnce`.

Exemplo de teste:

```javascript
test("Nome de cidade válido retorna dados meteorológicos", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ latitude: -23.55, longitude: -46.63 }] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ current_weather: { temperature: 25, weathercode: 1 } }),
    });

  const data = await buscarClima("São Paulo");
  expect(data).toEqual({ temperature: 25, weathercode: 1 });
});
```
---

## 📘 Aprendizados

Durante o desenvolvimento, foram consolidados conhecimentos em:

- Manipulação de DOM e eventos.

- Consumo de APIs REST com fetch.

- Estruturação de código modular e reutilizável.

- Escrita de testes automatizados com Jest.

- Documentação profissional com JSDoc.

- Boas práticas de UI/UX e semântica HTML.

## 🏆 Resultados

- ✨ Aplicação totalmente funcional e responsiva.
- 🧩 Código limpo, comentado e documentado.
- 🧪 Testes automatizados garantindo confiabilidade.
- 📄 Documentação gerada automaticamente com JSDoc.
- 🚀 Pronta para deploy e evolução futura.

## 👩‍💻 Autora

Aline Silva -
Desenvolvedora Front-End | Estudante de Tecnologia e Inovação 💻

<p align="left">  Se este projeto te inspirou, ⭐ dê uma estrela no repositório! </p> 
