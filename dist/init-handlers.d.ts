/**
 * Initiative Command Handlers
 */
import { ChannelGuid } from "@rootsdk/server-bot";
import { InitiativeTracker } from './initiative';
/**
 * Show initiative tracker
 */
export declare function handleInitShow(tracker: InitiativeTracker, channelId: ChannelGuid, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Add combatant to initiative
 */
export declare function handleInitAdd(tracker: InitiativeTracker, channelId: ChannelGuid, args: string[], userId: string, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Add combatant with hidden HP
 */
export declare function handleInitHidden(tracker: InitiativeTracker, channelId: ChannelGuid, args: string[], userId: string, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Next turn
 */
export declare function handleInitNext(tracker: InitiativeTracker, channelId: ChannelGuid, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Previous turn
 */
export declare function handleInitPrev(tracker: InitiativeTracker, channelId: ChannelGuid, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Deal damage
 */
export declare function handleInitDamage(tracker: InitiativeTracker, channelId: ChannelGuid, args: string[], sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Heal
 */
export declare function handleInitHeal(tracker: InitiativeTracker, channelId: ChannelGuid, args: string[], sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Remove combatant
 */
export declare function handleInitRemove(tracker: InitiativeTracker, channelId: ChannelGuid, args: string[], sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
/**
 * Clear initiative
 */
export declare function handleInitClear(tracker: InitiativeTracker, channelId: ChannelGuid, sendMessage: (channelId: ChannelGuid, content: string) => Promise<void>): Promise<void>;
