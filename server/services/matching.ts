import { generateVolunteerMatching } from './openai';

export interface MatchingCriteria {
  userId: string;
  userProfile: any;
  assessmentResults?: any;
  opportunities: any[];
}

export interface MatchingResult {
  opportunityId: string;
  matchPercentage: number;
  reasons: string[];
  skillAlignment: number;
  interestAlignment: number;
  personalityAlignment: number;
}

export class VolunteerMatchingService {
  async generateMatches(criteria: MatchingCriteria): Promise<MatchingResult[]> {
    try {
      // Use AI-powered matching
      const aiResult = await generateVolunteerMatching(
        criteria.userProfile,
        criteria.opportunities,
        criteria.assessmentResults
      );

      return aiResult.recommendations || [];
    } catch (error) {
      console.error('AI matching failed, falling back to rule-based matching:', error);
      
      // Fallback to rule-based matching
      return this.ruleBasedMatching(criteria);
    }
  }

  private ruleBasedMatching(criteria: MatchingCriteria): MatchingResult[] {
    const { userProfile, opportunities, assessmentResults } = criteria;
    
    return opportunities.map(opportunity => {
      let score = 0;
      const reasons: string[] = [];

      // Location matching (20 points)
      if (opportunity.location === userProfile.location || opportunity.location === 'Remoto') {
        score += 20;
        reasons.push('Ubicación compatible');
      }

      // Interest matching (25 points)
      const interestMatch = this.calculateInterestMatch(userProfile.interests, opportunity.skills);
      score += interestMatch * 25;
      if (interestMatch > 0.5) {
        reasons.push('Alineado con tus intereses');
      }

      // Personality alignment (30 points)
      const personalityMatch = this.calculatePersonalityMatch(assessmentResults, opportunity);
      score += personalityMatch * 30;
      if (personalityMatch > 0.6) {
        reasons.push('Compatible con tu perfil de personalidad');
      }

      // Time commitment (15 points)
      const timeMatch = this.calculateTimeMatch(opportunity.duration);
      score += timeMatch * 15;

      // Department synergy (10 points)
      const deptMatch = this.calculateDepartmentMatch(userProfile.department, opportunity);
      score += deptMatch * 10;

      return {
        opportunityId: opportunity.id,
        matchPercentage: Math.min(Math.round(score), 100),
        reasons,
        skillAlignment: interestMatch,
        interestAlignment: interestMatch,
        personalityAlignment: personalityMatch
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  private calculateInterestMatch(userInterests: string[], opportunitySkills: string[]): number {
    if (!userInterests || !opportunitySkills) return 0;
    
    const intersection = userInterests.filter(interest => 
      opportunitySkills.some(skill => 
        skill.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    return intersection.length / Math.max(userInterests.length, 1);
  }

  private calculatePersonalityMatch(assessmentResults: any, opportunity: any): number {
    if (!assessmentResults?.topStrength) return 0.5; // Default neutral score

    const strengthMapping = {
      execution: ['coordinacion', 'gestion', 'organizacion'],
      relationship: ['mentoring', 'facilitacion', 'trabajo-grupal'],
      strategic: ['desarrollo', 'planificacion', 'consultoria'],
      thinking: ['investigacion', 'analisis', 'educacion']
    };

    const strength = assessmentResults.topStrength;
    const relevantKeywords = strengthMapping[strength as keyof typeof strengthMapping] || [];
    
    const title = opportunity.title.toLowerCase();
    const description = opportunity.description.toLowerCase();
    
    const hasRelevantKeywords = relevantKeywords.some(keyword => 
      title.includes(keyword) || description.includes(keyword)
    );

    return hasRelevantKeywords ? 0.8 : 0.4;
  }

  private calculateTimeMatch(duration: number): number {
    // Prefer opportunities that are not too long or too short
    if (duration >= 2 && duration <= 8) return 1.0;
    if (duration >= 1 && duration <= 12) return 0.7;
    return 0.4;
  }

  private calculateDepartmentMatch(department: string, opportunity: any): number {
    const departmentSkillMap: Record<string, string[]> = {
      'finanzas': ['financiera', 'economia', 'gestion'],
      'marketing': ['comunicacion', 'redes', 'campana'],
      'ti': ['tecnologia', 'programacion', 'digital'],
      'rrhh': ['capacitacion', 'desarrollo', 'recursos'],
      'operaciones': ['logistica', 'coordinacion', 'procesos']
    };

    const skills = departmentSkillMap[department.toLowerCase()] || [];
    const title = opportunity.title.toLowerCase();
    const description = opportunity.description.toLowerCase();

    return skills.some(skill => 
      title.includes(skill) || description.includes(skill)
    ) ? 1.0 : 0.5;
  }
}

export const matchingService = new VolunteerMatchingService();
