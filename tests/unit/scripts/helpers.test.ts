import * as handlebars from "handlebars";
import {registerHelpers} from "../../../src/scripts/helpers";

describe("Handlebars Helpers", () => {
  beforeAll(() => {
    registerHelpers();
  });

  describe("Variable Storage Helpers", () => {
    it("should set and get a variable correctly", () => {
      const template = handlebars.compile(`
        {{setVar "foo" "bar"}}
        {{getVar "foo"}}
      `);

      const result = template({}, {data: {root: {}}});
      expect(result).toContain("bar");
    });
  });

  describe("Math Operators", () => {
    it("should add two numbers", () => {
      const template = handlebars.compile(`{{add 3 4}}`);
      const result = template({});
      expect(result).toBe("7");
    });

    it("should divide two numbers", () => {
      const template = handlebars.compile(`{{div 10 2}}`);
      const result = template({});
      expect(result).toBe("5");
    });

    it("should mod two numbers", () => {
      const template = handlebars.compile(`{{mod 10 3}}`);
      const result = template({});
      expect(result).toBe("1");
    });
  });

  describe("Boolean Operators", () => {
    it("should return true for eq when equal", () => {
      const template = handlebars.compile(`{{eq 5 5}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for eq when not equal", () => {
      const template = handlebars.compile(`{{eq 5 6}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for ne when not equal", () => {
      const template = handlebars.compile(`{{ne 5 6}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for ne when equal", () => {
      const template = handlebars.compile(`{{ne 5 5}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for gt when greater", () => {
      const template = handlebars.compile(`{{gt 10 5}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for gt when not greater", () => {
      const template = handlebars.compile(`{{gt 5 10}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return false for gt when equal", () => {
      const template = handlebars.compile(`{{gt 5 5}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for lt when lower", () => {
      const template = handlebars.compile(`{{lt 5 10}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for lt when not lower", () => {
      const template = handlebars.compile(`{{lt 10 5}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return false for lt when equal", () => {
      const template = handlebars.compile(`{{lt 5 5}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for gte when greater", () => {
      const template = handlebars.compile(`{{gte 10 5}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for gte when not greater", () => {
      const template = handlebars.compile(`{{gte 5 10}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return ture for gte when equal", () => {
      const template = handlebars.compile(`{{gte 5 5}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return true for lte when lower", () => {
      const template = handlebars.compile(`{{lte 5 10}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for lte when not lower", () => {
      const template = handlebars.compile(`{{lte 10 5}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for lte when equal", () => {
      const template = handlebars.compile(`{{lte 5 5}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return true for and when all true", () => {
      const template = handlebars.compile(`{{and true true}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for and when one false", () => {
      const template = handlebars.compile(`{{and true false}}`);
      const result = template({});
      expect(result).toBe("false");
    });

    it("should return true for or when one true", () => {
      const template = handlebars.compile(`{{or false true}}`);
      const result = template({});
      expect(result).toBe("true");
    });

    it("should return false for or when all false", () => {
      const template = handlebars.compile(`{{or false false}}`);
      const result = template({});
      expect(result).toBe("false");
    });
  });
});
