import { 
  users, 
  psychologicalAssessments,
  volunteerOpportunities,
  participations,
  badges,
  userBadges,
  notifications,
  type User, 
  type InsertUser,
  type PsychologicalAssessment,
  type InsertAssessment,
  type VolunteerOpportunity,
  type InsertOpportunity,
  type Participation,
  type InsertParticipation,
  type Badge,
  type UserBadge,
  type Notification
} from "@shared/schema";

// Enhanced storage interface for volunteer platform
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Assessment management
  createAssessment(assessment: InsertAssessment): Promise<PsychologicalAssessment>;
  getUserAssessments(userId: number): Promise<PsychologicalAssessment[]>;
  getAssessmentsByType(userId: number, testType: string): Promise<PsychologicalAssessment[]>;

  // Opportunity management
  getOpportunities(filters: { location?: string; type?: string; isActive?: boolean }): Promise<VolunteerOpportunity[]>;
  getOpportunity(id: number): Promise<VolunteerOpportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<VolunteerOpportunity>;
  updateOpportunity(id: number, updates: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity | undefined>;
  updateOpportunityVolunteers(opportunityId: number): Promise<void>;

  // Participation management
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  getUserParticipations(userId: number): Promise<Participation[]>;
  getOpportunityParticipations(opportunityId: number): Promise<Participation[]>;
  getAllParticipations(): Promise<Participation[]>;
  updateParticipation(id: number, updates: Partial<Participation>): Promise<Participation | undefined>;

  // Badge management
  getUserBadges(userId: number): Promise<UserBadge[]>;
  getAllBadges(): Promise<Badge[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge>;

  // Notification management
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<void>;

  // Analytics and reporting
  getAdminStats(): Promise<{
    activeVolunteers: number;
    totalHours: number;
    activeProjects: number;
    peopleImpacted: number;
    departmentStats: Array<{ department: string; count: number; hours: number }>;
    sdgStats: Array<{ sdg: string; projects: number; hours: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, PsychologicalAssessment>;
  private opportunities: Map<number, VolunteerOpportunity>;
  private participations: Map<number, Participation>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private notifications: Map<number, Notification>;
  
  private currentUserId: number;
  private currentAssessmentId: number;
  private currentOpportunityId: number;
  private currentParticipationId: number;
  private currentBadgeId: number;
  private currentUserBadgeId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.opportunities = new Map();
    this.participations = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.notifications = new Map();
    
    this.currentUserId = 1;
    this.currentAssessmentId = 1;
    this.currentOpportunityId = 1;
    this.currentParticipationId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
    this.currentNotificationId = 1;

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create demo user profile
    const demoUser: User = {
      id: this.currentUserId++,
      firebaseUid: "demo-user-maria-garcia",
      email: "maria.garcia@manuchar.com",
      firstName: "María",
      lastName: "García",
      department: "Recursos Humanos",
      location: "Lima",
      role: "employee",
      interests: ["educación", "medio ambiente", "desarrollo comunitario"],
      isFirstLogin: false,
      profileCompleted: true,
      testsCompleted: true,

      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(demoUser.id, demoUser);

    // Create demo psychological assessment
    const demoAssessment: PsychologicalAssessment = {
      id: this.currentAssessmentId++,
      userId: demoUser.id,
      testType: "gallup_strengths",
      responses: {
        "empathy": 5,
        "strategic": 4,
        "communication": 5,
        "responsibility": 4,
        "achiever": 4,
        "adaptability": 3,
        "analytical": 3,
        "arranger": 2,
        "belief": 4,
        "command": 2
      },
      results: {
        topStrength: "Communication",
        personalityProfile: {
          empathy: 5,
          strategic: 4,
          communication: 5,
          responsibility: 4,
          achiever: 4
        },
        strengthDistribution: {
          "Communication": 5,
          "Empathy": 5,
          "Strategic": 4,
          "Responsibility": 4,
          "Achiever": 4
        },
        recommendations: [
          "Tu fortaleza en comunicación te hace ideal para proyectos educativos",
          "Usa tu empatía para conectar con comunidades vulnerables",
          "Tu pensamiento estratégico puede ayudar en planificación de proyectos"
        ]
      },
      completedAt: new Date()
    };

    this.assessments.set(demoAssessment.id, demoAssessment);

    // Create demo participation
    const demoParticipation: Participation = {
      id: this.currentParticipationId++,
      userId: demoUser.id,
      opportunityId: 1,
      status: "completed",
      joinedAt: new Date("2024-11-15"),
      completedAt: new Date("2024-11-15"),
      rating: 5,
      feedback: "Excelente experiencia. Los materiales estuvieron muy bien preparados y el impacto en los jóvenes fue notable.",
      hoursCompleted: 4,

    };

    this.participations.set(demoParticipation.id, demoParticipation);

    // Initialize default badges
    const defaultBadges: Badge[] = [
      {
        id: this.currentBadgeId++,
        name: "Eco Warrior",
        description: "Completó 5 proyectos ambientales",
        icon: "🌱",
        criteria: { environmentalProjects: 5 },
        points: 100
      },
      {
        id: this.currentBadgeId++,
        name: "Educator",
        description: "Participó en 3 proyectos educativos",
        icon: "🎓",
        criteria: { educationalProjects: 3 },
        points: 75
      },
      {
        id: this.currentBadgeId++,
        name: "Helper",
        description: "Completó primer proyecto de voluntariado",
        icon: "❤️",
        criteria: { completedProjects: 1 },
        points: 25
      },
      {
        id: this.currentBadgeId++,
        name: "Leader",
        description: "Lideró 2 proyectos de voluntariado",
        icon: "👑",
        criteria: { ledProjects: 2 },
        points: 150
      },
      {
        id: this.currentBadgeId++,
        name: "Expert",
        description: "Acumuló 50+ horas de voluntariado",
        icon: "⭐",
        criteria: { totalHours: 50 },
        points: 200
      },
      {
        id: this.currentBadgeId++,
        name: "Champion",
        description: "Completó 10 proyectos de voluntariado",
        icon: "🏆",
        criteria: { completedProjects: 10 },
        points: 300
      }
    ];

    defaultBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });

    // Initialize sample opportunities
    const defaultOpportunities: VolunteerOpportunity[] = [
      {
        id: this.currentOpportunityId++,
        title: "Taller de Educación Financiera para Jóvenes",
        description: "Comparte tus conocimientos financieros ayudando a jóvenes emprendedores a entender conceptos básicos de finanzas y gestión empresarial.",
        type: "lab",
        location: "Lima",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-15"),
        duration: 4,
        maxVolunteers: 8,
        currentVolunteers: 5,
        skills: ["finanzas", "educacion", "mentoring"],
        sdgs: ["4", "8"],
        isActive: true,
        createdBy: 1,
        createdAt: new Date()
      },
      {
        id: this.currentOpportunityId++,
        title: "Desarrollo de App para ONG Educativa",
        description: "Únete a un proyecto de 3 meses para desarrollar una aplicación que ayude a niños de zonas rurales a acceder a educación digital.",
        type: "mision",
        location: "Remoto",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-03-31"),
        duration: 60,
        maxVolunteers: 4,
        currentVolunteers: 2,
        skills: ["tecnologia", "programacion", "educacion"],
        sdgs: ["4", "9"],
        isActive: true,
        createdBy: 1,
        createdAt: new Date()
      },
      {
        id: this.currentOpportunityId++,
        title: "Campaña de Reforestación Urbana",
        description: "Participa en la plantación de árboles nativos en parques y espacios públicos de Lima para mejorar la calidad del aire.",
        type: "lab",
        location: "Lima",
        startDate: new Date("2024-12-20"),
        endDate: new Date("2024-12-20"),
        duration: 6,
        maxVolunteers: 20,
        currentVolunteers: 12,
        skills: ["medio-ambiente", "trabajo-fisico"],
        sdgs: ["11", "15"],
        isActive: true,
        createdBy: 1,
        createdAt: new Date()
      },
      {
        id: this.currentOpportunityId++,
        title: "Mentoría en Habilidades Blandas",
        description: "Mentoriza a jóvenes profesionales en desarrollo de habilidades de comunicación, liderazgo y trabajo en equipo.",
        type: "mision",
        location: "Lima",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-04-15"),
        duration: 40,
        maxVolunteers: 6,
        currentVolunteers: 3,
        skills: ["mentoring", "comunicacion", "liderazgo"],
        sdgs: ["4", "8"],
        isActive: true,
        createdBy: 1,
        createdAt: new Date()
      }
    ];

    defaultOpportunities.forEach(opportunity => {
      this.opportunities.set(opportunity.id, opportunity);
    });

    // Award demo user their first badge
    const demoBadge: UserBadge = {
      id: this.currentUserBadgeId++,
      userId: demoUser.id,
      badgeId: 3, // Helper badge
      earnedAt: new Date("2024-11-15")
    };

    this.userBadges.set(demoBadge.id, demoBadge);

    // Create demo notification
    const demoNotification: Notification = {
      id: this.currentNotificationId++,
      userId: demoUser.id,
      title: "¡Felicitaciones por tu primera participación!",
      message: "Has completado exitosamente el taller de educación financiera. Tu contribución ha sido valiosa para la comunidad.",
      type: "achievement",
      isRead: false,
      createdAt: new Date("2024-11-15")
    };

    this.notifications.set(demoNotification.id, demoNotification);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "employee",
      isFirstLogin: insertUser.isFirstLogin ?? true,
      profileCompleted: insertUser.profileCompleted ?? false,
      testsCompleted: insertUser.testsCompleted ?? false,
      interests: insertUser.interests || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Assessment methods
  async createAssessment(insertAssessment: InsertAssessment): Promise<PsychologicalAssessment> {
    const id = this.currentAssessmentId++;
    const assessment: PsychologicalAssessment = {
      ...insertAssessment,
      id,
      completedAt: new Date()
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getUserAssessments(userId: number): Promise<PsychologicalAssessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
  }

  async getAssessmentsByType(userId: number, testType: string): Promise<PsychologicalAssessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId && assessment.testType === testType);
  }

  // Opportunity methods
  async getOpportunities(filters: { location?: string; type?: string; isActive?: boolean }): Promise<VolunteerOpportunity[]> {
    let opportunities = Array.from(this.opportunities.values());

    if (filters.location) {
      opportunities = opportunities.filter(opp => 
        opp.location === filters.location || opp.location === 'Remoto'
      );
    }

    if (filters.type) {
      opportunities = opportunities.filter(opp => opp.type === filters.type);
    }

    if (filters.isActive !== undefined) {
      opportunities = opportunities.filter(opp => opp.isActive === filters.isActive);
    }

    return opportunities.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOpportunity(id: number): Promise<VolunteerOpportunity | undefined> {
    return this.opportunities.get(id);
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<VolunteerOpportunity> {
    const id = this.currentOpportunityId++;
    const opportunity: VolunteerOpportunity = {
      ...insertOpportunity,
      id,
      endDate: insertOpportunity.endDate || null,
      currentVolunteers: 0,
      skills: insertOpportunity.skills || [],
      sdgs: insertOpportunity.sdgs || [],
      isActive: insertOpportunity.isActive ?? true,
      createdAt: new Date()
    };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  async updateOpportunity(id: number, updates: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity | undefined> {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) return undefined;

    const updatedOpportunity = {
      ...opportunity,
      ...updates
    };
    this.opportunities.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  async updateOpportunityVolunteers(opportunityId: number): Promise<void> {
    const participations = Array.from(this.participations.values())
      .filter(p => p.opportunityId === opportunityId && p.status !== 'cancelled');
    
    const opportunity = this.opportunities.get(opportunityId);
    if (opportunity) {
      opportunity.currentVolunteers = participations.length;
      this.opportunities.set(opportunityId, opportunity);
    }
  }

  // Participation methods
  async createParticipation(insertParticipation: InsertParticipation): Promise<Participation> {
    const id = this.currentParticipationId++;
    const participation: Participation = {
      ...insertParticipation,
      id,
      status: insertParticipation.status || "applied",
      hoursCompleted: insertParticipation.hoursCompleted || null,
      feedback: insertParticipation.feedback || null,
      rating: insertParticipation.rating || null,
      joinedAt: new Date(),
      completedAt: null
    };
    this.participations.set(id, participation);
    return participation;
  }

  async getUserParticipations(userId: number): Promise<Participation[]> {
    return Array.from(this.participations.values())
      .filter(participation => participation.userId === userId)
      .sort((a, b) => (b.joinedAt?.getTime() || 0) - (a.joinedAt?.getTime() || 0));
  }

  async getOpportunityParticipations(opportunityId: number): Promise<Participation[]> {
    return Array.from(this.participations.values())
      .filter(participation => participation.opportunityId === opportunityId);
  }

  async getAllParticipations(): Promise<Participation[]> {
    return Array.from(this.participations.values());
  }

  async updateParticipation(id: number, updates: Partial<Participation>): Promise<Participation | undefined> {
    const participation = this.participations.get(id);
    if (!participation) return undefined;

    const updatedParticipation = {
      ...participation,
      ...updates
    };
    this.participations.set(id, updatedParticipation);
    return updatedParticipation;
  }

  // Badge methods
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values())
      .filter(userBadge => userBadge.userId === userId)
      .sort((a, b) => (b.earnedAt?.getTime() || 0) - (a.earnedAt?.getTime() || 0));
  }

  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async awardBadge(userId: number, badgeId: number): Promise<UserBadge> {
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = {
      id,
      userId,
      badgeId,
      earnedAt: new Date()
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...notificationData,
      id,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(notificationId, notification);
    }
  }

  // Analytics methods
  async getAdminStats(): Promise<{
    activeVolunteers: number;
    totalHours: number;
    activeProjects: number;
    peopleImpacted: number;
    departmentStats: Array<{ department: string; count: number; hours: number }>;
    sdgStats: Array<{ sdg: string; projects: number; hours: number }>;
  }> {
    const participations = Array.from(this.participations.values());
    const users = Array.from(this.users.values());
    const opportunities = Array.from(this.opportunities.values());

    // Active volunteers (users with at least one participation)
    const activeVolunteers = new Set(participations.map(p => p.userId)).size;

    // Total hours
    const totalHours = participations.reduce((sum, p) => sum + (p.hoursCompleted || 0), 0);

    // Active projects
    const activeProjects = opportunities.filter(opp => opp.isActive).length;

    // Estimated people impacted (mock calculation)
    const peopleImpacted = participations.length * 15; // Assume each participation impacts ~15 people

    // Department stats
    const departmentMap = new Map<string, { count: number; hours: number }>();
    users.forEach(user => {
      const userParticipations = participations.filter(p => p.userId === user.id);
      const userHours = userParticipations.reduce((sum, p) => sum + (p.hoursCompleted || 0), 0);
      
      if (userParticipations.length > 0) {
        const dept = user.department || 'Sin especificar';
        const current = departmentMap.get(dept) || { count: 0, hours: 0 };
        departmentMap.set(dept, {
          count: current.count + 1,
          hours: current.hours + userHours
        });
      }
    });

    const departmentStats = Array.from(departmentMap.entries()).map(([department, stats]) => ({
      department,
      ...stats
    }));

    // SDG stats
    const sdgMap = new Map<string, { projects: number; hours: number }>();
    opportunities.forEach(opp => {
      if (opp.sdgs && opp.sdgs.length > 0) {
        const oppParticipations = participations.filter(p => p.opportunityId === opp.id);
        const oppHours = oppParticipations.reduce((sum, p) => sum + (p.hoursCompleted || 0), 0);
        
        opp.sdgs.forEach(sdg => {
          const current = sdgMap.get(sdg) || { projects: 0, hours: 0 };
          sdgMap.set(sdg, {
            projects: current.projects + 1,
            hours: current.hours + oppHours
          });
        });
      }
    });

    const sdgStats = Array.from(sdgMap.entries()).map(([sdg, stats]) => ({
      sdg,
      ...stats
    }));

    return {
      activeVolunteers,
      totalHours,
      activeProjects,
      peopleImpacted,
      departmentStats,
      sdgStats
    };
  }
}

export const storage = new MemStorage();
