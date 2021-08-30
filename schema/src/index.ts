import { customAlphabet } from "nanoid";
import * as kvf from "@riiid/cabriolet-proto/lib/messages/riiid/kvf";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);
const newFormatId = () => "fmt_" + nanoid();
const newValidatorId = () => "vld_" + nanoid();
const newConverterId = () => "cvt_" + nanoid();

export function createFormat(
  schema: kvf.Schema,
  { formatName, formatDescription }: kvf.CreateFormatRequest,
): kvf.Schema {
  const format = {
    id: newFormatId(),
    name: formatName,
    description: formatDescription,
    parentFormatId: undefined,
    validatorIds: [],
  };
  return {
    ...schema,
    formats: [...schema.formats, format],
  };
}

export function deleteFormat(
  schema: kvf.Schema,
  { formatId }: kvf.DeleteFormatRequest,
): kvf.Schema {
  return {
    ...schema,
    formats: schema.formats.filter((format) => format.id !== formatId),
  };
}

export function setParent(
  schema: kvf.Schema,
  { formatId, parentFormatId }: kvf.SetParentRequest,
): kvf.Schema {
  // TODO: check ancestor
  return {
    ...schema,
    formats: schema.formats.map((format) => {
      if (format.id !== formatId) return format;
      return {
        ...format,
        parentFormatId,
      };
    }),
  };
}

export function deleteParent(
  schema: kvf.Schema,
  { formatId }: kvf.DeleteParentRequest,
): kvf.Schema {
  return {
    ...schema,
    formats: schema.formats.map((format) => {
      if (format.id !== formatId) return format;
      return {
        ...format,
        parentFormatId: undefined,
      };
    }),
  };
}

export function appendValidator(
  schema: kvf.Schema,
  {
    formatId,
    validatorName,
    validatorDescription,
    validatorSrc,
    validatorIntegrity,
  }: kvf.AppendValidatorRequest,
): kvf.Schema {
  const validator = {
    id: newValidatorId(),
    name: validatorName,
    description: validatorDescription,
    src: validatorSrc,
    integrity: validatorIntegrity,
  };
  return {
    ...schema,
    formats: schema.formats.map((format) => {
      if (format.id !== formatId) return format;
      return {
        ...format,
        validatorIds: [...format.validatorIds, validator.id],
      };
    }),
    validators: [...schema.validators, validator],
  };
}

export function removeValidator(
  schema: kvf.Schema,
  { formatId, validatorId }: kvf.RemoveValidatorRequest,
): kvf.Schema {
  return {
    ...schema,
    formats: schema.formats.map((format) => {
      if (format.id !== formatId) return format;
      return {
        ...format,
        validatorIds: format.validatorIds.filter(
          (validatorId) => validatorId !== validatorId,
        ),
      };
    }),
    validators: schema.validators.filter(
      (validator) => validator.id !== validatorId,
    ),
  };
}

export function createConverter(
  schema: kvf.Schema,
  {
    fromFormatId,
    toFormatId,
    converterName,
    converterDescription,
    converterSrc,
    converterIntegrity,
  }: kvf.CreateConverterRequest,
): kvf.Schema {
  const converter = {
    id: newConverterId(),
    name: converterName,
    description: converterDescription,
    src: converterSrc,
    integrity: converterIntegrity,
  };
  const edge = {
    fromFormatId,
    toFormatId,
    converterId: converter.id,
  };
  // TODO: check duplicate edge
  return {
    ...schema,
    edges: [...schema.edges, edge],
    converters: [...schema.converters, converter],
  };
}

export function deleteConverter(
  schema: kvf.Schema,
  { converterId }: kvf.DeleteConverterRequest,
): kvf.Schema {
  return {
    ...schema,
    edges: schema.edges.filter(
      (edge) => edge.converterId !== converterId,
    ),
    converters: schema.converters.filter(
      (converter) => converter.id !== converterId,
    ),
  };
}
