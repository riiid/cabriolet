import { customAlphabet } from "nanoid";
import * as kvf from "@riiid/cabriolet-proto/lib/messages/riiid/kvf";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);
export const newFormatId = () => "fmt_" + nanoid();
export const newValidatorId = () => "vld_" + nanoid();
export const newConverterId = () => "cvt_" + nanoid();

export function createFormat(
  schema: kvf.Schema,
  { formatName, formatDescription }: kvf.CreateFormatRequest,
  formatId = newFormatId()
): kvf.Schema {
  const format = {
    id: formatId,
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
  { formatId }: kvf.DeleteFormatRequest
): kvf.Schema {
  return {
    ...schema,
    formats: schema.formats.filter((format) => format.id !== formatId),
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
  validatorId = newValidatorId()
): kvf.Schema {
  const validator = {
    id: validatorId,
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
  { formatId, validatorId }: kvf.RemoveValidatorRequest
): kvf.Schema {
  return {
    ...schema,
    formats: schema.formats.map((format) => {
      if (format.id !== formatId) return format;
      return {
        ...format,
        validatorIds: format.validatorIds.filter(
          (validatorId) => validatorId !== validatorId
        ),
      };
    }),
    validators: schema.validators.filter(
      (validator) => validator.id !== validatorId
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
  converterId = newConverterId()
): kvf.Schema {
  const converter = {
    id: converterId,
    fromFormatId: fromFormatId,
    toFormatId: toFormatId,
    name: converterName,
    description: converterDescription,
    src: converterSrc,
    integrity: converterIntegrity,
  };

  // TODO: check duplicate edge
  return {
    ...schema,
    converters: [...schema.converters, converter],
  };
}

export function deleteConverter(
  schema: kvf.Schema,
  { converterId }: kvf.DeleteConverterRequest
): kvf.Schema {
  return {
    ...schema,
    converters: schema.converters.filter(
      (converter) => converter.fromFormatId !== converterId
    ),
  };
}
