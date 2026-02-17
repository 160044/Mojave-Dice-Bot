"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInitShow = handleInitShow;
exports.handleInitAdd = handleInitAdd;
exports.handleInitHidden = handleInitHidden;
exports.handleInitNext = handleInitNext;
exports.handleInitPrev = handleInitPrev;
exports.handleInitDamage = handleInitDamage;
exports.handleInitHeal = handleInitHeal;
exports.handleInitRemove = handleInitRemove;
exports.handleInitClear = handleInitClear;
/**
 * Show initiative tracker
 */
async function handleInitShow(tracker, channelId, sendMessage) {
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, display);
}
/**
 * Add combatant to initiative
 */
async function handleInitAdd(tracker, channelId, args, userId, sendMessage) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initadd <name> <initiative> [hp] [max_hp]`\nExample: `!initadd Fighter 18 25 25`');
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
    tracker.addCombatant(channelId, name, initiative, hp, maxHp, false, false, userId);
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `✅ Added **${name}** (${initiative})\n\n${display}`);
}
/**
 * Add combatant with hidden HP
 */
async function handleInitHidden(tracker, channelId, args, userId, sendMessage) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!inithidden <name> <initiative> [hp] [max_hp]`');
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
    tracker.addCombatant(channelId, name, initiative, hp, maxHp, true, true, userId);
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `✅ Added **${name}** (${initiative}) 🔒\n\n${display}`);
}
/**
 * Next turn
 */
async function handleInitNext(tracker, channelId, sendMessage) {
    const combatant = tracker.nextTurn(channelId);
    if (!combatant) {
        await sendMessage(channelId, '❌ No combatants in initiative!');
        return;
    }
    const ping = combatant.userId ? `<@${combatant.userId}> ` : '';
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `${ping}**${combatant.name}'s turn!**\n\n${display}`);
}
/**
 * Previous turn
 */
async function handleInitPrev(tracker, channelId, sendMessage) {
    const combatant = tracker.previousTurn(channelId);
    if (!combatant) {
        await sendMessage(channelId, '❌ No combatants in initiative!');
        return;
    }
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `**Back to ${combatant.name}'s turn**\n\n${display}`);
}
/**
 * Deal damage
 */
async function handleInitDamage(tracker, channelId, args, sendMessage) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initdamage <name> <amount>` or `!id <name> <amount>`');
        return;
    }
    // Parse: last arg is amount, rest is name
    const amount = parseInt(args[args.length - 1]);
    const name = args.slice(0, -1).join(' ');
    if (isNaN(amount)) {
        await sendMessage(channelId, '❌ Amount must be a number');
        return;
    }
    const newHp = tracker.damage(channelId, name, amount);
    if (newHp === null) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const status = newHp === 0 ? ' 💀' : '';
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `⚔️ **${name}** takes ${amount} damage!${status}\n\n${display}`);
}
/**
 * Heal
 */
async function handleInitHeal(tracker, channelId, args, sendMessage) {
    if (args.length < 2) {
        await sendMessage(channelId, 'Usage: `!initheal <name> <amount>`');
        return;
    }
    const amount = parseInt(args[args.length - 1]);
    const name = args.slice(0, -1).join(' ');
    if (isNaN(amount)) {
        await sendMessage(channelId, '❌ Amount must be a number');
        return;
    }
    const newHp = tracker.heal(channelId, name, amount);
    if (newHp === null) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `💚 **${name}** healed ${amount} HP!\n\n${display}`);
}
/**
 * Remove combatant
 */
async function handleInitRemove(tracker, channelId, args, sendMessage) {
    if (args.length === 0) {
        await sendMessage(channelId, 'Usage: `!initremove <name>` or `!ir <name>`');
        return;
    }
    const name = args.join(' ');
    const removed = tracker.removeCombatant(channelId, name);
    if (!removed) {
        await sendMessage(channelId, `❌ Not found: ${name}`);
        return;
    }
    const display = tracker.getDisplay(channelId);
    await sendMessage(channelId, `✅ Removed **${name}**\n\n${display}`);
}
/**
 * Clear initiative
 */
async function handleInitClear(tracker, channelId, sendMessage) {
    const cleared = tracker.clearInitiative(channelId);
    if (!cleared) {
        await sendMessage(channelId, '❌ No active initiative session');
        return;
    }
    await sendMessage(channelId, '✅ Initiative cleared!');
}
