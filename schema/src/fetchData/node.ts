import { readFile } from "fs/promises";
import parseDataURL from "data-urls";
import fetch from "node-fetch";
import type { FetchDataFn } from ".";

const fetchData: FetchDataFn = async (src) => {
  if (src.startsWith(".") || src.startsWith("/")) return await readFile(src);
  if (src.startsWith("file:")) {
    const url = new URL(src);
    return await readFile(decodeURIComponent(url.pathname));
  }
  if (src.startsWith("data:")) {
    const data = parseDataURL(src);
    if (!data) throw new Error("Invalid data URL");
    return data.body;
  }
  return await fetch(src).then((res) => res.buffer());
};

export default fetchData;
