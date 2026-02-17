/**
 * Dice Roller - Complete implementation with all Fatebinder features
 */
export interface RollResult {
    expression: string;
    total: number;
    rolls: number[];
    keptRolls?: number[];
    details: string;
    criticalSuccess?: boolean;
    criticalFailure?: boolean;
}
export declare class DiceRoller {
    /**
     * Roll standard dice expression
     * Supports: XdY, XdY+Z, XdYkhN, XdYklN, XdYrrN
     */
    static roll(expression: string): RollResult;
    /**
     * Roll with advantage (2d20 keep highest)
     */
    static rollAdvantage(): RollResult;
    /**
     * Roll with disadvantage (2d20 keep lowest)
     */
    static rollDisadvantage(): RollResult;
    /**
     * Roll ability scores (4d6 drop lowest, 6 times)
     */
    static rollStats(): Array<{
        total: number;
        details: string;
    }>;
    /**
     * Roll FATE dice
     */
    static rollFate(count?: number): RollResult;
    /**
     * Roll Shadowrun dice (count 5s and 6s)
     */
    static rollShadowrun(count: number): RollResult;
    /**
     * Roll D&D threshold stat (4d6, reroll 1s and 2s, drop lowest)
     */
    static rollThresholdStat(): {
        total: number;
        rolls: number[];
    };
}
