
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import CourseCard from '@/components/CourseCard';
import { mockCourses, mockUserProgress } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  // For demo purposes, let's show all courses as "enrolled"
  // In a real app, we'd filter based on user's enrollments
  const enrolledCourses = mockCourses.map(course => {
    const progress = mockUserProgress.find(p => p.courseId === course.id);
    return {
      ...course,
      progress: progress ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0,
    };
  });

  // Filter for tabs
  const allCourses = enrolledCourses;
  const inProgressCourses = enrolledCourses.filter(course => course.progress! > 0 && course.progress! < 100);
  const completedCourses = enrolledCourses.filter(course => course.progress! === 100);

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Track your learning progress
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/create-course" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              All Courses ({allCourses.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCourses.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {allCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses yet"
                description="Create your first course or browse the catalog to enroll."
              />
            )}
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-0">
            {inProgressCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inProgressCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses in progress"
                description="Continue learning or enroll in a new course."
              />
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {completedCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No completed courses"
                description="You haven't completed any courses yet. Keep learning!"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

// Empty state component for tabs with no courses
const EmptyState: React.FC<{title: string; description: string}> = ({title, description}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
      <PlusCircle className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 mb-6 max-w-sm">{description}</p>
    <div className="flex gap-4">
      <Button asChild>
        <Link to="/create-course">Create Course</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/browse">Browse Courses</Link>
      </Button>
    </div>
  </div>
);

export default Dashboard;
