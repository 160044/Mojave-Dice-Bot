"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMojave = initializeMojave;
const server_bot_1 = require("@rootsdk/server-bot");
const dice_1 = require("./dice");
const initiative_1 = require("./initiative");
const status_1 = require("./status");
const persistence = __importStar(require("./persistence"));
const PREFIX = process.env.BOT_PREFIX || '!';
const initiativeTracker = new initiative_1.InitiativeTracker();
const statusTracker = new status_1.StatusTracker();
// Load persisted data on startup
console.log('📂 Loading persisted data...');
const initData = persistence.loadInitiativeData();
const statusData = persistence.loadStatusData();
if (initData) {
    initiativeTracker.importData(initData);
}
if (statusData) {
    statusTracker.importData(statusData);
}
// Start auto-save (every 30 seconds)
persistence.startAutoSave(() => initiativeTracker.exportData(), () => statusTracker.exportData());
/**
 * Initialize Mojave Bot
 */
function initializeMojave() {
    server_bot_1.rootServer.community.channelMessages.on(server_bot_1.ChannelMessageEvent.ChannelMessageCreated, handleMessage);
    console.log('✅ Mojave D&D Bot is online!');
    console.log(`📝 Prefix: ${PREFIX}`);
}
/**
 * Handle incoming messages
 */
async function handleMessage(evt) {
    if (evt.messageType === server_bot_1.MessageType.System)
        return;
    if (!evt.messageContent)
        return;
    const content = evt.messageContent.trim();
    if (!content.startsWith(PREFIX))
        return;
    const args = content.slice(PREFIX.length).trim().split(/\s+/);
    let command = args[0].toLowerCase();
    let commandArgs = args.slice(1);
    // Handle spaced commands like "!init add" -> "!initadd" or "!status add" -> "!statusadd"
    if (command === 'init' && commandArgs.length > 0) {
        const subcommand = commandArgs[0].toLowerCase();
        // Combine init + subcommand
        if (['add', 'hidden', 'next', 'prev', 'damage', 'heal', 'remove', 'clear'].includes(subcommand)) {
            command = 'init' + subcommand;
            commandArgs = commandArgs.slice(1);
        }
    }
    if (command === 'status' && commandArgs.length > 0) {
        const subcommand = commandArgs[0].toLowerCase();
        // Combine status + subcommand
        if (['add', 'remove', 'tick', 'clear'].includes(subcommand)) {
            command = 'status' + subcommand;
            commandArgs = commandArgs.slice(1);
        }
    }
    // Get user ID from event (confirmed: userId property works)
    const userId = evt.userId || '';
    // Delete message if it's inithidden command (to hide HP values)
    if (command === 'inithidden' || command === 'ih') {
        try {
            const messageId = evt.id;
            if (messageId) {
                await server_bot_1.rootServer.community.channelMessages.delete({
                    channelId: evt.channelId,
                    id: messageId
                });
            }
        }
        catch (error) {
            console.log('Note: Could not delete inithidden message (may not be supported)');
        }
    }
    try {
        await routeCommand(evt.channelId, command, commandArgs, userId);
    }
    catch (error) {
        console.error('Command error:', error);
        await sendMessage(evt.channelId, `❌ ${error instanceof Error ? error.message : 'Error occurred'}`);
    }
}
/**
 * Route commands
 */
