# Legends Reborn Discord Bot

## Overview
Legends Reborn is a Discord RPG bot built with Discord.js. Players can create characters, hunt monsters, mine resources, equip items, and progress through an RPG system directly in Discord.

## Project Status
- **Last Updated**: November 14, 2025
- **Status**: Active and running
- **Language**: JavaScript (Node.js)
- **Main Entry Point**: bot.js

## Recent Changes
- November 14, 2025: Initial setup in Replit environment
  - Fixed Keyv and KeyvFile import syntax for compatibility with latest versions
  - Configured Discord bot workflow
  - Set up file-based database storage using Keyv

## Project Architecture

### Core Components
- **bot.js**: Main entry point - initializes Discord client, loads commands, and handles message events
- **utils/database.js**: Database management using Keyv with file storage
- **utils/items.js**: Item definitions (weapons, armor, materials)
- **utils/monsters.js**: Monster definitions for hunting
- **utils/shop.js**: Shop functionality for trading items

### Command Structure
Commands are organized in folders under `/commands/`:
- **RPG/**: Core RPG commands
  - perfil: Show character profile
  - inventario: View inventory
  - equipar: Equip items
  - desequipar: Unequip items
  - distribuir: Distribute attribute points
  - caçar: Hunt monsters for XP and loot
- **Profissoes/**: Profession commands
  - minerar: Mine resources
- **Economia/**: Economy commands
  - vender: Sell items
- **Utility/**: Utility commands
  - ping: Check bot latency
  - admin: Admin commands

### Database
- Uses Keyv with KeyvFile adapter for JSON-based file storage
- Database stored in `/database/main.json` (excluded from git)
- Player data includes: level, XP, currency, inventory, equipment, attributes, cooldowns

### Command Prefix
- Prefix: `!`
- Example: `!perfil`, `!caçar`, `!inventario`

## Dependencies
- discord.js: Discord API wrapper
- dotenv: Environment variable management
- keyv: Key-value storage
- keyv-file: File-based storage adapter for Keyv

## Environment Variables
- `TOKEN`: Discord bot token (required)

## Development
- Workflow: "Discord Bot" runs `node bot.js`
- Console output shows bot status and errors
- Database persists to file system

## User Preferences
None documented yet.
