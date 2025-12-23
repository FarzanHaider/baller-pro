export type ReferralStatus = 'Pending' | 'Confirmed' | 'Rewarded';

export interface Referral {
  id: string;
  email: string;
  date: string;
  status: ReferralStatus;
}
