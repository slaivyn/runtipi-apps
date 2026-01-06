import { expect, test, describe } from "bun:test";
import { appInfoSchema, parseComposeJson } from '@runtipi/common/schemas'
import fs from 'node:fs'
import path from 'node:path'

const getApps = async () => {
  const appsDir = await fs.promises.readdir(path.join(process.cwd(), 'apps'))

  const appDirs = appsDir.filter((app) => {
    const stat = fs.statSync(path.join(process.cwd(), 'apps', app))
    return stat.isDirectory()
  })

  return appDirs
};

const getFile = async (app: string, file: string) => {
  const filePath = path.join(process.cwd(), 'apps', app, file)
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8')
    return file
  } catch (err) {
    return null
  }
}

describe("each app should have the required files", async () => {
  const apps = await getApps()

  for (const app of apps) {
    const files = ['config.json', 'docker-compose.json', 'metadata/logo.jpg', 'metadata/description.md']

    for (const file of files) {
      test(`app ${app} should have ${file}`, async () => {
        const fileContent = await getFile(app, file)
        expect(fileContent).not.toBeNull()
      })
    }
  }
})

describe("each app should have a valid config.json", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid config.json`, async () => {
      const fileContent = await getFile(app, 'config.json')
      const schema = appInfoSchema.omit("urn")
      const parsed = schema(JSON.parse(fileContent || '{}'))

      if (parsed instanceof Error) {
        console.error(`Error parsing config.json for app ${app}:`, parsed.message);
      }

      expect(parsed).not.toBeInstanceOf(Error)
    })
  }
})

describe("each app should have a valid docker-compose.json", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid docker-compose.json`, async () => {
      const fileContent = await getFile(app, 'docker-compose.json')

      try {
        const parsed = parseComposeJson(JSON.parse(fileContent || '{}'))
        expect(parsed).toBeDefined()
      } catch(err) {
        // Extract just the error message, not the whole object
        let errMsg = 'Unknown error';
        if (Array.isArray(err) && err.length > 0 && err[0].message) {
          if (typeof err[0].message === 'function') {
            errMsg = err[0].message();
          } else {
            errMsg = String(err[0].message);
          }
        }
        console.error(`${app}: ${errMsg}`);
        throw new Error(`Validation failed for ${app}: ${errMsg}`);
      }
    })
  }
});
