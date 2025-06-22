import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key"
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function generateVolunteerMatching(
  userProfile: any,
  opportunities: any[],
  assessmentResults?: any
): Promise<any> {
  try {
    const prompt = `
    Eres un experto en matching de voluntariado corporativo. Analiza el perfil del usuario y las oportunidades disponibles para generar recomendaciones personalizadas.

    Perfil del Usuario:
    - Departamento: ${userProfile.department}
    - Ubicación: ${userProfile.location}
    - Intereses: ${userProfile.interests?.join(', ') || 'No especificados'}
    - Fortaleza principal: ${assessmentResults?.topStrength || 'No evaluado'}
    - Perfil de personalidad: ${JSON.stringify(assessmentResults?.personalityProfile || {})}

    Oportunidades Disponibles:
    ${opportunities.map(opp => `
    - ID: ${opp.id}
    - Título: ${opp.title}
    - Tipo: ${opp.type}
    - Ubicación: ${opp.location}
    - Duración: ${opp.duration} horas
    - Habilidades: ${opp.skills?.join(', ') || 'No especificadas'}
    - ODS: ${opp.sdgs?.join(', ') || 'No especificados'}
    `).join('\n')}

    Genera recomendaciones en JSON con el siguiente formato:
    {
      "recommendations": [
        {
          "opportunityId": "string",
          "matchPercentage": number,
          "reasons": ["string"],
          "skillAlignment": number,
          "interestAlignment": number,
          "personalityAlignment": number
        }
      ],
      "insights": {
        "strongMatches": ["string"],
        "developmentOpportunities": ["string"],
        "suggestedSkills": ["string"]
      }
    }

    Criterios de matching:
    1. Alineación con fortalezas de personalidad (30%)
    2. Coincidencia de intereses (25%)
    3. Compatibilidad de ubicación (20%)
    4. Habilidades requeridas vs disponibles (15%)
    5. Tipo de compromiso temporal (10%)

    Responde únicamente con JSON válido.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto en recursos humanos y voluntariado corporativo especializado en matching personalizado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('Error in OpenAI volunteer matching:', error);
    throw new Error('Failed to generate volunteer matching: ' + (error as Error).message);
  }
}

export async function analyzeImpactMetrics(
  participations: any[],
  projects: any[]
): Promise<any> {
  try {
    const prompt = `
    Analiza las métricas de impacto del programa de voluntariado corporativo y genera insights.

    Participaciones:
    ${participations.map(p => `
    - Usuario: ${p.userId}
    - Proyecto: ${p.opportunityId}
    - Horas: ${p.hoursCompleted || 0}
    - Estado: ${p.status}
    - Rating: ${p.rating || 'No evaluado'}
    `).join('\n')}

    Proyectos:
    ${projects.map(p => `
    - ID: ${p.id}
    - Título: ${p.title}
    - Tipo: ${p.type}
    - Voluntarios actuales: ${p.currentVolunteers}
    - ODS: ${p.sdgs?.join(', ') || 'No especificados'}
    `).join('\n')}

    Genera un análisis en JSON con:
    {
      "overallMetrics": {
        "totalHours": number,
        "averageRating": number,
        "completionRate": number,
        "participationTrend": "increasing|stable|decreasing"
      },
      "sdgImpact": [
        {
          "sdg": "string",
          "projects": number,
          "hours": number,
          "participants": number
        }
      ],
      "insights": [
        "string"
      ],
      "recommendations": [
        "string"
      ]
    }

    Responde únicamente con JSON válido.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un analista de impacto social especializado en programas de voluntariado corporativo."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('Error in OpenAI impact analysis:', error);
    throw new Error('Failed to analyze impact metrics: ' + (error as Error).message);
  }
}
