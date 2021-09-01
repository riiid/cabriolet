import { u8sInU8sOut, u8sInVoidOut } from "./isolated-vm";

test("u8sInU8sOut", async () => {
  const out = await u8sInU8sOut(
    `export default x => x;`,
    new Uint8Array([1, 2, 3]),
  );
  expect(out.toString()).toEqual("1,2,3");
});

test("u8sInVoidOut", async () => {
  await u8sInVoidOut(
    `export default x => {};`,
    new Uint8Array([1, 2, 3]),
  );
});
