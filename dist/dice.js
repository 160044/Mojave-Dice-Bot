"use strict";
/**
 * Dice Rolling System - Ported from Fatebinder
 * All features: advantage, disadvantage, keep highest/lowest, rerolls, FATE, Shadowrun, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiceRoller = void 0;
class DiceRoller {
    /**
     * Parse and roll dice expression
     * Supports: XdY, XdY+Z, XdYkhN, XdYklN, XdYrrN, XdYrrNkhZ, XdYrrNklZ
     */
    static roll(expression) {
        expression = expression.trim().replace(/\s/g, '');
        // Parse: (count)d(sides)(rr)(kh/kl)(bonus)
        // Updated regex to handle combinations like rr1kh3
        const match = expression.match(/^(\d*)d(\d+)(rr\d+)?(kh\d+|kl\d+)?([\+\-]\d+)?$/i);
        if (!match) {
            throw new Error(`Invalid dice expression: ${expression}`);
        }
        const count = parseInt(match[1] || '1');
        const sides = parseInt(match[2]);
        const rerollExpr = match[3]; // rr1
        const keepExpr = match[4]; // kh3 or kl1
        const bonus = parseInt(match[5] || '0');
        if (count < 1 || count > 100)
            throw new Error('Dice count must be 1-100');
        if (sides < 2 || sides > 1000)
            throw new Error('Dice sides must be 2-1000');
        // Roll dice
        let rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        let originalRolls = [...rolls];
        let modifierInfo = '';
        // Apply reroll first (if present)
        if (rerollExpr) {
            const rerollThreshold = parseInt(rerollExpr.substring(2));
            rolls = rolls.map(roll => {
                if (roll <= rerollThreshold) {
                    return Math.floor(Math.random() * sides) + 1;
                }
                return roll;
            });
            modifierInfo += ` (reroll ${rerollThreshold} or lower)`;
        }
        // Then apply keep highest/lowest (if present)
        let keptRolls = [...rolls];
        if (keepExpr) {
            const keepType = keepExpr.substring(0, 2).toLowerCase();
            const keepValue = parseInt(keepExpr.substring(2));
            if (keepType === 'kh') {
                // Keep highest N
                keptRolls = [...rolls].sort((a, b) => b - a).slice(0, keepValue);
                modifierInfo += ` (keep highest ${keepValue})`;
            }
            else if (keepType === 'kl') {
                // Keep lowest N
                keptRolls = [...rolls].sort((a, b) => a - b).slice(0, keepValue);
                modifierInfo += ` (keep lowest ${keepValue})`;
            }
        }
        const total = keptRolls.reduce((sum, r) => sum + r, 0) + bonus;
        // Build details string
        let details = '';
        if (rerollExpr && !keepExpr) {
            // Show rerolled values
            details = `Rolled: [${rolls.join(', ')}]`;
        }
        else if (rerollExpr && keepExpr) {
            // Show both reroll and keep
            details = `Rolled: [${rolls.join(', ')}] → Kept: [${keptRolls.join(', ')}]`;
        }
        else if (keepExpr) {
            // Just keep
            details = `Rolled: [${rolls.join(', ')}] → Kept: [${keptRolls.join(', ')}]`;
        }
        else {
            // Basic roll
            details = `Rolled: [${rolls.join(', ')}]`;
        }
        const bonusStr = bonus !== 0 ? ` ${bonus > 0 ? '+' : ''}${bonus}` : '';
        details += `${bonusStr} = **${total}**`;
        // Check for nat 20/nat 1 on d20
        const critSuccess = sides === 20 && count === 1 && keptRolls.includes(20);
        const critFailure = sides === 20 && count === 1 && keptRolls.includes(1);
        return {
            expression: expression + modifierInfo,
            total,
            rolls,
            details,
            criticalSuccess: critSuccess,
            criticalFailure: critFailure
        };
    }
    /**
     * Roll with advantage (2d20 keep highest)
     */
    static rollAdvantage() {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        const result = Math.max(roll1, roll2);
        return {
            expression: 'Advantage (2d20kh1)',
            total: result,
            rolls: [roll1, roll2],
            details: `Rolled: [${roll1}, ${roll2}] → **${result}**`,
            criticalSuccess: result === 20,
            criticalFailure: false
        };
    }
    /**
     * Roll with disadvantage (2d20 keep lowest)
     */
    static rollDisadvantage() {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        const result = Math.min(roll1, roll2);
        return {
            expression: 'Disadvantage (2d20kl1)',
            total: result,
            rolls: [roll1, roll2],
            details: `Rolled: [${roll1}, ${roll2}] → **${result}**`,
            criticalSuccess: false,
            criticalFailure: result === 1
        };
    }
    /**
     * Generate D&D ability scores (4d6 drop lowest, 6 times)
     */
    static rollStats() {
        const scores = [];
        const details = [];
        for (let i = 0; i < 6; i++) {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            const sorted = [...rolls].sort((a, b) => b - a);
            const kept = sorted.slice(0, 3);
            const total = kept.reduce((sum, r) => sum + r, 0);
            scores.push(total);
            details.push(`[${rolls.join(', ')}] → ${total}`);
        }
        return { scores, details };
    }
    /**
     * Roll FATE/Fudge dice
     */
    static rollFate(count = 4) {
        const symbols = ['-', ' ', '+'];
        const rolls = Array.from({ length: count }, () => symbols[Math.floor(Math.random() * 3)]);
        const total = rolls.reduce((sum, r) => sum + (r === '+' ? 1 : r === '-' ? -1 : 0), 0);
        return {
            expression: `${count}dF`,
            total,
            rolls: rolls,
            details: `[${rolls.join(' ')}] = **${total >= 0 ? '+' : ''}${total}**`
        };
    }
    /**
     * Roll Shadowrun dice (count 5s and 6s as hits)
     */
    static rollShadowrun(count) {
        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
        const hits = rolls.filter(r => r >= 5).length;
        const formatted = rolls.map(r => r >= 5 ? `**${r}**` : r.toString());
        return {
            expression: `${count}d6 (Shadowrun)`,
            total: hits,
            rolls,
            details: `[${formatted.join(', ')}] = **${hits} hit(s)**`
        };
    }
    /**
     * Roll threshold stats (4d6, reroll 1s and 2s, drop lowest)
     */
    static rollThresholdStat() {
        let rolls = Array.from({ length: 4 }, () => {
            let roll = Math.floor(Math.random() * 6) + 1;
            if (roll <= 2)
                roll = Math.floor(Math.random() * 6) + 1; // Reroll
            return roll;
        });
        const sorted = [...rolls].sort((a, b) => b - a);
        const kept = sorted.slice(0, 3);
        const total = kept.reduce((sum, r) => sum + r, 0);
        return { total, rolls };
    }
}
exports.DiceRoller = DiceRoller;
