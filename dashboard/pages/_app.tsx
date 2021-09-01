import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import "./_app.css";
import "./antd.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default App;
