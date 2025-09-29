import React, { useState } from 'react';
import { NextPage } from 'next';
import { 
  Eye, 
  Edit2, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Mail,
  Phone,
  FileText,
  X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Reclamation, DataTableColumn, PaginationInfo, TableSort } from '@/types/admin';

// Mock data - replace with API calls
const mockReclamations: Reclamation[] = [
  {
    id: '1',
    userId: 'user-1',
    userFirstName: 'John',
    userLastName: 'Doe',
    userEmail: 'john.doe@example.com',
    subject: 'Defective product received',
    type: 'complaint',
    priority: 'high',
    status: 'open',
    description: 'I received tomatoes that were rotten and not as described in the marketplace. This is unacceptable quality.',
    submittedDate: new Date('2024-01-28'),
    orderReference: 'ORD-2024-001',
    attachments: ['defective-tomatoes.jpg', 'order-receipt.pdf']
  },
  {
    id: '2',
    userId: 'user-2',
    userFirstName: 'Jane',
    userLastName: 'Smith',
    userEmail: 'jane.smith@example.com',
    subject: 'Request refund for cancelled order',
    type: 'refund',
    priority: 'medium',
    status: 'in_progress',
    description: 'My order was cancelled but I have not received my refund yet. It has been 5 days.',
    response: 'We are processing your refund. Please allow 3-5 business days.',
    submittedDate: new Date('2024-01-25'),
    orderReference: 'ORD-2024-002',
    attachments: [],
    assignedTo: 'admin-1'
  },
  {
    id: '3',
    userId: 'user-3',
    userFirstName: 'Mike',
    userLastName: 'Johnson',
    userEmail: 'mike.johnson@example.com',
    subject: 'Wrong item delivered',
    type: 'return',
    priority: 'medium',
    status: 'resolved',
    description: 'I ordered wheat seeds but received corn seeds instead. Need to return and get correct item.',
    response: 'Return initiated. Correct items will be shipped once we receive the wrong items.',
    submittedDate: new Date('2024-01-20'),
    resolvedDate: new Date('2024-01-27'),
    orderReference: 'ORD-2024-003',
    attachments: ['wrong-item.jpg'],
    assignedTo: 'admin-2'
  },
  {
    id: '4',
    userId: 'user-4',
    userFirstName: 'Sarah',
    userLastName: 'Wilson',
    userEmail: 'sarah.wilson@example.com',
    subject: 'Damaged packaging',
    type: 'damage_report',
    priority: 'low',
    status: 'closed',
    description: 'Rice bag was damaged during shipping, some rice was spilled but most is still usable.',
    response: 'Partial refund has been processed for the inconvenience.',
    submittedDate: new Date('2024-01-15'),
    resolvedDate: new Date('2024-01-22'),
    orderReference: 'ORD-2024-004',
    attachments: ['damaged-packaging.jpg'],
    assignedTo: 'admin-1'
  }
];

