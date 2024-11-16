import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  allTasks: Task[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.tasks = [...this.allTasks];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.errorMessage = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  search(): void {
    const searchTextLower = this.searchText.toLowerCase();

    if (this.searchText.trim() === '') {
      this.tasks = [...this.allTasks];
    } else {
      this.tasks = this.allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTextLower) ||
        task.description.toLowerCase().includes(searchTextLower)
      );
    }
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isLoading = true;
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.allTasks = this.allTasks.filter((task) => task.taskId !== id);
          this.tasks = this.tasks.filter((task) => task.taskId !== id);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.errorMessage = 'Failed to delete task. Please try again.';
          this.isLoading = false; 
        },
      });
    }
  }
}
