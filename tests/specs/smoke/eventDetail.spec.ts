import { describe, it } from 'mocha';
import { expect } from 'chai';
import EventsPage from '../../../src/pages/EventsPage';
import EventDetailPage from '../../../src/pages/EventDetailPage';
import { frontRow } from '../../data/testData';
import AllureReporter from '@wdio/allure-reporter';

describe('Event Detail Screen (FrontRow)', () => {
  beforeEach(async () => {
    AllureReporter.addFeature('Event Detail');
    AllureReporter.addSeverity('critical');
  });

  it('SMK-06 — tapping an event card opens its detail screen', async () => {
    AllureReporter.addStory('A list item opens its detail screen');
    AllureReporter.addDescription(
      'Tapping an event card on the Events screen navigates to Event Detail, which ' +
        'renders the title, artist, date, and venue for that event, plus a buy button ' +
        'and a reviews entry point.'
    );

    await EventsPage.waitForEventsPage();
    await EventsPage.openFirstEventCard();
    AllureReporter.addStep('Tapped the first event card');

    await EventDetailPage.waitForEventDetailPage();
    const isDetailDisplayed = await EventDetailPage.isEventDetailPageDisplayed();
    expect(isDetailDisplayed, 'Event Detail screen should be displayed after tapping an event card')
      .to.be.true;
    AllureReporter.addStep('Event Detail screen displayed');

    const isTitleDisplayed = await EventDetailPage.isTitleDisplayed();
    expect(isTitleDisplayed, 'Event title should be displayed').to.be.true;

    const titleText = await EventDetailPage.getTitleText();
    expect(titleText, `Event title should be "${frontRow.search.expectedEventTitle}"`).to.equal(
      frontRow.search.expectedEventTitle
    );
    AllureReporter.addStep(`Title: ${titleText}`);

    const isArtistDisplayed = await EventDetailPage.isArtistDisplayed(frontRow.eventDetail.artist);
    expect(isArtistDisplayed, `Artist "${frontRow.eventDetail.artist}" should be displayed`).to.be
      .true;

    const isDateDisplayed = await EventDetailPage.isDateDisplayed(frontRow.eventDetail.date);
    expect(isDateDisplayed, `Date "${frontRow.eventDetail.date}" should be displayed`).to.be.true;

    const isVenueDisplayed = await EventDetailPage.isVenueDisplayed(frontRow.eventDetail.venue);
    expect(isVenueDisplayed, `Venue "${frontRow.eventDetail.venue}" should be displayed`).to.be
      .true;
    AllureReporter.addStep(
      `Artist/date/venue displayed: ${frontRow.eventDetail.artist} / ${frontRow.eventDetail.date} / ${frontRow.eventDetail.venue}`
    );

    const isBuyButtonDisplayed = await EventDetailPage.isBuyButtonDisplayed();
    expect(isBuyButtonDisplayed, 'Buy button should be displayed').to.be.true;

    const isReviewsButtonDisplayed = await EventDetailPage.isReviewsButtonDisplayed();
    expect(isReviewsButtonDisplayed, 'Reviews button should be displayed').to.be.true;
    AllureReporter.addStep('Buy and reviews buttons displayed');
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
