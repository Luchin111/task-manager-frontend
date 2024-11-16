import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEdit = false;
  isLoading = true; // Variable para controlar el estado de carga

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [{ value: '', disabled: this.isLoading }, Validators.required],
      description: [{ value: '', disabled: this.isLoading }],
      dueDate: [{ value: '', disabled: this.isLoading }, Validators.required],
      isCompleted: [{ value: false, disabled: this.isLoading }],
    });

    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.isEdit = true;
      this.taskService.getTaskById(+taskId).subscribe((task) => {
        this.taskForm.patchValue(task);
        this.isLoading = false; // Deshabilita el estado de carga cuando los datos se cargan
        this.taskForm.enable(); // Habilita el formulario una vez que los datos están disponibles
      });
    } else {
      this.isLoading = false; // Deshabilita el estado de carga en modo creación
      this.taskForm.enable(); // Habilita el formulario
    }
  }

  saveTask(): void {
    if (this.isEdit) {
      const taskId = Number(this.route.snapshot.paramMap.get('id'));
      this.taskService.updateTask(taskId, this.taskForm.value).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
