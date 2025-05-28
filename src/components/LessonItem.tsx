"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";

interface LessonItemProps {
  lesson: {
    _id: string;
    title: string;
    duration: string;
    completed?: boolean;
  };
  courseId: string;
}

export default function LessonItem({ lesson, courseId }: LessonItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/course/${courseId}/lesson/${lesson._id}`;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start gap-2"
      asChild
    >
      <Link href={`/course/${courseId}/lesson/${lesson._id}`}>
        {lesson.completed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="flex-1 text-left">{lesson.title}</span>
        <span className="text-muted-foreground text-sm">{lesson.duration}</span>
      </Link>
    </Button>
  );
}
