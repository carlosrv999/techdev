import { CocherasDesktopPage } from './app.po';

describe('cocheras-desktop App', () => {
  let page: CocherasDesktopPage;

  beforeEach(() => {
    page = new CocherasDesktopPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
