import { CreatePurcachedCourseDto } from 'src/modules/purcached_courses/dto/create-purcached_course.dto';

export const purcachedCourseFindEntity = (data: CreatePurcachedCourseDto) => {
  return {
    where: {
      AND: [{ userId: data.userId }, { courseId: data.courseId }],
    },
  };
};
