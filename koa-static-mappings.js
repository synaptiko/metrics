import send from 'koa-send'
import koaStatic from 'koa-static'
import koaMount from 'koa-mount'
import koaCompose from 'koa-compose'

export default function ({ root, index, ...mappings }) {
  const handleRoot = koaStatic(root)
  const handleMappings = []

  for (let urlPath in mappings) {
    const filePath = mappings[urlPath]
    handleMappings.push(koaMount(`/${urlPath}`, async (ctx) => send(ctx, filePath)))
  }

  async function handleIndexFallback (ctx, next) {
    let done = false

    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      try {
        done = await send(ctx, '/', { root, index })
      } catch (err) {
        if (err.status !== 404) {
          throw err
        }
      }
    }

    if (!done) {
      await next()
    }
  }

  return koaCompose([handleRoot, ...handleMappings, handleIndexFallback])
}
