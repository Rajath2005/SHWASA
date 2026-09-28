export type CopdEffModel = 'EfficientNetB0 + BiLSTM + Attention'

export interface CopdEffMetrics {
  accuracy: number
  sensitivity_recall: number
  specificity: number
  f1_score: number
  roc_auc: number
  test_patients: number
  test_samples: number
}

export interface CopdEffStatus {
  status: string
  model_trained: boolean
  model: CopdEffModel | string
  model_path: string
  audio_files_found: number
  metrics: CopdEffMetrics | null
  message: string
}

export interface CopdEffPrediction {
  filename: string
  prediction: 'COPD' | 'NON-COPD'
  copd_probability: number
  non_copd_probability: number
  threshold: number
  confidence_percent: number
  disclaimer: string
}

export interface DatasetValidationResult {
  success: boolean
  stdout?: string
  stderr?: string
  error?: string | null
}

export interface CopdEffApiError {
  error?: string
  message?: string
  [key: string]: unknown
}

const apiOrigin = ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiOrigin}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  const body = (await response.json().catch(() => ({}))) as T | CopdEffApiError

  if (!response.ok) {
    const error = body as CopdEffApiError
    throw new Error(error.message || error.error || `COPD-EFF request failed (${response.status})`)
  }

  return body as T
}

export function getCopdEffStatus() {
  return request<CopdEffStatus>('/api/status', { cache: 'no-store' })
}

export function getCopdEffMetrics() {
  return request<CopdEffMetrics>('/api/metrics', { cache: 'no-store' })
}

export function predictWithCopdEff(audio: File) {
  const formData = new FormData()
  formData.append('audio', audio)

  return request<CopdEffPrediction>('/api/predict', {
    method: 'POST',
    body: formData,
  })
}

export function runCopdEffDatasetValidation() {
  return request<DatasetValidationResult>('/api/run-dataset-validation', {
    method: 'POST',
  })
}