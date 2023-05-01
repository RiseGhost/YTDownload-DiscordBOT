# YT-download-BOT
## Project info 📝:
- author -> RiseGhost 👻
- programming language 💻 -> JavaScript
- framework -> Node
- version -> 1.0.0

Link to add bot -> https://discord.com/api/oauth2/authorize?client_id=1096036731255541770&permissions=40271764011072&scope=bot

## Implementation 💻:

Para fazer o download da música do YouTube é utilizado o module __ytdl-core__.

A URL introduzida pelo utilizador é vereficada e caso estaja correta o download é iniciado e é imprimida uma mensagem de inicio de download para o utilizador. Caso contrário um mensagem de err aparece.

Para conseguir identificar o ficheiro de música. É lhe atribuido o número do id da interaction que o utilizador fez.

Após o download da musica estar pronto o ficheiro é enviado para o utilizador e é apagado do servidor.

## Commands /:

- /download __url__ -> Faz o download do audio do video passado como argumento;
- /about -> imprimir o JSON com as informações do projeto;
- /call __game__ __language__ -> Escreve uma mensagem a chamar as pessoas par jogarem;
- /play __url__ -> Faz a reprodução do audio do video do YouTube no canal de voz;
- /pause -> Coloca a música em pausa;
- /resume -> Volta a da play a musica.

## Commands !:

- !play __url__ -> Faz a reprodução do audio do video do YouTube no canal de voz;
- !pause -> Coloca a música em pausa;
- !resume -> Volta a da play a musica.