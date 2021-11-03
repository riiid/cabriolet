import {
  getDefaultValue as getDefaultSchemaValue,
  Type as Schema,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { getDefaultValue as getDefaultFormatValue } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Format";

import { getDefaultValue as getDefaultConverterValue } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import plan from ".";

// (foo) >> (bar)
test("foo bar", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar" },
    ],
    converters: [
      { ...getDefaultConverterValue(), fromFormatId: "foo", toFormatId: "bar" },
    ],
  };
  expect(plan(schema, "foo", "bar")).toEqual<string[]>(["foo", "bar"]);
});

// (foo) >> (bar) >> (baz)
test("foo bar baz", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar" },
      { ...getDefaultFormatValue(), id: "baz" },
    ],
    converters: [
      { ...getDefaultConverterValue(), fromFormatId: "foo", toFormatId: "bar" },
      { ...getDefaultConverterValue(), fromFormatId: "bar", toFormatId: "baz" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<string[]>(["foo", "bar", "baz"]);
});

// (foo) >> (bar) >> (baz)
//   |                /|\
//   ------------------
test("foo bar baz 2", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar" },
      { ...getDefaultFormatValue(), id: "baz" },
    ],
    converters: [
      { ...getDefaultConverterValue(), fromFormatId: "foo", toFormatId: "bar" },
      { ...getDefaultConverterValue(), fromFormatId: "bar", toFormatId: "baz" },
      { ...getDefaultConverterValue(), fromFormatId: "foo", toFormatId: "baz" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<string[]>(["foo", "baz"]);
  expect(plan(schema, "foo", "bar")).toEqual<string[]>(["foo", "bar"]);
  expect(plan(schema, "bar", "baz")).toEqual<string[]>(["bar", "baz"]);
  expect(plan(schema, "baz", "foo")).toEqual<string[]>([]);
});
