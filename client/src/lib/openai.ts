// Client-side OpenAI utilities for volunteer matching and analysis
// Note: This file provides interfaces for OpenAI functionality but actual API calls
// should be made through the backend for security reasons

export interface VolunteerMatch {
  opportunityId: string;
  matchPercentage: number;
  reasons: string[];
  skillAlignment: number;
  interestAlignment: number;
  personalityAlignment: number;
}

export interface MatchingRequest {
  userProfile: {
    department: string;
    location: string;
    interests: string[];
    firstName: string;
    lastName: string;
  };
  assessmentResults?: {
    topStrength: string;
    personalityProfile: any;
    strengthDistribution: Record<string, number>;
  };
  opportunities: any[];
}

export interface ImpactAnalysis {
  overallMetrics: {
    totalHours: number;
    averageRating: number;
    completionRate: number;
    participationTrend: 'increasing' | 'stable' | 'decreasing';
  };
  sdgImpact: Array<{
    sdg: string;
    projects: number;
    hours: number;
    participants: number;
  }>;
  insights: string[];
  recommendations: string[];
}

// Client-side helper functions for data preparation
export const prepareMatchingData = (user: any, assessments: any[], opportunities: any[]): MatchingRequest => {
  const latestAssessment = assessments?.[0];
  
  return {
    userProfile: {
      department: user.department || '',
      location: user.location || '',
      interests: user.interests || [],
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    },
    assessmentResults: latestAssessment ? {
      topStrength: latestAssessment.results?.topStrength || '',
      personalityProfile: latestAssessment.results?.personalityProfile || {},
      strengthDistribution: latestAssessment.results?.strengthDistribution || {}
    } : undefined,
    opportunities: opportunities || []
  };
};

// Fallback matching logic for when AI is unavailable
export const calculateBasicMatch = (userProfile: any, opportunity: any): number => {
  let score = 0;
  
  // Location match (30%)
  if (opportunity.location === userProfile.location || opportunity.location === 'Remoto') {
    score += 30;
  }
  
  // Interest alignment (40%)
  if (userProfile.interests && opportunity.skills) {
    const commonInterests = userProfile.interests.filter((interest: string) =>
      opportunity.skills.some((skill: string) =>
        skill.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(skill.toLowerCase())
      )
    );
    score += (commonInterests.length / Math.max(userProfile.interests.length, 1)) * 40;
  }
  
  // Type preference (20%)
  if (opportunity.type === 'lab') {
    score += 15; // Slight preference for shorter commitments
  }
  
  // Duration suitability (10%)
  if (opportunity.duration >= 2 && opportunity.duration <= 8) {
    score += 10;
  } else if (opportunity.duration <= 12) {
    score += 5;
  }
  
  return Math.min(Math.round(score), 100);
};

// Helper to generate match reasons based on score components
export const generateMatchReasons = (userProfile: any, opportunity: any, matchPercentage: number): string[] => {
  const reasons: string[] = [];
  
  if (opportunity.location === userProfile.location) {
    reasons.push('Ubicación compatible con tu zona de trabajo');
  } else if (opportunity.location === 'Remoto') {
    reasons.push('Modalidad remota - participación flexible');
  }
  
  if (userProfile.interests && opportunity.skills) {
    const commonInterests = userProfile.interests.filter((interest: string) =>
      opportunity.skills.some((skill: string) =>
        skill.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (commonInterests.length > 0) {
      reasons.push(`Alineado con tus intereses: ${commonInterests.join(', ')}`);
    }
  }
  
  if (opportunity.duration <= 4) {
    reasons.push('Compromiso de tiempo manejable');
  } else if (opportunity.duration <= 8) {
    reasons.push('Duración ideal para desarrollar habilidades');
  }
  
  if (opportunity.type === 'lab') {
    reasons.push('Proyecto de impacto rápido y medible');
  } else {
    reasons.push('Oportunidad de desarrollo profesional a largo plazo');
  }
  
  if (matchPercentage >= 90) {
    reasons.push('Coincidencia excepcional con tu perfil');
  } else if (matchPercentage >= 80) {
    reasons.push('Muy buena compatibilidad con tus fortalezas');
  } else if (matchPercentage >= 70) {
    reasons.push('Buena oportunidad de crecimiento personal');
  }
  
  return reasons.slice(0, 3); // Limit to top 3 reasons
};

// Strength-based activity suggestions
export const getStrengthBasedSuggestions = (topStrength: string): string[] => {
  const suggestions: Record<string, string[]> = {
    execution: [
      'Coordinación de eventos benéficos',
      'Gestión de proyectos comunitarios',
      'Organización de campañas de donación',
      'Supervisión de construcción de infraestructura social'
    ],
    relationship: [
      'Mentoría a jóvenes emprendedores',
      'Facilitación de talleres grupales',
      'Acompañamiento a adultos mayores',
      'Mediación y resolución de conflictos comunitarios'
    ],
    strategic: [
      'Desarrollo de programas de sostenibilidad',
      'Planificación estratégica para ONGs',
      'Consultoría en transformación digital',
      'Diseño de campañas de concientización social'
    ],
    thinking: [
      'Investigación de problemáticas sociales',
      'Análisis de impacto de programas',
      'Capacitación en educación financiera',
      'Evaluación de necesidades comunitarias'
    ]
  };
  
  return suggestions[topStrength] || suggestions.thinking;
};

// Error handling for OpenAI failures
export const handleOpenAIError = (error: any): string => {
  if (error.message?.includes('API key')) {
    return 'Error de configuración: Clave API de OpenAI no válida';
  } else if (error.message?.includes('rate limit')) {
    return 'Límite de uso excedido. Inténtalo de nuevo en unos minutos';
  } else if (error.message?.includes('network')) {
    return 'Error de conexión. Verifica tu conexión a internet';
  } else {
    return 'Error en el servicio de recomendaciones. Usando algoritmo alternativo';
  }
};
