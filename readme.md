# YT-download-BOT
## Project info 📝:
- author -> RiseGhost 👻
- programming language 💻 -> JavaScript
- framework -> Node
- version -> 1.0.0

## Implementation 💻:

Para fazer o download da música do YouTube é utilizado o module __ytdl-core__.

A URL introduzida pelo utilizador é verefica e caso estaja correta o download é inicado e é imprimida um mensagem de inicio de download para o utilizador. Caso contrário um mensagem de err aparece.

Para conseguir identificar o ficheiro de música. É lhe atribuido o número do id da interaction que o utilizador fez.

Após o download da musica esta pronto o ficheiro é enviado para utilizar e é apagado do servidor.

## Commands /:

- /download __url__ -> Faz o download do audio do video passado como argumento;
- /about -> imprimir o JSON com as informações do projeto.
