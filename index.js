import dotenv from 'dotenv'
import { initializeKeys, isTokenValid } from './keys.js'
import { writeMetric, readAllMetrics } from './db.js'
import Koa from 'koa'
import Router from 'koa-router'
import koaStaticMappings from './koa-static-mappings'

dotenv.config()

initializeKeys()

const app = new Koa()
const router = new Router()

router.post('/metrics/:name/:id/:value', async (ctx, next) => {
  const { id, name, value } = ctx.params
  const { token } = ctx.query

  if (isTokenValid(token)) {
    await writeMetric(id, name, value)
    ctx.body = 'OK\n'
  } else {
    ctx.body = 'NOT OK\n'
    ctx.status = 401
  }
})

router.get('/metrics', async (ctx, next) => {
  ctx.body = (await readAllMetrics()).toJsonObject()
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(koaStaticMappings({
  root: 'public',
  index: 'index.html',
  'hyperhtml.js': 'node_modules/hyperhtml-element-esm-bundle/min.js',
  'tabular-data.js': 'common/tabular-data.js'
}))
app.listen(process.env.PORT || 8080, process.env.HOST || '127.0.0.1')
