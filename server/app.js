var express = require('express'),
    app = express();

var fs = require('fs');
var http = require('http');
var _ = require('underscore');
// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {};
db.jogadores = JSON.parse(fs.readFileSync('server/data/jogadores.json', 'utf8'));
db.jogosPorJogador = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json', 'utf8'));

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

app.set('views', 'server/views');

app.get('/', function (req, res) {
    // index
    res.render('index', { player: db.jogadores.players }); // esse render precisa exportar os jogadores
});

app.get('/jogador/:id', function (req, res) {
    // jogador
    var playerID = req.params.id;
    
    var playerProfile = _.find(db.jogadores.players, function(player) {
        return player.steamid === playerID;
    });
    
    var playerGames = db.jogosPorJogador[playerID];
    
    playerGames.games = _.sortBy(playerGames.games, function(game) {
        return (game.playtime_forever)*(-1);
    });
    
    playerGames.games = _.map(playerGames.games, function(game) {
        game.playtime_forever = Math.round(game.playtime_forever/60);
        return game;
    });
    
    playerGames.games = _.first(playerGames.games, 5);
    
    playerGames.unplayed = _.where(playerGames.games, { playtime_forever: 0 }).length;
    
    res.render('jogador', { player: playerProfile, games: playerGames, favorite: playerGames.games[0] });
})

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'));
// abrir servidor na porta 3000
// dica: 1-3 linhas de código
http.createServer(app).listen(3000);