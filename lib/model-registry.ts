export type ModelTrack = 'copd-eff' | 'copd-mod2'
export type EvidenceState = 'api-live' | 'measured' | 'illustrative'

export interface ModelMetric {
  label: string
  value: string
  description: string
  evidence: EvidenceState
}

export interface ModelTrackDefinition {
  id: ModelTrack
  shortName: string
  name: string
  task: string
  outputLabel: string
  classes: string[]
  preprocessing: string[]
  stages: string[]
  metrics: ModelMetric[]
  source: string
  disclaimer: string
}

export const MODEL_REGISTRY: Record<ModelTrack, ModelTrackDefinition> = {
  'copd-eff': {
    id: 'copd-eff',
    shortName: 'COPD-EFF',
    name: 'EfficientNetB0 + BiLSTM + Attention',
    task: 'Binary COPD screening',
    outputLabel: 'COPD probability',
    classes: ['COPD', 'NON-COPD'],
    preprocessing: ['16 kHz resampling', '5 second fixed clip', '128 × 157 Log-Mel', '224 × 224 × 3 backbone input'],
    stages: ['Record audio', 'Resample + normalize', 'Build Log-Mel map', 'EfficientNetB0', 'BiLSTM sequence', '4-head attention', 'COPD probability'],
    metrics: [
      { label: 'Accuracy', value: '87.73%', description: 'Held-out test cohort', evidence: 'measured' },
      { label: 'Sensitivity', value: '88.38%', description: 'True positive COPD rate', evidence: 'measured' },
      { label: 'Specificity', value: '83.80%', description: 'True negative rate', evidence: 'measured' },
      { label: 'F1 score', value: '92.51%', description: 'Balanced classification score', evidence: 'measured' },
      { label: 'ROC-AUC', value: '0.9313', description: 'Discriminative separation', evidence: 'measured' },
    ],
    source: 'COPD-EFF + project report',
    disclaimer: 'Research screening signal only. Not a clinical diagnosis.',
  },
  'copd-mod2': {
    id: 'copd-mod2',
    shortName: 'copd-mod2',
    name: 'Custom four-stage residual CNN',
    task: 'Four-class respiratory sound-event recognition',
    outputLabel: 'Sound-event class',
    classes: ['Normal', 'Crackles', 'Wheezes', 'Both'],
    preprocessing: ['16 kHz resampling', '128 × 128 normalized Log-Mel', 'Patient-aware evaluation split'],
    stages: ['Record audio', 'Resample + normalize', 'Build 128 × 128 map', 'Residual stage 1', 'Residual stage 2', 'Residual stage 3', 'Residual stage 4', 'Sound-event class'],
    metrics: [
      { label: 'Accuracy', value: '91.58%', description: '1,033 test cycles', evidence: 'measured' },
      { label: 'ICBHI score', value: '92.56%', description: 'Average sensitivity + specificity', evidence: 'measured' },
    ],
    source: 'copd-mod2 + project report',
    disclaimer: 'Research sound-event recognition only. Not a severity grade or clinical diagnosis.',
  },
}

export function getModelTrack(track: ModelTrack) {
  return MODEL_REGISTRY[track]
}