import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { successResponse } from "@/lib/responses";
import { parseRequestBody } from "@/lib/validations";
import { updateResumeSchema } from "@/lib/validations/resume";
import { getResumeDocById, updateResumeDoc, deleteResumeDoc, ResumeDocument } from "@/lib/firebase/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/resumes/[id]
 * Retrieves a single resume.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const resume = await getResumeDocById(user.id, id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found.",
          },
        },
        { status: 404 }
      );
    }

    return successResponse(resume);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESUME_FETCH_FAILED",
          message: error?.message || "Unable to fetch resume.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resumes/[id]
 * Updates an existing resume belonging to the authenticated user.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const body = await parseRequestBody(request, updateResumeSchema);

    await updateResumeDoc(user.id, id, body);

    const updated = await getResumeDocById(user.id, id);
    return successResponse(updated || { id, ...body });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESUME_UPDATE_FAILED",
          message: error?.message || "Failed to update resume.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 * Deletes a resume belonging to the authenticated user.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    await deleteResumeDoc(user.id, id);
    return successResponse({ deleted: true, id });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESUME_DELETE_FAILED",
          message: error?.message || "Failed to delete resume.",
        },
      },
      { status: 500 }
    );
  }
}
