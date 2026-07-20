/**
 * One-off data migration — normalizes legacy full-URL values down to bare
 * filenames across every file/image/video field, matching the storage
 * convention introduced by safira_backend/file_service_fix.md.
 *
 * NOT required for correctness anymore: common/utils/generators.ts
 * (urlGenerator) and common/utils/file.helpers.ts (unlinkFile) were patched
 * to detect and gracefully handle legacy full-URL values on read/delete, so
 * old rows keep working even without running this script. This migration is
 * a cleanliness pass — it makes every row consistent with the new
 * bare-filename convention, and removes the need for the legacy-URL guard
 * clauses to keep firing on every read.
 *
 * NOT executed automatically — run manually, against a DB you've backed up:
 *
 *   cd safira_backend
 *   npx ts-node --transpile-only scripts/migrate-file-urls-to-filenames.ts
 *
 * Add --dry-run to only print what would change, without writing:
 *
 *   npx ts-node --transpile-only scripts/migrate-file-urls-to-filenames.ts --dry-run
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

function toBareName(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return null; // already bare, nothing to do
  const bare = value.split('/').at(-1);
  return bare && bare !== value ? bare : null;
}

function toBareNames(values: string[] | null | undefined): string[] | null {
  if (!values || values.length === 0) return null;
  let changed = false;
  const mapped = values.map((v) => {
    const bare = toBareName(v);
    if (bare) changed = true;
    return bare ?? v;
  });
  return changed ? mapped : null;
}

async function migrateScalarField<
  Row extends { id: string | number },
>(opts: {
  label: string;
  rows: Row[];
  field: keyof Row;
  update: (id: Row['id'], value: string) => Promise<unknown>;
}) {
  let changedCount = 0;
  for (const row of opts.rows) {
    const bare = toBareName(row[opts.field] as unknown as string | null);
    if (!bare) continue;
    changedCount++;
    console.log(
      `[${opts.label}] #${row.id}: ${String(row[opts.field])} -> ${bare}`,
    );
    if (!DRY_RUN) {
      await opts.update(row.id, bare);
    }
  }
  console.log(`[${opts.label}] ${changedCount} row(s) ${DRY_RUN ? 'would be' : ''} updated.`);
  return changedCount;
}

async function migrateArrayField<
  Row extends { id: string | number },
>(opts: {
  label: string;
  rows: Row[];
  field: keyof Row;
  update: (id: Row['id'], value: string[]) => Promise<unknown>;
}) {
  let changedCount = 0;
  for (const row of opts.rows) {
    const bare = toBareNames(row[opts.field] as unknown as string[] | null);
    if (!bare) continue;
    changedCount++;
    console.log(`[${opts.label}] #${row.id}: files[] normalized.`);
    if (!DRY_RUN) {
      await opts.update(row.id, bare);
    }
  }
  console.log(`[${opts.label}] ${changedCount} row(s) ${DRY_RUN ? 'would be' : ''} updated.`);
  return changedCount;
}

async function main() {
  console.log(`Starting file-URL -> bare-filename migration${DRY_RUN ? ' (DRY RUN, no writes)' : ''}...\n`);

  const totals: number[] = [];

  totals.push(
    await migrateScalarField({
      label: 'User.image',
      rows: await prisma.user.findMany({ select: { id: true, image: true } }),
      field: 'image',
      update: (id, value) =>
        prisma.user.update({ where: { id: id as string }, data: { image: value } }),
    }),
  );

  const courses = await prisma.course.findMany({
    select: { id: true, banner: true, introVideo: true },
  });
  totals.push(
    await migrateScalarField({
      label: 'Course.banner',
      rows: courses,
      field: 'banner',
      update: (id, value) =>
        prisma.course.update({ where: { id: id as string }, data: { banner: value } }),
    }),
  );
  totals.push(
    await migrateScalarField({
      label: 'Course.introVideo',
      rows: courses,
      field: 'introVideo',
      update: (id, value) =>
        prisma.course.update({ where: { id: id as string }, data: { introVideo: value } }),
    }),
  );

  totals.push(
    await migrateScalarField({
      label: 'Lesson.video',
      rows: await prisma.lesson.findMany({ select: { id: true, video: true } }),
      field: 'video',
      update: (id, value) =>
        prisma.lesson.update({ where: { id: id as string }, data: { video: value } }),
    }),
  );

  totals.push(
    await migrateScalarField({
      label: 'LessonFile.file',
      rows: await prisma.lessonFile.findMany({ select: { id: true, file: true } }),
      field: 'file',
      update: (id, value) =>
        prisma.lessonFile.update({ where: { id: id as string }, data: { file: value } }),
    }),
  );

  totals.push(
    await migrateArrayField({
      label: 'Homework.files',
      rows: await prisma.homework.findMany({ select: { id: true, files: true } }),
      field: 'files',
      update: (id, value) =>
        prisma.homework.update({ where: { id: id as string }, data: { files: value } }),
    }),
  );

  totals.push(
    await migrateArrayField({
      label: 'HomeworkSubmission.files',
      rows: await prisma.homeworkSubmission.findMany({
        select: { id: true, files: true },
      }),
      field: 'files',
      update: (id, value) =>
        prisma.homeworkSubmission.update({
          where: { id: id as string },
          data: { files: value },
        }),
    }),
  );

  totals.push(
    await migrateScalarField({
      label: 'Question.file',
      rows: await prisma.question.findMany({ select: { id: true, file: true } }),
      field: 'file',
      update: (id, value) =>
        prisma.question.update({ where: { id: id as string }, data: { file: value } }),
    }),
  );

  const grandTotal = totals.reduce((a, b) => a + b, 0);
  console.log(`\nDone. ${grandTotal} row(s) total ${DRY_RUN ? 'would be' : 'were'} normalized.`);
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
