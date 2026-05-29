from typing import Optional

from pydantic import BaseModel, Field


class StudentRegisterRequest(BaseModel):
    fullName: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    confirmPassword: str = Field(..., min_length=6)
    grade: str = Field(..., min_length=1)
    schoolName: str = Field(..., min_length=1)
    className: str = Field(..., min_length=1)
    targetExam: str = Field(default="中考")
    learningPreference: str = Field(default="刷题 + 答疑")
    favoriteSubjects: list[str] = Field(default_factory=list)
    weakSubjects: list[str] = Field(default_factory=list)
    goalSummary: str = Field(default="")
    parentName: str = Field(..., min_length=1)
    parentPhone: str = Field(..., min_length=3)
    parentNoticeOptIn: bool = Field(default=True)
    agreementAccepted: bool = Field(default=False)


class TeacherRegisterRequest(BaseModel):
    fullName: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    confirmPassword: str = Field(..., min_length=6)
    schoolName: str = Field(..., min_length=1)
    teacherTitle: str = Field(..., min_length=1)
    className: str = Field(default="教研组")
    managedSubjects: list[str] = Field(default_factory=list)
    managedGrades: list[str] = Field(default_factory=list)
    inviteCode: str = Field(..., min_length=1)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)


class DiagnosticUpsertRequest(BaseModel):
    subject: str = Field(..., min_length=1)
    gradeBand: str = Field(default="")
    baselineScore: int = Field(default=0, ge=0, le=150)
    confidenceLevel: int = Field(default=0, ge=0, le=10)
    homeworkCompletion: int = Field(default=0, ge=0, le=100)
    mistakeRecovery: int = Field(default=0, ge=0, le=100)
    weakPoints: list[str] | str = Field(default_factory=list)


class ClassroomStartRequest(BaseModel):
    subject: str = Field(default="数学")
    topic: str = Field(default="")


class ClassroomRespondRequest(BaseModel):
    selectedChoiceIndex: Optional[int] = Field(default=None)
    freeText: str = Field(default="")


class AssignmentCreateRequest(BaseModel):
    studentId: int = Field(..., ge=1)
    questionIds: list[str] = Field(default_factory=list)
    subject: str = Field(default="综合")
    query: str = Field(default="")
    title: str = Field(default="")
    notes: str = Field(default="")
