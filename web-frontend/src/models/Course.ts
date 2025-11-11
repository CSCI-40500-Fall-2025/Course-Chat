export type Course = {
    _id: string;
    code: string;
    title: string;
    courseId: string | null;
    courseStatus: string | null;
}

// for payload

export type CourseStore = {
    courses: Array<Course>;
    loadCourses: (token?: string) => Promise<void>;
    addCourse: (value: Course, token?: string) => Promise<void>;
    deleteCourse: (value: Course, token?: string) => Promise<void>;
}

export type Coursepayload = {
    courses: Course[];
    message: string;
}