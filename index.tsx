import * as airx from "airx"

// @ts-expect-error
import pages from "~airx-pages"
import { ThemeApp } from './theme'

airx
  .createApp(<ThemeApp posts={pages} />)
  .mount(document.getElementById('app')!)

console.log('22222')
