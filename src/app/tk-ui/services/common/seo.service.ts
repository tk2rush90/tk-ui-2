import {Inject, Injectable} from '@angular/core';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';
import {DOCUMENT, Location} from '@angular/common';

export interface SEOProperties {
  title?: string;
  author?: string;
  description?: string;
  canonical?: string;
  thumbnail?: string;
  keywords?: string[];
}

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
    @Inject(DOCUMENT) private document: Document,
    @Inject(Location) private location: Location,
    private title: Title,
    private meta: Meta,
  ) {
  }

  /**
   * Update SEO properties.
   * @param properties - SEO properties to update.
   */
  update(properties: SEOProperties = {}): void {
    let {
      title = '',
      author = '',
      description = '',
      canonical = '',
      thumbnail = '',
      keywords = [],
    } = properties;

    // Update canonical and thumbnail url by prefixing `_origin`.
    canonical = this._origin + canonical;
    thumbnail = this._origin + thumbnail;

    // Set Twitter default meta tag.
    this._addOrUpdateTag('name', 'twitter:card', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    // Set OpenGraph default meta tag.
    this._addOrUpdateTag('property', 'og:type', {
      property: 'og:type',
      content: 'website',
    });

    // Update title.
    if (title) {
      // Update default title.
      this.title.setTitle(title);

      // Update twitter title meta tag.
      this._addOrUpdateTag('name', 'twitter:title', {
        name: 'twitter:title',
        content: title,
      });

      // Update OpenGraph title meta tag.
      this._addOrUpdateTag('property', 'og:title', {
        property: 'og:title',
        content: title,
      });
    }

    // Update author.
    if (author) {
      // Update default author meta tag.
      this._addOrUpdateTag('name', 'author', {
        name: 'author',
        content: author,
      });

      // Update Twitter creator meta tag.
      this._addOrUpdateTag('name', 'twitter:creator', {
        name: 'twitter:creator',
        content: author,
      });
    }

    // Update description.
    if (description) {
      // Update default description meta tag.
      this._addOrUpdateTag('name', 'description', {
        name: 'description',
        content: description,
      });

      // Update OpenGraph description meta tag.
      this._addOrUpdateTag('property', 'og:description', {
        property: 'og:description',
        content: description,
      });

      // Update Twitter description meta tag.
      this._addOrUpdateTag('name', 'twitter:description', {
        name: 'twitter:description',
        content: description,
      });
    }

    // Update canonical url.
    if (canonical) {
      // Add or update canonical link tag.
      const link: HTMLLinkElement = this.document.querySelector(`link[rel='canonical']`) || this.document.createElement('link');

      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonical);

      // Update OpenGraph url meta tag.
      this._addOrUpdateTag('property', 'og:url', {
        property: 'og:url',
        content: canonical,
      });
    }

    // Update thumbnail.
    if (thumbnail) {
      // Update Twitter thumbnail meta tag.
      this._addOrUpdateTag('name', 'twitter:image', {
        name: 'twitter:image',
        content: thumbnail,
      });

      // Update OpenGraph thumbnail meta tag.
      this._addOrUpdateTag('property', 'og:image', {
        property: 'og:image',
        content: thumbnail,
      });
    }

    // Update default keywords meta tag.
    this._addOrUpdateTag('name', 'keywords', {
      name: 'keywords',
      content: keywords.join(','),
    });
  }

  /**
   * Add or update the tag.
   * @param selector - The attribute of meta tag.
   * @param value - The value of `selector`.
   * @param definition - The meta tag definition.
   */
  private _addOrUpdateTag(selector: keyof MetaDefinition, value: string, definition: MetaDefinition): void {
    if (this.meta.getTag(`${selector}="${value}"`)) {
      this.meta.updateTag(definition);
    } else {
      this.meta.addTag(definition);
    }
  }
}
