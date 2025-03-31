import path from "path";
import * as fs from "fs-extra";
import * as handlebars from "handlebars";
import {registerPartials} from "../../../src/template/partials";

jest.mock("fs-extra");
jest.mock("handlebars");

describe("registerPartials", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register header, dashboard, and footer partials", () => {
    // Mock fs.existsSync to always return true (dashboard file exists)
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Mock fs.readFileSync to return dummy partial content
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      if (filePath.includes("header.hbs")) return "HEADER PARTIAL CONTENT";
      if (filePath.includes("footer.hbs")) return "FOOTER PARTIAL CONTENT";
      if (filePath.includes("my_theme.hbs")) return "DASHBOARD PARTIAL CONTENT";
      return "";
    });

    registerPartials("My Theme");

    expect(handlebars.registerPartial).toHaveBeenCalledTimes(3);

    expect(handlebars.registerPartial).toHaveBeenCalledWith("header", "HEADER PARTIAL CONTENT");
    expect(handlebars.registerPartial).toHaveBeenCalledWith("dashboard", "DASHBOARD PARTIAL CONTENT");
    expect(handlebars.registerPartial).toHaveBeenCalledWith("footer", "FOOTER PARTIAL CONTENT");

    const expectedDashboardPath = path.join(process.cwd(), "src", "templates", "my_theme.hbs");
    expect(fs.existsSync).toHaveBeenCalledWith(expectedDashboardPath);
  });

  it("should throw an error when the theme template does not exist", () => {
    // Mock fs.existsSync to return false (theme doesn't exist)
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => registerPartials("NonExistentTheme")).toThrow("Theme 'NonExistentTheme' does not exist.");

    // Make sure registerPartial was never called
    expect(handlebars.registerPartial).not.toHaveBeenCalled();
  });
});
