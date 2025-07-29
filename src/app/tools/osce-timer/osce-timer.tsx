"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const initialTasks = [
    { id: 1, text: "Wash hands", completed: false },
    { id: 2, text: "Introduce self to patient", completed: false },
    { id: 3, text: "Confirm patient details (name, DOB)", completed: false },
    { id: 4, text: "Explain procedure and gain consent", completed: false },
    { id: 5, text: "Perform examination/procedure", completed: false },
    { id: 6, text: "Summarize findings", completed: false },
    { id: 7, text: "Thank patient", completed: false },
];

export function Oscetimer() {
  const [minutes, setMinutes] = useState(8);
  const [totalSeconds, setTotalSeconds] = useState(minutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    setTotalSeconds(minutes * 60);
    setSecondsLeft(minutes * 60);
    setIsActive(false);
  }, [minutes]);
  

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      audioRef.current?.play();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
  };

  const handleTaskToggle = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleAddTask = () => {
      if (newTaskText.trim() === '') return;
      const newTask = {
          id: Date.now(),
          text: newTaskText.trim(),
          completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
  }
  
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const progress = (secondsLeft / totalSeconds) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>OSCE Station Timer</CardTitle>
          <CardDescription>Practice your clinical skills under timed conditions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
           <div className="flex items-center gap-2">
                <Label htmlFor="minutes-input">Set duration (minutes):</Label>
                <Input 
                    id="minutes-input"
                    type="number" 
                    value={minutes} 
                    onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                    disabled={isActive}
                />
           </div>
          <div className="relative h-48 w-48">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                className="stroke-current text-gray-200 dark:text-gray-700"
                strokeWidth="7"
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
              ></circle>
              <circle
                className="stroke-current text-primary"
                strokeWidth="7"
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold font-mono">{formatTime(secondsLeft)}</span>
            </div>
          </div>
          <div className="flex w-full justify-center space-x-4">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? <Pause /> : <Play />}
              <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw />
              <span className="ml-2">Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Station Checklist</CardTitle>
          <CardDescription>Keep track of your key tasks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <Label htmlFor={`task-${task.id}`} className={`transition-colors ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.text}
                    </Label>
                </div>
                 <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <Input 
                placeholder="Add a new task..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}><Plus/></Button>
          </div>
        </CardContent>
      </Card>
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />
    </div>
  );
}
