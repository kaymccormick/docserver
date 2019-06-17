export class SiteMetadata {
  author: string;
  date?: string;
  copyright?: string;
  license?: string;

  constructor(author: string) {
    this.author = author;
  }
}

export class Page {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Site {
  name: string;
  metadata: SiteMetadata;
  public constructor(name: string, metadata: SiteMetadata) {
  this.name = name;
  this.metadata = metadata;
  }
  addPage(path: string): void {
  }
}