const ReclamationsManagement: NextPage = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>(mockReclamations);
  const [loading, setLoading] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  const [showReclamationModal, setShowReclamationModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: mockReclamations.length,
    itemsPerPage: 10
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      complaint: 'bg-red-100 text-red-800 border-red-200',
      return: 'bg-blue-100 text-blue-800 border-blue-200',
      refund: 'bg-purple-100 text-purple-800 border-purple-200',
      damage_report: 'bg-orange-100 text-orange-800 border-orange-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const handleReclamationAction = (action: string, reclamation: Reclamation) => {
    switch (action) {
      case 'view':
        setSelectedReclamation(reclamation);
        setResponseText(reclamation.response || '');
        setShowReclamationModal(true);
        break;
      case 'assign':
        console.log('Assign reclamation:', reclamation.id);
        break;
      case 'resolve':
        console.log('Resolve reclamation:', reclamation.id);
        break;
      case 'close':
        console.log('Close reclamation:', reclamation.id);
        break;
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (selectedReclamation) {
      // Update reclamation status
      console.log('Update status to:', newStatus);
      // In real app, make API call here
    }
  };

  const handleResponseSubmit = () => {
    if (selectedReclamation && responseText.trim()) {
      // Submit response
      console.log('Submit response:', responseText);
      // In real app, make API call here
      setResponseText('');
    }
  };

  const columns: DataTableColumn<Reclamation>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (id) => (
        <div className="text-sm font-mono text-gray-600">#{id.slice(-4)}</div>
      ),
      width: 'w-20'
    },
    {
      key: 'userFirstName',
      header: 'User',
      sortable: true,
      render: (_, reclamation) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {reclamation.userFirstName[0]}{reclamation.userLastName[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {reclamation.userFirstName} {reclamation.userLastName}
            </div>
            <div className="text-sm text-gray-500">{reclamation.userEmail}</div>
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      render: (subject) => (
        <div className="max-w-xs truncate font-medium text-gray-900" title={subject}>
          {subject}
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (type) => getTypeBadge(type)
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (priority) => getPriorityBadge(priority)
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'submittedDate',
      header: 'Submitted',
      sortable: true,
      render: (date) => (
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, reclamation) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleReclamationAction('view', reclamation)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleReclamationAction('assign', reclamation)}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="Assign"
          >
            <User className="w-4 h-4" />
          </button>
          {reclamation.status === 'open' && (
            <button
              onClick={() => handleReclamationAction('resolve', reclamation)}
              className="p-1 text-gray-400 hover:text-green-600"
              title="Mark as Resolved"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleSort = (sort: TableSort) => {
    console.log('Sort:', sort);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Calculate statistics
  const totalReclamations = reclamations.length;
  const openReclamations = reclamations.filter(r => r.status === 'open').length;
  const inProgressReclamations = reclamations.filter(r => r.status === 'in_progress').length;
  const resolvedReclamations = reclamations.filter(r => r.status === 'resolved').length;

  return (
    <AdminLayout currentPage="reclamations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Reclamations</h1>
            <p className="text-gray-600">Manage customer complaints and support tickets</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reclamations</p>
                <p className="text-2xl font-bold text-gray-900">{totalReclamations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-gray-900">{openReclamations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressReclamations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedReclamations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={reclamations}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
        />

        {/* Reclamation Details Modal */}
        {showReclamationModal && selectedReclamation && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Reclamation Details</h3>
                  <button
                    onClick={() => setShowReclamationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Reclamation Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedReclamation.subject}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(selectedReclamation.type)}
                          {getPriorityBadge(selectedReclamation.priority)}
                          {getStatusBadge(selectedReclamation.status)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                        <p className="text-gray-700 leading-relaxed">{selectedReclamation.description}</p>
                      </div>
                    </div>

                    {selectedReclamation.attachments.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Attachments</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedReclamation.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Section */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Admin Response</h5>
                      {selectedReclamation.response && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                          <p className="text-gray-700">{selectedReclamation.response}</p>
                        </div>
                      )}
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows={4}
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleResponseSubmit}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600"
                          >
                            Send Response
                          </button>
                          <select 
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          >
                            <option value="">Update Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - User & Order Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">User Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="font-medium text-gray-600">
                              {selectedReclamation.userFirstName[0]}{selectedReclamation.userLastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {selectedReclamation.userFirstName} {selectedReclamation.userLastName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedReclamation.userEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Reclamation Details</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <span className="text-sm font-medium">
                            {selectedReclamation.submittedDate.toLocaleDateString()}
                          </span>
                        </div>
                        {selectedReclamation.orderReference && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Order:</span>
                            <span className="text-sm font-medium font-mono">
                              {selectedReclamation.orderReference}
                            </span>
                          </div>
                        )}
                        {selectedReclamation.assignedTo && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Assigned to:</span>
                            <span className="text-sm font-medium">
                              {selectedReclamation.assignedTo}
                            </span>
                          </div>
                        )}
                        {selectedReclamation.resolvedDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Resolved:</span>
                            <span className="text-sm font-medium">
                              {selectedReclamation.resolvedDate.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowReclamationModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReclamationsManagement;