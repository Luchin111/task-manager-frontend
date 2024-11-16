import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service'; // Descomentar para usar el servicio real

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  allTasks: Task[] = [];
  searchText: string = '';

  constructor(private taskService: TaskService, private router: Router) {} // Constructor con el servicio real

  ngOnInit(): void {
    // Datos reales desde el servicio
    this.taskService.getTasks().subscribe((tasks) => {
      this.allTasks = tasks;
      this.tasks = [...this.allTasks]; // Inicializar tasks con datos reales
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
      this.taskService.deleteTask(id).subscribe(() => {
        // Actualizar tanto en allTasks como en tasks después de eliminar
        this.allTasks = this.allTasks.filter((task) => task.taskId !== id);
        this.tasks = this.tasks.filter((task) => task.taskId !== id);
      });
    }
  }
}
