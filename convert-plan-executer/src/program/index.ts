export interface U8sInU8sOutFn {
  (
    js: string,
    input: Uint8Array,
  ): Promise<Uint8Array>;
}

export interface U8sInVoidOutFn {
  (
    js: string,
    input: Uint8Array,
  ): Promise<void>;
}
