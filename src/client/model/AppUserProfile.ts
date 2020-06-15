import {Network} from "ferrum-plumbing";

export interface AddressDetails {
  network: Network;
  currency: string;
  symbol: string;
  address: string;
  addressWithChecksum?: string;
  humanReadableAddress: string;
  addressType: string;
  balance: string;
  pendingForWithdrawal: string;
  pendingForDeposit: string;
}

export interface UserAccountGroup {
  id: string;
  addresses: AddressDetails[];
}

export interface AppUserProfile {
  userId: string;
  displayName: string;
  appId: string;
  email?: string;
  accountGroups: UserAccountGroup[];
}
