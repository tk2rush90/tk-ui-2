import {Inject, Injectable} from '@angular/core';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

/**
 * Handle meta tags for SEO.
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  /**
   * The url origin of the application.
   * This should be set by `environment`.
   */
  private _origin = '';

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _title: Title,
    private _meta: Meta,
  ) {
  }

  /**
   * Set default meta values.
   */
  setDefault(): void { }

  /**
   * Set `<title></title>`.
   * @param title - Title of page.
   */
  setTitle(title: string): void {
    this._title.setTitle(title);
  }

  /**
   * Set `<meta name="twitter:title"/>.
   * @param title - Title for twitter.
   */
  setTwitterTitle(title: string): void {
    this._addOrUpdateTag('name', 'twitter:title', {
      name: 'twitter:title',
      content: title,
    });
  }

  /**
   * Set `<meta property="og:title"/>.
   * @param title - Title for OpenGraph.
   */
  setOgTitle(title: string): void {
    this._addOrUpdateTag('property', 'og:title', {
      property: 'og:title',
      content: title,
    });
  }

  /**
   * Set `<meta name="twitter:card"/>.
   * @param card - Card type for twitter.
   */
  setTwitterCard(card = 'summary_large_image'): void {
    this._addOrUpdateTag('name', 'twitter:card', {
      name: 'twitter:card',
      content: card,
    });
  }

  /**
   * Set `<meta property="og:type"/>.
   * @param type - Type for OpenGraph.
   */
  setOgType(type = 'website'): void {
    this._addOrUpdateTag('property', 'og:type', {
      property: 'og:type',
      content: type,
    });
  }

  /**
   * Set `<meta name="author"/>.
   * @param author - Author of website.
   */
  setAuthor(author: string): void {
    this._addOrUpdateTag('name', 'author', {
      name: 'author',
      content: author,
    });
  }

  /**
   * Set `<meta name="twitter:site"/>.
   * @param site - Username of website owner.
   */
  setTwitterSite(site: string): void {
    this._addOrUpdateTag('name', 'twitter:site', {
      name: 'twitter:site',
      content: site,
    });
  }

  /**
   * Set `<meta name="twitter:creator"/>
   * @param creator - Username of page contents creator.
   */
  setTwitterCreator(creator: string): void {
    this._addOrUpdateTag('name', 'twitter:creator', {
      name: 'twitter:creator',
      content: creator,
    });
  }

  /**
   * Set `<meta name="description"/>.
   * @param description - Description of page.
   */
  setDescription(description: string): void {
    this._addOrUpdateTag('name', 'description', {
      name: 'description',
      content: description,
    });
  }

  /**
   * Set `<meta name="twitter:description"/>.
   * @param description - Description for Twitter.
   */
  setTwitterDescription(description: string): void {
    this._addOrUpdateTag('name', 'twitter:description', {
      name: 'twitter:description',
      content: description,
    });
  }

  /**
   * Set `<meta name="og:description"/>.
   * @param description - Description for OpenGraph.
   */
  setOgDescription(description: string): void {
    this._addOrUpdateTag('property', 'og:description', {
      property: 'og:description',
      content: description,
    });
  }

  /**
   * Set <link rel="canonical"/>.
   * @param canonical - Canonical url for page.
   */
  setCanonical(canonical: string): void {
    const link: HTMLLinkElement = this._document.querySelector(`link[rel='canonical']`) || this._document.createElement('link');

    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this._origin + canonical);

    this._document.head.appendChild(link);
  }

  /**
   * Set `<meta property="og:url"/>.
   * @param url - Url for OpenGraph.
   */
  setOgUrl(url: string): void {
    this._addOrUpdateTag('property', 'og:url', {
      property: 'og:url',
      content: this._origin + url,
    });
  }

  /**
   * Set `<meta name="twitter:image"/>.
   * @param image - Image url for Twitter card.
   *   For "Summary card with large image" type, it supports an image with 2:1 aspect ratio.
   *   The minimum dimension is 300x157 and maximum is 4096x4096.
   *   Image size should be less than 5mb.
   */
  setTwitterImage(image: string): void {
    this._addOrUpdateTag('name', 'twitter:image', {
      name: 'twitter:image',
      content: image,
    });
  }

  /**
   * Set `<meta property="og:image"/>.
   * @param image - Image url for OpenGraph.
   *   The minimum dimension is 200x200 and image size should be less than 8mb.
   *   Recommended dimension is 1200x630.
   */
  setOgImage(image: string): void {
    this._addOrUpdateTag('property', 'og:image', {
      property: 'og:image',
      content: image,
    });
  }

  /**
   * Set `<meta name="keywords"/>.
   * @param keywords - Keywords of page.
   */
  setKeywords(keywords: string[]): void {
    this._addOrUpdateTag('name', 'keywords', {
      name: 'keywords',
      content: keywords.join(','),
    });
  }

  /**
   * Remove `<meta name="twitter:creator"/>.
   */
  removeTwitterCreator(): void {
    this._meta.removeTag(`name='twitter:creator'`);
  }

  /**
   * Add or update the tag.
   * @param selector - The attribute of meta tag.
   * @param value - The value of `selector`.
   * @param definition - The meta tag definition.
   */
  private _addOrUpdateTag(selector: keyof MetaDefinition, value: string, definition: MetaDefinition): void {
    if (this._meta.getTag(`${selector}="${value}"`)) {
      this._meta.updateTag(definition);
    } else {
      this._meta.addTag(definition);
    }
  }
}
