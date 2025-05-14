import {generateLookupTable, LookupItem, LookupItemType} from "../../src/scripts/search";
import {DashboardConfig} from "../../src/scripts/interface";

const mockConfig: DashboardConfig = {
  meta: {favicon: 'favicon.ico', copyRightYear: '2025'},
  title: 'Mock Dashboard',
  theme: 'My Theme',
  liveSearch: true,
  clock: false,
  sections: [
    {
      title: 'Work',
      blocks: [
        {
          title: 'Block 1',
          links: [
            {
              title: 'Block Link 1',
              href: 'http://block-link-1.com'
            }
          ],
          searchFields: [
            {
              title: 'Block Search 1',
              parameter: 'search',
              href: 'http://block-search-1.com?search=[search-term]'
            }
          ],
          groups: [
            {
              title: 'Group 1',
              links: [
                {
                  title: 'Group Link 1',
                  href: 'http://group-link-1.com'
                }
              ],
              searchFields: [
                {
                  title: 'Group Search 1',
                  parameter: 'search',
                  href: 'http://group-search-1.com?search=[search-term]'
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

describe("Search tools", () => {
  let lookupTable: LookupItem[];

  beforeAll(() => {
    lookupTable = generateLookupTable(mockConfig);
  });

  describe("Testing lookupTable generation", () => {

    it("should generate a lookup table", () => {
      expect(lookupTable).toBeDefined();
    });

    it("should have the correct number of entries", () => {
      expect(lookupTable.length).toBe(4);
    });

    it("should have a correct block link", () => {
      expect(lookupTable[0].type).toBe(LookupItemType.LINK);
      expect(lookupTable[0].title).toBe("Block Link 1");
      expect(lookupTable[0].href).toBe("http://block-link-1.com");
      expect(lookupTable[0].section).toBe("Work");
      expect(lookupTable[0].block).toBe("Block 1");
    });

    it("should have a correct block search", () => {
      expect(lookupTable[1].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[1].title).toBe("Block Search 1");
      expect(lookupTable[1].href).toBe("http://block-search-1.com?search=[search-term]");
      expect(lookupTable[1].section).toBe("Work");
      expect(lookupTable[1].block).toBe("Block 1");
    });

    it("should have a correct group link", () => {
      expect(lookupTable[2].type).toBe(LookupItemType.LINK);
      expect(lookupTable[2].title).toBe("Group Link 1");
      expect(lookupTable[2].href).toBe("http://group-link-1.com");
      expect(lookupTable[2].section).toBe("Work");
      expect(lookupTable[2].block).toBe("Block 1");
      expect(lookupTable[2].group).toBe("Group 1");
    });

    it("should have a correct group link", () => {
      expect(lookupTable[3].type).toBe(LookupItemType.SEARCH_FIELD);
      expect(lookupTable[3].title).toBe("Group Search 1");
      expect(lookupTable[3].href).toBe("http://group-search-1.com?search=[search-term]");
      expect(lookupTable[3].section).toBe("Work");
      expect(lookupTable[3].block).toBe("Block 1");
      expect(lookupTable[3].group).toBe("Group 1");
    });
  });
});
