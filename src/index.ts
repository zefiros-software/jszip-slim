/* eslint-disable @typescript-eslint/consistent-type-imports */
import jszip, { JSZipObject } from 'jszip'

export const JSZip: typeof import('./jszip') = jszip
export type JSZip = typeof import('./jszip')
export type { JSZipFileOptions, JSZipGeneratorOptions, JSZipLoadOptions, JSZipObject, JSZipObjectOptions } from './jszip'

export function findZipFolder(zip: JSZip, dirName: string): JSZip | undefined {
    const candidates = zip.folder(/^[^/]+\/?$/)
    for (let i = 0; i < candidates.length; ++i) {
        const candidate = candidates[i]
        if (candidate.name.endsWith(`${dirName}/`)) {
            return zip.folder(candidate.name) ?? undefined
        }
        candidates.push(...(zip.folder(candidate.name)?.folder(/^[^/]+\/?$/) ?? []))
    }
    return undefined
}

export function* walkZip(zip: JSZip | undefined | null): IterableIterator<[string, JSZipObject]> {
    const entries: [string, JSZipObject][] = []
    zip?.forEach((path, file) => {
        entries.push([path, file])
    })
    yield* entries
}
