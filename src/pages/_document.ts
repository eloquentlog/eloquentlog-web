import h from 'react-hyperscript';

import { NextDocumentContext } from 'next/document';

import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: NextDocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return  { ...initialProps };
  }

  public render() {
    return h('html', [
      h(Head),
      h('body', [
        h(Main),
        h(NextScript)
      ])
    ]);
  }
}
