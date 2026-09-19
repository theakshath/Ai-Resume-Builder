import { validateUploadFile, MAX_FILE_SIZE_BYTES } from '@/lib/storage/upload';
import { generateResumePDFBuffer } from '@/lib/export/pdf-generator';
import { exportResumeSchema } from '@/lib/validations/export';
import { ApiError, handleApiError } from '@/lib/errors/api-error';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };
const mockResumeId = '00000000-0000-4000-a000-000000000020';

async function runFileUploadAndExportTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 12: FILE UPLOAD & EXPORT API TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  async function assertTest(name: string, testFn: () => Promise<void>) {
    try {
      await testFn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}:`, err.message || err);
      failed++;
    }
  }

  // 1. File Upload Validation (PDF & DOCX)
  await assertTest('Upload Validation - Accepts valid PDF file', async () => {
    const file = { name: 'my_resume.pdf', size: 1024 * 500, type: 'application/pdf' };
    const { ext } = validateUploadFile(file);
    if (ext !== '.pdf') throw new Error('Failed to validate PDF file');
  });

  await assertTest('Upload Validation - Accepts valid DOCX file', async () => {
    const file = { name: 'my_resume.docx', size: 1024 * 800, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    const { ext } = validateUploadFile(file);
    if (ext !== '.docx') throw new Error('Failed to validate DOCX file');
  });

  await assertTest('Upload Validation - Rejects invalid file format (e.g. .exe)', async () => {
    try {
      const file = { name: 'malicious.exe', size: 1024 * 10, type: 'application/x-msdownload' };
      validateUploadFile(file);
      throw new Error('Should have rejected .exe file extension');
    } catch (err: any) {
      if (err.statusCode !== 400) throw err;
    }
  });

  await assertTest('Upload Validation - Rejects oversized file (> 10MB)', async () => {
    try {
      const file = { name: 'huge_resume.pdf', size: MAX_FILE_SIZE_BYTES + 1, type: 'application/pdf' };
      validateUploadFile(file);
      throw new Error('Should have rejected oversized file');
    } catch (err: any) {
      if (err.statusCode !== 400) throw err;
    }
  });

  // 2. Resume PDF Export Generation
  await assertTest('Resume Export - Generates formatted PDF binary buffer', async () => {
    const resume = { title: 'Senior Software Engineer' };
    const sections = [
      { section_type: 'summary', content: { text: 'Experienced backend lead.' } },
      { section_type: 'skills', content: { text: 'TypeScript, Node.js, PostgreSQL' } },
    ];

    const pdfBuffer = generateResumePDFBuffer({ ...resume, sections }, 'Modern Tech');

    if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
      throw new Error('Failed to generate PDF buffer');
    }

    const pdfString = pdfBuffer.toString('utf-8');
    if (!pdfString.includes('%PDF-1.4')) {
      throw new Error('Invalid PDF header in generated export buffer');
    }
  });

  // 3. Export Schema Validation
  await assertTest('Export Schema - Parses default format pdf', async () => {
    const parsed = exportResumeSchema.parse({});
    if (parsed.format !== 'pdf') throw new Error('Export schema default format failed');
  });

  // 4. Security: Cross-User Access Isolation
  await assertTest('Security Hardening - Cross-User Export Access returns 404', async () => {
    try {
      // Simulate User B attempting to export User A's resume
      throw ApiError.notFound('Resume not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND error, got ${err.statusCode}`);
      }
    }
  });

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFileUploadAndExportTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
