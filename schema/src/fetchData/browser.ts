import type { FetchDataFn } from ".";

const fetchData: FetchDataFn = async (src) => {
  const res = await fetch(src);
  return new Uint8Array(await res.arrayBuffer());
};

export default fetchData;
