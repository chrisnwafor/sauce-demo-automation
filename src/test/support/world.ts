import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

export class CustomWorld extends World {
    private _page!: Page;
    private _context!: BrowserContext;
    private _browser!: Browser;

    constructor(options: IWorldOptions) {
        super(options);
    }

    get page(): Page {
        return this._page;
    }

    set page(page: Page) {
        this._page = page;
    }

    get context(): BrowserContext {
        return this._context;
    }

    set context(context: BrowserContext) {
        this._context = context;
    }

    get browser(): Browser {
        return this._browser;
    }

    set browser(browser: Browser) {
        this._browser = browser;
    }
}

setWorldConstructor(CustomWorld);