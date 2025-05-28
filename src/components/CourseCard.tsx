"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    progress?: number;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <img
            src={`https://img.youtube.com/vi/${course._id}/maxresdefault.jpg`}
            alt={course.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button asChild>
              <Link
                href={`/course/${course._id}`}
                className="flex items-center"
              >
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      {course.progress !== undefined && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
