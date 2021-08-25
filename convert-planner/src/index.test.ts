import {
  getDefaultValue as getDefaultSchemaValue,
  Type as Schema,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import {
  getDefaultValue as getDefaultFormatValue,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Format";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import plan from ".";

test("foo bar", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar" },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "bar", converterId: "" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<ConvertPlan>({
    entries: [
      { value: { field: "convert", value: { formatId: "bar" } } },
    ],
  });
});

test("foo bar baz", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar" },
      { ...getDefaultFormatValue(), id: "baz" },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "bar", converterId: "" },
      { fromFormatId: "bar", toFormatId: "baz", converterId: "" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<ConvertPlan>({
    entries: [
      { value: { field: "convert", value: { formatId: "bar" } } },
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
});
