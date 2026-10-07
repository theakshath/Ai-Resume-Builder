import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { paginatedResponse, createdResponse } from "@/lib/responses";
import { z } from "zod";
import { parseRequestBody } from "@/lib/validations";
import { getUserResumesDocs, createResumeDoc, ResumeDocument } from "@/lib/firebase/firestore";

/**
 * Safely converts Firestore documents into JSON-safe objects.
 * Omits undefined fields and converts Firestore Timestamps to ISO strings.
 */
function sanitizeResume(doc: any): ResumeDocument {
  const safeDoc: Record<string, any> = {};
  if (doc && typeof doc === "object") {
    for (const key of Object.keys(doc)) {
      const val = doc[key];
      if (val === undefined) {
        continue;
      } else if (val && typeof val === "object" && typeof val.toDate === "function") {
        safeDoc[key] = val.toDate().toISOString();
      } else {
        safeDoc[key] = val;
      }
    }
  }
  return {
    id: safeDoc.id || "",
    uid: safeDoc.uid || "",
    title: safeDoc.title || "Untitled Resume",
    createdAt: safeDoc.createdAt || new Date().toISOString(),
    updatedAt: safeDoc.updatedAt || new Date().toISOString(),
    ...safeDoc,
  };
}

/**
 * GET /api/resumes
 * Lists resumes belonging strictly to the authenticated user.
 */
export async function GET(request: NextRequest) {
  console.error("[API /resumes] request started");

  try {
    const user = await getCurrentUser();

    console.error("[API /resumes] authenticated user:", {
      authenticated: !!user,
      uid: user?.id ?? null,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication session expired or invalid.",
            retryable: false,
          },
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    // Parse limit and page safely per prompt requirement 9
    const rawLimit = Number(searchParams.get("limit") || 10);
    const limit = Math.min(Math.max(isNaN(rawLimit) ? 10 : rawLimit, 1), 50);

    const rawPage = Number(searchParams.get("page") || 1);
    const page = Math.max(isNaN(rawPage) ? 1 : rawPage, 1);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const status = searchParams.get("status")?.trim().toLowerCase() || "";

    console.error("[API /resumes] query limit:", limit);

    let rawResumes: ResumeDocument[] = [];
    try {
      rawResumes = await getUserResumesDocs(user.id);
    } catch (firestoreError: any) {
      console.error("[API /resumes] Firestore error:", {
        code: firestoreError?.code,
        message: firestoreError?.message,
      });
      rawResumes = [];
    }

    // Filter by title / status if provided
    let filteredResumes = (rawResumes || []).map(sanitizeResume);

    if (search) {
      filteredResumes = filteredResumes.filter((r) =>
        r.title?.toLowerCase().includes(search)
      );
    }

    if (status) {
      filteredResumes = filteredResumes.filter((r) =>
        (r as any).status?.toLowerCase() === status
      );
    }

    const total = filteredResumes.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filteredResumes.slice(startIndex, startIndex + limit);

    return paginatedResponse(paginatedItems, page, limit, total);
  } catch (error: any) {
    console.error("[API /resumes GET] ERROR:", {
      code: error?.code,
      message: error?.message,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESUME_FETCH_FAILED",
          message: "Unable to load resumes right now.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes
 * Creates a new resume for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication session expired or invalid.",
          },
        },
        { status: 401 }
      );
    }

    const bodySchema = z.object({
      title: z.string().optional(),
      templateStyle: z.string().optional(),
      summary: z.string().optional()
    });
    const body = await parseRequestBody(request, bodySchema);

    const title = body.title?.trim() || "Untitled Resume";
    const now = new Date().toISOString();

    const resumeData: ResumeDocument = {
      uid: user.id,
      title,
      createdAt: now,
      updatedAt: now,
      ...(body.templateStyle ? { templateStyle: body.templateStyle } : {}),
      ...(body.summary ? { summary: body.summary } : {}),
    };

    const resumeId = await createResumeDoc(user.id, resumeData);

    const createdResume = sanitizeResume({
      id: resumeId,
      ...resumeData,
    });

    return createdResponse(createdResume);
  } catch (error: any) {
    console.error("[API /resumes POST] ERROR:", error?.message);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESUME_CREATION_FAILED",
          message: "Failed to create resume.",
        },
      },
      { status: 500 }
    );
  }
}
