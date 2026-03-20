import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Initialize the TikTok Business SDK.
   */
  initializeSdk(
    appId: string,
    tiktokAppId: string,
    accessToken: string,
    debug: boolean
  ): Promise<string>;

  /**
   * Identify the current user for attribution.
   */
  identify(
    externalId: string,
    externalUserName: string,
    phoneNumber: string,
    email: string
  ): Promise<string>;

  /**
   * Logout the current user.
   */
  logout(): Promise<string>;

  /**
   * Flush pending events to TikTok servers.
   */
  flush(): Promise<string>;

  /**
   * Track a standard TikTok event.
   */
  trackEvent(
    eventName: string,
    eventId: string,
    properties: string
  ): Promise<string>;

  /**
   * Track a content/e-commerce event.
   */
  trackContentEvent(
    eventType: string,
    properties: string
  ): Promise<string>;

  /**
   * Track a custom event.
   */
  trackCustomEvent(
    eventName: string,
    properties: string
  ): Promise<string>;

  /**
   * Track an ad revenue event.
   */
  trackAdRevenueEvent(
    adRevenueJson: string,
    eventId: string
  ): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNTikTokBusiness');
