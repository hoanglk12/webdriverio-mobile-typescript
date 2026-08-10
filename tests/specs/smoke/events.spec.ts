import { describe, it } from 'mocha';
import { expect } from 'chai';
import EventsPage from '../../../src/pages/EventsPage';
import { frontRow } from '../../data/testData';
import AllureReporter from '@wdio/allure-reporter';

describe('Events Screen (FrontRow)', () => {
  beforeEach(async () => {
    AllureReporter.addFeature('Events / Home');
    AllureReporter.addSeverity('critical');
  });

  it('SMK-01 — app launches to the Events screen with search, filter chips, and list', async () => {
    AllureReporter.addStory('App launches to Events');
    AllureReporter.addDescription(
      'App opens on the correct home screen: the Events screen renders with a search bar, ' +
        'the five genre filter chips (fresh signed-out set: All, Indie Rock, Classical, ' +
        'Electronic, Folk), and the event list within the default timeout. ' +
        '(The auth-gated "Favorites" chip appears only when signed in and is not part of ' +
        'this default state.)'
    );

    // Wait for the Events screen to finish loading
    await EventsPage.waitForEventsPage();

    // Event list is rendered
    const isEventsDisplayed = await EventsPage.isEventsPageDisplayed();
    expect(isEventsDisplayed, 'Events screen (event list) should be displayed on launch').to.be
      .true;
    AllureReporter.addStep('Event list rendered');

    // Search bar is present
    const isSearchDisplayed = await EventsPage.isSearchBarDisplayed();
    expect(isSearchDisplayed, 'Search bar should be displayed on the Events screen').to.be.true;
    AllureReporter.addStep('Search bar rendered');

    // Filter chip row is present
    const isFilterRowDisplayed = await EventsPage.isFilterRowDisplayed();
    expect(isFilterRowDisplayed, 'Filter chip row should be displayed').to.be.true;
    AllureReporter.addStep('Filter row rendered');

    // All five signed-out filter chips are displayed
    const chips = frontRow.filterChipSlugs;
    const allChipsDisplayed = await EventsPage.areAllFilterChipsDisplayed(chips);
    expect(allChipsDisplayed, `All five filter chips should be displayed: ${chips.join(', ')}`).to
      .be.true;
    AllureReporter.addStep(`Filter chips rendered: ${chips.join(', ')}`);
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
