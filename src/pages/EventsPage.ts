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
   * Collection of event cards currently rendered in the list.
   * Each card's testID is per-event (`events.item.<eventId>`, e.g. `events.item.evt_005`),
   * so cards are matched by resource-id prefix rather than an exact id.
   */
  private get eventCards() {
    return $$('android=new UiSelector().resourceIdMatches("events.item..*")');
  }

  /**
   * Parameterized getter for a genre filter chip by its testID slug.
   * @param slug - Chip slug, e.g. "all", "indie-rock", "j-pop"
   */
  private filterChip(slug: string) {
    return $(`android=new UiSelector().resourceId("events.filterChip.${slug}")`);
  }

  /**
   * Empty-state title and subtitle, shown in place of the event list when a
   * search or filter chip matches nothing. Verified live: this text has no
   * testID/resource-id (plain `View`/`TextView`), so it's matched on its
   * exact rendered text instead of the resourceId strategy used elsewhere
   * on this screen.
   */
  private get emptyStateTitle() {
    return $('android=new UiSelector().text("No events found")');
  }

  private get emptyStateSubtitle() {
    return $(
      'android=new UiSelector().text("Try a different search term or clear the filters above.")'
    );
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

  /**
   * Tap a genre filter chip by its testID slug, scoping the event list to that genre.
   * @param slug - Chip testID slug (e.g. "folk", "all")
   */
  async selectFilterChip(slug: string): Promise<void> {
    await this.click(this.filterChip(slug));
  }

  /**
   * Check whether the "no events found" empty state is displayed, shown in place of
   * the event list when the current search/filter combination matches nothing.
   */
  async isEmptyStateDisplayed(): Promise<boolean> {
    return (
      (await this.isDisplayed(this.emptyStateTitle)) &&
      (await this.isDisplayed(this.emptyStateSubtitle))
    );
  }

  /**
   * Search the event list by title, artist, or city.
   * The list filters live as the query text changes — there is no submit button/action.
   * `setValue` clears any existing query first, so this also replaces a prior search term.
   * @param term - Search text
   */
  async searchEvents(term: string): Promise<void> {
    await this.click(this.searchInput);
    await this.setValue(this.searchInput, term);
  }

  /**
   * Clear the search field, restoring the unfiltered event list.
   */
  async clearSearch(): Promise<void> {
    await this.setValue(this.searchInput, '');
  }

  /**
   * Number of event cards currently rendered in the list.
   */
  async getEventCount(): Promise<number> {
    const cards = await this.eventCards;
    return cards.length;
  }

  /**
   * Wait for the event list to settle at an expected card count.
   * The list re-filters live and asynchronously as the search query changes, so a count
   * read immediately after `searchEvents` can catch a transient in-between state.
   * @param expectedCount - Number of cards the list should settle at
   * @param timeout - Timeout in milliseconds
   */
  async waitForEventCount(expectedCount: number, timeout: number = 5000): Promise<void> {
    await browser.waitUntil(async () => (await this.getEventCount()) === expectedCount, {
      timeout,
      timeoutMsg: `Event list did not settle at ${expectedCount} card(s) within ${timeout}ms`,
    });
  }

  /**
   * Accessible labels of every event card currently rendered (title, artist, and venue —
   * e.g. "Zenith Tour — Tokyo Night One at Tokyo Dome"). Cards expose no separate
   * title-only testID, so the card's own accessible label is read instead.
   */
  async getEventCardLabels(): Promise<string[]> {
    const cards = await this.eventCards;
    const labels: string[] = [];
    for (const card of cards) {
      labels.push((await this.getAttribute(card, 'content-desc')) ?? '');
    }
    return labels;
  }
}

export default new EventsPage();
