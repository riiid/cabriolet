import {
  getDefaultValue as getDefaultSchemaValue,
  Type as Schema,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import {
  getDefaultValue as getDefaultFormatValue,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Format";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import plan from ".";

// (foo) >> (bar)
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
  expect(plan(schema, "foo", "bar")).toEqual<ConvertPlan>({
    fromFormatId: "foo",
    toFormatId: "bar",
    entries: [
      { value: { field: "convert", value: { formatId: "bar" } } },
    ],
  });
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
    edges: [
      { fromFormatId: "foo", toFormatId: "bar", converterId: "" },
      { fromFormatId: "bar", toFormatId: "baz", converterId: "" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "foo",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "bar" } } },
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
});

// (foo)
//   ^
// (bar)
test("inherit", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar", parentFormatIds: ["foo"] },
    ],
  };
  expect(plan(schema, "bar", "foo")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "foo",
    entries: [
      { value: { field: "upcast", value: { formatId: "foo" } } },
    ],
  });
});

// (foo) >> (baz)
//   ^
// (bar)
test("inherit2", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar", parentFormatIds: ["foo"] },
      { ...getDefaultFormatValue(), id: "baz" },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "baz", converterId: "" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "foo",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
  expect(plan(schema, "bar", "foo")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "foo",
    entries: [
      { value: { field: "upcast", value: { formatId: "foo" } } },
    ],
  });
  expect(plan(schema, "bar", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "baz",
    entries: [
      { value: { field: "upcast", value: { formatId: "foo" } } },
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
});

// (foo) >> (baz)
//   ^       ^^
// (bar)-----|
test("inherit3", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar", parentFormatIds: ["foo"] },
      { ...getDefaultFormatValue(), id: "baz" },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "baz", converterId: "" },
      { fromFormatId: "bar", toFormatId: "baz", converterId: "" },
    ],
  };
  expect(plan(schema, "foo", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "foo",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
  expect(plan(schema, "bar", "foo")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "foo",
    entries: [
      { value: { field: "upcast", value: { formatId: "foo" } } },
    ],
  });
  expect(plan(schema, "bar", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
});

//   |--------------------------|
//   |-----------------|        |
// (foo)-----|         |        |
//   ^       vv        vv       vv
// (bar) >> (baz) >> (qux) >> (quux)
test("inherit4", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar", parentFormatIds: ["foo"] },
      { ...getDefaultFormatValue(), id: "baz" },
      { ...getDefaultFormatValue(), id: "qux" },
      { ...getDefaultFormatValue(), id: "quux" },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "baz", converterId: "" },
      { fromFormatId: "foo", toFormatId: "qux", converterId: "" },
      { fromFormatId: "foo", toFormatId: "quux", converterId: "" },
      { fromFormatId: "bar", toFormatId: "baz", converterId: "" },
      { fromFormatId: "baz", toFormatId: "qux", converterId: "" },
      { fromFormatId: "qux", toFormatId: "quux", converterId: "" },
    ],
  };
  expect(plan(schema, "bar", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
    ],
  });
  expect(plan(schema, "bar", "qux")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "qux",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
      { value: { field: "convert", value: { formatId: "qux" } } },
    ],
  });
  expect(plan(schema, "bar", "quux")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "quux",
    entries: [
      { value: { field: "convert", value: { formatId: "baz" } } },
      { value: { field: "convert", value: { formatId: "qux" } } },
      { value: { field: "convert", value: { formatId: "quux" } } },
    ],
  });
});

// (foo) >> (baz)
//   ^        ^
// (bar) >> (qux)
test("inherit5", () => {
  const schema: Schema = {
    ...getDefaultSchemaValue(),
    formats: [
      { ...getDefaultFormatValue(), id: "foo" },
      { ...getDefaultFormatValue(), id: "bar", parentFormatIds: ["foo"] },
      { ...getDefaultFormatValue(), id: "baz" },
      { ...getDefaultFormatValue(), id: "qux", parentFormatIds: ["baz"] },
    ],
    edges: [
      { fromFormatId: "foo", toFormatId: "baz", converterId: "" },
      { fromFormatId: "bar", toFormatId: "qux", converterId: "" },
    ],
  };
  expect(plan(schema, "bar", "baz")).toEqual<ConvertPlan>({
    fromFormatId: "bar",
    toFormatId: "baz",
    entries: [
      { value: { field: "convert", value: { formatId: "qux" } } },
      { value: { field: "upcast", value: { formatId: "baz" } } },
    ],
  });
});