async function routeCommand(channelId, command, args, userId) {
    // Utility
    if (command === 'ping') {
        await sendMessage(channelId, 'Pong! 🏓');
        return;
    }
    if (command === 'help' || command === 'h') {
        await handleHelp(channelId, args);
        return;
    }
    // Initiative commands
    if (command === 'init') {
        await handleInitShow(channelId);
        return;
    }
    if (command === 'initadd' || command === 'ia') {
        await handleInitAdd(channelId, args, userId);
        return;
    }
    if (command === 'inithidden' || command === 'ih') {
        await handleInitHidden(channelId, args, userId);
        return;
    }
    if (command === 'initnext' || command === 'in') {
        await handleInitNext(channelId);
        return;
    }
    if (command === 'initprev' || command === 'ip') {
        await handleInitPrev(channelId);
        return;
    }
    if (command === 'initdamage' || command === 'id') {
        await handleInitDamage(channelId, args);
        return;
    }
    if (command === 'initheal') {
        await handleInitHeal(channelId, args);
        return;
    }
    if (command === 'initremove' || command === 'ir') {
        await handleInitRemove(channelId, args);
        return;
    }
    if (command === 'initclear') {
        await handleInitClear(channelId);
        return;
    }
    // Status commands
    if (command === 'status' || command === 'st') {
        await handleStatusShow(channelId, args);
        return;
    }
    if (command === 'statusadd' || command === 'sa') {
        await handleStatusAdd(channelId, args);
        return;
    }
    if (command === 'statusremove' || command === 'sr') {
        await handleStatusRemove(channelId, args);
        return;
    }
    if (command === 'statustick' || command === 'stk') {
        await handleStatusTick(channelId);
        return;
    }
    if (command === 'statusclear' || command === 'sclear') {
        await handleStatusClear(channelId);
        return;
    }
    if (command === 'conditions') {
        await handleConditionsList(channelId);
        return;
    }
    if (command === 'break' || command === 'br' || command === 'sep' || command === 'separator') {
        await handleBreak(channelId);
        return;
    }
    if (command === 'refresh' || command === 'reload') {
        return;
    }
    // Dice rolling
    if (command === 'roll' || command === 'r') {
        await handleRoll(channelId, args);
        return;
    }
    if (command === 'adv' || command === 'advantage') {
        await handleAdvantage(channelId, args);
        return;
    }
    if (command === 'dis' || command === 'disadvantage') {
        await handleDisadvantage(channelId, args);
        return;
    }
    if (command === 'stats') {
        await handleStats(channelId);
        return;
    }
    if (command === 'fate' || command === 'fudge') {
        await handleFate(channelId, args);
        return;
    }
    if (command === 'sr' || command === 'shadowrun') {
        await handleShadowrun(channelId, args);
        return;
    }
    if (command === 'threshold' || command === 'dndthreshold') {
        await handleThreshold(channelId);
        return;
    }
    if (command === 'dagethreshold' || command === 'dragonagethreshold') {
        await handleDragonAgeThreshold(channelId);
        return;
    }
}
/**
 * Handle standard roll
 */
async function handleRoll(channelId, args) {
    if (args.length === 0) {
        await sendMessage(channelId, 'Usage: `!roll <dice>`\nExamples: `!roll 2d20+5`, `!roll 4d6kh3`, `!roll d20 adv`');
        return;
    }
    // Check for advantage/disadvantage modifier
    const lastArg = args[args.length - 1].toLowerCase();
    if (lastArg === 'adv' || lastArg === 'advantage') {
        await handleAdvantage(channelId, args.slice(0, -1));
        return;
    }
    if (lastArg === 'dis' || lastArg === 'disadvantage') {
        await handleDisadvantage(channelId, args.slice(0, -1));
        return;
    }
    const expression = args.join('');
    const result = dice_1.DiceRoller.roll(expression);
    let response = `🎲 **${result.expression}**\n${result.details}`;
    if (result.criticalSuccess)
        response += '\n✨ **CRITICAL SUCCESS!**';
    if (result.criticalFailure)
        response += '\n💀 **CRITICAL FAILURE!**';
    await sendMessage(channelId, response);
}
/**
 * Handle advantage
 */
async function handleAdvantage(channelId, args) {
    const result = dice_1.DiceRoller.rollAdvantage();
    let modifier = 0;
    // Parse modifier from args
    if (args.length > 0) {
        const expr = args.join('');
        const modMatch = expr.match(/[\+\-]\d+/);
        if (modMatch) {
            modifier = parseInt(modMatch[0]);
        }
    }
    const total = result.total + modifier;
    let response = `🎲 **${result.expression}**`;
    if (modifier !== 0)
        response += ` ${modifier > 0 ? '+' : ''}${modifier}`;
    response += `\n${result.details}`;
    if (modifier !== 0)
        response += `\n**Final Total**: ${total}`;
    if (result.criticalSuccess)
        response += '\n✨ **CRITICAL SUCCESS!**';
    await sendMessage(channelId, response);
}
/**
 * Handle disadvantage
 */
