
export type SignableMessageType = 'PLAIN_TEXT' | 'CUSTOM_TRANSACTION' | 'CUSTOM_DATA';
export const SIGNABLE_MESSAGE_TYPES = new Set<SignableMessageType>(
    ['PLAIN_TEXT', 'CUSTOM_TRANSACTION', 'CUSTOM_DATA']);
