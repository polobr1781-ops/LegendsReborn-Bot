# Legends Reborn Discord Bot

## Overview
Legends Reborn is a Discord RPG bot built with Discord.js. Players create characters, choose classes, hunt monsters, mine resources, equip items, and progress through a tower-based RPG system directly in Discord.

## Project Status
- **Last Updated**: November 16, 2025
- **Status**: Production Ready ✅
- **Language**: JavaScript (Node.js)
- **Main Entry Point**: bot.js

## Recent Changes
- **November 16, 2025**: Complete skill system and turn-based PvP implementation with bug fixes
  - ✅ Implemented 24 unique skills across 4 classes (6 per class) with progression trees
  - ✅ Created turn-based PvP combat system with 60-second turn timers
  - ✅ Implemented DoT effects (bleeding, poison), buffs, debuffs, shields, and evasion
  - ✅ Created ELO-based PvP rating system with K-factor balancing
  - ✅ Added PvP rankings with seasonal statistics (wins, streaks, best rating)
  - ✅ Commands: !habilidades, !aprender, !duelo, !atacar, !usar, !item, !desistir, !rank
  - ✅ Fixed critical MP initialization bug in battle system
  - ✅ Centralized battle conclusion logic to eliminate code duplication
  - ✅ Fixed division-by-zero bug in ELO calculations for new players

- **November 14, 2025**: Complete bot overhaul and production-ready release
  - ✅ Implemented robust data migration system with `=== undefined` guards to preserve legitimate zero values
  - ✅ Expanded item system: 40+ items across weapons, armor, accessories, and consumables with rarity tiers
  - ✅ Expanded monster system: 15+ creatures including tower bosses with balanced stats
  - ✅ Created character class system: Guerreiro, Mago, Arqueiro, Ladino with unique bonuses
  - ✅ Improved all RPG commands with professional Discord embeds and better UX
  - ✅ Created shop system for buying items
  - ✅ Created comprehensive interactive help command
  - ✅ Created narrator/admin tools for manual tower and player management
  - ✅ Configured file-based database (Keyv) to prevent data loss on restart

## Project Architecture

### Core Components
- **bot.js**: Main entry point - initializes Discord client, loads commands, handles message events
- **utils/database.js**: Database management with deep clone, migration, and Keyv file storage
- **utils/items.js**: 40+ item definitions with rarity tiers (Comum, Incomum, Raro, Épico, Lendário)
- **utils/monsters.js**: 15+ monster definitions including tower bosses
- **utils/shop.js**: Shop inventory and pricing system
- **utils/habilidades.js**: 24 skill definitions with class-specific trees and progression
- **utils/battleManager.js**: Turn-based PvP combat engine with state management and ELO system

### Command Structure
Commands organized in `/commands/` folders:

