'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

function Page() {
  const { _id: groupId } = useParams();

  // Fetch quizzes for the current group (assuming quizzes are group-specific)
  // You might need to adjust this query if quizzes are course-specific
  // const quizzes = useQuery(api.quizzes.getQuizzesByGroup, {
  //   groupId: groupId as string,
  // });

  const quizzes = [
    {
      _id: 'quiz1',
      title: 'Quiz 1',
      courseTitle: 'Course 1',
    },
    {
      _id: 'quiz2',
      title: 'Quiz 2',
      courseTitle: 'Course 2',
    },
    {
      _id: 'quiz3',
      title: 'Quiz 3',
      courseTitle: 'Course 3',
    },
  ];
  // Assuming you have a way to determine if the current user is a teacher
  const isTeacher = true; // Replace with actual logic to check if user is a teacher

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        {isTeacher && (
          <Button asChild>
            <Link href={`/group/${groupId}/quiz/create`}>Create New Quiz</Link>
          </Button>
        )}
      </div>

      {quizzes && quizzes.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
            >
              <h2 className="mb-2 text-xl font-semibold">{quiz.title}</h2>
              {/* Assuming each quiz has a reference to the course it belongs to */}
              {/* <p className="text-gray-600 dark:text-gray-400">Course: {quiz.courseTitle}</p> */}
              {/* Add a link to the individual quiz page if you have one */}
              {/* <Button asChild variant="outline" className="mt-4">
                <Link href={`/group/${groupId}/quiz/${quiz._id}`}>View Quiz</Link>
              </Button> */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No quizzes found.</p>
      )}
    </div>
  );
}
export default Page;
