import NativeTikTokBusiness from './native/NativeTikTokBusiness';
import type {
  TikTokConfig,
  UserIdentity,
  EventProperties,
  ContentEventProperties,
  AdRevenueData,
} from './types';
import { TikTokEventName, TikTokContentEventName } from './types';

/**
 * TikTokBusiness singleton — the main entry point for tracking events
 * through the TikTok Business SDK in React Native.
 */
export class TikTokBusiness {
  private static instance: TikTokBusiness;
  private initialized = false;

  private constructor() {}

  /**
   * Returns the singleton instance of TikTokBusiness.
   */
  static getInstance(): TikTokBusiness {
    if (!TikTokBusiness.instance) {
      TikTokBusiness.instance = new TikTokBusiness();
    }
    return TikTokBusiness.instance;
  }

  /**
   * Whether the SDK has been initialized.
   */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Initialize the TikTok Business SDK.
   *
   * @param config - SDK configuration including appId, tiktokAppId, and accessToken.
   * @returns A promise that resolves with a status message.
   */
  async initialize(config: TikTokConfig): Promise<string> {
    const tiktokAppId = this.normalizeTikTokAppId(config.tiktokAppId);
    const result = await NativeTikTokBusiness.initializeSdk(
      config.appId,
      tiktokAppId,
      config.accessToken,
      config.debug ?? false
    );
    this.initialized = true;
    return result;
  }

  /**
   * Identify the current user for attribution.
   *
   * @param identity - User identity data.
   * @returns A promise that resolves with a status message.
   */
  async identify(identity: UserIdentity): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.identify(
      identity.externalId,
      identity.externalUserName ?? '',
      identity.phoneNumber ?? '',
      identity.email ?? ''
    );
  }

  /**
   * Logout the current user, clearing identity data.
   *
   * @returns A promise that resolves with a status message.
   */
  async logout(): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.logout();
  }

  /**
   * Flush pending events to TikTok servers immediately.
   *
   * @returns A promise that resolves with a status message.
   */
  async flush(): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.flush();
  }

  /**
   * Track a standard TikTok event.
   *
   * @param eventName - One of the predefined TikTokEventName values.
   * @param eventId - Optional unique event identifier for deduplication.
   * @param properties - Optional key-value properties for the event.
   * @returns A promise that resolves with a status message.
   */
  async trackEvent(
    eventName: TikTokEventName,
    eventId?: string,
    properties?: EventProperties
  ): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.trackEvent(
      eventName,
      eventId ?? '',
      JSON.stringify(properties ?? {})
    );
  }

  /**
   * Track a content/e-commerce event (e.g., AddToCart, Purchase).
   *
   * @param eventName - One of the predefined TikTokContentEventName values.
   * @param properties - Optional content event properties including items.
   * @returns A promise that resolves with a status message.
   */
  async trackContentEvent(
    eventName: TikTokContentEventName,
    properties?: ContentEventProperties
  ): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.trackContentEvent(
      eventName,
      JSON.stringify(properties ?? {})
    );
  }

  /**
   * Track a custom event with an arbitrary name.
   *
   * @param eventName - Custom event name string.
   * @param properties - Optional key-value properties for the event.
   * @returns A promise that resolves with a status message.
   */
  async trackCustomEvent(
    eventName: string,
    properties?: EventProperties
  ): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.trackCustomEvent(
      eventName,
      JSON.stringify(properties ?? {})
    );
  }

  /**
   * Track an ad revenue event.
   *
   * @param adRevenueData - Ad revenue data including revenue, currency, and network info.
   * @param eventId - Optional unique event identifier for deduplication.
   * @returns A promise that resolves with a status message.
   */
  async trackAdRevenueEvent(
    adRevenueData: AdRevenueData,
    eventId?: string
  ): Promise<string> {
    this.assertInitialized();
    return NativeTikTokBusiness.trackAdRevenueEvent(
      JSON.stringify(adRevenueData),
      eventId ?? ''
    );
  }

  /**
   * Throws an error if the SDK has not been initialized.
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        'TikTokBusiness SDK is not initialized. Call initialize() first.'
      );
    }
  }

  /**
   * Normalizes the tiktokAppId to a comma-separated string.
   */
  private normalizeTikTokAppId(tiktokAppId: string | string[]): string {
    if (Array.isArray(tiktokAppId)) {
      if (tiktokAppId.length === 0) {
        throw new Error('tiktokAppId array must not be empty.');
      }
      return tiktokAppId.join(',');
    }
    if (!tiktokAppId || tiktokAppId.trim() === '') {
      throw new Error('tiktokAppId must not be empty.');
    }
    return tiktokAppId;
  }
}
