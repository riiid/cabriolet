import { Pool, PoolClient } from "pg";
import createAzureRegistry from "./registry";
import { PostgresDatabaseConfig } from "./postgresDatabaseConfig";
import { Registry } from "../../../service";
import { migrate } from "postgres-migrations";
import * as path from "path";
import { Schema } from "../../../proto/lib/messages/riiid/kvf";
import * as crypto from "crypto";

let pool: Pool;
let registry: Registry;
const dbName = "postgres";
const user = "postgres";
const pwd = "yourpassword";
const host = "localhost";
const port = "5432";
const migrationsDirectory = path.resolve("./src/migrations");
const connectionSting = `postgres://${user}:${pwd}@${host}:${port}/${dbName}`;

beforeAll(async () => {
  pool = await new Pool({
    connectionString: connectionSting,
  });
  const config: PostgresDatabaseConfig = {
    pool: pool,
  };

  const client = await config.pool.connect();
  try {
    await migrate({ client }, migrationsDirectory);
  } finally {
    await client.release();
  }

  registry = createAzureRegistry(config);
});

afterEach(async () => {
  const client = await pool.connect();
  const sql = `DELETE
               FROM formats;
  DELETE
  FROM edges;
  DELETE
  FROM converters;
  DELETE
  FROM validators`;
  await client.query(sql);
  await client.release();
});

afterAll(() => {});

