import { generateLookupTable, LookupItem, LookupItemType } from "../../../src/scripts/search";
import { DashboardConfig } from "../../../src/scripts/interface";

const mockConfigWithDefaultTitle: DashboardConfig = {
  meta: {favicon: 'favicon.ico', copyRightYear: '2025'},
  title: 'Mock Dashboard',
  theme: 'My Theme',
  liveSearch: true,
  defaultTitle: true,
  clock: false,
  sections: [
    {
      blocks: [
        {
          title: 'Section 1 Block 1',
          links: [
            {
              title: 'Section 1 Block Link 1',
              href: 'http://section-1-block-link-1.com'
            }
          ],
          searchFields: [
            {
              title: 'Section 1 Block Search 1',
              parameter: 'search',
              href: 'http://section-1-block-search-1.com?search=[search-term]'
            }
          ],
          groups: [
            {
              title: 'Section 1 Group 1',
              links: [
                {
                  title: 'Section 1 Group Link 1',
                  href: 'http://section-1-group-link-1.com'
                }
              ],
              searchFields: [
                {
                  title: 'Section 1 Group Search 1',
                  parameter: 'search',
                  href: 'http://section-1-group-search-1.com?search=[search-term]'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Custom Section',
      blocks: [
        {
          title: 'Custom Section Block 1',
          links: [
            {
              title: 'Custom Section Block Link 1',
              href: 'http://custom-section-block-link-1.com'
            }
          ],
          searchFields: [
            {
              title: 'Custom Section Block Search 1',
              parameter: 'search',
              href: 'http://custom-section-block-search-1.com?search=[search-term]'
            }
          ],
          groups: [
            {
              title: 'Custom Section Group 1',
              links: [
                {
                  title: 'Custom Section Group Link 1',
                  href: 'http://custom-section-group-link-1.com'
                }
              ],
              searchFields: [
                {
                  title: 'Custom Section Group Search 1',
                  parameter: 'search',
                  href: 'http://custom-section-group-search-1.com?search=[search-term]'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  inlineCss: '',
  bundleJs: '',
};

const mockConfigWithoutDefaultTitle: DashboardConfig = {
  ...mockConfigWithDefaultTitle,
  defaultTitle: false,
}


describe("Lookuptable generation with default title", () => {
  let lookupTable: LookupItem[];

  beforeAll(() => {
    lookupTable = generateLookupTable(mockConfigWithDefaultTitle);
  });

  describe("Testing lookupTable generation", () => {

    it("should generate a lookup table", () => {
      expect(lookupTable).toBeDefined();
    });

    it("should have the correct number of entries", () => {
      expect(lookupTable.length).toBe(8);
    });

    it("Section 1 should have a correct block link", () => {
      expect(lookupTable[0].type).toBe(LookupItemType.LINK);
      expect(lookupTable[0].title).toBe("Section 1 Block Link 1");
      expect(lookupTable[0].href).toBe("http://section-1-block-link-1.com");
      expect(lookupTable[0].section).toBe("Section 1");
      expect(lookupTable[0].block).toBe("Section 1 Block 1");
    });

    it("Section 1 should have a correct block search", () => {
      expect(lookupTable[1].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[1].title).toBe("Section 1 Block Search 1");
      expect(lookupTable[1].href).toBe("http://section-1-block-search-1.com?search=[search-term]");
      expect(lookupTable[1].section).toBe("Section 1");
      expect(lookupTable[1].block).toBe("Section 1 Block 1");
    });

    it("Section 1 should have a correct group link", () => {
      expect(lookupTable[2].type).toBe(LookupItemType.LINK);
      expect(lookupTable[2].title).toBe("Section 1 Group Link 1");
      expect(lookupTable[2].href).toBe("http://section-1-group-link-1.com");
      expect(lookupTable[2].section).toBe("Section 1");
      expect(lookupTable[2].block).toBe("Section 1 Block 1");
      expect(lookupTable[2].group).toBe("Section 1 Group 1");
    });

    it("Section 1 should have a correct group search", () => {
      expect(lookupTable[3].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[3].title).toBe("Section 1 Group Search 1");
      expect(lookupTable[3].href).toBe("http://section-1-group-search-1.com?search=[search-term]");
      expect(lookupTable[3].section).toBe("Section 1");
      expect(lookupTable[3].block).toBe("Section 1 Block 1");
      expect(lookupTable[3].group).toBe("Section 1 Group 1");
    });

    it("Custom Section should have a correct block link", () => {
      expect(lookupTable[4].type).toBe(LookupItemType.LINK);
      expect(lookupTable[4].title).toBe("Custom Section Block Link 1");
      expect(lookupTable[4].href).toBe("http://custom-section-block-link-1.com");
      expect(lookupTable[4].section).toBe("Custom Section");
      expect(lookupTable[4].block).toBe("Custom Section Block 1");
    });

    it("Custom Section should have a correct block search", () => {
      expect(lookupTable[5].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[5].title).toBe("Custom Section Block Search 1");
      expect(lookupTable[5].href).toBe("http://custom-section-block-search-1.com?search=[search-term]");
      expect(lookupTable[5].section).toBe("Custom Section");
      expect(lookupTable[5].block).toBe("Custom Section Block 1");
    });

    it("Custom Section should have a correct group link", () => {
      expect(lookupTable[6].type).toBe(LookupItemType.LINK);
      expect(lookupTable[6].title).toBe("Custom Section Group Link 1");
      expect(lookupTable[6].href).toBe("http://custom-section-group-link-1.com");
      expect(lookupTable[6].section).toBe("Custom Section");
      expect(lookupTable[6].block).toBe("Custom Section Block 1");
      expect(lookupTable[6].group).toBe("Custom Section Group 1");
    });

    it("Custom Section should have a correct group search", () => {
      expect(lookupTable[7].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[7].title).toBe("Custom Section Group Search 1");
      expect(lookupTable[7].href).toBe("http://custom-section-group-search-1.com?search=[search-term]");
      expect(lookupTable[7].section).toBe("Custom Section");
      expect(lookupTable[7].block).toBe("Custom Section Block 1");
      expect(lookupTable[7].group).toBe("Custom Section Group 1");
    });
  });
});

describe("Lookuptable generation without default title", () => {
  let lookupTable: LookupItem[];

  beforeAll(() => {
    lookupTable = generateLookupTable(mockConfigWithoutDefaultTitle);
  });

  describe("Testing lookupTable generation", () => {

    it("should generate a lookup table", () => {
      expect(lookupTable).toBeDefined();
    });

    it("should have the correct number of entries", () => {
      expect(lookupTable.length).toBe(8);
    });

    it("Section 1 should have a correct block link", () => {
      expect(lookupTable[0].type).toBe(LookupItemType.LINK);
      expect(lookupTable[0].title).toBe("Section 1 Block Link 1");
      expect(lookupTable[0].href).toBe("http://section-1-block-link-1.com");
      expect(lookupTable[0].section).toBe("");
      expect(lookupTable[0].block).toBe("Section 1 Block 1");
    });

    it("Section 1 should have a correct block search", () => {
      expect(lookupTable[1].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[1].title).toBe("Section 1 Block Search 1");
      expect(lookupTable[1].href).toBe("http://section-1-block-search-1.com?search=[search-term]");
      expect(lookupTable[1].section).toBe("");
      expect(lookupTable[1].block).toBe("Section 1 Block 1");
    });

    it("Section 1 should have a correct group link", () => {
      expect(lookupTable[2].type).toBe(LookupItemType.LINK);
      expect(lookupTable[2].title).toBe("Section 1 Group Link 1");
      expect(lookupTable[2].href).toBe("http://section-1-group-link-1.com");
      expect(lookupTable[2].section).toBe("");
      expect(lookupTable[2].block).toBe("Section 1 Block 1");
      expect(lookupTable[2].group).toBe("Section 1 Group 1");
    });

    it("Section 1 should have a correct group search", () => {
      expect(lookupTable[3].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[3].title).toBe("Section 1 Group Search 1");
      expect(lookupTable[3].href).toBe("http://section-1-group-search-1.com?search=[search-term]");
      expect(lookupTable[3].section).toBe("");
      expect(lookupTable[3].block).toBe("Section 1 Block 1");
      expect(lookupTable[3].group).toBe("Section 1 Group 1");
    });

    it("Custom Section should have a correct block link", () => {
      expect(lookupTable[4].type).toBe(LookupItemType.LINK);
      expect(lookupTable[4].title).toBe("Custom Section Block Link 1");
      expect(lookupTable[4].href).toBe("http://custom-section-block-link-1.com");
      expect(lookupTable[4].section).toBe("Custom Section");
      expect(lookupTable[4].block).toBe("Custom Section Block 1");
    });

    it("Custom Section should have a correct block search", () => {
      expect(lookupTable[5].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[5].title).toBe("Custom Section Block Search 1");
      expect(lookupTable[5].href).toBe("http://custom-section-block-search-1.com?search=[search-term]");
      expect(lookupTable[5].section).toBe("Custom Section");
      expect(lookupTable[5].block).toBe("Custom Section Block 1");
    });

    it("Custom Section should have a correct group link", () => {
      expect(lookupTable[6].type).toBe(LookupItemType.LINK);
      expect(lookupTable[6].title).toBe("Custom Section Group Link 1");
      expect(lookupTable[6].href).toBe("http://custom-section-group-link-1.com");
      expect(lookupTable[6].section).toBe("Custom Section");
      expect(lookupTable[6].block).toBe("Custom Section Block 1");
      expect(lookupTable[6].group).toBe("Custom Section Group 1");
    });

    it("Custom Section should have a correct group search", () => {
      expect(lookupTable[7].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[7].title).toBe("Custom Section Group Search 1");
      expect(lookupTable[7].href).toBe("http://custom-section-group-search-1.com?search=[search-term]");
      expect(lookupTable[7].section).toBe("Custom Section");
      expect(lookupTable[7].block).toBe("Custom Section Block 1");
      expect(lookupTable[7].group).toBe("Custom Section Group 1");
    });
  });
});