async function handleDisadvantage(channelId, args) {
    const result = dice_1.DiceRoller.rollDisadvantage();
    let modifier = 0;
    if (args.length > 0) {
        const expr = args.join('');
        const modMatch = expr.match(/[\+\-]\d+/);
        if (modMatch) {
            modifier = parseInt(modMatch[0]);
        }
    }
    const total = result.total + modifier;
    let response = `🎲 **${result.expression}**`;
    if (modifier !== 0)
        response += ` ${modifier > 0 ? '+' : ''}${modifier}`;
    response += `\n${result.details}`;
    if (modifier !== 0)
        response += `\n**Final Total**: ${total}`;
    if (result.criticalFailure)
        response += '\n💀 **CRITICAL FAILURE!**';
    await sendMessage(channelId, response);
}
/**
 * Handle ability score generation
 */
async function handleStats(channelId) {
    const { scores, details } = dice_1.DiceRoller.rollStats();
    let response = '🎲 **Ability Score Generation (4d6 keep highest 3)**\n\n';
    details.forEach((detail, i) => {
        response += `Stat ${i + 1}: ${detail}\n`;
    });
    const total = scores.reduce((sum, s) => sum + s, 0);
    const average = (total / 6).toFixed(1);
    response += `\n**Scores**: ${scores.join(', ')}`;
    response += `\n**Total**: ${total} | **Average**: ${average}`;
    await sendMessage(channelId, response);
}
/**
 * Handle FATE dice
 */
async function handleFate(channelId, args) {
    const count = args.length > 0 ? parseInt(args[0]) : 4;
    if (isNaN(count) || count < 1 || count > 20) {
        await sendMessage(channelId, '❌ Count must be between 1 and 20');
        return;
    }
    const result = dice_1.DiceRoller.rollFate(count);
    await sendMessage(channelId, `🎲 **FATE Dice (${count}dF)**\n${result.details}`);
}
/**
 * Handle Shadowrun
 */
async function handleShadowrun(channelId, args) {
    if (args.length === 0) {
        await sendMessage(channelId, 'Usage: `!sr <count>` (e.g., `!sr 8`)');
        return;
    }
    const count = parseInt(args[0]);
    if (isNaN(count) || count < 1 || count > 50) {
        await sendMessage(channelId, '❌ Count must be between 1 and 50');
        return;
    }
    const result = dice_1.DiceRoller.rollShadowrun(count);
    await sendMessage(channelId, `🎲 **${result.expression}**\n${result.details}`);
}
/**
 * Handle threshold stats
 */
async function handleThreshold(channelId) {
    let response = '🎲 **D&D Threshold Stats (4d6, reroll 1s/2s, drop lowest)**\n';
    response += '─'.repeat(50) + '\n\n';
    for (let set = 1; set <= 3; set++) {
        const stats = [];
        response += `**Set ${set}:**\n`;
        for (let i = 0; i < 6; i++) {
            const { total, rolls } = dice_1.DiceRoller.rollThresholdStat();
            stats.push(total);
            const sorted = [...rolls].sort((a, b) => b - a);
            const kept = sorted.slice(0, 3);
            response += `Stat ${i + 1}: [${kept.join(', ')}] = ${total}\n`;
        }
        const total = stats.reduce((sum, s) => sum + s, 0);
        const average = (total / 6).toFixed(1);
        response += `**Scores**: ${stats.join(', ')}\n`;
        response += `**Total**: ${total} | **Average**: ${average}\n`;
        if (set < 3)
            response += '\n';
    }
    await sendMessage(channelId, response);
}
/**
 * Handle Dragon Age threshold stats (3 sets of 8 stats)
 */
async function handleDragonAgeThreshold(channelId) {
    let response = '🎲 **Dragon Age Threshold Stats (4d6, reroll 1s/2s, drop lowest)**\n';
    response += '─'.repeat(50) + '\n\n';
    for (let set = 1; set <= 3; set++) {
        const stats = [];
        response += `**Set ${set}:**\n`;
        for (let i = 0; i < 8; i++) {
            const { total, rolls } = dice_1.DiceRoller.rollThresholdStat();
            stats.push(total);
            const sorted = [...rolls].sort((a, b) => b - a);
            const kept = sorted.slice(0, 3);
            response += `Stat ${i + 1}: [${kept.join(', ')}] = ${total}\n`;
        }
        const total = stats.reduce((sum, s) => sum + s, 0);
        const average = (total / 8).toFixed(1);
        response += `**Scores**: ${stats.join(', ')}\n`;
        response += `**Total**: ${total} | **Average**: ${average}\n`;
        if (set < 3)
            response += '\n';
    }
    await sendMessage(channelId, response);
}
/**
 * Get help message
 */
