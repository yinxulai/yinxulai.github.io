import * as airx from "airx"
import pages from "~airx-pages"
import { ThemeApp } from './theme'

airx
  .createApp(<ThemeApp posts={pages} />)
  .mount(document.getElementById('app')!)
