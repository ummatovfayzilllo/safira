import { unlinkSync } from 'fs';
import { join } from 'path';
import { getPathInFileType } from './generators';

export function unlinkFile(filename: string) {
  try {
    // Legacy DB rows may still hold a full URL instead of a bare filename —
    // re-derive the filename so the on-disk path is built correctly.
    const bareName = /^https?:\/\//i.test(filename)
      ? filename.split('/').at(-1) || filename
      : filename;
    const fullPath = join(getPathInFileType(bareName), bareName);
    if (fullPath) unlinkSync(fullPath);
    console.log('unlinkFIle function  -> fullPath : ', fullPath);
  } catch (error) {
    console.log('File deltedted error', error);
  }
}