function getHelpMessage(category) {
    if (!category) {
        // Main help - show categories
        return `**Mojave D&D Bot** 🎲⚔️🎭

**Help Categories:**
\`!help dice\` - Dice rolling commands
\`!help init\` or \`!help initiative\` - Combat tracker
\`!help status\` - Status effects & conditions
\`!help all\` - Show everything

**Quick Commands:**
\`!roll 2d20+5\` - Roll dice
\`!init add Fighter 18 25 25\` - Start combat
\`!statusadd Fighter blessed\` - Apply condition
\`!break\` or \`!br\` - Insert visual separator

Type \`!help <category>\` for detailed commands!`;
    }
    const cat = category.toLowerCase();
    // Dice help
    if (cat === 'dice' || cat === 'roll') {
        return `**🎲 Dice Rolling Commands**

**Basic Rolls:**
\`!roll <dice>\` or \`!r <dice>\`
Examples: \`!r d20\`, \`!r 3d6+5\`, \`!r 2d20-3\`

**Modifiers:**
\`khN\` - Keep highest N (e.g., \`!r 4d6kh3\`)
\`klN\` - Keep lowest N (e.g., \`!r 2d20kl1\`)
\`rrN\` - Reroll ≤N (e.g., \`!r 4d6rr1\`)
\`rrNkhZ\` - Combine (e.g., \`!r 4d6rr1kh3\`)

**Advantage/Disadvantage:**
\`!adv [+mod]\` or \`!advantage\` - Roll with advantage
\`!dis [+mod]\` or \`!disadvantage\` - Roll with disadvantage
\`!r d20+5 adv\` - Can add to any d20 roll

**Character Creation:**
\`!stats\` - Generate 6 ability scores (4d6kh3)
\`!threshold\` - 3 sets of D&D threshold stats (6 each)
\`!dagethreshold\` - 3 sets of Dragon Age stats (8 each)

**Other Systems:**
\`!fate [count]\` - FATE/Fudge dice (default 4dF)
\`!sr <count>\` - Shadowrun dice (count 5s & 6s)

**Examples:**
\`!r 1d20+5\` - Attack roll
\`!r 8d6\` - Fireball damage
\`!r 4d6kh3\` - Ability score
\`!r 4d6rr1kh3\` - Reroll 1s, keep highest 3
\`!adv +3\` - Advantage with +3 modifier`;
    }
    // Initiative help
    if (cat === 'init' || cat === 'initiative' || cat === 'combat') {
        return `**⚔️ Initiative Tracker Commands**

**Basic Commands:**
\`!init\` - Show initiative tracker
\`!init add <n> <init> [hp] [max]\` - Add combatant
\`!init hidden <n> <init> [hp] [max]\` - Add with hidden HP
\`!init next\` - Next turn (pings player, auto-ticks status)
\`!init prev\` - Previous turn
\`!init clear\` - End combat

**HP Management:**
\`!init damage <n> <amount>\` - Deal damage
\`!init heal <n> <amount>\` - Heal damage
Examples: \`!init damage Goblin 5\`, \`!init heal Fighter 10\`

**Managing Combatants:**
\`!init remove <n>\` - Remove from initiative
Multi-word names: \`!init add "Goblin Boss" 16 30 30\`

**Short Aliases:**
\`!ia\` = initadd | \`!ih\` = inithidden | \`!in\` = initnext
\`!ip\` = initprev | \`!id\` = initdamage | \`!ir\` = initremove

**Features:**
- Hidden HP shows status (Healthy 💚, Injured 💛, etc.)
- Automatic turn pinging (mentions players)
- Status effects show inline
- Per-channel tracking

**Example Combat:**
\`!init add Fighter 18 25 25\`
\`!init hidden Goblin 15 7 7\`
\`!init next\` → [@Fighter] Fighter's turn!
\`!init damage Goblin 5\`
\`!init next\` → Goblin's turn`;
    }
    // Status help
    if (cat === 'status' || cat === 'condition' || cat === 'conditions' || cat === 'effect' || cat === 'effects') {
        return `**🎭 Status Effects Commands**

**Viewing Effects:**
\`!status\` - Show all active effects (summary)
\`!status <n>\` - Show effects for combatant (with descriptions)
\`!conditions\` - List all available D&D 5e conditions
\`!init\` - Effects show inline in tracker

**Adding Effects:**
\`!statusadd <n> <condition> [rounds]\`
\`!sa <n> <condition> [rounds]\` - Short alias
Examples:
- \`!sa Fighter blessed\` - Indefinite
- \`!sa Goblin poisoned 3\` - Lasts 3 rounds
- \`!sa Wizard concentrating 10\` - 10 rounds

**Removing Effects:**
\`!statusremove <n> [condition]\`
\`!sr <n> [condition]\` - Short alias
Examples:
- \`!sr Fighter poisoned\` - Remove specific
- \`!sr Fighter\` - Remove all from Fighter

**Duration Management:**
\`!statustick\` or \`!stk\` - Manually advance durations
⚡ **Auto-tick:** Durations decrease automatically at start of each round when using \`!init next\`

**Clearing:**
\`!statusclear\` - Remove all effects from everyone

**Available Conditions:**
**Core D&D 5e:**
blinded, charmed, deafened, frightened, grappled, incapacitated, invisible, paralyzed, petrified, poisoned, prone, restrained, stunned, unconscious, exhaustion, concentrating

**Custom:**
blessed, baned, hasted, slowed, dodging, hiding, raging, marked

Use \`!conditions\` to see emojis and \`!status <n> <condition>\` for full rules!`;
    }
    // All help
    if (cat === 'all' || cat === 'full' || cat === 'everything') {
        return `**Mojave D&D Bot - Complete Command Reference** 🎲⚔️🎭

**DICE ROLLING**
\`!roll <dice>\`, \`!r\` - Basic rolls (2d20+5, 4d6kh3, 4d6rr1kh3)
\`!adv\`, \`!dis\` - Advantage/Disadvantage
\`!stats\`, \`!threshold\`, \`!dagethreshold\` - Character gen
\`!fate\`, \`!sr <n>\` - Other systems

**INITIATIVE**
\`!init\` - Show | \`!init add\` - Add combatant
\`!init hidden\` - Add hidden HP | \`!init next\` - Next turn
\`!init damage/heal\` - HP | \`!init remove\` - Remove
\`!init clear\` - End combat
Aliases: !ia, !ih, !in, !ip, !id, !ir

**STATUS EFFECTS**
\`!status\` - Show | \`!statusadd\` - Add effect
\`!statusremove\` - Remove | \`!statustick\` - Advance
\`!conditions\` - List all | \`!statusclear\` - Clear all
Aliases: !sa, !sr, !stk
Auto-tick on \`!init next\`

**UTILITY**
\`!break\` or \`!br\` - Insert visual separator
\`!ping\` - Test connection

**FLEXIBILITY**
Both formats work:
\`!initadd\` = \`!init add\`
\`!statusadd\` = \`!status add\`

Type \`!help <category>\` for detailed help:
\`!help dice\` | \`!help init\` | \`!help status\``;
    }
    // Unknown category
    return `❌ Unknown help category: **${category}**

Available categories:
\`!help dice\` - Dice rolling
\`!help init\` - Initiative tracker
\`!help status\` - Status effects
\`!help all\` - Everything

Or just \`!help\` for main menu`;
}
/**
 * Send message
 */