describe("CreateRegistryTest", () => {
  describe("getSchema", () => {
    it("when get schema then gets successfully", async () => {
      // when
      const res = await registry.getSchema({});

      // then
      expect(res.schema!.formats).toEqual([]);
      expect(res.schema!.edges).toEqual([]);
      expect(res.schema!.converters).toEqual([]);
      expect(res.schema!.validators).toEqual([]);
    });
  });

  describe("createFormat", () => {
    it("when create format then format is added to schema successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";

      // when
      await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      const res = await registry.getSchema({});

      // then
      expect(res.schema!!.formats[0].name).toEqual(formatName);
      expect(res.schema!!.formats[0].description).toEqual(formatDescription);
    });
  });

  describe("deleteFormat", () => {
    it("when delete format then format does not exist in formats", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      // when
      const beforeSchema = await registry.getSchema({});
      await registry.deleteFormat({ formatId });
      const afterSchema = await registry.getSchema({});

      // then
      expect(beforeSchema.schema!!.formats[0].id).toEqual(formatId);
      expect(beforeSchema.schema!!.formats[0].name).toEqual(formatName);
      expect(beforeSchema.schema!!.formats[0].description).toEqual(
        formatDescription
      );
      expect(afterSchema.schema!!.formats.length).toEqual(0);
    });
  });

  describe("setParent", () => {
    it("when set parent then parent format id is added successfully in the format", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const parentFormatId = crypto.randomUUID() + "_parentFormatId";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      // when
      registry.setParent({
        formatId: formatId,
        parentFormatId: parentFormatId,
      });
      const res = await registry.getSchema({});

      // then
      console.log(res.schema!.formats);
      expect(res.schema!!.formats[0].parentFormatId).toEqual(parentFormatId);
      // res.then(schema => {
      //     expect(schema.schema!!.formats[0].parentFormatId).toEqual(parentFormatId)
      //
      // }
      // )
      expect(res.schema!!.formats[0].id).toEqual(formatId);
      // res.then(schema => expect(schema.schema!!.formats[0].id).toEqual(formatId))
    });
  });

  describe("deleteParent", () => {
    it("when delete parent then parent format id does not exist in the format", () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const parentFormatId = crypto.randomUUID() + "_parentFormatId";
      registry
        .createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
        .then((res) => {
          const formatId = res.formatId;
          registry.setParent({
            formatId: formatId,
            parentFormatId: parentFormatId,
          });

          // when
          const beforeSchema = registry.getSchema({});
          registry.deleteParent({
            formatId: formatId,
          });
          const afterSchema = registry.getSchema({});

          // then
          beforeSchema.then((schema) =>
            expect(schema.schema!!.formats[0].parentFormatId).toEqual(
              parentFormatId
            )
          );
          beforeSchema.then((schema) =>
            expect(schema.schema!!.formats[0].id).toEqual(formatId)
          );
          afterSchema.then((schema) =>
            expect(schema.schema!!.formats[0].parentFormatId).toEqual(
              "undefined"
            )
          );
        });
    });
  });

  describe("appendValidator", () => {
    it("when create validator then validatorId is added in format successfully and validator is added successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const validatorName = crypto.randomUUID() + "_validatorDescription";
      const validatorDescription =
        crypto.randomUUID() + "_validatorDescription";
      const validationSrc = crypto.randomUUID() + "_validatorSrc";
      const validationIntegrity = crypto.randomUUID() + "_validatorIntegrity";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      // when
      registry
        .appendValidator({
          formatId: formatId,
          validatorName: validatorName,
          validatorDescription: validatorDescription,
          validatorSrc: validationSrc,
          validatorIntegrity: validationIntegrity,
        })
        .then((res) => {
          const validatorId = res.validatorId;
          registry.getSchema({}).then((res) => {
            const schema = res.schema;

            // then
            const validator = schema!.validators[0];
            expect(schema!!.formats[0].validatorIds[0]).toBe(
              validatorId.toString()
            );
            expect(validator.id).toEqual(validatorId);
            expect(validator.name).toEqual(validatorName);
            expect(validator.description).toEqual(validatorDescription);
            expect(validator.src).toEqual(validationSrc);
            expect(validator.integrity).toEqual(validationIntegrity);
          });
        });
    });
  });

  describe("removeValidator", () => {
    it("when delete validator then validatorId is deleted from format and validator is deleted successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const validatorName = crypto.randomUUID() + "_validatorDescription";
      const validatorDescription =
        crypto.randomUUID() + "_validatorDescription";
      const validationSrc = crypto.randomUUID() + "_validatorSrc";
      const validationIntegrity = crypto.randomUUID() + "_validatorIntegrity";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });
      const { validatorId } = await registry.appendValidator({
        formatId: formatId,
        validatorName: validatorName,
        validatorDescription: validatorDescription,
        validatorSrc: validationSrc,
        validatorIntegrity: validationIntegrity,
      });

      // when
      const beforeSchema = await registry.getSchema({});
      await registry.removeValidator({
        formatId: formatId,
        validatorId: validatorId,
      });
      const afterSchema = await registry.getSchema({});

      // then
      const validator = beforeSchema.schema!!.validators[0];
      expect(validator.id).toEqual(validatorId);
      expect(afterSchema.schema!!.validators.length).toEqual(0);
      expect(afterSchema.schema!!.formats[0].validatorIds.length).toEqual(0);
    });
  });

  describe("createConverter", () => {
    it("when create converter then edge and converter are added", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const fromFormatId = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const toFormatId = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const converterName = crypto.randomUUID() + "_converterName";
      const converterDescription =
        crypto.randomUUID() + "_converterDescription";
      const converterSrc = crypto.randomUUID() + "_converterSrc";
      const converterIntegrity = crypto.randomUUID() + "_converterIntegrity";

      // when
      const converterId = await registry.createConverter({
        fromFormatId: fromFormatId,
        toFormatId: toFormatId,
        converterName: converterName,
        converterDescription: converterDescription,
        converterSrc: converterSrc,
        converterIntegrity: converterIntegrity,
      });
      const schema = await registry.getSchema({});

      // then
      expect(schema.schema!!.edges[0].toFormatId).toEqual(
        toFormatId.toString()
      );
      expect(schema.schema!!.edges[0].fromFormatId).toEqual(
        fromFormatId.toString()
      );
      expect(schema.schema!!.edges[0].converterId).toEqual(
        converterId.converterId.toString()
      );
      expect(schema.schema!!.converters[0].id).toEqual(converterId.converterId);
      expect(schema.schema!!.converters[0].name).toEqual(converterName);
      expect(schema.schema!!.converters[0].src).toEqual(converterSrc);
      expect(schema.schema!!.converters[0].integrity).toEqual(
        converterIntegrity
      );
    });
  });

  describe("deleteConverter", () => {
    it("when delete converter then edge and converter are deleted", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const fromFormatId = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const toFormatId = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const converterName = crypto.randomUUID() + "_converterName";
      const converterDescription =
        crypto.randomUUID() + "_converterDescription";
      const converterSrc = crypto.randomUUID() + "_converterSrc";
      const converterIntegrity = crypto.randomUUID() + "_converterIntegrity";
      const { converterId } = await registry.createConverter({
        fromFormatId: fromFormatId,
        toFormatId: toFormatId,
        converterName: converterName,
        converterDescription: converterDescription,
        converterSrc: converterSrc,
        converterIntegrity: converterIntegrity,
      });

      // when
      await registry.deleteConverter({ converterId });
      const schema = await registry.getSchema({});

      // then
      expect(schema.schema!!.edges.length).toEqual(0);
      expect(schema.schema!!.converters.length).toEqual(0);
    });
  });
});
