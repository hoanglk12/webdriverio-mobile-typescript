import { BasePage } from './BasePage';

/**
 * Event Detail Page Object (FrontRow)
 * Reached by tapping an event card from the Events screen. Shows title, artist,
 * date, venue, a buy button priced per event, and a reviews entry point.
 *
 * Selector strategy — same Android resource-id convention as `EventsPage` (see
 * its header comment for the full rationale): this React Native build's
 * testIDs surface as Android `resource-id`, not `content-desc`, so every
 * selector below uses `-android uiautomator` + `resourceId(...)`.
 * Verified live 23 Sep 2026 via `adb shell uiautomator dump`:
 * `screen.eventDetail`, `eventDetail.title`, `eventDetail.buyButton`, and
 * `eventDetail.reviewsButton` all carry a resource-id. Artist, date, and venue
 * are plain `TextView`s with neither a resource-id nor a content-desc — matched
 * by exact rendered text instead, the same strategy `EventsPage` uses for its
 * text-only empty-state copy.
 */
export class EventDetailPage extends BasePage {
  private get screenContainer() {
    return $('android=new UiSelector().resourceId("screen.eventDetail")');
  }

  private get title() {
    return $('android=new UiSelector().resourceId("eventDetail.title")');
  }

  private get buyButton() {
    return $('android=new UiSelector().resourceId("eventDetail.buyButton")');
  }

  private get reviewsButton() {
    return $('android=new UiSelector().resourceId("eventDetail.reviewsButton")');
  }

  /**
   * Parameterized getter for an exact-text element (artist, date, or venue —
   * none of which carry a resource-id on this screen).
   * @param text - Exact rendered text to match
   */
  private textElement(text: string) {
    return $(`android=new UiSelector().text("${text}")`);
  }

  /**
   * Wait for the Event Detail screen to finish loading.
   */
  async waitForEventDetailPage(): Promise<void> {
    await this.waitForElementDisplayed(this.screenContainer, 15000);
  }

  /**
   * Check if the Event Detail screen is displayed
   */
  async isEventDetailPageDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.screenContainer);
  }

  /**
   * Check if the event title is displayed
   */
  async isTitleDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.title);
  }

  /**
   * Get the event title's rendered text
   */
  async getTitleText(): Promise<string> {
    return await this.getText(this.title);
  }

  /**
   * Check if the given artist name is displayed
   * @param artist - Exact rendered artist text
   */
  async isArtistDisplayed(artist: string): Promise<boolean> {
    return await this.isDisplayed(this.textElement(artist));
  }

  /**
   * Check if the given event date is displayed
   * @param date - Exact rendered date text
   */
  async isDateDisplayed(date: string): Promise<boolean> {
    return await this.isDisplayed(this.textElement(date));
  }

  /**
   * Check if the given venue is displayed
   * @param venue - Exact rendered venue text
   */
  async isVenueDisplayed(venue: string): Promise<boolean> {
    return await this.isDisplayed(this.textElement(venue));
  }

  /**
   * Check if the buy button is displayed
   */
  async isBuyButtonDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.buyButton);
  }

  /**
   * Check if the reviews button is displayed
   */
  async isReviewsButtonDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.reviewsButton);
  }
}

export default new EventDetailPage();
