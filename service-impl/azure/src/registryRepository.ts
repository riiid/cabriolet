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
  SetParentRequest,
  Validator,
} from "../../../proto/lib/messages/riiid/kvf";
import { Type } from "../../../proto/lib/messages/riiid/kvf/Format";

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

export async function addParentFormatId(
  pool: Pool,
  { formatId, parentFormatId }: SetParentRequest
) {
  const client = await pool.connect();
  const queryConfig = {
    text: `UPDATE formats SET "parentFormatId" = $1 WHERE id = $2`,
    values: [parentFormatId, formatId],
  };
  await client.query(queryConfig);
  await client.release();
}

export async function deleteParentFormatId(
  pool: Pool,
  { formatId }: DeleteFormatRequest
) {
  const client = await pool.connect();
  const sql = `UPDATE formats SET "parentFormatId" = 'undefined' WHERE id = ${formatId}`;
  await client.query(sql);
  client.release();
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
    text: `INSERT INTO converters(name, description, src, integrity) VALUES($1, $2, $3, $4) RETURNING *`,
    values: [
      converterName,
      converterDescription,
      converterSrc,
      converterIntegrity,
    ],
  };
  const converter = (await client.query(converterSqlConfig)).rows[0];
  await createEdge(pool, fromFormatId, toFormatId, converter.id);
  return {
    converterId: converter.id,
  };
}

export async function deleteConverter(
  pool: Pool,
  { converterId }: DeleteConverterRequest
) {
  const client = await pool.connect();
  const queryConfig = {
    text: `DELETE FROM converters WHERE id = $1`,
    values: [converterId],
  };
  await client.query(queryConfig);
  await deleteEdge(pool, converterId);
}

export async function deleteEdge(pool: Pool, converterId: string) {
  const client = await pool.connect();
  const queryConfig = {
    text: `DELETE FROM edges WHERE "converterId" = $1`,
    values: [converterId],
  };
  await client.query(queryConfig);
}

export async function createEdge(
  pool: Pool,
  fromFormatId: string,
  toFormatId: string,
  converterId: string
) {
  const client = await pool.connect();
  const sqlConfig = {
    text: `INSERT INTO edges("fromFormatId", "toFormatId", "converterId") VALUES($1, $2, $3)`,
    values: [fromFormatId, toFormatId, converterId],
  };
  await client.query(sqlConfig);
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
  const edgeSql = "SELECT * FROM edges";
  const edges = await client.query(edgeSql);
  const validatorSql = "SELECT * FROM validators";
  const validators = await client.query(validatorSql);
  const converterSql = "SELECT * FROM converters";
  const converters = await client.query(converterSql);
  const schema: Schema = {
    formats: formats,
    edges: edges.rows,
    validators: validators.rows,
    converters: converters.rows,
  };
  await client.release();
  return schema;
}
