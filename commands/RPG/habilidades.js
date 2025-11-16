const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { 
    habilidades, 
    getHabilidadesPorClasse, 
    getArvoresPorClasse, 
    getHabilidadesPorArvore 
} = require('../../utils/habilidades.js');

module.exports = {
    data: {
        name: 'habilidades',
        aliases: ['skills', 'skill', 'hab'],
        description: 'Visualiza suas habilidades e árvores de talentos'
    },
    async execute(message, args) {
        const playerData = await getPlayerData(message.author.id);

        if (!playerData.classe) {
            return message.reply('❌ Você precisa escolher uma classe primeiro usando `!classe`!');
        }

        const arvore = args[0] ? args.join(' ').toLowerCase() : null;
        const arvores = getArvoresPorClasse(playerData.classe);
        const todasSkills = getHabilidadesPorClasse(playerData.classe);

        let skillsParaMostrar = {};
        let tituloArvore = '';

        if (arvore) {
            const arvoreEncontrada = arvores.find(a => a.toLowerCase() === arvore);
            if (!arvoreEncontrada) {
                return message.reply(`❌ Árvore de habilidade não encontrada! Árvores disponíveis: ${arvores.join(', ')}`);
            }
            skillsParaMostrar = getHabilidadesPorArvore(playerData.classe, arvoreEncontrada);
            tituloArvore = ` - ${arvoreEncontrada}`;
        } else {
            skillsParaMostrar = todasSkills;
        }

        const embed = new EmbedBuilder()
            .setColor(playerData.cor)
            .setTitle(`⚔️ Habilidades de ${playerData.classe}${tituloArvore}`)
            .setDescription(`**Pontos de Habilidade Disponíveis:** ${playerData.pontosHabilidade}\n\nUse \`!aprender <nome-da-habilidade>\` para desbloquear ou melhorar uma habilidade.`)
            .setFooter({ text: `Use !habilidades <nome da árvore> para filtrar por árvore` });

        const arvoresOrganizadas = {};
        for (const [id, skill] of Object.entries(skillsParaMostrar)) {
            if (!arvoresOrganizadas[skill.arvore]) {
                arvoresOrganizadas[skill.arvore] = [];
            }
            arvoresOrganizadas[skill.arvore].push({ id, ...skill });
        }

        for (const [nomeArvore, skills] of Object.entries(arvoresOrganizadas)) {
            let descricao = '';
            
            for (const skill of skills) {
                const nivelAtual = playerData.habilidades[skill.id] || 0;
                const proximoNivel = nivelAtual + 1;
                const maxNivel = skill.nivelMax;
                
                let statusIcon = '🔒';
                if (nivelAtual > 0) {
                    statusIcon = nivelAtual >= maxNivel ? '⭐' : '✅';
                }

                let custoProximo = '';
                if (nivelAtual < maxNivel) {
                    const custo = skill.custoPorNivel[proximoNivel - 1];
                    custoProximo = ` | Custo: ${custo} PH`;
                }

                const nivelInfo = nivelAtual > 0 ? `[Nível ${nivelAtual}/${maxNivel}]` : `[Bloqueado]`;
                
                let detalhes = `**${skill.tipo}**`;
                if (skill.custoMP) detalhes += ` | MP: ${skill.custoMP}`;
                if (skill.cooldown) detalhes += ` | CD: ${skill.cooldown} turnos`;
                if (skill.danoBase) {
                    const efeitos = skill.efeitos(Math.max(nivelAtual, 1));
                    detalhes += ` | Dano: ${efeitos.dano || skill.danoBase}`;
                }

                descricao += `${statusIcon} **${skill.nome}** ${nivelInfo}${custoProximo}\n`;
                descricao += `*${skill.descricao}*\n`;
                descricao += `${detalhes}\n\n`;
            }

            embed.addFields({ 
                name: `🌳 ${nomeArvore}`, 
                value: descricao || 'Nenhuma habilidade nesta árvore.', 
                inline: false 
            });
        }

        if (!arvore && arvores.length > 1) {
            embed.addFields({ 
                name: '📋 Filtros Disponíveis', 
                value: arvores.map(a => `\`!habilidades ${a.toLowerCase()}\``).join('\n'), 
                inline: false 
            });
        }

        message.reply({ embeds: [embed] });
    }
};
