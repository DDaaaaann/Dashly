import fs from "fs-extra";
import * as path from "path";
import getMeta from "../../src/scripts/meta";

jest.mock("fs-extra");

describe("getMeta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getInlineFavicon", () => {
    it("should return a link tag with the base64 encoded favicon", () => {
      const dummyFaviconBuffer = Buffer.from("fake-favicon-content");
      const expectedBase64 = dummyFaviconBuffer.toString("base64");
      const expectedLinkTag = `<link rel="icon" href="data:image/x-icon;base64,${expectedBase64}">`;

      (fs.readFileSync as jest.Mock).mockReturnValue(dummyFaviconBuffer);

      const meta = getMeta();
      const faviconLinkTag = meta.favicon;

      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
      const expectedPath = path.join(process.cwd(), "assets", "favicon", "favicon.ico");
      expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath);

      expect(faviconLinkTag).toEqual(expectedLinkTag);
    });
  });

  describe("getCopyRightYear", () => {
    it("should return the current year as a string", () => {
      const meta = getMeta();
      const currentYear = new Date().getFullYear().toString();

      expect(meta.copyRightYear).toEqual(currentYear);
    });
  });
});
