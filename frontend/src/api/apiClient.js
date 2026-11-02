const API_BASE = import.meta.env.VITE_API_BASE
  ? `${import.meta.env.VITE_API_BASE.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = `HTTP ${response.status} ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const apiClient = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Extraction
  extractIncident: async ({ file, sourceType, content, subject }) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      formData.append('source_type', 'pdf');
    } else {
      formData.append('source_type', sourceType || 'text');
      formData.append('content', content || '');
      if (subject) {
        formData.append('subject', subject);
      }
    }
    const res = await fetch(`${API_BASE}/extractions`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // Investigations CRUD
  getInvestigations: async ({ skip = 0, limit = 50, status = '', search = '' } = {}) => {
    const params = new URLSearchParams({ skip, limit });
    if (status) params.append('status_filter', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/investigations?${params.toString()}`);
    return handleResponse(res);
  },

  getInvestigationDetail: async (id) => {
    const res = await fetch(`${API_BASE}/investigations/${id}`);
    return handleResponse(res);
  },

  createInvestigation: async (payload) => {
    const res = await fetch(`${API_BASE}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  updateInvestigation: async (id, payload) => {
    const res = await fetch(`${API_BASE}/investigations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  reviewInvestigation: async (id, { reviewer_name, decision, comments }) => {
    const res = await fetch(`${API_BASE}/investigations/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name, decision, comments }),
    });
    return handleResponse(res);
  },

  deleteInvestigation: async (id) => {
    const res = await fetch(`${API_BASE}/investigations/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 204) return true;
    return handleResponse(res);
  },

  // RCA
  generateRca: async (investigationId, incidentContext, method = 'both') => {
    const res = await fetch(`${API_BASE}/investigations/${investigationId}/rca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_context: incidentContext, method }),
    });
    return handleResponse(res);
  },

  previewRca: async (incidentContext, method = 'both') => {
    const res = await fetch(`${API_BASE}/rca-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_context: incidentContext, method }),
    });
    return handleResponse(res);
  },

  confirmRootCause: async (investigationId, causeId, { reviewer_name, status, confirmation_notes }) => {
    const res = await fetch(`${API_BASE}/investigations/${investigationId}/rca/causes/${causeId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name, status, confirmation_notes }),
    });
    return handleResponse(res);
  },

  // CAPA
  generateCapa: async (investigationId, incidentContext) => {
    const res = await fetch(`${API_BASE}/investigations/${investigationId}/capa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_context: incidentContext }),
    });
    return handleResponse(res);
  },

  previewCapa: async (incidentContext) => {
    const res = await fetch(`${API_BASE}/capa-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_context: incidentContext }),
    });
    return handleResponse(res);
  },

  reviewCapaAction: async (investigationId, capaId, payload) => {
    const res = await fetch(`${API_BASE}/investigations/${investigationId}/capa/${capaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Evidence
  updateEvidenceItem: async (investigationId, evidenceId, payload) => {
    const res = await fetch(`${API_BASE}/investigations/${investigationId}/evidence/${evidenceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
