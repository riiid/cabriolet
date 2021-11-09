import { Pool } from "pg";
import {
  AppendValidatorRequest,
  CreateConverterRequest,
  CreateFormatRequest,
  DeleteConverterRequest,
  DeleteFormatRequest,
  Format,
  RemoveValidatorRequest,
  Schema,
  Validator,
} from "../../../proto/lib/messages/riiid/kvf";

export async function createFormat(
  pool: Pool,
  { formatName, formatDescription }: CreateFormatRequest
): Promise<Format> {
  const client = await pool.connect();
  const queryConfig = {
    text: `INSERT INTO formats(name, description) VALUES($1, $2) RETURNING *`,
    values: [formatName, formatDescription],
  };
  const res = await client.query(queryConfig);
  const format = res.rows[0];
  await client.release();
  return format;
}

export async function deleteFormat(
  pool: Pool,
  { formatId }: DeleteFormatRequest
) {
  const client = await pool.connect();
  const sql = `DELETE FROM formats WHERE id = ${formatId}`;
  await client.query(sql);
  await client.release();
}

export async function createValidator(
  pool: Pool,
  {
    formatId,
    validatorName,
    validatorDescription,
    validatorSrc,
    validatorIntegrity,
  }: AppendValidatorRequest
) {
  const client = await pool.connect();
  const validatorQueryConfig = {
    text: `INSERT INTO validators(name, description, src, integrity) VALUES($1, $2, $3, $4) RETURNING *`,
    values: [
      validatorName,
      validatorDescription,
      validatorSrc,
      validatorIntegrity,
    ],
  };
  const validator: Validator = (await client.query(validatorQueryConfig))
    .rows[0];
  client.release();
  const format = await getFormat(pool, formatId);
  const validatorIds = (
    await getValidatorIds(format.validatorIds, validator.id)
  ).map((res) => res.toString());
  await updateFormatValidatorIds(pool, formatId, validatorIds);
  return {
    validatorId: validator.id,
  };
}

export async function deleteValidator(
  pool: Pool,
  { formatId, validatorId }: RemoveValidatorRequest
) {
  const client = await pool.connect();
  const deleteValidatorSql = `DELETE FROM validators WHERE id = ${validatorId}`;
  await client.query(deleteValidatorSql);
  const format = await getFormat(pool, formatId);
  const validatorIds = format.validatorIds.filter(
    (formatValidatorId: string) => formatValidatorId != validatorId
  );
  await updateFormatValidatorIds(pool, formatId, validatorIds);
  client.release();
}

export async function createConverter(
  pool: Pool,
  {
    fromFormatId,
    toFormatId,
    converterName,
    converterDescription,
    converterSrc,
    converterIntegrity,
  }: CreateConverterRequest
) {
  const client = await pool.connect();
  const converterSqlConfig = {
    text: `INSERT INTO converters("fromFormatId", "toFormatId", name, description, src, integrity) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    values: [
      fromFormatId,
      toFormatId,
      converterName,
      converterDescription,
      converterSrc,
      converterIntegrity,
    ],
  };
  const converter = (await client.query(converterSqlConfig)).rows[0];
  client.release();
  return {
    fromFormatId: converter.fromFormatId as string,
    toFormatId: converter.toFormatId as string,
  };
}

export async function deleteConverter(
  pool: Pool,
  { fromFormatId, toFormatId }: DeleteConverterRequest
) {
  const client = await pool.connect();
  const sql = `DELETE FROM converters WHERE "fromFormatId" = '${fromFormatId}' AND "toFormatId" = '${toFormatId}'`;
  await client.query(sql);
  client.release();
}

export async function getFormat(pool: Pool, formatId: string) {
  const client = await pool.connect();
  const sql = `SELECT * FROM formats WHERE id = ${formatId}`;
  const format = (await client.query(sql)).rows[0];
  client.release();
  return format;
}

export async function updateFormatValidatorIds(
  pool: Pool,
  formatId: string,
  validatorIds: string[]
) {
  const client = await pool.connect();
  const queryConfig = {
    text: `UPDATE formats SET "validatorIds" = $1 WHERE id = $2`,
    values: [validatorIds, formatId],
  };
  await client.query(queryConfig);
  client.release();
}
export async function getValidatorIds(
  validatorIds: string[],
  validatorId: string
) {
  if (validatorIds) {
    return [...validatorIds, validatorId];
  } else {
    return [validatorId];
  }
}

export async function getSchema(pool: Pool): Promise<Schema> {
  const client = await pool.connect();
  const formatSql = "SELECT * FROM formats";
  const formats: Format[] = (await client.query(formatSql)).rows;
  const validatorSql = "SELECT * FROM validators";
  const validators = await client.query(validatorSql);
  const converterSql = "SELECT * FROM converters";
  const converters = await client.query(converterSql);
  const schema: Schema = {
    formats: formats,
    validators: validators.rows,
    converters: converters.rows,
  };
  await client.release();
  return schema;
}
