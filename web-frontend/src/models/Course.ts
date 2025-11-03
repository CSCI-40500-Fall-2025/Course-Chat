export type Course = {
    code: string;
    title: string;
    courseId: string | null;
    courseStatus: string | null;
}

// for payload

export type CourseStore = {
    courses: Array<Course>;
    loadCourses: () => Promise<void>;
    addCourse: (value: Course) => Promise<void>;
    //deleteCourse: (value: Course) => Promise<void>;
}

export type Coursepayload = {
    courses: Course[];
    message: string;
}