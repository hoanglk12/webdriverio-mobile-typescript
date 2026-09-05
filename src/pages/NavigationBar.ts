import { BasePage } from './BasePage';

/**
 * Bottom Navigation Bar Page Object (FrontRow)
 * Represents the persistent tab bar chrome present on every top-level
 * screen: Events, My Tickets, Profile, and Debug.
 *
 * Selector strategy — same reasoning as `EventsPage`: this React Native
 * build's `testID`s surface as Android `resource-id`, not `content-desc`,
 * so every selector here uses `-android uiautomator` + `resourceId(...)`
 * rather than the repo's usual accessibility-id (`~`) strategy.
 *
 * NOTE — unverified assumption: the live walkthrough behind
 * `docs/frontrow-test-cases.html` confirms the Debug screen's own testID is
 * `tab.debug`, which implies a `tab.<slug>` naming convention for the tab
 * bar buttons. The other three slugs (`events`, `myTickets`, `profile`)
 * follow that convention but were not read off the live element tree in
 * this session (no appium-mcp/device connection available). Confirm the
 * exact resource-ids with a live inspection before relying on this in CI —
 * see the `appium-failure-triage` skill.
 */
export class NavigationBar extends BasePage {
  /**
   * Parameterized getter for a bottom tab bar button by its testID slug.
   * @param slug - Tab slug, e.g. "events", "myTickets", "profile", "debug"
   */
  private tab(slug: string) {
    return $(`android=new UiSelector().resourceId("tab.${slug}")`);
  }

  /**
   * Check if a single tab is displayed
   * @param slug - Tab testID slug
   */
  async isTabDisplayed(slug: string): Promise<boolean> {
    return await this.isDisplayed(this.tab(slug));
  }

  /**
   * Check if a single tab is displayed and tappable
   * @param slug - Tab testID slug
   */
  async isTabTappable(slug: string): Promise<boolean> {
    const el = this.tab(slug);
    return (await this.isDisplayed(el)) && (await this.isClickable(el));
  }

  /**
   * Check that every named tab is displayed and tappable
   * @param slugs - Tab testID slugs to verify
   */
  async areAllTabsTappable(slugs: string[]): Promise<boolean> {
    for (const slug of slugs) {
      if (!(await this.isTabTappable(slug))) {
        return false;
      }
    }
    return true;
  }
}

export default new NavigationBar();
