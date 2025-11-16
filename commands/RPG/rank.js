const { EmbedBuilder } = require('discord.js');
const { db } = require('../../utils/database.js');

module.exports = {
    data: {
        name: 'rank',
        aliases: ['ranking', 'leaderboard', 'top'],
        description: 'Exibe os rankings PvP dos jogadores'
    },
    async execute(message, args) {
        const categoria = args[0] ? args[0].toLowerCase() : 'rating';

        const todosJogadores = [];
        
        for await (const [userId, playerData] of db.iterator()) {
            if (playerData && playerData.classe && playerData.estatisticas) {
                todosJogadores.push({
                    userId,
                    nome: playerData.classe,
                    level: playerData.level,
                    classe: playerData.classe,
                    pvp: playerData.pvp || { rating: 1000, melhorRating: 1000 },
                    estatisticas: playerData.estatisticas
                });
            }
        }

        if (todosJogadores.length === 0) {
            return message.reply('❌ Nenhum jogador encontrado no ranking!');
        }

        let rankingOrdenado = [];
        let titulo = '';
        let descricao = '';
        let campo = '';

        if (categoria === 'rating' || categoria === 'pvp') {
            rankingOrdenado = todosJogadores
                .filter(p => p.estatisticas.duelosRealizados > 0)
                .sort((a, b) => b.pvp.rating - a.pvp.rating)
                .slice(0, 10);
            
            titulo = '🏆 Ranking PvP - Rating';
            descricao = 'Top 10 jogadores com maior Rating PvP';
            
            rankingOrdenado.forEach((p, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `**${index + 1}.**`;
                const winrate = p.estatisticas.duelosRealizados > 0 
                    ? ((p.estatisticas.pvpVitorias / p.estatisticas.duelosRealizados) * 100).toFixed(1)
                    : 0;
                
                campo += `${medal} **Rating: ${p.pvp.rating}** - ${p.classe} (Nv. ${p.level})\n`;
                campo += `   ↳ ${p.estatisticas.pvpVitorias}V / ${p.estatisticas.pvpDerrotas}D / ${p.estatisticas.pvpEmpates}E (${winrate}%)\n\n`;
            });

        } else if (categoria === 'vitorias' || categoria === 'wins') {
            rankingOrdenado = todosJogadores
                .filter(p => p.estatisticas.pvpVitorias > 0)
                .sort((a, b) => b.estatisticas.pvpVitorias - a.estatisticas.pvpVitorias)
                .slice(0, 10);
            
            titulo = '⚔️ Ranking PvP - Vitórias';
            descricao = 'Top 10 jogadores com mais vitórias';
            
            rankingOrdenado.forEach((p, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `**${index + 1}.**`;
                
                campo += `${medal} **${p.estatisticas.pvpVitorias} Vitórias** - ${p.classe} (Nv. ${p.level})\n`;
                campo += `   ↳ Rating: ${p.pvp.rating} | Melhor Sequência: ${p.pvp.melhorSequencia}\n\n`;
            });

        } else if (categoria === 'sequencia' || categoria === 'streak') {
            rankingOrdenado = todosJogadores
                .filter(p => p.pvp.vitoriasSeguidas > 0)
                .sort((a, b) => b.pvp.vitoriasSeguidas - a.pvp.vitoriasSeguidas)
                .slice(0, 10);
            
            titulo = '🔥 Ranking PvP - Sequência Atual';
            descricao = 'Top 10 jogadores com maior sequência de vitórias atual';
            
            rankingOrdenado.forEach((p, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `**${index + 1}.**`;
                
                campo += `${medal} **${p.pvp.vitoriasSeguidas} Vitórias Seguidas** - ${p.classe} (Nv. ${p.level})\n`;
                campo += `   ↳ Rating: ${p.pvp.rating} | Recorde: ${p.pvp.melhorSequencia}\n\n`;
            });

        } else {
            return message.reply('❌ Categoria inválida! Use: `!rank` ou `!rank vitorias` ou `!rank sequencia`');
        }

        if (rankingOrdenado.length === 0) {
            return message.reply('❌ Nenhum jogador encontrado nesta categoria!');
        }

        const playerData = todosJogadores.find(p => p.userId === message.author.id);
        let posicaoUsuario = '';
        
        if (playerData) {
            const indexUsuario = rankingOrdenado.findIndex(p => p.userId === message.author.id);
            if (indexUsuario !== -1) {
                posicaoUsuario = `\n📍 **Sua Posição:** #${indexUsuario + 1}`;
            } else {
                const todosPorCategoria = categoria === 'vitorias' 
                    ? todosJogadores.sort((a, b) => b.estatisticas.pvpVitorias - a.estatisticas.pvpVitorias)
                    : categoria === 'sequencia'
                    ? todosJogadores.sort((a, b) => b.pvp.vitoriasSeguidas - a.pvp.vitoriasSeguidas)
                    : todosJogadores.sort((a, b) => b.pvp.rating - a.pvp.rating);
                
                const posGeral = todosPorCategoria.findIndex(p => p.userId === message.author.id);
                if (posGeral !== -1) {
                    posicaoUsuario = `\n📍 **Sua Posição:** #${posGeral + 1}`;
                }
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(titulo)
            .setDescription(descricao + posicaoUsuario)
            .addFields({ name: '🏅 Rankings', value: campo || 'Nenhum jogador no ranking', inline: false })
            .setFooter({ text: 'Use !rank vitorias ou !rank sequencia para ver outros rankings' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
