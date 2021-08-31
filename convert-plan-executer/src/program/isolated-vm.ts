import ivm from "isolated-vm";

export async function u8sInU8sOut(
  js: string,
  input: Uint8Array,
): Promise<Uint8Array> {
  const { isolate, result } = await execIsolate(
    js,
    new ivm.ExternalCopy(
      input,
      { transferOut: true },
    ).copyInto({ release: true }),
  );
  const out = await (result as ivm.Reference).copy();
  isolate.dispose();
  return out;
}

export async function u8sInVoidOut(
  js: string,
  input: Uint8Array,
): Promise<void> {
  const { isolate } = await execIsolate(
    js,
    new ivm.ExternalCopy(
      input,
      { transferOut: true },
    ).copyInto({ release: true }),
  );
  isolate.dispose();
}

interface ExecIsolateResult {
  isolate: ivm.Isolate;
  result: any;
}
async function execIsolate(js: string, input: any): Promise<ExecIsolateResult> {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const module = await isolate.compileModule(js);
  const context = await isolate.createContext();
  await module.instantiate(context, () => void 0 as any);
  await module.evaluate({ timeout: 1000 });
  const defaultExport = await module.namespace.get(
    "default",
    { reference: true },
  );
  const result = await defaultExport.apply(null, [input]);
  return { isolate, result };
}
