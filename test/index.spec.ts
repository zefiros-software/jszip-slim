import { findZipFolder, JSZip, walkZip } from '~/index'

test('main', async () => {
    const zip = new JSZip()
    zip.folder('bar')?.file('foo.txt', Buffer.from('contents'))
    await expect(
        Promise.all(
            [...walkZip(zip)]
                .filter(([, f]) => !f.dir)
                .map(async ([subPath, file]) => {
                    return {
                        subPath,
                        name: file.name,
                        contents: await file.async('string'),
                    }
                })
        )
    ).resolves.toMatchInlineSnapshot(`
                Array [
                  Object {
                    "contents": "contents",
                    "name": "bar/foo.txt",
                    "subPath": "bar/foo.txt",
                  },
                ]
            `)
    await expect(
        Promise.all(
            [...walkZip(findZipFolder(zip, 'bar'))]
                .filter(([, f]) => !f.dir)
                .map(async ([subPath, file]) => {
                    return {
                        subPath,
                        name: file.name,
                        contents: await file.async('string'),
                    }
                })
        )
    ).resolves.toMatchInlineSnapshot(`
                Array [
                  Object {
                    "contents": "contents",
                    "name": "bar/foo.txt",
                    "subPath": "foo.txt",
                  },
                ]
            `)
})
