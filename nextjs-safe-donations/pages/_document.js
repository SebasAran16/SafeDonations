import { Html, Head, Main, NextScript } from "next/document";
import { NotificationProvider } from "web3uikit";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <NotificationProvider>
          <Main />
          <NextScript />
        </NotificationProvider>
      </body>
    </Html>
  );
}
