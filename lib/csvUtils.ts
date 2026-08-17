import { Guard, AttendanceLog, LeaveRequest, Task } from '@/store/useEnterpriseStore';

// ---------------------------------------------------------
// Core CSV engine
// ---------------------------------------------------------

export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map((row: any) => {
      return keys.map((k) => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/(",|\\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        resolve([]);
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          let val = values[index]?.trim() || '';
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1).replace(/""/g, '"');
          }
          if (val === 'true') obj[header] = true;
          else if (val === 'false') obj[header] = false;
          else if (!isNaN(Number(val)) && val !== '') obj[header] = Number(val);
          else obj[header] = val;
        });
        return obj;
      });
      resolve(data);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// ---------------------------------------------------------
// Typed export helpers
// ---------------------------------------------------------

export function exportGuards(guards: Guard[], filename = 'personnel_roster.csv') {
  const rows = guards.map(g => ({
    'Personnel ID': g.personnelId,
    'Guard ID': g.id,
    'Full Name': g.name,
    'Phone': g.phone,
    'Designation': g.designation,
    'Department': g.department || '',
    'Company': g.company || '',
    'Site ID': g.assignedSiteId,
    'Assigned Post': g.assignedPost,
    'Shift': g.shift,
    'Status': g.status,
    'Last Check-In': g.lastCheckIn ? new Date(g.lastCheckIn).toLocaleString() : '',
  }));
  exportToCSV(filename, rows);
}

export function exportAttendance(logs: AttendanceLog[], filename = 'attendance_log.csv') {
  const rows = logs.map(l => ({
    'Log ID': l.id,
    'Guard ID': l.guardId,
    'Guard Name': l.guardName,
    'Site ID': l.siteId,
    'Date': l.date,
    'Shift': l.shift,
    'Status': l.status,
    'Logged At': new Date(l.loggedAt).toLocaleString(),
    'Logged By': l.loggedBy,
  }));
  exportToCSV(filename, rows);
}

export function exportLeaves(leaves: LeaveRequest[], filename = 'leave_history.csv') {
  const rows = leaves.map(l => ({
    'Leave ID': l.id,
    'Guard ID': l.guardId,
    'Guard Name': l.guardName,
    'Site ID': l.siteId,
    'Leave Type': l.leaveType,
    'From Date': l.fromDate,
    'To Date': l.toDate,
    'Reason': l.reason,
    'Status': l.status,
    'Applied At': new Date(l.appliedAt).toLocaleString(),
    'Decided By': l.decidedBy || '',
    'Decided At': l.decidedAt ? new Date(l.decidedAt).toLocaleString() : '',
  }));
  exportToCSV(filename, rows);
}

export function exportTasks(tasks: Task[], filename = 'task_dispatch_log.csv') {
  const rows = tasks.map(t => ({
    'Task ID': t.id,
    'Site ID': t.siteId,
    'Title': t.title,
    'Task Type': t.taskType,
    'Assigned To': t.assignedToName,
    'Post': t.post,
    'Status': t.status,
    'Created By': t.createdBy,
    'Created At': new Date(t.createdAt).toLocaleString(),
    'Started At': t.startedAt ? new Date(t.startedAt).toLocaleString() : '',
    'Completed At': t.completedAt ? new Date(t.completedAt).toLocaleString() : '',
    'Verified At': t.verifiedAt ? new Date(t.verifiedAt).toLocaleString() : '',
    'Completion Note': t.completionNote || '',
  }));
  exportToCSV(filename, rows);
}
