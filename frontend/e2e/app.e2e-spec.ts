import { MusifyFrontendPage } from './app.po';

describe('frontend App', function() {
  let page: MusifyFrontendPage;

  beforeEach(() => {
    page = new MusifyFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
