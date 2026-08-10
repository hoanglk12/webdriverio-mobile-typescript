import { BasePage } from './BasePage';

/**
 * Events Page Object (FrontRow home screen)
 * Represents the landing screen the app opens on: search, sort,
 * genre filter chips, and the event list.
 *
 * Selector strategy — Android only, deliberately:
 * This React Native build exposes its stable `testID`s as Android
 * `resource-id` (verified live: `events.searchInput`, `events.filterChip.all`,
 * …). Two consequences:
 *   - Appium's accessibility-id strategy (`~`) matches `content-desc`, which
 *     here carries the *localized human label* ("Search events", "All"), not
 *     the testID — so `~events.searchInput` does NOT resolve on Android.
 *   - The plain `id` strategy also fails, because these resource-ids have no
 *     `package:id/` prefix; only an exact UiAutomator `resourceId(...)` match
 *     finds them.
 * Hence every selector below uses `-android uiautomator` + `resourceId(...)`.
 * iOS would surface the same testIDs as accessibility ids (`~<testID>`), but
 * there is no iOS device to verify that here — when iOS support is added,
 * introduce `iosX` getters and route through `this.executePlatformSpecific()`
 * per the repo convention rather than assuming the mapping.
 */
export class EventsPage extends BasePage {
  private get searchInput() {
    return $('android=new UiSelector().resourceId("events.searchInput")');
  }

  private get sortButton() {
    return $('android=new UiSelector().resourceId("events.sortButton")');
  }

  private get filterRow() {
    return $('android=new UiSelector().resourceId("events.filterRow")');
  }

  private get eventList() {
    return $('android=new UiSelector().resourceId("events.list")');
  }

  /**
   * Parameterized getter for a genre filter chip by its testID slug.
   * @param slug - Chip slug, e.g. "all", "indie-rock", "j-pop"
   */
  private filterChip(slug: string) {
    return $(`android=new UiSelector().resourceId("events.filterChip.${slug}")`);
  }

  /**
   * Wait for the Events screen to finish loading.
   * The event list is the most reliable "loaded" indicator.
   */
  async waitForEventsPage(): Promise<void> {
    await this.waitForElementDisplayed(this.eventList, 15000);
  }

  /**
   * Check if the Events screen is displayed
   */
  async isEventsPageDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.eventList);
  }

  /**
   * Check if the search bar is displayed
   */
  async isSearchBarDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.searchInput);
  }

  /**
   * Check if the sort button is displayed
   */
  async isSortButtonDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.sortButton);
  }

  /**
   * Check if the filter chip row is displayed
   */
  async isFilterRowDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.filterRow);
  }

  /**
   * Check if a single filter chip is displayed
   * @param slug - Chip testID slug (e.g. "all", "favorites")
   */
  async isFilterChipDisplayed(slug: string): Promise<boolean> {
    return await this.isDisplayed(this.filterChip(slug));
  }

  /**
   * Check that every named filter chip is displayed.
   * The chip row is a horizontally virtualized list — chips scrolled off-screen
   * are not in the view hierarchy — so pass only slugs expected to be on-screen
   * (e.g. the fresh signed-out set in `frontRow.filterChipSlugs`).
   * @param slugs - Chip testID slugs to verify
   */
  async areAllFilterChipsDisplayed(slugs: string[]): Promise<boolean> {
    for (const slug of slugs) {
      const displayed = await this.isFilterChipDisplayed(slug);
      if (!displayed) {
        return false;
      }
    }
    return true;
  }
}

export default new EventsPage();
