import { describe, it } from 'mocha';
import { expect } from 'chai';
import EventsPage from '../../../src/pages/EventsPage';
import NavigationBar from '../../../src/pages/NavigationBar';
import { frontRow } from '../../data/testData';
import AllureReporter from '@wdio/allure-reporter';

describe('Bottom Navigation (FrontRow)', () => {
  beforeEach(async () => {
    AllureReporter.addFeature('Navigation');
    AllureReporter.addSeverity('critical');
    await EventsPage.waitForEventsPage();
  });

  it('SMK-02 — bottom nav shows all tabs', async () => {
    AllureReporter.addStory('Bottom nav shows all tabs');
    AllureReporter.addDescription(
      'Primary navigation is present: Events, My Tickets, Profile, and Debug tabs ' +
        'are all present and tappable on the bottom tab bar.'
    );

    for (const slug of frontRow.bottomNavTabSlugs) {
      const isDisplayed = await NavigationBar.isTabDisplayed(slug);
      expect(isDisplayed, `Tab "${slug}" should be displayed`).to.be.true;

      const isTappable = await NavigationBar.isTabTappable(slug);
      expect(isTappable, `Tab "${slug}" should be tappable`).to.be.true;

      AllureReporter.addStep(`Tab "${slug}" present and tappable`);
    }
  });

  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      AllureReporter.addAttachment(
        'Screenshot on Failure',
        await driver.takeScreenshot(),
        'image/png'
      );
    }
  });
});
