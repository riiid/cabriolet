import { HashFns } from "@pbkit/sri";
import Sha1 from "jssha/dist/sha1";
import Sha256 from "jssha/dist/sha256";
import Sha512 from "jssha/dist/sha512";

const hashFns: HashFns = {
  sha1(data) {
    const hash = new Sha1("SHA-1", "UINT8ARRAY");
    hash.update(data);
    return hash.getHash("UINT8ARRAY");
  },
  sha256(data) {
    const hash = new Sha256("SHA-256", "UINT8ARRAY");
    hash.update(data);
    return hash.getHash("UINT8ARRAY");
  },
  sha384(data) {
    const hash = new Sha512("SHA-384", "UINT8ARRAY");
    hash.update(data);
    return hash.getHash("UINT8ARRAY");
  },
  sha512(data) {
    const hash = new Sha512("SHA-512", "UINT8ARRAY");
    hash.update(data);
    return hash.getHash("UINT8ARRAY");
  },
};
export default hashFns;
