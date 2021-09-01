export async function u8sInU8sOut(
  js: string,
  input: Uint8Array,
): Promise<Uint8Array> {
  return await exec(js, input);
}

export async function u8sInVoidOut(
  js: string,
  input: Uint8Array,
): Promise<void> {
  await exec(js, input);
  return;
}

async function exec(js: string, input: Uint8Array): Promise<any> {
  const jsUrl = URL.createObjectURL(
    new Blob([js], { type: "text/javascript" }),
  );
  const workerCode = `
    import program from '${jsUrl}';
    addEventListener('message', function(event) {
      const input = event.data;
      try {
        const output = program(input);
        if ('buffer' in output && output.buffer instanceof ArrayBuffer) {
          postMessage({ type: 'output', output }, [output.buffer]);
        } else {
          postMessage({ type: 'output', output });
        }
      } catch (error) {
        postMessage({ type: 'error', error });
      }
    });
  `;
  const workerUrl = URL.createObjectURL(
    new Blob([workerCode], { type: "text/javascript" }),
  );
  const worker = new Worker(workerUrl, { type: "module" });
  const result = new Promise<Uint8Array>((resolve, reject) => {
    worker.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "output":
          resolve(event.data.output);
          break;
        case "error":
          reject(event.data.error);
          break;
      }
    });
    worker.postMessage(input, [input.buffer]);
  });
  try {
    return await Promise.race([
      result,
      wait(1000).then(() => {
        throw new Error("timeout");
      }),
    ]);
  } finally {
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
    URL.revokeObjectURL(jsUrl);
  }
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
