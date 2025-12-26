export interface Integration {
  id: string;
  name: string;
  statusText: string;
  isConnected: boolean;
  hasError?: boolean;
  iconName: any; // MaterialIcons name
  iconColor: string;
}