**RPG/** - Core RPG mechanics:
- `perfil` (`p`): Show detailed character profile with equipment and stats
- `classe`: Choose character class (Guerreiro/Mago/Arqueiro/Ladino) - permanent choice
- `inventario` (`inv`, `i`): View inventory with item details
- `equipar` (`equip`, `e`): Equip items by name or slot
- `desequipar` (`unequip`, `u`): Unequip items from slots
- `distribuir` (`dist`, `d`): Distribute attribute points (Força, Destreza, Constituição, Inteligência)
- `caçar` (`hunt`, `h`): Hunt monsters for XP, loot, and currency (automated battles)
- `habilidades` (`skills`): View available skills for your class with unlock requirements
- `aprender` (`learn`): Unlock and upgrade skills using skill points

**PvP/** - Player versus Player combat:
- `duelo` (`duel`): Challenge another player to turn-based PvP combat
- `atacar` (`attack`, `atk`): Perform basic attack during your turn in battle
- `usar` (`use`): Use a skill during your turn in battle
- `item`: Use consumable item during your turn in battle
- `desistir` (`surrender`, `forfeit`): Give up current battle (loses rating)
- `rank` (`ranking`, `leaderboard`): View PvP rankings (top by wins and rating)

**Profissoes/** - Gathering professions:
- `minerar` (`mine`, `m`): Mine resources for crafting materials and currency

**Economia/** - Economy system:
- `loja` (`shop`, `l`): Browse and buy items from the shop
- `vender` (`sell`, `v`): Sell inventory items for currency

**Utility/** - Bot utilities:
- `ping`: Check bot latency and uptime
- `ajuda` (`help`, `h`): Interactive help command with category navigation
- `admin`: Narrator/admin tools for manual game management

### Class System
Players choose one permanent class with unique bonuses and skill trees:
- **Guerreiro**: +3 Força, +2 Constituição | Skills: Golpe Poderoso, Fúria Berserk, Escudo de Ferro, Investida Brutal, Grito de Guerra, Colossus
- **Mago**: +3 Inteligência, +2 Destreza | Skills: Bola de Fogo, Tempestade de Raios, Barreira Arcana, Congelar, Drenar Mana, Meteoro
- **Arqueiro**: +3 Destreza, +2 Força | Skills: Tiro Certeiro, Chuva de Flechas, Flecha Perfurante, Armadilha Venenosa, Flecha Explosiva, Rajada Letal
- **Ladino**: +2 Destreza, +2 Inteligência, +1 Força | Skills: Apunhalar, Veneno Mortal, Evasão, Ataque das Sombras, Roubo de Vida, Dança das Lâminas

### Skill System
- **Skill Points**: Earned on level up (1 per level)
- **Skill Trees**: Each class has 6 unique skills with progression tiers
- **Requirements**: Skills require minimum level and previous skills unlocked
- **Upgrades**: Most skills can be upgraded 2-3 times for increased power
- **MP System**: Skills cost MP to use in combat (regenerates over time)

### PvP Combat System
- **Turn-based**: 60-second timer per turn, alternating between players
- **Actions**: Basic attack (free), skills (costs MP), items (consumes item)
- **Effects**: DoT (bleeding, poison), buffs (damage, defense), debuffs, shields, evasion
- **ELO Rating**: Dynamic rating system with K-factor (32-40) based on rating difference
- **Rewards**: Winner gains rating, currency (50 + 10 per turn), and win streak
- **Statistics**: Tracks wins, losses, draws, total duels, best rating, best streak

### Tower System
- **Manual progression**: Narrators control floor advancement and story missions
- **Automated grinding**: Players use `!caçar` and `!minerar` to farm XP/resources
- **Tracking**: System tracks current floor and completed missions (no automation)
- **Design philosophy**: Story missions are narrated manually; automated battles are for grinding only

### Database & Migration
- **Storage**: Keyv with KeyvFile adapter (JSON files in `/database/main.json`)
- **Migration**: Automatic data migration preserves existing values and backfills missing fields
- **Deep cloning**: Prevents shared reference mutations between players
- **Backward compatibility**: Legacy players can use all new features without data loss
- **Player data includes**:
  - Level, XP, currency, inventory, equipment (7 slots)
  - Attributes (Força, Destreza, Constituição, Inteligência)
  - Points (attribute, skill)
  - Class (permanent choice)
  - Skills (habilidades: array of unlocked skills with levels)
  - Cooldowns (treino, cacar, minerar, torre)
  - Professions (mineracao, ferraria, alquimia)
  - Tower progress (floor, completed missions)
  - PvP statistics (rating, best rating, wins, losses, draws, streaks)
  - Statistics (monsters defeated, deaths, money earned, items found)
  - Achievements

### Command Prefix
- Prefix: `!`
- Examples: `!perfil`, `!caçar`, `!classe`, `!loja`

## Narrator/Admin Tools
The `!admin` command provides tools for narrators to manage:
- **Tower**: Set player floor, add completed missions
- **Player Management**: Set level, add XP, add currency, give items
- **Cooldowns**: Reset cooldowns for players
- **Character**: View detailed player info for moderation

## Dependencies
- **discord.js**: Discord API wrapper for bot functionality
- **dotenv**: Environment variable management for secrets
- **keyv**: Simple key-value storage interface
- **keyv-file**: File-based storage adapter for Keyv persistence

## Environment Variables
- `TOKEN`: Discord bot token (required, stored in Replit Secrets)

## Development
- **Workflow**: "Discord Bot" runs `node bot.js`
- **Console**: Shows bot status, errors, and command usage
- **Database**: Persists to file system, survives restarts
- **Testing**: All commands tested and architect-approved

## Design Philosophy
- **Classic RPG Style**: Traditional classes, equipment slots, professions, progression
- **Manual Story + Auto Grinding**: Narrators control story; players grind with automated battles
- **No Placeholder Data**: Real game mechanics, balanced stats, production-ready
- **Professional UX**: Rich Discord embeds, clear feedback, intuitive commands
- **Data Integrity**: Robust migration prevents bugs for legacy and new players

## User Preferences
- Prefers classic RPG mechanics over modern simplified systems
- Wants manual narrator control for story missions
- Needs automated battles for grinding (not full automation)
- Values data persistence and backward compatibility
