import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AdminUsersService } from '../../data-access/admin-users';
import {
  AdminUserListItem,
  ASSIGNABLE_ROLES,
  CreateAdminRequest,
} from '../../data-access/admin-users.models';
import { DocumentType } from '../../../profile/data-access/profile.models';
import {
  COLOMBIA_DEPARTMENTS,
  DEFAULT_COUNTRY,
} from '../../../../core/services/colombia-locations';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

type RoleFilter = 'ALL' | 'ADMIN' | 'USER';
type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

interface CreateAdminForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  document_type: DocumentType | '';
  document_number: string;
  phone: string;
  department: string;
  city: string;
}

const EMPTY_FORM: CreateAdminForm = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  document_type: '',
  document_number: '',
  phone: '',
  department: '',
  city: '',
};

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PetButtonComponent, ConfirmDialogComponent],
  templateUrl: './admin-users-page.html',
})
export class AdminUsersPage implements OnInit {
  private readonly adminUsersService = inject(AdminUsersService);

  readonly departments = COLOMBIA_DEPARTMENTS;
  readonly documentTypes: DocumentType[] = ['CC', 'CE', 'TI', 'PASSPORT'];
  readonly roleOptions: RoleFilter[] = ['ALL', 'ADMIN', 'USER'];
  readonly statusOptions: StatusFilter[] = ['ALL', 'ACTIVE', 'INACTIVE'];
  readonly assignableRoles = ASSIGNABLE_ROLES;

  users = signal<AdminUserListItem[]>([]);
  isLoading = signal(false);
  generalError = signal<string | null>(null);
  actionInProgress = signal<string | null>(null);

  /** Nombre completo precomputado por usuario (evita re-join por fila en cada
   * ciclo de detección de cambios). */
  readonly usersView = computed(() => {
    const map = new Map<string, string>();
    for (const u of this.users()) {
      map.set(u.id, [u.first_name, u.last_name].filter(Boolean).join(' ') || '—');
    }
    return map;
  });

  searchTerm = signal('');
  filterRole = signal<RoleFilter>('ALL');
  filterStatus = signal<StatusFilter>('ALL');

  page = signal(1);
  pageSize = signal(20);
  total = signal(0);
  totalPages = signal(0);

  // ---------- Confirmación de cambio de estado ----------
  statusDialogOpen = signal(false);
  statusDialogUser = signal<AdminUserListItem | null>(null);

  // ---------- Cambio de rol inline ----------
  roleDialogOpen = signal(false);
  roleDialogUser = signal<AdminUserListItem | null>(null);
  roleDialogValue = signal<string>('');

  // ---------- Modal crear administrador ----------
  createModalOpen = signal(false);
  createForm = signal<CreateAdminForm>({ ...EMPTY_FORM });
  createError = signal<string | null>(null);
  createLoading = signal(false);

  citiesForSelectedDepartment = computed(() => {
    const dep = this.departments.find((d) => d.value === this.createForm().department);
    return dep?.cities ?? [];
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.isLoading.set(true);
    this.generalError.set(null);

    const role = this.filterRole() === 'ALL' ? undefined : this.filterRole();
    const isActive = this.filterStatus() === 'ALL' ? undefined : this.filterStatus() === 'ACTIVE';

    this.adminUsersService
      .list({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.searchTerm() || undefined,
        role,
        isActive,
      })
      .subscribe({
        next: (response) => {
          this.users.set(response.data.items);
          this.total.set(response.data.total);
          this.totalPages.set(response.data.pages);
          this.isLoading.set(false);
        },
        error: () => {
          this.generalError.set('No pudimos cargar los usuarios.');
          this.isLoading.set(false);
        },
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.reload();
  }

  onRoleFilterChange(role: RoleFilter): void {
    this.filterRole.set(role);
    this.page.set(1);
    this.reload();
  }

  onStatusFilterChange(status: StatusFilter): void {
    this.filterStatus.set(status);
    this.page.set(1);
    this.reload();
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
    this.reload();
  }

  // ---------- Cambiar estado (activar/desactivar) ----------

  openStatusDialog(user: AdminUserListItem): void {
    this.statusDialogUser.set(user);
    this.statusDialogOpen.set(true);
  }

  confirmStatusChange(): void {
    const user = this.statusDialogUser();
    if (!user) return;

    this.actionInProgress.set(user.id);
    this.adminUsersService.updateStatus(user.id, !user.is_active).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.statusDialogOpen.set(false);
        this.reload();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.statusDialogOpen.set(false);
        this.generalError.set(error?.error?.message ?? 'No pudimos actualizar el estado.');
      },
    });
  }

  cancelStatusDialog(): void {
    this.statusDialogOpen.set(false);
    this.statusDialogUser.set(null);
  }

  // ---------- Cambiar rol ----------

  openRoleDialog(user: AdminUserListItem): void {
    this.roleDialogUser.set(user);
    this.roleDialogValue.set(user.role ?? 'USER');
    this.roleDialogOpen.set(true);
  }

  confirmRoleChange(): void {
    const user = this.roleDialogUser();
    if (!user) return;

    this.actionInProgress.set(user.id);
    this.adminUsersService.updateRole(user.id, this.roleDialogValue()).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.roleDialogOpen.set(false);
        this.reload();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.generalError.set(error?.error?.message ?? 'No pudimos actualizar el rol.');
      },
    });
  }

  cancelRoleDialog(): void {
    this.roleDialogOpen.set(false);
    this.roleDialogUser.set(null);
  }

  // ---------- Crear administrador ----------

  openCreateModal(): void {
    this.createForm.set({ ...EMPTY_FORM });
    this.createError.set(null);
    this.createModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  updateCreateForm<K extends keyof CreateAdminForm>(field: K, value: CreateAdminForm[K]): void {
    this.createForm.set({ ...this.createForm(), [field]: value });

    // Si cambia el departamento, la ciudad seleccionada puede quedar inválida.
    if (field === 'department') {
      this.createForm.set({ ...this.createForm(), city: '' });
    }
  }

  submitCreateAdmin(): void {
    const form = this.createForm();

    if (!form.document_type) {
      this.createError.set('Seleccioná un tipo de documento.');
      return;
    }
    if (!form.department || !form.city) {
      this.createError.set('Seleccioná departamento y ciudad.');
      return;
    }

    const payload: CreateAdminRequest = {
      email: form.email,
      password: form.password,
      first_name: form.first_name,
      last_name: form.last_name,
      document_type: form.document_type,
      document_number: form.document_number,
      phone: form.phone,
      country: DEFAULT_COUNTRY,
      department: form.department,
      city: form.city,
    };

    this.createLoading.set(true);
    this.createError.set(null);

    this.adminUsersService.createAdmin(payload).subscribe({
      next: () => {
        this.createLoading.set(false);
        this.createModalOpen.set(false);
        this.page.set(1);
        this.reload();
      },
      error: (error) => {
        this.createLoading.set(false);
        this.createError.set(error?.error?.message ?? 'No pudimos crear el administrador.');
      },
    });
  }
}
