# Legends Reborn Discord Bot

## Overview
Legends Reborn is a Discord RPG bot built with Discord.js. Players create characters, choose classes, hunt monsters, mine resources, equip items, and progress through a tower-based RPG system directly in Discord.

## Project Status
- **Last Updated**: November 14, 2025
- **Status**: Production Ready ✅
- **Language**: JavaScript (Node.js)
- **Main Entry Point**: bot.js

## Recent Changes
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
Players choose one permanent class with unique bonuses:
- **Guerreiro**: +3 Força, +2 Constituição
- **Mago**: +3 Inteligência, +2 Destreza
- **Arqueiro**: +3 Destreza, +2 Força
- **Ladino**: +2 Destreza, +2 Inteligência, +1 Força

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
  - Cooldowns (treino, cacar, minerar, torre)
  - Professions (mineracao, ferraria, alquimia)
  - Tower progress (floor, completed missions)
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