async function sendMessage(channelId, content) {
    await server_bot_1.rootServer.community.channelMessages.create({ channelId, content });
}
// ============================================
// INITIATIVE COMMAND HANDLERS
// ============================================
async function handleInitShow(channelId) {
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, display);
}
async function handleInitAdd(channelId, args, userId) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initadd <n> <initiative> [hp] [max_hp]`\nExample: `!initadd Fighter 18 25 25`');
        return;
    }
    const name = args[0];
    const initiative = parseInt(args[1]);
    const hp = args.length > 2 ? parseInt(args[2]) : undefined;
    const maxHp = args.length > 3 ? parseInt(args[3]) : undefined;
    if (isNaN(initiative)) {
        await sendMessage(channelId, '❌ Initiative must be a number');
        return;
    }
    initiativeTracker.addCombatant(channelId, name, initiative, hp, maxHp, false, false, userId);
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `✅ Added **${name}** (${initiative})\n\n${display}`);
}
async function handleInitHidden(channelId, args, userId) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!inithidden <n> <initiative> [hp] [max_hp]`');
        return;
    }
    const name = args[0];
    const initiative = parseInt(args[1]);
    const hp = args.length > 2 ? parseInt(args[2]) : undefined;
    const maxHp = args.length > 3 ? parseInt(args[3]) : undefined;
    if (isNaN(initiative)) {
        await sendMessage(channelId, '❌ Initiative must be a number');
        return;
    }
    initiativeTracker.addCombatant(channelId, name, initiative, hp, maxHp, true, true, userId);
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `✅ Added **${name}** (${initiative}) 🔒\n\n${display}`);
}
async function handleInitNext(channelId) {
    const combatant = initiativeTracker.nextTurn(channelId);
    if (!combatant) {
        await sendMessage(channelId, '❌ No combatants in initiative!');
        return;
    }
    // Auto-tick status durations at start of each round (when current turn wraps to 0)
    const session = initiativeTracker.sessions.get(channelId);
    if (session && session.currentTurn === 0 && session.roundNumber > 1) {
        const expired = statusTracker.tickDurations(channelId);
        if (expired.length > 0) {
            let expiredMsg = '\n⏰ **Effects expired:**\n';
            expired.forEach(e => expiredMsg += `- ${e}\n`);
            await sendMessage(channelId, expiredMsg);
        }
    }
    // Root uses markdown link format for mentions: [@name](root://user/userId)
    let ping = '';
    if (combatant.userId) {
        ping = `[@${combatant.name}](root://user/${combatant.userId}) `;
    }
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `${ping}**${combatant.name}'s turn!**\n\n${display}`);
}
async function handleInitPrev(channelId) {
    const combatant = initiativeTracker.previousTurn(channelId);
    if (!combatant) {
        await sendMessage(channelId, '❌ No combatants in initiative!');
        return;
    }
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `**Back to ${combatant.name}'s turn**\n\n${display}`);
}
async function handleInitDamage(channelId, args) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initdamage <n> <amount>` or `!id <n> <amount>`');
        return;
    }
    const amount = parseInt(args[args.length - 1]);
    const name = args.slice(0, -1).join(' ');
    if (isNaN(amount)) {
        await sendMessage(channelId, '❌ Amount must be a number');
        return;
    }
    const newHp = initiativeTracker.damage(channelId, name, amount);
    if (newHp === null) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const status = newHp === 0 ? ' 💀' : '';
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `⚔️ **${name}** takes ${amount} damage!${status}\n\n${display}`);
}
async function handleInitHeal(channelId, args) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initheal <n> <amount>`');
        return;
    }
    const amount = parseInt(args[args.length - 1]);
    const name = args.slice(0, -1).join(' ');
    if (isNaN(amount)) {
        await sendMessage(channelId, '❌ Amount must be a number');
        return;
    }
    const newHp = initiativeTracker.heal(channelId, name, amount);
    if (newHp === null) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `💚 **${name}** healed ${amount} HP!\n\n${display}`);
}
async function handleInitRemove(channelId, args) {
    if (args.length === 0) {
        await sendMessage(channelId, 'Usage: `!initremove <n>` or `!ir <n>`');
        return;
    }
    const name = args.join(' ');
    const removed = initiativeTracker.removeCombatant(channelId, name);
    if (!removed) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const display = initiativeTracker.getDisplay(channelId, false, statusTracker);
    await sendMessage(channelId, `✅ Removed **${name}**\n\n${display}`);
}
async function handleInitClear(channelId) {
    const cleared = initiativeTracker.clearInitiative(channelId);
    statusTracker.clearChannel(channelId);
    // Save state after clearing
    persistence.saveInitiativeData(initiativeTracker.exportData());
    persistence.saveStatusData(statusTracker.exportData());
    if (!cleared) {
        await sendMessage(channelId, '❌ No active initiative session');
        return;
    }
    await sendMessage(channelId, '✅ Initiative and status effects cleared!');
}
// ============================================
// STATUS COMMAND HANDLERS
// ============================================
async function handleStatusShow(channelId, args) {
    if (args.length === 0) {
        // Show all status effects
        const display = statusTracker.formatStatuses(channelId);
        await sendMessage(channelId, display);
    }
    else if (args.length === 1) {
        // Could be combatant name OR condition lookup
        const input = args[0].toLowerCase();
        // Check if it's a condition name
        if (status_1.DND_CONDITIONS[input]) {
            const condition = status_1.DND_CONDITIONS[input];
            let output = `**${input.charAt(0).toUpperCase() + input.slice(1)}** ${condition.emoji}\n\n`;
            output += condition.description;
            await sendMessage(channelId, output);
        }
        else {
            // Treat as combatant name
            const name = args[0];
            const display = statusTracker.formatStatuses(channelId, name);
            await sendMessage(channelId, display);
        }
    }
    else {
        // Multiple args - treat as combatant name (for multi-word names)
        const name = args.join(' ');
        const display = statusTracker.formatStatuses(channelId, name);
        await sendMessage(channelId, display);
    }
}
async function handleStatusAdd(channelId, args) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!statusadd <n> <condition> [rounds]` or `!sa <n> <condition> [rounds]`\nExample: `!statusadd Fighter poisoned 3`');
        return;
    }
    const name = args[0];
    const condition = args[1];
    const duration = args.length > 2 ? parseInt(args[2]) : undefined;
    if (duration !== undefined && isNaN(duration)) {
        await sendMessage(channelId, '❌ Duration must be a number');
        return;
    }
    try {
        statusTracker.addStatus(channelId, name, condition, duration);
        const durationStr = duration !== undefined ? ` for ${duration} rounds` : '';
        await sendMessage(channelId, `✅ Added **${condition}** to **${name}**${durationStr}`);
    }
    catch (error) {
        await sendMessage(channelId, `❌ ${error instanceof Error ? error.message : 'Error occurred'}`);
    }
}
async function handleStatusRemove(channelId, args) {
    if (args.length === 0) {
        await sendMessage(channelId, 'Usage: `!statusremove <n> [condition]` or `!sr <n> [condition]`\nExample: `!sr Fighter poisoned` or `!sr Fighter` (removes all)');
        return;
    }
    const name = args[0];
    const condition = args.length > 1 ? args[1] : undefined;
    const removed = statusTracker.removeStatus(channelId, name, condition);
    if (!removed) {
        if (condition) {
            await sendMessage(channelId, `❌ **${name}** doesn't have **${condition}**`);
        }
        else {
            await sendMessage(channelId, `❌ **${name}** has no status effects`);
        }
        return;
    }
    if (condition) {
        await sendMessage(channelId, `✅ Removed **${condition}** from **${name}**`);
    }
    else {
        await sendMessage(channelId, `✅ Removed all status effects from **${name}**`);
    }
}
async function handleStatusTick(channelId) {
    const expired = statusTracker.tickDurations(channelId);
    if (expired.length === 0) {
        await sendMessage(channelId, '⏰ Status effects updated (no effects expired)');
    }
    else {
        let msg = '⏰ **Status effects expired:**\n';
        expired.forEach(e => msg += `- ${e}\n`);
        await sendMessage(channelId, msg);
    }
}
async function handleStatusClear(channelId) {
    statusTracker.clearChannel(channelId);
    await sendMessage(channelId, '✅ All status effects cleared!');
}
async function handleConditionsList(channelId) {
    let output = '**📋 D&D 5e Conditions & Custom Effects**\n\n';
    output += '**Core D&D 5e Conditions:**\n';
    output += 'blinded 👁️, charmed 💖, deafened 🔇, frightened 😱, grappled 🤝, incapacitated 😵, invisible 👻, paralyzed 🥶, petrified 🗿, poisoned ☠️, prone ⬇️, restrained ⛓️, stunned 💫, unconscious 😴, exhaustion 😮‍💨, concentrating 🎯\n\n';
    output += '**Custom Effects:**\n';
    output += 'blessed ✨, baned 💀, hasted ⚡, slowed 🐌, dodging 🛡️, hiding 🌫️, raging 😡, marked 🎯\n\n';
    output += '**View Full Description:**\n';
    output += '\`!status <condition>\` - See complete D&D 5e rules\n';
    output += 'Examples: \`!status poisoned\`, \`!status paralyzed\`\n\n';
    output += '**Apply to Combatant:**\n';
    output += '\`!statusadd <name> <condition> [rounds]\`\n';
    output += 'Example: \`!sa Goblin poisoned 3\`';
    await sendMessage(channelId, output);
}
// ============================================
// HELP COMMAND HANDLER
// ============================================
async function handleHelp(channelId, args) {
    const category = args.length > 0 ? args[0] : undefined;
    const helpText = getHelpMessage(category);
    await sendMessage(channelId, helpText);
}
// ============================================
// UTILITY COMMANDS
// ============================================
async function handleBreak(channelId) {
    // Mobile-friendly separator (compact for small screens)
    const separator = `─────────────────────
 
─────────────────────`;
    await sendMessage(channelId, separator);
}
