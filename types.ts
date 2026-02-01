export enum Severity {
  LOW = 'Faible',
  MEDIUM = 'Moyenne',
  HIGH = 'Élevée',
  CRITICAL = 'Critique'
}

export enum Status {
  OPEN = 'Ouvert',
  IN_PROGRESS = 'En cours',
  CLOSED = 'Clôturé',
  PENDING_REVIEW = 'En revue'
}

export enum IncidentType {
  INJURY = 'Blessure',
  NEAR_MISS = 'Presque accident',
  ENVIRONMENTAL = 'Environnement',
  PROPERTY_DAMAGE = 'Dégâts matériels',
  QUALITY_DEFECT = 'Défaut Qualité'
}

export interface Incident {
  id: string;
  title: string;
  date: string;
  type: IncidentType;
  severity: Severity;
  status: Status;
  location: string;
  description: string;
  correctiveActions?: string;
  isArchived?: boolean;
}

export interface Risk {
  id: string;
  hazard: string;
  consequence: string;
  probability: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // probability * impact
  controlMeasures: string;
  isArchived?: boolean;
}

export interface Training {
  id: string;
  title: string;
  date: string;
  attendees: number;
  status: 'Planifié' | 'Complété' | 'Annulé';
  instructor: string;
  description?: string;
  isArchived?: boolean;
}

export interface ReportAction {
  id: string;
  type: 'print' | 'email';
  date: string;
  details: string;
}

export interface SavedReport {
  id: string;
  title: string;
  date: string;
  content: string; // Texte brut sans markdown
  isArchived?: boolean;
  history: ReportAction[];
}

export interface UserSettings {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
  username: string;
  role: string;
  email: string;
  // Champs ajoutés pour le profil
  phone?: string;
  department?: string;
  smtpServer?: string;
  smtpPort?: string;
}

export enum PermitType {
  GENERAL = 'Permis Général',
  HOT_WORK = 'Permis de Feu',
  LOCKOUT = 'Consignation',
  HEIGHTS = 'Travail en Hauteur',
  CONFINED_SPACE = 'Pénétration / Espace Confiné',
  EXCAVATION = 'Permis de Fouille'
}

export enum PermitStatus {
  DRAFT = 'Brouillon',
  ACTIVE = 'Validé / Actif',
  CLOSED = 'Clôturé',
  EXPIRED = 'Expiré'
}

export interface SignatureBlock {
  nom: string;
  prenom: string;
  matricule: string;
  date: string;
  service?: string;
  signatureData?: string; // Base64 image data
  raisonSociale?: string; // Pour l'exécutant
  visa?: boolean;
}

export interface WorkPermit {
  id: string; // Numéro du permis
  type: PermitType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string; // Secteur / Lieu
  description: string;
  
  // Demandeur info
  requester: {
    lastName: string;
    firstName: string;
    phone: string;
    company: string;
  };

  // Checklists
  workNature: string[]; // Nature des travaux (cases à cocher)
  precautions: {
    dispositions: string[];
    epi: string[];
    equipments: string[];
  };

  status: PermitStatus;
  isArchived?: boolean;
  
  // Signatures
  signatures: {
    requester: SignatureBlock;
    productionLead: SignatureBlock; // Chef de quart production
    safety: SignatureBlock; // Sécurité
    executor: SignatureBlock; // Exécutant
  };
}

export type ViewState = 'dashboard' | 'incidents' | 'risks' | 'reports' | 'training' | 'permits' | 'settings' | 'ai-assistant';