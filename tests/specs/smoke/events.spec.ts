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

  it('SMK-03 — search returns a match', async () => {
    AllureReporter.addStory('Search filters the event list');
    AllureReporter.addDescription(
      'Typing into the search field filters the event list live (no submit action). A ' +
        'nonsense query is checked first as a negative control, proving the field actually ' +
        'filters, before the real query is checked to narrow the list to exactly the ' +
        'expected event.'
    );

    await EventsPage.waitForEventsPage();

    // Negative control: with only one event seeded right now, a positive-only assertion
    // below could pass even if search were a no-op. A nonsense term must return zero.
    await EventsPage.searchEvents(frontRow.search.nonMatchingTerm);
    await EventsPage.waitForEventCount(0);
    AllureReporter.addStep('Confirmed search is live: a nonsense term returns zero events');

    await EventsPage.searchEvents(frontRow.search.term);
    await EventsPage.waitForEventCount(1);
    AllureReporter.addStep(`Searched "${frontRow.search.term}"`);

    const labels = await EventsPage.getEventCardLabels();
    expect(
      labels,
      `Search for "${frontRow.search.term}" should narrow the list to exactly one event`
    ).to.have.lengthOf(1);
    expect(
      labels[0],
      `The single result should be "${frontRow.search.expectedEventTitle}": ${labels[0]}`
    ).to.include(frontRow.search.expectedEventTitle);
    AllureReporter.addStep(`Result: ${labels[0]}`);

    await EventsPage.clearSearch();
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
