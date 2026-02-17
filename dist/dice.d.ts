/**
 * Dice Rolling System - Ported from Fatebinder
 * All features: advantage, disadvantage, keep highest/lowest, rerolls, FATE, Shadowrun, etc.
 */
interface DiceResult {
    expression: string;
    total: number;
    rolls: number[];
    details: string;
    criticalSuccess?: boolean;
    criticalFailure?: boolean;
}
export declare class DiceRoller {
    /**
     * Parse and roll dice expression
     * Supports: XdY, XdY+Z, XdYkhN, XdYklN, XdYrrN, XdYrrNkhZ, XdYrrNklZ
     */
    static roll(expression: string): DiceResult;
    /**
     * Roll with advantage (2d20 keep highest)
     */
    static rollAdvantage(): DiceResult;
    /**
     * Roll with disadvantage (2d20 keep lowest)
     */
    static rollDisadvantage(): DiceResult;
    /**
     * Generate D&D ability scores (4d6 drop lowest, 6 times)
     */
    static rollStats(): {
        scores: number[];
        details: string[];
    };
    /**
     * Roll FATE/Fudge dice
     */
    static rollFate(count?: number): DiceResult;
    /**
     * Roll Shadowrun dice (count 5s and 6s as hits)
     */
    static rollShadowrun(count: number): DiceResult;
    /**
     * Roll threshold stats (4d6, reroll 1s and 2s, drop lowest)
     */
    static rollThresholdStat(): {
        total: number;
        rolls: number[];
    };
}
export {};
