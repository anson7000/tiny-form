export default function SubmissionDashboard() {
  return <div>Submission Dashboard</div>;
}


// 'use client';

// import { useState, useMemo } from 'react';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   flexRender,
//   createColumnHelper,
//   ColumnFiltersState
// } from '@tanstack/react-table';
// import { useFormStore, Submission } from '@/app/store/form-store';
// import { Button } from '@/app/ui/common/button';
// import { Input } from '@/app/ui/common/input';
// import { Download, Search } from 'lucide-react';

// type StatusFilter = 'all' | 'unread' | 'read' | 'replied';

// export function SubmissionDashboard() {
//   const { submissions, updateSubmissionStatus } = useFormStore();
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

//   const filteredSubmissions = useMemo(() => {
//     return submissions.filter((sub) => {
//       const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
//       const searchLower = searchTerm.toLowerCase();
//       const matchesSearch = !searchTerm ||
//         Object.values(sub.data).some((val) =>
//           val.toLowerCase().includes(searchLower)
//         );
//       return matchesStatus && matchesSearch;
//     });
//   }, [submissions, statusFilter, searchTerm]);

//   const columnHelper = createColumnHelper<Submission>();

//   const columns = [
//     columnHelper.accessor('timestamp', {
//       header: 'Timestamp',
//       cell: (info) => new Date(info.getValue()).toLocaleString('en-US')
//     }),
//     columnHelper.accessor((row) => row.data.name || Object.values(row.data)[0], {
//       id: 'name',
//       header: 'Name',
//       cell: (info) => info.getValue()
//     }),
//     columnHelper.accessor((row) => row.data.email || Object.values(row.data)[1], {
//       id: 'email',
//       header: 'Email',
//       cell: (info) => info.getValue()
//     }),
//     columnHelper.accessor((row) => row.data.message || Object.values(row.data)[2], {
//       id: 'message',
//       header: 'Message',
//       cell: (info) => {
//         const msg = info.getValue() || '';
//         return (
//           <div className="max-w-xs truncate" title={msg}>
//             {msg}
//           </div>
//         );
//       }
//     }),
//     columnHelper.accessor('status', {
//       header: 'Status',
//       cell: (info) => (
//         <div className="flex gap-2">
//           <Button
//             size="sm"
//             variant={info.getValue() === 'read' ? 'default' : 'secondary'}
//             onClick={() => updateSubmissionStatus(info.row.original.id, 'read')}
//           >
//             {info.getValue() === 'read' ? '✓ Read' : 'Mark Read'}
//           </Button>
//           <Button
//             size="sm"
//             variant={info.getValue() === 'replied' ? 'default' : 'secondary'}
//             onClick={() => updateSubmissionStatus(info.row.original.id, 'replied')}
//             className={info.getValue() === 'replied' ? 'bg-green-600 hover:bg-green-700' : ''}
//           >
//             {info.getValue() === 'replied' ? '✓ Replied' : 'Mark Replied'}
//           </Button>
//         </div>
//       )
//     })
//   ];

//   const table = useReactTable({
//     data: filteredSubmissions,
//     columns,
//     state: {
//       columnFilters
//     },
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel()
//   });

//   const exportToCSV = () => {
//     const csvData = filteredSubmissions.map((sub) => ({
//       Timestamp: new Date(sub.timestamp).toLocaleString('en-US'),
//       ...sub.data,
//       Status: sub.status,
//       'Replied At': sub.repliedAt ? new Date(sub.repliedAt).toLocaleString('en-US') : ''
//     }));

//     const csv = [
//       Object.keys(csvData[0] || {}).join(','),
//       ...csvData.map((row) =>
//         Object.values(row)
//           .map((val) => `"${String(val).replace(/"/g, '""')}"`)
//           .join(',')
//       )
//     ].join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `tinyform-submissions-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   const unreadCount = submissions.filter((s) => s.status === 'unread').length;

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-6 border-b bg-white">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold">Submissions</h2>
//           <Button onClick={exportToCSV} variant="secondary">
//             <Download className="w-4 h-4 mr-2" />
//             Export CSV
//           </Button>
//         </div>

//         <div className="flex gap-4 items-center">
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               variant={statusFilter === 'all' ? 'default' : 'secondary'}
//               onClick={() => setStatusFilter('all')}
//             >
//               All
//             </Button>
//             <Button
//               size="sm"
//               variant={statusFilter === 'unread' ? 'default' : 'secondary'}
//               onClick={() => setStatusFilter('unread')}
//             >
//               Unread {unreadCount > 0 && `(${unreadCount})`}
//             </Button>
//             <Button
//               size="sm"
//               variant={statusFilter === 'read' ? 'default' : 'secondary'}
//               onClick={() => setStatusFilter('read')}
//             >
//               Read
//             </Button>
//             <Button
//               size="sm"
//               variant={statusFilter === 'replied' ? 'default' : 'secondary'}
//               onClick={() => setStatusFilter('replied')}
//             >
//               Replied
//             </Button>
//           </div>

//           <div className="flex-1 max-w-md relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search submissions..."
//               className="pl-10"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto p-6">
//         <div className="bg-white rounded-lg border">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="text-left p-4 font-semibold text-sm text-gray-700"
//                     >
//                       {flexRender(header.column.columnDef.header, header.getContext())}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {table.getRowModel().rows.map((row) => {
//                 const bgColor =
//                   row.original.status === 'replied'
//                     ? 'bg-green-50'
//                     : row.original.status === 'read'
//                       ? 'bg-blue-50'
//                       : 'bg-white';

//                 return (
//                   <tr key={row.id} className={`border-b ${bgColor} hover:bg-gray-50`}>
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id} className="p-4 text-sm">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {filteredSubmissions.length === 0 && (
//             <div className="text-center py-12 text-gray-400">
//               <p>No submissions yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }